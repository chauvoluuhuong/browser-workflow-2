// The tool list is browser-workflow v1's, minus the tools of its hosted server and browser modes, plus the page
// inspector, extension_status and wait_for_user; the server builds with all of them; no wording of v1's bridge.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { createServer, INSTRUCTIONS, PAGE_TOOLS, startPrompt, WORKFLOW_TOOLS } from '../src/server.js';

/** Every tool v1's server registered (src/server/tools.ts), hosted and mock ones included. */
const V1 = [
  'setup', 'list_workflows', 'show_workflow', 'get_step_schema', 'import_workflow', 'propose_workflow', 'run_workflow', 'show_run', 'show_failure',
  'propose_change', 'list_runs', 'show_step', 'show_run_data', 'show_history', 'browser_settings', 'show_account', 'read_workflows', 'get_workflow',
  'get_history', 'read_runs', 'get_run', 'get_step', 'get_run_data', 'get_failure', 'get_account', 'set_language', 'delete_workflow', 'show_workflows',
  'show_runs', 'ui_confirm_import', 'ui_save_draft', 'ui_test_draft', 'ui_apply_change', 'ui_discard_change', 'ui_restore_version', 'ui_resume_manual',
  'ui_stop_run', 'ui_check_browser', 'ui_save_browser', 'ui_get_screenshot', 'ui_set_language', 'ui_sign_in', 'ui_finish_setup', 'ui_new_bridge_token',
  'ui_account_page', 'ui_account_link', 'link_computer', 'ui_confirm_link', 'ui_set_plan',
];
const DROPPED = ['link_computer', 'ui_confirm_link', 'ui_new_bridge_token', 'browser_settings', 'ui_check_browser', 'ui_save_browser', 'ui_set_plan'];
const PAGE = ['list_pages', 'select_page', 'new_page', 'navigate_page', 'take_snapshot', 'take_screenshot', 'click', 'fill', 'press_key', 'evaluate_script', 'wait_for', 'list_console_messages', 'list_network_requests', 'get_network_request'];

test('the workflow tools are v1\'s minus the dropped ones', () => {
  assert.deepEqual(WORKFLOW_TOOLS.map((t) => t.name).sort(), V1.filter((n) => !DROPPED.includes(n)).sort());
});

test('the page tools are v1\'s page_* (chrome-devtools-mcp\'s curated set), each on an inspect.* method', () => {
  assert.deepEqual(PAGE_TOOLS.map((t) => t.name), PAGE.map((n) => `page_${n}`));
  for (const t of PAGE_TOOLS) assert.match(t.method, /^inspect\./);
});

test('the widget\'s tools say only the widget calls them', () => {
  for (const t of WORKFLOW_TOOLS.filter((x) => x.appOnly)) assert.match(t.description, /Only the widget calls this, when the user clicks: never call it yourself\./, t.name);
});

test('no wording of v1\'s bridge, connector or computer linking', () => {
  const text = [INSTRUCTIONS, startPrompt('x'), ...WORKFLOW_TOOLS.map((t) => t.description), readFileSync(new URL('../skills/browser-workflow/SKILL.md', import.meta.url), 'utf8')].join('\n');
  for (const word of ['bridge', 'link_computer', 'connector', 'pairing', 'browser_settings']) assert.ok(!text.toLowerCase().includes(word), word);
  assert.match(INSTRUCTIONS, /Open Chrome to continue\./);
});

test('the server builds with every tool', () => {
  const server = createServer({ call: async () => ({}), on: () => () => {}, open: async () => {} });
  assert.ok(server);
});

test('the skill lists the download step', () => {
  assert.match(readFileSync(new URL('../skills/browser-workflow/SKILL.md', import.meta.url), 'utf8'), /\| `download` \|/);
});
