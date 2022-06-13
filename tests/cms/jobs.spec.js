const { test, expect } = require('@playwright/test')
const data = require("../../common/common-details.json")

test.use({
    storageState: 'resources/authStateProdCMS.json'
})

// tests for login to the CMS
test.describe('tests for jobs on CMS', async () => {
    // add job content via group section
    test('job creation', async ({ page }) => {
        await page.goto(data.cmsUrl + "/group/6/content/create/group_node%3Acareer_opportunity")
        await page.fill("input[name=email]", data.cmsEmail)
        await page.fill("input[name=password]", data.cmsPass)
        await Promise.all([
            page.waitForNavigation(),
            page.click("span.auth0-label-submit")
        ])
        await page.locator("a.toolbar-icon-user").waitFor()
    })
})