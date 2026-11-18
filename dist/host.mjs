#!/usr/bin/env node
import { createRequire as __bw2Require } from 'node:module'; const require = __bw2Require(import.meta.url);

// src/host.mjs
import { appendFileSync, mkdirSync, renameSync, statSync, unlinkSync } from "node:fs";
import { createServer } from "node:net";
import { join as join2 } from "node:path";

// src/ids.js
import { homedir, userInfo } from "node:os";
import { join } from "node:path";
var STORE_EXTENSION_ID = "";
var WEB_STORE_URL = STORE_EXTENSION_ID ? `https://chromewebstore.google.com/detail/${STORE_EXTENSION_ID}` : "https://chromewebstore.google.com/search/Browser%20Workflow";
function bw2Home(env = process.env) {
  return env.BW2_HOME || join(homedir(), ".browser-workflow-2");
}
function socketPath(env = process.env, platform = process.platform) {
  if (env.BW2_SOCKET) return env.BW2_SOCKET;
  if (platform === "win32") return `\\\\.\\pipe\\browser-workflow-2-${userInfo().username}`;
  return join(bw2Home(env), "host.sock");
}

// src/host.mjs
var HOME = bw2Home();
var SOCK = socketPath();
var LOG_DIR = join2(HOME, "logs");
var LOG = join2(LOG_DIR, "host.log");
var LOG_MAX = 1024 * 1024;
var MAX_TO_CHROME = 1024 * 1024;
var CHUNK = 512 * 1024;
var startedAt = Date.now();
function log(line) {
  try {
    mkdirSync(LOG_DIR, { recursive: true });
    try {
      if (statSync(LOG).size > LOG_MAX) renameSync(LOG, `${LOG}.1`);
    } catch {
    }
    appendFileSync(LOG, `${(/* @__PURE__ */ new Date()).toISOString()} [host ${process.pid}] ${line}
`);
  } catch {
  }
}
function frame(obj) {
  const body = Buffer.from(JSON.stringify(obj), "utf8");
  const head = Buffer.alloc(4);
  head.writeUInt32LE(body.length, 0);
  process.stdout.write(Buffer.concat([head, body]));
}
var chunkSeq = 0;
function toExtension(msg) {
  const text = JSON.stringify(msg);
  if (Buffer.byteLength(text) <= MAX_TO_CHROME - 64) return frame(msg);
  const cid = `c${++chunkSeq}`;
  const parts = Math.ceil(text.length / CHUNK);
  for (let i = 0; i < parts; i++) frame({ type: "chunk", cid, seq: i, last: i === parts - 1, data: text.slice(i * CHUNK, (i + 1) * CHUNK) });
  log(`sent ${Buffer.byteLength(text)} bytes in ${parts} chunks`);
}
var input = Buffer.alloc(0);
process.stdin.on("data", (d) => {
  input = Buffer.concat([input, d]);
  while (input.length >= 4) {
    const len = input.readUInt32LE(0);
    if (input.length < 4 + len) break;
    const body = input.subarray(4, 4 + len).toString("utf8");
    input = input.subarray(4 + len);
    try {
      fromExtension(JSON.parse(body), len);
    } catch (e) {
      log(`unreadable message from the extension: ${e.message}`);
    }
  }
});
process.stdin.on("end", () => {
  log("Chrome closed the port");
  shutdown(0);
});
var clients = /* @__PURE__ */ new Map();
var pending = /* @__PURE__ */ new Map();
var nextClient = 1;
var nextId = 1;
function send(client, obj) {
  if (!client.destroyed) client.write(`${JSON.stringify(obj)}
`);
}
function fromExtension(msg, bytes) {
  if (msg.type === "event") {
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
  if (msg?.type !== "call" || typeof msg.method !== "string") {
    send(client, { id: msg?.id ?? null, ok: false, error: { code: "bad_request", message: 'Expected { id, type: "call", method, params }.' } });
    return;
  }
  if (msg.method === "host_status") {
    send(client, { id: msg.id, ok: true, result: { pid: process.pid, uptimeMs: Date.now() - startedAt, clients: clients.size, extensionConnected: true } });
    return;
  }
  const hostId = `h${nextId++}`;
  pending.set(hostId, { client, id: msg.id, method: msg.method });
  toExtension({ ...msg, id: hostId, client: n });
}
try {
  if (process.platform !== "win32") unlinkSync(SOCK);
} catch {
}
mkdirSync(HOME, { recursive: true });
var server = createServer((client) => {
  const n = nextClient++;
  clients.set(n, client);
  log(`client ${n} connected (${clients.size} now)`);
  let text = "";
  client.setEncoding("utf8");
  client.on("data", (d) => {
    text += d;
    let i;
    while ((i = text.indexOf("\n")) >= 0) {
      const line = text.slice(0, i);
      text = text.slice(i + 1);
      if (!line.trim()) continue;
      let msg;
      try {
        msg = JSON.parse(line);
      } catch {
        log(`client ${n} sent a line that is not JSON`);
        continue;
      }
      fromClient(client, n, msg);
    }
  });
  client.on("close", () => {
    clients.delete(n);
    for (const [k, p] of pending) if (p.client === client) pending.delete(k);
    toExtension({ type: "client.left", client: n });
    log(`client ${n} left (${clients.size} now)`);
  });
  client.on("error", () => {
  });
});
server.on("error", (e) => {
  log(`socket error: ${e.message}`);
  shutdown(1);
});
server.listen(SOCK, () => log(`started for ${process.argv[2] ?? "unknown caller"}, listening`));
function shutdown(code) {
  try {
    server.close();
  } catch {
  }
  try {
    if (process.platform !== "win32") unlinkSync(SOCK);
  } catch {
  }
  for (const c of clients.values()) c.destroy();
  process.exit(code);
}
process.on("SIGTERM", () => shutdown(0));
process.on("SIGINT", () => shutdown(0));
