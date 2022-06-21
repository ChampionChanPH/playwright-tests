const { test, expect } = require('@playwright/test')
const { getRandomNumber } = require('../../common/common-functions')
const data = require("../../common/common-details.json")

test.beforeEach(async ({ page }) => {
    await page.goto(data.studentHubUrl)
    await page.waitForSelector("div.viewport--normal a.logo")
})

// tests for the student hub footer
test.describe('footer tests', async () => {
    // click on each of the social icons on the website
    test('test for the social icons on the website', async ({ page, context }) => {
        await page.locator("div.social-icons a").nth(0).waitFor()
        const socialIcons = page.locator("div.social-icons a")
        const countSocialIcons = await socialIcons.count()
        for (let index = 0; index < countSocialIcons; index++) {
            await Promise.all([
                context.waitForEvent("page"),
                socialIcons.nth(index).click()
            ])
        }
    })
})