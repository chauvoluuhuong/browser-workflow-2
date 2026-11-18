import { render } from 'preact';
import './styles.css';
import { createBridge } from './bridge.js';
import { Widget } from './widget.js';

// The chat widget (dist/widget.html): the views in the MCP Apps host.
async function boot() {
  const bridge = await createBridge();
  render(<Widget bridge={bridge} />, document.getElementById('app')!);
}

boot();
