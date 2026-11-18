#!/usr/bin/env node
// Package S spike S3 — runs the background-tab matrix through the S1 channel (client → host → extension →
// chrome.debugger). No Playwright: it would turn focus emulation on and hide throttling.
//   node spikes/s3/run.mjs [off|on|both]   (default both: first without, then with the anti-throttling settings)
// Prints one JSON line per step; keep another tab active and the window focused while it runs.
import { HostClient } from '../client.mjs';

const SITES = [
  { url: 'https://example.com', click: ['a'], type: [] },
  { url: 'https://en.wikipedia.org/wiki/Web_browser', click: ['#mw-content-text p a', '#firstHeading'], type: ['input[name="search"]', '#searchInput'] },
  { url: 'https://unsplash.com', click: ['a[href^="/photos/"]', 'a'], type: ['input[type="search"]', 'input[name="searchKeyword"]'] },
];
const INJECT = `(() => { const i = document.createElement('input'); i.id = 'spike-input'; i.style.cssText = 'position:fixed;top:8px;left:8px;z-index:2147483647'; document.body.append(i); return true; })()`;

const c = new HostClient();
const call = async (type, params) => {
  const t = performance.now();
  const r = await c.request(type, params, 180_000);
  return { ms: Math.round(performance.now() - t), ...(r.ok ? r.result : { error: r.error }) };
};
const pick = async (tabId, selectors) => {
  for (const s of selectors) { const r = await c.request('spike_eval', { tabId, expression: `!!document.querySelector(${JSON.stringify(s)})` }); if (r.ok && r.result === true) return s; }
  return null;
};
const out = (o) => console.log(JSON.stringify(o));

const modes = { off: [false], on: [true], both: [false, true] }[process.argv[2] ?? 'both'];
for (const settings of modes) {
  for (const site of SITES) {
    const tag = { site: site.url, settings };
    const open = await call('spike_open', { url: site.url, settings });
    out({ ...tag, step: 'open', ...open });
    if (open.error) continue;
    const tabId = open.tabId;
    // Some sites (unsplash.com) first serve a "Checking your browser" proof-of-work page that the browser
    // solves by itself; record whether and when it gets through in a hidden tab (we never touch it).
    const t0 = Date.now();
    let title = '';
    for (;;) {
      const r = await c.request('spike_eval', { tabId, expression: 'document.title' });
      title = r.ok ? r.result : `error: ${r.error}`;
      if (!/^Checking your browser/i.test(title) || Date.now() - t0 > 45_000) break;
      await new Promise((r) => setTimeout(r, 1000));
    }
    out({ ...tag, step: 'page', title, waitedMs: Date.now() - t0, stillChecking: /^Checking your browser/i.test(title) });
    out({ ...tag, step: 'snapshot', ...(await call('spike_snapshot', { tabId })) });
    out({ ...tag, step: 'timers', ...(await call('spike_timers', { tabId })) });
    const clickSel = await pick(tabId, site.click);
    out({ ...tag, step: 'click', selector: clickSel, ...(clickSel ? await call('spike_click', { tabId, selector: clickSel }) : { error: 'no selector found' }) });
    let typeSel = await pick(tabId, site.type);
    if (!typeSel) { await c.request('spike_eval', { tabId, expression: INJECT }); typeSel = '#spike-input'; }
    out({ ...tag, step: 'type', selector: typeSel, ...(await call('spike_type', { tabId, selector: typeSel, text: 'hello spike' })) });
    const shot = await call('spike_screenshot', { tabId });
    out({ ...tag, step: 'screenshot', ...shot });
    if (site.url === 'https://example.com') out({ ...tag, step: 'popup', ...(await call('spike_popup', { tabId })) });
    out({ ...tag, step: 'close', ...(await call('spike_close', { tabId })) });
  }
}
c.close();
