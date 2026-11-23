import { createContext } from 'preact';
import { useContext, useEffect, useState } from 'preact/hooks';
import type { ComponentChildren } from 'preact';
import type { Bridge, SendResult } from './bridge.js';
import type { RunStatus, StepType, ViewPayload, LangPref } from './types.js';
import { useI18n, type Key } from './i18n.js';

// ---------- navigation ----------

export interface Nav {
  bridge: Bridge;
  /** Open a view on top of the current one (Back returns). */
  push(p: ViewPayload): void;
  /** Replace the current view (e.g. after an action completes). */
  replace(p: ViewPayload): void;
  back(): void;
  canBack: boolean;
  /** Call a tool and show the view it returns. */
  open(tool: string, args?: Record<string, unknown>, mode?: 'push' | 'replace' | 'reset'): Promise<void>;
  /**
   * Does one thing the user asked for while nothing else in the widget can be pressed, so a second
   * click (on the same button or another) cannot start a second action. `open` does this itself.
   */
  lock<T>(work: () => Promise<T> | T): Promise<T>;
  /** Change the widget language now and remember it on the server. */
  setLang(pref: LangPref): Promise<void>;
  langPref: LangPref;
}

export const NavContext = createContext<Nav>(null as unknown as Nav);
export const useNav = () => useContext(NavContext);

// ---------- icons (16px, stroke = currentColor) ----------

const I = (d: ComponentChildren, size = 16) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">{d}</svg>
);

export const Icon = {
  check: () => I(<path d="M3.5 8.5l3 3 6-7" />),
  x: () => I(<path d="M4.5 4.5l7 7M11.5 4.5l-7 7" />),
  chevron: () => I(<path d="M6 4l4 4-4 4" />, 14),
  more: () => I(<g fill="currentColor" stroke="none"><circle cx="3.5" cy="8" r="1.3" /><circle cx="8" cy="8" r="1.3" /><circle cx="12.5" cy="8" r="1.3" /></g>),
  spinner: () => <svg class="spin" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M8 2a6 6 0 1 1-6 6" /></svg>,
  pause: () => I(<path d="M6 4v8M10 4v8" />),
  circle: () => I(<circle cx="8" cy="8" r="4.5" />),
  skip: () => I(<path d="M4 8h8" />),
  alert: () => I(<><path d="M8 2.5l6 11H2z" /><path d="M8 7v2.5M8 11.6v.1" /></>),
  upload: () => I(<path d="M8 11V3M4.5 6.5L8 3l3.5 3.5M3 13h10" />),
  play: () => I(<path d="M5 3.5v9l7-4.5z" />),
  sparkle: () => I(<path d="M8 2.5l1.3 3.2 3.2 1.3-3.2 1.3L8 11.5 6.7 8.3 3.5 7l3.2-1.3zM12.5 11l.6 1.4 1.4.6-1.4.6-.6 1.4-.6-1.4-1.4-.6 1.4-.6z" />),
  back: () => I(<path d="M10 4L6 8l4 4" />, 14),
  // step types
  navigate: () => I(<><circle cx="8" cy="8" r="5.5" /><path d="M2.5 8h11M8 2.5c1.8 1.8 1.8 9.2 0 11M8 2.5c-1.8 1.8-1.8 9.2 0 11" /></>),
  executeXpathCommand: () => I(<path d="M4 3l8 4.2-3.6 1.1L7 12z" />),
  javascript: () => I(<path d="M6 4c-1.5 0-1.5 1-1.5 2S4 8 3 8c1 0 1.5 0 1.5 2s0 2 1.5 2M10 4c1.5 0 1.5 1 1.5 2s.5 2 1.5 2c-1 0-1.5 0-1.5 2s0 2-1.5 2" />),
  extractData: () => I(<><rect x="2.5" y="3" width="11" height="10" rx="1.5" /><path d="M2.5 6.5h11M6.5 6.5V13" /></>),
  if: () => I(<><circle cx="4" cy="4" r="1.5" /><circle cx="12" cy="4" r="1.5" /><circle cx="8" cy="12.5" r="1.5" /><path d="M8 11V8.5L4 5.5M8 8.5l4-3" /></>),
  switch: () => I(<><circle cx="3.5" cy="8" r="1.5" /><path d="M5 8h2.5M7.5 8l5-4M7.5 8h5M7.5 8l5 4" /></>),
  delay: () => I(<><circle cx="8" cy="8" r="5.5" /><path d="M8 5v3.2l2 1.3" /></>),
  download: () => I(<path d="M8 3v7.5M4.5 7L8 10.5 11.5 7M3 13h10" />),
  // Ask Claude: a speech bubble with a spark.
  agent: () => I(<><path d="M3 4.5A1.5 1.5 0 0 1 4.5 3h7A1.5 1.5 0 0 1 13 4.5v5a1.5 1.5 0 0 1-1.5 1.5H7l-3 2.5V11h0A1 1 0 0 1 3 10z" /><path d="M8 5.2l.5 1.3 1.3.5-1.3.5L8 8.8l-.5-1.3-1.3-.5 1.3-.5z" /></>),
  manual: () => I(<path d="M5.5 8V4.2a1 1 0 0 1 2 0V7.5M7.5 7V3.2a1 1 0 0 1 2 0V7.5M9.5 7.5V4.5a1 1 0 0 1 2 0V9c0 2.5-1.5 4.5-4 4.5-1.8 0-2.7-.8-3.7-2.3L2.6 8.7a1 1 0 0 1 1.6-1.1l1.3 1.4" />),
};

