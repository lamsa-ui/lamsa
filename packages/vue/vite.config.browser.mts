// The same specs in real Chromium, where jsdom cannot tell: focus, layout, overlays, typing.
import { playwright } from '@vitest/browser-playwright';
import { defineConfig, mergeConfig } from 'vite';
import base from './vite.config.mts';

export default mergeConfig(
  base,
  defineConfig({
    test: {
      browser: {
        enabled: true,
        headless: true,
        provider: playwright(),
        instances: [{ browser: 'chromium' }],
      },
    },
  }),
);
