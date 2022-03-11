const { test, expect} = require('@playwright/test')
const { getRandomNumber } = require('../../common/common-functions')
const data = require("../../common/common-details.json")

test.beforeEach(async ({ page }) => {
    await page.goto(data.studentHubUrl + "/search-jobs")
})

test.describe('search job page tests', async () => {
    test("select a study field and check that the job results is showing correctly", async ({ page }) => {
        const filter = page.locator("//div[contains(@class, 'viewport viewport--normal')]//div[contains(@class, 'FacetSimplestyle__FacetSimple')]").nth(0)
        await filter.locator("//a[contains(@class, 'truncate-trigger')]").click()
        const fields = filter.locator("//div[@class='facet__item']")
        const countFields = await fields.count()
        let random = getRandomNumber(1, countFields)
        const chosenField = await fields.nth(random - 1).locator("//label").innerText()
        let studyField = /.*(?= \()/.exec(chosenField)
        await Promise.all([
            page.waitForNavigation(),
            fields.nth(random - 1).locator("//label/a").click()
        ])
        const jobs = page.locator("//div[contains(@class, 'OpportunityTeaserstyle__OpportunityListing')]")
        const countJobs = await jobs.count()
        const jobShowMore = jobs.locator("//a[contains(@class, 'truncate-trigger')]")
        const countShowMore = await jobShowMore.count()
        for (let i = 0; i < countShowMore; i++) {
            await jobShowMore.nth(i).click()
        }
        for (let i = 0; i < countJobs; i++) {
            const footerText = await jobs.nth(i).locator("//div[contains(@class, 'teaser__region--footer')]").innerText()
            expect(footerText.toLowerCase()).toContain(studyField[0].toLowerCase())
        }
    })

    test("select a job type and check that the job results is showing correctly", async ({ page }) => {
        const filter = page.locator("//div[contains(@class, 'viewport viewport--normal')]//div[contains(@class, 'FacetSimplestyle__FacetSimple')]").nth(1)
        await filter.locator("//a[contains(@class, 'truncate-trigger')]").click()
        const fields = filter.locator("//div[@class='facet__item']")
        const countFields = await fields.count()
        let random = getRandomNumber(1, countFields)
        const chosenField = await fields.nth(random - 1).locator("//label").innerText()
        let jobType = /.*(?= \()/.exec(chosenField)
        await Promise.all([
            page.waitForNavigation(),
            fields.nth(random - 1).locator("//label/a").click()
        ])
        const jobs = page.locator("//div[contains(@class, 'OpportunityTeaserstyle__OpportunityListing')]")
        const countJobs = await jobs.count()
        for (let i = 0; i < countJobs; i++) {
            const type = await jobs.nth(i).locator("//div[contains(@class, 'teaser__item--sub-details')]//p[@type='default']").innerText()
            expect(type.toLowerCase()).toContain(jobType[0].toLowerCase())
        }
    })

    test("clicking Read reviews link goes to the correct page", async ({ page }) => {
        const jobs = page.locator("//div[contains(@class, 'OpportunityTeaserstyle__OpportunityListing')]")
        const countJobs = await jobs.count()
        let random = getRandomNumber(1, countJobs)
        const employerListPage = await jobs.nth(random - 1).locator("div.logo__item p").innerText()
        await Promise.all([
            page.waitForNavigation(),
            jobs.nth(random - 1).locator("//div[contains(@class, 'viewport--viewport-read-reviews')]//a").click()
        ])
        const employerOverviewPage = await page.locator("div.masthead__title h2.heading").innerText()
        expect(employerOverviewPage).toEqual(employerListPage)
    })

    test("clicking the job title goes to the correct page", async ({ page }) => {
        const jobs = page.locator("//div[contains(@class, 'OpportunityTeaserstyle__OpportunityListing')]")
        const countJobs = await jobs.count()
        let random = getRandomNumber(1, countJobs)
        const employerListPage = await jobs.nth(random - 1).locator("div.logo__item p").innerText()
        const jobTitleListPage = await jobs.nth(random - 1).locator("div.teaser__item--title a").innerText()
        await Promise.all([
            page.waitForNavigation(),
            jobs.nth(random - 1).locator("div.teaser__item--title a").click()
        ])
        const employerOverviewPage = await page.locator("div.masthead__title h2.heading").innerText()
        const jobTitleOverviewPage = await page.locator("h1.heading").innerText()
        expect(employerOverviewPage).toEqual(employerListPage)
        expect(jobTitleOverviewPage).toEqual(jobTitleListPage)
    })

    test("test to confirm that the apply now button is clickable", async ({ page }) => {

    })
})

// test.describe('search job page tests that requires a logged-in user', async () => {
//   // test.beforeEach(async ({ page }) => {
//   //   await Promise.all([
//   //     page.waitForNavigation(),
//   //     page.locator("//a[contains(@class, 'AuthMenustyle__SignInButton-sc-yhrlvv-3')]").nth(1).click()
//   //   ])
//   //   await page.fill("input#email", data.studentHubEmail)
//   //   await page.fill("input#password", data.studentHubPass)
//   //   await Promise.all([
//   //     page.waitForNavigation(),
//   //     page.click("button#btn-login")
//   //   ])
//   //   await page.waitForLoadState('networkidle', 5000)
//   // })

//   test.skip("check that bookmarks are working", async ({ page }) => {
//     const jobs = page.locator("//div[contains(@class, 'OpportunityTeaserstyle__OpportunityListing')]").nth(0)
//     const title = await jobs.locator("//div[contains(@class, 'teaser__item--title')]").innerText()
//     console.log(title)
//     await jobs.click("//div[contains(@class, 'viewport--viewport-bookmark-large')]//a[contains(@class, 'Savestyle__Button')]")
//     const buttonText = await jobs.locator("//div[contains(@class, 'viewport--viewport-bookmark-large')]//a[contains(@class, 'Savestyle__Button')]").innerText()
//     expect(buttonText).toContain("Saved")
//   })
// })