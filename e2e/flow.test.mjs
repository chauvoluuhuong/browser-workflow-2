// The plugin end to end, through the real host and socket: an MCP client starts dist/server.mjs (which registers
// its native host into a test profile's own NativeMessagingHosts folder and a temp HOME, never the real ones),
// Chromium starts with the extension's dev build (BW2_EXTENSION_DIR, default ../browser-workflow-2-extension), and
// the flow runs against the extension's fixture site:
//   extension_status → get_step_schema → page_new_page / take_snapshot / fill / click / wait_for → propose_workflow
//   → ui_save_draft (test run) fails → get_failure → propose_change → ui_apply_change → the rerun passes;
//   wait_for_user returns on a user.action from the extension; Chrome closed → "Open Chrome to continue." at once.
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { existsSync, mkdtempSync, rmSync } from 'node:fs';
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
/** Chrome for Testing 158 when Playwright has it (D2: Chromium 153 hangs Page.navigate in background tabs), else playwright-core's. */
const CFT = join(homedir(), 'Library/Caches/ms-playwright/chromium-1254/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing');
const CHROME = process.env.BW_CHROME || (existsSync(CFT) ? CFT : undefined);
const REAL_MANIFEST = join(homedir(), 'Library', 'Application Support', 'Google', 'Chrome', 'NativeMessagingHosts', 'com.browser_workflow_2.host.json');
const t0 = Date.now();
const log = (s) => console.log(`[plugin e2e] +${((Date.now() - t0) / 1000).toFixed(1)}s ${s}`);

let site, home, profile, extDist, client, context, worker, realManifestBefore;

/** A tool call: its text, structuredContent and isError. */
async function tool(name, args = {}) {
  const r = await client.callTool({ name, arguments: args }, undefined, { timeout: 10 * 60_000 });
  return { text: r.content?.find((c) => c.type === 'text')?.text ?? '', data: r.structuredContent ?? {}, isError: !!r.isError, images: (r.content ?? []).filter((c) => c.type === 'image') };
}

/** Waits until get_run says the run is over; answers its text. */
async function runEnd(runId, ms = 90_000) {
  const end = Date.now() + ms;
  for (;;) {
    const r = await tool('get_run', { runId });
    const status = /: (running|waiting_manual|success|failure|stopped),/.exec(r.text)?.[1];
    if (status && status !== 'running' && status !== 'waiting_manual') return { status, text: r.text };
    if (Date.now() > end) throw new Error(`run ${runId} still going: ${r.text}`);
    await new Promise((r2) => setTimeout(r2, 300));
  }
}

const workflow = (submitXpath) => ({
  id: 'e2e-plugin-search',
  name: 'HS search (plugin e2e)',
  pageUrl: `${site.url}/`,
  description: 'Search and page through results',
  runTimeVariableSchema: { type: 'object', properties: { page: { type: 'number', default: 1 } } },
  steps: [
    { id: 'type', stepType: 'executeXpathCommand', stepName: 'Type code', action: { xpathSelector: '//input[@name="q"]', command: 'fill', value: '0103' }, nextStepId: 'submit' },
    { id: 'submit', stepType: 'executeXpathCommand', stepName: 'Submit', action: { xpathSelector: submitXpath, command: 'click', timeoutMs: 1500 }, nextStepId: 'wait' },
    { id: 'wait', stepType: 'executeXpathCommand', stepName: 'Wait for results', action: { xpathSelector: '//table[@id="results"]', command: 'waitFor' }, nextStepId: 'extract' },
    { id: 'extract', stepType: 'extractData', stepName: 'Extract rows', nextStepId: 'count', action: { jsCode: "() => [...document.querySelectorAll('#results tr')].slice(1).map(tr => { const td = tr.querySelectorAll('td'); return { code: td[0].textContent, desc: td[1].textContent, duty: td[2].textContent }; })" } },
    { id: 'count', stepType: 'javascript', stepName: 'Next page number', action: { jsCode: '() => ({ variables: { page: {{runtime.page}} + 1 } })' }, nextStepId: 'more' },
    { id: 'more', stepType: 'if', stepName: 'More pages?', action: { jsCondition: 'runtime.page <= 3', trueNextStepId: 'next', falseNextStepId: null }, nextStepId: null },
    { id: 'next', stepType: 'executeXpathCommand', stepName: 'Next page', action: { xpathSelector: '//a[@rel="next"]', command: 'click' }, nextStepId: 'wait' },
  ],
});

