# Map

Where things are in the Browser Workflow Claude plugin, and how the parts fit together.

```
Claude (Claude Code / desktop app)
  │  MCP over stdio
  ▼
dist/server.mjs  ── src/server.js: the tools, the widget resource, wait_for_user
  │  one JSON message per line, on a local socket (~/.browser-workflow-2/host.sock; a named pipe on Windows)
  ▼
dist/host.mjs    ── src/host.mjs: the native-messaging host, started by Chrome
  │  Chrome native messaging (4-byte length + JSON)
  ▼
Browser Workflow extension (separate repository): engine, driver, storage, side panel, account
```

## Folders

| Path | What it is |
|---|---|
| `src/server.js` | The MCP server. It provides v1's workflow tools (run by the extension through `tools.call`), the `page_*` inspector tools (`inspect.*`), `extension_status`, `wait_for_user` (with the queue of the user's side-panel actions), the `start` prompt, and the `ui://` widget resource with `_meta.ui` on the tools that show it. |
| `src/host.mjs` | The native-messaging host. It relays between Chrome and every running copy of the MCP server, chunks messages over 1 MiB, answers `host_status` and logs to `~/.browser-workflow-2/logs/host.log`. |
| `src/link.js` | The MCP server's connection to the host: hello, calls, events. It answers "Open Chrome to continue." when nothing answers. |
| `src/register.js` | Registers the host for Chrome when the server starts: the host's files in `~/.browser-workflow-2/host/`, plus the manifest (macOS/Linux folder, Windows registry). |
| `src/ids.js` | The host name, the extension ids allowed to connect, the Web Store address, and the socket path. |
| `src/protocol.ts` | The protocol's types (the extension keeps a copy). |
| `src/tools/` | `extension_status` and `wait_for_user` (also the side-panel chat's way back: its `reply`, the `claude.state` it reports, and the 55 s answer for apps that drop longer calls). |
| `ui/` | The views (Preact), shared by the chat widget and the extension's side panel: `widget.tsx` (navigation, proposal re-reads), `views/*`, `i18n.ts` (English and Vietnamese), `bridge.ts` (the chat host), `panel.tsx` (the side panel's bridge, Home, badge and Account), `views/chat.tsx` (Use with Claude: the strip on Home, the Claude chat screen and its @-mentions; side panel only). |
| `skills/browser-workflow/SKILL.md` | How Claude builds and fixes workflows; `get_step_schema` passes it to the extension. |
| `dist/` | Built and committed: `server.mjs`, `host.mjs`, `widget.html` (one file), and `panel/` (the extension copies it with `npm run sync-ui`). |
| `mcpb/` | The desktop app bundle's manifest and icon (`npm run build:mcpb` → `dist/browser-workflow-2.mcpb`, not committed). |
| `scripts/` | `build.mjs` (esbuild and vite; `--check` compares with `dist/`), `build-mcpb.mjs`. |
| `.claude-plugin/`, `.mcp.json` | The Claude Code plugin and its marketplace (this repository). |
| `test/` | Unit tests (`node --test`). |
| `e2e/` | `flow.test.mjs` (tools through the real host), `views.test.mjs` (widget and side panel on the same proposals and runs). |
| `docs/integrations/extension-protocol.md` | The protocol between the plugin and the extension. |
| `spikes/` | Package S's experiments, kept for reference. |

## Places on the user's computer

| Path | What |
|---|---|
| `~/.browser-workflow-2/host/` | The host and its launcher, copied there by the server (the plugin's own folder changes with every update). |
| `~/.browser-workflow-2/host.sock` | The socket between the host and the MCP servers. |
| `~/.browser-workflow-2/logs/host.log` | The host's log (rolled at 1 MB). |
| Chrome's `NativeMessagingHosts/com.browser_workflow_2.host.json` | Tells Chrome where the host is (Windows: `HKCU\Software\Google\Chrome\NativeMessagingHosts`). |

Workflows, runs, results and the account live in the extension, in Chrome.

## The side-panel chat (Use with Claude)

The side panel opens a new Claude chat with a prompt that asks Claude to listen (`claude://claude.ai/new?q=…` or
`claude://code/new?q=…`; the user presses Send). Claude then calls `wait_for_user` again and again: a message
written in the panel comes back from it, and Claude's answer goes back in its `reply`. The extension knows which
Claude listens (`claude.state`) and sends the panel's messages to that one only (events with `to`, routed by the
host). Details: `docs/integrations/extension-protocol.md` → "The side-panel chat".
