#!/usr/bin/env node
// Package S spike — native-messaging host (throwaway; never imported by product code).
// Chrome starts this process when the extension calls connectNative('com.browser_workflow_2.host').
// stdin/stdout carry Chrome's framing: 4-byte little-endian length + UTF-8 JSON.
// The host is the socket SERVER: every copy of the plugin's MCP server (one per Claude session) is a
// client on ~/.browser-workflow-2/host.sock, newline-delimited JSON {id, type, ...} / {id, ok, result|error}.
// Requests from socket clients get a host-wide id before they go to the extension, so replies from the
// extension find their way back to the right client even when two clients use the same ids.
// Host → Chrome is limited to 1 MB per message: bigger messages are split into {type:'chunk'} frames
// (unless the request asks for {raw:true}, which is how the spike measures what happens without chunking).
// argv[2] is the caller origin (chrome-extension://<id>/) on macOS/Linux.
import { appendFileSync, mkdirSync, unlinkSync } from 'node:fs';
import { createServer } from 'node:net';
import { homedir } from 'node:os';
import { join } from 'node:path';

const DIR = process.env.BW2_SPIKE_DIR || join(homedir(), '.browser-workflow-2');
const SOCK = process.env.BW2_SPIKE_SOCK || join(DIR, 'host.sock');
const LOG = process.env.BW2_SPIKE_LOG || join(DIR, 'host.log');
const MAX_TO_CHROME = 1024 * 1024; // Chrome's documented limit for host → extension
const CHUNK = 512 * 1024; // characters of JSON text per chunk frame (well under the limit after framing)

mkdirSync(DIR, { recursive: true });
const t0 = Date.now();
const log = (...a) => {
  try { appendFileSync(LOG, `${new Date().toISOString()} [host ${process.pid}] ${a.join(' ')}\n`); } catch {}
};
log(`start origin=${process.argv[2] ?? '-'} argv=${JSON.stringify(process.argv.slice(2))} sock=${SOCK} (${Buffer.byteLength(SOCK)} bytes, macOS max 104)`);

// ---- Chrome side -------------------------------------------------------------------------------
function writeFrame(obj) {
  const body = Buffer.from(JSON.stringify(obj), 'utf8');
  const head = Buffer.alloc(4);
  head.writeUInt32LE(body.length, 0);
  process.stdout.write(Buffer.concat([head, body]));
  return body.length;
}
let chunkSeq = 0;
function toExtension(msg) {
  const text = JSON.stringify(msg);
  if (msg.raw || Buffer.byteLength(text) <= MAX_TO_CHROME - 64) {
    const n = writeFrame(msg);
    if (n > MAX_TO_CHROME) log(`sent RAW frame of ${n} bytes (over the 1 MB limit) id=${msg.id}`);
    return;
  }
  const cid = `c${++chunkSeq}`;
  const parts = Math.ceil(text.length / CHUNK);
  for (let i = 0; i < parts; i++) writeFrame({ type: 'chunk', cid, seq: i, last: i === parts - 1, data: text.slice(i * CHUNK, (i + 1) * CHUNK) });
  log(`sent ${Buffer.byteLength(text)} bytes as ${parts} chunk frames id=${msg.id}`);
}

let buf = Buffer.alloc(0);
const assembling = new Map(); // cid -> string[] (extension → host never needs chunks, but accept them)
process.stdin.on('data', (d) => {
  buf = Buffer.concat([buf, d]);
  while (buf.length >= 4) {
    const len = buf.readUInt32LE(0);
    if (buf.length < 4 + len) break;
    const body = buf.subarray(4, 4 + len).toString('utf8');
    buf = buf.subarray(4 + len);
    let msg;
    try { msg = JSON.parse(body); } catch (e) { log(`bad frame from chrome: ${e.message}`); continue; }
    if (msg.type === 'chunk') {
      const parts = assembling.get(msg.cid) ?? [];
      parts[msg.seq] = msg.data;
      assembling.set(msg.cid, parts);
      if (!msg.last) continue;
      assembling.delete(msg.cid);
      msg = JSON.parse(parts.join(''));
    }
    fromExtension(msg, len);
  }
});
process.stdin.on('end', () => { log('stdin closed (Chrome closed the port or quit) → exit'); shutdown(0); });

// ---- Socket side -------------------------------------------------------------------------------
const clients = new Set();
const pending = new Map(); // hostId -> { client, id, type, at }
let nextId = 1;

function fromExtension(msg, bytes) {
  if (msg.type === 'log') { log(`ext: ${msg.text}`); return; }
  if (msg.type === 'event') { // a side-panel event (spike: also client.mjs event); broadcast to every client
    log(`event from extension → ${clients.size} clients: ${String(msg.text).slice(0, 80)}`);
    for (const c of clients) send(c, { type: 'event', text: msg.text, at: Date.now() });
    return;
  }
  const p = pending.get(msg.id);
  if (!p) { log(`reply for unknown id ${msg.id}`); return; }
  pending.delete(msg.id);
  if (bytes > 100_000) log(`big reply ${bytes} bytes for ${p.type}`);
  send(p.client, { ...msg, id: p.id });
}

function send(client, obj) {
  if (!client.destroyed) client.write(JSON.stringify(obj) + '\n');
}

function fromClient(client, msg) {
  if (msg.type === 'host_status') {
    send(client, { id: msg.id, ok: true, result: { pid: process.pid, uptimeMs: Date.now() - t0, clients: clients.size, pending: pending.size, sock: SOCK, origin: process.argv[2] } });
    return;
  }
  if (msg.type === 'event') { // spike stand-in for the side panel: a client queues an event for the others
    for (const c of clients) if (c !== client) send(c, { type: 'event', text: msg.text, at: Date.now() });
    send(client, { id: msg.id, ok: true, result: { deliveredTo: clients.size - 1 } });
    log(`event from client → ${clients.size - 1} clients`);
    return;
  }
  const hostId = `h${nextId++}`;
  pending.set(hostId, { client, id: msg.id, type: msg.type, at: Date.now() });
  toExtension({ ...msg, id: hostId });
}

try { unlinkSync(SOCK); } catch {}
const server = createServer((client) => {
  clients.add(client);
  log(`client connected (${clients.size} now)`);
  let text = '';
  client.setEncoding('utf8');
  client.on('data', (d) => {
    text += d;
    let i;
    while ((i = text.indexOf('\n')) >= 0) {
      const line = text.slice(0, i);
      text = text.slice(i + 1);
      if (!line.trim()) continue;
      try { fromClient(client, JSON.parse(line)); } catch (e) { log(`bad line from client: ${e.message}`); }
    }
  });
  client.on('close', () => {
    clients.delete(client);
    for (const [k, p] of pending) if (p.client === client) pending.delete(k);
    log(`client left (${clients.size} now)`);
  });
  client.on('error', () => {});
});
server.listen(SOCK, () => log(`listening on ${SOCK}`));
server.on('error', (e) => { log(`socket error ${e.message}`); shutdown(1); });

function shutdown(code) {
  try { server.close(); } catch {}
  try { unlinkSync(SOCK); } catch {}
  for (const c of clients) c.destroy();
  process.exit(code);
}
process.on('SIGTERM', () => { log('SIGTERM'); shutdown(0); });
process.on('SIGINT', () => { log('SIGINT'); shutdown(0); });
