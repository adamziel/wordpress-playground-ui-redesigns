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

async function screenshot(page, name) {
  await page.screenshot({
    path: path.join(screenshotDir, `${name}.png`),
    fullPage: true,
  });
}

async function controlsInFrame(frame) {
  return frame.evaluate(() => {
    function text(el) {
      return (el.innerText || el.textContent || el.getAttribute('aria-label') || el.getAttribute('title') || '')
        .replace(/\s+/g, ' ')
        .trim();
    }

    return [...document.querySelectorAll('a,button,input,select,textarea,summary,[role="button"],[role="menuitem"],[aria-label],[title]')]
      .filter((el) => {
        const rect = el.getBoundingClientRect();
        const style = getComputedStyle(el);
        return rect.width > 0 && rect.height > 0 && style.visibility !== 'hidden' && style.display !== 'none';
      })
      .slice(0, 180)
      .map((el) => {
        const rect = el.getBoundingClientRect();
        return {
          tag: el.tagName.toLowerCase(),
          role: el.getAttribute('role') || '',
          text: text(el),
          aria: el.getAttribute('aria-label') || '',
          title: el.getAttribute('title') || '',
          type: el.getAttribute('type') || '',
          href: el.getAttribute('href') || '',
          x: Math.round(rect.x),
          y: Math.round(rect.y),
          width: Math.round(rect.width),
          height: Math.round(rect.height),
        };
      });
  });
}

async function textInFrame(frame) {
  return frame.evaluate(() => document.body.innerText.replace(/\n{3,}/g, '\n\n').trim());
}

async function captureState(page, name, notes = '') {
  const frames = [];
  for (const frame of page.frames()) {
    let text = '';
    let controls = [];
    try {
      text = await textInFrame(frame);
      controls = await controlsInFrame(frame);
    } catch (error) {
      text = `[unavailable: ${error.message}]`;
    }
    frames.push({
      name: frame.name(),
      url: frame.url(),
      text: text.slice(0, 8000),
      controls,
    });
  }

  await screenshot(page, name);
  await fs.writeFile(
    path.join(rawDir, `${name}.json`),
    `${JSON.stringify(
      {
        name,
        notes,
        url: page.url(),
        title: await page.title(),
        frames,
      },
      null,
      2
    )}\n`
  );
}

async function boot(page, url = 'https://playground.wordpress.net/') {
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(18000);
}

async function clickTopButton(page, name) {
  await page.getByRole('button', { name }).first().click({ timeout: 6000 });
  await page.waitForTimeout(1200);
}

async function main() {
  await ensureDirs();
  const browser = await chromium.launch({
    executablePath: chromiumPath,
    headless: true,
    args: ['--no-sandbox', '--disable-dev-shm-usage'],
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
    deviceScaleFactor: 1,
    colorScheme: 'light',
  });
  const page = await context.newPage();
  page.setDefaultTimeout(10000);

  await boot(page);
  await captureState(page, '12-home-with-frame-text', 'Default Playground after WordPress has booted.');

  await clickTopButton(page, 'Edit Playground settings');
  await captureState(page, '13-settings-panel', 'Settings panel with WordPress/PHP/language/network/multisite reset controls.');

  await boot(page);
  await clickTopButton(page, 'Save');
  await captureState(page, '14-save-modal-empty', 'Save modal before choosing a storage destination.');
  const dialog = page.getByRole('dialog').first();
  await dialog.locator('input').first().fill('Research Browser Playground');
  await captureState(page, '15-save-modal-named-browser', 'Save modal with a browser-backed Playground name.');
  await dialog.getByRole('button', { name: /^Save$/ }).click();
  await page.waitForTimeout(3500);
  await captureState(page, '16-after-browser-save', 'State after saving the Playground in browser storage.');

  await clickTopButton(page, 'Saved Playgrounds');
  await captureState(page, '17-saved-playgrounds-list', 'Saved Playgrounds view after one browser-backed Playground exists.');

  await page.keyboard.press('Escape').catch(() => {});
  await page.waitForTimeout(800);
  await clickTopButton(page, 'Open Site Manager');
  await captureState(page, '18-site-manager', 'Site Manager opened from the top bar.');

  await boot(page);
  await page.getByLabel(/URL to visit/i).fill('/wp-admin/');
  await page.keyboard.press('Enter');
  await page.waitForTimeout(7000);
  await captureState(page, '19-wp-admin-dashboard', 'WordPress admin dashboard reached through the top URL control.');

  await clickTopButton(page, 'Open Site Manager');
  await captureState(page, '20-site-manager-from-admin', 'Site Manager opened while the nested WordPress admin is active.');

  await browser.close();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
