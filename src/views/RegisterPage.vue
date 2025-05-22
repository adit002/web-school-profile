<script setup>
import TableField from '@/components/common/TableField.vue'
import InputField from '@/components/common/InputField.vue'
import ToastMessage from '@/components/common/ToastMessage.vue'
import ButtonField from '@/components/common/ButtonField.vue'
import SelectField from '@/components/common/SelectField.vue'
import ModalField from '@/components/common/ModalField.vue'
import DatepickerRange from '@/components/common/DatepickerRange.vue'
import FileUploader from '@/components/common/FileUploader.vue'
import { ref, onMounted, reactive } from 'vue'
import { useAuthStore } from '@/store/authStore'
import PaginationField from '@/components/common/PaginationField.vue'

const authStore = useAuthStore()
const tableData = ref([])
const toastRef = ref(null)
const typeToast = ref()
const isModalOpen = ref(false)
const titleModal = ref()
const fullBase64ImageAkte = ref()
const fullBase64ImageIjazah = ref()
const fullBase64ImageSKHUN = ref()
const fileUploaderAkte = ref(null)
const fileUploaderIjazah = ref(null)
const fileUploaderSkhun = ref(null)
const pagination = reactive({
  currentPage: 1,
  showPage: 10,
})
const form = ref({
  name: '',
  gender: '',
  place_of_birth: '',
  date_of_birth: '',
  address: '',
  parent_name: '',
  email: '',
  phone: '',
  image_akte: '',
  image_ijazah: '',
  image_skhun: '',
  id: '',
})
const formErrors = ref({
  name: '',
  gender: '',
  place_of_birth: '',
  date_of_birth: '',
  address: '',
  parent_name: '',
  email: '',
  phone: '',
  image_akte: '',
  image_ijazah: '',
  image_skhun: '',
})
const dropdownOptions = ref({
  gender: [
    { id: 'Laki-Laki', value: 'Laki-Laki', name: 'Laki-Laki' },
    { id: 'Perempuan', value: 'Perempuan', name: 'Perempuan' },
  ],
})
const columns = [
  { label: 'No', key: 'no' },
  { label: 'Nama Lengkap', key: 'name' },
  { label: 'Jenis Kelamin', key: 'gender' },
  { label: 'Tempat Lahir', key: 'place_of_birth' },
  { label: 'Tanggal Lahir', key: 'date_of_birth' },
]
async function fetchRegisterList() {
  await authStore.registerListData()
  if (authStore.message) {
    typeToast.value = 'error'
    toastRef.value.addToast(authStore.message)
  }
  tableData.value = authStore.register
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
  const mimeType = 'image/jpeg'
  switch (from) {
    case 'detail':
      toggleModal('Edit Register')
      Object.assign(form.value, data)
      fullBase64ImageAkte.value = `data:${mimeType};base64,${data.image_akte}`
      fullBase64ImageIjazah.value = `data:${mimeType};base64,${data.image_ijazah}`
      fullBase64ImageSKHUN.value = `data:${mimeType};base64,${data.image_skhun}`
      break
    default:
  }
}
async function submitForm() {
  formErrors.value.name = form.value.name ? '' : 'Nama lengkap wajib diisi'
  formErrors.value.gender = form.value.gender ? '' : 'Jenis kelamin wajib diisi'
  formErrors.value.place_of_birth = form.value.place_of_birth ? '' : 'Tempat lahir wajib diisi'
  formErrors.value.date_of_birth = form.value.date_of_birth ? '' : 'Tanggal lahir wajib diisi'
  formErrors.value.address = form.value.address ? '' : 'Alamat wajib diisi'
  formErrors.value.parent_name = form.value.parent_name ? '' : 'Nama orang tua/wali wajib diisi'
  formErrors.value.phone = form.value.phone ? '' : 'Nomor HP wajib diisi'
  formErrors.value.image_akte = form.value.image_akte ? '' : 'Foto akte wajib diisi'
  formErrors.value.image_ijazah = form.value.image_ijazah ? '' : 'Foto ijazah wajib diisi'
  formErrors.value.image_skhun = form.value.image_skhun ? '' : 'Foto SKHUN wajib diisi'
  const isValid = Object.values(formErrors.value).every((error) => error === '')
  if (isValid) {
    await authStore.registerEditData(form.value)
    typeToast.value = authStore.message.includes('Success') ? 'success' : 'error'
    toastRef.value.addToast(authStore.message)
    if (authStore.message.includes('Success')) {
      resetForm()
      isModalOpen.value = false
      fetchRegisterList()
    }
  }
}
function resetForm() {
  Object.keys(form.value).forEach((key) => (form.value[key] = ''))
  fileUploaderAkte.value.clearFiles()
  fileUploaderIjazah.value.clearFiles()
  fileUploaderSkhun.value.clearFiles()
}
onMounted(() => {
  fetchRegisterList()
})
</script>

