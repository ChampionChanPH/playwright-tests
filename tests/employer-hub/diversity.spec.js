const { test, expect } = require('@playwright/test')
const data = require("../../common/common-details.json")
const { getRandomNumber, getRandomCharacters } = require("../../common/common-functions")

test.beforeEach(async ({ page }) => {
    await page.goto(data.employerHubUrl)
    await page.fill("input#email", data.employerHubEmail)
    await page.fill("input#password", data.employerHubPass)
    await Promise.all([
        page.waitForNavigation(),
        page.click("button#btn-login")
    ])
})

test.describe('test for diversity contents on the employer hub', async () => {
    test.skip('edit the ', async ({ page }) => {
        await page.waitForURL("**/dashboard/overview/")
        await Promise.all([
            page.waitForNavigation(),
            page.locator("//a[contains(@class, 'Navigationstyle__MenuLink') and span/text()='Diversity & Inclusion']").nth(1).click()
        ])
        const url = page.url()
        expect(url).toContain("/diversity-and-inclusion/")
        await Promise.all([
            page.waitForNavigation(),
            page.locator("//a[contains(@class, 'htBKgl') and contains(text(), 'Edit')]").nth(0).click()
        ])
        await page.locator("select[name=category]").waitFor()
        const options = page.locator("select[name=category] option")
        const optionCount = await options.count()
        let random = getRandomNumber(1, optionCount - 1)
        const chosenOption = await options.nth(random).innerText()
        await page.locator("select[name=category]").selectOption({ label: chosenOption })
        const summary = getRandomCharacters(12)
        await page.locator("textarea[name=summary]").fill(`This is a summary for the diversity content with some random characters: ${summary}.`)
        const body = getRandomCharacters(12)
        await page.locator("textarea[name=summary]").fill(`This is the body of the diversity content with some random characters: ${body}.`)
        await page.locator("//div[contains(@class, 'Formstyle__FormActions')]//button[@type='submit' and span/text()='Save']").click()
        await page.locator("//button[text()='Close']").click()
    })
})