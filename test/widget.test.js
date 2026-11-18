// The widget (MCP Apps): dist/widget.html is built and is one file; the server registers it as a ui:// resource
// under an address that changes with each build; every tool that had the widget in v1 carries `_meta.ui`, and
// the widget's own tools (ui_*) are visible to the widget only. Also the side panel build and the queue of the
// user's side-panel actions for wait_for_user.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { Client, InMemoryTransport as ClientMemory } from '@modelcontextprotocol/client';
import { createServer, RESOURCE_MIME_TYPE, uiUri, UserActions, widgetHtml, WORKFLOW_TOOLS } from '../src/server.js';

const dist = (f) => new URL(`../dist/${f}`, import.meta.url);

/** v1's tools registered without the widget (noUi). */
const NO_UI = ['get_step_schema', 'read_workflows', 'get_workflow', 'get_history', 'read_runs', 'get_run', 'get_step', 'get_run_data', 'get_failure', 'get_account', 'set_language'];

async function connect(link = { call: async () => ({ text: '', payload: {} }), on: () => () => {}, open: async () => {} }) {
  const server = createServer(link);
  const [a, b] = ClientMemory.createLinkedPair();
  await server.connect(a);
  const client = new Client({ name: 'test', version: '1' });
  await client.connect(b);
  return client;
}

test('dist/widget.html is one self-contained file', () => {
  const html = readFileSync(dist('widget.html'), 'utf8');
  assert.match(html, /<div id="app">/);
  // Everything inline: no script or stylesheet loaded from a file next to it.
  assert.doesNotMatch(html, /<script[^>]+src=/);
  assert.doesNotMatch(html, /<link[^>]+rel="stylesheet"/);
  assert.ok(html.length > 20_000, 'the views are in it');
  assert.equal(widgetHtml(), html);
});

test('dist/panel/ is the side panel build: an ES module with mountPanel, and its CSS', () => {
  const js = readFileSync(dist('panel/panel.js'), 'utf8');
  assert.match(js, /export \{[^}]*mountPanel[^}]*\}/);
  assert.ok(readFileSync(dist('panel/panel.css'), 'utf8').includes('.btn'));
});

test('the widget is a ui:// resource under an address made from its content', async () => {
  const uri = uiUri();
  assert.match(uri, /^ui:\/\/browser-workflow\/app-[0-9a-f]{10}\.html$/);
  const client = await connect();
  const { resources } = await client.listResources();
  const r = resources.find((x) => x.uri === uri);
  assert.ok(r, 'registered');
  assert.equal(r.mimeType, RESOURCE_MIME_TYPE);
  const read = await client.readResource({ uri });
  assert.equal(read.contents[0].text, widgetHtml());
  assert.deepEqual(read.contents[0]._meta, { ui: { csp: { resourceDomains: ['data:'] } } });
  // An address from an earlier build gets today's widget.
  const old = await client.readResource({ uri: 'ui://browser-workflow/app-0123456789.html' });
  assert.equal(old.contents[0].text, widgetHtml());
});

test('the tools that had the widget in v1 carry _meta.ui; ui_* are for the widget only', async () => {
  const client = await connect();
  const { tools } = await client.listTools();
  const uri = uiUri();
  for (const t of WORKFLOW_TOOLS) {
    const listed = tools.find((x) => x.name === t.name);
    assert.ok(listed, t.name);
    if (NO_UI.includes(t.name)) {
      assert.equal(listed._meta?.ui, undefined, `${t.name} has no widget`);
      continue;
    }
    assert.equal(listed._meta?.ui?.resourceUri, uri, t.name);
    assert.equal(listed._meta?.['ui/resourceUri'], uri, t.name);
    assert.deepEqual(listed._meta.ui.visibility, t.name.startsWith('ui_') || t.name === 'show_workflows' || t.name === 'show_runs' ? ['app'] : ['model', 'app'], t.name);
  }
  for (const n of ['extension_status', 'wait_for_user', 'page_take_snapshot']) assert.equal(tools.find((x) => x.name === n)?._meta?.ui, undefined, n);
});

test('with Chrome closed, a tool with the widget answers "Open Chrome to continue." with a view to get going', async () => {
  const { LinkError, OPEN_CHROME } = await import('../src/link.js');
  const client = await connect({ call: async () => { throw new LinkError('not_running', OPEN_CHROME); }, on: () => () => {}, open: async () => {} });
  const setup = await client.callTool({ name: 'setup', arguments: {} });
  assert.equal(setup.content[0].text, OPEN_CHROME);
  assert.equal(setup.structuredContent.view, 'setup');
  assert.equal(setup.structuredContent.step, 'extension');
  const list = await client.callTool({ name: 'list_workflows', arguments: {} });
  assert.equal(list.structuredContent.view, 'error');
  assert.equal(list.structuredContent.code, 'not_running');
  const read = await client.callTool({ name: 'read_workflows', arguments: {} });
  assert.equal(read.content[0].text, OPEN_CHROME);
  assert.equal(read.structuredContent, undefined);
});

test('a side-panel action that comes while nobody waits answers the next wait; silent ones go with it', async () => {
  let emit;
  const link = { open: async () => {}, on: (name, fn) => { emit = fn; return () => {}; } };
  const actions = new UserActions(link);
  emit({ kind: 'context', text: 'Run r1 failed at step 2.', silent: true });
  emit({ kind: 'ask_claude', text: 'Fix the failed run r1.', runId: 'r1' });
  const got = await new Promise((resolve) => actions.on('user.action', resolve));
  assert.equal(got.text, 'Fix the failed run r1. (Details: Run r1 failed at step 2.)');
  assert.equal(got.runId, 'r1');
  // A waiter gets the next one as it comes, and nothing is kept for later.
  const next = new Promise((resolve) => actions.on('user.action', resolve));
  emit({ kind: 'ask_claude', text: 'Again.' });
  assert.equal((await next).text, 'Again.');
  assert.equal(actions.queue.length, 0);
});
