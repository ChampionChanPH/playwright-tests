const { test, expect } = require('@playwright/test')
const { getRandomNumber } = require('../../common/common-functions')
const { CompleteLogin } = require("../../common/common-classes")
const data = require("../../common/common-details.json")

// go to the advices page on the student hub
test.beforeEach(async ({ page }) => {
    await page.goto(data.studentHubUrl + "/advice/all")
    await page.waitForSelector("div.viewport--normal a.logo")
})

// tests that can be done on the advices page on the student hub
test.describe('advices page tests', async () => {
    // use the advice type filter and check that the total items matches the total showing on the filter
    test("advice type filter", async ({ page }) => {
        const filter = page.locator("//div[contains(@class, 'viewport viewport--normal')]//div[contains(@class, 'FacetSimplestyle__FacetSimple')]")
        const adviceFilter = filter.locator("//button[@class='toggle-trigger' and contains(div/h4/text(), 'Show me advice for')]//following-sibling::*[@class='toggle-target']")
        const checkVisible = await adviceFilter.locator("//a[contains(@class, 'truncate-trigger')]").isVisible()
        if (checkVisible) await adviceFilter.locator("//a[contains(@class, 'truncate-trigger')]").click()
        const fields = adviceFilter.locator("//div[@class='facet__item']")
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
        console.log("Chosen advice type:", chosenField)
        console.log(totalItems)
    })

    // use the study field filter and check that the total items matches the total showing on the filter
    test("study field filter", async ({ page }) => {
        const filter = page.locator("//div[contains(@class, 'viewport viewport--normal')]//div[contains(@class, 'FacetSimplestyle__FacetSimple')]")
        const studyFieldFilter = filter.locator("//button[@class='toggle-trigger' and contains(div/h4/text(), 'Filter by study field')]//following-sibling::*[@class='toggle-target']")
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

    // use the industry filter and check that the total items matches the total showing on the filter
    test("industry filter", async ({ page }) => {
        const filter = page.locator("//div[contains(@class, 'viewport viewport--normal')]//div[contains(@class, 'FacetSimplestyle__FacetSimple')]")
        const industryFilter = filter.locator("//button[@class='toggle-trigger' and contains(div/h4/text(), 'Filter by industry')]//following-sibling::*[@class='toggle-target']")
        const checkVisible = await industryFilter.locator("//a[contains(@class, 'truncate-trigger')]").isVisible()
        if (checkVisible) await industryFilter.locator("//a[contains(@class, 'truncate-trigger')]").click()
        const fields = industryFilter.locator("//div[@class='facet__item']")
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
        console.log("Chosen industry:", chosenField)
        console.log(totalItems)
    })

    // test the pagination on the advices page
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

    // check that when filtered, the results were filtered correctly
    // ticket: https://prosple.atlassian.net/browse/PFE-2179
    test("sort by filter, name a-z", async ({ page }) => {

    })

    // check that when filtered, the results were filtered correctly
    test("sort by filter, name z-a", async ({ page }) => {

    })

    // click the save button, user will be asked to login first
    // FIXME: get rid of the waitfortimeout
    test("bookmark article and login via popup", async ({ page }) => {
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
    test("bookmark article and signup via popup", async ({ page }) => {
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

    // choose an article on the advices page, click the article title and see that it redirects to the correct detail page
    test("click article title to detail page", async ({ page }) => {
        const advices = page.locator("h3.heading a")
        const countCourses = await advices.count()
        let random = getRandomNumber(1, countCourses)
        const articleTitleListPage = await advices.nth(random - 1).innerText()
        console.log("Chosen article:", articleTitleListPage)
        await Promise.all([
            page.waitForNavigation(),
            advices.nth(random - 1).click()
        ])
        const articleTitleOverviewPage = await page.locator("h1.heading").innerText()
        expect(articleTitleOverviewPage).toEqual(articleTitleListPage)
        console.log("Saved article:", articleTitleOverviewPage)
    })
})

// tests on advices page that requires users to login
test.describe("advices page tests for logged-in users", async () => {
    // login process
    test.beforeEach(async ({ page }) => {
        const login = new CompleteLogin(page)
        await login.studentHubLogin()
    })

    // bookmark an article and check that what was saved is correct
    // FIXME: get rid of the waitfortimeout
    test("bookmark article", async ({ page }) => {
        const saveButton = page.locator("a.save")
        const countSaveButton = await saveButton.count()
        const random = getRandomNumber(1, countSaveButton)
        const articleListPage = await saveButton.nth(random - 1).locator("//ancestor::section[contains(@class, 'AdviceSnippetstyle__AdviceSnippetContent-sc')]/h3[contains(@class, 'heading')]/a").innerText()
        console.log("Bookmarked article:", articleListPage)
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
            page.locator("//div[contains(@class, 'region--sidebar')]//a[text()='Advice']").click()
        ])
        await page.waitForTimeout(3000)
        const articleBookmarked = await page.locator("h3.heading a").innerText()
        expect.soft(articleBookmarked).toEqual(articleListPage)
        console.log("Saved article:", articleBookmarked)
        await page.locator("a.save").click()
        const message = await page.locator("h1.heading").innerText()
        expect(message).toEqual("No Saved Articles")
    })
})