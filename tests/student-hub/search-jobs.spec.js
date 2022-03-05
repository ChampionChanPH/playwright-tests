const { test, expect} = require('@playwright/test')
const { getRandomCharacters } = require('../../common/common-functions')
const { SH_URL } = require('../../common/login-credentials')
const data = require("../../common/common-details.json")

test.beforeEach(async ({ page }) => {
  console.log(data.studentHubUrl)
  await page.goto(`${SH_URL}search-jobs/`)
})

test.describe('search job page tests', async () => {
  test('check the study field filters', async ({ page }) => {
    await page.locator(`//button[@class='toggle-trigger' and */h4/text()="I'm studying or have a qualification in"]/following-sibling::div[@class='toggle-target']//a[contains(@class, 'truncate-trigger')]`).last().click()
    const filters = await page.locator(`//button[@class='toggle-trigger' and */h4/text()="I'm studying or have a qualification in"]/following-sibling::div[@class='toggle-target']`).last().locator(`//div[@class='facet__item']//a`).allInnerTexts()
    for(let i = 0; i < filters.length; i++) {
      let studyField = /.*(?= \()/.exec(filters[i])
      let total = /(?<=\()\d*/.exec(filters[i])[0]
      await page.locator(`//label/a[text()='${studyField}']`).last().click()
      await new Promise(r => setTimeout(r, 2000))
      const text = await page.locator(`//div[@class='search__meta']/p`).innerText()
      expect(text).toContain(total)
      await page.locator(`//label/a[text()='${studyField}']`).last().click()
    }
  })
})