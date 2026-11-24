import { resolve } from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig({
  root: import.meta.dirname,
  cacheDir: '../../node_modules/.vite/packages/vue',
  resolve: {
    // Tests read the icons package from source, as tsconfig.base.json does.
    alias: {
      '@ghazal-ui/icons': resolve(import.meta.dirname, '../icons/src/index.ts'),
    },
  },
  test: {
    name: 'vue',
    watch: false,
    globals: true,
    environment: 'jsdom',
    include: ['src/**/*.spec.ts'],
    coverage: {
      reportsDirectory: '../../coverage/packages/vue',
      provider: 'v8',
    },
  },
});
