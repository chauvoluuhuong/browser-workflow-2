// What the views talk through, so they don't depend on where they are shown. Two implementations:
//   HostBridge   in the chat: the MCP Apps host connection (tools run by the plugin's MCP server).
//   PanelBridge  in the extension's side panel (panel.tsx): tools run by the extension itself, and "Ask Claude"
//                goes to Claude as a `user.action` event (wait_for_user answers it).
import { HostApp, applyDocumentTheme, applyHostStyleVariables, applyHostFonts } from './hostApp.js';
import type { ViewPayload } from './types.js';

export interface CallResult<T = any> {
  payload: T;
  text: string;
  isError: boolean;
}

export interface Bridge {
  call<T = ViewPayload>(name: string, args?: Record<string, unknown>): Promise<CallResult<T>>;
  /**
   * Post a user message into the chat so the AI takes over. The side panel answers whether a Claude got it
   * (`delivered`); the chat answers nothing (the message is in the chat).
   */
  sendMessage(text: string): Promise<void | SendResult>;
  /** Silently tell the AI about state it should know (e.g. run finished). */
  updateContext(text: string): Promise<void>;
  openLink(url: string): Promise<void>;
  download(fileName: string, mimeType: string, text: string): Promise<void>;
  /** Called with each tool result the host delivers to this view. */
  onPayload(cb: (p: ViewPayload) => void): void;
  /** Host UI locale (e.g. "vi-VN"), used when the user hasn't picked a language. */
  hostLocale(): string | undefined;
  /** The chat app's own name for itself, when it gave one. */
  hostName(): string | undefined;
  /** Where the views are shown: the chat (a widget) or the extension's side panel. */
  readonly surface: 'chat' | 'panel';
  /** The side panel only: the extension's events (`run.update`, `proposal.update`). Answers the function that stops listening. */
  onEvent?(name: string, cb: (data: any) => void): () => void;
  /** The side panel only: the view on top, so what the user sends Claude names its workflow, run or proposal. */
  setCurrent?(p: ViewPayload | undefined): void;
}

/** What the side panel's sendMessage did: whether a Claude was there to get it, and the text it sent. */
export interface SendResult {
  delivered: boolean;
  text: string;
}

class HostBridge implements Bridge {
  readonly surface = 'chat' as const;
  private listeners: ((p: ViewPayload) => void)[] = [];
  private last?: ViewPayload;
  readonly app = new HostApp({ name: 'browser-workflow', version: '2.0.0' });

  async connect() {
    this.app.ontoolresult = (params) => {
      const p = (params as any).structuredContent as ViewPayload | undefined;
      if (!p || !('view' in p)) return;
      this.last = p;
      this.listeners.forEach((l) => l(p));
    };
    this.app.onhostcontextchanged = (ctx) => this.applyContext(ctx);
    await this.app.connect();
    this.applyContext(this.app.getHostContext());
  }

  private applyContext(ctx: any) {
    if (!ctx) return;
    if (ctx.theme) applyDocumentTheme(ctx.theme);
    if (ctx.styles?.variables) applyHostStyleVariables(ctx.styles.variables);
    if (ctx.styles?.css?.fonts) applyHostFonts(ctx.styles.css.fonts);
  }

  async call<T>(name: string, args: Record<string, unknown> = {}): Promise<CallResult<T>> {
    const r = await this.app.callServerTool({ name, arguments: args });
    const text = (r.content ?? []).map((c: any) => (c.type === 'text' ? c.text : '')).join('\n');
    return { payload: (r.structuredContent ?? {}) as T, text, isError: !!r.isError };
  }

  async sendMessage(text: string) {
    await this.app.sendMessage({ role: 'user', content: [{ type: 'text', text }] });
  }

  async updateContext(text: string) {
    await this.app.updateModelContext({ content: [{ type: 'text', text }] });
  }

  async openLink(url: string) {
    await this.app.openLink({ url });
  }

  async download(fileName: string, mimeType: string, text: string) {
    await this.app.downloadFile({
      contents: [{ type: 'resource', resource: { uri: `file:///${fileName}`, mimeType, text } }],
    });
  }

  onPayload(cb: (p: ViewPayload) => void) {
    this.listeners.push(cb);
    if (this.last) cb(this.last);
  }

  hostLocale() {
    return this.app.getHostContext()?.locale;
  }

  hostName() {
    return this.app.getHostName();
  }
}

export async function createBridge(): Promise<Bridge> {
  const b = new HostBridge();
  await b.connect();
  return b;
}
