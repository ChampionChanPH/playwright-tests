const { test, expect } = require('@playwright/test')
const data = require("../../common/common-details.json")
const { CompleteLogin } = require("../../common/common-classes")
const { getRandomCharacters, getRandomNumber } = require('../../common/common-functions')
const moment = require('moment')

const logo = "./resources/prosple-logo.png"

test.use({
    storageState: 'resources/authStateDevCMS.json'
})

test.describe('e2e tests for adding jobs in cms to frontend', async () => {
    // add job content via group section
    // skip if prod site for now
    test('add job with only the required fields', async ({ page }) => {
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

    // include earlier application open date when adding a job in cms
    // job should have an apply now button
    test('add job with earlier application open date', async ({ page }) => {
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
        const openDateCMS = moment().subtract(1, 'M').format("YYYY-MM-DD")
        await page.locator("input[data-drupal-selector=edit-field-applications-open-date-0-value-date]").fill(openDateCMS)
        await page.locator("input[data-drupal-selector=edit-field-applications-open-date-0-value-time]").fill("00:00:00")
        await page.locator("input[data-drupal-selector=edit-field-apply-by-url-0-uri]").fill("http://example.com")
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
        await page.waitForSelector("div.viewport--normal a.logo")
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
        await expect(jobs.locator("//*[self::a or self::button][contains(@class, 'button--type-apply')]")).toBeVisible()
    })

    // include later application open date when adding a job in cms
    // job should not have an apply now button
    test('add job with later application open date', async ({ page }) => {
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
        await page.locator("input[data-drupal-selector=edit-field-apply-by-url-0-uri]").fill("http://example.com")
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
        await page.waitForSelector("div.viewport--normal a.logo")
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
        await expect(jobs.locator("//*[self::a or self::button][contains(@class, 'button--type-apply')]")).not.toBeVisible()
    })

    // include application close date when adding a job in cms
    // confirm correct data showing in frontend
    test('add job with earlier application close date', async ({ page }) => {
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
    // past application close date should put the job in expired but it takes several minutes after adding the job
    test.skip('add job with past application close date', async ({ page }) => {
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

    // add job content via group section
    // skip if prod site for now
    // set it as expired and check that the job is not showing in frontend
    test('add job but set it as expired', async ({ page }) => {
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
        await page.locator("label[for=edit-field-expired-value]").click()
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
        expect(jobTitles.includes(`Prosple Summer Internship Program - ${random}`)).not.toBeTruthy()
    })

    // include application link when adding a job in cms
    // job should have an apply now button
    test('add job with application link', async ({ page }) => {
        test.skip(data.cmsUrl == "https://cms.connect.prosple.com", "skip if it's a live testing")
        const applyLink = "https://example.com"
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
        await page.locator("input[data-drupal-selector=edit-field-apply-by-url-0-uri]").fill(`${applyLink}/${random}`)
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
        await page.waitForSelector("div.viewport--normal a.logo")
        const login = new CompleteLogin(page)
        await login.studentHubLogin()
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
        await jobs.locator("//*[self::a or self::button][contains(@class, 'button--type-apply')]").waitFor()
        await expect(jobs.locator("//*[self::a or self::button][contains(@class, 'button--type-apply')]")).toBeVisible()
        const link = await jobs.locator("//*[self::a or self::button][contains(@class, 'button--type-apply')]").getAttribute("href")
        expect(link).toEqual(`${applyLink}/${random}`)
    })

    // skip if prod site for now
    // add job and select any on expected start date (term reference, exact date or date range) and leave the other field blank
    test('add job with expected start date but leave other fields blank', async ({ page }) => {
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
        const startDateOptions = ["term_taxonomy", "exact_date", "date_range"]
        for (let index = 0; index < startDateOptions.length; index++) {
            const element = startDateOptions[index];
            await page.selectOption("select[data-drupal-selector=edit-field-start-date-option]", element)
            await Promise.all([
                page.waitForNavigation(),
                page.locator("input[data-drupal-selector=edit-submit]").click()
            ])
            await page.locator("//div[@role='contentinfo' and @aria-label='Error message']").isVisible()
        }
    })

    // skip if prod site for now
    // add job and select date range as expected start date and leave the start date field blank
    test('add job with date range as expected start date but leave start date field blank', async ({ page }) => {
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
        await page.selectOption("select[data-drupal-selector=edit-field-start-date-option]", "date_range")
        const closeDateCMS = moment().add(1, 'M').format("YYYY-MM-DD")
        await page.locator("input[data-drupal-selector=edit-field-start-date-range-0-end-value-date]").fill(closeDateCMS)
        await page.locator("input[data-drupal-selector=edit-field-start-date-range-0-end-value-time]").fill("00:00:00")
        await Promise.all([
            page.waitForNavigation(),
            page.locator("input[data-drupal-selector=edit-submit]").click()
        ])
        await page.locator("//div[@role='contentinfo' and @aria-label='Error message']").isVisible()
    })

    // skip if prod site for now 
    // add job and select date range as expected start date and leave the end date field blank
    test('add job with date range as expected start date but leave end date field blank', async ({ page }) => {
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
        await page.selectOption("select[data-drupal-selector=edit-field-start-date-option]", "date_range")
        const closeDateCMS = moment().add(1, 'M').format("YYYY-MM-DD")
        await page.locator("input[data-drupal-selector=edit-field-start-date-range-0-value-date]").fill(closeDateCMS)
        await page.locator("input[data-drupal-selector=edit-field-start-date-range-0-value-time]").fill("00:00:00")
        await Promise.all([
            page.waitForNavigation(),
            page.locator("input[data-drupal-selector=edit-submit]").click()
        ])
        await page.locator("//div[@role='contentinfo' and @aria-label='Error message']").isVisible()
    })

    // skip if prod site for now 
    // add job and select term reference then choose ASAP
    // check if data shows correctly in frontend
    test('add job with term reference of asap', async ({ page }) => {
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
        await page.selectOption("select[data-drupal-selector=edit-field-start-date-option]", "term_taxonomy")
        await page.selectOption("select[data-drupal-selector=edit-field-start-date-type]", "8")
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
        const index = jobTitles.indexOf(`Prosple Summer Internship Program - ${random}`)
        const jobs = page.locator("//li[contains(@class, 'SearchResultsstyle__SearchResult-sc')]").nth(index)
        const startDateValue = await jobs.locator("//div[contains(@class, 'field-label') and text()='Start Date']/following-sibling::*[contains(@class, 'field-item')]").innerText()
        console.log(startDateValue)
        expect(startDateValue).toEqual("ASAP")
    })

    // skip if prod site for now 
    // add job and select term reference then choose Ongoing
    // check if data shows correctly in frontend
    test('add job with term reference of ongoing', async ({ page }) => {
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
        await page.selectOption("select[data-drupal-selector=edit-field-start-date-option]", "term_taxonomy")
        await page.selectOption("select[data-drupal-selector=edit-field-start-date-type]", "779")
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
        const index = jobTitles.indexOf(`Prosple Summer Internship Program - ${random}`)
        const jobs = page.locator("//li[contains(@class, 'SearchResultsstyle__SearchResult-sc')]").nth(index)
        const startDateValue = await jobs.locator("//div[contains(@class, 'field-label') and text()='Start Date']/following-sibling::*[contains(@class, 'field-item')]").innerText()
        console.log(startDateValue)
        expect(startDateValue).toEqual("Ongoing")
    })

    // skip if prod site for now 
    // add job and select exact date then put the date and time
    // check if data shows correctly in frontend
    test('add job with exact date as start date option', async ({ page }) => {
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
        await page.selectOption("select[data-drupal-selector=edit-field-start-date-option]", "exact_date")
        const startDateCMS = moment().add(1, 'M').format("YYYY-MM-DD")
        await page.locator("input[data-drupal-selector=edit-field-start-date-0-value-date]").fill(startDateCMS)
        await page.locator("input[data-drupal-selector=edit-field-start-date-0-value-time]").fill("00:00:00")
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
        const index = jobTitles.indexOf(`Prosple Summer Internship Program - ${random}`)
        const jobs = page.locator("//li[contains(@class, 'SearchResultsstyle__SearchResult-sc')]").nth(index)
        const startDateFrontend = moment().add(1, 'M').format("D MMM YYYY")
        const startDateValue = await jobs.locator("//div[contains(@class, 'field-label') and text()='Start Date']/following-sibling::*[contains(@class, 'field-item')]").innerText()
        console.log(startDateValue)
        expect(startDateValue).toEqual(startDateFrontend)
    })

    // skip if prod site for now 
    // add job and select date range then put the date and time
    // check if data shows correctly in frontend
    test('add job with date range as start date option', async ({ page }) => {
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
        await page.selectOption("select[data-drupal-selector=edit-field-start-date-option]", "date_range")
        const startDateCMS = moment().add(1, 'M').format("YYYY-MM-DD")
        const endDateCMS = moment().add(2, 'M').format("YYYY-MM-DD")
        await page.locator("input[data-drupal-selector=edit-field-start-date-range-0-value-date]").fill(startDateCMS)
        await page.locator("input[data-drupal-selector=edit-field-start-date-range-0-value-time]").fill("00:00:00")
        await page.locator("input[data-drupal-selector=edit-field-start-date-range-0-end-value-date]").fill(endDateCMS)
        await page.locator("input[data-drupal-selector=edit-field-start-date-range-0-end-value-time]").fill("00:00:00")
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
        const index = jobTitles.indexOf(`Prosple Summer Internship Program - ${random}`)
        const jobs = page.locator("//li[contains(@class, 'SearchResultsstyle__SearchResult-sc')]").nth(index)
        const startDateFrontend = moment().add(1, 'M').format("D MMM YYYY")
        const endDateFrontend = moment().add(2, 'M').format("D MMM YYYY")
        const startDateValue = await jobs.locator("//div[contains(@class, 'field-label') and text()='Start Date']/following-sibling::*[contains(@class, 'field-item')]").innerText()
        console.log(startDateValue)
        expect(startDateValue).toEqual(`${startDateFrontend} - ${endDateFrontend}`)
    })
})

// tests to open an existing job and do some updates and check in the frontend that the new data is showing up correctly.
test.describe.skip('e2e tests for updating job contents in cms to frontend', async () => {
    // skip if prod site for now 
    // update the opportunity name of the job then confirm data is correct in frontend
    test('update opportunity name', async ({ page }) => {
        test.skip(data.cmsUrl == "https://cms.connect.prosple.com", "skip if it's a live testing")
        await page.goto(data.cmsUrl + "/node/47748/edit")
        await page.locator("summary[aria-controls=edit-group-basic-details]").click()
        const random = getRandomCharacters(6)
        await page.locator("input[data-drupal-selector=edit-title-0-value]").fill(`Prosple Test Opportunity - ${random}`)
        await Promise.all([
            page.waitForNavigation(),
            page.locator("input[data-drupal-selector=edit-submit]").click()
        ])
        await page.locator("//div[@role='contentinfo' and @aria-label='Status message']").waitFor()
        await page.goto(`${data.cmsToFrontEndUrl}/search-jobs?defaults_applied=1`)
        await page.locator("span:has-text('Updating Results')").last().waitFor({ state: "hidden" })
        const jobTitles = await page.locator("//a[contains(@class, 'JobTeaserstyle__JobTeaserTitleLink-sc')]").allInnerTexts()
        console.log(jobTitles)
        expect(jobTitles.includes(`Prosple Test Opportunity - ${random}`)).toBeTruthy()
    })

    test('update opportunity type', async ({ page }) => {
        test.skip(data.cmsUrl == "https://cms.connect.prosple.com", "skip if it's a live testing")
        await page.goto(data.cmsUrl + "/node/47748/edit")
        await page.locator("summary[aria-controls=edit-group-opportunity-details]").click()
        const jobCheckbox = page.locator("div#edit-field-opportunity-types input")
        const jobCheckboxCount = await jobCheckbox.count()
        for (let index = 0; index < jobCheckboxCount; index++) {
            const value = await jobCheckbox.nth(index).getAttribute("checked")
            if (value == "checked") {
                await jobCheckbox.nth(index).click()
            }
        }
        holder = []
        const jobType = page.locator("div#edit-field-opportunity-types label")
        const jobTypeCount = await jobType.count()
        for (let index = 0; index < jobTypeCount; index++) {
            const random = getRandomNumber(1, 10)
            if (random >= 5) {
                const label = await jobType.nth(index).innerText()
                holder.push(label)
                await jobType.nth(index).click()
            }
        }

        const randomJobType = getRandomNumber(1, jobTypeCount)
        await jobType.nth(randomJobType - 1).click()
        await Promise.all([
            page.waitForNavigation(),
            page.locator("input[data-drupal-selector=edit-submit]").click()
        ])
        await page.locator("//div[@role='contentinfo' and @aria-label='Status message']").waitFor()
        await page.goto(`${data.cmsToFrontEndUrl}/search-jobs?defaults_applied=1`)
        await page.locator("span:has-text('Updating Results')").last().waitFor({ state: "hidden" })
        const jobTitles = await page.locator("//a[contains(@class, 'JobTeaserstyle__JobTeaserTitleLink-sc')]").allInnerTexts()
        console.log(jobTitles)
        expect(jobTitles.includes(`Prosple Test Opportunity - ${random}`)).toBeTruthy()
    })
})
