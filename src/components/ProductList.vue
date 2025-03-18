<template>
  <div class="container mx-auto px-4 py-8">
    <div v-if="productsQuery.isFetching" class="text-center">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
    </div>

    <div v-else-if="productsQuery.isError" class="text-red-500 text-center">
      {{ productsQuery.error instanceof Error ? productsQuery.error.message : 'An error occurred' }}
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="product in products"
        :key="product.id"
        :data-testid="`product-card-${product.id}`"
        class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
      >
        <img :src="product.imageUrl" :alt="product.name" class="w-full h-48 object-cover" />
        <div class="p-4">
          <h3 class="text-lg font-semibold mb-2">{{ product.name }}</h3>
          <p class="text-gray-600 text-sm mb-2">{{ product.description }}</p>
          <p class="text-xl font-bold text-gray-900">${{ product.price.toFixed(2) }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, unref } from 'vue'
import { useProducts } from '@/composables/useQueries'
import type { Product } from '@/services/ecwidApi'

const props = defineProps<{
  categoryId?: number
}>()

const productsQuery = useProducts()

const products = computed<Product[]>(() => {
  const allProducts = unref(productsQuery.data) || []
  if (props.categoryId) {
    return allProducts.filter((product) => product.categoryId === props.categoryId)
  }
  return allProducts
})
</script>
