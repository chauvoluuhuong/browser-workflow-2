// The Claude desktop app bundle's manifest (mcpb/manifest.json): valid for the mcpb tool once the version is filled
// in, pointing at the built server, with the v2 privacy page. `npm run build:mcpb` makes the bundle itself.
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { copyFileSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';
import { manifestText } from '../scripts/build-mcpb.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));

test('the desktop app bundle\'s manifest is valid and names the built server', () => {
  const m = JSON.parse(manifestText());
  assert.equal(m.name, 'browser-workflow-2');
  assert.equal(m.display_name, 'Browser Workflow');
  assert.equal(m.version, JSON.parse(readFileSync(join(root, 'package.json'), 'utf8')).version);
  assert.equal(m.server.entry_point, 'dist/server.mjs');
  assert.deepEqual(m.server.mcp_config.args, ['${__dirname}/dist/server.mjs']);
  assert.equal(m.server.mcp_config.env, undefined);
  assert.equal(m.tools_generated, true);
  assert.deepEqual(m.privacy_policies, ['https://browser-workflow.web.app/v2/privacy']);
  assert.equal(m.compatibility.runtimes.node, '>=22.0.0');
  const dir = mkdtempSync(join(tmpdir(), 'bw2-mcpb-'));
  try {
    writeFileSync(join(dir, 'manifest.json'), manifestText());
    copyFileSync(join(root, 'mcpb', 'icon.png'), join(dir, 'icon.png'));
    const out = execFileSync(join(root, 'node_modules', '.bin', 'mcpb'), ['validate', join(dir, 'manifest.json')], { encoding: 'utf8' });
    assert.match(out, /Manifest schema validation passes!/);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
