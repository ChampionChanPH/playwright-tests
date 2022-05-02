const { test, expect } = require('@playwright/test')
const { getRandomNumber, getRandomCharacters } = require('../../common/common-functions')
const { CompleteLogin } = require("../../common/common-classes")
const data = require("../../common/common-details.json")

// tests on single page tests only
test.describe('single page tests', async () => {
    // test the apply webform on the jobs page
    test.only("apply webform submission", async ({ page }) => {
        await page.goto(data.studentHubUrl + "/graduate-employers/prosple/jobs-internships/prosple-summer-internship-program")
        await page.waitForSelector("div.viewport--normal a.logo")
        await page.locator("a[data-event-track=cta-webform]").first().click()
        const random = getRandomCharacters(6)
        await page.locator("input#first_name").type("Christian Paul Anasco")
        await page.waitForTimeout(5000)
    })
})