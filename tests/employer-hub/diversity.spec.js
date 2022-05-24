const { test, expect } = require('@playwright/test')
const { getRandomNumber, getRandomCharacters } = require("../../common/common-functions")
const { CompleteLogin } = require("../../common/common-classes")
const data = require("../../common/common-details.json")

const prospleLogo = "./resources/prosple-logo.png"

test.beforeEach(async ({ page }) => {
    const login = new CompleteLogin(page)
    await login.employerHubLogin()
    await Promise.all([
        page.waitForNavigation(),
        page.locator("//a[contains(@class, 'Navigationstyle__MenuLink') and span/text()='Diversity & Inclusion']").nth(1).click()
    ])
    // await page.waitForLoadState('networkidle')
    // const checkVisible = await page.locator("span.cc-1j8t").isVisible()
    // if (checkVisible) await page.locator("span.cc-1j8t").click()
})

// tests that are not about adding or editing a diversity content
test.describe('diversity tests but not for add or edit diversity content', async () => {
    // after clicking the first title, click on the back button and see if it goes back to the article list page
    test('diversity back button is working', async ({ page }) => {
        await page.locator("//h3[contains(@class, 'GenericTeaserstyle__Title-sc')]").first().click()
        await page.locator("span:has-text('Back')").click()
        await page.locator("//h2[contains(@class, 'PageHeadingstyle__Heading') and text()='Diversity & Inclusion']").waitFor()
    })
})

