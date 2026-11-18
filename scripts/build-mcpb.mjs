#!/usr/bin/env node
// Builds the plugin for the Claude desktop app: dist/browser-workflow-2.mcpb, a file the user opens with Claude to
// install it (double-click, then Install). It holds the built plugin (dist/server.mjs with its dependencies inside,
// dist/host.mjs, dist/widget.html), the skill, package.json (the version) and the licence: the desktop app runs it
// with its own Node.js, and nothing else is installed. Build dist/ first (`npm run build`).
//   npm run build:mcpb
// The .mcpb is a build output (git-ignored). The manifest is mcpb/manifest.json, with the version filled in.
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const version = JSON.parse(readFileSync(path.join(root, 'package.json'), 'utf8')).version;
const stage = path.join(root, 'dist', 'mcpb');
const out = path.join(root, 'dist', 'browser-workflow-2.mcpb');
const mcpb = path.join(root, 'node_modules', '.bin', process.platform === 'win32' ? 'mcpb.cmd' : 'mcpb');
const run = (args) => execFileSync(mcpb, args, { cwd: root, stdio: 'pipe', encoding: 'utf8', shell: process.platform === 'win32' });

/** The manifest with this version. */
export function manifestText() {
  return readFileSync(path.join(root, 'mcpb', 'manifest.json'), 'utf8').replaceAll('__VERSION__', version);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  for (const f of ['dist/server.mjs', 'dist/host.mjs', 'dist/widget.html']) {
    if (!existsSync(path.join(root, f))) { console.error(`${f} is missing: run \`npm run build\` first.`); process.exit(1); }
  }
  console.log(`Building Browser Workflow ${version} for the Claude desktop app`);
  rmSync(stage, { recursive: true, force: true });
  mkdirSync(path.join(stage, 'dist'), { recursive: true });
  for (const f of ['dist/server.mjs', 'dist/host.mjs', 'dist/widget.html', 'skills', 'package.json', 'LICENSE']) cpSync(path.join(root, f), path.join(stage, f), { recursive: true });
  cpSync(path.join(root, 'mcpb', 'icon.png'), path.join(stage, 'icon.png'));
  writeFileSync(path.join(stage, 'manifest.json'), manifestText());
  console.log('  validate');
  run(['validate', path.join(stage, 'manifest.json')]);
  console.log('  pack');
  rmSync(out, { force: true });
  run(['pack', stage, out]);
  rmSync(stage, { recursive: true, force: true });
  const bytes = readFileSync(out);
  console.log(`\n✓ ${path.relative(root, out)}  ${(statSync(out).size / 1024 / 1024).toFixed(1)} MB  sha256 ${createHash('sha256').update(bytes).digest('hex').slice(0, 16)}…`);
}
