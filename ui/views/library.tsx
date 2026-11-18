import { useRef, useState } from 'preact/hooks';
import type { WorkflowSummary } from '../types.js';
import { AsyncButton, Header, Icon, StatusDot, useNav } from '../components.js';
import { useI18n, type Key } from '../i18n.js';

const TOP = 5;

/** Hidden file input + handler shared by the library and the setup view. */
export function useImportFile() {
  const nav = useNav();
  const { t } = useI18n();
  const ref = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string>();

  async function onChange(e: Event) {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return;
    setError(undefined);
    if (file.size > 2_000_000) return setError(t('lib.tooBig'));
    const json = await file.text();
    await nav.open('import_workflow', { json, fileName: file.name }, 'push');
    if (ref.current) ref.current.value = '';
  }

  const input = <input ref={ref} type="file" accept=".json,application/json" class="sr" onChange={onChange} tabIndex={-1} />;
  return { pick: () => ref.current?.click(), input, error };
}

export function LibraryView({ workflows, query }: { workflows: WorkflowSummary[]; query?: string }) {
  const nav = useNav();
  const { t, ago } = useI18n();
  const [showAll, setShowAll] = useState(false);
  const [filter, setFilter] = useState('');
  const file = useImportFile();
  const panel = nav.bridge.surface === 'panel';

  const f = filter.toLowerCase();
  const list = workflows.filter((w) => !f || `${w.name} ${w.host}`.toLowerCase().includes(f));
  const shown = showAll ? list : list.slice(0, TOP);

  return (
    <div class="w">
      <Header title={t('lib.title')} sub={query ? t('lib.matching', { q: query }) : t('lib.saved', { n: workflows.length })} />

      {workflows.length === 0 ? (
        <div class="empty"><div>{t(panel ? 'panel.empty' : 'lib.empty')}</div></div>
      ) : (
        <>
          {workflows.length > TOP && (
            <input class="input" type="search" placeholder={t('lib.filter')} value={filter} onInput={(e) => setFilter((e.target as HTMLInputElement).value)} aria-label={t('lib.filter')} />
          )}
          <div class="list">
            {shown.map((w) => {
              const row = (
                <button class="row" style={panel ? 'flex:1;min-width:0' : undefined} onClick={() => nav.open('show_workflow', { id: w.id }, 'push')}>
                  <StatusDot status={w.lastRun?.status} />
                  <div class="row-main">
                    <div class="row-title">{w.name}{w.example && <span class="pill muted" style="margin-left:6px">{t('lib.example')}</span>}</div>
                    <div class="row-sub">{w.host || t('wf.hostFromInputs')} · {t('lib.steps', { n: w.stepCount })}</div>
                  </div>
                  <span class="row-meta">{w.lastRun ? `${w.lastRun.status ? `${t(`status.${w.lastRun.status}` as Key)} · ` : ''}${ago(w.lastRun.at)}` : t('lib.neverRun')}</span>
                </button>
              );
              // The side panel's Home: each workflow runs from here (the run form first when it has inputs).
              return panel ? (
                <div class="row-wrap" style="display:flex;align-items:center;gap:6px;padding-right:8px">
                  {row}
                  <AsyncButton onClick={() => nav.open('run_workflow', { id: w.id, form: true }, 'push')} aria-label={`${t('panel.run')} ${w.name}`}>{Icon.play()}{t('panel.run')}</AsyncButton>
                </div>
              ) : row;
            })}
            {!shown.length && <div class="row"><span class="muted">{t('lib.noMatch')}</span></div>}
            {!showAll && list.length > TOP && <button class="more" onClick={() => setShowAll(true)}>{t('common.showAll', { n: list.length })}</button>}
          </div>
        </>
      )}

      {file.error && <div class="field"><span class="err">{file.error}</span></div>}
      {file.input}
      <div class="actions">
        <button class="btn primary" onClick={file.pick}>{Icon.upload()}{t('lib.import')}</button>
      </div>
    </div>
  );
}
