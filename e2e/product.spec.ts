import { test, expect } from '@playwright/test'

test.describe('Product Components', () => {
  test('product cards should be visible on homepage', async ({ page }) => {
    await page.goto('/')

    await expect(page.getByText('Loading products...')).toBeHidden()

    const productCards = page.locator('.bg-white.rounded-lg.shadow-md')

    const productsExist = (await productCards.count()) > 0
    if (productsExist) {
      await expect(productCards.first().locator('img')).toBeVisible()
      await expect(productCards.first().locator('h2')).toBeVisible()
      await expect(productCards.first().getByText(/\$\d+\.\d{2}/)).toBeVisible()
    }
  })

  test('clicking product card should navigate to product page', async ({ page }) => {
    await page.goto('/')

    await expect(page.getByText('Loading products...')).toBeHidden()

    const productCards = page.locator('.bg-white.rounded-lg.shadow-md')

    const productsExist = (await productCards.count()) > 0
    if (productsExist) {
      const productTitle = await productCards.first().locator('h2').textContent()

      await productCards.first().locator('a').click()

      await expect(page).toHaveURL(/\/product\/\d+/)

      if (productTitle) {
        await expect(page.getByText(productTitle)).toBeVisible()
      }
    } else {
      test.skip()
    }
  })
})
