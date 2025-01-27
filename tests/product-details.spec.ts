// e2e/productDetails.test.js
import { test, expect } from '@playwright/test';

test('Product details page should load and display correct attributes', async ({ page }) => {
    // Navigate to your local product page
    await page.goto('https://fs-task-react-git-master-bassems-projects-66665b1f.vercel.app/product/apple-iphone-12-pro'); // Update with your correct path
    // await page.goto('http://localhost:3000/product/apple-iphone-12-pro'); // Update with your correct path

    // Ensure that the color is visible (green)
    await page.locator('[data-testid="product-attribute-capacity-512G"]').waitFor({ state: 'visible', timeout: 15000 });

    const colorLocator = page.locator('[data-testid="product-attribute-capacity-512G"]');
    await expect(colorLocator).toBeVisible({ timeout: 15000 });

    // Ensure that the capacity is visible (512GB)
    // await page.locator('[data-testid="product-attribute-good"]').waitFor({ state: 'visible', timeout: 10000 });
    // const capacityLocator = page.locator('[data-testid="product-attribute-good"]');
    // await expect(capacityLocator).toBeVisible({ timeout: 10000 });
});
