const { test, expect } = require('@playwright/test')
const { getRandomNumber } = require('../../common/common-functions')
const data = require("../../common/common-details.json")

test.beforeEach(async ({ page }) => {
    await page.goto(data.studentHubUrl)
})

test.describe('homepage tests', async () => {
    test('check that the dropdowns are working', async ({ page }) => {
        const count = await page.locator("//select").count()
        for (let i = 0; i < count; i++) {
            const options = page.locator("//select").nth(i).locator("//option")
            const optionCount = await options.count()
            let random = getRandomNumber(1, optionCount)
            const chosenOption = await options.nth(random - 1).innerText()
            console.log(chosenOption)
            await page.locator('//select').nth(i).selectOption({ label: chosenOption })
        }
        await Promise.all([
            page.waitForNavigation(),
            page.click("div.input-group--actions button")
        ])
        const url = page.url()
        expect(url).toContain("/search-jobs")
    })
})