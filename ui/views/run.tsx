import { useEffect, useRef, useState } from 'preact/hooks';
import type { BrowserConfig, FailureInfo, RunState, SavedFile, StepProgress, VariableField, WorkflowDetail, ViewPayload } from '../types.js';
import { askClaude, AskClaude, AsyncButton, Disclosure, Header, Icon, Note, Screenshot, StatusPill, useNav } from '../components.js';
import { useI18n, type T } from '../i18n.js';
import { DraftSave } from './importDraft.js';

/** Localized one-line reason; falls back to the engine's raw message for unknown error types. */
export function failureText(f: { errorType?: string; type?: string; target?: string; timeoutMs?: number; reason?: string; raw?: string }, t: T) {
  const type = f.errorType ?? f.type;
  const s = f.timeoutMs ? Math.round(f.timeoutMs / 1000) : undefined;
  if (type === 'cant_get_web_element_xpath' && f.target) return t('err.notFound', { target: f.target, s });
  if (type === 'timeout' && f.target === 'run_limit' && f.timeoutMs) return t('err.runLimit', { m: Math.round(f.timeoutMs / 6000) / 10 });
  if (type === 'timeout' && s) return t('err.timeout', { s });
  return f.reason ?? f.raw ?? '';
}

// ---------- run setup (F4) ----------

export function RunSetupView({ workflow: wf, draft }: { workflow: WorkflowDetail; browser?: BrowserConfig; draft?: { pendingId: string } }) {
  const nav = useNav();
  const { t } = useI18n();
  const init = Object.fromEntries(wf.variables.map((v) => [v.name, v.default ?? (v.type === 'boolean' ? false : '')]));
  const [values, setValues] = useState<Record<string, unknown>>(init);
  const [touched, setTouched] = useState(false);
  const required = wf.variables.filter((v) => v.required);
  const optional = wf.variables.filter((v) => !v.required);
  const missing = required.filter((v) => values[v.name] === '' || values[v.name] === undefined);

  async function start() {
    setTouched(true);
    if (missing.length) return;
    const vars = Object.fromEntries(Object.entries(values).map(([k, v]) => {
      const f = wf.variables.find((x) => x.name === k);
      return [k, f?.type === 'number' && v !== '' ? Number(v) : v];
    }));
    // A proposal not saved yet is tested as it is; a saved workflow runs its current version.
    await nav.open(draft ? 'ui_test_draft' : 'run_workflow', draft ? { pendingId: draft.pendingId, variables: vars } : { id: wf.id, variables: vars }, 'replace');
  }

  const field = (v: VariableField) =>
    v.type === 'boolean' ? (
      <label class="check">
        <input type="checkbox" checked={!!values[v.name]} onChange={(e) => setValues({ ...values, [v.name]: (e.target as HTMLInputElement).checked })} />
        {v.title}
      </label>
    ) : (
      <div class="field">
        <label for={`v-${v.name}`}>{v.title}{v.required ? '' : ` ${t('setupRun.optional')}`}</label>
        <input
          id={`v-${v.name}`}
          class={`input${touched && v.required && missing.includes(v) ? ' invalid' : ''}`}
          type={v.type === 'number' ? 'number' : 'text'}
          value={String(values[v.name] ?? '')}
          placeholder={v.description}
          onInput={(e) => setValues({ ...values, [v.name]: (e.target as HTMLInputElement).value })}
        />
        {touched && v.required && missing.includes(v) && <span class="err">{t('setupRun.required')}</span>}
      </div>
    );

  return (
    <div class="w">
      <Header title={t('setupRun.title', { name: wf.name })} sub={draft ? `${t('draft.testing')} · ${t('lib.steps', { n: wf.steps.length })}` : t('setupRun.sub', { v: wf.version, n: wf.steps.length })} />
      <div class="stack">
        {required.map(field)}
        {optional.length > 0 && (
          <Disclosure label={t('setupRun.more', { n: optional.length })} initial={required.length === 0}>
            <div class="stack">{optional.map(field)}</div>
          </Disclosure>
        )}
      </div>
      <div class="actions">
        <AsyncButton primary onClick={start}>{Icon.play()}{t(draft ? 'draft.startTest' : 'setupRun.start')}</AsyncButton>
      </div>
      {draft && <DraftSave draft={{ pendingId: draft.pendingId, name: wf.name }} />}
    </div>
  );
}

// ---------- run progress (F4–F6) ----------

