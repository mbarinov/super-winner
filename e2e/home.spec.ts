import { test, expect } from '@playwright/test'

test.describe('HomeView', () => {
  test('should display categories', async ({ page }) => {
    await page.goto('/')

    await expect(page.getByText('Loading categories...')).toBeHidden()

    await expect(page.getByTestId('category-link').first()).toBeVisible()
  })

  test('should display products section', async ({ page }) => {
    await page.goto('/')

    await expect(page.getByTestId('products-heading')).toBeVisible()

    await expect(page.getByText('Loading products...')).toBeHidden()

    const productsExist = await page.getByTestId('product-list').isVisible()
    if (productsExist) {
      await expect(page.getByTestId('product-list').first()).toBeVisible()
    } else {
      await expect(page.getByText('No products found')).toBeVisible()
    }
  })

  test('category links should navigate to category page', async ({ page }) => {
    await page.goto('/')

    await expect(page.getByText('Loading categories...')).toBeHidden()

    const firstCategory = page.getByTestId('category-link').first()
    await firstCategory.click()

    await expect(page).toHaveURL(new RegExp(`/category/\\d+`))
  })
})
