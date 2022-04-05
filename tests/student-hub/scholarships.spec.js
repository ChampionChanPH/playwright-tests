const { test, expect } = require('@playwright/test')
const { getRandomNumber } = require('../../common/common-functions')
const { CompleteLogin } = require("../../common/common-classes")
const data = require("../../common/common-details.json")

// go to the scholarships page in the student hub
test.beforeEach(async ({ page }) => {
    await page.goto(data.studentHubUrl + "/scholarships")
    await page.waitForSelector("div.viewport--normal a.logo")
})

// tests that can be done on the scholarships page on the student hub
test.describe('scholarships page tests', async () => {
    // use the study field filter and then check that all filtered results shows the correct study field
    test("study field filter", async ({ page }) => {
        const filter = page.locator("//div[contains(@class, 'viewport viewport--normal')]//div[contains(@class, 'FacetSimplestyle__FacetSimple')]")
        const studyFieldFilter = filter.locator("//button[@class='toggle-trigger' and contains(div/h4/text(), 'm studying')]//following-sibling::*[@class='toggle-target']")
        const checkVisible = await studyFieldFilter.locator("//a[contains(@class, 'truncate-trigger')]").isVisible()
        if (checkVisible) await studyFieldFilter.locator("//a[contains(@class, 'truncate-trigger')]").click()
        const fields = studyFieldFilter.locator("//div[@class='facet__item']")
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
        expect.soft(breadcrumb.toLowerCase()).toEqual(studyField[0].toLowerCase())
        const totalItems = await page.locator("div.search__meta p").innerText()
        expect(totalItems).toContain(total[0])
        console.log("Chosen study field:", chosenField)
        console.log(totalItems)
    })

    // use the degree type filter and check that the total items matches the total showing on the filter
    test("degree type filter", async ({ page }) => {
        const filter = page.locator("//div[contains(@class, 'viewport viewport--normal')]//div[contains(@class, 'FacetSimplestyle__FacetSimple')]")
        const degreeTypeFilter = filter.locator("//button[@class='toggle-trigger' and contains(div/h4/text(), 'At this level')]//following-sibling::*[@class='toggle-target']")
        const checkVisible = await degreeTypeFilter.locator("//a[contains(@class, 'truncate-trigger')]").isVisible()
        if (checkVisible) await degreeTypeFilter.locator("//a[contains(@class, 'truncate-trigger')]").click()
        const fields = degreeTypeFilter.locator("//div[@class='facet__item']")
        const countFields = await fields.count()
        let random = getRandomNumber(1, countFields)
        await Promise.all([
            page.waitForNavigation(),
            fields.nth(random - 1).locator("//label/a").click()
        ])
        const chosenField = await fields.locator("//div[input[@class='is-checked']]/following-sibling::label").innerText()
        let degreeType = /.*(?= \()/.exec(chosenField)
        let total = /(?<=\()\d*/.exec(chosenField)
        const breadcrumb = await page.locator("a[itemprop=item] span").last().innerText()
        expect.soft(breadcrumb.toLowerCase()).toEqual(degreeType[0].toLowerCase())
        const totalItems = await page.locator("div.search__meta p").innerText()
        expect(totalItems).toContain(total[0])
        console.log("Chosen degree type:", chosenField)
        console.log(totalItems)
    })

    // use the location filter and check that the total items matches the total showing on the filter
    test("location filter", async ({ page }) => {
        const filter = page.locator("//div[contains(@class, 'viewport viewport--normal')]//div[contains(@class, 'FacetSimplestyle__FacetSimple')]")
        const locationFilter = filter.locator("//button[@class='toggle-trigger' and contains(div/h4/text(), 'In this location')]//following-sibling::*[@class='toggle-target']")
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
        console.log("Chosen location:", chosenField)
        console.log(totalItems)
    })

    // use the institution filter and then check that all filtered results shows the correct institution
    test("institution filter", async ({ page }) => {
        const filter = page.locator("//div[contains(@class, 'viewport viewport--normal')]//div[contains(@class, 'FacetSimplestyle__FacetSimple')]")
        const institutionFilter = filter.locator("//button[@class='toggle-trigger' and contains(div/h4/text(), 'At this institution')]//following-sibling::*[@class='toggle-target']")
        await institutionFilter.locator("//a[contains(@class, 'truncate-trigger')]").click()
        const fields = institutionFilter.locator("//div[@class='facet__item']")
        const countFields = await fields.count()
        let random = getRandomNumber(1, countFields)
        await Promise.all([
            page.waitForNavigation(),
            fields.nth(random - 1).locator("//label/a").click()
        ])
        const chosenField = await fields.locator("//div[input[@class='is-checked']]/following-sibling::label").innerText()
        let institution = /.*(?= \()/.exec(chosenField)
        let total = /(?<=\()\d*/.exec(chosenField)
        const breadcrumb = await page.locator("a[itemprop=item] span").last().innerText()
        expect(breadcrumb.toLowerCase()).toEqual(institution[0].toLowerCase())
        const totalItems = await page.locator("div.search__meta p").innerText()
        console.log("Chosen institution:", chosenField)
        expect(totalItems).toContain(total[0])
        const scholarships = page.locator("//div[contains(@class, 'ScholarshipTeaserstyle__ScholarshipListing-sc')]")
        const countScholarships = await scholarships.count()
        for (let i = 0; i < countScholarships; i++) {
            const scholarshipInstitution = await scholarships.nth(i).locator("div.logo__item p").innerText()
            console.log(scholarshipInstitution)
            expect(scholarshipInstitution.toLowerCase()).toContain(institution[0].toLowerCase())
        }
    })

    // use the study mode filter and check that the total items matches the total showing on the filter
    test("study mode filter", async ({ page }) => {
        const filter = page.locator("//div[contains(@class, 'viewport viewport--normal')]//div[contains(@class, 'FacetSimplestyle__FacetSimple')]")
        const studyModeFilter = filter.locator("//button[@class='toggle-trigger' and contains(div/h4/text(), 'attendance mode')]//following-sibling::*[@class='toggle-target']")
        const checkVisible = await studyModeFilter.locator("//a[contains(@class, 'truncate-trigger')]").isVisible()
        if (checkVisible) await studyModeFilter.locator("//a[contains(@class, 'truncate-trigger')]").click()
        const fields = studyModeFilter.locator("//div[@class='facet__item']")
        const countFields = await fields.count()
        let random = getRandomNumber(1, countFields)
        await Promise.all([
            page.waitForNavigation(),
            fields.nth(random - 1).locator("//label/a").click()
        ])
        const chosenField = await fields.locator("//div[input[@class='is-checked']]/following-sibling::label").innerText()
        let studyMode = /.*(?= \()/.exec(chosenField)
        let total = /(?<=\()\d*/.exec(chosenField)
        const breadcrumb = await page.locator("a[itemprop=item] span").last().innerText()
        expect.soft(breadcrumb.toLowerCase()).toEqual(studyMode[0].toLowerCase())
        const totalItems = await page.locator("div.search__meta p").innerText()
        expect(totalItems).toContain(total[0])
        console.log("Chosen study mode:", chosenField)
        console.log(totalItems)
    })

    // search by keyword filter
    test("search by keyword filter", async ({ page }) => {
        let count = 0
        const keyword = "University Scholarship"
        const filter = page.locator("//div[contains(@class, 'viewport viewport--normal')]//div[contains(@class, 'FacetInputTextstyle__FacetInputText-sc')]")
        const keywordFilter = filter.locator("//button[@class='toggle-trigger' and h4/text()='Search by keyword']/following-sibling::*[@class='toggle-target']")
        await keywordFilter.locator("input[name=facet--input-text--fulltext]").fill(keyword)
        await Promise.all([
            page.waitForNavigation(),
            keywordFilter.locator("button span.icon--search").click()
        ])
        const scholarships = await page.locator("h2.heading a").allInnerTexts()
        for (const Scholarship of scholarships) {
            if (Scholarship.toLowerCase().includes(keyword.toLowerCase())) count++
        }
        expect.soft(count).toBeGreaterThan(0)
        console.log("Chosen scholarship:", scholarships)
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

    // choose a scholarship on the scholarships page, click the scholarship title and see that it redirects to the correct detail page
    test("click scholarship title to detail page", async ({ page }) => {
        const scholarships = page.locator("//div[contains(@class, 'ScholarshipTeaserstyle__ScholarshipListing-sc')]")
        const countScholarships = await scholarships.count()
        let random = getRandomNumber(1, countScholarships)
        const institutionListPage = await scholarships.nth(random - 1).locator("div.logo__item p").innerText()
        const scholarshipListPage = await scholarships.nth(random - 1).locator("div.teaser__item--title a").innerText()
        console.log("Chosen institution:", institutionListPage)
        console.log("Chosen scholarship:", scholarshipListPage)
        await Promise.all([
            page.waitForNavigation(),
            scholarships.nth(random - 1).locator("div.teaser__item--title a").click()
        ])
        const institutionOverviewPage = await page.locator("div.masthead__title h2.heading").innerText()
        const scholarshipOverviewPage = await page.locator("h1.heading").innerText()
        expect(institutionOverviewPage).toEqual(institutionListPage)
        expect(scholarshipOverviewPage).toEqual(scholarshipListPage)
        console.log("Institution detail page:", institutionOverviewPage)
        console.log("Scholarship detail page:", scholarshipOverviewPage)
    })

    // confirm that the website button on the search jobs page is working as expected
    // clicking apply now button opens a new tab that's why it checks for 2 pages
    // FIXME: get rid of the waitfortimeout
    test("website button is clickable", async ({ page, context }) => {
        await page.locator("a.button--type-apply").nth(0).waitFor()
        const apply = page.locator("a.button--type-apply")
        const countApply = await apply.count()
        let random = getRandomNumber(1, countApply)
        await apply.nth(random - 1).click()
    })

    // click the save button, user will be asked to login first
    // FIXME: get rid of the waitfortimeout
    test("bookmark job and login via popup", async ({ page }) => {
        const saveButton = page.locator("button.button.save")
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
        const saveButton = page.locator("button.button.save")
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

// tests on scholarships page that requires users to login
test.describe("scholarships page tests for logged-in users", async () => {
    // login process
    test.beforeEach(async ({ page }) => {
        const login = new CompleteLogin(page)
        await login.studentHubLogin()
    })

    // bookmark a scholarship and check that what was saved is correct
    // FIXME: get rid of the waitfortimeout
    test("bookmark scholarship from scholarships page", async ({ page }) => {
        const saveButton = page.locator("div.teaser__item--save a.save")
        const countSaveButton = await saveButton.count()
        const random = getRandomNumber(1, countSaveButton)
        const scholarshipListPage = await saveButton.nth(random - 1).locator("//ancestor::div[contains(@class, 'ScholarshipTeaserstyle__ScholarshipListing-sc')]//h2[contains(@class, 'heading')]/a").innerText()
        console.log("Bookmarked scholarship:", scholarshipListPage)
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
            page.locator("//div[contains(@class, 'region--sidebar')]//a[text()='Scholarships']").click()
        ])
        await page.waitForTimeout(3000)
        const scholarshipBookmarked = await page.locator("h2.heading a").innerText()
        expect.soft(scholarshipBookmarked).toEqual(scholarshipListPage)
        console.log("Saved institution:", scholarshipBookmarked)
        await page.locator("div.teaser__item a.save").click()
        const message = await page.locator("h1.heading").innerText()
        expect(message).toEqual("No Saved Scholarships")
    })

    // bookmark a scholarship and check that what was saved is correct
    // FIXME: get rid of the waitfortimeout
    test("bookmark scholarship from scholarship detail page", async ({ page }) => {
        const scholarships = page.locator("//div[contains(@class, 'ScholarshipTeaserstyle__ScholarshipListing-sc')]")
        const countScholarships = await scholarships.count()
        const random = getRandomNumber(1, countScholarships)
        const scholarshipListPage = await scholarships.nth(random - 1).locator("h2.heading a").innerText()
        await Promise.all([
            page.waitForNavigation(),
            scholarships.nth(random - 1).locator('h2.heading a').click()
        ])
        const scholarshipOverviewPage = await page.locator("h1.heading").innerText()
        expect.soft(scholarshipOverviewPage).toEqual(scholarshipListPage)
        await page.waitForTimeout(3000)
        await page.locator("li.list__item a.save").click()
        await page.waitForTimeout(3000)
        const textButton = await page.locator("li.list__item a.save").innerText()
        expect.soft(textButton).toEqual("Saved")
        console.log("Bookmarked scholarship:", scholarshipOverviewPage)
        await page.hover("//button[@class='toggle-trigger']//span[contains(@class, 'icon--profile')]")
        await Promise.all([
            page.waitForNavigation(),
            page.locator('text=My Bookmarks').nth(1).click()
        ])
        await Promise.all([
            page.waitForNavigation(),
            page.locator("//div[contains(@class, 'region--sidebar')]//a[text()='Scholarships']").click()
        ])
        await page.waitForTimeout(3000)
        const scholarshipBookmarked = await page.locator("h2.heading a").innerText()
        expect.soft(scholarshipBookmarked).toEqual(scholarshipOverviewPage)
        console.log("Saved scholarship:", scholarshipBookmarked)
        await page.locator("div.teaser__item a.save").click()
        const message = await page.locator("h1.heading").innerText()
        expect(message).toEqual("No Saved Scholarships")
    })

    // bookmark institution by going to the scholarships page first and check that what was saved is correct
    // FIXME: get rid of the waitfortimeout
    test("bookmark institution from scholarship detail page", async ({ page }) => {
        const scholarships = page.locator("//div[contains(@class, 'ScholarshipTeaserstyle__ScholarshipListing-sc')]")
        const countScholarships = await scholarships.count()
        const random = getRandomNumber(1, countScholarships)
        const institutionScholarshipPage = await scholarships.nth(random - 1).locator("div.logo__item p").innerText()
        await Promise.all([
            page.waitForNavigation(),
            scholarships.nth(random - 1).locator('h2.heading a').click()
        ])
        const institutionOverviewPage = await page.locator("div.masthead__title h2.heading").innerText()
        expect.soft(institutionOverviewPage).toEqual(institutionScholarshipPage)
        await page.waitForTimeout(3000)
        await page.locator("div.masthead__meta a.save").click()
        await page.waitForTimeout(3000)
        const textButton = await page.locator("div.masthead__meta a.save").innerText()
        expect.soft(textButton).toEqual("Saved")
        console.log("Bookmarked institution:", institutionOverviewPage)
        await page.hover("//button[@class='toggle-trigger']//span[contains(@class, 'icon--profile')]")
        await Promise.all([
            page.waitForNavigation(),
            page.locator('text=My Bookmarks').nth(1).click()
        ])
        await Promise.all([
            page.waitForNavigation(),
            page.locator("//div[contains(@class, 'region--sidebar')]//a[text()='Institutions']").click()
        ])
        await page.waitForTimeout(3000)
        const institutionBookmarked = await page.locator("h2.heading a").innerText()
        expect.soft(institutionBookmarked).toEqual(institutionOverviewPage)
        console.log("Saved institution:", institutionBookmarked)
        await page.locator("div.teaser__item a.save").click()
        const message = await page.locator("h1.heading").innerText()
        expect(message).toEqual("No Saved Institutions")
    })
})