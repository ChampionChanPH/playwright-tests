const { test, expect } = require('@playwright/test')
const data = require("../../common/common-details.json")
const { getRandomCharacters, getRandomNumber } = require('../../common/common-functions')

const logo = "./resources/prosple-logo.png"

test.use({
    storageState: 'resources/authStateDevCMS.json'
})

test.describe('e2e tests for adding employers in cms to frontend', async () => {
    // add employer content via group section
    // skip if prod site for now
    // test skipped because the employer is not showing up at all, delay for a couple of minutes
    test.skip('employer creation', async ({ page }) => {
        test.skip(data.cmsUrl == "https://cms.connect.prosple.com", "skip if it's a live testing")
        await page.goto(data.cmsUrl + "/group/6/content/create/group_node%3Aemployer")
        await page.locator("summary[aria-controls=edit-group-basic-details]").click()
        const random = getRandomCharacters(6)
        await page.locator("input[data-drupal-selector=edit-title-0-value]").fill(`Tester Company - ${random}`)
        await page.locator("input[data-drupal-selector=edit-field-advertiser-name-0-value]").fill(`Tester Company LLC - ${random}`)
        await page.locator("input[data-drupal-selector=edit-field-canonical-group-0-target-id]").fill("GradAustralia (6)")
        await page.locator("input[data-drupal-selector=edit-field-logo-open-button]").click()
        await page.locator("button:has-text('Insert selected')").waitFor()
        const logoCount = await page.locator("img[alt='prosple-logo.png']").count()
        const randomLogo = getRandomNumber(1, logoCount)
        await page.locator("img[alt='prosple-logo.png']").nth(randomLogo - 1).click()
        await page.locator("button:has-text('Insert selected')").click()
        await page.locator("button:has-text('Insert selected')").waitFor({ state: 'hidden' })
        await page.locator("div.field--name-thumbnail img[alt='prosple-logo.png']").waitFor()
        const sector = page.locator("div#edit-field-industry-sectors label")
        const sectorCount = await sector.count()
        const randomSector = getRandomNumber(1, sectorCount)
        await sector.nth(randomSector - 1).click()
        const location = page.locator("div#edit_field_locations_chosen")
        await location.click()
        await location.locator("input.chosen-search-input").type("Australia")
        await location.locator("li em:text('Australia')").first().click()
        await page.locator("input[data-drupal-selector=edit-field-target-recruiting-regions-0-target-id]").fill("Australia (9692)")
        const studyField = page.locator("div#edit-field-study-field span.fancytree-checkbox")
        const studyFieldCount = await studyField.count()
        const randomStudyField = getRandomNumber(1, studyFieldCount)
        await studyField.nth(randomStudyField - 1).click()
        await Promise.all([
            page.waitForNavigation(),
            page.locator("input[data-drupal-selector=edit-submit]").click()
        ])
        await Promise.all([
            page.waitForNavigation(),
            page.locator("input[data-drupal-selector=edit-submit]").click()
        ])
        await page.locator("//div[@role='contentinfo' and @aria-label='Status message']").waitFor()
        await page.goto(`${data.cmsToFrontEndUrl}/graduate-employers?default=1`)
        await page.waitForSelector("div.viewport--normal a.logo")
        const searchbox = page.locator("//div[contains(@class, 'viewport--normal')]//button[@class='toggle-trigger' and h4/text()='Search by name']/following-sibling::div[@class='toggle-target']")
        await searchbox.locator("input").fill(`Tester Company LLC - ${random}`)
        await searchbox.locator("span.icon--search").click()
        await page.locator("span:has-text('Updating Results')").last().waitFor({ state: "hidden" })
        const jobTitles = await page.locator("h2.heading a").allInnerTexts()
        console.log(jobTitles)
        expect(jobTitles.includes(`Tester Company LLC - ${random}`)).toBeTruthy()
    })
})

test.describe('e2e tests for updating employer contents in cms to frontend', async () => {

})