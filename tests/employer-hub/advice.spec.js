const { test, expect } = require('@playwright/test')
const { getRandomNumber, getRandomCharacters } = require("../../common/common-functions")
const { CompleteLogin, Input } = require("../../common/common-classes")
const data = require("../../common/common-details.json")

const csv = "./resources/blank.xlsx"
const prospleLogo = "./resources/prosple-logo.png"

test.beforeEach(async ({ page }) => {
    const login = new CompleteLogin(page)
    await login.employerHubLogin()
    await Promise.all([
        page.waitForNavigation(),
        page.locator("//a[contains(@class, 'Navigationstyle__MenuLink') and span/text()='Advice']").nth(1).click()
    ])
    const checkVisible = await page.locator("span.cc-1j8t").isVisible()
    if (checkVisible) await page.locator("span.cc-1j8t").click()
})

// test to add a new article on the employer hub
test.describe('tests to add a new article on the employer hub', async () => {
    // click on the add article button on the list page
    test.beforeEach(async ({ page }) => {
        await Promise.all([
            page.waitForNavigation(),
            page.locator("//a[span/text()='+ Add Article']").click()
        ])
    })

    // test to add a new article
    test('add new article', async ({ page }) => {
        const input = new Input(page)
        const random = getRandomCharacters(6)
        await page.locator("input[name=title]").fill(`New Article - ${random}`)
        await page.locator("select[name=type]").waitFor()
        await input.randomSelect("select[name=type]", false)
        await page.locator("button.button span:has-text('Next')").click()
        const body_content = "Some advice article description with some random characters:"
        await page.locator("div.ck-editor__editable").fill(`${body_content} ${random}.`)
        await page.locator("label:has-text('Body')").click()
        await page.click("button.button span:has-text('Submit')")
        await page.locator("//a[text()='Close']").click()
    })
})

