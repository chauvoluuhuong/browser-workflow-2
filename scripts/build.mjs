// Bundles the plugin into dist/ (committed: a marketplace install is a git checkout with no `npm install`):
//   dist/server.mjs   the MCP server, with its dependencies
//   dist/host.mjs     the native-messaging host, one file (copied to ~/.browser-workflow-2/host/ at start)
//   node scripts/build.mjs           builds
//   node scripts/build.mjs --check   builds in memory and fails when dist/ differs (CI: dist/ must be src/'s build)
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { build } from 'esbuild';

const root = new URL('../', import.meta.url);
const check = process.argv.includes('--check');
const outputs = [
  { entry: 'src/server.js', out: 'dist/server.mjs' },
  { entry: 'src/host.mjs', out: 'dist/host.mjs' },
];

let stale = [];
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
  const text = r.outputFiles[0].text;
  const file = new URL(o.out, root);
  if (check) {
    let now = '';
    try { now = readFileSync(file, 'utf8'); } catch { /* missing */ }
    if (now !== text) stale.push(o.out);
  } else {
    mkdirSync(new URL('dist/', root), { recursive: true });
    writeFileSync(file, text);
    console.log(`built ${o.out} (${Math.round(text.length / 1024)} KB)`);
  }
}
if (check && stale.length) {
  console.error(`dist/ is not the build of src/: ${stale.join(', ')}. Run \`npm run build\` and commit dist/.`);
  process.exit(1);
}
if (check) console.log('dist/ is the build of src/');
