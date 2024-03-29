const { test, expect } = require('@playwright/test')
const { getRandomNumber, getRandomCharacters } = require("../../common/common-functions")
const { CompleteLogin, Input } = require("../../common/common-classes")
const data = require("../../common/common-details.json")
const moment = require('moment')

// go to the events section
test.beforeEach(async ({ page }) => {
    const login = new CompleteLogin(page)
    await login.employerHubLogin()
    await Promise.all([
        page.waitForNavigation(),
        page.locator("//a[contains(@class, 'Navigationstyle__MenuLink') and span/text()='Events']").nth(1).click()
    ])
    // await page.waitForLoadState('networkidle')
    // const checkVisible = await page.locator("span.cc-1j8t").isVisible()
    // if (checkVisible) await page.locator("span.cc-1j8t").click()
})

// tests that are not about adding or editing an event
test.describe('event tests but not for add or edit an event', async () => {
    // after clicking the first event title, click on the back button and see if it goes back to the event list page
    test('event back button is working', async ({ page }) => {
        await page.locator("//h3[contains(@class, 'EventTeaserstyle__Title-sc')]").first().click()
        await page.locator("span:has-text('Back')").click()
        await page.locator("//h2[contains(@class, 'PageHeadingstyle__Heading') and text()='Events']").waitFor()
    })
})

// test to add a new event on the employer hub
test.describe('tests to add a new event on the employer hub', async () => {
    // click on the add event button on the list page
    test.beforeEach(async ({ page }) => {
        await Promise.all([
            page.waitForNavigation(),
            page.locator("//a[span/text()='+ Add event']").click()
        ])
    })

    // test to add a new event
    test('add new event', async ({ page }) => {
        const random = getRandomCharacters(6)
        await page.locator("input[name=name]").fill(`New Event - ${random}`)
        const timezone = page.locator("//span[label/text()='Time Zone']/following-sibling::div")
        await timezone.locator("input").fill("Sydney")
        await timezone.locator(`li:has-text('Sydney')`).click()
        const start = moment().format("MMMM D, YYYY")
        const end = moment().add(7, 'd').format("MMMM D, YYYY")
        const startDateLabel = page.locator("//span[label/text()='Start date and time']/following-sibling::div[contains(@class, 'DateAndTimeField')]")
        const endDateLabel = page.locator("//span[label/text()='Finish date and time']/following-sibling::div[contains(@class, 'DateAndTimeField')]")
        await startDateLabel.locator("input").nth(0).fill(start)
        await endDateLabel.locator("input").nth(0).fill(end)
        await page.locator("label[for='online-virtual']").click()
        await page.click("button.button span:has-text('Submit')")
        await page.locator("//a[text()='Close']").click()
    })
})

