import { useEffect, useMemo, useRef, useState } from 'preact/hooks';
import type { ComponentChildren } from 'preact';
import type { LangPref, ViewPayload } from './types.js';
import type { Bridge } from './bridge.js';
import { AsyncButton, NavContext, Note, useNav, type Nav } from './components.js';
import { I18nContext, makeI18n, resolveLang, useI18n } from './i18n.js';
import { LibraryView } from './views/library.js';
import { WorkflowView } from './views/workflow.js';
import { ImportView, DraftView } from './views/importDraft.js';
import { RunSetupView, RunView, FailureView } from './views/run.js';
import { ChangeView, DataView, HistoryView, AccountView, CreateAccountRow } from './views/misc.js';
import { RunsView, StepRunView } from './views/runs.js';
import { GetExtension, SetupView } from './views/setup.js';
import { ChatView, isChat } from './views/chat.js';

/**
 * An anonymous account reached what it can do without signing up. Not an error to the user: one
 * button opens the create-account page, and Continue then makes the refused call again.
 */
function AccountNeeded({ arg, retry }: Extract<ViewPayload, { view: 'error' }>) {
  const nav = useNav();
  const { t } = useI18n();
  const [opened, setOpened] = useState(false);
  return (
    <div class="w">
      <Note kind="info">{t(arg === 'workflows' ? 'need.workflows' : 'need.runs')}</Note>
      <div class="list"><CreateAccountRow onOpened={() => setOpened(true)} /></div>
      {opened && (
        <div class="actions">
          {/* A call the widget made is made again; one Claude made is Claude's to repeat. */}
          <AsyncButton primary onClick={() => (retry ? nav.open(retry.tool, retry.args, 'replace') : nav.bridge.sendMessage(t('need.message')))}>{t('need.continue')}</AsyncButton>
        </div>
      )}
    </div>
  );
}

const LIMITS = ['limit_steps', 'limit_runs_day', 'limit_runs_year', 'limit_steps_day', 'limit_steps_year', 'limit_workflows'];

function ErrorView(p: Extract<ViewPayload, { view: 'error' }>) {
  const { message, code, arg } = p;
  const nav = useNav();
  const { t } = useI18n();
  if (code === 'account_needed') return <AccountNeeded {...p} />;
  // Chrome is closed, or the extension isn't there: how to get it running, and a way to try again.
  if ((code as string) === 'not_running') return <div class="w"><GetExtension link={p.link} /></div>;
  return (
    <div class="w">
      <Note kind="bad">{code ? t(`error.${code}` as any, { arg }) : message}</Note>
      {code && LIMITS.includes(code) && <button class="link" style="align-self:flex-start" onClick={() => nav.open('show_account', {}, 'push')}>{t('br.seePlans')}</button>}
    </div>
  );
}

function View({ p }: { p: ViewPayload }) {
  // The side panel's Claude chat (not a tool's view; ChatView draws nothing outside the panel).
  if (isChat(p)) return <ChatView />;
  switch (p.view) {
    case 'setup': return <SetupView {...p} />;
    case 'library': return <LibraryView {...p} />;
    case 'workflow': return <WorkflowView {...p} />;
    case 'import': return <ImportView {...p} />;
    case 'draft': return <DraftView {...p} />;
    case 'runSetup': return <RunSetupView {...p} />;
    case 'run': return <RunView run={p.run} />;
    case 'failure': return <FailureView run={p.run} inspecting={p.inspecting} />;
    case 'change': return <ChangeView {...p} />;
    case 'runs': return <RunsView {...p} />;
    case 'stepRun': return <StepRunView {...p} />;
    case 'data': return <DataView {...p} />;
    case 'history': return <HistoryView {...p} />;
    case 'account': return <AccountView {...p} />;
    case 'error': return <ErrorView {...p} />;
    default: return null;
  }
}

