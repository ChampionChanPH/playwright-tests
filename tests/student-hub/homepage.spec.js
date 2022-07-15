const { test, expect } = require('@playwright/test')
const { getRandomNumber } = require('../../common/common-functions')
const { CompleteLogin } = require("../../common/common-classes")
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
            page.click("//button[contains(@class, 'SearchBannerstyle__StyledButton-sc')]")
        ])
        console.log("choices:", choices)
        // expect(page.url()).toContain("/search-jobs")
        // const breadcrumbs = await page.locator("ul.breadcrumbs span").allTextContents()
        // console.log("breadcrumbs:", breadcrumbs)
        // choices.forEach(choice => {
        //     if (!(choice.includes("Any"))) {
        //         expect(breadcrumbs.includes(choice)).toBeTruthy()
        //     }
        // })
    })

    test('confirm that the keyword search is working', async ({ page }) => {
        const keyword = "Internship"
        const url = "https://theuniguide.com.au"
        if (data.studentHubUrl == "https://gradaustralia.com.au") {
            await page.goto(url)
            await page.waitForSelector("div.viewport--normal a.logo")
        }
        await page.locator("input#keyword-search").fill(keyword)
        await Promise.all([
            page.waitForNavigation(),
            page.click("//button[contains(@class, 'SearchBannerstyle__StyledButton-sc')]")
        ])
        await page.locator("span:has-text('Updating Results')").last().waitFor({ state: "hidden" })
        const filter = page.locator("//div[contains(@class, 'viewport viewport--normal')]//div[contains(@class, 'FacetInputTextstyle__FacetInputText-sc')]")
        const keywordFilter = filter.locator("//button[@class='toggle-trigger' and contains(h4/text(), 'Search by ')]/following-sibling::*[@class='toggle-target']")
        const term = await keywordFilter.locator("input[name=facet--input-text--fulltext]").inputValue()
        expect(term).toEqual(keyword)
        expect(page.url()).toContain(`fulltext=${keyword}`)
    })

    // check the 404 page
    test('confirm that 404 page is working', async ({ page }) => {
        const [response] = await Promise.all([
            page.waitForResponse(`${data.studentHubUrl}/404`),
            page.goto(`${data.studentHubUrl}/404`),
        ])
        expect.soft(response.status()).toBeGreaterThan(400)
    })

    // check individual pages and see if they are working
    test.slow('confirm if pages are available on the website', async ({ page }) => {
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

    // check each menu items on the website
    test('test for the menu on the website', async ({ page }) => {
        const menus = page.locator("//div[contains(@class, 'Headerstyle__HeaderBar-sc')]//div[contains(@class, 'viewport--menu-large')]/div/ul/li/a")
        const countMenus = await menus.count()
        for (let index = 0; index < countMenus; index++) {
            const menu = await menus.nth(index).innerText()
            console.log(menu)
            await Promise.all([
                page.waitForNavigation(),
                menus.nth(index).click()
            ])
        }
    })

    // bookmark an employer and user is not logged in
    // confirm that the login popup will show up and will be redirected to the login page
    test('bookmark an employer, login via popup', async ({ page }) => {
        const saveButton = page.locator("div.viewport--large div.organisation-card button.save")
        const countSaveButton = await saveButton.count()
        const random = getRandomNumber(1, countSaveButton)
        await saveButton.nth(random - 1).click()
        await Promise.all([
            page.waitForNavigation(),
            page.locator("button:has-text('Log in')").click()
        ])
        await expect(page.locator("h1:has-text('Sign in')")).toBeVisible()
    })

    // bookmark an employer and user is not logged in
    // confirm that the login popup will show up and will be redirected to the signup page
    test('bookmark an employer, signup via popup', async ({ page }) => {
        const saveButton = page.locator("div.viewport--large div.organisation-card button.save")
        const countSaveButton = await saveButton.count()
        const random = getRandomNumber(1, countSaveButton)
        await saveButton.nth(random - 1).click()
        await Promise.all([
            page.waitForNavigation(),
            page.locator("button:has-text('Sign up')").click()
        ])
        await expect(page.locator("h1:has-text('Sign up with')")).toBeVisible()
    })

    // bookmark an article and user is not logged in
    // confirm that the login popup will show up and will be redirected to the login page
    test('bookmark an article, login via popup', async ({ page }) => {
        const saveButton = page.locator("div.viewport--large").locator("//div[contains(@class, 'AdviceCardstyle__BaseAdviceCard-sc')]").locator("button.save")
        const countSaveButton = await saveButton.count()
        const random = getRandomNumber(1, countSaveButton)
        await saveButton.nth(random - 1).click()
        await Promise.all([
            page.waitForNavigation(),
            page.locator("button:has-text('Log in')").click()
        ])
        await expect(page.locator("h1:has-text('Sign in')")).toBeVisible()
    })

    // bookmark an article and user is not logged in
    // confirm that the login popup will show up and will be redirected to the signup page
    test('bookmark an article, signup via popup', async ({ page }) => {
        const saveButton = page.locator("div.viewport--large").locator("//div[contains(@class, 'AdviceCardstyle__BaseAdviceCard-sc')]").locator("button.save")
        const countSaveButton = await saveButton.count()
        const random = getRandomNumber(1, countSaveButton)
        await saveButton.nth(random - 1).click()
        await Promise.all([
            page.waitForNavigation(),
            page.locator("button:has-text('Sign up')").click()
        ])
        await expect(page.locator("h1:has-text('Sign up with')")).toBeVisible()
    })
})

