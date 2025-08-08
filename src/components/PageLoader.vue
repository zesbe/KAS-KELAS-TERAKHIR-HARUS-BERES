<template>
  <div v-if="loading" class="fixed inset-0 z-40 bg-white bg-opacity-75 flex items-center justify-center">
    <div class="text-center">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-2"></div>
      <p class="text-gray-600 text-sm">{{ message || 'Memuat...' }}</p>
    </div>
  </div>
  
  <div v-else class="min-h-0">
    <slot />
  </div>
</template>

<script setup>
defineProps({
  loading: {
    type: Boolean,
    default: false
  },
  message: {
    type: String,
    default: ''
  }
})
</script>
