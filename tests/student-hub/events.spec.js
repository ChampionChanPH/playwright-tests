const { test, expect } = require('@playwright/test')
const { getRandomNumber } = require('../../common/common-functions')
const { CompleteLogin } = require("../../common/common-classes")
const data = require("../../common/common-details.json")

// go to the events page on the student hub
test.beforeEach(async ({ page }) => {
    await page.goto(data.studentHubUrl + "/events")
    await page.waitForSelector("div.viewport--normal a.logo")
})

// tests that can be done on the events page on the student hub
test.describe('events page tests', async () => {
    // use the event type filter and check that the total items matches the total showing on the filter
    test("event type filter", async ({ page }) => {

    })

    // use the location filter and check that the total items matches the total showing on the filter
    test("location filter", async ({ page }) => {

    })

    // use the degree filter and check that the total items matches the total showing on the filter
    test("degree filter", async ({ page }) => {

    })

    // use the industry sector filter and check that the total items matches the total showing on the filter
    test("industry sector filter", async ({ page }) => {

    })

    // choose an event, click the "View details" button and see that it redirects to the correct detail page
    test("click view details button to detail page", async ({ page }) => {

    })

    // choose an event, click the event title and see that it redirects to the correct detail page
    test("click event title to detail page", async ({ page }) => {

    })

    // click the save button, user will be asked to login first
    // FIXME: get rid of the waitfortimeout
    test("bookmark event and login via popup", async ({ page }) => {

    })

    // click the save button, user can opt to sign up
    // FIXME: get rid of the waitfortimeout
    test("bookmark event and signup via popup", async ({ page }) => {

    })
})

// tests on events page that requires users to login
test.describe("events page tests for logged-in users", async () => {
    // login process
    test.beforeEach(async ({ page }) => {
        const login = new CompleteLogin(page)
        await login.studentHubLogin()
    })

    // bookmark an event and check that what was saved is correct
    // FIXME: get rid of the waitfortimeout
    test("bookmark job", async ({ page }) => {

    })
})