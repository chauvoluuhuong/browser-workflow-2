// The side panel's Claude chat (Use with Claude; docs/integrations/extension-protocol.md → "The side-panel chat").
//   ClaudeStrip  on Home, above the workflows: no Claude (Use with Claude / Use Claude Code instead / Copy the
//                prompt), waiting for Claude after the button opened it, or one line "Claude is listening" + Chat.
//   ChatView     the Claude screen: the log (you / Claude / event cards), the status, the composer with the
//                `@` picker (workflows, recent runs, open tabs) whose picks are chips sent with the message.
// Panel only: the chat widget never shows it. Everything is drawn as text (never as HTML): Claude's answers and
// tab titles are not ours.
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'preact/hooks';
import type { ComponentChildren } from 'preact';
import type { Bridge } from '../bridge.js';
import type { ViewPayload } from '../types.js';
import { Icon, useNav, type Nav } from '../components.js';
import { useI18n, type Key, type T } from '../i18n.js';

/** Something the user named with `@` (the protocol's `Mention`, src/protocol.ts). Tab titles are page text. */
export interface Mention {
  type: 'workflow' | 'run' | 'tab';
  id?: string;
  name: string;
  url?: string;
  status?: string;
  workflowId?: string;
}

/** What `chat.state` answers. */
export type RemoteState = 'none' | 'listening' | 'working' | 'idle' | 'connected';
/** What the panel shows: `opening` is the panel's own, from Use with Claude until Claude listens. */
export type ChatState = RemoteState | 'opening';

/** A card in the log: a proposal (Review while it waits) or a run that finished. */
export interface ChatCard {
  kind: 'proposal' | 'run';
  pendingId?: string;
  runId?: string;
  workflowId?: string;
  name?: string;
  state?: string;
  status?: string;
  items?: number;
}

export interface ChatEntry {
  at: string | number;
  from: 'you' | 'claude' | 'event';
  text: string;
  mentions?: Mention[];
  card?: ChatCard;
  /** The panel's own note (an older extension keeps no log): shown as a warning. */
  warn?: boolean;
}

export interface Candidates { workflows: Mention[]; runs: Mention[]; tabs: Mention[] }

/** What the side panel's bridge adds for the chat. Every one answers `undefined` when the extension says nothing. */
export interface ChatBridge {
  chatState(): Promise<RemoteState | undefined>;
  chatLog(): Promise<ChatEntry[] | undefined>;
  /** `fallback`: the extension knew no `chat.send`, so the message went as a `user.action` (kind chat). */
  chatSend(text: string, mentions: Mention[]): Promise<{ delivered: boolean; fallback: boolean }>;
  mentions(query: string): Promise<Candidates | undefined>;
  onEvent(name: string, cb: (data: any) => void): () => void;
}

export const chatOf = (b: Bridge): ChatBridge | undefined =>
  b.surface === 'panel' && typeof (b as any).chatState === 'function' ? (b as unknown as ChatBridge) : undefined;

/** The panel's chat screen: not a tool's view, opened by the strip's Chat button. */
export const CHAT_VIEW = { view: 'chat' } as unknown as ViewPayload;
export const isChat = (p?: ViewPayload) => (p as { view?: string } | undefined)?.view === 'chat';

/** How long "Waiting for Claude…" waits before it says how to do it by hand. */
export const NOTHING_OPENED_MS = 10_000;

// ---------- shared between the strip and the chat screen ----------

/** When Use with Claude was pressed (0: not waiting), and the log an older extension does not keep. */
const store = { openedAt: 0, local: [] as ChatEntry[], subs: new Set<() => void>() };
const bump = () => store.subs.forEach((f) => f());

/** The app's links (the desktop app's own: the prompt filled in, not sent). */
export function claudeLink(where: 'chat' | 'code', prompt: string) {
  return `claude://${where === 'chat' ? 'claude.ai' : 'code'}/new?q=${encodeURIComponent(prompt)}`;
}

/** Opens a link with a page anchor (chrome.tabs.create would leave a blank tab): Chrome asks "Open Claude?". */
function openApp(url: string) {
  const a = document.createElement('a');
  a.href = url;
  a.rel = 'noopener';
  document.body.appendChild(a);
  a.click();
  a.remove();
}

