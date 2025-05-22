<script setup>
import { ref } from 'vue'
import InputField from '@/components/common/InputField.vue'
import ButtonField from '@/components/common/ButtonField.vue'
import { useAuthStore } from '@/store/authStore'
import { useRouter } from 'vue-router'
import ToastMessage from '@/components/common/ToastMessage.vue'

const router = useRouter()
const authStore = useAuthStore()
const { loginUser } = authStore
const toastRef = ref(null)

const form = ref({
  username: '',
  password: '',
})

const formErrors = ref({
  username: '',
  password: '',
})

const submitForm = async () => {
  formErrors.value.username = form.value.username ? '' : 'Username is required'
  formErrors.value.password = form.value.password ? '' : 'Password is required'

  if (!formErrors.value.username && !formErrors.value.password) {
    await loginUser({ username: form.value.username, password: form.value.password })
    if (authStore.message) {
      toastRef.value.addToast(authStore.message)
    } else {
      router.push({ name: 'Beranda' })
    }
  }
}
</script>

<template>
  <div>
    <div class="z-10 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px]">
      <div class="place-items-center">
        <!-- <img :src="" alt="logo-triton" /> -->
      </div>
      <h3 class="text-2xl text-center mt-5">Selamat Datang di Applikasi</h3>
      <h3 class="text-2xl text-center font-semibold mt-3">CMS</h3>
      <form @submit.prevent="submitForm" class="!bg-transparent gap-3 grid mt-10">
        <InputField
          v-model="form.username"
          id="username"
          placeholder="username"
          :error="formErrors.username"
          @update:error="formErrors.username = $event"
          class="opacity-80 !h-12"
        >
          <template #icon>
            <svg
              width="17"
              height="17"
              viewBox="0 0 17 17"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g opacity="0.5" clip-path="url(#clip0_219_15371)">
                <path
                  d="M6.49996 10.7604C6.49996 10.9372 6.42972 11.1068 6.3047 11.2318C6.17967 11.3568 6.0101 11.4271 5.83329 11.4271C5.65648 11.4271 5.48691 11.3568 5.36189 11.2318C5.23686 11.1068 5.16663 10.9372 5.16663 10.7604C5.16663 10.5836 5.23686 10.414 5.36189 10.289C5.48691 10.164 5.65648 10.0938 5.83329 10.0938C6.0101 10.0938 6.17967 10.164 6.3047 10.289C6.42972 10.414 6.49996 10.5836 6.49996 10.7604ZM9.16663 10.7604C9.16663 10.9372 9.09639 11.1068 8.97136 11.2318C8.84634 11.3568 8.67677 11.4271 8.49996 11.4271C8.32315 11.4271 8.15358 11.3568 8.02855 11.2318C7.90353 11.1068 7.83329 10.9372 7.83329 10.7604C7.83329 10.5836 7.90353 10.414 8.02855 10.289C8.15358 10.164 8.32315 10.0938 8.49996 10.0938C8.67677 10.0938 8.84634 10.164 8.97136 10.289C9.09639 10.414 9.16663 10.5836 9.16663 10.7604ZM11.8333 10.7604C11.8333 10.9372 11.7631 11.1068 11.638 11.2318C11.513 11.3568 11.3434 11.4271 11.1666 11.4271C10.9898 11.4271 10.8202 11.3568 10.6952 11.2318C10.5702 11.1068 10.5 10.9372 10.5 10.7604C10.5 10.5836 10.5702 10.414 10.6952 10.289C10.8202 10.164 10.9898 10.0938 11.1666 10.0938C11.3434 10.0938 11.513 10.164 11.638 10.289C11.7631 10.414 11.8333 10.5836 11.8333 10.7604Z"
                  fill="#012A4A"
                />
                <path
                  d="M4.49998 6.7604V5.42707C4.49998 5.19996 4.51842 4.97774 4.55531 4.7604M12.5 6.7604V5.42707C12.5 4.61456 12.2526 3.82131 11.7907 3.15286C11.3288 2.48442 10.6743 1.97249 9.91431 1.68521C9.15429 1.39792 8.3248 1.34889 7.53623 1.54466C6.74766 1.74042 6.0374 2.17169 5.49998 2.78107M7.83331 14.7604H5.83331C3.94798 14.7604 3.00465 14.7604 2.41931 14.1744C1.83331 13.5891 1.83331 12.6457 1.83331 10.7604C1.83331 8.87507 1.83331 7.93174 2.41931 7.3464C3.00465 6.7604 3.94798 6.7604 5.83331 6.7604H11.1666C13.052 6.7604 13.9953 6.7604 14.5806 7.3464C15.1666 7.93174 15.1666 8.87507 15.1666 10.7604C15.1666 12.6457 15.1666 13.5891 14.5806 14.1744C13.9953 14.7604 13.052 14.7604 11.1666 14.7604H10.5"
                  stroke="#012A4A"
                  stroke-width="1.5"
                  stroke-linecap="round"
                />
              </g>
              <defs>
                <clipPath id="clip0_219_15371">
                  <rect width="16" height="16" fill="white" transform="translate(0.5 0.09375)" />
                </clipPath>
              </defs>
            </svg>
          </template>
        </InputField>
        <InputField
          v-model="form.password"
          id="password"
          type="password"
          placeholder="password"
          :error="formErrors.password"
          @update:error="formErrors.password = $event"
          class="opacity-80 !h-12"
        >
          <template #icon>
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g opacity="0.5">
                <path
                  d="M8.99996 7.6771C10.5648 7.6771 11.8333 6.40858 11.8333 4.84377C11.8333 3.27896 10.5648 2.01044 8.99996 2.01044C7.43515 2.01044 6.16663 3.27896 6.16663 4.84377C6.16663 6.40858 7.43515 7.6771 8.99996 7.6771Z"
                  stroke="#012A4A"
                  stroke-width="1.5"
                />
                <path
                  d="M14.6652 13.3438C14.6662 13.2276 14.6666 13.1096 14.6666 12.9896C14.6666 11.2294 12.1294 9.80212 8.99998 9.80212C5.87056 9.80212 3.33331 11.2294 3.33331 12.9896C3.33331 14.7498 3.33331 16.1771 8.99998 16.1771C10.5803 16.1771 11.72 16.0659 12.5416 15.8676"
                  stroke="#012A4A"
                  stroke-width="1.5"
                  stroke-linecap="round"
                />
              </g>
            </svg>
          </template>
        </InputField>
        <ButtonField class="mt-10 h-12" type="submit" color="blue-shadow"> Log in </ButtonField>
      </form>
    </div>
    <ToastMessage ref="toastRef" type="error" />
  </div>
</template>
