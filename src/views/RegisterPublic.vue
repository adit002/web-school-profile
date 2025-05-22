<script setup>
import InputField from '@/components/common/InputField.vue'
import ButtonField from '@/components/common/ButtonField.vue'
import ToastMessage from '@/components/common/ToastMessage.vue'
import SelectField from '@/components/common/SelectField.vue'
import DatepickerRange from '@/components/common/DatepickerRange.vue'
import FileUploader from '@/components/common/FileUploader.vue'

import { ref } from 'vue'
const toastRef = ref(null)
const typeToast = ref()
const fileUploaderAkte = ref(null)
const fileUploaderIjazah = ref(null)
const fileUploaderSkhun = ref(null)
const form = ref({
  name: '',
  gender: '',
  place_of_birth: '',
  date_of_birth: '',
  address: '',
  parent: '',
  email: '',
  phone: '',
  image_akte: '',
  image_ijazah: '',
  image_skhun: '',
})

const formErrors = ref({
  name: '',
  gender: '',
  place_of_birth: '',
  date_of_birth: '',
  address: '',
  parent: '',
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

function submitForm() {
  formErrors.value.name = form.value.name ? '' : 'Nama lengkap wajib diisi'
  formErrors.value.gender = form.value.gender ? '' : 'Jenis kelamin wajib diisi'
  formErrors.value.place_of_birth = form.value.place_of_birth ? '' : 'Tempat lahir wajib diisi'
  formErrors.value.date_of_birth = form.value.date_of_birth ? '' : 'Tanggal lahir wajib diisi'
  formErrors.value.address = form.value.address ? '' : 'Alamat wajib diisi'
  formErrors.value.parent = form.value.parent ? '' : 'Nama orang tua/wali wajib diisi'
  formErrors.value.phone = form.value.phone ? '' : 'Nomor HP wajib diisi'
  formErrors.value.image_akte = fileUploaderAkte.value.files.length ? '' : 'Foto akte wajib diisi'
  formErrors.value.image_ijazah = fileUploaderIjazah.value.files.length
    ? ''
    : 'Foto ijazah wajib diisi'
  formErrors.value.image_skhun = fileUploaderSkhun.value.files.length
    ? ''
    : 'Foto SKHUN wajib diisi'

  const isValid = Object.values(formErrors.value).every((error) => error === '')
  if (isValid) {
    console.log('Form is valid')
  } else {
    console.log('Form has errors')
  }
}
</script>

<template>
  <div class="bg-white p-5">
    <section class="max-w-5xl mx-auto px-4 py-10">
      <h2 class="text-2xl font-bold text-foreground mb-4">Pendaftaran Siswa Baru</h2>
      <p class="text-gray-700 leading-relaxed">
        Silahkan mengisi semua form dibawah ini untuk mendaftarkan diri anda
      </p>
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
            v-model="form.parent"
            id="parent"
            placeholder="Nama Orang Tua/Wali"
            label="Nama Orang Tua/Wali"
            :error="formErrors.parent"
            @update:error="formErrors.parent = $event"
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
            type="number"
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
          <FileUploader
            ref="fileUploaderIjazah"
            label="Foto Ijazah"
            :allowedTypes="['image/png', 'image/jpeg']"
            class="mb-4"
          />
          <FileUploader
            ref="fileUploaderSkhun"
            label="Foto SKHUN"
            :allowedTypes="['image/png', 'image/jpeg']"
          />
        </div>
        <div class="mt-4 flex space-x-2 border-t pt-3 place-self-center">
          <ButtonField class="w-60 font-semibold text-center" type="submit" color="blue-shadow">
            Daftar
          </ButtonField>
        </div>
      </form>
    </section>
    <ToastMessage ref="toastRef" :type="typeToast" />
  </div>
</template>
