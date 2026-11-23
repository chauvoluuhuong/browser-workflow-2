// The messages between the plugin (its MCP server, through the native-messaging host) and the Browser
// Workflow extension: docs/integrations/extension-protocol.md. Types only, no runtime code. This repo owns
// them; the extension keeps a copy in its src/shared/protocol.ts and never edits it first.
// Change it backward-compatibly: the extension works with the previous plugin version and the reverse.

/** The protocol version both sides send in `hello`. */
export type ProtocolVersion = 1;

export type ErrorCode = 'bad_request' | 'not_found' | 'busy' | 'failed' | 'unsupported' | 'too_old';

/**
 * A call. On the socket a client sends `{ id, type: "call", method, params }`; the host forwards it to the
 * extension with its own id and `client`, the number of the socket connection it came from (so `hello`
 * holds per client), and passes the reply back with the client's id.
 */
export interface CallMessage<M extends MethodName = MethodName> {
  id: string | number;
  type: 'call';
  method: M;
  params?: Methods[M]['params'];
  /** Set by the host. Missing: client 0. */
  client?: number;
}

export type ReplyMessage<M extends MethodName = MethodName> =
  | { id: string | number; ok: true; result: Methods[M]['result'] }
  | { id: string | number; ok: false; error: { code: ErrorCode; message: string } };

/**
 * From the extension, broadcast by the host to every client; with `to`, only to that client (the host drops `to`
 * before sending it on). An older host ignores `to` and sends it to every client.
 */
export interface EventMessage<N extends EventName = EventName> {
  type: 'event';
  name: N;
  data: Events[N];
  /** The client (the host's connection number, as in a call's `client`) the event is for. */
  to?: number;
}

/** Something the user named in a side-panel chat message (`@` in the panel). Tab titles are page text. */
export interface Mention {
  type: 'workflow' | 'run' | 'tab';
  /** Workflow id or run id; missing for a tab. */
  id?: string;
  /** What the user saw: the workflow's name, a run's label, a tab's title. */
  name: string;
  /** A tab's address. */
  url?: string;
  /** A run's status; for a run, `name` names its workflow too. */
  status?: string;
  /** A run's workflow. */
  workflowId?: string;
}

/** Where a Claude is, as its plugin tells the extension (`claude.state`). */
export type ClaudeState = 'listening' | 'working' | 'idle';

/**
 * A screen in the side panel's chat: the tool that showed it, its arguments, and the payload its view is drawn
 * from (missing when too large to keep: the panel then calls the tool again with `args`).
 */
export interface ChatView {
  tool: string;
  args: Record<string, unknown>;
  payload?: Record<string, unknown>;
}

/**
 * An entry of the side panel's chat log (kept by the extension, drawn by the panel): docs/integrations/extension-protocol.md.
 * A `view` entry (from `claude.show`) is `{ at, from: 'claude', text: '', view }`.
 */
export interface ChatEntry {
  /** When it was added (ISO time, as the extension writes it). */
  at: string;
  from: 'you' | 'claude' | 'event';
  /** A `you` entry: the user's words, with `＠<name>` (fullwidth ＠) where each mention was. `claude`: Markdown. */
  text: string;
  mentions?: Mention[];
  /** An `event` entry: a proposal or a finished run, drawn by the panel in its own language. */
  card?:
    | { kind: 'proposal'; pendingId: string; name: string; state: string; runId?: string }
    | { kind: 'run'; runId: string; workflowId?: string; name: string; status: string; items?: number };
  /** A screen Claude showed while answering the side panel (`claude.show`). */
  view?: ChatView;
}

/** Host → extension only, for a message over 1 MiB: its JSON text in 512 KiB pieces, joined by `cid`. */
export interface ChunkFrame {
  type: 'chunk';
  cid: string;
  seq: number;
  last: boolean;
  data: string;
}

/** Host → extension: a socket client disconnected, so its `hello` is forgotten. Optional for the host. */
export interface ClientLeftMessage {
  type: 'client.left';
  client: number;
}

/** Answered by the host itself, never sent to the extension. */
export interface HostStatus {
  pid: number;
  uptimeMs: number;
  clients: number;
  extensionConnected: boolean;
}

/** What a plugin can do beyond the protocol version, sent in `hello`'s `features`. */
export type Feature = 'wake';

/**
 * `user.action` with `kind: "wake"`: a run reached an Ask Claude step (planned, or the one a failed step starts) and
 * waits for Claude, who answers with the `resume_run` tool. Sent only to a plugin whose `hello` listed `wake` in
 * `features`; `text` says it in a sentence, as for every action.
 */
