<template>
  <div v-if="hasError" class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="max-w-md mx-auto text-center p-6">
      <div class="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <ExclamationTriangleIcon class="w-10 h-10 text-red-600" />
      </div>
      <h1 class="text-2xl font-semibold text-gray-900 mb-2">Terjadi Kesalahan</h1>
      <p class="text-gray-600 mb-6">{{ errorMessage || 'Halaman tidak dapat dimuat dengan benar.' }}</p>
      
      <div class="space-y-3">
        <button 
          @click="retry" 
          class="w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          Coba Lagi
        </button>
        <button 
          @click="goHome" 
          class="w-full px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
        >
          Kembali ke Dashboard
        </button>
      </div>
      
      <details v-if="errorDetails" class="mt-6 text-left">
        <summary class="cursor-pointer text-sm text-gray-500 hover:text-gray-700">Detail Error</summary>
        <pre class="mt-2 text-xs bg-gray-100 p-3 rounded overflow-auto">{{ errorDetails }}</pre>
      </details>
    </div>
  </div>
  
  <slot v-else />
</template>

<script setup>
import { ref, onErrorCaptured } from 'vue'
import { useRouter } from 'vue-router'
import { ExclamationTriangleIcon } from '@heroicons/vue/24/outline'

const router = useRouter()

const hasError = ref(false)
const errorMessage = ref('')
const errorDetails = ref('')

const emit = defineEmits(['error'])

onErrorCaptured((error, instance, info) => {
  console.error('Error captured by boundary:', error, info)
  
  hasError.value = true
  errorMessage.value = error.message || 'Terjadi kesalahan yang tidak diketahui'
  errorDetails.value = `${error.stack}\n\nInfo: ${info}`
  
  emit('error', { error, instance, info })
  
  // Prevent the error from propagating further
  return false
})

const retry = () => {
  hasError.value = false
  errorMessage.value = ''
  errorDetails.value = ''
  
  // Refresh the current route
  router.go(0)
}

const goHome = () => {
  hasError.value = false
  errorMessage.value = ''
  errorDetails.value = ''
  
  router.push('/')
}

// Expose methods for manual error handling
defineExpose({
  setError: (error) => {
    hasError.value = true
    errorMessage.value = error.message || 'Terjadi kesalahan'
    errorDetails.value = error.stack || error.toString()
  },
  clearError: () => {
    hasError.value = false
    errorMessage.value = ''
    errorDetails.value = ''
  }
})
</script>
