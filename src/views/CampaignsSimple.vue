<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Campaign WhatsApp</h1>
        <p class="mt-1 text-sm text-gray-500">
          Kelola campaign pengiriman pesan terjadwal ke multiple nomor
        </p>
      </div>
      <button 
        @click="showCreateModal = true"
        class="btn-primary mt-4 sm:mt-0"
      >
        <PlusIcon class="w-5 h-5 mr-2" />
        Buat Campaign Baru
      </button>
    </div>

    <!-- Debug Info -->
    <div class="card p-4 bg-blue-50">
      <h3 class="font-semibold text-blue-900">Debug Info</h3>
      <p class="text-sm text-blue-700 mt-2">Loading: {{ loading }}</p>
      <p class="text-sm text-blue-700">Campaigns: {{ campaigns.length }}</p>
      <p class="text-sm text-blue-700">Students: {{ students.length }}</p>
      <p class="text-sm text-blue-700">Timestamp: {{ new Date().toLocaleString() }}</p>
    </div>

    <!-- Simple Stats -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div class="card p-6">
        <div class="flex items-center">
          <div class="p-2 bg-blue-100 rounded-lg">
            <CalendarDaysIcon class="w-6 h-6 text-blue-600" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Total Campaign</p>
            <p class="text-2xl font-semibold text-gray-900">{{ campaigns.length }}</p>
          </div>
        </div>
      </div>
      
      <div class="card p-6">
        <div class="flex items-center">
          <div class="p-2 bg-green-100 rounded-lg">
            <CheckCircleIcon class="w-6 h-6 text-green-600" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Selesai</p>
            <p class="text-2xl font-semibold text-gray-900">0</p>
          </div>
        </div>
      </div>

      <div class="card p-6">
        <div class="flex items-center">
          <div class="p-2 bg-yellow-100 rounded-lg">
            <ClockIcon class="w-6 h-6 text-yellow-600" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Terjadwal</p>
            <p class="text-2xl font-semibold text-gray-900">0</p>
          </div>
        </div>
      </div>

      <div class="card p-6">
        <div class="flex items-center">
          <div class="p-2 bg-purple-100 rounded-lg">
            <PaperAirplaneIcon class="w-6 h-6 text-purple-600" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Sedang Kirim</p>
            <p class="text-2xl font-semibold text-gray-900">0</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Campaign List -->
    <div class="card">
      <div class="px-6 py-4 border-b border-gray-200">
        <h3 class="text-lg font-medium text-gray-900">Daftar Campaign</h3>
      </div>
      
      <div class="p-6">
        <div v-if="loading" class="text-center py-8">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p class="mt-4 text-gray-500">Memuat campaign...</p>
        </div>
        
        <div v-else-if="campaigns.length === 0" class="text-center py-12">
          <CalendarDaysIcon class="mx-auto h-12 w-12 text-gray-400" />
          <h3 class="mt-2 text-sm font-medium text-gray-900">Belum ada campaign</h3>
          <p class="mt-1 text-sm text-gray-500">Mulai dengan membuat campaign pertama Anda.</p>
          <div class="mt-6">
            <button @click="showCreateModal = true" class="btn-primary">
              <PlusIcon class="w-5 h-5 mr-2" />
              Buat Campaign Baru
            </button>
          </div>
        </div>

        <div v-else>
          <div v-for="campaign in campaigns" :key="campaign.id" class="border rounded-lg p-4 mb-4">
            <h4 class="font-semibold text-gray-900">{{ campaign.title }}</h4>
            <p class="text-sm text-gray-500 mt-1">{{ campaign.message.substring(0, 100) }}...</p>
            <div class="flex items-center justify-between mt-3">
              <span class="text-xs text-gray-400">{{ formatDate(campaign.created_at) }}</span>
              <span class="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                {{ campaign.status }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Simple Modal -->
    <div 
      v-if="showCreateModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <div class="bg-white rounded-lg max-w-md w-full p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">
          Buat Campaign Baru
        </h3>
        
        <form @submit.prevent="createSimpleCampaign" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Judul</label>
            <input
              v-model="newCampaign.title"
              type="text"
              required
              class="input-field"
              placeholder="Contoh: Reminder Pembayaran Kas"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Pesan</label>
            <textarea 
              v-model="newCampaign.message"
              rows="4"
              required
              class="input-field"
              placeholder="Tulis pesan campaign..."
            ></textarea>
          </div>
          
          <div class="flex justify-end space-x-3 pt-4">
            <button 
              type="button"
              @click="showCreateModal = false"
              class="btn-secondary"
            >
              Batal
            </button>
            <button 
              type="submit"
              class="btn-primary"
            >
              Buat Campaign
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useToast } from 'vue-toastification'
import { useAppStore } from '@/stores'
import {
  PlusIcon,
  CalendarDaysIcon,
  CheckCircleIcon,
  ClockIcon,
  PaperAirplaneIcon
} from '@heroicons/vue/24/outline'

const store = useAppStore()
const toast = useToast()

// State
const campaigns = ref([])
const students = ref([])
const loading = ref(false)
const showCreateModal = ref(false)

const newCampaign = reactive({
  title: '',
  message: ''
})

// Methods
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('id-ID')
}

const loadData = async () => {
  try {
    loading.value = true
    
    // Load students
    try {
      await store.fetchStudents()
      students.value = store.students || []
      toast.success(`✅ ${students.value.length} siswa dimuat`)
    } catch (error) {
      console.warn('Could not load students:', error)
      students.value = []
      toast.warning('Data siswa tidak dapat dimuat')
    }

    // Create sample campaigns
    campaigns.value = [
      {
        id: '1',
        title: 'Demo Campaign WhatsApp',
        message: 'Halo [[NAME]]! Ini adalah demo campaign WhatsApp dari sistem kas kelas.',
        target: 'all',
        status: 'draft',
        created_at: new Date().toISOString()
      }
    ]
    
    toast.success('✅ Halaman campaign berhasil dimuat')
    
  } catch (error) {
    console.error('Error loading data:', error)
    toast.error(`❌ Gagal memuat data: ${error.message}`)
  } finally {
    loading.value = false
  }
}

const createSimpleCampaign = () => {
  try {
    const campaign = {
      id: Date.now().toString(),
      title: newCampaign.title,
      message: newCampaign.message,
      target: 'all',
      status: 'draft',
      created_at: new Date().toISOString()
    }
    
    campaigns.value.push(campaign)
    
    // Reset form
    newCampaign.title = ''
    newCampaign.message = ''
    showCreateModal.value = false
    
    toast.success('✅ Campaign berhasil dibuat!')
  } catch (error) {
    console.error('Error creating campaign:', error)
    toast.error(`❌ Gagal membuat campaign: ${error.message}`)
  }
}

// Initialize
onMounted(() => {
  console.log('🚀 Campaigns page mounted')
  loadData()
})
</script>
