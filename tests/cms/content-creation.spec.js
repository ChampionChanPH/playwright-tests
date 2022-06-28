const { test, expect } = require('@playwright/test')
const data = require("../../common/common-details.json")
const { getRandomCharacters, getRandomNumber } = require('../../common/common-functions')

const logo = "./resources/prosple-logo.png"

test.use({
    storageState: 'resources/authStateDevCMS.json'
})

test.describe('tests for creating contents on CMS', async () => {
    // add job content via group section
    // skip if prod site for now
    test('job creation', async ({ page }) => {
        test.skip(data.cmsUrl == "https://cms.connect.prosple.com", "skip if it's a live testing")
        await page.goto(data.cmsUrl + "/group/6/content/create/group_node%3Acareer_opportunity")
        await page.locator("summary[aria-controls=edit-group-basic-details]").click()
        const random = getRandomCharacters(6)
        await page.locator("input[data-drupal-selector=edit-title-0-value]").fill(`Prosple Summer Internship Program - ${random}`)
        const timezone = page.locator("div[id=edit_field_time_zone_0_value_chosen]")
        await timezone.click()
        await timezone.locator("input.chosen-search-input").type("Sydney")
        await timezone.locator("li em:has-text('Sydney')").click()
        await page.locator("input[data-drupal-selector=edit-field-parent-employer-0-target-id]").fill("Prosple (27021)")
        await page.locator("summary[aria-controls=edit-group-opportunity-details]").click()
        const jobType = page.locator("div#edit-field-opportunity-types label")
        const jobTypeCount = await jobType.count()
        const randomJobType = getRandomNumber(1, jobTypeCount)
        await jobType.nth(randomJobType - 1).click()
        const sector = page.locator("div#edit-field-industry-sectors label")
        const sectorCount = await sector.count()
        const randomSector = getRandomNumber(1, sectorCount)
        await sector.nth(randomSector - 1).click()
        await page.locator("div#cke_edit-field-overview-0-value div#cke_1_contents").click()
        const content = `Overview content needed for this job opportunity.`
        await page.locator("div#cke_edit-field-overview-0-value div#cke_1_contents").type(content)
        const location = page.locator("div#edit_field_on_site_locations_chosen")
        await location.click()
        await location.locator("input.chosen-search-input").type("Australia")
        await location.locator("li em:text('Australia')").first().click()
        await page.locator("summary[aria-controls=edit-group-requirements]").click()
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
        await page.goto(`${data.cmsToFrontEndUrl}/search-jobs?defaults_applied=1`)
        await Promise.all([
            page.waitForNavigation(),
            page.locator('select').selectOption({ label: "Newest Opportunities" })
        ])
        await page.locator("span:has-text('Updating Results')").last().waitFor({ state: "hidden" })
        const jobTitles = await page.locator("//a[contains(@class, 'JobTeaserstyle__JobTeaserTitleLink-sc')]").allInnerTexts()
        console.log(jobTitles)
        expect(jobTitles.includes(`Prosple Summer Internship Program - ${random}`)).toBeTruthy()
    })

    // add employer content via group section
    // skip if prod site for now
    // test skipped because the employer is not showing up at all, delay for a couple of minutes
    test('employer creation', async ({ page }) => {
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