#!/usr/bin/env node
// The Browser Workflow plugin's MCP server (stdio): a thin layer over the Browser Workflow extension in Chrome.
// The workflow tools keep browser-workflow v1's names, descriptions and inputs, and each is run by the extension
// (`tools.call`); the page_* inspector tools map onto the extension's `inspect.*`; `extension_status` and
// `wait_for_user` are answered here. The engine and the data live in the extension, never in this public repo.
// At start it registers its native host (register.js), so Chrome can connect the extension to it.
// Logs go to stderr: stdout is the MCP channel.
import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { McpServer, ResourceTemplate } from '@modelcontextprotocol/server';
import { StdioServerTransport } from '@modelcontextprotocol/server/stdio';
import { z } from 'zod';
import { WEB_STORE_URL } from './ids.js';
import { Link, LinkError, OPEN_CHROME } from './link.js';
import { registerHost } from './register.js';
import { extensionStatus } from './tools/status.js';
import { waitForUser } from './tools/waitForUser.js';

const log = (line) => process.stderr.write(`[browser-workflow] ${line}\n`);

function readText(rel) {
  try { return readFileSync(new URL(rel, import.meta.url), 'utf8'); } catch { return undefined; }
}
export const VERSION = JSON.parse(readText('../package.json') ?? '{"version":"0.0.0"}').version;
/** The authoring guide: the plugin's skill, passed to the extension's get_step_schema. */
const guide = () => readText('../skills/browser-workflow/SKILL.md') ?? '';

// ---------- the widget (MCP Apps) ----------

/** The MCP Apps resource type (@modelcontextprotocol/ext-apps' RESOURCE_MIME_TYPE). */
export const RESOURCE_MIME_TYPE = 'text/html;profile=mcp-app';
/** The widget's address before it is built (reading it says so). */
export const UI_URI = 'ui://browser-workflow/app.html';

/** The built widget: dist/widget.html, read on every request (a rebuild shows without a restart). */
export function widgetHtml() {
  const html = readText('../dist/widget.html');
  if (!html) throw new Error('The widget is not built: run `npm run build`.');
  return html;
}

/**
 * The widget's address, different for each build of it (v1's uiUri()). Claude keeps the widget it fetched
 * under an address, so a fixed one would leave users on the old widget after an update.
 */
export function uiUri() {
  try {
    return `ui://browser-workflow/app-${createHash('sha256').update(widgetHtml()).digest('hex').slice(0, 10)}.html`;
  } catch {
    return UI_URI;
  }
}

/** Screenshots are data: URLs; strict hosts default to img-src 'none'. */
const UI_META = { ui: { csp: { resourceDomains: ['data:'] } } };