async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return;
  } catch { /* not focused, or not allowed: the old way */ }
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.style.position = 'fixed';
  ta.style.opacity = '0';
  document.body.appendChild(ta);
  ta.select();
  document.execCommand('copy');
  ta.remove();
}

export interface Chat {
  bridge?: ChatBridge;
  state: ChatState;
  /** Whether the extension answers `chat.state` (an older one does not: then the chat is open to sending). */
  known: boolean;
  entries: ChatEntry[];
  nothingOpened: boolean;
  canSend: boolean;
  open(where: 'chat' | 'code'): void;
  copy(): Promise<void>;
  send(text: string, mentions: Mention[]): Promise<void>;
}

export function useChat(nav: Nav): Chat {
  const { t } = useI18n();
  const bridge = chatOf(nav.bridge);
  const [remote, setRemote] = useState<{ state?: RemoteState; entries?: ChatEntry[] }>({});
  const [, redraw] = useState(0);
  useEffect(() => {
    const f = () => redraw((n) => n + 1);
    store.subs.add(f);
    return () => { store.subs.delete(f); };
  }, []);

  const look = async () => {
    if (!bridge) return;
    const [state, entries] = await Promise.all([bridge.chatState().catch(() => undefined), bridge.chatLog().catch(() => undefined)]);
    setRemote({ state, entries });
  };
  useEffect(() => {
    if (!bridge) return;
    let over = false;
    void (async () => {
      const [state, entries] = await Promise.all([bridge.chatState().catch(() => undefined), bridge.chatLog().catch(() => undefined)]);
      if (!over) setRemote({ state, entries });
    })();
    const off = bridge.onEvent('chat.update', (d) => {
      if (d && typeof d === 'object') setRemote((r) => ({ state: d.state ?? r.state, entries: Array.isArray(d.entries) ? d.entries : r.entries }));
    });
    return () => { over = true; off(); };
  }, [bridge]);

  const live = remote.state === 'listening' || remote.state === 'working' || remote.state === 'connected';
  if (live && store.openedAt) store.openedAt = 0;
  const opening = !!store.openedAt;

  // While waiting for Claude: look again now and then (the event may be missed), and say after 10 s what to do by hand.
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    if (!opening) return;
    const timer = setInterval(() => { setNow(Date.now()); void look(); }, 2_000);
    return () => clearInterval(timer);
  }, [opening, bridge]);

  const known = remote.state !== undefined;
  const state: ChatState = opening ? 'opening' : remote.state ?? 'none';
  return {
    bridge,
    state,
    known,
    entries: remote.entries ?? store.local,
    nothingOpened: opening && now - store.openedAt >= NOTHING_OPENED_MS,
    canSend: live || !known,
    open(where) {
      store.openedAt = Date.now();
      setNow(store.openedAt);
      openApp(claudeLink(where, t('chat.prompt')));
      bump();
    },
    copy: () => copyText(t('chat.prompt')),
    async send(text, mentions) {
      if (!bridge) return;
      const r = await bridge.chatSend(text, mentions);
      if (r.fallback) {
        // An older extension keeps no log: the panel keeps what was sent until it closes.
        store.local = [...store.local, { at: Date.now(), from: 'you', text, mentions }];
        if (!r.delivered) store.local.push({ at: Date.now(), from: 'event', text: t('chat.notDelivered'), warn: true });
        bump();
      } else {
        await look();
      }
    },
  };
}

// ---------- pieces ----------

function Dot({ kind, pulse }: { kind?: 'ok' | 'run' | 'bad' | 'warn'; pulse?: boolean }) {
  return <span class={`dot${kind ? ` ${kind}` : ''}${pulse ? ' pulse' : ''}`} />;
}

function CopyLink({ chat, button }: { chat: Chat; button?: boolean }) {
  const { t } = useI18n();
  const [copied, setCopied] = useState(false);
  const label = copied ? t('chat.copied') : t('chat.copyPrompt');
  const onClick = async () => {
    await chat.copy();
    setCopied(true);
    setTimeout(() => setCopied(false), 2_000);
  };
  return button ? <button class="btn sm" onClick={onClick}>{label}</button> : <button class="link" onClick={onClick}>{label}</button>;
}

