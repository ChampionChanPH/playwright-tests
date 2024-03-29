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
    // const checkVisible = await page.locator("span.cc-1j8t").isVisible()
    // if (checkVisible) await page.locator("span.cc-1j8t").click()
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
        test.skip('edit organisation name', async ({ page }) => {
            await page.fill("input[name=title]", "")
            await page.click("button.button span:has-text('Save')")
            await expect(page.locator("span.icon--danger")).toBeVisible()
            await expect(page.locator("//p[contains(@class, 'Formstyle__ErrorMessage') and text()='This field is required']")).toBeVisible()
            const random = getRandomCharacters(6)
            await page.fill("input[name=title]", `Deloitte_${random}`)
            await page.click("button.button span:has-text('Save')")
            await expect.soft(page.locator("//div[contains(@class, 'Formstyle__Alert')]/p[text()='Profile was successfully updated.']")).toBeVisible()
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
            await page.click("button.button span:has-text('Save')")
            await expect.soft(page.locator("//div[contains(@class, 'Formstyle__Alert')]/p[text()='Profile was successfully updated.']")).toBeVisible()
        })

        // check for error message when input an invalid link
        // then enter a correct link and save
        test('edit recruitment homepage link', async ({ page }) => {
            const random = getRandomCharacters(6)
            await page.locator("input[name='websiteURL']").fill("hello")
            await page.click("button.button span:has-text('Save')")
            await expect(page.locator("span.icon--danger")).toBeVisible()
            await expect(page.locator("//p[contains(@class, 'Formstyle__ErrorMessage') and text()='URL is not valid']")).toBeVisible()
            await page.locator("input[name='websiteURL']").fill(`${data.employerHubUrl}/${random}`)
            await page.click("label:has-text('Link to your recruitment homepage')")
            await page.click("button.button span:has-text('Save')")
            await expect.soft(page.locator("//div[contains(@class, 'Formstyle__Alert')]/p[text()='Profile was successfully updated.']")).toBeVisible()
            await page.reload()
            const link = await page.locator("input[name='websiteURL']").inputValue()
            expect.soft(link).toEqual(`${data.employerHubUrl}/${random}`)
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
            await page.click("button.button span:has-text('Save')")
            await expect.soft(page.locator("//div[contains(@class, 'Formstyle__Alert')]/p[text()='Profile was successfully updated.']")).toBeVisible()
        })

        // remove existing banner and add a new one
        test('edit your banner image', async ({ page }) => {
            const banner = page.locator("//span[label/text()='Your banner image']/following-sibling::div")
            await banner.locator("span.icon--pencil").click()
            await banner.locator("input[name=bannerUpload]").setInputFiles(csv)
            await expect(page.locator("span.icon--danger")).toBeVisible()
            await expect(page.locator("//p[contains(@class, 'Formstyle__ErrorMessage') and text()='Unsupported format']")).toBeVisible()
            await banner.locator("input[name=bannerUpload]").setInputFiles(prospleBackground)
            await page.click("button.button span:has-text('Save')")
            await expect.soft(page.locator("//div[contains(@class, 'Formstyle__Alert')]/p[text()='Profile was successfully updated.']")).toBeVisible()
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
            await page.click("button.button span:has-text('Save')")
            await expect.soft(page.locator("//div[contains(@class, 'Formstyle__Alert')]/p[text()='Profile was successfully updated.']")).toBeVisible()
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
            let random = getRandomCharacters(151)
            await page.locator("textarea[name=summary]").fill(random)
            await page.click("button.button span:has-text('Save')")
            await expect(page.locator("span.icon--danger")).toBeVisible()
            await expect(page.locator("//p[contains(@class, 'Formstyle__ErrorMessage') and text()='Characters should not exceed to 150']")).toBeVisible()
            await expect(page.locator("span.error")).toBeVisible()
            random = getRandomCharacters(15) + ' ' + getRandomCharacters(15)
            await page.locator("textarea[name=summary]").fill(random)
            await page.click("button.button span:has-text('Save')")
            await expect.soft(page.locator("//div[contains(@class, 'Formstyle__Alert')]/p[text()='Profile was successfully updated.']")).toBeVisible()
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
            await page.click("button.button span:has-text('Save')")
            await expect.soft(page.locator("//div[contains(@class, 'Formstyle__Alert')]/p[text()='Profile was successfully updated.']")).toBeVisible()
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
            await page.click("button.button span:has-text('Save')")
            await expect.soft(page.locator("//div[contains(@class, 'Formstyle__Alert')]/p[text()='Profile was successfully updated.']")).toBeVisible()
        })

        // edit the what remuneration and career growth can candidates expect section
        // check for error message when the field was left blank
        test('edit the what remuneration section', async ({ page }) => {
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
            await page.click("button.button span:has-text('Save')")
            await expect.soft(page.locator("//div[contains(@class, 'Formstyle__Alert')]/p[text()='Profile was successfully updated.']")).toBeVisible()
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
            await page.click("button.button span:has-text('Save')")
            await expect.soft(page.locator("//div[contains(@class, 'Formstyle__Alert')]/p[text()='Profile was successfully updated.']")).toBeVisible()
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
            await page.click("button.button span:has-text('Save')")
            await expect.soft(page.locator("//div[contains(@class, 'Formstyle__Alert')]/p[text()='Profile was successfully updated.']")).toBeVisible()
        })
    })

    // tests for the hiring criteria section under employer profile
    test.describe('hiring criteria section on employer profile', async () => {
        // before each test, go to the hiring criteria section
        test.beforeEach(async ({ page }) => {
            await page.locator("//span[contains(@class, 'Stepperstyle__StepLabel-sc') and text()='Hiring Criteria']").click()
        })

        // edit what regions are you targeting candidates in field
        // check for error message when no region is selected
        test('edit target regions', async ({ page }) => {
            const input = new Input(page)
            const targetRegion = page.locator("//span[label/text()='What regions are you targeting candidates in?']/following-sibling::div")
            await targetRegion.locator("//button[text()='Remove']").waitFor()
            const remove = targetRegion.locator("//button[text()='Remove']")
            const removeCount = await remove.count()
            for (let i = 0; i < removeCount; i++) {
                await remove.nth(0).click()
            }
            await expect(page.locator("span.icon--danger")).toBeVisible()
            await expect(page.locator("//p[contains(@class, 'Formstyle__ErrorMessage') and text()='Select at least one location']")).toBeVisible()
            const add = targetRegion.locator("//button[text()='Add']")
            await add.click()
            await input.randomSelect("select.sc-khIgXV", false)
            await page.click("button.button span:has-text('Save')")
            await expect.soft(page.locator("//div[contains(@class, 'Formstyle__Alert')]/p[text()='Profile was successfully updated.']")).toBeVisible()
        })

        // edit what study fields does your organisation typically recruit from fields
        // check for error message when no study field is selected
        test('edit target study fields', async ({ page }) => {
            const studyFieldLabel = page.locator("//span[label/text()='What study fields does your organisation typically recruit from?']/following-sibling::div")
            const studyFields = studyFieldLabel.locator("//div[contains(@class, 'CheckboxGroup__CheckboxContainer-sc')]")
            await page.locator("//div[contains(@class, 'CheckboxTree__Container')]").waitFor()
            const countStudyFields = await studyFields.count()
            for (let i = 0; i < countStudyFields; i++) {
                const checkbox = await studyFields.nth(i).locator("div.input--type-checkbox input").getAttribute("class")
                if (checkbox == "is-checked") await studyFields.nth(i).locator("label").click()
            }
            await page.click("button.button span:has-text('Save')")
            await expect(page.locator("span.icon--danger")).toBeVisible()
            await expect(page.locator("//p[contains(@class, 'Formstyle__ErrorMessage') and text()='Select at least one study field']")).toBeVisible()
            for (let i = 0; i < countStudyFields; i++) {
                const random = getRandomNumber(1, 2)
                if (random == 1) await studyFields.nth(i).locator("label").click()
            }
            await page.click("button.button span:has-text('Save')")
            await expect.soft(page.locator("//div[contains(@class, 'Formstyle__Alert')]/p[text()='Profile was successfully updated.']")).toBeVisible()
        })
    })

    // tests for the hiring locations section under employer profile
    test.describe('hiring locations section on employer profile', async () => {
        // before each test, go to the hiring locations section
        test.beforeEach(async ({ page }) => {
            await page.locator("//span[contains(@class, 'Stepperstyle__StepLabel-sc') and text()='Hiring Locations']").click()
        })

        // edit what regions are your job opportunities located in field
        // check for error message when no region is selected
        test('edit target regions', async ({ page }) => {
            const input = new Input(page)
            const targetRegion = page.locator("//span[label/text()='What regions are your job opportunities located in?']/following-sibling::div")
            await targetRegion.locator("//button[text()='Remove']").waitFor()
            const remove = targetRegion.locator("//button[text()='Remove']")
            const removeCount = await remove.count()
            for (let i = 0; i < removeCount; i++) {
                await remove.nth(0).click()
            }
            await expect(page.locator("span.icon--danger")).toBeVisible()
            await expect(page.locator("//p[contains(@class, 'Formstyle__ErrorMessage') and text()='Select at least one location']")).toBeVisible()
            const add = targetRegion.locator("//button[text()='Add']")
            await add.click()
            await input.randomSelect("select.sc-khIgXV", false)
            await page.click("button.button span:has-text('Save')")
            await expect.soft(page.locator("//div[contains(@class, 'Formstyle__Alert')]/p[text()='Profile was successfully updated.']")).toBeVisible()
        })
    })
})