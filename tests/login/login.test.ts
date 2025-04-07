import { test, expect } from '@playwright/test'
import { existingUsers } from '../../test-setup/localstorage.setup'

test.describe.configure({ mode: 'serial' })

const existingUser = existingUsers[0]
const BASE_URL = 'http://localhost:8080'
const LOGIN_URL = `${BASE_URL}/login`

test.describe('login form tests', () => {
  test.beforeEach(async ({ page }) => {
    // Go to the login page
    await page.goto(LOGIN_URL)
  })

  test('should be able to log in using existing account', async ({ page }) => {
    // E-mail input
    await page.getByLabel('Email').pressSequentially(existingUser.email)

    // Password input
    await page
      .getByLabel('Password', { exact: true })
      .pressSequentially(existingUser.password)

    // Click submit button
    await page.getByRole('button', { name: 'LOGIN' }).click()

    // Wait for page to load
    await page.waitForURL(BASE_URL)

    // Expect to see the 'Log out' button
    await expect(page.getByText('Log out')).toBeVisible()
  })

  test('should see an error message when entering an invalid password', async ({
    page,
  }) => {
    // E-mail input
    await page.getByLabel('Email').pressSequentially(existingUser.email)

    // Password input, using invalid password
    await page
      .getByLabel('Password', { exact: true })
      .pressSequentially('wrong_password')

    // Click submit button
    await page.getByRole('button', { name: 'LOGIN' }).click()

    // Expect to see error message 'Invalid credentials'
    await expect(page.getByText('Invalid credentials')).toBeVisible()
  })

  test('should not be able to click the submit button without entering an email', async ({
    page,
  }) => {
    // E-mail input, clear input
    await page.getByLabel('Email').clear()

    // Password input
    await page
      .getByLabel('Password', { exact: true })
      .pressSequentially(existingUser.password)

    // Expect submit button to be disabled
    await expect(page.getByRole('button', { name: 'LOGIN' })).toBeDisabled()
  })

  test('should not be able to click the submit button when entering an invalid email format', async ({
    page,
  }) => {
    // E-mail input, using e-mail without @
    await page.getByLabel('Email').pressSequentially('test1mail.com')

    // Password input
    await page
      .getByLabel('Password', { exact: true })
      .pressSequentially(existingUser.password)

    // Expect submit button to be disabled
    await expect(page.getByRole('button', { name: 'LOGIN' })).toBeDisabled()
  })

  test('should not be able to click the submit button without entering a password', async ({
    page,
  }) => {
    // E-mail input
    await page.getByLabel('Email').pressSequentially(existingUser.email)

    // Password , clear input
    await page.getByLabel('Password', { exact: true }).clear()

    // Expect submit button to be disabled
    await expect(page.getByRole('button', { name: 'LOGIN' })).toBeDisabled()
  })

  test('should not be able to click the submit button when entering a password with fewer than 9 characters', async ({
    page,
  }) => {
    // E-mail input
    await page.getByLabel('Email').pressSequentially(existingUser.email)

    // Password input, using 8 character password
    await page
      .getByLabel('Password', { exact: true })
      .pressSequentially('12345678')

    // Expect submit button to be disabled
    await expect(page.getByRole('button', { name: 'LOGIN' })).toBeDisabled()
  })

  test('should be able to toggle visibility of entered password', async ({
    page,
  }) => {
    // Password input
    await page
      .getByLabel('Password', { exact: true })
      .pressSequentially(existingUser.password)

    // Expect password to be hidden
    await expect(page.getByLabel('Password', { exact: true })).toHaveAttribute(
      'type',
      'password',
    )

    // Toggle eye icon
    await page.getByLabel('toggle password visibility').click()

    // Expect password to be visible
    await expect(page.getByLabel('Password', { exact: true })).toHaveAttribute(
      'type',
      'text',
    )

    // Toggle back eye icon
    await page.getByLabel('toggle password visibility').click()

    // Expect password to be hidden
    await expect(page.getByLabel('Password', { exact: true })).toHaveAttribute(
      'type',
      'password',
    )
  })
})
