import { useEffect, useState } from 'preact/hooks';
import type { RunSummary, StepSummary, StepType, ViewPayload, WorkflowDetail, WorkflowNotice } from '../types.js';
import { AskClaude, AsyncButton, Header, Menu, Note, StepTypeIcon, useNav, Icon } from '../components.js';
import { useI18n, type Key } from '../i18n.js';
import { RunList } from './runs.js';

const TOP = 6;

const EDIT_SUGGESTIONS: Record<StepType, Key[]> = {
  executeXpathCommand: ['sug.stableSelector', 'sug.waitFirst'],
  extractData: ['sug.alsoLink', 'sug.skipEmpty'],
  navigate: ['sug.otherUrl'],
  delay: ['sug.waitElement'],
  javascript: ['sug.explainJs'],
  if: ['sug.explainIf'],
  switch: ['sug.explainSwitch'],
  manual: ['sug.automate'],
  download: ['sug.fileName', 'sug.otherFile'],
  agent: ['sug.otherQuestion'],
};

export function StepList({ steps, limit = TOP, workflow }: {
  steps: StepSummary[];
  limit?: number;
  /** When set, an expanded step offers "Ask Claude" to request an edit. */
  workflow?: WorkflowDetail;
}) {
  const { t } = useI18n();
  const [open, setOpen] = useState<string>();
  const [all, setAll] = useState(false);
  const shown = all ? steps : steps.slice(0, limit);
  return (
    <div class="list">
      {shown.map((s, i) => {
        const typeLabel = t(`stepType.${s.stepType}` as Key);
        const sugg: Key[] = s.detail.startsWith('waitFor') ? ['sug.stableSelector', 'sug.waitLonger'] : EDIT_SUGGESTIONS[s.stepType];
        return (
          <div class="row-wrap">
            <button class="row" aria-expanded={open === s.id} onClick={() => setOpen(open === s.id ? undefined : s.id)}>
              <span class="num">{i + 1}</span>
              <StepTypeIcon type={s.stepType} />
              <div class="row-main">
                <div class="row-title">{s.stepName}</div>
                <div class="row-sub mono">{s.detail}</div>
              </div>
            </button>
            {open === s.id && (
              <div class="row-expand">
                <div><span class="tag">{typeLabel}</span> <span class="mono">{s.id}</span></div>
                {s.description && <div>{s.description}</div>}
                {s.code && <pre class="code">{s.code}</pre>}
                {workflow && (
                  <AskClaude
                    key={s.id}
                    placeholder={t('ask.phEdit')}
                    suggestions={sugg.map((k) => t(k))}
                    message={(text) => t('msg.editStep', { id: workflow.id, stepId: s.id, text })}
                    context={`The user wants to change step ${i + 1} [${s.id}] "${s.stepName}" (${s.stepType}) of workflow "${workflow.name}" (id ${workflow.id}, v${workflow.version}). Read it with get_workflow, then answer with propose_change.`}
                  />
                )}
              </div>
            )}
          </div>
        );
      })}
      {!all && steps.length > limit && <button class="more" onClick={() => setAll(true)}>{t('common.showAll', { n: steps.length })}</button>}
    </div>
  );
}

function noticeText(n: WorkflowNotice, t: ReturnType<typeof useI18n>['t']) {
  return n.kind === 'saved' ? t('wf.saved', { v: n.version })
    : n.kind === 'restored' ? t('wf.restored', { v: n.version, from: n.from })
    : t('wf.discarded', { v: n.version });
}

/** Saves the workflow's definition as a .json file (the same format Import reads). */
async function exportFile(nav: ReturnType<typeof useNav>, id: string, name: string) {
  const r = await nav.bridge.call('get_workflow', { id });
  const at = r.text.indexOf('Full definition:\n');
  if (r.isError || at < 0) return;
  const json = r.text.slice(at + 'Full definition:\n'.length, r.text.lastIndexOf('}') + 1);
  await nav.bridge.download(`${name.toLowerCase().replace(/\W+/g, '-') || id}.json`, 'application/json', json);
}

export function WorkflowView({ workflow: wf, notice }: { workflow: WorkflowDetail; notice?: WorkflowNotice }) {
  const nav = useNav();
  const { t } = useI18n();
  const [tab, setTab] = useState<'steps' | 'runs'>('steps');
  const [runs, setRuns] = useState<RunSummary[]>();

  useEffect(() => {
    if (tab !== 'runs' || runs) return;
    nav.bridge.call<ViewPayload>('list_runs', { workflowId: wf.id }).then((r) => {
      if (r.payload.view === 'runs') setRuns(r.payload.runs);
    });
  }, [tab]);

  // form: the server shows the input form first when the workflow has inputs.
  const run = () => nav.open('run_workflow', { id: wf.id, form: true }, 'push');

  return (
    <div class="w">
      <Header
        title={wf.name}
        sub={`${wf.host || t('wf.hostFromInputs')} · v${wf.version}`}
        right={<Menu items={[
          { label: t('wf.history'), onClick: () => nav.open('show_history', { id: wf.id }, 'push') },
          { label: t('wf.export'), onClick: () => exportFile(nav, wf.id, wf.name) },
        ]} />}
      />
      {notice && <Note kind={notice.kind === 'discarded' ? 'info' : 'ok'}>{noticeText(notice, t)}</Note>}
      <div class="seg" role="group">
        <button aria-pressed={tab === 'steps'} onClick={() => setTab('steps')}>{t('wf.stepsTab', { n: wf.steps.length })}</button>
        <button aria-pressed={tab === 'runs'} onClick={() => setTab('runs')}>{t('wf.runsTab')}</button>
      </div>
      {tab === 'steps' ? (
        <StepList steps={wf.steps} workflow={wf} />
      ) : runs ? (
        <RunList runs={runs} />
      ) : (
        <div class="stack" aria-busy="true"><div class="skel" /><div class="skel" /></div>
      )}
      <AskClaude
        key={wf.id}
        heading={t('ask.wfTitle')}
        placeholder={t('ask.phWorkflow')}
        message={(text) => t('msg.editWorkflow', { id: wf.id, text })}
        context={`The user wants to change workflow "${wf.name}" (id ${wf.id}, v${wf.version}) as a whole, not one step. Read it with get_workflow, explore the site with the page_* inspector tools when the change needs new selectors or code, then answer with propose_change.`}
      />
      <div class="actions">
        <AsyncButton primary onClick={run}>{Icon.play()}{t('wf.run')}</AsyncButton>
      </div>
    </div>
  );
}
