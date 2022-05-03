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
        const filter = page.locator("//div[contains(@class, 'viewport viewport--normal')]//div[contains(@class, 'FacetSimplestyle__FacetSimple')]")
        const eventFilter = filter.locator("//button[@class='toggle-trigger' and contains(div/h4/text(), 'Show me these types of events')]//following-sibling::*[@class='toggle-target']")
        // await eventFilter.locator("//a[contains(@class, 'truncate-trigger')]").click()
        const fields = eventFilter.locator("//div[@class='facet__item']")
        const countFields = await fields.count()
        let random = getRandomNumber(1, countFields)
        await Promise.all([
            page.waitForNavigation(),
            fields.nth(random - 1).locator("//label/a").click()
        ])
        const chosenField = await fields.locator("//div[input[@class='is-checked']]/following-sibling::label").innerText()
        let event = /.*(?= \()/.exec(chosenField)
        let total = /(?<=\()\d*/.exec(chosenField)
        const breadcrumb = await page.locator("a[itemprop=item] span").last().innerText()
        expect.soft(breadcrumb.toLowerCase()).toEqual(event[0].toLowerCase())
        const totalItems = await page.locator("div.search__meta p").innerText()
        expect(totalItems).toContain(total[0])
        console.log("Chosen event type:", chosenField)
        console.log(totalItems)
    })

    // use the location filter and check that the total items matches the total showing on the filter
    test("location filter", async ({ page }) => {
        const filter = page.locator("//div[contains(@class, 'viewport viewport--normal')]//div[contains(@class, 'FacetSimplestyle__FacetSimple')]")
        const locationFilter = filter.locator("//button[@class='toggle-trigger' and contains(div/h4/text(), 'In these locations')]//following-sibling::*[@class='toggle-target']")
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

    // use the degree filter and check that the total items matches the total showing on the filter
    test("degree filter", async ({ page }) => {
        const filter = page.locator("//div[contains(@class, 'viewport viewport--normal')]//div[contains(@class, 'FacetSimplestyle__FacetSimple')]")
        const degreeFilter = filter.locator("//button[@class='toggle-trigger' and contains(div/h4/text(), 'Filter by degree')]//following-sibling::*[@class='toggle-target']")
        const checkVisible = await degreeFilter.locator("//a[contains(@class, 'truncate-trigger')]").isVisible()
        if (checkVisible) await degreeFilter.locator("//a[contains(@class, 'truncate-trigger')]").click()
        const fields = degreeFilter.locator("//div[@class='facet__item']")
        const countFields = await fields.count()
        let random = getRandomNumber(1, countFields)
        await Promise.all([
            page.waitForNavigation(),
            fields.nth(random - 1).locator("//label/a").click()
        ])
        const chosenField = await fields.locator("//div[input[@class='is-checked']]/following-sibling::label").innerText()
        let degree = /.*(?= \()/.exec(chosenField)
        let total = /(?<=\()\d*/.exec(chosenField)
        const breadcrumb = await page.locator("a[itemprop=item] span").last().innerText()
        expect.soft(breadcrumb.toLowerCase()).toEqual(degree[0].toLowerCase())
        const totalItems = await page.locator("div.search__meta p").innerText()
        expect(totalItems).toContain(total[0])
        console.log("Chosen degree:", chosenField)
        console.log(totalItems)
    })

    // use the industry sector filter and check that the total items matches the total showing on the filter
    test("industry sector filter", async ({ page }) => {
        const filter = page.locator("//div[contains(@class, 'viewport viewport--normal')]//div[contains(@class, 'FacetSimplestyle__FacetSimple')]")
        const sectorFilter = filter.locator("//button[@class='toggle-trigger' and contains(div/h4/text(), 'Filter by industry sector')]//following-sibling::*[@class='toggle-target']")
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
        expect.soft(breadcrumb.toLowerCase()).toEqual(sector[0].toLowerCase())
        const totalItems = await page.locator("div.search__meta p").innerText()
        expect(totalItems).toContain(total[0])
        console.log("Chosen sector:", chosenField)
        console.log(totalItems)
    })

    // search by keyword filter
    test("search by keyword filter", async ({ page }) => {
        let count = 0
        const keyword = "Open Day"
        const filter = page.locator("//div[contains(@class, 'viewport viewport--normal')]//div[contains(@class, 'FacetInputTextstyle__FacetInputText-sc')]")
        const keywordFilter = filter.locator("//button[@class='toggle-trigger' and h4/text()='Search by keyword']/following-sibling::*[@class='toggle-target']")
        await keywordFilter.locator("input[name=facet--input-text--fulltext]").fill(keyword)
        await Promise.all([
            page.waitForNavigation(),
            keywordFilter.locator("button span.icon--search").click()
        ])
        const events = await page.locator("//h6[contains(@class, 'EventSnippetstyle__EventHeading-sc')]/a").allInnerTexts()
        for (const event of events) {
            if (event.toLowerCase().includes(keyword.toLowerCase())) count++
        }
        expect.soft(count).toBeGreaterThan(0)
        console.log(events)
    })

    // choose an event, click the "View details" button and see that it redirects to the correct detail page
    test("click view details button to detail page", async ({ page }) => {
        let employerListPage = ""
        const events = page.locator("//div[contains(@class, 'EventSnippetstyle__BaseEventSnippet')]")
        const countEvents = await events.count()
        const random = getRandomNumber(1, countEvents)
        const employerExist = await events.nth(random - 1).locator("//li[@data-testid='tag-item']").isVisible()
        if (employerExist) {
            employerListPage = await events.nth(random - 1).locator("//li[@data-testid='tag-item']").innerText()
        }
        const eventTitle = await events.nth(random - 1).locator("//*[contains(@class, 'EventSnippetstyle__EventHeading')]/a").innerText()
        await Promise.all([
            page.waitForNavigation(),
            events.nth(random - 1).locator("//a[text()='View details']").click()
        ])
        if (employerExist) {
            const employerOverviewPage = await page.locator("div.masthead__title h2.heading").innerText()
            expect.soft(employerOverviewPage.toUpperCase()).toEqual(employerListPage)
            console.log("Employer:", employerListPage)
        }
        const eventTitleOverviewPage = await page.locator("h1.heading").innerText()
        expect(eventTitleOverviewPage).toEqual(eventTitle)
        console.log("Event title:", eventTitle)
    })

    // choose an event, click the event title and see that it redirects to the correct detail page
    test("click event title to detail page", async ({ page }) => {
        let employerListPage = ""
        const events = page.locator("//div[contains(@class, 'EventSnippetstyle__BaseEventSnippet')]")
        const countEvents = await events.count()
        const random = getRandomNumber(1, countEvents)
        const employerExist = await events.nth(random - 1).locator("//li[@data-testid='tag-item']").isVisible()
        if (employerExist) {
            employerListPage = await events.nth(random - 1).locator("//li[@data-testid='tag-item']").innerText()
        }
        const eventTitle = await events.nth(random - 1).locator("//*[contains(@class, 'EventSnippetstyle__EventHeading')]/a").innerText()
        await Promise.all([
            page.waitForNavigation(),
            events.nth(random - 1).locator("//*[contains(@class, 'EventSnippetstyle__EventHeading')]/a").click()
        ])
        if (employerExist) {
            const employerOverviewPage = await page.locator("div.masthead__title h2.heading").innerText()
            expect.soft(employerOverviewPage.toUpperCase()).toEqual(employerListPage)
            console.log("Employer:", employerListPage)
        }
        const eventTitleOverviewPage = await page.locator("h1.heading").innerText()
        expect(eventTitleOverviewPage).toEqual(eventTitle)
        console.log("Event title:", eventTitle)
    })

    // click the save button, user will be asked to login first
    // FIXME: get rid of the waitfortimeout
    test("bookmark event and login via popup", async ({ page }) => {
        const saveButton = page.locator("//div[contains(@class, 'EventSnippetstyle__BaseEventSnippet')]//button[@data-event-track='cta-save']")
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
    test("bookmark event and signup via popup", async ({ page }) => {
        const saveButton = page.locator("//div[contains(@class, 'EventSnippetstyle__BaseEventSnippet')]//button[@data-event-track='cta-save']")
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

    // test the pagination on the events page
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
    test("bookmark event", async ({ page }) => {
        let employerListPage = ""
        const saveButton = page.locator("//div[contains(@class, 'EventSnippetstyle__BaseEventSnippet')]//a[@data-event-track='cta-save']")
        const countSaveButton = await saveButton.count()
        let random = getRandomNumber(1, countSaveButton)
        const employerExist = await saveButton.nth(random - 1).locator("//ancestor::div[contains(@class, 'EventSnippetstyle__BaseEventSnippet')]//li[@data-testid='tag-item']").isVisible()
        if (employerExist) {
            employerListPage = await saveButton.nth(random - 1).locator("//ancestor::div[contains(@class, 'EventSnippetstyle__BaseEventSnippet')]//li[@data-testid='tag-item']").innerText()
            console.log("bookmarked employer:", employerListPage)
        }
        const eventTitle = await saveButton.nth(random - 1).locator("//ancestor::div[contains(@class, 'EventSnippetstyle__BaseEventSnippet')]//*[contains(@class, 'EventSnippetstyle__EventHeading')]/a").innerText()
        console.log("bookmarked event:", eventTitle)
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
            page.locator("//div[contains(@class, 'region--sidebar')]//a[text()='Events']").click()
        ])
        await page.waitForTimeout(3000)
        if (employerExist) {
            const employerBookmarked = await page.locator("//li[@data-testid='tag-item']").innerText()
            expect.soft(employerBookmarked).toEqual(employerListPage)
            console.log("saved employer:", employerBookmarked)
        }
        const eventBookmarked = await page.locator("//*[contains(@class, 'EventSnippetstyle__EventHeading')]/a").innerText()
        expect.soft(eventBookmarked).toEqual(eventTitle)
        console.log("saved job:", eventBookmarked)
        await page.locator("//a[@data-event-track='cta-save']").click()
        const message = await page.locator("h1.heading").innerText()
        expect(message).toEqual("No Saved Events")
    })
})