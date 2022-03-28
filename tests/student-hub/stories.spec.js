const { test, expect } = require('@playwright/test')
const { getRandomNumber } = require('../../common/common-functions')
const { CompleteLogin } = require("../../common/common-classes")
const data = require("../../common/common-details.json")

// go to the courses page on the student hub
test.beforeEach(async ({ page }) => {
    await page.goto(data.studentHubUrl + "/profiles")
    await page.waitForSelector("div.viewport--normal a.logo")
})

// tests that can be done on the courses page on the student hub
test.describe('courses page tests', async () => {
    // use the profile type filter and check that the filtered results showing correct profile type
    test("profile type filter", async ({ page }) => {

    })

    // use the sector filter and check that the total items matches the total showing on the filter
    test("sector filter", async ({ page }) => {

    })

    // use the studied at filter and check that the total items matches the total showing on the filter
    test("studied at filter", async ({ page }) => {

    })

    // use the location filter and check that the total items matches the total showing on the filter
    test("location filter", async ({ page }) => {

    })

    // check that when filtered, the results were filtered correctly
    test("sort by filter, name a-z", async ({ page }) => {

    })

    // check that when filtered, the results were filtered correctly
    test("sort by filter, name z-a", async ({ page }) => {

    })

    // choose a story on the stories page, click the "Read full story" button and see that it redirects to the correct detail page
    test("click read full story button to detail page", async ({ page }) => {

    })

    // choose a story on the stories page, click the name of the person featured and see that it redirects to the correct detail page
    test("click name to detail page", async ({ page }) => {

    })

    // test the pagination on the stories page
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
})