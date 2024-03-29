const { test, expect } = require('@playwright/test')
const { getRandomNumber, getRandomCharacters } = require('../../common/common-functions')
const { CompleteLogin, VirtualExperience } = require("../../common/common-classes")
const data = require("../../common/common-details.json")

const csv = "./resources/blank.xlsx"
const doc = "./resources/blank.docx"

// tests on single page tests only
test.describe('single page tests', async () => {
    // test the apply webform on the jobs page
    // test is only for webform with the category set to application
    test("apply webform submission - application category", async ({ page }) => {
        await page.goto(data.studentHubUrl + "/graduate-employers/prosple/jobs-internships/prosple-summer-internship-program")
        await page.waitForSelector("div.viewport--normal a.logo")
        await page.locator("a[data-event-track=cta-webform]").first().click()
        const random = getRandomCharacters(6)
        await page.locator("input#first_name").fill(`Testing_${random}`)
        await page.locator("input#last_name").fill(`Prosple_${random}`)
        await page.locator("input#email").fill(data.studentHubEmail)
        await page.locator("input#degree_institution").fill(`University of Queensland_${random}`)
        await page.locator("input#degree_study_field").fill(`Computer Science_${random}`)
        await page.locator("input#degree_wam_or_gpa").fill(`4.0`)
        await page.locator("input#spoken_language").fill(`English`)
        await page.locator("input#mobile_number").fill(`09068888888`)
        await page.locator("input[name=upload_your_resume_or_cv]").setInputFiles(csv)
        await page.locator("input[name=upload_your_cover_letter]").setInputFiles(doc)
        await page.locator("//label[contains(@for, 'privacy_policy') and @class='webform__element--itemlabel']").click()
        await page.locator("button.button:has-text('Submit')").click()
        await expect(page.locator("//div[contains(@class, 'webform--error') and text()='Submission failed. Please try again.']")).toBeVisible()
        await page.locator("input[name=upload_your_resume_or_cv]").setInputFiles(doc)
        await page.locator("button.button:has-text('Submit')").click()
        await expect(page.locator("//h3[contains(@class, 'Webform__Heading-sc') and text()='Success!']")).toBeVisible()
        await page.locator("a.button:has-text('Sounds good')").click()
    })

    test("confirm default location is working", async ({ page }) => {
        let url = "https://id.prosple.com"
        if (data.studentHubUrl != "https://gradaustralia.com.au") url = data.studentHubUrl
        await page.goto(`${url}/search-jobs`)
        await page.waitForSelector("div.viewport--normal a.logo")
        expect(page.url()).toContain("?locations=")
    })

    test('user complete ve', async ({ page }) => {
        test.skip(data.studentHubUrl == "https://gradaustralia.com.au", "skip if it's a live testing")
        const virtualExperience = new VirtualExperience()
        await virtualExperience.deleteRegistration()
        await page.goto(`${data.studentHubUrl}/graduate-employers/prosple/jobs-internships/prosple-summer-internship-program`)
        const login = new CompleteLogin(page)
        await login.studentHubLogin()
        await page.locator("a[data-event-track=cta-ve-register]").first().click()
        await page.locator("input#organisation-consent").click()
        await page.locator("button:has-text('Submit')").click()
        await Promise.all([
            page.waitForNavigation(),
            page.locator("a:has-text('Continue to experience.')").click()
        ])
        await page.locator("div[data-testid=virtual-experience-status-badge] p").waitFor()
        await page.locator("div[data-testid=virtual-experience-status-badge] p:has-text('FETCHING STATUS...')").waitFor({ state: 'hidden' })
        let status = await page.locator("div[data-testid=virtual-experience-status-badge] p").innerText()
        expect(status).toEqual("NOT STARTED")
        await Promise.all([
            page.waitForNavigation(),
            page.locator("a:has-text('Go to Module')").first().click()
        ])
        await page.locator("button:has-text('Submit')").click()
        await expect(page.locator("//div[contains(@class, 'webform__element--error') and text()='Field is required.']")).toBeVisible()
        await page.locator("input#what_is_your_first_name_").fill("Prosple")
        await page.locator("button:has-text('Submit')").click()
        await page.locator("li:has-text('Module was submitted successfully. ')").waitFor()
        await page.locator("div[data-testid=module-status-badge] p").waitFor()
        await page.locator("div[data-testid=module-status-badge] p:has-text('FETCHING STATUS...')").waitFor({ state: 'hidden' })
        status = await page.locator("div[data-testid=module-status-badge] p").innerText()
        expect(status).toEqual("COMPLETED")
        await Promise.all([
            page.waitForNavigation(),
            page.locator("a:has-text('Overview')").click()
        ])
        await page.locator("div[data-testid=virtual-experience-status-badge] p").waitFor()
        await page.locator("div[data-testid=virtual-experience-status-badge] p:has-text('FETCHING STATUS...')").waitFor({ state: 'hidden' })
        status = await page.locator("div[data-testid=virtual-experience-status-badge] p").innerText()
        expect(status).toEqual("IN PROGRESS")
        await Promise.all([
            page.waitForNavigation(),
            page.locator("a:has-text('Go to Module')").last().click()
        ])
        await page.locator("button:has-text('Submit')").click()
        await expect(page.locator("//div[contains(@class, 'webform__element--error') and text()='Field is required.']")).toBeVisible()
        await page.locator("input#what_is_your_last_name_").fill("Prosple")
        await page.locator("button:has-text('Submit')").click()
        await page.locator("li:has-text('Module was submitted successfully. ')").waitFor()
        await page.locator("div[data-testid=module-status-badge] p").waitFor()
        await page.locator("div[data-testid=module-status-badge] p:has-text('FETCHING STATUS...')").waitFor({ state: 'hidden' })
        status = await page.locator("div[data-testid=module-status-badge] p").innerText()
        expect(status).toEqual("COMPLETED")
        await Promise.all([
            page.waitForNavigation(),
            page.locator("a:has-text('Overview')").click()
        ])
        await page.locator("div[data-testid=virtual-experience-status-badge] p").waitFor()
        await page.locator("div[data-testid=virtual-experience-status-badge] p:has-text('FETCHING STATUS...')").waitFor({ state: 'hidden' })
        status = await page.locator("div[data-testid=virtual-experience-status-badge] p").innerText()
        expect(status).toEqual("COMPLETED")
    })
})