import { PlaywrightTestConfig, devices, defineConfig } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

// Read from default ".env" file.
dotenv.config();

// Alternatively, read from "../my.env" file.
dotenv.config({ path: path.resolve(__dirname, '..', '.env.dev') });

const baseUrl = process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://localhost:3000';
console.log(`ℹ️ Using base URL "${baseUrl}"`);

const opts = {
  // launch headless on CI, in browser locally
  headless: !!process.env.CI || !!process.env.PLAYWRIGHT_HEADLESS,
  // collectCoverage: !!process.env.PLAYWRIGHT_HEADLESS
};
const config: PlaywrightTestConfig = defineConfig({
  webServer: process.env.CI
    ? undefined
    : {
        command: `yarn dev`,
        url: baseUrl,
        timeout: 120 * 1000,
        reuseExistingServer: true,
      },
  projects: [
    // Setup project
    {
      name: 'setup',
      testMatch: /.*\.setup\.ts/,
      use: {
        ...devices['Desktop Chrome'],
        baseURL: baseUrl,
        headless: opts.headless,
        permissions: ['geolocation'],
        geolocation: { latitude: 50.8551729, longitude: 4.340312 },
      },
    },
    {
      testDir: './playwright',
      outputDir: './playwright/test-results',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: baseUrl,
        headless: opts.headless,
        video: 'on',
        permissions: ['geolocation'],
        geolocation: { latitude: 50.8551729, longitude: 4.340312 },
        storageState: './playwright/.auth/user.json',
      },
      dependencies: ['setup'],
    },
  ],
});

export default config;
