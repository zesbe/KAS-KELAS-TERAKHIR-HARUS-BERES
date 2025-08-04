<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-semibold text-gray-900">Campaign Pesan</h1>
        <p class="text-sm text-gray-500 mt-1">Kelola kampanye pesan WhatsApp untuk komunikasi kelas</p>
      </div>
      <button 
        @click="showCreateModal = true"
        class="btn-primary"
      >
        <PlusIcon class="w-4 h-4 mr-2" />
        Buat Campaign
      </button>
    </div>

    <!-- Summary Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div class="card p-6">
        <div class="flex items-center">
          <div class="p-2 bg-primary-100 rounded-lg">
            <SpeakerWaveIcon class="w-6 h-6 text-primary-600" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Total Campaign</p>
            <p class="text-2xl font-semibold text-gray-900">
              {{ store.campaigns.length }}
            </p>
          </div>
        </div>
      </div>

      <div class="card p-6">
        <div class="flex items-center">
          <div class="p-2 bg-warning-100 rounded-lg">
            <ClockIcon class="w-6 h-6 text-warning-600" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Sedang Berjalan</p>
            <p class="text-2xl font-semibold text-gray-900">
              {{ runningCampaigns.length }}
            </p>
          </div>
        </div>
      </div>

      <div class="card p-6">
        <div class="flex items-center">
          <div class="p-2 bg-success-100 rounded-lg">
            <CheckCircleIcon class="w-6 h-6 text-success-600" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Selesai</p>
            <p class="text-2xl font-semibold text-gray-900">
              {{ completedCampaigns.length }}
            </p>
          </div>
        </div>
      </div>

      <div class="card p-6">
        <div class="flex items-center">
          <div class="p-2 bg-green-100 rounded-lg">
            <ChatBubbleLeftRightIcon class="w-6 h-6 text-green-600" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Pesan Terkirim</p>
            <p class="text-2xl font-semibold text-gray-900">
              {{ totalMessagesSent }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Campaign Templates -->
    <div class="card p-6">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">Template Pesan Cepat</h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div 
          v-for="template in messageTemplates" 
          :key="template.id"
          @click="useTemplate(template)"
          class="p-4 border border-gray-200 rounded-lg cursor-pointer hover:border-primary-300 hover:bg-primary-50 transition-colors"
        >
          <h4 class="font-medium text-gray-900 mb-2">{{ template.title }}</h4>
          <p class="text-sm text-gray-500 line-clamp-3">{{ template.preview }}</p>
        </div>
      </div>
    </div>

    <!-- Campaigns Table -->
    <div class="card p-6">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold text-gray-900">Riwayat Campaign</h3>
        <div class="flex space-x-2">
          <select v-model="statusFilter" class="input-field w-auto">
            <option value="">Semua Status</option>
            <option value="draft">Draft</option>
            <option value="sending">Mengirim</option>
            <option value="completed">Selesai</option>
            <option value="failed">Gagal</option>
          </select>
        </div>
      </div>
      
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Judul
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Target
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Jeda
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Progress
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Dibuat
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="campaign in filteredCampaigns" :key="campaign.id">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <div>
                  <div class="font-medium">{{ campaign.title }}</div>
                  <div class="text-gray-500 text-xs truncate max-w-xs">{{ campaign.message }}</div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ campaign.recipients?.length || 0 }} siswa
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ campaign.delay_minutes }} menit
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="getStatusClass(campaign.status)">
                  {{ getStatusLabel(campaign.status) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <div class="flex items-center">
                  <div class="w-16 bg-gray-200 rounded-full h-2 mr-2">
                    <div 
                      :class="['h-2 rounded-full', getProgressColor(campaign.status)]"
                      :style="{ width: getProgressPercentage(campaign) + '%' }"
                    ></div>
                  </div>
                  <span class="text-xs">{{ getProgressText(campaign) }}</span>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(campaign.created_at) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div class="flex items-center space-x-2">
                  <button 
                    @click="viewCampaign(campaign)"
                    class="text-primary-600 hover:text-primary-900"
                  >
                    Detail
                  </button>
                  <button 
                    v-if="campaign.status === 'draft'"
                    @click="editCampaign(campaign)"
                    class="text-warning-600 hover:text-warning-900"
                  >
                    Edit
                  </button>
                  <button 
                    @click="deleteCampaign(campaign)"
                    class="text-red-600 hover:text-red-900"
                  >
                    Hapus
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        
        <div v-if="filteredCampaigns.length === 0" class="text-center py-8">
          <p class="text-sm text-gray-500">Tidak ada campaign yang ditemukan</p>
        </div>
      </div>
    </div>

    <!-- Create Campaign Modal -->
    <div 
      v-if="showCreateModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <div class="bg-white rounded-lg max-w-2xl w-full p-6 max-h-screen overflow-y-auto">
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
              placeholder="Contoh: Pengingat Kas Bulanan Februari"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Pesan</label>
            <textarea 
              v-model="campaignForm.message"
              rows="6"
              required
              class="input-field"
              placeholder="Tulis pesan yang akan dikirim..."
            ></textarea>
            <p class="text-xs text-gray-500 mt-1">
              Karakter: {{ campaignForm.message.length }}/1000
            </p>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Target Penerima</label>
              <select v-model="campaignForm.target" @change="updateRecipients" class="input-field">
                <option value="all">Semua Siswa</option>
                <option value="unpaid">Siswa Belum Bayar</option>
                <option value="paid">Siswa Sudah Bayar</option>
                <option value="selected">Pilih Manual</option>
              </select>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Jeda Kirim (Menit)</label>
              <select v-model.number="campaignForm.delay_minutes" class="input-field">
                <option :value="0.5">30 Detik</option>
                <option :value="1">1 Menit</option>
                <option :value="2">2 Menit</option>
                <option :value="3">3 Menit</option>
                <option :value="5">5 Menit</option>
                <option :value="10">10 Menit</option>
              </select>
            </div>
          </div>
          
          <!-- Manual Recipient Selection -->
          <div v-if="campaignForm.target === 'selected'" class="space-y-2">
            <label class="block text-sm font-medium text-gray-700">Pilih Penerima</label>
            <div class="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-3">
              <label 
                v-for="student in store.students" 
                :key="student.id"
                class="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded"
              >
                <input 
                  type="checkbox" 
                  :value="student.id"
                  v-model="campaignForm.recipients"
                  class="rounded"
                />
                <span class="text-sm">{{ student.name }}</span>
              </label>
            </div>
          </div>
          
          <!-- Recipients Preview -->
          <div class="bg-gray-50 rounded-lg p-4">
            <h4 class="text-sm font-medium text-gray-700 mb-2">Preview Penerima</h4>
            <p class="text-sm text-gray-600">
              Total penerima: <strong>{{ selectedRecipients.length }}</strong>
            </p>
            <p class="text-sm text-gray-500 mt-1">
              Estimasi waktu kirim: <strong>{{ estimatedDuration }}</strong>
            </p>
          </div>
          
          <div class="flex justify-end space-x-3 pt-4">
            <button 
              type="button"
              @click="cancelCreate"
              class="btn-secondary"
            >
              Batal
            </button>
            <button 
              type="button"
              @click="saveDraft"
              :disabled="saving"
              class="btn-secondary"
            >
              Simpan Draft
            </button>
            <button 
              type="submit"
              :disabled="saving || selectedRecipients.length === 0"
              class="btn-primary"
            >
              {{ saving ? 'Mengirim...' : 'Kirim Sekarang' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Campaign Detail Modal -->
    <div 
      v-if="showDetailModal && viewingCampaign"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <div class="bg-white rounded-lg max-w-2xl w-full p-6 max-h-screen overflow-y-auto">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Detail Campaign</h3>
        
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Judul</label>
            <p class="text-sm text-gray-900">{{ viewingCampaign.title }}</p>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Pesan</label>
            <div class="bg-gray-50 rounded-lg p-3">
              <p class="text-sm text-gray-900 whitespace-pre-wrap">{{ viewingCampaign.message }}</p>
            </div>
          </div>
          
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <span :class="getStatusClass(viewingCampaign.status)">
                {{ getStatusLabel(viewingCampaign.status) }}
              </span>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Jeda Kirim</label>
              <p class="text-sm text-gray-900">{{ viewingCampaign.delay_minutes }} menit</p>
            </div>
          </div>
          
          <!-- Results -->
          <div v-if="viewingCampaign.results">
            <label class="block text-sm font-medium text-gray-700 mb-2">Hasil Pengiriman</label>
            <div class="space-y-2 max-h-48 overflow-y-auto">
              <div 
                v-for="result in viewingCampaign.results" 
                :key="result.phone"
                class="flex items-center justify-between p-2 bg-gray-50 rounded"
              >
                <span class="text-sm">{{ result.recipient }}</span>
                <span :class="[
                  'text-xs px-2 py-1 rounded-full',
                  result.success ? 'bg-success-100 text-success-800' : 'bg-red-100 text-red-800'
                ]">
                  {{ result.success ? 'Berhasil' : 'Gagal' }}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <div class="flex justify-end pt-4">
          <button 
            @click="showDetailModal = false"
            class="btn-secondary"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'
import { useAppStore } from '@/stores'
import { useToast } from 'vue-toastification'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'
import {
  PlusIcon,
  SpeakerWaveIcon,
  ClockIcon,
  CheckCircleIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/vue/24/outline'

const store = useAppStore()
const toast = useToast()

const showCreateModal = ref(false)
const showDetailModal = ref(false)
const viewingCampaign = ref(null)
const editingCampaign = ref(null)
const statusFilter = ref('')
const saving = ref(false)

const campaignForm = reactive({
  title: '',
  message: '',
  target: 'all',
  recipients: [],
  delay_minutes: 1
})

const messageTemplates = [
  {
    id: 'payment-reminder',
    title: 'Pengingat Pembayaran',
    preview: 'Halo, ini adalah pengingat untuk pembayaran kas kelas...',
    content: `Halo {nama},

Ini adalah pengingat pembayaran kas kelas untuk bulan ini.

💰 Jumlah: Rp 25.000
📅 Batas waktu: Akhir bulan

Silakan lakukan pembayaran melalui link yang akan kami kirimkan.

Terima kasih!

_Kas Kelas 1B SD Islam Al Husna_`
  },
  {
    id: 'payment-link',
    title: 'Link Pembayaran',
    preview: 'Halo, silakan lakukan pembayaran melalui link berikut...',
    content: `Halo {nama},

Silakan lakukan pembayaran kas kelas melalui link berikut:

💰 Jumlah: {jumlah}
🔗 Link: {link}

Pembayaran dapat dilakukan dengan QRIS.

Terima kasih!

_Kas Kelas 1B SD Islam Al Husna_`
  },
  {
    id: 'general-info',
    title: 'Informasi Umum',
    preview: 'Halo orang tua siswa kelas 1B, kami ingin menyampaikan...',
    content: `Halo orang tua siswa kelas 1B,

Kami ingin menyampaikan informasi penting mengenai kegiatan kelas.

📢 {informasi}

Terima kasih atas perhatiannya.

_SD Islam Al Husna - Kelas 1B_`
  }
]

const runningCampaigns = computed(() => {
  return store.campaigns.filter(c => c.status === 'sending')
})

const completedCampaigns = computed(() => {
  return store.campaigns.filter(c => c.status === 'completed')
})

const totalMessagesSent = computed(() => {
  return store.campaigns.reduce((total, campaign) => {
    if (campaign.results) {
      return total + campaign.results.filter(r => r.success).length
    }
    return total
  }, 0)
})

const filteredCampaigns = computed(() => {
  let campaigns = [...store.campaigns]
  
  if (statusFilter.value) {
    campaigns = campaigns.filter(c => c.status === statusFilter.value)
  }
  
  return campaigns.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
})

const selectedRecipients = computed(() => {
  if (campaignForm.target === 'all') {
    return store.students
  } else if (campaignForm.target === 'unpaid') {
    const paidStudentIds = store.transactions
      .filter(t => t.type === 'income' && t.status === 'completed')
      .map(t => t.student_id)
    return store.students.filter(s => !paidStudentIds.includes(s.id))
  } else if (campaignForm.target === 'paid') {
    const paidStudentIds = store.transactions
      .filter(t => t.type === 'income' && t.status === 'completed')
      .map(t => t.student_id)
    return store.students.filter(s => paidStudentIds.includes(s.id))
  } else if (campaignForm.target === 'selected') {
    return store.students.filter(s => campaignForm.recipients.includes(s.id))
  }
  return []
})

const estimatedDuration = computed(() => {
  const totalRecipients = selectedRecipients.value.length
  const delayMinutes = campaignForm.delay_minutes
  const totalMinutes = (totalRecipients - 1) * delayMinutes
  
  if (totalMinutes < 60) {
    return `${totalMinutes} menit`
  } else {
    const hours = Math.floor(totalMinutes / 60)
    const minutes = totalMinutes % 60
    return `${hours} jam ${minutes} menit`
  }
})

const formatDate = (dateString) => {
  return format(new Date(dateString), 'dd MMM yyyy HH:mm', { locale: id })
}

const getStatusLabel = (status) => {
  const labels = {
    draft: 'Draft',
    sending: 'Mengirim',
    completed: 'Selesai',
    failed: 'Gagal'
  }
  return labels[status] || status
}

const getStatusClass = (status) => {
  const classes = {
    draft: 'inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800',
    sending: 'inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-warning-100 text-warning-800',
    completed: 'inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-success-100 text-success-800',
    failed: 'inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800'
  }
  return classes[status] || classes.draft
}

const getProgressPercentage = (campaign) => {
  if (campaign.status === 'draft') return 0
  if (campaign.status === 'completed') return 100
  if (campaign.status === 'failed') return 100
  if (campaign.status === 'sending') return 50
  return 0
}

const getProgressColor = (status) => {
  const colors = {
    draft: 'bg-gray-300',
    sending: 'bg-warning-500',
    completed: 'bg-success-500',
    failed: 'bg-red-500'
  }
  return colors[status] || 'bg-gray-300'
}

const getProgressText = (campaign) => {
  if (campaign.results) {
    const successful = campaign.results.filter(r => r.success).length
    const total = campaign.results.length
    return `${successful}/${total}`
  }
  return '-'
}

const useTemplate = (template) => {
  campaignForm.title = template.title
  campaignForm.message = template.content
  showCreateModal.value = true
}

const updateRecipients = () => {
  campaignForm.recipients = []
}

const viewCampaign = (campaign) => {
  viewingCampaign.value = campaign
  showDetailModal.value = true
}

const editCampaign = (campaign) => {
  editingCampaign.value = campaign
  campaignForm.title = campaign.title
  campaignForm.message = campaign.message
  campaignForm.target = campaign.target || 'all'
  campaignForm.recipients = campaign.recipients || []
  campaignForm.delay_minutes = campaign.delay_minutes || 1
  showCreateModal.value = true
}

const saveDraft = async () => {
  try {
    saving.value = true
    
    const campaignData = {
      title: campaignForm.title,
      message: campaignForm.message,
      target: campaignForm.target,
      recipients: selectedRecipients.value.map(s => s.id),
      delay_minutes: campaignForm.delay_minutes,
      status: 'draft'
    }

    if (editingCampaign.value) {
      await store.db.updateCampaign(editingCampaign.value.id, campaignData)
      toast.success('Draft berhasil diupdate')
    } else {
      await store.db.addCampaign(campaignData)
      toast.success('Draft berhasil disimpan')
    }

    await store.fetchCampaigns()
    cancelCreate()
  } catch (error) {
    toast.error('Gagal menyimpan draft')
    console.error('Error saving draft:', error)
  } finally {
    saving.value = false
  }
}

const saveCampaign = async () => {
  try {
    saving.value = true
    
    const campaignData = {
      title: campaignForm.title,
      message: campaignForm.message,
      target: campaignForm.target,
      recipients: selectedRecipients.value.map(s => s.id),
      delay_minutes: campaignForm.delay_minutes,
      status: 'sending'
    }

    if (editingCampaign.value) {
      await store.db.updateCampaign(editingCampaign.value.id, campaignData)
    } else {
      await store.sendCampaign(campaignData)
    }

    toast.success('Campaign berhasil dikirim')
    cancelCreate()
  } catch (error) {
    toast.error('Gagal mengirim campaign')
    console.error('Error sending campaign:', error)
  } finally {
    saving.value = false
  }
}

const deleteCampaign = async (campaign) => {
  if (confirm('Apakah Anda yakin ingin menghapus campaign ini?')) {
    try {
      await store.db.deleteCampaign(campaign.id)
      await store.fetchCampaigns()
      toast.success('Campaign berhasil dihapus')
    } catch (error) {
      toast.error('Gagal menghapus campaign')
      console.error('Error deleting campaign:', error)
    }
  }
}

const cancelCreate = () => {
  showCreateModal.value = false
  editingCampaign.value = null
  resetForm()
}

const resetForm = () => {
  campaignForm.title = ''
  campaignForm.message = ''
  campaignForm.target = 'all'
  campaignForm.recipients = []
  campaignForm.delay_minutes = 1
}

// Watch for target changes to update recipients
watch(() => campaignForm.target, updateRecipients)
</script>
