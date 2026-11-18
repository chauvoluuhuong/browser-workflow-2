// The side panel: the same views as the chat widget, in the Browser Workflow extension's side panel in Chrome.
// Built into dist/panel/ (an ES module and its CSS); the extension copies that folder (`npm run sync-ui`) and its
// side panel page calls mountPanel().
//   PanelBridge  tools run by the extension itself (chrome.runtime messages to its service worker, `tools.call`),
//                so the panel works with Claude closed. "Ask Claude" goes to every connected Claude as a
//                `user.action` event (wait_for_user answers it); with none connected the panel offers the text
//                to copy into Claude.
//   Home         the workflows with Run and their last result (list_workflows' view), and a "Waiting for your
//                approval" badge while Claude's proposals wait (ui_proposal). Account opens the account card.
//   Claude       the strip on Home (Use with Claude, or "Claude is listening" + Chat) and the chat screen
//                (views/chat.tsx): `chat.*` messages to the service worker. An extension that does not answer
//                them (older, or not built yet) leaves the strip at "not connected", and Send goes as today's
//                `user.action` (kind chat).
import { render } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import './styles.css';
import type { Bridge, CallResult, SendResult } from './bridge.js';
import type { Nav } from './components.js';
import { Icon } from './components.js';
import { useI18n } from './i18n.js';
import type { ViewPayload } from './types.js';
import { pendingOf, Widget } from './widget.js';
import { ClaudeStrip, type Candidates, type ChatBridge, type ChatEntry, type Mention, type RemoteState } from './views/chat.js';

declare const chrome: any;

/** The messages between the side panel and the service worker (chrome.runtime). */
export type PanelMessage =
  | { bw: 'tools.call'; name: string; args: Record<string, unknown> }
  | { bw: 'user.action'; action: UserAction }
  | { bw: 'chat.state' }
  | { bw: 'chat.log' }
  | { bw: 'chat.mentions'; query: string }
  | { bw: 'chat.send'; text: string; mentions: Mention[] };
/** The service worker → open side panels. */
export interface PanelEvent { bw: 'event'; name: string; data: unknown }

/** The protocol's `user.action` event (docs/integrations/extension-protocol.md). */
export interface UserAction {
  kind: string;
  text: string;
  workflowId?: string;
  runId?: string;
  pendingId?: string;
  view?: string;
  context?: string;
  silent?: boolean;
  /** `kind: "chat"`: what the user named with `@`. */
  mentions?: Mention[];
}

/** The ids a view is about, so Claude knows what "this" is. */
function idsOf(p?: ViewPayload): Pick<UserAction, 'workflowId' | 'runId' | 'pendingId' | 'view'> {
  if (!p) return {};
  const a: any = p;
  const run = a.run ?? a.step;
  return {
    view: p.view,
    workflowId: a.workflowId ?? a.workflow?.id ?? run?.workflowId,
    runId: a.runId ?? run?.runId,
    pendingId: pendingOf(p),
  };
}

export class PanelBridge implements Bridge, ChatBridge {
  readonly surface = 'panel' as const;
  private current?: ViewPayload;
  /** Context given just before a message goes with it (askClaude sends the two one after the other). */
  private context?: string;
  private contextTimer?: ReturnType<typeof setTimeout>;

  constructor(private runtime = chrome.runtime, private tabs = chrome.tabs) {}

  async call<T = ViewPayload>(name: string, args: Record<string, unknown> = {}): Promise<CallResult<T>> {
    const r = await this.runtime.sendMessage({ bw: 'tools.call', name, args } satisfies PanelMessage);
    if (!r?.ok) throw new Error(r?.error ?? 'Browser Workflow did not answer.');
    return { payload: (r.result?.payload ?? {}) as T, text: r.result?.text ?? '', isError: !!r.result?.isError };
  }

  async sendMessage(text: string): Promise<SendResult> {
    const context = this.context;
    this.context = undefined;
    clearTimeout(this.contextTimer);
    const action: UserAction = { kind: 'ask_claude', text, ...idsOf(this.current), ...(context ? { context } : {}) };
    const r = await this.runtime.sendMessage({ bw: 'user.action', action } satisfies PanelMessage).catch(() => undefined);
    return { delivered: !!r?.delivered, text };
  }

  async updateContext(text: string) {
    // Kept for the message that usually follows at once; sent on its own (silent) when none comes.
    this.context = text;
    clearTimeout(this.contextTimer);
    this.contextTimer = setTimeout(() => {
      if (this.context === undefined) return;
      const action: UserAction = { kind: 'context', text: this.context, silent: true, ...idsOf(this.current) };
      this.context = undefined;
      void this.runtime.sendMessage({ bw: 'user.action', action } satisfies PanelMessage).catch(() => {});
    }, 50);
  }

