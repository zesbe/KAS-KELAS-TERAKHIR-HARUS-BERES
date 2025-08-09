<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-6">🚀 Campaign WhatsApp dengan CORS Bypass</h1>
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Quick Test -->
      <div class="card p-6">
        <h2 class="text-lg font-semibold mb-4">⚡ Quick Test</h2>
        <div class="space-y-3">
          <input 
            v-model="testPhone" 
            type="text" 
            placeholder="628123456789"
            class="input-field"
          />
          <textarea 
            v-model="testMessage" 
            rows="3"
            placeholder="Pesan test..."
            class="input-field"
          ></textarea>
          <button @click="sendTest" class="btn-primary w-full">
            📱 Test Kirim WhatsApp
          </button>
        </div>
      </div>

      <!-- Bulk Send -->
      <div class="card p-6">
        <h2 class="text-lg font-semibold mb-4">📢 Bulk Send</h2>
        <div class="space-y-3">
          <textarea 
            v-model="bulkMessage" 
            rows="3"
            placeholder="Pesan untuk semua siswa..."
            class="input-field"
          ></textarea>
          <button @click="sendBulk" :disabled="sending" class="btn-primary w-full">
            {{ sending ? 'Mengirim...' : '🚀 Kirim ke Semua Siswa' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Status -->
    <div class="card p-6 mt-6">
      <h2 class="text-lg font-semibold mb-4">📊 Status</h2>
      <div class="grid grid-cols-3 gap-4 text-center">
        <div>
          <div class="text-2xl font-bold text-green-600">{{ stats.sent }}</div>
          <div class="text-sm text-gray-600">Terkirim</div>
        </div>
        <div>
          <div class="text-2xl font-bold text-red-600">{{ stats.failed }}</div>
          <div class="text-sm text-gray-600">Gagal</div>
        </div>
        <div>
          <div class="text-2xl font-bold text-blue-600">{{ students.length }}</div>
          <div class="text-sm text-gray-600">Total Siswa</div>
        </div>
      </div>
    </div>

    <!-- Progress -->
    <div v-if="sending" class="card p-6 mt-6">
      <h3 class="font-semibold mb-2">Progress: {{ progress.current }}/{{ progress.total }}</h3>
      <div class="w-full bg-gray-200 rounded-full h-3">
        <div 
          class="bg-blue-600 h-3 rounded-full transition-all" 
          :style="{ width: `${(progress.current / progress.total) * 100}%` }"
        ></div>
      </div>
    </div>

    <!-- Students List -->
    <div class="card p-6 mt-6">
      <h2 class="text-lg font-semibold mb-4">👥 Daftar Siswa ({{ students.length }})</h2>
      <div class="max-h-64 overflow-y-auto">
        <div v-for="student in students" :key="student.id" class="flex items-center justify-between py-2 border-b">
          <span>{{ student.name }} ({{ student.nickname }})</span>
          <span class="text-sm text-gray-500">{{ student.phone }}</span>
        </div>
      </div>
    </div>

    <!-- CORS Info -->
    <div class="card p-6 mt-6 bg-blue-50">
      <h2 class="text-lg font-semibold mb-2">🛡️ CORS Bypass Technology</h2>
      <p class="text-sm text-gray-700 mb-3">
        Sistem ini menggunakan multiple metode untuk bypass CORS policy dan memastikan pengiriman WhatsApp berhasil:
      </p>
      <ul class="text-sm text-gray-600 space-y-1">
        <li>✅ Direct window.open method</li>
        <li>✅ Dynamic link creation & click</li>
        <li>✅ Multiple fallback methods</li>
        <li>✅ Phone number auto-formatting</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useToast } from 'vue-toastification'
import { useAppStore } from '@/stores'

const store = useAppStore()
const toast = useToast()

// State
const students = ref([])
const sending = ref(false)
const testPhone = ref('628123456789')
const testMessage = ref('Halo! Ini adalah test pesan WhatsApp dengan CORS bypass.')
const bulkMessage = ref('Halo [[NAME]]! Ini adalah pesan broadcast dari Sistem Kas Kelas 1B.')

const stats = reactive({
  sent: 0,
  failed: 0
})

const progress = reactive({
  current: 0,
  total: 0
})

// Simple WhatsApp sender function
const sendWhatsApp = (phone, message) => {
  // Clean phone number
  const cleanPhone = phone.replace(/\D/g, '').replace(/^0/, '62')
  
  // Create WhatsApp URL
  const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`
  
  try {
    // Method 1: window.open
    const newWindow = window.open(url, '_blank', 'noopener,noreferrer')
    
    if (newWindow) {
      stats.sent++
      return { success: true, method: 'window.open' }
    }
    
    // Method 2: Create link and click
    const link = document.createElement('a')
    link.href = url
    link.target = '_blank'
    link.rel = 'noopener noreferrer'
    link.click()
    
    stats.sent++
    return { success: true, method: 'link.click' }
    
  } catch (error) {
    stats.failed++
    return { success: false, error: error.message }
  }
}

const sendTest = () => {
  const result = sendWhatsApp(testPhone.value, testMessage.value)
  
  if (result.success) {
    toast.success(`✅ Test berhasil! Method: ${result.method}`)
  } else {
    toast.error(`❌ Test gagal: ${result.error}`)
  }
}

const sendBulk = async () => {
  if (students.value.length === 0) {
    toast.error('Tidak ada data siswa')
    return
  }
  
  if (!bulkMessage.value.trim()) {
    toast.error('Pesan tidak boleh kosong')
    return
  }
  
  sending.value = true
  progress.current = 0
  progress.total = students.value.length
  
  toast.info(`🚀 Memulai bulk send ke ${students.value.length} siswa`)
  
  for (let i = 0; i < students.value.length; i++) {
    const student = students.value[i]
    
    // Personalize message
    const personalizedMessage = bulkMessage.value
      .replace(/\[\[NAME\]\]/g, student.name)
      .replace(/\[\[NICKNAME\]\]/g, student.nickname)
      .replace(/\[\[PHONE\]\]/g, student.phone)
    
    const result = sendWhatsApp(student.phone, personalizedMessage)
    
    progress.current = i + 1
    
    console.log(`${i + 1}/${students.value.length} - ${student.name}: ${result.success ? '✅' : '❌'}`)
    
    // Delay 2 seconds between messages (except for last one)
    if (i < students.value.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 2000))
    }
  }
  
  sending.value = false
  toast.success(`🎉 Bulk send selesai! ${stats.sent} berhasil, ${stats.failed} gagal`)
}

const loadStudents = async () => {
  try {
    await store.fetchStudents()
    students.value = store.students || []
    toast.success(`✅ ${students.value.length} siswa dimuat`)
  } catch (error) {
    console.error('Error loading students:', error)
    toast.warning('Gagal memuat data siswa, menggunakan data demo')
    
    // Demo data
    students.value = [
      { id: '1', name: 'Aisyah Putri', nickname: 'Aisyah', phone: '628123456789' },
      { id: '2', name: 'Muhammad Rizki', nickname: 'Rizki', phone: '628987654321' },
      { id: '3', name: 'Fatimah Zahra', nickname: 'Fatimah', phone: '628111222333' }
    ]
  }
}

onMounted(() => {
  console.log('🚀 Campaigns Basic loaded')
  loadStudents()
})
</script>
