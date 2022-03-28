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
    // use the study field filter and check that the total items matches the total showing on the filter
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
        await page.locator("a.button--type-apply").nth(0).waitFor()
        const apply = page.locator("a.button--type-apply")
        const countApply = await apply.count()
        let random = getRandomNumber(1, countApply)
        await apply.nth(random - 1).click()
    })

    // choose a course on the courses page, click the course title and see that it redirects to the correct detail page
    test("click course title to detail page", async ({ page }) => {
        const courses = page.locator("//div[contains(@class, 'CourseTeaserstyle__CourseTeaser')]")
        const countCourses = await courses.count()
        let random = getRandomNumber(1, countCourses)
        const institutionListPage = await courses.nth(random - 1).locator("div.logo__item p").innerText()
        const courseTitleListPage = await courses.nth(random - 1).locator("div.teaser__item--title a").innerText()
        console.log("Chosen institution:", institutionListPage)
        console.log("Chosen course:", courseTitleListPage)
        await Promise.all([
            page.waitForNavigation(),
            courses.nth(random - 1).locator("div.teaser__item--title a").click()
        ])
        const institutionOverviewPage = await page.locator("div.masthead__title h2.heading").innerText()
        const courseTitleOverviewPage = await page.locator("h1.heading").innerText()
        expect(institutionOverviewPage).toEqual(institutionListPage)
        expect(courseTitleOverviewPage).toEqual(courseTitleListPage)
        console.log("Saved institution:", institutionOverviewPage)
        console.log("Saved course:", courseTitleOverviewPage)
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

    // test the pagination on the courses page
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
    // FIXME: get rid of the waitfortimeout
    test("bookmark courses and login via popup", async ({ page }) => {
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
    test("bookmark courses and signup via popup", async ({ page }) => {
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
        const saveButton = page.locator("div.teaser__item--save")
        const countSaveButton = await saveButton.count()
        const random = getRandomNumber(1, countSaveButton)
        const institutionListPage = await saveButton.nth(random - 1).locator("//ancestor::div[contains(@class, 'CourseTeaserstyle__CourseTeaser')]//div[@class='logo__item']/p").innerText()
        const courseListPage = await saveButton.nth(random - 1).locator("//ancestor::div[contains(@class, 'CourseTeaserstyle__CourseTeaser')]//*[contains(@class, 'teaser__item--title')]//a").innerText()
        console.log("Bookmarked institution:", institutionListPage)
        console.log("Bookmarked course:", courseListPage)
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
            page.locator("//div[contains(@class, 'region--sidebar')]//a[text()='Courses']").click()
        ])
        await page.waitForTimeout(3000)
        const institutionBookmarked = await page.locator("div.logo__item p").innerText()
        const courseBookmarked = await page.locator("div.teaser__item--title a").innerText()
        expect.soft(institutionBookmarked).toEqual(institutionListPage)
        expect.soft(courseBookmarked).toEqual(courseListPage)
        console.log("Saved institution:", institutionBookmarked)
        console.log("Saved course:", courseBookmarked)
        await page.locator("div.teaser__item--save").click()
        const message = await page.locator("h1.heading").innerText()
        expect(message).toEqual("No Saved Courses")
    })

    // bookmark institution by going to the course page first and check that what was saved is correct
    // FIXME: get rid of the waitfortimeout
    test("bookmark institution", async ({ page }) => {
        const courses = page.locator("//div[contains(@class, 'CourseTeaserstyle__CourseTeaser-sc')]")
        const countCourses = await courses.count()
        const random = getRandomNumber(1, countCourses)
        const institutionCoursePage = await courses.nth(random - 1).locator("div.logo__item p").innerText()
        await Promise.all([
            page.waitForNavigation(),
            courses.nth(random - 1).locator('h2.heading a').click()
        ])
        const institutionOverviewPage = await page.locator("div.masthead__title h2.heading").innerText()
        expect.soft(institutionOverviewPage).toEqual(institutionCoursePage)
        await page.waitForTimeout(3000)
        await page.locator("div.masthead__meta a.save").click()
        await page.waitForTimeout(3000)
        const textButton = await page.locator("div.masthead__meta a.save").innerText()
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
        expect.soft(institutionBookmarked).toEqual(institutionOverviewPage)
        console.log("Saved institution:", institutionBookmarked)
        await page.locator("div.teaser__item a.save").click()
        const message = await page.locator("h1.heading").innerText()
        expect(message).toEqual("No Saved Institutions")
    })
})