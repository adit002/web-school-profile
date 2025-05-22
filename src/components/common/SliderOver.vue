<script setup>
import ButtonField from './ButtonField.vue'
defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
  title: {
    type: String,
    default: 'Modal Title',
  },
})
const emit = defineEmits(['update:isOpen', 'confirm'])

const closeModal = () => {
  emit('update:isOpen', false)
}
</script>
<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 overflow-hidden">
    <div
      class="absolute inset-0 bg-black bg-opacity-30 transition-opacity"
      @click="closeModal"
    ></div>
    <div
      class="fixed right-0 top-0 h-full w-full w-2/3 bg-white shadow-lg transform transition-transform duration-500 p-6"
      :class="isOpen ? 'translate-x-0' : 'translate-x-full'"
    >
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
      <div class="overflow-y-auto h-full">
        <slot name="body"></slot>
      </div>
    </div>
  </div>
</template>
