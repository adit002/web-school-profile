<script setup>
import { ref, reactive, onMounted } from 'vue'
import PaginationField from '@/components/common/PaginationField.vue'
import { useAuthStore } from '@/store/authStore'
import ToastMessage from '@/components/common/ToastMessage.vue'

const toastRef = ref(null)
const typeToast = ref()
const authStore = useAuthStore()
const newsData = ref([])
const pagination = reactive({
  currentPage: 1,
  showPage: 10,
})
function formatDate(dateStr) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' }
  return new Date(dateStr).toLocaleDateString('id-ID', options)
}
function updatePagination(field, value) {
  pagination[field] = value
}
async function fetchNewsList() {
  await authStore.newsListData()
  if (authStore.message) {
    typeToast.value = 'error'
    toastRef.value.addToast(authStore.message)
  }
  const mimeType = 'image/jpeg'
  authStore.news.forEach((element) => {
    element.image = `data:${mimeType};base64,${element.image}`
  })
  newsData.value = authStore.news
  const start = (pagination.currentPage - 1) * pagination.showPage
  const end = start + pagination.showPage
  return newsData.value.slice(start, end)
}
onMounted(() => {
  fetchNewsList()
})
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
            v-for="(item, index) in newsData"
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
        v-if="newsData.length"
        :totalItems="newsData.length"
        :itemsPerPage="pagination.showPage"
        :currentPage="pagination.currentPage"
        :showPage="pagination.showPage"
        @update:currentPage="updatePagination('currentPage', $event)"
        @update:showPage="updatePagination('showPage', $event)"
      />
    </section>
    <ToastMessage ref="toastRef" :type="typeToast" />
  </div>
</template>
