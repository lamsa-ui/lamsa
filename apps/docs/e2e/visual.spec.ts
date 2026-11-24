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

// Windows high contrast (forced colours): controls must keep their edges, states and focus ring.
// The first example of each page, with its first control focused from the keyboard.
const FORCED = [
  'checkbox',
  'switch',
  'radio-group',
  'segmented-control',
  'tabs',
  'button',
  'text-field',
  'select',
  'toggle',
  'progress',
];

for (const name of FORCED) {
  test(`forced colours: ${name}`, async ({ page }) => {
    await page.emulateMedia({ forcedColors: 'active' });
    await openDocs(page, `components/${name}`);
    await page.evaluate(() => document.fonts.ready);
    const example = page.locator('main .doc-preview').first();
    await example.scrollIntoViewIfNeeded();
    const control = example
      .locator('button, input, [tabindex="0"], [role="tab"]')
      .first();
    if (await control.count()) await control.focus();
    await expect(example).toHaveScreenshot(`forced-${name}.png`, {
      animations: 'disabled',
      maxDiffPixelRatio: process.platform === 'linux' ? 0.04 : 0.02,
      threshold: 0.125,
    });
  });
}