function StepRow({ s, index, isStopAfter, runId }: { s: StepProgress; index: number; isStopAfter: boolean; runId: string }) {
  const nav = useNav();
  const { t, dur } = useI18n();
  const icon =
    s.state === 'ok' ? <span class="st ok">{Icon.check()}</span> :
    s.state === 'failed' ? <span class="st bad">{Icon.x()}</span> :
    s.state === 'running' ? <span class="st run">{Icon.spinner()}</span> :
    s.state === 'waiting' ? <span class="st warn">{Icon.pause()}</span> :
    s.state === 'skipped' ? <span class="st pending">{Icon.skip()}</span> :
    <span class="st pending">{Icon.circle()}</span>;
  const cls = s.state === 'pending' || s.state === 'skipped' ? ' is-pending' : s.state === 'running' || s.state === 'waiting' ? ' is-active' : s.state === 'failed' ? ' is-failed' : '';
  const ran = s.state === 'ok' || s.state === 'failed';
  const body = (
    <>
      <span class="num">{index + 1}</span>
      {icon}
      <div class="row-main"><div class="row-title">{s.stepName}</div></div>
      {isStopAfter && <span class="tag">{t('run.testStop')}</span>}
      <span class="row-meta">{ran ? dur(s.durationMs) : ''}</span>
      {ran && <span class="st pending">{Icon.chevron()}</span>}
    </>
  );
  // Steps that ran open their details (screenshot, output, Ask Claude).
  const row = ran
    ? <button class={`row${cls}`} onClick={() => nav.open('show_step', { runId, stepId: s.stepId }, 'push')}>{body}</button>
    : <div class={`row${cls}`}>{body}</div>;
  if (!s.download) return row;
  return <div class="row-wrap">{row}<div class="row-expand" style="padding-left:44px"><SavedFileRow file={s.download} runId={runId} stepId={s.stepId} /></div></div>;
}

/** "12.4 MB": a size people read. */
export function size(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  const units = ['KB', 'MB', 'GB'];
  let v = bytes / 1024;
  let i = 0;
  while (v >= 1024 && i < units.length - 1) { v /= 1024; i++; }
  return `${v >= 10 ? Math.round(v) : Math.round(v * 10) / 10} ${units[i]}`;
}

/**
 * A download step's file: its progress while it saves, then its name and size with "Show in folder" (Chrome
 * opens the Downloads folder with the file selected, on the computer the run is on).
 */
export function SavedFileRow({ file, runId, stepId }: { file: SavedFile; runId: string; stepId: string }) {
  const nav = useNav();
  const { t } = useI18n();
  const [gone, setGone] = useState(false);
  const name = [file.folder, file.fileName].filter(Boolean).join('/');
  if (!file.done) {
    const got = file.received ?? file.bytes;
    const pct = file.total ? Math.min(100, Math.round((got / file.total) * 100)) : undefined;
    return (
      <div class="stack" style="gap:4px;width:100%">
        <div class="row-sub">{t('dl.saving', { name })} {file.total ? `${size(got)} / ${size(file.total)}` : size(got)}</div>
        <div class="bar">{pct !== undefined ? <i style={{ width: `${pct}%` }} /> : <i style={{ width: '30%' }} />}</div>
      </div>
    );
  }
  return (
    <div style="display:flex;gap:8px;align-items:center;width:100%">
      <div class="row-main">
        <div class="row-title" title={name}>{t('dl.saved', { name })}</div>
        <div class="row-sub">{gone ? t('dl.gone') : size(file.bytes)}</div>
      </div>
      <AsyncButton onClick={async () => {
        const r = await nav.bridge.call<{ shown?: boolean }>('ui_show_file', { runId, stepId });
        setGone(!r.payload?.shown);
      }}>{t('dl.show')}</AsyncButton>
    </div>
  );
}

/** The files the run's download steps saved, each with Show in folder. */
function SavedFiles({ run }: { run: RunState }) {
  const files = run.steps.filter((s) => s.download);
  if (!files.length) return null;
  return <div class="list">{files.map((s) => <div class="row"><SavedFileRow file={s.download!} runId={run.runId} stepId={s.stepId} /></div>)}</div>;
}

/** Keeps a small window of steps around the active one so the view stays short. */
function visibleSteps(steps: StepProgress[], expanded: boolean) {
  if (expanded || steps.length <= 7) return steps.map((s, i) => ({ s, i }));
  const active = steps.findIndex((s) => s.state === 'running' || s.state === 'waiting' || s.state === 'failed');
  const center = active >= 0 ? active : Math.max(0, steps.findIndex((s) => s.state === 'pending') - 1);
  const start = Math.max(0, Math.min(center - 3, steps.length - 7));
  return steps.slice(start, start + 7).map((s, k) => ({ s, i: start + k }));
}

