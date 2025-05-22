<script setup>
import TableField from '@/components/common/TableField.vue'
import InputField from '@/components/common/InputField.vue'
import ToastMessage from '@/components/common/ToastMessage.vue'
import ButtonField from '@/components/common/ButtonField.vue'
import ModalField from '@/components/common/ModalField.vue'
import DatepickerRange from '@/components/common/DatepickerRange.vue'
import FileUploader from '@/components/common/FileUploader.vue'
import { ref, onMounted, reactive } from 'vue'
import PaginationField from '@/components/common/PaginationField.vue'
import { useAuthStore } from '@/store/authStore'

const authStore = useAuthStore()
const tableData = ref([])
const toastRef = ref(null)
const typeToast = ref()
const isModalOpen = ref(false)
const titleModal = ref()
const fileUploader = ref()
const fullBase64Image = ref()
const pagination = reactive({
  currentPage: 1,
  showPage: 10,
})
const form = ref({
  title: '',
  date: '',
  description: '',
  image: '',
  id: '',
})
const formErrors = ref({
  title: '',
  date: '',
  description: '',
  image: '',
  id: '',
})

const columns = [
  { label: 'No', key: 'no' },
  { label: 'title', key: 'title' },
  { label: 'description', key: 'description' },
  { label: 'date', key: 'date' },
]

async function fetchNewsList() {
  await authStore.newsListData()
  if (authStore.message) {
    typeToast.value = 'error'
    toastRef.value.addToast(authStore.message)
  }
  tableData.value = authStore.news
  const start = (pagination.currentPage - 1) * pagination.showPage
  const end = start + pagination.showPage
  return tableData.value.slice(start, end)
}
function updatePagination(field, value) {
  pagination[field] = value
}
const clickAction = async (from, data = '') => {
  const toggleModal = (title) => {
    isModalOpen.value = !isModalOpen.value
    titleModal.value = title
  }
  const resetForm = () => {
    Object.keys(form.value).forEach((key) => (form.value[key] = ''))
    fullBase64Image.value.clearFiles()
  }
  const mimeType = 'image/jpeg'
  switch (from) {
    case 'detail':
      toggleModal('Edit Berita/Agenda')
      Object.assign(form.value, data)
      fullBase64Image.value = `data:${mimeType};base64,${data.image}`
      break
    case 'add':
      toggleModal('Add New Berita/Agenda')
      resetForm()
      break
    default:
  }
}
async function submitForm() {
  //   formErrors.value.title = form.value.title ? '' : 'Judul wajib diisi'
  //   formErrors.value.description = form.value.description ? '' : 'Deskripsi wajib diisi'
  //   formErrors.value.date = form.value.date ? '' : 'Tanggal wajib diisi'
  //   formErrors.value.image = form.value.image ? '' : 'Foto wajib diisi'
  //   const isValid = Object.values(formErrors.value).every((error) => error === '')
  //   if (isValid) {
  form.value.image = fileUploader.value.files.length ? fileUploader.value.files[0].base64 : ''
  await authStore[titleModal.value.includes('Add') ? 'newsAddData' : 'newsAEditData'](form.value)
  typeToast.value = authStore.message.includes('Success') ? 'success' : 'error'
  toastRef.value.addToast(authStore.message)
  if (authStore.message.includes('Success')) {
    resetForm()
    isModalOpen.value = false
    fetchNewsList()
  }
  //   }
}
function resetForm() {
  Object.keys(form.value).forEach((key) => (form.value[key] = ''))
  fileUploader.value.clearFiles()
}
onMounted(() => {
  fetchNewsList()
})
</script>