// tests for editing a advice article
test.describe('edit advice article', async () => {
    test.beforeEach(async ({ page }) => {
        await Promise.all([
            page.waitForNavigation(),
            page.locator("//div[contains(@class, 'GenericTeaserstyle__ActionsContainer-sc')]/a[text()='Edit']").nth(0).click()
        ])
    })

    // tests for the basic details section on job opportunities
    test.describe('basic details section', async () => {
        // before each test, go to the basic details section
        test.beforeEach(async ({ page }) => {
            await page.locator("//span[contains(@class, 'Stepperstyle__StepLabel-sc') and text()='Basic Details']").click()
        })

        // test to update the article title
        // check for error message when the field was left blank
        test('update article title', async ({ page }) => {
            await page.locator("input[name=title]").fill("")
            await page.click("button.button span:has-text('Save')")
            await expect(page.locator("span.icon--danger")).toBeVisible()
            await expect(page.locator("//p[contains(@class, 'Formstyle__ErrorMessage') and text()='This field is required']")).toBeVisible()
            const random = getRandomCharacters(6)
            await page.locator("input[name=title]").fill(`New Article - ${random}`)
            await page.locator("//label[text()='Title']").click()
            await page.click("button.button span:has-text('Save')")
            await page.locator("//a[text()='Close']").click()
            await Promise.all([
                page.waitForNavigation(),
                page.locator("//a[contains(@class, 'Navigationstyle__MenuLink') and span/text()='Advice']").nth(1).click()
            ])
            await page.locator("//div[contains(@class, 'GenericTeaserstyle__ActionsContainer-sc')]/a[text()='Edit']").nth(0).waitFor()
            const titleListPage = await page.locator("//h3[contains(@class, 'GenericTeaserstyle__Title-sc')]").nth(0).innerText()
            expect(titleListPage).toEqual(`New Article - ${random}`)
            await Promise.all([
                page.waitForNavigation(),
                page.locator("//div[contains(@class, 'GenericTeaserstyle__ActionsContainer-sc')]/a/span[text()='Preview']").nth(0).click()
            ])
            const titleOverviewPage = await page.locator("//h2[contains(@class, 'PageHeadingstyle__Heading')]").innerText()
            expect(titleOverviewPage).toEqual(`New Article - ${random}`)
        })

        // test to change the article type
        // check for error message when selected ---
        test('update article type', async ({ page }) => {
            const input = new Input(page)
            await page.locator("select[name=type]").selectOption({ label: "---" })
            await page.click("button.button span:has-text('Save')")
            await expect.soft(page.locator("span.icon--danger")).toBeVisible()
            await expect.soft(page.locator("//p[contains(@class, 'Formstyle__ErrorMessage') and text()='This field is required']")).toBeVisible()
            await input.randomSelect("select[name=type]", false)
            await page.click("button.button span:has-text('Save')")
            await page.locator("//a[text()='Close']").click()
        })

        // test for the industry sector section
        test('update industry sector', async ({ page }) => {
            await page.locator("//div[contains(@class, 'CheckboxTree__Container')]").nth(0).waitFor()
            const label = page.locator("//span[label/text()='Industry Sector']/following-sibling::div")
            const industrySectors = label.locator("//div[contains(@class, 'CheckboxGroup__CheckboxContainer-sc')]")
            const countSectors = await industrySectors.count()
            for (let i = 0; i < countSectors; i++) {
                const isChecked = await industrySectors.nth(i).locator("input").getAttribute("class")
                if (isChecked == "is-checked") {
                    await industrySectors.nth(i).locator("label").click()
                    const getClass = await industrySectors.nth(i).locator("input").getAttribute("class")
                    expect(getClass).not.toEqual("is-checked")
                }
            }
            for (let i = 0; i < countSectors; i++) {
                const random = getRandomNumber(1, 2)
                if (random == 1) {
                    await industrySectors.nth(i).locator("label").click()
                    const getClass = await industrySectors.nth(i).locator("input").getAttribute("class")
                    expect(getClass).toEqual("is-checked")
                }
            }
            await page.click("button.button span:has-text('Save')")
            await page.locator("//a[text()='Close']").click()
        })

        // test for the study field section
        test('update study field', async ({ page }) => {
            await page.locator("//div[contains(@class, 'CheckboxTree__Container')]").nth(1).waitFor()
            const label = page.locator("//span[label/text()='Study Field']/following-sibling::div")
            const industrySectors = label.locator("//div[contains(@class, 'CheckboxGroup__CheckboxContainer-sc')]")
            const countSectors = await industrySectors.count()
            for (let i = 0; i < countSectors; i++) {
                const isChecked = await industrySectors.nth(i).locator("input").getAttribute("class")
                if (isChecked == "is-checked") {
                    await industrySectors.nth(i).locator("label").click()
                    const getClass = await industrySectors.nth(i).locator("input").getAttribute("class")
                    expect(getClass).not.toEqual("is-checked")
                }
            }
            for (let i = 0; i < countSectors; i++) {
                const random = getRandomNumber(1, 2)
                if (random == 1) {
                    await industrySectors.nth(i).locator("label").click()
                    const getClass = await industrySectors.nth(i).locator("input").getAttribute("class")
                    expect(getClass).toEqual("is-checked")
                }
            }
            await page.click("button.button span:has-text('Save')")
            await page.locator("//a[text()='Close']").click()
        })

        test('update locations', async ({ page }) => {
            const input = new Input(page)
            const label = page.locator("//span[label/text()='Locations']/following-sibling::div")
            await label.locator("//button[text()='Remove']").waitFor()
            const remove = label.locator("//button[text()='Remove']")
            const removeCount = await remove.count()
            for (let i = 0; i < removeCount; i++) {
                await remove.nth(0).click()
            }
            await label.locator("//button[text()='Add']").click()
            await input.randomSelect("//span[label/text()='Locations']/following-sibling::div//select[contains(@class, 'sc-khIgXV')]", false)
            await page.click("button.button span:has-text('Save')")
            await page.locator("//a[text()='Close']").click()
        })

        // test that clicking the next button goes to the next page
        test('next button is working', async ({ page }) => {
            const menu = await page.locator("//span[contains(@class, 'Stepperstyle__StepLabel-sc')]").allInnerTexts()
            const current = await page.locator("span.eOSPvU").innerText()
            const currentIndex = menu.indexOf(current)
            console.log(`Current menu: ${current}, index: ${currentIndex}`)
            await page.locator("button.button span:has-text('Next')").click()
            const active = await page.locator("span.eOSPvU").innerText()
            const activeIndex = menu.indexOf(active)
            console.log(`Current menu: ${active}, index: ${activeIndex}`)
            expect(activeIndex).toBeGreaterThan(currentIndex)
        })
    })

    // tests for the content section on job opportunities
    test.describe('content section', async () => {
        // before each test, go to the content section
        test.beforeEach(async ({ page }) => {
            await page.locator("//span[contains(@class, 'Stepperstyle__StepLabel-sc') and text()='Content']").click()
        })

        // test to update the introduction
        test('update the introduction field', async ({ page }) => {
            const intro = getRandomCharacters(6)
            const intro_content = "This is the article introduction with some random characters:"
            await page.locator("textarea[name=introduction]").fill(`${intro_content} ${intro}.`)
            await page.click("button.button span:has-text('Save')")
            await Promise.all([
                page.waitForNavigation(),
                page.locator("//button[text()='Preview']").click()
            ])
            const introPreview = await page.locator("//p[contains(@class, 'PageHeadingstyle__Subheading')]").innerText()
            expect(introPreview).toEqual(`${intro_content} ${intro}.`)
        })

        // test to update the featured image section
        // check for error message when added incorrect file type
        test('update the featured image section', async ({ page }) => {
            const image = page.locator("//span[label/text()='Featured Image']/following-sibling::div")
            await image.locator("span.icon--pencil").click()
            await image.locator("input[name=featuredImage]").setInputFiles(csv)
            await expect(page.locator("span.icon--danger")).toBeVisible()
            await expect(page.locator("//p[contains(@class, 'Formstyle__ErrorMessage') and text()='Unsupported format']")).toBeVisible()
            await image.locator("input[name=featuredImage]").setInputFiles(prospleLogo)
            await page.click("button.button span:has-text('Save')")
            await page.locator("//a[text()='Close']").click()
        })

        // test to update the summary field
        test('update the summary field', async ({ page }) => {
            const summary = getRandomCharacters(6)
            const summary_content = "This is the article summary with some random characters:"
            await page.locator("textarea[name=summary]").fill(`${summary_content} ${summary}.`)
            await page.click("button.button span:has-text('Save')")
            await page.locator("//a[text()='Close']").click()
            await Promise.all([
                page.waitForNavigation(),
                page.locator("//a[contains(@class, 'Navigationstyle__MenuLink') and span/text()='Advice']").nth(1).click()
            ])
            await page.locator("//div[contains(@class, 'Content__ContentBox-sc')]//a[text()='Edit']").nth(0).waitFor()
            const summaryListPage = await page.locator("//p[contains(@class, 'GenericTeaserstyle__Description-sc')]").nth(0).innerText()
            expect(summaryListPage).toEqual(`${summary_content} ${summary}.`)
        })

        // test to update the body field
        // check for error message when field was left blank
        test('update the body field', async ({ page }) => {
            const body = getRandomCharacters(6)
            const body_content = "This is the body of an advice article with some random characters:"
            await page.locator("div.ck-editor__editable").click()
            await page.keyboard.press("Control+A")
            await page.keyboard.press("Delete")
            await page.click("button.button span:has-text('Save')")
            await expect(page.locator("//p[contains(@class, 'Formstyle__ErrorMessage') and text()='This field is required']")).toBeVisible()
            await page.locator("div.ck-editor__editable").fill(`${body_content} ${body}.`)
            await page.locator("label:has-text('Body')").click()
            await page.click("button.button span:has-text('Save')")
            await page.locator("//a[text()='Close']").click()
        })

        // test that clicking the back button goes to the previous page
        test('back button is working', async ({ page }) => {
            const menu = await page.locator("//span[contains(@class, 'Stepperstyle__StepLabel-sc')]").allInnerTexts()
            const current = await page.locator("span.eOSPvU").innerText()
            const currentIndex = menu.indexOf(current)
            console.log(`Current menu: ${current}, index: ${currentIndex}`)
            await page.locator("button.button span:has-text('Back')").click()
            const active = await page.locator("span.eOSPvU").innerText()
            const activeIndex = menu.indexOf(active)
            console.log(`Current menu: ${active}, index: ${activeIndex}`)
            expect(activeIndex).toBeLessThan(currentIndex)
        })
    })
})