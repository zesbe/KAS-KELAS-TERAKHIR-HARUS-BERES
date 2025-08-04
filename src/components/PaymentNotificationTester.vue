<template>
  <div class="border rounded-lg p-4 bg-blue-50">
    <h4 class="font-medium text-blue-900 mb-3">🧪 Test Payment Notification</h4>
    
    <div class="space-y-3">
      <div>
        <label class="block text-sm font-medium text-gray-700">
          Pilih Siswa untuk Test
        </label>
        <select v-model="selectedStudentId" class="input-field">
          <option value="">-- Pilih Siswa --</option>
          <option v-for="student in students" :key="student.id" :value="student.id">
            {{ student.name }} ({{ student.nickname }}) - {{ student.phone }}
          </option>
        </select>
      </div>
      
      <div>
        <label class="block text-sm font-medium text-gray-700">
          Jumlah Pembayaran Test
        </label>
        <input
          v-model="testAmount"
          type="number"
          min="1000"
          step="1000"
          class="input-field"
          placeholder="50000"
        />
      </div>
      
      <div class="flex space-x-2">
        <button
          @click="sendTestNotification"
          :disabled="!selectedStudentId || testing"
          class="btn-primary flex-1"
        >
          {{ testing ? 'Mengirim...' : '🚀 Test Notifikasi' }}
        </button>
        
        <button
          @click="simulateWebhook"
          :disabled="!selectedStudentId || simulating"
          class="btn-secondary flex-1"
        >
          {{ simulating ? 'Simulasi...' : '📡 Simulasi Webhook' }}
        </button>
      </div>
    </div>
    
    <!-- Test Results -->
    <div v-if="testResults.length > 0" class="mt-4 space-y-2">
      <h5 class="font-medium text-gray-900">📋 Test Results:</h5>
      <div 
        v-for="result in testResults" 
        :key="result.id"
        :class="[
          'text-sm p-2 rounded',
          result.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        ]"
      >
        <span class="font-medium">{{ result.timestamp }}:</span> {{ result.message }}
      </div>
    </div>
    
    <!-- Webhook URL Info -->
    <div class="mt-4 p-3 bg-white rounded border">
      <h5 class="font-medium text-gray-900 mb-2">📡 Webhook URL untuk PakaSir:</h5>
      <div class="text-xs font-mono bg-gray-100 p-2 rounded break-all">
        {{ webhookUrl }}
      </div>
      <p class="text-xs text-gray-600 mt-1">
        Gunakan URL ini sebagai webhook endpoint di dashboard PakaSir
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useToast } from 'vue-toastification'
import paymentNotificationService from '@/services/paymentNotificationService'
import { useAppStore } from '@/stores'

const props = defineProps({
  students: {
    type: Array,
    default: () => []
  }
})

const store = useAppStore()
const toast = useToast()

const selectedStudentId = ref('')
const testAmount = ref(50000)
const testing = ref(false)
const simulating = ref(false)
const testResults = ref([])

const webhookUrl = computed(() => {
  return `${window.location.origin}/webhook/payment`
})

// Send test notification directly
const sendTestNotification = async () => {
  if (!selectedStudentId.value) {
    toast.error('Pilih siswa terlebih dahulu')
    return
  }

  try {
    testing.value = true
    
    const result = await paymentNotificationService.testPaymentNotification(
      selectedStudentId.value,
      parseInt(testAmount.value)
    )
    
    if (result.success) {
      addTestResult(true, `✅ ${result.message}`)
      toast.success('Test notification berhasil dikirim!')
    }
    
  } catch (error) {
    console.error('Test notification error:', error)
    addTestResult(false, `❌ Error: ${error.message}`)
    toast.error('Gagal mengirim test notification')
  } finally {
    testing.value = false
  }
}

// Simulate complete webhook flow
const simulateWebhook = async () => {
  if (!selectedStudentId.value) {
    toast.error('Pilih siswa terlebih dahulu')
    return
  }

  try {
    simulating.value = true
    
    const student = props.students.find(s => s.id === selectedStudentId.value)
    if (!student) {
      throw new Error('Student not found')
    }

    // Create mock payment link first
    const mockOrderId = `TEST${Date.now()}${Math.random().toString(36).substr(2, 6).toUpperCase()}`
    
    const paymentLinkData = {
      id: `pl_test_${Date.now()}`,
      student_id: selectedStudentId.value,
      order_id: mockOrderId,
      payment_url: `https://pakasir.zone.id/pay/test/${testAmount.value}?order_id=${mockOrderId}`,
      amount: parseInt(testAmount.value),
      description: 'Test Payment - Kas Kelas',
      status: 'pending',
      campaign_id: 'test_campaign',
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    }

    // Store payment link
    await paymentNotificationService.storePaymentLink(paymentLinkData)
    addTestResult(true, `💳 Payment link created: ${mockOrderId}`)

    // Simulate webhook payload
    const webhookData = {
      order_id: mockOrderId,
      amount: parseInt(testAmount.value),
      payment_method: 'qris',
      status: 'completed',
      completed_at: new Date().toISOString(),
      project: 'uang-kas-kelas-1-ibnu-sina'
    }

    // Process webhook
    const result = await paymentNotificationService.processPaymentWebhook(webhookData)
    
    if (result.success) {
      addTestResult(true, `🎉 Webhook processed successfully for ${result.student.name}`)
      addTestResult(true, `📱 WhatsApp notification sent to ${student.phone}`)
      toast.success('Simulasi webhook lengkap berhasil!')
    }
    
  } catch (error) {
    console.error('Webhook simulation error:', error)
    addTestResult(false, `❌ Webhook simulation error: ${error.message}`)
    toast.error('Simulasi webhook gagal')
  } finally {
    simulating.value = false
  }
}

// Add test result to log
const addTestResult = (success, message) => {
  testResults.value.unshift({
    id: Date.now(),
    success,
    message,
    timestamp: new Date().toLocaleTimeString('id-ID')
  })
  
  // Keep only last 10 results
  if (testResults.value.length > 10) {
    testResults.value = testResults.value.slice(0, 10)
  }
}

// Get payment statistics
const getStats = async () => {
  try {
    const stats = await paymentNotificationService.getPaymentStatistics()
    addTestResult(true, `📊 Stats: ${stats.completedPayments}/${stats.totalLinks} payments (${stats.conversionRate}%)`)
  } catch (error) {
    addTestResult(false, `❌ Failed to get stats: ${error.message}`)
  }
}

onMounted(() => {
  addTestResult(true, '🧪 Payment Notification Tester ready')
  getStats()
})
</script>