  async openLink(url: string) {
    await this.tabs.create({ url });
  }

  async download(fileName: string, mimeType: string, text: string) {
    const url = URL.createObjectURL(new Blob([text], { type: mimeType }));
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 10_000);
  }

  /** A message to the service worker; `undefined` when it does not answer (an older extension) or fails. */
  private async ask(m: PanelMessage): Promise<any> {
    try { return await this.runtime.sendMessage(m); } catch { return undefined; }
  }

  async chatState(): Promise<RemoteState | undefined> {
    const r = await this.ask({ bw: 'chat.state' });
    return ['none', 'listening', 'working', 'idle', 'connected'].includes(r?.state) ? r.state : undefined;
  }

  async chatLog(): Promise<ChatEntry[] | undefined> {
    const r = await this.ask({ bw: 'chat.log' });
    return Array.isArray(r?.entries) ? r.entries : undefined;
  }

  async mentions(query: string): Promise<Candidates | undefined> {
    const r = await this.ask({ bw: 'chat.mentions', query });
    if (!r || !(Array.isArray(r.workflows) || Array.isArray(r.runs) || Array.isArray(r.tabs))) return undefined;
    return { workflows: r.workflows ?? [], runs: r.runs ?? [], tabs: r.tabs ?? [] };
  }

  async chatSend(text: string, mentions: Mention[]) {
    const r = await this.ask({ bw: 'chat.send', text, mentions });
    if (r && typeof r === 'object' && 'delivered' in r) return { delivered: !!r.delivered, fallback: false };
    // An extension without the chat: the message goes as before, to every connected Claude.
    const action: UserAction = { kind: 'chat', text, ...(mentions.length ? { mentions } : {}) };
    const f = await this.ask({ bw: 'user.action', action });
    return { delivered: !!f?.delivered, fallback: true };
  }

  onPayload() { /* nothing is pushed to the panel: it opens views itself */ }

  hostLocale() {
    return navigator.language;
  }

  hostName() {
    return 'Claude';
  }

  onEvent(name: string, cb: (data: any) => void) {
    const fn = (m: PanelEvent) => { if (m?.bw === 'event' && m.name === name) cb(m.data); };
    this.runtime.onMessage.addListener(fn);
    return () => this.runtime.onMessage.removeListener(fn);
  }

  setCurrent(p?: ViewPayload) {
    this.current = p;
  }
}

interface Proposal { pendingId: string; kind: string; name: string; workflowId: string }

/** Above every view: Home (when not on it) and the proposals waiting for the user. */
function PanelTop({ nav, current }: { nav: Nav; current?: ViewPayload }) {
  const { t } = useI18n();
  const [proposals, setProposals] = useState<Proposal[]>([]);
  useEffect(() => {
    let over = false;
    const look = async () => {
      try {
        const r = await nav.bridge.call<{ proposals?: Proposal[] }>('ui_proposal', {});
        if (!over) setProposals(r.payload.proposals ?? []);
      } catch { /* an older extension */ }
    };
    void look();
    const off = nav.bridge.onEvent?.('proposal.update', () => void look());
    // Proposals expire after an hour without a word: look now and then too.
    const timer = setInterval(look, 30_000);
    return () => { over = true; off?.(); clearInterval(timer); };
  }, [nav.bridge]);

  const home = current?.view === 'library';
  const shown = pendingOf(current);
  const waiting = proposals.filter((p) => p.pendingId !== shown);
  return (
    <div class="w panel-top" style="padding-bottom:0">
      <div style="display:flex;justify-content:space-between;align-items:center">
        {home ? <span /> : <button class="back" onClick={() => nav.open('list_workflows', {}, 'reset')}>{t('panel.home')}</button>}
        {current?.view !== 'account' && <button class="link" onClick={() => nav.open('show_account', {}, 'push')}>{t('panel.account')}</button>}
      </div>
      {home && <ClaudeStrip nav={nav} />}
      {waiting.length > 0 && (
        <div class="note warn" role="status" style="align-items:center">
          {Icon.alert()}
          <div class="row-main">
            <div class="row-title">{t('panel.waiting')}</div>
            <div class="row-sub">{waiting.length === 1 ? waiting[0]!.name : t('panel.waitingSub', { n: waiting.length })}</div>
          </div>
          <button class="btn primary" onClick={() => nav.open('ui_proposal', { pendingId: waiting[0]!.pendingId }, 'push')}>{t('panel.review')}</button>
        </div>
      )}
    </div>
  );
}

/** Draws the side panel into `root`. */
export function mountPanel(root: HTMLElement, bridge: Bridge = new PanelBridge()) {
  render(
    <Widget bridge={bridge} start={{ tool: 'list_workflows' }} top={(nav, current) => <PanelTop nav={nav} current={current} />} />,
    root,
  );
}
