const reactPlugin = require('eslint-plugin-react');
const prettierPlugin = require('eslint-plugin-prettier');
const jsxA11yPlugin = require('eslint-plugin-jsx-a11y');

module.exports = {
  languageOptions: {
    sourceType: 'module',
    parserOptions: {
      ecmaFeatures: {
        jsx: true,
      },
    },
    globals: {
      window: 'readonly',
      document: 'readonly',
    },
  },
  plugins: {
    react: reactPlugin,
    prettier: prettierPlugin,
    'jsx-a11y': jsxA11yPlugin,
  },
  ignores: ['node_modules/', 'dist/', 'webpack.config.js/', 'build/'],
  rules: {
    'no-unused-vars': 'warn',
    'react/jsx-props-no-spreading': 'off',
    'react/react-in-jsx-scope': 'off',
    'no-alert': 'off',
    'react/require-default-props': 'off',
    'react/jsx-filename-extension': [
      1,
      {
        extensions: ['.js', '.jsx'],
      },
    ],
    'react/jsx-one-expression-per-line': [0],
    'no-console': 'off',
    'comma-dangle': ['error'],
    'no-debugger': 1,
    'linebreak-style': 0,
    'max-len': [1, 600, 2],
    'no-plusplus': [
      2,
      {
        allowForLoopAfterthoughts: true,
      },
    ],
    'jsx-a11y/label-has-associated-control': [
      'error',
      {
        assert: 'either',
        depth: 3,
      },
    ],
  },
};
