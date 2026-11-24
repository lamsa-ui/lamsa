import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { expect, type Page } from '@playwright/test';

export type Theme = 'light' | 'dark';
export type Framework = 'angular' | 'react' | 'vue' | 'html';

/** Every route of the docs site, read from the router, so a new page is tested without editing the specs. */
export const ROUTES = [
  ...readFileSync(join(__dirname, '../src/app/app.routes.ts'), 'utf8').matchAll(
    /path: '([^'*]*)'/g,
  ),
].map(([, p]) => p);

/** Opens a docs page with the theme and framework picked, and waits for its heading. */
export async function openDocs(
  page: Page,
  route: string,
  {
    theme = 'light',
    framework = 'angular',
  }: { theme?: Theme; framework?: Framework } = {},
): Promise<void> {
  await page.addInitScript(
    ([t, f]) => {
      localStorage.setItem('lamsa:theme', t);
      localStorage.setItem('lamsa:framework', f);
    },
    [theme, framework],
  );
  await page.goto(route);
  await expect(page.locator('main h1')).toBeVisible();
}
