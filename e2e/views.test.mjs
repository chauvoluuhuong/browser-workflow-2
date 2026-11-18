// The views end to end (Package F), through the real host and socket: the chat widget (dist/widget.html, in a page
// that plays the chat app's part of the MCP Apps protocol, its tool calls going to the real MCP server) and the
// extension's side panel (its page, in a tab of the same Chromium) work on the same proposals and runs:
//   a proposal approved in the side panel → the widget's next read shows the saved workflow;
//   "Fix with Claude" in the side panel → a waiting wait_for_user returns the request;
//   a run with a download step shows the saved file in the widget.
// With BW2_SCREENSHOTS=<folder> it also saves screenshots of the widget and the panel (light and dark, en and vi).
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { createServer } from 'node:http';
import { homedir, tmpdir } from 'node:os';
import { join } from 'node:path';
import { after, before, describe, it } from 'node:test';
import { fileURLToPath } from 'node:url';
import { Client } from '@modelcontextprotocol/client';
import { StdioClientTransport } from '@modelcontextprotocol/client/stdio';
import { chromium } from 'playwright-core';

const ROOT = fileURLToPath(new URL('../', import.meta.url));
const EXT = process.env.BW2_EXTENSION_DIR || join(ROOT, '..', 'browser-workflow-2-extension');
const DEV_ID = 'iickjddceohcklpodfeekggppkcilbgj';
const CFT = join(homedir(), 'Library/Caches/ms-playwright/chromium-1254/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing');
const CHROME = process.env.BW_CHROME || (existsSync(CFT) ? CFT : undefined);
const REAL_MANIFEST = join(homedir(), 'Library', 'Application Support', 'Google', 'Chrome', 'NativeMessagingHosts', 'com.browser_workflow_2.host.json');
const SHOTS = process.env.BW2_SCREENSHOTS;
const t0 = Date.now();
const log = (s) => console.log(`[views e2e] +${((Date.now() - t0) / 1000).toFixed(1)}s ${s}`);

let site, home, profile, extDist, client, context, chat, panel, chatServer, realManifestBefore;

async function tool(name, args = {}) {
  const r = await client.callTool({ name, arguments: args }, undefined, { timeout: 10 * 60_000 });
  return { text: r.content?.find((c) => c.type === 'text')?.text ?? '', data: r.structuredContent ?? {}, isError: !!r.isError, raw: r };
}

async function until(fn, ms = 30_000, what = 'condition') {
  const end = Date.now() + ms;
  for (;;) {
    const v = await fn();
    if (v) return v;
    if (Date.now() > end) throw new Error(`timed out after ${ms} ms waiting for ${what}`);
    await new Promise((r) => setTimeout(r, 150));
  }
}

/** The page standing in for the chat app: the widget in an iframe, answering its MCP Apps requests. */
const CHAT_PAGE = `<!doctype html><html><head><meta charset="utf-8"><style>
  body { margin: 0; padding: 16px; font: 14px system-ui; background: #fff; }
  body.dark { background: #262624; }
  #w { width: 640px; border: 0; display: block; }
</style></head><body><iframe id="w" src="/widget.html"></iframe><script>
  const f = document.getElementById('w');
  window.__messages = [];
  window.addEventListener('message', async (e) => {
    if (e.source !== f.contentWindow) return;
    const m = e.data;
    if (!m || m.jsonrpc !== '2.0') return;
    const reply = (result) => f.contentWindow.postMessage({ jsonrpc: '2.0', id: m.id, result }, '*');
    switch (m.method) {
      case 'ui/initialize': return reply({ protocolVersion: '2026-01-26', hostInfo: { name: 'Claude', version: 'e2e' }, hostCapabilities: {}, hostContext: window.__ctx || {} });
      case 'ui/notifications/initialized': window.__ready = true; return;
      case 'ui/notifications/size-changed': f.style.height = m.params.height + 'px'; return;
      case 'tools/call': return reply(await window.hostCallTool(m.params.name, m.params.arguments || {}));
      case 'ui/message': window.__messages.push(m.params); return reply({});
      default: if (m.id !== undefined) reply({});
    }
  });
  window.showResult = (r) => f.contentWindow.postMessage({ jsonrpc: '2.0', method: 'ui/notifications/tool-result', params: r }, '*');
</script></body></html>`;

