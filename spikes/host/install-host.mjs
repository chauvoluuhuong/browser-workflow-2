#!/usr/bin/env node
// Package S spike — installs the native-messaging host manifest for the spike extension (macOS).
//   node spikes/host/install-host.mjs [--user-data-dir <dir>] [--only browser|udd] [--log <file>]
//   node spikes/host/install-host.mjs --uninstall [--user-data-dir <dir>]
// Writes ~/.browser-workflow-2/spike-launcher.sh (Chrome starts hosts with a minimal environment and no
// shell PATH, so the manifest's `path` is this launcher, which execs the absolute node path) and
// com.browser_workflow_2.host.json into every browser's NativeMessagingHosts folder and, with
// --user-data-dir, into <user-data-dir>/NativeMessagingHosts too. --only picks one of the two places, to
// find out which one the browser reads.
import { chmodSync, existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export const HOST_NAME = 'com.browser_workflow_2.host';
export const EXTENSION_ID = 'iickjddceohcklpodfeekggppkcilbgj'; // from the throwaway key in the extension's manifest.json

const args = process.argv.slice(2);
const opt = (name) => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : undefined; };
const uninstall = args.includes('--uninstall');
const udd = opt('--user-data-dir');
const only = opt('--only');
const logFile = opt('--log');

const appSupport = join(homedir(), 'Library', 'Application Support');
const browserDirs = [
  join(appSupport, 'Google', 'Chrome', 'NativeMessagingHosts'),
  join(appSupport, 'Chromium', 'NativeMessagingHosts'),
  join(appSupport, 'Google', 'Chrome for Testing', 'NativeMessagingHosts'),
];
const dirs = [];
if (only !== 'udd') dirs.push(...browserDirs);
if (udd && only !== 'browser') dirs.push(join(resolve(udd), 'NativeMessagingHosts'));

const home = join(homedir(), '.browser-workflow-2');
const launcher = join(home, 'spike-launcher.sh');
const hostJs = join(dirname(fileURLToPath(import.meta.url)), 'host.js');

if (uninstall) {
  for (const d of [...browserDirs, ...(udd ? [join(resolve(udd), 'NativeMessagingHosts')] : [])]) {
    const f = join(d, `${HOST_NAME}.json`);
    if (existsSync(f)) { rmSync(f); console.log(`removed ${f}`); }
  }
  if (existsSync(launcher)) { rmSync(launcher); console.log(`removed ${launcher}`); }
  process.exit(0);
}

mkdirSync(home, { recursive: true });
const env = logFile ? `BW2_SPIKE_LOG="${resolve(logFile)}" ` : '';
writeFileSync(launcher, `#!/bin/sh\n${env}exec "${process.execPath}" "${hostJs}" "$@"\n`);
chmodSync(launcher, 0o755);
console.log(`launcher ${launcher} → ${process.execPath} ${hostJs}`);

const manifest = {
  name: HOST_NAME,
  description: 'Browser Workflow 2 spike host',
  path: launcher,
  type: 'stdio',
  allowed_origins: [`chrome-extension://${EXTENSION_ID}/`],
};
for (const d of dirs) {
  mkdirSync(d, { recursive: true });
  writeFileSync(join(d, `${HOST_NAME}.json`), JSON.stringify(manifest, null, 2) + '\n');
  console.log(`manifest ${join(d, `${HOST_NAME}.json`)}`);
}
