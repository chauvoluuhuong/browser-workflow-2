import { useState } from 'preact/hooks';
import type { ImportPreview, WorkflowDetail } from '../types.js';
import { askClaude, AskClaude, AsyncButton, Header, Icon, Note, useNav } from '../components.js';
import { useI18n } from '../i18n.js';
import { StepList } from './workflow.js';

export function ImportView({ preview, pendingId }: { preview: ImportPreview; pendingId?: string }) {
  const nav = useNav();
  const { t } = useI18n();
  const [cancelled, setCancelled] = useState(false);

  if (cancelled) return <div class="w"><Note kind="info">{t('imp.cancelled')}</Note></div>;

  const errText = (e: ImportPreview['errors'][number]) => t(`imp.err.${e.code}`, { arg: e.arg });

  if (!preview.ok) {
    const shown = preview.errors.slice(0, 3);
    return (
      <div class="w">
        <Header title={t('imp.cantTitle')} sub={preview.fileName} />
        <div class="list">
          {shown.map((e) => (
            <div class="row">
              <span class="st bad">{Icon.x()}</span>
              <div class="row-main">
                <div class="row-title mono">{e.path}</div>
                <div class="row-sub" style="white-space:normal">{errText(e)}</div>
              </div>
            </div>
          ))}
          {preview.errors.length > 3 && <div class="row"><span class="muted">{t('imp.more', { n: preview.errors.length - 3 })}</span></div>}
        </div>
        <div class="actions">
          <button class="btn ghost" onClick={() => setCancelled(true)}>{t('common.cancel')}</button>
          <AsyncButton primary onClick={() => askClaude(nav.bridge, t('msg.importFix', { file: preview.fileName }),
            `The user's workflow file "${preview.fileName}" failed validation:\n${preview.errors.map((e) => `- ${e.path}: ${e.message}`).join('\n')}\n` +
            'Help fix the JSON (format: get_step_schema), then call import_workflow with the corrected content.')}>{Icon.sparkle()}{t('ask.fix')}</AsyncButton>
        </div>
      </div>
    );
  }

  const wf = preview.workflow!;
  return (
    <div class="w">
      <Header title={t('imp.title', { name: wf.name })} sub={preview.fileName} />
      <div class="list">
        <div class="row"><div class="row-main"><div class="row-sub">{t('imp.site')}</div><div class="row-title">{wf.host || t('wf.hostFromInputs')}</div></div></div>
        <div class="row"><div class="row-main"><div class="row-sub">{t('imp.steps')}</div><div class="row-title">{t('imp.allValid', { n: wf.stepCount })}</div></div><span class="st ok">{Icon.check()}</span></div>
        {!!preview.inputs?.length && (
          <div class="row"><div class="row-main"><div class="row-sub">{t('imp.asksFor')}</div><div class="row-title">{preview.inputs.join(', ')}</div></div></div>
        )}
      </div>
      {preview.existingVersion !== undefined && (
        <Note kind="warn">{t('imp.exists', { id: wf.id, v: preview.existingVersion, next: preview.existingVersion + 1 })}</Note>
      )}
      <div class="actions">
        <button class="btn ghost" onClick={() => setCancelled(true)}>{t('common.cancel')}</button>
        <AsyncButton primary onClick={() => nav.open('ui_confirm_import', { pendingId }, 'replace')}>{t('imp.save')}</AsyncButton>
      </div>
    </div>
  );
}

export function DraftView({ workflow: wf, pendingId }: { workflow: WorkflowDetail; pendingId: string }) {
  const nav = useNav();
  const { t } = useI18n();
  const [name, setName] = useState(wf.name);
  return (
    <div class="w">
      <Header title={wf.name} sub={t('draft.sub', { host: wf.host || t('wf.hostFromInputs'), n: wf.steps.length })} />
      <StepList steps={wf.steps} limit={5} />
      {wf.variables.length > 0 && (
        <div class="chips">
          <span class="muted">{t('draft.inputs')}</span>
          {wf.variables.map((v) => <span class="tag">{v.title}{v.required ? ' *' : ''}</span>)}
        </div>
      )}
      <AskClaude
        key={pendingId}
        heading={t('ask.draftTitle')}
        placeholder={t('ask.phDraft')}
        message={(text) => t('msg.editDraft', { text })}
        context={`The user wants to change the draft workflow "${wf.name}" (${wf.steps.length} steps) that you proposed with propose_workflow. It is not saved yet, so propose_change cannot be used on it. Answer with propose_workflow again, with the whole workflow changed as asked.`}
      />
      <div class="field">
        <label for={`name-${pendingId}`}>{t('draft.name')}</label>
        <input id={`name-${pendingId}`} class="input" value={name} maxLength={200} onInput={(e) => setName((e.target as HTMLInputElement).value)} />
      </div>
      <div class="actions">
        {/* Saving and testing are separate: test as often as you like, save when the run looks right. */}
        <AsyncButton disabled={!name.trim()} onClick={() => nav.open('ui_save_draft', { pendingId, name: name.trim() }, 'replace')}>{t('draft.save')}</AsyncButton>
        <AsyncButton primary onClick={() => nav.open('ui_test_draft', { pendingId }, 'push')}>{Icon.play()}{t('draft.testRun')}</AsyncButton>
      </div>
    </div>
  );
}

/**
 * Under a test run of a proposal not saved yet: the name it will have, and Save. Shown before, during
 * and after the test, so the user saves whenever the run looks right.
 */
export function DraftSave({ draft, primary }: { draft: { pendingId: string; name: string }; primary?: boolean }) {
  const nav = useNav();
  const { t } = useI18n();
  const [name, setName] = useState(draft.name);
  return (
    <div class="draft-save">
      <div class="muted" style="font-size:12.5px">{t('draft.saveHint')}</div>
      <div class="field">
        <label for={`save-${draft.pendingId}`}>{t('draft.name')}</label>
        <input id={`save-${draft.pendingId}`} class="input" value={name} maxLength={200} onInput={(e) => setName((e.target as HTMLInputElement).value)} />
      </div>
      <div class="actions">
        <AsyncButton primary={primary} disabled={!name.trim()} onClick={() => nav.open('ui_save_draft', { pendingId: draft.pendingId, name: name.trim() }, 'replace')}>{t('draft.save')}</AsyncButton>
      </div>
    </div>
  );
}
