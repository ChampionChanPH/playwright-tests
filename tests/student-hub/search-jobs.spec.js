const { test, expect } = require('@playwright/test')
const { getRandomNumber } = require('../../common/common-functions')
const { CompleteLogin, VirtualExperience } = require("../../common/common-classes")
const data = require("../../common/common-details.json")

// go to the search jobs page on the student hub
test.beforeEach(async ({ page }) => {
    await page.goto(data.studentHubUrl + "/search-jobs?defaults_applied=1")
    await page.waitForSelector("div.viewport--normal a.logo")
})

// tests that can be done on the search job page on the student hub
test.describe('search job page tests', async () => {
    // use the study field filter and check that the filtered results showing correct study field
    test("study field filter", async ({ page }) => {
        const studyFilter = page.locator("//button[contains(@class, 'toggle-trigger') and contains(*//text(),'studying or have qualification in')]//following-sibling::*[@class='toggle-target']")
        const checkVisible = await studyFilter.locator("a.truncate-trigger").isVisible()
        if (checkVisible) await studyFilter.locator("a.truncate-trigger").click()
        const fields = studyFilter.locator("//li[contains(@class, 'Facetstyle__FacetWrapper-sc')]")
        const countFields = await fields.count()
        const random = getRandomNumber(1, countFields)
        const chosenField = await fields.nth(random - 1).locator("label a").innerText()
        console.log(`chosen filter: ${chosenField}`)
        await Promise.all([
            page.waitForNavigation(),
            fields.nth(random - 1).locator("label a").click()
        ])
        await page.locator("span:has-text('Updating Results')").last().waitFor({ state: "hidden" })
        const studyField = /.*(?= \()/.exec(chosenField)
        const total = /(?<=\()\d*/.exec(chosenField)
        // const breadcrumb = await page.locator("a[itemprop=item] span").last().innerText()
        // expect(breadcrumb.toLowerCase()).toEqual(studyField[0].toLowerCase())
        const totalItems = await page.locator("//div[contains(@class, 'Searchstyle__SearchSortContainer-sc')]/p").innerText()
        expect(totalItems).toContain(total[0])
        const jobs = page.locator("//li[contains(@class, 'SearchResultsstyle__SearchResult-sc')]")
        const countJobs = await jobs.count()
        const jobShowMore = jobs.locator("a.truncate-trigger")
        const countShowMore = await jobShowMore.count()
        for (let i = 0; i < countShowMore; i++) {
            await jobShowMore.nth(i).click()
        }
        for (let i = 0; i < countJobs; i++) {
            const footerText = await jobs.nth(i).locator("//ul[contains(@class, 'StudyFieldsstyle__StudyFieldsContainer-sc')]").innerText()
            expect(footerText.toLowerCase()).toContain(studyField[0].toLowerCase())
        }
    })

    // use the job type filter and check that the filtered results showing correct job type
    test("job type filter", async ({ page }) => {
        const jobFilter = page.locator("//button[contains(@class, 'toggle-trigger') and contains(*//text(), 'm looking for')]//following-sibling::*[@class='toggle-target']")
        const checkVisible = await jobFilter.locator("a.truncate-trigger").isVisible()
        if (checkVisible) await jobFilter.locator("a.truncate-trigger").click()
        const fields = jobFilter.locator("//li[contains(@class, 'Facetstyle__FacetWrapper-sc')]")
        const countFields = await fields.count()
        const random = getRandomNumber(1, countFields)
        const chosenField = await fields.nth(random - 1).locator("label a").innerText()
        console.log(`chosen filter: ${chosenField}`)
        await Promise.all([
            page.waitForNavigation(),
            fields.nth(random - 1).locator("label a").click()
        ])
        await page.locator("span:has-text('Updating Results')").last().waitFor({ state: "hidden" })
        const jobType = /.*(?= \()/.exec(chosenField)
        const total = /(?<=\()\d*/.exec(chosenField)
        // const breadcrumb = await page.locator("a[itemprop=item] span").last().innerText()
        // expect(breadcrumb.toLowerCase()).toEqual(jobType[0].toLowerCase())
        const totalItems = await page.locator("//div[contains(@class, 'Searchstyle__SearchSortContainer-sc')]/p").innerText()
        expect(totalItems).toContain(total[0])
        const jobs = page.locator("//li[contains(@class, 'SearchResultsstyle__SearchResult-sc')]")
        const countJobs = await jobs.count()
        for (let i = 0; i < countJobs; i++) {
            const type = await jobs.nth(i).locator("//div[contains(@class, 'JobTeaserstyle__JobTeaserBadge-sc')]/p[@type='default']").innerText()
            expect(type.toLowerCase()).toContain(jobType[0].toLowerCase())
        }
    })

    // use the location filter and check that the total items matches the total showing on the filter
    test("location filter", async ({ page }) => {
        const locationFilter = page.locator("//button[contains(@class, 'toggle-trigger') and contains(*//text(), 'll work in')]//following-sibling::*[@class='toggle-target']")
        const checkVisible = await locationFilter.locator("a.truncate-trigger").isVisible()
        if (checkVisible) await locationFilter.locator("a.truncate-trigger").click()
        const fields = locationFilter.locator("//li[contains(@class, 'Facetstyle__FacetWrapper-sc')]")
        const countFields = await fields.count()
        const random = getRandomNumber(1, countFields)
        const chosenField = await fields.nth(random - 1).locator("label a").innerText()
        console.log(`chosen filter: ${chosenField}`)
        await Promise.all([
            page.waitForNavigation(),
            fields.nth(random - 1).locator("label a").click()
        ])
        await page.locator("span:has-text('Updating Results')").last().waitFor({ state: "hidden" })
        // const location = /.*(?= \()/.exec(chosenField)
        const total = /(?<=\()\d*/.exec(chosenField)
        // const breadcrumb = await page.locator("a[itemprop=item] span").last().innerText()
        // expect.soft(breadcrumb.toLowerCase()).toEqual(location[0].toLowerCase())
        const totalItems = await page.locator("//div[contains(@class, 'Searchstyle__SearchSortContainer-sc')]/p").innerText()
        expect(totalItems).toContain(total[0])
    })

    // use the sectors filter and check that the total items matches the total showing on the filter
    test("sectors filter", async ({ page }) => {
        const sectorFilter = page.locator("//button[contains(@class, 'toggle-trigger') and *//text()='I prefer these sectors']//following-sibling::*[@class='toggle-target']")
        const checkVisible = await sectorFilter.locator("a.truncate-trigger").isVisible()
        if (checkVisible) await sectorFilter.locator("a.truncate-trigger").click()
        const fields = sectorFilter.locator("//li[contains(@class, 'Facetstyle__FacetWrapper-sc')]")
        const countFields = await fields.count()
        const random = getRandomNumber(1, countFields)
        const chosenField = await fields.nth(random - 1).locator("label a").innerText()
        console.log(`chosen filter: ${chosenField}`)
        await Promise.all([
            page.waitForNavigation(),
            fields.nth(random - 1).locator("label a").click()
        ])
        await page.locator("span:has-text('Updating Results')").last().waitFor({ state: "hidden" })
        // const sector = /.*(?= \()/.exec(chosenField)
        const total = /(?<=\()\d*/.exec(chosenField)
        // const breadcrumb = await page.locator("a[itemprop=item] span").last().innerText()
        // expect(breadcrumb.toLowerCase()).toEqual(sector[0].toLowerCase())
        const totalItems = await page.locator("//div[contains(@class, 'Searchstyle__SearchSortContainer-sc')]/p").innerText()
        expect(totalItems).toContain(total[0])
    })

    // virtual experience registration and see if it will be successful
    // registration happens on the search jobs page
    test("successful ve registration on the search jobs page", async ({ page }) => {
        test.skip(data.studentHubUrl == "https://gradaustralia.com.au", "skip if it's a live testing")
        const virtualExperience = new VirtualExperience()
        await virtualExperience.deleteRegistration()
        const jobFilter = page.locator("//button[contains(@class, 'toggle-trigger') and contains(*//text(), 'm looking for')]//following-sibling::*[@class='toggle-target']")
        const checkVisible = await jobFilter.locator("a.truncate-trigger").isVisible()
        if (checkVisible) await jobFilter.locator("a.truncate-trigger").click()
        const fields = jobFilter.locator("//li[contains(@class, 'Facetstyle__FacetWrapper-sc')]")
        await Promise.all([
            page.waitForNavigation(),
            fields.locator("//a[contains(text(), 'Virtual Experience')]").click()
        ])
        await page.locator("span:has-text('Updating Results')").last().waitFor({ state: "hidden" })
        const ve = page.locator("button[data-event-track=cta-ve-register]")
        const veCount = await ve.count()
        const random = getRandomNumber(1, veCount)
        await ve.nth(random - 1).click()
        await Promise.all([
            page.waitForNavigation(),
            page.locator("button:has-text('Log in')").click()
        ])
        await page.fill("input#email", data.studentHubEmail)
        await page.fill("input#password", data.studentHubPass)
        await Promise.all([
            page.waitForNavigation(),
            page.click("button#btn-login")
        ])
        await page.waitForSelector("div.viewport--normal a.logo")
        await page.locator("input#organisation-consent").click()
        await page.locator("button:has-text('Submit')").click()
        await Promise.all([
            page.waitForNavigation(),
            page.locator("a:has-text('Continue to experience.')").click()
        ])
        expect(page.url()).toContain('virtual-experience')
    })

    // virtual experience registration and see if it will be successful
    // registration happens on the ve detail page
    test("successful ve registration on the ve detail page", async ({ page }) => {
        test.skip(data.studentHubUrl == "https://gradaustralia.com.au", "skip if it's a live testing")
        const virtualExperience = new VirtualExperience()
        await virtualExperience.deleteRegistration()
        const jobFilter = page.locator("//button[contains(@class, 'toggle-trigger') and contains(*//text(), 'm looking for')]//following-sibling::*[@class='toggle-target']")
        const checkVisible = await jobFilter.locator("a.truncate-trigger").isVisible()
        if (checkVisible) await jobFilter.locator("a.truncate-trigger").click()
        const fields = jobFilter.locator("//li[contains(@class, 'Facetstyle__FacetWrapper-sc')]")
        await Promise.all([
            page.waitForNavigation(),
            fields.locator("//a[contains(text(), 'Virtual Experience')]").click()
        ])
        await page.locator("span:has-text('Updating Results')").last().waitFor({ state: "hidden" })
        const ve = page.locator("button[data-event-track=cta-ve-register]")
        const veCount = await ve.count()
        const random = getRandomNumber(1, veCount)
        await Promise.all([
            page.waitForNavigation(),
            ve.nth(random - 1).locator("//ancestor::article//*[contains(@class, 'Teaser__TeaserTitlePrimary-sc')]/a").click()
        ])
        await ve.first().click()
        await Promise.all([
            page.waitForNavigation(),
            page.locator("button:has-text('Log in')").click()
        ])
        await page.fill("input#email", data.studentHubEmail)
        await page.fill("input#password", data.studentHubPass)
        await Promise.all([
            page.waitForNavigation(),
            page.click("button#btn-login")
        ])
        await page.waitForSelector("div.viewport--normal a.logo")
        await page.locator("input#organisation-consent").click()
        await page.locator("button:has-text('Submit')").click()
        await Promise.all([
            page.waitForNavigation(),
            page.locator("a:has-text('Continue to experience.')").click()
        ])
        expect(page.url()).toContain('virtual-experience')
    })

    // choose a job on the search jobs page with "Read reviews", click the link and see that it redirects to the correct detail page
    test("click review link to detail page", async ({ page }) => {
        const reviews = page.locator("//div[contains(@class, 'JobTeaserstyle__Reviews-sc')]")
        const countReviews = await reviews.count()
        const random = getRandomNumber(1, countReviews)
        const employerListPage = await reviews.nth(random - 1).locator("//preceding-sibling::*[contains(@class, 'Logo__Wrapper-sc')]/p").innerText()
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
        const jobs = page.locator("//li[contains(@class, 'SearchResultsstyle__SearchResult-sc')]")
        const countJobs = await jobs.count()
        const random = getRandomNumber(1, countJobs)
        const employerListPage = await jobs.nth(random - 1).locator("//p[contains(@class, 'Logo__Title-sc')]").innerText()
        const jobTitleListPage = await jobs.nth(random - 1).locator("//h6[contains(@class, 'Teaser__TeaserTitlePrimary-sc')]").innerText()
        await Promise.all([
            page.waitForNavigation(),
            jobs.nth(random - 1).locator("//h6[contains(@class, 'Teaser__TeaserTitlePrimary-sc')]/a").click()
        ])
        const employerOverviewPage = await page.locator("div.masthead__title h2.heading").innerText()
        const jobTitleOverviewPage = await page.locator("h1.heading").innerText()
        expect(employerOverviewPage).toEqual(employerListPage)
        expect(jobTitleOverviewPage).toEqual(jobTitleListPage)
    })

    // check that the closing in message on jobs is correct
    test("closing in alert message", async ({ page }) => {
        const jobs = page.locator("//li[contains(@class, 'SearchResultsstyle__SearchResult-sc')]")
        const countJobs = await jobs.count()
        for (let i = 0; i < countJobs; i++) {
            const closeAlert = jobs.nth(i).locator("//span[contains(@class, 'Deadlinestyle__LabelWrapper-sc')]")
            const alert = await closeAlert.isVisible()
            if (alert) {
                let result = false
                const alertMessage = await closeAlert.innerText()
                const applyClose = await jobs.nth(i).locator("//div[contains(@class, 'field-label') and text()='Applications Close']/following-sibling::*").innerText()
                const difference = Math.abs(Date.parse(applyClose) - Date.now()) / 1000
                const differenceDays = Math.floor(difference / 86400) + 1
                console.log(`Apply Close: ${applyClose}, Alert: ${alertMessage}`)
                if (Date.parse(applyClose) < Date.now()) {
                    result = alertMessage.includes("Today")
                } else {
                    result = alertMessage.includes(`${differenceDays.toString()} day`) || alertMessage.includes(`${(differenceDays + 1).toString()} day`)
                }
                expect(result).toBeTruthy()
            }
        }
    })

    // check that when filtered, the results were filtered correctly
    test("sort by filter, closing date", async ({ page }) => {
        await Promise.all([
            page.waitForNavigation(),
            page.locator('select').selectOption({ label: "Closing Date" })
        ])
        const pagination = page.locator("li a[aria-current='false']")
        const countPage = await pagination.count()
        if (countPage > 0) {
            let random = getRandomNumber(1, countPage)
            await Promise.all([
                page.waitForNavigation(),
                pagination.nth(random - 1).click()
            ])
            await page.locator("span:has-text('Updating Results')").last().waitFor({ state: "hidden" })
            let sorted = true
            const jobs = page.locator("//li[contains(@class, 'SearchResultsstyle__SearchResult-sc')]")
            const jobContents = await jobs.locator("//*[contains(@class, 'field-label') and text()='Applications Close']/following-sibling::*").allTextContents()
            const sponsored = await jobs.locator("//div[contains(@class, 'Sponsoredstyle__Sponsored-sc')]").count()
            console.log(jobContents)
            console.log(page.url())
            for (let i = sponsored; i < jobContents.length - 1; i++) {
                if (Date.parse(jobContents[i]) > Date.parse(jobContents[i + 1])) {
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
        const jobsCount = await page.locator("//li[contains(@class, 'SearchResultsstyle__SearchResult-sc')]").count()
        const pagination = page.locator("li a[aria-current='false']")
        const countPage = await pagination.count()
        if (countPage > 0) {
            const random = getRandomNumber(1, countPage)
            await Promise.all([
                page.waitForNavigation(),
                pagination.nth(random - 1).click()
            ])
            await page.locator("span:has-text('Updating Results')").last().waitFor({ state: "hidden" })
            let active = await page.locator("li a[aria-current='true']").innerText()
            console.log(active)
            await Promise.all([
                page.waitForNavigation(),
                page.locator("//li/a[span[contains(@class, 'icon--chevron-left')]]").click()
            ])
            await page.locator("span:has-text('Updating Results')").last().waitFor({ state: "hidden" })
            const newActive = await page.locator("li a[aria-current='true']").innerText()
            console.log(newActive)
            let result = Number(active) > Number(newActive)
            expect.soft(result).toBeTruthy()
            if (newActive == "1") {
                expect.soft(page.url()).not.toContain(`start=`)
            } else {
                expect.soft(page.url()).toContain(`start=${(newActive - 1) * jobsCount}`)
            }
            await Promise.all([
                page.waitForNavigation(),
                page.locator("//li/a[span[contains(@class, 'icon--chevron-right')]]").click()
            ])
            await page.locator("span:has-text('Updating Results')").last().waitFor({ state: "hidden" })
            active = await page.locator("li a[aria-current='true']").innerText()
            console.log(active)
            result = Number(active) > Number(newActive)
            expect.soft(result).toBeTruthy()
            expect(page.url()).toContain(`start=${(active - 1) * jobsCount}`)
        }
    })

    // click the save button, user will be asked to login first
    test("bookmark job and login via popup", async ({ page }) => {
        const saveButton = page.locator("button.save")
        const countSaveButton = await saveButton.count()
        const random = getRandomNumber(1, countSaveButton)
        await saveButton.nth(random - 1).click()
        await Promise.all([
            page.waitForNavigation(),
            page.locator("button:has-text('Log in')").click()
        ])
        await expect(page.locator("h1:has-text('Sign in')")).toBeVisible()
    })

    // click the save button, user can opt to sign up
    test("bookmark job and signup via popup", async ({ page }) => {
        const saveButton = page.locator("button.save")
        const countSaveButton = await saveButton.count()
        const random = getRandomNumber(1, countSaveButton)
        await saveButton.nth(random - 1).click()
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
            apply.nth(random - 1).click()
        ])
    })

    // virtual experience registration and see if it will be successful
    // registration happens on the search jobs page
    test("successful ve registration on the search jobs page", async ({ page }) => {
        test.skip(data.studentHubUrl == "https://gradaustralia.com.au", "skip if it's a live testing")
        const virtualExperience = new VirtualExperience()
        await virtualExperience.deleteRegistration()
        const jobFilter = page.locator("//button[contains(@class, 'toggle-trigger') and contains(*//text(), 'm looking for')]//following-sibling::*[@class='toggle-target']")
        const checkVisible = await jobFilter.locator("a.truncate-trigger").isVisible()
        if (checkVisible) await jobFilter.locator("a.truncate-trigger").click()
        const fields = jobFilter.locator("//li[contains(@class, 'Facetstyle__FacetWrapper-sc')]")
        await Promise.all([
            page.waitForNavigation(),
            fields.locator("//a[contains(text(), 'Virtual Experience')]").click()
        ])
        await page.locator("span:has-text('Updating Results')").last().waitFor({ state: "hidden" })
        const ve = page.locator("a[data-event-track=cta-ve-register]")
        const veCount = await ve.count()
        const random = getRandomNumber(1, veCount)
        await ve.nth(random - 1).click()
        await page.locator("input#organisation-consent").click()
        await page.locator("button:has-text('Submit')").click()
        await Promise.all([
            page.waitForNavigation(),
            page.locator("a:has-text('Continue to experience.')").click()
        ])
        expect(page.url()).toContain('virtual-experience')
    })

    // virtual experience registration and see if it will be successful
    // registration happens on the ve detail page
    test("successful ve registration on the ve detail page", async ({ page }) => {
        test.skip(data.studentHubUrl == "https://gradaustralia.com.au", "skip if it's a live testing")
        const virtualExperience = new VirtualExperience()
        await virtualExperience.deleteRegistration()
        const jobFilter = page.locator("//button[contains(@class, 'toggle-trigger') and contains(*//text(), 'm looking for')]//following-sibling::*[@class='toggle-target']")
        const checkVisible = await jobFilter.locator("a.truncate-trigger").isVisible()
        if (checkVisible) await jobFilter.locator("a.truncate-trigger").click()
        const fields = jobFilter.locator("//li[contains(@class, 'Facetstyle__FacetWrapper-sc')]")
        await Promise.all([
            page.waitForNavigation(),
            fields.locator("//a[contains(text(), 'Virtual Experience')]").click()
        ])
        await page.locator("span:has-text('Updating Results')").last().waitFor({ state: "hidden" })
        const ve = page.locator("a[data-event-track=cta-ve-register]")
        const veCount = await ve.count()
        const random = getRandomNumber(1, veCount)
        await Promise.all([
            page.waitForNavigation(),
            ve.nth(random - 1).locator("//ancestor::article//*[contains(@class, 'Teaser__TeaserTitlePrimary-sc')]/a").click()
        ])
        await ve.first().click()
        await page.locator("input#organisation-consent").click()
        await page.locator("button:has-text('Submit')").click()
        await Promise.all([
            page.waitForNavigation(),
            page.locator("a:has-text('Continue to experience.')").click()
        ])
        expect(page.url()).toContain('virtual-experience')
    })

    // bookmark a job and check that what was saved is correct
    // FIXME: get rid of the waitfortimeout
    test("bookmark job from search jobs page", async ({ page }) => {
        const saveButton = page.locator("a.save")
        const countSaveButton = await saveButton.count()
        const random = getRandomNumber(1, countSaveButton)
        const employerListPage = await saveButton.nth(random - 1).locator("//ancestor::li[contains(@class, 'SearchResultsstyle__SearchResult-sc')]//div[contains(@class, 'Logo__Wrapper-sc')]/p").innerText()
        const jobListPage = await saveButton.nth(random - 1).locator("//ancestor::li[contains(@class, 'SearchResultsstyle__SearchResult-sc')]//a[contains(@class, 'JobTeaserstyle__JobTeaserTitleLink-sc')]").innerText()
        console.log("bookmarked employer:", employerListPage)
        console.log("bookmarked job:", jobListPage)
        await saveButton.last().waitFor({ state: "visible" })
        await saveButton.nth(random - 1).click()
        await saveButton.nth(random - 1).locator("span:has-text('Saved')").waitFor()
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
        const jobBookmarked = await page.locator("//*[contains(@class, 'OpportunityTeaserstyle__OpportunityTitle-sc')]").innerText()
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
        const jobs = page.locator("//li[contains(@class, 'SearchResultsstyle__SearchResult-sc')]")
        const countJobs = await jobs.count()
        const random = getRandomNumber(1, countJobs)
        const jobListPage = await jobs.nth(random - 1).locator("//a[contains(@class, 'JobTeaserstyle__JobTeaserTitleLink-sc')]").innerText()
        await Promise.all([
            page.waitForNavigation(),
            jobs.nth(random - 1).locator("//a[contains(@class, 'JobTeaserstyle__JobTeaserTitleLink-sc')]").click()
        ])
        const jobOverviewPage = await page.locator("h1.heading").innerText()
        expect.soft(jobOverviewPage).toEqual(jobListPage)
        const saveButton = page.locator("div.section--header li.list__item a.save")
        await saveButton.waitFor({ state: "visible" })
        await saveButton.click()
        await saveButton.locator("span:has-text('Saved')").waitFor()
        const textButton = await saveButton.innerText()
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
        const jobs = page.locator("//li[contains(@class, 'SearchResultsstyle__SearchResult-sc')]")
        const countJobs = await jobs.count()
        const random = getRandomNumber(1, countJobs)
        const employerListPage = await jobs.nth(random - 1).locator("//p[contains(@class, 'Logo__Title-sc')]").innerText()
        await Promise.all([
            page.waitForNavigation(),
            jobs.nth(random - 1).locator("//a[contains(@class, 'JobTeaserstyle__JobTeaserTitleLink-sc')]").click()
        ])
        const employerOverviewPage = await page.locator("div.masthead__title h2.heading").innerText()
        expect.soft(employerOverviewPage).toEqual(employerListPage)
        const saveButton = page.locator("div.masthead__meta a.save")
        await saveButton.waitFor({ state: "visible" })
        await saveButton.click()
        await saveButton.locator("span:has-text('Saved')").waitFor()
        const textButton = await saveButton.innerText()
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