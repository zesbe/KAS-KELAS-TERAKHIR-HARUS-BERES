<template>
  <div class="space-y-6">
    <!-- Header -->
    <div>
      <h1 class="text-xl sm:text-2xl font-semibold text-gray-900">Pengaturan</h1>
      <p class="text-sm text-gray-500 mt-1">Kelola pengaturan sistem dan konfigurasi</p>
    </div>

    <!-- Simple test content -->
    <div class="card p-4 sm:p-6">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">Test Settings Page</h3>
      <p>This is a test settings page to verify if basic Vue component rendering works.</p>
      <button class="btn-primary mt-4">Test Button</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const testValue = ref('Settings page is working!')
</script>
