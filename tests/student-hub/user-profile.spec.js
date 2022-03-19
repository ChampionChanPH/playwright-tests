const { test, expect } = require('@playwright/test')
const { getRandomNumber } = require('../../common/common-functions')
const { CompleteLogin } = require("../../common/common-classes")
const data = require("../../common/common-details.json")

// go to the seo landing page for graduate jobs
test.beforeEach(async ({ page }) => {
    await page.goto(data.studentHubUrl)
    await page.waitForSelector("div.viewport--normal a.logo")
    const login = new CompleteLogin(page)
    await login.studentHubLogin()
})