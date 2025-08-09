<template>
  <div class="space-y-8">
    <!-- Header dengan gradient background -->
    <div class="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 text-white">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 class="text-2xl sm:text-3xl font-bold mb-2">⚙️ Pengaturan</h1>
          <p class="text-blue-100">Kelola pengaturan sistem dan konfigurasi</p>
        </div>
        <div class="mt-4 sm:mt-0 text-right">
          <div class="bg-white/20 rounded-lg px-4 py-2 backdrop-blur-sm">
            <span class="text-sm text-blue-100">Saldo:</span>
            <div class="text-xl font-bold">{{ formatCurrency(currentBalance) }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Configuration Cards Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">

      <!-- Payment Notification Testing Card -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div class="bg-gradient-to-r from-green-50 to-emerald-50 px-6 py-4 border-b border-gray-200">
          <div class="flex items-center">
            <div class="bg-green-100 rounded-lg p-2 mr-3">
              <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
              </svg>
            </div>
            <div>
              <h3 class="text-lg font-semibold text-gray-900">Payment Notification Testing</h3>
              <p class="text-sm text-gray-600">Test sistem notifikasi pembayaran</p>
            </div>
          </div>
        </div>

        <div class="p-6">
          <div class="bg-blue-50 rounded-lg p-4 mb-4">
            <div class="flex items-start">
              <div class="bg-blue-100 rounded p-1 mr-3">
                <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <div class="text-sm text-blue-800">
                <p class="font-medium">💡 Test Payment Notification</p>
                <p class="mt-1">Gunakan untuk memastikan sistem notifikasi pembayaran berfungsi dengan baik</p>
              </div>
            </div>
          </div>

          <button 
            @click="testPaymentNotification" 
            :disabled="isTestingPayment"
            class="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            <svg v-if="isTestingPayment" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <svg v-else class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            {{ isTestingPayment ? 'Testing...' : 'Test Payment Notification' }}
          </button>

          <p class="text-xs text-gray-500 mt-3 text-center">
            Pilih Siswa untuk Test
          </p>
        </div>
      </div>

      <!-- StarSender WhatsApp API Card -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div class="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
          <div class="flex items-center">
            <div class="bg-blue-100 rounded-lg p-2 mr-3">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
              </svg>
            </div>
            <div>
              <h3 class="text-lg font-semibold text-gray-900">StarSender WhatsApp API</h3>
              <p class="text-sm text-gray-600">Konfigurasi integrasi WhatsApp</p>
            </div>
          </div>
        </div>

        <div class="p-6">
          <div class="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
            <div class="flex items-start">
              <div class="bg-yellow-100 rounded p-1 mr-3">
                <svg class="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                </svg>
              </div>
              <div class="text-sm text-yellow-800">
                <p class="font-medium">⚠️ Supabase Proxy: Not Deployed</p>
                <p class="mt-1">WhatsApp integration coming soon</p>
              </div>
            </div>
          </div>

          <div class="mt-4 space-y-3">
            <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span class="text-sm font-medium text-gray-700">Status API</span>
              <span class="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                Pending Setup
              </span>
            </div>

            <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span class="text-sm font-medium text-gray-700">Proxy Status</span>
              <span class="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
                Not Deployed
              </span>
            </div>
          </div>

          <button 
            class="w-full mt-4 bg-gray-300 text-gray-500 font-medium py-3 px-4 rounded-lg cursor-not-allowed"
            disabled
          >
            <svg class="w-5 h-5 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
            </svg>
            Configuration Coming Soon
          </button>
        </div>
      </div>
    </div>

    <!-- Additional Settings Section -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div class="bg-gradient-to-r from-gray-50 to-slate-50 px-6 py-4 border-b border-gray-200">
        <div class="flex items-center">
          <div class="bg-gray-100 rounded-lg p-2 mr-3">
            <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"></path>
            </svg>
          </div>
          <div>
            <h3 class="text-lg font-semibold text-gray-900">⚙️ Konfigurasi Sistem</h3>
            <p class="text-sm text-gray-600">Pengaturan umum sistem manajemen kas</p>
          </div>
        </div>
      </div>

      <div class="p-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- System Info -->
          <div class="space-y-4">
            <h4 class="font-medium text-gray-900 border-b border-gray-200 pb-2">📊 Informasi Sistem</h4>

            <div class="space-y-3">
              <div class="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                <span class="text-sm font-medium text-blue-900">Versi Aplikasi</span>
                <span class="text-sm text-blue-700 font-mono">v1.0.0</span>
              </div>

              <div class="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <span class="text-sm font-medium text-green-900">Status Database</span>
                <span class="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                  ✅ Connected
                </span>
              </div>

              <div class="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                <span class="text-sm font-medium text-purple-900">Environment</span>
                <span class="text-sm text-purple-700 font-mono">Development</span>
              </div>
            </div>
          </div>

          <!-- Quick Actions -->
          <div class="space-y-4">
            <h4 class="font-medium text-gray-900 border-b border-gray-200 pb-2">🚀 Quick Actions</h4>

            <div class="space-y-3">
              <button 
                @click="exportData" 
                :disabled="isExporting"
                class="w-full text-left p-3 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors duration-200 border border-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div class="flex items-center">
                  <svg v-if="isExporting" class="animate-spin w-5 h-5 text-indigo-600 mr-3" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <svg v-else class="w-5 h-5 text-indigo-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                  <div>
                    <div class="text-sm font-medium text-indigo-900">
                      {{ isExporting ? 'Exporting...' : 'Export Data' }}
                    </div>
                    <div class="text-xs text-indigo-600">Backup semua data sistem</div>
                  </div>
                </div>
              </button>

              <button 
                @click="syncData" 
                :disabled="isSyncing"
                class="w-full text-left p-3 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors duration-200 border border-orange-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div class="flex items-center">
                  <svg v-if="isSyncing" class="animate-spin w-5 h-5 text-orange-600 mr-3" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <svg v-else class="w-5 h-5 text-orange-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                  </svg>
                  <div>
                    <div class="text-sm font-medium text-orange-900">
                      {{ isSyncing ? 'Syncing...' : 'Sync Data' }}
                    </div>
                    <div class="text-xs text-orange-600">Sinkronisasi dengan server</div>
                  </div>
                </div>
              </button>

              <button 
                @click="clearCache" 
                :disabled="isClearing"
                class="w-full text-left p-3 bg-red-50 hover:bg-red-100 rounded-lg transition-colors duration-200 border border-red-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div class="flex items-center">
                  <svg v-if="isClearing" class="animate-spin w-5 h-5 text-red-600 mr-3" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <svg v-else class="w-5 h-5 text-red-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                  </svg>
                  <div>
                    <div class="text-sm font-medium text-red-900">
                      {{ isClearing ? 'Clearing...' : 'Clear Cache' }}
                    </div>
                    <div class="text-xs text-red-600">Bersihkan cache aplikasi</div>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- PaymentNotificationTester Component -->
    <PaymentNotificationTester v-if="showTester" @close="showTester = false" />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAppStore } from '@/stores'