const ext = () => Icon.sparkle();

/** Home's strip: what Claude is doing, and how to start it. */
export function ClaudeStrip({ nav }: { nav: Nav }) {
  const { t } = useI18n();
  const chat = useChat(nav);
  if (!chat.bridge) return null;
  const toChat = () => nav.push(CHAT_VIEW);
  const s = chat.state;
  if (s === 'listening' || s === 'working' || s === 'connected') {
    const text = s === 'listening' ? t('chat.liveListening') : s === 'working' ? t('chat.liveWorking') : t('chat.liveConnected');
    return (
      <div class="strip live" role="status">
        <Dot kind={s === 'working' ? 'run' : 'ok'} pulse={s === 'working'} />
        <span class="strip-sub">{text}</span>
        <button class="btn sm primary" onClick={toChat}>{t('chat.chat')}</button>
      </div>
    );
  }
  if (s === 'opening') {
    return (
      <div class="strip" role="status">
        <div class="strip-top"><Dot kind="run" pulse /><span class="strip-title">{t('chat.waitingTitle')}</span></div>
        <ol class="steps-ol">
          <li>{t('chat.step1')}</li>
          <li>{t('chat.step2a')}<b>{t('chat.step2b')}</b>{t('chat.step2c')}</li>
          <li>{t('chat.step3')}</li>
        </ol>
        <div class="strip-sub">{t('chat.warnNote')}</div>
        {chat.nothingOpened && <div class="strip-sub strong">{t('chat.nothingOpened')}</div>}
        <div class="strip-links">
          <button class="link" onClick={() => chat.open('chat')}>{t('chat.openAgain')}</button>
          <CopyLink chat={chat} />
        </div>
      </div>
    );
  }
  return (
    <div class="strip">
      <div class="strip-top"><Dot /><span class="strip-title">{s === 'idle' ? t('chat.idleTitle') : t('chat.noneTitle')}</span></div>
      <div class="strip-sub">{t('chat.noneSub')}</div>
      <button class="btn primary block" onClick={() => chat.open('chat')}>{ext()}{t('chat.use')}</button>
      <div class="strip-links">
        <button class="link" onClick={() => chat.open('code')}>{t('chat.useCode')}</button>
        <CopyLink chat={chat} />
        {(s === 'idle' || !chat.known || chat.entries.length > 0) && <button class="link" onClick={toChat}>{t('chat.openChat')}</button>}
      </div>
    </div>
  );
}

// Mention icons: the same paths for JSX (picker, log) and for the composer's chips (made with the DOM).
const CIRCLE = 'M8 2.5a5.5 5.5 0 1 1 0 11a5.5 5.5 0 1 1 0-11z';
function iconPaths(m: Mention): string[] {
  if (m.type === 'workflow') return ['M3 3h4v4H3zM9 9h4v4H9zM7 5h3.5a1.5 1.5 0 0 1 1.5 1.5V9'];
  if (m.type === 'tab') return ['M3.5 3h9A1.5 1.5 0 0 1 14 4.5v7a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 11.5v-7A1.5 1.5 0 0 1 3.5 3zM2 6h12'];
  return m.status === 'failure' ? [CIRCLE, 'M8 5v3.5M8 10.8v.1'] : [CIRCLE, 'M6.8 5.8 10 8l-3.2 2.2z'];
}
function MentionIcon({ m }: { m: Mention }) {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" class={m.type === 'run' && m.status === 'failure' ? 'is-bad' : undefined}>
      {iconPaths(m).map((d) => <path d={d} />)}
    </svg>
  );
}
function mentionIconNode(m: Mention) {
  const ns = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(ns, 'svg');
  for (const [k, v] of Object.entries({ width: '12', height: '12', viewBox: '0 0 16 16', fill: 'none', stroke: 'currentColor', 'stroke-width': '1.6', 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'aria-hidden': 'true' })) svg.setAttribute(k, v);
  for (const d of iconPaths(m)) {
    const p = document.createElementNS(ns, 'path');
    p.setAttribute('d', d);
    svg.appendChild(p);
  }
  return svg;
}

