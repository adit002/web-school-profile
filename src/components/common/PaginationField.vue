<script setup>
import { ref, watch } from 'vue'
import VPagination from 'v-pagination-3'
import SelectField from './SelectField.vue'

const props = defineProps({
  totalItems: {
    type: Number,
    required: true,
  },
  itemsPerPage: {
    type: Number,
    required: true,
    default: 10,
  },
  currentPage: {
    type: Number,
    required: true,
    default: 1,
  },
  visiblePageCount: {
    type: Number,
    required: false,
    default: 5,
  },
  showPage: {
    type: Boolean,
    default: true,
  },
})

const emit = defineEmits(['update:currentPage', 'update:showPage'])

const localCurrentPage = ref(props.currentPage)
const showPageValue = ref(props.showPage)
const dropdownOptions = ref({
  showPage: [
    { id: '10', name: '10', value: '10' },
    { id: '25', name: '25', value: '25' },
    { id: '50', name: '50', value: '50' },
    { id: '100', name: '100', value: '100' },
  ],
})

watch(
  () => props.currentPage,
  (newValue) => {
    localCurrentPage.value = newValue
  },
)

watch(
  () => localCurrentPage.value,
  (newValue) => {
    emit('update:currentPage', newValue)
  },
)

watch(
  () => showPageValue.value,
  (newValue) => {
    emit('update:showPage', Number(newValue))
  },
)
</script>

<template>
  <div class="flex justify-center mt-4 items-center">
    <VPagination
      v-model="localCurrentPage"
      :records="totalItems"
      :per-page="itemsPerPage"
      :visible-pages="visiblePageCount"
      theme="custom"
      class="pagination"
      :options="{ hideCount: true, chunksNavigation: 'scroll' }"
    />
    <div class="flex gap-2 items-center ml-3">
      <label :for="id">Result per page</label>
      <SelectField
        v-model="showPageValue"
        :options="dropdownOptions.showPage"
        placeholder="pages"
        keyField="id"
        valueField="value"
        labelField="name"
        class="!w-30"
      />
    </div>
  </div>
</template>

<style>
.pagination {
  @apply flex justify-center items-center gap-2;
}

.pagination li {
  @apply inline-flex justify-center items-center px-4 py-2 rounded cursor-pointer text-gray-600 bg-gray-200 hover:bg-gray-300;
}

.pagination li.active {
  @apply bg-foreground text-white font-bold;
}

.pagination li.disabled {
  @apply opacity-50 cursor-not-allowed;
}
</style>
