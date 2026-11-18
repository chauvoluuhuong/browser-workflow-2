#!/usr/bin/env node
// Package S spike S4 — test plumbing only: finds the launchWebAuthFlow window's page through Chrome's
// --remote-debugging-port and presses the hub's "Continue" button (anonymous sign-in), like a user would.
//   node spikes/s4/click-continue.mjs <debug port> [screenshot.png] [--fix-action]
// --fix-action (test plumbing): the hub's connect page posts to a root-relative "/authorize", which under the
// hub's /a/<id>/ address is a 404 ("Authorization page could not be loaded."). The flag points the form at
// /a/<id>/authorize first, i.e. what a fixed hub would do, to prove the rest of the flow.
// Waits up to 30 s for a page whose URL contains /authorize, saves a screenshot of it (to record its look),
// then clicks the "Continue" button (name=action value=continue, or its text).
import { writeFileSync } from 'node:fs';

const port = process.argv[2] ?? '9333';
const shot = process.argv[3]?.startsWith('--') ? undefined : process.argv[3];
const fixAction = process.argv.includes('--fix-action');
const deadline = Date.now() + 30_000;
let target;
while (!target && Date.now() < deadline) {
  const list = await fetch(`http://127.0.0.1:${port}/json/list`).then((r) => r.json()).catch(() => []);
  target = list.find((t) => t.type === 'page' && t.url.includes('/authorize'));
  if (!target) await new Promise((r) => setTimeout(r, 250));
}
if (!target) { console.log(JSON.stringify({ found: false })); process.exit(1); }
const ws = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((r) => ws.addEventListener('open', r, { once: true }));
let n = 0;
const waits = new Map();
ws.addEventListener('message', (e) => { const m = JSON.parse(e.data); waits.get(m.id)?.(m); });
const send = (method, params = {}) => new Promise((r) => { const id = ++n; waits.set(id, r); ws.send(JSON.stringify({ id, method, params })); });
const evaluate = async (expression) => (await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true })).result?.result?.value;
// wait for the form
for (let i = 0; i < 40 && !(await evaluate('!![...document.querySelectorAll("button")].find((b) => (b.name === "action" && b.value === "continue") || b.textContent.trim() === "Continue")')); i++) await new Promise((r) => setTimeout(r, 250));
const page = await evaluate(`({ title: document.title, lang: document.documentElement.lang, buttons: [...document.querySelectorAll('button')].map((b) => (b.name || '') + '=' + (b.value || '') + ' "' + b.textContent.trim() + '"'), size: [innerWidth, innerHeight] })`);
if (shot) {
  const s = await send('Page.captureScreenshot', { format: 'png' });
  if (s.result?.data) writeFileSync(shot, Buffer.from(s.result.data, 'base64'));
}
const formAction = await evaluate('[...document.forms].map((f) => f.getAttribute("action"))');
if (fixAction) await evaluate(`[...document.forms].forEach((f) => { const a = f.getAttribute('action'); if (a.startsWith('/authorize')) f.setAttribute('action', location.pathname + a.slice('/authorize'.length)); })`);
const clicked = await evaluate('(() => { const b = [...document.querySelectorAll("button")].find((b) => (b.name === "action" && b.value === "continue") || b.textContent.trim() === "Continue"); if (!b) return false; b.click(); return true; })()');
console.log(JSON.stringify({ found: true, formAction, fixAction, url: target.url.replace(/code_challenge=[^&]+/, 'code_challenge=…').replace(/state=[^&]+/, 'state=…'), page, clicked }));
ws.close();
