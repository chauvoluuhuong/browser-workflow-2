# S2 — how long may `wait_for_user` block?

`wait_for_user({ minutes, progress })` (in `spikes/mcp/server.js`) blocks until an event arrives on the host
socket (`node spikes/client.mjs event <text>`) or until `minutes` pass, then returns. With `progress: true`
it sends an MCP progress notification every 30 s, but only if the caller's request carried a
`progressToken`. Every start, 30-second beat (with or without a token) and end goes to the server's log, so
the log shows whether the app gave a progress token and when the call stopped.

Chrome does not need to be open for S2: without the host the tool simply waits on its timer.

## Claude Code (scripted)

From the repo root, once `npm install` has run in `spikes/`:

```sh
spikes/s2/run-claude-code.sh 1 true  /tmp/s2    # minutes, progress, log dir
spikes/s2/run-claude-code.sh 15 false /tmp/s2
```

Each run is `claude -p … --mcp-config spikes/s2/mcp.json --strict-mcp-config --allowedTools mcp__spike__wait_for_user`
and prints the exit code, elapsed seconds and Claude's answer; `/tmp/s2/mcp-<min>m-<progress>.log` is the
server's log.

## Claude desktop app (chat, not the Code tab) — the owner runs this

1. Claude desktop app → Settings → Developer → Edit Config. Add the `bw2-spike` entry from
   `claude_desktop_config.snippet.json` (fill in the three absolute paths) inside `mcpServers`, save, quit and reopen the app.
2. In a new chat (not the Code tab), send each prompt below in its own new chat and note the clock time when you send it:
   - `Call the bw2-spike tool wait_for_user with minutes=1 and progress=false, then tell me its exact answer.`
   - same with `minutes=5 and progress=false`
   - same with `minutes=15 and progress=false`
   - same three with `progress=true`
3. For each one note: did the tool answer (and after how long), or did the chat show an error (copy its text)?
4. Afterwards remove the `bw2-spike` entry again and restart the app.

The server's log `~/.browser-workflow-2/mcp-desktop.log` records each call's start, a line every 30 s, whether
the app sent a progress token, and the end (`timeout`, `event`, or `cancelled by the client` if the app gave up),
so the times can be read from there too.
