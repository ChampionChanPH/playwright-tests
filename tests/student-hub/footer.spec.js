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
    test.skip('test for the social icons on the website', async ({ page }) => {
        const socialIcons = page.locator("div[data-testid=section] div.social-icons a")
        const countSocialIcons = await socialIcons.count()
        for (let index = 0; index < countSocialIcons; index++) {
            const icon = await socialIcons.nth(index).getAttribute("href")
            console.log(icon)
            await Promise.all([
                page.waitForNavigation(),
                socialIcons.nth(index).click()
            ])
        }
    })
})