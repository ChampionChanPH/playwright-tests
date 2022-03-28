const { test, expect } = require('@playwright/test')
const { getRandomNumber } = require('../../common/common-functions')
const { CompleteLogin } = require("../../common/common-classes")
const data = require("../../common/common-details.json")

test.describe('signup tests on student hub', async () => {
    // user successfully sign up for an account in the student hub by providing some personal details
    // after successful signup, close the account and check that the credentials won't work when tried to login
    test.only('successful user signup', async ({ page, browserName }) => {
        const login = new CompleteLogin(page, browserName)
        await login.signUp()
    })
})