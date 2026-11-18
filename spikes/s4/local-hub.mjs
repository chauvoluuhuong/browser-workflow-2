#!/usr/bin/env node
// Package S spike S4 — a LOCAL app-hub (in memory) with one test app `bw2-spike` (anonymous sign-in on).
// Never the live hub. Run with app-hub's tsx so its TypeScript test helpers load:
//   ~/app-hub/node_modules/.bin/tsx spikes/s4/local-hub.mjs        (APP_HUB_DIR overrides ~/app-hub)
// Prints `HUB <url>` once ready and runs until killed.
import { homedir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

const dir = process.env.APP_HUB_DIR || join(homedir(), 'app-hub');
const { startAuthHub, memosManifest } = await import(pathToFileURL(join(dir, 'test', 'auth-helpers.ts')).href);

const manifest = () => ({ ...memosManifest(), name: 'Browser Workflow 2 spike', branding: { name: 'Browser Workflow 2 spike', logo: 'https://example.com/logo.png', accent: '#1a73e8' } });
const hub = await startAuthHub({ apps: { 'bw2-spike': manifest() } });
// addresses.app can only name the hub once it listens: register again with the real address.
const r = await fetch(`${hub.url}/v1/apps/bw2-spike/manifest`, {
  method: 'PUT',
  headers: { authorization: `Bearer ${hub.keys['bw2-spike']}` },
  body: JSON.stringify({ ...manifest(), addresses: { app: `${hub.url}/a/bw2-spike` } }),
});
if (r.status !== 200) throw new Error(`re-registering: ${r.status} ${await r.text()}`);
console.log(`HUB ${hub.url}`);
const stop = async () => { await hub.close(); process.exit(0); };
process.on('SIGINT', stop);
process.on('SIGTERM', stop);
