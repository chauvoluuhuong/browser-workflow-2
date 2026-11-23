// The MCP server's link to the host: hello on connect, retrying ~2 s before "Open Chrome to continue.", calls by
// id, refusals as LinkError (too_old), events to listeners. A fake host on a temp socket.
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync } from 'node:fs';
import { createServer } from 'node:net';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';
import { Link, LinkError, OPEN_CHROME } from '../src/link.js';

function fakeHost(sock, answer) {
  const seen = [];
  const conns = [];
  const server = createServer((c) => {
    conns.push(c);
    let t = '';
    c.setEncoding('utf8');
    c.on('data', (d) => {
      t += d;
      let k;
      while ((k = t.indexOf('\n')) >= 0) {
        const m = JSON.parse(t.slice(0, k));
        t = t.slice(k + 1);
        seen.push(m);
        const r = answer(m);
        if (r !== undefined) c.write(`${JSON.stringify({ id: m.id, ...r })}\n`);
      }
    });
  });
  return new Promise((res) => server.listen(sock, () => res({ server, seen, emit: (name, data) => conns.forEach((c) => c.write(`${JSON.stringify({ type: 'event', name, data })}\n`)), close: () => new Promise((r) => { conns.forEach((c) => c.destroy()); server.close(() => r()); }) })));
}

test('says hello (with the features this plugin understands: wake), then calls; refusals come back as LinkError; events reach listeners', async () => {
  const dir = mkdtempSync(join(tmpdir(), 'bw2-link-'));
  const host = await fakeHost(join(dir, 's'), (m) => (m.method === 'hello' ? { ok: true, result: { extension: '0.1.0', protocol: 1, minPlugin: '0.0.0' } }
    : m.method === 'status' ? { ok: true, result: { up: true } } : { ok: false, error: { code: 'busy', message: 'A run goes.' } }));
  const link = new Link({ plugin: '0.2.0', socket: join(dir, 's') });
  try {
    assert.deepEqual(await link.call('status'), { up: true });
    assert.deepEqual(host.seen[0], { id: 1, type: 'call', method: 'hello', params: { plugin: '0.2.0', protocol: 1, features: ['wake'] } });
    assert.equal(link.extension.extension, '0.1.0');
    await assert.rejects(link.call('runs.start', {}), (e) => e instanceof LinkError && e.code === 'busy' && e.message === 'A run goes.');
    const got = [];
    link.on('user.action', (d) => got.push(d));
    host.emit('user.action', { kind: 'approve', text: 'Approved.' });
    await new Promise((r) => setTimeout(r, 50));
    assert.deepEqual(got, [{ kind: 'approve', text: 'Approved.' }]);
  } finally {
    link.close();
    await host.close();
    rmSync(dir, { recursive: true, force: true });
  }
});

test('answers "Open Chrome to continue." after ~2 s when no host is there, and connects when one comes within that time', async () => {
  const dir = mkdtempSync(join(tmpdir(), 'bw2-link-'));
  try {
    const t0 = Date.now();
    const gone = new Link({ plugin: '0.2.0', socket: join(dir, 'none'), retryMs: 600 });
    await assert.rejects(gone.call('status'), (e) => e instanceof LinkError && e.code === 'not_running' && e.message === OPEN_CHROME);
    const took = Date.now() - t0;
    assert.ok(took >= 550 && took < 1500, `took ${took} ms`);

    const late = new Link({ plugin: '0.2.0', socket: join(dir, 'late'), retryMs: 2000 });
    const pending = late.call('status');
    await new Promise((r) => setTimeout(r, 400));
    const host = await fakeHost(join(dir, 'late'), (m) => ({ ok: true, result: m.method }));
    assert.equal(await pending, 'status');
    // The host goes away: the call in flight ends with OPEN_CHROME, not a hang.
    const hang = late.call('never');
    await host.close();
    await assert.rejects(hang, (e) => e.message === OPEN_CHROME);
    late.close();
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test('an extension that finds this plugin too old: too_old on the call', async () => {
  const dir = mkdtempSync(join(tmpdir(), 'bw2-link-'));
  const host = await fakeHost(join(dir, 's'), (m) => (m.method === 'hello' ? { ok: true, result: { extension: '2.0.0', protocol: 1, minPlugin: '1.0.0' } } : { ok: false, error: { code: 'too_old', message: 'Update the plugin.' } }));
  const link = new Link({ plugin: '0.2.0', socket: join(dir, 's') });
  try {
    await assert.rejects(link.call('status'), (e) => e.code === 'too_old');
    assert.equal(link.tooOld.code, 'too_old');
  } finally {
    link.close();
    await host.close();
    rmSync(dir, { recursive: true, force: true });
  }
});
