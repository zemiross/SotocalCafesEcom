// Playwright QA (brief §13): screenshots of every template in pt-PT and EN at six viewports, with and without
// reduced motion; homepage scroll checkpoints; axe-core. Runs against the LiquidJS-rendered /prototype.
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  outputDir: './qa/test-output',
  timeout: 120_000,
  fullyParallel: true,
  workers: process.env.CI ? 2 : 6,
  reporter: [['list'], ['json', { outputFile: 'qa/playwright-results.json' }]],
  use: {
    baseURL: 'http://localhost:4174',
    browserName: 'chromium',
    locale: 'pt-PT',
  },
  webServer: {
    command: 'node scripts/serve.mjs 4174',
    url: 'http://localhost:4174/',
    reuseExistingServer: true,
    timeout: 30_000,
  },
});
