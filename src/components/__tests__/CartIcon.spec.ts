import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import { createRouter, createWebHistory } from 'vue-router'
import CartIcon from '../CartIcon.vue'
import { ShoppingCart } from 'lucide-vue-next'

vi.mock('lucide-vue-next', () => ({
  ShoppingCart: {
    name: 'ShoppingCart',
    render: () => null,
  },
}))

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: {},
    },
    {
      path: '/cart',
      component: {},
    },
  ],
})

describe('CartIcon.vue', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    router.push('/')
  })

  it('renders shopping cart icon', () => {
    const wrapper = mount(CartIcon, {
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn,
            initialState: {
              cart: {
                items: [],
                totalItems: 0,
              },
            },
          }),
          router,
        ],
      },
    })

    expect(wrapper.findComponent(ShoppingCart).exists()).toBe(true)
  })

  it('renders cart count badge when items are present', async () => {
    const wrapper = mount(CartIcon, {
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn,
            initialState: {
              cart: {
                items: [{ id: 1, quantity: 3 }],
                totalItems: 3,
              },
            },
          }),
          router,
        ],
      },
    })

    await wrapper.vm.$nextTick()
    const badge = wrapper.find('[aria-label="Cart items count"]')
    expect(badge.exists()).toBe(true)
    expect(badge.text()).toBe('3')
  })

  it('does not render cart count badge when cart is empty', async () => {
    const wrapper = mount(CartIcon, {
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn,
            initialState: {
              cart: {
                items: [],
                totalItems: 0,
              },
            },
          }),
          router,
        ],
      },
    })

    await wrapper.vm.$nextTick()
    const badge = wrapper.find('[aria-label="Cart items count"]')
    expect(badge.exists()).toBe(false)
  })

  it('links to cart page', async () => {
    const wrapper = mount(CartIcon, {
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn,
            initialState: {
              cart: {
                items: [],
                totalItems: 0,
              },
            },
          }),
          router,
        ],
      },
    })

    await wrapper.vm.$nextTick()
    const link = wrapper.findComponent({ name: 'RouterLink' })
    expect(link.exists()).toBe(true)
    expect(link.props('to')).toBe('/cart')
  })
})
