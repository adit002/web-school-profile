<script setup>
import { ref, reactive, computed } from 'vue'
import PaginationField from '@/components/common/PaginationField.vue'

const contents = ref([
  {
    image: 'https://wpvip.edutopia.org/wp-content/uploads/2022/10/shutterstock_1958383675-crop.jpg',
    title: 'Kegiatan Pramuka',
    date: '2025-05-20',
    description: 'Siswa mengikuti kegiatan pramuka di lingkungan sekolah setiap hari Jumat sore.',
  },
  {
    image: 'https://wpvip.edutopia.org/wp-content/uploads/2022/10/shutterstock_1958383675-crop.jpg',
    title: 'Lomba Sains',
    date: '2025-05-15',
    description: 'SMP Alhilal meraih juara 1 dalam lomba sains tingkat kabupaten.',
  },
  {
    image: 'https://wpvip.edutopia.org/wp-content/uploads/2022/10/shutterstock_1958383675-crop.jpg',
    title: 'Kunjungan Industri',
    date: '2025-04-30',
    description: 'Siswa kelas 9 melakukan kunjungan edukatif ke perusahaan teknologi lokal.',
  },
  {
    image: 'https://wpvip.edutopia.org/wp-content/uploads/2022/10/shutterstock_1958383675-crop.jpg',
    title: 'Pelatihan Digital',
    date: '2025-04-10',
    description: 'Guru mengikuti pelatihan transformasi digital selama dua hari.',
  },
])
const pagination = reactive({
  currentPage: 1,
  showPage: 10,
})
function formatDate(dateStr) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' }
  return new Date(dateStr).toLocaleDateString('id-ID', options)
}
const paginatedContents = computed(() => {
  const start = (pagination.currentPage - 1) * pagination.showPage
  const end = start + pagination.showPage
  return contents.value.slice(start, end)
})
function updatePagination(field, value) {
  pagination[field] = value
}
</script>

<template>
  <div class="bg-white p-5 min-h-svh">
    <section class="max-w-5xl mx-auto px-4 py-10">
      <h2 class="text-2xl font-bold text-foreground mb-4">Berita/Agenda</h2>
      <p class="text-gray-700 leading-relaxed">
        Berisi berita terkini dan juga agenda-agenda yang akan di laksanakan di sekolah
      </p>
      <div class="py-8">
        <div class="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          <div
            v-for="(item, index) in paginatedContents"
            :key="index"
            class="bg-white rounded shadow hover:shadow-md transition p-4 flex flex-col"
          >
            <img
              :src="item.image"
              :alt="item.title"
              class="w-full h-40 object-cover rounded mb-4"
            />
            <h3 class="font-semibold text-lg text-gray-900 mb-1">{{ item.title }}</h3>
            <p class="text-sm text-gray-500 mb-2">{{ formatDate(item.date) }}</p>
            <p class="text-gray-700 text-sm flex-grow">{{ item.description }}</p>
          </div>
        </div>
      </div>
      <PaginationField
        v-if="contents.length"
        :totalItems="contents.length"
        :itemsPerPage="pagination.showPage"
        :currentPage="pagination.currentPage"
        :showPage="pagination.showPage"
        @update:currentPage="updatePagination('currentPage', $event)"
        @update:showPage="updatePagination('showPage', $event)"
      />
    </section>
  </div>
</template>
