const { test, expect } = require('@playwright/test')
const { getRandomNumber } = require("../../common/common-functions")
const data = require("../../common/common-details.json")

// start by going to the student hub homepage and click on the sign-in button
test.beforeEach(async ({ page }) => {
    await page.goto(data.studentHubUrl)
    await Promise.all([
        page.waitForNavigation(),
        page.locator("//a[contains(@class, 'AuthMenustyle__SignInButton-sc-yhrlvv-3')]").nth(1).click()
    ])
})

// tests for login to the student hub
test.describe('login via email and password tests on student hub', async () => {
    // user successfully login to the student hub via email and password and confirm that the profile icon shows up to confirm it is logged in
    test('successful user login', async ({ page }) => {
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
        await expect(page.locator("//a[contains(@class, 'AuthMenustyle__SignInButton-sc-yhrlvv-3')]").nth(1)).toBeVisible()
    })

    // user input incorrect password and it will show a red error message saying "Wrong email or password."
    test('incorrect password', async ({ page }) => {
        await page.fill("input#email", data.studentHubEmail)
        await page.fill("input#password", "IncorrectPassword")
        await page.click("button#btn-login")
        await expect(page.locator("//div[contains(@class, 'error-message') and text()='Wrong email or password.']")).toBeVisible()
    })

    // user clicked on the login button without providing the email and password, confirm that it shows red error messages
    test('empty email and password', async ({ page }) => {
        await page.fill("input#email", "")
        await page.fill("input#password", "")
        await page.click("button#btn-login")
        await expect.soft(page.locator("//span[@class='input-error-message' and text()='Enter your email address']")).toBeVisible()
        await expect(page.locator("//span[@class='input-error-message' and text()='Enter your password']")).toBeVisible()
    })
})

// tests for the sign up process on student hub
test.describe('signup tests on student hub', async () => {
    // user successfully sign up for an account in the student hub by providing some personal details
    // after successful signup, close the account and check that the credentials won't work when tried to login
    test('successful user signup', async ({ page }) => {
        await page.click("//div[contains(@id, 'login-form')]//a[@class='open-signup']")
        await page.fill("input#given-name", data.firstName)
        await page.fill("input#family-name", data.lastName)
        let random = getRandomNumber(1, 100)
        await page.fill("input#email-signup", `testing.with.prosple+${random}@gmail.com`)
        await page.fill("input#password-signup", data.studentHubPass)
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
        await expect(page.locator("//div[contains(@class, 'error-message') and text()='Wrong email or password.']")).toBeVisible()
    })
})