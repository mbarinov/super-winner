import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import ProductCard from '../ProductCard.vue'
import type { Product } from '@/services/ecwidApi'

const mockProduct: Product = {
  id: 1,
  name: 'Test Product',
  price: 99.99,
  imageUrl: 'test.jpg',
  description: 'Test description',
  categoryId: 1,
  sku: 'TEST-001',
  enabled: true,
}

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: { template: '<div>Home Page</div>' },
    },
    {
      path: '/product/:id',
      component: { template: '<div>Product Page</div>' },
    },
  ],
})

vi.mock('../Cart.vue', () => ({
  default: {
    name: 'Cart',
    props: ['productId'],
    template: '<div class="cart-mock">Cart Component</div>',
  },
}))

describe('ProductCard.vue', () => {
  it('renders product information correctly', async () => {
    const wrapper = mount(ProductCard, {
      props: { product: mockProduct },
      global: {
        plugins: [router],
        stubs: {
          RouterLink: {
            template: '<div><slot /></div>',
          },
        },
      },
    })

    await wrapper.vm.$nextTick()

    expect(wrapper.find('.text-gray-800').text()).toBe(mockProduct.name)

    expect(wrapper.find('.text-green-600').text()).toBe(`$${mockProduct.price.toFixed(2)}`)

    const img = wrapper.find('img')
    expect(img.attributes('src')).toBe(mockProduct.imageUrl)
    expect(img.attributes('alt')).toBe(mockProduct.name)
  })

  it('renders router link with correct path', () => {
    const wrapper = mount(ProductCard, {
      props: { product: mockProduct },
      global: {
        plugins: [router],
        stubs: {
          RouterLink: true,
        },
      },
    })

    const link = wrapper.findComponent({ name: 'RouterLink' })
    expect(link.exists()).toBe(true)
    expect(link.props('to')).toBe(`/product/${mockProduct.id}`)
  })

  it('renders Cart component with correct productId', () => {
    const wrapper = mount(ProductCard, {
      props: { product: mockProduct },
      global: {
        plugins: [router],
        stubs: {
          RouterLink: true,
        },
      },
    })

    const cart = wrapper.findComponent({ name: 'Cart' })
    expect(cart.exists()).toBe(true)
    expect(cart.props('productId')).toBe(mockProduct.id)
  })
})
