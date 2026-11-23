// The view payloads the workflow tools answer and the views draw (types only). The extension's tools build them;
// this is a copy of the extension's src/shared/types.ts (browser-workflow v1's view types plus the download step).

// Payloads carry data and codes, never display sentences: the widget renders every string
// through its i18n dictionaries (English, Vietnamese). Text meant for the model stays in `content`.

export type Lang = 'en' | 'vi';
export type LangPref = Lang | 'auto';

export type StepType =
  | 'navigate' | 'delay' | 'executeXpathCommand' | 'javascript'
  | 'extractData' | 'if' | 'switch' | 'manual' | 'download' | 'agent';

/** A file a download step saved (or is saving) into the user's Downloads. */
export interface SavedFile {
  /** The file's name as Chrome saved it (a number may have been added when the name was taken). */
  fileName: string;
  /** The folder inside Downloads ('' for Downloads itself). */
  folder: string;
  /** Size in bytes once saved; while saving, what arrived so far. */
  bytes: number;
  url: string;
  /** While saving: bytes received and the total when the server said it. */
  received?: number;
  total?: number;
  done: boolean;
}

export interface StepSummary {
  id: string;
  stepType: StepType;
  stepName: string;
  description: string;
  /** One-line human summary of the action, e.g. `click //button[@id="go"]`. */
  detail: string;
  /** Code for javascript/extractData/if steps, shown read-only when the row expands. */
  code?: string;
}

export interface VariableField {
  name: string;
  title: string;
  type: 'string' | 'number' | 'boolean';
  required: boolean;
  default?: string | number | boolean;
  description?: string;
}

/** `waiting_agent`: an Ask Claude step waits for Claude's answer (resume_run). */
export type RunStatus = 'running' | 'waiting_manual' | 'waiting_agent' | 'success' | 'failure' | 'stopped';

export interface WorkflowSummary {
  id: string;
  name: string;
  host: string;
  description: string;
  version: number;
  stepCount: number;
  lastRun?: { runId: string; status: RunStatus; at: string };
  /** An example shared with every account: it can be run as is; changing it saves the user's own copy. */
  example?: boolean;
}

export interface WorkflowDetail extends WorkflowSummary {
  steps: StepSummary[];
  variables: VariableField[];
}

export type BrowserMode = 'attach' | 'cdp' | 'launch' | 'remote';

export interface StepProgress {
  stepId: string;
  stepName: string;
  stepType: StepType;
  state: 'pending' | 'running' | 'ok' | 'failed' | 'waiting' | 'skipped';
  durationMs?: number;
  /** A download step: the file and its progress. */
  download?: SavedFile;
}

/** One time a run asked Claude (RunState.asks). */
export interface AskClaudeEntry {
  /** The Ask Claude step, or 'ask-claude' for the one a failure started. */
  stepId: string;
  stepName: string;
  /** The failed step that asked, if a failure did. */
  failedStepName?: string;
  question: string;
  state: 'waiting' | 'ok' | 'failed' | 'stopped';
  errorType?: string;
  /** Claude's answer: where the run went, the named values, and its note to the user. */
  then?: string;
  answer?: Record<string, unknown>;
  note?: string;
}

export interface RunState {
  runId: string;
  workflowId: string;
  workflowName: string;
  version: number;
  status: RunStatus;
  browser: BrowserMode;
  steps: StepProgress[];
  /** Inputs the run was started with (reused by "Run again"). */
  variables: Record<string, unknown>;
  /** Set when the run was started with stopAfterStepId (testing a fix). */
  stopAfterStepId?: string;
  manual?: { stepName: string; instruction: string };
  /** The run waits for Claude (status waiting_agent): the question, and the failed step that asked it, if any. */
  agent?: { stepId: string; stepName: string; question: string; failedStepName?: string; error?: string; untilMs: number };
  /**
   * Each time this run asked Claude (an Ask Claude step, or a failed step), oldest first: the question and what came
   * of it. `state` waiting / ok (answered) / failed (`errorType`: claude_unavailable, agent_timeout, ended_by_claude).
   */
  asks?: AskClaudeEntry[];
  /** The user allowed Claude to change this workflow on its own during this run. */
  claudeCanChange?: boolean;
  result?: { rows: number };
  failure?: FailureInfo;
  /**
   * While the run is going: an address that sends an event each time the run changes (Firebase's
   * streaming format). The widget listens there instead of asking every second, and asks show_run on
   * each event. Absent: the widget asks on a timer.
   */
  live?: { url: string };
  /** A test run of a proposal not saved yet (version 0): it can be saved from here, under a name. */
  draft?: { pendingId: string; name: string };
}

