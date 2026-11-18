# Package S spikes (throwaway)

Plain JavaScript, Node ≥ 22, no build. Product code never imports anything here; later packages copy from it.
The root `npm test` does not pick these files up. The extension half is in the private repo
`browser-workflow-2-extension`, folder `spikes/extension/`. Evidence and verdicts are in the workspace:
`docs/spikes/2026-11-18-package-s.md`.

- Extension id (from the throwaway public key in `spikes/extension/manifest.json`; the private key was never kept):
  **`iickjddceohcklpodfeekggppkcilbgj`**
- Native host name: `com.browser_workflow_2.host`; socket: `~/.browser-workflow-2/host.sock`
- Browser: Playwright's Chrome for Testing (branded Chrome no longer loads `--load-extension`):
  `~/Library/Caches/ms-playwright/chromium-1254/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing`

## Setup (once)

```sh
cd spikes && npm install && cd ..
P=/tmp/bw2-spike-profile                     # any empty folder: the browser profile
node spikes/host/install-host.mjs --user-data-dir $P --log /tmp/bw2-host.log
CFT="$HOME/Library/Caches/ms-playwright/chromium-1254/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing"
"$CFT" --user-data-dir=$P --load-extension=$HOME/browser-workflow-2-extension/spikes/extension \
  --no-first-run --no-default-browser-check https://example.org/ &
```

The extension connects to the host as soon as its service worker starts. Remove everything afterwards with
`node spikes/host/install-host.mjs --uninstall --user-data-dir $P`.

## S1 — channel

```sh
node spikes/client.mjs ping 100          # median / p95 round trip
node spikes/client.mjs mcp 2             # two MCP servers (spikes/mcp/server.js) at once, ping through each
node spikes/client.mjs echo 3000000      # 3 MB host → extension (chunked) → back
node spikes/client.mjs call big '{"size":3000000}'   # 3 MB extension → host
node spikes/client.mjs echo 3000000 raw  # same without chunking: breaks the port (over Chrome's 1 MiB limit)
node spikes/client.mjs call host_status  # host pid → kill -9 it; the extension reconnects
node spikes/client.mjs status            # extension: worker start time, connects, disconnect history
```

Idle: `node spikes/client.mjs status`, send nothing for 6+ minutes, then `ping` and `status` again (same
`swStartedAt` and `connects` = the worker stayed alive). Chrome closed: quit the browser, then `ping` answers
`Open Chrome to continue.` at once.

## S2 — waiting

See `spikes/s2/README.md`: `spikes/s2/run-claude-code.sh <minutes> <true|false> <log dir>` for Claude Code, and the
steps the owner follows in the Claude desktop app. `node spikes/client.mjs event <text>` ends a waiting call early.

## S3 — background tabs

Browser running as in Setup, with another tab active and the window in front:

```sh
node spikes/s3/run.mjs off   # without the anti-throttling settings
node spikes/s3/run.mjs on    # with focus emulation + lifecycle active + autoDiscardable:false
```

Each step prints one JSON line (open, snapshot, timers + lazy content, click, type, screenshot, popup, close).
Single commands: `node spikes/client.mjs call spike_open '{"url":"https://example.com"}'`, then `spike_snapshot`,
`spike_click`, `spike_type`, `spike_screenshot`, `spike_timers`, `spike_popup`, `spike_close` with `{"tabId":…}`.

## S4 — sign-in

```sh
~/app-hub/node_modules/.bin/tsx spikes/s4/local-hub.mjs        # prints HUB http://localhost:<port>; in-memory, never the live hub
# start the browser as in Setup, adding --remote-debugging-port=9333 (only to click the popup's button)
node spikes/client.mjs call spike_signin '{"hub":"http://localhost:<port>"}' &   # register → launchWebAuthFlow → /token
node spikes/s4/click-continue.mjs 9333 /tmp/authorize.png      # presses "Continue" in the sign-in window
```

The answer shows the redirect caught, the state check and the token's shape (never the token itself).
