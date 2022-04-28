const { test, expect } = require('@playwright/test')
const { getRandomNumber, getRandomCharacters } = require("../../common/common-functions")
const { CompleteLogin, Input } = require("../../common/common-classes")
const data = require("../../common/common-details.json")
const moment = require('moment')

test.beforeEach(async ({ page }) => {
    const login = new CompleteLogin(page)
    await login.employerHubLogin()
    await Promise.all([
        page.waitForNavigation(),
        page.locator("//a[contains(@class, 'Navigationstyle__MenuLink') and span/text()='Job Opportunities']").nth(1).click()
    ])
})

// test to add a new job opportunity on the employer hub
test.describe('tests to add a new job opportunity on the employer hub', async () => {
    // click on the create job button on the list page
    test.beforeEach(async ({ page }) => {
        await Promise.all([
            page.waitForNavigation(),
            page.locator("//a[span/text()='+ Create job']").click()
        ])
    })

    // TODO: test to add a new job opportunity
    test('add new job opportunity', async ({ page }) => {
        const input = new Input(page)
        const randomCharacters = getRandomCharacters(6)
        await page.locator("input[name=title]").fill(`Cybersecurity Internship - ${randomCharacters}`)
        await page.locator("select[name=industrySectors]").waitFor()
        await input.randomSelect("select[name=industrySectors]", false)
        await page.locator("label[for='radio-1']").click()
        await page.locator("input[name=minNumVacancies]").fill("3")
        await page.locator("input[name=maxNumVacancies]").fill("8")
        await page.locator("input[name=applyByUrl]").fill("https://dev.frontend.prosple.com/")
        await page.locator("button.button span:has-text('Next')").click()
        await page.locator("textarea[name=overviewSummary]").fill(`Summary with random characters: ${randomCharacters}`)
        await page.locator("div.ck-editor__editable").fill(`Position description with random characters: ${randomCharacters}`)
        await page.locator("button.button span:has-text('Next')").click()
        const studyFieldsLabel = page.locator("//span[label/text()='Target study fields']/following-sibling::div")
        const studyFields = studyFieldsLabel.locator("//div[contains(@class, 'CheckboxGroup__CheckboxContainer-sc')]")
        await studyFieldsLabel.locator("//div[contains(@class, 'CheckboxGroup__CheckboxContainer-sc')]").nth(0).waitFor()
        const countStudyFields = await studyFields.count()
        for (let i = 0; i < countStudyFields; i++) {
            const random = getRandomNumber(1, 2)
            if (random == 1) await studyFields.nth(i).locator("label").click()
        }
        const workingRightLabel = page.locator("//div[span/label/text()='Working rights']")
        const workingRight = workingRightLabel.locator("//following-sibling::div")
        await workingRightLabel.locator("//following-sibling::button[text()='+ Add Group']").click()
        const rightsLabel = page.locator("//span[label/text()='Applicants who have (select all that apply)']/following-sibling::div")
        await rightsLabel.locator("//div[contains(@class, 'CheckboxGroup__CheckboxContainer-sc')]").nth(0).waitFor()
        const rights = rightsLabel.locator("//div[contains(@class, 'CheckboxGroup__CheckboxContainer-sc')]")
        const countRights = await rights.count()
        for (let i = 0; i < countRights; i++) {
            const random = getRandomNumber(1, 2)
            if (random == 1) await rights.nth(i).locator("label").click()
        }
        await page.locator("//span[label/text()='In this country']/following-sibling::div//select").waitFor()
        await input.randomSelect("//span[label/text()='In this country']/following-sibling::div//select", false)
        await workingRight.locator("button.button:has-text('Save Group')").click()
        await page.locator("button.button span:has-text('Next')").click()
        await input.randomSelect("//span[label/text()='Remuneration']/following-sibling::div//select", false)
        await page.locator("input[name=minSalary]").fill("10000")
        await page.locator("input[name=maxSalary]").fill("50000")
        await page.locator("button.button span:has-text('Next')").click()
        await page.locator("label=[for=remoteAvailable]").click()
        const remoteWorkLabel = page.locator("//span[label/text()='Remote work locations']/following-sibling::div")
        await remoteWorkLabel.locator("//button[text()='Add']").click()
        await input.randomSelect("//span[label/text()='Remote work locations']/following-sibling::div//select", false)
        await page.locator("button.button span:has-text('Next')").click()
        const timeZoneLabel = page.locator("//span[label/text()='Time zone']/following-sibling::div")
        await timeZoneLabel.locator("input").fill("Sydney")
        await timeZoneLabel.locator(`li:has-text('Sydney')`).click()
        const applicationClose = page.locator("//span[label/text()='Application close date']/following-sibling::div[contains(@class, 'DateAndTimeField')]")
        await applicationClose.locator("//div[contains(@class, 'StyledDatePicker')]//input").fill(`${moment().add(1, 'd').format("MMMM D, YYYY")}`)
        await page.locator("label[for='start-date-8']").click()
        await page.click("button.button span:has-text('Submit')")
        await page.locator("//a[text()='Close']").click()
    })
})


