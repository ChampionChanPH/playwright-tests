const { test, expect } = require('@playwright/test')
const { SH_EMAIL , SH_PASSWORD } = require("../../credentials/login-credentials.js")

test.beforeEach(async ({ page }) => {
  await page.goto('https://gradaustralia.com.au/')
  await page.locator("//a[contains(@class, 'ViuJv button AuthMenustyle__SignInButton-sc-yhrlvv-3')]").nth(1).click()
})

test.describe('login via email and password tests', async () => {
  test('user login and when successful, confirm the profile icon', async ({  page }) => {
    await page.fill("input#email", SH_EMAIL)
    await page.fill("input#password", SH_PASSWORD)
    await page.click("button#btn-login")
    await expect(page.locator("//button[@class='toggle-trigger']//span[contains(@class, 'icon--profile')]")).toBeVisible()
  })

  test('user input incorrect password and confirm that it shows an error', async ({  page }) => {
    await page.fill("input#email", SH_EMAIL)
    await page.fill("input#password", "IncorrectPassword")
    await page.click("button#btn-login")
    await expect(page.locator("//div[contains(@class, 'error-message') and text()='Wrong email or password.']")).toBeVisible()
  })

  test('user left email and password empty and confirm that it shows an error', async ({  page }) => {
    await page.fill("input#email", "")
    await page.fill("input#password", "")
    await page.click("button#btn-login")
    await expect(page.locator("//span[@class='input-error-message' and text()='Enter your email address']")).toBeVisible()
    await expect(page.locator("//span[@class='input-error-message' and text()='Enter your password']")).toBeVisible()
  })
})

test.describe('social media login tests', async () => {
  test('user login via Facebook', async ({  page }) => {
    await page.locator("#login-form >> text=Facebook").click()
    await page.fill("input#email", SH_EMAIL)
    await page.fill("input#pass", SH_PASSWORD)
    await page.click("button#loginbutton")
    await expect(page.locator("//button[@class='toggle-trigger']//span[contains(@class, 'icon--profile')]")).toBeVisible()
  })

  test('user login via Google', async ({  page }) => {
    await page.locator("#login-form >> text=Google").click()
    await page.fill("input#identifierId", SH_EMAIL)
    await page.click("//span[@jsname='V67aGc' and (text()='Next' or text()='Susunod')]")
    await page.fill("//input[@type='password']", SH_PASSWORD)
    await page.click("//span[@jsname='V67aGc' and (text()='Next' or text()='Susunod')]")
    await expect(page.locator("//button[@class='toggle-trigger']//span[contains(@class, 'icon--profile')]")).toBeVisible()
  })
})