function AllSteps({ run }: { run: RunState }) {
  const { t } = useI18n();
  return (
    <Disclosure label={t('run.steps', { n: run.steps.length })}>
      <div class="list">
        {run.steps.map((s, i) => <StepRow s={s} index={i} runId={run.runId} isStopAfter={s.stepId === run.stopAfterStepId} />)}
      </div>
    </Disclosure>
  );
}

export function RunView({ run: initial }: { run: RunState }) {
  const nav = useNav();
  const { t, dur } = useI18n();
  const [run, setRun] = useState(initial);
  const [expanded, setExpanded] = useState(false);
  const reported = useRef<string>();
  // Only report runs that finish while this view watches them, not old runs opened from a list.
  const wasLive = useRef(initial.status === 'running' || initial.status === 'waiting_manual');
  useEffect(() => setRun(initial), [initial]);

  const live = run.status === 'running' || run.status === 'waiting_manual';

  // While the run is going, keep the view current. When the server announces changes (`live.url`), the
  // widget listens there. Each announcement carries the run's status and every step's state, so the
  // view is drawn from it with no request to the server; the full run is asked for only when its
  // status changes (a manual step to explain, the end). A quiet run costs no requests at all. Without
  // an address, or when the widget isn't allowed to connect there, it asks on a timer.
  const liveUrl = run.live?.url;
  const shown = useRef(run.status);
  shown.current = run.status;
  useEffect(() => {
    if (!live) return;
    let over = false;
    let asking = false;
    let again = false;
    const refresh = async () => {
      if (asking) { again = true; return; }
      asking = true;
      try {
        do {
          again = false;
          const r = await nav.bridge.call<ViewPayload>('show_run', { runId: run.runId });
          if (!over && 'run' in r.payload) setRun(r.payload.run);
        } while (again && !over);
      } catch { /* the next change, or the next tick, asks again */ } finally {
        asking = false;
      }
    };
    let timer: ReturnType<typeof setInterval> | undefined;
    const poll = (ms: number) => { timer ??= setInterval(refresh, ms); };
    let stream: EventSource | undefined;
    let quiet: ReturnType<typeof setInterval> | undefined;
    if (liveUrl && typeof EventSource !== 'undefined') {
      let heard = Date.now();
      try {
        stream = new EventSource(liveUrl);
        let first = true;
        const changed = (ev: Event) => {
          heard = Date.now();
          let p: { status?: RunState['status']; steps?: Record<string, [string, number?]> } | null = null;
          try { p = JSON.parse((ev as MessageEvent).data)?.data ?? null; } catch { /* ask instead */ }
          // The first event is the value as it was when the widget connected: ask once, to be in step.
          const ask = first || !p?.status || !p.steps;
          first = false;
          if (p?.status && p.steps) {
            const steps = p.steps;
            setRun((r) => ({
              ...r,
              steps: r.steps.map((st) => {
                const now = steps[st.stepId];
                return now ? { ...st, state: (now[0] === 'stopped' ? 'skipped' : now[0]) as typeof st.state, durationMs: now[1] ?? st.durationMs } : st;
              }),
            }));
            // A new status has more to show than the announcement carries (what to do, why it failed).
            if (p.status !== 'running' || shown.current !== 'running') { void refresh(); return; }
          }
          if (ask) void refresh();
        };
        stream.addEventListener('put', changed);
        stream.addEventListener('patch', changed);
        stream.addEventListener('keep-alive', () => { heard = Date.now(); });
        // Blocked by the host, or the address is gone: fall back to asking every 3 s.
        stream.onerror = () => { if (stream?.readyState === EventSource.CLOSED) poll(3000); };
        // A stream that has said nothing for over a minute may be dead: look once.
        quiet = setInterval(() => { if (Date.now() - heard > 70_000) { heard = Date.now(); void refresh(); } }, 10_000);
      } catch {
        poll(3000);
      }
    } else {
      poll(1000);
    }
    return () => {
      over = true;
      stream?.close();
      if (timer) clearInterval(timer);
      if (quiet) clearInterval(quiet);
    };
  }, [live, run.runId, liveUrl]);

  // Tell Claude (silently, in English) when the run reaches a final state.
  useEffect(() => {
    if (live || !wasLive.current || reported.current === run.status) return;
    reported.current = run.status;
    const f = run.failure;
    nav.bridge.updateContext(
      f ? `Run ${run.runId} of ${run.workflowName} failed at step ${f.stepIndex + 1} "${f.stepName}": ${f.reason}`
        : `Run ${run.runId} of ${run.workflowName} finished: ${run.status}${run.result ? `, ${run.result.rows} rows` : ''}`,
    ).catch(() => {});
  }, [run.status]);

  if (run.status === 'failure') return <FailureView run={run} />;

  const done = run.steps.filter((s) => s.state === 'ok').length;
  const total = run.stopAfterStepId ? run.steps.findIndex((s) => s.stepId === run.stopAfterStepId) + 1 : run.steps.length;
  const elapsed = run.steps.reduce((a, s) => a + (s.durationMs ?? 0), 0);
  // A test of a proposal not saved yet is tested again; else the workflow runs again.
  const again = () => (run.draft
    ? nav.open('ui_test_draft', { pendingId: run.draft.pendingId, variables: run.variables }, 'replace')
    : nav.open('run_workflow', { id: run.workflowId, variables: run.variables }, 'replace'));
  const save = run.draft && <DraftSave key={run.runId} draft={run.draft} primary={run.status === 'success'} />;
  const back = nav.canBack && <button class="back" onClick={nav.back}>{t('common.back')}</button>;

  if (run.status === 'success') {
    const tested = run.stopAfterStepId;
    return (
      <div class="w">
        {back}
        <div class="result">
          <span class="big ok">{Icon.check()}</span>
          <div class="hd-main">
            <div class="title">{tested ? t('run.changeWorks', { n: total }) : t('run.done', { n: run.steps.length })}</div>
            <div class="sub">{run.workflowName} {run.version === 0 ? `· ${t('draft.testing')}` : `v${run.version}`} · {dur(elapsed)}{!tested && run.result ? ` · ${t('run.items', { n: run.result.rows })}` : ''}</div>
          </div>
        </div>
        <SavedFiles run={run} />
        <AllSteps run={run} />
        <AskClaude
          key={run.runId}
          heading={t('ask.runTitle')}
          placeholder={t('ask.phRun')}
          message={(text) => t('msg.aboutRun', { runId: run.runId, text })}
          context={`The user is asking about run ${run.runId} of workflow "${run.workflowName}" (id ${run.workflowId}, v${run.version}), which finished OK${tested ? ' (a test that stopped after one step on purpose)' : ''}. Read it with get_run and get_run_data, and a step with get_step. If the workflow should change, answer with propose_change.`}
        />
        <div class="actions">
          {tested ? (
            <AsyncButton primary onClick={again}>{Icon.play()}{t('run.runFull')}</AsyncButton>
          ) : (
            <>
              <AsyncButton ghost onClick={again}>{t(run.draft ? 'draft.testAgain' : 'run.runAgain')}</AsyncButton>
              <AsyncButton primary={!run.draft} onClick={() => nav.open('show_run_data', { runId: run.runId }, 'push')}>{t('run.viewData')}</AsyncButton>
            </>
          )}
        </div>
        {save}
      </div>
    );
  }

  if (run.status === 'stopped') {
    const at = run.steps.findIndex((s) => s.state === 'skipped' || s.state === 'pending');
    return (
      <div class="w">
        {back}
        <div class="result">
          <span class="big" style="background:var(--bg-2);color:var(--fg-2)">{Icon.skip()}</span>
          <div class="hd-main">
            <div class="title">{t('run.stoppedAt', { n: at + 1 })}</div>
            <div class="sub">{run.workflowName} {run.version === 0 ? `· ${t('draft.testing')}` : `v${run.version}`}</div>
          </div>
        </div>
        <AllSteps run={run} />
        <div class="actions"><AsyncButton primary={!run.draft} onClick={again}>{t(run.draft ? 'draft.testAgain' : 'run.runAgain')}</AsyncButton></div>
        {save}
      </div>
    );
  }

  const rows = visibleSteps(run.steps, expanded);
  const act = async (tool: string) => {
    const r = await nav.bridge.call<ViewPayload>(tool, { runId: run.runId });
    if ('run' in r.payload) setRun(r.payload.run);
  };
  return (
    <div class="w">
      <Header
        title={run.workflowName}
        sub={<>{run.version === 0 ? t('draft.testing') : `v${run.version}`}{run.stopAfterStepId ? ` · ${t('run.testing')}` : ''}</>}
        right={<StatusPill status={run.status} />}
      />
      <div class="stack" style="gap:6px">
        <div class="bar"><i style={{ width: `${Math.round((done / total) * 100)}%` }} /></div>
        <div class="muted">{t('run.progress', { done, total })}</div>
      </div>
      {run.manual && <Note kind="warn">{t('run.manual', { instruction: run.manual.instruction })}</Note>}
      <div class="list">
        {rows[0]?.i > 0 && <div class="row is-pending"><span class="num" /><span class="muted">{t('run.earlier', { n: rows[0].i })}</span></div>}
        {rows.map(({ s, i }) => <StepRow s={s} index={i} runId={run.runId} isStopAfter={s.stepId === run.stopAfterStepId} />)}
        {!expanded && rows.length < run.steps.length && <button class="more" onClick={() => setExpanded(true)}>{t('common.showAll', { n: run.steps.length })}</button>}
      </div>
      <div class="actions">
        {run.manual ? (
          <>
            <AsyncButton ghost onClick={() => act('ui_stop_run')}>{t('run.stop')}</AsyncButton>
            <AsyncButton primary onClick={() => act('ui_resume_manual')}>{t('run.resume')}</AsyncButton>
          </>
        ) : (
          <AsyncButton onClick={() => act('ui_stop_run')}>{t('run.stopRun')}</AsyncButton>
        )}
      </div>
      {save}
    </div>
  );
}

