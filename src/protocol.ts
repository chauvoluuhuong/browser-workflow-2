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

/** From the extension, broadcast by the host to every client. */
export interface EventMessage<N extends EventName = EventName> {
  type: 'event';
  name: N;
  data: Events[N];
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

export interface Events {
  /** A run changed (each step, the end). */
  'run.update': { runId: string; workflowId: string; status: RunStatus };
}
export type EventName = keyof Events;

export type RunStatus = 'running' | 'waiting_manual' | 'success' | 'failure' | 'stopped';

/**
 * Results named after browser-workflow v1's view types (WorkflowSummary, RunState, …: v1 src/shared/types.ts,
 * copied unchanged into the extension's src/shared/types.ts). Kept as `View<'Name'>` here until the plugin
 * carries those types itself (Package E).
 */
export type View<Name extends string> = Record<string, unknown> & { readonly __view?: Name };

/** A workflow in v1's JSON format (the extension validates it). */
export type WorkflowJson = Record<string, unknown>;

export interface InspectAnswer {
  /** What chrome-devtools-mcp's tool of the same name answers, as text. */
  text: string;
  /** inspect.screenshot: the image. */
  image?: { data: string; mimeType: 'image/jpeg' | 'image/png' };
}

export interface Methods {
  hello: { params: { plugin: string; protocol: number }; result: { extension: string; protocol: ProtocolVersion; minPlugin: string } };
  status: { params?: Record<string, never>; result: { extension: string; protocol: ProtocolVersion; activeRunId?: string; workflows: number; runs: number; groupTabs: number } };
  'schema.get': { params?: Record<string, never>; result: { step: unknown; workflow: unknown } };

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
}

export type MethodName = keyof Methods;
