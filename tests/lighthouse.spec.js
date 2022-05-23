const { test, expect } = require('@playwright/test')
const { playAudit } = require('playwright-lighthouse')
const playwright = require('playwright')

test.describe.parallel('lighthouse audit', () => {
    test('lighthouse audit report', async () => {
        const browser = await playwright['chromium'].launch({
            args: ['--remote-debugging-port=9222'],
        })
        const page = await browser.newPage()
        await page.goto()
        // await page.goto('https://dev.portal.prosple.com')

        await playAudit({
            page: page,
            // mostly needed is the seo and performance but it won't hurt to add all
            thresholds: {
                performance: 25,
                accessibility: 25,
                'best-practices': 25,
                seo: 25,
                pwa: 25,
            },
            port: 9222,
            reports: {
                formats: {
                    json: false,
                    html: true,
                    csv: false,
                },
                name: `lighthouse-student-hub-${new Date().getTime()}`,
                directory: `${process.cwd()}/lighthouse`,
            }
        })

        await browser.close()
    })
})