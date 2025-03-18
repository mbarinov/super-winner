import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { VueQueryPlugin, QueryClient } from '@tanstack/vue-query'
import type { UseQueryReturnType } from '@tanstack/vue-query'
import { ref, nextTick } from 'vue'
import ProductList from '../ProductList.vue'
import * as queries from '@/composables/useQueries'
import type { Product } from '@/services/ecwidApi'

vi.mock('@/composables/useQueries')

describe('ProductList.vue', () => {
  let queryClient: QueryClient

  beforeEach(() => {
    vi.resetModules()
    vi.clearAllMocks()
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
          refetchOnMount: false,
          refetchOnWindowFocus: false,
        },
      },
    })
  })

  const mockProducts: Product[] = [
    {
      id: 1,
      name: 'Test Product 1',
      price: 99.99,
      imageUrl: 'test1.jpg',
      description: 'Test description 1',
      categoryId: 1,
      enabled: true,
      sku: 'SKU1',
    },
    {
      id: 2,
      name: 'Test Product 2',
      price: 149.99,
      imageUrl: 'test2.jpg',
      description: 'Test description 2',
      categoryId: 2,
      enabled: true,
      sku: 'SKU2',
    },
  ]

  const mountComponent = (props = {}) => {
    return mount(ProductList, {
      props,
      global: {
        plugins: [[VueQueryPlugin, queryClient]],
      },
    })
  }

  it('renders all products when no categoryId is provided', async () => {
    vi.spyOn(queries, 'useProducts').mockReturnValue({
      data: ref(mockProducts),
      isFetching: false,
      isError: false,
      error: null,
      isLoading: false,
      isPending: false,
      isSuccess: true,
      status: 'success',
    } as unknown as UseQueryReturnType<Product[], Error>)

    const wrapper = mountComponent()

    const productCards = wrapper.findAll('[data-testid^="product-card-"]')
    expect(productCards).toHaveLength(2)
    expect(wrapper.text()).toContain('Test Product 1')
    expect(wrapper.text()).toContain('Test Product 2')
  })

  it('filters products by categoryId when provided', async () => {
    vi.spyOn(queries, 'useProducts').mockReturnValue({
      data: ref(mockProducts),
      isFetching: false,
      isError: false,
      error: null,
      isLoading: false,
      isPending: false,
      isSuccess: true,
      status: 'success',
    } as unknown as UseQueryReturnType<Product[], Error>)

    const wrapper = mountComponent({ categoryId: 1 })

    const productCards = wrapper.findAll('[data-testid^="product-card-"]')
    expect(productCards).toHaveLength(1)
    expect(wrapper.text()).toContain('Test Product 1')
    expect(wrapper.text()).not.toContain('Test Product 2')
  })

  it('displays loading spinner when fetching data', async () => {
    vi.spyOn(queries, 'useProducts').mockReturnValue({
      data: [],
      isFetching: true,
      isError: false,
      error: null,
      isLoading: true,
      isPending: true,
      isSuccess: false,
      status: 'loading',
    } as unknown as UseQueryReturnType<Product[], Error>)

    const wrapper = mountComponent()

    expect(wrapper.find('.animate-spin').exists()).toBe(true)
  })

  it('displays error message when fetch fails', async () => {
    const errorMessage = 'Failed to fetch products'

    vi.spyOn(queries, 'useProducts').mockReturnValue({
      data: [],
      isFetching: false,
      isError: true,
      error: new Error(errorMessage),
      isLoading: false,
      isPending: false,
      isSuccess: false,
      status: 'error',
    } as unknown as UseQueryReturnType<Product[], Error>)

    const wrapper = mountComponent()

    expect(wrapper.text()).toContain(errorMessage)
  })
})
