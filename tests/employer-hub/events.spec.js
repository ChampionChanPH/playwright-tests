const { test, expect } = require('@playwright/test')
const { getRandomNumber, getRandomCharacters } = require("../../common/common-functions")
const { CompleteLogin } = require("../../common/common-classes")
const data = require("../../common/common-details.json")

test.beforeEach(async ({ page }) => {
    const login = new CompleteLogin(page)
    await login.employerHubLogin()
    await Promise.all([
        page.waitForNavigation(),
        page.locator("//a[contains(@class, 'Navigationstyle__MenuLink') and span/text()='Events']").nth(1).click()
    ])
    await Promise.all([
        page.waitForNavigation(),
        page.locator("//div[contains(@class, 'Content__ContentBox-sc')]//a[text()='Edit']").nth(0).click()
    ])
})

// tests that can be done on the events section in the employer hub
test.describe('test for events on the employer hub', async () => {
    // update the event name
    // check for error message when the field was left blank
    test('update event name', async ({ page }) => {
        await page.locator("input[name=name]").fill("")
        await page.click("button.button span:has-text('Save')")
        await expect(page.locator("//p[contains(@class, 'Formstyle__ErrorMessage') and text()='This field is required']")).toBeVisible()
        const random = getRandomCharacters(6)
        await page.locator("input[name=name]").fill(`New Event - ${random}`)
        await page.click("button.button span:has-text('Save')")
        await page.locator("//button[text()='Close']").click()
        await Promise.all([
            page.waitForNavigation(),
            page.locator("//a[contains(@class, 'Navigationstyle__MenuLink') and span/text()='Events']").nth(1).click()
        ])
        await page.locator("//div[contains(@class, 'Content__ContentBox-sc')]//a[text()='Edit']").nth(0).waitFor()
        const name = await page.locator("//h3[contains(@class, 'EventTeaserstyle__Title-sc')]").nth(0).innerText()
        expect(name).toEqual(`New Event - ${random}`)
    })
})