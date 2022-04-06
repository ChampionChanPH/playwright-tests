const { test, expect } = require('@playwright/test')
const { getRandomNumber, getRandomCharacters } = require("../../common/common-functions")
const data = require("../../common/common-details.json")

test.beforeEach(async ({ page }) => {
    await page.goto(data.employerHubUrl)
})

// tests that can be done on the diversity & inclusion section in the employer hub
test.describe.only('test for diversity contents on the employer hub', async () => {
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