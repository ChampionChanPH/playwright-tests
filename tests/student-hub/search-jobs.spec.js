const { test, expect } = require('@playwright/test')
const { getRandomNumber } = require('../../common/common-functions')
const data = require("../../common/common-details.json")

// go to the search jobs page on the student hub
test.beforeEach(async ({ page }) => {
    await page.goto(data.studentHubUrl + "/search-jobs")
})

// tests that can be done on the search job page on the student hub
test.describe('search job page tests', async () => {
    // use the study field filter and check that the filtered results showing correct study field
    test("study field filter", async ({ page }) => {
        const filter = page.locator("//div[contains(@class, 'viewport viewport--normal')]//div[contains(@class, 'FacetSimplestyle__FacetSimple')]")
        const studyFilter = filter.locator("//button[@class='toggle-trigger' and contains(div/h4/text(), 'studying or have a qualification')]//following-sibling::*[@class='toggle-target']")
        await studyFilter.locator("//a[contains(@class, 'truncate-trigger')]").click()
        const fields = studyFilter.locator("//div[@class='facet__item']")
        const countFields = await fields.count()
        let random = getRandomNumber(1, countFields)
        await Promise.all([
            page.waitForNavigation(),
            fields.nth(random - 1).locator("//label/a").click()
        ])
        const chosenField = await fields.locator("//div[input[@class='is-checked']]/following-sibling::label").innerText()
        let studyField = /.*(?= \()/.exec(chosenField)
        let total = /(?<=\()\d*/.exec(chosenField)
        const breadcrumb = await page.locator("a[itemprop=item] span").last().innerText()
        expect(breadcrumb.toLowerCase()).toEqual(studyField[0].toLowerCase())
        const totalItems = await page.locator("div.search__meta p").innerText()
        expect(totalItems).toContain(total[0])
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

    // use the job type filter and check that the filtered results showing correct job type
    test("job type filter", async ({ page }) => {
        const filter = page.locator("//div[contains(@class, 'viewport viewport--normal')]//div[contains(@class, 'FacetSimplestyle__FacetSimple')]")
        const jobFilter = filter.locator("//button[@class='toggle-trigger' and contains(div/h4/text(), 'looking for')]//following-sibling::*[@class='toggle-target']")
        await jobFilter.locator("//a[contains(@class, 'truncate-trigger')]").click()
        const fields = jobFilter.locator("//div[@class='facet__item']")
        const countFields = await fields.count()
        let random = getRandomNumber(1, countFields)
        await Promise.all([
            page.waitForNavigation(),
            fields.nth(random - 1).locator("//label/a").click()
        ])
        const chosenField = await fields.locator("//div[input[@class='is-checked']]/following-sibling::label").innerText()
        let jobType = /.*(?= \()/.exec(chosenField)
        let total = /(?<=\()\d*/.exec(chosenField)
        const breadcrumb = await page.locator("a[itemprop=item] span").last().innerText()
        expect(breadcrumb.toLowerCase()).toEqual(jobType[0].toLowerCase())
        const totalItems = await page.locator("div.search__meta p").innerText()
        expect(totalItems).toContain(total[0])
        const jobs = page.locator("//div[contains(@class, 'OpportunityTeaserstyle__OpportunityListing')]")
        const countJobs = await jobs.count()
        for (let i = 0; i < countJobs; i++) {
            const type = await jobs.nth(i).locator("//div[contains(@class, 'teaser__item--sub-details')]//p[@type='default']").innerText()
            expect(type.toLowerCase()).toContain(jobType[0].toLowerCase())
        }
    })

    // use the location filter and check that the total items matches the total showing on the filter
    test("location filter", async ({ page }) => {
        const filter = page.locator("//div[contains(@class, 'viewport viewport--normal')]//div[contains(@class, 'FacetSimplestyle__FacetSimple')]")
        const locationFilter = filter.locator("//button[@class='toggle-trigger' and contains(div/h4/text(), 'work in')]//following-sibling::*[@class='toggle-target']")
        await locationFilter.locator("//a[contains(@class, 'truncate-trigger')]").click()
        const fields = locationFilter.locator("//div[@class='facet__item']")
        const countFields = await fields.count()
        let random = getRandomNumber(1, countFields)
        await Promise.all([
            page.waitForNavigation(),
            fields.nth(random - 1).locator("//label/a").click()
        ])
        const chosenField = await fields.locator("//div[input[@class='is-checked']]/following-sibling::label").innerText()
        let location = /.*(?= \()/.exec(chosenField)
        let total = /(?<=\()\d*/.exec(chosenField)
        const breadcrumb = await page.locator("a[itemprop=item] span").last().innerText()
        expect(breadcrumb.toLowerCase()).toEqual(location[0].toLowerCase())
        const totalItems = await page.locator("div.search__meta p").innerText()
        expect(totalItems).toContain(total[0])
    })

    // use the sectors filter and check that the total items matches the total showing on the filter
    test("sectors filter", async ({ page }) => {
        const filter = page.locator("//div[contains(@class, 'viewport viewport--normal')]//div[contains(@class, 'FacetSimplestyle__FacetSimple')]")
        const sectorFilter = filter.locator("//button[@class='toggle-trigger' and div/h4/text()='I prefer these sectors']//following-sibling::*[@class='toggle-target']")
        await sectorFilter.locator("//a[contains(@class, 'truncate-trigger')]").click()
        const fields = sectorFilter.locator("//div[@class='facet__item']")
        const countFields = await fields.count()
        let random = getRandomNumber(1, countFields)
        await Promise.all([
            page.waitForNavigation(),
            fields.nth(random - 1).locator("//label/a").click()
        ])
        const chosenField = await fields.locator("//div[input[@class='is-checked']]/following-sibling::label").innerText()
        let sector = /.*(?= \()/.exec(chosenField)
        let total = /(?<=\()\d*/.exec(chosenField)
        const breadcrumb = await page.locator("a[itemprop=item] span").last().innerText()
        expect(breadcrumb.toLowerCase()).toEqual(sector[0].toLowerCase())
        const totalItems = await page.locator("div.search__meta p").innerText()
        expect(totalItems).toContain(total[0])
    })

    // choose a job on the search jobs page with "Read reviews", click the link and see that it redirects to the correct detail page
    test("click review link to detail page", async ({ page }) => {
        const reviews = page.locator("//div[contains(@class, 'viewport--viewport-read-reviews')]")
        const countReviews = await reviews.count()
        let random = getRandomNumber(1, countReviews)
        const employerListPage = await reviews.nth(random - 1).locator("//preceding-sibling::*[contains(@class, 'Logostyle__Logo')]//p").innerText()
        await Promise.all([
            page.waitForNavigation(),
            reviews.locator("//a").nth(random - 1).click()
        ])
        const employerOverviewPage = await page.locator("div.masthead__title h2.heading").innerText()
        const employerReviewTitle = await page.locator("h1.heading").innerText()
        expect(employerOverviewPage).toEqual(employerListPage)
        expect(employerReviewTitle).toEqual(`${employerListPage} Reviews`)
    })

    // choose a job on the search jobs page, click the job title and see that it redirects to the correct detail page
    test("click job title to detail page", async ({ page }) => {
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

    // confirm that the apply now button on the search jobs page is working as expected\
    // clicking apply now button opens a new tab that's why it checks for 2 pages
    test.only("apply now button is clickable", async ({ page, context }) => {
        const apply = page.locator("a.button--type-apply")
        const countApply = await apply.count()
        let random = getRandomNumber(1, countApply)
        const url = await apply.nth(random - 1).getAttribute("href")
        await Promise.all([
            page.waitForTimeout(3000),
            apply.nth(random - 1).click()
        ])
        // const urls = []
        const pages = context.pages().length
        // pages.forEach(element => urls.push(element._mainFrame._url))
        expect(pages).toEqual(2)
    })
})

test.describe("search job page tests for logged-in users", async () => {
    // login process
    test.beforeEach(async ({ page }) => {
        await Promise.all([
            page.waitForNavigation(),
            page.locator("//a[contains(@class, 'AuthMenustyle__SignInButton-sc-yhrlvv-3')]").nth(1).click()
        ])
        await page.fill("input#email", data.studentHubEmail)
        await page.fill("input#password", data.studentHubPass)
        await Promise.all([
            page.waitForNavigation(),
            page.click("button#btn-login")
        ])
    })

    // bookmark a job and check that what was saved is correct
    test("bookmark job", async ({ page }) => {
        await page.waitForSelector("div.viewport--normal a.logo")
        const saveButton = page.locator("div.viewport--viewport-bookmark-large")
        const countSaveButton = await saveButton.count()
        let random = getRandomNumber(1, countSaveButton)
        console.log(random)
        const employerListPage = await saveButton.nth(random - 1).locator("//ancestor::div[contains(@class, 'OpportunityTeaserstyle__OpportunityListing')]//div[@class='logo__item']/p").innerText()
        const jobListPage = await saveButton.nth(random - 1).locator("//ancestor::div[contains(@class, 'OpportunityTeaserstyle__OpportunityListing')]//*[contains(@class, 'OpportunityTeaserstyle__OpportunityTitle')]").innerText()
        await page.waitForTimeout(3000)
        await saveButton.nth(random - 1).click()
        await page.waitForTimeout(3000)
        const textButton = await saveButton.nth(random - 1).innerText()
        expect(textButton).toEqual("Saved")
        await page.hover("//button[@class='toggle-trigger']//span[contains(@class, 'icon--profile')]")
        await Promise.all([
            page.waitForNavigation(),
            page.locator('text=My Bookmarks').nth(1).click()
        ])
        await Promise.all([
            page.waitForNavigation(),
            page.locator("//a[text()='Jobs']").click()
        ])
        await page.waitForTimeout(3000)
        const employerBookmarked = await page.locator("div.logo__item").innerText()
        const jobBookmarked = await page.locator("//*[contains(@class, 'OpportunityTeaserstyle__OpportunityTitle')]").innerText()
        expect(employerBookmarked).toEqual(employerListPage)
        expect(jobBookmarked).toEqual(jobListPage)
        await page.locator("div.viewport--viewport-bookmark-large").click()
    })
})