<template>
  <div class="bg-white p-5">
    <h6 class="font-semibold text-xl">Pendaftaran Siswa</h6>
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
              v-model="form.name"
              id="name"
              placeholder="Nama Lengkap"
              label="Nama Lengkap"
              :error="formErrors.name"
              @update:error="formErrors.name = $event"
            >
            </InputField>
            <SelectField
              v-model="form.gender"
              :options="dropdownOptions.gender"
              placeholder="Jenis Kelamin"
              label="Jenis Kelamin"
              keyField="id"
              valueField="value"
              labelField="name"
              :error="formErrors.gender"
              @update:error="formErrors.gender = $event"
            />
            <InputField
              v-model="form.place_of_birth"
              id="place_of_birth"
              placeholder="Tempat Lahir"
              label="Tempat Lahir"
              :error="formErrors.place_of_birth"
              @update:error="formErrors.place_of_birth = $event"
            >
            </InputField>
            <DatepickerRange
              v-model="form.date_of_birth"
              placeholder="Tanggal Lahir"
              label="Tanggal Lahir"
            />
            <InputField
              v-model="form.address"
              id="address"
              placeholder="Alamat"
              label="Alamat"
              :error="formErrors.address"
              @update:error="formErrors.address = $event"
            >
            </InputField>
            <InputField
              v-model="form.parent_name"
              id="parent_name"
              placeholder="Nama Orang Tua/Wali"
              label="Nama Orang Tua/Wali"
              :error="formErrors.parent_name"
              @update:error="formErrors.parent_name = $event"
            >
            </InputField>
            <InputField
              v-model="form.email"
              id="email"
              placeholder="Email"
              label="Email"
              :error="formErrors.email"
              @update:error="formErrors.email = $event"
            >
            </InputField>
            <InputField
              v-model="form.phone"
              id="phone"
              placeholder="Nomor HP"
              label="Nomor HP"
              :error="formErrors.phone"
              @update:error="formErrors.phone = $event"
            >
            </InputField>
          </div>
          <div class="mt-4">
            <FileUploader
              ref="fileUploaderAkte"
              label="Foto Akte"
              :allowedTypes="['image/png', 'image/jpeg']"
              class="mb-4"
            />
            <img
              v-if="fullBase64ImageAkte"
              :src="fullBase64ImageAkte"
              alt="Preview"
              class="mt-4 w-64 h-auto rounded shadow"
            />
            <FileUploader
              ref="fileUploaderIjazah"
              label="Foto Ijazah"
              :allowedTypes="['image/png', 'image/jpeg']"
              class="mb-4"
            />
            <img
              v-if="fullBase64ImageIjazah"
              :src="fullBase64ImageIjazah"
              alt="Preview"
              class="mt-4 w-64 h-auto rounded shadow"
            />
            <FileUploader
              ref="fileUploaderSkhun"
              label="Foto SKHUN"
              :allowedTypes="['image/png', 'image/jpeg']"
            />
            <img
              v-if="fullBase64ImageSKHUN"
              :src="fullBase64ImageSKHUN"
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