function MentionChip({ m }: { m: Mention }) {
  return <span class="mchip" title={m.url ?? m.name}><MentionIcon m={m} />{m.name}</span>;
}

/** A message's text with each `@name` it mentions drawn as a chip; mentions not in the text follow it. */
export function withChips(text: string, mentions: Mention[] = []): ComponentChildren[] {
  const tokens = mentions.map((m) => ({ m, s: `@${m.name}` })).sort((a, b) => b.s.length - a.s.length);
  const out: ComponentChildren[] = [];
  const used = new Set<Mention>();
  let plain = '';
  for (let i = 0; i < text.length;) {
    const hit = text[i] === '@' ? tokens.find((k) => text.startsWith(k.s, i)) : undefined;
    if (hit) {
      if (plain) out.push(plain);
      plain = '';
      out.push(<MentionChip m={hit.m} />);
      used.add(hit.m);
      i += hit.s.length;
    } else {
      plain += text[i];
      i += 1;
    }
  }
  if (plain) out.push(plain);
  for (const m of mentions) if (!used.has(m)) out.push(' ', <MentionChip m={m} />);
  return out;
}

const statusKey = (s?: string) => (s && ['running', 'waiting_manual', 'success', 'failure', 'stopped'].includes(s) ? (`status.${s}` as Key) : undefined);

