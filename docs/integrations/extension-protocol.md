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

Event (extension → host → every client):
```json
{ "type": "event", "name": "run.update", "data": { "runId": "run_m3k2a01", "workflowId": "hs-search", "status": "success" } }
```

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
| `inspect.listPages`, `inspect.selectPage {pageIdx}`, `inspect.newPage {url}`, `inspect.navigate {url \| type}`, `inspect.snapshot`, `inspect.screenshot`, `inspect.click {uid}`, `inspect.fill {uid, value}`, `inspect.pressKey {key}`, `inspect.evaluate {function, args?}`, `inspect.waitFor {text, timeoutMs?}`, `inspect.console`, `inspect.network`, `inspect.request {reqid}` | as chrome-devtools-mcp's tools of the same names | `{ text, image? }`, as those tools answer |

The view types (`WorkflowSummary`, `RunState`, …) are browser-workflow v1's (`src/shared/types.ts`). The
inspector works only on the tabs of the extension's own "Browser Workflow" tab group. Proposals and approvals
come with the side panel package, accounts with the accounts package: new methods, added the same way.
