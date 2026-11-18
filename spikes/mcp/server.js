#!/usr/bin/env node
// Package S spike — the plugin side: a stdio MCP server whose tools are requests over the host socket.
// Claude starts one copy per session/app; each is a client of the one host Chrome started.
// Logs go to stderr and to $BW2_SPIKE_MCP_LOG (default ~/.browser-workflow-2/mcp.log): stdout is MCP.
import { appendFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { McpServer } from '@modelcontextprotocol/server';
import { StdioServerTransport } from '@modelcontextprotocol/server/stdio';
import { z } from 'zod';
import { HostClient, NOT_RUNNING } from '../client.mjs';

const LOG = process.env.BW2_SPIKE_MCP_LOG || join(homedir(), '.browser-workflow-2', 'mcp.log');
const log = (...a) => {
  const line = `${new Date().toISOString()} [mcp ${process.pid}] ${a.join(' ')}`;
  process.stderr.write(line + '\n');
  try { appendFileSync(LOG, line + '\n'); } catch {}
};

const host = new HostClient();
const text = (t) => ({ content: [{ type: 'text', text: typeof t === 'string' ? t : JSON.stringify(t, null, 1) }] });
async function forward(type, params = {}, timeoutMs) {
  const r = await host.request(type, params, timeoutMs);
  if (!r.ok) return { ...text(r.error === NOT_RUNNING ? NOT_RUNNING : `Error: ${r.error}`), isError: true };
  return text(r.result);
}

const mcp = new McpServer({ name: 'browser-workflow-2-spike', version: '0.0.0' });
const ro = (title) => ({ title, readOnlyHint: true, destructiveHint: false });

mcp.registerTool('ping', {
  title: 'Ping the extension',
  description: 'Spike: round trip MCP server → host → extension → back. Answers the extension status.',
  inputSchema: z.object({}),
  annotations: ro('Ping'),
}, async () => {
  const t = performance.now();
  const r = await forward('ping');
  log(`ping ${(performance.now() - t).toFixed(1)} ms ${r.isError ? 'error' : 'ok'}`);
  return r;
});

mcp.registerTool('wait_for_user', {
  title: 'Wait for the user',
  description: 'Spike: blocks until the user presses a button in the side panel (an event arrives) or `minutes` pass, then returns what happened. Call it when asked to wait for the user.',
  inputSchema: z.object({
    minutes: z.number().min(0).max(60).describe('how long to wait at most'),
    progress: z.boolean().optional().describe('send progress notifications every 30 s when the caller gave a progress token (default true)'),
  }),
  annotations: ro('Wait for the user'),
}, async ({ minutes, progress = true }, ctx) => {
  const token = ctx?.mcpReq?._meta?.progressToken;
  const started = Date.now();
  log(`wait_for_user start minutes=${minutes} progress=${progress} progressToken=${token === undefined ? 'none' : JSON.stringify(token)}`);
  try { await host.open(); } catch { log('wait_for_user: host not running (waiting on the timer only)'); }
  let ticks = 0;
  const result = await new Promise((resolve) => {
    const done = (why) => { clearTimeout(timer); clearInterval(beat); off(); ctx?.mcpReq?.signal?.removeEventListener?.('abort', onAbort); resolve(why); };
    const off = host.onEvent((e) => done({ how: 'event', text: e.text }));
    const timer = setTimeout(() => done({ how: 'timeout' }), minutes * 60_000);
    const beat = setInterval(async () => {
      ticks++;
      const s = Math.round((Date.now() - started) / 1000);
      log(`wait_for_user alive ${s}s`);
      if (progress && token !== undefined) {
        try {
          await ctx.mcpReq.notify({ method: 'notifications/progress', params: { progressToken: token, progress: s, total: minutes * 60, message: `waiting ${s}s` } });
        } catch (e) { log(`progress notify failed: ${e.message}`); }
      }
    }, 30_000);
    const onAbort = () => done({ how: 'cancelled by the client' });
    ctx?.mcpReq?.signal?.addEventListener?.('abort', onAbort);
  });
  const elapsed = ((Date.now() - started) / 1000).toFixed(1);
  log(`wait_for_user end ${result.how} after ${elapsed}s (beats ${ticks})`);
  if (result.how === 'event') return text(`The user pressed a button after ${elapsed}s: ${result.text}`);
  return text(`Still waiting: nothing from the user after ${elapsed}s (waited the full ${minutes} min).`);
});

const tabId = z.number().int().describe('tab id from spike_open');
const s3 = [
  ['spike_open', 'Open a URL in an inactive tab in the collapsed "Browser Workflow" group and attach the debugger. settings=true turns on focus emulation, lifecycle active and autoDiscardable:false.',
    { url: z.string(), settings: z.boolean().optional() }],
  ['spike_snapshot', 'Accessibility.getFullAXTree of the tab: node count, bytes, ms.', { tabId }],
  ['spike_click', 'Click the first element matching a CSS selector with Input.dispatchMouseEvent at its box centre; reports whether the page saw the click.', { tabId, selector: z.string() }],
  ['spike_type', 'Focus the element matching a CSS selector and type text (Input.insertText + Input.dispatchKeyEvent); reports the value read back.', { tabId, selector: z.string(), text: z.string() }],
  ['spike_screenshot', 'Page.captureScreenshot of the tab: ms, bytes, or timeout.', { tabId, returnData: z.boolean().optional() }],
  ['spike_timers', 'setTimeout / setInterval / requestAnimationFrame rates for 3 s, visibility and focus, then scroll down and count loaded images and page height (lazy content).', { tabId }],
  ['spike_close', 'Detach the debugger and close the tab.', { tabId }],
];
for (const [name, description, shape] of s3) {
  mcp.registerTool(name, { title: name, description: `Spike S3: ${description}`, inputSchema: z.object(shape), annotations: { title: name, readOnlyHint: false, destructiveHint: false } },
    async (args) => forward(name, args, 180_000));
}

await mcp.connect(new StdioServerTransport());
log('ready on stdio');
process.stdin.on('close', () => { host.close(); process.exit(0); });
