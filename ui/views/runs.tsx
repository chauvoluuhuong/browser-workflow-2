import { useState } from 'preact/hooks';
import type { RunSummary, StepRun } from '../types.js';
import { AskClaude, Disclosure, Header, Icon, Screenshot, StatusDot, StatusPill, useNav } from '../components.js';
import { useI18n, type Key } from '../i18n.js';
import { failureText, SavedFileRow } from './run.js';

const TOP = 5;

export function RunList({ runs }: { runs: RunSummary[] }) {
  const nav = useNav();
  const { t, ago, dur } = useI18n();
  const [all, setAll] = useState(false);
  if (!runs.length) return <div class="empty">{t('runs.none')}</div>;
  const shown = all ? runs : runs.slice(0, TOP);
  const title = (r: RunSummary) =>
    r.status === 'success' ? (r.testUntilStep ? t('runs.testPassed', { n: r.testUntilStep }) : t('runs.done', { n: r.stepCount })) :
    r.status === 'failure' ? t('runs.failedAt', { n: r.atStep, name: r.atStepName }) :
    r.status === 'stopped' ? t('runs.stoppedAt', { n: r.atStep }) :
    r.status === 'waiting_manual' ? t('runs.waiting') :
    r.status === 'waiting_agent' ? t('runs.waitingClaude') : t('runs.runningAt', { n: r.atStep });
  return (
    <div class="list">
      {shown.map((r) => (
        <button class="row" onClick={() => nav.open('show_run', { runId: r.runId }, 'push')}>
          <StatusDot status={r.status} />
          <div class="row-main">
            <div class="row-title">{title(r)}</div>
            <div class="row-sub">{ago(r.at)} · v{r.version}{r.rows !== undefined ? ` · ${t('data.items', { n: r.rows })}` : ''}{r.testUntilStep ? ` · ${t('runs.test')}` : ''}</div>
          </div>
          <span class="row-meta">{dur(r.durationMs)}</span>
        </button>
      ))}
      {!all && runs.length > TOP && <button class="more" onClick={() => setAll(true)}>{t('common.showAll', { n: runs.length })}</button>}
    </div>
  );
}

export function RunsView({ workflowName, runs }: { workflowId: string; workflowName: string; runs: RunSummary[] }) {
  const { t } = useI18n();
  return (
    <div class="w">
      <Header title={t('runs.title')} sub={workflowName} />
      <RunList runs={runs} />
    </div>
  );
}

/** One step inside one run: what happened, and a way to ask Claude about it. */
export function StepRunView({ step: s }: { step: StepRun }) {
  const { t, dur } = useI18n();
  const failed = s.state === 'failed';
  const error = s.error ? failureText(s.error, t) : undefined;
  const pill =
    s.state === 'ok' ? <StatusPill status="success" /> :
    failed ? <StatusPill status="failure" /> :
    <span class="pill muted">{t(s.state === 'skipped' ? 'sr.skipped' : s.state === 'waiting' ? 'sr.waiting' : s.state === 'running' ? 'sr.running' : 'sr.notReached')}</span>;
  const typeLabel = t(`stepType.${s.stepType}` as Key);

  return (
    <div class="w">
      <Header
        title={`${s.stepIndex + 1}. ${s.stepName}`}
        sub={`${s.workflowName} · v${s.version} · ${s.runId}${s.durationMs !== undefined ? ` · ${dur(s.durationMs)}` : ''}`}
        right={pill}
      />
      <div class="mono muted" style="overflow-wrap:anywhere">{typeLabel} · {s.detail}</div>
      {error && <div style="color:var(--bad);font-size:13px">{error}</div>}
      {s.download && <div class="list"><div class="row"><SavedFileRow file={s.download} runId={s.runId} stepId={s.stepId} /></div></div>}
      {s.hasScreenshot && <Screenshot runId={s.runId} stepId={s.stepId} alt={t('sr.alt', { n: s.stepIndex + 1 })} />}
      {s.output && (
        <Disclosure label={t('common.output')} initial={s.stepType === 'extractData'}>
          <pre class="code">{s.output}</pre>
        </Disclosure>
      )}
      {s.apiCalls && (
        <Disclosure label={t('sr.requests', { n: s.apiCallCount ?? s.apiCalls.length })}>
          <pre class="code">{s.apiCalls.map((c) => `${c.method} ${c.url}`).join('\n')}</pre>
        </Disclosure>
      )}
      <Disclosure label={t('common.details')}>
        <dl class="kv">
          {s.url && <><dt>{t('fail.url')}</dt><dd class="mono">{s.url}</dd></>}
          <dt>{t('sr.stepId')}</dt><dd class="mono">{s.stepId}</dd>
        </dl>
        <pre class="code">{JSON.stringify(s.variablesBefore, null, 2)}</pre>
      </Disclosure>
      {s.state === 'ok' || failed ? (
        <AskClaude
          label={failed ? t('ask.fix') : t('ask.button')}
          allowEmpty={failed}
          placeholder={failed ? t('ask.phFailed') : t('ask.phEdit')}
          suggestions={failed ? [] : s.stepType === 'extractData' ? [t('sug.rowsMissing'), t('sug.addField')] : [t('sug.wrongThing')]}
          message={(text) => t(failed ? 'msg.stepFailed' : 'msg.stepOk', { runId: s.runId, stepId: s.stepId, text })}
          context={`The user is asking about step ${s.stepIndex + 1} [${s.stepId}] "${s.stepName}" in run ${s.runId} of workflow "${s.workflowName}" (id ${s.workflowId}, v${s.version}); the step ${failed ? 'failed' : 'finished OK'}. Read it with get_step(runId, stepId)${failed ? ' and get_failure(runId)' : ''}, then propose_change${failed ? ' with runId' : ''}.`}
        />
      ) : (
        <div class="muted">{Icon.circle()} {t('sr.didntRun')}</div>
      )}
    </div>
  );
}
