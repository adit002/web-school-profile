<script setup>
import ButtonField from '@/components/common/ButtonField.vue'

defineProps({
  title: {
    type: String,
    default: 'Modal Title',
  },
  showCancel: {
    type: Boolean,
    default: true,
  },
  showConfirm: {
    type: Boolean,
    default: true,
  },
  isOpen: {
    type: Boolean,
    required: true,
  },
  width: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['update:isOpen', 'confirm'])

const closeModal = () => {
  emit('update:isOpen', false)
}
</script>

<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
    @click.self="closeModal"
  >
    <div class="bg-white rounded-lg shadow-lg p-6 max-h-screen overflow-y-auto" :class="width">
      <!-- Modal Header -->
      <div class="flex justify-between items-center mb-4 border-b pb-3 mb-3">
        <h6 class="font-bold">{{ title }}</h6>
        <ButtonField color="red" @click="closeModal">
          <svg
            width="8"
            height="8"
            viewBox="0 0 8 8"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6.5 1.5L1.5 6.5M1.5 1.5L6.5 6.5"
              stroke="#FE5F55"
              stroke-width="1.5"
              stroke-linecap="round"
            />
          </svg>
        </ButtonField>
      </div>

      <div class="my-3">
        <slot name="body"></slot>
      </div>
    </div>
  </div>
</template>
