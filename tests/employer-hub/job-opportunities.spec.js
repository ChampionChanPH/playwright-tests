const { test, expect } = require('@playwright/test')
const { getRandomNumber, getRandomCharacters } = require("../../common/common-functions")
const { CompleteLogin, Input } = require("../../common/common-classes")
const data = require("../../common/common-details.json")

test.beforeEach(async ({ page }) => {
    const login = new CompleteLogin(page)
    await login.employerHubLogin()
    await Promise.all([
        page.waitForNavigation(),
        page.locator("//a[contains(@class, 'Navigationstyle__MenuLink') and span/text()='Job Opportunities']").nth(1).click()
    ])
    await Promise.all([
        page.waitForNavigation(),
        page.locator("//section[contains(@class, 'OpportunityTeaserstyle__ActionSection')]/a").nth(0).click()
    ])
})

// tests for editing a job opportunity
test.describe('edit job opportunity', async () => {
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