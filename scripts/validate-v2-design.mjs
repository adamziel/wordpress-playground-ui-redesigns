import fs from 'node:fs/promises';
import path from 'node:path';

const [designId] = process.argv.slice(2);
if (!/^v2-design-\d{3}$/.test(designId || '')) {
  console.error('Usage: node scripts/validate-v2-design.mjs v2-design-###');
  process.exit(2);
}

const root = process.cwd();
const dir = path.join(root, 'v2', 'designs', designId);
const htmlPath = path.join(dir, 'index.html');
const manifestPath = path.join(dir, 'manifest.json');

async function read(filePath) {
  return fs.readFile(filePath, 'utf8');
}

function assert(condition, message) {
  if (!condition) {
    console.error(message);
    process.exit(1);
  }
}

const html = await read(htmlPath).catch(() => '');
assert(html.length > 5000, `${designId}: index.html is missing or too small for a high-fidelity wireframe.`);
assert(/<html[\s>]/i.test(html), `${designId}: index.html must be a full HTML document.`);
assert(/viewport/i.test(html), `${designId}: index.html must include responsive viewport metadata.`);

const manifest = JSON.parse(await read(manifestPath).catch(() => '{}'));
assert(manifest.id === designId, `${designId}: manifest.id must match folder name.`);
assert(typeof manifest.title === 'string' && manifest.title.length >= 6, `${designId}: manifest.title is required.`);
assert(typeof manifest.concept === 'string' && manifest.concept.length >= 40, `${designId}: manifest.concept is required.`);
assert(Array.isArray(manifest.focus) && manifest.focus.length >= 3, `${designId}: manifest.focus must list design focus areas.`);
assert(Array.isArray(manifest.flows) && manifest.flows.length >= 5, `${designId}: manifest.flows must list key user flows.`);
assert(Array.isArray(manifest.featureCoverage) && manifest.featureCoverage.length >= 16, `${designId}: manifest.featureCoverage must list covered features.`);

const family = `${manifest.title} ${manifest.concept} ${manifest.focus.join(' ')} ${html}`;
assert(
  /console|command|deck|operations?|workbench|control|shell|workspace/i.test(family),
  `${designId}: V2 designs must stay in the console/command deck/operations family.`
);

const requiredSignals = [
  /save/i,
  /local directory/i,
  /saved playground/i,
  /site manager/i,
  /blueprint/i,
  /database/i,
  /logs?/i,
  /github/i,
  /zip/i,
  /wordpress/i,
  /php/i,
  /import/i,
  /export/i,
  /reset/i,
  /reload/i,
  /wp admin/i,
];

for (const signal of requiredSignals) {
  assert(signal.test(html), `${designId}: index.html is missing required UI signal ${signal}.`);
}

console.log(`${designId} validated.`);