export function StepTypeIcon({ type }: { type: StepType }) {
  const { t } = useI18n();
  return <span class="st pending" title={t(`stepType.${type}` as Key)}>{Icon[type]()}</span>;
}

export function StatusPill({ status }: { status: RunStatus }) {
  const { t } = useI18n();
  const cls: Record<RunStatus, string> = { running: 'run', waiting_manual: 'warn', waiting_agent: 'warn', success: 'ok', failure: 'bad', stopped: 'muted' };
  return <span class={`pill ${cls[status]}`}>{t(`status.${status}`)}</span>;
}

export function StatusDot({ status }: { status?: RunStatus }) {
  const { t } = useI18n();
  const cls = status === 'success' ? 'ok' : status === 'failure' ? 'bad' : status === 'running' ? 'run' : status === 'waiting_manual' || status === 'waiting_agent' ? 'warn' : '';
  return <span class={`dot ${cls}`} title={status ? t(`status.${status}`) : t('status.never')} />;
}

// ---------- layout pieces ----------

export function Header({ title, sub, right }: { title: string; sub?: ComponentChildren; right?: ComponentChildren }) {
  const nav = useNav();
  const { t } = useI18n();
  return (
    <>
      {nav.canBack && <button class="back" onClick={nav.back}>{t('common.back')}</button>}
      <div class="hd">
        <div class="hd-main">
          <h1 class="title">{title}</h1>
          {sub && <div class="sub">{sub}</div>}
        </div>
        {right}
      </div>
    </>
  );
}

export function Disclosure({ label, children, initial = false }: { label: string; children: ComponentChildren; initial?: boolean }) {
  const [open, setOpen] = useState(initial);
  return (
    <>
      <button class="disclosure" aria-expanded={open} onClick={() => setOpen(!open)}>{Icon.chevron()}{label}</button>
      {open && children}
    </>
  );
}

export function Menu({ items }: { items: { label: string; onClick: () => void }[] }) {
  const [open, setOpen] = useState(false);
  const { t } = useI18n();
  return (
    <div class="menu">
      <button class="icon-btn" aria-label={t('common.moreActions')} aria-expanded={open} onClick={() => setOpen(!open)}>{Icon.more()}</button>
      {open && (
        <div class="menu-pop" role="menu" onMouseLeave={() => setOpen(false)}>
          {items.map((it) => <button role="menuitem" onClick={() => { setOpen(false); it.onClick(); }}>{it.label}</button>)}
        </div>
      )}
    </div>
  );
}

/**
 * A step's screenshot, fetched with ui_get_screenshot when shown. Tool results only say one exists:
 * some hosts give the model the whole result, and a base64 image there costs tens of thousands of tokens.
 */
export function Screenshot({ runId, stepId, alt }: { runId: string; stepId: string; alt: string }) {
  const nav = useNav();
  const { t } = useI18n();
  const [src, setSrc] = useState<string>();
  const [zoom, setZoom] = useState(false);
  useEffect(() => {
    let live = true;
    setSrc(undefined);
    nav.bridge.call<{ dataUrl?: string | null }>('ui_get_screenshot', { runId, stepId })
      .then((r) => { if (live && !r.isError && r.payload.dataUrl) setSrc(r.payload.dataUrl); })
      .catch(() => { /* no screenshot */ });
    return () => { live = false; };
  }, [runId, stepId]);
  if (!src) return null;
  return (
    <button class={`shot${zoom ? ' open' : ''}`} onClick={() => setZoom(!zoom)} aria-label={zoom ? t('fail.collapse') : t('fail.expand')}>
      <img src={src} alt={alt} />
    </button>
  );
}

export function Note({ kind, children }: { kind: 'ok' | 'bad' | 'warn' | 'info'; children: ComponentChildren }) {
  const icon = kind === 'ok' ? Icon.check() : kind === 'info' ? Icon.circle() : Icon.alert();
  return <div class={`note ${kind}`} role={kind === 'bad' ? 'alert' : 'status'}>{icon}<div>{children}</div></div>;
}

