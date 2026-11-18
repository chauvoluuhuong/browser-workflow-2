#!/usr/bin/env node
// Package S spike — plain socket client for the host (no Claude needed). Also imported by mcp/server.js.
//   node spikes/client.mjs ping [n]              round trips through host → extension → back; median/p95
//   node spikes/client.mjs status                host status + extension status
//   node spikes/client.mjs echo <bytes> [raw]    <bytes> of payload to the extension and back (raw: no chunking)
//   node spikes/client.mjs event <text>          queue an event for every waiting wait_for_user
//   node spikes/client.mjs call <type> [json]    any request, e.g. call spike_open '{"url":"https://example.com"}'
//   node spikes/client.mjs mcp <n>               start n MCP servers (mcp/server.js) at once and ping through each
import { spawn } from 'node:child_process';
import { connect } from 'node:net';
import { homedir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

export const SOCK = process.env.BW2_SPIKE_SOCK || join(homedir(), '.browser-workflow-2', 'host.sock');
export const NOT_RUNNING = 'Open Chrome to continue.';

/** One connection to the host. request() answers {ok,result|error}; onEvent() gets pushed events. */
export class HostClient {
  constructor(sock = SOCK) { this.sock = sock; this.conn = null; this.pending = new Map(); this.next = 1; this.listeners = new Set(); }
  async open() {
    if (this.conn && !this.conn.destroyed) return;
    this.conn = await new Promise((res, rej) => {
      const c = connect(this.sock);
      c.once('connect', () => res(c));
      c.once('error', (e) => rej(Object.assign(new Error(NOT_RUNNING), { cause: e })));
    });
    let text = '';
    this.conn.setEncoding('utf8');
    this.conn.on('data', (d) => {
      text += d;
      let i;
      while ((i = text.indexOf('\n')) >= 0) {
        const msg = JSON.parse(text.slice(0, i));
        text = text.slice(i + 1);
        if (msg.type === 'event') { for (const l of this.listeners) l(msg); continue; }
        const p = this.pending.get(msg.id);
        if (p) { this.pending.delete(msg.id); p(msg); }
      }
    });
    const fail = () => {
      for (const p of this.pending.values()) p({ ok: false, error: NOT_RUNNING });
      this.pending.clear();
      this.conn = null;
    };
    this.conn.on('close', fail);
    this.conn.on('error', () => {});
  }
  async request(type, params = {}, timeoutMs = 120_000) {
    try { await this.open(); } catch (e) { return { ok: false, error: e.message, code: e.cause?.code }; }
    const id = this.next++;
    return new Promise((res) => {
      const timer = setTimeout(() => { this.pending.delete(id); res({ ok: false, error: `no answer in ${timeoutMs} ms` }); }, timeoutMs);
      this.pending.set(id, (m) => { clearTimeout(timer); res(m); });
      this.conn.write(JSON.stringify({ id, type, ...params }) + '\n');
    });
  }
  onEvent(fn) { this.listeners.add(fn); return () => this.listeners.delete(fn); }
  close() { this.conn?.destroy(); this.conn = null; }
}

const pct = (xs, p) => { const s = [...xs].sort((a, b) => a - b); return s[Math.min(s.length - 1, Math.floor((p / 100) * s.length))]; };

async function main() {
  const [cmd, ...rest] = process.argv.slice(2);
  const c = new HostClient();
  const out = (x) => console.log(JSON.stringify(x, null, 1));
  if (cmd === 'ping') {
    const n = Number(rest[0] ?? 100);
    const times = [];
    let first;
    for (let i = 0; i < n; i++) {
      const t = performance.now();
      const r = await c.request('ping');
      times.push(performance.now() - t);
      if (!r.ok) { out({ i, ms: +(performance.now() - t).toFixed(2), ...r }); process.exit(1); }
      first ??= r.result;
    }
    out({ n, medianMs: +pct(times, 50).toFixed(2), p95Ms: +pct(times, 95).toFixed(2), maxMs: +Math.max(...times).toFixed(2), firstIncludesConnect: +times[0].toFixed(2), extension: first });
  } else if (cmd === 'status') {
    out({ host: await c.request('host_status'), extension: await c.request('status') });
  } else if (cmd === 'echo') {
    const bytes = Number(rest[0]);
    const raw = rest[1] === 'raw';
    const data = 'x'.repeat(bytes);
    const t = performance.now();
    const r = await c.request('echo', { data, raw, size: bytes }, 60_000);
    const ms = performance.now() - t;
    out({ sentBytes: bytes, raw, ms: +ms.toFixed(1), ok: r.ok, error: r.error, gotBack: r.result?.data?.length, extensionSaw: r.result?.received });
  } else if (cmd === 'event') {
    out(await c.request('event', { text: rest.join(' ') || 'hello from client.mjs' }));
  } else if (cmd === 'call') {
    const t = performance.now();
    const r = await c.request(rest[0], rest[1] ? JSON.parse(rest[1]) : {}, 180_000);
    out({ ms: +(performance.now() - t).toFixed(1), ...r });
  } else if (cmd === 'mcp') {
    out(await mcpPing(Number(rest[0] ?? 2)));
  } else {
    console.log('usage: client.mjs ping [n] | status | echo <bytes> [raw] | event <text> | call <type> [json] | mcp <n>');
  }
  c.close();
}

/** Starts n copies of mcp/server.js over stdio (like n Claude sessions) and calls `ping` in all at once. */
async function mcpPing(n) {
  const server = join(dirname(fileURLToPath(import.meta.url)), 'mcp', 'server.js');
  const one = (k) => new Promise((resolve) => {
    const p = spawn(process.execPath, [server], { stdio: ['pipe', 'pipe', 'ignore'] });
    let text = '';
    const waits = new Map();
    p.stdout.setEncoding('utf8');
    p.stdout.on('data', (d) => {
      text += d;
      let i;
      while ((i = text.indexOf('\n')) >= 0) { const m = JSON.parse(text.slice(0, i)); text = text.slice(i + 1); waits.get(m.id)?.(m); }
    });
    const rpc = (id, method, params) => new Promise((r) => { waits.set(id, r); p.stdin.write(JSON.stringify({ jsonrpc: '2.0', id, method, params }) + '\n'); });
    (async () => {
      await rpc(1, 'initialize', { protocolVersion: '2025-06-18', capabilities: {}, clientInfo: { name: `spike-${k}`, version: '0' } });
      p.stdin.write(JSON.stringify({ jsonrpc: '2.0', method: 'notifications/initialized' }) + '\n');
      const t = performance.now();
      const r = await rpc(2, 'tools/call', { name: 'ping', arguments: {} });
      resolve({ server: k, pid: p.pid, ms: +(performance.now() - t).toFixed(1), text: r.result?.content?.[0]?.text ?? JSON.stringify(r.error) });
      p.kill();
    })();
  });
  return Promise.all(Array.from({ length: n }, (_, k) => one(k + 1)));
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) main();
