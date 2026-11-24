import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig({
  root: import.meta.dirname,
  cacheDir: '../../node_modules/.vite/packages/react',
  plugins: [react()],
  resolve: {
    // Tests read the icons package from source, as tsconfig.base.json does.
    alias: {
      '@lamsa-ui/icons': resolve(import.meta.dirname, '../icons/src/index.ts'),
    },
  },
  test: {
    name: 'react',
    watch: false,
    globals: true,
    environment: 'jsdom',
    include: ['src/**/*.spec.{ts,tsx}'],
    setupFiles: ['src/test-setup.ts'],
    coverage: {
      reportsDirectory: '../../coverage/packages/react',
      provider: 'v8' as const,
    },
  },
});
