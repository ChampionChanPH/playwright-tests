const { test, expect } = require('@playwright/test')
const data = require("../../common/common-details.json")
const { getRandomCharacters, getRandomNumber } = require('../../common/common-functions')
const moment = require('moment')

const logo = "./resources/prosple-logo.png"

test.use({
    storageState: 'resources/authStateDevCMS.json'
})

test.describe('e2e tests for adding jobs in cms to frontend', async () => {
    // add job content via group section
    // skip if prod site for now
    test('add jobs with only the required fields', async ({ page }) => {
        test.skip(data.cmsUrl == "https://cms.connect.prosple.com", "skip if it's a live testing")
        await page.goto(data.cmsUrl + "/group/6/content/create/group_node%3Acareer_opportunity")
        await page.locator("summary[aria-controls=edit-group-basic-details]").click()
        const random = getRandomCharacters(6)
        await page.locator("input[data-drupal-selector=edit-title-0-value]").fill(`Prosple Summer Internship Program - ${random}`)
        const timezone = page.locator("div[id=edit_field_time_zone_0_value_chosen]")
        await timezone.click()
        await timezone.locator("input.chosen-search-input").type("Sydney")
        await timezone.locator("li em:has-text('Sydney')").click()
        await page.locator("input[data-drupal-selector=edit-field-parent-employer-0-target-id]").fill("Tester Company (47384)")
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

    // include later application open date when adding a job in cms
    // job should not show in frontend
    test('add jobs with later application open date', async ({ page }) => {
        test.skip(data.cmsUrl == "https://cms.connect.prosple.com", "skip if it's a live testing")
        await page.goto(data.cmsUrl + "/group/6/content/create/group_node%3Acareer_opportunity")
        await page.locator("summary[aria-controls=edit-group-basic-details]").click()
        const random = getRandomCharacters(6)
        await page.locator("input[data-drupal-selector=edit-title-0-value]").fill(`Prosple Summer Internship Program - ${random}`)
        const timezone = page.locator("div[id=edit_field_time_zone_0_value_chosen]")
        await timezone.click()
        await timezone.locator("input.chosen-search-input").type("Sydney")
        await timezone.locator("li em:has-text('Sydney')").click()
        await page.locator("input[data-drupal-selector=edit-field-parent-employer-0-target-id]").fill("Tester Company (47384)")
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
        await page.locator("summary[aria-controls=edit-group-application-details]").click()
        const openDateCMS = moment().add(1, 'M').format("YYYY-MM-DD")
        await page.locator("input[data-drupal-selector=edit-field-applications-open-date-0-value-date]").fill(openDateCMS)
        await page.locator("input[data-drupal-selector=edit-field-applications-open-date-0-value-time]").fill("00:00:00")
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
        expect(jobTitles.includes(`Prosple Summer Internship Program - ${random}`)).not.toBeTruthy()
    })

    // include application close date when adding a job in cms
    test('add jobs with application close date', async ({ page }) => {
        test.skip(data.cmsUrl == "https://cms.connect.prosple.com", "skip if it's a live testing")
        await page.goto(data.cmsUrl + "/group/6/content/create/group_node%3Acareer_opportunity")
        await page.locator("summary[aria-controls=edit-group-basic-details]").click()
        const random = getRandomCharacters(6)
        await page.locator("input[data-drupal-selector=edit-title-0-value]").fill(`Prosple Summer Internship Program - ${random}`)
        const timezone = page.locator("div[id=edit_field_time_zone_0_value_chosen]")
        await timezone.click()
        await timezone.locator("input.chosen-search-input").type("Sydney")
        await timezone.locator("li em:has-text('Sydney')").click()
        await page.locator("input[data-drupal-selector=edit-field-parent-employer-0-target-id]").fill("Tester Company (47384)")
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
        await page.locator("summary[aria-controls=edit-group-application-details]").click()
        const closeDateCMS = moment().format("YYYY-MM-DD")
        await page.locator("input[data-drupal-selector=edit-field-applications-close-date-0-value-date]").fill(closeDateCMS)
        await page.locator("input[data-drupal-selector=edit-field-applications-close-date-0-value-time]").fill("00:00:00")
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
        const index = jobTitles.indexOf(`Prosple Summer Internship Program - ${random}`)
        const jobs = page.locator("//li[contains(@class, 'SearchResultsstyle__SearchResult-sc')]").nth(index)
        const closeDateFrontend = moment().format("D MMM YYYY")
        const closeDateValue = await jobs.locator("//div[contains(@class, 'field-label') and text()='Applications Close']/following-sibling::*[contains(@class, 'field-item')]").innerText()
        expect(closeDateValue).toEqual(closeDateFrontend)
    })

    // include application close date when adding a job in cms
    test('add jobs with past application close date', async ({ page }) => {
        test.skip(data.cmsUrl == "https://cms.connect.prosple.com", "skip if it's a live testing")
        await page.goto(data.cmsUrl + "/group/6/content/create/group_node%3Acareer_opportunity")
        await page.locator("summary[aria-controls=edit-group-basic-details]").click()
        const random = getRandomCharacters(6)
        await page.locator("input[data-drupal-selector=edit-title-0-value]").fill(`Prosple Summer Internship Program - ${random}`)
        const timezone = page.locator("div[id=edit_field_time_zone_0_value_chosen]")
        await timezone.click()
        await timezone.locator("input.chosen-search-input").type("Sydney")
        await timezone.locator("li em:has-text('Sydney')").click()
        await page.locator("input[data-drupal-selector=edit-field-parent-employer-0-target-id]").fill("Tester Company (47384)")
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
        await page.locator("summary[aria-controls=edit-group-application-details]").click()
        const closeDateCMS = moment().subtract(1, 'M').format("YYYY-MM-DD")
        await page.locator("input[data-drupal-selector=edit-field-applications-close-date-0-value-date]").fill(closeDateCMS)
        await page.locator("input[data-drupal-selector=edit-field-applications-close-date-0-value-time]").fill("00:00:00")
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
        expect(jobTitles.includes(`Prosple Summer Internship Program - ${random}`)).not.toBeTruthy()
    })
})

test.describe('e2e tests for updating job contents in cms to frontend', async () => {

})