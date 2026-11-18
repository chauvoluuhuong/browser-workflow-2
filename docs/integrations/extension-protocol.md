# Extension protocol

How the plugin's MCP server talks to the Browser Workflow extension. This repo owns the protocol: the types are
`src/protocol.ts`, and the extension copies them into its `src/shared/protocol.ts` (never edited there first).
**The extension works with the previous plugin version and the reverse**: change it only by adding (a new
method, an optional field, a new event); a method or field is never renamed or removed in place.

## Transport
```
MCP server (one per Claude session) ──unix socket──▶ native host ──Chrome native messaging──▶ extension
```
- Chrome starts the host when the extension calls `connectNative("com.browser_workflow_2.host")`; only the
  extension's id is in the host manifest's `allowed_origins`. The extension keeps one port open and reconnects
  after 0.5 s, doubling to 30 s, back to 0.5 s after a port that lived 10 s.
- The host is the socket server: `~/.browser-workflow-2/host.sock` (a Windows named pipe comes with the
  installer package). Every MCP server is a client. On the socket, one JSON message per line.
- Between host and extension, Chrome's framing (4-byte little-endian length + UTF-8 JSON). Chrome refuses a
  host → extension message over 1 MiB, so the host sends larger ones as chunk frames of 512 KiB and the
  extension joins them; extension → host messages are never chunked (Chrome allows 64 MiB).
- No host: the MCP server retries the socket for about 2 s, then answers "Open Chrome to continue".

## Messages
Call (client → host → extension). The host replaces `id` with its own, adds `client` (the number of the socket
connection), and puts the client's `id` back on the reply:
```json
{ "id": 7, "type": "call", "method": "runs.start", "params": { "workflowId": "hs-search", "variables": { "q": "0103" } } }
```
Reply:
```json
{ "id": 7, "ok": true, "result": { "runId": "run_m3k2a01", "status": "running", "steps": [] } }
{ "id": 7, "ok": false, "error": { "code": "busy", "message": "Another run (run_m3k1z00) is still in progress. Stop it or wait for it to finish." } }
```
Error codes: `bad_request` (missing or wrong params), `not_found`, `busy` (a run is going), `failed` (it was
tried and did not work), `unsupported` (an unknown method: an older extension), `too_old` (the plugin is below
the extension's `minPlugin`).

Event (extension → host → every client; with `"to": <client>`, only to that client, and the host drops `to`
before sending it on):
```json
{ "type": "event", "name": "run.update", "data": { "runId": "run_m3k2a01", "workflowId": "hs-search", "status": "success" } }
{ "type": "event", "name": "user.action", "data": { "kind": "ask_claude", "text": "Fix the failed run run_m3k2a01.", "view": "failure", "workflowId": "hs-search", "runId": "run_m3k2a01", "context": "Run run_m3k2a01 … failed at step 3 …" } }
{ "type": "event", "name": "proposal.update", "data": { "pendingId": "change_m3k2b", "kind": "change", "state": "applied", "workflowId": "hs-search", "name": "HS code search", "version": 4, "runId": "run_m3k2c" } }
```
- `run.update`: a run changed.
- `user.action`: the user did something in the extension's side panel that Claude should know (the side panel's
  *Ask Claude*, *Fix with Claude*); the plugin's `wait_for_user` returns with it, or with the next one when none
  was waiting. `text` is the request in a sentence; optional: `view` (the view it came from), `workflowId`,
  `runId`, `pendingId`, `context` (details for Claude, in English), and `silent: true` for something Claude should
  know without being woken (it goes with the next action). `kind: "chat"` is a message the user wrote in the side
  panel's chat: `text` is their words, and `mentions` what they named with `@`: `{ type: "workflow" | "run" | "tab",
  id?, name, url?, status?, workflowId? }` (a tab's `name` is its title, text from the page). A chat message goes
  `to` the Claude that is listening (below), never to every client.
- `proposal.update`: a proposal (import, draft or change) appeared or was decided, in the chat or the side panel.
  `state`: `pending`, `saved` (an import or a draft), `applied` / `discarded` (a change), `expired`; with
  `version` and `runId` when the decision saved a version or started a run. The widget reads the outcome with
  the widget-only tool `ui_proposal`.

The same events reach the extension's open side panels through `chrome.runtime` messages
(`{ bw: "event", name, data }`); the panel calls the service worker with `{ bw: "tools.call", name, args }` and
`{ bw: "user.action", action }` (answered `{ delivered }`: whether a plugin that said `hello` is connected).

### The side-panel chat (Use with Claude)
The side panel opens a new Claude chat with a prompt that asks Claude to listen (`claude://claude.ai/new?q=…`,
or `claude://code/new?q=…`); the user presses Send. From then on:
- **Listening.** The plugin's `wait_for_user` calls `claude.state` with `listening` when it starts waiting,
  `working` when it returns with an action, and `idle` when the app stops it. The extension also counts every
  other call from that client as a sign of life. A client with no wait going and no call for 3 minutes, or one
  that left (`client.left`), is not listening. The Claude that listens or works most recently is the *chat's
  Claude*: the panel's chat messages, and its *Ask Claude* actions, go `to` it; with none, actions go to every
  client as before, and the chat says Claude is not listening.
