// wait_for_user: blocks until the user does something in the extension's side panel that Claude should know
// (a `user.action` event from the extension), or until `minutes` pass. How long an app lets one tool call last is
// not known for every app (the desktop app's limit is still being measured), so the wait is bounded and the
// answer says to call again. While waiting it sends progress every 30 s when the call carries a progress token.
import { LinkError, OPEN_CHROME } from '../link.js';

export const DEFAULT_MINUTES = 10;
export const MAX_MINUTES = 30;

/**
 * @param {import('../link.js').Link} link
 * @param {{ minutes?: number }} args
 * @param {any} ctx the MCP handler's context (progress token, notify, abort signal)
 * @param {{ progressEveryMs?: number }} [o]
 * @returns {Promise<{ text: string, isError?: boolean }>}
 */
export async function waitForUser(link, args, ctx, o = {}) {
  const minutes = Math.min(Math.max(Number(args?.minutes ?? DEFAULT_MINUTES) || 0, 0), MAX_MINUTES);
  try {
    await link.open();
  } catch (e) {
    return { text: e instanceof LinkError ? e.message : OPEN_CHROME, isError: true };
  }
  const token = ctx?.mcpReq?._meta?.progressToken;
  const started = Date.now();
  const outcome = await new Promise((resolve) => {
    const finish = (r) => {
      clearTimeout(timer);
      clearInterval(beat);
      off();
      ctx?.mcpReq?.signal?.removeEventListener?.('abort', onAbort);
      resolve(r);
    };
    const off = link.on('user.action', (data) => finish({ how: 'action', data }));
    const timer = setTimeout(() => finish({ how: 'time' }), minutes * 60_000);
    const beat = setInterval(() => {
      if (token === undefined) return;
      const s = Math.round((Date.now() - started) / 1000);
      ctx.mcpReq.notify({ method: 'notifications/progress', params: { progressToken: token, progress: s, total: minutes * 60, message: `Waiting for the user (${s} s)` } }).catch(() => {});
    }, o.progressEveryMs ?? 30_000);
    const onAbort = () => finish({ how: 'cancelled' });
    ctx?.mcpReq?.signal?.addEventListener?.('abort', onAbort);
  });
  if (outcome.how === 'action') {
    const d = outcome.data ?? {};
    const ids = ['workflowId', 'runId', 'pendingId'].filter((k) => d[k]).map((k) => `${k} ${d[k]}`).join(', ');
    return { text: `The user acted in the Browser Workflow side panel: ${d.text ?? d.kind ?? 'an action'}${d.kind ? ` (${d.kind}${ids ? `; ${ids}` : ''})` : ''}.` };
  }
  if (outcome.how === 'cancelled') return { text: 'Stopped waiting.' };
  return { text: `Still waiting: the user did nothing in the side panel for ${minutes} minute${minutes === 1 ? '' : 's'}. Call wait_for_user again to keep waiting, or go on if they wrote in the chat.` };
}
