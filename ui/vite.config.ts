import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';
import { viteSingleFile } from 'vite-plugin-singlefile';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('.', import.meta.url));
const dist = fileURLToPath(new URL('../dist/', import.meta.url));

// Two builds of the same views (scripts/build.mjs runs both; `--mode` picks one):
//   widget  the chat widget, one self-contained HTML file: dist/widget.html (the MCP App resource)
//   panel   the side panel: dist/panel/panel.js (ES module, exports mountPanel) + panel.css; the extension
//           copies the folder (`npm run sync-ui` there)
// scripts/build.mjs passes build.outDir, so `--check` can build into a temporary folder.
export default defineConfig(({ mode }) => mode === 'panel'
  ? {
    root,
    plugins: [preact()],
    publicDir: false,
    build: {
      outDir: `${dist}panel`,
      emptyOutDir: true,
      target: 'es2022',
      minify: true,
      lib: { entry: `${root}panel.tsx`, formats: ['es'], fileName: () => 'panel.js', cssFileName: 'panel' },
    },
  }
  : {
    root,
    plugins: [preact(), viteSingleFile()],
    publicDir: false,
    build: {
      outDir: `${dist}widget`,
      emptyOutDir: true,
      target: 'es2022',
    },
  });
