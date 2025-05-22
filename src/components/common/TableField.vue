<script setup>
import { reactive, computed, defineEmits, watch, ref } from 'vue'
import PaginationField from '@/components/common/PaginationField.vue'
import ButtonField from './ButtonField.vue'
import InputField from './InputField.vue'
import { formatCurrencyWithoutSymbol } from '@/utils/helpers'

const props = defineProps({
  data: {
    type: Array,
    required: true,
    default: () => [],
  },
  count: {
    type: Number,
    default: 0,
  },
  columns: {
    type: Array,
    required: true,
  },
  showIndex: {
    type: Boolean,
    default: false,
  },
  actionInrow: {
    type: Array,
    required: false,
    default: () => [],
  },
  actionInrowNested: {
    type: Array,
    required: false,
    default: () => [],
  },
  nestedColumns: {
    type: Array,
    required: false,
  },
  showPagination: {
    type: Boolean,
    default: true,
  },
  flagNestedTable: {
    type: String,
    default: 'children',
  },
  flagStatus: {
    type: Array,
    required: false,
    default: () => ['is_disabled'],
  },
  setDefaultPage: {
    type: Number,
  },
  checkboxRow: {
    type: Boolean,
    default: false,
  },
  actions: {
    type: Array,
    required: false,
    default: () => [],
  },
})

const sortKey = reactive('')
const sortOrder = reactive('asc')
const selectAll = ref(false)
const pagination = reactive({
  currentPage: 1,
  showPage: 10,
})
const totalItems = computed(() => props.count)
const emit = defineEmits([
  'update:btnDetail',
  'update:btnDelete',
  'update:btnPrint',
  'update:btnDownload',
  'update:btnDownloadNested',
  'update:btnDetailNested',
  'update:btnDeleteNested',
  'update:showPage',
  'update:currentPage',
  'update:btnRow',
  'update:dataTable',
  'update:btnAction',
  'update:inputForm',
])
const sortBy = (key) => {
  if (sortKey === key) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortKey.value = key
    sortOrder.value = 'asc'
  }
}

const sortedData = computed(() => {
  const sorted = [...props.data]
  if (sortKey.value) {
    sorted.sort((a, b) => {
      const aValue = a[sortKey.value]
      const bValue = b[sortKey.value]
      if (aValue < bValue) return sortOrder.value === 'asc' ? -1 : 1
      if (aValue > bValue) return sortOrder.value === 'asc' ? 1 : -1
      return 0
    })
  }
  return sorted
})

const clickAction = (from, data) => {
  emit(
    ['Approve', 'Reject', 'Hold', 'Close'].includes(from)
      ? 'update:btnAction'
      : `update:btn${from}`,
    ['Approve', 'Reject', 'Hold', 'Close'].includes(from) ? { type: from, data: data } : data,
  )
}
const expandedRows = reactive({})
const toggleRow = (id) => {
  expandedRows[id] = !expandedRows[id]
}
const clickCheckbox = (from, data, id = '') => {
  if (from == 'all') {
    sortedData.value.forEach((element) => {
      element.checked = data
    })
  } else {
    sortedData.value.forEach((element) => {
      if (element.id == id) {
        element.checked = data
      }
    })
    selectAll.value = sortedData.value.every((item) => item.checked)
  }
  emit('update:dataTable', sortedData.value)
}
const updatePagination = (from, data) => {
  if (from === 'showPage') {
    pagination.currentPage = 1
    pagination.showPage = data
  } else {
    pagination.currentPage = data
  }
  emit(`update:${from}`, data)
}

function onInput(event, column, row) {
  const input = event
  if (column.format === 'currency') {
    const numericValue = parseFloat(input.replace(/[^0-9.-]+/g, ''))
    row[column.key] = isNaN(numericValue) ? 0 : numericValue
  } else {
    row[column.key] = input
  }
  emit('update:inputForm', row.id)
}

watch(
  () => props.setDefaultPage,
  (newVal) => {
    pagination.currentPage = newVal
  },
)

watch(
  () => props.data,
  () => {
    selectAll.value = false
  },
)
</script>

