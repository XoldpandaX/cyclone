import antfu from '@antfu/eslint-config'
import prettier from 'eslint-config-prettier'
import boundaries from 'eslint-plugin-boundaries'
import checkFile from 'eslint-plugin-check-file'

export default antfu(
  {
    react: true,
    typescript: true,
    stylistic: false,
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    rules: {
      'no-console': ['error', { allow: ['warn', 'error'] }],
      'prefer-const': 'error',
      'no-var': 'error',
      'react-hooks/exhaustive-deps': 'error',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/naming-convention': ['error', { selector: 'interface', format: ['PascalCase'], prefix: ['I'] }],
    },
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    plugins: { boundaries },
    settings: {
      'import/resolver': {
        typescript: { aliasTsConfigPath: './tsconfig.app.json' },
      },
      'boundaries/elements': [
        { type: 'app', pattern: 'src/app/**' },
        { type: 'features', pattern: 'src/features/*', capture: ['feature'] },
        { type: 'pages', pattern: 'src/pages/*', capture: ['page'] },
        { type: 'shared', pattern: 'src/shared/**' },
      ],
      'boundaries/ignore': ['src/main.tsx'],
    },
    rules: {
      'boundaries/dependencies': [
        'error',
        {
          default: 'disallow',
          rules: [
            { from: { type: 'app' }, allow: { to: { type: ['app', 'shared', 'pages'] } } },
            {
              from: { type: 'app' },
              allow: { to: { type: 'features', internalPath: 'index.{ts,tsx}' } },
            },
            { from: { type: 'pages' }, allow: { to: { type: ['shared', 'app'] } } },
            {
              from: { type: 'pages' },
              allow: { to: { type: 'features', internalPath: 'index.{ts,tsx}' } },
            },
            { from: { type: 'features' }, allow: { to: { type: 'shared' } } },
            { from: { type: 'shared' }, allow: { to: { type: 'shared' } } },
          ],
        },
      ],
    },
  },
  {
    files: ['src/**/*.{ts,tsx}'],
    ignores: ['src/vite-env.d.ts'],
    plugins: { 'check-file': checkFile },
    rules: {
      'check-file/filename-naming-convention': [
        'error',
        {
          'src/**/*.test.{ts,tsx}': 'KEBAB_CASE',
          'src/**/*.{ts,tsx}': 'KEBAB_CASE',
        },
        { ignoreMiddleExtensions: true },
      ],
    },
  },
  prettier,
)
