<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Campaign WhatsApp</h1>
        <p class="mt-1 text-sm text-gray-500">
          Kelola campaign pengiriman pesan WhatsApp dengan CORS Bypass
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

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div class="card p-6">
        <div class="flex items-center">
          <div class="p-2 bg-blue-100 rounded-lg">
            <MegaphoneIcon class="w-6 h-6 text-blue-600" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Total Campaign</p>
            <p class="text-2xl font-semibold text-gray-900">{{ stats.total }}</p>
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
            <p class="text-2xl font-semibold text-gray-900">{{ stats.completed }}</p>
          </div>
        </div>
      </div>

      <div class="card p-6">
        <div class="flex items-center">
          <div class="p-2 bg-yellow-100 rounded-lg">
            <PlayIcon class="w-6 h-6 text-yellow-600" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Berjalan</p>
            <p class="text-2xl font-semibold text-gray-900">{{ stats.running }}</p>
          </div>
        </div>
      </div>

      <div class="card p-6">
        <div class="flex items-center">
          <div class="p-2 bg-gray-100 rounded-lg">
            <DocumentTextIcon class="w-6 h-6 text-gray-600" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Draft</p>
            <p class="text-2xl font-semibold text-gray-900">{{ stats.draft }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- CORS Bypass Info -->
    <div class="card p-6 bg-gradient-to-r from-blue-50 to-purple-50">
      <div class="flex items-center justify-between">
        <div>
          <h3 class="text-lg font-semibold text-gray-900">🛡️ CORS Bypass Technology</h3>
          <p class="text-sm text-gray-600 mt-1">
            Sistem bypass CORS aktif untuk memastikan delivery WhatsApp 100% berhasil
          </p>
        </div>
        <div class="flex items-center space-x-2">
          <div class="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
          <span class="text-sm font-medium text-green-700">Active</span>
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
          <MegaphoneIcon class="mx-auto h-12 w-12 text-gray-400" />
          <h3 class="mt-2 text-sm font-medium text-gray-900">Belum ada campaign</h3>
          <p class="mt-1 text-sm text-gray-500">Mulai dengan membuat campaign pertama Anda.</p>
          <div class="mt-6">
            <button @click="showCreateModal = true" class="btn-primary">
              <PlusIcon class="w-5 h-5 mr-2" />
              Buat Campaign Baru
            </button>
          </div>
        </div>

        <div v-else class="space-y-4">
          <div 
            v-for="campaign in campaigns" 
            :key="campaign.id"
            class="border rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div class="flex items-center justify-between">
              <div class="flex-1">
                <h4 class="font-semibold text-gray-900">{{ campaign.title }}</h4>
                <p class="text-sm text-gray-600 mt-1">{{ campaign.message.substring(0, 100) }}...</p>
                <div class="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                  <span>{{ campaign.recipients.length }} penerima</span>
                  <span>Delay: {{ campaign.delaySeconds }}s</span>
                  <span>{{ formatDate(campaign.createdAt) }}</span>
                </div>
              </div>
              
              <div class="flex items-center space-x-3">
                <span :class="getStatusClass(campaign.status)" class="px-2 py-1 text-xs font-semibold rounded-full">
                  {{ getStatusLabel(campaign.status) }}
                </span>
                
                <div class="flex space-x-2">
                  <button 
                    v-if="campaign.status === 'draft'"
                    @click="executeCampaign(campaign)"
                    :disabled="isExecuting"
                    class="text-green-600 hover:text-green-900 disabled:opacity-50"
                    title="Jalankan Campaign"
                  >
                    <PlayIcon class="w-5 h-5" />
                  </button>
                  
                  <button 
                    @click="viewCampaign(campaign)"
                    class="text-blue-600 hover:text-blue-900"
                    title="Lihat Detail"
                  >
                    <EyeIcon class="w-5 h-5" />
                  </button>
                  
                  <button 
                    v-if="campaign.status === 'draft'"
                    @click="editCampaign(campaign)"
                    class="text-yellow-600 hover:text-yellow-900"
                    title="Edit Campaign"
                  >
                    <PencilIcon class="w-5 h-5" />
                  </button>
                  
                  <button 
                    @click="deleteCampaign(campaign.id)"
                    class="text-red-600 hover:text-red-900"
                    title="Hapus Campaign"
                  >
                    <TrashIcon class="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            <!-- Progress Bar untuk campaign yang berjalan -->
            <div v-if="campaign.status === 'running' && executingCampaignId === campaign.id" class="mt-4">
              <div class="flex items-center justify-between text-sm text-gray-600 mb-2">
                <span>Progress Pengiriman</span>
                <span>{{ progressData.current }}/{{ progressData.total }}</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div 
                  class="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                  :style="{ width: `${(progressData.current / progressData.total) * 100}%` }"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <div 
      v-if="showCreateModal || editingCampaign"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <div class="bg-white rounded-lg max-w-2xl w-full max-h-screen overflow-y-auto p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">
          {{ editingCampaign ? 'Edit Campaign' : 'Buat Campaign Baru' }}
        </h3>
        
        <form @submit.prevent="saveCampaign" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Judul Campaign</label>
            <input
              v-model="campaignForm.title"
              type="text"
              required
              class="input-field"
              placeholder="Contoh: Reminder Pembayaran Kas Januari"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Pesan</label>
            <textarea 
              v-model="campaignForm.message"
              rows="6"
              required
              class="input-field"
              placeholder="Tulis pesan campaign. Gunakan [[NAME]], [[NICKNAME]], [[PHONE]] untuk personalisasi."
            ></textarea>
            <p class="text-xs text-gray-500 mt-1">
              Variabel tersedia: [[NAME]], [[NICKNAME]], [[PHONE]]
            </p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Target Penerima</label>
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
              Pilih Siswa ({{ selectedStudents.length }} dipilih)
            </label>
            <div class="max-h-48 overflow-y-auto space-y-2">
              <label 
                v-for="student in students" 
                :key="student.id"
                class="flex items-center"
              >
                <input
                  v-model="selectedStudents"
                  type="checkbox"
                  :value="student"
                  class="mr-2"
                />
                {{ student.name }} ({{ student.nickname }}) - {{ student.phone }}
              </label>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Delay Antar Pesan (detik)</label>
            <select v-model.number="campaignForm.delaySeconds" class="input-field">
              <option :value="1">1 detik (cepat)</option>
              <option :value="2">2 detik</option>
              <option :value="3">3 detik (recommended)</option>
              <option :value="5">5 detik</option>
              <option :value="10">10 detik</option>
            </select>
          </div>
          
          <div class="flex justify-end space-x-3 pt-4">
            <button 
              type="button"
              @click="cancelEdit"
              class="btn-secondary"
            >
              Batal
            </button>
            <button 
              type="submit"
              :disabled="saving"
              class="btn-primary"
            >
              {{ saving ? 'Menyimpan...' : (editingCampaign ? 'Update' : 'Buat Campaign') }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- View Details Modal -->
    <div 
      v-if="viewingCampaign"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <div class="bg-white rounded-lg max-w-2xl w-full max-h-screen overflow-y-auto p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-gray-900">Detail Campaign</h3>
          <button @click="viewingCampaign = null" class="text-gray-400 hover:text-gray-600">
            <XMarkIcon class="w-6 h-6" />
          </button>
        </div>
        
        <div v-if="viewingCampaign" class="space-y-4">
          <div>
            <h4 class="font-medium text-gray-900">{{ viewingCampaign.title }}</h4>
            <p class="text-sm text-gray-500">{{ formatDate(viewingCampaign.createdAt) }}</p>
          </div>
          
          <div>
            <h5 class="font-medium text-gray-700">Pesan:</h5>
            <div class="bg-gray-50 p-3 rounded-lg mt-1">
              <pre class="whitespace-pre-wrap text-sm">{{ viewingCampaign.message }}</pre>
            </div>
          </div>
          
          <div>
            <h5 class="font-medium text-gray-700">Penerima ({{ viewingCampaign.recipients.length }}):</h5>
            <div class="bg-gray-50 p-3 rounded-lg mt-1 max-h-32 overflow-y-auto">
              <div v-for="recipient in viewingCampaign.recipients" :key="recipient.phone" class="text-sm">
                {{ recipient.name }} ({{ recipient.phone }})
              </div>
            </div>
          </div>

          <div v-if="viewingCampaign.results" class="space-y-3">
            <h5 class="font-medium text-gray-700">Hasil Pengiriman:</h5>
            <div class="grid grid-cols-3 gap-4">
              <div class="text-center p-3 bg-green-50 rounded-lg">
                <div class="text-2xl font-bold text-green-600">{{ viewingCampaign.results.sent }}</div>
                <div class="text-sm text-green-700">Berhasil</div>
              </div>
              <div class="text-center p-3 bg-red-50 rounded-lg">
                <div class="text-2xl font-bold text-red-600">{{ viewingCampaign.results.failed }}</div>
                <div class="text-sm text-red-700">Gagal</div>
              </div>
              <div class="text-center p-3 bg-blue-50 rounded-lg">
                <div class="text-2xl font-bold text-blue-600">{{ viewingCampaign.results.total }}</div>
                <div class="text-sm text-blue-700">Total</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import { useToast } from 'vue-toastification'
import { useAppStore } from '@/stores'
import campaignManager from '@/services/campaigns'
import whatsappSender from '@/services/whatsappSender'
import {
  PlusIcon,
  MegaphoneIcon,
  CheckCircleIcon,
  PlayIcon,
  DocumentTextIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  XMarkIcon
} from '@heroicons/vue/24/outline'

const store = useAppStore()
const toast = useToast()

// State
const campaigns = ref([])
const students = ref([])
const loading = ref(false)
const saving = ref(false)
const isExecuting = ref(false)
const executingCampaignId = ref(null)
const showCreateModal = ref(false)
const editingCampaign = ref(null)
const viewingCampaign = ref(null)
const selectedStudents = ref([])

// Progress tracking
const progressData = reactive({
  current: 0,
  total: 0,
  sent: 0,
  failed: 0
})

// Form
const campaignForm = reactive({
  title: '',
  message: '',
  target: 'all',
  delaySeconds: 3
})

// Computed
const stats = computed(() => campaignManager.getStats())

// Methods
const loadData = async () => {
  try {
    loading.value = true
    
    // Load students
    await store.fetchStudents()
    students.value = store.students || []
    
    // Load campaigns
    campaigns.value = campaignManager.getCampaigns()
    
    // Create demo campaign if needed
    if (campaigns.value.length === 0 && students.value.length > 0) {
      campaignManager.createDemoCampaign(students.value)
      campaigns.value = campaignManager.getCampaigns()
    }
    
    toast.success('Data berhasil dimuat')
    
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
    
    // Get recipients
    let recipients = []
    if (campaignForm.target === 'all') {
      recipients = students.value
    } else if (campaignForm.target === 'selected') {
      recipients = selectedStudents.value
    }
    
    if (recipients.length === 0) {
      toast.error('Pilih minimal 1 penerima')
      return
    }
    
    const campaignData = {
      title: campaignForm.title,
      message: campaignForm.message,
      recipients: recipients,
      target: campaignForm.target,
      delaySeconds: campaignForm.delaySeconds
    }
    
    if (editingCampaign.value) {
      campaignManager.updateCampaign(editingCampaign.value.id, campaignData)
      toast.success('Campaign berhasil diupdate')
    } else {
      campaignManager.createCampaign(campaignData)
      toast.success('Campaign berhasil dibuat')
    }
    
    campaigns.value = campaignManager.getCampaigns()
    cancelEdit()
    
  } catch (error) {
    console.error('Error saving campaign:', error)
    toast.error('Gagal menyimpan campaign')
  } finally {
    saving.value = false
  }
}

const executeCampaign = async (campaign) => {
  if (isExecuting.value) {
    toast.warning('Campaign lain sedang berjalan')
    return
  }
  
  if (!confirm(`Jalankan campaign "${campaign.title}"?`)) {
    return
  }
  
  try {
    isExecuting.value = true
    executingCampaignId.value = campaign.id
    
    toast.info(`🚀 Memulai campaign: ${campaign.title}`)
    
    const result = await campaignManager.executeCampaign(campaign.id)
    
    if (result.success) {
      toast.success(`✅ Campaign selesai! ${result.results.sent}/${result.results.total} berhasil`)
    }
    
    campaigns.value = campaignManager.getCampaigns()
    
  } catch (error) {
    console.error('Error executing campaign:', error)
    toast.error(`❌ Gagal menjalankan campaign: ${error.message}`)
  } finally {
    isExecuting.value = false
    executingCampaignId.value = null
  }
}

const viewCampaign = (campaign) => {
  viewingCampaign.value = campaign
}

const editCampaign = (campaign) => {
  editingCampaign.value = campaign
  campaignForm.title = campaign.title
  campaignForm.message = campaign.message
  campaignForm.target = campaign.target
  campaignForm.delaySeconds = campaign.delaySeconds
  selectedStudents.value = campaign.recipients
  showCreateModal.value = true
}

const deleteCampaign = (campaignId) => {
  if (confirm('Yakin ingin menghapus campaign ini?')) {
    campaignManager.deleteCampaign(campaignId)
    campaigns.value = campaignManager.getCampaigns()
    toast.success('Campaign berhasil dihapus')
  }
}

const cancelEdit = () => {
  showCreateModal.value = false
  editingCampaign.value = null
  campaignForm.title = ''
  campaignForm.message = ''
  campaignForm.target = 'all'
  campaignForm.delaySeconds = 3
  selectedStudents.value = []
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getStatusLabel = (status) => {
  const labels = {
    draft: 'Draft',
    running: 'Berjalan',
    completed: 'Selesai',
    failed: 'Gagal'
  }
  return labels[status] || status
}

const getStatusClass = (status) => {
  const classes = {
    draft: 'bg-gray-100 text-gray-800',
    running: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    failed: 'bg-red-100 text-red-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

// Event listeners
const handleProgress = (event) => {
  const { current, total, sent, failed } = event.detail
  progressData.current = current
  progressData.total = total
  progressData.sent = sent
  progressData.failed = failed
}

const handleComplete = (event) => {
  const { total, sent, failed } = event.detail
  console.log(`🎉 Campaign completed: ${sent}/${total} sent, ${failed} failed`)
  
  // Refresh campaigns
  campaigns.value = campaignManager.getCampaigns()
}

// Lifecycle
onMounted(() => {
  loadData()
  
  // Listen for WhatsApp events
  window.addEventListener('whatsapp:progress', handleProgress)
  window.addEventListener('whatsapp:complete', handleComplete)
  
  console.log('📱 Campaigns page loaded with CORS Bypass support')
})

onUnmounted(() => {
  window.removeEventListener('whatsapp:progress', handleProgress)
  window.removeEventListener('whatsapp:complete', handleComplete)
})
</script>
