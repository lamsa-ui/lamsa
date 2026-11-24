import baseConfig from '../../eslint.config.mjs';

// The components are render functions in TypeScript, not templates, so the Vue template
// accessibility rules have nothing to read here: axe and the keyboard tests check what they render.
export default [
  ...baseConfig,
  {
    files: ['**/*.json'],
    rules: {
      '@nx/dependency-checks': [
        'error',
        {
          ignoredFiles: [
            '{projectRoot}/eslint.config.{js,cjs,mjs,ts,cts,mts}',
            '{projectRoot}/vite.config*.{js,ts,mjs,mts}',
            '{projectRoot}/src/**/*.spec.ts',
          ],
          ignoredDependencies: ['@ghazal-ui/css'],
        },
      ],
    },
    languageOptions: {
      parser: await import('jsonc-eslint-parser'),
    },
  },
  {
    files: ['**/*.spec.ts'],
    rules: { '@typescript-eslint/no-non-null-assertion': 'off' },
  },
];
