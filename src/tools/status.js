// extension_status: is Browser Workflow ready in Chrome? Answers in plain words (Claude may pass them on):
// Chrome not open; Chrome open but the extension not answering (with the Chrome Web Store link); ready, with
// the versions; or a plugin too old for the extension.
import { execFileSync } from 'node:child_process';
import { WEB_STORE_URL } from '../ids.js';
import { LinkError } from '../link.js';

/** True when a Chrome process runs (best effort; false when it can't be told). */
export function chromeRunning(platform = process.platform, run = (cmd, args) => execFileSync(cmd, args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] })) {
  try {
    if (platform === 'win32') return /chrome\.exe/i.test(run('tasklist', ['/FI', 'IMAGENAME eq chrome.exe', '/NH']));
    if (platform === 'darwin') return run('pgrep', ['-x', 'Google Chrome']).trim().length > 0;
    return run('pgrep', ['-f', '(google-chrome|chromium|chrome)']).trim().length > 0;
  } catch {
    return false;
  }
}

/**
 * @param {import('../link.js').Link} link
 * @param {{ plugin: string, isChromeRunning?: () => boolean }} o
 */
export async function extensionStatus(link, o) {
  try {
    const s = await link.call('status', {}, 15_000);
    const going = s.activeRunId ? ` A run is going (${s.activeRunId}).` : '';
    return {
      text: `Browser Workflow is ready: the extension answers in Chrome (extension ${s.extension}, plugin ${o.plugin}). ` +
        `${s.workflows} workflow${s.workflows === 1 ? '' : 's'} saved.${going}`,
    };
  } catch (e) {
    if (e instanceof LinkError && e.code === 'too_old') {
      return { text: `This Browser Workflow plugin (${o.plugin}) is older than the Browser Workflow extension needs. ${e.message}`, isError: true };
    }
    if (e instanceof LinkError && e.code === 'not_running') {
      const running = (o.isChromeRunning ?? chromeRunning)();
      return {
        text: running
          ? `Chrome is open, but the Browser Workflow extension is not answering. If it is not in Chrome yet, add it from the Chrome Web Store (${WEB_STORE_URL}) and make sure it is turned on; then try again.`
          : 'Chrome is not open. Open Chrome to continue.',
        isError: true,
      };
    }
    return { text: `The Browser Workflow extension did not answer: ${e?.message ?? e}`, isError: true };
  }
}
