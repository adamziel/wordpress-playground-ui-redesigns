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

async function saveJson(name, data) {
  await fs.writeFile(path.join(rawDir, `${name}.json`), `${JSON.stringify(data, null, 2)}\n`);
}

async function screenshot(page, name) {
  await page.screenshot({
    path: path.join(screenshotDir, `${name}.png`),
    fullPage: true,
  });
}

async function visibleControls(page) {
  return page.evaluate(() => {
    function text(el) {
      return (el.innerText || el.textContent || el.getAttribute('aria-label') || el.getAttribute('title') || '')
        .replace(/\s+/g, ' ')
        .trim();
    }

    function cssPath(el) {
      const parts = [];
      let current = el;
      while (current && current.nodeType === Node.ELEMENT_NODE && parts.length < 6) {
        let selector = current.nodeName.toLowerCase();
        if (current.id) {
          selector += `#${current.id}`;
          parts.unshift(selector);
          break;
        }
        if (current.className && typeof current.className === 'string') {
          const firstClass = current.className.trim().split(/\s+/).filter(Boolean)[0];
          if (firstClass) selector += `.${firstClass}`;
        }
        const parent = current.parentElement;
        if (parent) {
          const siblings = [...parent.children].filter((sibling) => sibling.nodeName === current.nodeName);
          if (siblings.length > 1) selector += `:nth-of-type(${siblings.indexOf(current) + 1})`;
        }
        parts.unshift(selector);
        current = current.parentElement;
      }
      return parts.join(' > ');
    }

    return [...document.querySelectorAll('a,button,input,select,textarea,summary,[role="button"],[role="menuitem"],[aria-label],[title]')]
      .filter((el) => {
        const rect = el.getBoundingClientRect();
        const style = getComputedStyle(el);
        return rect.width > 0 && rect.height > 0 && style.visibility !== 'hidden' && style.display !== 'none';
      })
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
          selector: cssPath(el),
        };
      });
  });
}

async function pageText(page) {
  return page.evaluate(() => document.body.innerText.replace(/\n{3,}/g, '\n\n').trim());
}

async function frameInventory(page) {
  return page.frames().map((frame) => ({ name: frame.name(), url: frame.url() }));
}

async function clickByText(page, pattern, name) {
  const locators = [
    page.getByRole('button', { name: pattern }).first(),
    page.getByRole('link', { name: pattern }).first(),
    page.getByText(pattern).first(),
  ];
  for (const locator of locators) {
    try {
      await locator.waitFor({ state: 'visible', timeout: 2500 });
      await locator.click({ timeout: 2500 });
      await page.waitForTimeout(1000);
      await screenshot(page, name);
      await saveJson(name, {
        url: page.url(),
        frames: await frameInventory(page),
        controls: await visibleControls(page),
        text: await pageText(page),
      });
      return true;
    } catch {
      // Try the next locator style.
    }
  }
  return false;
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
  page.setDefaultTimeout(8000);

  await page.goto('https://playground.wordpress.net/', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(20000);
  await screenshot(page, '01-initial-load');
  await saveJson('01-initial-load', {
    url: page.url(),
    title: await page.title(),
    frames: await frameInventory(page),
    controls: await visibleControls(page),
    text: await pageText(page),
  });

  const clicks = [
    [/settings/i, '02-settings'],
    [/storage/i, '03-storage'],
    [/save/i, '04-save'],
    [/share/i, '05-share'],
    [/export/i, '06-export'],
    [/import/i, '07-import'],
    [/blueprint/i, '08-blueprint'],
    [/new/i, '09-new'],
    [/php/i, '10-php-version'],
    [/wordpress/i, '11-wordpress-version'],
  ];

  const results = [];
  for (const [pattern, name] of clicks) {
    const clicked = await clickByText(page, pattern, name);
    results.push({ pattern: String(pattern), name, clicked });
    await page.keyboard.press('Escape').catch(() => {});
    await page.waitForTimeout(500);
  }

  await saveJson('capture-results', results);
  await browser.close();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