// tests that can be done on the events section in the employer hub
test.describe('tests to edit events on the employer hub', async () => {
    // click on the edit button of the first content on the list page
    test.beforeEach(async ({ page }) => {
        await Promise.all([
            page.waitForNavigation(),
            page.locator("//div[contains(@class, 'Content__ContentBox-sc')]//a[text()='Edit']").nth(0).click()
        ])
    })

    // update the event name
    // check for error message when the field was left blank
    test('update event name', async ({ page }) => {
        await page.locator("input[name=name]").fill("")
        await page.click("button.button span:has-text('Save')")
        await expect(page.locator("//p[contains(@class, 'Formstyle__ErrorMessage') and text()='This field is required']")).toBeVisible()
        const random = getRandomCharacters(6)
        await page.locator("input[name=name]").fill(`New Event - ${random}`)
        await page.click("button.button span:has-text('Save')")
        await page.locator("//button[text()='Close']").click()
        await Promise.all([
            page.waitForNavigation(),
            page.locator("//a[contains(@class, 'Navigationstyle__MenuLink') and span/text()='Events']").nth(1).click()
        ])
        await page.locator("//div[contains(@class, 'Content__ContentBox-sc')]//a[text()='Edit']").nth(0).waitFor()
        const name = await page.locator("//h3[contains(@class, 'EventTeaserstyle__Title-sc')]").nth(0).innerText()
        expect(name).toEqual(`New Event - ${random}`)
        await Promise.all([
            page.waitForNavigation(),
            page.locator("//a[span/text()='Preview']").nth(0).click()
        ])
        const namePreview = await page.locator("//h2[contains(@class, 'PageHeadingstyle__Heading')]").innerText()
        expect(namePreview).toEqual(`New Event - ${random}`)
    })

    // test to update the event organiser
    // check that it was saved
    test('update event organiser', async ({ page }) => {
        const random = getRandomCharacters(6)
        await page.locator("input[name=organiser]").fill(`Different Event Organiser - ${random}`)
        await page.click("button.button span:has-text('Save')")
        await page.locator("//button[text()='Close']").click()
        await Promise.all([
            page.waitForNavigation(),
            page.locator("//a[contains(@class, 'Navigationstyle__MenuLink') and span/text()='Events']").nth(1).click()
        ])
        await Promise.all([
            page.waitForNavigation(),
            page.locator("//div[contains(@class, 'Content__ContentBox-sc')]//a[text()='Edit']").nth(0).click()
        ])
        const name = await page.locator("input[name=organiser]").getAttribute("value")
        expect(name).toEqual(`Different Event Organiser - ${random}`)
    })

    // test to update the URL website
    // check that it was saved
    test('update URL website', async ({ page }) => {
        await page.locator("input[name=url]").fill("invalid url")
        await page.click("button.button span:has-text('Save')")
        await expect(page.locator("//p[contains(@class, 'Formstyle__ErrorMessage') and text()='URL is not valid']")).toBeVisible()
        const random = getRandomCharacters(6)
        await page.locator("input[name=url]").fill(`${data.employerHubUrl}/${random}`)
        await page.click("button.button span:has-text('Save')")
        await Promise.all([
            page.waitForNavigation(),
            page.locator("//a[text()='Preview']").click()
        ])
        const url = await page.locator("//a[span/text()='Website']").getAttribute("href")
        expect(url).toEqual(`${data.employerHubUrl}/${random}`)
    })

    // test to update the time zone
    // check that it was saved
    test('update time zone', async ({ page }) => {
        const label = page.locator("//span[label/text()='Time Zone']/following-sibling::div")
        const getValue = await label.locator("input").getAttribute("value")
        let newValue = "Sydney"
        if (getValue == "Sydney") {
            newValue = "Manila"
        }
        await label.locator("button span.icon--cross").click()
        await page.click("button.button span:has-text('Save')")
        await expect(page.locator("//p[contains(@class, 'Formstyle__ErrorMessage') and text()='This field is required']")).toBeVisible()
        await label.locator("input").fill(newValue)
        await label.locator(`li:has-text('${newValue}')`).click()
        await page.click("button.button span:has-text('Save')")
        await page.locator("//button[text()='Close']").click()
        await Promise.all([
            page.waitForNavigation(),
            page.locator("//a[contains(@class, 'Navigationstyle__MenuLink') and span/text()='Events']").nth(1).click()
        ])
        await page.locator("//div[contains(@class, 'Content__ContentBox-sc')]//a[text()='Edit']").nth(0).waitFor()
        const eventDetails = await page.locator("//p[contains(@class, 'EventTeaserstyle__EventDetails-sc')]").nth(0).innerText()
        expect(eventDetails).toContain(newValue)
        await Promise.all([
            page.waitForNavigation(),
            page.locator("//a[span/text()='Preview']").nth(0).click()
        ])
        const timezonePreview = await page.locator("//div[contains(@class, 'field-label') and text()='Time Zone']/following-sibling::div[contains(@class, 'field-item')]").innerText()
        expect(timezonePreview).toContain(newValue)
    })

    // update the event start date and time
    // check for error messages when the field was left blank
    test("update event start and finish date and time - use month of april", async ({ page }) => {
        const startDateLabel = page.locator("//span[label/text()='Start date and time']/following-sibling::div[contains(@class, 'DateAndTimeField')]")
        await startDateLabel.locator("input").nth(0).fill("")
        const endDateLabel = page.locator("//span[label/text()='Finish date and time']/following-sibling::div[contains(@class, 'DateAndTimeField')]")
        await endDateLabel.locator("input").nth(0).fill("")
        await page.click("button.button span:has-text('Save')")
        await expect(page.locator("//p[contains(@class, 'Formstyle__ErrorMessage') and text()='This field is required']")).toHaveCount(2)
        const year = moment().format("YYYY")
        const start = moment(`${year}-04-01`).format("MMMM D, YYYY")
        const end = moment(`${year}-04-30`).format("MMMM D, YYYY")
        await startDateLabel.locator("input").nth(0).fill(start)
        await endDateLabel.locator("input").nth(0).fill(end)
        await page.click("button.button span:has-text('Save')")
        await Promise.all([
            page.waitForNavigation(),
            page.locator("//a[text()='Preview']").click()
        ])
        const startPreview = await page.locator("//div[contains(@class, 'field-label') and text()='Starts']/following-sibling::div").innerText()
        expect(startPreview).toContain(moment(`${year}-04-01`).format("ddd D MMM YYYY"))
        const endPreview = await page.locator("//div[contains(@class, 'field-label') and text()='Ends']/following-sibling::div").innerText()
        expect(endPreview).toContain(moment(`${year}-04-30`).format("ddd D MMM YYYY"))
    })

    // update the event start date and time
    // check for error messages when the field was left blank
    test("update event start and finish date and time - use month of december", async ({ page }) => {
        const startDateLabel = page.locator("//span[label/text()='Start date and time']/following-sibling::div[contains(@class, 'DateAndTimeField')]")
        await startDateLabel.locator("input").nth(0).fill("")
        const endDateLabel = page.locator("//span[label/text()='Finish date and time']/following-sibling::div[contains(@class, 'DateAndTimeField')]")
        await endDateLabel.locator("input").nth(0).fill("")
        await page.click("button.button span:has-text('Save')")
        await expect(page.locator("//p[contains(@class, 'Formstyle__ErrorMessage') and text()='This field is required']")).toHaveCount(2)
        const year = moment().format("YYYY")
        const start = moment(`${year}-12-01`).format("MMMM D, YYYY")
        const end = moment(`${year}-12-30`).format("MMMM D, YYYY")
        await startDateLabel.locator("input").nth(0).fill(start)
        await endDateLabel.locator("input").nth(0).fill(end)
        await page.click("button.button span:has-text('Save')")
        await Promise.all([
            page.waitForNavigation(),
            page.locator("//a[text()='Preview']").click()
        ])
        const startPreview = await page.locator("//div[contains(@class, 'field-label') and text()='Starts']/following-sibling::div").innerText()
        expect(startPreview).toContain(moment(`${year}-12-01`).format("ddd D MMM YYYY"))
        const endPreview = await page.locator("//div[contains(@class, 'field-label') and text()='Ends']/following-sibling::div").innerText()
        expect(endPreview).toContain(moment(`${year}-12-30`).format("ddd D MMM YYYY"))
    })

    // update the event location and choose venue
    test("update event location - select venue", async ({ page }) => {
        const input = new Input(page)
        await page.locator("label[for=venue]").click()
        expect(await page.locator("input[id=venue]").isChecked()).toBeTruthy()
        const label = page.locator("//span[label/text()='Location']/following-sibling::div[last()]")
        await label.locator("//span[label/text()='Country']/following-sibling::div//select").waitFor()
        await label.locator("//span[label/text()='Country']/following-sibling::div//select").selectOption({ label: "---" })
        await expect(page.locator("//p[contains(@class, 'Formstyle__ErrorMessage') and text()='This field is required']")).toBeVisible()
        const random = getRandomNumber(1, 2)
        let newValue = ""
        if (random == 1) {
            newValue = "AU"
            await label.locator("//span[label/text()='Country']/following-sibling::div//select").selectOption(newValue)
            await page.locator("//span[label/text()='state']/following-sibling::div//select").waitFor()
            await input.randomSelect("//span[label/text()='state']/following-sibling::div//select", false)
        } else {
            newValue = "PH"
            await label.locator("//span[label/text()='Country']/following-sibling::div//select").selectOption(newValue)
            await page.locator("//span[label/text()='province']/following-sibling::div//select").waitFor()
            await input.randomSelect("//span[label/text()='province']/following-sibling::div//select", false)
        }
        await label.locator("input[name='eventLocation.address.addressLine1']").fill("1 Raintree Ave")
        await label.locator("input[name='eventLocation.address.locality']").fill("Hayman Island")
        await label.locator("input[name='eventLocation.address.postalCode']").fill("4801")
        await page.click("button.button span:has-text('Save')")
        await page.locator("//button[text()='Close']").click()
        await Promise.all([
            page.waitForNavigation(),
            page.locator("//a[contains(@class, 'Navigationstyle__MenuLink') and span/text()='Events']").nth(1).click()
        ])
        await page.locator("//div[contains(@class, 'Content__ContentBox-sc')]//a[text()='Edit']").nth(0).waitFor()
        const eventDetails = await page.locator("//p[contains(@class, 'EventTeaserstyle__EventDetails-sc')]").nth(0).innerText()
        expect(eventDetails).toContain(newValue)
        await Promise.all([
            page.waitForNavigation(),
            page.locator("//a[span/text()='Preview']").nth(0).click()
        ])
        const locationPreview = await page.locator("//div[contains(@class, 'field-label') and text()='Location']/following-sibling::div[contains(@class, 'field-item')]").innerText()
        expect(locationPreview).toContain(newValue)
    })

    // update the event location and choose online/virtual
    test("update event location - select online/virtual", async ({ page }) => {
        const input = new Input(page)
        await page.locator("label[for='online-virtual']").click()
        expect(await page.locator("input[id='online-virtual']").isChecked()).toBeTruthy()
        await page.click("button.button span:has-text('Save')")
        await Promise.all([
            page.waitForNavigation(),
            page.locator("//a[text()='Preview']").click()
        ])
        await expect(page.locator("//div[contains(@class, 'field-label') and text()='Location']")).not.toBeVisible()
    })

    // update the event cost and check that it was saved
    test('update event cost', async ({ page }) => {
        const cost = getRandomNumber(10000, 100000)
        console.log(`Cost: ${cost}`)
        await page.locator("input[name=cost]").fill(cost.toString())
        await page.click("button.button span:has-text('Save')")
        await Promise.all([
            page.waitForNavigation(),
            page.locator("//a[text()='Preview']").click()
        ])
        const costPreview = await page.locator("//div[contains(@class, 'field-label') and text()='Cost']/following-sibling::div[contains(@class, 'field-item')]").innerText()
        expect(costPreview).toEqual(cost.toString())
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
        const chosenSectors = []
        for (let i = 0; i < countSectors; i++) {
            const random = getRandomNumber(1, 2)
            if (random == 1) {
                await industrySectors.nth(i).locator("label").click()
                const sector = await industrySectors.nth(i).locator("label").innerText()
                chosenSectors.push(sector)
                const getClass = await industrySectors.nth(i).locator("input").getAttribute("class")
                expect(getClass).toEqual("is-checked")
            }
        }
        console.log(chosenSectors)
        await page.click("button.button span:has-text('Save')")
        await page.locator("//button[text()='Close']").click()
        await Promise.all([
            page.waitForNavigation(),
            page.locator("//a[contains(@class, 'Navigationstyle__MenuLink') and span/text()='Events']").nth(1).click()
        ])
        await Promise.all([
            page.waitForNavigation(),
            page.locator("//div[contains(@class, 'Content__ContentBox-sc')]//a[text()='Edit']").nth(0).click()
        ])
        await page.locator("//div[contains(@class, 'CheckboxTree__Container')]").nth(0).waitFor()
        for (let i = 0; i < countSectors; i++) {
            const getClass = await industrySectors.nth(i).locator("input").getAttribute("class")
            if (getClass == "is-checked") {
                const sector = await industrySectors.nth(i).locator("label").textContent()
                console.log(sector)
                expect(chosenSectors).toContain(sector)
            }
        }
    })

    // test for the study field section
    test('update study field', async ({ page }) => {
        await page.locator("//div[contains(@class, 'CheckboxTree__Container')]").nth(1).waitFor()
        const label = page.locator("//span[label/text()='Study Field']/following-sibling::div")
        const studyFields = label.locator("//div[contains(@class, 'CheckboxGroup__CheckboxContainer-sc')]")
        const countStudyFields = await studyFields.count()
        for (let i = 0; i < countStudyFields; i++) {
            const isChecked = await studyFields.nth(i).locator("input").getAttribute("class")
            if (isChecked == "is-checked") {
                await studyFields.nth(i).locator("label").click()
                const getClass = await studyFields.nth(i).locator("input").getAttribute("class")
                expect(getClass).not.toEqual("is-checked")
            }
        }
        const chosenStudyFields = []
        for (let i = 0; i < countStudyFields; i++) {
            const random = getRandomNumber(1, 2)
            if (random == 1) {
                await studyFields.nth(i).locator("label").click()
                const study = await studyFields.nth(i).locator("label").innerText()
                chosenStudyFields.push(study)
                const getClass = await studyFields.nth(i).locator("input").getAttribute("class")
                expect(getClass).toEqual("is-checked")
            }
        }
        console.log(chosenStudyFields)
        await page.click("button.button span:has-text('Save')")
        await page.locator("//button[text()='Close']").click()
        await Promise.all([
            page.waitForNavigation(),
            page.locator("//a[contains(@class, 'Navigationstyle__MenuLink') and span/text()='Events']").nth(1).click()
        ])
        await Promise.all([
            page.waitForNavigation(),
            page.locator("//div[contains(@class, 'Content__ContentBox-sc')]//a[text()='Edit']").nth(0).click()
        ])
        await page.locator("//div[contains(@class, 'CheckboxTree__Container')]").nth(1).waitFor()
        for (let i = 0; i < countStudyFields; i++) {
            const getClass = await studyFields.nth(i).locator("input").getAttribute("class")
            if (getClass == "is-checked") {
                const study = await studyFields.nth(i).locator("label").textContent()
                console.log(study)
                expect(chosenStudyFields).toContain(study)
            }
        }
    })

    // test to check that the region section is updating
    test('update region', async ({ page }) => {
        const input = new Input(page)
        const label = page.locator("//span[label/text()='Region']/following-sibling::div")
        await label.locator("//button[text()='Remove']").waitFor()
        const remove = label.locator("//button[text()='Remove']")
        const removeCount = await remove.count()
        for (let i = 0; i < removeCount; i++) {
            await remove.nth(0).click()
        }
        await label.locator("//button[text()='Add']").click()
        const location = await input.randomSelect("//span[label/text()='Region']/following-sibling::div//select[contains(@class, 'sc-khIgXV')]", false)
        await page.click("button.button span:has-text('Save')")
        await page.locator("//button[text()='Close']").click()
        await Promise.all([
            page.waitForNavigation(),
            page.locator("//a[contains(@class, 'Navigationstyle__MenuLink') and span/text()='Events']").nth(1).click()
        ])
        await Promise.all([
            page.waitForNavigation(),
            page.locator("//div[contains(@class, 'Content__ContentBox-sc')]//a[text()='Edit']").nth(0).click()
        ])
        await label.locator("//button[text()='Remove']").waitFor()
        const savedValue = await label.locator("//select[contains(@class, 'sc-khIgXV')]").inputValue()
        const savedLocation = await label.locator(`//select[contains(@class, 'sc-khIgXV')]/option[@value="${savedValue}"]`).innerText()
        expect(savedLocation).toEqual(location)
    })

    // test to update the event introduction
    // check that it was saved and matching what shows on the list page and preview page
    test('update event introduction', async ({ page }) => {
        const intro = getRandomCharacters(6)
        const intro_content = "Event introduction with some random characters:"
        await page.locator("textarea[name=introduction]").fill(`${intro_content} ${intro}.`)
        await page.click("button.button span:has-text('Save')")
        await page.locator("//button[text()='Close']").click()
        await Promise.all([
            page.waitForNavigation(),
            page.locator("//a[contains(@class, 'Navigationstyle__MenuLink') and span/text()='Events']").nth(1).click()
        ])
        await page.locator("a:has-text('Edit')").nth(0).waitFor()
        const introListPage = await page.locator("//p[contains(@class, 'EventTeaserstyle__Description-sc')]").nth(0).innerText()
        expect(introListPage).toEqual(`${intro_content} ${intro}.`)
        await Promise.all([
            page.waitForNavigation(),
            page.locator("//a[span/text()='Preview']").nth(0).click()
        ])
        const introPreview = await page.locator("//p[contains(@class, 'PageHeadingstyle__Subheading')]").nth(0).innerText()
        expect(introPreview).toEqual(`${intro_content} ${intro}.`)
    })

    // test to update the event description
    // check that it was saved and matching what shows on the preview page
    test('update event description', async ({ page }) => {
        const label = page.locator("//span[label/text()='Description']/following-sibling::div")
        await label.locator("div.ck-editor__editable").click()
        await page.keyboard.press("Control+A")
        await page.keyboard.press("Delete")
        const description = getRandomCharacters(6)
        const description_content = "Event description with some random characters:"
        await label.locator("div.ck-editor__editable").fill(`${description_content} ${description}.`)
        await page.click("button.button span:has-text('Save')")
        await Promise.all([
            page.waitForNavigation(),
            page.locator("//a[text()='Preview']").click()
        ])
        const descriptionPreview = await page.locator("//div[contains(@class, 'ViewEventstyle__OverviewContainer-sc')]/p").innerText()
        expect(descriptionPreview).toEqual(`${description_content} ${description}.`)
    })
})