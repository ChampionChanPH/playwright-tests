const { test, expect} = require('@playwright/test')
const { SH_EMAIL , SH_PASSWORD } = require("../../common/login-credentials.js")
const data = require("../../common/common-details.json")
const { chromium } = require("playwright")

test.describe('get the login state to use later on other tests', async () => {
    test('get the login state', async () => {
        const browser = await chromium.launch()
        const context = await browser.newContext()
        const page = await context.newPage()
        await page.goto(data.studentHubUrl)
        await page.locator("//a[contains(@class, 'AuthMenustyle__SignInButton-sc-yhrlvv-3')]").nth(1).click()
        await page.fill("input#email", SH_EMAIL)
        await page.fill("input#password", SH_PASSWORD)
        await page.click("button#btn-login")
        await page.locator("//button[@class='toggle-trigger']//span[contains(@class, 'icon--profile')]").isVisible()
        await context.storageState({
            path: "studentHubState.json"
        })
    })
})