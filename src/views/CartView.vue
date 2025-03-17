<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="mb-8 text-3xl font-bold">Shopping Cart</h1>

    <div v-if="cartStore.items.length > 0">
      <TransitionGroup name="list" tag="div" class="mb-8 space-y-4" appear>
        <div
          v-for="item in cartStore.items"
          :key="item.id"
          class="flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
        >
          <img :src="item.imageUrl" :alt="item.name" class="h-24 w-24 rounded-lg object-cover" />
          <div class="flex-1">
            <h3 class="text-lg font-semibold">{{ item.name }}</h3>
            <p class="text-blue-600">${{ item.price.toFixed(2) }}</p>
            <div class="mt-2 flex items-center gap-2">
              <Cart :productId="item.id" />
            </div>
          </div>
        </div>
      </TransitionGroup>

      <div class="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <div class="mb-4 flex justify-between text-lg">
          <span>Total:</span>
          <span class="font-bold">${{ cartStore.totalPrice.toFixed(2) }}</span>
        </div>
        <button
          @click="placeOrder"
          class="w-full rounded-lg bg-blue-600 py-3 text-lg font-semibold text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          :disabled="isPlacingOrder"
        >
          <span v-if="!isPlacingOrder">Place Order</span>
          <span v-else class="flex items-center justify-center gap-2">
            <div v-if="isProcessing" class="flex items-center justify-center">
              <Loader2 class="h-5 w-5 animate-spin text-gray-400" />
            </div>
            Processing...
          </span>
        </button>
      </div>
    </div>

    <div v-else class="text-center">
      <p class="mb-4 text-gray-500">Your cart is empty</p>
      <router-link
        to="/"
        class="inline-block rounded-lg bg-blue-600 px-6 py-3 text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Continue Shopping
      </router-link>
    </div>

    <Transition name="fade">
      <div
        v-if="orderPlaced"
        class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
      >
        <div class="rounded-lg bg-white p-8 text-center shadow-xl">
          <h2 class="mb-4 text-2xl font-bold text-green-600">Order Placed!</h2>
          <p class="mb-4">Thank you for your purchase.</p>
          <button
            @click="closeOrderConfirmation"
            class="rounded-lg bg-blue-600 px-6 py-2 text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Close
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Loader2 } from 'lucide-vue-next'
import Cart from '@/components/Cart.vue'
import { useCartStore } from '@/stores/cart'

const cartStore = useCartStore()
const orderPlaced = ref(false)
const isPlacingOrder = ref(false)
const isProcessing = ref(false)

const placeOrder = async () => {
  if (isPlacingOrder.value) return

  isPlacingOrder.value = true
  try {
    isProcessing.value = true
    await new Promise((resolve) => setTimeout(resolve, 1500))
    orderPlaced.value = true
    cartStore.clearCart()
  } finally {
    isPlacingOrder.value = false
    isProcessing.value = false
  }
}

const closeOrderConfirmation = () => {
  orderPlaced.value = false
}
</script>

<style scoped>
.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
