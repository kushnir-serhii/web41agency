import { FlatCompat } from '@eslint/eslintrc';
import prettierConfig from 'eslint-config-prettier';
import prettierPlugin from 'eslint-plugin-prettier';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const compat = new FlatCompat({ baseDirectory: __dirname });

const eslintConfig = [
  { ignores: ['.next/**', 'node_modules/**', 'next-env.d.ts', 'tools/**'] },

  // Extend Next.js recommended rules
  ...compat.extends('next/core-web-vitals', 'next/typescript'),

  // Turn off core rules that conflict with Prettier
  prettierConfig,

  // Prettier integration
  {
    plugins: { prettier: prettierPlugin },
    rules: { 'prettier/prettier': 'error' },
  },

  // Simple import sort
  {
    plugins: { 'simple-import-sort': simpleImportSort },
    rules: {
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
    },
  },

  // Locale-aware navigation: ban raw next/link and next/navigation routing hooks
  {
    // Brace globs (*.{ts,tsx}) crash the bundled minimatch here, so list extensions explicitly.
    files: [
      'src/components/**/*.ts',
      'src/components/**/*.tsx',
      'src/app/[[]locale[]]/**/*.ts',
      'src/app/[[]locale[]]/**/*.tsx',
    ],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: [
            { name: 'next/link', message: 'Use Link from @/i18n/navigation' },
            {
              name: 'next/navigation',
              importNames: ['usePathname', 'useRouter', 'redirect'],
              message: 'Use @/i18n/navigation',
            },
          ],
        },
      ],
    },
  },

  // Custom TS/React rules
  {
    rules: {
      'react/react-in-jsx-scope': 'off',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'no-console': 'warn',
    },
  },
];

export default eslintConfig;
