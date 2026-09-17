import { defineConfig } from "@playwright/test";

// Dedicated test server: fixture media enabled, separate port and output so a regular
// `npm run dev` server on 8080 (and its _site) is never reused by the tests.
const port = Number(process.env.PLAYWRIGHT_PORT || 8091);
const baseURL =
  process.env.PLAYWRIGHT_BASE_URL || `http://127.0.0.1:${port}`;

export default defineConfig({
  testDir: "tests",
  use: {
    baseURL
  },
  reporter: [["list"]],
  webServer: {
    command: "npm run dev:test",
    port,
    reuseExistingServer: !process.env.CI,
    timeout: 120000
  }
});
