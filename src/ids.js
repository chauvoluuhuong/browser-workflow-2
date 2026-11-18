// Names and places the plugin, its native host and the extension agree on.
import { homedir, userInfo } from 'node:os';
import { join } from 'node:path';

/** The native-messaging host the extension connects to (lowercase, dots and underscores only). */
export const HOST_NAME = 'com.browser_workflow_2.host';

/** The extension's id in development builds (a throwaway public key; the private key was never kept). */
export const DEV_EXTENSION_ID = 'iickjddceohcklpodfeekggppkcilbgj';

/** The extension's id on the Chrome Web Store: a placeholder until the first upload (the release package fills it). */
export const STORE_EXTENSION_ID = '';

/** Where the user gets the extension. */
export const WEB_STORE_URL = STORE_EXTENSION_ID
  ? `https://chromewebstore.google.com/detail/${STORE_EXTENSION_ID}`
  : 'https://chromewebstore.google.com/search/Browser%20Workflow';

/** The extension ids allowed to start the host. */
export function allowedOrigins() {
  return [DEV_EXTENSION_ID, STORE_EXTENSION_ID].filter(Boolean).map((id) => `chrome-extension://${id}/`);
}

/** The user's home for the plugin's files; BW2_HOME overrides it (tests, and the launcher passes it to the host). */
export function bw2Home(env = process.env) {
  return env.BW2_HOME || join(homedir(), '.browser-workflow-2');
}

/** The host's socket: a unix socket in the home folder, a named pipe on Windows. */
export function socketPath(env = process.env, platform = process.platform) {
  if (env.BW2_SOCKET) return env.BW2_SOCKET;
  if (platform === 'win32') return `\\\\.\\pipe\\browser-workflow-2-${userInfo().username}`;
  return join(bw2Home(env), 'host.sock');
}
