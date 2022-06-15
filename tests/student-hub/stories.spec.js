const { test, expect } = require('@playwright/test')
const { getRandomNumber } = require('../../common/common-functions')
const { CompleteLogin } = require("../../common/common-classes")
const data = require("../../common/common-details.json")

// go to the stories page on the student hub
test.beforeEach(async ({ page }) => {
    await page.goto(data.studentHubUrl + "/profiles?default=1")
    await page.waitForSelector("div.viewport--normal a.logo")
})

// tests that can be done on the stories page on the student hub
test.describe('stories page tests', async () => {
    // use the profile type filter and check that the filtered results showing correct profile type
    test("profile type filter", async ({ page }) => {
        const filter = page.locator("//div[contains(@class, 'viewport viewport--normal')]//div[contains(@class, 'FacetSimplestyle__FacetSimple')]")
        const profileFilter = filter.locator("//button[@class='toggle-trigger' and div/h4/text()='Profile Type']//following-sibling::*[@class='toggle-target']")
        const checkVisible = await profileFilter.locator("//a[contains(@class, 'truncate-trigger')]").isVisible()
        if (checkVisible) await profileFilter.locator("//a[contains(@class, 'truncate-trigger')]").click()
        const fields = profileFilter.locator("//div[@class='facet__item']")
        const countFields = await fields.count()
        let random = getRandomNumber(1, countFields)
        await Promise.all([
            page.waitForNavigation(),
            fields.nth(random - 1).locator("//label/a").click()
        ])
        const chosenField = await fields.locator("//div[input[@class='is-checked']]/following-sibling::label").innerText()
        let profileType = /.*(?= \()/.exec(chosenField)
        let total = /(?<=\()\d*/.exec(chosenField)
        const breadcrumb = await page.locator("a[itemprop=item] span").last().innerText()
        expect(breadcrumb.toLowerCase()).toEqual(profileType[0].toLowerCase())
        const totalItems = await page.locator("div.search__meta p").innerText()
        expect(totalItems).toContain(total[0])
        const stories = page.locator("//div[contains(@class, 'StorySnippetstyle__StorySnippet-sc')]")
        const countStories = await stories.count()
        for (let i = 0; i < countStories; i++) {
            const type = await stories.nth(i).locator("//div[contains(@class, 'viewport viewport--large')]//li[@data-testid='tag-item']").innerText()
            expect(type.toLowerCase()).toContain(profileType[0].toLowerCase())
        }
        console.log("Chosen profile type:", chosenField)
        console.log(totalItems)
    })

    // use the sector filter and check that the total items matches the total showing on the filter
    test("sector filter", async ({ page }) => {
        const filter = page.locator("//div[contains(@class, 'viewport viewport--normal')]//div[contains(@class, 'FacetSimplestyle__FacetSimple')]")
        const sectorFilter = filter.locator("//button[@class='toggle-trigger' and div/h4/text()='Sector']//following-sibling::*[@class='toggle-target']")
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
        expect(breadcrumb.toLowerCase()).toEqual(sector[0].toLowerCase())
        const totalItems = await page.locator("div.search__meta p").innerText()
        expect(totalItems).toContain(total[0])
        console.log("Chosen sector:", chosenField)
        console.log(totalItems)
    })

    // use the studied at filter and check that the total items matches the total showing on the filter
    test("studied at filter", async ({ page }) => {
        const filter = page.locator("//div[contains(@class, 'viewport viewport--normal')]//div[contains(@class, 'FacetSimplestyle__FacetSimple')]")
        const studiedAtFilter = filter.locator("//button[@class='toggle-trigger' and div/h4/text()='Studied At']//following-sibling::*[@class='toggle-target']")
        const checkVisible = await studiedAtFilter.locator("//a[contains(@class, 'truncate-trigger')]").isVisible()
        if (checkVisible) await studiedAtFilter.locator("//a[contains(@class, 'truncate-trigger')]").click()
        const fields = studiedAtFilter.locator("//div[@class='facet__item']")
        const countFields = await fields.count()
        let random = getRandomNumber(1, countFields)
        await Promise.all([
            page.waitForNavigation(),
            fields.nth(random - 1).locator("//label/a").click()
        ])
        const chosenField = await fields.locator("//div[input[@class='is-checked']]/following-sibling::label").innerText()
        let studiedAt = /.*(?= \()/.exec(chosenField)
        let total = /(?<=\()\d*/.exec(chosenField)
        const breadcrumb = await page.locator("a[itemprop=item] span").last().innerText()
        expect(breadcrumb.toLowerCase()).toEqual(studiedAt[0].toLowerCase())
        const totalItems = await page.locator("div.search__meta p").innerText()
        expect(totalItems).toContain(total[0])
        console.log("Chosen institution:", chosenField)
        console.log(totalItems)
    })

    // use the location filter and check that the total items matches the total showing on the filter
    test("location filter", async ({ page }) => {
        const filter = page.locator("//div[contains(@class, 'viewport viewport--normal')]//div[contains(@class, 'FacetSimplestyle__FacetSimple')]")
        const locationFilter = filter.locator("//button[@class='toggle-trigger' and div/h4/text()='Location']//following-sibling::*[@class='toggle-target']")
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
        expect(breadcrumb.toLowerCase()).toEqual(location[0].toLowerCase())
        const totalItems = await page.locator("div.search__meta p").innerText()
        expect(totalItems).toContain(total[0])
        console.log("Chosen location:", chosenField)
        console.log(totalItems)
    })

    // check that when filtered, the results were filtered correctly
    // skipped because there's an issue with filter
    // ticket: https://prosple.atlassian.net/browse/PFE-2179
    test.skip("sort by filter, name a-z", async ({ page }) => {
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
            const story = page.locator("//div[contains(@class, 'StorySnippetstyle__StorySnippet-sc')]")
            const names = await story.locator("div.viewport--large h3.heading a").allTextContents()
            for (let i = 0; i < names.length - 1; i++) {
                console.log(`${names[i]} -- ${names[i + 1]}`)
                if (names[i].toLowerCase() > names[i + 1].toLowerCase()) {
                    sorted = false
                    break
                }
            }
            expect(sorted).toBeTruthy()
        }
    })

    // check that when filtered, the results were filtered correctly
    test("sort by filter, name z-a", async ({ page }) => {

    })

    // choose a story on the stories page, click the "Read full story" button and see that it redirects to the correct detail page
    test("click read full story button to detail page", async ({ page }) => {
        const stories = page.locator("//div[contains(@class, 'StorySnippetstyle__StorySnippetActions-sc')]/a[text()='Read full story']")
        const countStories = await stories.count()
        let random = getRandomNumber(1, countStories)
        const nameListPage = await stories.nth(random - 1).locator("//ancestor::div[contains(@class, 'StorySnippetstyle__StorySnippet-sc')]/div[contains(@class, 'viewport viewport--large')]/h3[contains(@class, 'heading')]/a").innerText()
        const storyListPage = await stories.nth(random - 1).locator("//ancestor::div[contains(@class, 'StorySnippetstyle__StorySnippet-sc')]/div[contains(@class, 'viewport viewport--large')]//li[@data-testid='tag-item']").innerText()
        await Promise.all([
            page.waitForNavigation(),
            stories.nth(random - 1).click()
        ])
        const breadcrumb = await page.locator("a[itemprop=item] span").last().innerText()
        expect.soft(breadcrumb.toLowerCase()).toEqual(storyListPage.toLowerCase())
        const nameOverviewPage = await page.locator("h1.heading").innerText()
        expect.soft(nameOverviewPage).toEqual(nameListPage)
        console.log(`Chosen story: ${nameListPage} (${storyListPage})`)
        console.log(`Story page URL: ${page.url()}`)
        console.log(`Overview story: ${nameOverviewPage} (${breadcrumb})`)
    })

    // choose a story on the stories page, click the name of the person featured and see that it redirects to the correct detail page
    test("click name to detail page", async ({ page }) => {
        const stories = page.locator("div.viewport--large h3.heading a")
        const countStories = await stories.count()
        let random = getRandomNumber(1, countStories)
        const nameListPage = await stories.nth(random - 1).innerText()
        const storyListPage = await stories.nth(random - 1).locator("//ancestor::h3[contains(@class, 'heading')]/preceding-sibling::div[contains(@class, 'tags')]//li[@data-testid='tag-item']").innerText()
        await Promise.all([
            page.waitForNavigation(),
            stories.nth(random - 1).click()
        ])
        const breadcrumb = await page.locator("a[itemprop=item] span").last().innerText()
        expect.soft(breadcrumb.toLowerCase()).toEqual(storyListPage.toLowerCase())
        const nameOverviewPage = await page.locator("h1.heading").innerText()
        expect.soft(nameOverviewPage).toEqual(nameListPage)
        console.log(`Chosen story: ${nameListPage} (${storyListPage})`)
        console.log(`Story page URL: ${page.url()}`)
        console.log(`Overview story: ${nameOverviewPage} (${breadcrumb})`)
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