function mentionSub(m: Mention, t: T) {
  if (m.type === 'tab') return m.url?.replace(/^https?:\/\//, '');
  if (m.type === 'run') { const k = statusKey(m.status); return k ? t(k) : m.status; }
  return undefined;
}

// ---------- the composer ----------

const GROUP_MAX = 5;
const sameMention = (a: Mention, b: Mention) => a.type === b.type && (a.id ?? a.url ?? a.name) === (b.id ?? b.url ?? b.name);

function filterCands(c: Candidates | undefined, query: string) {
  const q = query.toLowerCase();
  const f = (list: Mention[] = []) => list.filter((m) => !q || `${m.name} ${m.url ?? ''}`.toLowerCase().includes(q)).slice(0, GROUP_MAX);
  return { workflows: f(c?.workflows), runs: f(c?.runs), tabs: f(c?.tabs) };
}

/** The `@query` just before the caret, if the caret is in one. */
function atQuery(root: HTMLElement | null) {
  const sel = getSelection();
  if (!root || !sel || !sel.rangeCount || !sel.isCollapsed) return null;
  const node = sel.anchorNode;
  if (!node || node.nodeType !== Node.TEXT_NODE || !root.contains(node)) return null;
  const before = (node.textContent ?? '').slice(0, sel.anchorOffset);
  const m = /(?:^|[\s ])@([^\s @]{0,40})$/.exec(before);
  if (!m) return null;
  return { node: node as Text, start: sel.anchorOffset - m[1]!.length - 1, end: sel.anchorOffset, query: m[1]! };
}

function Composer({ enabled, chat }: { enabled: boolean; chat: Chat }) {
  const { t } = useI18n();
  const ed = useRef<HTMLDivElement>(null);
  const chips = useRef(new Map<string, Mention>());
  const chipSeq = useRef(0);
  const [empty, setEmpty] = useState(true);
  const [sending, setSending] = useState(false);
  const [pick, setPick] = useState<{ query: string; cands?: Candidates; on: number } | null>(null);
  /** The `@` the user closed the picker on (Esc): not opened again for it. */
  const dismissed = useRef<{ node: Node; start: number } | null>(null);
  const asked = useRef(0);

  const shown = useMemo(() => filterCands(pick?.cands, pick?.query ?? ''), [pick]);
  const flat = [...shown.workflows, ...shown.runs, ...shown.tabs];

  const serialize = () => {
    let text = '';
    const mentions: Mention[] = [];
    const walk = (n: Node) => {
      n.childNodes.forEach((c) => {
        if (c.nodeType === Node.TEXT_NODE) { text += c.textContent ?? ''; return; }
        if (!(c instanceof HTMLElement)) return;
        const k = c.dataset.k;
        if (k) {
          const m = chips.current.get(k);
          if (m) {
            text += `@${m.name}`;
            if (!mentions.some((x) => sameMention(x, m))) mentions.push(m);
          }
        } else if (c.tagName === 'BR') {
          text += '\n';
        } else {
          if (c.tagName === 'DIV' && text && !text.endsWith('\n')) text += '\n';
          walk(c);
        }
      });
    };
    if (ed.current) walk(ed.current);
    return { text: text.replace(/ /g, ' ').replace(/[ \t]+\n/g, '\n').trim(), mentions };
  };

  const ask = (query: string) => {
    const my = ++asked.current;
    setPick((p) => ({ query, cands: p?.cands, on: 0 }));
    void chat.bridge?.mentions(query).catch(() => undefined).then((cands) => {
      if (my === asked.current) setPick((p) => (p ? { ...p, cands: cands ?? p.cands ?? { workflows: [], runs: [], tabs: [] } } : p));
    });
  };

  const onInput = () => {
    setEmpty(!serialize().text && !ed.current?.querySelector('[data-k]'));
    const q = atQuery(ed.current);
    const d = dismissed.current;
    // The closed `@` is gone (deleted, or the caret left it): a new one opens the picker again.
    if (!q) dismissed.current = null;
    if (q && !(d && d.node === q.node && d.start === q.start)) ask(q.query);
    else setPick(null);
  };

  const insert = (m: Mention) => {
    const root = ed.current;
    if (!root) return;
    const k = String(++chipSeq.current);
    chips.current.set(k, m);
    const span = document.createElement('span');
    span.className = 'mchip';
    span.contentEditable = 'false';
    span.dataset.k = k;
    span.title = m.url ?? m.name;
    span.append(mentionIconNode(m), document.createTextNode(m.name));
    const space = document.createTextNode(' ');
    const q = atQuery(root);
    if (q) {
      const rest = q.node.splitText(q.start);
      rest.textContent = (rest.textContent ?? '').slice(q.end - q.start);
      rest.before(span, space);
    } else {
      root.append(span, space);
    }
    const sel = getSelection();
    const r = document.createRange();
    r.setStart(space, 1);
    r.collapse(true);
    sel?.removeAllRanges();
    sel?.addRange(r);
    setPick(null);
    setEmpty(false);
    root.focus();
  };

  /** The Mention button: an `@` at the caret (a space before it when needed), and the picker. */
  const mention = () => {
    const root = ed.current;
    if (!root || !enabled) return;
    root.focus();
    const sel = getSelection();
    if (!sel || !sel.rangeCount || !root.contains(sel.anchorNode)) {
      const r = document.createRange();
      r.selectNodeContents(root);
      r.collapse(false);
      sel?.removeAllRanges();
      sel?.addRange(r);
    }
    const node = getSelection()?.anchorNode;
    const before = node?.nodeType === Node.TEXT_NODE ? (node.textContent ?? '').slice(0, getSelection()!.anchorOffset) : '';
    dismissed.current = null;
    document.execCommand('insertText', false, before && !/[\s ]$/.test(before) ? ' @' : '@');
  };

  const send = async () => {
    const { text, mentions } = serialize();
    if (!text || !enabled || sending) return;
    setSending(true);
    try {
      await chat.send(text, mentions);
      if (ed.current) ed.current.textContent = '';
      chips.current.clear();
      setEmpty(true);
      setPick(null);
    } finally {
      setSending(false);
    }
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.isComposing) return;
    if (pick) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        if (flat.length) setPick({ ...pick, on: (pick.on + (e.key === 'ArrowDown' ? 1 : flat.length - 1)) % flat.length });
        return;
      }
      if ((e.key === 'Enter' || e.key === 'Tab') && flat.length) {
        e.preventDefault();
        insert(flat[Math.min(pick.on, flat.length - 1)]!);
        return;
      }
      if (e.key === 'Escape') {
        e.preventDefault();
        const q = atQuery(ed.current);
        dismissed.current = q ? { node: q.node, start: q.start } : null;
        setPick(null);
        return;
      }
    }
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      void send();
    } else if (e.key === 'Enter') {
      e.preventDefault();
      document.execCommand('insertLineBreak');
    }
  };

  const onPaste = (e: ClipboardEvent) => {
    e.preventDefault();
    document.execCommand('insertText', false, e.clipboardData?.getData('text/plain') ?? '');
  };

  const group = (key: Key, list: Mention[], offset: number) => list.length > 0 && (
    <>
      <div class="pick-h">{t(key)}</div>
      {list.map((m, i) => (
        <button
          class={`pick${pick && pick.on === offset + i ? ' on' : ''}`}
          role="option"
          aria-selected={pick?.on === offset + i}
          onMouseDown={(e) => { e.preventDefault(); insert(m); }}
        >
          <MentionIcon m={m} />
          <div class="row-main">
            <div class="row-title">{m.name}</div>
            {mentionSub(m, t) && <div class="row-sub">{mentionSub(m, t)}</div>}
          </div>
        </button>
      ))}
    </>
  );

  return (
    <div class="composer-wrap">
      {pick && enabled && (
        <div class="picker" role="listbox" aria-label={t('chat.mention')}>
          {group('chat.pickWorkflows', shown.workflows, 0)}
          {group('chat.pickRuns', shown.runs, shown.workflows.length)}
          {group('chat.pickTabs', shown.tabs, shown.workflows.length + shown.runs.length)}
          {!flat.length && pick.cands && <div class="pick-none">{t('chat.pickNone')}</div>}
        </div>
      )}
      <div class="composer">
        <div
          ref={ed}
          class={`ced${empty ? ' is-empty' : ''}${enabled ? '' : ' is-off'}`}
          contentEditable={enabled}
          role="textbox"
          aria-multiline="true"
          aria-disabled={!enabled}
          aria-label={enabled ? t('chat.ph') : t('chat.phOff')}
          data-ph={enabled ? t('chat.ph') : t('chat.phOff')}
          onInput={onInput}
          onKeyDown={onKeyDown}
          onPaste={onPaste}
          onBlur={() => setTimeout(() => setPick(null), 150)}
        />
        <button class="btn primary" disabled={!enabled || empty || sending} onClick={() => void send()}>{t('chat.send')}</button>
      </div>
      <div class="tools">
        <button class={`tool${pick ? ' on' : ''}`} disabled={!enabled} onMouseDown={(e) => e.preventDefault()} onClick={mention}>@ {t('chat.mention')}</button>
      </div>
    </div>
  );
}

