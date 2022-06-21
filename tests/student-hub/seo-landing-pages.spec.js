const { test, expect } = require('@playwright/test')
const { getRandomNumber } = require('../../common/common-functions')
const { CompleteLogin } = require("../../common/common-classes")
const data = require("../../common/common-details.json")

// go to the seo landing page for graduate jobs
test.beforeEach(async ({ page }) => {
    await page.goto(data.studentHubUrl + "/graduate-jobs")
    await page.waitForSelector("div.viewport--normal a.logo")
})

// tests that can be done on the seo landing pages on the student hub
test.describe('seo landing page tests', async () => {
    // choose options from the dropdowns and check that the search button will redirect to a different page
    test('confirm dropdowns and search button is working', async ({ page }) => {
        await page.locator("//select").last().waitFor()
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
        expect(page.url()).toContain("/search-jobs")
        // const breadcrumbs = await page.locator("ul.breadcrumbs span").allTextContents()
        // console.log("breadcrumbs:", breadcrumbs)
        // choices.forEach(choice => {
        //     if (!(choice.includes("Any"))) {
        //         expect(breadcrumbs.includes(choice)).toBeTruthy()
        //     }
        // })
    })

    // choose a job on the search jobs page with "Read reviews", click the link and see that it redirects to the correct detail page
    test("click review link to detail page", async ({ page }) => {
        const reviews = page.locator("//div[contains(@class, 'viewport--viewport-read-reviews')]")
        const countReviews = await reviews.count()
        if (countReviews == 0) test.skip()
        let random = getRandomNumber(1, countReviews)
        const employerListPage = await reviews.nth(random - 1).locator("//preceding-sibling::*[contains(@class, 'Logostyle__Logo')]//p").innerText()
        await Promise.all([
            page.waitForNavigation(),
            reviews.locator("//a").nth(random - 1).click()
        ])
        const employerOverviewPage = await page.locator("div.masthead__title h2.heading").innerText()
        const employerReviewTitle = await page.locator("h1.heading").innerText()
        expect(employerOverviewPage).toEqual(employerListPage)
        expect(employerReviewTitle).toEqual(`${employerListPage} Reviews`)
    })

    // choose a job on the search jobs page, click the job title and see that it redirects to the correct detail page
    test("click job title to detail page", async ({ page }) => {
        const jobs = page.locator("//div[contains(@class, 'OpportunityTeaserstyle__OpportunityListing')]")
        const countJobs = await jobs.count()
        let random = getRandomNumber(1, countJobs)
        const employerListPage = await jobs.nth(random - 1).locator("div.logo__item p").innerText()
        const jobTitleListPage = await jobs.nth(random - 1).locator("div.teaser__item--title a").innerText()
        await Promise.all([
            page.waitForNavigation(),
            jobs.nth(random - 1).locator("div.teaser__item--title a").click()
        ])
        const employerOverviewPage = await page.locator("div.masthead__title h2.heading").innerText()
        const jobTitleOverviewPage = await page.locator("h1.heading").innerText()
        expect(employerOverviewPage).toEqual(employerListPage)
        expect(jobTitleOverviewPage).toEqual(jobTitleListPage)
    })

    // clicking the advice article title will redirect to the correct detail page
    test("click article title to detail page", async ({ page }) => {
        const advices = page.locator("h2.heading:has-text('Advice for ')").locator("//following-sibling::div//div[@data-testid='collection-item']")
        const adviceCount = await advices.count()
        let random = getRandomNumber(1, adviceCount)
        const adviceTitle = await advices.nth(random - 1).locator("h3.heading a").innerText()
        console.log("chosen article:", adviceTitle)
        await Promise.all([
            page.waitForNavigation(),
            advices.nth(random - 1).locator("h3.heading a").click()
        ])
        const adviceTitleDetailPage = await page.locator("h1.heading").innerText()
        console.log("detail page article:", adviceTitleDetailPage)
        expect(adviceTitleDetailPage).toEqual(adviceTitle)
    })

    // clicking the video title will redirect to the correct detail page
    test("click video title to detail page", async ({ page }) => {
        const videos = page.locator("h2.heading:has-text('Videos for ')").locator("//following-sibling::div//div[@data-testid='collection-item']")
        const videoCount = await videos.count()
        let random = getRandomNumber(1, videoCount)
        const videoTitle = await videos.nth(random - 1).locator("h4.heading a").innerText()
        console.log("chosen video:", videoTitle)
        await Promise.all([
            page.waitForNavigation(),
            videos.nth(random - 1).locator("h4.heading a").click()
        ])
        const videoTitleDetailPage = await page.locator("h1.heading").innerText()
        console.log("detail page video:", videoTitleDetailPage)
        expect(videoTitleDetailPage).toEqual(videoTitle)
    })

    // clicking the video thumbnail will redirect to the correct detail page
    test("click video thumbnail to detail page", async ({ page }) => {
        const videos = page.locator("h2.heading:has-text('Videos for ')").locator("//following-sibling::div//div[@data-testid='collection-item']")
        const videoCount = await videos.count()
        let random = getRandomNumber(1, videoCount)
        const videoTitle = await videos.nth(random - 1).locator("h4.heading a").innerText()
        console.log("chosen video:", videoTitle)
        await Promise.all([
            page.waitForNavigation(),
            videos.nth(random - 1).locator("//div[contains(@class, 'VideoSnippetstyle__VideoSnippet')]/a").click()
        ])
        const videoTitleDetailPage = await page.locator("h1.heading").innerText()
        console.log("detail page video:", videoTitleDetailPage)
        expect(videoTitleDetailPage).toEqual(videoTitle)
    })

    // clicking the "Read full story" button on graduate stories section will redirect to the correct detail page
    test("click read full story button in graduate stories to detail page", async ({ page }) => {
        const stories = page.locator("h2.heading:has-text(' Graduate Success Stories')").locator("//following-sibling::div//div[@data-testid='collection-item']")
        const storyCount = await stories.count()
        let random = getRandomNumber(1, storyCount)
        const name = await stories.nth(random - 1).locator("div.viewport--large h3.heading a").innerText()
        const jobTitle = await stories.nth(random - 1).locator("//div[contains(@class, 'viewport--large')]/div[contains(@class, 'StorySnippetstyle__Byline')]").innerText()
        console.log(`chosen story: ${name} (${jobTitle})`)
        await Promise.all([
            page.waitForNavigation(),
            stories.nth(random - 1).locator("//div[contains(@class, 'StorySnippetstyle__StorySnippetActions')]/a").click()
        ])
        const nameDetailPage = await page.locator("h1.heading").innerText()
        const jobTitleDetailPage = await page.locator("//div[contains(@class, 'StoryDetailstyle__Byline')]").innerText()
        console.log(`detail page story: ${nameDetailPage} (${jobTitleDetailPage})`)
        expect.soft(nameDetailPage).toEqual(name)
        expect(jobTitleDetailPage).toEqual(jobTitle)
    })

    // clicking the name of the person featured in graduate stories section will redirect to the correct detail page
    test("click name in graduate stories to detail page", async ({ page }) => {
        const stories = page.locator("h2.heading:has-text(' Graduate Success Stories')").locator("//following-sibling::div//div[@data-testid='collection-item']")
        const storyCount = await stories.count()
        let random = getRandomNumber(1, storyCount)
        const name = await stories.nth(random - 1).locator("div.viewport--large h3.heading a").innerText()
        const jobTitle = await stories.nth(random - 1).locator("//div[contains(@class, 'viewport--large')]/div[contains(@class, 'StorySnippetstyle__Byline')]").innerText()
        console.log(`chosen story: ${name} (${jobTitle})`)
        await Promise.all([
            page.waitForNavigation(),
            stories.nth(random - 1).locator("div.viewport--large h3.heading a").click()
        ])
        const nameDetailPage = await page.locator("h1.heading").innerText()
        const jobTitleDetailPage = await page.locator("//div[contains(@class, 'StoryDetailstyle__Byline')]").innerText()
        console.log(`detail page story: ${nameDetailPage} (${jobTitleDetailPage})`)
        expect.soft(nameDetailPage).toEqual(name)
        expect(jobTitleDetailPage).toEqual(jobTitle)
    })

    // clicking the "Read full story" button on day in the life stories section will redirect to the correct detail page
    test("click read full story button in day in the life to detail page", async ({ page }) => {
        const stories = page.locator("h2.heading:has-text(' Day in the Life Stories')").locator("//following-sibling::div//div[@data-testid='collection-item']")
        const storyCount = await stories.count()
        let random = getRandomNumber(1, storyCount)
        const name = await stories.nth(random - 1).locator("div.viewport--large h3.heading a").innerText()
        const jobTitle = await stories.nth(random - 1).locator("//div[contains(@class, 'viewport--large')]/div[contains(@class, 'StorySnippetstyle__Byline')]").innerText()
        console.log(`chosen story: ${name} (${jobTitle})`)
        await Promise.all([
            page.waitForNavigation(),
            stories.nth(random - 1).locator("//div[contains(@class, 'StorySnippetstyle__StorySnippetActions')]/a[@data-event-track='cta-read-story']").first().click()
        ])
        const nameDetailPage = await page.locator("h1.heading").innerText()
        const jobTitleDetailPage = await page.locator("//div[contains(@class, 'StoryDetailstyle__Byline')]").innerText()
        console.log(`detail page story: ${nameDetailPage} (${jobTitleDetailPage})`)
        expect.soft(nameDetailPage).toEqual(name)
        expect(jobTitleDetailPage).toEqual(jobTitle)
    })

    // clicking the name of the person featured in day in the life stories section will redirect to the correct detail page
    test("click name in day in the life to detail page", async ({ page }) => {
        const stories = page.locator("h2.heading:has-text(' Day in the Life Stories')").locator("//following-sibling::div//div[@data-testid='collection-item']")
        const storyCount = await stories.count()
        let random = getRandomNumber(1, storyCount)
        const name = await stories.nth(random - 1).locator("div.viewport--large h3.heading a").innerText()
        const jobTitle = await stories.nth(random - 1).locator("//div[contains(@class, 'viewport--large')]/div[contains(@class, 'StorySnippetstyle__Byline')]").innerText()
        console.log(`chosen story: ${name} (${jobTitle})`)
        await Promise.all([
            page.waitForNavigation(),
            stories.nth(random - 1).locator("div.viewport--large h3.heading a").click()
        ])
        const nameDetailPage = await page.locator("h1.heading").innerText()
        const jobTitleDetailPage = await page.locator("//div[contains(@class, 'StoryDetailstyle__Byline')]").innerText()
        console.log(`detail page story: ${nameDetailPage} (${jobTitleDetailPage})`)
        expect.soft(nameDetailPage).toEqual(name)
        expect(jobTitleDetailPage).toEqual(jobTitle)
    })

    // clicking the employer name will redirect to the correct detail page
    test("click employer name to detail page", async ({ page }) => {
        const employers = page.locator("div.viewport--large div.grid__item")
        const employerCount = await employers.count()
        let random = getRandomNumber(1, employerCount)
        const name = await employers.nth(random - 1).locator("h3.heading a").innerText()
        console.log(`chosen employer: ${name}`)
        await Promise.all([
            page.waitForNavigation(),
            employers.nth(random - 1).locator("h3.heading a").click()
        ])
        const nameDetailPage = await page.locator("div.masthead__title h2.heading").innerText()
        console.log(`detail page employer: ${nameDetailPage}`)
        expect(nameDetailPage).toEqual(name)
    })

    // clicking the employer banner will redirect to the correct detail page
    test("click employer banner to detail page", async ({ page }) => {
        const employers = page.locator("div.viewport--large div.grid__item")
        const employerCount = await employers.count()
        let random = getRandomNumber(1, employerCount)
        const name = await employers.nth(random - 1).locator("h3.heading a").innerText()
        console.log(`chosen employer: ${name}`)
        await Promise.all([
            page.waitForNavigation(),
            employers.nth(random - 1).locator("div.organisation-card__banner a").click()
        ])
        const nameDetailPage = await page.locator("div.masthead__title h2.heading").innerText()
        console.log(`detail page employer: ${nameDetailPage}`)
        expect(nameDetailPage).toEqual(name)
    })

    // clicking the employer logo will redirect to the correct detail page
    test("click employer logo to detail page", async ({ page }) => {
        await page.locator("h2.heading:has-text('Employers recruiting for ')").click()
        const employers = page.locator("div.viewport--large div.grid__item")
        const employerCount = await employers.count()
        let random = getRandomNumber(1, employerCount)
        const name = await employers.nth(random - 1).locator("h3.heading a").innerText()
        console.log(`chosen employer: ${name}`)
        await Promise.all([
            page.waitForNavigation(),
            employers.nth(random - 1).locator("div.organisation-card__logo a").click()
        ])
        const nameDetailPage = await page.locator("div.masthead__title h2.heading").innerText()
        console.log(`detail page employer: ${nameDetailPage}`)
        expect(nameDetailPage).toEqual(name)
    })
})

