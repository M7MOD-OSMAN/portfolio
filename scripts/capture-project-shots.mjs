/**
 * Refreshes the project screenshots in public/images/projects/.
 *
 * Usage:  npx playwright install chromium   (once)
 *         node scripts/capture-project-shots.mjs
 *
 * Screenshots are a point-in-time snapshot of live client sites. Re-run this
 * when a site is redesigned, or replace any file by hand with a better shot.
 */
import { chromium } from "playwright";
import { fileURLToPath } from "node:url";
import path from "node:path";

const OUT = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
  "public",
  "images",
  "projects",
);

const sites = [
  ["almaidan", "https://almaidan.com/"],
  ["skyloov", "https://www.skyloov.com/"],
  ["lighthouse", "https://www.mountainviewegypt.com/"],
  ["paris-gallery", "https://www.parisgalleryme.com/"],
  ["alkhunaizan", "https://www.alkhunaizan.sa/"],
  ["inovva", "https://innovapharmacy.com/"],
  ["qasr-alawani", "https://www.qasralawani.net/"],
  ["saco", "https://www.saco.sa/"],
];

// Keep third-party ads and popups out of the captures.
const BLOCKED =
  /doubleclick|googlesyndication|googletagmanager|google-analytics|adservice|taboola|outbrain|facebook\.net|voucherek|tabby/i;

const browser = await chromium.launch();

for (const [slug, url] of sites) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  await page.route("**/*", (route) =>
    BLOCKED.test(route.request().url()) ? route.abort() : route.continue(),
  );

  try {
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 45000 });
    await page.waitForTimeout(5000);
    await page.keyboard.press("Escape").catch(() => {});
    await page.screenshot({
      path: path.join(OUT, `${slug}.jpg`),
      type: "jpeg",
      quality: 82,
    });
    console.log(`ok   ${slug}`);
  } catch (error) {
    console.log(`FAIL ${slug}: ${error.message.split("\n")[0]}`);
  }

  await page.close();
}

await browser.close();
