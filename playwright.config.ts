import { defineConfig, devices } from '@playwright/test'

export const setupDir = 'playwright/.setup'
export const setupFile = `${setupDir}/user.json`

export default defineConfig({
  projects: [
    // Setup project
    { name: 'setup', testDir: './test-setup/', testMatch: '*' },
    // Chromium project
    {
      name: 'chromium',
      testDir: './tests/',
      use: {
        ...devices['Desktop Chrome'],
        // Use "database" with existing accounts
        storageState: setupFile,
      },
      dependencies: ['setup'],
    },
    // Mobile Chrome project
    {
      name: 'mobile chrome',
      use: { ...devices['Pixel 7'] },
      dependencies: ['setup'],
    },
    // Tablet project
    {
      name: 'tablet',
      use: { ...devices['iPad (gen 7)'] },
      dependencies: ['setup'],
    },
  ],
})
