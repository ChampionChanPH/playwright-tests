const { test, expect} = require('@playwright/test')

test.beforeEach(async ({ page }) => {
  await page.goto('https://gradaustralia.com.au/')
  await page.locator("//a[contains(@class, 'ViuJv button AuthMenustyle__SignInButton-sc-yhrlvv-3')]").nth(1).click()
  await page.fill("input#email", "testing.with.prosple@gmail.com")
  await page.fill("input#password", "Prosple0000")
  await page.click("button#btn-login")
  await expect(page.locator("//button[@class='toggle-trigger']//span[contains(@class, 'icon--profile')]")).toBeVisible()
})

test.describe('menu tests', async () => {
  test('check that the menu is working', async ({  page }) => {
    await page.locator("//a[@href='/search-jobs']").last().click()
    await expect(page).toHaveURL(/\/search-jobs/)
  })
})