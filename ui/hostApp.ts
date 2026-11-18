// Minimal MCP Apps client (the view side of @modelcontextprotocol/ext-apps' `App`), written by hand
// because `App` pulls in zod and the MCP client SDK: ~200 KB of the widget for a handful of
// postMessage JSON-RPC calls. Same wire protocol and handshake as ext-apps 2.0 (protocol 2026-01-26):
//   view → host: ui/initialize, ui/notifications/initialized, ui/notifications/size-changed,
//                tools/call, ui/message, ui/update-model-context, ui/open-link, ui/download-file
//   host → view: ui/notifications/tool-result, ui/notifications/host-context-changed,
//                ping, ui/resource-teardown (other notifications are ignored)
import type { McpUiHostContext } from '@modelcontextprotocol/ext-apps';

const PROTOCOL_VERSION = '2026-01-26';

type Json = Record<string, any>;
type Pending = { resolve: (v: any) => void; reject: (e: Error) => void };

export class HostApp {
  private seq = 0;
  private pending = new Map<number | string, Pending>();
  private context: McpUiHostContext = {};
  private hostName?: string;
  ontoolresult?: (params: Json) => void;
  onhostcontextchanged?: (ctx: McpUiHostContext) => void;

  constructor(private info: { name: string; version: string }, private parent: Window = window.parent) {}

  async connect(): Promise<void> {
    window.addEventListener('message', (e) => {
      if (e.source !== this.parent) return;
      const m = e.data;
      if (m?.jsonrpc === '2.0') this.receive(m);
    });
    const r = await this.request('ui/initialize', { appCapabilities: {}, appInfo: this.info, protocolVersion: PROTOCOL_VERSION });
    this.context = r?.hostContext ?? {};
    this.hostName = typeof r?.hostInfo?.name === 'string' ? r.hostInfo.name : undefined;
    this.notify('ui/notifications/initialized');
    this.autoResize();
  }

  getHostContext(): McpUiHostContext {
    return this.context;
  }

  /** The name the chat app gave for itself in the handshake (e.g. "Claude Desktop"). */
  getHostName(): string | undefined {
    return this.hostName;
  }

  callServerTool(params: { name: string; arguments?: Json }): Promise<Json> {
    return this.request('tools/call', params);
  }

  sendMessage(params: Json) { return this.request('ui/message', params); }
  updateModelContext(params: Json) { return this.request('ui/update-model-context', params); }
  openLink(params: { url: string }) { return this.request('ui/open-link', params); }
  downloadFile(params: Json) { return this.request('ui/download-file', params); }

  private post(msg: Json) {
    this.parent.postMessage({ jsonrpc: '2.0', ...msg }, '*');
  }

  private request(method: string, params: Json): Promise<any> {
    const id = ++this.seq;
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      this.post({ id, method, params });
    });
  }

  private notify(method: string, params?: Json) {
    this.post(params ? { method, params } : { method });
  }

  private receive(m: Json) {
    // Response to one of our requests.
    if (m.method === undefined) {
      const p = this.pending.get(m.id);
      if (!p) return;
      this.pending.delete(m.id);
      if (m.error) p.reject(new Error(m.error.message ?? 'Request failed'));
      else p.resolve(m.result);
      return;
    }
    switch (m.method) {
      case 'ui/notifications/tool-result':
        this.ontoolresult?.(m.params ?? {});
        break;
      case 'ui/notifications/host-context-changed':
        // Hosts send only what changed.
        this.context = { ...this.context, ...m.params };
        this.onhostcontextchanged?.(this.context);
        break;
      case 'ping':
      case 'ui/resource-teardown':
        this.post({ id: m.id, result: {} });
        break;
      default:
        if (m.id !== undefined) this.post({ id: m.id, error: { code: -32601, message: `Method not found: ${m.method}` } });
    }
  }

  /** Reports the content size to the host whenever it changes (ext-apps' autoResize). */
  private autoResize() {
    let width = 0;
    let height = 0;
    let queued = false;
    const measure = () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(() => {
        queued = false;
        const el = document.documentElement;
        const prev = el.style.height;
        el.style.height = 'max-content';
        const h = Math.ceil(el.getBoundingClientRect().height);
        el.style.height = prev;
        const w = Math.ceil(window.innerWidth);
        if (w !== width || h !== height) {
          width = w;
          height = h;
          this.notify('ui/notifications/size-changed', { width, height });
        }
      });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(document.documentElement);
    ro.observe(document.body);
  }
}

export function applyDocumentTheme(theme: 'light' | 'dark') {
  const root = document.documentElement;
  root.setAttribute('data-theme', theme);
  root.style.colorScheme = theme;
}

export function applyHostStyleVariables(vars: Record<string, string | undefined>) {
  for (const [k, v] of Object.entries(vars)) if (v !== undefined) document.documentElement.style.setProperty(k, v);
}

export function applyHostFonts(css: string) {
  if (document.getElementById('__mcp-host-fonts')) return;
  const style = document.createElement('style');
  style.id = '__mcp-host-fonts';
  style.textContent = css;
  document.head.appendChild(style);
}
