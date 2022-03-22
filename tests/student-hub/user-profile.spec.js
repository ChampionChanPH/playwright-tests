const { test, expect } = require('@playwright/test')
const { getRandomNumber, getRandomCharacters } = require('../../common/common-functions')
const { CompleteLogin, Input } = require("../../common/common-classes")
const data = require("../../common/common-details.json")

const csv = "./resources/blank.xlsx"
const docMoreThan2MB = "./resources/numbercoloring.docx"
const doc = "./resources/blank.docx"

// go to the student hub homepage and login
test.beforeEach(async ({ page }) => {
    await page.goto(data.studentHubUrl)
    await page.waitForSelector("div.viewport--normal a.logo")
    const login = new CompleteLogin(page)
    await login.studentHubLogin()
    await page.hover("//button[@class='toggle-trigger']//span[contains(@class, 'icon--profile')]")
    await Promise.all([
        page.waitForNavigation(),
        page.locator('text=My Profile').nth(1).click()
    ])
})

// tests on the student hub user profile
test.describe("user profile tests", async () => {
    // tests to perform on "Personal Details" section
    // FIXME: find a way to get rid of the waitfortimeout and still make sure that it waits that the name on welcome message on top has changed
    test("personal details section", async ({ page }) => {
        await page.locator("//h3[contains(@class, 'field-set__label') and text()='Personal Details']").waitFor()
        const personal = page.locator("//h3[contains(@class, 'field-set__label') and text()='Personal Details']")
        const checkVisible = await personal.isVisible()
        test.skip(!checkVisible, "skip test when no personal details section")
        const form = personal.locator("//following-sibling::form")
        let currentFirstName = await form.locator("//label[contains(@class, input-label) and text()='First Name']/following-sibling::div").innerText()
        let currentLastName = await form.locator("//label[contains(@class, input-label) and text()='Last Name']/following-sibling::div").innerText()
        console.log(`current name: ${currentFirstName} ${currentLastName}`)
        await personal.locator("//following-sibling::button[@class='field-set__trigger']").click()
        let randomFirstName = getRandomCharacters(6)
        await form.locator("//input[@name='givenName']").fill(`Prosple_${randomFirstName}`)
        let randomLastName = getRandomCharacters(6)
        await form.locator("//input[@name='familyName']").fill(`Test_${randomLastName}`)
        await Promise.all([
            page.waitForTimeout(3000),
            form.locator("//button[text()='Submit']").click()
        ])
        await page.waitForSelector("//li[@data-testid='message-item' and p/text()='Form was submitted successfully.']")
        let newFirstName = await form.locator("//label[contains(@class, input-label) and text()='First Name']/following-sibling::div").innerText()
        let newLastName = await form.locator("//label[contains(@class, input-label) and text()='Last Name']/following-sibling::div").innerText()
        console.log(`new name: ${newFirstName} ${newLastName}`)
        expect.soft(newFirstName).toEqual(`Prosple_${randomFirstName}`)
        expect.soft(newLastName).toEqual(`Test_${randomLastName}`)
        const welcomeName = await page.locator(`//div[contains(@class, 'region--masthead')]//h1`).innerText()
        const profileName = await page.locator("div.auth-menu button.toggle-trigger a").innerText()
        expect.soft(welcomeName).toEqual(`Prosple_${randomFirstName}`)
        expect(profileName).toEqual(`Prosple_${randomFirstName}`)
    })

    // tests to perform on "Qualifications" section
    // FIXME: find a way to get rid of the waitfortimeout
    test("qualifications section", async ({ page }) => {
        const input = new Input(page)
        await page.locator("//h3[contains(@class, 'field-set__label') and text()='Personal Details']").waitFor()
        const qualitifications = page.locator("//h3[contains(@class, 'field-set__label') and text()='Qualifications']")
        const checkVisible = await qualitifications.isVisible()
        test.skip(!checkVisible, "skip test when no qualitifications section")
        await qualitifications.locator("//following-sibling::button[text()='Add a qualification']").click()
        const form = qualitifications.locator("//following-sibling::div//form")
        await expect.soft(form.locator("button.button:has-text('Submit')")).toBeVisible()
        let random = getRandomCharacters(6)
        let institution = `Adamson University_${random}`
        await form.locator("input[name=institution]").fill(institution)
        await input.randomSelect("//select[@name='country.0']", false)
        await form.locator("//label[contains(@class, 'input-label') and text()='Study Field']/following-sibling::*/button[text()='Add']").click()
        await input.randomSelect("//select[@name='studyField.0.0']", false)
        await input.randomSelect("//select[@name='degreeType.0']", false)
        await form.locator("input[name=courseName]").fill("")
        await form.locator("label:has-text('Qualification Name')").click()
        await expect(page.locator("//div[contains(@class, 'field--error') and text()='Name is required.']")).toBeVisible()
        await form.locator("input[name=courseName]").fill(`BS Computer Science_${random}`)
        let randomYear = getRandomNumber(2022, 2032)
        await form.locator("input[name=graduationYear]").fill(randomYear.toString())
        let randomLength = getRandomNumber(1, 10)
        await form.locator("input[name=courseLength]").fill(randomLength.toString())
        await input.randomSelect("//select[@name='grade.0']", false)
        await Promise.all([
            page.waitForTimeout(3000),
            form.locator("//button[text()='Submit']").click()
        ])
        await form.locator("div.field-set-view").waitFor()
        const name = await form.locator("div.name-tag__tags").innerText()
        const course = await form.locator("div.field-set-view h6").innerText()
        expect.soft(name).toEqual(institution.toUpperCase())
        expect(course).toEqual(`BS Computer Science_${random}`)
        await form.locator("button.button.button--remove").click()
    })

    // tests to perform on "More Information About You" section
    // FIXME: checkbox on "SEND ME INFORMATION ON RELEVANT CAREER & EDUCATION OPPORTUNITIES." is not working. commented out for now.
    test.only("more information about you section", async ({ page }) => {
        const input = new Input(page)
        await page.locator("//h3[contains(@class, 'field-set__label') and text()='Personal Details']").waitFor()
        const moreInfo = page.locator("//h3[contains(@class, 'field-set__label') and text()='More Information About You']")
        const checkVisible = await moreInfo.isVisible()
        test.skip(!checkVisible, "skip test when no more information about you section")
        const form = moreInfo.locator("//following-sibling::form")
        await moreInfo.locator("//following-sibling::button[@class='field-set__trigger']").click()
        await expect.soft(form.locator("button.button:has-text('Submit')")).toBeVisible()
        const mobile = "09" + getRandomNumber(1, 999999999).toString().padStart(9, "0")
        await form.locator("input[name=mobile]").fill(mobile)
        const nationality = await input.randomSelect("//select[@name='nationality.0']", false)
        const country = await input.randomSelect("//select[@name='countryOfResidence.0']", false)
        const workRight = await input.randomSelect("//select[@name='workRights.0']", false)
        const gender = await input.randomSelect("//select[@name='gender.0']", false)
        // const checked = await form.locator("input[name=opportunityAlerts]").getAttribute("class")
        // console.log(checked)
        // await form.locator("//input[@name='opportunityAlerts']").click()
        const remove = form.locator("button.button:has-text('Remove')")
        const removeCount = await remove.count()
        for (let i = 0; i < removeCount; i++) {
            await remove.nth(0).click()
        }
        await form.locator("button.button:has-text('Add')").click()
        const language = await input.randomSelect("//select[@name='spokenLanguages.0.0']", false)
        const removeFile = await page.locator("a.button:has-text('Remove')").isVisible()
        if (removeFile) await page.locator("a.button:has-text('Remove')").click()
        await form.locator("input[name=cv]").setInputFiles(docMoreThan2MB)
        await form.locator("//button[text()='Submit']").click()
        await expect(page.locator("//div[contains(@class, 'field--error') and text()='File size exeeds 2MB.']")).toBeVisible()
        await form.locator("input[name=cv]").setInputFiles(csv)
        await form.locator("//button[text()='Submit']").click()
        await expect(page.locator("//div[contains(@class, 'field--error') and text()='File type not allowed.']")).toBeVisible()
        await form.locator("input[name=cv]").setInputFiles(doc)
        await form.locator("//button[text()='Submit']").click()
        await page.waitForSelector("//li[@data-testid='message-item' and p/text()='Form was submitted successfully.']")
        let savedMobile = await form.locator("//label[contains(@class, input-label) and text()='Mobile']/following-sibling::div").innerText()
        let savedNationality = await form.locator("//label[contains(@class, input-label) and text()='Nationality']/following-sibling::div//li[@class='list__item']").innerText()
        let savedCountry = await form.locator("//label[contains(@class, input-label) and text()='Country of Residence']/following-sibling::div//li[@class='list__item']").innerText()
        let savedWorkRight = await form.locator("//label[contains(@class, input-label) and text()='Work Rights']/following-sibling::div//li[@class='list__item']").innerText()
        let savedGender = await form.locator("//label[contains(@class, input-label) and text()='Gender']/following-sibling::div//li[@class='list__item']").innerText()
        let savedLanguages = await form.locator("//label[contains(@class, input-label) and text()='Spoken Languages']/following-sibling::div//li[@class='list__item']").innerText()
        expect.soft(savedMobile).toEqual(mobile)
        expect.soft(savedNationality).toEqual(nationality)
        expect.soft(savedCountry).toEqual(country)
        expect.soft(savedWorkRight).toEqual(workRight)
        expect.soft(savedGender).toEqual(gender)
        expect(savedLanguages).toEqual(language)
    })

    // tests to perform on "Career Preferences" section
    test("career preferences section", async ({ page }) => {
        const input = new Input(page)
        await page.locator("//h3[contains(@class, 'field-set__label') and text()='Personal Details']").waitFor()
        const career = page.locator("//h3[contains(@class, 'field-set__label') and text()='Career Preferences']")
        const checkVisible = await career.isVisible()
        test.skip(!checkVisible, "skip test when no career preferences section")
        const form = career.locator("//following-sibling::div/form")
        await career.locator("//following-sibling::button[@class='field-set__trigger']").click()
        await expect.soft(form.locator("button.button:has-text('Submit')")).toBeVisible()
        const remove = form.locator("button.button:has-text('Remove')")
        const removeCount = await remove.count()
        for (let i = 0; i < removeCount; i++) {
            await remove.nth(0).click()
        }
        await form.locator("//label[contains(@class, 'input-label') and text()='Industries I Want to Work In']/following-sibling::*/button[text()='Add']").click()
        const chosenSector = await input.randomSelect("//select[@name='sectorInterests.0.0']", false)
        await form.locator("//label[contains(@class, 'input-label') and text()='Locations I Want to Work In']/following-sibling::*/button[text()='Add']").click()
        const chosenLocation = await input.randomSelect("//select[@name='workLocationPreference.0.0']", false)
        await form.locator("//button[text()='Submit']").click()
        await page.waitForSelector("//li[@data-testid='message-item' and p/text()='Form was submitted successfully.']")
        let sector = await form.locator("//label[contains(@class, input-label) and text()='Industries I Want to Work In']/following-sibling::div//li[@class='list__item']").innerText()
        let location = await form.locator("//label[contains(@class, input-label) and text()='Locations I Want to Work In']/following-sibling::div//li[@class='list__item']").innerText()
        expect.soft(sector).toEqual(chosenSector)
        expect(location).toEqual(chosenLocation)
    })

    // tests to perform on "About Your High School" section
    test("about your high school section", async ({ page }) => {

    })
})