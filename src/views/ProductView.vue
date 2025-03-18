<template>
  <div class="container mx-auto px-4 py-8">
    <div v-if="isProductLoading" class="flex items-center justify-center space-x-2">
      <div
        class="h-4 w-4 animate-spin rounded-full border-2 border-blue-500 border-t-transparent"
      ></div>
      <span>Loading product...</span>
    </div>
    <div v-else-if="productError" class="rounded-md bg-red-50 p-4 text-red-700">
      {{ productError?.message || 'An error occurred' }}
    </div>
    <div v-else-if="product" class="grid gap-8 md:grid-cols-2">
      <div class="mx-auto w-full max-w-md aspect-square overflow-hidden rounded-lg">
        <img :src="product.imageUrl" :alt="product.name" class="h-full w-full object-contain" />
      </div>
      <div>
        <h1 class="mb-4 text-3xl font-bold">{{ product.name }}</h1>
        <p class="mb-6 text-2xl font-bold text-blue-600">${{ product.price.toFixed(2) }}</p>
        <div class="mb-6">
          <h2 class="mb-2 text-xl font-semibold">Description</h2>
          <p class="text-gray-600" v-html="safeDescription" />
        </div>
        <Cart :productId="product.id" />
      </div>
    </div>
    <div v-else class="text-center text-gray-500">Product not found.</div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import DOMPurify from 'dompurify'

import Cart from '@/components/ProductCart.vue'
import { useProduct } from '../composables/useQueries'

const route = useRoute()

const productId = computed(() => {
  const id = route.params.id
  return id ? parseInt(id as string) : undefined
})

const safeDescription = computed(() => {
  return DOMPurify.sanitize(product.value?.description || '')
})

const { data: product, isLoading: isProductLoading, error: productError } = useProduct(productId)
</script>
