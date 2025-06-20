// @ts-check
import { test, expect } from '@playwright/test';

test('has title and displays customers', async ({ page }) => {
  await page.goto('/customers');

  // Expect a title "to contain" a substring.
  await expect(page.locator('h1')).toContainText('Customers');

  // Wait for the API call to complete and the table to be populated
  await page.waitForSelector('text=John Doe');

  // Expect the row for John Doe to be visible
  const johnDoeRow = page.locator('tr', { hasText: 'John Doe' });
  await expect(johnDoeRow).toBeVisible();
  await expect(johnDoeRow).toContainText('john.doe@example.com');
});