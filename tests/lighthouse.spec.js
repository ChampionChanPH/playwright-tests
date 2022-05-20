const { test, expect } = require('@playwright/test')
const { playAudit } = require('playwright-lighthouse');
const playwright = require('playwright');

test.describe('audit example', () => {
    test.only('lighthouse audit report', async () => {
        const browser = await playwright['chromium'].launch({
            args: ['--remote-debugging-port=9222'],
        })
        const page = await browser.newPage()
        await page.goto('https://gradaustralia.com.au/')
        console.log(process.cwd())
        console.log(`lighthouse-${new Date().getTime()}`)

        await playAudit({
            page: page,
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
                name: `lighthouse-${new Date().getTime()}`,
                directory: `${process.cwd()}/lighthouse/gradaustralia`,
            }
        })

        await browser.close()
    })
})