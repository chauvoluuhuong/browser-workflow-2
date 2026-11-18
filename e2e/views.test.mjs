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

// ---------- the side panel's Claude chat (Use with Claude), from a fake runtime ----------
// dist/panel/ mounted in a plain page whose `chrome.runtime` answers like the service worker will (Package C):
// mockup states 1–8 (strip: none / opening / listening; chat: listening / working / stopped / @ picker / chips),
// in en and vi, light and dark. With BW2_CHAT_SHOTS=<folder> (or BW2_SCREENSHOTS) it saves their screenshots.
// Also: an extension that answers no chat.* message → the strip stays "not connected", and Send goes as a
// `user.action` (kind chat).
const CHAT_SHOTS = process.env.BW2_CHAT_SHOTS || SHOTS;
const PANEL_PAGE = `<!doctype html><html><head><meta charset="utf-8"><link rel="stylesheet" href="/panel.css"><style>
  :root { color-scheme: light dark; } body { background: light-dark(#ffffff, #1e1f22); }
</style></head><body><div id="root"></div><script type="module">
  window.__sent = []; window.__opened = [];
  const listeners = new Set();
  // A claude:// link is recorded, not followed (there is no Claude app here).
  document.addEventListener('click', (e) => {
    const a = e.target.closest && e.target.closest('a');
    if (a && a.href.startsWith('claude:')) { e.preventDefault(); window.__opened.push(a.href); }
  }, true);
  const answer = (m) => {
    const c = window.__cfg;
    window.__sent.push(m);
    switch (m.bw) {
      case 'tools.call':
        if (m.name === 'list_workflows') return { ok: true, result: { text: '', payload: { view: 'library', workflows: c.workflows, lang: c.lang } } };
        if (m.name === 'ui_proposal') return { ok: true, result: { text: '', payload: { proposals: [] } } };
        return { ok: true, result: { text: '', payload: { view: 'error', message: 'not in this test' } } };
      case 'user.action': return { delivered: !!c.delivered };
      default:
        if (!c.chat) return undefined; // an extension without the chat
        if (m.bw === 'chat.state') return { state: c.state };
        if (m.bw === 'chat.log') return { entries: c.entries };
        if (m.bw === 'chat.mentions') {
          const q = (m.query || '').toLowerCase();
          const f = (l) => l.filter((x) => (x.name + ' ' + (x.url || '')).toLowerCase().includes(q));
          return { workflows: f(c.mentions.workflows), runs: f(c.mentions.runs), tabs: f(c.mentions.tabs) };
        }
        if (m.bw === 'chat.send') return { delivered: true };
        return undefined;
    }
  };
  window.chrome = {
    runtime: {
      sendMessage: async (m) => answer(JSON.parse(JSON.stringify(m))),
      onMessage: { addListener: (f) => listeners.add(f), removeListener: (f) => listeners.delete(f) },
    },
    tabs: { create: async () => {} },
  };
  window.__emit = (name, data) => listeners.forEach((f) => f({ bw: 'event', name, data }));
  window.__update = (patch) => { Object.assign(window.__cfg, patch); window.__emit('chat.update', { state: window.__cfg.state, entries: window.__cfg.entries }); };
  window.start = async (cfg) => {
    window.__cfg = cfg;
    const { mountPanel } = await import('/panel.js');
    mountPanel(document.getElementById('root'));
  };
</script></body></html>`;

