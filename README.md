# Browser Workflow (Claude plugin)

**Tell Claude what you do on a website once. It saves it as a workflow that runs fast in your own Chrome, in the background, while you keep working.**

This is the Claude part of Browser Workflow 2. It works with the **Browser Workflow** Chrome extension, which runs
the workflows in your Chrome, in a tab group of its own. You talk to Claude; the extension does the clicking.

- Ask Claude for a workflow ("collect the newest article times on this news site"). Claude looks at the site
  through the extension and proposes one; you approve it in the chat or in the extension's side panel.
- Run it any time from the side panel, even with Claude closed. Results stay in Chrome on your computer.
- When a site changes and a step breaks, click **Fix with Claude**: Claude reads what went wrong and proposes a fix.

Status: in development. The Chrome Web Store listing is coming; until then the extension is loaded by hand.

## Install (for now)

You need Chrome 157 or newer, Node.js 22 or newer, and Claude Code or the Claude desktop app.

1. **The extension.** Clone the extension's repository (private for now), build it for development and load it
   into Chrome:
   ```bash
   npm install && node scripts/build.mjs --dev
   ```
   In Chrome, open `chrome://extensions`, turn on **Developer mode**, click **Load unpacked** and choose its `dist`
   folder. Its ID must be `iickjddceohcklpodfeekggppkcilbgj`: this plugin only lets that ID connect.
2. **The plugin.** Clone this repository, then:
   ```bash
   npm install && npm run build
   ```
   - Claude Code:
     ```bash
     claude plugin marketplace add /path/to/browser-workflow-2
     ```
     ```bash
     claude plugin install browser-workflow-2@browser-workflow-2
     ```
     Or, once it is published, from GitHub: `/plugin install browser-workflow-2 --marketplace chauvoluuhuong/browser-workflow-2`.
   - Claude desktop app: `npm run build:mcpb`, then open `dist/browser-workflow-2.mcpb` and click **Install**.
3. Restart Claude, open Chrome, and ask Claude: **"Is Browser Workflow ready?"**

The plugin tells Chrome how to reach it the first time it starts (a small file in Chrome's settings folder and the
folder `~/.browser-workflow-2`). Once the extension is on the Web Store, one command will do all of this.

### Example prompts

- "Create a workflow that opens https://vnexpress.net/, goes to the Xe tab and gets me each article's published time, with its title and link."
- "Show my workflows." / "Run the VnExpress one." / "Why did the last run fail?"
- "Make a workflow that saves the Form W-9 PDF from irs.gov into my Downloads, in a folder named forms."

## Contributing

```bash
npm install
```
```bash
npm run check
```
```bash
npm run e2e
```

- `npm run check`: the unit tests, and `dist/` must be the build of `src/` and `ui/`. `dist/` is committed, since a marketplace install runs it as it is.
- `npm run e2e`: the plugin through its real host, with the extension in Chrome for Testing. It needs the extension's repository next to this one, or `BW2_EXTENSION_DIR`.
- `npm run build`: after changing `src/` or `ui/`.
- `npm run build:mcpb`: the desktop app file.

Where things are: [docs/map.md](docs/map.md). How the plugin and the extension talk:
[docs/integrations/extension-protocol.md](docs/integrations/extension-protocol.md). This repository owns that
protocol: change it here first, backward-compatibly, then in the extension. An agent working here reads
`AGENTS.md` first, if it has one locally.

Git flow:
- Work on `feature/*` or `fix/*` branches from `dev`, with small commits ([Conventional Commits](https://www.conventionalcommits.org/)).
- Open a pull request into `dev`; CI runs `npm run check`.
- `main` gets releases, tagged.

This repository is public: no secrets, no personal paths, and none of the extension's engine code.

## License

[AGPL-3.0](LICENSE)
