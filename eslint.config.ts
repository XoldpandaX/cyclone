import antfu from '@antfu/eslint-config'
import prettier from 'eslint-config-prettier'

export default antfu(
  {
    react: true,
    typescript: true,
    stylistic: false,
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    rules: {
      'prefer-const': 'error',
      'no-var': 'error',
      'react-hooks/exhaustive-deps': 'error',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
  },
  prettier,
)
