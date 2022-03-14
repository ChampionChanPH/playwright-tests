const { test, expect } = require('@playwright/test')
const { getRandomNumber } = require('../../common/common-functions')
const data = require("../../common/common-details.json")

test.beforeEach(async ({ page }) => {
    await page.goto(data.studentHubUrl)
    await page.waitForSelector("div.viewport--normal a.logo")
})

// tests for the student hub homepage
test.describe('homepage tests', async () => {
    // choose options from the dropdowns and check that the search button will redirect to a different page
    test('confirm dropdowns and search button is working', async ({ page }) => {
        const count = await page.locator("//select").count()
        for (let i = 0; i < count; i++) {
            const options = page.locator("//select").nth(i).locator("//option")
            const optionCount = await options.count()
            let random = getRandomNumber(1, optionCount)
            const chosenOption = await options.nth(random - 1).innerText()
            await page.locator('//select').nth(i).selectOption({ label: chosenOption })
        }
        await Promise.all([
            page.waitForNavigation(),
            page.click("div.input-group--actions button")
        ])
        expect(page.url()).toContain("/search-jobs")
    })
})