/** Button that shows a spinner while its async handler runs. */
export function AsyncButton({ onClick, children, primary, ghost, disabled, 'aria-label': label }: {
  onClick: () => Promise<unknown> | void; children: ComponentChildren; primary?: boolean; ghost?: boolean; disabled?: boolean; 'aria-label'?: string;
}) {
  const nav = useNav();
  const [busy, setBusy] = useState(false);
  return (
    <button
      class={`btn${primary ? ' primary' : ''}${ghost ? ' ghost' : ''}`}
      aria-label={label}
      disabled={busy || disabled}
      onClick={async () => { setBusy(true); try { await nav.lock(onClick); } finally { setBusy(false); } }}
    >
      {busy && Icon.spinner()}{children}
    </button>
  );
}

/**
 * Hands work to Claude the way the MCP Apps SDK recommends: details go into the model's context
 * (updateModelContext), and the chat message stays a short trigger with no text taken from web
 * pages. Page content (errors, HTML) is something a site could craft to inject instructions, so
 * Claude reads it through tool results (get_failure, get_step) instead of as a user message.
 */
export async function askClaude(bridge: Bridge, message: string, context?: string): Promise<SendResult | undefined> {
  if (context) await bridge.updateContext(context).catch(() => {});
  return (await bridge.sendMessage(message)) ?? undefined;
}

/**
 * What became of a request to Claude. In the chat it is in the chat. In the side panel: sent to a Claude that
 * is open, or, with none open, the text to copy into Claude by hand.
 */
export function SentNote({ result, again }: { result?: SendResult; again?: () => void }) {
  const { t } = useI18n();
  const [copied, setCopied] = useState(false);
  const retry = again && <>{' '}<button class="link" onClick={again}>{t('ask.again')}</button></>;
  if (!result) return <Note kind="info">{t('ask.sent')}{retry}</Note>;
  if (result.delivered) return <Note kind="info">{t('panel.sent')}{retry}</Note>;
  return (
    <div class="note info" style="flex-direction:column;align-items:stretch;gap:8px">
      <div>{t('panel.noAi')}</div>
      <div style="display:flex;gap:6px">
        <input class="input" readOnly value={result.text} onFocus={(e) => (e.target as HTMLInputElement).select()} aria-label={t('panel.copy')} />
        <button class="btn" onClick={async () => {
          try { await navigator.clipboard.writeText(result.text); setCopied(true); } catch { /* the field is selectable */ }
        }}>{copied ? t('panel.copied') : t('panel.copy')}</button>
      </div>
    </div>
  );
}

/**
 * One-line request box that hands work to Claude via a chat message.
 * Suggestion chips fill the box (choices over typing); the user can still edit before sending.
 */
export function AskClaude({ message, context, placeholder, suggestions = [], label, allowEmpty = false, heading }: {
  /** The chat message: fixed wording + ids + what the user typed. Never page-derived text. */
  message: (text: string) => string;
  /** Details for Claude (English), sent as model context before the message. */
  context?: string;
  placeholder: string;
  suggestions?: string[];
  label?: string;
  allowEmpty?: boolean;
  /**
   * Names what the request is about, for a box about a whole view (a workflow, a draft, a run). Such a
   * box sits above the view's own main button, so its button is the quieter one.
   */
  heading?: string;
}) {
  const nav = useNav();
  const { t } = useI18n();
  const [text, setText] = useState('');
  const [sent, setSent] = useState<{ result?: SendResult }>();

  if (sent) return <SentNote result={sent.result} again={() => { setText(''); setSent(undefined); }} />;

  const send = async () => {
    setSent({ result: await askClaude(nav.bridge, message(text.trim()), context) });
  };

  return (
    <div class={`ask${heading ? ' ask-view' : ''}`}>
      {heading && <div class="ask-title">{heading}</div>}
      {suggestions.length > 0 && !text && (
        <div class="chips">
          {suggestions.map((s) => <button class="chip" onClick={() => setText(s)}>{s}</button>)}
        </div>
      )}
      <div class="ask-row">
        <input
          class="input"
          value={text}
          placeholder={placeholder}
          aria-label={placeholder}
          onInput={(e) => setText((e.target as HTMLInputElement).value)}
          onKeyDown={(e) => { if (e.key === 'Enter' && (text.trim() || allowEmpty)) send(); }}
        />
        <AsyncButton primary={!heading} disabled={!text.trim() && !allowEmpty} onClick={send}>{Icon.sparkle()}{label ?? t('ask.button')}</AsyncButton>
      </div>
    </div>
  );
}
