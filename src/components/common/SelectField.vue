<script setup>
import { watch } from 'vue'
const props = defineProps({
  modelValue: {
    type: [String, Number, null],
    required: false,
    default: null,
  },
  options: {
    type: Array,
    required: true,
    default: () => [],
  },
  placeholder: {
    type: String,
    required: false,
    default: 'Select an option',
  },
  keyField: {
    type: String,
    required: false,
    default: 'id',
  },
  valueField: {
    type: String,
    required: false,
    default: 'value',
  },
  labelField: {
    type: String,
    required: false,
    default: 'label',
  },
  label: {
    type: String,
    default: null,
  },
  disabled: {
    type: Boolean,
  },
  error: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['update:modelValue', 'update:error'])

const onChange = (event) => {
  const selectedValue = event.target.value
  emit('update:modelValue', selectedValue)
}
watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue && props.error) {
      emit('update:error', '')
    }
  },
)
</script>

<template>
  <div class="relative">
    <label :for="id" v-if="label">{{ label }}</label>
    <select
      :value="modelValue"
      @change="onChange"
      class="border rounded-md px-6 w-full h-9 overflow-y-scroll max-h-32 bg-white disabled:bg-gray-200 disabled:cursor-not-allowed"
      :class="{ 'mt-3': label, 'border-danger-default': error }"
      :disabled="disabled"
    >
      <option v-for="option in options" :key="option[keyField]" :value="option[valueField]">
        {{ option[labelField] }}
      </option>
    </select>
    <span v-if="error" class="text-danger-default">{{ error }}</span>
  </div>
</template>
