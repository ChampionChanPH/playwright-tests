const { test, expect } = require('@playwright/test')
const { getRandomNumber } = require('../../common/common-functions')
const { CompleteLogin } = require("../../common/common-classes")
const data = require("../../common/common-details.json")

// go to the employers page in the student hub
test.beforeEach(async ({ page }) => {
    await page.goto(data.studentHubUrl + "/graduate-employers")
    await page.waitForSelector("div.viewport--normal a.logo")
})

// tests that can be done on the employer page on the student hub
test.describe('employer page tests', async () => {
    // use the company size filter and then check that all filtered results shows the correct company size
    test("company size filter", async ({ page }) => {
        const filter = page.locator("//div[contains(@class, 'viewport viewport--normal')]//div[contains(@class, 'FacetSimplestyle__FacetSimple')]")
        const locationFilter = filter.locator("//button[@class='toggle-trigger' and div/h4/text()='Filter by company size']//following-sibling::*[@class='toggle-target']")
        await locationFilter.locator("//a[contains(@class, 'truncate-trigger')]").click()
        const fields = locationFilter.locator("//div[@class='facet__item']")
        const countFields = await fields.count()
        let random = getRandomNumber(1, countFields)
        await Promise.all([
            page.waitForNavigation(),
            fields.nth(random - 1).locator("//label/a").click()
        ])
        const chosenField = await fields.locator("//div[input[@class='is-checked']]/following-sibling::label").innerText()
        let companySizeField = /.*(?= \()/.exec(chosenField)
        let total = /(?<=\()\d*/.exec(chosenField)
        const breadcrumb = await page.locator("a[itemprop=item] span").last().innerText()
        expect(breadcrumb.toLowerCase()).toEqual(companySizeField[0].toLowerCase())
        const totalItems = await page.locator("div.search__meta p").innerText()
        expect(totalItems).toContain(total[0])
        const employer = page.locator("//div[contains(@class, 'EmployerTeaserstyle__EmployerTeaser')]")
        const countEmployer = await employer.count()
        for (let i = 0; i < countEmployer; i++) {
            const companySize = await employer.nth(i).locator("//div[contains(@class, 'teaser__item--company-size')]//div[contains(@class, 'field-item')]").innerText()
            expect(companySize).toContain(companySizeField[0])
        }
    })

    // use the hiring study field filter and check that the total items matches the total showing on the filter
    test("hiring study field filter", async ({ page }) => {
        const filter = page.locator("//div[contains(@class, 'viewport viewport--normal')]//div[contains(@class, 'FacetSimplestyle__FacetSimple')]")
        const hiringFilter = filter.locator("//button[@class='toggle-trigger' and div/h4/text()='Show me employers hiring candidates with these qualifications']//following-sibling::*[@class='toggle-target']")
        await hiringFilter.locator("//a[contains(@class, 'truncate-trigger')]").click()
        const fields = hiringFilter.locator("//div[@class='facet__item']")
        const countFields = await fields.count()
        let random = getRandomNumber(1, countFields)
        await Promise.all([
            page.waitForNavigation(),
            fields.nth(random - 1).locator("//label/a").click()
        ])
        const chosenField = await fields.locator("//div[input[@class='is-checked']]/following-sibling::label").innerText()
        let hiringField = /.*(?= \()/.exec(chosenField)
        let total = /(?<=\()\d*/.exec(chosenField)
        const breadcrumb = await page.locator("a[itemprop=item] span").last().innerText()
        expect(breadcrumb.toLowerCase()).toEqual(hiringField[0].toLowerCase())
        const totalItems = await page.locator("div.search__meta p").innerText()
        expect(totalItems).toContain(total[0])
    })

    // use the industry sector filter and then check that all filtered results shows the correct industry sector
    test("industry sector filter", async ({ page }) => {
        const filter = page.locator("//div[contains(@class, 'viewport viewport--normal')]//div[contains(@class, 'FacetSimplestyle__FacetSimple')]")
        const sectorFilter = filter.locator("//button[@class='toggle-trigger' and div/h4/text()='Filter by industry sector']//following-sibling::*[@class='toggle-target']")
        await sectorFilter.locator("//a[contains(@class, 'truncate-trigger')]").click()
        const fields = sectorFilter.locator("//div[@class='facet__item']")
        const countFields = await fields.count()
        let random = getRandomNumber(1, countFields)
        await Promise.all([
            page.waitForNavigation(),
            fields.nth(random - 1).locator("//label/a").click()
        ])
        const chosenField = await fields.locator("//div[input[@class='is-checked']]/following-sibling::label").innerText()
        let sectorField = /.*(?= \()/.exec(chosenField)
        let total = /(?<=\()\d*/.exec(chosenField)
        const breadcrumb = await page.locator("a[itemprop=item] span").last().innerText()
        expect(breadcrumb.toLowerCase()).toEqual(sectorField[0].toLowerCase())
        const totalItems = await page.locator("div.search__meta p").innerText()
        expect(totalItems).toContain(total[0])
        const employer = page.locator("//div[contains(@class, 'EmployerTeaserstyle__EmployerTeaser')]")
        const countEmployer = await employer.count()
        for (let i = 0; i < countEmployer; i++) {
            const sector = await employer.nth(i).locator("//div[contains(@class, 'teaser__item--industry')]//div[contains(@class, 'field-item')]").innerText()
            expect(sector.toLowerCase()).toContain(sectorField[0].toLowerCase())
        }
    })

    // use the location filter and then check that all filtered results shows the correct location
    test("location filter", async ({ page }) => {
        const filter = page.locator("//div[contains(@class, 'viewport viewport--normal')]//div[contains(@class, 'FacetSimplestyle__FacetSimple')]")
        const locationFilter = filter.locator("//button[@class='toggle-trigger' and div/h4/text()='Filter by location']//following-sibling::*[@class='toggle-target']")
        await locationFilter.locator("//a[contains(@class, 'truncate-trigger')]").click()
        const fields = locationFilter.locator("//div[@class='facet__item']")
        const countFields = await fields.count()
        let random = getRandomNumber(1, countFields)
        await Promise.all([
            page.waitForNavigation(),
            fields.nth(random - 1).locator("//label/a").click()
        ])
        const chosenField = await fields.locator("//div[input[@class='is-checked']]/following-sibling::label").innerText()
        let locationField = /.*(?= \()/.exec(chosenField)
        let total = /(?<=\()\d*/.exec(chosenField)
        const breadcrumb = await page.locator("a[itemprop=item] span").last().innerText()
        expect(breadcrumb.toLowerCase()).toEqual(locationField[0].toLowerCase())
        const totalItems = await page.locator("div.search__meta p").innerText()
        expect(totalItems).toContain(total[0])
    })

    // use the category filter and then check that all filtered results shows the correct category
    test("category filter", async ({ page }) => {
        const filter = page.locator("//div[contains(@class, 'viewport viewport--normal')]//div[contains(@class, 'FacetSimplestyle__FacetSimple')]")
        const categoryFilter = filter.locator("//button[@class='toggle-trigger' and div/h4/text()='Filter by category']//following-sibling::*[@class='toggle-target']")
        const fields = categoryFilter.locator("//div[@class='facet__item']")
        const countFields = await fields.count()
        let random = getRandomNumber(1, countFields)
        await Promise.all([
            page.waitForNavigation(),
            fields.nth(random - 1).locator("//label/a").click()
        ])
        const chosenField = await fields.locator("//div[input[@class='is-checked']]/following-sibling::label").innerText()
        let categoryField = /.*(?= \()/.exec(chosenField)
        let total = /(?<=\()\d*/.exec(chosenField)
        const breadcrumb = await page.locator("a[itemprop=item] span").last().innerText()
        expect(breadcrumb.toLowerCase()).toEqual(categoryField[0].toLowerCase())
        const totalItems = await page.locator("div.search__meta p").innerText()
        expect(totalItems).toContain(total[0])
    })

    // choose an employer on the employers page with "Read reviews", click the link and see that it redirects to the correct detail page
    test("click review link to detail page", async ({ page }) => {
        const reviews = page.locator("//li[@class='list__item' and a[contains(text(), 'Read reviews')]]")
        const countReviews = await reviews.count()
        let random = getRandomNumber(1, countReviews)
        const employerListPage = await reviews.nth(random - 1).locator("//ancestor::div[contains(@class, 'section--rating')]/preceding-sibling::h2").innerText()
        await Promise.all([
            page.waitForNavigation(),
            reviews.locator("//a").nth(random - 1).click()
        ])
        const employerOverviewPage = await page.locator("div.masthead__title h2.heading").innerText()
        const employerReviewTitle = await page.locator("h1.heading").innerText()
        expect(employerOverviewPage).toEqual(employerListPage)
        expect(employerReviewTitle).toEqual(`${employerListPage} Reviews`)
    })

    // choose an employer on the employers page, click the employer name and see that it redirects to the correct detail page
    test("click employer to detail page", async ({ page }) => {
        const employers = page.locator("h2.heading a")
        const countEmployers = await employers.count()
        let random = getRandomNumber(1, countEmployers)
        const employerListPage = await employers.nth(random - 1).innerText()
        await Promise.all([
            page.waitForNavigation(),
            employers.nth(random - 1).click()
        ])
        const employerOverviewPage = await page.locator("div.masthead__title h2.heading").innerText()
        expect(employerOverviewPage).toEqual(employerListPage)
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
            let random = getRandomNumber(1, countPage)
            await Promise.all([
                page.waitForNavigation(),
                pagination.nth(random - 1).click()
            ])
            let sorted = true
            const employers = page.locator("//div[contains(@class, 'EmployerTeaserstyle__EmployerTeaser')]")
            const employerContents = await employers.locator("div.teaser__item h2.heading a").allTextContents()
            for (let i = 0; i < employerContents.length - 1; i++) {
                console.log(`${employerContents[i]} -- ${employerContents[i + 1]}`)
                if (employerContents[i].toLowerCase() > employerContents[i + 1].toLowerCase()) {
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
            let random = getRandomNumber(1, countPage)
            await Promise.all([
                page.waitForNavigation(),
                pagination.nth(random - 1).click()
            ])
            let sorted = true
            const employers = page.locator("//div[contains(@class, 'EmployerTeaserstyle__EmployerTeaser')]")
            const employerContents = await employers.locator("div.teaser__item h2.heading a").allTextContents()
            for (let i = 0; i < employerContents.length - 1; i++) {
                console.log(`${employerContents[i]} -- ${employerContents[i + 1]}`)
                if (employerContents[i].toLowerCase() < employerContents[i + 1].toLowerCase()) {
                    sorted = false
                    break
                }
            }
            expect(sorted).toBeTruthy()
        }
    })

    // test the pagination on the employers page
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

    // click the save button, user will be asked to login first
    test("bookmark job and login via popup", async ({ page }) => {
        const saveButton = page.locator("button.button")
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
    test("bookmark job and signup via popup", async ({ page }) => {
        const saveButton = page.locator("button.button")
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

// tests on employer page that requires users to login
test.describe("employer page tests for logged-in users", async () => {
    // login process
    test.beforeEach(async ({ page }) => {
        const login = new CompleteLogin(page)
        await login.studentHubLogin()
    })

    // bookmark an employer and check that what was saved is correct
    // FIXME: get rid of the waitfortimeout
    test("bookmark employer", async ({ page }) => {
        const saveButton = page.locator("a.save")
        const countSaveButton = await saveButton.count()
        let random = getRandomNumber(1, countSaveButton)
        const employerListPage = await saveButton.nth(random - 1).locator("//ancestor::div[contains(@class, 'EmployerTeaserstyle__EmployerTeaser')]//div[@class='teaser__item']//h2").innerText()
        console.log("bookmarked employer:", employerListPage)
        await page.waitForTimeout(3000)
        await saveButton.nth(random - 1).click()
        await page.waitForTimeout(3000)
        const textButton = await saveButton.nth(random - 1).innerText()
        expect(textButton).toEqual("Saved")
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
        const employerBookmarked = await page.locator("div.teaser__item h2").innerText()
        console.log("saved employer:", employerBookmarked)
        expect(employerBookmarked).toEqual(employerListPage)
        await page.locator("a.save").click()
        const message = await page.locator("h1.heading").innerText()
        expect(message).toEqual("No Saved Employers")
    })
})