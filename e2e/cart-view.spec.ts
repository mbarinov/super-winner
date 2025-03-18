import { test, expect } from '@playwright/test'

test.describe('Cart View Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')

    await expect(page.getByText('Loading products...')).toBeHidden()

    const addToCartButtons = page.getByTestId('add-to-cart')
    const hasProducts = (await addToCartButtons.count()) > 0

    if (hasProducts) {
      await addToCartButtons.first().click()

      await expect(page.getByText('Adding...')).toBeHidden({ timeout: 5000 })
    }
  })

  test('should display cart items and allow checkout', async ({ page }) => {
    await page.goto('/cart')

    await expect(page.getByTestId('cart-title')).toBeVisible()

    const emptyCartMessage = page.getByTestId('empty-cart-message')
    const hasEmptyCart = await emptyCartMessage.isVisible()

    if (!hasEmptyCart) {
      await expect(page.getByTestId('cart-items')).toBeVisible()

      await expect(page.getByTestId('total-price')).toBeVisible()

      await page.getByTestId('place-order').click()

      await expect(page.getByTestId('order-confirmation')).toBeVisible()

      await page.getByTestId('close-dialog').click()

      await expect(page.getByTestId('empty-cart-message')).toBeVisible()
      await expect(page.getByTestId('continue-shopping')).toBeVisible()
    } else {
      await page.getByTestId('continue-shopping').click()

      await expect(page).toHaveURL('/')
    }
  })

  test('cart controls should work on cart page', async ({ page }) => {
    await page.goto('/cart')

    const emptyCartMessage = page.getByTestId('empty-cart-message')
    const hasEmptyCart = await emptyCartMessage.isVisible()

    if (!hasEmptyCart) {
      const quantityText = await page.getByTestId('quantity').first().textContent()
      const initialQuantity = quantityText ? parseInt(quantityText.trim()) : 1

      await page.getByTestId('increment-quantity').click()

      await expect(page.getByTestId('quantity').first()).toHaveText(`${initialQuantity + 1}`)

      await page.getByTestId('remove-product').click()

      await expect(page.getByTestId('empty-cart-message')).toBeVisible()
    } else {
      test.skip()
    }
  })
})
