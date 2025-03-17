<template>
  <div class="container mx-auto px-4 py-8">
    <div v-if="categoryQuery.isLoading.value" class="flex items-center justify-center space-x-2">
      <div
        class="h-4 w-4 animate-spin rounded-full border-2 border-blue-500 border-t-transparent"
      ></div>
      <span>Loading category...</span>
    </div>
    <div v-else-if="categoryQuery.data" class="mb-8">
      <h1 class="mb-4 text-3xl font-bold">{{ categoryQuery.data.value?.category.name }}</h1>
      <p class="text-gray-600">{{ categoryQuery.data.value?.category.description }}</p>
    </div>

    <div
      v-if="categoryQuery.data.value?.products && categoryQuery.data.value?.products.length > 0"
      class="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
    >
      <ProductCard
        v-for="product in categoryQuery.data.value?.products"
        :key="product.id"
        :product="product"
      />
    </div>
    <div v-else-if="!categoryQuery.isLoading" class="text-center text-gray-500">
      No products found in this category.
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useCategory } from '../composables/useQueries'
import ProductCard from '../components/ProductCard.vue'

const route = useRoute()
const categoryId = computed(() => {
  const id = route.params.id
  return id ? parseInt(id as string) : undefined
})

const categoryQuery = useCategory(categoryId)
</script>
