const nextConfig = require('eslint-config-next');

module.exports = [
  {
    files: ['src/**/*.{ts,tsx}'],
    extends: ['next/core-web-vitals', 'next/typescript'],
    rules: {
      'react/no-unescaped-entities': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@next/next/no-html-link-for-pages': 'error',
    },
  },
];
