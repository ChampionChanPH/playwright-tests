const { test, expect } = require('@playwright/test')
const { getRandomNumber, getRandomCharacters } = require("../../common/common-functions")
const { CompleteLogin, Input } = require("../../common/common-classes")
const data = require("../../common/common-details.json")

const csv = "./resources/blank.xlsx"
const prospleLogo = "./resources/prosple-logo.png"
const prospleBackground = "./resources/prosple-background.jpg"

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
        // before each test, go to the brading section
        test.beforeEach(async ({ page }) => {
            await page.locator("//span[contains(@class, 'Stepperstyle__StepLabel-sc') and text()='Branding']").click()
        })

        // remove existing logo and add a new one
        test('edit your logo', async ({ page }) => {
            const logo = page.locator("//span[label/text()='Your logo']/following-sibling::div")
            await logo.locator("span.icon--pencil").click()
            await logo.locator("input[name=logoUpload]").setInputFiles(csv)
            await expect(page.locator("span.icon--danger")).toBeVisible()
            await expect(page.locator("//p[contains(@class, 'Formstyle__ErrorMessage') and text()='Unsupported format']")).toBeVisible()
            await logo.locator("input[name=logoUpload]").setInputFiles(prospleLogo)
        })

        // remove existing banner and add a new one
        test('edit your banner image', async ({ page }) => {
            const banner = page.locator("//span[label/text()='Your banner image']/following-sibling::div")
            await banner.locator("span.icon--pencil").click()
            await banner.locator("input[name=bannerUpload]").setInputFiles(csv)
            await expect(page.locator("span.icon--danger")).toBeVisible()
            await expect(page.locator("//p[contains(@class, 'Formstyle__ErrorMessage') and text()='Unsupported format']")).toBeVisible()
            await banner.locator("input[name=bannerUpload]").setInputFiles(prospleBackground)
        })
    })

    // tests for the social media section under employer profile
    test.describe('social media section on employer profile', async () => {
        // before each test, go to the social media section
        test.beforeEach(async ({ page }) => {
            await page.locator("//span[contains(@class, 'Stepperstyle__StepLabel-sc') and text()='Social Media']").click()
        })

        test('social media links', async ({ page }) => {
            await page.locator("input[name=facebookURL]").fill('a')
            await page.locator("input[name=twitterURL]").fill('b')
            await page.locator("input[name=linkedinURL]").fill('c')
            await page.locator("input[name=youtubeURL]").fill('d')
            await page.locator("input[name=instagramURL]").fill('e')
            await page.click("button.button span:has-text('Save')")
            const errorCount = await page.locator("//p[contains(@class, 'Formstyle__ErrorMessage') and text()='URL is not valid']").count()
            expect(errorCount).toBe(5)
            const random = getRandomCharacters(6)
            await page.locator("input[name=facebookURL]").fill(`https://facebook.com/${random}`)
            await page.locator("input[name=twitterURL]").fill(`https://twitter.com/${random}`)
            await page.locator("input[name=linkedinURL]").fill(`https://linkedin.com/${random}`)
            await page.locator("input[name=youtubeURL]").fill(`https://youtube.com/${random}`)
            await page.locator("input[name=instagramURL]").fill(`https://instagram.com/${random}`)
        })
    })

    // tests for the about the organisation section under employer profile
    test.describe('about the organisation section on employer profile', async () => {
        // before each test, go to the about the organisation section
        test.beforeEach(async ({ page }) => {
            await page.locator("//span[contains(@class, 'Stepperstyle__StepLabel-sc') and text()='About the Organisation']").click()
        })

        // edit the summary section
        // check for error message when the summary field is left blank or it has more than 150 characters
        test('edit the summary section', async ({ page }) => {
            await page.locator("textarea[name=summary]").fill("")
            await page.click("button.button span:has-text('Save')")
            await expect(page.locator("span.icon--danger")).toBeVisible()
            await expect(page.locator("//p[contains(@class, 'Formstyle__ErrorMessage') and text()='This field is required']")).toBeVisible()
            let random = getRandomCharacters(151, withSpaces = true)
            await page.locator("textarea[name=summary]").fill(random)
            await page.click("button.button span:has-text('Save')")
            await expect(page.locator("span.icon--danger")).toBeVisible()
            await expect(page.locator("//p[contains(@class, 'Formstyle__ErrorMessage') and text()='Characters should not exceed to 150']")).toBeVisible()
            await expect(page.locator("span.error")).toBeVisible()
            random = getRandomCharacters(150, withSpaces = true)
            await page.locator("textarea[name=summary]").fill(random)
        })

        // edit the why choose your organisation section
        // check for error message when the why choose section was left blank
        test('edit the why choose section', async ({ page }) => {
            const whyChoose = page.locator("//span[label/text()='Why choose your organisation?']/following-sibling::div")
            await whyChoose.locator("div.ck-editor__editable").click()
            await page.keyboard.press("Control+A")
            await page.keyboard.press("Delete")
            await page.click("button.button span:has-text('Save')")
            await expect(page.locator("span.icon--danger")).toBeVisible()
            await expect(page.locator("//p[contains(@class, 'Formstyle__ErrorMessage') and text()='This field is required']")).toBeVisible()
            await whyChoose.locator("div.ck-editor__editable").click()
            const body_content = "Why choose your organisation field with some random numbers: "
            const random = getRandomCharacters(6)
            await whyChoose.locator("div.ck-editor__editable").fill(`${body_content}${random}.`)
        })

        // edit the what can candidates expect in your recruitment process section
        // check for error message when the field was left blank
        test('edit the what can candidates expect section', async ({ page }) => {
            const whatExpect = page.locator("//span[label/text()='What can candidates expect in your recruitment process?']/following-sibling::div")
            await whatExpect.locator("div.ck-editor__editable").click()
            await page.keyboard.press("Control+A")
            await page.keyboard.press("Delete")
            await page.click("button.button span:has-text('Save')")
            await expect(page.locator("span.icon--danger")).toBeVisible()
            await expect(page.locator("//p[contains(@class, 'Formstyle__ErrorMessage') and text()='This field is required']")).toBeVisible()
            await whatExpect.locator("div.ck-editor__editable").click()
            const body_content = "What can candidates expect in your recruitment process field with some random numbers: "
            const random = getRandomCharacters(6)
            await whatExpect.locator("div.ck-editor__editable").fill(`${body_content}${random}.`)
        })

        // edit the what remuneration and career growth can candidates expect section
        // check for error message when the field was left blank
        test('edit the what can candidates expect section', async ({ page }) => {
            const label = page.locator("//span[label/text()='What remuneration and career growth can candidates expect?']")
            const whatRemuneration = label.locator("//following-sibling::div")
            await whatRemuneration.locator("div.ck-editor__editable").click()
            await page.keyboard.press("Control+A")
            await page.keyboard.press("Delete")
            await page.click("button.button span:has-text('Save')")
            await expect(page.locator("span.icon--danger")).toBeVisible()
            await expect(page.locator("//p[contains(@class, 'Formstyle__ErrorMessage') and text()='This field is required']")).toBeVisible()
            await whatRemuneration.locator("div.ck-editor__editable").click()
            const body_content = "What remuneration and career growth can candidates expect field with some random numbers: "
            const random = getRandomCharacters(6)
            await whatRemuneration.locator("div.ck-editor__editable").fill(`${body_content}${random}.`)
            await label.click()
        })

        // update the industry sectors section
        // check for error message when the option selected is ---
        test('update industry sectors', async ({ page }) => {
            const input = new Input(page)
            await page.locator("select[name=industrySectors]").selectOption({ label: "---" })
            await page.click("button.button span:has-text('Save')")
            await expect(page.locator("span.icon--danger")).toBeVisible()
            await expect(page.locator("//p[contains(@class, 'Formstyle__ErrorMessage') and text()='This field is required']")).toBeVisible()
            await input.randomSelect("select[name=industrySectors]", false)
        })

        // update the how many staff members section
        // check for error message when the option selected is ---
        test('update how many staff members section', async ({ page }) => {
            const input = new Input(page)
            await page.locator("select[name=numEmployees]").selectOption({ label: "---" })
            await page.click("button.button span:has-text('Save')")
            await expect(page.locator("span.icon--danger")).toBeVisible()
            await expect(page.locator("//p[contains(@class, 'Formstyle__ErrorMessage') and text()='This field is required']")).toBeVisible()
            await input.randomSelect("select[name=numEmployees]", false)
        })
    })

    // tests for the hiring criteria section under employer profile
    test.describe('hiring criteria section on employer profile', async () => {
        // before each test, go to the hiring criteria section
        test.beforeEach(async ({ page }) => {
            await page.locator("//span[contains(@class, 'Stepperstyle__StepLabel-sc') and text()='Hiring Criteria']").click()
        })

    })

    // tests for the hiring locations section under employer profile
    test.describe('hiring locations section on employer profile', async () => {
        // before each test, go to the hiring locations section
        test.beforeEach(async ({ page }) => {
            await page.locator("//span[contains(@class, 'Stepperstyle__StepLabel-sc') and text()='Hiring Locations']").click()
        })

    })
})

// after each test, click on the save button and check for the confirmation message
test.afterEach(async ({ page }) => {
    await page.click("button.button span:has-text('Save')")
    await expect(page.locator("//div[contains(@class, 'Formstyle__Alert')]/p[text()='Profile was successfully updated.']")).toBeVisible()
})