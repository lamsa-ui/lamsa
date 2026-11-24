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

/** The live demos are the Angular components; the other views change only the code shown. */
const COMPONENT_FRAMEWORKS = ['angular'] as const;

/** Buttons that open a dialog, alert or region, in the Angular demos and, where it has one, the HTML demo: [route, button, role, region name, html too]. */
const STATES: [string, string, string, string | undefined, boolean][] = [
  ['components/dialog', 'Edit address', 'dialog', undefined, true],
  ['components/dialog', 'Read the terms', 'dialog', undefined, false],
  ['components/dialog', 'Write a note', 'dialog', undefined, false],
  ['components/alert-dialog', 'Delete file', 'alertdialog', undefined, true],
  [
    'components/alert-dialog',
    'Leave the page',
    'alertdialog',
    undefined,
    false,
  ],
  ['components/drawer', 'Add building', 'dialog', undefined, true],
  ['components/drawer', 'Add building in Arabic', 'dialog', undefined, false],
  ['components/bottom-sheet', 'Order 1042', 'dialog', undefined, true],
  ['components/toast', 'Pay', 'region', 'Notifications', false],
  ['components/command-palette', 'Commands', 'dialog', undefined, false],
  ['components/toast', 'Delete order', 'region', 'Notifications', false],
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

    for (const [route, button, role, name, html] of STATES)
      for (const framework of [
        ...COMPONENT_FRAMEWORKS,
        ...(html ? (['html'] as const) : []),
      ]) {
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

    for (const [route, openPopup] of POPUPS)
      for (const framework of COMPONENT_FRAMEWORKS) {
        test(`${framework} /${route}: popup open`, async ({ page }) => {
          await openDocs(page, route, { theme, framework });
          await openPopup(page);
          await expectNoViolations(page);
        });
      }
  });
}

// WCAG 1.4.4 and 1.4.12: text at 200% and the text-spacing override must not push the page
// sideways at a desktop width (scrolling areas such as code and tables scroll on their own).
const TEXT_STRESS: Record<string, string> = {
  'text at 200%': 'html { font-size: 200% !important; }',
  'text spacing':
    '* { line-height: 1.5 !important; letter-spacing: 0.12em !important; word-spacing: 0.16em !important; } p { margin-block-end: 2em !important; }',
};
for (const [name, css] of Object.entries(TEXT_STRESS)) {
  for (const route of ROUTES) {
    test(`${name} /${route}: no sideways scroll`, async ({ page }) => {
      await openDocs(page, route);
      await page.addStyleTag({ content: css });
      const width = await page.evaluate(
        () => document.documentElement.scrollWidth - innerWidth,
      );
      expect(width).toBeLessThanOrEqual(1);
    });
  }
}

// WCAG 1.4.10: at 320 CSS pixels wide (400% zoom on a 1280 screen) nothing scrolls sideways.
for (const route of ROUTES) {
  test(`reflow at 320px /${route}: no sideways scroll`, async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 640 });
    await openDocs(page, route);
    const width = await page.evaluate(
      () => document.documentElement.scrollWidth - innerWidth,
    );
    expect(width).toBeLessThanOrEqual(1);
  });
}

test('more contrast: muted text and borders go to full strength', async ({
  page,
}) => {
  await page.emulateMedia({ contrast: 'more' });
  await openDocs(page, 'components/text-field');
  const [text, muted, border] = await page.evaluate(() => {
    const probe = document.createElement('span');
    document.body.append(probe);
    return ['--ui-text', '--ui-text-muted', '--ui-border'].map((v) => {
      probe.style.color = `var(${v})`;
      return getComputedStyle(probe).color;
    });
  });
  expect(muted).toBe(text);
  expect(border).toBe(text);
});
