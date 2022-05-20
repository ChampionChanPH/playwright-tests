const { test, expect } = require('@playwright/test')
const { getRandomNumber, getRandomCharacters } = require("../../common/common-functions")
const { CompleteLogin, Input } = require("../../common/common-classes")
const data = require("../../common/common-details.json")

// go to the events section
test.beforeEach(async ({ page }) => {
    const login = new CompleteLogin(page)
    await login.employerHubLogin()
    await Promise.all([
        page.waitForNavigation(),
        page.locator("//a[contains(@class, 'Navigationstyle__MenuLink') and span/text()='Videos']").nth(1).click()
    ])
    const checkVisible = await page.locator("span.cc-1j8t").isVisible()
    if (checkVisible) await page.locator("span.cc-1j8t").click()
})

// test to add a new video on the employer hub
test.describe('tests to add a new video on the employer hub', async () => {
    // click on the add video button on the list page
    test.beforeEach(async ({ page }) => {
        await Promise.all([
            page.waitForNavigation(),
            page.locator("//a[text()='+ Add video']").click()
        ])
    })

    // test to add a new video
    test('add new video', async ({ page }) => {
        const random = getRandomCharacters(6)
        await page.locator("input[name=title]").fill(`New Video Title - ${random}`)
        await page.locator("input[name=url]").fill(`https://www.youtube.com/watch?v=6XYBbwXDj9o`)
        await page.click("button.button span:has-text('Submit')")
        await page.locator("//a[text()='Close']").click()
    })
})

// tests that can be done on the videos section in the employer hub
test.describe('tests to edit videos on the employer hub', async () => {
    // click on the edit button of the first content on the list page
    test.beforeEach(async ({ page }) => {
        await Promise.all([
            page.waitForNavigation(),
            page.locator("//div[contains(@class, 'Content__ContentBox-sc')]//a[text()='Edit']").nth(0).click()
        ])
    })

    // update the video title
    // check for error message when the field was left blank
    test('update video title', async ({ page }) => {
        await page.locator("input[name=title]").fill("")
        await page.click("button.button span:has-text('Save')")
        await expect(page.locator("//p[contains(@class, 'Formstyle__ErrorMessage') and text()='This field is required']")).toBeVisible()
        const random = getRandomCharacters(6)
        await page.locator("input[name=title]").fill(`New Video - ${random}`)
        await page.click("button.button span:has-text('Save')")
        await page.locator("//button[text()='Close']").click()
        await Promise.all([
            page.waitForNavigation(),
            page.locator("//a[contains(@class, 'Navigationstyle__MenuLink') and span/text()='Videos']").nth(1).click()
        ])
        await page.locator("//div[contains(@class, 'Content__ContentBox-sc')]//a[text()='Edit']").nth(0).waitFor()
        const titleListPage = await page.locator("//h3[contains(@class, 'GenericTeaserstyle__Title-sc')]").nth(0).innerText()
        expect(titleListPage).toEqual(`New Video - ${random}`)
        await Promise.all([
            page.waitForNavigation(),
            page.locator("//a[span/text()='Preview']").nth(0).click()
        ])
        const titlePreview = await page.locator("//h2[contains(@class, 'PageHeadingstyle__Heading')]").innerText()
        expect(titlePreview).toEqual(`New Video - ${random}`)
    })

    // update video introduction
    test('update video introduction', async ({ page }) => {
        const intro = getRandomCharacters(6)
        const intro_content = "Video introduction with some random characters:"
        await page.locator("textarea[name=introduction]").fill(`${intro_content} ${intro}.`)
        await page.click("button.button span:has-text('Save')")
        await page.locator("//button[text()='Close']").click()
        await Promise.all([
            page.waitForNavigation(),
            page.locator("//a[contains(@class, 'Navigationstyle__MenuLink') and span/text()='Videos']").nth(1).click()
        ])
        await page.locator("//div[contains(@class, 'Content__ContentBox-sc')]//a[text()='Edit']").nth(0).waitFor()
        const introListPage = await page.locator("//p[contains(@class, 'GenericTeaserstyle__Description-sc')]").nth(0).innerText()
        expect(introListPage).toEqual(`${intro_content} ${intro}.`)
        await Promise.all([
            page.waitForNavigation(),
            page.locator("//a[span/text()='Preview']").nth(0).click()
        ])
        const introPreview = await page.locator("//p[contains(@class, 'PageHeadingstyle__Subheading')]").innerText()
        expect(introPreview).toEqual(`${intro_content} ${intro}.`)
    })

    // update video description
    test('update video description', async ({ page }) => {
        const description = getRandomCharacters(6)
        const description_content = "Some video description with some random characters:"
        await page.locator("div.ck-editor__editable").click()
        await page.keyboard.press("Control+A")
        await page.keyboard.press("Delete")
        await page.locator("div.ck-editor__editable").fill(`${description_content} ${description}.`)
        await page.locator("label:has-text('Description')").click()
        await page.click("button.button span:has-text('Save')")
        await page.locator("//button[text()='Close']").click()
    })

    // update video url
    // check for error message when field was left blank and invalid url
    test('update video url', async ({ page }) => {
        await page.locator("input[name=url]").waitFor()
        const currentURL = await page.locator("input[name=url]").getAttribute("value")
        await page.locator("input[name=url]").fill("")
        await page.click("button.button span:has-text('Save')")
        await expect(page.locator("//p[contains(@class, 'Formstyle__ErrorMessage') and text()='This field is required']")).toBeVisible()
        await page.locator("input[name=url]").fill("hello")
        await page.click("button.button span:has-text('Save')")
        await expect(page.locator("//p[contains(@class, 'Formstyle__ErrorMessage') and text()='URL is not valid']")).toBeVisible()
        const newURL = currentURL == "https://www.youtube.com/watch?v=NfTS7gM7zQ0" ? "https://www.youtube.com/watch?v=-X-Ls1APDjQ" : "https://www.youtube.com/watch?v=NfTS7gM7zQ0"
        await page.locator("input[name=url]").fill(newURL)
        await page.locator("//label[text()='Video URL']").click()
        await page.click("button.button span:has-text('Save')")
        await page.locator("//button[text()='Close']").click()
        await Promise.all([
            page.waitForNavigation(),
            page.locator("//a[contains(@class, 'Navigationstyle__MenuLink') and span/text()='Videos']").nth(1).click()
        ])
        await Promise.all([
            page.waitForNavigation(),
            page.locator("//div[contains(@class, 'Content__ContentBox-sc')]//a[text()='Edit']").nth(0).click()
        ])
        await page.locator("input[name=url]").waitFor()
        expect(await page.locator("input[name=url]").getAttribute("value")).toEqual(newURL)
    })
})