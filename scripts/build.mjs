// Bundles the plugin into dist/ (committed: a marketplace install is a git checkout with no `npm install`):
//   dist/server.mjs   the MCP server, with its dependencies
//   dist/host.mjs     the native-messaging host, one file (copied to ~/.browser-workflow-2/host/ at start)
//   dist/widget.html  the chat widget: the views in one self-contained HTML file (the MCP App resource)
//   dist/panel/       the same views for the extension's side panel: panel.js (ES module) + panel.css
//   node scripts/build.mjs           builds
//   node scripts/build.mjs --check   builds in memory and fails when dist/ differs (CI: dist/ must be src/'s build)
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { build } from 'esbuild';
import { build as viteBuild } from 'vite';

const root = new URL('../', import.meta.url);
const check = process.argv.includes('--check');
const outputs = [
  { entry: 'src/server.js', out: 'dist/server.mjs' },
  { entry: 'src/host.mjs', out: 'dist/host.mjs' },
];

let stale = [];
/** Writes one built file, or (--check) notes it when dist/ holds something else. */
function emit(out, text) {
  const file = new URL(out, root);
  if (check) {
    let now = '';
    try { now = readFileSync(file, 'utf8'); } catch { /* missing */ }
    if (now !== text) stale.push(out);
  } else {
    mkdirSync(new URL('.', file), { recursive: true });
    writeFileSync(file, text);
    console.log(`built ${out} (${Math.round(text.length / 1024)} KB)`);
  }
}

for (const o of outputs) {
  const r = await build({
    entryPoints: [new URL(o.entry, root).pathname],
    bundle: true,
    platform: 'node',
    format: 'esm',
    target: 'node22',
    write: false,
    legalComments: 'eof', // keep the licence notices of the bundled packages
    // Some bundled CommonJS code calls require(): give ESM a require of its own.
    banner: { js: "import { createRequire as __bw2Require } from 'node:module'; const require = __bw2Require(import.meta.url);" },
    logLevel: 'warning',
  });
  emit(o.out, r.outputFiles[0].text);
}

// The views (ui/), built by vite into a temporary folder, then placed in dist/.
const views = [
  { mode: 'widget', files: { 'index.html': 'dist/widget.html' } },
  { mode: 'panel', files: { 'panel.js': 'dist/panel/panel.js', 'panel.css': 'dist/panel/panel.css' } },
];
const tmp = mkdtempSync(join(tmpdir(), 'bw2-ui-'));
try {
  for (const v of views) {
    const outDir = join(tmp, v.mode);
    await viteBuild({ configFile: new URL('ui/vite.config.ts', root).pathname, mode: v.mode, logLevel: 'warn', build: { outDir, emptyOutDir: true } });
    for (const [from, out] of Object.entries(v.files)) emit(out, readFileSync(join(outDir, from), 'utf8'));
  }
} finally {
  rmSync(tmp, { recursive: true, force: true });
}
if (check && stale.length) {
  console.error(`dist/ is not the build of src/: ${stale.join(', ')}. Run \`npm run build\` and commit dist/.`);
  process.exit(1);
}
if (check) console.log('dist/ is the build of src/');
