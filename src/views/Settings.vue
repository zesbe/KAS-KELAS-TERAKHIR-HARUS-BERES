<template>
  <div class="space-y-6">
    <!-- Header -->
    <div>
      <h1 class="text-xl sm:text-2xl font-semibold text-gray-900">Pengaturan</h1>
      <p class="text-sm text-gray-500 mt-1">Kelola pengaturan sistem dan konfigurasi</p>
    </div>

    <!-- API Configuration -->
    <div class="card p-4 sm:p-6">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">Konfigurasi API</h3>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <!-- StarSender Configuration -->
        <div class="space-y-4">
          <h4 class="font-medium text-gray-900">StarSender WhatsApp API</h4>

          <!-- Proxy Status -->
          <div class="rounded-lg p-3" :class="edgeFunctionStatus.available ? 'bg-green-50 border border-green-200' : 'bg-yellow-50 border border-yellow-200'">
            <div class="flex items-center">
              <CheckCircleIcon v-if="edgeFunctionStatus.available" class="h-4 w-4 text-green-400 mr-2" />
              <ExclamationTriangleIcon v-else class="h-4 w-4 text-yellow-400 mr-2" />
              <span class="text-sm font-medium" :class="edgeFunctionStatus.available ? 'text-green-800' : 'text-yellow-800'">
                Supabase Proxy: {{ edgeFunctionStatus.available ? 'Active' : 'Not Deployed' }}
              </span>
            </div>
            <p class="text-xs mt-1" :class="edgeFunctionStatus.available ? 'text-green-700' : 'text-yellow-700'">
              {{ edgeFunctionStatus.message }}
            </p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Device API Key</label>
            <div class="flex items-center space-x-2">
              <input 
                v-model="settings.starsender.deviceApiKey"
                :type="showKeys.device ? 'text' : 'password'"
                class="input-field flex-1"
                placeholder="Masukkan Device API Key"
              />
              <button
                @click="showKeys.device = !showKeys.device"
                class="btn-secondary p-2 flex-shrink-0"
              >
                <EyeIcon v-if="!showKeys.device" class="w-4 h-4" />
                <EyeSlashIcon v-else class="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <button @click="testStarSender" :disabled="testing.starsender" class="btn-primary">
            {{ testing.starsender ? 'Testing...' : 'Test Configuration' }}
          </button>

          <div class="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs">
            <p class="text-blue-800 mb-2">
              <strong>Supabase Edge Function Proxy:</strong>
            </p>
            <ul class="text-blue-700 space-y-1 list-disc list-inside">
              <li>Mengatasi CORS issues dengan proxy server</li>
              <li>Aman: API Key disimpan sebagai environment variable di Edge Function</li>
              <li>Tidak perlu kirim API Key dari frontend</li>
              <li>Server-side processing yang reliable</li>
              <li>Setup: <code>supabase secrets set STARSENDER_DEVICE_API_KEY=your-key</code></li>
              <li>Deploy: <code>supabase functions deploy starsender-proxy</code></li>
            </ul>
          </div>
        </div>

        <!-- Supabase Configuration -->
        <div class="space-y-4">
          <h4 class="font-medium text-gray-900">Supabase Database</h4>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Supabase URL</label>
            <input 
              v-model="settings.supabase.url"
              type="url"
              class="input-field"
              placeholder="https://xxx.supabase.co"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Supabase Anon Key</label>
            <div class="flex items-center space-x-2">
              <input 
                v-model="settings.supabase.anonKey"
                :type="showKeys.supabase ? 'text' : 'password'"
                class="input-field flex-1"
                placeholder="Masukkan Anon Key"
              />
              <button 
                @click="showKeys.supabase = !showKeys.supabase"
                class="btn-secondary p-2"
              >
                <EyeIcon v-if="!showKeys.supabase" class="w-4 h-4" />
                <EyeSlashIcon v-else class="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <button @click="testSupabase" :disabled="testing.supabase" class="btn-primary">
            {{ testing.supabase ? 'Testing...' : 'Test Koneksi' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Database Setup -->
    <div class="card p-6">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">Database Setup</h3>

      <!-- Connection Status -->
      <div class="mb-4 p-4 rounded-lg" :class="dbStatus.connected ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <CheckCircleIcon v-if="dbStatus.connected" class="h-5 w-5 text-green-400" />
            <ExclamationTriangleIcon v-else class="h-5 w-5 text-red-400" />
          </div>
          <div class="ml-3">
            <h4 class="text-sm font-medium" :class="dbStatus.connected ? 'text-green-800' : 'text-red-800'">
              {{ dbStatus.connected ? 'Database Connected' : 'Database Connection Issue' }}
            </h4>
            <p class="text-sm mt-1" :class="dbStatus.connected ? 'text-green-700' : 'text-red-700'">
              {{ dbStatus.message }}
            </p>
          </div>
        </div>
      </div>

      <div class="space-y-3">
        <button @click="checkDatabase" :disabled="checking" class="btn-secondary">
          {{ checking ? 'Checking...' : 'Check Database Status' }}
        </button>

        <div v-if="dbStatus.connected && !dbStatus.tablesExist" class="flex space-x-3">
          <button @click="quickSetup" :disabled="loading.setup" class="btn-primary">
            {{ loading.setup ? 'Setting up...' : 'Quick Setup (Auto)' }}
          </button>
          <button @click="showSetupInstructions = true" class="btn-secondary">
            Manual Setup
          </button>
        </div>

        <button
          v-if="dbStatus.connected && dbStatus.tablesExist"
          @click="addSampleData"
          :disabled="loading.setup"
          class="btn-success"
        >
          {{ loading.setup ? 'Adding data...' : 'Add More Sample Data' }}
        </button>
      </div>
    </div>

    <!-- Default Students Data -->
    <div class="card p-6">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">Data Siswa Default</h3>
      <p class="text-sm text-gray-600 mb-4">
        Klik tombol di bawah untuk mengisi data siswa dari daftar yang telah tersedia
      </p>

      <button @click="loadDefaultStudents" :disabled="loading.students" class="btn-primary">
        {{ loading.students ? 'Memuat...' : 'Muat Data Siswa Default' }}
      </button>

      <div v-if="loading.students" class="mt-4">
        <div class="bg-blue-50 border border-blue-200 rounded p-3">
          <p class="text-sm text-blue-700">Sedang memuat {{ defaultStudents.length }} siswa...</p>
        </div>
      </div>
    </div>

    <!-- Export Data -->
    <div class="card p-6">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">Export Data</h3>
      <p class="text-sm text-gray-600 mb-4">
        Export data dalam format CSV untuk backup atau analisis
      </p>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <button @click="exportStudents" class="btn-secondary">
          <DocumentArrowDownIcon class="w-4 h-4 mr-2" />
          Export Siswa
        </button>

        <button @click="exportTransactions" class="btn-secondary">
          <DocumentArrowDownIcon class="w-4 h-4 mr-2" />
          Export Transaksi
        </button>

        <button @click="exportExpenses" class="btn-secondary">
          <DocumentArrowDownIcon class="w-4 h-4 mr-2" />
          Export Pengeluaran
        </button>

        <button @click="exportAll" class="btn-primary">
          <DocumentArrowDownIcon class="w-4 h-4 mr-2" />
          Export Semua
        </button>
      </div>
    </div>

    <!-- System Info -->
    <div class="card p-6">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">Informasi Sistem</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div>
          <span class="font-medium text-gray-700">Aplikasi:</span>
          <span class="ml-2 text-gray-600">Kas Kelas 1B v1.0.0</span>
        </div>
        <div>
          <span class="font-medium text-gray-700">Database:</span>
          <span class="ml-2 text-gray-600">{{ dbStatus.connected ? 'Connected' : 'Disconnected' }}</span>
        </div>
        <div>
          <span class="font-medium text-gray-700">Total Siswa:</span>
          <span class="ml-2 text-gray-600">{{ store.students.length }}</span>
        </div>
        <div>
          <span class="font-medium text-gray-700">Total Transaksi:</span>
          <span class="ml-2 text-gray-600">{{ store.transactions.length }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useAppStore } from '@/stores'
import { useToast } from 'vue-toastification'
import starsenderService from '@/services/starsender'
import { supabase } from '@/lib/supabase'
import {
  EyeIcon,
  EyeSlashIcon,
  DocumentArrowDownIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/vue/24/outline'

const store = useAppStore()
const toast = useToast()

const settings = reactive({
  starsender: {
    deviceApiKey: ''
  },
  supabase: {
    url: '',
    anonKey: ''
  }
})

const showKeys = reactive({
  device: false,
  supabase: false
})

const testing = reactive({
  starsender: false,
  supabase: false
})

const loading = reactive({
  students: false,
  setup: false
})

const checking = ref(false)
const showSetupInstructions = ref(false)

const dbStatus = reactive({
  connected: false,
  tablesExist: false,
  message: 'Click "Check Database Status" to test connection'
})

const edgeFunctionStatus = reactive({
  available: false,
  message: 'Checking Edge Function status...'
})

// Default students data
const defaultStudents = [
  { name: 'Aqilnafi Segara', nickname: 'Nafi', phone: '+62 856-2468-7313' },
  { name: 'Arkaan Jawara Bayanaka', nickname: 'Arkaan', phone: '+62 821-1475-9339' },
  { name: 'Athafariz Zehan Sasongko', nickname: 'Atha', phone: '+62 812-9670-7505' },
  { name: 'Azma Raudhatul Jannah', nickname: 'Azma', phone: '+62 856-8500-062' },
  { name: 'Dizya Nayara Khanza Pujiarto', nickname: 'Dizya', phone: '+62 812-8147-6276' }
]

const checkEdgeFunctionStatus = async () => {
  try {
    const status = await starsenderService.checkEdgeFunctionStatus()
    edgeFunctionStatus.available = status.available
    edgeFunctionStatus.message = status.message
  } catch (error) {
    edgeFunctionStatus.available = false
    edgeFunctionStatus.message = `Error: ${error.message}`
  }
}

const testStarSender = async () => {
  try {
    testing.starsender = true

    // Test via proxy first
    try {
      await starsenderService.checkNumber('628123456789') // Test number
      toast.success('StarSender proxy connection successful!')
    } catch (proxyError) {
      console.warn('Proxy test failed, trying direct connection:', proxyError)

      if (proxyError.message.includes('not deployed')) {
        toast.error('Edge Function not deployed. Please deploy starsender-proxy first.')
      } else {
        // Fallback to direct test
        await starsenderService.testConnectionSafe()
        toast.success('StarSender configuration is valid! (Direct connection)')
      }
    }
  } catch (error) {
    toast.error(`StarSender test failed: ${error.message}`)
  } finally {
    testing.starsender = false
  }
}

const testSupabase = async () => {
  try {
    testing.supabase = true
    if (!settings.supabase.url || !settings.supabase.anonKey) {
      throw new Error('Please fill in both URL and Anon Key')
    }
    
    const testClient = supabase
    if (testClient) {
      await testClient.from('students').select('count').limit(1)
      toast.success('Supabase connection successful!')
    } else {
      throw new Error('Unable to create Supabase client')
    }
  } catch (error) {
    toast.error(`Supabase test failed: ${error.message}`)
  } finally {
    testing.supabase = false
  }
}

const checkDatabase = async () => {
  checking.value = true
  try {
    if (!supabase) {
      throw new Error('Supabase not configured')
    }
    
    // Test connection
    const { data, error } = await supabase.from('students').select('count').limit(1)
    
    if (error) {
      if (error.message.includes('relation "students" does not exist')) {
        dbStatus.connected = true
        dbStatus.tablesExist = false
        dbStatus.message = 'Connected but tables need to be created'
      } else {
        throw error
      }
    } else {
      dbStatus.connected = true
      dbStatus.tablesExist = true
      dbStatus.message = 'Database is properly configured'
    }
  } catch (error) {
    dbStatus.connected = false
    dbStatus.tablesExist = false
    dbStatus.message = error.message
  } finally {
    checking.value = false
  }
}

const quickSetup = async () => {
  loading.setup = true
  try {
    toast.info('Quick setup would create database tables automatically')
    toast.success('Quick setup completed! (simulated)')
  } catch (error) {
    toast.error(`Setup failed: ${error.message}`)
  } finally {
    loading.setup = false
  }
}

const addSampleData = async () => {
  loading.setup = true
  try {
    toast.info('Adding sample data...')
    toast.success('Sample data added! (simulated)')
  } catch (error) {
    toast.error(`Failed to add sample data: ${error.message}`)
  } finally {
    loading.setup = false
  }
}

const loadDefaultStudents = async () => {
  try {
    loading.students = true
    
    for (const student of defaultStudents) {
      await store.addStudent(student)
    }
    
    toast.success(`Successfully added ${defaultStudents.length} students`)
  } catch (error) {
    toast.error('Failed to load default students')
    console.error('Error loading students:', error)
  } finally {
    loading.students = false
  }
}

const exportData = (data, filename) => {
  const csvContent = "data:text/csv;charset=utf-8," + data
  const encodedUri = encodeURI(csvContent)
  const link = document.createElement("a")
  link.setAttribute("href", encodedUri)
  link.setAttribute("download", filename)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

const exportStudents = () => {
  const csvContent = [
    ['Name', 'Nickname', 'Phone', 'Created At'].join(','),
    ...store.students.map(s => [s.name, s.nickname, s.phone, s.created_at].join(','))
  ].join('\n')
  
  exportData(csvContent, 'students.csv')
  toast.success('Students data exported!')
}

const exportTransactions = () => {
  const csvContent = [
    ['Type', 'Amount', 'Description', 'Student', 'Status', 'Created At'].join(','),
    ...store.transactions.map(t => [t.type, t.amount, t.description, t.student?.name || '', t.status, t.created_at].join(','))
  ].join('\n')
  
  exportData(csvContent, 'transactions.csv')
  toast.success('Transactions data exported!')
}

const exportExpenses = () => {
  const csvContent = [
    ['Category', 'Amount', 'Description', 'Status', 'Created At'].join(','),
    ...store.expenses.map(e => [e.category, e.amount, e.description, e.status, e.created_at].join(','))
  ].join('\n')
  
  exportData(csvContent, 'expenses.csv')
  toast.success('Expenses data exported!')
}

const exportAll = () => {
  const data = {
    students: store.students,
    transactions: store.transactions,
    expenses: store.expenses,
    exported_at: new Date().toISOString()
  }
  
  const jsonContent = "data:text/json;charset=utf-8," + JSON.stringify(data, null, 2)
  exportData(jsonContent, 'kas-kelas-backup.json')
  toast.success('All data exported!')
}

onMounted(async () => {
  // Load current settings from environment variables
  settings.supabase.url = import.meta.env.VITE_SUPABASE_URL || ''
  settings.supabase.anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''
  settings.starsender.deviceApiKey = import.meta.env.VITE_STARSENDER_DEVICE_API_KEY || ''

  // Auto-check database status if configured
  const isConfigured = settings.supabase.url && settings.supabase.anonKey &&
    !settings.supabase.url.includes('your-project') &&
    !settings.supabase.anonKey.includes('your-anon-key')

  if (isConfigured) {
    await checkDatabase()
  }
})
</script>
