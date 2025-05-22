<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  tabs: {
    type: Array,
    required: true,
    default: () => [],
  },
  initialActiveTab: {
    type: String,
  },
  type: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['tab-change'])

const activeTab = ref(props.initialActiveTab)

function setActiveTab(index) {
  activeTab.value = index
  emit('tab-change', index)
}

watch(
  () => props.initialActiveTab,
  (newValue) => {
    activeTab.value = newValue
  },
)
</script>

<template>
  <nav class="flex space-x-5 w-fit bg-white p-3 rounded-md">
    <button
      v-for="(tab, index) in tabs"
      :key="index"
      @click="setActiveTab(tab.name)"
      class="px-4 py-2 flex items-center hover:text-yellow hover:bg-foreground"
      :class="{
        'rounded-md': type != 'default',
        'bg-foreground text-yellow': activeTab === tab.name && type != 'default',
        'border-b-[2px] border-foreground': activeTab === tab.name && type == 'default',
      }"
    >
      <div v-html="tab.icon" class="mr-2"></div>
      {{ tab.name }}
    </button>
  </nav>
  <div class="mt-4">
    <slot name="tab-content" :active-tab="activeTab"></slot>
  </div>
</template>
