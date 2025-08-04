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

    <!-- Campaign Stats -->
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
            <p class="text-2xl font-semibold text-gray-900">
              {{ campaigns.filter(c => c.status === 'completed').length }}
            </p>
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
            <p class="text-2xl font-semibold text-gray-900">
              {{ campaigns.filter(c => c.status === 'scheduled').length }}
            </p>
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
            <p class="text-2xl font-semibold text-gray-900">
              {{ campaigns.filter(c => c.status === 'sending').length }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Campaign List -->
    <div class="card">
      <div class="px-6 py-4 border-b border-gray-200">
        <h3 class="text-lg font-medium text-gray-900">Daftar Campaign</h3>
      </div>
      
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Campaign
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Target
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Jadwal
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Status
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Progress
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="campaign in campaigns" :key="campaign.id">
              <td class="px-6 py-4 whitespace-nowrap">
                <div>
                  <div class="text-sm font-medium text-gray-900">{{ campaign.title }}</div>
                  <div class="text-sm text-gray-500 truncate max-w-xs">{{ campaign.message }}</div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ getTargetLabel(campaign.target) }}</div>
                <div class="text-sm text-gray-500">{{ getRecipientCount(campaign) }} nomor</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">
                  {{ campaign.scheduled_at ? formatDate(campaign.scheduled_at) : '-' }}
                </div>
                <div class="text-sm text-gray-500">
                  Delay: {{ campaign.delay_minutes || 1 }} menit
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="getStatusClass(campaign.status)" class="inline-flex px-2 py-1 text-xs font-semibold rounded-full">
                  {{ getStatusLabel(campaign.status) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="w-full bg-gray-200 rounded-full h-2 mr-2">
                    <div 
                      class="bg-blue-600 h-2 rounded-full" 
                      :style="{ width: getProgress(campaign) + '%' }"
                    ></div>
                  </div>
                  <span class="text-xs text-gray-500">{{ getProgress(campaign) }}%</span>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div class="flex space-x-2">
                  <button 
                    @click="viewCampaign(campaign)"
                    class="text-blue-600 hover:text-blue-900"
                  >
                    Lihat
                  </button>
                  <button 
                    v-if="campaign.status === 'draft'"
                    @click="editCampaign(campaign)"
                    class="text-green-600 hover:text-green-900"
                  >
                    Edit
                  </button>
                  <button 
                    v-if="['draft', 'scheduled'].includes(campaign.status)"
                    @click="deleteCampaign(campaign.id)"
                    class="text-red-600 hover:text-red-900"
                  >
                    Hapus
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        
        <div v-if="campaigns.length === 0" class="text-center py-12">
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
      </div>
    </div>

    <!-- Create/Edit Campaign Modal -->
    <div v-if="showCreateModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
        <div class="mt-3">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-medium text-gray-900">
              {{ editingCampaign ? 'Edit Campaign' : 'Buat Campaign Baru' }}
            </h3>
            <button @click="closeModal" class="text-gray-400 hover:text-gray-600">
              <XMarkIcon class="w-6 h-6" />
            </button>
          </div>

          <form @submit.prevent="saveCampaign" class="space-y-6">
            <!-- Campaign Title -->
            <div>
              <label class="block text-sm font-medium text-gray-700">
                Judul Campaign
              </label>
              <input
                v-model="campaignForm.title"
                type="text"
                required
                class="input-field"
                placeholder="Contoh: Reminder Pembayaran Kas Januari"
              />
            </div>

            <!-- Message Template -->
            <div>
              <label class="block text-sm font-medium text-gray-700">
                Template Pesan
              </label>
              <textarea
                v-model="campaignForm.message"
                rows="6"
                required
                class="input-field"
                placeholder="Ketik pesan Anda di sini..."
              ></textarea>
              <div class="mt-2 text-sm text-gray-500">
                <p>Variable yang bisa digunakan:</p>
                <div class="flex flex-wrap gap-2 mt-1">
                  <span class="px-2 py-1 bg-gray-100 rounded text-xs">[[NAME]] - Nama siswa</span>
                  <span class="px-2 py-1 bg-gray-100 rounded text-xs">[[NICKNAME]] - Panggilan</span>
                  <span class="px-2 py-1 bg-gray-100 rounded text-xs">[[PHONE]] - No HP</span>
                </div>
              </div>
            </div>

            <!-- Target Recipients -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Target Penerima
              </label>
              <div class="space-y-2">
                <label class="flex items-center">
                  <input
                    v-model="campaignForm.target"
                    type="radio"
                    value="all"
                    class="mr-2"
                  />
                  Semua Siswa ({{ students.length }} siswa)
                </label>
                <label class="flex items-center">
                  <input
                    v-model="campaignForm.target"
                    type="radio"
                    value="unpaid"
                    class="mr-2"
                  />
                  Siswa Belum Bayar ({{ getUnpaidStudents().length }} siswa)
                </label>
                <label class="flex items-center">
                  <input
                    v-model="campaignForm.target"
                    type="radio"
                    value="paid"
                    class="mr-2"
                  />
                  Siswa Sudah Bayar ({{ getPaidStudents().length }} siswa)
                </label>
                <label class="flex items-center">
                  <input
                    v-model="campaignForm.target"
                    type="radio"
                    value="selected"
                    class="mr-2"
                  />
                  Pilih Manual
                </label>
              </div>
            </div>

            <!-- Manual Selection -->
            <div v-if="campaignForm.target === 'selected'" class="border rounded-lg p-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Pilih Siswa ({{ campaignForm.selectedStudents.length }} dipilih)
              </label>
              <div class="max-h-48 overflow-y-auto space-y-2">
                <label 
                  v-for="student in students" 
                  :key="student.id"
                  class="flex items-center"
                >
                  <input
                    v-model="campaignForm.selectedStudents"
                    type="checkbox"
                    :value="student.id"
                    class="mr-2"
                  />
                  {{ student.name }} ({{ student.nickname }}) - {{ student.phone }}
                </label>
              </div>
            </div>

            <!-- Scheduling Options -->
            <div class="border rounded-lg p-4">
              <h4 class="font-medium text-gray-900 mb-3">⏰ Pengaturan Jadwal</h4>
              
              <!-- Immediate or Scheduled -->
              <div class="space-y-3">
                <label class="flex items-center">
                  <input
                    v-model="campaignForm.sendType"
                    type="radio"
                    value="immediate"
                    class="mr-2"
                  />
                  Kirim Sekarang
                </label>
                <label class="flex items-center">
                  <input
                    v-model="campaignForm.sendType"
                    type="radio"
                    value="scheduled"
                    class="mr-2"
                  />
                  Jadwalkan Pengiriman
                </label>
              </div>

              <!-- Schedule DateTime -->
              <div v-if="campaignForm.sendType === 'scheduled'" class="mt-4 space-y-3">
                <div>
                  <label class="block text-sm font-medium text-gray-700">
                    Tanggal & Jam Mulai
                  </label>
                  <input
                    v-model="campaignForm.scheduledDateTime"
                    type="datetime-local"
                    :min="new Date().toISOString().slice(0, 16)"
                    class="input-field"
                    required
                  />
                </div>
              </div>

              <!-- Delay Between Messages -->
              <div class="mt-4">
                <label class="block text-sm font-medium text-gray-700">
                  Jeda Antar Pesan (menit)
                </label>
                <select v-model="campaignForm.delayMinutes" class="input-field">
                  <option value="1">1 menit (cepat)</option>
                  <option value="2">2 menit</option>
                  <option value="5">5 menit</option>
                  <option value="10">10 menit (recommended)</option>
                  <option value="15">15 menit</option>
                  <option value="30">30 menit</option>
                  <option value="60">1 jam</option>
                </select>
                <p class="mt-1 text-sm text-gray-500">
                  Jeda yang lebih lama mengurangi risiko spam dan lebih aman
                </p>
              </div>
            </div>

            <!-- Preview -->
            <div class="border rounded-lg p-4 bg-gray-50">
              <h4 class="font-medium text-gray-900 mb-2">📋 Preview Campaign</h4>
              <div class="text-sm space-y-1">
                <p><strong>Target:</strong> {{ getTargetPreview() }}</p>
                <p><strong>Total Penerima:</strong> {{ getTotalRecipients() }} nomor</p>
                <p><strong>Jadwal:</strong> {{ getSchedulePreview() }}</p>
                <p><strong>Jeda:</strong> {{ campaignForm.delayMinutes }} menit antar pesan</p>
                <p><strong>Estimasi Selesai:</strong> {{ getEstimatedCompletion() }}</p>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                @click="closeModal"
                class="btn-secondary"
              >
                Batal
              </button>
              <button
                type="submit"
                :disabled="saving"
                class="btn-primary"
              >
                {{ saving ? 'Menyimpan...' : (editingCampaign ? 'Update Campaign' : 'Buat Campaign') }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Campaign Detail Modal -->
    <div v-if="showDetailModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-11/12 md:w-2/3 lg:w-1/2 shadow-lg rounded-md bg-white">
        <div class="mt-3">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-medium text-gray-900">
              Detail Campaign: {{ selectedCampaign?.title }}
            </h3>
            <button @click="showDetailModal = false" class="text-gray-400 hover:text-gray-600">
              <XMarkIcon class="w-6 h-6" />
            </button>
          </div>

          <div v-if="selectedCampaign" class="space-y-4">
            <!-- Campaign Info -->
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="text-sm font-medium text-gray-500">Status</label>
                <p :class="getStatusClass(selectedCampaign.status)" class="inline-flex px-2 py-1 text-xs font-semibold rounded-full">
                  {{ getStatusLabel(selectedCampaign.status) }}
                </p>
              </div>
              <div>
                <label class="text-sm font-medium text-gray-500">Total Penerima</label>
                <p class="text-sm text-gray-900">{{ getRecipientCount(selectedCampaign) }} nomor</p>
              </div>
              <div>
                <label class="text-sm font-medium text-gray-500">Jadwal Mulai</label>
                <p class="text-sm text-gray-900">
                  {{ selectedCampaign.scheduled_at ? formatDate(selectedCampaign.scheduled_at) : 'Langsung' }}
                </p>
              </div>
              <div>
                <label class="text-sm font-medium text-gray-500">Jeda Antar Pesan</label>
                <p class="text-sm text-gray-900">{{ selectedCampaign.delay_minutes || 1 }} menit</p>
              </div>
            </div>

            <!-- Message Preview -->
            <div>
              <label class="text-sm font-medium text-gray-500">Pesan</label>
              <div class="mt-1 p-3 bg-gray-50 rounded-lg">
                <pre class="whitespace-pre-wrap text-sm text-gray-900">{{ selectedCampaign.message }}</pre>
              </div>
            </div>

            <!-- Results (if completed) -->
            <div v-if="selectedCampaign.results" class="border rounded-lg p-4">
              <h4 class="font-medium text-gray-900 mb-3">📊 Hasil Pengiriman</h4>
              <div class="grid grid-cols-3 gap-4 mb-4">
                <div class="text-center">
                  <div class="text-2xl font-bold text-green-600">{{ selectedCampaign.results.successCount || 0 }}</div>
                  <div class="text-sm text-gray-500">Berhasil</div>
                </div>
                <div class="text-center">
                  <div class="text-2xl font-bold text-red-600">{{ selectedCampaign.results.failedCount || 0 }}</div>
                  <div class="text-sm text-gray-500">Gagal</div>
                </div>
                <div class="text-center">
                  <div class="text-2xl font-bold text-blue-600">{{ selectedCampaign.results.totalSent || 0 }}</div>
                  <div class="text-sm text-gray-500">Total</div>
                </div>
              </div>
              
              <!-- Detailed Results -->
              <div v-if="selectedCampaign.results.results" class="max-h-48 overflow-y-auto">
                <table class="min-w-full divide-y divide-gray-200">
                  <thead class="bg-gray-50">
                    <tr>
                      <th class="px-4 py-2 text-left text-xs font-medium text-gray-500">Penerima</th>
                      <th class="px-4 py-2 text-left text-xs font-medium text-gray-500">Status</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-gray-200">
                    <tr v-for="result in selectedCampaign.results.results" :key="result.phone">
                      <td class="px-4 py-2 text-sm text-gray-900">{{ result.phone }}</td>
                      <td class="px-4 py-2">
                        <span 
                          :class="result.success ? 'text-green-600' : 'text-red-600'"
                          class="text-sm"
                        >
                          {{ result.success ? 'Berhasil' : result.error }}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useToast } from 'vue-toastification'
import { useAppStore } from '@/stores'
import starsenderService from '@/services/starsender'
import campaignService from '@/services/campaignService'
import { 
  PlusIcon, 
  CalendarDaysIcon,
  CheckCircleIcon,
  ClockIcon,
  PaperAirplaneIcon,
  XMarkIcon
} from '@heroicons/vue/24/outline'

const store = useAppStore()
const toast = useToast()

// State
const campaigns = ref([])
const students = ref([])
const loading = ref(false)
const saving = ref(false)
const showCreateModal = ref(false)
const showDetailModal = ref(false)
const editingCampaign = ref(null)
const selectedCampaign = ref(null)

// Form state
const campaignForm = reactive({
  title: '',
  message: '',
  target: 'unpaid',
  selectedStudents: [],
  sendType: 'scheduled',
  scheduledDateTime: '',
  delayMinutes: 10
})

// Computed
const getUnpaidStudents = () => {
  // Filter students yang belum bayar berdasarkan payment status
  return students.value.filter(student => {
    // Logic untuk determine unpaid students
    return true // Placeholder
  })
}

const getPaidStudents = () => {
  // Filter students yang sudah bayar
  return students.value.filter(student => {
    // Logic untuk determine paid students  
    return false // Placeholder
  })
}

// Methods
const loadData = async () => {
  try {
    loading.value = true
    
    // Load students
    const studentsResult = await store.loadStudents()
    students.value = store.students
    
    // Load campaigns from database
    // campaigns.value = await loadCampaigns()
    
    // Demo data for now
    campaigns.value = [
      {
        id: '1',
        title: 'Reminder Pembayaran Kas Januari',
        message: 'Halo [[NAME]], silakan bayar kas kelas bulan Januari. Terima kasih.',
        target: 'unpaid',
        delay_minutes: 10,
        status: 'scheduled',
        scheduled_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        created_at: new Date().toISOString(),
        results: null
      }
    ]
    
  } catch (error) {
    console.error('Error loading data:', error)
    toast.error('Gagal memuat data')
  } finally {
    loading.value = false
  }
}

const saveCampaign = async () => {
  try {
    saving.value = true
    
    // Validate form
    if (!campaignForm.title || !campaignForm.message) {
      toast.error('Judul dan pesan harus diisi')
      return
    }
    
    if (getTotalRecipients() === 0) {
      toast.error('Pilih minimal 1 penerima')
      return
    }
    
    // Prepare campaign data
    const campaignData = {
      id: editingCampaign.value?.id || Date.now().toString(),
      title: campaignForm.title,
      message: campaignForm.message,
      target: campaignForm.target,
      recipients: getRecipientIds(),
      delay_minutes: parseInt(campaignForm.delayMinutes),
      status: 'draft',
      scheduled_at: campaignForm.sendType === 'scheduled' ? 
        new Date(campaignForm.scheduledDateTime).toISOString() : null,
      created_at: new Date().toISOString(),
      results: null
    }
    
    if (editingCampaign.value) {
      // Update existing campaign
      const index = campaigns.value.findIndex(c => c.id === editingCampaign.value.id)
      campaigns.value[index] = campaignData
      toast.success('Campaign berhasil diupdate')
    } else {
      // Create new campaign
      campaigns.value.push(campaignData)
      toast.success('Campaign berhasil dibuat')
    }
    
    // Execute campaign if immediate
    if (campaignForm.sendType === 'immediate') {
      await executeCampaign(campaignData)
    } else {
      // Schedule campaign
      campaignData.status = 'scheduled'
      toast.info('Campaign dijadwalkan dan akan dijalankan otomatis')
    }
    
    closeModal()
    
  } catch (error) {
    console.error('Error saving campaign:', error)
    toast.error('Gagal menyimpan campaign')
  } finally {
    saving.value = false
  }
}

const executeCampaign = async (campaign) => {
  try {
    campaign.status = 'sending'
    
    // Get recipients
    const recipients = getRecipientsFromCampaign(campaign)
    
    // Prepare message with variables
    const results = []
    
    for (let i = 0; i < recipients.length; i++) {
      const recipient = recipients[i]
      
      try {
        // Replace variables in message
        const personalizedMessage = campaign.message
          .replace(/\[\[NAME\]\]/g, recipient.name)
          .replace(/\[\[NICKNAME\]\]/g, recipient.nickname)
          .replace(/\[\[PHONE\]\]/g, recipient.phone)
        
        // Calculate schedule time for this message
        const scheduleTime = campaign.scheduled_at ? 
          new Date(campaign.scheduled_at).getTime() + (i * campaign.delay_minutes * 60 * 1000) :
          Date.now() + (i * campaign.delay_minutes * 60 * 1000)
        
        // Send via StarSender with schedule
        await starsenderService.sendMessage(recipient.phone, personalizedMessage, {
          schedule: scheduleTime
        })
        
        results.push({
          phone: recipient.phone,
          name: recipient.name,
          success: true
        })
        
        toast.success(`Pesan dijadwalkan untuk ${recipient.name}`)
        
      } catch (error) {
        console.error(`Failed to schedule message for ${recipient.name}:`, error)
        results.push({
          phone: recipient.phone,
          name: recipient.name,
          success: false,
          error: error.message
        })
      }
    }
    
    // Update campaign with results
    campaign.status = 'completed'
    campaign.results = {
      totalSent: recipients.length,
      successCount: results.filter(r => r.success).length,
      failedCount: results.filter(r => !r.success).length,
      results: results
    }
    campaign.completed_at = new Date().toISOString()
    
    toast.success(`Campaign selesai! ${campaign.results.successCount}/${campaign.results.totalSent} pesan berhasil dijadwalkan`)
    
  } catch (error) {
    console.error('Error executing campaign:', error)
    campaign.status = 'failed'
    toast.error('Gagal menjalankan campaign')
  }
}

const getRecipientsFromCampaign = (campaign) => {
  switch (campaign.target) {
    case 'all':
      return students.value
    case 'paid':
      return getPaidStudents()
    case 'unpaid':
      return getUnpaidStudents()
    case 'selected':
      return students.value.filter(s => campaign.recipients.includes(s.id))
    default:
      return []
  }
}

const getRecipientIds = () => {
  switch (campaignForm.target) {
    case 'all':
      return students.value.map(s => s.id)
    case 'paid':
      return getPaidStudents().map(s => s.id)
    case 'unpaid':
      return getUnpaidStudents().map(s => s.id)
    case 'selected':
      return campaignForm.selectedStudents
    default:
      return []
  }
}

const getTotalRecipients = () => {
  return getRecipientIds().length
}

const getTargetPreview = () => {
  const labels = {
    all: 'Semua Siswa',
    paid: 'Siswa Sudah Bayar',
    unpaid: 'Siswa Belum Bayar',
    selected: 'Pilihan Manual'
  }
  return labels[campaignForm.target] || 'Unknown'
}

const getSchedulePreview = () => {
  if (campaignForm.sendType === 'immediate') {
    return 'Kirim sekarang'
  }
  return campaignForm.scheduledDateTime ? 
    new Date(campaignForm.scheduledDateTime).toLocaleString('id-ID') : 
    'Belum diatur'
}

const getEstimatedCompletion = () => {
  const totalRecipients = getTotalRecipients()
  if (totalRecipients === 0) return '-'
  
  const totalMinutes = totalRecipients * campaignForm.delayMinutes
  const startTime = campaignForm.sendType === 'scheduled' && campaignForm.scheduledDateTime ?
    new Date(campaignForm.scheduledDateTime) :
    new Date()
  
  const endTime = new Date(startTime.getTime() + totalMinutes * 60 * 1000)
  return endTime.toLocaleString('id-ID')
}

const getTargetLabel = (target) => {
  const labels = {
    all: 'Semua Siswa',
    paid: 'Sudah Bayar',
    unpaid: 'Belum Bayar',
    selected: 'Pilihan Manual'
  }
  return labels[target] || target
}

const getRecipientCount = (campaign) => {
  const recipients = getRecipientsFromCampaign(campaign)
  return recipients.length
}

const getStatusLabel = (status) => {
  const labels = {
    draft: 'Draft',
    scheduled: 'Terjadwal',
    sending: 'Mengirim',
    completed: 'Selesai',
    failed: 'Gagal',
    cancelled: 'Dibatalkan'
  }
  return labels[status] || status
}

const getStatusClass = (status) => {
  const classes = {
    draft: 'bg-gray-100 text-gray-800',
    scheduled: 'bg-blue-100 text-blue-800',
    sending: 'bg-yellow-100 text-yellow-800',
    completed: 'bg-green-100 text-green-800',
    failed: 'bg-red-100 text-red-800',
    cancelled: 'bg-gray-100 text-gray-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

const getProgress = (campaign) => {
  if (!campaign.results) {
    return campaign.status === 'completed' ? 100 : 0
  }
  return Math.round((campaign.results.successCount / campaign.results.totalSent) * 100)
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleString('id-ID')
}

const viewCampaign = (campaign) => {
  selectedCampaign.value = campaign
  showDetailModal.value = true
}

const editCampaign = (campaign) => {
  editingCampaign.value = campaign
  campaignForm.title = campaign.title
  campaignForm.message = campaign.message
  campaignForm.target = campaign.target
  campaignForm.selectedStudents = campaign.recipients || []
  campaignForm.sendType = campaign.scheduled_at ? 'scheduled' : 'immediate'
  campaignForm.scheduledDateTime = campaign.scheduled_at ? 
    new Date(campaign.scheduled_at).toISOString().slice(0, 16) : ''
  campaignForm.delayMinutes = campaign.delay_minutes || 10
  showCreateModal.value = true
}

const deleteCampaign = async (campaignId) => {
  if (!confirm('Yakin ingin menghapus campaign ini?')) return
  
  const index = campaigns.value.findIndex(c => c.id === campaignId)
  if (index !== -1) {
    campaigns.value.splice(index, 1)
    toast.success('Campaign berhasil dihapus')
  }
}

const closeModal = () => {
  showCreateModal.value = false
  editingCampaign.value = null
  
  // Reset form
  Object.assign(campaignForm, {
    title: '',
    message: '',
    target: 'unpaid',
    selectedStudents: [],
    sendType: 'scheduled',
    scheduledDateTime: '',
    delayMinutes: 10
  })
}

// Lifecycle
onMounted(() => {
  loadData()
})
</script>
