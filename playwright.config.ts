import { defineConfig } from "@playwright/test";

const port = Number(process.env.PLAYWRIGHT_PORT || 8080);
const baseURL =
  process.env.PLAYWRIGHT_BASE_URL || `http://127.0.0.1:${port}`;

export default defineConfig({
  testDir: "tests",
  use: {
    baseURL
  },
  reporter: [["list"]],
  webServer: {
    command: "npm run dev",
    port,
    reuseExistingServer: !process.env.CI,
    timeout: 120000
  }
});
