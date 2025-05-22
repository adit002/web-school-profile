<script setup>
import { RouterLink } from 'vue-router'
</script>
<template>
  <div class="flex flex-col items-center justify-center h-screen text-center bg-gray-100">
    <h1 class="text-8xl font-bold text-red-500">404</h1>
    <p class="text-lg text-gray-600 mt-4">Oops! The page you are looking for does not exist.</p>
    <RouterLink to="/" class="mt-6 px-6 py-2 bg-foreground text-white rounded-lg transition">
      Go Home
    </RouterLink>
  </div>
</template>
