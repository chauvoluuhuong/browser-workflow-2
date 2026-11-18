// The host registration: files under ~/.browser-workflow-2/host, the manifest in Chrome's folder for each OS (the
// registry on Windows, with `reg` mocked), written only when they change. Everything in a temp HOME.
import assert from 'node:assert/strict';
import { existsSync, mkdtempSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';
import { DEV_EXTENSION_ID, HOST_NAME } from '../src/ids.js';
import { launcherScript, manifestDirs, registerHost } from '../src/register.js';

const temp = () => mkdtempSync(join(tmpdir(), 'bw2-register-'));
const hostSource = (dir) => { const f = join(dir, 'host-src.mjs'); writeFileSync(f, '// the host\n'); return f; };

test('macOS: host, launcher and manifest, written once', () => {
  const home = temp();
  try {
    const env = {};
    const r = registerHost({ hostSource: hostSource(home), platform: 'darwin', home, env, nodePath: '/opt/node/bin/node' });
    const dir = join(home, '.browser-workflow-2', 'host');
    const manifestFile = join(home, 'Library', 'Application Support', 'Google', 'Chrome', 'NativeMessagingHosts', `${HOST_NAME}.json`);
    assert.deepEqual(r.changed.sort(), [join(dir, 'host.mjs'), join(dir, 'host.sh'), manifestFile].sort());
    const manifest = JSON.parse(readFileSync(manifestFile, 'utf8'));
    assert.deepEqual(manifest, { name: HOST_NAME, description: manifest.description, path: join(dir, 'host.sh'), type: 'stdio', allowed_origins: [`chrome-extension://${DEV_EXTENSION_ID}/`] });
    const launcher = readFileSync(join(dir, 'host.sh'), 'utf8');
    assert.match(launcher, /^#!\/bin\/sh/);
    assert.match(launcher, /NODE='\/opt\/node\/bin\/node'/);
    assert.match(launcher, /PATH="\$PATH:\/opt\/homebrew\/bin:\/usr\/local\/bin"/);
    assert.match(launcher, new RegExp(`export BW2_HOME='${join(home, '.browser-workflow-2')}'`));
    assert.equal(statSync(join(dir, 'host.sh')).mode & 0o111, 0o111);
    // Nothing changed: nothing written. A moved node: only the launcher.
    assert.deepEqual(registerHost({ hostSource: hostSource(home), platform: 'darwin', home, env, nodePath: '/opt/node/bin/node' }).changed, []);
    assert.deepEqual(registerHost({ hostSource: hostSource(home), platform: 'darwin', home, env, nodePath: '/usr/local/bin/node' }).changed, [join(dir, 'host.sh')]);
  } finally {
    rmSync(home, { recursive: true, force: true });
  }
});

test('Linux: the manifest in ~/.config/google-chrome', () => {
  const home = temp();
  try {
    registerHost({ hostSource: hostSource(home), platform: 'linux', home, env: {}, nodePath: '/usr/bin/node' });
    assert.ok(existsSync(join(home, '.config', 'google-chrome', 'NativeMessagingHosts', `${HOST_NAME}.json`)));
    assert.deepEqual(manifestDirs('linux', '/h', {}), ['/h/.config/google-chrome/NativeMessagingHosts']);
  } finally {
    rmSync(home, { recursive: true, force: true });
  }
});

test('Windows: the manifest next to the host and its path in the registry, set only when needed', () => {
  const home = temp();
  try {
    const calls = [];
    let value = '';
    const reg = (args) => {
      calls.push(args);
      if (args[0] === 'query') { if (!value) throw new Error('not found'); return `(Default) REG_SZ ${value}`; }
      value = args[6];
      return '';
    };
    const r = registerHost({ hostSource: hostSource(home), platform: 'win32', home, env: {}, nodePath: 'C:\\node\\node.exe', reg });
    const dir = join(home, '.browser-workflow-2', 'host');
    const file = join(dir, `${HOST_NAME}.json`);
    assert.ok(existsSync(file));
    assert.equal(JSON.parse(readFileSync(file, 'utf8')).path, join(dir, 'host.bat'));
    assert.deepEqual(calls.at(-1), ['add', `HKCU\\Software\\Google\\Chrome\\NativeMessagingHosts\\${HOST_NAME}`, '/ve', '/t', 'REG_SZ', '/d', file, '/f']);
    assert.ok(r.changed.includes(`HKCU\\Software\\Google\\Chrome\\NativeMessagingHosts\\${HOST_NAME}`));
    assert.match(readFileSync(join(dir, 'host.bat'), 'utf8'), /^@echo off\r\n/);
    calls.length = 0;
    assert.deepEqual(registerHost({ hostSource: hostSource(home), platform: 'win32', home, env: {}, nodePath: 'C:\\node\\node.exe', reg }).changed, []);
    assert.deepEqual(calls.map((c) => c[0]), ['query']);
  } finally {
    rmSync(home, { recursive: true, force: true });
  }
});

test('BW2_HOST_DIRS replaces Chrome\'s folder (tests register into a profile, never the real one)', () => {
  const home = temp();
  try {
    const profileDir = join(home, 'profile', 'NativeMessagingHosts');
    registerHost({ hostSource: hostSource(home), platform: 'darwin', home, env: { BW2_HOST_DIRS: profileDir } });
    assert.ok(existsSync(join(profileDir, `${HOST_NAME}.json`)));
    assert.ok(!existsSync(join(home, 'Library')));
  } finally {
    rmSync(home, { recursive: true, force: true });
  }
});

test('the launcher quotes paths for sh and cmd', () => {
  assert.match(launcherScript('linux', '/n/node', '/h/host.mjs', '/h'), /exec "\$NODE" '\/h\/host\.mjs' "\$@"/);
  assert.match(launcherScript('win32', 'C:\\n\\node.exe', 'C:\\h\\host.mjs', 'C:\\h'), /if exist "C:\\n\\node\.exe" \("C:\\n\\node\.exe" "C:\\h\\host\.mjs" %\*\) else \(node "C:\\h\\host\.mjs" %\*\)/);
});
