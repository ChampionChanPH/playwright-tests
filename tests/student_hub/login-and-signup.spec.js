const { test, expect } = require('@playwright/test')
const { SH_EMAIL , SH_PASSWORD } = require("../../credentials/login-credentials.js")

test.beforeEach(async ({ page }) => {
  await page.goto('https://gradaustralia.com.au/')
  await page.locator("//a[contains(@class, 'ViuJv button AuthMenustyle__SignInButton-sc-yhrlvv-3')]").nth(1).click()
  await page.fill("input#email", SH_EMAIL)
  await page.fill("input#password", SH_PASSWORD)
  await page.click("button#btn-login")
  await expect(page.locator("//button[@class='toggle-trigger']//span[contains(@class, 'icon--profile')]")).toBeVisible()
})

test.describe('logins', async () => {
  test('check that the menu is working', async ({  page }) => {
    await page.locator("//a[@href='/search-jobs']").last().click()
    await expect(page).toHaveURL(/\/search-jobs/)
  })
})