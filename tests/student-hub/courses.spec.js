const { test, expect } = require('@playwright/test')
const { getRandomNumber } = require('../../common/common-functions')
const { CompleteLogin } = require("../../common/common-classes")
const data = require("../../common/common-details.json")

// go to the courses page on the student hub
test.beforeEach(async ({ page }) => {
    await page.goto(data.studentHubUrl + "/courses")
    await page.waitForSelector("div.viewport--normal a.logo")
})

// tests that can be done on the courses page on the student hub
test.describe('courses page tests', async () => {
    // use the study field filter and check that the total items matches thPe total showing on the filter
    test("study field filter", async ({ page }) => {
        const filter = page.locator("//div[contains(@class, 'viewport viewport--normal')]//div[contains(@class, 'FacetSimplestyle__FacetSimple')]")
        const courseFilter = filter.locator("//button[@class='toggle-trigger' and contains(div/h4/text(), 'looking for a course in')]//following-sibling::*[@class='toggle-target']")
        const checkVisible = await courseFilter.locator("//a[contains(@class, 'truncate-trigger')]").isVisible()
        if (checkVisible) await courseFilter.locator("//a[contains(@class, 'truncate-trigger')]").click()
        const fields = courseFilter.locator("//div[@class='facet__item']")
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
        console.log("Chosen course:", chosenField)
        console.log(totalItems)
    })

    // use the degree type filter and check that the filtered results showing correct degree type
    test("degree type filter", async ({ page }) => {
        const filter = page.locator("//div[contains(@class, 'viewport viewport--normal')]//div[contains(@class, 'FacetSimplestyle__FacetSimple')]")
        const courseFilter = filter.locator("//button[@class='toggle-trigger' and contains(div/h4/text(), 'I want this qualification')]//following-sibling::*[@class='toggle-target']")
        const checkVisible = await courseFilter.locator("//a[contains(@class, 'truncate-trigger')]").isVisible()
        if (checkVisible) await courseFilter.locator("//a[contains(@class, 'truncate-trigger')]").click()
        const fields = courseFilter.locator("//div[@class='facet__item']")
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
        expect(breadcrumb.toLowerCase()).toEqual(degreeType[0].toLowerCase())
        const totalItems = await page.locator("div.search__meta p").innerText()
        expect(totalItems).toContain(total[0])
        console.log("Chosen degree type:", chosenField)
        console.log(totalItems)
        const courses = page.locator("//div[contains(@class, 'CourseTeaserstyle__CourseTeaser')]")
        const countJobs = await courses.count()
        for (let i = 0; i < countJobs; i++) {
            const type = await courses.nth(i).locator("div.teaser__item--degree-type p").innerText()
            expect(type.toLowerCase()).toEqual(degreeType[0].toLowerCase())
        }
    })

    // use the study mode filter and check that the filtered results showing correct study mode
    test("study mode filter", async ({ page }) => {
        const filter = page.locator("//div[contains(@class, 'viewport viewport--normal')]//div[contains(@class, 'FacetSimplestyle__FacetSimple')]")
        const courseFilter = filter.locator("//button[@class='toggle-trigger' and contains(div/h4/text(), 'I want to attend')]//following-sibling::*[@class='toggle-target']")
        const checkVisible = await courseFilter.locator("//a[contains(@class, 'truncate-trigger')]").isVisible()
        if (checkVisible) await courseFilter.locator("//a[contains(@class, 'truncate-trigger')]").click()
        const fields = courseFilter.locator("//div[@class='facet__item']")
        const countFields = await fields.count()
        let random = getRandomNumber(1, countFields)
        await Promise.all([
            page.waitForNavigation(),
            fields.nth(random - 1).locator("//label/a").click()
        ])
        const chosenField = await fields.locator("//div[input[@class='is-checked']]/following-sibling::label").innerText()
        let study = /.*(?= \()/.exec(chosenField)
        let total = /(?<=\()\d*/.exec(chosenField)
        const breadcrumb = await page.locator("a[itemprop=item] span").last().innerText()
        expect(breadcrumb.toLowerCase()).toEqual(study[0].toLowerCase())
        const totalItems = await page.locator("div.search__meta p").innerText()
        expect(totalItems).toContain(total[0])
        console.log("Chosen study mode:", chosenField)
        console.log(totalItems)
        const courses = page.locator("//div[contains(@class, 'CourseTeaserstyle__CourseTeaser')]")
        const countJobs = await courses.count()
        for (let i = 0; i < countJobs; i++) {
            const type = await courses.nth(i).locator("//div[contains(@class, 'field-label') and text()='Study Mode']/following-sibling::*").innerText()
            expect(type.toLowerCase()).toContain(study[0].toLowerCase())
        }
    })

    // use the location filter and check that the total items matches the total showing on the filter
    test("location filter", async ({ page }) => {
        const filter = page.locator("//div[contains(@class, 'viewport viewport--normal')]//div[contains(@class, 'FacetSimplestyle__FacetSimple')]")
        const courseFilter = filter.locator("//button[@class='toggle-trigger' and contains(div/h4/text(), 'I want to study here')]//following-sibling::*[@class='toggle-target']")
        const checkVisible = await courseFilter.locator("//a[contains(@class, 'truncate-trigger')]").isVisible()
        if (checkVisible) await courseFilter.locator("//a[contains(@class, 'truncate-trigger')]").click()
        const fields = courseFilter.locator("//div[@class='facet__item']")
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

    // use the institution filter and check that the filtered results showing correct institution
    test("institution filter", async ({ page }) => {
        const filter = page.locator("//div[contains(@class, 'viewport viewport--normal')]//div[contains(@class, 'FacetSimplestyle__FacetSimple')]")
        const courseFilter = filter.locator("//button[@class='toggle-trigger' and contains(div/h4/text(), 'Filter by institution')]//following-sibling::*[@class='toggle-target']")
        const checkVisible = await courseFilter.locator("//a[contains(@class, 'truncate-trigger')]").isVisible()
        if (checkVisible) await courseFilter.locator("//a[contains(@class, 'truncate-trigger')]").click()
        const fields = courseFilter.locator("//div[@class='facet__item']")
        const countFields = await fields.count()
        let random = getRandomNumber(1, countFields)
        await Promise.all([
            page.waitForNavigation(),
            fields.nth(random - 1).locator("//label/a").click()
        ])
        const chosenField = await fields.locator("//div[input[@class='is-checked']]/following-sibling::label").innerText()
        let study = /.*(?= \()/.exec(chosenField)
        let total = /(?<=\()\d*/.exec(chosenField)
        const breadcrumb = await page.locator("a[itemprop=item] span").last().innerText()
        expect(breadcrumb.toLowerCase()).toEqual(study[0].toLowerCase())
        const totalItems = await page.locator("div.search__meta p").innerText()
        expect(totalItems).toContain(total[0])
        console.log("Chosen institution:", chosenField)
        console.log(totalItems)
        const courses = page.locator("//div[contains(@class, 'CourseTeaserstyle__CourseTeaser')]")
        const countJobs = await courses.count()
        for (let i = 0; i < countJobs; i++) {
            const type = await courses.nth(i).locator("div.logo__item p").innerText()
            expect(type.toLowerCase()).toEqual(study[0].toLowerCase())
        }
    })

    // use the annual budget filter and check that the filtered results has fees within the specified range
    test("annual budget fee filter", async ({ page }) => {
        const filter = page.locator("//div[contains(@class, 'viewport viewport--normal')]//div[contains(@class, 'FacetRangestyle__FacetRange')]")
        const courseFilter = filter.locator("//button[@class='toggle-trigger' and contains(div/h4/text(), 'My annual fee budget is')]//following-sibling::*[@class='toggle-target']")
        const values = [["0", "10000"], ["10000", "20000"], ["20000", "30000"], ["30000", "100000"], ["100000", "999999"]]
        for (const value of values) {
            console.log(`Min: ${value[0]}, Max: ${value[1]}`)
            await courseFilter.locator("//label[text()='Min']/following-sibling::*/input").fill(value[0])
            await courseFilter.locator("//label[text()='Max']/following-sibling::*/input").fill(value[1])
            await Promise.all([
                page.waitForNavigation(),
                courseFilter.locator("//button[text()='Apply']").click()
            ])
            const courses = page.locator("//div[contains(@class, 'CourseTeaserstyle__CourseTeaser')]")
            const countJobs = await courses.count()
            for (let i = 0; i < countJobs; i++) {
                const type = await courses.nth(i).locator("//div[contains(@class, 'field-label') and text()='Domestic Tuition Fees']/following-sibling::*").innerText()
                const course = await courses.nth(i).locator("h2.heading a").innerText()
                let fee = type.match(/\$(\d*),?(\d+)(\.\d\d)? per year/m)
                if (fee) {
                    const feeMatched = Number([fee[1], fee[2], fee[3]].join(""))
                    expect.soft(feeMatched).toBeGreaterThanOrEqual(Number(value[0]))
                    expect.soft(feeMatched).toBeLessThanOrEqual(Number(value[1]))
                    console.log(`${course} - ${feeMatched}`)
                }
            }
        }
    })

    // check that the website redirect button is working
    test("website redirect button is clickable", async ({ page }) => {

    })

    // choose a course on the courses page, click the course title and see that it redirects to the correct detail page
    test("click course title to detail page", async ({ page }) => {

    })

    // check that when filtered, the results were filtered correctly
    test("sort by filter, institution a-z", async ({ page }) => {
        await Promise.all([
            page.waitForNavigation(),
            page.locator('select[name=sort]').selectOption({ label: "Institution A-Z" })
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
            const courses = page.locator("//div[contains(@class, 'CourseTeaserstyle__CourseTeaser')]")
            const courseContents = await courses.locator("div.logo__item p").allTextContents()
            for (let i = 0; i < courseContents.length - 1; i++) {
                console.log(`${courseContents[i]} -- ${courseContents[i + 1]}`)
                if (courseContents[i].toLowerCase() > courseContents[i + 1].toLowerCase()) {
                    sorted = false
                    break
                }
            }
            expect(sorted).toBeTruthy()
        }
    })

    // check that when filtered, the results were filtered correctly
    test("sort by filter, institution z-a", async ({ page }) => {
        await Promise.all([
            page.waitForNavigation(),
            page.locator('select[name=sort]').selectOption({ label: "Institution Z-A" })
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
            const courses = page.locator("//div[contains(@class, 'CourseTeaserstyle__CourseTeaser')]")
            const courseContents = await courses.locator("div.logo__item p").allTextContents()
            for (let i = 0; i < courseContents.length - 1; i++) {
                console.log(`${courseContents[i]} -- ${courseContents[i + 1]}`)
                if (courseContents[i].toLowerCase() < courseContents[i + 1].toLowerCase()) {
                    sorted = false
                    break
                }
            }
            expect(sorted).toBeTruthy()
        }
    })
})

// tests on courses page that requires users to login
test.describe("courses page tests for logged-in users", async () => {
    // login process
    test.beforeEach(async ({ page }) => {
        const login = new CompleteLogin(page)
        await login.studentHubLogin()
    })

    // bookmark a course and check that what was saved is correct
    // FIXME: get rid of the waitfortimeout
    test("bookmark course", async ({ page }) => {

    })
})