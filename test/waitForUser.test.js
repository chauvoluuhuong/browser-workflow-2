// wait_for_user: answers on a user.action event, says "still waiting" when the time is up, and sends progress
// while waiting when the call has a progress token.
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { LinkError, OPEN_CHROME } from '../src/link.js';
import { waitForUser } from '../src/tools/waitForUser.js';

function fakeLink() {
  const listeners = new Set();
  return { open: async () => {}, on: (name, fn) => { listeners.add(fn); return () => listeners.delete(fn); }, emit: (d) => listeners.forEach((f) => f(d)), get count() { return listeners.size; } };
}

test('answers with what the user did', async () => {
  const link = fakeLink();
  const p = waitForUser(link, { minutes: 5 }, {});
  await new Promise((r) => setTimeout(r, 20));
  link.emit({ kind: 'approve', text: 'The user approved the change.', pendingId: 'change_1' });
  assert.equal((await p).text, 'The user acted in the Browser Workflow side panel: The user approved the change. (approve; pendingId change_1).');
  assert.equal(link.count, 0);
});

test('says to call again when the time is up, and caps the wait at 30 minutes', async () => {
  const r = await waitForUser(fakeLink(), { minutes: 0.002 }, {});
  assert.match(r.text, /^Still waiting: .*Call wait_for_user again/);
});

test('sends progress while waiting when the call has a progress token', async () => {
  const sent = [];
  const link = fakeLink();
  const ctx = { mcpReq: { _meta: { progressToken: 'p1' }, notify: async (n) => { sent.push(n); } } };
  const p = waitForUser(link, { minutes: 1 }, ctx, { progressEveryMs: 20 });
  await new Promise((r) => setTimeout(r, 90));
  link.emit({ kind: 'ask', text: 'Asked Claude.' });
  await p;
  assert.ok(sent.length >= 2, `sent ${sent.length}`);
  assert.equal(sent[0].method, 'notifications/progress');
  assert.equal(sent[0].params.progressToken, 'p1');
  assert.equal(sent[0].params.total, 60);
});

test('Chrome closed: "Open Chrome to continue." at once', async () => {
  const r = await waitForUser({ open: async () => { throw new LinkError('not_running', OPEN_CHROME); }, on: () => () => {} }, {}, {});
  assert.deepEqual(r, { text: OPEN_CHROME, isError: true });
});