export const INSTRUCTIONS = [
  'browser-workflow creates, runs and fixes browser-automation workflows (JSON step graphs run in the user\'s own Chrome, in the background, by the Browser Workflow extension).',
  'Always check setup first: before any other tool in a conversation, call `get_account` (it shows the user nothing). Its answer ends with "Setup: finished" or "Setup: not finished". When it is not finished, call `setup`, end your reply with one short line and wait: do nothing else, whatever the user asked for, until they have finished it in the widget (it tells you when), then go on with what they asked. Do the same whenever a tool says setup is not finished. Once you have seen "Setup: finished" in this conversation, you need not check again.',
  'When a tool answers "Open Chrome to continue.", Chrome is closed or the extension is not running: tell the user that in one short line and stop. `extension_status` says whether Chrome is open and the extension answers, and where to get the extension when it is missing.',
  'Never change a workflow directly: use import_workflow (a file the user gave), propose_workflow (a new one) or propose_change (edits/fixes). The user confirms in the widget. The ui_* tools are the widget\'s: never call them yourself.',
  'To build or fix a workflow, first read the format with get_step_schema, explore the site with the page_* inspector tools (take_snapshot shows the page structure), then propose.',
  'Every lookup has two tools that answer you with the same text: a silent one (read_workflows, get_workflow, get_history, read_runs, get_run, get_step, get_run_data, get_failure, get_account), which shows the user nothing, and one that also puts a widget in the chat (list_workflows, show_workflow, show_history, list_runs, show_run, show_step, show_run_data, show_failure, show_account).',
  'While you are still working (you need the answer to decide or do something next), always use the silent one. Never call a tool that shows a widget to check something.',
  'For your final answer, when what the user asked for is what a widget shows (their workflows, a workflow, a run, a failure, the extracted items, the history, their account), call the tool that shows it instead of writing it out, and go straight to it when that is all they asked: do not call the silent one first. Then add one short line, and do not repeat in text what the widget shows. A single fact ("how many workflows do I have", "when did it last run") is answered in a sentence, with the silent tool and no widget.',
  'One widget per reply. After a tool that shows a widget where the user has something to do (setup, import_workflow, propose_workflow, propose_change, a run form, or any list_* or show_* tool), end your reply with one short line and wait for the user. Never show two widgets in one reply.',
  'When the user is to do something in the Browser Workflow side panel in Chrome, `wait_for_user` waits for it; when it answers that it is still waiting, call it again (the user can also write in the chat).',
  'When a run fails, call get_failure (screenshot, error, HTML near the target) before proposing a fix; pass runId to propose_change.',
  "Reply in the user's language. The widgets are in English or Vietnamese. `get_account` says which, or that none is chosen yet: then call `set_language` once, before any tool that shows a widget, with the language the user writes in (judge by their own words, not by a prompt this app wrote for them; `vi` for Vietnamese, `en` for anything else), and tell them in one short line which language you will use and that they can ask you to open their account settings to change it. Once a language is chosen, never change it yourself: when the user wants another one, call `show_account`.",
].join('\n');

/** v1's `start` prompt, without the hosted-only part. */
export function startPrompt(goal) {
  const want = goal?.trim();
  return [
    'Help me start using Browser Workflow. Do one thing per reply, and keep your own text short: a widget shows the details. Show me one widget at most in a reply, then stop and wait for me.',
    '',
    '1. Check, without showing me anything: call `get_account`. If a tool answers "Open Chrome to continue.", tell me that and stop.',
    '2. If setup is not finished, call `setup` and stop there: I go through it in the widget, and it tells you when I am done.',
    want
      ? `3. Once setup is finished, this is what I want to automate: "${want}". Look with \`read_workflows\` (it shows me nothing): if a workflow already does it, propose running that one. Otherwise read the format with \`get_step_schema\`, look at the site with the page_* inspector tools, and show me a draft with \`propose_workflow\`. Do not run anything until I confirm.`
      : '3. Once setup is finished, call `list_workflows` and ask me one question: which workflow I want to run, or what I want to automate. Do not run anything until I answer.',
    '',
    'If any step fails, tell me what failed and the one thing I should do next. Reply in the language I write in.',
  ].join('\n');
}

const WIDGET_ONLY = ' Only the widget calls this, when the user clicks: never call it yourself.';
const mine = 'For your own work, while you are still working: answers with text and shows the user nothing.';

/**
 * The workflow tools: browser-workflow v1's registrations (src/server/tools.ts), minus the tools of its hosted
 * server (link_computer, ui_confirm_link, ui_new_bridge_token) and of its browser modes (browser_settings,
 * ui_check_browser, ui_save_browser), and the mock's ui_set_plan. Each is run by the extension.
 * `noUi`: the tools v1 registered without the widget (text for Claude only); every other tool carries `_meta.ui`,
 * and `appOnly` ones are visible to the widget only.
 * @type {{ name: string, title: string, description: string, input?: Record<string, import('zod').ZodType>, readOnly?: boolean, destructive?: boolean, appOnly?: boolean, noUi?: boolean }[]}
 */
