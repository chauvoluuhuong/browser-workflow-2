// The plugin registers its own native host each time its MCP server starts (no installer step): Chrome finds
// the host through a manifest, which names a launcher script, which runs the host with the node that started
// this server. Files go to a stable place, ~/.browser-workflow-2/host/ (the plugin's own folder changes with
// every update), and are written only when their content changed.
//   macOS    manifest in ~/Library/Application Support/Google/Chrome/NativeMessagingHosts/
//   Linux    manifest in ~/.config/google-chrome/NativeMessagingHosts/
//   Windows  manifest next to the host; HKCU\Software\Google\Chrome\NativeMessagingHosts\<host> = its path (reg add)
// BW2_HOST_DIRS (a list separated by the path delimiter) replaces Chrome's folder: the e2e suite registers into a
// test profile's own NativeMessagingHosts folder, never the real one.
import { execFileSync } from 'node:child_process';
import { chmodSync, copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { delimiter, join } from 'node:path';
import { allowedOrigins, bw2Home, HOST_NAME } from './ids.js';

/** Chrome's folders for host manifests on this OS (none on Windows: the registry points at the manifest). */
export function manifestDirs(platform = process.platform, home = homedir(), env = process.env) {
  if (env.BW2_HOST_DIRS) return env.BW2_HOST_DIRS.split(delimiter).filter(Boolean);
  if (platform === 'darwin') return [join(home, 'Library', 'Application Support', 'Google', 'Chrome', 'NativeMessagingHosts')];
  if (platform === 'win32') return [];
  return [join(home, '.config', 'google-chrome', 'NativeMessagingHosts')];
}

/** The launcher script: runs the host with `node` (the one that started the plugin, else node on PATH). */
export function launcherScript(platform, nodePath, hostPath, home) {
  if (platform === 'win32') {
    return [
      '@echo off',
      `set "BW2_HOME=${home}"`,
      `if exist "${nodePath}" ("${nodePath}" "${hostPath}" %*) else (node "${hostPath}" %*)`,
      '',
    ].join('\r\n');
  }
  return [
    '#!/bin/sh',
    '# Started by Chrome for the Browser Workflow extension. Written by the Browser Workflow plugin.',
    `export BW2_HOME='${home}'`,
    `NODE='${nodePath}'`,
    '[ -x "$NODE" ] || { PATH="$PATH:/opt/homebrew/bin:/usr/local/bin"; NODE=node; }',
    `exec "$NODE" '${hostPath}' "$@"`,
    '',
  ].join('\n');
}

/** Writes a file only when its content changed; answers whether it wrote. */
function write(file, content, mode) {
  if (existsSync(file) && readFileSync(file, 'utf8') === content) return false;
  writeFileSync(file, content);
  if (mode) chmodSync(file, mode);
  return true;
}

/**
 * Registers the host. `hostSource` is the built host (dist/host.mjs). Answers what it wrote, for the log.
 * @param {{ hostSource: string, platform?: string, home?: string, env?: NodeJS.ProcessEnv, nodePath?: string,
 *   reg?: (args: string[]) => string | void }} o
 */
export function registerHost(o) {
  const platform = o.platform ?? process.platform;
  const env = o.env ?? process.env;
  const home = o.home ?? homedir();
  const base = env.BW2_HOME || join(home, '.browser-workflow-2');
  const dir = join(base, 'host');
  mkdirSync(dir, { recursive: true });
  const changed = [];

  const hostPath = join(dir, 'host.mjs');
  const source = readFileSync(o.hostSource, 'utf8');
  if (write(hostPath, source)) changed.push(hostPath);

  const launcher = join(dir, platform === 'win32' ? 'host.bat' : 'host.sh');
  if (write(launcher, launcherScript(platform, o.nodePath ?? process.execPath, hostPath, base), platform === 'win32' ? undefined : 0o755)) changed.push(launcher);

  const manifest = `${JSON.stringify({
    name: HOST_NAME,
    description: 'Browser Workflow: connects the Browser Workflow extension in Chrome with Claude.',
    path: launcher,
    type: 'stdio',
    allowed_origins: allowedOrigins(),
  }, null, 2)}\n`;

  if (platform === 'win32' && !env.BW2_HOST_DIRS) {
    const file = join(dir, `${HOST_NAME}.json`);
    const wrote = write(file, manifest);
    if (wrote) changed.push(file);
    const key = `HKCU\\Software\\Google\\Chrome\\NativeMessagingHosts\\${HOST_NAME}`;
    const reg = o.reg ?? ((args) => execFileSync('reg', args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }));
    // Only when the value is missing or names another file.
    let now = '';
    try { now = String(reg(['query', key, '/ve']) ?? ''); } catch { /* not there yet */ }
    if (wrote || !now.includes(file)) {
      reg(['add', key, '/ve', '/t', 'REG_SZ', '/d', file, '/f']);
      changed.push(key);
    }
  } else {
    for (const d of manifestDirs(platform, home, env)) {
      mkdirSync(d, { recursive: true });
      const file = join(d, `${HOST_NAME}.json`);
      if (write(file, manifest)) changed.push(file);
    }
  }
  return { hostPath, launcher, changed };
}

/** For the logs: where the plugin's files are. */
export const filesHome = () => bw2Home();
