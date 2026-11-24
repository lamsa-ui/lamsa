// Accessibility audit: every page in light and dark, in each framework view, plus open
// dialogs, alerts and popups. Fails on any WCAG 2.2 AA or best-practice violation axe finds.
import { AxeBuilder } from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';
import { openDocs, ROUTES, type Framework, type Theme } from './docs';

async function expectNoViolations(page: Page): Promise<void> {
  const { violations } = await new AxeBuilder({ page })
    .withTags([
      'wcag2a',
      'wcag2aa',
      'wcag21a',
      'wcag21aa',
      'wcag22aa',
      'best-practice',
    ])
    .analyze();
  expect(
    violations.map((v) => ({
      rule: v.id,
      impact: v.impact,
      help: v.help,
      targets: v.nodes.map((n) => n.target.join(' ')),
    })),
  ).toEqual([]);
}

/** Buttons that open a dialog, alert or region: [framework, route, button, role, region name]. */
const STATES: [Framework, string, string, string, string?][] = [
  ['angular', 'components/dialog', 'Edit address', 'dialog'],
  ['angular', 'components/dialog', 'Read the terms', 'dialog'],
  ['angular', 'components/dialog', 'Write a note', 'dialog'],
  ['angular', 'components/alert-dialog', 'Delete file', 'alertdialog'],
  ['angular', 'components/alert-dialog', 'Leave the page', 'alertdialog'],
  ['angular', 'components/drawer', 'Add building', 'dialog'],
  ['angular', 'components/drawer', 'Add building in Arabic', 'dialog'],
  ['html', 'components/dialog', 'Edit address', 'dialog'],
  ['html', 'components/drawer', 'Add building', 'dialog'],
  ['angular', 'components/bottom-sheet', 'Order 1042', 'dialog'],
  ['html', 'components/bottom-sheet', 'Order 1042', 'dialog'],
  ['html', 'components/alert-dialog', 'Delete file', 'alertdialog'],
  ['angular', 'components/toast', 'Pay', 'region', 'Notifications'],
  ['angular', 'components/command-palette', 'Commands', 'dialog'],
  ['angular', 'components/toast', 'Delete order', 'region', 'Notifications'],
];

// The kit places every CDK popup right after its trigger, so `region` (everything inside a
// landmark) stays on: it fails if a popup lands at the end of <body>.
const POPUPS: [string, (page: Page) => Promise<void>][] = [
  [
    'components/date-picker',
    async (page) => {
      await page
        .getByRole('button', { name: 'Choose date', exact: true })
        .first()
        .click();
      await page.getByRole('dialog').waitFor();
    },
  ],
  [
    'components/app-shell',
    async (page) => {
      await page
        .getByRole('button', { name: 'Menu', exact: true })
        .first()
        .click();
      await page.locator('.ui-shell--open').first().waitFor();
    },
  ],
  [
    'components/select',
    async (page) => {
      await page.getByRole('button', { name: /City/ }).first().click();
      await page.getByRole('listbox').waitFor();
      await page.keyboard.press('ArrowDown');
    },
  ],
  [
    'components/combobox',
    async (page) => {
      await page
        .getByRole('combobox', { name: 'Country', exact: true })
        .fill('u');
      await page.getByRole('listbox').waitFor();
      await page.keyboard.press('ArrowDown');
    },
  ],
  [
    'components/menu',
    async (page) => {
      await page.getByRole('button', { name: 'Actions', exact: true }).click();
      await page.getByRole('menu').waitFor();
    },
  ],
  [
    'components/language-switcher',
    async (page) => {
      await page
        .getByRole('button', { name: 'Language: English', exact: true })
        .click();
      await page.getByRole('menu').waitFor();
    },
  ],
  [
    'components/popover',
    async (page) => {
      await page
        .getByRole('button', { name: 'Delivery fee', exact: true })
        .click();
      await page.getByRole('dialog').waitFor();
    },
  ],
  [
    'components/tooltip',
    async (page) => {
      await page.getByRole('button', { name: 'Copy link' }).first().focus();
      await page.getByRole('tooltip').waitFor();
    },
  ],
];

for (const theme of ['light', 'dark'] as Theme[]) {
  test.describe(`a11y ${theme}`, () => {
    for (const framework of [
      'angular',
      'react',
      'vue',
      'html',
    ] as Framework[]) {
      // Only component pages, Getting started and home change with the framework.
      const routes =
        framework === 'angular'
          ? ROUTES
          : ROUTES.filter((p) => /^(components\/|getting-started$|$)/.test(p));
      for (const route of routes) {
        test(`${framework} /${route}`, async ({ page }) => {
          await openDocs(page, route, { theme, framework });
          await expectNoViolations(page);
        });
      }
    }

    for (const [framework, route, button, role, name] of STATES) {
      test(`${framework} /${route}: "${button}" open`, async ({ page }) => {
        await openDocs(page, route, { theme, framework });
        await page.getByRole('button', { name: button, exact: true }).click();
        // The toast region has no box of its own (its list is fixed), so wait for it to exist.
        await page
          .getByRole(
            role as Parameters<Page['getByRole']>[0],
            name ? { name } : {},
          )
          .waitFor({ state: role === 'region' ? 'attached' : 'visible' });
        await expectNoViolations(page);
      });
    }

    for (const [route, openPopup] of POPUPS) {
      test(`angular /${route}: popup open`, async ({ page }) => {
        await openDocs(page, route, { theme });
        await openPopup(page);
        await expectNoViolations(page);
      });
    }
  });
}
