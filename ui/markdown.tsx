// Claude's answers in the side panel's chat, drawn like Claude draws them: Markdown (marked, GFM with line breaks),
// cleaned by DOMPurify (no styles, scripts, frames or forms: the text is Claude's, and what it quotes may be a
// web page's). Links open in a new tab through the bridge (http, https and mailto only); code blocks get Copy;
// tables scroll in their own box. A ```html block is a page Claude made: in the side panel it is drawn live in the
// extension's isolated page (HtmlBlock: Preview / Code, Open in a tab); elsewhere it stays code.
import { useLayoutEffect, useMemo, useRef, useState } from 'preact/hooks';
import { Marked, type Token, type TokensList } from 'marked';
import DOMPurify from 'dompurify';
import { useNav } from './components.js';
import { useI18n } from './i18n.js';

const md = new Marked({ gfm: true, breaks: true });

const purify = DOMPurify();
purify.addHook('afterSanitizeAttributes', (node) => {
  if (node.tagName === 'A') {
    node.setAttribute('target', '_blank');
    node.setAttribute('rel', 'noopener noreferrer');
  }
});
const CLEAN = {
  USE_PROFILES: { html: true },
  FORBID_TAGS: ['style', 'script', 'iframe', 'frame', 'object', 'embed', 'form', 'input', 'button', 'select', 'textarea', 'option', 'link', 'meta', 'base'],
  FORBID_ATTR: ['style'],
};

/** Markdown → clean HTML. */
export function toHtml(text: string, tokens?: Token[], links?: TokensList['links']): string {
  const list = tokens ? Object.assign([...tokens], { links: links ?? {} }) as TokensList : md.lexer(text);
  return purify.sanitize(md.parser(list), CLEAN) as string;
}

const isHtmlFence = (t: Token) => t.type === 'code' && /^html\b/i.test(((t as { lang?: string }).lang ?? '').trim());

/** The top-level pieces: runs of Markdown, and the ```html blocks between them. */
function split(text: string): ({ html: string } | { page: string })[] {
  const tokens = md.lexer(text);
  const out: ({ html: string } | { page: string })[] = [];
  let run: Token[] = [];
  const flush = () => { if (run.length) out.push({ html: toHtml('', run, tokens.links) }); run = []; };
  for (const t of tokens) {
    if (isHtmlFence(t)) { flush(); out.push({ page: (t as { text: string }).text }); } else run.push(t);
  }
  flush();
  return out;
}

export async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return;
  } catch { /* not focused, or not allowed: the old way */ }
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.style.position = 'fixed';
  ta.style.opacity = '0';
  document.body.appendChild(ta);
  ta.select();
  document.execCommand('copy');
  ta.remove();
}

const OPENABLE = /^(https?:|mailto:)/i;

/** One run of clean HTML: links through the bridge, a Copy bar on every code block. */
function Html({ html }: { html: string }) {
  const nav = useNav();
  const { t } = useI18n();
  const ref = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.querySelectorAll('pre').forEach((pre) => {
      if (pre.parentElement?.classList.contains('md-code')) return;
      const box = document.createElement('div');
      box.className = 'md-code';
      const bar = document.createElement('div');
      bar.className = 'md-code-bar';
      const lang = /language-(\S+)/.exec(pre.querySelector('code')?.className ?? '')?.[1] ?? '';
      const name = document.createElement('span');
      name.textContent = lang;
      const copy = document.createElement('button');
      copy.type = 'button';
      copy.className = 'md-copy';
      copy.dataset.copy = '';
      copy.textContent = t('md.copy');
      bar.append(name, copy);
      pre.replaceWith(box);
      box.append(bar, pre);
    });
  }, [html]);
  const onClick = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    const copy = target.closest?.('[data-copy]') as HTMLButtonElement | null;
    if (copy) {
      const code = copy.closest('.md-code')?.querySelector('pre')?.textContent ?? '';
      void copyText(code);
      copy.textContent = t('md.copied');
      setTimeout(() => { copy.textContent = t('md.copy'); }, 2_000);
      return;
    }
    const a = target.closest?.('a') as HTMLAnchorElement | null;
    if (!a) return;
    e.preventDefault();
    const href = a.getAttribute('href') ?? '';
    if (OPENABLE.test(href)) void nav.bridge.openLink(href);
  };
  return <div ref={ref} class="md" onClick={onClick} dangerouslySetInnerHTML={{ __html: html }} />;
}

