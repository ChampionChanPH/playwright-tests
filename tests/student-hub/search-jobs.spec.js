const { test, expect } = require('@playwright/test')
const { getRandomNumber } = require('../../common/common-functions')
const { CompleteLogin } = require("../../common/common-classes")
const data = require("../../common/common-details.json")

// go to the search jobs page on the student hub
test.beforeEach(async ({ page }) => {
    await page.goto(data.studentHubUrl + "/search-jobs")
    await page.waitForSelector("div.viewport--normal a.logo")
})

// tests that can be done on the search job page on the student hub
test.describe('search job page tests', async () => {
    // use the study field filter and check that the filtered results showing correct study field
    test("study field filter", async ({ page }) => {
        const filter = page.locator("//div[contains(@class, 'viewport viewport--normal')]//div[contains(@class, 'FacetSimplestyle__FacetSimple')]")
        const studyFilter = filter.locator("//button[@class='toggle-trigger' and contains(div/h4/text(), 'studying or have a qualification')]//following-sibling::*[@class='toggle-target']")
        const checkVisible = await studyFilter.locator("//a[contains(@class, 'truncate-trigger')]").isVisible()
        if (checkVisible) await studyFilter.locator("//a[contains(@class, 'truncate-trigger')]").click()
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
        const checkVisible = await jobFilter.locator("//a[contains(@class, 'truncate-trigger')]").isVisible()
        if (checkVisible) await jobFilter.locator("//a[contains(@class, 'truncate-trigger')]").click()
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
        const checkVisible = await locationFilter.locator("//a[contains(@class, 'truncate-trigger')]").isVisible()
        if (checkVisible) await locationFilter.locator("//a[contains(@class, 'truncate-trigger')]").click()
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
        expect.soft(breadcrumb.toLowerCase()).toEqual(location[0].toLowerCase())
        const totalItems = await page.locator("div.search__meta p").innerText()
        expect(totalItems).toContain(total[0])
    })

    // use the sectors filter and check that the total items matches the total showing on the filter
    test("sectors filter", async ({ page }) => {
        const filter = page.locator("//div[contains(@class, 'viewport viewport--normal')]//div[contains(@class, 'FacetSimplestyle__FacetSimple')]")
        const sectorFilter = filter.locator("//button[@class='toggle-trigger' and div/h4/text()='I prefer these sectors']//following-sibling::*[@class='toggle-target']")
        const checkVisible = await sectorFilter.locator("//a[contains(@class, 'truncate-trigger')]").isVisible()
        if (checkVisible) await sectorFilter.locator("//a[contains(@class, 'truncate-trigger')]").click()
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

    // check that the closing in message on jobs is correct
    test("closing in alert message", async ({ page }) => {
        const jobs = page.locator("//div[contains(@class, 'OpportunityTeaserstyle__OpportunityListing')]")
        const countJobs = await jobs.count()
        console.log(countJobs)
        for (let i = 0; i < countJobs; i++) {
            const closeAlert = jobs.nth(i).locator("li.deadline-warning")
            const alert = await closeAlert.isVisible()
            if (alert) {
                let result = false
                let alertMessage = await closeAlert.innerText()
                let applyClose = await jobs.nth(i).locator("//div[contains(@class, 'field-label') and text()='Applications Close']/following-sibling::*").innerText()
                let difference = Math.abs(Date.parse(applyClose) - Date.now()) / 1000
                let differenceDays = Math.floor(difference / 86400) + 1

                if (Date.parse(applyClose) < Date.now()) {
                    result = alertMessage.includes("Today")
                } else {
                    result = alertMessage.includes(`${differenceDays.toString()} day`)
                }

                expect(result).toBeTruthy()
            }
        }
    })

    // check that when filtered, the results were filtered correctly
    test("sort by filter, closing date", async ({ page }) => {
        await Promise.all([
            page.waitForNavigation(),
            page.locator('select[name=sort]').selectOption({ label: "Closing Date" })
        ])
        const pagination = page.locator("//li[@class='pagination-item']")
        const countPage = await pagination.count()
        if (countPage > 0) {
            let random = getRandomNumber(1, countPage)
            await Promise.all([
                page.waitForNavigation(),
                pagination.nth(random - 1).click()
            ])
            let sorted = true
            const jobs = page.locator("//div[contains(@class, 'OpportunityTeaserstyle__OpportunityListing')]")
            const jobContents = await jobs.locator("//*[contains(@class, 'field-label') and text()='Applications Close']/following-sibling::*").allTextContents()
            for (let i = 0; i < jobContents.length - 1; i++) {
                if (Date.parse(jobContents[i]) > Date.parse(jobContents[i + 1])) {
                    sorted = false
                    break
                }
            }
            expect(sorted).toBeTruthy()
        }
    })

    // check that when filtered, the results were filtered correctly
    test.skip("sort by filter, employers a-z", async ({ page }) => {
        await Promise.all([
            page.waitForNavigation(),
            page.locator('select[name=sort]').selectOption({ label: "Employers A-Z" })
        ])
        const pagination = page.locator("//li[@class='pagination-item']")
        const countPage = await pagination.count()
        if (countPage > 0) {
            let random = getRandomNumber(1, countPage)
            await Promise.all([
                page.waitForNavigation(),
                pagination.nth(random - 1).click()
            ])
            let sorted = true
            const jobs = page.locator("//div[contains(@class, 'OpportunityTeaserstyle__OpportunityListing')]")
            const jobContents = await jobs.locator("div.logo__item p").allTextContents()
            for (let i = 0; i < jobContents.length - 1; i++) {
                if (jobContents[i].toLowerCase() > jobContents[i + 1].toLowerCase()) {
                    sorted = false
                    break
                }
            }
            expect(sorted).toBeTruthy()
        }
    })

    // check that when filtered, the results were filtered correctly
    test.skip("sort by filter, employers z-a", async ({ page }) => {
        await Promise.all([
            page.waitForNavigation(),
            page.locator('select[name=sort]').selectOption({ label: "Employers Z-A" })
        ])
        const pagination = page.locator("//li[@class='pagination-item']")
        const countPage = await pagination.count()
        if (countPage > 0) {
            let random = getRandomNumber(1, countPage)
            await Promise.all([
                page.waitForNavigation(),
                pagination.nth(random - 1).click()
            ])
            let sorted = true
            const jobs = page.locator("//div[contains(@class, 'OpportunityTeaserstyle__OpportunityListing')]")
            const jobContents = await jobs.locator("div.logo__item p").allTextContents()
            for (let i = 0; i < jobContents.length - 1; i++) {
                if (jobContents[i].toLowerCase() < jobContents[i + 1].toLowerCase()) {
                    sorted = false
                    break
                }
            }
            expect(sorted).toBeTruthy()
        }
    })

    // check that when filtered, the results were filtered correctly
    test("sort by filter, newest opportunities", async ({ page }) => {

    })

    // test the pagination on the search job page
    test("pagination", async ({ page }) => {
        const pagination = page.locator("//li[@class='pagination-item']")
        const countPage = await pagination.count()
        if (countPage > 0) {
            let random = getRandomNumber(1, countPage)
            await Promise.all([
                page.waitForNavigation(),
                pagination.nth(random - 1).click()
            ])
            let active = await page.locator("li.pagination-item.is-active").innerText()
            await Promise.all([
                page.waitForNavigation(),
                page.locator("li.pagination-item--direction-previous").click()
            ])
            let newActive = await page.locator("li.pagination-item.is-active").innerText()
            let result = Number(active) > Number(newActive)
            expect.soft(result).toBeTruthy()
            expect.soft(page.url()).toContain(`start=${(newActive - 1) * 8}`)
            await Promise.all([
                page.waitForNavigation(),
                page.locator("li.pagination-item--direction-next").click()
            ])
            active = await page.locator("li.pagination-item.is-active").innerText()
            result = Number(active) > Number(newActive)
            expect.soft(result).toBeTruthy()
            expect(page.url()).toContain(`start=${(active - 1) * 8}`)
        }
    })

    // click the save button, user will be asked to login first
    // FIXME: get rid of the waitfortimeout
    test("bookmark job and login via popup", async ({ page }) => {
        const saveButton = page.locator("div.viewport--viewport-bookmark-large")
        const countSaveButton = await saveButton.count()
        let random = getRandomNumber(1, countSaveButton)
        await Promise.all([
            page.waitForTimeout(3000),
            saveButton.nth(random - 1).click()
        ])
        await Promise.all([
            page.waitForNavigation(),
            page.locator("button:has-text('Log in')").click()
        ])
        await expect(page.locator("h1:has-text('Sign in')")).toBeVisible()
    })

    // click the save button, user can opt to sign up
    // FIXME: get rid of the waitfortimeout
    test("bookmark job and signup via popup", async ({ page }) => {
        const saveButton = page.locator("div.viewport--viewport-bookmark-large")
        const countSaveButton = await saveButton.count()
        let random = getRandomNumber(1, countSaveButton)
        await Promise.all([
            page.waitForTimeout(3000),
            saveButton.nth(random - 1).click()
        ])
        await Promise.all([
            page.waitForNavigation(),
            page.locator("button:has-text('Sign up')").click()
        ])
        await expect(page.locator("h1:has-text('Sign up with')")).toBeVisible()
    })
})

// tests on search job page that requires users to login
test.describe("search job page tests for logged-in users", async () => {
    // login process
    test.beforeEach(async ({ page }) => {
        const login = new CompleteLogin(page)
        await login.studentHubLogin()
    })

    // confirm that the apply now button on the search jobs page is working as expected
    // clicking apply now button opens a new tab
    // test added to tests requiring sign-in because dev frontend needs the user to signin.
    test("apply now button is clickable", async ({ page, context }) => {
        await page.locator("a.button--type-apply").nth(0).waitFor()
        const apply = page.locator("a.button--type-apply")
        const countApply = await apply.count()
        let random = getRandomNumber(1, countApply)
        await Promise.all([
            context.waitForEvent("page"),
            await apply.nth(random - 1).click()
        ])
    })

    // bookmark a job and check that what was saved is correct
    // FIXME: get rid of the waitfortimeout
    test("bookmark job from search jobs page", async ({ page }) => {
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

    // bookmark a job by going to the job detail page first and check that what was saved is correct
    // FIXME: get rid of the waitfortimeout
    test("bookmark job from job detail page", async ({ page }) => {
        const jobs = page.locator("//div[contains(@class, 'OpportunityTeaserstyle__OpportunityListing-sc')]")
        const countJobs = await jobs.count()
        const random = getRandomNumber(1, countJobs)
        const jobListPage = await jobs.nth(random - 1).locator('div.teaser__item--title a').innerText()
        await Promise.all([
            page.waitForNavigation(),
            jobs.nth(random - 1).locator('div.teaser__item--title a').click()
        ])
        const jobOverviewPage = await page.locator("h1.heading").innerText()
        expect.soft(jobOverviewPage).toEqual(jobListPage)
        await page.waitForTimeout(3000)
        await page.locator("div.section--header li.list__item a.save").click()
        await page.waitForTimeout(3000)
        const textButton = await page.locator("div.section--header li.list__item a.save").innerText()
        expect.soft(textButton).toEqual("Saved")
        console.log("Bookmarked job:", jobOverviewPage)
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
        const jobBookmarked = await page.locator("div.teaser__item--title a").innerText()
        expect.soft(jobBookmarked).toEqual(jobOverviewPage)
        console.log("Saved job:", jobBookmarked)
        await page.locator("div.viewport--viewport-bookmark-large a.save").click()
        const message = await page.locator("h1.heading").innerText()
        expect(message).toEqual("No Saved Jobs")
    })

    // bookmark an employer by going to the job detail page first and check that what was saved is correct
    // FIXME: get rid of the waitfortimeout
    test("bookmark employer from job detail page", async ({ page }) => {
        const jobs = page.locator("//div[contains(@class, 'OpportunityTeaserstyle__OpportunityListing-sc')]")
        const countJobs = await jobs.count()
        const random = getRandomNumber(1, countJobs)
        const employerListPage = await jobs.nth(random - 1).locator("div.logo__item p").innerText()
        await Promise.all([
            page.waitForNavigation(),
            jobs.nth(random - 1).locator('div.teaser__item--title a').click()
        ])
        const employerOverviewPage = await page.locator("div.masthead__title h2.heading").innerText()
        expect.soft(employerOverviewPage).toEqual(employerListPage)
        await page.waitForTimeout(3000)
        await page.locator("div.masthead__meta a.save").click()
        await page.waitForTimeout(3000)
        const textButton = await page.locator("div.masthead__meta a.save").innerText()
        expect.soft(textButton).toEqual("Saved")
        console.log("Bookmarked employer:", employerOverviewPage)
        await page.hover("//button[@class='toggle-trigger']//span[contains(@class, 'icon--profile')]")
        await Promise.all([
            page.waitForNavigation(),
            page.locator('text=My Bookmarks').nth(1).click()
        ])
        await Promise.all([
            page.waitForNavigation(),
            page.locator("//div[contains(@class, 'region--sidebar')]//a[text()='Employers']").click()
        ])
        await page.waitForTimeout(3000)
        const employerBookmarked = await page.locator("h2.heading a").innerText()
        expect.soft(employerBookmarked).toEqual(employerOverviewPage)
        console.log("Saved employer:", employerBookmarked)
        await page.locator("div.teaser__item a.save").click()
        const message = await page.locator("h1.heading").innerText()
        expect(message).toEqual("No Saved Employers")
    })
})