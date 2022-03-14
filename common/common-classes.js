const data = require("./common-details.json")

class CompleteLogin {
    constructor(page) {
        this.page = page
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
        await this.page.waitForSelector("//div[contains(@class, 'viewport viewport--normal')]//a[contains(@class, 'Navigationstyle__LogoLink')]")
    }
}

module.exports = { CompleteLogin }