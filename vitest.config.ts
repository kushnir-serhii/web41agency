import path from 'node:path';

import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      'server-only': path.resolve(
        __dirname,
        'node_modules/next/dist/compiled/server-only/empty.js',
      ),
    },
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
    exclude: ['tests/e2e/**', 'node_modules/**'],
  },
});
