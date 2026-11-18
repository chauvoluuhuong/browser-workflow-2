import { useState } from 'preact/hooks';
import type { AccountInfo, LimitCode, LangPref, StepChange, VersionEntry, VersionEvent } from '../types.js';
import { AsyncButton, Header, Icon, Note, useNav } from '../components.js';
import { useI18n, type Key, type T } from '../i18n.js';

// ---------- proposed change: fix for a failed run, or an edit asked on a step (F7) ----------

export function ChangeView(p: { workflowId: string; workflowName: string; fromVersion: number; reason: string; changes: StepChange[]; pendingId: string; isFix: boolean }) {
  const nav = useNav();
  const { t } = useI18n();
  const [discarded, setDiscarded] = useState(false);
  if (discarded) {
    return <div class="w"><Note kind="info">{t(p.isFix ? 'chg.discardedFix' : 'chg.discardedChange', { name: p.workflowName, v: p.fromVersion })}</Note></div>;
  }
  return (
    <div class="w">
      <Header title={t(p.isFix ? 'chg.fixTitle' : 'chg.changeTitle')} sub={`${p.workflowName} · v${p.fromVersion} → v${p.fromVersion + 1}`} />
      <div style="font-size:13px">{p.reason}</div>
      <div class="list">
        {p.changes.map((c) => (
          <div class="row-wrap" style="padding:8px 10px;display:flex;flex-direction:column;gap:6px">
            <div class="row-title">{c.stepName} <span class="tag">{t(`chg.${c.kind}`)}</span></div>
            <div class="diff">
              {c.before && <div class="del" aria-label={t('chg.before')}>{c.before}</div>}
              {c.after && <div class="add" aria-label={t('chg.after')}>{c.after}</div>}
            </div>
          </div>
        ))}
      </div>
      <div class="actions">
        <AsyncButton ghost onClick={async () => { await nav.bridge.call('ui_discard_change', { pendingId: p.pendingId }); setDiscarded(true); }}>{t('chg.discard')}</AsyncButton>
        <AsyncButton primary onClick={() => nav.open('ui_apply_change', { pendingId: p.pendingId }, 'replace')}>{Icon.play()}{t('chg.apply')}</AsyncButton>
      </div>
    </div>
  );
}

// ---------- extracted data (F6) ----------

