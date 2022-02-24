const { test, expect} = require('@playwright/test')

test.describe('login tests', async () => {
  test('confirm a successful login by checking profile icon shows on the page after loggin in', async ({  page }) => {
    await page.goto('https://gradaustralia.com.au/')
    await page.locator("//a[contains(@class, 'ViuJv button AuthMenustyle__SignInButton-sc-yhrlvv-3')]").nth(1).click()
    await page.fill("input#email", "testing.with.prosple@gmail.com")
    await page.fill("input#password", "Prosple0000")
    await page.click("button#btn-login")
    await expect(page.locator("//button[@class='toggle-trigger']//span[contains(@class, 'icon--profile')]")).toBeVisible()
  })
})