// tests for editing a job opportunity
test.describe('edit job opportunity', async () => {
    test.beforeEach(async ({ page }) => {
        await Promise.all([
            page.waitForNavigation(),
            page.locator("//section[contains(@class, 'OpportunityTeaserstyle__ActionSection')]/a").nth(0).click()
        ])
    })

    // tests for the basic details section on job opportunities
    test.describe('basic details section', async () => {
        // before each test, go to the basic details section
        test.beforeEach(async ({ page }) => {
            await page.locator("//span[contains(@class, 'Stepperstyle__StepLabel-sc') and text()='Basic Details']").click()
        })

        // test to edit the opportunity title and then confirm that it matches the saved title
        test('edit opportunity title', async ({ page }) => {
            await page.locator("input[name=title]").fill("")
            await page.click("button.button span:has-text('Save')")
            await expect(page.locator("span.icon--danger")).toBeVisible()
            await expect(page.locator("//p[contains(@class, 'Formstyle__ErrorMessage') and text()='This field is required']")).toBeVisible()
            const random = getRandomCharacters(6)
            await page.locator("input[name=title]").fill(`Summer Program_${random}`)
            await page.click("button.button span:has-text('Save')")
            await expect(page.locator("//div[contains(@class, 'Formstyle__Alert')]/p[text()='Opportunity was successfully updated.']")).toBeVisible()
            await Promise.all([
                page.waitForNavigation(),
                page.locator("//a[contains(@class, 'Navigationstyle__MenuLink') and span/text()='Job Opportunities']").nth(1).click()
            ])
            const title = await page.locator("//h6[contains(@class, 'OpportunityTeaserstyle__Heading')]").nth(0).innerText()
            expect(title).toEqual(`Summer Program_${random}`)
        })

        // test to update industry sector
        // check for error message when selected ---
        test('update industry sector', async ({ page }) => {
            const input = new Input(page)
            await page.locator("select[name=industrySectors]").selectOption({ label: "---" })
            await page.click("button.button span:has-text('Save')")
            await expect(page.locator("span.icon--danger")).toBeVisible()
            await expect(page.locator("//p[contains(@class, 'Formstyle__ErrorMessage') and text()='This field is required']")).toBeVisible()
            await input.randomSelect("select[name=industrySectors]", false)
            await page.click("button.button span:has-text('Save')")
            await expect(page.locator("//div[contains(@class, 'Formstyle__Alert')]/p[text()='Opportunity was successfully updated.']")).toBeVisible()
        })

        // test to update opportunity type
        // check that the chosen opportunity type matches the saved one
        test('update opportunity type', async ({ page }) => {
            const label = page.locator("//span[label/text()='Type of Opportunity']/following-sibling::div")
            const opportunityTypes = label.locator("//div[contains(@class, 'RadioFieldstyle__RadioRow-sc')]")
            const countOpportunityTypes = await opportunityTypes.count()
            const random = getRandomNumber(1, countOpportunityTypes)
            const chosenOpportunityType = await opportunityTypes.nth(random - 1).locator("label").innerText()
            await opportunityTypes.nth(random - 1).locator("label").click()
            await page.click("button.button span:has-text('Save')")
            await expect(page.locator("//div[contains(@class, 'Formstyle__Alert')]/p[text()='Opportunity was successfully updated.']")).toBeVisible()
            await Promise.all([
                page.waitForNavigation(),
                page.locator("//a[contains(@class, 'Navigationstyle__MenuLink') and span/text()='Job Opportunities']").nth(1).click()
            ])
            const type = await page.locator("//div[contains(@class, 'OpportunityTeaserstyle__SubContent')]//p").nth(0).innerText()
            expect(type).toEqual(chosenOpportunityType)
        })

        // update the number of vacancies section
        // check for error message on incorrect inputs like below minimum value
        test('update the number of vacancies section', async ({ page }) => {
            const label = page.locator("//span[label/text()='Number of vacancies']/following-sibling::div")
            await label.locator("input[name=minNumVacancies]").fill("0")
            let random = getRandomNumber(6, 10)
            await label.locator("input[name=maxNumVacancies]").fill(random.toString())
            await page.click("button.button span:has-text('Save')")
            await page.locator("//label[text()='Number of vacancies']").click()
            await expect(page.locator("span.icon--danger")).toBeVisible()
            await expect(page.locator("//p[contains(@class, 'Formstyle__ErrorMessage') and text()='Minimum value is required']")).toBeVisible()
            random = getRandomNumber(1, 5)
            await label.locator("input[name=minNumVacancies]").fill(random.toString())
            await label.locator("input[name=maxNumVacancies]").fill("0")
            await page.click("button.button span:has-text('Save')")
            await expect(page.locator("span.icon--danger")).toBeVisible()
            await expect(page.locator("//p[contains(@class, 'Formstyle__ErrorMessage') and text()='Maximum value is required']")).toBeVisible()
            random = getRandomNumber(6, 10)
            await label.locator("input[name=minNumVacancies]").fill(random.toString())
            random = getRandomNumber(1, 5)
            await label.locator("input[name=maxNumVacancies]").fill(random.toString())
            await page.click("button.button span:has-text('Save')")
            await expect(page.locator("span.icon--danger")).toBeVisible()
            await expect(page.locator("//p[contains(@class, 'Formstyle__ErrorMessage') and text()='Minimum value should not be greater than the maximum value']")).toBeVisible()
            await label.locator("input[name=minNumVacancies]").fill("")
            await label.locator("input[name=maxNumVacancies]").fill("")
            await page.click("button.button span:has-text('Save')")
            await expect(page.locator("span.icon--danger")).toBeVisible()
            await expect(page.locator("//p[contains(@class, 'Formstyle__ErrorMessage') and text()='All fields are required']")).toBeVisible()
            const minimum = getRandomNumber(1, 5)
            await label.locator("input[name=minNumVacancies]").fill(minimum.toString())
            const maximum = getRandomNumber(6, 10)
            await label.locator("input[name=maxNumVacancies]").fill(maximum.toString())
            await page.click("button.button span:has-text('Save')")
            await expect(page.locator("//div[contains(@class, 'Formstyle__Alert')]/p[text()='Opportunity was successfully updated.']")).toBeVisible()
            await Promise.all([
                page.waitForNavigation(),
                page.locator("//a[contains(@class, 'Navigationstyle__MenuLink') and span/text()='Job Opportunities']").nth(1).click()
            ])
            const jobs = page.locator("//div[contains(@class, 'Jobsstyle__StyledOpportunityTeaser')]")
            const numberOfVacancies = await jobs.nth(0).locator("//dt[text()='Number of Vacancies']/following-sibling::dd[1]").innerText()
            expect(numberOfVacancies).toEqual(`${minimum}-${maximum}`)
        })

        // test to update application link
        // check for error message when field was left blank or provided an invalid URL
        test('update application link', async ({ page }) => {
            const label = page.locator("//span[label/text()='Application Link']/following-sibling::div")
            await label.locator("input[name=applyByUrl]").fill("")
            await page.click("button.button span:has-text('Save')")
            await expect(page.locator("span.icon--danger")).toBeVisible()
            await expect(page.locator("//p[contains(@class, 'Formstyle__ErrorMessage') and text()='This field is required']")).toBeVisible()
            await label.locator("input[name=applyByUrl]").fill("hello")
            await page.click("button.button span:has-text('Save')")
            await expect(page.locator("span.icon--danger")).toBeVisible()
            await expect(page.locator("//p[contains(@class, 'Formstyle__ErrorMessage') and text()='URL is not valid']")).toBeVisible()
            await label.locator("input[name=applyByUrl]").fill("https://gradaustralia.com.au/")
            await page.click("button.button span:has-text('Save')")
            await expect(page.locator("//div[contains(@class, 'Formstyle__Alert')]/p[text()='Opportunity was successfully updated.']")).toBeVisible()
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

    // tests for the position description section on job opportunities
    test.describe('position description section', async () => {
        // before each test, go to the position description section
        test.beforeEach(async ({ page }) => {
            await page.locator("//span[contains(@class, 'Stepperstyle__StepLabel-sc') and text()='Position Description']").click()
        })

        // test to edit the summary and then confirm that it matches the saved summary
        test('edit the summary section', async ({ page }) => {
            await page.locator("textarea[name=overviewSummary]").fill("")
            await page.click("button.button span:has-text('Save')")
            await expect(page.locator("span.icon--danger")).toBeVisible()
            await expect(page.locator("//p[contains(@class, 'Formstyle__ErrorMessage') and text()='This field is required']")).toBeVisible()
            let random = getRandomCharacters(151)
            await page.locator("textarea[name=overviewSummary]").fill(random)
            await page.click("button.button span:has-text('Save')")
            await expect(page.locator("span.icon--danger")).toBeVisible()
            await expect(page.locator("//p[contains(@class, 'Formstyle__ErrorMessage') and text()='Characters should not exceed to 150']")).toBeVisible()
            await expect(page.locator("span.error")).toBeVisible()
            random = getRandomCharacters(15) + " " + getRandomCharacters(15)
            await page.locator("textarea[name=overviewSummary]").fill(random)
            await page.click("button.button span:has-text('Save')")
            await expect(page.locator("//div[contains(@class, 'Formstyle__Alert')]/p[text()='Opportunity was successfully updated.']")).toBeVisible()
            await Promise.all([
                page.waitForNavigation(),
                page.locator("//a[contains(@class, 'Navigationstyle__MenuLink') and span/text()='Job Opportunities']").nth(1).click()
            ])
            const summary = await page.locator("//p[contains(@class, 'OpportunityTeaserstyle__Typography')]").nth(0).innerText()
            expect(summary).toContain(random)
        })

        // edit the position description section
        // check for error message when the field was left blank
        test('edit the position description section', async ({ page }) => {
            const positionDescription = page.locator("//span[label/text()='Position description']/following-sibling::div")
            await positionDescription.locator("div.ck-editor__editable").click()
            await page.keyboard.press("Control+A")
            await page.keyboard.press("Delete")
            await page.click("button.button span:has-text('Save')")
            await expect(page.locator("span.icon--danger")).toBeVisible()
            await expect(page.locator("//p[contains(@class, 'Formstyle__ErrorMessage') and text()='This field is required']")).toBeVisible()
            await positionDescription.locator("div.ck-editor__editable").click()
            const body_content = "Position description field with some random numbers: "
            const random = getRandomCharacters(6)
            await positionDescription.locator("div.ck-editor__editable").fill(`${body_content}${random}.`)
            await page.locator("//label[text()='Position description']").click()
            await page.click("button.button span:has-text('Save')")
            await expect(page.locator("//div[contains(@class, 'Formstyle__Alert')]/p[text()='Opportunity was successfully updated.']")).toBeVisible()
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

    // tests for the hiring criteria section on job opportunities
    test.describe('hiring criteria section', async () => {
        // before each test, go to the hiring criteria section
        test.beforeEach(async ({ page }) => {
            await page.locator("//span[contains(@class, 'Stepperstyle__StepLabel-sc') and text()='Hiring Criteria']").click()
        })

        // edit target study fields section
        // check for error message when no study field is selected
        test('edit target study fields', async ({ page }) => {
            const label = page.locator("//span[label/text()='Target study fields']/following-sibling::div")
            const studyFields = label.locator("//div[contains(@class, 'CheckboxGroup__CheckboxContainer-sc')]")
            await label.locator("//div[contains(@class, 'CheckboxGroup__CheckboxContainer-sc')]").nth(0).waitFor()
            const countStudyFields = await studyFields.count()
            for (let i = 0; i < countStudyFields; i++) {
                const checkbox = await studyFields.nth(i).locator("div.input--type-checkbox input").getAttribute("class")
                if (checkbox == "is-checked") await studyFields.nth(i).locator("label").click()
            }
            await page.click("button.button span:has-text('Save')")
            await expect(page.locator("span.icon--danger")).toBeVisible()
            await expect(page.locator("//p[contains(@class, 'Formstyle__ErrorMessage') and text()='Select at least one study field']")).toBeVisible()
            for (let i = 0; i < countStudyFields; i++) {
                const random = getRandomNumber(1, 2)
                if (random == 1) await studyFields.nth(i).locator("label").click()
            }
            await page.click("button.button span:has-text('Save')")
            await expect(page.locator("//div[contains(@class, 'Formstyle__Alert')]/p[text()='Opportunity was successfully updated.']")).toBeVisible()
        })

        // test to update the requirements and pathways and user chose "Degree or Certificate"
        // test to check for error message when user left the title field blank
        test('update requirements and pathways - choose degree or certificate', async ({ page }) => {
            const input = new Input(page)
            const label = page.locator("//div[span/label/text()='Requirements and Pathways']")
            const pathway = label.locator("//following-sibling::div")
            const checkVisible = await pathway.locator("span.icon--cross").isVisible()
            if (checkVisible) {
                await pathway.locator("span.icon--cross").click()
                const modal = page.locator("//div[contains(@class, 'Modalstyle') and text()='Are you sure you want to remove this pathway?']/following-sibling::div")
                await modal.locator("a.button:has-text('Remove')").click()
            }
            await label.locator("//following-sibling::button[text()='+ Add Pathway']").click()
            await pathway.locator("input[name='pathways.0.title']").fill("")
            await pathway.locator("//label[text()='Title']").click()
            await expect(page.locator("span.icon--danger")).toBeVisible()
            await expect(page.locator("//p[contains(@class, 'Formstyle__ErrorMessage') and text()='This field is required']")).toBeVisible()
            const random = getRandomCharacters(6)
            await pathway.locator("input[name='pathways.0.title']").fill(`Bachelor degree in any study field - ${random}`)
            await pathway.locator("//label[text()='Title']").click()
            await pathway.locator("a.button:has-text('+ Add Requirement')").click()
            await pathway.locator("//span[label/text()='Requirement Type']/following-sibling::div/select").selectOption("DegreeCert")
            await pathway.locator("select[name='pathways.0.studyRequirements.0.levelOfStudy']").waitFor()
            await input.randomSelect("select[name='pathways.0.studyRequirements.0.levelOfStudy']", false)
            const studyFieldLabel = pathway.locator("//span[label/text()='Select Study Field']/following-sibling::div")
            const studyFields = studyFieldLabel.locator("//div[contains(@class, 'CheckboxGroup__CheckboxContainer-sc')]")
            await studyFieldLabel.locator("//div[contains(@class, 'CheckboxGroup__CheckboxContainer-sc')]").nth(0).waitFor()
            const countStudyFields = await studyFields.count()
            for (let i = 0; i < countStudyFields; i++) {
                const random = getRandomNumber(1, 2)
                if (random == 1) await studyFields.nth(i).locator("label").click()
            }
            await pathway.locator("button.button:has-text('Save Requirement')").click()
            await pathway.locator("button.button:has-text('Save Pathway')").click()
            await page.click("button.button span:has-text('Save')")
            await expect(page.locator("//div[contains(@class, 'Formstyle__Alert')]/p[text()='Opportunity was successfully updated.']")).toBeVisible()
            const title = await pathway.locator("//span[contains(@class, 'Collapsiblestyle__CollapsibleTitle-sc')]").innerText()
            expect(title).toEqual(`Bachelor degree in any study field - ${random}`)
        })

        // test to update the requirements and pathways and user chose "Microcredential"
        test('update requirements and pathways - choose microcredential', async ({ page }) => {
            const label = page.locator("//div[span/label/text()='Requirements and Pathways']")
            const pathway = label.locator("//following-sibling::div")
            const checkVisible = await pathway.locator("span.icon--cross").isVisible()
            if (checkVisible) {
                await pathway.locator("span.icon--cross").click()
                const modal = page.locator("//div[contains(@class, 'Modalstyle') and text()='Are you sure you want to remove this pathway?']/following-sibling::div")
                await modal.locator("a.button:has-text('Remove')").click()
            }
            await label.locator("//following-sibling::button[text()='+ Add Pathway']").click()
            const random = getRandomCharacters(6)
            await pathway.locator("input[name='pathways.0.title']").fill(`Bachelor degree in any study field - ${random}`)
            await pathway.locator("//label[text()='Title']").click()
            await pathway.locator("a.button:has-text('+ Add Requirement')").click()
            await pathway.locator("//span[label/text()='Requirement Type']/following-sibling::div/select").selectOption("Microcredential")
            await pathway.locator("input[name='pathways.0.studyRequirements.0.title']").waitFor()
            await pathway.locator("input[name='pathways.0.studyRequirements.0.title']").fill("")
            await pathway.locator("//label[text()='Microcredential Name']").click()
            await expect(page.locator("span.icon--danger")).toBeVisible()
            await expect(page.locator("//p[contains(@class, 'Formstyle__ErrorMessage') and text()='This field is required']")).toBeVisible()
            await pathway.locator("input[name='pathways.0.studyRequirements.0.title']").fill(`Microcredential name - ${random}`)
            await pathway.locator("input[name='pathways.0.studyRequirements.0.url']").fill("")
            await pathway.locator("//label[text()='Link to Microcredential']").click()
            await expect(page.locator("span.icon--danger")).toBeVisible()
            await expect(page.locator("//p[contains(@class, 'Formstyle__ErrorMessage') and text()='This field is required']")).toBeVisible()
            await pathway.locator("input[name='pathways.0.studyRequirements.0.url']").fill("hello")
            await pathway.locator("//label[text()='Link to Microcredential']").click()
            await expect(page.locator("span.icon--danger")).toBeVisible()
            await expect(page.locator("//p[contains(@class, 'Formstyle__ErrorMessage') and text()='URL is not valid']")).toBeVisible()
            await pathway.locator("input[name='pathways.0.studyRequirements.0.url']").fill(`https://dev.frontend.prosple.com/${random}`)
            await pathway.locator("button.button:has-text('Save Requirement')").click()
            await pathway.locator("button.button:has-text('Save Pathway')").click()
            await page.click("button.button span:has-text('Save')")
            await expect(page.locator("//div[contains(@class, 'Formstyle__Alert')]/p[text()='Opportunity was successfully updated.']")).toBeVisible()
            const title = await pathway.locator("//span[contains(@class, 'Collapsiblestyle__CollapsibleTitle-sc')]").innerText()
            expect(title).toEqual(`Bachelor degree in any study field - ${random}`)
        })

        // test to update the requirements and pathways and user chose "Portfolio"
        test('update requirements and pathways - choose portfolio', async ({ page }) => {
            const label = page.locator("//div[span/label/text()='Requirements and Pathways']")
            const pathway = label.locator("//following-sibling::div")
            const checkVisible = await pathway.locator("span.icon--cross").isVisible()
            if (checkVisible) {
                await pathway.locator("span.icon--cross").click()
                const modal = page.locator("//div[contains(@class, 'Modalstyle') and text()='Are you sure you want to remove this pathway?']/following-sibling::div")
                await modal.locator("a.button:has-text('Remove')").click()
            }
            await label.locator("//following-sibling::button[text()='+ Add Pathway']").click()
            const random = getRandomCharacters(6)
            await pathway.locator("input[name='pathways.0.title']").fill(`Bachelor degree in any study field - ${random}`)
            await pathway.locator("//label[text()='Title']").click()
            await pathway.locator("a.button:has-text('+ Add Requirement')").click()
            await pathway.locator("//span[label/text()='Requirement Type']/following-sibling::div/select").selectOption("Portfolio")
            await pathway.locator("textarea[name='pathways.0.studyRequirements.0.bodyCopy']").waitFor()
            await pathway.locator("textarea[name='pathways.0.studyRequirements.0.bodyCopy']").fill("")
            await pathway.locator("//label[text()='Requirement Type']").click()
            await expect(page.locator("span.icon--danger")).toBeVisible()
            await expect(page.locator("//p[contains(@class, 'Formstyle__ErrorMessage') and text()='This field is required']")).toBeVisible()
            const body_content = "Some portfolio description with some random characters:"
            await pathway.locator("textarea[name='pathways.0.studyRequirements.0.bodyCopy']").fill(`${body_content} ${random}.`)
            await pathway.locator("button.button:has-text('Save Requirement')").click()
            await pathway.locator("button.button:has-text('Save Pathway')").click()
            await page.click("button.button span:has-text('Save')")
            await expect(page.locator("//div[contains(@class, 'Formstyle__Alert')]/p[text()='Opportunity was successfully updated.']")).toBeVisible()
            const title = await pathway.locator("//span[contains(@class, 'Collapsiblestyle__CollapsibleTitle-sc')]").innerText()
            expect(title).toEqual(`Bachelor degree in any study field - ${random}`)
        })

        // test to update the requirements and pathways and user chose "Work Experience"
        test('update requirements and pathways - choose work experience', async ({ page }) => {
            const label = page.locator("//div[span/label/text()='Requirements and Pathways']")
            const pathway = label.locator("//following-sibling::div")
            const checkVisible = await pathway.locator("span.icon--cross").isVisible()
            if (checkVisible) {
                await pathway.locator("span.icon--cross").click()
                const modal = page.locator("//div[contains(@class, 'Modalstyle') and text()='Are you sure you want to remove this pathway?']/following-sibling::div")
                await modal.locator("a.button:has-text('Remove')").click()
            }
            await label.locator("//following-sibling::button[text()='+ Add Pathway']").click()
            const random = getRandomCharacters(6)
            await pathway.locator("input[name='pathways.0.title']").fill(`Bachelor degree in any study field - ${random}`)
            await pathway.locator("//label[text()='Title']").click()
            await pathway.locator("a.button:has-text('+ Add Requirement')").click()
            await pathway.locator("//span[label/text()='Requirement Type']/following-sibling::div/select").selectOption("WorkExperience")
            await pathway.locator("textarea[name='pathways.0.studyRequirements.0.bodyCopy']").waitFor()
            await pathway.locator("textarea[name='pathways.0.studyRequirements.0.bodyCopy']").fill("")
            await pathway.locator("//label[text()='Requirement Type']").click()
            await expect(page.locator("span.icon--danger")).toBeVisible()
            await expect(page.locator("//p[contains(@class, 'Formstyle__ErrorMessage') and text()='This field is required']")).toBeVisible()
            const body_content = "Some work experience description with some random characters:"
            await pathway.locator("textarea[name='pathways.0.studyRequirements.0.bodyCopy']").fill(`${body_content} ${random}.`)
            await pathway.locator("button.button:has-text('Save Requirement')").click()
            await pathway.locator("button.button:has-text('Save Pathway')").click()
            await page.click("button.button span:has-text('Save')")
            await expect(page.locator("//div[contains(@class, 'Formstyle__Alert')]/p[text()='Opportunity was successfully updated.']")).toBeVisible()
            const title = await pathway.locator("//span[contains(@class, 'Collapsiblestyle__CollapsibleTitle-sc')]").innerText()
            expect(title).toEqual(`Bachelor degree in any study field - ${random}`)
        })

        // test to update the requirements and pathways and user chose "Other"
        test('update requirements and pathways - choose other', async ({ page }) => {
            const label = page.locator("//div[span/label/text()='Requirements and Pathways']")
            const pathway = label.locator("//following-sibling::div")
            const checkVisible = await pathway.locator("span.icon--cross").isVisible()
            if (checkVisible) {
                await pathway.locator("span.icon--cross").click()
                const modal = page.locator("//div[contains(@class, 'Modalstyle') and text()='Are you sure you want to remove this pathway?']/following-sibling::div")
                await modal.locator("a.button:has-text('Remove')").click()
            }
            await label.locator("//following-sibling::button[text()='+ Add Pathway']").click()
            const random = getRandomCharacters(6)
            await pathway.locator("input[name='pathways.0.title']").fill(`Bachelor degree in any study field - ${random}`)
            await pathway.locator("//label[text()='Title']").click()
            await pathway.locator("a.button:has-text('+ Add Requirement')").click()
            await pathway.locator("//span[label/text()='Requirement Type']/following-sibling::div/select").selectOption("Other")
            await pathway.locator("input[name='pathways.0.studyRequirements.0.title']").waitFor()
            await pathway.locator("input[name='pathways.0.studyRequirements.0.title']").fill("")
            await pathway.locator("//label[text()='Requirement Type']").click()
            await expect(page.locator("span.icon--danger")).toBeVisible()
            await expect(page.locator("//p[contains(@class, 'Formstyle__ErrorMessage') and text()='This field is required']")).toBeVisible()
            await pathway.locator("input[name='pathways.0.studyRequirements.0.title']").fill(`Some title - ${random}`)
            const body_content = "Some description with some random characters:"
            await pathway.locator("textarea[name='pathways.0.studyRequirements.0.bodyCopy']").fill(`${body_content} ${random}.`)
            await pathway.locator("button.button:has-text('Save Requirement')").click()
            await pathway.locator("button.button:has-text('Save Pathway')").click()
            await page.click("button.button span:has-text('Save')")
            await expect(page.locator("//div[contains(@class, 'Formstyle__Alert')]/p[text()='Opportunity was successfully updated.']")).toBeVisible()
            const title = await pathway.locator("//span[contains(@class, 'Collapsiblestyle__CollapsibleTitle-sc')]").innerText()
            expect(title).toEqual(`Bachelor degree in any study field - ${random}`)
        })

        // test to update working right
        // test for error message when user forgot to choose an option and also when user selected --- on country
        test('add working rights', async ({ page }) => {
            const input = new Input(page)
            const label = page.locator("//div[span/label/text()='Working rights']")
            const workingRight = label.locator("//following-sibling::div")
            const checkVisible = await workingRight.locator("span.icon--cross").isVisible()
            if (checkVisible) {
                await workingRight.locator("span.icon--cross").click()
                const modal = page.locator("//div[contains(@class, 'Modalstyle') and text()='Are you sure you want to remove this group?']/following-sibling::div")
                await modal.locator("a.button:has-text('Remove')").click()
            }
            await label.locator("//following-sibling::button[text()='+ Add Group']").click()
            const rightsLabel = page.locator("//span[label/text()='Applicants who have (select all that apply)']/following-sibling::div")
            await rightsLabel.locator("//div[contains(@class, 'CheckboxGroup__CheckboxContainer-sc')]").nth(0).waitFor()
            const rights = rightsLabel.locator("//div[contains(@class, 'CheckboxGroup__CheckboxContainer-sc')]")
            await page.click("button.button span:has-text('Save')")
            await expect(page.locator("span.icon--danger")).toBeVisible()
            await expect(page.locator("//p[contains(@class, 'Formstyle__ErrorMessage') and text()='Select at least one value']")).toBeVisible()
            await expect(page.locator("//p[contains(@class, 'Formstyle__ErrorMessage') and text()='This field is required']")).toBeVisible()
            const countRights = await rights.count()
            for (let i = 0; i < countRights; i++) {
                const random = getRandomNumber(1, 2)
                if (random == 1) await rights.nth(i).locator("label").click()
            }
            await page.locator("//span[label/text()='In this country']/following-sibling::div//select").waitFor()
            const country = await input.randomSelect("//span[label/text()='In this country']/following-sibling::div//select", false)
            await workingRight.locator("button.button:has-text('Save Group')").click()
            await page.click("button.button span:has-text('Save')")
            await expect(page.locator("//div[contains(@class, 'Formstyle__Alert')]/p[text()='Opportunity was successfully updated.']")).toBeVisible()
            const title = await workingRight.locator("//span[contains(@class, 'Collapsiblestyle__CollapsibleTitle-sc')]").innerText()
            expect(title).toEqual(country)
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

    // tests for the pay & conditions section on job opportunities
    test.describe('pay & conditions section', async () => {
        // before each test, go to the pay & conditions section
        test.beforeEach(async ({ page }) => {
            await page.locator("//span[contains(@class, 'Stepperstyle__StepLabel-sc') and text()='Pay & Conditions']").click()
        })

        // test to update remuneration
        // check for error message when selected ---
        // also check for error message when minimum is above the maximum salary or the fields were left blank
        test('update remuneration', async ({ page }) => {
            const input = new Input(page)
            const label = page.locator("//span[label/text()='Remuneration']/following-sibling::div")
            await page.locator("select.sc-khIgXV").selectOption({ label: "---" })
            await page.click("button.button span:has-text('Save')")
            await expect(page.locator("span.icon--danger")).toBeVisible()
            await expect(page.locator("//p[contains(@class, 'Formstyle__ErrorMessage') and text()='All fields are required']")).toBeVisible()
            await input.randomSelect("select.sc-khIgXV", false)
            await label.locator("input[name=minSalary]").fill("")
            await label.locator("input[name=maxSalary]").fill("1000")
            await page.click("button.button span:has-text('Save')")
            await expect(page.locator("span.icon--danger")).toBeVisible()
            await expect(page.locator("//p[contains(@class, 'Formstyle__ErrorMessage') and text()='All fields are required']")).toBeVisible()
            await label.locator("input[name=minSalary]").fill("1000")
            await label.locator("input[name=maxSalary]").fill("")
            await page.click("button.button span:has-text('Save')")
            await expect(page.locator("span.icon--danger")).toBeVisible()
            await expect(page.locator("//p[contains(@class, 'Formstyle__ErrorMessage') and text()='All fields are required']")).toBeVisible()
            await label.locator("input[name=minSalary]").fill("2000")
            await label.locator("input[name=maxSalary]").fill("1000")
            await page.click("button.button span:has-text('Save')")
            await expect(page.locator("span.icon--danger")).toBeVisible()
            await expect(page.locator("//p[contains(@class, 'Formstyle__ErrorMessage') and text()='Minimum salary should not be greater than the maximum']")).toBeVisible()
            const currency = await input.randomSelect("select.sc-khIgXV", false)
            const minimumSalary = getRandomNumber(1, 50000)
            const maximumSalary = getRandomNumber(50001, 100000)
            await label.locator("input[name=minSalary]").fill(minimumSalary.toString())
            await label.locator("input[name=maxSalary]").fill(maximumSalary.toString())
            await page.locator("//label[text()='Remuneration']").click()
            await page.click("button.button span:has-text('Save')")
            await expect(page.locator("//div[contains(@class, 'Formstyle__Alert')]/p[text()='Opportunity was successfully updated.']")).toBeVisible()
            await Promise.all([
                page.waitForNavigation(),
                page.locator("//a[contains(@class, 'Navigationstyle__MenuLink') and span/text()='Job Opportunities']").nth(1).click()
            ])
            const jobs = page.locator("//div[contains(@class, 'Jobsstyle__StyledOpportunityTeaser')]")
            const savedMinimumSalary = await jobs.nth(0).locator("//dt[text()='Minimum Salary']/following-sibling::dd[1]").innerText()
            const savedMaximumSalary = await jobs.nth(0).locator("//dt[text()='Maximum Salary']/following-sibling::dd[1]").innerText()
            expect(savedMinimumSalary).toEqual(`${currency} ${minimumSalary.toLocaleString('en-US')}`)
            expect(savedMaximumSalary).toEqual(`${currency} ${maximumSalary.toLocaleString('en-US')}`)
        })

        // update hide remuneration from candidates and see that it's saving correctly
        test('update hide remuneration from candidates', async ({ page }) => {
            await page.locator("label[for=hideSalary]").waitFor()
            const currentValue = await page.locator("input[id=hideSalary]").getAttribute('class')
            console.log(`Checkbox value: ${currentValue}`)
            await page.locator("label[for=hideSalary]").click()
            await page.click("button.button span:has-text('Save')")
            await expect(page.locator("//div[contains(@class, 'Formstyle__Alert')]/p[text()='Opportunity was successfully updated.']")).toBeVisible()
            await page.reload()
            await Promise.all([
                page.waitForNavigation(),
                page.locator("//a[contains(@class, 'Navigationstyle__MenuLink') and span/text()='Job Opportunities']").nth(1).click()
            ])
            await Promise.all([
                page.waitForNavigation(),
                page.locator("//section[contains(@class, 'OpportunityTeaserstyle__ActionSection')]/a").nth(0).click()
            ])
            await page.locator("//span[contains(@class, 'Stepperstyle__StepLabel-sc') and text()='Pay & Conditions']").click()
            await page.locator("label[for=hideSalary]").waitFor()
            const newValue = await page.locator("input[id=hideSalary]").getAttribute('class')
            console.log(`Checkbox value: ${newValue}`)
            expect(currentValue).not.toEqual(newValue)
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

    // tests for the hiring locations section on job opportunities
    test.describe('hiring locations section', async () => {
        // before each test, go to the hiring locations section
        test.beforeEach(async ({ page }) => {
            await page.locator("//span[contains(@class, 'Stepperstyle__StepLabel-sc') and text()='Hiring Locations']").click()
        })

        // test for the opportunity located in the physical location
        test('test for the opportunity located in the physical location', async ({ page }) => {
            const input = new Input(page)
            const currentValue = await page.locator("input[id=onSiteAvailableValue]").getAttribute('class')
            if (currentValue != "is-checked") await page.locator("label[for=onSiteAvailableValue]").click()
            await expect(page.locator("//label[text()='On-site work locations']")).toBeVisible()
            const label = page.locator("//span[label/text()='On-site work locations']/following-sibling::div")
            await label.locator("//button[text()='Remove']").waitFor()
            const remove = label.locator("//button[text()='Remove']")
            const removeCount = await remove.count()
            for (let i = 0; i < removeCount; i++) {
                await remove.nth(0).click()
            }
            await label.locator("//button[text()='Add']").click()
            await input.randomSelect("//span[label/text()='On-site work locations']/following-sibling::div//select[contains(@class, 'sc-khIgXV')]", false)
            await page.click("button.button span:has-text('Save')")
            await expect(page.locator("//div[contains(@class, 'Formstyle__Alert')]/p[text()='Opportunity was successfully updated.']")).toBeVisible()
            await Promise.all([
                page.waitForNavigation(),
                page.locator("//a[contains(@class, 'Navigationstyle__MenuLink') and span/text()='Job Opportunities']").nth(1).click()
            ])
            await Promise.all([
                page.waitForNavigation(),
                page.locator("//section[contains(@class, 'OpportunityTeaserstyle__ActionSection')]/a").nth(0).click()
            ])
            await page.locator("//span[contains(@class, 'Stepperstyle__StepLabel-sc') and text()='Hiring Locations']").click()
            const newValue = await page.locator("input[id=onSiteAvailableValue]").getAttribute('class')
            expect(newValue).toEqual("is-checked")
        })

        // test for the remove work available section
        test('test for the remove work available section', async ({ page }) => {
            const input = new Input(page)
            const currentValue = await page.locator("input[id=remoteAvailable]").getAttribute('class')
            if (currentValue != "is-checked") await page.locator("label[for=remoteAvailable]").click()
            await expect(page.locator("//label[text()='Remote work locations']")).toBeVisible()
            const label = page.locator("//span[label/text()='Remote work locations']/following-sibling::div")
            await label.locator("//button[text()='Remove']").waitFor()
            const remove = label.locator("//button[text()='Remove']")
            const removeCount = await remove.count()
            for (let i = 0; i < removeCount; i++) {
                await remove.nth(0).click()
            }
            await label.locator("//button[text()='Add']").click()
            await input.randomSelect("//span[label/text()='Remote work locations']/following-sibling::div//select[contains(@class, 'sc-khIgXV')]", false)
            await page.click("button.button span:has-text('Save')")
            await expect(page.locator("//div[contains(@class, 'Formstyle__Alert')]/p[text()='Opportunity was successfully updated.']")).toBeVisible()
            await Promise.all([
                page.waitForNavigation(),
                page.locator("//a[contains(@class, 'Navigationstyle__MenuLink') and span/text()='Job Opportunities']").nth(1).click()
            ])
            await Promise.all([
                page.waitForNavigation(),
                page.locator("//section[contains(@class, 'OpportunityTeaserstyle__ActionSection')]/a").nth(0).click()
            ])
            await page.locator("//span[contains(@class, 'Stepperstyle__StepLabel-sc') and text()='Hiring Locations']").click()
            const newValue = await page.locator("input[id=remoteAvailable]").getAttribute('class')
            expect(newValue).toEqual("is-checked")
        })

        // test to check for error message when nothing was selected under the hiring locations section
        test('check for error message when none selected on hiring locations', async ({ page }) => {
            const physical = await page.locator("input[id=onSiteAvailableValue]").getAttribute('class')
            if (physical == "is-checked") await page.locator("label[for=onSiteAvailableValue]").click()
            const remote = await page.locator("input[id=remoteAvailable]").getAttribute('class')
            if (remote == "is-checked") await page.locator("label[for=remoteAvailable]").click()
            await page.click("button.button span:has-text('Save')")
            await expect(page.locator("span.icon--danger")).toBeVisible()
            await expect(page.locator("//p[contains(@class, 'Formstyle__ErrorMessage') and text()='Select at least one location for either on-site or remote']")).toBeVisible()
        })

        // test to check that adding location description will be saved
        test('update location description', async ({ page }) => {
            const random = getRandomCharacters(6)
            const description = "anywhere in the world with some random characters:"
            await page.locator("input[name=locationDescription]").fill(`${description} ${random}.`)
            await page.click("button.button span:has-text('Save')")
            await expect(page.locator("//div[contains(@class, 'Formstyle__Alert')]/p[text()='Opportunity was successfully updated.']")).toBeVisible()
            await Promise.all([
                page.waitForNavigation(),
                page.locator("//a[contains(@class, 'Navigationstyle__MenuLink') and span/text()='Job Opportunities']").nth(1).click()
            ])
            await Promise.all([
                page.waitForNavigation(),
                page.locator("//section[contains(@class, 'OpportunityTeaserstyle__ActionSection')]/a").nth(0).click()
            ])
            await page.locator("//span[contains(@class, 'Stepperstyle__StepLabel-sc') and text()='Hiring Locations']").click()
            await page.locator("input[name=locationDescription]").waitFor()
            const value = await page.locator("input[name=locationDescription]").getAttribute("value")
            expect(value).toEqual(`${description} ${random}.`)
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

    // tests for the application timeline section on job opportunities
    test.describe('application timeline section', async () => {
        // before each test, go to the application timeline section
        test.beforeEach(async ({ page }) => {
            await page.locator("//span[contains(@class, 'Stepperstyle__StepLabel-sc') and text()='Application Timeline']").click()
        })

        // test to update the time zone
        // check that it was saved
        test('update time zone', async ({ page }) => {
            const label = page.locator("//span[label/text()='Time zone']/following-sibling::div")
            const getValue = await label.locator("input").getAttribute("value")
            let newValue = "Sydney"
            if (getValue == "Sydney") {
                newValue = "New York"
            }
            await label.locator("button span.icon--cross").click()
            await page.click("button.button span:has-text('Save')")
            await expect(page.locator("span.icon--danger")).toBeVisible()
            await expect(page.locator("//p[contains(@class, 'Formstyle__ErrorMessage') and text()='This field is required']")).toBeVisible()
            await label.locator("input").fill(newValue)
            await label.locator(`li:has-text('${newValue}')`).click()
            await page.click("button.button span:has-text('Save')")
            await expect(page.locator("//div[contains(@class, 'Formstyle__Alert')]/p[text()='Opportunity was successfully updated.']")).toBeVisible()
        })

        // application open and close date and time
        // check for error message when application close date was left blank
        test.slow('update the application open date and time', async ({ page }) => {
            const applicationOpen = page.locator("//span[label/text()='Application open date']/following-sibling::div[contains(@class, 'DateAndTimeField')]")
            const applicationClose = page.locator("//span[label/text()='Application close date']/following-sibling::div[contains(@class, 'DateAndTimeField')]")
            await applicationOpen.locator("//div[contains(@class, 'StyledDatePicker')]//input").fill("")
            await applicationClose.locator("//div[contains(@class, 'StyledDatePicker')]//input").fill("")
            await page.click("button.button span:has-text('Save')")
            await expect(page.locator("span.icon--danger")).toBeVisible()
            await expect(page.locator("//p[contains(@class, 'Formstyle__ErrorMessage') and text()='This field is required']")).toBeVisible()
            await applicationOpen.locator("//div[contains(@class, 'StyledDatePicker')]//input").fill(`${moment().format("MMMM D, YYYY")}`)
            await applicationClose.locator("//div[contains(@class, 'StyledDatePicker')]//input").fill(`${moment().add(1, 'd').format("MMMM D, YYYY")}`)
            await page.click("button.button span:has-text('Save')")
            await expect(page.locator("//div[contains(@class, 'Formstyle__Alert')]/p[text()='Opportunity was successfully updated.']")).toBeVisible()
            await Promise.all([
                page.waitForNavigation(),
                page.locator("//a[contains(@class, 'Navigationstyle__MenuLink') and span/text()='Job Opportunities']").nth(1).click()
            ])
            await page.locator("//section[contains(@class, 'OpportunityTeaserstyle__ActionSection')]/a").nth(0).waitFor()
            const applicationOpenListPage = await page.locator("//dt[text()='Applications Open']/following-sibling::dd[1]").nth(0).innerText()
            const applicationCloseListPage = await page.locator("//dt[text()='Applications Close']/following-sibling::dd[1]").nth(0).innerText()
            expect(applicationOpenListPage).toEqual(`${moment().format("D MMM YYYY")}`)
            expect(applicationCloseListPage).toEqual(`${moment().add(1, 'd').format("D MMM YYYY")}`)
        })

        // test for the expected start date where user chose "A specific date"
        // also test for April 1 - check that date was not changed on daylight savings
        test('update expected start date - a specific date (April 1)', async ({ page }) => {
            await page.locator("label[for='start-date-specific']").waitFor()
            await page.locator("label[for='start-date-specific']").click()
            await expect(page.locator("input[id='start-date-specific']")).toHaveClass("is-checked")
            const label = page.locator("//div[text()='Please enter the specific date successful candidates will begin working:']/following-sibling::div")
            await label.locator("input").fill("")
            await page.click("button.button span:has-text('Save')")
            await expect(page.locator("span.icon--danger")).toBeVisible()
            await expect(page.locator("//p[contains(@class, 'Formstyle__ErrorMessage') and text()='This field is required']")).toBeVisible()
            const currentYear = moment().format("YYYY")
            let newDate = moment(`${currentYear}-04-01`).format("MMMM D, YYYY")
            await label.locator("input").fill(newDate)
            await page.locator("//span[text()='Application Timeline']").click()
            await page.click("button.button span:has-text('Save')")
            await expect(page.locator("//div[contains(@class, 'Formstyle__Alert')]/p[text()='Opportunity was successfully updated.']")).toBeVisible()
            await Promise.all([
                page.waitForNavigation(),
                page.locator("//a[contains(@class, 'Navigationstyle__MenuLink') and span/text()='Job Opportunities']").nth(1).click()
            ])
            await page.locator("//section[contains(@class, 'OpportunityTeaserstyle__ActionSection')]/a").nth(0).waitFor()
            let startDate = await page.locator("//dt[text()='Start Date']/following-sibling::dd[1]").nth(0).innerText()
            expect(startDate).toEqual(`1 Apr ${currentYear}`)
        })

        // test for the expected start date where user chose "A specific date"
        // also test for December 1 - check that date was not changed on daylight savings
        test('update expected start date - a specific date (December 1)', async ({ page }) => {
            await page.locator("label[for='start-date-specific']").waitFor()
            await page.locator("label[for='start-date-specific']").click()
            await expect(page.locator("input[id='start-date-specific']")).toHaveClass("is-checked")
            const label = page.locator("//div[text()='Please enter the specific date successful candidates will begin working:']/following-sibling::div")
            const currentYear = moment().format("YYYY")
            let newDate = moment(`${currentYear}-12-01`).format("MMMM D, YYYY")
            await label.locator("input").fill(newDate)
            await page.click("button.button span:has-text('Save')")
            await expect(page.locator("//div[contains(@class, 'Formstyle__Alert')]/p[text()='Opportunity was successfully updated.']")).toBeVisible()
            await Promise.all([
                page.waitForNavigation(),
                page.locator("//a[contains(@class, 'Navigationstyle__MenuLink') and span/text()='Job Opportunities']").nth(1).click()
            ])
            await page.locator("//section[contains(@class, 'OpportunityTeaserstyle__ActionSection')]/a").nth(0).waitFor()
            let startDate = await page.locator("//dt[text()='Start Date']/following-sibling::dd[1]").nth(0).innerText()
            expect(startDate).toEqual(`1 Dec ${currentYear}`)
        })

        // test for the expected start date where user chose "A date range"
        test('update expected start date - a date range', async ({ page }) => {
            await page.locator("label[for='start-date-range']").waitFor()
            await page.locator("label[for='start-date-range']").click()
            await expect(page.locator("input[id='start-date-range']")).toHaveClass("is-checked")
            const label = page.locator("//div[text()='Please enter the date range successful candidates might begin working:']/following-sibling::div")
            const startDate = moment().format("MMMM D, YYYY")
            const endDate = moment().add(1, 'd').format("MMMM D, YYYY")
            await label.locator("input").nth(0).fill("")
            await label.locator("input").nth(1).fill("")
            await page.locator("//span[text()='Application Timeline']").click()
            await page.click("button.button span:has-text('Save')")
            await expect(page.locator("span.icon--danger")).toBeVisible()
            await expect(page.locator("//p[contains(@class, 'Formstyle__ErrorMessage') and text()='Start date and end date are required']")).toBeVisible()
            await label.locator("input").nth(0).fill("")
            await label.locator("input").nth(1).fill(endDate)
            await page.locator("//span[text()='Application Timeline']").click()
            await page.click("button.button span:has-text('Save')")
            await expect(page.locator("span.icon--danger")).toBeVisible()
            await expect(page.locator("//p[contains(@class, 'Formstyle__ErrorMessage') and text()='Start date is required']")).toBeVisible()
            await label.locator("input").nth(0).fill(startDate)
            await label.locator("input").nth(1).fill("")
            await page.locator("//span[text()='Application Timeline']").click()
            await page.click("button.button span:has-text('Save')")
            await expect(page.locator("span.icon--danger")).toBeVisible()
            await expect(page.locator("//p[contains(@class, 'Formstyle__ErrorMessage') and text()='End date is required']")).toBeVisible()
            await label.locator("input").nth(0).fill(startDate)
            await label.locator("input").nth(1).fill(endDate)
            await page.locator("//span[text()='Application Timeline']").click()
            await page.click("button.button span:has-text('Save')")
            await expect(page.locator("//div[contains(@class, 'Formstyle__Alert')]/p[text()='Opportunity was successfully updated.']")).toBeVisible()
            await Promise.all([
                page.waitForNavigation(),
                page.locator("//a[contains(@class, 'Navigationstyle__MenuLink') and span/text()='Job Opportunities']").nth(1).click()
            ])
            await page.locator("//section[contains(@class, 'OpportunityTeaserstyle__ActionSection')]/a").nth(0).waitFor()
            let startDateListPage = await page.locator("//dt[text()='Start Date']/following-sibling::dd[1]").nth(0).innerText()
            expect(startDateListPage).toEqual(`${moment().format("D MMM YYYY")} - ${moment().add(1, 'd').format("D MMM YYYY")}`)
        })

        // test for the expected start date where user chose "ASAP"
        test('update expected start date - asap', async ({ page }) => {
            await page.locator("label[for='start-date-8']").waitFor()
            await page.locator("label[for='start-date-8']").click()
            await expect(page.locator("input[id='start-date-8']")).toHaveClass("is-checked")
            await page.click("button.button span:has-text('Save')")
            await expect(page.locator("//div[contains(@class, 'Formstyle__Alert')]/p[text()='Opportunity was successfully updated.']")).toBeVisible()
            await Promise.all([
                page.waitForNavigation(),
                page.locator("//a[contains(@class, 'Navigationstyle__MenuLink') and span/text()='Job Opportunities']").nth(1).click()
            ])
            await page.locator("//section[contains(@class, 'OpportunityTeaserstyle__ActionSection')]/a").nth(0).waitFor()
            let startDateListPage = await page.locator("//dt[text()='Start Date']/following-sibling::dd[1]").nth(0).innerText()
            expect(startDateListPage).toEqual("ASAP")
        })

        // test for the expected start date where user chose "Ongoing"
        test('update expected start date - ongoing', async ({ page }) => {
            await page.locator("label[for='start-date-779']").waitFor()
            await page.locator("label[for='start-date-779']").click()
            await expect(page.locator("input[id='start-date-779']")).toHaveClass("is-checked")
            await page.click("button.button span:has-text('Save')")
            await expect(page.locator("//div[contains(@class, 'Formstyle__Alert')]/p[text()='Opportunity was successfully updated.']")).toBeVisible()
            await Promise.all([
                page.waitForNavigation(),
                page.locator("//a[contains(@class, 'Navigationstyle__MenuLink') and span/text()='Job Opportunities']").nth(1).click()
            ])
            await page.locator("//section[contains(@class, 'OpportunityTeaserstyle__ActionSection')]/a").nth(0).waitFor()
            let startDateListPage = await page.locator("//dt[text()='Start Date']/following-sibling::dd[1]").nth(0).innerText()
            expect(startDateListPage).toEqual("Ongoing")
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