describe('the plugin through the real host', { timeout: 10 * 60_000 }, () => {
  before(async () => {
    realManifestBefore = existsSync(REAL_MANIFEST);
    ({ startSite: site } = await import(join(EXT, 'e2e', 'site.ts')));
    site = await site();
    home = mkdtempSync(join(tmpdir(), 'bw2-plugin-e2e-'));
    profile = mkdtempSync(join(tmpdir(), 'bw2-plugin-profile-'));
    extDist = join(home, 'extension');
    execFileSync(process.execPath, [join(EXT, 'scripts', 'build.mjs'), '--dev', '--out', extDist], { stdio: 'inherit' });
    const env = { ...process.env, HOME: home, BW2_HOME: join(home, '.browser-workflow-2'), BW2_HOST_DIRS: join(profile, 'NativeMessagingHosts') };
    client = new Client({ name: 'plugin-e2e', version: '0' });
    await client.connect(new StdioClientTransport({ command: process.execPath, args: [join(ROOT, 'dist', 'server.mjs')], env, stderr: 'inherit' }));
    assert.ok(existsSync(join(profile, 'NativeMessagingHosts', 'com.browser_workflow_2.host.json')), 'the server registered its host into the profile');
    log('MCP server started, host registered into the test profile');
    context = await chromium.launchPersistentContext(profile, {
      headless: false,
      ...(CHROME ? { executablePath: CHROME } : {}),
      args: [`--disable-extensions-except=${extDist}`, `--load-extension=${extDist}`, '--no-first-run', '--no-default-browser-check'],
      viewport: null,
    });
    worker = context.serviceWorkers().find((w) => w.url().includes(DEV_ID)) ?? (await context.waitForEvent('serviceworker', { predicate: (w) => w.url().includes(DEV_ID), timeout: 30_000 }));
    await (context.pages()[0] ?? (await context.newPage())).goto(`${site.url}/csp`);
    log('Chromium started with the extension');
  });

  after(async () => {
    await context?.close().catch(() => {});
    await client?.close().catch(() => {});
    await site?.close();
    for (const d of [home, profile]) if (d) rmSync(d, { recursive: true, force: true, maxRetries: 10, retryDelay: 200 });
    assert.equal(existsSync(REAL_MANIFEST), realManifestBefore, 'the real Chrome folder was not touched');
  });

  it('extension_status: ready once the extension connects', async () => {
    const end = Date.now() + 40_000;
    let r;
    do {
      r = await tool('extension_status');
      if (!r.isError) break;
      await new Promise((x) => setTimeout(x, 500));
    } while (Date.now() < end);
    assert.match(r.text, /^Browser Workflow is ready: the extension answers in Chrome \(extension 0\.0\.0, plugin 0\.0\.0\)\./);
    log(`extension_status: ${r.text}`);
  });

  it('get_step_schema: the guide and the schema, with the download step', async () => {
    const r = await tool('get_step_schema');
    assert.match(r.text, /^# Building and fixing browser workflows/);
    assert.match(r.text, /## JSON Schema/);
    assert.ok(r.text.includes('"download"'));
    assert.ok((await tool('get_account')).text.includes('Setup: finished.'));
  });

  it('the inspector: new page, snapshot, fill, click, wait', async () => {
    assert.match((await tool('page_new_page', { url: `${site.url}/` })).text, /\[selected\]/);
    const snap = (await tool('page_take_snapshot')).text;
    const box = /uid=(\S+) textbox "HS code"/.exec(snap)?.[1];
    const button = /uid=(\S+) button "Search"/.exec(snap)?.[1];
    assert.ok(box && button, snap);
    await tool('page_fill', { uid: box, value: '0103' });
    assert.match((await tool('page_click', { uid: button })).text, /Successfully clicked/);
    assert.match((await tool('page_wait_for', { text: 'Live swine 3', timeout: 10_000 })).text, /found/);
    assert.match((await tool('page_list_network_requests')).text, /POST .*\/api\/track/);
    const shot = await client.callTool({ name: 'page_take_screenshot', arguments: {} });
    assert.equal(shot.content.find((c) => c.type === 'image')?.mimeType, 'image/jpeg');
    log('inspector ok');
  });

  it('propose → save & test run fails → get_failure → propose_change → apply → the rerun passes', async () => {
    // A plain failure (it does not wake Claude), so this flow fixes it with propose_change as before.
    const draft = await tool('propose_workflow', { workflow: { ...workflow('//button[@id="missing"]'), onError: { wake: false } } });
    assert.match(draft.text, /^Draft "HS search \(plugin e2e\)" \(7 steps\) is shown for review/);
    // Save & test run on a workflow that never ran stops at the question first; the run starts with the answer.
    const asked = await tool('ui_save_draft', { pendingId: draft.data.pendingId, testRun: true });
    assert.match(asked.text, /^Not started: this workflow never ran/);
    assert.equal(asked.data.view, 'runSetup');
    assert.equal(asked.data.askClaudeCanChange, true);
    const saved = await tool('run_workflow', { id: 'e2e-plugin-search', claudeCanChange: false });
    assert.match(saved.text, /^Started\. Run run_\S+ of "HS search \(plugin e2e\)" v1/);
    const failed = await runEnd(saved.data.run.runId);
    assert.equal(failed.status, 'failure');
    log(`first run: ${failed.text.split('\n')[0]}`);

    const f = await tool('get_failure', { runId: saved.data.run.runId });
    assert.match(f.text, /failed at step 2 \[submit\] "Submit"/);
    assert.match(f.text, /Error \(cant_get_web_element_xpath\): Timeout 1500ms exceeded/);
    assert.match(f.text, /HTML near the target/);
    assert.equal(f.images[0]?.mimeType, 'image/jpeg');

    const change = await tool('propose_change', { workflowId: 'e2e-plugin-search', runId: saved.data.run.runId, reason: 'The search button is #go.', changes: [{ stepId: 'submit', step: { action: { xpathSelector: '//button[@id="go"]' } } }] });
    assert.equal(change.data.isFix, true);
    assert.equal(change.data.testUntilStepId, 'submit');
    const applied = await tool('ui_apply_change', { pendingId: change.data.pendingId });
    assert.match(applied.text, /^Change saved as v2\./);
    const test = await runEnd(applied.data.run.runId);
    assert.equal(test.status, 'success');

    const rerun = await tool('run_workflow', { id: 'e2e-plugin-search' });
    const t = Date.now();
    const done = await runEnd(rerun.data.run.runId);
    assert.equal(done.status, 'success', done.text);
    assert.match(done.text, /9 items extracted/);
    assert.match((await tool('get_run_data', { runId: rerun.data.run.runId })).text, /^Items 1-9 of 9/);
    log(`rerun passed in ${Date.now() - t} ms: ${done.text.split('\n')[0]}`);
  });

  it('wait_for_user returns on a user.action from the extension', async () => {
    const t = Date.now();
    const waiting = tool('wait_for_user', { minutes: 1 });
    await new Promise((r) => setTimeout(r, 1500));
    await worker.evaluate(() => self.__bw.emit('user.action', { kind: 'approve', text: 'The user approved the change.', pendingId: 'change_x' }));
    const r = await waiting;
    assert.equal(r.text, 'The user acted in the Browser Workflow side panel: The user approved the change. (approve; pendingId change_x).');
    log(`wait_for_user answered after ${Date.now() - t} ms`);
  });

  it('Chrome closed: "Open Chrome to continue." at once', async () => {
    await context.close();
    context = undefined;
    const t = Date.now();
    const r = await tool('get_run', { runId: 'run_any' });
    const ms = Date.now() - t;
    assert.equal(r.text, 'Open Chrome to continue.');
    assert.equal(r.isError, true);
    assert.ok(ms < 3_000, `took ${ms} ms`);
    const st = await tool('extension_status');
    assert.match(st.text, /Open Chrome to continue\.|Chrome is open, but the Browser Workflow extension is not answering/);
    log(`Chrome closed: answered in ${ms} ms`);
  });
});