const ago = (min) => new Date(Date.now() - min * 60_000).toISOString();
const CHAT_TEXT = {
  en: {
    wf: [['VnExpress Xe: times', 'vnexpress.net'], ['Chotot: iPhone search', 'chotot.com'], ['TradingView DXY', 'tradingview.com']],
    ask1: 'Make a workflow that gets the times on vnexpress Xe',
    ans1: 'Done. It opens vnexpress.net/oto-xe and collects each article\'s title, link and time.\nCheck it and save it.',
    saved: '“VnExpress Xe: times” finished · 30 items', savedWf: 'You saved “VnExpress Xe: times”',
    ask2: 'Great. Run it every morning at 7',
    ans2: 'Workflows can\'t start on a schedule yet. You can run it from Home with one click.',
    run1: 'Run the vnexpress one again and tell me the newest title', run2: 'and save them as CSV',
    ready: 'Ready. What should I do?',
    fix: 'Step 3 waited for the "Xe" menu, but the site renamed it. I changed the step to open vnexpress.net/oto-xe directly. Check the change.',
    runLabel: 'VnExpress Xe: times · yesterday 7:58', also: 'Also make one for',
    // What each state shows (mockup 1–8).
    s1: 'Claude isn’t connected', s2: 'Waiting for Claude…', s3: 'Claude is listening', listening: 'Listening', working: 'Claude is working…',
    queued: 'Waits until Claude is done with the first one', stopped: 'Claude stopped listening', review: 'Review', use: 'Use with Claude', code: 'Use Claude Code instead',
    chat: 'Chat', send: 'Send', mention: 'Mention', runs: 'Runs', tabs: 'Open tabs', nothing: 'Nothing opened?',
  },
  vi: {
    wf: [['VnExpress Xe: giờ đăng', 'vnexpress.net'], ['Chotot: tìm iPhone', 'chotot.com'], ['TradingView DXY', 'tradingview.com']],
    ask1: 'Tạo workflow lấy giờ đăng bài ở mục Xe của vnexpress',
    ans1: 'Xong. Workflow mở vnexpress.net/oto-xe và lấy tiêu đề, liên kết, giờ đăng của từng bài.\nBạn xem rồi lưu nhé.',
    saved: '“VnExpress Xe: giờ đăng” đã chạy xong · 30 mục', savedWf: 'Bạn đã lưu “VnExpress Xe: giờ đăng”',
    ask2: 'Tốt. Chạy mỗi sáng lúc 7 giờ nhé',
    ans2: 'Workflow chưa chạy theo lịch được. Bạn có thể chạy từ Trang chính bằng một cú bấm.',
    run1: 'Chạy lại workflow vnexpress và cho tôi tiêu đề mới nhất', run2: 'và lưu thành CSV',
    ready: 'Sẵn sàng. Tôi nên làm gì?',
    fix: 'Bước 3 chờ menu "Xe", nhưng trang đã đổi tên. Tôi đã sửa bước để mở thẳng vnexpress.net/oto-xe. Bạn xem thay đổi nhé.',
    runLabel: 'VnExpress Xe: giờ đăng · hôm qua 7:58', also: 'Làm thêm một cái cho',
    s1: 'Claude chưa được kết nối', s2: 'Đang chờ Claude…', s3: 'Claude đang nghe', listening: 'Đang nghe', working: 'Claude đang làm…',
    queued: 'Sẽ đến Claude khi nó làm xong tin nhắn trước', stopped: 'Claude đã ngừng nghe', review: 'Xem', use: 'Dùng với Claude', code: 'Dùng Claude Code thay thế',
    chat: 'Trò chuyện', send: 'Gửi', mention: 'Nhắc đến', runs: 'Lần chạy', tabs: 'Tab đang mở', nothing: 'Không thấy gì mở ra?',
  },
};
const PROMPTS = {
  en: 'Use Browser Workflow with me from its side panel in Chrome. Call wait_for_user to listen for my messages there. Do what each message asks, put your short answer to me in reply on your next wait_for_user call, and keep listening until I say stop.',
  vi: 'Hãy dùng Browser Workflow cùng tôi từ bảng bên của nó trong Chrome. Gọi wait_for_user để nghe tin nhắn của tôi ở đó. Làm theo từng tin nhắn, đưa câu trả lời ngắn cho tôi vào reply ở lần gọi wait_for_user tiếp theo, và tiếp tục nghe cho đến khi tôi bảo dừng.',
};

function chatCfg(lang, extra = {}) {
  const x = CHAT_TEXT[lang];
  const workflows = x.wf.map(([name, host], i) => ({
    id: `wf-${i}`, name, host, description: '', version: 1, stepCount: 4 - i, example: i > 0,
    ...(i < 2 ? { lastRun: { runId: `run-${i}`, status: 'success', at: ago(30 + i * 600) } } : {}),
  }));
  const wfM = workflows.map((w) => ({ type: 'workflow', id: w.id, name: w.name }));
  return {
    chat: true, lang, state: 'none', entries: [], workflows, delivered: true,
    mentions: {
      workflows: wfM,
      runs: [
        { type: 'run', id: 'run-0', name: `${x.wf[0][0]} · 8:02`, status: 'success', workflowId: 'wf-0' },
        { type: 'run', id: 'run-9', name: x.runLabel, status: 'failure', workflowId: 'wf-0' },
        { type: 'run', id: 'run-1', name: `${x.wf[1][0]} · 7:30`, status: 'success', workflowId: 'wf-1' },
      ],
      tabs: [
        { type: 'tab', name: 'Xe - VnExpress', url: 'https://vnexpress.net/oto-xe' },
        { type: 'tab', name: 'Chotot - Xe máy', url: 'https://xe.chotot.com/mua-ban-xe-may' },
      ],
    },
    ...extra,
  };
}

