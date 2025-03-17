<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import CartIcon from './components/CartIcon.vue'
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <header class="sticky top-0 z-10 border-b border-gray-200 bg-white shadow-sm">
      <nav class="container mx-auto flex items-center justify-between px-4 py-4">
        <router-link to="/" class="text-xl font-bold text-blue-600 hover:text-blue-700">
          Ecwid Store
        </router-link>
        <CartIcon />
      </nav>
    </header>

    <main>
      <RouterView />
    </main>
  </div>
</template>