<template>
  <div class="bg-white p-5">
    <h6 class="font-semibold text-xl">Berita/Agenda</h6>
    <div class="flex justify-end">
      <ButtonField class="flex items-center" type="button" color="blue" @click="clickAction('add')">
        <svg
          width="18"
          height="18"
          viewBox="0 0 18 18"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          class="mr-2"
        >
          <path
            opacity="0.5"
            d="M16.5 9C16.5 13.1422 13.1422 16.5 9 16.5C4.85775 16.5 1.5 13.1422 1.5 9C1.5 4.85775 4.85775 1.5 9 1.5C13.1422 1.5 16.5 4.85775 16.5 9Z"
            fill="#F8F9FA"
          />
          <path
            d="M9.5625 6.75C9.5625 6.60082 9.50324 6.45774 9.39775 6.35225C9.29226 6.24676 9.14918 6.1875 9 6.1875C8.85082 6.1875 8.70774 6.24676 8.60225 6.35225C8.49676 6.45774 8.4375 6.60082 8.4375 6.75V8.4375H6.75C6.60082 8.4375 6.45774 8.49676 6.35225 8.60225C6.24676 8.70774 6.1875 8.85082 6.1875 9C6.1875 9.14918 6.24676 9.29226 6.35225 9.39775C6.45774 9.50324 6.60082 9.5625 6.75 9.5625H8.4375V11.25C8.4375 11.3992 8.49676 11.5423 8.60225 11.6477C8.70774 11.7532 8.85082 11.8125 9 11.8125C9.14918 11.8125 9.29226 11.7532 9.39775 11.6477C9.50324 11.5423 9.5625 11.3992 9.5625 11.25V9.5625H11.25C11.3992 9.5625 11.5423 9.50324 11.6477 9.39775C11.7532 9.29226 11.8125 9.14918 11.8125 9C11.8125 8.85082 11.7532 8.70774 11.6477 8.60225C11.5423 8.49676 11.3992 8.4375 11.25 8.4375H9.5625V6.75Z"
            fill="#F8F9FA"
          />
        </svg>
        Berita/Agenda
      </ButtonField>
    </div>
    <div class="my-4">
      <TableField
        :data="tableData"
        :columns="columns"
        :showIndex="true"
        :showPagination="false"
        :actionInrow="['detail']"
        @update:btnDetail="clickAction('detail', $event)"
      >
      </TableField>
    </div>
    <div class="flex justify-end">
      <PaginationField
        v-if="tableData.length"
        :totalItems="tableData.length"
        :itemsPerPage="pagination.showPage"
        :currentPage="pagination.currentPage"
        :showPage="pagination.showPage"
        @update:currentPage="updatePagination('currentPage', $event)"
        @update:showPage="updatePagination('showPage', $event)"
      />
    </div>
    <ModalField :isOpen="isModalOpen" :title="titleModal" @update:isOpen="isModalOpen = $event">
      <template #body>
        <form @submit.prevent="submitForm">
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 mt-10">
            <InputField
              v-model="form.title"
              id="title"
              placeholder="Judul"
              label="Judul"
              :error="formErrors.title"
              @update:error="formErrors.title = $event"
            >
            </InputField>
            <InputField
              v-model="form.description"
              id="description"
              placeholder="Deskripsi"
              label="Deskripsi"
              :error="formErrors.description"
              @update:error="formErrors.description = $event"
            >
            </InputField>
            <DatepickerRange v-model="form.date" placeholder="Tanggal" label="Tanggal" />
          </div>
          <div class="mt-4">
            <FileUploader
              ref="fileUploader"
              label="Foto"
              :allowedTypes="['image/png', 'image/jpeg']"
              class="mb-4"
            />
            <img
              v-if="fullBase64Image"
              :src="fullBase64Image"
              alt="Preview"
              class="mt-4 w-64 h-auto rounded shadow"
            />
          </div>
          <div class="mt-4 flex space-x-2 border-t pt-3 place-self-center">
            <ButtonField class="w-60 font-semibold text-center" type="submit" color="blue-shadow">
              Simpan
            </ButtonField>
          </div>
        </form>
      </template>
    </ModalField>
    <ToastMessage ref="toastRef" :type="typeToast" />
  </div>
</template>
