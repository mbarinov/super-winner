<template>
  <div
    class="max-w-sm w-full mx-auto bg-white rounded-lg shadow-md overflow-hidden transition hover:shadow-lg"
  >
    <router-link :to="`/product/${product.id}`" class="block">
      <div class="relative aspect-[1/1.5] overflow-hidden">
        <img
          :src="product.imageUrl"
          :alt="product.name"
          class="absolute inset-0 w-full h-full object-cover transform transition duration-300 hover:scale-105"
        />
      </div>
      <div class="p-4">
        <h2 class="text-xl font-semibold text-gray-800">{{ product.name }}</h2>
        <p class="mt-2 text-lg font-bold text-green-600">${{ product.price.toFixed(2) }}</p>
      </div>
    </router-link>
    <div class="p-4 border-t border-gray-200">
      <Cart :productId="product.id" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Cart from './Cart.vue'
import type { Product } from '../services/ecwidApi'

const props = defineProps<{
  product: Product
}>()

const product = computed(() => props.product)
</script>
