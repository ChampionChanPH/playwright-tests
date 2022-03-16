const { test, expect } = require('@playwright/test')
const { getRandomNumber } = require('../../common/common-functions')
const { CompleteLogin } = require("../../common/common-classes")
const data = require("../../common/common-details.json")

// go to the seo landing page for graduate jobs
test.beforeEach(async ({ page }) => {
    let path = data.studentHubUrl != "https://gradaustralia.com.au" ? "/engineering-graduate-jobs-programs" : "/engineering-graduate-jobs"
    await page.goto(data.studentHubUrl + path)
    await page.waitForSelector("div.viewport--normal a.logo")
})

// tests that can be done on the seo landing pages on the student hub
test.describe('seo landing page tests', async () => {
    // choose options from the dropdowns and check that the search button will redirect to a different page
    test('confirm dropdowns and search button is working', async ({ page }) => {
        const choices = []
        const count = await page.locator("//select").count()
        for (let i = 0; i < count; i++) {
            const options = page.locator("//select").nth(i).locator("//option")
            const optionCount = await options.count()
            let random = getRandomNumber(1, optionCount)
            const chosenOption = await options.nth(random - 1).innerText()
            choices.push(chosenOption)
            await page.locator('//select').nth(i).selectOption({ label: chosenOption })
        }
        await Promise.all([
            page.waitForNavigation(),
            page.click("div.input-group--actions button")
        ])
        console.log("choices:", choices)
        expect(page.url()).toContain("/search-jobs")
        const breadcrumbs = await page.locator("ul.breadcrumbs span").allTextContents()
        console.log("breadcrumbs:", breadcrumbs)
        choices.forEach(choice => {
            if (!(choice.includes("Any"))) {
                expect(breadcrumbs.includes(choice)).toBeTruthy()
            }
        })
    })


})

// tests on seo landing page that requires users to login
test.describe("seo landing page tests for logged-in users", async () => {
    // login process
    test.beforeEach(async ({ page }) => {
        const login = new CompleteLogin(page)
        await login.studentHubLogin()
    })

    // bookmark a job and see that what was saved on the account is correct
    test.only("bookmark job", async ({ page }) => {
        await page.waitForSelector("div.viewport--viewport-bookmark-large")
        const saveButton = page.locator("div.viewport--viewport-bookmark-large")
        const countSaveButton = await saveButton.count()
        let random = getRandomNumber(1, countSaveButton)
        const employerListPage = await saveButton.nth(random - 1).locator("//ancestor::div[contains(@class, 'OpportunityTeaserstyle__OpportunityListing')]//div[@class='logo__item']/p").innerText()
        const jobListPage = await saveButton.nth(random - 1).locator("//ancestor::div[contains(@class, 'OpportunityTeaserstyle__OpportunityListing')]//*[contains(@class, 'OpportunityTeaserstyle__OpportunityTitle')]").innerText()
        console.log("bookmarked employer:", employerListPage)
        console.log("bookmarked job:", jobListPage)
        await page.waitForTimeout(3000)
        await saveButton.nth(random - 1).click()
        await page.waitForTimeout(3000)
        const textButton = await saveButton.nth(random - 1).innerText()
        expect.soft(textButton).toEqual("Saved")
        await page.hover("//button[@class='toggle-trigger']//span[contains(@class, 'icon--profile')]")
        await Promise.all([
            page.waitForNavigation(),
            page.locator('text=My Bookmarks').nth(1).click()
        ])
        await Promise.all([
            page.waitForNavigation(),
            page.locator("//div[contains(@class, 'region--sidebar')]//a[text()='Jobs']").click()
        ])
        await page.waitForTimeout(3000)
        const employerBookmarked = await page.locator("div.logo__item").innerText()
        const jobBookmarked = await page.locator("//*[contains(@class, 'OpportunityTeaserstyle__OpportunityTitle')]").innerText()
        expect.soft(employerBookmarked).toEqual(employerListPage)
        expect.soft(jobBookmarked).toEqual(jobListPage)
        console.log("saved employer:", employerBookmarked)
        console.log("saved job:", jobBookmarked)
        await page.locator("div.viewport--viewport-bookmark-large").click()
        const message = await page.locator("h1.heading").innerText()
        expect(message).toEqual("No Saved Jobs")
    })
})