/** Opens the chat page with a fresh widget, in a theme and locale, showing one tool result. */
async function showInChat(result, { theme = 'light', locale = 'en-US' } = {}) {
  await chat.goto(`${chatServer.url}/`);
  await chat.evaluate(([th, lo]) => { window.__ctx = { theme: th, locale: lo }; document.body.className = th; }, [theme, locale]);
  // The iframe started before __ctx was set: reload it now that the context is there.
  await chat.evaluate(() => { document.getElementById('w').src = '/widget.html'; window.__ready = false; });
  await until(() => chat.evaluate(() => window.__ready), 10_000, 'the widget handshake');
  await chat.evaluate((r) => window.showResult(r), { content: result.raw.content, structuredContent: result.raw.structuredContent, isError: result.raw.isError });
}
const widgetText = () => chat.frameLocator('#w').locator('body').innerText();
const panelText = () => panel.locator('body').innerText();
const panelHome = async () => {
  const b = panel.getByRole('button', { name: /^(Home|Trang chính)$/ });
  if (await b.count()) await b.click();
};

async function shot(page, name) {
  if (!SHOTS) return;
  mkdirSync(SHOTS, { recursive: true });
  await new Promise((r) => setTimeout(r, 300));
  if (page === chat) await chat.locator('#w').screenshot({ path: join(SHOTS, `${name}.png`) });
  else await page.screenshot({ path: join(SHOTS, `${name}.png`), fullPage: true });
  log(`screenshot ${name}.png`);
}

const okWorkflow = (id, name) => ({
  id, name, pageUrl: `${site.url}/media`, description: 'Read the page and save its video',
  steps: [
    { id: 'read', stepType: 'extractData', stepName: 'Read the links', action: { jsCode: "() => [...document.querySelectorAll('a')].map(a => ({ text: a.textContent.trim(), href: a.href }))" }, nextStepId: 'save' },
    { id: 'save', stepType: 'download', stepName: 'Save the video', action: { source: { xpath: '//video' }, folder: 'clips' }, nextStepId: null },
  ],
});
const failingWorkflow = () => ({
  id: 'e2e-views-fail', name: 'Click the missing button', pageUrl: `${site.url}/`, description: 'Fails on purpose',
  steps: [{ id: 'click', stepType: 'executeXpathCommand', stepName: 'Click the missing button', action: { xpathSelector: '//button[@id="missing"]', command: 'click', timeoutMs: 1000 }, nextStepId: null }],
});

