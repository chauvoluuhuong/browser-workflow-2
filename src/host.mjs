#!/usr/bin/env node
// The native-messaging host (docs/integrations/extension-protocol.md). Chrome starts it when the Browser
// Workflow extension calls connectNative("com.browser_workflow_2.host"); it ends when Chrome closes the port.
//   Chrome side: stdin/stdout, 4-byte little-endian length + UTF-8 JSON. Host → extension messages over 1 MiB
//     are sent as chunk frames of 512 KiB ({ type: "chunk", cid, seq, last, data }); the other way needs none.
//   Socket side: the host is the server (a unix socket in ~/.browser-workflow-2, a named pipe on Windows); every
//     copy of the plugin's MCP server is a client; one JSON message per line.
// A client's call `{ id, type: "call", method, params }` goes to the extension with a host-wide id and `client`
// (the connection's number), and the reply comes back with the client's id. `host_status` is answered here.
// Events from the extension go to every client (or, with `to`, to that one); when a client leaves, the extension is told (`client.left`).
// Logs: ~/.browser-workflow-2/logs/host.log, rolled over at 1 MB (one old file kept). Nothing is logged of what
// the messages carry, only their method and size.
import { appendFileSync, mkdirSync, renameSync, statSync, unlinkSync } from 'node:fs';
import { createServer } from 'node:net';
import { join } from 'node:path';
import { bw2Home, socketPath } from './ids.js';

const HOME = bw2Home();
const SOCK = socketPath();
const LOG_DIR = join(HOME, 'logs');
const LOG = join(LOG_DIR, 'host.log');
const LOG_MAX = 1024 * 1024;
const MAX_TO_CHROME = 1024 * 1024;
const CHUNK = 512 * 1024;
const startedAt = Date.now();

function log(line) {
  try {
    mkdirSync(LOG_DIR, { recursive: true });
    try { if (statSync(LOG).size > LOG_MAX) renameSync(LOG, `${LOG}.1`); } catch { /* no log yet */ }
    appendFileSync(LOG, `${new Date().toISOString()} [host ${process.pid}] ${line}\n`);
  } catch { /* logging never stops the host */ }
}

// ---------- Chrome side ----------

function frame(obj) {
  const body = Buffer.from(JSON.stringify(obj), 'utf8');
  const head = Buffer.alloc(4);
  head.writeUInt32LE(body.length, 0);
  process.stdout.write(Buffer.concat([head, body]));
}

let chunkSeq = 0;
function toExtension(msg) {
  const text = JSON.stringify(msg);
  if (Buffer.byteLength(text) <= MAX_TO_CHROME - 64) return frame(msg);
  const cid = `c${++chunkSeq}`;
  const parts = Math.ceil(text.length / CHUNK);
  for (let i = 0; i < parts; i++) frame({ type: 'chunk', cid, seq: i, last: i === parts - 1, data: text.slice(i * CHUNK, (i + 1) * CHUNK) });
  log(`sent ${Buffer.byteLength(text)} bytes in ${parts} chunks`);
}

let input = Buffer.alloc(0);
process.stdin.on('data', (d) => {
  input = Buffer.concat([input, d]);
  while (input.length >= 4) {
    const len = input.readUInt32LE(0);
    if (input.length < 4 + len) break;
    const body = input.subarray(4, 4 + len).toString('utf8');
    input = input.subarray(4 + len);
    try {
      fromExtension(JSON.parse(body), len);
    } catch (e) {
      log(`unreadable message from the extension: ${e.message}`);
    }
  }
});
process.stdin.on('end', () => { log('Chrome closed the port'); shutdown(0); });

// ---------- socket side ----------

/** @type {Map<number, import('node:net').Socket>} */
const clients = new Map();
/** host id → the client and its own id */
const pending = new Map();
let nextClient = 1;
let nextId = 1;

function send(client, obj) {
  if (!client.destroyed) client.write(`${JSON.stringify(obj)}\n`);
}

function fromExtension(msg, bytes) {
  if (msg.type === 'event') {
    // `to`: only that client (the side panel's chat goes to the Claude that listens). Dropped before sending.
    if (typeof msg.to === 'number') {
      const { to, ...event } = msg;
      const c = clients.get(to);
      if (c) send(c, event);
      else log(`event ${msg.name} for client ${to}, which is gone`);
      return;
    }
    for (const c of clients.values()) send(c, msg);
    return;
  }
  const p = pending.get(msg.id);
  if (!p) return;
  pending.delete(msg.id);
  if (bytes > 256 * 1024) log(`reply of ${bytes} bytes to ${p.method}`);
  send(p.client, { ...msg, id: p.id });
}

function fromClient(client, n, msg) {
  if (msg?.type !== 'call' || typeof msg.method !== 'string') {
    send(client, { id: msg?.id ?? null, ok: false, error: { code: 'bad_request', message: 'Expected { id, type: "call", method, params }.' } });
    return;
  }
  if (msg.method === 'host_status') {
    send(client, { id: msg.id, ok: true, result: { pid: process.pid, uptimeMs: Date.now() - startedAt, clients: clients.size, extensionConnected: true } });
    return;
  }
  const hostId = `h${nextId++}`;
  pending.set(hostId, { client, id: msg.id, method: msg.method });
  toExtension({ ...msg, id: hostId, client: n });
}

try { if (process.platform !== 'win32') unlinkSync(SOCK); } catch { /* none left over */ }
mkdirSync(HOME, { recursive: true });
const server = createServer((client) => {
  const n = nextClient++;
  clients.set(n, client);
  log(`client ${n} connected (${clients.size} now)`);
  let text = '';
  client.setEncoding('utf8');
  client.on('data', (d) => {
    text += d;
    let i;
    while ((i = text.indexOf('\n')) >= 0) {
      const line = text.slice(0, i);
      text = text.slice(i + 1);
      if (!line.trim()) continue;
      let msg;
      try { msg = JSON.parse(line); } catch { log(`client ${n} sent a line that is not JSON`); continue; }
      fromClient(client, n, msg);
    }
  });
  client.on('close', () => {
    clients.delete(n);
    for (const [k, p] of pending) if (p.client === client) pending.delete(k);
    toExtension({ type: 'client.left', client: n });
    log(`client ${n} left (${clients.size} now)`);
  });
  client.on('error', () => {});
});
server.on('error', (e) => { log(`socket error: ${e.message}`); shutdown(1); });
server.listen(SOCK, () => log(`started for ${process.argv[2] ?? 'unknown caller'}, listening`));

function shutdown(code) {
  try { server.close(); } catch { /* not listening */ }
  try { if (process.platform !== 'win32') unlinkSync(SOCK); } catch { /* gone */ }
  for (const c of clients.values()) c.destroy();
  process.exit(code);
}
process.on('SIGTERM', () => shutdown(0));
process.on('SIGINT', () => shutdown(0));