export interface FailureInfo {
  stepId: string;
  stepName: string;
  stepIndex: number;
  /** Raw engine message (English); the widget prefers errorType + target. */
  reason: string;
  errorType: string;
  /** Selector or URL the step was acting on. */
  target?: string;
  timeoutMs?: number;
  stack: string;
  url: string;
  /** A screenshot was captured. The widget loads it with ui_get_screenshot, so tool results stay small. */
  hasScreenshot: boolean;
  variables: Record<string, unknown>;
  consoleErrors: string[];
}

export interface RunSummary {
  runId: string;
  status: RunStatus;
  at: string;
  durationMs: number;
  version: number;
  browser: BrowserMode;
  /** Steps in the workflow version this run used. */
  stepCount: number;
  /** success: items extracted. */
  rows?: number;
  /** failure/stopped/running: 1-based step number and its name. */
  atStep?: number;
  atStepName?: string;
  /** Run was a change test that stopped on purpose after this 1-based step. */
  testUntilStep?: number;
}

/** One step inside one run (what the crawler called an Execution). */
export interface StepRun {
  runId: string;
  workflowId: string;
  workflowName: string;
  version: number;
  stepId: string;
  stepName: string;
  stepType: StepType;
  stepIndex: number;
  stepCount: number;
  state: StepProgress['state'];
  durationMs?: number;
  detail: string;
  /** Loaded with ui_get_screenshot, like FailureInfo.hasScreenshot. */
  hasScreenshot?: boolean;
  url?: string;
  output?: string;
  error?: { type: string; target?: string; timeoutMs?: number; raw: string };
  /** fetch/XHR requests the page made during this step (first 50). */
  apiCalls?: { method: string; url: string }[];
  apiCallCount?: number;
  /** A download step: the file it saved, or its progress while saving. */
  download?: SavedFile;
  variablesBefore: Record<string, unknown>;
}

export interface StepChange {
  stepId: string;
  stepName: string;
  kind: 'update' | 'add' | 'remove';
  before?: string;
  after?: string;
}

export interface VersionEntry {
  version: number;
  at: string;
  author: 'you' | 'claude' | 'import';
  event: VersionEvent;
  current: boolean;
}

export type VersionEvent =
  | { kind: 'initial' }
  | { kind: 'create' }
  | { kind: 'import'; file?: string }
  | { kind: 'change'; steps: { name: string; kind: StepChange['kind'] }[] }
  | { kind: 'restore'; from: number };

export type ImportErrorCode = 'invalid_json' | 'not_object' | 'missing_field' | 'empty_steps' | 'missing_id' | 'bad_type' | 'missing_ref' | 'duplicate_id' | 'invalid';

export interface ImportPreview {
  fileName: string;
  ok: boolean;
  workflow?: WorkflowSummary;
  /** `message` is English for the model; the widget renders `code` + `arg`. */
  errors: { path: string; code: ImportErrorCode; arg?: string; message: string }[];
  /** Names of the inputs the workflow asks for when it runs. */
  inputs?: string[];
  /** Workflow id already exists → saving creates a new version. */
  existingVersion?: number;
}

export interface BrowserConfig {
  mode: BrowserMode;
  cdpEndpoint?: string;
  headed?: boolean;
}

export interface BrowserCheck {
  runner: 'ok' | 'error';
  inspector: 'ok' | 'error';
  code: 'attach_ok' | 'attach_unreachable' | 'cdp_ok' | 'cdp_invalid' | 'remote_ok' | 'remote_paid' | 'launch_ok' | 'bridge_offline';
  /** Chrome version, host or region, depending on the code. */
  arg?: string;
  /** bridge_offline, hosted: where to download the app that runs on the user's computer. */
  link?: string;
}

/** A plan's limit that upgrading lifts: runs or steps of the period, saved workflows, steps per workflow, a Pro-only browser. */
export type LimitCode = 'limit_runs_day' | 'limit_runs_year' | 'limit_steps_day' | 'limit_steps_year' | 'limit_workflows' | 'limit_steps' | 'remote_pro';

