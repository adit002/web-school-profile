<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const isMenuOpen = ref(false)
const router = useRouter()

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}
</script>

<template>
  <main>
    <nav class="bg-foreground border-b shadow-md sticky top-0 z-50">
      <div class="max-w-6xl mx-auto px-4">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center space-x-2">
            <span
              class="text-xl font-bold text-white cursor-pointer"
              @click="router.push({ name: 'Public' })"
              >SMP ALHILAAL KAMAL</span
            >
          </div>
          <div class="hidden md:flex space-x-6 text-white cursor-pointer">
            <a @click="router.push({ name: 'Public' })" class="font-medium">Beranda</a>
            <a @click="router.push({ name: 'Public/Register' })" class="font-medium">Pendaftaran</a>
            <a @click="router.push({ name: 'Public/News' })" class="font-medium">Berita/Agenda</a>
          </div>
          <div class="md:hidden">
            <button @click="toggleMenu()" class="text-white focus:outline-none">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
      <div v-show="isMenuOpen" class="md:hidden px-4 pb-4 text-white cursor-pointer">
        <a @click="(router.push({ name: 'Public' }), (isMenuOpen = !isMenuOpen))" class="block py-2"
          >Beranda</a
        >
        <a
          @click="(router.push({ name: 'Public/Register' }), (isMenuOpen = !isMenuOpen))"
          class="block py-2"
          >Pendaftaran</a
        >
        <a
          @click="(router.push({ name: 'Public/News' }), (isMenuOpen = !isMenuOpen))"
          class="block py-2"
          >Berita/Agenda</a
        >
      </div>
    </nav>
    <router-view></router-view>
    <footer class="bg-foreground text-white text-center py-6">
      &copy; 2025 AwesomeTech Solutions. All rights reserved.
    </footer>
  </main>
</template>
