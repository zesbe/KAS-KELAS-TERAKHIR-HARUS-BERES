<template>
  <div class="space-y-6">
    <!-- Header -->
    <div>
      <h1 class="text-2xl font-semibold text-gray-900">Pengaturan</h1>
      <p class="text-sm text-gray-500 mt-1">Kelola pengaturan sistem dan konfigurasi</p>
    </div>

    <!-- API Configuration -->
    <div class="card p-6">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">Konfigurasi API</h3>
      
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- StarSender Configuration -->
        <div class="space-y-4">
          <h4 class="font-medium text-gray-900">StarSender WhatsApp API</h4>
          
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
                class="btn-secondary p-2"
              >
                <EyeIcon v-if="!showKeys.device" class="w-4 h-4" />
                <EyeSlashIcon v-else class="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Account API Key</label>
            <div class="flex items-center space-x-2">
              <input 
                v-model="settings.starsender.accountApiKey"
                :type="showKeys.account ? 'text' : 'password'"
                class="input-field flex-1"
                placeholder="Masukkan Account API Key"
              />
              <button 
                @click="showKeys.account = !showKeys.account"
                class="btn-secondary p-2"
              >
                <EyeIcon v-if="!showKeys.account" class="w-4 h-4" />
                <EyeSlashIcon v-else class="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <button @click="testStarSender" :disabled="testing.starsender" class="btn-primary">
            {{ testing.starsender ? 'Testing...' : 'Test Koneksi' }}
          </button>
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

    <!-- Default Students Data -->
    <div class="card p-6">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">Data Siswa Default</h3>
      <p class="text-sm text-gray-600 mb-4">
        Klik tombol di bawah untuk mengisi data siswa dari daftar yang telah tersedia
      </p>
      
      <button @click="loadDefaultStudents" :disabled="loading.students" class="btn-primary">
        {{ loading.students ? 'Memuat...' : 'Muat Data Siswa Default' }}
      </button>
    </div>

    <!-- System Information -->
    <div class="card p-6">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">Informasi Sistem</h3>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 class="font-medium text-gray-900 mb-3">Statistik Database</h4>
          <div class="space-y-2 text-sm">
            <div class="flex justify-between">
              <span class="text-gray-600">Total Siswa:</span>
              <span class="font-medium">{{ store.students.length }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Total Transaksi:</span>
              <span class="font-medium">{{ store.transactions.length }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Total Pengeluaran:</span>
              <span class="font-medium">{{ store.expenses.length }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Total Campaign:</span>
              <span class="font-medium">{{ store.campaigns.length }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Link Pembayaran:</span>
              <span class="font-medium">{{ store.paymentLinks.length }}</span>
            </div>
          </div>
        </div>
        
        <div>
          <h4 class="font-medium text-gray-900 mb-3">Versi Aplikasi</h4>
          <div class="space-y-2 text-sm">
            <div class="flex justify-between">
              <span class="text-gray-600">Versi:</span>
              <span class="font-medium">1.0.0</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Framework:</span>
              <span class="font-medium">Vue 3</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Database:</span>
              <span class="font-medium">Supabase PostgreSQL</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Build:</span>
              <span class="font-medium">{{ new Date().toLocaleDateString('id-ID') }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Backup & Export -->
    <div class="card p-6">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">Backup & Export</h3>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button @click="exportStudents" class="btn-secondary">
          <DocumentArrowDownIcon class="w-4 h-4 mr-2" />
          Export Data Siswa
        </button>
        
        <button @click="exportTransactions" class="btn-secondary">
          <DocumentArrowDownIcon class="w-4 h-4 mr-2" />
          Export Transaksi
        </button>
        
        <button @click="exportAll" class="btn-secondary">
          <DocumentArrowDownIcon class="w-4 h-4 mr-2" />
          Export Semua Data
        </button>
      </div>
    </div>

    <!-- Danger Zone -->
    <div class="card p-6 border-red-200">
      <h3 class="text-lg font-semibold text-red-900 mb-4">Danger Zone</h3>
      <p class="text-sm text-red-600 mb-4">
        Tindakan di bawah ini tidak dapat dibatalkan. Pastikan Anda memahami konsekuensinya.
      </p>
      
      <div class="space-y-3">
        <button @click="clearAllData" class="btn-danger">
          <TrashIcon class="w-4 h-4 mr-2" />
          Hapus Semua Data
        </button>
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
  TrashIcon
} from '@heroicons/vue/24/outline'

const store = useAppStore()
const toast = useToast()

const settings = reactive({
  starsender: {
    deviceApiKey: '',
    accountApiKey: ''
  },
  supabase: {
    url: '',
    anonKey: ''
  }
})

const showKeys = reactive({
  device: false,
  account: false,
  supabase: false
})

const testing = reactive({
  starsender: false,
  supabase: false
})

const loading = reactive({
  students: false
})

// Default students data from PERINTAH.md
const defaultStudents = [
  { name: 'Aqilnafi Segara', nickname: 'Nafi', phone: '+62 856-2468-7313' },
  { name: 'Arkaan Jawara Bayanaka', nickname: 'Arkaan', phone: '+62 821-1475-9339' },
  { name: 'Athafariz Zehan Sasongko', nickname: 'Atha', phone: '+62 812-9670-7505' },
  { name: 'Azma Raudhatul Jannah', nickname: 'Azma', phone: '+62 856-8500-062' },
  { name: 'Dizya Nayara Khanza Pujiarto', nickname: 'Dizya', phone: '+62 812-8147-6276' },
  { name: 'Elvano Devika Putra', nickname: 'Elvano', phone: '+62 812-9585-0096' },
  { name: 'Khalifa Adzkayra Marissa', nickname: 'Marissa', phone: '+62 877-4168-6950' },
  { name: 'Khalisa Adiba Nuha', nickname: 'Adiba', phone: '+62 813-2877-9423' },
  { name: 'Kirana Febriana Hakim', nickname: 'Kirana', phone: '+62 812-9759-7757' },
  { name: 'M. Abil Shidiq Arsalaan', nickname: 'Abil', phone: '+62 812-1172-3429' },
  { name: 'Mikhayla Putri Mahfud', nickname: 'Mikha', phone: '+62 813-8241-6552' },
  { name: 'Radeva Zehan Elfathan', nickname: 'Radeva', phone: '+62 811-9403-103' },
  { name: 'Sekar Hanun Ayudia', nickname: 'Sekar', phone: '+62 812-2595-0048' },
  { name: 'Shahia Fitri Kalita', nickname: 'Shahia', phone: '+62 858-8163-6149' },
  { name: 'Sheila Hapsari Paramita', nickname: 'Sheila', phone: '+62 822-6021-8027' },
  { name: 'Tedra Sagara Drew Permana', nickname: 'Saga', phone: '+62 877-8539-3962' },
  { name: 'Tiara Shanum Wicaksono', nickname: 'Shanum', phone: '+62 857-1663-5953' },
  { name: 'Yumna Rizqy Humaira', nickname: 'Una', phone: '+62 813-1007-5190' },
  { name: 'Zaidan Mufid', nickname: 'Zaidan', phone: '+62 813-1684-0991' },
  { name: 'Zanna Kirania Simanjuntak', nickname: 'Nia', phone: '+62 812-9076-6367' }
]

const testStarSender = async () => {
  try {
    testing.starsender = true
    
    // Test getting devices (requires account API key)
    const devices = await starsenderService.getDevices()
    
    toast.success('Koneksi StarSender berhasil!')
    console.log('StarSender devices:', devices)
  } catch (error) {
    toast.error('Gagal menghubungi StarSender: ' + error.message)
    console.error('StarSender test error:', error)
  } finally {
    testing.starsender = false
  }
}

const testSupabase = async () => {
  try {
    testing.supabase = true
    
    // Test Supabase connection
    const { data, error } = await supabase.from('students').select('count').limit(1)
    
    if (error) throw error
    
    toast.success('Koneksi Supabase berhasil!')
  } catch (error) {
    toast.error('Gagal menghubungi Supabase: ' + error.message)
    console.error('Supabase test error:', error)
  } finally {
    testing.supabase = false
  }
}

const loadDefaultStudents = async () => {
  try {
    loading.students = true
    
    // Check if students already exist
    if (store.students.length > 0) {
      if (!confirm('Data siswa sudah ada. Apakah Anda ingin mengganti dengan data default?')) {
        return
      }
    }
    
    // Add default students
    for (const student of defaultStudents) {
      await store.addStudent(student)
    }
    
    toast.success(`Berhasil memuat ${defaultStudents.length} data siswa default`)
  } catch (error) {
    toast.error('Gagal memuat data siswa: ' + error.message)
    console.error('Load students error:', error)
  } finally {
    loading.students = false
  }
}

const exportStudents = () => {
  const csvContent = [
    'Nama,Nickname,Phone',
    ...store.students.map(s => `"${s.name}","${s.nickname}","${s.phone}"`)
  ].join('\n')
  
  downloadCSV(csvContent, 'data-siswa.csv')
  toast.success('Data siswa berhasil di-export')
}

const exportTransactions = () => {
  const csvContent = [
    'Tanggal,Siswa,Keterangan,Jumlah,Status,Metode',
    ...store.transactions.map(t => 
      `"${t.created_at}","${t.student?.name || ''}","${t.description}","${t.amount}","${t.status}","${t.payment_method || ''}"`
    )
  ].join('\n')
  
  downloadCSV(csvContent, 'transaksi.csv')
  toast.success('Data transaksi berhasil di-export')
}

const exportAll = () => {
  const data = {
    metadata: {
      exported_at: new Date().toISOString(),
      version: '1.0.0',
      class: 'Kelas 1B SD Islam Al Husna',
      academic_year: '2025/2026',
      total_students: store.students.length,
      total_transactions: store.transactions.length,
      total_expenses: store.expenses.length,
      current_balance: store.currentBalance
    },
    students: store.students,
    transactions: store.transactions,
    expenses: store.expenses,
    campaigns: store.campaigns,
    paymentLinks: store.paymentLinks
  }

  const jsonContent = JSON.stringify(data, null, 2)
  const timestamp = new Date().toISOString().slice(0, 10)
  downloadJSON(jsonContent, `backup_kas_kelas_1b_${timestamp}.json`)
  toast.success('Backup lengkap berhasil di-export')
}

const clearAllData = async () => {
  const confirmText = 'HAPUS SEMUA DATA'
  const userInput = prompt(`Untuk menghapus semua data, ketik: ${confirmText}`)
  
  if (userInput === confirmText) {
    try {
      // This would require implementing delete methods in the store
      toast.warning('Fitur hapus semua data belum diimplementasi untuk keamanan')
    } catch (error) {
      toast.error('Gagal menghapus data: ' + error.message)
    }
  } else if (userInput !== null) {
    toast.error('Text konfirmasi salah')
  }
}

const downloadCSV = (content, filename) => {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = filename
  link.click()
}

const downloadJSON = (content, filename) => {
  const blob = new Blob([content], { type: 'application/json' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = filename
  link.click()
}

onMounted(() => {
  // Load current settings from environment variables
  settings.supabase.url = import.meta.env.VITE_SUPABASE_URL || ''
  settings.supabase.anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''
  settings.starsender.deviceApiKey = import.meta.env.VITE_STARSENDER_DEVICE_API_KEY || ''
  settings.starsender.accountApiKey = import.meta.env.VITE_STARSENDER_ACCOUNT_API_KEY || ''
})
</script>