// ---------- the chat screen ----------

function Card({ e }: { e: ChatEntry }) {
  const nav = useNav();
  const { t } = useI18n();
  const c = e.card!;
  if (c.kind === 'proposal' && c.pendingId && (!c.state || c.state === 'pending')) {
    return (
      <div class="card-mini">
        <span class="is-warn">{Icon.alert()}</span>
        <div class="row-main">
          <div class="row-title">{t('chat.cardWaiting')}</div>
          <div class="row-sub">{c.name ?? e.text}</div>
        </div>
        <button class="btn sm primary" onClick={() => nav.open('ui_proposal', { pendingId: c.pendingId }, 'push')}>{t('panel.review')}</button>
      </div>
    );
  }
  const kind = c.status === 'success' || c.state === 'saved' || c.state === 'applied' ? 'ok' : c.status === 'failure' ? 'bad' : undefined;
  return <div class="ev"><Dot kind={kind} />{e.text}</div>;
}

function Log({ chat }: { chat: Chat }) {
  const { t } = useI18n();
  const ref = useRef<HTMLDivElement>(null);
  const entries = chat.entries;
  // While Claude works: the first message since its last answer is the one it works on; later ones wait.
  const lastClaude = entries.reduce((n, e, i) => (e.from === 'claude' ? i : n), -1);
  const firstAsk = chat.state === 'working' ? entries.findIndex((e, i) => i > lastClaude && e.from === 'you') : -1;
  const lastAsk = firstAsk < 0 ? -1 : entries.reduce((n, e, i) => (e.from === 'you' ? i : n), -1);
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    if (firstAsk < 0) return;
    const timer = setInterval(() => setNow(Date.now()), 1_000);
    return () => clearInterval(timer);
  }, [firstAsk]);
  const since = firstAsk >= 0 ? new Date(entries[firstAsk]!.at).getTime() : 0;

  useLayoutEffect(() => {
    const el = ref.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [entries.length, chat.state]);

  const out: ComponentChildren[] = [];
  entries.forEach((e, i) => {
    const prev = entries[i - 1];
    if (e.from === 'event' || e.card) {
      out.push(e.card ? <Card e={e} /> : <div class={`ev${e.warn ? ' warn' : ''}`}>{e.warn ? Icon.alert() : <Dot />}{e.text}</div>);
    } else {
      const me = e.from === 'you';
      if (prev?.from !== e.from || prev?.card) out.push(<div class={`who${me ? ' me' : ''}`}>{me ? t('chat.you') : t('chat.claude')}</div>);
      out.push(<div class={`msg ${me ? 'me' : 'claude'}`}>{me ? withChips(e.text, e.mentions) : e.text}</div>);
    }
    if (i === firstAsk) {
      out.push(
        <div class="working" role="status">
          <span class="typing"><i /><i /><i /></span>
          {t('chat.working', { s: Number.isFinite(since) ? Math.max(0, Math.round((now - since) / 1000)) : 0 })}
        </div>,
      );
    }
    if (i === lastAsk && lastAsk > firstAsk) out.push(<div class="ev"><Dot />{t('chat.queued')}</div>);
  });
  return (
    <div class="log" ref={ref} aria-live="polite">
      {entries.length === 0 && <div class="muted log-empty">{t('chat.empty')}</div>}
      {out}
      {chat.known && !chat.canSend && <Stopped chat={chat} />}
    </div>
  );
}

