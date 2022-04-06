const { test, expect } = require('@playwright/test')
const { getRandomNumber, getRandomCharacters } = require("../../common/common-functions")
const { CompleteLogin } = require("../../common/common-classes")
const data = require("../../common/common-details.json")

test.beforeEach(async ({ page }) => {
    const login = new CompleteLogin(page)
    await login.employerHubLogin()
})

// tests that can be done on the diversity & inclusion section in the employer hub
test.describe('test for diversity contents on the employer hub', async () => {
    // edit one of the diversity contents and see the changes took effect
    test('edit the diversity content', async ({ page }) => {
        await Promise.all([
            page.waitForNavigation(),
            page.locator("//a[contains(@class, 'Navigationstyle__MenuLink') and span/text()='Diversity & Inclusion']").nth(1).click()
        ])
        const url = page.url()
        expect(url).toContain("/diversity-and-inclusion/")
        await page.waitForSelector("//a[contains(@class, 'htBKgl') and contains(text(), 'Edit')]")
        const articles = await page.locator("h3").allTextContents()
        console.log("Current articles:", articles)
        await Promise.all([
            page.waitForNavigation(),
            page.locator("//a[contains(@class, 'htBKgl') and contains(text(), 'Edit')]").nth(0).click()
        ])
        await page.locator("select[name=category]").waitFor()
        const options = await page.locator("select[name=category] option").allTextContents()
        const optionsFilter = await Promise.all(options.filter(option => !(articles.includes(option))))
        console.log("Available options:", optionsFilter)
        await page.locator("select[name=category]").selectOption({ label: "---" })
        await expect.soft(page.locator("//p[contains(@class, 'Formstyle__ErrorMessage') and text()='This field is required']")).toBeVisible()
        const optionCount = optionsFilter.length
        let random = getRandomNumber(1, optionCount - 1)
        const chosenOption = optionsFilter[random]
        await page.locator("select[name=category]").selectOption({ label: chosenOption })
        console.log("Chosen option:", chosenOption)
        const summary = getRandomCharacters(12)
        let summary_content = "This is a summary for the diversity content with some random characters: "
        await page.locator("textarea[name=summary]").fill(`${summary_content}${summary}.`)
        const body = getRandomCharacters(12)
        await page.locator("div.ck-editor__editable").click()
        await page.keyboard.press("Control+A")
        await page.keyboard.press("Delete")
        let body_content = "This is the body of the diversity content with some random characters: "
        await page.locator("div.ck-editor__editable").fill(`${body_content}${body}.`)
        await page.locator("//div[contains(@class, 'Formstyle__FormActions')]//button[@type='submit' and span/text()='Save']").click()
        await page.locator("//button[text()='Close']").click()
        await Promise.all([
            page.waitForNavigation(),
            page.locator("//a[contains(@class, 'Navigationstyle__MenuLink') and span/text()='Diversity & Inclusion']").nth(1).click()
        ])
        await page.waitForSelector("//a[contains(@class, 'htBKgl') and contains(text(), 'Edit')]")
        const type = page.locator(`//div[contains(@class, 'GenericTeaserstyle__DetailsContainer') and div//text()='${chosenOption}']`)
        const checkSummary = await type.locator("//p[contains(@class, 'GenericTeaserstyle__Description')]").innerText()
        expect(checkSummary).toEqual(`${summary_content}${summary}.`)
    })
})