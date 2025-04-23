<script setup lang="ts">
import NavbarField from '@/components/layout/NavbarField.vue'

const navLinks = [
  { name: 'Home', to: '/' },
  { name: 'About', to: '/about' },
  { name: 'Contact', to: '/contact' },
]
</script>

<template>
  <div>
    <NavbarField brand="SMP ALHILAL KAMAL" :links="navLinks" />
    <main class="min-h-screen">
      <RouterView />
    </main>
  </div>
</template>
