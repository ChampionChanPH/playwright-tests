const { test, expect } = require('@playwright/test')
const { SH_EMAIL , SH_PASSWORD, SH_FB_PASSWORD, FIRST_NAME, LAST_NAME, SH_EMAIL_SIGNUP, SH_PASSWORD_SIGNUP } = require("../../common/login-credentials.js")
const data = require("../../common/common-details.json")

test.beforeEach(async ({ page }) => {
  await page.goto(data.studentHubUrl)
  await page.locator("//a[contains(@class, 'AuthMenustyle__SignInButton-sc-yhrlvv-3')]").nth(1).click()
})

test.describe('login via email and password tests', async () => {
  test.only('user login and when successful, confirm the profile icon', async ({ page }) => {
    await page.fill("input#email", SH_EMAIL)
    await page.fill("input#password", SH_PASSWORD)
    await page.click("button#btn-login")
    await page.hover("//button[@class='toggle-trigger']//span[contains(@class, 'icon--profile')]")
    await page.locator('text=Logout').nth(1).click()
    await expect(page.locator("//a[contains(@class, 'AuthMenustyle__SignInButton-sc-yhrlvv-3')]").nth(1)).toBeVisible()
  })

  test('user input incorrect password and confirm that it shows an error', async ({ page }) => {
    await page.fill("input#email", SH_EMAIL)
    await page.fill("input#password", "IncorrectPassword")
    await page.click("button#btn-login")
    await expect(page.locator("//div[contains(@class, 'error-message') and text()='Wrong email or password.']")).toBeVisible()
  })

  test('user left email and password empty and confirm that it shows an error', async ({ page }) => {
    await page.fill("input#email", "")
    await page.fill("input#password", "")
    await page.click("button#btn-login")
    await expect(page.locator("//span[@class='input-error-message' and text()='Enter your email address']")).toBeVisible()
    await expect(page.locator("//span[@class='input-error-message' and text()='Enter your password']")).toBeVisible()
  })
})

test.describe('social media login tests', async () => {
  test('user login via Facebook', async ({ page, browserName }) => {
    test.skip(browserName !== "chromium", "cannot run logins in parallel in multiple browsers")
    await page.locator("#login-form >> text=Facebook").click()
    await page.fill("input#email", SH_EMAIL)
    await page.fill("input#pass", SH_FB_PASSWORD)
    await page.click("button#loginbutton")
    await page.hover("//button[@class='toggle-trigger']//span[contains(@class, 'icon--profile')]")
    await page.locator('text=Logout').nth(1).click()
    await expect(page.locator("//a[contains(@class, 'AuthMenustyle__SignInButton-sc-yhrlvv-3')]").nth(1)).toBeVisible()
  })
})

test.describe('signup tests', async () => {
  test('user signup via email and password', async ({ page, browserName }) => {
    // test.skip(browserName !== "chromium", "cannot run signups in parallel in multiple browsers")
    await page.click("//div[@id='signup-message']//a[@class='open-signup']")
    await page.fill("input#given-name", FIRST_NAME)
    await page.fill("input#family-name", LAST_NAME)
    await page.fill("input#email-signup", SH_EMAIL_SIGNUP)
    await page.fill("input#password-signup", SH_PASSWORD_SIGNUP)
    await page.click("button#btn-signup")
    await page.hover("//button[@class='toggle-trigger']//span[contains(@class, 'icon--profile')]")
    await page.locator('text=My Account').nth(1).click()
    await page.click("//button[@data-testid='cancel-modal-trigger']")
    await page.click('text=Yes, I understand that cancelled accounts are not recoverable')
    await page.click('text=Stop receiving communications from GradAustralia and all other Prosple sites')
    await page.click("//button[@data-testid='cancel-button']")
    await expect(page.locator("//a[contains(@class, 'AuthMenustyle__SignInButton-sc-yhrlvv-3')]").nth(1)).toBeVisible()
  })

  test('user signup via Facebook', async ({ page, browserName }) => {
    // test.skip(browserName !== "chromium", "cannot run signups in parallel in multiple browsers")
    await page.click("//div[@id='signup-message']//a[@class='open-signup']")
    await page.locator("#signup-form >> text=Facebook").click()
    await page.fill("input#email", SH_EMAIL)
    await page.fill("input#pass", SH_FB_PASSWORD)
    await page.click("button#loginbutton")
    await page.hover("//button[@class='toggle-trigger']//span[contains(@class, 'icon--profile')]")
    await page.locator('text=Logout').nth(1).click()
    await expect(page.locator("//a[contains(@class, 'AuthMenustyle__SignInButton-sc-yhrlvv-3')]").nth(1)).toBeVisible()
  })
})