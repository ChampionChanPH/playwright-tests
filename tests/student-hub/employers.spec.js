const { test, expect } = require('@playwright/test')
const { getRandomNumber } = require('../../common/common-functions')
const data = require("../../common/common-details.json")

// go to the employers page in the student hub
test.beforeEach(async ({ page }) => {
    await page.goto(data.studentHubUrl + "/graduate-employers")
})

// tests that can be done on the employer page tests on the student hub
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
            expect(sector).toContain(sectorField[0])
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
})