export const WORKFLOW_TOOLS = [
  { name: 'setup', title: 'Set up browser-workflow', description: 'Shows the setup widget, where the user adds a first workflow. Call it for new users or when a tool says setup is not finished, alone: no other widget in the same reply.', readOnly: true },
  { name: 'list_workflows', title: 'List workflows', description: 'Lists the user\'s workflows for them, in a widget where they can open or run one (all of them, or a search). Use it whenever the user asks for their workflows, and do not write the list out yourself. Only while you are still working and need the list for yourself, use read_workflows, which shows nothing.', input: { query: z.string().optional().describe('Filter by name, host or description') }, readOnly: true },
  { name: 'show_workflow', title: 'Get workflow', description: 'For your final answer, not while you are still working. Shows the user one workflow (steps, variables, version); they can run it or ask for edits there. Use it when the user asks about one workflow, instead of writing its steps out. To read its definition for your own work, use get_workflow, which shows nothing.', input: { id: z.string() }, readOnly: true },
  { name: 'get_step_schema', title: 'Get workflow format', description: 'How to build workflows, plus the JSON Schema of the format and every step type. Read this before drafting or changing workflows.', readOnly: true, noUi: true },
  { name: 'import_workflow', title: 'Import workflow', description: 'Validate a workflow JSON file (e.g. one the user attached) and show an import preview. Nothing is saved until the user confirms in the widget.', input: { json: z.string().describe('The workflow file content'), fileName: z.string().optional() } },
  { name: 'propose_workflow', title: 'Propose new workflow', description: 'Show a drafted workflow (format: get_step_schema) to the user for review. The user saves it, or saves and test-runs it, from the widget.', input: { workflow: z.record(z.string(), z.any()).describe('Workflow JSON: id, name, pageUrl?, description, steps[], environmentVariableSchema?') } },
  { name: 'run_workflow', title: 'Run workflow', description: 'Start a run from the first step. If required inputs are missing the user gets a form. Returns a runId; the widget shows live progress.', input: { id: z.string(), variables: z.record(z.string(), z.any()).optional().describe('Inputs (environment variables) for this run'), stopAfterStepId: z.string().optional().describe('Stop after this step (to test a change without running everything)'), form: z.boolean().optional().describe('Widget use: show the input form even if all inputs have defaults') } },
  { name: 'show_run', title: 'Get run status', description: 'For your final answer, not while you are still working. Shows the user a run: its status and per-step progress, live while it runs. Use it when the user asks how a run went, instead of writing it out. To check a run for your own work, use get_run, which shows nothing.', input: { runId: z.string() }, readOnly: true },
  { name: 'show_failure', title: 'Get run failure', description: 'For your final answer, not while you are still working. Shows the user the failure of a run (failing step, error, screenshot). Use it when the user asks why a run failed and you are not proposing a fix in this reply. To read what was captured before proposing a fix, use get_failure, which shows nothing.', input: { runId: z.string() }, readOnly: true },
  {
    name: 'propose_change', title: 'Propose a change', description: 'Propose edits to a workflow (a fix for a failed run, or a change the user asked for on a step). Shows a before/after with a one-line reason; the user applies & tests it (re-run from the start up to the changed step) or discards it. Nothing changes until the user applies it.',
    input: {
      workflowId: z.string(),
      reason: z.string().describe('One sentence, in the user\'s language: what was wrong and what changes'),
      runId: z.string().optional().describe('The failed run this fixes, if any'),
      changes: z.array(z.object({
        stepId: z.string(),
        kind: z.enum(['update', 'add', 'remove']).optional().describe('Default update'),
        step: z.record(z.string(), z.any()).optional().describe('update: fields to change (action is merged); add: the full new step'),
        afterStepId: z.string().optional().describe('add: insert after this step (default: at the end). Remember to update nextStepId links.'),
      })).min(1),
    },
  },
  { name: 'list_runs', title: 'List runs', description: 'Lists the past runs of a workflow for the user, newest first, in a widget where they can open one. Use it whenever the user asks for past runs, and do not write them out yourself. Only while you are still working and need them for yourself, use read_runs, which shows nothing.', input: { workflowId: z.string() }, readOnly: true },
  { name: 'show_step', title: 'Get step in a run', description: 'For your final answer, not while you are still working. Shows the user what one step did in one run (state, output or error, screenshot). Use it when the user asks what a step did. To read it for your own work, use get_step, which shows nothing.', input: { runId: z.string(), stepId: z.string() }, readOnly: true },
  { name: 'show_run_data', title: 'Get extracted data', description: 'For your final answer, not while you are still working. Shows the user the table of items a run extracted, with downloads. Use it when the user asks for the data or results of a run, instead of writing a table. To read the items for your own work, use get_run_data, which shows nothing and gives every item.', input: { runId: z.string() }, readOnly: true },
  { name: 'show_history', title: 'Workflow versions', description: 'For your final answer, not while you are still working. Shows the user the version history of a workflow; they can restore an older version there. Use it when the user asks what changed or wants an older version back. To read it for your own work, use get_history, which shows nothing.', input: { id: z.string() }, readOnly: true },
  { name: 'show_account', title: 'Account', description: 'For your final answer, not while you are still working. Shows the user their account and settings (language). Use it when the user asks about their account, usage or settings, and do not write the numbers out beside it. To read them for your own work, use get_account, which shows nothing.', readOnly: true },
  { name: 'read_workflows', title: 'Read workflows', description: `${mine} The saved workflows: id, name, version, number of steps, last run.`, input: { query: z.string().optional().describe('Filter by name, host or description') }, readOnly: true, noUi: true },
  { name: 'get_workflow', title: 'Read workflow', description: `${mine} The full definition of a workflow as JSON (steps, variables, version). Read it before proposing a change.`, input: { id: z.string() }, readOnly: true, noUi: true },
  { name: 'get_history', title: 'Read workflow versions', description: `${mine} The versions of a workflow: when, by whom, and what changed.`, input: { id: z.string() }, readOnly: true, noUi: true },
  { name: 'read_runs', title: 'Read runs', description: `${mine} Past runs of a workflow, newest first: run id, time, version, status, items.`, input: { workflowId: z.string() }, readOnly: true, noUi: true },
  { name: 'get_run', title: 'Read run', description: `${mine} A run's status and the state of each step. Use it to check a run you started.`, input: { runId: z.string() }, readOnly: true, noUi: true },
  { name: 'get_step', title: 'Read step in a run', description: `${mine} What one step did in one run: state, duration, URL, output or error, a downloaded file, variables before it, and its screenshot.`, input: { runId: z.string(), stepId: z.string() }, readOnly: true, noUi: true },
  { name: 'get_run_data', title: 'Read extracted data', description: `${mine} The items a run extracted, one JSON object per line, a part at a time: the answer says how to get the next part.`, input: { runId: z.string(), offset: z.number().int().min(0).optional().describe('Skip this many items (default 0)'), limit: z.number().int().min(1).max(200).optional().describe('At most this many items (default 20)') }, readOnly: true, noUi: true },
  { name: 'get_failure', title: 'Read run failure', description: `${mine} Everything captured when a run failed: failing step and its definition, error, URL, console errors, variables, HTML near the target element, and a screenshot.`, input: { runId: z.string() }, readOnly: true, noUi: true },
  { name: 'get_account', title: 'Read account', description: `${mine} Where runs are stored, the language, and whether setup is finished. Call it first in a conversation, before any other tool.`, readOnly: true, noUi: true },
  { name: 'set_language', title: 'Set language', description: 'Sets the language of the widgets (English or Vietnamese) to the one the user writes in, and shows nothing. Only when get_account says no language is chosen yet, and before any tool that shows a widget. It changes nothing once a language is chosen: the user changes it in their account settings.', input: { lang: z.enum(['en', 'vi']).describe('vi when the user writes in Vietnamese, en for anything else') }, noUi: true },
  { name: 'delete_workflow', title: 'Delete workflow', description: 'Delete a workflow, all its versions and runs. Only when the user clearly asks.', input: { id: z.string() }, destructive: true },
  // The widget's tools (visibility "app": only the widget sees them): the user's own decisions.
  { name: 'show_workflows', title: 'List workflows', description: `The workflow library, for the widget.${WIDGET_ONLY}`, input: { query: z.string().optional() }, appOnly: true, readOnly: true },
  { name: 'show_runs', title: 'Workflow runs', description: `The past runs of a workflow, for the widget.${WIDGET_ONLY}`, input: { workflowId: z.string() }, appOnly: true, readOnly: true },
  { name: 'ui_confirm_import', title: 'Confirm import', description: `Save an import preview.${WIDGET_ONLY}`, input: { pendingId: z.string() }, appOnly: true },
  { name: 'ui_save_draft', title: 'Save draft', description: `Save a proposed workflow, under the name the user typed.${WIDGET_ONLY}`, input: { pendingId: z.string(), name: z.string().optional(), testRun: z.boolean().optional() }, appOnly: true },
  { name: 'ui_test_draft', title: 'Test a draft', description: `Run a proposed workflow without saving it.${WIDGET_ONLY}`, input: { pendingId: z.string(), variables: z.record(z.string(), z.any()).optional() }, appOnly: true },
  { name: 'ui_apply_change', title: 'Apply change', description: `Apply a proposed change and test it.${WIDGET_ONLY}`, input: { pendingId: z.string() }, appOnly: true },
  { name: 'ui_discard_change', title: 'Discard change', description: `Discard a proposed change.${WIDGET_ONLY}`, input: { pendingId: z.string() }, appOnly: true },
  { name: 'ui_restore_version', title: 'Restore version', description: `Restore an older version.${WIDGET_ONLY}`, input: { id: z.string(), version: z.number() }, appOnly: true },
  { name: 'ui_resume_manual', title: 'Resume run', description: `Resume after a manual step.${WIDGET_ONLY}`, input: { runId: z.string() }, appOnly: true },
  { name: 'ui_stop_run', title: 'Stop run', description: `Stop a run.${WIDGET_ONLY}`, input: { runId: z.string() }, appOnly: true, destructive: true },
  { name: 'ui_get_screenshot', title: 'Get screenshot', description: `A step screenshot for the widget.${WIDGET_ONLY}`, input: { runId: z.string(), stepId: z.string() }, appOnly: true, readOnly: true },
  { name: 'ui_set_language', title: 'Set language', description: `Widget language.${WIDGET_ONLY}`, input: { lang: z.enum(['auto', 'en', 'vi']) }, appOnly: true },
  { name: 'ui_sign_in', title: 'Sign in', description: `Sign in.${WIDGET_ONLY}`, appOnly: true },
  { name: 'ui_finish_setup', title: 'Finish setup', description: `Mark setup as done.${WIDGET_ONLY}`, appOnly: true },
  { name: 'ui_account_page', title: 'Account page', description: `The account page: plan, usage and settings.${WIDGET_ONLY}`, appOnly: true },
  { name: 'ui_account_link', title: 'Create account', description: `A page where the user creates an account.${WIDGET_ONLY}`, appOnly: true },
  { name: 'ui_proposal', title: 'Proposal', description: `A proposal as it is now (it may have been approved in the side panel), or the proposals waiting.${WIDGET_ONLY}`, input: { pendingId: z.string().optional() }, appOnly: true, readOnly: true },
  { name: 'ui_show_file', title: 'Show in folder', description: `Shows a file a download step saved in its folder.${WIDGET_ONLY}`, input: { runId: z.string(), stepId: z.string() }, appOnly: true, readOnly: true },
];