/** The longest one action keeps the widget from taking clicks. */
const LOCK_MAX_MS = 45_000;
/** How often a proposal on screen is looked at again: the user may approve it in the other place. */
export const PROPOSAL_REREAD_MS = 3_000;

/** The proposal a view shows and waits on, if any. */
export function pendingOf(p?: ViewPayload): string | undefined {
  if (!p) return undefined;
  if (p.view === 'draft' || p.view === 'change') return p.pendingId;
  if (p.view === 'import') return p.pendingId;
  return undefined;
}

export interface WidgetProps {
  bridge: Bridge;
  /** The side panel: the first view to open (its Home). */
  start?: { tool: string; args?: Record<string, unknown> };
  /** The side panel: drawn above the views (the Home button and the "waiting for your approval" badge). */
  top?: (nav: Nav, current: ViewPayload | undefined) => ComponentChildren;
}

export function Widget({ bridge, start, top: drawTop }: WidgetProps) {
  // Every pushed view stays mounted (hidden) until you go back past it, so Back restores it exactly
  // as you left it: expanded sections, tabs, scroll, typed text. `key` changes only on push/replace/reset.
  const [stack, setStack] = useState<{ key: number; p: ViewPayload }[]>([]);
  const nextKey = useRef(0);
  const [error, setError] = useState<string>();
  const [langPref, setLangPref] = useState<LangPref>('auto');
  // How many of the user's actions are under way. While there is one, the widget takes no clicks.
  const [working, setWorking] = useState(0);
  const busy = useRef(0);
  busy.current = working;

  const show = (p: ViewPayload, mode: 'reset' | 'push' | 'replace') => {
    if (p.lang) setLangPref(p.lang);
    const entry = { key: nextKey.current++, p };
    setStack((s) => (mode === 'reset' ? [entry] : mode === 'push' ? [...s, entry] : [...s.slice(0, -1), entry]));
  };

  useEffect(() => bridge.onPayload((p) => { setError(undefined); show(p, 'reset'); }), [bridge]);

  const i18n = useMemo(() => makeI18n(resolveLang(langPref, bridge.hostLocale()), bridge.hostName()), [langPref, bridge]);

  // One thing the user asked for at a time: while it is under way the widget takes no clicks.
  const lock = async <T,>(work: () => Promise<T> | T): Promise<T> => {
    let held = true;
    const release = () => { if (held) { held = false; setWorking((n) => Math.max(0, n - 1)); } };
    setWorking((n) => n + 1);
    // An answer that never comes must not leave the widget dead.
    const giveUp = setTimeout(release, LOCK_MAX_MS);
    try {
      return await work();
    } finally {
      clearTimeout(giveUp);
      release();
    }
  };

  const nav = useMemo<Omit<Nav, 'canBack'>>(() => ({
    bridge,
    langPref,
    push: (p) => show(p, 'push'),
    replace: (p) => show(p, 'replace'),
    back: () => setStack((s) => (s.length > 1 ? s.slice(0, -1) : s)),
    lock,
    open: (tool, args = {}, mode = 'push') => lock(async () => {
      setError(undefined);
      try {
        const r = await bridge.call<ViewPayload>(tool, args);
        if (!r.payload || !('view' in r.payload)) throw new Error(r.text || 'Unexpected response');
        if (r.payload.view === 'error' && r.payload.code === 'account_needed') {
          // "Create an account first": remember the call, so the card can make it again afterwards. The
          // card goes on top of the view it came from (a still-valid proposal isn't lost), or replaces
          // an earlier card.
          const entry = { key: nextKey.current++, p: { ...r.payload, retry: { tool, args } } as ViewPayload };
          const isCard = (p?: ViewPayload) => p?.view === 'error' && p.code === 'account_needed';
          setStack((s) => (isCard(s[s.length - 1]?.p) ? [...s.slice(0, -1), entry] : [...s, entry]));
          return;
        }
        if (r.payload.view === 'account' && r.payload.limit) {
          // A plan limit: the account card, with Upgrade, goes on top of the view it came from (Back
          // returns to it), or replaces an earlier one, and keeps the call to make again after upgrading.
          const entry = { key: nextKey.current++, p: { ...r.payload, retry: { tool, args } } as ViewPayload };
          const isCard = (p?: ViewPayload) => p?.view === 'account' && !!p.limit;
          setStack((s) => (isCard(s[s.length - 1]?.p) ? [...s.slice(0, -1), entry] : [...s, entry]));
          return;
        }
        show(r.payload, mode);
      } catch (e: any) {
        setError(e?.message ?? String(e));
      }
    }),
    async setLang(pref) {
      setLangPref(pref);
      await bridge.call('ui_set_language', { lang: pref });
    },
  }), [bridge, langPref]);

  const top = stack[stack.length - 1];
  useEffect(() => bridge.setCurrent?.(top?.p), [top?.key]);

  // The side panel opens on its Home.
  useEffect(() => {
    if (start) void nav.open(start.tool, start.args ?? {}, 'replace');
  }, []);

  // A proposal can be approved here or in the other place (chat or side panel): it lives in the extension.
  // While one is on screen it is looked at again every few seconds, when the view comes back into sight, and
  // (side panel) when the extension says a proposal changed. Once it was decided, the outcome replaces it.
  const pending = pendingOf(top?.p);
  const topKey = top?.key;
  useEffect(() => {
    if (!pending) return;
    let over = false;
    let asking = false;
    const reread = async () => {
      if (asking || busy.current > 0 || document.visibilityState === 'hidden') return;
      asking = true;
      try {
        const r = await bridge.call<ViewPayload>('ui_proposal', { pendingId: pending });
        if (over || busy.current > 0 || !r.payload || !('view' in r.payload)) return;
        // Still waiting: nothing to change (redrawing would lose what the user typed).
        if (pendingOf(r.payload) === pending) return;
        const entry = { key: nextKey.current++, p: r.payload };
        setStack((s) => (s[s.length - 1]?.key === topKey ? [...s.slice(0, -1), entry] : s));
      } catch { /* an older extension, or Chrome closed: the next tick asks again */ } finally {
        asking = false;
      }
    };
    const timer = setInterval(reread, PROPOSAL_REREAD_MS);
    const onVisible = () => { if (document.visibilityState === 'visible') void reread(); };
    document.addEventListener('visibilitychange', onVisible);
    const off = bridge.onEvent?.('proposal.update', (d) => { if (!d?.pendingId || d.pendingId === pending) void reread(); });
    return () => {
      over = true;
      clearInterval(timer);
      document.removeEventListener('visibilitychange', onVisible);
      off?.();
    };
  }, [pending, topKey, bridge]);

  const navValue = { ...nav, canBack: stack.length > 1 };

  return (
    <I18nContext.Provider value={i18n}>
      <NavContext.Provider value={navValue}>
        {/* inert: no clicks and no keyboard while an action is under way; the bar says something is happening. */}
        <div lang={i18n.lang} class={working ? 'is-working' : undefined} inert={working > 0} aria-busy={working > 0}>
          {working > 0 && <div class="working-bar" role="progressbar" aria-label={i18n.t('common.loading')}><i /></div>}
          {drawTop?.(navValue, top?.p)}
          {error && <div class="w" style="padding-bottom:0"><Note kind="bad">{error}</Note></div>}
          {top ? stack.map((e, i) => (
            <div key={e.key} hidden={i !== stack.length - 1}><View p={e.p} /></div>
          )) : (
            <div class="w" aria-busy="true" aria-label={i18n.t('common.loading')}>
              <div class="skel" style="width:55%;height:18px" />
              <div class="skel" />
              <div class="skel" />
            </div>
          )}
        </div>
      </NavContext.Provider>
    </I18nContext.Provider>
  );
}
