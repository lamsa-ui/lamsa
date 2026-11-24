// Screenshots of pages whose look is easy to break by accident.
// Update the baselines with: pnpm nx e2e docs -- --update-snapshots visual
import { expect, test } from '@playwright/test';
import { openDocs } from './docs';

const PAGES = [
  { route: '', name: 'home' },
  { route: 'integrations/vue', name: 'vue-integration' },
];

test.use({ viewport: { width: 1280, height: 900 } });

for (const { route, name } of PAGES) {
  test(`looks the same: ${name}`, async ({ page }) => {
    await openDocs(page, route);
    await page.evaluate(() => document.fonts.ready);
    await expect(page).toHaveScreenshot(`${name}.png`, {
      animations: 'disabled',
      // Font hinting differs between Windows and the Linux CI; layout changes move far more pixels.
      maxDiffPixelRatio: process.platform === 'linux' ? 0.04 : 0.02,
      threshold: 0.125,
    });
  });
}
