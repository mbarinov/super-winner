<template>
  <div class="container mx-auto px-4 py-8">
    <div v-if="isLoading" class="mb-12">
      <div class="flex items-center justify-center space-x-2">
        <div
          class="h-4 w-4 animate-spin rounded-full border-2 border-blue-500 border-t-transparent"
        ></div>
        <span>Loading categories...</span>
      </div>
    </div>
    <div v-else class="mb-4 flex flex-wrap gap-2">
      <router-link
        class="inline-block rounded-md bg-gray-100 py-1 px-4 hover:bg-gray-200"
        v-for="category in categories"
        :key="category.id"
        :to="`/category/${category.id}`"
        data-testid="category-link"
      >
        {{ category.name }}
      </router-link>
    </div>

    <h2 class="mb-8 text-3xl font-bold" data-testid="products-heading">All Products</h2>
    <div v-if="isLoading">
      <div class="flex items-center justify-center space-x-2">
        <div
          class="h-4 w-4 animate-spin rounded-full border-2 border-blue-500 border-t-transparent"
        ></div>
        <span>Loading products...</span>
      </div>
    </div>
    <div v-else-if="productsQuery.isError.value" class="rounded-md bg-red-50 p-4 text-red-700">
      {{ productsQuery.error instanceof Error ? productsQuery.error.message : 'An error occurred' }}
    </div>
    <div v-else-if="!products.length" class="text-center text-gray-500">No products found</div>
    <div
      v-else
      class="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3"
      data-testid="product-list"
    >
      <ProductCard v-for="product in products" :key="product.id" :product="product" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, unref } from 'vue'
import ProductCard from '../components/ProductCard.vue'
import { useCategories, useProducts } from '../composables/useQueries'
import type { Category, Product } from '../services/ecwidApi'

const categoriesQuery = useCategories()
const productsQuery = useProducts()

const categories = computed<Category[]>(() => unref(categoriesQuery.data.value) || [])
const products = computed<Product[]>(() => unref(productsQuery.data.value) || [])

const isLoading = computed(() => categoriesQuery.isFetching.value || productsQuery.isFetching.value)
</script>
