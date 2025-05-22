<script setup>
import { ref, watch } from 'vue'
import DatePicker from 'vue-datepicker-next'
import 'vue-datepicker-next/index.css'

const props = defineProps({
  modelValue: Array,
  placeholder: {
    type: String,
    default: 'Select Date Range',
  },
  label: {
    type: String,
    default: null,
  },
  type: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['update:modelValue'])
const dateRange = ref(props.modelValue || [])

watch(
  () => props.modelValue,
  (newVal) => {
    dateRange.value = newVal
  },
)

const emitDateRange = () => {
  emit('update:modelValue', dateRange.value)
}
</script>

<template>
  <div class="inline-grid">
    <label :for="id" v-if="label" class="mb-3">{{ label }}</label>
    <DatePicker
      v-model:value="dateRange"
      :type="type"
      format="YYYY-MM-DD"
      value-type="format"
      :clearable="true"
      :placeholder="placeholder"
      @change="emitDateRange"
    />
  </div>
</template>

<style>
.mx-input {
  @apply !shadow-none !border-[#e5e7eb] text-base px-6 h-9;
}
.mx-datepicker {
  @apply w-full;
}
</style>