import { useToast } from 'vue-toastification'
import PaymentNotificationTester from '@/components/PaymentNotificationTester.vue'

const store = useAppStore()
const toast = useToast()

const isTestingPayment = ref(false)
const showTester = ref(false)
const isExporting = ref(false)
const isSyncing = ref(false)
const isClearing = ref(false)

const currentBalance = computed(() => store.currentBalance || 0)

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount)
}

const testPaymentNotification = async () => {
  isTestingPayment.value = true

  try {
    // Simulate testing delay
    await new Promise(resolve => setTimeout(resolve, 1500))

    showTester.value = true
    toast.success('Payment notification tester opened!')
  } catch (error) {
    toast.error('Failed to open payment notification tester')
    console.error('Error:', error)
  } finally {
    isTestingPayment.value = false
  }
}

const exportData = async () => {
  isExporting.value = true

  try {
    // Get all data from store
    const data = {
      students: store.students,
      transactions: store.transactions,
      expenses: store.expenses,
      paymentLinks: store.paymentLinks,
      exportDate: new Date().toISOString(),
      version: '1.0.0'
    }

    // Create and download JSON file
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `kas-kelas-backup-${new Date().toISOString().slice(0, 10)}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    toast.success('✅ Data berhasil diekspor!')
  } catch (error) {
    toast.error('❌ Gagal mengekspor data')
    console.error('Export error:', error)
  } finally {
    isExporting.value = false
  }
}

const syncData = async () => {
  isSyncing.value = true

  try {
    // Refresh all data from store
    await Promise.all([
      store.fetchStudents(),
      store.fetchTransactions(),
      store.fetchExpenses(),
      store.fetchPaymentLinks()
    ])

    toast.success('🔄 Data berhasil disinkronisasi!')
  } catch (error) {
    toast.error('❌ Gagal menyinkronkan data')
    console.error('Sync error:', error)
  } finally {
    isSyncing.value = false
  }
}

const clearCache = async () => {
  isClearing.value = true

  try {
    // Clear localStorage cache (except important settings)
    const keysToKeep = ['user_session', 'user_preferences']
    const allKeys = Object.keys(localStorage)
    
    allKeys.forEach(key => {
      if (!keysToKeep.includes(key)) {
        localStorage.removeItem(key)
      }
    })

    // Clear sessionStorage
    sessionStorage.clear()

    // Simulate clearing process
    await new Promise(resolve => setTimeout(resolve, 1000))

    toast.success('🗑️ Cache berhasil dibersihkan!')
    
    // Refresh page after a short delay
    setTimeout(() => {
      window.location.reload()
    }, 1500)
  } catch (error) {
    toast.error('❌ Gagal membersihkan cache')
    console.error('Clear cache error:', error)
  } finally {
    isClearing.value = false
  }
}
</script>
