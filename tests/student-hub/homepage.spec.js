const { test, expect} = require('@playwright/test')
const { getRandomNumber } = require('../../common/common-functions')
const data = require("../../common/common-details.json")

test.beforeEach(async ({ page }) => {
  await page.goto(data.studentHubUrl)
})

test.describe('homepage tests', async () => {
  test('check that the menu is working', async ({  page }) => {
    const count = await page.locator("//select").count()
    for(let i = 0; i < count; i++) {
      const dropdown = await page.locator("//select").nth(i).locator("//option").allInnerTexts()
      let random = getRandomNumber(1, dropdown.length)
      console.log(dropdown[random])
      await page.locator(`//select`).nth(i).selectOption({label: dropdown[random]})
    }
    await page.click(`div.input-group--actions button`)
    await page.waitForURL(/search-jobs/)
  })
})