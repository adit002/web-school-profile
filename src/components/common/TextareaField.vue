<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  id: {
    type: String,
    default: null,
  },
  name: {
    type: String,
    default: null,
  },
  placeholder: {
    type: String,
    default: 'Enter text...',
  },
  label: {
    type: String,
    default: null,
  },
  rows: {
    type: Number,
    default: 3,
  },
  cols: {
    type: Number,
    default: null,
  },
  maxlength: {
    type: Number,
    default: null,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  readonly: {
    type: Boolean,
    default: false,
  },
  textareaClass: {
    type: String,
    default: '',
  },
  errorMessage: {
    type: String,
    default: null,
  },
})

const emit = defineEmits(['update:modelValue'])

const innerValue = ref(props.modelValue)

watch(innerValue, (newValue) => {
  emit('update:modelValue', newValue)
})

watch(
  () => props.modelValue,
  (newValue) => {
    innerValue.value = newValue
  },
)
</script>

<template>
  <div class="relative">
    <label :for="id" v-if="label">{{ label }}</label>

    <textarea
      :id="id"
      :name="name"
      :placeholder="placeholder"
      :rows="rows"
      :cols="cols"
      :maxlength="maxlength"
      :disabled="disabled"
      :readonly="readonly"
      :class="[textareaClass, { 'mt-3': label }]"
      v-model="innerValue"
      class="border rounded-md px-6 py-4 w-full"
    ></textarea>

    <p v-if="errorMessage" class="text-sm text-red-500 mt-1">
      {{ errorMessage }}
    </p>
  </div>
</template>