/** A code block drawn by the panel itself (an html block where no live preview can be drawn). */
function CodeBlock({ code, lang }: { code: string; lang?: string }) {
  const { t } = useI18n();
  const [copied, setCopied] = useState(false);
  return (
    <div class="md md-code">
      <div class="md-code-bar">
        <span>{lang}</span>
        <button type="button" class="md-copy" onClick={() => { void copyText(code); setCopied(true); setTimeout(() => setCopied(false), 2_000); }}>{copied ? t('md.copied') : t('md.copy')}</button>
      </div>
      <pre><code>{code}</code></pre>
    </div>
  );
}

/** The tallest a page is drawn in the chat; taller ones scroll in their own box. */
export const PAGE_MAX_H = 600;
let pageSeq = 0;

/**
 * A page Claude made (a ```html block). In the side panel (the bridge gives the isolated page's address): drawn
 * live there, with Preview / Code and Open in a tab. Elsewhere: its code, with Copy.
 */
export function HtmlBlock({ html }: { html: string }) {
  const nav = useNav();
  const { t } = useI18n();
  let url: string | undefined;
  try { url = nav.bridge.frameUrl?.(); } catch { url = undefined; }
  const [tab, setTab] = useState<'preview' | 'code'>('preview');
  const id = useMemo(() => `p${++pageSeq}-${Math.random().toString(36).slice(2, 8)}`, []);
  const frame = useRef<HTMLIFrameElement>(null);
  const [height, setHeight] = useState(120);
  // The page goes once the isolated page says it is ready, or once it has loaded (an extension page can load
  // before a listener added after paint would hear "ready"): whichever comes first.
  const sent = useRef(false);
  const send = () => {
    const w = frame.current?.contentWindow;
    if (!w || sent.current) return;
    sent.current = true;
    w.postMessage({ bw: 'html', id, html }, '*');
  };
  useLayoutEffect(() => {
    if (!url) return;
    sent.current = false;
    const onMessage = (e: MessageEvent) => {
      const f = frame.current;
      const d = e.data;
      if (!f || e.source !== f.contentWindow || !d || d.bw !== 'frame') return;
      if (d.ready && d.id == null) send();
      else if (d.id === id && typeof d.height === 'number') setHeight(Math.max(24, Math.min(d.height, 20_000)));
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, [url, id, html]);
  if (!url) return <CodeBlock code={html} lang="html" />;
  const title = /<title[^>]*>([^<]*)<\/title>/i.exec(html)?.[1]?.trim() || undefined;
  return (
    <div class="md-page">
      <div class="md-page-bar">
        <div class="seg" role="group">
          <button type="button" aria-pressed={tab === 'preview'} onClick={() => setTab('preview')}>{t('md.preview')}</button>
          <button type="button" aria-pressed={tab === 'code'} onClick={() => setTab('code')}>{t('md.code')}</button>
        </div>
        {nav.bridge.openPreview && <button type="button" class="link" onClick={() => void nav.bridge.openPreview!(html, title)}>{t('md.openTab')}</button>}
      </div>
      <div class="md-page-view" hidden={tab !== 'preview'} style={{ maxHeight: `${PAGE_MAX_H}px` }}>
        <iframe ref={frame} src={url} title={title ?? t('md.preview')} style={{ height: `${height}px` }} onLoad={send} />
      </div>
      {tab === 'code' && <CodeBlock code={html} lang="html" />}
    </div>
  );
}

/** Claude's answer: Markdown, with each ```html block as a page. */
export function Markdown({ text }: { text: string }) {
  const parts = useMemo(() => split(text ?? ''), [text]);
  return (
    <>
      {parts.map((p, i) => ('page' in p ? <HtmlBlock key={`p${i}`} html={p.page} /> : <Html key={`h${i}`} html={p.html} />))}
    </>
  );
}
