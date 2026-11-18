// wait_for_user: blocks until the user does something in the extension's side panel that Claude should know
// (a `user.action` event from the extension: a button, or a message in the side panel's chat), or until `minutes`
// pass. It is also how Claude talks back to the side panel's chat: `reply` is shown there before the wait starts,
// and the extension is told where this Claude is (`claude.state`: listening, working, idle), so the panel knows
// whether anyone is listening.
// Some apps cut a tool call short without telling the plugin: the Claude desktop app's chat drops any call after
// 80 s (spike A, 2026-11-18). There the server passes `capMs` (55 s), so the wait answers "still waiting" before
// the app gives up on it; otherwise a dropped wait would stay listening and swallow the user's next message.
// While waiting it sends progress every 30 s when the call carries a progress token.
import { LinkError, OPEN_CHROME } from '../link.js';

export const DEFAULT_MINUTES = 10;
export const MAX_MINUTES = 30;
/** A wait in an app that cuts tool calls at 80 s answers after at most this long. */
export const CAPPED_WAIT_MS = 55_000;
/** The longest reply shown in the side panel. */
export const MAX_REPLY = 4000;
/**
 * While a wait goes, `claude.state: listening` is sent again this often: the extension takes a Claude with no call
 * for 3 minutes as gone (its chat was closed or its reply ended), and a wait in Claude Code may last 30 minutes.
 */
export const LISTENING_EVERY_MS = 60_000;

/**
 * Tells the extension something for the side-panel chat. An older extension answers `unsupported`, and Chrome may
 * be gone: neither stops the wait, so nothing is awaited and every error is dropped.
 * @param {any} link
 * @param {string} method
 * @param {Record<string, unknown>} params
 */
function tell(link, method, params) {
  if (typeof link?.call !== 'function') return;
  try {
    void Promise.resolve(link.call(method, params, 10_000)).catch(() => {});
  } catch { /* nothing to tell */ }
}

/** What the user named with `@`, in a line for Claude. Tab titles are page text, and said to be. */
export function describeMentions(mentions) {
  if (!Array.isArray(mentions) || !mentions.length) return '';
  const parts = mentions.slice(0, 20).map((m) => {
    const name = JSON.stringify(String(m?.name ?? '').slice(0, 200));
    if (m?.type === 'workflow') return `workflow ${m.id} ${name}`;
    if (m?.type === 'run') return `run ${m.id}${m.status ? ` (${m.status})` : ''}${m.workflowId ? ` of workflow ${m.workflowId}` : ''}, shown as ${name}`;
    if (m?.type === 'tab') return `the open tab ${name} (title from the page) at ${String(m.url ?? '').slice(0, 500)}`;
    return name;
  });
  return ` Mentioned: ${parts.join('; ')}.`;
}

/** The answer for an action from the side panel. */
export function describeAction(d) {
  if (d?.kind === 'chat') {
    return `The user wrote in the Browser Workflow side panel's chat: ${JSON.stringify(String(d.text ?? ''))}.${describeMentions(d.mentions)} Do what they ask, then call wait_for_user with your short answer to them in reply, to show it in the side panel and keep listening.`;
  }
  const ids = ['workflowId', 'runId', 'pendingId'].filter((k) => d?.[k]).map((k) => `${k} ${d[k]}`).join(', ');
  return `The user acted in the Browser Workflow side panel: ${d?.text ?? d?.kind ?? 'an action'}${d?.kind ? ` (${d.kind}${ids ? `; ${ids}` : ''})` : ''}.`;
}

/**
 * @param {{ open(): Promise<void>, on(name: string, fn: (d: any) => void): () => void, call?: (m: string, p: any, t?: number) => Promise<any> }} link
 * @param {{ minutes?: number, reply?: string }} args
 * @param {any} ctx the MCP handler's context (progress token, notify, abort signal)
 * @param {{ progressEveryMs?: number, capMs?: number, listeningEveryMs?: number }} [o] `capMs`: answer "still waiting" after this long at most
 * @returns {Promise<{ text: string, isError?: boolean }>}
 */
export async function waitForUser(link, args, ctx, o = {}) {
  const minutes = Math.min(Math.max(Number(args?.minutes ?? DEFAULT_MINUTES) || 0, 0), MAX_MINUTES);
  const waitMs = Math.min(minutes * 60_000, o.capMs ?? Infinity);
  try {
    await link.open();
  } catch (e) {
    return { text: e instanceof LinkError ? e.message : OPEN_CHROME, isError: true };
  }
  const reply = typeof args?.reply === 'string' ? args.reply.trim() : '';
  if (reply) tell(link, 'claude.reply', { text: reply.slice(0, MAX_REPLY) });
  tell(link, 'claude.state', { state: 'listening' });
  const token = ctx?.mcpReq?._meta?.progressToken;
  const started = Date.now();
  const outcome = await new Promise((resolve) => {
    const finish = (r) => {
      clearTimeout(timer);
      clearInterval(beat);
      clearInterval(alive);
      off();
      ctx?.mcpReq?.signal?.removeEventListener?.('abort', onAbort);
      resolve(r);
    };
    const off = link.on('user.action', (data) => finish({ how: 'action', data }));
    const timer = setTimeout(() => finish({ how: 'time' }), waitMs);
    const beat = setInterval(() => {
      if (token === undefined) return;
      const s = Math.round((Date.now() - started) / 1000);
      ctx.mcpReq.notify({ method: 'notifications/progress', params: { progressToken: token, progress: s, total: Math.round(waitMs / 1000), message: `Waiting for the user (${s} s)` } }).catch(() => {});
    }, o.progressEveryMs ?? 30_000);
    const alive = setInterval(() => tell(link, 'claude.state', { state: 'listening' }), o.listeningEveryMs ?? LISTENING_EVERY_MS);
    const onAbort = () => finish({ how: 'cancelled' });
    ctx?.mcpReq?.signal?.addEventListener?.('abort', onAbort);
  });
  if (outcome.how === 'action') {
    tell(link, 'claude.state', { state: 'working' });
    return { text: describeAction(outcome.data ?? {}) };
  }
  if (outcome.how === 'cancelled') {
    tell(link, 'claude.state', { state: 'idle' });
    return { text: 'Stopped waiting.' };
  }
  if (waitMs < minutes * 60_000) {
    return { text: 'Still waiting: nothing from the side panel yet. Call wait_for_user again to keep waiting (with no reply), or go on if the user wrote in the chat.' };
  }
  return { text: `Still waiting: the user did nothing in the side panel for ${minutes} minute${minutes === 1 ? '' : 's'}. Call wait_for_user again to keep waiting, or go on if they wrote in the chat.` };
}
