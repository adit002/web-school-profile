<script setup>
import { ref } from 'vue'

const props = defineProps({
  autoDismiss: { type: Boolean, default: true },
  duration: { type: Number, default: 3000 },
  type: {
    type: String,
    default: 'error',
  },
})

const toasts = ref([])

const addToast = (message) => {
  const id = Date.now()
  toasts.value.push({ id, message })

  if (props.autoDismiss) {
    setTimeout(() => {
      removeToast(id)
    }, props.duration)
  }
}

const removeToast = (id) => {
  toasts.value = toasts.value.filter((toast) => toast.id !== id)
}

defineExpose({ addToast })
</script>

<template>
  <div class="fixed top-5 right-5 flex flex-col space-y-2 z-50">
    <TransitionGroup name="swipe">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        class="bg-white p-4 rounded-lg shadow-md cursor-pointer transform transition-all duration-500 min-w-80"
        @click="removeToast(toast.id)"
      >
        <div class="flex items-center">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            class="mr-2 text-danger-default"
            v-if="type == 'error'"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12ZM8.96963 8.96965C9.26252 8.67676 9.73739 8.67676 10.0303 8.96965L12 10.9393L13.9696 8.96967C14.2625 8.67678 14.7374 8.67678 15.0303 8.96967C15.3232 9.26256 15.3232 9.73744 15.0303 10.0303L13.0606 12L15.0303 13.9696C15.3232 14.2625 15.3232 14.7374 15.0303 15.0303C14.7374 15.3232 14.2625 15.3232 13.9696 15.0303L12 13.0607L10.0303 15.0303C9.73742 15.3232 9.26254 15.3232 8.96965 15.0303C8.67676 14.7374 8.67676 14.2625 8.96965 13.9697L10.9393 12L8.96963 10.0303C8.67673 9.73742 8.67673 9.26254 8.96963 8.96965Z"
              fill="currentColor"
            />
          </svg>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            class="mr-2 text-success-default"
            v-else
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M22 12C22 16.714 22 19.0711 20.5355 20.5355C19.0711 22 16.714 22 12 22C7.28595 22 4.92893 22 3.46447 20.5355C2 19.0711 2 16.714 2 12C2 7.28595 2 4.92893 3.46447 3.46447C4.92893 2 7.28595 2 12 2C16.714 2 19.0711 2 20.5355 3.46447C22 4.92893 22 7.28595 22 12ZM17.4545 6.90343C17.784 7.15446 17.8476 7.62505 17.5966 7.95453L10.7394 16.9545C10.6029 17.1337 10.393 17.2421 10.1678 17.2496C9.94266 17.2571 9.72604 17.163 9.57787 16.9932L6.43501 13.3932C6.1626 13.0812 6.19472 12.6074 6.50676 12.335C6.81879 12.0626 7.29258 12.0947 7.56499 12.4068L10.1033 15.3143L16.4034 7.04547C16.6545 6.71599 17.1251 6.65239 17.4545 6.90343Z"
              fill="currentColor"
            />
          </svg>
          <h3 class="text-sm font-semibold" v-if="type == 'error'">Error Message</h3>
          <h3 class="text-sm font-semibold" v-else>Success Message</h3>
        </div>
        <div class="pl-[30px]">
          {{ toast.message }}
        </div>
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.swipe-enter-active,
.swipe-leave-active {
  transition:
    transform 0.5s ease-in-out,
    opacity 0.5s;
}

.swipe-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.swipe-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}
</style>
