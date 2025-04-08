import { test, expect } from '@playwright/test'

test.describe.configure({ mode: 'serial' })

const BASE_URL = 'http://localhost:8080'
const SIGNUP_URL = `${BASE_URL}/signup`
const LOGIN_URL = `${BASE_URL}/login`

// Test case new user, email contains @ character and password contains more than 8 characters
const newUser = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'new_account@mail.com',
  password: 'new_password',
}

test.describe('signup form works and logging in is possible', () => {
  // Test the complete authentication flow: signup, logout, and login
  test('should be able to sign up using form, log out and then log in', async ({
    page,
  }) => {
    // Go to the signup page
    await page.goto(SIGNUP_URL)

    // Fill in fields
    await page
      .getByRole('textbox', { name: 'First name' })
      .fill(newUser.firstName)
    await page
      .getByRole('textbox', { name: 'Last name' })
      .fill(newUser.lastName)
    await page.getByRole('textbox', { name: 'Email' }).fill(newUser.email)
    await page.getByRole('textbox', { name: 'Password' }).fill(newUser.password)

    // Click submit button
    await page.getByRole('button', { name: 'SUBMIT' }).click()

    // Wait for home page to load
    await page.waitForURL(BASE_URL)

    // Expect to see new user first and last name
    await expect(
      page.getByText(newUser.firstName + ' ' + newUser.lastName),
    ).toBeVisible()

    // Click log out button
    await page.getByRole('button', { name: 'Log out' }).click()

    // Wait for login page to load
    await page.waitForURL(LOGIN_URL)

    // Fill in login fields
    await page.getByRole('textbox', { name: 'Email' }).fill(newUser.email)
    await page.getByRole('textbox', { name: 'Password' }).fill(newUser.password)

    // Click login button
    await page.getByRole('button', { name: 'LOGIN' }).click()

    // Wait for homepage to load
    await page.waitForURL(BASE_URL)

    // Expect to see new user first and last name
    await expect(
      page.getByText(newUser.firstName + ' ' + newUser.lastName),
    ).toBeVisible()
  })
})