<template>
  <div class="overflow-x-auto">
    <table class="min-w-full table-auto w-full">
      <thead>
        <tr class="bg-softwhite">
          <th class="w-[1%] pl-2" v-if="checkboxRow && sortedData.length">
            <input
              type="checkbox"
              v-model="selectAll"
              @change="clickCheckbox('all', $event.target.checked)"
              class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-md focus:ring-blue-500"
            />
          </th>
          <th
            v-for="(column, index) in columns"
            :key="index"
            class="px-4 py-2 text-left cursor-pointer font-normal"
            :class="{ 'w-[1%]': column.key == 'no' }"
            @click="sortBy(column.key)"
          >
            {{ column.label }}
            <span v-if="sortKey === column.key">
              {{ sortOrder === 'asc' ? '▲' : '▼' }}
            </span>
          </th>
          <th v-if="actionInrow.length"></th>
        </tr>
      </thead>

      <tbody>
        <template v-for="(row, rowIndex) in sortedData" :key="row.id || rowIndex">
          <tr
            class="border-b bg-white"
            :class="{
              '!bg-lightblue': (rowIndex + 1) % 2 === 0,
            }"
          >
            <td class="w-[1%] pl-2" v-if="checkboxRow && sortedData.length">
              <input
                type="checkbox"
                :checked="row.checked"
                @change="clickCheckbox('row', $event.target.checked, row.id)"
                class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-md focus:ring-blue-500"
              />
            </td>
            <td v-if="showIndex" class="px-4 py-2 flex">
              {{ (pagination.currentPage - 1) * pagination.showPage + rowIndex + 1 }}.
              <button
                @click="toggleRow(row.id)"
                class="ml-2"
                v-if="row[flagNestedTable] && row[flagNestedTable].length"
              >
                {{ expandedRows[row.id] ? '▲' : '▼' }}
              </button>
            </td>
            <td
              v-for="(column, colIndex) in columns.filter((item) => item.key != 'no')"
              :key="colIndex"
              class="px-4 py-2 cursor-pointer"
            >
              <div
                v-if="!flagStatus.includes(column.key) && !column.form"
                @click="clickAction('Row', row)"
              >
                {{
                  ['created_at'].includes(column.key)
                    ? row[column.key].split(' ')[0]
                    : typeof row[column.key] === 'object' && row[column.key] !== null
                      ? row[column.key].name || row[column.key].length
                      : row[column.key]
                }}
              </div>
              <div v-else-if="column.form">
                <InputField
                  :disabled="column.disabled || false"
                  v-if="column.form == 'input'"
                  :type="column.type || 'text'"
                  class="w-30"
                  :modelValue="
                    column.format === 'currency'
                      ? formatCurrencyWithoutSymbol(row[column.key])
                      : row[column.key]
                  "
                  @update:modelValue="onInput($event, column, row)"
                />
              </div>
              <div v-else>
                <svg
                  width="17"
                  height="16"
                  viewBox="0 0 17 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  v-if="row[column.key] == 'N' && column.key == 'is_disabled'"
                >
                  <path
                    opacity="0.5"
                    d="M15.1666 8.00016C15.1666 11.6822 12.1819 14.6668 8.49992 14.6668C4.81792 14.6668 1.83325 11.6822 1.83325 8.00016C1.83325 4.31816 4.81792 1.3335 8.49992 1.3335C12.1819 1.3335 15.1666 4.31816 15.1666 8.00016Z"
                    fill="#5DD0AC"
                  />
                  <path
                    d="M11.1868 5.98021C11.2804 6.07396 11.333 6.20104 11.333 6.33354C11.333 6.46604 11.2804 6.59313 11.1868 6.68688L7.85344 10.0202C7.75969 10.1138 7.6326 10.1664 7.5001 10.1664C7.3676 10.1664 7.24052 10.1138 7.14677 10.0202L5.81344 8.68688C5.76431 8.6411 5.72491 8.5859 5.69758 8.52457C5.67025 8.46324 5.65556 8.39703 5.65437 8.32989C5.65319 8.26276 5.66554 8.19607 5.69069 8.13381C5.71583 8.07155 5.75326 8.015 5.80074 7.96752C5.84822 7.92004 5.90478 7.88261 5.96704 7.85746C6.0293 7.83232 6.09598 7.81997 6.16312 7.82115C6.23025 7.82233 6.29646 7.83703 6.35779 7.86436C6.41913 7.89169 6.47433 7.93109 6.5201 7.98021L7.5001 8.96021L8.9901 7.47021L10.4801 5.98021C10.5739 5.88658 10.7009 5.83398 10.8334 5.83398C10.9659 5.83398 11.093 5.88658 11.1868 5.98021Z"
                    fill="#5DD0AC"
                  />
                </svg>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  v-if="row[column.key] == 'Y' && column.key == 'is_disabled'"
                >
                  <path
                    opacity="0.5"
                    d="M14.6666 7.99967C14.6666 11.6817 11.6819 14.6663 7.99992 14.6663C4.31792 14.6663 1.33325 11.6817 1.33325 7.99967C1.33325 4.31767 4.31792 1.33301 7.99992 1.33301C11.6819 1.33301 14.6666 4.31767 14.6666 7.99967Z"
                    fill="#FE5F55"
                  />
                  <path
                    d="M5.97997 5.98043C6.07372 5.88679 6.2008 5.8342 6.3333 5.8342C6.4658 5.8342 6.59288 5.88679 6.68663 5.98043L7.99997 7.29376L9.3133 5.98043C9.35908 5.9313 9.41428 5.8919 9.47561 5.86457C9.53694 5.83725 9.60315 5.82255 9.67029 5.82137C9.73742 5.82018 9.80411 5.83253 9.86637 5.85768C9.92862 5.88283 9.98518 5.92026 10.0327 5.96774C10.0801 6.01522 10.1176 6.07177 10.1427 6.13403C10.1679 6.19629 10.1802 6.26297 10.179 6.33011C10.1778 6.39724 10.1631 6.46345 10.1358 6.52479C10.1085 6.58612 10.0691 6.64132 10.02 6.68709L8.70663 8.00043L10.02 9.31376C10.1083 9.40855 10.1564 9.53391 10.1541 9.66344C10.1518 9.79298 10.0993 9.91657 10.0077 10.0082C9.91611 10.0998 9.79252 10.1523 9.66298 10.1545C9.53345 10.1568 9.40808 10.1087 9.3133 10.0204L7.99997 8.7071L6.68663 10.0204C6.59185 10.1087 6.46649 10.1568 6.33695 10.1545C6.20742 10.1523 6.08383 10.0998 5.99222 10.0082C5.90061 9.91657 5.84814 9.79298 5.84585 9.66344C5.84356 9.53391 5.89165 9.40855 5.97997 9.31376L7.2933 8.00043L5.97997 6.68709C5.88633 6.59334 5.83374 6.46626 5.83374 6.33376C5.83374 6.20126 5.88633 6.07418 5.97997 5.98043Z"
                    fill="#FE5F55"
                  />
                </svg>
                <div
                  class="bg-[#f9f1d4] w-fit py-1 px-4 rounded-3xl"
                  v-if="row[column.key] == 'N' && column.key == 'is_closed'"
                >
                  <div class="flex items-center text-[#edcd68] font-semibold">
                    <div class="bg-[#edcd68] w-3 h-3 rounded-full mr-2"></div>
                    Open
                  </div>
                </div>
                <div
                  class="bg-[#ecf2fe] w-fit py-1 px-4 rounded-3xl"
                  v-if="row[column.key] == 'Y' && column.key == 'is_closed'"
                >
                  <div class="flex items-center text-[#497df6] font-semibold">
                    <div class="bg-[#497df6] w-3 h-3 rounded-full mr-2"></div>
                    Close
                  </div>
                </div>
                <div
                  class="bg-[#f0fcf4] w-fit py-1 px-4 rounded-3xl"
                  v-if="row[column.key] == 'approved' && column.key == 'approval_status'"
                >
                  <div class="flex items-center text-[#84ccae] font-semibold">
                    <div class="bg-[#84ccae] w-3 h-3 rounded-full mr-2"></div>
                    Approved
                  </div>
                </div>
                <div
                  class="bg-[#f9e8e7] w-fit py-1 px-4 rounded-3xl"
                  v-if="row[column.key] == 'rejected' && column.key == 'approval_status'"
                >
                  <div class="flex items-center text-[#e46b5c] font-semibold">
                    <div class="bg-[#e46b5c] w-3 h-3 rounded-full mr-2"></div>
                    Rejected
                  </div>
                </div>
                <div
                  class="bg-[#eef0f5] w-fit py-1 px-4 rounded-3xl"
                  v-if="row[column.key] == 'waiting' && column.key == 'approval_status'"
                >
                  <div class="flex items-center text-[#0f2139] font-semibold">
                    <div class="bg-[#0f2139] w-3 h-3 rounded-full mr-2"></div>
                    Waiting
                  </div>
                </div>
                <div
                  class="bg-[#eef0f5] w-fit py-1 px-4 rounded-3xl"
                  v-if="row[column.key] == 'hold' && column.key == 'approval_status'"
                >
                  <div class="flex items-center text-[#0f2139] font-semibold">
                    <div class="bg-[#0f2139] w-3 h-3 rounded-full mr-2"></div>
                    Hold
                  </div>
                </div>
                <div v-if="actions.length && column.key == 'action'" class="flex gap-2">
                  <ButtonField
                    v-for="(item, index) in actions"
                    :key="index"
                    color="blue"
                    @click="clickAction(item, row)"
                    >{{ item }}</ButtonField
                  >
                </div>
              </div>
            </td>
            <td class="px-4 py-2 flex justify-end" v-if="actionInrow.length">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                class="mr-3 cursor-pointer"
                v-if="actionInrow.includes('print')"
                @click="clickAction('Print', row)"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M16 6H8C5.17157 6 3.75736 6 2.87868 6.87868C2 7.75736 2 9.17157 2 12C2 14.8284 2 16.2426 2.87868 17.1213C3.37323 17.6159 4.03743 17.8321 5.02795 17.9266C4.99998 17.2038 4.99999 15.3522 5 14.5C4.72386 14.5 4.5 14.2761 4.5 14C4.5 13.7239 4.72386 13.5 5 13.5H19C19.2761 13.5 19.5 13.7239 19.5 14C19.5 14.2761 19.2761 14.5003 19 14.5003C19 15.3525 19 17.2039 18.9721 17.9266C19.9626 17.8321 20.6268 17.6159 21.1213 17.1213C22 16.2426 22 14.8284 22 12C22 9.17157 22 7.75736 21.1213 6.87868C20.2426 6 18.8284 6 16 6ZM9 10.75C9.41421 10.75 9.75 10.4142 9.75 10C9.75 9.58579 9.41421 9.25 9 9.25H6C5.58579 9.25 5.25 9.58579 5.25 10C5.25 10.4142 5.58579 10.75 6 10.75H9ZM17 11C17.5523 11 18 10.5523 18 10C18 9.44772 17.5523 9 17 9C16.4477 9 16 9.44772 16 10C16 10.5523 16.4477 11 17 11Z"
                  fill="currentColor"
                />
                <path
                  d="M17.1211 2.87868C16.2424 2 14.8282 2 11.9998 2C9.17134 2 7.75712 2 6.87844 2.87868C6.38608 3.37105 6.16961 4.03157 6.07444 5.01484C6.63368 4.99996 7.25183 4.99998 7.92943 5H16.0706C16.748 4.99998 17.366 4.99996 17.9251 5.01483C17.8299 4.03156 17.6135 3.37105 17.1211 2.87868Z"
                  fill="currentColor"
                />
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M18 14.5C18 17.3284 18 20.2426 17.1213 21.1213C16.2426 22 14.8284 22 12 22C9.17158 22 7.75736 22 6.87868 21.1213C6 20.2426 6 17.3284 6 14.5H18ZM15.75 16.75C15.75 17.1642 15.4142 17.5 15 17.5H9C8.58579 17.5 8.25 17.1642 8.25 16.75C8.25 16.3358 8.58579 16 9 16H15C15.4142 16 15.75 16.3358 15.75 16.75ZM13.75 19.75C13.75 20.1642 13.4142 20.5 13 20.5H9C8.58579 20.5 8.25 20.1642 8.25 19.75C8.25 19.3358 8.58579 19 9 19H13C13.4142 19 13.75 19.3358 13.75 19.75Z"
                  fill="currentColor"
                />
              </svg>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                class="mr-3 cursor-pointer"
                v-if="actionInrow.includes('download') && (row.base64_pdf || row.base64_img)"
                @click="clickAction('Download', row)"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M2 12C2 7.28595 2 4.92893 3.46447 3.46447C4.92893 2 7.28595 2 12 2C16.714 2 19.0711 2 20.5355 3.46447C22 4.92893 22 7.28595 22 12C22 16.714 22 19.0711 20.5355 20.5355C19.0711 22 16.714 22 12 22C7.28595 22 4.92893 22 3.46447 20.5355C2 19.0711 2 16.714 2 12ZM12 6.25C12.4142 6.25 12.75 6.58579 12.75 7V12.1893L14.4697 10.4697C14.7626 10.1768 15.2374 10.1768 15.5303 10.4697C15.8232 10.7626 15.8232 11.2374 15.5303 11.5303L12.5303 14.5303C12.3897 14.671 12.1989 14.75 12 14.75C11.8011 14.75 11.6103 14.671 11.4697 14.5303L8.46967 11.5303C8.17678 11.2374 8.17678 10.7626 8.46967 10.4697C8.76256 10.1768 9.23744 10.1768 9.53033 10.4697L11.25 12.1893V7C11.25 6.58579 11.5858 6.25 12 6.25ZM8 16.25C7.58579 16.25 7.25 16.5858 7.25 17C7.25 17.4142 7.58579 17.75 8 17.75H16C16.4142 17.75 16.75 17.4142 16.75 17C16.75 16.5858 16.4142 16.25 16 16.25H8Z"
                  fill="currentColor"
                />
              </svg>
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                class="mr-3 cursor-pointer"
                v-if="actionInrow.includes('detail')"
                @click="clickAction('Detail', row)"
              >
                <g opacity="0.5">
                  <path
                    d="M1.33325 4.6335C1.33325 4.04483 1.33325 3.75083 1.37992 3.5055C1.4794 2.97872 1.73534 2.49416 2.11435 2.11503C2.49336 1.7359 2.97784 1.47981 3.50459 1.38016C3.75059 1.3335 4.04525 1.3335 4.63325 1.3335C4.89058 1.3335 5.01992 1.3335 5.14392 1.34483C5.67795 1.39498 6.18444 1.60502 6.59725 1.9475C6.69325 2.02683 6.78392 2.1175 6.96658 2.30016L7.33325 2.66683C7.87725 3.21083 8.14925 3.48283 8.47458 3.6635C8.6534 3.76316 8.84309 3.8419 9.03992 3.89816C9.39859 4.00016 9.78325 4.00016 10.5519 4.00016H10.8013C12.5559 4.00016 13.4339 4.00016 14.0039 4.5135C14.0568 4.56016 14.1066 4.60994 14.1533 4.66283C14.6666 5.23283 14.6666 6.11083 14.6666 7.8655V9.3335C14.6666 11.8475 14.6666 13.1048 13.8853 13.8855C13.1039 14.6662 11.8473 14.6668 9.33325 14.6668H6.66658C4.15259 14.6668 2.89525 14.6668 2.11459 13.8855C1.33392 13.1042 1.33325 11.8475 1.33325 9.3335V4.6335Z"
                    fill="#012A4A"
                  />
                  <path
                    d="M1.33325 4.6335C1.33325 4.04483 1.33325 3.75083 1.37992 3.5055C1.4794 2.97872 1.73534 2.49416 2.11435 2.11503C2.49336 1.7359 2.97784 1.47981 3.50459 1.38016C3.75059 1.3335 4.04525 1.3335 4.63325 1.3335C4.89058 1.3335 5.01992 1.3335 5.14392 1.34483C5.67795 1.39498 6.18444 1.60502 6.59725 1.9475C6.69325 2.02683 6.78392 2.1175 6.96658 2.30016L7.33325 2.66683C7.87725 3.21083 8.14925 3.48283 8.47458 3.6635C8.6534 3.76316 8.84309 3.8419 9.03992 3.89816C9.39859 4.00016 9.78325 4.00016 10.5519 4.00016H10.8013C12.5559 4.00016 13.4339 4.00016 14.0039 4.5135C14.0568 4.56016 14.1066 4.60994 14.1533 4.66283C14.6666 5.23283 14.6666 6.11083 14.6666 7.8655V9.3335C14.6666 11.8475 14.6666 13.1048 13.8853 13.8855C13.1039 14.6662 11.8473 14.6668 9.33325 14.6668H6.66658C4.15259 14.6668 2.89525 14.6668 2.11459 13.8855C1.33392 13.1042 1.33325 11.8475 1.33325 9.3335V4.6335Z"
                    fill="black"
                    fill-opacity="0.2"
                  />
                </g>
                <path
                  d="M13.3334 4.15867C13.3334 3.96 13.33 3.842 13.3167 3.73867C13.2591 3.30223 13.0592 2.89699 12.7478 2.58577C12.4365 2.27455 12.0311 2.07474 11.5947 2.01733C11.4647 2 11.31 2 11 2H6.65869C6.73602 2.06933 6.82336 2.156 6.96669 2.3L7.33336 2.66667C7.87736 3.21067 8.14936 3.48267 8.47469 3.66333C8.65372 3.76304 8.84364 3.84178 9.04069 3.898C9.39869 4 9.78336 4 10.5527 4H10.8014C11.988 4 12.7727 4 13.3334 4.15867Z"
                  fill="#012A4A"
                />
                <path
                  d="M13.3334 4.15867C13.3334 3.96 13.33 3.842 13.3167 3.73867C13.2591 3.30223 13.0592 2.89699 12.7478 2.58577C12.4365 2.27455 12.0311 2.07474 11.5947 2.01733C11.4647 2 11.31 2 11 2H6.65869C6.73602 2.06933 6.82336 2.156 6.96669 2.3L7.33336 2.66667C7.87736 3.21067 8.14936 3.48267 8.47469 3.66333C8.65372 3.76304 8.84364 3.84178 9.04069 3.898C9.39869 4 9.78336 4 10.5527 4H10.8014C11.988 4 12.7727 4 13.3334 4.15867Z"
                  fill="black"
                  fill-opacity="0.2"
                />
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M8.16675 6.6665C8.16675 6.5339 8.21943 6.40672 8.31319 6.31295C8.40696 6.21918 8.53414 6.1665 8.66675 6.1665H12.0001C12.1327 6.1665 12.2599 6.21918 12.3536 6.31295C12.4474 6.40672 12.5001 6.5339 12.5001 6.6665C12.5001 6.79911 12.4474 6.92629 12.3536 7.02006C12.2599 7.11383 12.1327 7.1665 12.0001 7.1665H8.66675C8.53414 7.1665 8.40696 7.11383 8.31319 7.02006C8.21943 6.92629 8.16675 6.79911 8.16675 6.6665Z"
                  fill="#012A4A"
                />
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M8.16675 6.6665C8.16675 6.5339 8.21943 6.40672 8.31319 6.31295C8.40696 6.21918 8.53414 6.1665 8.66675 6.1665H12.0001C12.1327 6.1665 12.2599 6.21918 12.3536 6.31295C12.4474 6.40672 12.5001 6.5339 12.5001 6.6665C12.5001 6.79911 12.4474 6.92629 12.3536 7.02006C12.2599 7.11383 12.1327 7.1665 12.0001 7.1665H8.66675C8.53414 7.1665 8.40696 7.11383 8.31319 7.02006C8.21943 6.92629 8.16675 6.79911 8.16675 6.6665Z"
                  fill="black"
                  fill-opacity="0.2"
                />
              </svg>
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                class="cursor-pointer"
                v-if="actionInrow.includes('delete')"
                @click="clickAction('Delete', row)"
              >
                <path d="M7 6H6V12H7V6Z" fill="#FE5F55" />
                <path d="M10 6H9V12H10V6Z" fill="#FE5F55" />
                <path
                  d="M2 3V4H3V14C3 14.2652 3.10536 14.5196 3.29289 14.7071C3.48043 14.8946 3.73478 15 4 15H12C12.2652 15 12.5196 14.8946 12.7071 14.7071C12.8946 14.5196 13 14.2652 13 14V4H14V3H2ZM4 14V4H12V14H4Z"
                  fill="#FE5F55"
                />
                <path d="M10 1H6V2H10V1Z" fill="#FE5F55" />
              </svg>
            </td>
          </tr>
          <tr
            v-if="expandedRows[row.id] && row[flagNestedTable] && row[flagNestedTable].length"
            :class="{
              '!bg-lightblue': (rowIndex + 1) % 2 === 0,
            }"
          >
            <td :colspan="columns.length + (showIndex ? 1 : 0)">
              <table class="table-auto w-full">
                <thead>
                  <tr class="bg-softwhite">
                    <th
                      v-for="nestedColumn in nestedColumns"
                      :key="nestedColumn.key"
                      class="border-b px-4 py-2 text-left cursor-pointer font-normal"
                      :class="{ 'w-[1%]': nestedColumn.key == 'no' }"
                    >
                      {{ nestedColumn.label }}
                    </th>
                    <th v-if="actionInrowNested.length"></th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(child, childIndex) in row[flagNestedTable]"
                    :key="child.id || childIndex"
                  >
                    <td
                      v-for="nestedColumn in nestedColumns"
                      :key="nestedColumn.key"
                      class="border-b px-4 py-2"
                    >
                      <template v-if="!flagStatus.includes(nestedColumn.key)">
                        <div v-if="showIndex && nestedColumn.key == 'no'">
                          {{ childIndex + 1 }}.
                        </div>
                        <div v-else>
                          {{
                            typeof child[nestedColumn.key] === 'object' &&
                            child[nestedColumn.key] !== null
                              ? child[nestedColumn.key].name
                              : child[nestedColumn.key]
                          }}
                        </div>
                      </template>
                      <template v-else>
                        <svg
                          width="17"
                          height="16"
                          viewBox="0 0 17 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          v-if="
                            (child[nestedColumn.key] == 'N' && nestedColumn.key == 'is_disabled') ||
                            ([
                              'is_void',
                              'e_is_all_div',
                              'set_pph',
                              'is_cancel_po',
                              'is_close_pr',
                            ].includes(nestedColumn.key) &&
                              child[nestedColumn.key] == 'Y')
                          "
                        >
                          <path
                            opacity="0.5"
                            d="M15.1666 8.00016C15.1666 11.6822 12.1819 14.6668 8.49992 14.6668C4.81792 14.6668 1.83325 11.6822 1.83325 8.00016C1.83325 4.31816 4.81792 1.3335 8.49992 1.3335C12.1819 1.3335 15.1666 4.31816 15.1666 8.00016Z"
                            fill="#5DD0AC"
                          />
                          <path
                            d="M11.1868 5.98021C11.2804 6.07396 11.333 6.20104 11.333 6.33354C11.333 6.46604 11.2804 6.59313 11.1868 6.68688L7.85344 10.0202C7.75969 10.1138 7.6326 10.1664 7.5001 10.1664C7.3676 10.1664 7.24052 10.1138 7.14677 10.0202L5.81344 8.68688C5.76431 8.6411 5.72491 8.5859 5.69758 8.52457C5.67025 8.46324 5.65556 8.39703 5.65437 8.32989C5.65319 8.26276 5.66554 8.19607 5.69069 8.13381C5.71583 8.07155 5.75326 8.015 5.80074 7.96752C5.84822 7.92004 5.90478 7.88261 5.96704 7.85746C6.0293 7.83232 6.09598 7.81997 6.16312 7.82115C6.23025 7.82233 6.29646 7.83703 6.35779 7.86436C6.41913 7.89169 6.47433 7.93109 6.5201 7.98021L7.5001 8.96021L8.9901 7.47021L10.4801 5.98021C10.5739 5.88658 10.7009 5.83398 10.8334 5.83398C10.9659 5.83398 11.093 5.88658 11.1868 5.98021Z"
                            fill="#5DD0AC"
                          />
                        </svg>
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          v-if="
                            (child[nestedColumn.key] == 'Y' && nestedColumn.key == 'is_disabled') ||
                            ([
                              'is_void',
                              'e_is_all_div',
                              'set_pph',
                              'is_cancel_po',
                              'is_close_pr',
                            ].includes(nestedColumn.key) &&
                              child[nestedColumn.key] == 'N')
                          "
                        >
                          <path
                            opacity="0.5"
                            d="M14.6666 7.99967C14.6666 11.6817 11.6819 14.6663 7.99992 14.6663C4.31792 14.6663 1.33325 11.6817 1.33325 7.99967C1.33325 4.31767 4.31792 1.33301 7.99992 1.33301C11.6819 1.33301 14.6666 4.31767 14.6666 7.99967Z"
                            fill="#FE5F55"
                          />
                          <path
                            d="M5.97997 5.98043C6.07372 5.88679 6.2008 5.8342 6.3333 5.8342C6.4658 5.8342 6.59288 5.88679 6.68663 5.98043L7.99997 7.29376L9.3133 5.98043C9.35908 5.9313 9.41428 5.8919 9.47561 5.86457C9.53694 5.83725 9.60315 5.82255 9.67029 5.82137C9.73742 5.82018 9.80411 5.83253 9.86637 5.85768C9.92862 5.88283 9.98518 5.92026 10.0327 5.96774C10.0801 6.01522 10.1176 6.07177 10.1427 6.13403C10.1679 6.19629 10.1802 6.26297 10.179 6.33011C10.1778 6.39724 10.1631 6.46345 10.1358 6.52479C10.1085 6.58612 10.0691 6.64132 10.02 6.68709L8.70663 8.00043L10.02 9.31376C10.1083 9.40855 10.1564 9.53391 10.1541 9.66344C10.1518 9.79298 10.0993 9.91657 10.0077 10.0082C9.91611 10.0998 9.79252 10.1523 9.66298 10.1545C9.53345 10.1568 9.40808 10.1087 9.3133 10.0204L7.99997 8.7071L6.68663 10.0204C6.59185 10.1087 6.46649 10.1568 6.33695 10.1545C6.20742 10.1523 6.08383 10.0998 5.99222 10.0082C5.90061 9.91657 5.84814 9.79298 5.84585 9.66344C5.84356 9.53391 5.89165 9.40855 5.97997 9.31376L7.2933 8.00043L5.97997 6.68709C5.88633 6.59334 5.83374 6.46626 5.83374 6.33376C5.83374 6.20126 5.88633 6.07418 5.97997 5.98043Z"
                            fill="#FE5F55"
                          />
                        </svg>
                        <div
                          class="bg-[#f9f1d4] w-fit py-1 px-4 rounded-3xl"
                          v-if="child[nestedColumn.key] == 'N' && nestedColumn.key == 'is_closed'"
                        >
                          <div class="flex items-center text-[#edcd68] font-semibold">
                            <div class="bg-[#edcd68] w-3 h-3 rounded-full mr-2"></div>
                            Open
                          </div>
                        </div>
                        <div
                          class="bg-[#ecf2fe] w-fit py-1 px-4 rounded-3xl"
                          v-if="child[nestedColumn.key] == 'Y' && nestedColumn.key == 'is_closed'"
                        >
                          <div class="flex items-center text-[#497df6] font-semibold">
                            <div class="bg-[#497df6] w-3 h-3 rounded-full mr-2"></div>
                            Close
                          </div>
                        </div>
                        <div
                          class="bg-[#f0fcf4] w-fit py-1 px-4 rounded-3xl"
                          v-if="
                            child[nestedColumn.key] == 'approved' &&
                            nestedColumn.key == 'approval_status'
                          "
                        >
                          <div class="flex items-center text-[#84ccae] font-semibold">
                            <div class="bg-[#84ccae] w-3 h-3 rounded-full mr-2"></div>
                            Approved
                          </div>
                        </div>
                        <div
                          class="bg-[#f9e8e7] w-fit py-1 px-4 rounded-3xl"
                          v-if="
                            child[nestedColumn.key] == 'rejected' &&
                            nestedColumn.key == 'approval_status'
                          "
                        >
                          <div class="flex items-center text-[#e46b5c] font-semibold">
                            <div class="bg-[#e46b5c] w-3 h-3 rounded-full mr-2"></div>
                            Rejected
                          </div>
                        </div>
                        <div
                          class="bg-[#eef0f5] w-fit py-1 px-4 rounded-3xl"
                          v-if="
                            child[nestedColumn.key] == 'waiting' &&
                            nestedColumn.key == 'approval_status'
                          "
                        >
                          <div class="flex items-center text-[#0f2139] font-semibold">
                            <div class="bg-[#0f2139] w-3 h-3 rounded-full mr-2"></div>
                            Waiting
                          </div>
                        </div>
                        <div
                          class="bg-[#eef0f5] w-fit py-1 px-4 rounded-3xl"
                          v-if="
                            child[nestedColumn.key] == 'hold' &&
                            nestedColumn.key == 'approval_status'
                          "
                        >
                          <div class="flex items-center text-[#0f2139] font-semibold">
                            <div class="bg-[#0f2139] w-3 h-3 rounded-full mr-2"></div>
                            Hold
                          </div>
                        </div>
                      </template>
                    </td>
                    <td class="border-b px-4 py-2 flex justify-end" v-if="actionInrowNested.length">
                      <svg
                        width="16"
                        height="28"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        class="mr-3 cursor-pointer"
                        v-if="
                          actionInrowNested.includes('download') &&
                          (child.base64_pdf || child.base64_img)
                        "
                        @click="clickAction('DownloadNested', child)"
                      >
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M2 12C2 7.28595 2 4.92893 3.46447 3.46447C4.92893 2 7.28595 2 12 2C16.714 2 19.0711 2 20.5355 3.46447C22 4.92893 22 7.28595 22 12C22 16.714 22 19.0711 20.5355 20.5355C19.0711 22 16.714 22 12 22C7.28595 22 4.92893 22 3.46447 20.5355C2 19.0711 2 16.714 2 12ZM12 6.25C12.4142 6.25 12.75 6.58579 12.75 7V12.1893L14.4697 10.4697C14.7626 10.1768 15.2374 10.1768 15.5303 10.4697C15.8232 10.7626 15.8232 11.2374 15.5303 11.5303L12.5303 14.5303C12.3897 14.671 12.1989 14.75 12 14.75C11.8011 14.75 11.6103 14.671 11.4697 14.5303L8.46967 11.5303C8.17678 11.2374 8.17678 10.7626 8.46967 10.4697C8.76256 10.1768 9.23744 10.1768 9.53033 10.4697L11.25 12.1893V7C11.25 6.58579 11.5858 6.25 12 6.25ZM8 16.25C7.58579 16.25 7.25 16.5858 7.25 17C7.25 17.4142 7.58579 17.75 8 17.75H16C16.4142 17.75 16.75 17.4142 16.75 17C16.75 16.5858 16.4142 16.25 16 16.25H8Z"
                          fill="currentColor"
                        />
                      </svg>
                      <div
                        class="h-7"
                        v-if="
                          actionInrowNested.includes('download') &&
                          (!child.base64_pdf || !child.base64_img)
                        "
                      ></div>
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        class="mr-3 cursor-pointer"
                        v-if="actionInrowNested.includes('detail')"
                        @click="clickAction('DetailNested', child)"
                      >
                        <g opacity="0.5">
                          <path
                            d="M1.33325 4.6335C1.33325 4.04483 1.33325 3.75083 1.37992 3.5055C1.4794 2.97872 1.73534 2.49416 2.11435 2.11503C2.49336 1.7359 2.97784 1.47981 3.50459 1.38016C3.75059 1.3335 4.04525 1.3335 4.63325 1.3335C4.89058 1.3335 5.01992 1.3335 5.14392 1.34483C5.67795 1.39498 6.18444 1.60502 6.59725 1.9475C6.69325 2.02683 6.78392 2.1175 6.96658 2.30016L7.33325 2.66683C7.87725 3.21083 8.14925 3.48283 8.47458 3.6635C8.6534 3.76316 8.84309 3.8419 9.03992 3.89816C9.39859 4.00016 9.78325 4.00016 10.5519 4.00016H10.8013C12.5559 4.00016 13.4339 4.00016 14.0039 4.5135C14.0568 4.56016 14.1066 4.60994 14.1533 4.66283C14.6666 5.23283 14.6666 6.11083 14.6666 7.8655V9.3335C14.6666 11.8475 14.6666 13.1048 13.8853 13.8855C13.1039 14.6662 11.8473 14.6668 9.33325 14.6668H6.66658C4.15259 14.6668 2.89525 14.6668 2.11459 13.8855C1.33392 13.1042 1.33325 11.8475 1.33325 9.3335V4.6335Z"
                            fill="#012A4A"
                          />
                          <path
                            d="M1.33325 4.6335C1.33325 4.04483 1.33325 3.75083 1.37992 3.5055C1.4794 2.97872 1.73534 2.49416 2.11435 2.11503C2.49336 1.7359 2.97784 1.47981 3.50459 1.38016C3.75059 1.3335 4.04525 1.3335 4.63325 1.3335C4.89058 1.3335 5.01992 1.3335 5.14392 1.34483C5.67795 1.39498 6.18444 1.60502 6.59725 1.9475C6.69325 2.02683 6.78392 2.1175 6.96658 2.30016L7.33325 2.66683C7.87725 3.21083 8.14925 3.48283 8.47458 3.6635C8.6534 3.76316 8.84309 3.8419 9.03992 3.89816C9.39859 4.00016 9.78325 4.00016 10.5519 4.00016H10.8013C12.5559 4.00016 13.4339 4.00016 14.0039 4.5135C14.0568 4.56016 14.1066 4.60994 14.1533 4.66283C14.6666 5.23283 14.6666 6.11083 14.6666 7.8655V9.3335C14.6666 11.8475 14.6666 13.1048 13.8853 13.8855C13.1039 14.6662 11.8473 14.6668 9.33325 14.6668H6.66658C4.15259 14.6668 2.89525 14.6668 2.11459 13.8855C1.33392 13.1042 1.33325 11.8475 1.33325 9.3335V4.6335Z"
                            fill="black"
                            fill-opacity="0.2"
                          />
                        </g>
                        <path
                          d="M13.3334 4.15867C13.3334 3.96 13.33 3.842 13.3167 3.73867C13.2591 3.30223 13.0592 2.89699 12.7478 2.58577C12.4365 2.27455 12.0311 2.07474 11.5947 2.01733C11.4647 2 11.31 2 11 2H6.65869C6.73602 2.06933 6.82336 2.156 6.96669 2.3L7.33336 2.66667C7.87736 3.21067 8.14936 3.48267 8.47469 3.66333C8.65372 3.76304 8.84364 3.84178 9.04069 3.898C9.39869 4 9.78336 4 10.5527 4H10.8014C11.988 4 12.7727 4 13.3334 4.15867Z"
                          fill="#012A4A"
                        />
                        <path
                          d="M13.3334 4.15867C13.3334 3.96 13.33 3.842 13.3167 3.73867C13.2591 3.30223 13.0592 2.89699 12.7478 2.58577C12.4365 2.27455 12.0311 2.07474 11.5947 2.01733C11.4647 2 11.31 2 11 2H6.65869C6.73602 2.06933 6.82336 2.156 6.96669 2.3L7.33336 2.66667C7.87736 3.21067 8.14936 3.48267 8.47469 3.66333C8.65372 3.76304 8.84364 3.84178 9.04069 3.898C9.39869 4 9.78336 4 10.5527 4H10.8014C11.988 4 12.7727 4 13.3334 4.15867Z"
                          fill="black"
                          fill-opacity="0.2"
                        />
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M8.16675 6.6665C8.16675 6.5339 8.21943 6.40672 8.31319 6.31295C8.40696 6.21918 8.53414 6.1665 8.66675 6.1665H12.0001C12.1327 6.1665 12.2599 6.21918 12.3536 6.31295C12.4474 6.40672 12.5001 6.5339 12.5001 6.6665C12.5001 6.79911 12.4474 6.92629 12.3536 7.02006C12.2599 7.11383 12.1327 7.1665 12.0001 7.1665H8.66675C8.53414 7.1665 8.40696 7.11383 8.31319 7.02006C8.21943 6.92629 8.16675 6.79911 8.16675 6.6665Z"
                          fill="#012A4A"
                        />
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M8.16675 6.6665C8.16675 6.5339 8.21943 6.40672 8.31319 6.31295C8.40696 6.21918 8.53414 6.1665 8.66675 6.1665H12.0001C12.1327 6.1665 12.2599 6.21918 12.3536 6.31295C12.4474 6.40672 12.5001 6.5339 12.5001 6.6665C12.5001 6.79911 12.4474 6.92629 12.3536 7.02006C12.2599 7.11383 12.1327 7.1665 12.0001 7.1665H8.66675C8.53414 7.1665 8.40696 7.11383 8.31319 7.02006C8.21943 6.92629 8.16675 6.79911 8.16675 6.6665Z"
                          fill="black"
                          fill-opacity="0.2"
                        />
                      </svg>
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        class="cursor-pointer"
                        v-if="actionInrowNested.includes('delete')"
                        @click="clickAction('DeleteNested', child)"
                      >
                        <path d="M7 6H6V12H7V6Z" fill="#FE5F55" />
                        <path d="M10 6H9V12H10V6Z" fill="#FE5F55" />
                        <path
                          d="M2 3V4H3V14C3 14.2652 3.10536 14.5196 3.29289 14.7071C3.48043 14.8946 3.73478 15 4 15H12C12.2652 15 12.5196 14.8946 12.7071 14.7071C12.8946 14.5196 13 14.2652 13 14V4H14V3H2ZM4 14V4H12V14H4Z"
                          fill="#FE5F55"
                        />
                        <path d="M10 1H6V2H10V1Z" fill="#FE5F55" />
                      </svg>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </template>
      </tbody>
    </table>
    <div class="flex justify-end" v-if="showPagination">
      <PaginationField
        :totalItems="totalItems"
        :itemsPerPage="pagination.showPage"
        :currentPage="pagination.currentPage"
        :showPage="pagination.showPage"
        @update:currentPage="updatePagination('currentPage', $event)"
        @update:showPage="updatePagination('showPage', $event)"
      />
    </div>
  </div>
</template>