// tests that can be done on the diversity & inclusion section in the employer hub
test.describe('test for diversity contents on the employer hub', async () => {
    // change the content type to something else and see that it was updated successfully
    // check for error message when selected ---
    test('change the content type', async ({ page }) => {
        await page.locator("//a[contains(@class, 'htBKgl') and contains(text(), 'Edit')]").nth(0).waitFor()
        const articles = await page.locator("h3").allTextContents()
        console.log("Current articles:", articles)
        await Promise.all([
            page.waitForNavigation(),
            page.locator("//div[contains(@class, 'Content__ContentBox-sc')]//a[text()='Edit']").nth(0).click()
        ])
        await page.locator("select[name=category]").waitFor()
        const options = await page.locator("select[name=category] option").allTextContents()
        const optionsFilter = await Promise.all(options.filter(option => !(articles.includes(option))))
        console.log("Available options:", optionsFilter)
        await page.locator("select[name=category]").selectOption({ label: "---" })
        await expect.soft(page.locator("//p[contains(@class, 'Formstyle__ErrorMessage') and text()='This field is required']")).toBeVisible()
        const optionCount = optionsFilter.length
        const random = getRandomNumber(1, optionCount - 1)
        const chosenOption = optionsFilter[random]
        await page.locator("select[name=category]").selectOption({ label: chosenOption })
        console.log("Option selected:", chosenOption)
        await page.click("button.button span:has-text('Save')")
        await page.locator("//button[text()='Close']").click()
        await Promise.all([
            page.waitForNavigation(),
            page.locator("//a[contains(@class, 'Navigationstyle__MenuLink') and span/text()='Diversity & Inclusion']").nth(1).click()
        ])
        await page.locator("//div[contains(@class, 'Content__ContentBox-sc')]//a[text()='Edit']").nth(0).waitFor()
        const contentType = await page.locator("//h3[contains(@class, 'GenericTeaserstyle__Title')]").nth(0).innerText()
        expect(contentType).toEqual(chosenOption)
    })

    // test to update the content of the summary field
    test('update the summary field', async ({ page }) => {
        await Promise.all([
            page.waitForNavigation(),
            page.locator("//div[contains(@class, 'Content__ContentBox-sc')]//a[text()='Edit']").nth(0).click()
        ])
        const summary = getRandomCharacters(6)
        const summary_content = "This is a summary for the diversity content with some random characters:"
        await page.locator("textarea[name=summary]").fill(`${summary_content} ${summary}.`)
        await page.click("button.button span:has-text('Save')")
        await page.locator("//button[text()='Close']").click()
        await Promise.all([
            page.waitForNavigation(),
            page.locator("//a[contains(@class, 'Navigationstyle__MenuLink') and span/text()='Diversity & Inclusion']").nth(1).click()
        ])
        await page.locator("//div[contains(@class, 'Content__ContentBox-sc')]//a[text()='Edit']").nth(0).waitFor()
        const checkSummary = await page.locator("//p[contains(@class, 'GenericTeaserstyle__Description-sc')]").nth(0).innerText()
        expect(checkSummary).toEqual(`${summary_content} ${summary}.`)
    })

    // test to update the body field
    // check for error message when the field was left blank
    test('update the body field by adding texts', async ({ page }) => {
        await Promise.all([
            page.waitForNavigation(),
            page.locator("//div[contains(@class, 'Content__ContentBox-sc')]//a[text()='Edit']").nth(0).click()
        ])
        const body = getRandomCharacters(6)
        const body_content = "This is the body of the diversity content with some random characters:"
        await page.locator("div.ck-editor__editable").click()
        await page.keyboard.press("Control+A")
        await page.keyboard.press("Delete")
        await page.click("button.button span:has-text('Save')")
        await expect(page.locator("//p[contains(@class, 'Formstyle__ErrorMessage') and text()='This field is required']")).toBeVisible()
        await page.locator("div.ck-editor__editable").fill(`${body_content} ${body}.`)
        await page.locator("label:has-text('Body')").click()
        await page.click("button.button span:has-text('Save')")
        await page.locator("//button[text()='Close']").click()
        await Promise.all([
            page.waitForNavigation(),
            page.locator("//a[contains(@class, 'Navigationstyle__MenuLink') and span/text()='Diversity & Inclusion']").nth(1).click()
        ])
        await Promise.all([
            page.waitForNavigation(),
            page.locator("//div[contains(@class, 'Content__ContentBox-sc')]//a[text()='Edit']").nth(0).click()
        ])
        const text = await page.locator("div.ck-editor__editable").innerText()
        expect(text).toEqual(`${body_content} ${body}.`)
    })

    // test to update the body field with some image
    // TODO: find a way to see how to add image to CKEditor
    test.skip('update the body field by adding image', async ({ page }) => {
        await Promise.all([
            page.waitForNavigation(),
            page.locator("//div[contains(@class, 'Content__ContentBox-sc')]//a[text()='Edit']").nth(0).click()
        ])
        await page.locator("div.ck-editor__editable").click()
        await page.keyboard.press("Control+A")
        await page.keyboard.press("Delete")
        await page.locator('text=Insert imageInsert image').click();
        // Upload prosple background.jpg
        await page.locator('[aria-label="Rich\\ Text\\ Editor\\,\\ main"]').setInputFiles(prospleLogo);
        // Click button:has-text("Save") >> nth=1
        await page.locator('button:has-text("Save")').nth(1).click();
        // Click text=Close
        await page.locator('text=Close').click();
        // Click text=Insert mediaInsert media
        await page.locator("span::has-text('Inset media')").click();
        // Click input[type="text"]
        await page.locator('input[type="text"]').click();
        // Fill input[type="text"]
        await page.locator('input[type="text"]').fill('https://youtu.be/35Xgx6IfG5I');
        await page.click("button.button span:has-text('Save')")
        await page.locator("//button[text()='Close']").click()
    })

    // test to update the body field with some video link
    test.skip('update the body field by adding video link', async ({ page }) => {
        await Promise.all([
            page.waitForNavigation(),
            page.locator("//div[contains(@class, 'Content__ContentBox-sc')]//a[text()='Edit']").nth(0).click()
        ])
        await page.locator("div.ck-editor__editable").click()
        await page.keyboard.press("Control+A")
        await page.keyboard.press("Delete")
        await page.locator("text=Insert mediaInsert media").waitFor()
        await page.locator("span.ck-tooltip_s span:has-text('Insert media')").click()
        await page.locator("form.ck-responsive-form input").fill('https://youtu.be/35Xgx6IfG5I')
        await page.click("button.button span:has-text('Save')")
        await page.locator("//button[text()='Close']").click()
    })
})