<script setup>
import { ref, watch } from 'vue'

const props = defineProps(['base64'])

const pdfUrl = ref(null)

watch(
  () => props.base64,
  (val) => {
    if (val) {
      const byteCharacters = atob(val)
      const byteNumbers = new Array(byteCharacters.length)
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i)
      }
      const byteArray = new Uint8Array(byteNumbers)
      const blob = new Blob([byteArray], { type: 'application/pdf' })
      pdfUrl.value = URL.createObjectURL(blob)
    } else {
      pdfUrl.value = null
    }
  },
  { immediate: true },
)
</script>
<template>
  <div class="w-full h-full">
    <iframe v-if="pdfUrl" :src="pdfUrl" class="w-full h-[80vh] border rounded" frameborder="0" />
    <p v-else class="text-gray-500">No PDF to display.</p>
  </div>
</template>
