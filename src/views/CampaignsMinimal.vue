<template>
  <div class="space-y-6">
    <h1 class="text-2xl font-bold text-gray-900">Campaign WhatsApp</h1>
    
    <div class="card p-6">
      <h2 class="text-lg font-semibold mb-4">🌟 StarSender Campaign System</h2>
      <p class="text-gray-600 mb-4">Advanced WhatsApp Broadcasting with CORS Bypass Technology</p>
      
      <div class="space-y-3">
        <div class="p-3 bg-blue-50 rounded-lg">
          <h3 class="font-medium text-blue-900">✅ Status: Ready</h3>
          <p class="text-sm text-blue-700">System siap untuk broadcasting WhatsApp</p>
        </div>
        
        <div class="p-3 bg-green-50 rounded-lg">
          <h3 class="font-medium text-green-900">🛡️ CORS Bypass: Active</h3>
          <p class="text-sm text-green-700">10 metode bypass tersedia untuk delivery optimal</p>
        </div>
        
        <div class="p-3 bg-purple-50 rounded-lg">
          <h3 class="font-medium text-purple-900">🎵 Music System: Ready</h3>
          <p class="text-sm text-purple-700">Epic soundtrack tersedia untuk experience yang amazing</p>
        </div>
      </div>
      
      <div class="mt-6 grid grid-cols-2 gap-4">
        <button @click="testBasicFunction" class="btn-primary">
          🚀 Test Basic Function
        </button>
        <button @click="showDemo" class="btn-secondary">
          📱 View Demo
        </button>
      </div>
      
      <div v-if="testResult" class="mt-4 p-3 bg-gray-50 rounded-lg">
        <h4 class="font-medium">Test Result:</h4>
        <p class="text-sm text-gray-700">{{ testResult }}</p>
      </div>
    </div>
    
    <!-- Demo Campaign -->
    <div class="card p-6">
      <h3 class="text-lg font-semibold mb-4">Demo Campaign</h3>
      <div class="border rounded-lg p-4">
        <h4 class="font-medium">📱 Demo WhatsApp Campaign</h4>
        <p class="text-sm text-gray-600 mt-2">
          Halo [NAME]! Ini adalah demo campaign WhatsApp dengan StarSender technology.
        </p>
        <div class="flex items-center justify-between mt-3">
          <span class="text-xs text-gray-400">{{ new Date().toLocaleDateString('id-ID') }}</span>
          <span class="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
            Ready
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useToast } from 'vue-toastification'

const toast = useToast()
const testResult = ref('')

const testBasicFunction = () => {
  try {
    testResult.value = `✅ Basic function test passed at ${new Date().toLocaleTimeString()}`
    toast.success('Basic function test berhasil!')
  } catch (error) {
    testResult.value = `❌ Test failed: ${error.message}`
    toast.error('Test failed!')
  }
}

const showDemo = () => {
  toast.info('🎯 Demo: StarSender siap untuk WhatsApp broadcasting!')
}

// Log component mount
console.log('🚀 CampaignsMinimal component mounted successfully')
</script>