// tests on seo landing page that requires users to login
test.describe("seo landing page tests for logged-in users", async () => {
    // login process
    test.beforeEach(async ({ page }) => {
        const login = new CompleteLogin(page)
        await login.studentHubLogin()
    })

    // confirm that the apply now button on the seo landing page is working as expected
    test("apply now button is clickable", async ({ page, context }) => {
        await page.locator("a.button--type-apply").nth(0).waitFor()
        const apply = page.locator("a.button--type-apply")
        const countApply = await apply.count()
        let random = getRandomNumber(1, countApply)
        await Promise.all([
            context.waitForEvent("page"),
            await apply.nth(random - 1).click()
        ])
    })

    // bookmark a job and see that what was saved on the account is correct
    // FIXME: get rid of the waitfortimeout
    test("bookmark job", async ({ page }) => {
        await page.waitForSelector("div.viewport--viewport-bookmark-large")
        const saveButton = page.locator("div.viewport--viewport-bookmark-large")
        const countSaveButton = await saveButton.count()
        let random = getRandomNumber(1, countSaveButton)
        const employerListPage = await saveButton.nth(random - 1).locator("//ancestor::div[contains(@class, 'OpportunityTeaserstyle__OpportunityListing')]//div[@class='logo__item']/p").innerText()
        const jobListPage = await saveButton.nth(random - 1).locator("//ancestor::div[contains(@class, 'OpportunityTeaserstyle__OpportunityListing')]//*[contains(@class, 'OpportunityTeaserstyle__OpportunityTitle')]").innerText()
        console.log("bookmarked employer:", employerListPage)
        console.log("bookmarked job:", jobListPage)
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
            page.locator("//div[contains(@class, 'region--sidebar')]//a[text()='Jobs']").click()
        ])
        await page.waitForTimeout(3000)
        const employerBookmarked = await page.locator("div.logo__item").innerText()
        const jobBookmarked = await page.locator("//*[contains(@class, 'OpportunityTeaserstyle__OpportunityTitle')]").innerText()
        expect.soft(employerBookmarked).toEqual(employerListPage)
        expect.soft(jobBookmarked).toEqual(jobListPage)
        console.log("saved employer:", employerBookmarked)
        console.log("saved job:", jobBookmarked)
        await page.locator("div.viewport--viewport-bookmark-large").click()
        const message = await page.locator("h1.heading").innerText()
        expect(message).toEqual("No Saved Jobs")
    })

    // bookmark an article and see that what was saved on the account is correct
    // FIXME: get rid of the waitfortimeout
    test("bookmark article", async ({ page }) => {
        await page.locator("h2.heading:has-text('Advice for ')").click()
        const advices = page.locator("h2.heading:has-text('Advice for ')").locator("//following-sibling::div//div[@data-testid='collection-item']")
        await advices.nth(0).locator("a.save").waitFor()
        const saveButton = advices.locator("a.save")
        const countSaveButton = await saveButton.count()
        let random = getRandomNumber(1, countSaveButton)
        const adviceTitle = await advices.nth(random - 1).locator("h3.heading a").innerText()
        console.log("bookmarked advice:", adviceTitle)
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
            page.locator("//div[contains(@class, 'region--sidebar')]//a[text()='Advice']").click()
        ])
        await page.waitForTimeout(3000)
        const adviceBookmarked = await page.locator("//*[contains(@class, 'AdviceSnippetstyle__AdviceSnippetContent')]/h3/a").innerText()
        expect.soft(adviceBookmarked).toEqual(adviceTitle)
        console.log("saved advice:", adviceBookmarked)
        await page.locator("a.save").click()
        const message = await page.locator("h1.heading").innerText()
        expect(message).toEqual("No Saved Articles")
    })

    // bookmark an employer and see that what was saved on the account is correct
    // FIXME: get rid of the waitfortimeout
    test("bookmark employer", async ({ page }) => {
        await page.locator("h2.heading:has-text('Employers recruiting for ')").click()
        const employers = page.locator("div.viewport--large div.grid__item")
        await employers.nth(0).locator("a.save").waitFor()
        const saveButton = employers.locator("a.save")
        const countSaveButton = await saveButton.count()
        let random = getRandomNumber(1, countSaveButton)
        const name = await employers.nth(random - 1).locator("h3.heading a").innerText()
        console.log("bookmarked employer:", name)
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
            page.locator("//div[contains(@class, 'region--sidebar')]//a[text()='Employers']").click()
        ])
        await page.waitForTimeout(3000)
        const employerBookmarked = await page.locator("//*[contains(@class, 'EmployerTeaserstyle__EmployerTeaser')]//header/h2[contains(@class, 'heading')]/a").innerText()
        expect.soft(employerBookmarked).toEqual(name)
        console.log("saved employer:", employerBookmarked)
        await page.locator("a.save").click()
        const message = await page.locator("h1.heading").innerText()
        expect(message).toEqual("No Saved Employers")
    })
})