export interface AccountInfo {
  plan: 'free' | 'paid';
  /** The username, or "anon-…" for an anonymous account; empty in the local build. */
  name: string;
  /** Hosted: the paid plan was bought for a year, which ends then. */
  paidUntil?: string;
  /** Hosted: nobody signed up yet. The view offers to create an account. */
  anonymous?: boolean;
  /**
   * Hosted: the card shows only the name, the plan and one button; usage and settings are on the account
   * page on our site. true when that page can be opened (ui_account_page). Absent in the local build.
   */
  page?: boolean;
  storage:
    | { kind: 'cloud' }
    | { kind: 'mongo'; name: string }
    | { kind: 'folder'; path: string }
    /** Hosted: runs are kept on the user's machine by the bridge; size and count when the bridge can say. */
    | { kind: 'computer'; keepRuns: number; bytes?: number; runs?: number; warn?: boolean };
  language: LangPref;
  /**
   * Limits are 0 when there is none. Runs and steps (steps run, hosted only) are those of `period`:
   * today or the account's year on the hosted server, this month in the local build.
   */
  usage: { period: 'day' | 'month' | 'year'; runs: number; runsLimit: number; steps?: number; stepsLimit?: number; workflows: number; workflowsLimit: number };
  /** Hosted: runs are deleted after this many days. */
  retentionDays?: number;
  /** Hosted: the browser bridge on the user's machine. The token itself is never in a payload. */
  bridge?: { connected: boolean; version?: string; tokenHint?: string; /** A newer version of the app exists: this one. */ latest?: string };
  /** Hosted: checkout and billing pages, when configured; app: where the app for the user's computer is downloaded. */
  links?: { upgrade?: string; manage?: string; app?: string };
}

export type SetupStep = 'browser' | 'account' | 'first';

export interface WorkflowNotice {
  kind: 'saved' | 'restored' | 'discarded';
  version: number;
  /** restored: the version it was restored from. */
  from?: number;
}

/**
 * Every UI tool result carries `structuredContent.view` so one bundle can render any tool,
 * plus `lang` when the user picked a language (otherwise the widget follows the host locale).
 */
export type ViewPayload = ViewBody & { lang?: LangPref };

export type ViewBody =
  | { view: 'library'; workflows: WorkflowSummary[]; query?: string }
  | { view: 'setup'; step: SetupStep; config: BrowserConfig; signedIn: boolean; name?: string; workflows: number; needsAccount?: boolean; /** Known before the user checks: the app on their computer is not connected, so the widget opens on its Download button. */ check?: BrowserCheck }
  | { view: 'workflow'; workflow: WorkflowDetail; notice?: WorkflowNotice }
  | { view: 'import'; preview: ImportPreview; pendingId?: string }
  | { view: 'draft'; workflow: WorkflowDetail; pendingId: string }
  | { view: 'runSetup'; workflow: WorkflowDetail; browser: BrowserConfig;
    /** The inputs of a test run of a proposal not saved yet: the form starts ui_test_draft. */
    draft?: { pendingId: string };
    /**
     * The user's answer to "During this run, may Claude change this workflow on its own?": the form shows it as a
     * choice, preset to this (undefined: never asked, the user must pick before Run). run_workflow takes claudeCanChange.
     */
    claudeCanChange?: boolean;
    /** The run can't start until the user answers the question above (the first run of this workflow). */
    askClaudeCanChange?: boolean }
  | { view: 'run'; run: RunState }
  /** inspecting: shown by show_failure while Claude works on a fix, so the card doesn't offer Fix with Claude again. */
  | { view: 'failure'; run: RunState; inspecting?: boolean }
  | { view: 'change'; workflowId: string; workflowName: string; fromVersion: number; reason: string; changes: StepChange[]; pendingId: string; testUntilStepId?: string; isFix: boolean }
  | { view: 'runs'; workflowId: string; workflowName: string; runs: RunSummary[] }
  | { view: 'stepRun'; step: StepRun }
  | { view: 'data'; runId: string; workflowName: string; columns: string[]; rows: Record<string, unknown>[]; total: number }
  | { view: 'history'; workflowId: string; workflowName: string; versions: VersionEntry[] }
  | { view: 'browser'; config: BrowserConfig; plan: 'free' | 'paid' }
  | { view: 'account'; account: AccountInfo;
    /** A plan limit refused what the user asked for: the card says which, and offers to upgrade. */
    limit?: { code: LimitCode; arg?: string };
    /** Set by the widget, not the server: the call that was refused, to make again after upgrading. */
    retry?: { tool: string; args: Record<string, unknown> } }
  /** Hosted: the user's computer asks to be linked to the account (a pairing code the app showed); nothing is linked until they click. */
  | { view: 'link'; code: string; computer: string; platform: string; linked?: boolean }
  | { view: 'error'; message: string; code?: 'expired' | 'not_found' | 'limit_runs_day' | 'limit_runs_year' | 'limit_steps_day' | 'limit_steps_year' | 'limit_cloud' | 'limit_workflows' | 'bridge_offline' | 'data_offline' | 'account_needed' | 'remote_pro' | 'limit_steps'; arg?: string;
    /** bridge_offline and data_offline, hosted: where to download the app that runs on the user's computer. */
    link?: string;
    /** Set by the widget, not the server: the call that was refused, to make again once it can go through. */
    retry?: { tool: string; args: Record<string, unknown> };
  };
