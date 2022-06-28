const { test, expect } = require('@playwright/test')
const data = require("../../common/common-details.json")

// tests for login to the CMS
test.describe('login via email and password tests on CMS', async () => {
    // user successfully login to the CMS via email and password
    test('successful user login', async ({ page }) => {
        await page.goto(data.cmsUrl)
        await page.fill("input[name=email]", data.cmsEmail)
        await page.fill("input[name=password]", data.cmsPass)
        await Promise.all([
            page.waitForNavigation(),
            page.click("span.auth0-label-submit")
        ])
        await page.locator("a.toolbar-icon-user").waitFor()
        await page.context().storageState({ path: 'resources/authStateDevCMS.json' })
        await page.context().storageState({ path: 'tests/cms/resources/authStateDevCMS.json' })
    })
})