const { chromium } = require('playwright');

test.beforeEach(async ({ page }) => {
  await page.goto('https://demo.playwright.dev/todomvc');
});

test.describe('New Todo', () => {
  test('should allow me to add todo items', async ({ page }) => {
    // Create 1st todo.
    await page.locator('text=Sign in').click();
    await new Promise(r => setTimeout(r, 2000));
    assert.equal(page.url(), 'https://login.prosple.com/login?state=hKFo2SB4X0Rkd0tZa0s0RzZPQjVvV2l2ZThBQnFidTR0Y09wZKFupWxvZ2luo3RpZNkgbTVFY21DWVhGSGFjOFRmcGw1UklQUFI1dm9nZGVaVVajY2lk2SBFWXhnTG1ka0wyVjBmMDNjNkZrZmFHMGc5bE1XSk9hbQ&client=EYxgLmdkL2V0f03c6FkfaG0g9lMWJOam&protocol=oauth2&audience=https%3A%2F%2Fauth.prosple.com&mode=null&app_name=GradAustralia&logo=&scope=openid%20profile%20email%20offline_access&response_type=code&response_mode=query&nonce=LXVyWjROb3RUek80TzAxbkF5c2F5NjlIbFp4UTBLNFBxQmJnLm1ERkwyRQ%3D%3D&redirect_uri=https%3A%2F%2Fgradaustralia.com.au%2Fcallback&code_challenge=WBloQjBc3IcqDJ7YGJWsPjYmgz5T-u4ZxRtpYgSsCh0&code_challenge_method=S256&auth0Client=eyJuYW1lIjoiYXV0aDAtc3BhLWpzIiwidmVyc2lvbiI6IjEuMTIuMCJ9');
    // ---------------------
    await context.close();
    await browser.close();
  });
});