import { test, expect } from '@playwright/test'
import { existingUsers } from '../../test-setup/localstorage.setup'

interface SignupFormFields {
  firstName?: string
  lastName?: string
  email?: string
  password?: string
}

test.describe.configure({ mode: 'serial' })

const existingUser = existingUsers[0]
const BASE_URL = 'http://localhost:8080'
const SIGNUP_URL = `${BASE_URL}/signup`

test.beforeEach(async ({ page }) => {
  await page.goto(SIGNUP_URL)
})

// Helper function for filling in fields
const fillSignupForm = async (page, fields: Partial<SignupFormFields>) => {
  if (fields.firstName !== undefined) {
    await page
      .getByRole('textbox', { name: 'First name' })
      .fill(fields.firstName)
  }
  if (fields.lastName !== undefined) {
    await page.getByRole('textbox', { name: 'Last name' }).fill(fields.lastName)
  }
  if (fields.email !== undefined) {
    await page.getByRole('textbox', { name: 'Email' }).fill(fields.email)
  }
  if (fields.password !== undefined) {
    await page.getByRole('textbox', { name: 'Password' }).fill(fields.password)
  }
}

// Helper function for checking enabled/disabled status of the submit button
const expectSubmitButtonToBe = async (page, state: 'disabled' | 'enabled') => {
  if (state === 'disabled') {
    await expect(page.getByRole('button', { name: 'SUBMIT' })).toBeDisabled()
  } else if (state === 'enabled') {
    await expect(page.getByRole('button', { name: 'SUBMIT' })).toBeEnabled()
  }
}

test.describe('signup form validations', () => {
  // 1. Test email validation
  test('should not be able to click the submit button when entering an invalid email', async ({
    page,
  }) => {
    // Fill in fields using invalid email without @ character
    await fillSignupForm(page, {
      firstName: existingUser.firstName,
      lastName: existingUser.lastName,
      email: 'invalidemail.com',
      password: existingUser.password,
    })

    // Login button should be disabled
    await expectSubmitButtonToBe(page, 'disabled')

    // Fill in email with valid email
    await fillSignupForm(page, { email: existingUser.email })

    // Login button should be enabled
    await expectSubmitButtonToBe(page, 'enabled')
  })

  // 2. Test password validation
  test('should not be able to click the submit button when entering a password with fewer than 9 characters', async ({
    page,
  }) => {
    // Fill in fields using invalid password with less than 9 characters
    await fillSignupForm(page, {
      firstName: existingUser.firstName,
      lastName: existingUser.lastName,
      email: existingUser.email,
      password: '12345678',
    })

    // Login button should be disabled
    await expectSubmitButtonToBe(page, 'disabled')

    // Fill in valid password
    await fillSignupForm(page, { password: existingUser.password })

    // Login button should be enabled
    await expectSubmitButtonToBe(page, 'enabled')
  })

  // 3. Test required fields validation
  test('should not be able to click the submit button while any input is left empty', async ({
    page,
  }) => {
    // Fill in fields
    await fillSignupForm(page, {
      firstName: existingUser.firstName,
      lastName: existingUser.lastName,
      email: existingUser.email,
      password: existingUser.password,
    })

    // Login button should be enabled
    await expectSubmitButtonToBe(page, 'enabled')

    // Clear first name field
    await fillSignupForm(page, {
      firstName: '',
    })

    // Login button should be disabled
    await expectSubmitButtonToBe(page, 'disabled')

    // Fill in first name and clear last name
    await fillSignupForm(page, {
      firstName: existingUser.firstName,
      lastName: '',
    })

    // Login button should be disabled
    await expectSubmitButtonToBe(page, 'disabled')

    // Fill in last name and clear email
    await fillSignupForm(page, {
      lastName: existingUser.lastName,
      email: '',
    })

    // Login button should be disabled
    await expectSubmitButtonToBe(page, 'disabled')

    // Fill in email name and clear password
    await fillSignupForm(page, {
      email: existingUser.email,
      password: '',
    })

    // Login button should be disabled
    await expectSubmitButtonToBe(page, 'disabled')
  })

  // 4. Test toggling of password visibility
  test('should be able to toggle visibility of entered password', async ({
    page,
  }) => {
    // Password input
    await fillSignupForm(page, {
      password: existingUser.password,
    })

    // Expect password to be hidden
    await expect(
      page.getByRole('textbox', { name: 'Password' }),
    ).toHaveAttribute('type', 'password')

    // Toggle eye icon
    await page.getByLabel('toggle password visibility').click()

    // Expect password to be visible
    await expect(
      page.getByRole('textbox', { name: 'Password' }),
    ).toHaveAttribute('type', 'text')

    // Toggle back eye icon
    await page.getByLabel('toggle password visibility').click()

    // Expect password to be hidden
    await expect(
      page.getByRole('textbox', { name: 'Password' }),
    ).toHaveAttribute('type', 'password')
  })
})
