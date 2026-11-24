import nx from '@nx/eslint-plugin';
import baseConfig from '../../eslint.config.mjs';

export default [
  ...nx.configs['flat/react'],
  ...baseConfig,
  {
    files: ['**/*.json'],
    rules: {
      '@nx/dependency-checks': [
        'error',
        {
          ignoredFiles: [
            '{projectRoot}/eslint.config.{js,cjs,mjs,ts,cts,mts}',
            '{projectRoot}/vite.config.{js,ts,mjs,mts}',
            '{projectRoot}/src/**/*.spec.{ts,tsx}',
            '{projectRoot}/src/test-setup.ts',
          ],
          // css: styles only, the components use its class names, not its code.
          // react-dom: needed by React Aria at run time, never imported here.
          ignoredDependencies: ['@lamsa-ui/css', 'react-dom'],
        },
      ],
    },
    languageOptions: {
      parser: await import('jsonc-eslint-parser'),
    },
  },
  {
    files: ['**/*.spec.tsx'],
    rules: { '@typescript-eslint/no-non-null-assertion': 'off' },
  },
];
