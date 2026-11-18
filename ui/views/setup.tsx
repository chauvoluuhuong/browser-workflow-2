// First-run setup: the widget Claude shows before anything else (tool `setup`).
// Two steps, one task each: Browser Workflow running in Chrome → add a first workflow. When Chrome is closed
// or the extension is missing, the plugin answers `setup` with the first step itself (`step: 'extension'`).
import { useState } from 'preact/hooks';
import { askClaude, AskClaude, AsyncButton, Icon, Note, useNav } from '../components.js';
import { useI18n } from '../i18n.js';
import { useImportFile } from './library.js';
import { LanguagePicker } from './misc.js';

/** The Chrome Web Store page of the extension, when the plugin did not say. */
const STORE = 'https://chromewebstore.google.com/search/Browser%20Workflow';

/** Chrome is closed or Browser Workflow isn't in it: what to do, and Check again. */
export function GetExtension({ link, onReady }: { link?: string; onReady?: () => void }) {
  const nav = useNav();
  const { t } = useI18n();
  return (
    <>
      <div class="stack" style="gap:4px">
        <div class="row-title">{t('setup.extTitle')}</div>
        <div class="muted">{t('setup.extNote')}</div>
      </div>
      <Note kind="warn">{t('setup.extOpen')}</Note>
      <div class="actions">
        <AsyncButton ghost onClick={() => nav.bridge.openLink(link || STORE)}>{t('setup.extGet')}</AsyncButton>
        <AsyncButton primary onClick={async () => {
          // `setup` answers the next step once the extension answers; the same card again while it doesn't.
          await nav.open('setup', {}, 'replace');
          onReady?.();
        }}>{t('setup.extCheck')}</AsyncButton>
      </div>
    </>
  );
}

export function SetupView(p: { step: string; workflows: number; link?: string }) {
  const nav = useNav();
  const { t } = useI18n();
  const order = ['extension', 'first'];
  const step = p.step === 'extension' ? 'extension' : 'first';
  const idx = order.indexOf(step);
  const [describing, setDescribing] = useState(false);
  const [finished, setFinished] = useState(false);
  const file = useImportFile();

  async function finish() {
    await nav.bridge.call('ui_finish_setup');
    setFinished(true);
    // Claude waited for this: it showed the setup widget and stopped.
    await askClaude(nav.bridge, t('msg.setupDone'), 'The user finished setup in the widget. Go on with what they asked for. If they asked for nothing yet, call list_workflows and ask in one line which example to run first, or what they want to automate.').catch(() => {});
  }

  if (finished) return <div class="w"><Note kind="ok">{t('setup.ready')}</Note></div>;

  return (
    <div class="w">
      <div class="hd">
        <div class="hd-main">
          <h1 class="title">{t('setup.title')}</h1>
          <div class="sub">{t('setup.stepOf', { n: idx + 1, total: order.length })}</div>
        </div>
        <LanguagePicker compact />
      </div>
      <div class="steps-dots" aria-hidden="true">{order.map((s, i) => <i class={i <= idx ? 'on' : ''} key={s} />)}</div>

      {step === 'extension' && <GetExtension link={p.link} />}

      {step === 'first' && (
        <>
          <Note kind="ok">{t('setup.extOk')}</Note>
          <div class="row-title">{t('setup.firstTitle')}</div>
          <div class="list">
            <button class="row" onClick={file.pick}>
              <span class="st pending">{Icon.upload()}</span>
              <div class="row-main"><div class="row-title">{t('setup.importFile')}</div><div class="row-sub">{t('setup.importHint')}</div></div>
            </button>
            <button class="row" onClick={async () => { await nav.bridge.call('ui_finish_setup'); await nav.open('list_workflows', {}, 'push'); }}>
              <span class="st pending">{Icon.play()}</span>
              <div class="row-main"><div class="row-title">{t('setup.example')}</div><div class="row-sub">{t('setup.exampleHint')}</div></div>
            </button>
            <button class="row" aria-expanded={describing} onClick={() => setDescribing(!describing)}>
              <span class="st pending">{Icon.sparkle()}</span>
              <div class="row-main"><div class="row-title">{t('setup.describe')}</div><div class="row-sub">{t('setup.describeHint')}</div></div>
            </button>
            {describing && (
              <div class="row-expand" style="padding-left:10px">
                <AskClaude
                  placeholder={t('setup.describePh')}
                  message={(text) => t('msg.describe', { text })}
                  context="The user wants a new browser workflow. Read get_step_schema, explore the site with the page_* tools, then show a draft with propose_workflow."
                />
              </div>
            )}
          </div>
          {file.error && <span class="err">{file.error}</span>}
          {file.input}
          <div class="actions">
            <AsyncButton primary onClick={finish}>{t('setup.finish')}</AsyncButton>
          </div>
        </>
      )}
    </div>
  );
}
