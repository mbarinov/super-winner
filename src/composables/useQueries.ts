import { useQuery } from '@tanstack/vue-query'
import { ecwidApi } from '../services/ecwidApi'
import type { Category, Product } from '../services/ecwidApi'
import type { ComputedRef } from 'vue'

export function useCategories() {
  return useQuery<Category[], Error>({
    queryKey: ['categories'],
    queryFn: async () => {
      return await ecwidApi.getCategories()
    },
    select: (data) => data,
  })
}

export function useProducts() {
  return useQuery<Product[], Error>({
    queryKey: ['products'],
    queryFn: async () => {
      return await ecwidApi.getProducts()
    },
    select: (data) => data,
  })
}

export function useProduct(id: ComputedRef<number | undefined>) {
  return useQuery<Product, Error>({
    queryKey: ['product', id],
    queryFn: async () => {
      if (!id.value) throw new Error('Product ID is required')
      const data = await ecwidApi.getProduct(id.value)
      return data
    },
    enabled: !!id.value,
    select: (data) => data,
  })
}

export function useCategory(id: ComputedRef<number | undefined>) {
  return useQuery<{ category: Category; products: Product[] }, Error>({
    queryKey: ['category', id],
    queryFn: async () => {
      if (!id.value) throw new Error('Category ID is required')
      const [category, products] = await Promise.all([
        ecwidApi.getCategory(id.value),
        ecwidApi.getProducts(id.value),
      ])
      return { category, products }
    },
    enabled: !!id.value,
    select: (data) => data,
  })
}
