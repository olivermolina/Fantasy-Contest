import { test, expect } from '@playwright/test';

test.describe.configure({ mode: 'parallel' });
test.setTimeout(60000);

test('go to landing page', async ({ page }) => {
  await page.goto('/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/LockSpread/);
});

test('test 404', async ({ page }) => {
  const res = await page.goto('/not-found');
  expect(res?.status()).toBe(404);
});

test('go to challenge page', async ({ page }) => {
  await page.goto('/challenge');
  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Challenge | LockSpread/);
});

test('go to cart page', async ({ page }) => {
  await page.goto('/cart');
  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Cart | LockSpread/);
});

test('go to profile', async ({ page }) => {
  await page.goto('/profile');
  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Profile | LockSpread/);
});

test('go to profile > account deposit page', async ({ page }) => {
  await page.goto('/profile/account-deposit');
  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Account Deposit | LockSpread/);
});

test('go to profile > withdraw funds page', async ({ page }) => {
  await page.goto('/profile/withdraw-funds');
  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Withdraw Funds | LockSpread/);
});

test('go to Profile Details', async ({ page }) => {
  await page.goto('/profile/details');
  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Details | LockSpread/);
});

test('go to profile > Transaction History', async ({ page }) => {
  await page.goto('/profile/transaction-history');
  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Transaction History | LockSpread/);
});

test('go to profile > Referral', async ({ page }) => {
  await page.goto('/profile/referral');
  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Referral | LockSpread/);
});
