<script setup>
import iconLogout from '@/assets/images/icon-logout.png'
import ButtonField from '@/components/common/ButtonField.vue'
import SidebarMenu from '@/components/specific/SidebarMenu.vue'
import ModalField from '@/components/common/ModalField.vue'
import { useAuthStore } from '@/store/authStore'
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import { parseJwt } from '@/utils/helpers'

const router = useRouter()
const authStore = useAuthStore()
const isModalOpen = ref(false)
const { logoutUser, error } = authStore

const clickLogout = async (from = '') => {
  if (from == 'modal') {
    isModalOpen.value = !isModalOpen.value
  } else {
    await logoutUser()
    if (!error) {
      router.push({ name: 'Login' })
    }
  }
}
</script>
<template>
  <div class="h-screen flex flex-col">
    <header class="bg-white px-5 py-6 flex justify-between">
      <!-- <img :src="" alt="logo-dashboard" /> -->
      <h6 class="font-semibold text-lg">Dashboard</h6>
      <div class="flex items-center">
        <h3 class="font-semibold mr-4">
          {{ authStore.token ? parseJwt(authStore.token).username : '' }}
        </h3>
        <ButtonField
          color="red-outlined"
          class="flex font-semibold items-center self-center"
          @click="clickLogout('modal')"
        >
          <img :src="iconLogout" alt="icon-logout" class="mr-2" />
          Log out
        </ButtonField>
      </div>
    </header>

    <div class="flex flex-1">
      <SidebarMenu />
      <main class="flex-1 p-6 bg-background overflow-y-auto">
        <router-view></router-view>
      </main>
    </div>
    <ModalField :isOpen="isModalOpen" title="Logout" @update:isOpen="isModalOpen = $event">
      <template #body>
        <div>
          <h3 class="text-sm">Are you sure you want to logout?</h3>
          <div class="mt-4 flex justify-end space-x-2 border-t pt-3">
            <ButtonField
              class="w-fit font-semibold"
              type="button"
              color="green"
              @click="clickLogout"
            >
              Yes
            </ButtonField>
          </div>
        </div>
      </template>
    </ModalField>
  </div>
</template>
