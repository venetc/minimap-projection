// eslint.config.mjs
import antfu from '@antfu/eslint-config';

export default antfu({
  jsonc: false,
  rules: {
    'no-console': 'off',
    'style/semi': ['warn', 'always'],
    'antfu/if-newline': 'off',
    'antfu/top-level-function': 'off',
    'no-sequences': 'off',
  },
});
