const { test, expect } = require('@playwright/test')
const { getRandomNumber, getRandomCharacters } = require("../../common/common-functions")
const { CompleteLogin } = require("../../common/common-classes")
const data = require("../../common/common-details.json")

test.beforeEach(async ({ page }) => {
    const login = new CompleteLogin(page)
    await login.employerHubLogin()
    await Promise.all([
        page.waitForNavigation(),
        page.locator("//a[contains(@class, 'Navigationstyle__MenuLink') and span/text()='Employer Profile']").nth(1).click()
    ])
})

// tests that can be done on the employer profile section in the employer hub
test.describe('test for employer profile on the employer hub', async () => {
    // tests for the basic details section under employer profile
    test.describe('basic details section on employer profile', async () => {
        // before each test, go to the basic details section
        test.beforeEach(async ({ page }) => {
            await page.locator("//span[contains(@class, 'Stepperstyle__StepLabel-sc') and text()='Basic Details']").click()
        })

        // first check for error when user input blank organisation name
        // then edit the organisation name successfully
        test('edit organisation name', async ({ page }) => {
            await page.fill("input[name=title]", "")
            await page.click("button.button span:has-text('Save')")
            await expect(page.locator("span.icon--danger")).toBeVisible()
            await expect(page.locator("//p[contains(@class, 'Formstyle__ErrorMessage') and text()='This field is required']")).toBeVisible()
            const random = getRandomCharacters(6)
            await page.fill("input[name=title]", `Deloitte_${random}`)
        })

        // remove all existing names then add two new names
        test('edit alternative organisation names', async ({ page }) => {
            const alternateOrganisationNames = page.locator("//span[label/text()='Alternative organisation names']/following-sibling::div")
            const remove = alternateOrganisationNames.locator("//button[text()='Remove']")
            const removeCount = await remove.count()
            for (let i = 0; i < removeCount; i++) {
                await remove.nth(0).click()
            }
            page.waitForTimeout(5000)
            const add = alternateOrganisationNames.locator("//button[text()='Add']")
            await add.click()
            await add.click()
            let random = getRandomCharacters(6)
            await page.locator("input[name='alternativeNames.0']").fill(`Alt Organisation Name_${random}`)
            random = getRandomCharacters(6)
            await page.locator("input[name='alternativeNames.1']").fill(`Alt Organisation Name_${random}`)
        })

        // check for error message when input an invalid link
        // then enter a correct link and save
        test('edit recruitment homepage link', async ({ page }) => {
            await page.locator("input[name='websiteURL']").fill("hello")
            await page.click("button.button span:has-text('Save')")
            await expect(page.locator("span.icon--danger")).toBeVisible()
            await expect(page.locator("//p[contains(@class, 'Formstyle__ErrorMessage') and text()='URL is not valid']")).toBeVisible()
            await page.locator("input[name='websiteURL']").fill(data.employerHubUrl)
            await page.click("label:has-text('Link to your recruitment homepage')")
        })
    })

    // tests for the branding section under employer profile
    test.describe('branding section on employer profile', async () => {

    })
})

// after each test, click on the save button and check for the confirmation message
test.afterEach(async ({ page }) => {
    await page.click("button.button span:has-text('Save')")
    await expect(page.locator("//div[contains(@class, 'Formstyle__Alert')]/p[text()='Profile was successfully updated.']")).toBeVisible()
})