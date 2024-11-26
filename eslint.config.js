import pluginJs from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import prettier from 'eslint-config-prettier';
import pluginPrettier from 'eslint-plugin-prettier';
import pluginReact from 'eslint-plugin-react';
import globals from 'globals';

export default [
  {
    files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
      },
      globals: {
        ...globals.browser,
        React: 'readonly',
      },
    },
    settings: {
      react: {
        version: 'detect', // Automatically detect the React version
      },
    },
    plugins: {
      react: pluginReact,
      prettier: pluginPrettier,
      '@typescript-eslint': tseslint,
    },
    rules: {
      'prettier/prettier': 'error',
      ...pluginJs.configs.recommended.rules,
      ...tseslint.configs['recommended'].rules,
      ...prettier.rules,
    },
  },
];
