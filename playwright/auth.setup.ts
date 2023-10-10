import { expect, test as setup } from '@playwright/test';

const authFile = 'playwright/.auth/user.json';

setup.setTimeout(60000);

setup('authenticate', async ({ page }) => {
  // Perform authentication steps.
  await page.goto('/auth/login');
  await page.getByPlaceholder('email').fill('playfree9800@gmail.com');
  await page.getByPlaceholder('password').fill('12345678');
  await page.getByRole('button', { name: 'Submit' }).click();

  // Wait until the page receives the cookies.
  // Sometimes login flow sets cookies in the process of several redirects.
  // Wait for the final URL to ensure that the cookies are actually set.
  await page.waitForURL('/challenge');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Challenge | LockSpread/);

  // End of authentication steps.
  await page.context().storageState({ path: authFile });

  // End of authentication steps.

  await page.context().storageState({ path: authFile });
});
