const { test, expect } = require('@playwright/test')
const { getRandomNumber, getRandomCharacters } = require('../../common/common-functions')
const { CompleteLogin } = require("../../common/common-classes")
const data = require("../../common/common-details.json")

const csv = "./resources/blank.xlsx"
const doc = "./resources/blank.docx"

// tests on single page tests only
test.describe('single page tests', async () => {
    // test the apply webform on the jobs page
    test("apply webform submission", async ({ page }) => {
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
})