// The built host (dist/host.mjs) driven as Chrome drives it: framed messages on stdin/stdout, clients on its
// socket. Calls are forwarded with a host id and `client`, replies go back with the client's id, events reach every
// client, host_status is answered by the host, a leaving client is reported, and large messages are chunked.
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdtempSync, rmSync } from 'node:fs';
import { connect } from 'node:net';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';

const HOST = new URL('../dist/host.mjs', import.meta.url).pathname;

function startHost() {
  const home = mkdtempSync(join(tmpdir(), 'bw2-host-'));
  const proc = spawn(process.execPath, [HOST, 'chrome-extension://test/'], { env: { ...process.env, BW2_HOME: home, BW2_SOCKET: join(home, 'h.sock') }, stdio: ['pipe', 'pipe', 'inherit'] });
  const fromHost = [];
  let buf = Buffer.alloc(0);
  proc.stdout.on('data', (d) => {
    buf = Buffer.concat([buf, d]);
    while (buf.length >= 4 && buf.length >= 4 + buf.readUInt32LE(0)) {
      const len = buf.readUInt32LE(0);
      fromHost.push(JSON.parse(buf.subarray(4, 4 + len).toString('utf8')));
      buf = buf.subarray(4 + len);
    }
  });
  const toHost = (obj) => { const b = Buffer.from(JSON.stringify(obj)); const h = Buffer.alloc(4); h.writeUInt32LE(b.length); proc.stdin.write(Buffer.concat([h, b])); };
  return { home, proc, fromHost, toHost, sock: join(home, 'h.sock') };
}

async function client(sock) {
  for (let i = 0; i < 50; i++) {
    try {
      const c = await new Promise((res, rej) => { const s = connect(sock); s.once('connect', () => res(s)); s.once('error', rej); });
      const lines = [];
      let t = '';
      c.setEncoding('utf8');
      c.on('data', (d) => { t += d; let k; while ((k = t.indexOf('\n')) >= 0) { lines.push(JSON.parse(t.slice(0, k))); t = t.slice(k + 1); } });
      return { c, lines, send: (o) => c.write(`${JSON.stringify(o)}\n`) };
    } catch { await new Promise((r) => setTimeout(r, 50)); }
  }
  throw new Error('no socket');
}
const until = async (fn) => { for (let i = 0; i < 100; i++) { const v = fn(); if (v) return v; await new Promise((r) => setTimeout(r, 20)); } throw new Error('timed out'); };

test('forwards calls, replies, events, host_status, client.left and chunks', async () => {
  const h = startHost();
  try {
    const a = await client(h.sock);
    const b = await client(h.sock);
    a.send({ id: 7, type: 'call', method: 'status', params: {} });
    b.send({ id: 7, type: 'call', method: 'status', params: {} });
    const [ca, cb] = await until(() => (h.fromHost.length >= 2 ? h.fromHost.slice(0, 2) : undefined));
    assert.notEqual(ca.id, cb.id);
    assert.notEqual(ca.client, cb.client);
    assert.equal(ca.method, 'status');
    h.toHost({ id: cb.id, ok: true, result: 'for b' });
    h.toHost({ id: ca.id, ok: true, result: 'for a' });
    await until(() => a.lines.length && b.lines.length);
    assert.deepEqual(a.lines[0], { id: 7, ok: true, result: 'for a' });
    assert.deepEqual(b.lines[0], { id: 7, ok: true, result: 'for b' });

    h.toHost({ type: 'event', name: 'user.action', data: { kind: 'approve', text: 'ok' } });
    await until(() => a.lines.length === 2 && b.lines.length === 2);
    assert.deepEqual(a.lines[1], { type: 'event', name: 'user.action', data: { kind: 'approve', text: 'ok' } });

    a.send({ id: 1, type: 'call', method: 'host_status' });
    const st = await until(() => a.lines[2]);
    assert.equal(st.ok, true);
    assert.equal(st.result.clients, 2);

    a.send({ id: 2, type: 'call', method: 'workflows.import', params: { json: 'x'.repeat(1_500_000) } });
    const chunks = await until(() => { const c = h.fromHost.filter((m) => m.type === 'chunk'); return c.at(-1)?.last ? c : undefined; });
    assert.equal(chunks.length, 3);
    const joined = JSON.parse(chunks.map((c) => c.data).join(''));
    assert.equal(joined.params.json.length, 1_500_000);
    assert.equal(joined.client, ca.client);

    b.c.destroy();
    const left = await until(() => h.fromHost.find((m) => m.type === 'client.left'));
    assert.equal(left.client, cb.client);
    a.send({ id: 3, type: 'nope' });
    assert.equal((await until(() => a.lines[3])).error.code, 'bad_request');
    a.c.destroy();
  } finally {
    h.proc.stdin.end();
    await new Promise((r) => h.proc.once('exit', r));
    rmSync(h.home, { recursive: true, force: true });
  }
});