const INSPECT = '[Inspector — the same Chrome as workflow runs, in the extension\'s own tab group]';
/**
 * The page inspector: v1's page_* tools (chrome-devtools-mcp's names and inputs), answered by the extension.
 * @type {{ name: string, method: string, title: string, description: string, input?: Record<string, import('zod').ZodType>, args?: (a: any) => any, readOnly?: boolean }[]}
 */
export const PAGE_TOOLS = [
  { name: 'page_list_pages', method: 'inspect.listPages', title: 'Inspector: list pages', description: `${INSPECT} Get a list of pages open in the inspector.`, readOnly: true },
  { name: 'page_select_page', method: 'inspect.selectPage', title: 'Inspector: select page', description: `${INSPECT} Select a page as a context for future tool calls.`, input: { pageIdx: z.number().int().min(0).describe('The index of the page to select (from page_list_pages)') } },
  { name: 'page_new_page', method: 'inspect.newPage', title: 'Inspector: new page', description: `${INSPECT} Creates a new page, loads a URL in it, and selects it.`, input: { url: z.string().describe('URL to load in the new page'), timeout: z.number().int().optional().describe('Maximum wait time in milliseconds') } },
  { name: 'page_navigate_page', method: 'inspect.navigate', title: 'Inspector: navigate page', description: `${INSPECT} Navigates the selected page to a URL, back, forward, or reloads it.`, input: { type: z.enum(['url', 'back', 'forward', 'reload']).optional().describe('Default url'), url: z.string().optional().describe('Target URL (type url)'), timeout: z.number().int().optional().describe('Maximum wait time in milliseconds') } },
  { name: 'page_take_snapshot', method: 'inspect.snapshot', title: 'Inspector: take snapshot', description: `${INSPECT} Take a text snapshot of the selected page, based on the accessibility tree: every element has a uid to use with page_click, page_fill and page_evaluate_script.`, input: { verbose: z.boolean().optional().describe('Include every node, not only the meaningful ones') }, readOnly: true },
  { name: 'page_take_screenshot', method: 'inspect.screenshot', title: 'Inspector: take screenshot', description: `${INSPECT} Take a screenshot of the selected page.`, input: { format: z.enum(['jpeg', 'png']).optional(), quality: z.number().int().min(0).max(100).optional(), fullPage: z.boolean().optional() }, readOnly: true },
  { name: 'page_click', method: 'inspect.click', title: 'Inspector: click', description: `${INSPECT} Clicks the element with the uid from the latest snapshot.`, input: { uid: z.string(), dblClick: z.boolean().optional() } },
  { name: 'page_fill', method: 'inspect.fill', title: 'Inspector: fill', description: `${INSPECT} Types text into an input or textarea, or selects an option of a select element, by uid.`, input: { uid: z.string(), value: z.string() } },
  { name: 'page_press_key', method: 'inspect.pressKey', title: 'Inspector: press key', description: `${INSPECT} Press a key or a combination, e.g. "Enter", "Control+A".`, input: { key: z.string() } },
  { name: 'page_evaluate_script', method: 'inspect.evaluate', title: 'Inspector: evaluate script', description: `${INSPECT} Evaluate a JavaScript function in the selected page and answer its JSON result, e.g. "() => document.title"; elements from the snapshot can be passed in args.`, input: { function: z.string(), args: z.array(z.object({ uid: z.string() })).optional() } },
  { name: 'page_wait_for', method: 'inspect.waitFor', title: 'Inspector: wait for', description: `${INSPECT} Wait for the text to appear on the selected page.`, input: { text: z.string(), timeout: z.number().int().optional().describe('Maximum wait time in milliseconds') }, args: (a) => ({ text: a.text, ...(a.timeout ? { timeoutMs: a.timeout } : {}) }), readOnly: true },
  { name: 'page_list_console_messages', method: 'inspect.console', title: 'Inspector: list console messages', description: `${INSPECT} The console messages of the selected page since its last navigation.`, input: { types: z.array(z.string()).optional() }, readOnly: true },
  { name: 'page_list_network_requests', method: 'inspect.network', title: 'Inspector: list network requests', description: `${INSPECT} The requests of the selected page since its last navigation.`, input: { resourceTypes: z.array(z.string()).optional() }, readOnly: true },
  { name: 'page_get_network_request', method: 'inspect.request', title: 'Inspector: get network request', description: `${INSPECT} One request in detail: headers and the response body.`, input: { reqid: z.number().int() }, readOnly: true },
];

