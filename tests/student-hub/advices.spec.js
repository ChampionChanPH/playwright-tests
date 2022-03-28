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

    })

    // use the study field filter and check that the total items matches the total showing on the filter
    test("study field filter", async ({ page }) => {

    })

    // use the industry filter and check that the total items matches the total showing on the filter
    test("industry filter", async ({ page }) => {

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
            let result = active > newActive
            expect.soft(result).toBeTruthy()
            expect.soft(page.url()).toContain(`start=${(newActive - 1) * 8}`)
            await Promise.all([
                page.waitForNavigation(),
                page.locator("li.pagination-item--direction-next").click()
            ])
            active = await page.locator("li.pagination-item.is-active").innerText()
            result = active > newActive
            expect.soft(result).toBeTruthy()
            expect(page.url()).toContain(`start=${(active - 1) * 8}`)
        }
    })

    // check that when filtered, the results were filtered correctly
    test("sort by filter, name a-z", async ({ page }) => {

    })

    // check that when filtered, the results were filtered correctly
    test("sort by filter, name z-a", async ({ page }) => {

    })

    // click the save button, user will be asked to login first
    // FIXME: get rid of the waitfortimeout
    test("bookmark article and login via popup", async ({ page }) => {

    })

    // click the save button, user can opt to sign up
    // FIXME: get rid of the waitfortimeout
    test("bookmark article and signup via popup", async ({ page }) => {

    })

    // choose an article on the advices page, click the article title and see that it redirects to the correct detail page
    test("click article title to detail page", async ({ page }) => {

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

    })
})