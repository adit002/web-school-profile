<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

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
    default: 'Select an option...',
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
    default: false,
  },
})

const emit = defineEmits(['update:modelValue'])

const isOpen = ref(false)
const searchQuery = ref('')
const dropdownRef = ref(null)

const filteredOptions = computed(() => {
  if (!searchQuery.value) return props.options
  return props.options.filter((option) =>
    option[props.labelField]?.toLowerCase().includes(searchQuery.value.toLowerCase()),
  )
})

const selectOption = (option) => {
  emit('update:modelValue', option[props.valueField])
  isOpen.value = false
  searchQuery.value = ''
}

const toggleDropdown = () => {
  if (!props.disabled) isOpen.value = !isOpen.value
}

const clearSelection = (event) => {
  event.stopPropagation() // prevent opening dropdown when clicking X
  emit('update:modelValue', null)
  searchQuery.value = ''
  isOpen.value = false
}

const handleClickOutside = (event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    isOpen.value = false
  }
}

onMounted(() => document.addEventListener('click', handleClickOutside))
onUnmounted(() => document.removeEventListener('click', handleClickOutside))
</script>

<template>
  <div class="relative" ref="dropdownRef">
    <label v-if="label" class="block mb-3 text-gray-700 font-medium">{{ label }}</label>

    <div
      class="border rounded-md px-3 py-2 w-full bg-white flex justify-between items-center cursor-pointer"
      :class="{ 'opacity-50 cursor-not-allowed': disabled }"
      @click="toggleDropdown"
    >
      <div class="flex items-center space-x-2">
        <span v-if="!modelValue" class="text-gray-400">{{ placeholder }}</span>
        <span v-else>
          {{ options.find((o) => o[valueField] === modelValue)?.[labelField] }}
        </span>

        <!-- Clear Button -->
        <button
          v-if="modelValue"
          @click="clearSelection"
          class="text-gray-400 hover:text-red-500 focus:outline-none"
        >
          ✕
        </button>
      </div>

      <!-- Dropdown Arrow -->
      <span class="text-gray-500">▼</span>
    </div>

    <div v-if="isOpen" class="absolute mt-1 w-full bg-white border rounded-md shadow-lg z-10">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search..."
        class="w-full px-3 py-2 border-b focus:outline-none focus:ring-0"
      />

      <ul class="max-h-40 overflow-y-auto">
        <li
          v-for="option in filteredOptions"
          :key="option[keyField]"
          @click="selectOption(option)"
          class="px-3 py-2 hover:bg-blue-100 cursor-pointer"
        >
          {{ option[labelField] }}
        </li>
      </ul>

      <div v-if="filteredOptions.length === 0" class="px-3 py-2 text-gray-500">
        No options found.
      </div>
    </div>
  </div>
</template>
