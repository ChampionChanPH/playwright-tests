const { test, expect } = require('@playwright/test')
const { getRandomNumber, getRandomCharacters } = require("../../common/common-functions")
const { CompleteLogin, Input } = require("../../common/common-classes")
const data = require("../../common/common-details.json")
const moment = require('moment')

// before any test, user needs to login successfully
test.beforeEach(async ({ page }) => {
    const login = new CompleteLogin(page)
    await login.employerHubLogin()
    const checkVisible = await page.locator("span.cc-1j8t").isVisible()
    if (checkVisible) await page.locator("span.cc-1j8t").click()
})

// tests to be done after the user successfully logged in
test.describe('test after user successfully logged in', async () => {
    // test to check on the side menu and see that it's working as expected 
    test('test on the side menu', async ({ page }) => {
        await page.locator("//div[contains(@class, 'Navigationstyle__SidebarWrapper')]/a/span[contains(@class, 'Navigationstyle__MenuLabel')]").nth(0).waitFor()
        const menu = page.locator("//div[contains(@class, 'Navigationstyle__SidebarWrapper')]/a/span[contains(@class, 'Navigationstyle__MenuLabel')]")
        const menuCount = await menu.count()
        for (let i = 0; i < menuCount; i++) {
            const label = await menu.nth(i).innerText()
            await Promise.all([
                page.waitForNavigation(),
                menu.nth(i).click()
            ])
            const expected_url = label.toLowerCase().split(" ").join("-").replace("&", "and")
            expect(page.url()).toContain(`/${expected_url}/`)
            console.log(`${label} - ${page.url()}`)
        }
    })

    // test to check on the top menu and see that it's working as expected 
    test('test on the top menu', async ({ page }) => {
        await page.locator("//div[contains(@class, 'Navigationstyle__HeaderMenuWrapper')]/a/span[contains(@class, 'Navigationstyle__MenuLabel')]").nth(0).waitFor()
        const menu = page.locator("//div[contains(@class, 'Navigationstyle__HeaderMenuWrapper')]/a/span[contains(@class, 'Navigationstyle__MenuLabel')]")
        const menuCount = await menu.count()
        for (let i = 0; i < menuCount; i++) {
            const label = await menu.nth(i).innerText()
            await Promise.all([
                page.waitForNavigation(),
                menu.nth(i).click()
            ])
            const expected_url = label.toLowerCase().split(" ").join("-").replace("&", "and")
            expect(page.url()).toContain(`/${expected_url}/`)
            console.log(`${label} - ${page.url()}`)
        }
    })

    // test to make sure that the news and updates is working
    test('news and updates, click on title', async ({ page, context }) => {
        await Promise.all([
            context.waitForEvent("page"),
            page.locator("//a[contains(@class, 'NewsAndUpdatesstyles__PostTitleLink-sc')]").first().click()
        ])
    })

    // test to make sure that the news and updates is working
    test('news and updates, click on read more button', async ({ page, context }) => {
        await Promise.all([
            context.waitForEvent("page"),
            page.locator("a:has-text('Read more')").first().click()
        ])
    })
})