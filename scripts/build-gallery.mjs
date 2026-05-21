import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const designsDir = path.join(root, 'designs');
const dataDir = path.join(root, 'data');
const indexPath = path.join(root, 'index.html');

async function exists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function readJson(filePath) {
  return JSON.parse(await fs.readFile(filePath, 'utf8'));
}

function esc(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

async function collectDesigns() {
  await fs.mkdir(designsDir, { recursive: true });
  const entries = await fs.readdir(designsDir, { withFileTypes: true });
  const designs = [];

  for (const entry of entries) {
    if (!entry.isDirectory() || !/^design-\d{3}$/.test(entry.name)) continue;
    const dir = path.join(designsDir, entry.name);
    const manifestPath = path.join(dir, 'manifest.json');
    const htmlPath = path.join(dir, 'index.html');
    if (!(await exists(manifestPath)) || !(await exists(htmlPath))) continue;

    const manifest = await readJson(manifestPath);
    designs.push({
      id: entry.name,
      number: Number(entry.name.slice(-3)),
      title: manifest.title || entry.name,
      concept: manifest.concept || '',
      focus: manifest.focus || [],
      featureCoverage: manifest.featureCoverage || [],
      path: `${entry.name}/index.html`,
    });
  }

  designs.sort((a, b) => a.number - b.number);
  return designs;
}

function renderCards(designs) {
  if (designs.length === 0) {
    return '<div class="empty">The worker swarm is preparing the first redesigns. This gallery updates as designs are integrated.</div>';
  }

  return `<div class="grid">
${designs
  .map(
    (design) => {
      const href = `designs/${esc(design.path)}`;
      const label = `Design ${String(design.number).padStart(3, '0')}`;
      return `          <article class="preview-card">
            <div class="preview-head">
              <div>
                <div class="number">${label}</div>
                <h2>${esc(design.title)}</h2>
              </div>
              <a href="${href}">Open</a>
            </div>
            <div class="frame-wrap">
              <iframe src="${href}" title="${esc(label)} - ${esc(design.title)}" loading="lazy"></iframe>
            </div>
            <p>${esc(design.concept)}</p>
          </article>`;
    }
  )
  .join('\n')}
        </div>`;
}

function renderIndex(designs) {
  const count = designs.length;
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>WordPress Playground UI Redesigns</title>
    <style>
      :root {
        color-scheme: light;
        --bg: #f6f7f7;
        --ink: #111517;
        --muted: #5f6a70;
        --line: #dcdcde;
        --panel: #fff;
        --accent: #007cba;
        --accent-dark: #005a87;
      }

      * {
        box-sizing: border-box;
      }

      body {
        margin: 0;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        color: var(--ink);
        background: var(--bg);
      }

      header {
        border-bottom: 1px solid var(--line);
        background: var(--panel);
      }

      .wrap {
        width: min(1180px, calc(100% - 32px));
        margin: 0 auto;
      }

      .hero {
        padding: 36px 0 28px;
      }

      h1 {
        margin: 0;
        font-size: clamp(28px, 4vw, 48px);
        line-height: 1.05;
        letter-spacing: 0;
      }

      .lede {
        max-width: 820px;
        margin: 14px 0 0;
        color: var(--muted);
        font-size: 17px;
        line-height: 1.55;
      }

      .meta {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        margin-top: 22px;
      }

      .pill {
        border: 1px solid var(--line);
        background: #fff;
        border-radius: 999px;
        padding: 7px 10px;
        color: #2f3a40;
        font-size: 13px;
      }

      main {
        padding: 26px 0 48px;
      }

      .toolbar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 14px;
        margin-bottom: 18px;
      }

      .toolbar a {
        color: var(--accent-dark);
        text-decoration: none;
        font-weight: 600;
      }

      .grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(min(100%, 520px), 1fr));
        gap: 18px;
      }

      .preview-card {
        border: 1px solid var(--line);
        border-radius: 8px;
        background: var(--panel);
        overflow: hidden;
      }

      .preview-card:hover {
        border-color: var(--accent);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
      }

      .preview-head {
        min-height: 86px;
        display: flex;
        justify-content: space-between;
        gap: 16px;
        padding: 14px 16px;
        border-bottom: 1px solid var(--line);
      }

      .preview-head h2 {
        margin: 4px 0 0;
        font-size: 18px;
        line-height: 1.25;
      }

      .preview-head a {
        align-self: flex-start;
        border: 1px solid var(--line);
        border-radius: 6px;
        padding: 7px 10px;
        color: var(--accent-dark);
        text-decoration: none;
        font-size: 13px;
        font-weight: 700;
      }

      .preview-head a:hover {
        border-color: var(--accent);
      }

      .frame-wrap {
        aspect-ratio: 16 / 10;
        background: #eef1f4;
        border-bottom: 1px solid var(--line);
      }

      iframe {
        width: 100%;
        height: 100%;
        display: block;
        border: 0;
        background: #fff;
      }

      .preview-card p {
        margin: 0;
        padding: 14px 16px 16px;
        color: var(--muted);
        font-size: 14px;
        line-height: 1.45;
      }

      .number {
        color: var(--accent-dark);
        font-size: 13px;
        font-weight: 700;
      }

      @media (max-width: 640px) {
        .wrap {
          width: min(100% - 20px, 1180px);
        }

        .hero {
          padding: 28px 0 22px;
        }

        .toolbar {
          align-items: flex-start;
          flex-direction: column;
        }

        .preview-head {
          min-height: 0;
        }
      }

      .empty {
        border: 1px dashed var(--line);
        border-radius: 8px;
        background: #fff;
        padding: 28px;
        color: var(--muted);
      }
    </style>
  </head>
  <body>
    <header>
      <div class="wrap hero">
        <h1>WordPress Playground UI Redesigns</h1>
        <p class="lede">A running iframe preview gallery of static redesign explorations for the current WordPress Playground interface, grounded in captured user flows and feature coverage.</p>
        <div class="meta">
          <span class="pill">${count} / 100 designs</span>
          <span class="pill">Live research captured May 21, 2026</span>
          <span class="pill">Static HTML/CSS/JS</span>
        </div>
      </div>
    </header>
    <main>
      <div class="wrap">
        <div class="toolbar">
          <strong>Iframe Preview Gallery</strong>
          <a href="research/PLAYGROUND_UI_MAP.md">Current UI map</a>
        </div>
        ${renderCards(designs)}
      </div>
    </main>
  </body>
</html>
`;
}

const designs = await collectDesigns();
await fs.mkdir(dataDir, { recursive: true });
await fs.writeFile(path.join(dataDir, 'designs.json'), `${JSON.stringify(designs, null, 2)}\n`);
await fs.writeFile(indexPath, renderIndex(designs));
console.log(`Gallery built with ${designs.length} designs.`);
