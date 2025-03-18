<template>
  <div>
    <div v-if="!inCart">
      <button
        @click="handleAddToCart"
        data-testid="add-to-cart"
        :disabled="isAdding"
        class="w-full inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white font-medium rounded hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
      >
        <template v-if="!isAdding"> <Plus class="h-5 w-5 mr-2" /> Add to Cart </template>
        <template v-else> <Loader2 class="h-5 w-5 animate-spin mr-2" /> Adding... </template>
      </button>
    </div>
    <div v-else class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
      <div class="flex items-center space-x-4">
        <button
          @click="decrement"
          data-testid="decrement-quantity"
          class="p-2 bg-gray-200 rounded-full cursor-pointer hover:bg-gray-300 focus:outline-none transition-colors duration-300 ease-in-out"
        >
          <Minus class="h-5 w-5" />
        </button>
        <span class="text-lg font-semibold" data-testid="quantity">{{ inCart.quantity }}</span>
        <button
          @click="increment"
          data-testid="increment-quantity"
          class="p-2 bg-gray-200 rounded-full cursor-pointer hover:bg-gray-300 focus:outline-none transition-colors duration-300 ease-in-out"
        >
          <Plus class="h-5 w-5" />
        </button>
      </div>
      <button
        @click="removeFromCart"
        data-testid="remove-product"
        class="flex items-center space-x-1 text-red-600 hover:text-red-800 focus:outline-none transition-colors duration-300 ease-in-out cursor-pointer"
      >
        <Trash class="h-5 w-5" />
        <span class="text-sm">Remove</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Plus, Minus, Loader2, Trash } from 'lucide-vue-next'
import { useCartStore } from '@/stores/cart'
import { useProduct } from '@/composables/useQueries'
const props = defineProps<{
  productId: number
}>()

const cartStore = useCartStore()
const productId = computed(() => props.productId)
const { data: product } = useProduct(productId)
const isAdding = ref(false)

const inCart = computed(() => {
  return cartStore.items.find((item) => item.id === props.productId)
})

const handleAddToCart = async () => {
  if (isAdding.value || !product.value) return

  isAdding.value = true
  cartStore.addItem({
    id: props.productId,
    name: product.value?.name,
    price: product.value?.price,
    imageUrl: product.value?.imageUrl,
  })
  isAdding.value = false
}

const increment = () => {
  if (inCart.value) {
    cartStore.updateQuantity(props.productId, inCart.value.quantity + 1)
  }
}

const decrement = () => {
  if (inCart.value && inCart.value.quantity > 1) {
    cartStore.updateQuantity(props.productId, inCart.value.quantity - 1)
  }
}

const removeFromCart = () => {
  cartStore.removeItem(props.productId)
}
</script>