describe('the widget and the side panel through the real host', { timeout: 10 * 60_000 }, () => {
  before(async () => {
    realManifestBefore = existsSync(REAL_MANIFEST);
    const { startSite } = await import(join(EXT, 'e2e', 'site.ts'));
    site = await startSite();
    home = mkdtempSync(join(tmpdir(), 'bw2-views-e2e-'));
    profile = mkdtempSync(join(tmpdir(), 'bw2-views-profile-'));
    // Downloads go into the profile's own folder, never the user's real Downloads.
    const downloads = join(profile, 'Downloads');
    mkdirSync(join(profile, 'Default'), { recursive: true });
    mkdirSync(downloads, { recursive: true });
    writeFileSync(join(profile, 'Default', 'Preferences'), JSON.stringify({ download: { default_directory: downloads, prompt_for_download: false, directory_upgrade: true }, savefile: { default_directory: downloads } }));
    extDist = join(home, 'extension');
    execFileSync(process.execPath, [join(EXT, 'scripts', 'build.mjs'), '--dev', '--out', extDist], { stdio: 'inherit' });
    const env = { ...process.env, HOME: home, BW2_HOME: join(home, '.browser-workflow-2'), BW2_HOST_DIRS: join(profile, 'NativeMessagingHosts') };
    client = new Client({ name: 'views-e2e', version: '0' });
    await client.connect(new StdioClientTransport({ command: process.execPath, args: [join(ROOT, 'dist', 'server.mjs')], env, stderr: 'inherit' }));
    // The chat page and the widget, served from here.
    const widget = readFileSync(join(ROOT, 'dist', 'widget.html'), 'utf8');
    const http = createServer((req, res) => {
      res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
      res.end(req.url === '/widget.html' ? widget : CHAT_PAGE);
    });
    await new Promise((r) => http.listen(0, '127.0.0.1', r));
    chatServer = { url: `http://127.0.0.1:${http.address().port}`, close: () => new Promise((r) => http.close(r)) };
    context = await chromium.launchPersistentContext(profile, {
      headless: false,
      ...(CHROME ? { executablePath: CHROME } : {}),
      args: [`--disable-extensions-except=${extDist}`, `--load-extension=${extDist}`, '--no-first-run', '--no-default-browser-check'],
      viewport: null,
    });
    // Playwright would redirect downloads into its own folder: give them back to Chrome.
    await (await context.browser().newBrowserCDPSession()).send('Browser.setDownloadBehavior', { behavior: 'default' });
    await context.exposeBinding('hostCallTool', async (_src, name, args) => {
      const r = await client.callTool({ name, arguments: args }, undefined, { timeout: 120_000 });
      return { content: r.content, structuredContent: r.structuredContent, isError: r.isError };
    });
    chat = context.pages()[0] ?? (await context.newPage());
    await chat.setViewportSize({ width: 700, height: 900 });
    panel = await context.newPage();
    await panel.setViewportSize({ width: 360, height: 760 });
    await panel.goto(`chrome-extension://${DEV_ID}/sidepanel/index.html`);
    await chat.bringToFront();
    // Wait for the extension to reach the plugin.
    await until(async () => !(await tool('extension_status')).isError, 40_000, 'the extension to connect');
    await tool('set_language', { lang: 'en' });
    log('ready: MCP server, host, extension, chat page and side panel');
  });

  after(async () => {
    await context?.close().catch(() => {});
    await client?.close().catch(() => {});
    await chatServer?.close();
    await site?.close();
    for (const d of [home, profile]) if (d) rmSync(d, { recursive: true, force: true, maxRetries: 10, retryDelay: 200 });
    assert.equal(existsSync(REAL_MANIFEST), realManifestBefore, 'the real Chrome folder was not touched');
  });

  it('a proposal approved in the side panel: the widget\'s next read shows it saved', async () => {
    const proposed = await tool('propose_workflow', { workflow: okWorkflow('e2e-views-ok', 'Save the clip') });
    assert.equal(proposed.data.view, 'draft');
    await showInChat(proposed);
    await until(async () => (await widgetText()).includes('Test run'), 10_000, 'the draft in the widget');
    await shot(chat, 'widget-draft-en-light');
    // The panel shows the proposal waiting, and the user saves it there.
    await panel.bringToFront();
    await panelHome();
    await until(async () => (await panelText()).includes('Waiting for your approval'), 10_000, 'the badge');
    await shot(panel, 'panel-home-badge-en-light');
    await panel.getByRole('button', { name: 'Review' }).click();
    await until(async () => (await panel.locator('input[id^="name-"]').count()) > 0, 10_000, 'the draft in the panel');
    await panel.getByRole('button', { name: 'Save', exact: true }).click();
    const savedAt = Date.now();
    await until(async () => (await panelText()).includes('Saved · v1'), 10_000, 'saved in the panel');
    // The widget re-reads its proposal every 3 s and when it comes back into sight.
    await chat.bringToFront();
    await until(async () => (await widgetText()).includes('Saved · v1'), 10_000, 'the widget to show the saved workflow');
    log(`the widget showed the saved workflow ${Date.now() - savedAt} ms after Save in the panel`);
    assert.match((await tool('read_workflows')).text, /e2e-views-ok: Save the clip/);
  });

  it('a run with a download step shows the saved file in the widget', async () => {
    const started = await tool('run_workflow', { id: 'e2e-views-ok' });
    await showInChat(started);
    await until(async () => /Done · 2 steps/.test(await widgetText()), 60_000, 'the run to finish');
    const t = await widgetText();
    assert.match(t, /Saved clips\/clip\.mp4/);
    assert.match(t, /Show in folder/);
    assert.ok(existsSync(join(profile, 'Downloads', 'clips', 'clip.mp4')), 'saved into the profile\'s Downloads');
    await shot(chat, 'widget-run-en-light');
  });

  it('"Fix with Claude" in the side panel: a waiting wait_for_user returns the request', async () => {
    const proposed = await tool('propose_workflow', { workflow: failingWorkflow() });
    await tool('ui_save_draft', { pendingId: proposed.data.pendingId });
    // Claude waits for the user (as it does after asking them to look at the side panel).
    const waiting = tool('wait_for_user', { minutes: 2 });
    await panel.bringToFront();
    await panelHome();
    const row = panel.locator('.row-wrap', { hasText: 'Click the missing button' });
    await until(async () => (await row.count()) > 0, 10_000, 'the workflow on Home');
    await row.getByRole('button', { name: /^Run / }).click();
    await until(async () => /Failed at step 1 of 1/.test(await panelText()), 60_000, 'the failure in the panel');
    await shot(panel, 'panel-failure-en-light');
    const asked = Date.now();
    await panel.getByRole('button', { name: 'Fix with Claude' }).click();
    const r = await waiting;
    log(`wait_for_user returned ${Date.now() - asked} ms after the click: ${r.text.slice(0, 160)}`);
    assert.match(r.text, /^The user acted in the Browser Workflow side panel: Fix the failed run \S+\./);
    assert.match(r.text, /\(Details: .*failed at step 1 \[click\].*get_failure/);
    assert.match(r.text, /\(ask_claude; workflowId e2e-views-fail, runId \S+\)/);
    await until(async () => (await panelText()).includes('Sent to Claude. Switch to Claude to see it.'), 5_000, 'the sent note');
  });

  it('the widget draws every view kind still in use, from the real tools\' answers', async () => {
    const lastRun = async (workflowId) => /- (\S+) /.exec((await tool('read_runs', { workflowId })).text)?.[1];
    const okRun = await lastRun('e2e-views-ok');
    const failRun = await lastRun('e2e-views-fail');
    assert.ok(okRun && failRun, 'runs from the cases before');
    // A proposal with an input: its test run asks for it first (the run form). Not saved: the free plan keeps 3 workflows.
    const form = await tool('propose_workflow', { workflow: { ...okWorkflow('e2e-views-form', 'With an input'), environmentVariableSchema: { type: 'object', properties: { month: { type: 'string', title: 'Month', default: '2026-11' } } } } });
    /** [view, tool, args, text the view shows] */
    const cases = [
      ['setup', 'setup', {}, 'Set up Browser Workflow'],
      ['library', 'list_workflows', {}, 'Click the missing button'],
      ['workflow', 'show_workflow', { id: 'e2e-views-ok' }, 'Save the clip'],
      ['import', 'import_workflow', { json: JSON.stringify(okWorkflow('e2e-views-import', 'Imported clip')), fileName: 'clip.json' }, 'Save workflow'],
      ['draft', 'propose_workflow', { workflow: okWorkflow('e2e-views-draft', 'Draft clip') }, 'Test run'],
      ['runSetup', 'ui_test_draft', { pendingId: form.data.pendingId }, 'Run With an input'],
      ['run', 'show_run', { runId: okRun }, 'Done · 2 steps'],
      ['failure', 'show_failure', { runId: failRun }, 'Failed at step 1 of 1'],
      ['change', 'propose_change', { workflowId: 'e2e-views-fail', reason: 'The button has another id.', runId: failRun, changes: [{ stepId: 'click', step: { action: { xpathSelector: '//button' } } }] }, 'Proposed fix'],
      ['runs', 'list_runs', { workflowId: 'e2e-views-ok' }, 'Runs'],
      ['stepRun', 'show_step', { runId: okRun, stepId: 'save' }, 'Saved clips/clip.mp4'],
      ['data', 'show_run_data', { runId: okRun }, 'items'],
      ['history', 'show_history', { id: 'e2e-views-ok' }, 'Version history'],
      ['account', 'show_account', {}, 'Account'],
      ['error', 'show_workflow', { id: 'e2e-views-none' }, 'Not found. It may have been deleted.'],
    ];
    for (const [view, name, args, expect] of cases) {
      const r = await tool(name, args);
      assert.equal(r.data.view, view, `${name} answers the ${view} view`);
      await showInChat(r);
      await until(async () => (await widgetText()).includes(expect), 10_000, `the ${view} view to show "${expect}"`);
      await shot(chat, `widget-view-${view}`);
    }
  });

  it('screenshots in dark and in Vietnamese', { skip: !SHOTS }, async () => {
    // The run view is the earlier run's (the free plan, with no account server here, allows 7 runs a day).
    const okRun = /- (\S+) /.exec((await tool('read_runs', { workflowId: 'e2e-views-ok' })).text)?.[1];
    for (const [lang, theme] of [['en', 'dark'], ['vi', 'light'], ['vi', 'dark']]) {
      await tool('ui_set_language', { lang });
      const locale = lang === 'vi' ? 'vi-VN' : 'en-US';
      const draft = await tool('propose_workflow', { workflow: okWorkflow(`e2e-views-shot-${lang}-${theme}`, lang === 'vi' ? 'Lưu video' : 'Save the clip') });
      await showInChat(draft, { theme, locale });
      await until(async () => (await widgetText()).length > 50, 10_000, 'the widget');
      await shot(chat, `widget-draft-${lang}-${theme}`);
      const run = await tool('show_run', { runId: okRun });
      await showInChat(run, { theme, locale });
      await until(async () => /(Done|Xong)/.test(await widgetText()), 60_000, 'the run');
      await shot(chat, `widget-run-${lang}-${theme}`);
      await panel.emulateMedia({ colorScheme: theme });
      await panel.reload();
      await until(async () => (await panelText()).includes(lang === 'vi' ? 'Workflow' : 'Workflows'), 10_000, 'the panel Home');
      await until(async () => (await panelText()).match(lang === 'vi' ? /Đang chờ bạn duyệt/ : /Waiting for your approval/), 10_000, 'the badge');
      await shot(panel, `panel-home-badge-${lang}-${theme}`);
      await panel.getByRole('button', { name: lang === 'vi' ? 'Xem' : 'Review', exact: true }).click();
      await until(async () => (await panel.locator('input[id^="name-"]').count()) > 0, 10_000, 'the draft in the panel');
      await shot(panel, `panel-draft-${lang}-${theme}`);
      // Left unsaved: the free plan keeps 3 workflows.
      await panelHome();
      const row = panel.locator('.row-wrap', { hasText: 'Click the missing button' });
      await row.getByRole('button', { name: /^(Run|Chạy) / }).click();
      await until(async () => /(Failed at step|Lỗi ở bước|bước 1)/.test(await panelText()), 60_000, 'the failure');
      await shot(panel, `panel-failure-${lang}-${theme}`);
    }
    await tool('ui_set_language', { lang: 'en' });
    await panel.emulateMedia({ colorScheme: 'light' });
  });
});
