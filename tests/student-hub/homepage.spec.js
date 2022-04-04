const { test, expect } = require('@playwright/test')
const { getRandomNumber } = require('../../common/common-functions')
const data = require("../../common/common-details.json")

test.beforeEach(async ({ page }) => {
    await page.goto(data.studentHubUrl)
    await page.waitForSelector("div.viewport--normal a.logo")
})

// tests for the student hub homepage
test.describe('homepage tests', async () => {
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

    // choose options from the dropdowns and check that the search button will redirect to a different page
    test.slow('confirm dropdowns and search button is working', async ({ page }) => {
        const [homepage_response] = await Promise.all([
            page.waitForResponse(data.studentHubUrl),
            page.goto(data.studentHubUrl),
        ])
        expect.soft(homepage_response.status()).toBeLessThan(400)
        const [jobs_response] = await Promise.all([
            page.waitForResponse(data.studentHubUrl + "/search-jobs"),
            page.goto(data.studentHubUrl + "/search-jobs"),
        ])
        expect.soft(jobs_response.status()).toBeLessThan(400)
        const [employers_response] = await Promise.all([
            page.waitForResponse(data.studentHubUrl + "/graduate-employers"),
            page.goto(data.studentHubUrl + "/graduate-employers"),
        ])
        expect.soft(employers_response.status()).toBeLessThan(400)
        const [courses_response] = await Promise.all([
            page.waitForResponse(data.studentHubUrl + "/courses"),
            page.goto(data.studentHubUrl + "/courses"),
        ])
        expect.soft(courses_response.status()).toBeLessThan(400)
        const [scholarships_response] = await Promise.all([
            page.waitForResponse(data.studentHubUrl + "/scholarships"),
            page.goto(data.studentHubUrl + "/scholarships"),
        ])
        expect.soft(scholarships_response.status()).toBeLessThan(400)
        const [institutions_response] = await Promise.all([
            page.waitForResponse(data.studentHubUrl + "/institutions"),
            page.goto(data.studentHubUrl + "/institutions"),
        ])
        expect.soft(institutions_response.status()).toBeLessThan(400)
        const [articles_response] = await Promise.all([
            page.waitForResponse(data.studentHubUrl + "/advice/all"),
            page.goto(data.studentHubUrl + "/advice/all"),
        ])
        expect.soft(articles_response.status()).toBeLessThan(400)
        const [events_response] = await Promise.all([
            page.waitForResponse(data.studentHubUrl + "/events"),
            page.goto(data.studentHubUrl + "/events"),
        ])
        expect.soft(events_response.status()).toBeLessThan(400)
        const [stories_response] = await Promise.all([
            page.waitForResponse(data.studentHubUrl + "/profiles"),
            page.goto(data.studentHubUrl + "/profiles"),
        ])
        expect.soft(stories_response.status()).toBeLessThan(400)
    })
})