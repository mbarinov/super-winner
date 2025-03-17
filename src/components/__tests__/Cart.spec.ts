import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import Cart from '../Cart.vue'
import { Plus, Minus, Loader2, Trash } from 'lucide-vue-next'
import type { ComponentPublicInstance } from 'vue'
import type { CartItem } from '@/services/ecwidApi'

vi.mock('@/composables/useQueries', () => ({
  useProduct: () => ({
    data: {
      value: {
        name: 'Test Product',
        price: 99.99,
        imageUrl: 'test.jpg',
      },
    },
  }),
}))

interface CartComponentInstance extends ComponentPublicInstance {
  cartStore: {
    items: CartItem[]
    addItem: (item: Omit<CartItem, 'quantity'>) => void
    removeItem: (itemId: number) => void
    updateQuantity: (itemId: number, quantity: number) => void
  }
  isAdding: boolean
}

describe('Cart.vue', () => {
  const productId = 1

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders "Add to Cart" button when item is not in cart', () => {
    const wrapper = mount(Cart, {
      props: { productId },
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn,
          }),
        ],
      },
    })

    expect(wrapper.find('button').text().trim()).toBe('Add to Cart')
    expect(wrapper.findComponent(Plus).exists()).toBe(true)
  })

  it('shows loading state when adding to cart', async () => {
    const wrapper = mount(Cart, {
      props: { productId },
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn,
          }),
        ],
      },
    })

    const component = wrapper.vm as unknown as CartComponentInstance
    component.isAdding = true
    await wrapper.vm.$nextTick()

    expect(wrapper.findComponent(Loader2).exists()).toBe(true)
    expect(wrapper.find('button').text().trim()).toBe('Adding...')
  })

  it('renders quantity controls when item is in cart', () => {
    const wrapper = mount(Cart, {
      props: { productId },
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn,
            initialState: {
              cart: {
                items: [
                  {
                    id: productId,
                    name: 'Test Product',
                    price: 99.99,
                    imageUrl: 'test.jpg',
                    quantity: 2,
                  },
                ],
              },
            },
          }),
        ],
      },
    })

    expect(wrapper.findComponent(Minus).exists()).toBe(true)
    expect(wrapper.findComponent(Plus).exists()).toBe(true)
    expect(wrapper.find('span').text()).toBe('2')
  })

  it('calls increment when plus button is clicked', async () => {
    const wrapper = mount(Cart, {
      props: { productId },
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn,
            initialState: {
              cart: {
                items: [
                  {
                    id: productId,
                    name: 'Test Product',
                    price: 99.99,
                    imageUrl: 'test.jpg',
                    quantity: 1,
                  },
                ],
              },
            },
          }),
        ],
      },
    })

    await wrapper.findComponent(Plus).trigger('click')
    const store = (wrapper.vm as unknown as CartComponentInstance).cartStore
    expect(store.updateQuantity).toHaveBeenCalledWith(productId, 2)
  })

  it('calls decrement when minus button is clicked', async () => {
    const wrapper = mount(Cart, {
      props: { productId },
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn,
            initialState: {
              cart: {
                items: [
                  {
                    id: productId,
                    name: 'Test Product',
                    price: 99.99,
                    imageUrl: 'test.jpg',
                    quantity: 2,
                  },
                ],
              },
            },
          }),
        ],
      },
    })

    await wrapper.findComponent(Minus).trigger('click')
    const store = (wrapper.vm as unknown as CartComponentInstance).cartStore
    expect(store.updateQuantity).toHaveBeenCalledWith(productId, 1)
  })

  it('calls removeFromCart when remove button is clicked', async () => {
    const wrapper = mount(Cart, {
      props: { productId },
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn,
            initialState: {
              cart: {
                items: [
                  {
                    id: productId,
                    name: 'Test Product',
                    price: 99.99,
                    imageUrl: 'test.jpg',
                    quantity: 1,
                  },
                ],
              },
            },
          }),
        ],
      },
    })

    await wrapper.findComponent(Trash).trigger('click')
    const store = (wrapper.vm as unknown as CartComponentInstance).cartStore
    expect(store.removeItem).toHaveBeenCalledWith(productId)
  })
})
