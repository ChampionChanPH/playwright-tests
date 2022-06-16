const { MongoClient, ServerApiVersion } = require('mongodb')
const data = require("./common-details.json")
const { getRandomNumber } = require("./common-functions")

class CompleteLogin {
    constructor(page, browserName) {
        this.page = page
        this.browserName = browserName
    }

    async studentHubLogin() {
        await Promise.all([
            this.page.waitForNavigation(),
            this.page.locator("//a[contains(@class, 'AuthMenustyle__SignInButton-sc-yhrlvv-3')]").nth(1).click()
        ])
        await this.page.fill("input#email", data.studentHubEmail)
        await this.page.fill("input#password", data.studentHubPass)
        await Promise.all([
            this.page.waitForNavigation(),
            this.page.click("button#btn-login")
        ])
        await this.page.locator("span:has-text('Updating Results')").last().waitFor({ state: "hidden" })
        await this.page.waitForSelector("div.viewport--normal a.logo")
    }

    async employerHubLogin() {
        await this.page.goto(data.employerHubUrl)
        await this.page.fill("input#email", data.employerHubEmail)
        await this.page.fill("input#password", data.employerHubPass)
        await Promise.all([
            this.page.waitForNavigation(),
            this.page.click("button#btn-login")
        ])
        await this.page.waitForURL("**/dashboard/overview/")
    }

    async signUp() {
        let firstName, lastName, email
        if (this.browserName === 'chromium') {
            firstName = "chromium"
            lastName = "windows"
            email = "101"
        }
        if (this.browserName === 'firefox') {
            firstName = "firefox"
            lastName = "linux"
            email = "102"
        }
        if (this.browserName === 'webkit') {
            firstName = "webkit"
            lastName = "macos"
            email = "103"
        }
        await this.page.goto(data.studentHubUrl)
        await Promise.all([
            this.page.waitForNavigation(),
            this.page.locator("//a[contains(@class, 'AuthMenustyle__SignInButton-sc-yhrlvv-3')]").nth(1).click()
        ])
        await this.page.click("//div[@id='signup-message']//a[@class='open-signup']")
        await this.page.fill("input#given-name", firstName)
        await this.page.fill("input#family-name", lastName)
        await this.page.fill("input#email-signup", `testing.with.prosple+${email}@gmail.com`)
        await this.page.fill("input#password-signup", data.studentHubPass)
        await this.page.click("button#btn-signup")
        await this.page.hover("//button[@class='toggle-trigger']//span[contains(@class, 'icon--profile')]")
        console.log(`"${this.browserName}"`)
    }
}

class Input {
    constructor(page) {
        this.page = page
    }

    async randomSelect(locator, includeFirst = true) {
        const options = this.page.locator(locator).locator("//option")
        const optionCount = await options.count()
        const start = includeFirst ? 1 : 2
        const random = getRandomNumber(start, optionCount)
        const chosenOption = await options.nth(random - 1).innerText()
        console.log(`Option selected: ${chosenOption}`)
        await this.page.locator(locator).selectOption({ label: chosenOption })
        return chosenOption
    }
}

class VirtualExperience {
    // function created to connect to the dev db and delete all of the ve registrations under the specified userId
    async deleteRegistration() {
        const password = data.devMongoDb
        const userId = data.userId
        // const uri = `mongodb+srv://prosple:${password}@dev.qxgpg.mongodb.net/?retryWrites=true&w=majority`
        const uri = `mongodb://prosple:${password}@dev-shard-00-00.qxgpg.mongodb.net:27017,dev-shard-00-01.qxgpg.mongodb.net:27017,dev-shard-00-02.qxgpg.mongodb.net:27017/dev?ssl=true&replicaSet=atlas-13p0if-shard-0&authSource=admin&retryWrites=true&w=majority`
        // const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 })
        const client = new MongoClient(uri)
        try {
            await client.connect()
            const db = client.db("dev")
            const ve = db.collection("virtualexperiences")
            await ve.deleteMany({ "userId": userId })
            // const cursor = await ve.find({ "userId": userId })
            // const result = await cursor.toArray()
            // console.table(result)
            // result.forEach(r => console.log(r))
        } catch (e) {
            console.error(`ERROR - ${e}`)
        } finally {
            client.close()
        }
    }
}


module.exports = { CompleteLogin, Input, VirtualExperience }