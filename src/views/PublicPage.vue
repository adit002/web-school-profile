<script setup>
import ButtonField from '@/components/common/ButtonField.vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store/authStore'
import { ref, onMounted } from 'vue'

const authStore = useAuthStore()
const fullBase64Image = ref()

async function fetchProfileList() {
  await authStore.profileListData()
  if (authStore.profile.length) {
    const mimeType = 'image/jpeg'
    fullBase64Image.value = `data:${mimeType};base64,${authStore.profile[0].image}`
  }
}
const router = useRouter()
onMounted(() => {
  fetchProfileList()
})
</script>
<template>
  <div class="bg-white text-gray-800">
    <!-- Header -->
    <header class="text-center py-10">
      <h1 class="text-4xl font-bold text-foreground">Profil Sekolah</h1>
    </header>

    <!-- School Image -->
    <div class="max-w-5xl mx-auto px-4">
      <img
        v-if="fullBase64Image"
        :src="fullBase64Image"
        alt="Gedung Sekolah"
        class="rounded-lg w-full object-cover shadow"
      />
    </div>

    <!-- About Section -->
    <section class="max-w-5xl mx-auto px-4 py-10">
      <h2 class="text-2xl font-bold text-foreground mb-4">Tentang Kami</h2>
      <p class="text-gray-700 leading-relaxed">
        {{ authStore.profile.length ? authStore.profile[0].about : '' }}
      </p>
    </section>

    <!-- Vision & Mission + History -->
    <section class="max-w-5xl mx-auto px-4 py-10 grid md:grid-cols-2 gap-8">
      <div>
        <h3 class="text-xl font-semibold text-foreground mb-2">Visi & Misi</h3>
        <ul class="list-disc list-inside text-gray-700 space-y-1" v-if="authStore.profile.length">
          <div v-for="(item, index) in authStore.profile[0].visi.split('.')" :key="index">
            <li v-if="item">
              {{ item }}
            </li>
          </div>
        </ul>
      </div>
      <div>
        <h3 class="text-xl font-semibold text-foreground mb-2">Sejarah Singkat</h3>
        <p class="text-gray-700 leading-relaxed">
          {{ authStore.profile.length ? authStore.profile[0].history : '' }}
        </p>
      </div>
    </section>

    <!-- Organization + Facilities -->
    <section class="max-w-5xl mx-auto px-4 py-10 grid md:grid-cols-2 gap-8">
      <div>
        <h3 class="text-xl font-semibold text-foreground mb-2">Struktur Organisasi</h3>
        <p class="text-gray-700 leading-relaxed">
          {{ authStore.profile.length ? authStore.profile[0].structure : '' }}
        </p>
      </div>
      <div>
        <h3 class="text-xl font-semibold text-foreground mb-4">Fasilitas Sekolah</h3>
        <div class="flex flex-wrap gap-6">
          <div class="flex items-center space-x-2">
            <span class="text-2xl">📚</span>
            <span>Perpustakaan</span>
          </div>
          <div class="flex items-center space-x-2">
            <span class="text-2xl">🧪</span>
            <span>Laboratorium</span>
          </div>
          <div class="flex items-center space-x-2">
            <span class="text-2xl">💻</span>
            <span>Ruang Komputer</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Registration CTA -->
    <section class="bg-blue-50 py-12 px-4">
      <div class="max-w-3xl mx-auto text-center">
        <h3 class="text-2xl font-bold mb-4 text-foreground">Pendaftaran Siswa Baru</h3>
        <p class="text-gray-700 mb-6">
          Bergabunglah bersama kami di SMP Alhilal Kamal dan raih masa depan gemilang bersama
          pendidikan Islami berkualitas.
        </p>
        <ButtonField @click="router.push({ name: 'Public/Register' })" color="blue-shadow">
          Daftar Sekarang
        </ButtonField>
      </div>
    </section>
  </div>
</template>
