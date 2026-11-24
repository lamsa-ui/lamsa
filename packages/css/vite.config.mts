import { defineConfig } from 'vite';

export default defineConfig({
  root: import.meta.dirname,
  cacheDir: '../../node_modules/.vite/packages/css',
  test: {
    name: 'css',
    watch: false,
    environment: 'node',
    include: ['*.spec.ts'],
  },
});