/**
 * A LinkError as a tool answer: "Open Chrome to continue." and friends. A tool with a widget also gets a view:
 * Chrome closed (or the extension missing) shows how to get Browser Workflow running, with Check again.
 */
function refusal(e, tool) {
  if (e instanceof LinkError) {
    if (e.code === 'not_running') {
      const view = !tool || tool.noUi ? undefined
        : tool.name === 'setup' ? { view: 'setup', step: 'extension', workflows: 0, link: WEB_STORE_URL }
        : { view: 'error', code: 'not_running', message: OPEN_CHROME, link: WEB_STORE_URL };
      return { content: [{ type: 'text', text: OPEN_CHROME }], ...(view ? { structuredContent: { ...view, modelText: OPEN_CHROME } } : {}), isError: true };
    }
    if (e.code === 'unsupported') return { content: [{ type: 'text', text: `The Browser Workflow extension in Chrome is older than this plugin and does not know this yet. ${e.message} Ask the user to update the extension (Chrome updates it by itself, usually within a day).` }], isError: true };
    return { content: [{ type: 'text', text: e.message }], isError: true };
  }
  return { content: [{ type: 'text', text: `Error: ${e?.message ?? e}` }], isError: true };
}

/**
 * The user's actions in the side panel (`user.action` events), for wait_for_user. An action that comes while no
 * wait_for_user is waiting is kept (the last 20, for an hour) and answers the next one at once. A silent action
 * (`silent`: what the panel tells Claude without asking anything, e.g. that a run ended) wakes nobody: its text
 * goes with the next action. Shaped like the Link for waitForUser: `open()` and `on('user.action', fn)`.
 */
