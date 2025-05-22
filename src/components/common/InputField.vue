<script setup>
import { watch, ref } from 'vue'

const props = defineProps({
  label: {
    type: String,
  },
  id: {
    type: String,
    required: true,
  },
  placeholder: {
    type: String,
    default: '',
  },
  type: {
    type: String,
    default: 'text',
  },
  modelValue: {
    type: [String, Number],
    default: '',
  },
  error: {
    type: String,
    default: '',
  },
  icon: {
    type: String,
    default: '',
  },
})

const isPasswordVisible = ref(false)
const input = ref(null)
const emit = defineEmits(['update:modelValue', 'update:error'])

const updateValue = (event) => {
  emit(
    'update:modelValue',
    props.type == 'number' ? Number(event.target.value) : event.target.value,
  )
}

const clickEye = () => {
  isPasswordVisible.value = !isPasswordVisible.value
}

watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue && props.error) {
      emit('update:error', '')
    }
  },
)
defineExpose({ input })
</script>

<template>
  <div class="relative" :class="{ 'mb-3': error }">
    <label :for="id" v-if="label">{{ label }}</label>
    <input
      ref="input"
      v-bind="$attrs"
      :type="type == 'password' ? (isPasswordVisible ? 'text' : 'password') : type"
      :id="id"
      :placeholder="placeholder"
      :value="modelValue"
      @input="updateValue"
      class="border rounded-md px-6 py-4 w-full h-9"
      :class="{
        'pl-10': $slots.icon,
        'pr-10': type == 'password',
        'mt-3': label,
        'border-danger-default': error,
      }"
    />
    <span class="absolute left-3 top-1/2 transform -translate-y-1/2">
      <slot name="icon"></slot>
    </span>
    <span
      class="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
      :class="{ '!top-[48px]': label }"
      v-if="type == 'password'"
      @click="clickEye"
    >
      <svg
        width="17"
        height="17"
        viewBox="0 0 17 17"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g opacity="0.5">
          <path
            d="M6.49998 3.06708C7.14668 2.86162 7.82143 2.75815 8.49998 2.76041C11.288 2.76041 13.1853 4.42708 14.3166 5.89641C14.8833 6.63375 15.1666 7.00108 15.1666 8.09375C15.1666 9.18708 14.8833 9.55441 14.3166 10.2911C13.1853 11.7604 11.288 13.4271 8.49998 13.4271C5.71198 13.4271 3.81465 11.7604 2.68331 10.2911C2.11665 9.55508 1.83331 9.18641 1.83331 8.09375C1.83331 7.00041 2.11665 6.63308 2.68331 5.89641C3.02898 5.44496 3.41381 5.02489 3.83331 4.64108"
            stroke="#012A4A"
            stroke-width="1.5"
            stroke-linecap="round"
          />
          <path
            d="M10.5 8.09375C10.5 8.62418 10.2893 9.13289 9.91421 9.50796C9.53914 9.88304 9.03043 10.0938 8.5 10.0938C7.96957 10.0938 7.46086 9.88304 7.08579 9.50796C6.71071 9.13289 6.5 8.62418 6.5 8.09375C6.5 7.56332 6.71071 7.05461 7.08579 6.67954C7.46086 6.30446 7.96957 6.09375 8.5 6.09375C9.03043 6.09375 9.53914 6.30446 9.91421 6.67954C10.2893 7.05461 10.5 7.56332 10.5 8.09375Z"
            stroke="#012A4A"
            stroke-width="1.5"
          />
        </g>
      </svg>
    </span>
    <span v-if="error" class="text-danger-default">{{ error }}</span>
  </div>
</template>
