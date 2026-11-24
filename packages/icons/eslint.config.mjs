import baseConfig from '../../eslint.config.mjs';

export default [
  ...baseConfig,
  { ignores: ['src/data.ts', 'src/tags.ts'] },
];
