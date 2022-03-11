const { test, expect } = require('@playwright/test')
const data = require("../../common/common-details.json")
const { getRandomNumber } = require("../../common/common-functions")

test.beforeEach(async ({ page }) => {
    await page.goto(data.studentHubUrl)
    await Promise.all([
        page.waitForNavigation(),
        page.locator("//a[contains(@class, 'AuthMenustyle__SignInButton-sc-yhrlvv-3')]").nth(1).click()
    ])
})

test.describePro('login via email and password tests on student hub', async () => {
    test('user login and when successful, confirm the profile icon', async ({ page }) => {
        await page.fill("input#email", data.studentHubEmail)
        await page.fill("input#password", data.studentHubPass)
        await Promise.all([
            page.waitForNavigation(),
            page.click("button#btn-login")
        ])
        await page.hover("//button[@class='toggle-trigger']//span[contains(@class, 'icon--profile')]")
        await Promise.all([
            page.waitForNavigation(),
            page.locator('text=Logout').nth(1).click()
        ])
        await expect.soft(page.locator("//a[contains(@class, 'AuthMenustyle__SignInButton-sc-yhrlvv-3')]").nth(1)).toBeVisible()
    })

    test('user input incorrect password and confirm that it shows an error', async ({ page }) => {
        await page.fill("input#email", data.studentHubEmail)
        await page.fill("input#password", "IncorrectPassword")
        await page.click("button#btn-login")
        await expect.soft(page.locator("//div[contains(@class, 'error-message') and text()='Wrong email or password.']")).toBeVisible()
    })

    test('user left email and password empty and confirm that it shows an error', async ({ page }) => {
        await page.fill("input#email", "")
        await page.fill("input#password", "")
        await page.click("button#btn-login")
        await expect.soft(page.locator("//span[@class='input-error-message' and text()='Enter your email address']")).toBeVisible()
        await expect.soft(page.locator("//span[@class='input-error-message' and text()='Enter your password']")).toBeVisible()
    })
})

test.describe('signup tests on student hub', async () => {
    test('user signup via email and password', async ({ page }) => {
        await page.click("//div[@id='signup-message']//a[@class='open-signup']")
        await page.fill("input#given-name", data.firstName)
        await page.fill("input#family-name", data.lastName)
        let random = getRandomNumber(1, 100)
        await page.fill("input#email-signup", `christian.anasco+${random}@prosple.com`)
        await page.fill("input#password-signup", `Prosple1234`)
        await page.click("button#btn-signup")
        await page.hover("//button[@class='toggle-trigger']//span[contains(@class, 'icon--profile')]")
        await Promise.all([
            page.waitForNavigation(),
            page.locator('text=My Account').nth(1).click()
        ])
        await page.click("//button[@data-testid='cancel-modal-trigger']")
        await page.click('text=Yes, I understand that cancelled accounts are not recoverable')
        await page.click('text=Stop receiving communications from GradAustralia and all other Prosple sites')
        await page.click("//button[@data-testid='cancel-button']")
        await Promise.all([
            page.waitForNavigation(),
            page.locator("//a[contains(@class, 'AuthMenustyle__SignInButton-sc-yhrlvv-3')]").nth(1).click()
        ])
        await page.fill("input#email", `christian.anasco+${random}@prosple.com`)
        await page.fill("input#password", `Prosple1234`)
        await page.click("button#btn-login")
        await expect.soft(page.locator("//div[contains(@class, 'error-message') and text()='Wrong email or password.']")).toBeVisible()
    })
})