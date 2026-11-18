import { test, expect } from '@playwright/test';

test.describe('FestiveUI End-to-End User Journeys', () => {
  const timestamp = Date.now();
  const testEmail = `dev_${timestamp}@example.com`;
  const testPassword = 'Password@2026!';

  test('Journey 1-14: Developer Onboarding, Project, Studio Customization & Purchase', async ({ page }) => {
    // 1. Visit Home & Navigate to Register
    await page.goto('/');
    await expect(page).toHaveTitle(/FestiveUI/);
    await page.click('text=Get Started Free');

    // 2. Register a Developer
    await page.fill('input[type="text"][placeholder="Alex"]', 'E2E Tester');
    await page.fill('input[type="email"]', testEmail);
    await page.fill('input[type="password"]', testPassword);
    await page.click('button:has-text("Create Free Account")');

    // 3. Logged in and redirected to Dashboard
    await page.waitForURL('/dashboard', { timeout: 15000 });
    await expect(page.locator('h1')).toContainText('Developer Dashboard');

    // 4. Create a Project
    await page.click('text=New Project');
    await page.fill('input[placeholder="e.g. Acme Diwali Store"]', `Festive Store ${timestamp}`);
    await page.fill('input[placeholder="https://acme-store.com"]', 'https://e2e-store.local');
    await page.click('button:has-text("Create Project")');
    await expect(page.locator(`text=Festive Store ${timestamp}`)).toBeVisible();

    // 5. Browse Marketplace & Diwali Animations
    await page.goto('/marketplace');
    await expect(page.locator('h1')).toContainText('Festival Animation Marketplace');
    await page.selectOption('select:has-text("All Festivals")', 'diwali');

    // 6. Open Diya Glow Detail Page
    await page.click('text=Diya Glow');
    await page.waitForURL(/\/marketplace\/diya-glow/);
    await expect(page.locator('h1')).toContainText('Diya Glow');

    // 7. Open Visual Editor Studio
    await page.click('text=Customize in FestiveUI Studio');
    await page.waitForURL('/studio');

    // 8. Studio Canvas Verification
    await expect(page.locator('text=Mode A (Canvas)')).toBeVisible();
    await expect(page.locator('text=Properties Inspector')).toBeVisible();

    // 9. Add another animation from library
    await page.click('button:has-text("Library")');
    await page.click('text=Diwali Fireworks');
    await page.click('button:has-text("Layers")');
    await expect(page.locator('text=Diwali Fireworks')).toBeVisible();

    // 10. Save the Project
    await page.click('button:has-text("Save")');
    await expect(page.locator('text=Saved successfully!')).toBeVisible({ timeout: 5000 });

    // 11. Export React Integration Code
    await page.click('button:has-text("Export Code")');
    await expect(page.locator('text=Export Verified Integration Code')).toBeVisible();
    await expect(page.locator('code')).toContainText('@festiveui/react');
    await page.click('button:has-text("Close")');

    // 12. Complete a Test Purchase from Marketplace
    await page.goto('/marketplace/floating-diyas');
    await page.click('button:has-text("Buy Commercial License")');
    await expect(page.locator('text=License Issued Successfully!')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('text=FEST-COMM-')).toBeVisible();

    // 13. Verify in Dashboard My Animations
    await page.goto('/dashboard/animations');
    await expect(page.locator('text=FEST-COMM-')).toBeVisible();
  });

  test('Journey 15-19: Super Admin Festival & Animation Publishing Operations', async ({ page }) => {
    // 15. Sign in as Super Admin
    await page.goto('/login');
    await page.fill('input[type="email"]', 'admin@festiveui.com');
    await page.fill('input[type="password"]', 'Festive@2026!');
    await page.click('button:has-text("Sign In")');
    await page.waitForURL('/dashboard');

    // 16. Navigate to Super Admin
    await page.goto('/admin');
    await expect(page.locator('h1')).toContainText('Operations Center');

    // 17. Manage Festivals & Create New
    await page.click('text=Festivals');
    await page.waitForURL('/admin/festivals');
    const newFestName = `Solstice Fest ${Date.now()}`;
    await page.click('button:has-text("Add Festival")');
    await page.fill('input[placeholder="e.g. Navratri"]', newFestName);
    await page.click('button:has-text("Create Festival")');
    await expect(page.locator(`text=${newFestName}`)).toBeVisible();

    // 18. Verify Admin Animations Catalog
    await page.goto('/admin/animations');
    await expect(page.locator('h1')).toContainText('Animation Management');
    await expect(page.locator('text=Diya Glow')).toBeVisible();

    // 19. Verify Public Marketplace reflects catalog
    await page.goto('/marketplace');
    await expect(page.locator('text=Diya Glow')).toBeVisible();
  });
});
