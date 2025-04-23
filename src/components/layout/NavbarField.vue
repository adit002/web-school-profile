<template>
  <nav class="bg-white shadow px-4 py-3 flex justify-between items-center">
    <div class="text-xl font-bold text-blue-600">
      {{ brand }}
    </div>

    <div class="space-x-4 hidden md:flex">
      <RouterLink
        v-for="link in links"
        :key="link.name"
        :to="link.to"
        class="text-gray-700 hover:text-blue-600 transition"
        active-class="font-semibold text-blue-600"
      >
        {{ link.name }}
      </RouterLink>
    </div>

    <div>
      <slot />
    </div>
  </nav>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'

interface NavLink {
  name: string
  to: string
}

defineProps<{
  brand: string
  links: NavLink[]
}>()
</script>
