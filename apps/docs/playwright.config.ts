import { defineConfig, devices } from '@playwright/test';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

// Tests run against the production build (nx e2e docs builds it first), served under
// the same base path as GitHub Pages by tools/serve-docs.mjs.
const root = join(__dirname, '../..');
const index = join(root, 'dist/apps/docs/browser/index.html');
const base = existsSync(index)
  ? (readFileSync(index, 'utf8').match(/<base href="([^"]*)"/)?.[1] ?? '/')
  : '/';
const port = 4320;
const ci = !!process.env['CI'];

export default defineConfig({
  testDir: './e2e',
  outputDir: join(root, 'dist/.playwright/results'),
  // One baseline per screenshot for every platform; the tolerance in visual.spec.ts covers font rendering.
  snapshotPathTemplate: '{testDir}/__screenshots__/{arg}{ext}',
  fullyParallel: true,
  forbidOnly: ci,
  retries: ci ? 2 : 0,
  workers: ci ? 2 : undefined,
  reporter: ci
    ? [
        ['github'],
        [
          'html',
          {
            outputFolder: join(root, 'dist/.playwright/report'),
            open: 'never',
          },
        ],
      ]
    : [
        ['list'],
        [
          'html',
          {
            outputFolder: join(root, 'dist/.playwright/report'),
            open: 'never',
          },
        ],
      ],
  use: {
    baseURL: `http://localhost:${port}${base}`,
    viewport: { width: 1280, height: 800 },
    // Kit animations off: colours are measured at rest and screenshots are stable.
    reducedMotion: 'reduce',
    trace: 'on-first-retry',
  },
  webServer: {
    command: 'node tools/serve-docs.mjs',
    cwd: root,
    env: { PORT: String(port) },
    url: `http://localhost:${port}${base}`,
    reuseExistingServer: !ci,
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1280, height: 800 },
      },
    },
    // Keyboard and focus behaviour differs most between engines, so interactions run everywhere.
    {
      name: 'firefox',
      testMatch: /interactions/,
      use: {
        ...devices['Desktop Firefox'],
        viewport: { width: 1280, height: 800 },
      },
    },
    {
      name: 'webkit',
      testMatch: /interactions/,
      use: {
        ...devices['Desktop Safari'],
        viewport: { width: 1280, height: 800 },
      },
    },
  ],
});
