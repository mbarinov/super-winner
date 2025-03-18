import { test, expect } from '@playwright/test'

test.describe('Cart Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.evaluate(() => `window.localStorage.clear()`)
    await page.goto('/')
    await expect(page.getByText('Loading products...')).toBeHidden()
  })

  test('should add product to cart from homepage', async ({ page }) => {
    const addToCartButtons = page.getByTestId('add-to-cart')

    await page.waitForTimeout(1000)
    await addToCartButtons.first().click()

    const quantityControls = page.getByTestId('quantity')
    await expect(quantityControls).toBeVisible()

    // Increment quantity
    await page.getByTestId('increment-quantity').first().click()

    // Verify quantity is 2
    await expect(quantityControls).toHaveText('2')

    // Decrement quantity
    await page.getByTestId('decrement-quantity').click()

    // Verify quantity is 1
    await expect(quantityControls).toHaveText('1')

    // Remove from cart
    await page.getByTestId('remove-product').click()

    // Verify "Add to Cart" button is visible again
    await expect(addToCartButtons.first()).toBeVisible()
  })
})