// tests on homepage that requires users to login
test.describe("homepage tests for logged-in users", async () => {
    // login process
    test.beforeEach(async ({ page }) => {
        const login = new CompleteLogin(page)
        await login.studentHubLogin()
    })

    // bookmark an employer and check that what was saved is correct
    // FIXME: get rid of the waitfortimeout
    test("bookmark employer from homepage", async ({ page }) => {
        const employerCard = page.locator("div.viewport--large div.organisation-card")
        const countEmployerCard = await employerCard.count()
        const random = getRandomNumber(1, countEmployerCard)
        const employerHomePage = await employerCard.nth(random - 1).locator("h3.heading a").innerText()
        console.log("Bookmarked employer:", employerHomePage)
        await employerCard.last().waitFor({ state: "visible" })
        await employerCard.nth(random - 1).locator("a.save").click()
        await employerCard.nth(random - 1).locator("span:has-text('Saved')").waitFor()
        const textButton = await employerCard.nth(random - 1).locator("a.save span").last().innerText()
        expect.soft(textButton).toEqual("Saved")
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
        const employerBookmarked = await page.locator("h2.heading a").innerText()
        expect.soft(employerBookmarked).toEqual(employerHomePage)
        console.log("Saved employer:", employerBookmarked)
        await page.locator("div.teaser__item a.save").click()
        const message = await page.locator("h1.heading").innerText()
        expect(message).toEqual("No Saved Employers")
    })

    // bookmark an article and check that what was saved is correct
    // FIXME: get rid of the waitfortimeout
    test("bookmark article from homepage", async ({ page }) => {
        const articleCard = page.locator("div.viewport--large").locator("//div[contains(@class, 'AdviceCardstyle__BaseAdviceCard-sc')]")
        const countArticleCard = await articleCard.count()
        const random = getRandomNumber(1, countArticleCard)
        const articleHomePage = await articleCard.nth(random - 1).locator("//h5[contains(@class, 'AdviceCardstyle__AdviceHeading-sc')]/a").innerText()
        console.log("Bookmarked article:", articleHomePage)
        await articleCard.last().waitFor({ state: "visible" })
        await articleCard.nth(random - 1).locator("a.save").click()
        await articleCard.nth(random - 1).locator("span:has-text('Saved')").waitFor()
        const textButton = await articleCard.nth(random - 1).locator("a.save span").last().innerText()
        expect.soft(textButton).toEqual("Saved")
        await page.hover("//button[@class='toggle-trigger']//span[contains(@class, 'icon--profile')]")
        await Promise.all([
            page.waitForNavigation(),
            page.locator('text=My Bookmarks').nth(1).click()
        ])
        await Promise.all([
            page.waitForNavigation(),
            page.locator("//div[contains(@class, 'region--sidebar')]//a[text()='Advice']").click()
        ])
        await page.waitForTimeout(3000)
        const articleBookmarked = await page.locator("h3.heading a").innerText()
        expect.soft(articleBookmarked).toEqual(articleHomePage)
        console.log("Saved article:", articleBookmarked)
        await page.locator("a.save").click()
        const message = await page.locator("h1.heading").innerText()
        expect(message).toEqual("No Saved Articles")
    })
})