/** In the log when no Claude listens: why, and how to start one again. */
function Stopped({ chat }: { chat: Chat }) {
  const { t } = useI18n();
  const s = chat.state;
  const title = s === 'idle' ? t('chat.stoppedTitle') : s === 'opening' ? t('chat.waitingTitle') : t('chat.noneTitle');
  const sub = s === 'idle' ? t('chat.stoppedSub') : s === 'opening' ? (chat.nothingOpened ? t('chat.nothingOpened') : `${t('chat.step2a')}${t('chat.step2b')}${t('chat.step2c')}`) : t('chat.noneSub');
  return (
    <div class="banner" role="status">
      <div class="banner-title">{title}</div>
      <div class="strip-sub">{sub}</div>
      <div class="actions">
        <CopyLink chat={chat} button />
        <button class="btn sm primary" onClick={() => chat.open('chat')}>{s === 'opening' ? t('chat.openAgain') : t('chat.use')}</button>
      </div>
    </div>
  );
}

export function ChatView() {
  const nav = useNav();
  const { t } = useI18n();
  const chat = useChat(nav);
  const box = useRef<HTMLDivElement>(null);
  // The screen fills the panel below the top bar: the log scrolls, the composer stays at the bottom.
  useLayoutEffect(() => {
    const fit = () => {
      const el = box.current;
      if (!el || !el.offsetParent) return;
      const top = el.getBoundingClientRect().top + window.scrollY;
      el.style.height = `${Math.max(320, window.innerHeight - top)}px`;
    };
    fit();
    const ro = new ResizeObserver(fit);
    if (box.current?.parentElement) ro.observe(box.current.parentElement);
    window.addEventListener('resize', fit);
    return () => { ro.disconnect(); window.removeEventListener('resize', fit); };
  }, []);
  if (!chat.bridge) return null;
  const s = chat.state;
  const pill = s === 'listening' ? <span class="pill ok"><Dot kind="ok" />{t('chat.pillListening')}</span>
    : s === 'working' ? <span class="pill run"><Dot kind="run" pulse />{t('chat.pillWorking')}</span>
      : s === 'connected' ? <span class="pill ok"><Dot kind="ok" />{t('chat.pillConnected')}</span>
        : chat.known ? <span class="pill muted"><Dot />{t('chat.pillOff')}</span> : null;
  return (
    <div class="w chat" ref={box}>
      <div class="hd" style="align-items:center">
        <div class="hd-main"><h1 class="title">{t('chat.title')}</h1></div>
        {pill}
      </div>
      <Log chat={chat} />
      <Composer enabled={chat.canSend} chat={chat} />
    </div>
  );
}