// ---------- failure (F7) ----------

export function FailureView({ run, inspecting }: { run: RunState; inspecting?: boolean }) {
  const nav = useNav();
  const { t } = useI18n();
  const f = run.failure as FailureInfo;
  const reason = failureText(f, t);
  // A test of a proposal not saved yet: the fix comes as a new proposal, since there is nothing saved to change.
  const context = run.version === 0
    ? `Test run ${run.runId} of the proposed workflow "${run.workflowName}" (id ${run.workflowId}, not saved yet) failed at step ${f.stepIndex + 1} [${f.stepId}] "${f.stepName}". ` +
      `Call get_failure("${run.runId}") for the error, screenshot and HTML, then answer with propose_workflow: the whole workflow, fixed (propose_change cannot be used, it is not saved).`
    : `Run ${run.runId} of workflow "${run.workflowName}" (id ${run.workflowId}, v${run.version}) failed at step ${f.stepIndex + 1} [${f.stepId}] "${f.stepName}". ` +
      `Call get_failure("${run.runId}") for the error, screenshot and HTML, then propose_change with runId "${run.runId}".`;
  const again = () => (run.draft
    ? nav.open('ui_test_draft', { pendingId: run.draft.pendingId, variables: run.variables }, 'replace')
    : nav.open('run_workflow', { id: run.workflowId, variables: run.variables }, 'replace'));
  // A browser that can't be reached isn't fixable by editing the workflow.
  const browserDown = f.errorType === 'browser_unavailable';

  return (
    <div class="w">
      <Header title={t('fail.title', { n: f.stepIndex + 1, total: run.steps.length })} sub={`${run.workflowName} · ${run.version === 0 ? t('draft.testing') : `v${run.version}`}`} right={<StatusPill status="failure" />} />
      <div class="stack" style="gap:4px">
        <div class="row-title">{f.stepName}</div>
        <div style="color:var(--bad);font-size:13px">{reason}</div>
      </div>
      {f.hasScreenshot && <Screenshot runId={run.runId} stepId={f.stepId} alt={t('fail.shotAlt', { n: f.stepIndex + 1 })} />}
      <AllSteps run={run} />
      <Disclosure label={t('common.details')}>
        <dl class="kv">
          <dt>{t('fail.url')}</dt><dd class="mono">{f.url}</dd>
          <dt>{t('fail.error')}</dt><dd class="mono">{f.errorType}</dd>
          <dt>{t('fail.console')}</dt><dd>{f.consoleErrors.length ? f.consoleErrors.join('; ') : t('fail.noErrors')}</dd>
        </dl>
        <pre class="code">{f.stack}</pre>
        <pre class="code">{JSON.stringify(f.variables, null, 2)}</pre>
      </Disclosure>
      {inspecting ? (
        <Note kind="info">{t('fail.inspecting')}</Note>
      ) : browserDown ? (
        <div class="actions">
          <AsyncButton primary onClick={again}>{t(run.draft ? 'draft.testAgain' : 'run.runAgain')}</AsyncButton>
        </div>
      ) : (
        <>
          {/* What the user expected goes with the request; it can also go empty. */}
          <AskClaude
            key={run.runId}
            label={t('ask.fix')}
            allowEmpty
            placeholder={t('ask.phFailed')}
            message={(text) => (text ? `${t('msg.fixRun', { runId: run.runId })} ${text}` : t('msg.fixRun', { runId: run.runId }))}
            context={context}
          />
          <div class="actions"><AsyncButton ghost onClick={again}>{t(run.draft ? 'draft.testAgain' : 'run.runAgain')}</AsyncButton></div>
        </>
      )}
      {run.draft && <DraftSave key={run.runId} draft={run.draft} />}
    </div>
  );
}
