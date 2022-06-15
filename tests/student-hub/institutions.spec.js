const { test, expect } = require('@playwright/test')
const { getRandomNumber } = require('../../common/common-functions')
const { CompleteLogin } = require("../../common/common-classes")
const data = require("../../common/common-details.json")

// go to the institutions page on the student hub
test.beforeEach(async ({ page }) => {
    await page.goto(data.studentHubUrl + "/institutions?default=1")
    await page.waitForSelector("div.viewport--normal a.logo")
})

// tests that can be done on the institutions page on the student hub
test.describe('institutions page tests', async () => {
    // use the location filter and check that the total items matches the total showing on the filter
    test("location filter", async ({ page }) => {
        const filter = page.locator("//div[contains(@class, 'viewport viewport--normal')]//div[contains(@class, 'FacetSimplestyle__FacetSimple')]")
        const locationFilter = filter.locator("//button[@class='toggle-trigger' and contains(div/h4/text(), 'Show me institutions in')]//following-sibling::*[@class='toggle-target']")
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

    // use the study field filter and check that the total items matches the total showing on the filter
    test("study field filter", async ({ page }) => {
        const filter = page.locator("//div[contains(@class, 'viewport viewport--normal')]//div[contains(@class, 'FacetSimplestyle__FacetSimple')]")
        const studyFieldFilter = filter.locator("//button[@class='toggle-trigger' and contains(div/h4/text(), 'Offering courses in')]//following-sibling::*[@class='toggle-target']")
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

    // search by keyword filter
    test("search by keyword filter", async ({ page }) => {
        let count = 0
        const keyword = "Australia"
        const filter = page.locator("//div[contains(@class, 'viewport viewport--normal')]//div[contains(@class, 'FacetInputTextstyle__FacetInputText-sc')]")
        const keywordFilter = filter.locator("//button[@class='toggle-trigger' and h4/text()='Search by keyword']/following-sibling::*[@class='toggle-target']")
        await keywordFilter.locator("input[name=facet--input-text--fulltext]").fill(keyword)
        await Promise.all([
            page.waitForNavigation(),
            keywordFilter.locator("button span.icon--search").click()
        ])
        const institutions = await page.locator("h2.heading a").allInnerTexts()
        for (const institution of institutions) {
            if (institution.toLowerCase().includes(keyword.toLowerCase())) count++
        }
        expect.soft(count).toBeGreaterThan(0)
        console.log(institutions)
    })

    // check that when filtered, the results were filtered correctly
    test("sort by filter, name a-z", async ({ page }) => {
        await Promise.all([
            page.waitForNavigation(),
            page.locator('select[name=sort]').selectOption({ label: "Name A-Z" })
        ])
        const pagination = page.locator("//li[@class='pagination-item']")
        const countPage = await pagination.count()
        if (countPage > 0) {
            const random = getRandomNumber(1, countPage)
            await Promise.all([
                page.waitForNavigation(),
                pagination.nth(random - 1).click()
            ])
            let sorted = true
            const institutions = page.locator("//div[contains(@class, 'InstitutionTeaserstyle__InstitutionTeaser-sc')]")
            const institutionContents = await institutions.locator("h2.heading a").allTextContents()
            for (let i = 0; i < institutionContents.length - 1; i++) {
                console.log(`${institutionContents[i]} -- ${institutionContents[i + 1]}`)
                if (institutionContents[i].toLowerCase() > institutionContents[i + 1].toLowerCase()) {
                    sorted = false
                    break
                }
            }
            expect(sorted).toBeTruthy()
        }
    })

    // check that when filtered, the results were filtered correctly
    test("sort by filter, name z-a", async ({ page }) => {
        await Promise.all([
            page.waitForNavigation(),
            page.locator('select[name=sort]').selectOption({ label: "Name Z-A" })
        ])
        const pagination = page.locator("//li[@class='pagination-item']")
        const countPage = await pagination.count()
        if (countPage > 0) {
            const random = getRandomNumber(1, countPage)
            await Promise.all([
                page.waitForNavigation(),
                pagination.nth(random - 1).click()
            ])
            let sorted = true
            const institutions = page.locator("//div[contains(@class, 'InstitutionTeaserstyle__InstitutionTeaser-sc')]")
            const institutionContents = await institutions.locator("h2.heading a").allTextContents()
            for (let i = 0; i < institutionContents.length - 1; i++) {
                console.log(`${institutionContents[i]} -- ${institutionContents[i + 1]}`)
                if (institutionContents[i].toLowerCase() < institutionContents[i + 1].toLowerCase()) {
                    sorted = false
                    break
                }
            }
            expect(sorted).toBeTruthy()
        }
    })

    // click the save button, user will be asked to login first
    // FIXME: get rid of the waitfortimeout
    test("bookmark institution and login via popup", async ({ page }) => {
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
    test("bookmark institution and signup via popup", async ({ page }) => {
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

    // test the pagination on the institutions page
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
            console.log(`Previous: ${active}, Current: ${newActive}`)
            expect.soft(result).toBeTruthy()
            expect.soft(page.url()).toContain(`start=${(newActive - 1) * 8}`)
            await Promise.all([
                page.waitForNavigation(),
                page.locator("li.pagination-item--direction-next").click()
            ])
            active = await page.locator("li.pagination-item.is-active").innerText()
            result = Number(active) > Number(newActive)
            console.log(`Previous: ${newActive}, Current: ${active}`)
            expect.soft(result).toBeTruthy()
            expect(page.url()).toContain(`start=${(active - 1) * 8}`)
        }
    })
})

// tests on institutions page that requires users to login
test.describe("institutions page tests for logged-in users", async () => {
    // login process
    test.beforeEach(async ({ page }) => {
        const login = new CompleteLogin(page)
        await login.studentHubLogin()
    })

    // bookmark an institution and check that what was saved is correct
    // FIXME: get rid of the waitfortimeout
    test("bookmark institution from the institutions page", async ({ page }) => {
        const saveButton = page.locator("div.teaser__item a.save")
        const countSaveButton = await saveButton.count()
        const random = getRandomNumber(1, countSaveButton)
        const institutionListPage = await saveButton.nth(random - 1).locator("//ancestor::div[contains(@class, 'InstitutionTeaserstyle__InstitutionTeaser-sc')]//h2[contains(@class, 'heading')]/a").innerText()
        console.log("Bookmarked institution:", institutionListPage)
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
            page.locator("//div[contains(@class, 'region--sidebar')]//a[text()='Institutions']").click()
        ])
        await page.waitForTimeout(3000)
        const institutionBookmarked = await page.locator("h2.heading a").innerText()
        expect.soft(institutionBookmarked).toEqual(institutionListPage)
        console.log("Saved institution:", institutionBookmarked)
        await page.locator("div.teaser__item a.save").click()
        const message = await page.locator("h1.heading").innerText()
        expect(message).toEqual("No Saved Institutions")
    })

    // bookmark an institution and check that what was saved is correct
    // FIXME: get rid of the waitfortimeout
    test("bookmark institution from the institution detail page", async ({ page }) => {
        const institutions = page.locator("//div[contains(@class, 'InstitutionTeaserstyle__InstitutionTeaser-sc')]")
        const countInstitutions = await institutions.count()
        const random = getRandomNumber(1, countInstitutions)
        const institutionCoursePage = await institutions.nth(random - 1).locator("h2.heading a").innerText()
        await Promise.all([
            page.waitForNavigation(),
            institutions.nth(random - 1).locator('h2.heading a').click()
        ])
        const institutionOverviewPage = await page.locator("div.masthead__title h2.heading").innerText()
        expect.soft(institutionOverviewPage).toEqual(institutionCoursePage)
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