export class UserActions {
  /** @param {{ open(): Promise<void>, on(name: string, fn: (d: any) => void): () => void }} link */
  constructor(link, { keep = 20, keepMs = 60 * 60_000 } = {}) {
    this.link = link;
    this.keep = keep;
    this.keepMs = keepMs;
    /** @type {{ at: number, data: any }[]} */
    this.queue = [];
    /** @type {string[]} */
    this.context = [];
    /** @type {Set<(d: any) => void>} */
    this.waiters = new Set();
    link.on('user.action', (d) => this.push(d));
  }

  open() {
    return this.link.open();
  }

  push(d) {
    if (!d || typeof d !== 'object') return;
    if (d.silent) {
      this.context.push(String(d.text ?? ''));
      if (this.context.length > 5) this.context.shift();
      return;
    }
    const data = this.withContext(d);
    if (this.waiters.size) {
      for (const w of [...this.waiters]) w(data);
      return;
    }
    this.queue.push({ at: Date.now(), data });
    if (this.queue.length > this.keep) this.queue.shift();
  }

  /** Context the panel gave (with the action, or silently before it), after the action's own words. */
  withContext(d) {
    const ctx = [...this.context.splice(0), ...(d.context ? [String(d.context)] : [])].filter(Boolean);
    return ctx.length ? { ...d, text: `${d.text ?? ''} (Details: ${ctx.join(' ')})` } : d;
  }

