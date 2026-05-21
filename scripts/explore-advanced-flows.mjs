import { chromium } from 'playwright';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const screenshotDir = path.join(root, 'research', 'screenshots');
const rawDir = path.join(root, 'research', 'raw');
const chromiumPath = process.env.CHROMIUM_PATH || '/run/current-system/sw/bin/chromium';

async function ensureDirs() {
  await fs.mkdir(screenshotDir, { recursive: true });
  await fs.mkdir(rawDir, { recursive: true });
}

async function frameSnapshot(frame) {
  try {
    const data = await frame.evaluate(() => {
      const controls = [...document.querySelectorAll('a,button,input,select,textarea,summary,[role="button"],[role="menuitem"],[aria-label],[title]')]
        .filter((el) => {
          const rect = el.getBoundingClientRect();
          const style = getComputedStyle(el);
          return rect.width > 0 && rect.height > 0 && style.visibility !== 'hidden' && style.display !== 'none';
        })
        .slice(0, 220)
        .map((el) => {
          const rect = el.getBoundingClientRect();
          const label = (el.innerText || el.textContent || el.getAttribute('aria-label') || el.getAttribute('title') || '')
            .replace(/\s+/g, ' ')
            .trim();
          return {
            tag: el.tagName.toLowerCase(),
            role: el.getAttribute('role') || '',
            label,
            type: el.getAttribute('type') || '',
            href: el.getAttribute('href') || '',
            x: Math.round(rect.x),
            y: Math.round(rect.y),
            width: Math.round(rect.width),
            height: Math.round(rect.height),
          };
        });
      return {
        text: document.body.innerText.replace(/\n{3,}/g, '\n\n').trim().slice(0, 12000),
        controls,
      };
    });
    return { url: frame.url(), name: frame.name(), ...data };
  } catch (error) {
    return { url: frame.url(), name: frame.name(), text: `[unavailable: ${error.message}]`, controls: [] };
  }
}

async function capture(page, name, notes = '') {
  await page.screenshot({ path: path.join(screenshotDir, `${name}.png`), fullPage: true });
  const frames = [];
  for (const frame of page.frames()) frames.push(await frameSnapshot(frame));
  await fs.writeFile(
    path.join(rawDir, `${name}.json`),
    `${JSON.stringify({ name, notes, url: page.url(), title: await page.title(), frames }, null, 2)}\n`
  );
}

async function createPage(browser) {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
    deviceScaleFactor: 1,
    colorScheme: 'light',
  });
  const page = await context.newPage();
  page.setDefaultTimeout(10000);
  return { context, page };
}

async function boot(page) {
  await page.goto('https://playground.wordpress.net/', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(18000);
}

async function clickButton(page, name) {
  await page.getByRole('button', { name }).first().click();
  await page.waitForTimeout(1500);
}

async function saveBrowserPlayground(page) {
  await clickButton(page, 'Save');
  const dialog = page.getByRole('dialog').first();
  await dialog.locator('input').first().fill('Advanced Flow Saved Playground');
  await dialog.getByRole('button', { name: /^Save$/ }).click();
  await page.waitForTimeout(9000);
}

async function siteManagerTabs(browser) {
  const { context, page } = await createPage(browser);
  await boot(page);
  await clickButton(page, 'Open Site Manager');
  await capture(page, '21-site-manager-settings-unsaved', 'Unsaved Site Manager settings tab.');

  for (const [tab, name] of [
    ['File browser', '22-site-manager-file-browser'],
    ['Blueprint', '23-site-manager-blueprint'],
    ['Database', '24-site-manager-database'],
    ['Logs', '25-site-manager-logs'],
  ]) {
    await page.getByRole('tab', { name: tab }).click();
    await page.waitForTimeout(2500);
    await capture(page, name, `${tab} tab in Site Manager.`);
  }

  await clickButton(page, 'Additional actions');
  await capture(page, '26-site-manager-additional-actions', 'Additional actions menu in Site Manager.');
  await context.close();
}

async function savedActions(browser) {
  const { context, page } = await createPage(browser);
  await boot(page);
  await saveBrowserPlayground(page);
  await clickButton(page, 'Saved Playgrounds');
  await capture(page, '27-saved-playgrounds-after-save', 'Saved Playgrounds with one saved item.');
  await clickButton(page, 'Site actions');
  await capture(page, '28-saved-playground-actions-menu', 'Actions menu for a saved Playground entry.');
  await context.close();
}

async function startNewCards(browser) {
  const cards = [
    ['Vanilla WordPress', '29-start-vanilla-wordpress'],
    ['WordPress PR', '30-start-wordpress-pr'],
    ['Gutenberg PR', '31-start-gutenberg-pr'],
    ['From GitHub', '32-start-from-github'],
    ['Blueprint URL', '33-start-blueprint-url'],
    ['View all 43 blueprints', '34-blueprints-gallery'],
  ];

  for (const [card, name] of cards) {
    const { context, page } = await createPage(browser);
    await boot(page);
    await clickButton(page, 'Saved Playgrounds');
    await page.getByRole('button', { name: card }).first().click();
    await page.waitForTimeout(4000);
    await capture(page, name, `Start a new Playground flow: ${card}.`);
    await context.close();
  }

  const { context, page } = await createPage(browser);
  await boot(page);
  await clickButton(page, 'Saved Playgrounds');
  const fileChooserPromise = page.waitForEvent('filechooser', { timeout: 5000 }).catch(() => null);
  await page.getByRole('button', { name: 'Import .zip' }).first().click().catch(() => {});
  const fileChooser = await fileChooserPromise;
  await capture(
    page,
    '35-import-zip-trigger',
    fileChooser ? 'Import .zip triggers the native file chooser.' : 'Import .zip did not expose an in-page state before timeout.'
  );
  await context.close();
}

async function main() {
  await ensureDirs();
  const browser = await chromium.launch({
    executablePath: chromiumPath,
    headless: true,
    args: ['--no-sandbox', '--disable-dev-shm-usage'],
  });
  await siteManagerTabs(browser);
  await savedActions(browser);
  await startNewCards(browser);
  await browser.close();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
