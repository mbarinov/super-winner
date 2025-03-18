import { test, expect } from '@playwright/test'

test.describe('Product Components', () => {
  test('product cards should be visible on homepage', async ({ page }) => {
    await page.goto('/')

    // Wait for loading to complete
    await expect(page.getByText('Loading products...')).toBeHidden()

    // Get all product cards
    const productCards = page.locator('.bg-white.rounded-lg.shadow-md')

    // Check if products exist
    const productsExist = (await productCards.count()) > 0
    if (productsExist) {
      // Verify product cards have images, names and prices
      await expect(productCards.first().locator('img')).toBeVisible()
      await expect(productCards.first().locator('h2')).toBeVisible()
      await expect(productCards.first().getByText(/\$\d+\.\d{2}/)).toBeVisible()
    }
  })

  test('clicking product card should navigate to product page', async ({ page }) => {
    await page.goto('/')

    // Wait for loading to complete
    await expect(page.getByText('Loading products...')).toBeHidden()

    // Get product cards
    const productCards = page.locator('.bg-white.rounded-lg.shadow-md')

    // Check if there are any products
    const productsExist = (await productCards.count()) > 0
    if (productsExist) {
      // Get the first product's title for later comparison
      const productTitle = await productCards.first().locator('h2').textContent()

      // Click on the first product
      await productCards.first().locator('a').click()

      // Verify URL has changed to product page
      await expect(page).toHaveURL(/\/product\/\d+/)

      // Verify product title is visible on the product page (if it exists)
      if (productTitle) {
        await expect(page.getByText(productTitle)).toBeVisible()
      }
    } else {
      test.skip()
    }
  })
})