function toCsv(columns: string[], rows: Record<string, unknown>[]) {
  const esc = (v: unknown) => {
    const s = v === null || v === undefined ? '' : typeof v === 'object' ? JSON.stringify(v) : String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  return [columns.join(','), ...rows.map((r) => columns.map((c) => esc(r[c])).join(','))].join('\n');
}

export function DataView(p: { runId: string; workflowName: string; columns: string[]; rows: Record<string, unknown>[]; total: number }) {
  const nav = useNav();
  const { t } = useI18n();
  const [all, setAll] = useState(false);
  const cols = p.columns.slice(0, 3);
  const rows = all ? p.rows : p.rows.slice(0, 5);
  const base = p.workflowName.toLowerCase().replace(/\W+/g, '-');
  return (
    <div class="w">
      <Header title={t('data.items', { n: p.total })} sub={`${p.workflowName} · ${p.runId}`} />
      <div class="tbl-wrap">
        <table>
          <thead><tr>{cols.map((c) => <th>{c}</th>)}</tr></thead>
          <tbody>{rows.map((r) => <tr>{cols.map((c) => <td title={String(r[c] ?? '')}>{String(r[c] ?? '')}</td>)}</tr>)}</tbody>
        </table>
      </div>
      {(p.rows.length > 5 && !all) || p.columns.length > 3 ? (
        <div class="actions" style="justify-content:flex-start">
          {p.rows.length > 5 && !all && <button class="link" onClick={() => setAll(true)}>{t('common.showAll', { n: p.total })}</button>}
          {p.columns.length > 3 && <span class="muted">{t('data.extraCols', { n: p.columns.length - 3 })}</span>}
        </div>
      ) : null}
      <div class="actions">
        <AsyncButton ghost onClick={() => nav.bridge.download(`${base}.json`, 'application/json', JSON.stringify(p.rows, null, 2))}>{t('data.json')}</AsyncButton>
        <AsyncButton primary onClick={() => nav.bridge.download(`${base}.csv`, 'text/csv', toCsv(p.columns, p.rows))}>{t('data.csv')}</AsyncButton>
      </div>
    </div>
  );
}

// ---------- version history (F8) ----------

function eventText(e: VersionEvent, t: T) {
  switch (e.kind) {
    case 'initial': return t('hist.ev.initial');
    case 'create': return t('hist.ev.create');
    case 'import': return e.file ? t('hist.ev.import', { file: e.file }) : t('hist.ev.importNoFile');
    case 'restore': return t('hist.ev.restore', { from: e.from });
    case 'change': {
      const [first, ...rest] = e.steps;
      if (!first) return t('hist.ev.update', { name: '' });
      return t(`hist.ev.${first.kind}`, { name: first.name }) + (rest.length ? t('hist.ev.more', { n: rest.length }) : '');
    }
  }
}

export function HistoryView(p: { workflowId: string; workflowName: string; versions: VersionEntry[] }) {
  const nav = useNav();
  const { t, ago } = useI18n();
  const [sel, setSel] = useState<number>();
  const [all, setAll] = useState(false);
  const shown = all ? p.versions : p.versions.slice(0, 5);
  return (
    <div class="w">
      <Header title={t('hist.title')} sub={p.workflowName} />
      <div class="list">
        {shown.map((v) => (
          <div class="row-wrap">
            <button class="row" disabled={v.current} aria-expanded={sel === v.version} onClick={() => setSel(sel === v.version ? undefined : v.version)}>
              <span class="tag" style="flex:none">v{v.version}</span>
              <div class="row-main">
                <div class="row-title">{eventText(v.event, t)}</div>
                <div class="row-sub">{t(`hist.who.${v.author}`)} · {ago(v.at)}</div>
              </div>
              {v.current ? <span class="pill ok">{t('hist.current')}</span> : <span class="st pending">{Icon.chevron()}</span>}
            </button>
            {sel === v.version && (
              <div class="row-expand" style="padding-left:10px;align-items:flex-end">
                <AsyncButton primary onClick={() => nav.open('ui_restore_version', { id: p.workflowId, version: v.version }, 'replace')}>{t('hist.restore', { v: v.version })}</AsyncButton>
              </div>
            )}
          </div>
        ))}
        {!all && p.versions.length > 5 && <button class="more" onClick={() => setAll(true)}>{t('common.showAll', { n: p.versions.length })}</button>}
      </div>
      {p.versions.length === 1 && <div class="muted">{t('hist.onlyOne')}</div>}
    </div>
  );
}

// ---------- language picker (account + setup) ----------

/** Full picker (Auto / English / Tiếng Việt), or a compact EN | VI toggle for headers. */
export function LanguagePicker({ compact = false }: { compact?: boolean }) {
  const nav = useNav();
  const { t, lang } = useI18n();
  const opts: LangPref[] = compact ? ['en', 'vi'] : ['auto', 'en', 'vi'];
  const pressed = (o: LangPref) => (compact ? lang === o : nav.langPref === o);
  return (
    <div class={`seg${compact ? ' seg-sm' : ''}`} role="group" aria-label={t('lang.label')}>
      {opts.map((o) => (
        <button aria-pressed={pressed(o)} onClick={() => nav.setLang(o)} title={o === 'auto' ? undefined : t(`lang.${o}`)}>
          {compact ? o.toUpperCase() : t(`lang.${o}`)}
        </button>
      ))}
    </div>
  );
}

// ---------- account (F10, placeholder for M3) ----------

type AccountProps = { account: AccountInfo; limit?: { code: LimitCode; arg?: string }; retry?: { tool: string; args: Record<string, unknown> } };

export function AccountView(p: AccountProps) {
  return p.account.page === undefined ? <LocalAccountView account={p.account} /> : <AccountCard {...p} />;
}

/** How much of one limit is used, as a bar. */
function Meter({ label, used, limit }: { label: string; used: number; limit: number }) {
  return (
    <div class="meter">
      <div class="meter-top"><span>{label}</span><span>{limit ? `${used} / ${limit}` : used}</span></div>
      {limit > 0 && <div class={`bar${used / limit > 0.9 ? ' bad' : ''}`}><i style={{ width: `${Math.min(100, (used / limit) * 100)}%` }} /></div>}
    </div>
  );
}

/** A limit was reached: what it was, the meter that is full, and what upgrading does. */
function LimitNotice({ a, limit, upgrade }: { a: AccountInfo; limit: { code: LimitCode; arg?: string }; upgrade: boolean }) {
  const { t } = useI18n();
  const u = a.usage;
  const meter = limit.code.startsWith('limit_runs_') ? <Meter label={t(`acct.runs.${u.period}`)} used={u.runs} limit={u.runsLimit} />
    : limit.code.startsWith('limit_steps_') && u.steps !== undefined ? <Meter label={t(`acct.steps.${u.period}`)} used={u.steps} limit={u.stepsLimit ?? 0} />
    : limit.code === 'limit_workflows' ? <Meter label={t('acct.workflows')} used={u.workflows} limit={u.workflowsLimit} />
    : null;
  return (
    <>
      <Note kind="warn">{t(`error.${limit.code}` as Key, { arg: limit.arg ?? '' })}{upgrade ? ` ${t('acct.limitUpgrade')}` : ''}</Note>
      {meter && <div class="stack">{meter}</div>}
    </>
  );
}

/**
 * Hosted: who the user is, their plan, and one button. Before signing up it opens the page to create
 * an account or log in; on the free plan it is Upgrade; on Pro it opens the account page. Usage, the
 * password and the language are on that page, not here.
 */
function AccountCard({ account: a, limit, retry }: AccountProps) {
  const nav = useNav();
  const { t } = useI18n();
  const paid = a.plan === 'paid';
  // After Upgrade (on our site), what the limit refused can be tried again from here.
  const [upgraded, setUpgraded] = useState(false);
  const openPage = async () => {
    const r = await nav.bridge.call<{ url?: string }>('ui_account_page');
    if (r.payload.url) await nav.bridge.openLink(r.payload.url);
  };
  if (a.anonymous) {
    return (
      <div class="w">
        <Header title={t('acct.title')} sub={t('acct.trying')} right={<LanguagePicker compact />} />
        {limit && <LimitNotice a={a} limit={limit} upgrade={false} />}
        <div class="muted">{t('acct.tryingHint')}</div>
        <div class="actions">
          <AsyncButton primary onClick={async () => {
            const r = await nav.bridge.call<{ url?: string }>('ui_account_link');
            if (r.payload.url) await nav.bridge.openLink(r.payload.url);
          }}>{t('acct.createOrLogin')}</AsyncButton>
        </div>
      </div>
    );
  }
  const upgrade = !paid && a.links?.upgrade;
  return (
    <div class="w">
      <Header
        title={a.name || t('acct.title')}
        sub={!paid ? t('acct.planFree') : a.paidUntil ? t('acct.until', { date: a.paidUntil.slice(0, 10) }) : t('acct.planLife')}
        right={a.page ? <span class={`pill ${paid ? 'ok' : 'muted'}`}>{paid ? t('acct.pro') : t('acct.free')}</span> : <LanguagePicker compact />}
      />
      {limit && <LimitNotice a={a} limit={limit} upgrade={!!upgrade} />}
      {limit && retry && upgraded && (
        <div class="actions"><AsyncButton onClick={() => nav.open(retry.tool, retry.args, 'replace')}>{t('acct.tryAgain')}</AsyncButton></div>
      )}
      {(upgrade || a.page) && (
        <div class="actions">
          {upgrade && a.page && <button class="link" style="margin-right:auto" onClick={openPage}>{t('acct.details')}</button>}
          {upgrade
            ? <AsyncButton primary onClick={async () => { await nav.bridge.openLink(a.links!.upgrade!); setUpgraded(true); }}>{t('acct.upgrade')}</AsyncButton>
            : <AsyncButton onClick={openPage}>{t('acct.details')}</AsyncButton>}
        </div>
      )}
    </div>
  );
}

/** The local build: there is no site to go to, so usage, storage and the language are all here. */
function LocalAccountView({ account: a }: { account: AccountInfo }) {
  const nav = useNav();
  const { t } = useI18n();
  const meter = (label: string, used: number, limit: number) => <Meter label={label} used={used} limit={limit} />;
  // Browser Workflow keeps everything in Chrome, on this computer.
  const storage = t('acct.storage.computer');
  const local = a.storage.kind === 'computer' ? a.storage : undefined;
  return (
    <div class="w">
      <Header title={t('acct.title')} sub={a.anonymous ? t('acct.anonymous') : [a.name, a.paidUntil ? t('acct.until', { date: a.paidUntil.slice(0, 10) }) : ''].filter(Boolean).join(' · ') || undefined} right={<span class={`pill ${a.plan === 'paid' ? 'ok' : 'muted'}`}>{a.plan === 'paid' ? t('acct.pro') : t('acct.free')}</span>} />
      <div class="stack">
        {meter(t(`acct.runs.${a.usage.period}`), a.usage.runs, a.usage.runsLimit)}
        {a.usage.steps !== undefined && meter(t(`acct.steps.${a.usage.period}`), a.usage.steps, a.usage.stepsLimit ?? 0)}
        {meter(t('acct.workflows'), a.usage.workflows, a.usage.workflowsLimit)}
      </div>
      <div class="list">
        {a.anonymous && <CreateAccountRow />}
        <div class="row"><div class="row-main"><div class="row-sub">{t('acct.storedIn')}</div><div class="row-title">{storage}</div>
          {a.retentionDays ? <div class="row-sub">{t('acct.retention', { n: a.retentionDays })}</div> : null}
          {local ? <div class="row-sub" style="white-space:normal">{t('acct.storage.computerNote')}</div> : null}
          {local ? <div class="row-sub" style="white-space:normal">{t('acct.keepRuns', { n: local.keepRuns })}{local.bytes !== undefined ? ` · ${t('acct.localUsed', { mb: Math.round(local.bytes / 1024 / 1024), n: local.runs ?? 0 })}` : ''}</div> : null}</div></div>
        {local?.warn && <Note kind="warn">{t('acct.localWarn')}</Note>}
      </div>
      <div class="field">
        <label>{t('lang.label')}</label>
        <LanguagePicker />
      </div>
      <div class="actions">
        {(a.plan === 'free' || a.paidUntil) && a.links?.upgrade ? (
          <AsyncButton primary onClick={() => nav.bridge.openLink(a.links!.upgrade!)}>{t('acct.upgrade')}</AsyncButton>
        ) : a.plan === 'paid' && a.links?.manage ? (
          <AsyncButton onClick={() => nav.bridge.openLink(a.links!.manage!)}>{t('acct.manage')}</AsyncButton>
        ) : null}
      </div>
    </div>
  );
}

/**
 * Hosted, anonymous accounts: opens the page on our site where the user picks a username and
 * password. The account stays the same one, so nothing is lost; the password is never typed here.
 */
export function CreateAccountRow({ onOpened }: { onOpened?: () => void }) {
  const nav = useNav();
  const { t } = useI18n();
  const [opened, setOpened] = useState(false);
  return (
    <div class="row" style="flex-direction:column;align-items:stretch;gap:8px">
      <div class="row-main">
        <div class="row-title">{t('acct.createTitle')}</div>
        <div class="row-sub" style="white-space:normal">{t(opened ? 'acct.createOpened' : 'acct.createHint')}</div>
      </div>
      <div>
        <AsyncButton primary={!opened} onClick={async () => {
          const r = await nav.bridge.call<{ url?: string }>('ui_account_link');
          if (!r.payload.url) return;
          await nav.bridge.openLink(r.payload.url);
          setOpened(true);
          onOpened?.();
        }}>{t(opened ? 'acct.createAgain' : 'acct.create')}</AsyncButton>
      </div>
    </div>
  );
}
