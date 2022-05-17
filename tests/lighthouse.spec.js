const { test, expect } = require('@playwright/test')
const { playAudit } = require('playwright-lighthouse');
const playwright = require('playwright');

test.describe('audit example', () => {
    test.only('lighthouse audit report', async ({ page }) => {
        const browser = await playwright['chromium'].launch({
            args: ['--remote-debugging-port=9222'],
        });
        await page.goto('https://gradaustralia.com.au/')

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
                    json: true, //defaults to false
                    html: true, //defaults to false
                    csv: true, //defaults to false
                },
                name: `lighthouse-${new Date().getTime()}`,
                directory: `${process.cwd()}/playwright-report/lighthouse`,
            }
        })

        await browser.close()
    })
})