describe('the side panel\'s Claude chat from a fake runtime (mockup states 1–8)', { timeout: 5 * 60_000 }, () => {
  let browser, server, page;
  const shotChat = async (name) => {
    if (!CHAT_SHOTS) return;
    mkdirSync(CHAT_SHOTS, { recursive: true });
    await new Promise((r) => setTimeout(r, 250));
    await page.screenshot({ path: join(CHAT_SHOTS, `${name}.png`) });
    log(`screenshot ${name}.png`);
  };
  const text = () => page.locator('body').innerText();
  const sees = (s, what = s) => until(async () => (await text()).includes(s), 5_000, `"${what}"`);
  const start = async (cfg, theme = 'light') => {
    await page.emulateMedia({ colorScheme: theme });
    await page.goto(`${server.url}/`);
    await page.evaluate((c) => window.start(c), cfg);
    await until(async () => (await page.locator('.row-wrap').count()) > 0, 10_000, 'Home');
  };
  const sent = (bw) => page.evaluate((b) => window.__sent.filter((m) => m.bw === b), bw);

  before(async () => {
    const files = { '/panel.js': ['dist/panel/panel.js', 'text/javascript'], '/panel.css': ['dist/panel/panel.css', 'text/css'] };
    const http = createServer((req, res) => {
      const f = files[req.url];
      res.writeHead(200, { 'content-type': f ? `${f[1]}; charset=utf-8` : 'text/html; charset=utf-8' });
      res.end(f ? readFileSync(join(ROOT, f[0])) : PANEL_PAGE);
    });
    await new Promise((r) => http.listen(0, '127.0.0.1', r));
    server = { url: `http://127.0.0.1:${http.address().port}`, close: () => new Promise((r) => http.close(r)) };
    browser = await chromium.launch({ headless: true, ...(CHROME ? { executablePath: CHROME } : {}) });
    page = await browser.newPage({ viewport: { width: 360, height: 640 } });
    page.on('pageerror', (e) => log(`page error: ${e.message}`));
  });

  after(async () => {
    await browser?.close().catch(() => {});
    await server?.close();
  });

  for (const lang of ['en', 'vi']) {
    for (const theme of ['light', 'dark']) {
      it(`states 1–8 in ${lang}, ${theme}`, async () => {
        const x = CHAT_TEXT[lang];
        const tag = `${lang}-${theme}`;
        const btn = (name) => page.getByRole('button', { name, exact: true });

        // 1 · Home, no Claude listening.
        await start(chatCfg(lang), theme);
        await sees(x.s1);
        await shotChat(`chat-1-home-none-${tag}`);

        // 2 · Use with Claude opens the app's new chat with the prompt in the panel's language; Claude Code the same.
        await btn(x.code).click();
        await btn(x.use).count().then((n) => n && btn(x.use).click());
        const opened = await page.evaluate(() => window.__opened);
        assert.deepEqual(opened, [
          `claude://code/new?q=${encodeURIComponent(PROMPTS[lang])}`,
          ...(opened.length > 1 ? [`claude://claude.ai/new?q=${encodeURIComponent(PROMPTS[lang])}`] : []),
        ]);
        await sees(x.s2);
        if (tag === 'en-light') {
          // After 10 s with no Claude: how to do it by hand.
          await until(async () => (await text()).includes(x.nothing), 15_000, 'the "Nothing opened?" line');
        }
        await shotChat(`chat-2-home-opening-${tag}`);

        // 3 · Claude listens (the service worker's chat.update): the strip is one line.
        const log1 = [
          { at: ago(6), from: 'you', text: x.ask1 },
          { at: ago(5), from: 'claude', text: x.ans1 },
          { at: ago(5), from: 'event', text: x.wf[0][0], card: { kind: 'proposal', pendingId: 'p-1', name: x.wf[0][0], state: 'pending' } },
          // Cards are worded by the panel from their fields; `text` is the extension's English fallback.
          { at: ago(4.5), from: 'event', text: 'Saved', card: { kind: 'proposal', pendingId: 'p-0', name: x.wf[0][0], state: 'saved' } },
          { at: ago(4), from: 'event', text: 'Run finished', card: { kind: 'run', runId: 'run-0', name: x.wf[0][0], status: 'success', items: 30 } },
          { at: ago(2), from: 'you', text: x.ask2 },
          { at: ago(1), from: 'claude', text: x.ans2 },
        ];
        await page.evaluate((e) => window.__update({ state: 'listening', entries: e }), log1);
        await sees(x.s3);
        assert.ok(!(await text()).includes(x.s2), 'the waiting strip is gone');
        await shotChat(`chat-3-home-listening-${tag}`);

        // 4 · The chat screen: you right, Claude left (newlines kept), a proposal card with Review, an event line.
        await btn(x.chat).click();
        await sees(x.listening);
        assert.equal(await page.locator('.msg.me').count(), 2);
        assert.equal(await page.locator('.msg.claude').first().innerText(), x.ans1);
        assert.equal(await page.locator('.card-mini').getByRole('button', { name: x.review }).count(), 1);
        await sees(x.saved);
        await sees(x.savedWf);
        assert.ok(!(await text()).includes('Run finished'), 'the fallback text is not shown for a known card');
        await shotChat(`chat-4-chat-listening-${tag}`);
        await page.getByRole('button', { name: x.saved }).click();
        await until(async () => (await sent('tools.call')).some((m) => m.name === 'show_run' && m.args.runId === 'run-0'), 5_000, 'show_run from the run card');
        await btn(lang === 'vi' ? 'Trang chính' : 'Home').click();
        await btn(x.chat).click();
        await sees(x.listening);

        // 5 · Working: the indicator under the message Claude works on; a later one waits.
        await page.evaluate((e) => window.__update({ state: 'working', entries: e }), [
          { at: ago(0.25), from: 'you', text: x.run1 },
          { at: ago(0.1), from: 'you', text: x.run2 },
        ]);
        await sees(x.working);
        await sees(x.queued);
        assert.equal(await btn(x.send).isDisabled(), true, 'Send waits for text');
        await shotChat(`chat-5-chat-working-${tag}`);

        // 6 · Claude stopped: the log stays, a banner starts a new chat, the composer is off.
        await page.evaluate((e) => window.__update({ state: 'idle', entries: e }), [
          { at: ago(3), from: 'you', text: x.run1 },
          { at: ago(2), from: 'claude', text: 'Done: 30 items, newest "VinFast giảm giá VF 3…".' },
        ]);
        await sees(x.stopped);
        assert.equal(await page.locator('.ced').getAttribute('contenteditable'), 'false');
        assert.equal(await btn(x.send).isDisabled(), true);
        assert.equal(await page.locator('.banner').getByRole('button', { name: x.use }).count(), 1);
        await shotChat(`chat-6-chat-stopped-${tag}`);

        // 7 · Typing @ opens the picker (workflows, runs, open tabs), filtered as you type.
        await page.evaluate((e) => window.__update({ state: 'listening', entries: e }), [{ at: ago(0.5), from: 'claude', text: x.ready }]);
        await sees(x.listening);
        const box = page.locator('.ced');
        await box.click();
        await page.keyboard.type(lang === 'vi' ? 'chạy ' : 'run ');
        await page.keyboard.type('@vnex');
        const picker = page.locator('.picker');
        await until(async () => (await picker.count()) && (await picker.locator('.pick').count()) === 4, 5_000, 'the picker with 4 matches');
        const picks = await picker.innerText();
        assert.match(picks, new RegExp(x.runs, 'i'));
        assert.match(picks, new RegExp(x.tabs, 'i'));
        assert.ok(!picks.includes('Chotot'), 'filtered by what was typed');
        assert.ok((await sent('chat.mentions')).some((m) => m.query === 'vnex'));
        await shotChat(`chat-7-chat-picker-${tag}`);

        // 8 · ↓↓ Enter picks the failed run (a chip); Esc closes; the Mention button picks a tab; Send sends both.
        await page.keyboard.press('ArrowDown');
        await page.keyboard.press('ArrowDown');
        await page.keyboard.press('Enter');
        await until(async () => (await box.locator('.mchip').count()) === 1, 5_000, 'the chip');
        assert.equal(await picker.count(), 0);
        await page.keyboard.type(lang === 'vi' ? 'và ' : 'and ');
        await page.getByRole('button', { name: `@ ${x.mention}` }).click();
        await until(async () => (await picker.count()) > 0, 5_000, 'the picker from the Mention button');
        await page.keyboard.type('chotot');
        await until(async () => (await picker.locator('.pick').count()) === 3, 5_000, 'the picker filtered to Chotot');
        await page.keyboard.press('Escape');
        assert.equal(await picker.count(), 0, 'Esc closes the picker');
        // Back to an @: pick the tab with the mouse.
        for (let i = 0; i < '@chotot'.length; i++) await page.keyboard.press('Backspace');
        await page.keyboard.type('@xe');
        await until(async () => (await picker.locator('.pick').count()) > 0, 5_000, 'the picker again');
        await picker.locator('.pick', { hasText: 'Chotot - Xe máy' }).click();
        await until(async () => (await box.locator('.mchip').count()) === 2, 5_000, 'two chips');
        await page.keyboard.down('Shift');
        await page.keyboard.press('Enter');
        await page.keyboard.up('Shift');
        await page.keyboard.type('ok?');
        await page.keyboard.press('Enter');
        await until(async () => (await sent('chat.send')).length === 1, 5_000, 'chat.send');
        const [msg] = await sent('chat.send');
        // Each chip is `＠name` (fullwidth, U+FF20) in the text, and `mentions` follow the text's order.
        assert.equal(msg.text, `${lang === 'vi' ? 'chạy' : 'run'} \uff20${x.runLabel} ${lang === 'vi' ? 'và' : 'and'} \uff20Chotot - Xe máy\nok?`);
        assert.deepEqual(msg.mentions.map((m) => [m.type, m.id ?? m.url]), [['run', 'run-9'], ['tab', 'https://xe.chotot.com/mua-ban-xe-may']]);
        assert.equal(await box.innerText().then((s) => s.trim()), '', 'the composer is empty after Send');
        // The log draws each @name as a chip.
        const run9 = chatCfg(lang).mentions.runs[1];
        const wf0 = chatCfg(lang).mentions.workflows[0];
        const tab = chatCfg(lang).mentions.tabs[1];
        await page.evaluate((e) => window.__update({ state: 'listening', entries: e }), [
          { at: ago(3), from: 'you', text: `Why did \uff20${run9.name} fail? Fix \uff20${wf0.name}`, mentions: [run9, wf0] },
          { at: ago(2), from: 'claude', text: x.fix },
          { at: ago(2), from: 'event', text: x.wf[0][0], card: { kind: 'proposal', pendingId: 'p-2', name: x.wf[0][0], state: 'pending' } },
          { at: ago(1), from: 'you', text: `${x.also} \uff20${tab.name}`, mentions: [tab] },
        ]);
        await until(async () => (await page.locator('.log .mchip').count()) === 3, 5_000, 'three chips in the log');
        assert.equal(await page.locator('.log .msg.me').first().textContent(), `Why did ${run9.name} fail? Fix ${wf0.name}`);
        await shotChat(`chat-8-chat-mentions-${tag}`);
      });
    }
  }

  it('an extension without the chat: the strip stays "not connected", Send goes as a user.action', async () => {
    await start(chatCfg('en', { chat: false, delivered: false }));
    await sees('Claude isn’t connected');
    await page.getByRole('button', { name: 'Open the chat', exact: true }).click();
    // Nothing says whether a Claude listens: the composer is open, and no status is claimed.
    await until(async () => (await page.locator('.ced').getAttribute('contenteditable')) === 'true', 5_000, 'the composer');
    assert.equal(await page.locator('.hd .pill').count(), 0);
    await page.locator('.ced').click();
    await page.keyboard.type('hello @TradingView');
    await until(async () => (await page.locator('.picker .pick').count()) === 0 && (await page.locator('.picker').count()) === 1, 5_000, 'the picker, empty');
    await page.keyboard.press('Escape');
    await page.keyboard.press('Enter');
    await until(async () => (await sent('user.action')).length === 1, 5_000, 'the user.action');
    const [{ action }] = await sent('user.action');
    assert.deepEqual(action, { kind: 'chat', text: 'hello @TradingView' });
    await sees('hello @TradingView');
    await sees('Claude didn’t get this');
    await shotChat('chat-fallback-en-light');
  });
});