  /** Listens to the next action: one kept from before answers at once. */
  on(name, fn) {
    if (name !== 'user.action') return this.link.on(name, fn);
    this.queue = this.queue.filter((q) => Date.now() - q.at < this.keepMs);
    const kept = this.queue.shift();
    if (kept) {
      let off = false;
      queueMicrotask(() => { if (!off) fn(kept.data); });
      return () => { off = true; };
    }
    this.waiters.add(fn);
    return () => this.waiters.delete(fn);
  }
}

/** The MCP server with every tool, on a Link. */
export function createServer(link) {
  const server = new McpServer({ name: 'browser-workflow', version: VERSION }, { instructions: INSTRUCTIONS });
  const actions = new UserActions(link);

  // The widget: one resource every view is drawn from, under an address that changes with each build.
  const UI = uiUri();
  server.registerResource('Browser Workflow views', UI, { description: 'Inline views for Browser Workflow', mimeType: RESOURCE_MIME_TYPE }, async () => ({
    contents: [{ uri: UI, mimeType: RESOURCE_MIME_TYPE, text: widgetHtml(), _meta: UI_META }],
  }));
  // An app that listed the tools before an update still asks for the widget under that build's address: it gets today's.
  server.registerResource('Browser Workflow views (an earlier address)', new ResourceTemplate('ui://browser-workflow/{file}', { list: undefined }), { mimeType: RESOURCE_MIME_TYPE }, async (uri) => ({
    contents: [{ uri: uri.href, mimeType: RESOURCE_MIME_TYPE, text: widgetHtml(), _meta: UI_META }],
  }));

  for (const t of WORKFLOW_TOOLS) {
    server.registerTool(t.name, {
      title: t.title,
      description: t.description,
      inputSchema: z.object(t.input ?? {}),
      annotations: { title: t.title, readOnlyHint: t.readOnly ?? false, destructiveHint: t.destructive ?? false },
      // As ext-apps' registerAppTool: `ui.resourceUri` and the older `ui/resourceUri` key.
      ...(t.noUi ? {} : { _meta: { ui: { resourceUri: UI, visibility: t.appOnly ? ['app'] : ['model', 'app'] }, 'ui/resourceUri': UI } }),
    }, async (args) => {
      try {
        const a = t.name === 'get_step_schema' ? { ...(args ?? {}), guide: guide() } : (args ?? {});
        const r = await link.call('tools.call', { name: t.name, args: a }, 10 * 60_000);
        return {
          content: [{ type: 'text', text: r.text }, ...(r.images ?? []).map((i) => ({ type: 'image', data: i.data, mimeType: i.mimeType }))],
          // Some hosts give the model structuredContent instead of content: the model's text goes in both.
          structuredContent: r.text ? { ...r.payload, modelText: r.text } : r.payload,
          isError: r.isError,
        };
      } catch (e) {
        return refusal(e, t);
      }
    });
  }

  for (const t of PAGE_TOOLS) {
    server.registerTool(t.name, {
      title: t.title,
      description: t.description,
      inputSchema: z.object(t.input ?? {}),
      annotations: { title: t.title, readOnlyHint: t.readOnly ?? false, destructiveHint: false },
    }, async (args) => {
      try {
        const r = await link.call(t.method, t.args ? t.args(args ?? {}) : (args ?? {}), 2 * 60_000);
        return { content: [{ type: 'text', text: r.text }, ...(r.image ? [{ type: 'image', data: r.image.data, mimeType: r.image.mimeType }] : [])] };
      } catch (e) {
        return refusal(e);
      }
    });
  }

  server.registerTool('extension_status', {
    title: 'Browser Workflow status',
    description: 'Whether Browser Workflow is ready: is Chrome open, does the Browser Workflow extension answer, and its version. When it is missing, the answer says where to get it. Shows nothing.',
    inputSchema: z.object({}),
    annotations: { title: 'Browser Workflow status', readOnlyHint: true, destructiveHint: false },
  }, async () => {
    const r = await extensionStatus(link, { plugin: VERSION });
    return { content: [{ type: 'text', text: r.text }], isError: r.isError };
  });

  server.registerTool('wait_for_user', {
    title: 'Wait for the user',
    description: 'Waits until the user does something in the Browser Workflow side panel in Chrome (approves, asks Claude, …) and answers what they did; or answers that they are still away after `minutes` (default 10, at most 30): then call it again to keep waiting. The user can always write in the chat instead.',
    inputSchema: z.object({ minutes: z.number().min(0).max(30).optional().describe('How long to wait at most (default 10)') }),
    annotations: { title: 'Wait for the user', readOnlyHint: true, destructiveHint: false },
  }, async (args, ctx) => {
    const r = await waitForUser(actions, args ?? {}, ctx);
    return { content: [{ type: 'text', text: r.text }], isError: r.isError };
  });

  server.registerPrompt('start', {
    title: 'Start using Browser Workflow',
    description: 'Checks that Browser Workflow is ready in Chrome and shows your workflows, so you can run one or describe a new one.',
    argsSchema: z.object({ goal: z.string().optional().describe('Optional: what you want to automate, in your own words') }),
  }, ({ goal }) => ({ messages: [{ role: 'user', content: { type: 'text', text: startPrompt(goal) } }] }));

  return server;
}

/** Registers the host, connects the link (lazily) and serves MCP on stdio. */
export async function main() {
  const hostSource = fileURLToPath(new URL('../dist/host.mjs', import.meta.url));
  try {
    if (existsSync(hostSource)) {
      const r = registerHost({ hostSource });
      if (r.changed.length) log(`registered the Chrome connection: ${r.changed.length} file(s) written`);
    } else log('dist/host.mjs is missing: run `npm run build`');
  } catch (e) {
    log(`could not register the Chrome connection: ${e?.message ?? e}`);
  }
  const link = new Link({ plugin: VERSION, log });
  const server = createServer(link);
  await server.connect(new StdioServerTransport());
  log(`ready (plugin ${VERSION})`);
  process.stdin.on('close', () => { link.close(); process.exit(0); });
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) await main();
