import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = (f) => JSON.parse(readFileSync(new URL(`../${f}`, import.meta.url), 'utf8'));

test('plugin and package versions match', () => {
  assert.equal(read('.claude-plugin/plugin.json').version, read('package.json').version);
});
