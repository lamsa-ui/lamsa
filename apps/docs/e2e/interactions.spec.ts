// Keyboard and pointer behaviour of the components on their docs pages. The live demos are
// the Angular components; React and Vue behaviour is covered by their unit tests.
// Runs in Chromium, Firefox and WebKit.
import { readFile } from 'node:fs/promises';
import { expect, test } from '@playwright/test';
import { openDocs } from './docs';

{
  const framework = 'angular';
  test.describe(framework, () => {
    test('select: keyboard selection', async ({ page }) => {
      await openDocs(page, 'components/select', { framework });
      const trigger = page.getByRole('button', { name: /City/ }).first();
      await trigger.press('ArrowDown');
      await page.getByRole('listbox').waitFor();
      await page.keyboard.press('Enter');
      await expect(trigger).toContainText('Cairo');
      await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    });

    test('combobox: filtered keyboard selection', async ({ page }) => {
      await openDocs(page, 'components/combobox', { framework });
      const field = page.getByRole('combobox', {
        name: 'Country',
        exact: true,
      });
      await field.fill('United States');
      await page.getByRole('option', { name: 'United States' }).waitFor();
      await field.press('ArrowDown');
      await field.press('Enter');
      await expect(field).toHaveValue('United States');
      await expect(field).toHaveAttribute('aria-expanded', 'false');
    });

    test('tabs: arrow keys skip disabled tabs', async ({ page }) => {
      await openDocs(page, 'components/tabs', { framework });
      const tabs = page.getByRole('tablist', { name: 'Order' });
      await tabs
        .getByRole('tab', { name: 'Details', exact: true })
        .press('ArrowRight');
      await expect(
        tabs.getByRole('tab', { name: 'History', exact: true }),
      ).toHaveAttribute('aria-selected', 'true');
      await expect(
        tabs.getByRole('tab', { name: 'Invoice', exact: true }),
      ).toBeDisabled();
    });

    test('dialog: traps focus and Escape restores the opener', async ({
      page,
    }) => {
      await openDocs(page, 'components/dialog', { framework });
      const opener = page.getByRole('button', {
        name: 'Edit address',
        exact: true,
      });
      // Keyboard, not click: Safari does not focus a button on click, so there would be nothing to restore.
      await opener.focus();
      await opener.press('Enter');
      const dialog = page.getByRole('dialog', { name: 'Edit address' });
      await dialog.waitFor();
      await page.getByRole('textbox', { name: 'Street' }).focus();
      await page.keyboard.press('Tab');
      await expect(dialog.locator(':focus')).toHaveCount(1);
      await page.keyboard.press('Escape');
      await expect(dialog).toHaveCount(0);
      await expect(opener).toBeFocused();
    });

    test('alert dialog: Escape does not close it, its buttons do', async ({
      page,
    }) => {
      await openDocs(page, 'components/alert-dialog', { framework });
      await page
        .getByRole('button', { name: 'Delete file', exact: true })
        .click();
      const alert = page.getByRole('alertdialog');
      await alert.waitFor();
      await page.keyboard.press('Escape');
      await expect(alert).toBeVisible();
      await alert
        .getByRole('button', { name: /Cancel|Keep/ })
        .first()
        .click();
      await expect(alert).toHaveCount(0);
    });

    test('menu: arrow keys reach disabled items too, Escape restores the trigger', async ({
      page,
    }) => {
      await openDocs(page, 'components/menu', { framework });
      const trigger = page.getByRole('button', {
        name: 'Actions',
        exact: true,
      });
      await trigger.press('ArrowDown');
      const menu = page.getByRole('menu');
      await expect(menu.getByRole('menuitem', { name: 'Edit' })).toBeFocused();
      await page.keyboard.press('ArrowDown');
      await page.keyboard.press('ArrowDown');
      // Disabled items stay in the arrow-key order (WAI-ARIA menu pattern) and say so.
      const archive = menu.getByRole('menuitem', { name: 'Archive' });
      await expect(archive).toBeFocused();
      await expect(archive).toHaveAttribute('aria-disabled', 'true');
      await page.keyboard.press('Enter');
      await expect(archive).toBeVisible();
      await page.keyboard.press('ArrowDown');
      await expect(
        menu.getByRole('menuitem', { name: 'Delete' }),
      ).toBeFocused();
      await page.keyboard.press('Escape');
      await expect(menu).toHaveCount(0);
      await expect(trigger).toBeFocused();
    });

    test('slider: arrow keys step the value', async ({ page }) => {
      await openDocs(page, 'components/slider', { framework });
      const slider = page.getByRole('slider', { name: 'Price limit' });
      const before = Number(await slider.inputValue());
      await slider.press('ArrowRight');
      await expect(slider).toHaveValue(String(before + 50));
      await slider.press('End');
      await expect(slider).toHaveValue('2000');
    });

    test('tree: arrow keys move, expand and select', async ({ page }) => {
      await openDocs(page, 'components/tree', { framework });
      const tree = page.getByRole('tree', { name: 'Menu', exact: true });
      const mains = tree.getByRole('treeitem', { name: 'Mains' });
      await mains.focus();
      await expect(mains).toHaveAttribute('aria-expanded', 'true');
      await page.keyboard.press('ArrowLeft');
      await expect(mains).toHaveAttribute('aria-expanded', 'false');
      await page.keyboard.press('ArrowRight');
      await expect(mains).toHaveAttribute('aria-expanded', 'true');
      await page.keyboard.press('ArrowDown');
      await expect(tree.getByRole('treeitem', { name: 'Grill' })).toBeFocused();
      await page.keyboard.press('Enter');
      await expect(
        page.getByRole('status').filter({ hasText: 'Selected:' }),
      ).toContainText('grill');
    });

    test('accordion: Up, Down, Home and End move between headings', async ({
      page,
    }) => {
      await openDocs(page, 'components/accordion', { framework });
      const heads = page.locator('main summary');
      await heads.first().focus();
      await page.keyboard.press('ArrowDown');
      await expect(heads.nth(1)).toBeFocused();
      await page.keyboard.press('ArrowUp');
      await expect(heads.first()).toBeFocused();
      await page.keyboard.press('End');
      await expect(heads.nth(2)).toBeFocused();
      await page.keyboard.press('Home');
      await expect(heads.first()).toBeFocused();
    });

    test('toolbar: arrows, Home and End move focus', async ({ page }) => {
      await openDocs(page, 'components/toolbar', { framework });
      const bar = page.getByRole('toolbar', { name: 'Note' });
      const undo = bar.getByRole('button', { name: 'Undo' });
      await undo.focus();
      await page.keyboard.press('ArrowRight');
      await expect(bar.getByRole('button', { name: 'Redo' })).toBeFocused();
      await page.keyboard.press('Home');
      await expect(undo).toBeFocused();
      await page.keyboard.press('End');
      await expect(undo).not.toBeFocused();
      await expect(bar.locator(':focus')).toHaveCount(1);
    });

    test('number field: arrows, Page keys, Home and End', async ({ page }) => {
      await openDocs(page, 'components/number-field', { framework });
      const field = page.getByRole('spinbutton', { name: 'Guests' }).first();
      await field.press('Home');
      await expect(field).toHaveValue('1');
      await field.press('ArrowUp');
      await expect(field).toHaveValue('2');
      await field.press('PageUp');
      await expect(field).toHaveValue('12');
      await field.press('End');
      await expect(field).toHaveValue('12');
    });

    test('chip input: Enter adds, Backspace reaches the last tag', async ({
      page,
    }) => {
      await openDocs(page, 'components/chip-input', { framework });
      const field = page.getByRole('textbox', { name: 'Toppings' }).first();
      await field.fill('Olives');
      await field.press('Enter');
      const remove = page.getByRole('button', { name: /Remove.*Olives/ });
      await expect(remove).toHaveCount(1);
      await expect(field).toHaveValue('');
      await field.press('Backspace');
      await expect(remove).toBeFocused();
      await page.keyboard.press('Enter');
      await expect(remove).toHaveCount(0);
    });

    test('calendar: arrows move by day and week', async ({ page }) => {
      await openDocs(page, 'components/calendar', { framework });
      const grid = page.getByRole('grid').first();
      await grid.locator('[tabindex="0"]').first().focus();
      const name = () =>
        page.evaluate(
          () =>
            document.activeElement?.getAttribute('aria-label') ??
            document.activeElement?.textContent?.trim(),
        );
      const start = await name();
      await page.keyboard.press('ArrowDown');
      await expect.poll(name).not.toBe(start);
      await page.keyboard.press('ArrowUp');
      await expect.poll(name).toBe(start);
      await page.keyboard.press('PageDown');
      await expect.poll(name).not.toBe(start);
    });

    test('popover: Escape closes and restores the button', async ({ page }) => {
      await openDocs(page, 'components/popover', { framework });
      const button = page.getByRole('button', {
        name: 'Delivery fee',
        exact: true,
      });
      await button.focus();
      await page.keyboard.press('Enter');
      const panel = page.getByRole('dialog');
      await panel.waitFor();
      await page.keyboard.press('Escape');
      await expect(panel).toHaveCount(0);
      await expect(button).toBeFocused();
    });

    test('command palette: Ctrl+K opens, Escape closes', async ({ page }) => {
      await openDocs(page, 'components/command-palette', { framework });
      await page.locator('main h1').click();
      await page.keyboard.press('Control+k');
      const palette = page.getByRole('dialog');
      await palette.waitFor();
      await page.keyboard.press('Escape');
      await expect(palette).toHaveCount(0);
    });

    test('search field: Enter searches, Escape clears', async ({ page }) => {
      await openDocs(page, 'components/search-field', { framework });
      const field = page.getByRole('searchbox', { name: 'Search orders' });
      await field.fill('Hatem');
      await field.press('Enter');
      await expect(page.getByText('Searched for “Hatem”')).toBeVisible();
      await field.press('Escape');
      await expect(field).toHaveValue('');
    });

    test('date picker: Alt+Down opens the calendar', async ({ page }) => {
      await openDocs(page, 'components/date-picker', { framework });
      const field = page
        .locator('.ui-field', { hasText: 'Delivery day' })
        .first()
        .locator('input, [role="spinbutton"]')
        .first();
      await field.focus();
      await page.keyboard.press('Alt+ArrowDown');
      const calendar = page.getByRole('dialog');
      await calendar.waitFor();
      await page.keyboard.press('Escape');
      await expect(calendar).toHaveCount(0);
    });

    test('right to left: the arrow keys flip in tabs, toolbar and calendar', async ({
      page,
    }) => {
      await openDocs(page, 'components/tabs', { framework });
      const tabs = page.getByRole('tablist', { name: 'الطلب ١٠٤٢' });
      await tabs.getByRole('tab', { name: 'التفاصيل' }).press('ArrowLeft');
      await expect(tabs.getByRole('tab', { name: 'السجل' })).toHaveAttribute(
        'aria-selected',
        'true',
      );

      await openDocs(page, 'components/toolbar', { framework });
      const bar = page.getByRole('toolbar', { name: 'الطلب' });
      await bar.getByRole('button', { name: 'طباعة' }).focus();
      await page.keyboard.press('ArrowLeft');
      await expect(bar.getByRole('button', { name: 'استرداد' })).toBeFocused();
      await page.keyboard.press('ArrowRight');
      await expect(bar.getByRole('button', { name: 'طباعة' })).toBeFocused();

      await openDocs(page, 'components/calendar', { framework });
      const grid = page.locator('[dir="rtl"] [role="grid"]').first();
      await grid.locator('[tabindex="0"]').first().focus();
      const day = () =>
        page.evaluate(() => document.activeElement?.getAttribute('data-date'));
      const start = (await day())!;
      await page.keyboard.press('ArrowLeft');
      const next = new Date(`${start}T00:00:00Z`);
      next.setUTCDate(next.getUTCDate() + 1);
      await expect.poll(day).toBe(next.toISOString().slice(0, 10));
    });

    test('select: typing a letter jumps to the option', async ({ page }) => {
      await openDocs(page, 'components/select', { framework });
      const trigger = page.getByRole('button', { name: /City/ }).first();
      await trigger.press('ArrowDown');
      await page.getByRole('listbox').waitFor();
      await page.keyboard.press('g');
      // Typeahead waits a moment for more letters before it moves.
      await expect(page.getByRole('option', { name: 'Giza' })).toBeFocused();
      await page.keyboard.press('Enter');
      await expect(trigger).toContainText('Giza');
    });

    test('tree: typing a name jumps to it', async ({ page }) => {
      await openDocs(page, 'components/tree', { framework });
      const tree = page.getByRole('tree', { name: 'Menu', exact: true });
      await tree.getByRole('treeitem', { name: 'Mains' }).focus();
      await page.keyboard.press('d');
      await expect(
        tree.getByRole('treeitem', { name: 'Drinks' }),
      ).toBeFocused();
    });

    test('phone field: arrows open the countries, Escape closes them', async ({
      page,
    }) => {
      await openDocs(page, 'components/phone-field', { framework });
      const country = page
        .getByRole('button', { name: /^Country code/ })
        .first();
      await country.press('ArrowDown');
      const list = page.getByRole('listbox');
      await list.waitFor();
      await page.keyboard.press('Escape');
      await expect(list).toHaveCount(0);
      await expect(country).toBeFocused();
    });

    test('code input: typing moves on, Backspace goes back, a whole code fills every box', async ({
      page,
    }) => {
      await openDocs(page, 'components/pin-input', { framework });
      const box = (n: number) =>
        page
          .getByRole('textbox', { name: new RegExp(`^Digit ${n} of`) })
          .first();
      await box(1).focus();
      await page.keyboard.press('4');
      await expect(box(2)).toBeFocused();
      await page.keyboard.press('Backspace');
      await expect(box(1)).toBeFocused();
      // A phone's one-time-code autofill puts the whole code in one box.
      await box(1).fill('123456');
      await expect(box(6)).toHaveValue('6');
    });

    test('language switcher: the menu opens and Escape restores the button', async ({
      page,
    }) => {
      await openDocs(page, 'components/language-switcher', { framework });
      const button = page
        .getByRole('button', { name: 'Language: English' })
        .first();
      await button.press('Enter');
      const menu = page.getByRole('menu');
      await menu.waitFor();
      await page.keyboard.press('Escape');
      await expect(menu).toHaveCount(0);
      await expect(button).toBeFocused();
    });

    test('app shell: Escape closes the side bar', async ({ page }) => {
      await openDocs(page, 'components/app-shell', { framework });
      const menu = page
        .getByRole('button', { name: 'Menu', exact: true })
        .first();
      await menu.press('Enter');
      await expect(menu).toHaveAttribute('aria-expanded', 'true');
      await page.keyboard.press('Escape');
      await expect(menu).toHaveAttribute('aria-expanded', 'false');
    });

    test('context menu: Shift+F10 opens it on the focused item', async ({
      page,
      browserName,
    }) => {
      // Only Chromium turns a scripted Shift+F10 into a contextmenu event; macOS has no such key.
      test.skip(
        browserName !== 'chromium',
        'Shift+F10 is not synthesized here',
      );
      await openDocs(page, 'components/context-menu', { framework });
      await page.getByText('invoice-1042.pdf').first().focus();
      await page.keyboard.press('Shift+F10');
      const menu = page.getByRole('menu');
      await menu.waitFor();
      await page.keyboard.press('Escape');
      await expect(menu).toHaveCount(0);
    });
  });
}