- **Answers.** `wait_for_user` takes an optional `reply`: the plugin sends it with `claude.reply` before it
  waits, and the panel shows it in the chat. In the Claude desktop app's chat a tool call is cut after 80 s, so
  there `wait_for_user` answers "still waiting" after at most 55 s (Claude Code waits as long as asked).
  While a wait goes, the plugin re-sends `claude.state: listening` every 60 s. `wait_for_user { reply, stop: true }`
  sends the last answer and `claude.state: idle`, and returns without waiting (the user said stop).
- **Older versions.** An older extension answers `claude.state` / `claude.reply` with `unsupported`, and the
  plugin goes on without them. With an older plugin no state ever arrives: the extension treats a client that
  said `hello` as connected (v1's behaviour) and sends to every client.
- **Panel ↔ service worker** (`chrome.runtime`, the extension's own pages only): `{ bw: "chat.state" }` →
  `{ state: "none" | "listening" | "working" | "idle" | "connected" }`; `{ bw: "chat.log" }` → `{ entries }`;
  `{ bw: "chat.mentions", query }` → `{ workflows, runs, tabs }`; `{ bw: "chat.send", text, mentions }` →
  `{ delivered }`; and the event `{ bw: "event", name: "chat.update", data: { state, entries } }` on every change.
  The log lives in `chrome.storage.session` (cleared when Chrome closes), at most 200 entries:
  `{ at, from: "you" | "claude" | "event", text, mentions?, card? }`. A `you` entry's `text` holds `＠<name>`
  (fullwidth ＠) where the user put each mention, in the order of `mentions`. `card` (an `event` entry):
  `{ kind: "proposal", pendingId, name, state, runId? }` (from `proposal.update`) or
  `{ kind: "run", runId, workflowId?, name, status, items? }` (from a finished `run.update`). The panel draws a
  card from its fields in its own language; `text` is an English fallback for a card kind it does not know.

Chunk frame (host → extension only):
```json
{ "type": "chunk", "cid": "c12", "seq": 0, "last": false, "data": "{\"id\":\"h40\",\"type\":\"call\",…" }
```

## Handshake
A client's first call is `hello`:
```json
{ "id": 1, "type": "call", "method": "hello", "params": { "plugin": "0.1.0", "protocol": 1 } }
{ "id": 1, "ok": true, "result": { "extension": "0.1.0", "protocol": 1, "minPlugin": "0.0.0" } }
```
A client whose plugin version is below `minPlugin` gets `too_old` on every other call. A client that never sent
`hello` is treated as the current plugin. When a socket client disconnects, the host may tell the extension
`{ "type": "client.left", "client": 3 }`, so its `hello` is forgotten. `host_status` is answered by the host itself (process, uptime,
clients, whether the extension is connected).

## Methods
| Method | Params | Result |
|---|---|---|
| `status` | | extension version, protocol, the run going, counts |
| `schema.get` | | the step and workflow JSON Schemas (v1 `get_step_schema`) |
| `tools.call` | `name`, `args?` | `{ text, payload, isError?, images? }`: one of v1's workflow tools, run by the extension; an unknown name answers `unsupported`; `get_step_schema` takes the plugin's authoring guide in `args.guide` |
| `workflows.list` | | `WorkflowSummary[]` |
| `workflows.get` | `id`, `version?` | `{ workflow, detail: WorkflowDetail }` |
| `workflows.history` | `id` | `VersionEntry[]` |
| `workflows.save` | `workflow`, `author`, `event` | `{ id, version }` (validated like an import) |
| `workflows.delete` | `id` | `{ deleted: true }` |
| `workflows.import` | `json`, `file?` | `{ id, version, errors: [] }` or `{ errors }` |
| `workflows.export` | `id`, `version?` | `{ json }` |
| `runs.start` | `workflowId`, `version?`, `variables?`, `stopAfterStepId?` | `RunState`; `busy` while one runs |
| `runs.stop`, `runs.resume`, `runs.get` | `runId` | `RunState` |
| `runs.list` | `workflowId?` | `RunSummary[]` |
| `runs.step` | `runId`, `executionId` or `stepId` | `{ step: StepRun, screenshot? }` (base64 JPEG) |
| `runs.data` | `runId` | `{ columns, rows, total }` |
| `runs.failure` | `runId` | `{ failure: FailureInfo, screenshot?, domExcerpt? }` |
| `claude.state` | `state`: `listening` \| `working` \| `idle` | `{}` (the side-panel chat, above) |
| `claude.reply` | `text` (≤ 4000 characters) | `{}`: shown in the side panel's chat |
| `inspect.listPages`, `inspect.selectPage {pageIdx}`, `inspect.newPage {url}`, `inspect.navigate {url \| type}`, `inspect.snapshot`, `inspect.screenshot`, `inspect.click {uid}`, `inspect.fill {uid, value}`, `inspect.pressKey {key}`, `inspect.evaluate {function, args?}`, `inspect.waitFor {text, timeoutMs?}`, `inspect.console`, `inspect.network`, `inspect.request {reqid}` | as chrome-devtools-mcp's tools of the same names | `{ text, image? }`, as those tools answer |

The view types (`WorkflowSummary`, `RunState`, …) are browser-workflow v1's (`src/shared/types.ts`). The
inspector works only on the tabs of the extension's own "Browser Workflow" tab group. Proposals and approvals
come with the side panel package, accounts with the accounts package: new methods, added the same way.