export interface WakeFields {
  runId: string;
  workflowId: string;
  workflowName: string;
  /** The Ask Claude step (`ask-claude` for the one a failure starts). */
  stepId: string;
  /** The step's question (its `{{variables}}` filled in), or the built-in one for a failure. */
  question: string;
  /** The step that failed, when a failure woke Claude. */
  failed?: { stepId: string; stepName: string; error: string };
  /** The user allowed Claude to change this workflow on its own during the run: `propose_change` is saved at once. */
  canChange: boolean;
  /** When the run stops waiting and fails by itself (epoch ms). */
  untilMs?: number;
}

/**
 * The arguments of the `resume_run` tool (through `tools.call`): Claude's answer to a run waiting for it.
 * `then`: `next` (the step's next step; on a wake, the failed step's), `retry` (the failed step again, on a wake),
 * `end` (end the run with `status`, default `failure`), or a step id to go to.
 */
export interface ResumeRunArgs {
  runId: string;
  then: 'next' | 'retry' | 'end' | (string & {});
  /** Named values, checked against the step's `answer` shape; they become runtime variables. */
  answer?: Record<string, unknown>;
  /** What Claude found or did, kept on the Ask Claude execution and shown in the run view. */
  note?: string;
  /** Only with `then: "end"`. */
  status?: 'success' | 'failure';
}

export interface Events {
  /** A run changed (each step, the end). */
  'run.update': { runId: string; workflowId: string; status: RunStatus };
  /**
   * The user did something in the extension's side panel that Claude should know (a button such as Approve or
   * "Ask Claude"); `wait_for_user` returns with it. `text` says it in a sentence for Claude.
   */
  'user.action': {
    kind: string; text: string; workflowId?: string; runId?: string; pendingId?: string;
    /** The view the user acted in (`failure`, `draft`, …). */
    view?: string;
    /** Details for Claude, in English (never shown to the user). */
    context?: string;
    /** Something Claude should know without being woken: it goes with the next action. */
    silent?: boolean;
    /** `kind: "chat"`: what the user named with `@` in the message. */
    mentions?: Mention[];
  } & Partial<WakeFields>;
  /** A proposal (import, draft, change) appeared or was decided, in the chat or the side panel. */
  'proposal.update': {
    pendingId: string; kind: 'import' | 'draft' | 'change';
    state: 'pending' | 'saved' | 'applied' | 'discarded' | 'expired';
    workflowId: string; name: string;
    /** The version the decision saved. */
    version?: number;
    /** The run the decision started (a change is tested at once; a draft may be saved and run). */
    runId?: string;
  };
}
export type EventName = keyof Events;

/** `waiting_agent`: an Ask Claude step waits for Claude's `resume_run` (an older plugin never sees it from an older extension). */
export type RunStatus = 'running' | 'waiting_manual' | 'waiting_agent' | 'success' | 'failure' | 'stopped';

/**
 * Results named after browser-workflow v1's view types (WorkflowSummary, RunState, …: v1 src/shared/types.ts,
 * copied unchanged into the extension's src/shared/types.ts). Kept as `View<'Name'>` here until the plugin
 * carries those types itself (Package E).
 */
export type View<Name extends string> = Record<string, unknown> & { readonly __view?: Name };

/** A workflow in v1's JSON format (the extension validates it). */
export type WorkflowJson = Record<string, unknown>;

/** What a workflow tool answers (browser-workflow v1's ToolOutput): text for Claude, a payload for the widgets. */
export interface ToolOutput {
  text: string;
  payload: Record<string, unknown>;
  isError?: boolean;
  /** Screenshots (base64). */
  images?: { data: string; mimeType: string }[];
}

export interface InspectAnswer {
  /** What chrome-devtools-mcp's tool of the same name answers, as text. */
  text: string;
  /** inspect.screenshot: the image. */
  image?: { data: string; mimeType: 'image/jpeg' | 'image/png' };
}

export interface Methods {
  /** `features`: what this plugin understands beyond `protocol` (an older plugin sends none; an older extension ignores it). */
  hello: { params: { plugin: string; protocol: number; features?: Feature[] }; result: { extension: string; protocol: ProtocolVersion; minPlugin: string } };
  status: { params?: Record<string, never>; result: { extension: string; protocol: ProtocolVersion; activeRunId?: string; workflows: number; runs: number; groupTabs: number } };
  'schema.get': { params?: Record<string, never>; result: { step: unknown; workflow: unknown } };
  /**
   * One of the workflow tools (browser-workflow v1's names: run_workflow, propose_change, get_failure, …), run by the
   * extension. A name it doesn't know answers `unsupported`. `get_step_schema` takes the plugin's authoring guide in
   * `args.guide`. `resume_run` takes `ResumeRunArgs`; `run_workflow` takes `claudeCanChange?: boolean`.
   */
  'tools.call': { params: { name: string; args?: Record<string, unknown> }; result: ToolOutput };

