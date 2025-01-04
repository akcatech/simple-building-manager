// eslint.config.js

const eslintRecommended = require('eslint:recommended')
const reactRecommended = require('plugin:react/recommended')
const typescriptRecommended = require('plugin:@typescript-eslint/recommended')
const prettierRecommended = require('plugin:prettier/recommended')

module.exports = [
  {
    files: ['**/*.js', '**/*.jsx', '**/*.ts', '**/*.tsx'],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
      ecmaFeatures: {
        jsx: true
      },
      parser: '@typescript-eslint/parser',
      globals: {
        React: 'writable'
      }
    },
    rules: {
      'prettier/prettier': 'error',
      'react/react-in-jsx-scope': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off'
    }
  },

  eslintRecommended,
  reactRecommended,
  typescriptRecommended,
  prettierRecommended
]
