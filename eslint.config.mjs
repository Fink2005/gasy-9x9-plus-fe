import antfu from '@antfu/eslint-config';
import nextPlugin from '@next/eslint-plugin-next';
import jestDom from 'eslint-plugin-jest-dom';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import playwright from 'eslint-plugin-playwright';
import testingLibrary from 'eslint-plugin-testing-library';

export default antfu(
  {
    react: true,
    typescript: true,

    // Configuration preferences
    lessOpinionated: true,
    isInEditor: false,

    // Code style

    stylistic: {
      semi: true,
    },

    // Format settings
    formatters: {
      css: true,
    },

    // Ignored paths
    ignores: [
      'migrations/**/*',
    ],
  },
  // --- Next.js Specific Rules ---
  {
    plugins: {
      '@next/next': nextPlugin,
    },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs['core-web-vitals'].rules,
    },
  },
  // --- Accessibility Rules ---
  jsxA11y.flatConfigs.recommended,
  // --- Testing Rules ---
  {
    files: [
      '**/*.test.ts?(x)',
    ],
    ...testingLibrary.configs['flat/react'],
    ...jestDom.configs['flat/recommended'],
  },
  // --- E2E Testing Rules ---
  {
    files: [
      '**/*.spec.ts',
      '**/*.e2e.ts',
    ],
    ...playwright.configs['flat/recommended'],
  },
  // --- Custom Rule Overrides ---
  {
    rules: {
      'antfu/no-top-level-await': 'off', // Allow top-level await
      'style/brace-style': ['error', '1tbs'], // Use the default brace style
      'react/prefer-destructuring-assignment': 'off', // Vscode doesn't support automatically destructuring, it's a pain to add a new variable
      'node/prefer-global/process': 'off', // Allow using `process.env`
      'test/padding-around-all': 'error', // Add padding in test files
      'test/prefer-lowercase-title': 'off', // Allow using uppercase titles in test titles
      'array-bracket-spacing': 1,
      'style/multiline-ternary': 0, // Allow multiline ternary operators
      'no-lonely-if': 1,
      'prefer-const': 'warn',
      'jsonc/object-curly-spacing': 'off',
      'operator-linebreak': 'off',
      'react-web-api/no-leaked-timeout': 'off',
      'no-unused-vars': 1,
      'perfectionist/sort-imports': 'off',
      'no-constant-condition': 0,
      'react-refresh/only-export-components': 'off',
      'style/comma-dangle': 'off',
      'format/prettier': 'off',
      'ts/consistent-type-definitions': 'off',
      'react-hooks-extra/no-direct-set-state-in-use-effect': 'off', // Allow direct setState in useEffect

    },
  },
);