  'workflows.list': { params?: Record<string, never>; result: View<'WorkflowSummary'>[] };
  'workflows.get': { params: { id: string; version?: number }; result: { workflow: WorkflowJson; detail: View<'WorkflowDetail'> } };
  'workflows.history': { params: { id: string }; result: View<'VersionEntry'>[] };
  'workflows.save': { params: { workflow: WorkflowJson; author: 'you' | 'claude' | 'import'; event: Record<string, unknown> }; result: { id: string; version: number } };
  'workflows.delete': { params: { id: string }; result: { deleted: true } };
  'workflows.import': { params: { json: string; file?: string }; result: { id?: string; version?: number; errors: { path: string; code: string; arg?: string; message: string }[] } };
  'workflows.export': { params: { id: string; version?: number }; result: { json: string } };

  /** `busy` while another run goes. */
  'runs.start': { params: { workflowId: string; version?: number; variables?: Record<string, unknown>; stopAfterStepId?: string }; result: View<'RunState'> };
  'runs.stop': { params: { runId: string }; result: View<'RunState'> };
  'runs.resume': { params: { runId: string }; result: View<'RunState'> };
  'runs.list': { params?: { workflowId?: string }; result: View<'RunSummary'>[] };
  'runs.get': { params: { runId: string }; result: View<'RunState'> };
  /** One step execution (`executionId`, or the latest of `stepId`), with its screenshot as base64 JPEG. */
  'runs.step': { params: { runId: string; executionId?: string; stepId?: string }; result: { step: View<'StepRun'>; screenshot?: string } };
  'runs.data': { params: { runId: string }; result: { columns: string[]; rows: Record<string, unknown>[]; total: number } };
  'runs.failure': { params: { runId: string }; result: { failure: View<'FailureInfo'>; screenshot?: string; domExcerpt?: string } };

  // The page inspector: arguments and answers mirror chrome-devtools-mcp's tools of the same names, on the
  // tabs of the extension's own tab group only.
  'inspect.listPages': { params?: Record<string, never>; result: InspectAnswer & { pages: { pageIdx: number; url: string; title: string; selected: boolean }[] } };
  'inspect.selectPage': { params: { pageIdx: number }; result: InspectAnswer };
  'inspect.newPage': { params: { url: string; timeout?: number }; result: InspectAnswer };
  'inspect.navigate': { params: { url?: string; type?: 'url' | 'back' | 'forward' | 'reload'; timeout?: number }; result: InspectAnswer };
  'inspect.snapshot': { params?: { verbose?: boolean }; result: InspectAnswer };
  'inspect.screenshot': { params?: { format?: 'jpeg' | 'png'; quality?: number; fullPage?: boolean }; result: InspectAnswer };
  'inspect.click': { params: { uid: string; dblClick?: boolean }; result: InspectAnswer };
  'inspect.fill': { params: { uid: string; value: string }; result: InspectAnswer };
  'inspect.pressKey': { params: { key: string }; result: InspectAnswer };
  'inspect.evaluate': { params: { function: string; args?: { uid: string }[] }; result: InspectAnswer };
  'inspect.waitFor': { params: { text: string; timeoutMs?: number }; result: InspectAnswer };
  'inspect.console': { params?: { types?: string[] }; result: InspectAnswer };
  'inspect.network': { params?: { resourceTypes?: string[] }; result: InspectAnswer };
  'inspect.request': { params: { reqid: number }; result: InspectAnswer };

  // The side-panel chat (Use with Claude). Sent by the plugin (claude.state and claude.reply by wait_for_user,
  // claude.show by the tools that show a screen); an older extension answers `unsupported` and the plugin goes on
  // without them.
  /** Where the calling Claude is: `listening` (a wait_for_user started), `working` (one returned with an action), `idle` (stopped). */
  'claude.state': { params: { state: ClaudeState }; result: Record<string, never> };
  /**
   * Claude's answer to the user, shown in the side panel's chat: Markdown, at most 100 000 characters. A ```html
   * block is drawn by the panel as a live preview.
   */
  'claude.reply': { params: { text: string }; result: Record<string, never> };
  /**
   * A screen a tool showed, added to the side panel's chat as a view entry (`ChatEntry.view`). Sent during a panel
   * turn (Claude answers a side-panel message), and always from an app that draws no widgets (Claude Code).
   */
  'claude.show': { params: ChatView; result: { ok: true } };
}

export type MethodName = keyof Methods;
