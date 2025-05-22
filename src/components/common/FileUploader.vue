<script setup>
import { ref } from 'vue'

const props = defineProps({
  label: { type: String, default: 'Upload Files' },
  maxFiles: { type: Number, default: 1 },
  allowedTypes: { type: Array, default: () => ['application/pdf'] },
})

const files = ref([])
const fileInput = ref(null)
const errorMessage = ref('')
const emit = defineEmits(['change'])

const triggerFileInput = () => {
  fileInput.value.click()
}

const handleFileChange = (event) => {
  const selectedFiles = Array.from(event.target.files)
  processFiles(selectedFiles)
}

const handleDrop = (event) => {
  event.preventDefault()
  const droppedFiles = Array.from(event.dataTransfer.files)
  processFiles(droppedFiles)
}

function base64ToBlob(base64, mime = 'text/csv') {
  const byteString = atob(base64.split(',')[1]) // strip the "data:" prefix
  const ab = new ArrayBuffer(byteString.length)
  const ia = new Uint8Array(ab)
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i)
  }
  return new Blob([ab], { type: mime })
}

const processFiles = (selectedFiles) => {
  errorMessage.value = ''

  if (files.value.length + selectedFiles.length > props.maxFiles) {
    errorMessage.value = `You can only upload up to ${props.maxFiles} files.`
    return
  }

  selectedFiles.forEach((file) => {
    if (!props.allowedTypes.includes(file.type)) {
      errorMessage.value = `Invalid file type! Allowed types: ${props.allowedTypes.join(', ')}`
      return
    }

    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      files.value.push({
        name: file.name,
        base64: reader.result.split(',')[1],
        size: file.size,
        type: file.type,
        blob: base64ToBlob(reader.result, 'text/csv'),
      })
      emit('change', files.value)
    }
  })
}

const removeFile = (index) => {
  files.value.splice(index, 1)
  errorMessage.value = ''
  emit('change', files.value)
}

const insertFileFromBase64 = (base64String, fileName, mimeType) => {
  const byteCharacters = atob(base64String)
  const byteNumbers = new Array(byteCharacters.length)
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i)
  }
  const byteArray = new Uint8Array(byteNumbers)
  const fileBlob = new Blob([byteArray], { type: mimeType })

  const file = new File([fileBlob], fileName, { type: mimeType })

  processFiles([file])
}

function clearFiles() {
  files.value = []
}

defineExpose({ files, insertFileFromBase64, clearFiles })
</script>

<template>
  <div>
    <!-- Label (Customizable via Props) -->
    <label for="file-upload" v-if="label">
      {{ label }}
    </label>

    <!-- File Upload Box -->
    <div
      class="border-2 border-dashed border-gray-300 rounded-lg p-6 flex mt-3 flex-col items-center justify-center cursor-pointer bg-gray-100 hover:bg-gray-200 transition"
      @dragover.prevent
      @drop="handleDrop"
      @click="triggerFileInput"
    >
      <input
        id="file-upload"
        type="file"
        ref="fileInput"
        class="hidden"
        @change="handleFileChange"
        multiple
        :accept="allowedTypes ? allowedTypes.join(',') : ''"
      />
      <p class="text-gray-600 text-sm">Drag & Drop files here or Click to upload</p>
    </div>

    <!-- Uploaded Files List -->
    <div v-if="files.length" class="mt-4 space-y-2">
      <div
        v-for="(file, index) in files"
        :key="index"
        class="flex items-center justify-between bg-white p-2 rounded-lg shadow-md"
      >
        <span class="text-gray-800 truncate">{{ file.name }}</span>
        <button
          @click="removeFile(index)"
          class="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition"
        >
          Delete
        </button>
      </div>
    </div>

    <!-- Error Message -->
    <p v-if="errorMessage" class="text-red-500 text-sm mt-2">
      {{ errorMessage }}
    </p>
  </div>
</template>
