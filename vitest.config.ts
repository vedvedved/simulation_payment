// vitest.config.ts
import { defineConfig } from 'vitest/config';
import solid from 'vite-plugin-solid';

export default defineConfig({
  plugins: [solid()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['test/setupTests.ts'],
    include: ['src/**/*.{test,spec}.{ts,tsx}']
  }
});
