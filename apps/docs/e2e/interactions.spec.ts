// Keyboard and pointer behaviour of the components on their docs pages (Angular view).
// Runs in Chromium, Firefox and WebKit.
import { readFile } from 'node:fs/promises';
import { expect, test } from '@playwright/test';
import { openDocs } from './docs';

test('select: keyboard selection', async ({ page }) => {
  await openDocs(page, 'components/select');
  const trigger = page.getByRole('button', { name: /City/ }).first();
  await trigger.press('ArrowDown');
  await page.getByRole('listbox').waitFor();
  await page.keyboard.press('Enter');
  await expect(trigger).toContainText('Cairo');
  await expect(trigger).toHaveAttribute('aria-expanded', 'false');
});

test('combobox: filtered keyboard selection', async ({ page }) => {
  await openDocs(page, 'components/combobox');
  const field = page.getByRole('combobox', { name: 'Country', exact: true });
  await field.fill('United States');
  await page.getByRole('option', { name: 'United States' }).waitFor();
  await field.press('ArrowDown');
  await field.press('Enter');
  await expect(field).toHaveValue('United States');
  await expect(field).toHaveAttribute('aria-expanded', 'false');
});

test('tabs: arrow keys skip disabled tabs', async ({ page }) => {
  await openDocs(page, 'components/tabs');
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

test('dialog: traps focus and Escape restores the opener', async ({ page }) => {
  await openDocs(page, 'components/dialog');
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
  await openDocs(page, 'components/alert-dialog');
  await page.getByRole('button', { name: 'Delete file', exact: true }).click();
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
  await openDocs(page, 'components/menu');
  const trigger = page.getByRole('button', { name: 'Actions', exact: true });
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
  await expect(menu.getByRole('menuitem', { name: 'Delete' })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(menu).toHaveCount(0);
  await expect(trigger).toBeFocused();
});

test('slider: arrow keys step the value', async ({ page }) => {
  await openDocs(page, 'components/slider');
  const slider = page.getByRole('slider', { name: 'Price limit' });
  const before = Number(await slider.inputValue());
  await slider.press('ArrowRight');
  await expect(slider).toHaveValue(String(before + 50));
  await slider.press('End');
  await expect(slider).toHaveValue('2000');
});

test('tree: arrow keys move, expand and select', async ({ page }) => {
  await openDocs(page, 'components/tree');
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

test('home hero: press and hold raises the pins, a tap lets them down', async ({
  page,
}) => {
  // Reduced motion (the default here): pressed pins jump up at once and stay.
  // Events straight to a pin: Playwright's WebKit on Windows flattens 3D. Safari itself draws it.
  await openDocs(page, '');
  const pin = page.locator('.doc-pins__pin').nth(40);
  const height = () =>
    pin.evaluate((el) => Number(el.style.getPropertyValue('--h')));
  await pin.dispatchEvent('pointerdown', { button: 0 });
  await expect.poll(height).toBeGreaterThan(0.4);
  await page.waitForTimeout(300);
  await pin.dispatchEvent('pointerup', { button: 0 });
  await expect.poll(height).toBeGreaterThan(0.4);
  await pin.dispatchEvent('pointerdown', { button: 0 });
  await pin.dispatchEvent('pointerup', { button: 0 });
  await expect.poll(height).toBeLessThan(0.1);
});
