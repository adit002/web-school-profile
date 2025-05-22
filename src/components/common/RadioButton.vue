<template>
  <div class="space-y-2">
    <div v-for="option in options" :key="option.value" class="cursor-pointer mr-2 inline-flex">
      <input type="radio" :name="name" :value="option.value" v-model="internalValue" />
      <span class="ml-2">{{ option.label }}</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: [String, Number],
  options: {
    type: Array,
    required: true,
  },
  name: {
    type: String,
    default: 'name',
  },
})

const emit = defineEmits(['update:modelValue'])

const internalValue = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
})
</script>
