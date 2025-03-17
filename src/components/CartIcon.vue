<template>
  <router-link
    to="/cart"
    class="relative inline-flex items-center p-2 text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
    aria-label="Shopping cart"
  >
    <ShoppingCart class="h-6 w-6" aria-hidden="true" />
    <span
      v-if="cartStore.totalItems > 0"
      class="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white"
      aria-label="Cart items count"
    >
      {{ cartStore.totalItems }}
    </span>
  </router-link>
</template>

<script setup lang="ts">
import { ShoppingCart } from 'lucide-vue-next'
import { useCartStore } from '../stores/cart'

const cartStore = useCartStore()
</script>