test('theme builder: preview updates and exports CSS', async ({ page }) => {
  await openDocs(page, 'foundations/theme');
  const input = page.getByRole('textbox', { name: 'Or type a hex' });
  const css = page.locator('.doc-code pre code');
  const original = await css.textContent();

  await input.fill('not-a-colour');
  await expect(input).toHaveAttribute('aria-invalid', 'true');
  await expect(css).toHaveText(original ?? '');

  await input.fill('#0f766e');
  await expect(css).not.toHaveText(original ?? '');
  const download = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download theme.css' }).click();
  const file = await download;
  expect(file.suggestedFilename()).toBe('lamsa-theme.css');
  expect(await readFile(await file.path(), 'utf8')).toBe(
    await css.textContent(),
  );
});

test('home hero: drag turns the floor, a tap sends a ripple', async ({
  page,
}) => {
  // Playwright runs with reduced motion on; this test needs it off first.
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await openDocs(page, '');
  await expect(
    page.getByRole('heading', { name: /Playground|Change anything/ }),
  ).toHaveCount(0);
  const stage = page.locator('.doc-ripple__stage');
  const box = (await stage.boundingBox())!;
  await page.mouse.click(box.x + box.width * 0.3, box.y + box.height * 0.7);
  await expect(page.locator('.doc-ripple__wave')).toHaveCount(1);
  // The wave removes itself when it has run out.
  await expect(page.locator('.doc-ripple__wave')).toHaveCount(0);

  // A drag turns the floor freely.
  const world = page.locator('.doc-ripple__world');
  const before = await world.evaluate((el) =>
    el.style.getPropertyValue('--rz'),
  );
  await page.mouse.move(box.x + box.width * 0.2, box.y + box.height * 0.9);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width * 0.6, box.y + box.height * 0.6, {
    steps: 5,
  });
  await page.mouse.up();
  expect(
    await world.evaluate((el) => el.style.getPropertyValue('--rz')),
  ).not.toBe(before);

  // Reduced motion: the scene is still, and a touch sends nothing.
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.mouse.click(box.x + box.width * 0.5, box.y + box.height * 0.5);
  await expect(page.locator('.doc-ripple__wave')).toHaveCount(0);
});

test('home hero: a tap on a globe tile opens that component', async ({
  page,
}) => {
  // Events straight to the tile: Playwright's WebKit on Windows flattens 3D. Safari itself draws it.
  await openDocs(page, '');
  const tile = page.locator('.doc-globe__tile').first();
  const path = (await tile.getAttribute('data-path'))!;
  await tile.dispatchEvent('pointerdown', { button: 0 });
  await tile.dispatchEvent('pointerup', { button: 0 });
  await expect(page).toHaveURL(new RegExp(`${path}$`));
});
