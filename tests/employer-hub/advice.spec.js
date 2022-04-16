const { test, expect } = require('@playwright/test')
const { getRandomNumber, getRandomCharacters } = require("../../common/common-functions")
const { CompleteLogin, Input } = require("../../common/common-classes")
const data = require("../../common/common-details.json")

test.beforeEach(async ({ page }) => {
    const login = new CompleteLogin(page)
    await login.employerHubLogin()
    await Promise.all([
        page.waitForNavigation(),
        page.locator("//a[contains(@class, 'Navigationstyle__MenuLink') and span/text()='Advice']").nth(1).click()
    ])
    await Promise.all([
        page.waitForNavigation(),
        page.locator("//div[contains(@class, 'GenericTeaserstyle__ActionsContainer-sc')]/a[text()='Edit']").nth(0).click()
    ])
})

// tests for editing a advice article
test.describe('edit advice article', async () => {
    // tests for the basic details section on job opportunities
    test.describe('basic details section', async () => {
        // before each test, go to the basic details section
        test.beforeEach(async ({ page }) => {
            await page.locator("//span[contains(@class, 'Stepperstyle__StepLabel-sc') and text()='Basic Details']").click()
        })

        // test to update the article title
        // check for error message when the field was left blank
        test('update article title', async ({ page }) => {
            await page.locator("input[name=title]").fill("")
            await page.click("button.button span:has-text('Save')")
            await expect(page.locator("span.icon--danger")).toBeVisible()
            await expect(page.locator("//p[contains(@class, 'Formstyle__ErrorMessage') and text()='This field is required']")).toBeVisible()
            const random = getRandomCharacters(6)
            await page.locator("input[name=title]").fill(`New Article - ${random}`)
            await page.locator("//label[text()='Title']").click()
            await page.click("button.button span:has-text('Save')")
            await page.locator("//a[text()='Close']").click()
            await Promise.all([
                page.waitForNavigation(),
                page.locator("//a[contains(@class, 'Navigationstyle__MenuLink') and span/text()='Advice']").nth(1).click()
            ])
            await page.locator("//div[contains(@class, 'GenericTeaserstyle__ActionsContainer-sc')]/a[text()='Edit']").nth(0).waitFor()
            const titleListPage = await page.locator("//h3[contains(@class, 'GenericTeaserstyle__Title-sc')]").nth(0).innerText()
            expect(titleListPage).toEqual(`New Article - ${random}`)
            await Promise.all([
                page.waitForNavigation(),
                page.locator("//div[contains(@class, 'GenericTeaserstyle__ActionsContainer-sc')]/a/span[text()='Preview']").nth(0).click()
            ])
            const titleOverviewPage = await page.locator("//h2[contains(@class, 'PageHeadingstyle__Heading')]").innerText()
            expect(titleOverviewPage).toEqual(`New Article - ${random}`)
        })

        // test to change the article type
        // check for error message when selected ---
        test.only('update article type', async ({ page }) => {
            const input = new Input(page)
            await page.locator("select[name=type]").selectOption({ label: "---" })
            await page.click("button.button span:has-text('Save')")
            await expect.soft(page.locator("span.icon--danger")).toBeVisible()
            await expect.soft(page.locator("//p[contains(@class, 'Formstyle__ErrorMessage') and text()='This field is required']")).toBeVisible()
            await input.randomSelect("select[name=type]", false)
            await page.click("button.button span:has-text('Save')")
            await page.locator("//a[text()='Close']").click()
        })
    })
})