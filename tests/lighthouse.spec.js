const { test, expect } = require('@playwright/test')
const { playAudit } = require('playwright-lighthouse')
const playwright = require('playwright')

test.describe.parallel('lighthouse audit', () => {
    test('lighthouse audit report', async () => {
        const browser = await playwright['chromium'].launch({
            args: ['--remote-debugging-port=9222'],
        })
        const page = await browser.newPage()
        await page.goto("https://gradaustralia.com.au/")
        // await page.goto('https://dev.portal.prosple.com')

        await playAudit({
            page: page,
            // mostly needed is the seo and performance but it won't hurt to add all
            thresholds: {
                performance: 20,
                accessibility: 20,
                'best-practices': 20,
                seo: 20,
                pwa: 20,
            },
            port: 9222,
            reports: {
                formats: {
                    json: false,
                    html: true,
                    csv: false,
                },
                name: `lighthouse-ga-${new Date().getTime()}`,
                directory: `${process.cwd()}/lighthouse`,
            }
        })

        await browser.close()
    })
})