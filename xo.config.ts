const config = [
  {
    // ignores: ['xo.config.ts', 'vite.config.ts'],
  },
  {
    space: true,
    prettier: true,
    parserOptions: {
      project: './tsconfig.xo.json',
    },
    rules: {
      '@typescript-eslint/consistent-type-definitions': 'off',
      '@typescript-eslint/naming-convention': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {argsIgnorePattern: 'next|props'},
      ],
      'capitalized-comments': 'off',
      'import-x/extensions': 'off',
      'no-warning-comments': 'off',
      'unicorn/no-array-reduce': 'off',
      'no-console': 'error',
      'react/jsx-key': 'off',
      'react/no-unknown-property': 'off',
      'react/react-in-jsx-scope': 'off',
      'unicorn/prevent-abbreviations': 'off',
    },
  },
  {
    files: ['src/client/**/*.ts', 'src/client/**/*.tsx'],
    rules: {
      'import-x/no-unassigned-import': 'off',
    },
  },
];

export default config;
