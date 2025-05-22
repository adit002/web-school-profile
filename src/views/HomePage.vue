<script setup>
import { ref, onMounted } from 'vue'
import InputField from '@/components/common/InputField.vue'
import ButtonField from '@/components/common/ButtonField.vue'
import ToastMessage from '@/components/common/ToastMessage.vue'
import FileUploader from '@/components/common/FileUploader.vue'
import TextareaField from '@/components/common/TextareaField.vue'
import { useAuthStore } from '@/store/authStore'

const authStore = useAuthStore()
const toastRef = ref(null)
const typeToast = ref()
const fileUploader = ref(null)
const fullBase64Image = ref()
const form = ref({
  image: '',
  about: '',
  history: '',
  structure: '',
  visi: '',
  id: '',
})
const formErrors = ref({
  image: '',
  about: '',
  history: '',
  structure: '',
  visi: '',
})
async function fetchProfileList() {
  await authStore.profileListData()
  if (authStore.profile.length) {
    const { id, about, image, history, structure, visi } = authStore.profile[0]
    Object.assign(form.value, { id, about, image, history, structure, visi })
    const mimeType = 'image/jpeg'
    fullBase64Image.value = `data:${mimeType};base64,${authStore.profile[0].image}`
  }
}
async function submitForm() {
  form.value.image = fileUploader.value.files.length ? fileUploader.value.files[0].base64 : ''
  await authStore[!form.value.id ? 'profileAddData' : 'profileEditData'](form.value)
  typeToast.value = authStore.message.includes('Success') ? 'success' : 'error'
  toastRef.value.addToast(authStore.message)
  fetchProfileList()
}

onMounted(() => {
  fetchProfileList()
})
</script>

<template>
  <div class="bg-white p-5">
    <h6 class="font-semibold text-xl">Profile Sekolah</h6>
    <form @submit.prevent="submitForm">
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 mt-10">
        <InputField
          v-model="form.about"
          id="about"
          placeholder="Tentang Kami"
          label="Tentang Kami"
          :error="formErrors.about"
          @update:error="formErrors.about = $event"
        >
        </InputField>
        <InputField
          v-model="form.history"
          id="history"
          placeholder="Sejarah Singkat"
          label="Sejarah Singkat"
          :error="formErrors.history"
          @update:error="formErrors.history = $event"
        >
        </InputField>
        <InputField
          v-model="form.structure"
          id="structure"
          placeholder="Structur Organisasi"
          label="Structur Organisasi"
          :error="formErrors.structure"
          @update:error="formErrors.structure = $event"
        >
        </InputField>
      </div>
      <div class="mt-4">
        <TextareaField
          v-model="form.visi"
          label="Visi & Misi"
          placeholder="Visi & Misi"
          :maxlength="200"
        />
        <FileUploader
          ref="fileUploader"
          label="Foto Profile"
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
    <ToastMessage ref="toastRef" :type="typeToast" />
  </div>
</template>
