// The MCP server's connection to the native host, and through it to the Browser Workflow extension
// (docs/integrations/extension-protocol.md). One socket per MCP server: `hello` first, then calls by id, and
// the extension's events to whoever listens. When the host isn't there (Chrome closed, or the extension is not
// running), it tries again for about 2 s (the host may be restarting) and then answers "Open Chrome to continue."
import { connect } from 'node:net';
import { socketPath } from './ids.js';

export const OPEN_CHROME = 'Open Chrome to continue.';
export const PROTOCOL = 1;
/** What this plugin understands beyond PROTOCOL, sent in `hello` (an older extension ignores it): `wake` = user.action kind "wake" and resume_run. */
export const FEATURES = ['wake'];

/** An answer from the extension that is a refusal, with the protocol's code. */
export class LinkError extends Error {
  /** @param {string} code @param {string} message */
  constructor(code, message) {
    super(message);
    this.code = code;
  }
}

export class Link {
  /**
   * @param {{ plugin: string, socket?: string, retryMs?: number, connectTimeoutMs?: number, log?: (line: string) => void }} o
   */
  constructor(o) {
    this.plugin = o.plugin;
    this.socket = o.socket ?? socketPath();
    this.retryMs = o.retryMs ?? 2_000;
    this.log = o.log ?? (() => {});
    /** @type {import('node:net').Socket | undefined} */
    this.conn = undefined;
    /** @type {Promise<void> | undefined} */
    this.opening = undefined;
    this.next = 1;
    /** @type {Map<number, (msg: any) => void>} */
    this.waits = new Map();
    /** @type {Map<string, Set<(data: any) => void>>} */
    this.listeners = new Map();
    /** What the extension said in `hello`. */
    this.extension = undefined;
    /** Set when the extension refused this plugin as too old. */
    this.tooOld = undefined;
  }

  /** Listens to an event (`run.update`, `user.action`); answers the function that stops listening. */
  on(name, fn) {
    const set = this.listeners.get(name) ?? new Set();
    set.add(fn);
    this.listeners.set(name, set);
    return () => set.delete(fn);
  }

  /** True while the socket is open. */
  get connected() {
    return !!this.conn && !this.conn.destroyed;
  }

  /** Opens the socket (retrying for retryMs) and says hello; throws OPEN_CHROME when the host never answers. */
  async open() {
    if (this.connected) return;
    this.opening ??= this.doOpen().finally(() => { this.opening = undefined; });
    return this.opening;
  }

  async doOpen() {
    const deadline = Date.now() + this.retryMs;
    for (;;) {
      try {
        this.conn = await new Promise((resolve, reject) => {
          const c = connect(this.socket);
          c.once('connect', () => resolve(c));
          c.once('error', reject);
        });
        break;
      } catch (e) {
        if (Date.now() >= deadline) throw new LinkError('not_running', OPEN_CHROME);
        await new Promise((r) => setTimeout(r, 150));
      }
    }
    const conn = this.conn;
    let text = '';
    conn.setEncoding('utf8');
    conn.on('data', (d) => {
      text += d;
      let i;
      while ((i = text.indexOf('\n')) >= 0) {
        const line = text.slice(0, i);
        text = text.slice(i + 1);
        let msg;
        try { msg = JSON.parse(line); } catch { continue; }
        if (msg.type === 'event') {
          for (const fn of this.listeners.get(msg.name) ?? []) {
            try { fn(msg.data); } catch (e) { this.log(`event listener failed: ${e?.message ?? e}`); }
          }
          continue;
        }
        this.waits.get(msg.id)?.(msg);
      }
    });
    conn.on('close', () => {
      if (this.conn === conn) this.conn = undefined;
      for (const w of this.waits.values()) w({ ok: false, error: { code: 'not_running', message: OPEN_CHROME } });
      this.waits.clear();
    });
    conn.on('error', () => {});
    const hello = await this.send('hello', { plugin: this.plugin, protocol: PROTOCOL, features: FEATURES }, 10_000);
    if (hello.ok) {
      this.extension = hello.result;
      this.tooOld = undefined;
    } else this.log(`hello refused: ${hello.error?.message}`);
  }

  /** One message and its raw answer. */
  send(method, params, timeoutMs) {
    const id = this.next++;
    return new Promise((resolve) => {
      const timer = setTimeout(() => {
        this.waits.delete(id);
        resolve({ ok: false, error: { code: 'failed', message: `The Browser Workflow extension did not answer ${method} within ${Math.round(timeoutMs / 1000)} s.` } });
      }, timeoutMs);
      this.waits.set(id, (msg) => { clearTimeout(timer); this.waits.delete(id); resolve(msg); });
      this.conn.write(`${JSON.stringify({ id, type: 'call', method, params })}\n`);
    });
  }

  /**
   * Calls a method of the extension (or `host_status` of the host); answers its result, or throws a LinkError
   * (`not_running` with OPEN_CHROME, `too_old`, `unsupported`, `busy`, …).
   */
  async call(method, params = {}, timeoutMs = 120_000) {
    await this.open();
    const r = await this.send(method, params, timeoutMs);
    if (r.ok) return r.result;
    const err = new LinkError(r.error?.code ?? 'failed', r.error?.message ?? 'The extension refused the call.');
    if (err.code === 'too_old') this.tooOld = err;
    throw err;
  }

  close() {
    this.conn?.destroy();
    this.conn = undefined;
  }
}
