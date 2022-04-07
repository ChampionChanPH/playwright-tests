const { test, expect } = require('@playwright/test')
const { getRandomNumber, getRandomCharacters } = require("../../common/common-functions")
const { CompleteLogin } = require("../../common/common-classes")
const data = require("../../common/common-details.json")

// tests for the login in the employer hub
test.describe('test for the login on the employer hub', async () => {
    // go the employer hub website
    test.beforeEach(async ({ page }) => {
        await page.goto(data.employerHubUrl)
    })

    // intentionally input incorrect password and check that there will be an error message
    test('check for error on incorrect password', async ({ page }) => {
        await page.fill("input#email", data.employerHubEmail)
        await page.fill("input#password", "IncorrectPassword")
        await page.click("button#btn-login")
        await expect(page.locator("//div[contains(@class, 'error-message') and text()='Wrong email or password.']")).toBeVisible()
    })

    // input no email and password and check for the error message
    test('check for error on inputting no email or password', async ({ page }) => {
        await page.fill("input#email", "")
        await page.fill("input#password", "")
        await page.click("button#btn-login")
        await expect(page.locator("span.input-error-message:has-text('Enter your email address')")).toBeVisible()
        await expect(page.locator("span.input-error-message:has-text('Enter your password')")).toBeVisible()
    })
})

// test for complete login and logout on the employer hub
test.describe('test to logout in the employer hub', async () => {
    // complete login for employer hub
    test.beforeEach(async ({ page }) => {
        const login = new CompleteLogin(page)
        await login.employerHubLogin()
    })

    test('logout after successful login', async ({ page }) => {
        await page.hover("//div[contains(@class, 'viewport--normal')]//span[contains(@class, 'AuthMenustyle__StyleProfileIcon-sc')]")
        await Promise.all([
            page.waitForNavigation(),
            page.locator('text=Log Out').nth(1).click()
        ])
        await page.waitForSelector("input#email")
    })
})