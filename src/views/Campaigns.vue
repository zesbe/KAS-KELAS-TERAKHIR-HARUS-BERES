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

    <!-- StarSender Control Panel (Temporarily Disabled for Debug) -->
    <div class="startsender-info card p-6 mb-6">
      <div class="flex items-center justify-between">
        <div>
          <h3 class="text-lg font-semibold text-gray-900">🌟 StarSender System</h3>
          <p class="text-sm text-gray-600">Advanced WhatsApp Broadcasting with CORS Bypass</p>
        </div>
        <button @click="enableStarSender" class="btn-primary">
          🚀 Enable StarSender
        </button>
      </div>
    </div>

    <!-- StarSender Components (Loaded dynamically) -->
    <div v-if="startsenderEnabled">
      <Suspense>
        <template #default>
          <StarSenderPanel />
          <StarSenderTest />
        </template>
        <template #fallback>
          <div class="card p-6 text-center">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p class="text-sm text-gray-500">Loading StarSender...</p>
          </div>
        </template>
      </Suspense>
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
    <div v-if="showCreateModal"
         class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-start justify-center pt-4 pb-20 px-4"
         @click="closeModal">
      <div class="relative w-full max-w-2xl mx-auto bg-white rounded-lg shadow-xl my-8 max-h-full overflow-y-auto"
           @click.stop>
        <div class="p-4 sm:p-6">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-lg sm:text-xl font-medium text-gray-900">
              {{ editingCampaign ? 'Edit Campaign' : 'Buat Campaign Baru' }}
            </h3>
            <button @click="closeModal" class="text-gray-400 hover:text-gray-600 p-2 -mr-2">
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

            <!-- Template Selector -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Template Pesan Profesional
              </label>
              <select v-model="selectedTemplate" @change="applyTemplate" class="input-field mb-3">
                <option value="">-- Pilih Template --</option>
                <option value="payment_reminder">💰 Reminder Pembayaran Kas</option>
                <option value="payment_urgent">🚨 Urgent - Pembayaran Terlambat</option>
                <option value="payment_first_notice">📋 Pemberitahuan Pembayaran</option>
                <option value="info_announcement">📢 Pengumuman Kelas</option>
                <option value="payment_confirmation">✅ Konfirmasi Pembayaran</option>
                <option value="event_payment">🎉 Pembayaran Kegiatan</option>
                <option value="thank_you">🙏 Terima Kasih & Apresiasi</option>
                <option value="custom">✏️ Custom Message</option>
              </select>
            </div>

            <!-- Auto Payment Link Generator -->
            <div v-if="needsPaymentLink" class="border rounded-lg p-4 bg-blue-50">
              <h4 class="font-medium text-blue-900 mb-3">💳 Auto Generate Payment Links</h4>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700">
                    Jumlah Pembayaran
                  </label>
                  <input
                    v-model="paymentConfig.amount"
                    type="number"
                    min="1"
                    class="input-field"
                    placeholder="50000"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700">
                    Jatuh Tempo
                  </label>
                  <input
                    v-model="paymentConfig.dueDate"
                    type="date"
                    class="input-field"
                  />
                </div>
              </div>

              <div class="mt-3">
                <label class="block text-sm font-medium text-gray-700">
                  Keterangan Pembayaran
                </label>
                <input
                  v-model="paymentConfig.description"
                  type="text"
                  class="input-field"
                  placeholder="Kas Kelas Januari 2024"
                />
              </div>

              <div class="mt-3 p-3 bg-white rounded border">
                <p class="text-sm text-blue-700">
                  ✅ Link PakaSir akan otomatis dibuat untuk setiap siswa<br>
                  ✅ Variable [[PAYMENT_LINK]] akan diganti dengan link unik<br>
                  ✅ Payment tracking otomatis terintegrasi
                </p>
              </div>
            </div>

            <!-- Message Template Editor -->
            <div>
              <label class="block text-sm font-medium text-gray-700">
                Template Pesan
              </label>
              <textarea
                v-model="campaignForm.message"
                rows="12"
                required
                class="input-field font-mono text-sm"
                placeholder="Ketik pesan Anda di sini atau pilih template di atas..."
              ></textarea>
              <div class="mt-2 text-sm text-gray-500">
                <p><strong>Variable tersedia:</strong></p>
                <div class="grid grid-cols-2 md:grid-cols-3 gap-1 mt-1">
                  <span class="px-2 py-1 bg-gray-100 rounded text-xs">[[NAME]]</span>
                  <span class="px-2 py-1 bg-gray-100 rounded text-xs">[[NICKNAME]]</span>
                  <span class="px-2 py-1 bg-gray-100 rounded text-xs">[[PHONE]]</span>
                  <span class="px-2 py-1 bg-blue-100 rounded text-xs">[[TIME_GREETING]]</span>
                  <span class="px-2 py-1 bg-blue-100 rounded text-xs">[[MONTH]]</span>
                  <span class="px-2 py-1 bg-green-100 rounded text-xs">[[PAYMENT_LINK]]</span>
                  <span class="px-2 py-1 bg-green-100 rounded text-xs">[[AMOUNT]]</span>
                  <span class="px-2 py-1 bg-green-100 rounded text-xs">[[DUE_DATE]]</span>
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
                <p><strong>Template:</strong> {{ getTemplatePreview() }}</p>
                <p><strong>Target:</strong> {{ getTargetPreview() }}</p>
                <p><strong>Total Penerima:</strong> {{ getTotalRecipients() }} nomor</p>
                <p><strong>Jadwal:</strong> {{ getSchedulePreview() }}</p>
                <p><strong>Jeda:</strong> {{ campaignForm.delayMinutes }} menit antar pesan</p>
                <p><strong>Estimasi Selesai:</strong> {{ getEstimatedCompletion() }}</p>

                <div v-if="needsPaymentLink && paymentConfig.generateLinks" class="mt-3 pt-3 border-t">
                  <p class="font-medium text-blue-900">💳 Payment Links:</p>
                  <p><strong>Jumlah:</strong> Rp {{ paymentConfig.amount?.toLocaleString('id-ID') }}</p>
                  <p><strong>Deskripsi:</strong> {{ paymentConfig.description || 'Kas Kelas' }}</p>
                  <p><strong>Jatuh Tempo:</strong> {{ paymentConfig.dueDate || 'Belum diatur' }}</p>
                  <p class="text-blue-600 text-xs mt-1">
                    ✅ {{ getTotalRecipients() }} link PakaSir akan dibuat otomatis
                  </p>
                </div>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex flex-col sm:flex-row sm:justify-end space-y-3 sm:space-y-0 sm:space-x-3 pt-6 border-t border-gray-200">
              <button
                type="button"
                @click="closeModal"
                class="btn-secondary w-full sm:w-auto order-2 sm:order-1"
              >
                Batal
              </button>
              <button
                type="submit"
                :disabled="saving"
                class="btn-primary w-full sm:w-auto order-1 sm:order-2"
              >
                {{ saving ? 'Menyimpan...' : (editingCampaign ? 'Update Campaign' : 'Buat Campaign') }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Campaign Detail Modal -->
    <div v-if="showDetailModal"
         class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-start justify-center pt-4 pb-20 px-4"
         @click="showDetailModal = false">
      <div class="relative w-full max-w-2xl mx-auto bg-white rounded-lg shadow-xl my-8 max-h-full overflow-y-auto"
           @click.stop>
        <div class="p-4 sm:p-6">
          <div class="flex items-start justify-between mb-6">
            <div class="flex-1 min-w-0">
              <h3 class="text-lg sm:text-xl font-medium text-gray-900 truncate">
                Detail Campaign: {{ selectedCampaign?.title }}
              </h3>
            </div>
            <button @click="showDetailModal = false" class="ml-4 text-gray-400 hover:text-gray-600 p-2 -mr-2 flex-shrink-0">
              <XMarkIcon class="w-6 h-6" />
            </button>
          </div>

          <div v-if="selectedCampaign" class="space-y-4">
            <!-- Campaign Info -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
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
import campaignService from '@/services/campaignService'
import enhancedCampaignService from '@/services/enhancedCampaignService'
import StarSenderPanel from '@/components/StarSenderPanel.vue'
import StarSenderTest from '@/components/StarSenderTest.vue'
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
const startsenderEnabled = ref(false) // Start disabled for stability

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

// Template and payment config
const selectedTemplate = ref('')
const paymentConfig = reactive({
  generateLinks: false,
  amount: 50000,
  description: '',
  dueDate: ''
})

// Computed
const needsPaymentLink = computed(() => {
  return ['payment_reminder', 'payment_urgent', 'payment_first_notice', 'event_payment'].includes(selectedTemplate.value)
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

// Template methods
const applyTemplate = () => {
  if (!selectedTemplate.value || selectedTemplate.value === 'custom') {
    return
  }

  const templates = enhancedCampaignService.getMessageTemplates()
  const template = templates[selectedTemplate.value]

  if (template) {
    campaignForm.message = template.template
    campaignForm.title = template.title

    // Set default payment config for payment templates
    if (needsPaymentLink.value) {
      paymentConfig.generateLinks = true

      // Set default values based on template
      if (selectedTemplate.value === 'payment_reminder') {
        paymentConfig.description = 'Kas Kelas ' + new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })
        paymentConfig.dueDate = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString().split('T')[0] // Last day of current month
      }
    } else {
      paymentConfig.generateLinks = false
    }
  }
}

// Methods
const loadData = async () => {
  try {
    loading.value = true

    // Load students
    await store.fetchStudents()
    students.value = store.students

    // Load campaigns from database/storage
    const campaignResult = await campaignService.getCampaigns()

    if (!campaignResult.success && campaignResult.error) {
      throw new Error(campaignResult.error)
    }

    campaigns.value = campaignResult.data || []

    // If no campaigns exist, create demo data
    if (campaigns.value.length === 0) {
      const demoCampaign = {
        id: campaignService.generateCampaignId(),
        title: 'Reminder Pembayaran Kas Januari',
        message: `🏫 *Reminder Kas Kelas 1B*
SD Islam Al Husna

Halo [[NAME]] ([[NICKNAME]]),

Silakan melakukan pembayaran kas kelas untuk bulan Januari 2024.

💰 Jumlah: Rp 50.000
📅 Jatuh Tempo: 31 Januari 2024
📱 WhatsApp: [[PHONE]]

Terima kasih atas perhatiannya! 🙏

_Pesan otomatis dari Sistem Kas Kelas_`,
        target: 'unpaid',
        recipients: [],
        delay_minutes: 10,
        status: 'draft',
        scheduled_at: null,
        created_at: new Date().toISOString(),
        results: null
      }

      await campaignService.createCampaign(demoCampaign)
      campaigns.value = [demoCampaign]
    }

  } catch (error) {
    console.error('Error loading data:', error)
    const errorMessage = error?.message || 'Terjadi kesalahan saat memuat data'
    toast.error(`Gagal memuat data: ${errorMessage}`)
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
      id: editingCampaign.value?.id || campaignService.generateCampaignId(),
      title: campaignForm.title,
      message: campaignForm.message,
      target: campaignForm.target,
      recipients: getRecipientIds(),
      delay_minutes: parseInt(campaignForm.delayMinutes),
      status: 'draft',
      scheduled_at: campaignForm.sendType === 'scheduled' ?
        new Date(campaignForm.scheduledDateTime).toISOString() : null
    }

    if (editingCampaign.value) {
      // Update existing campaign
      await campaignService.updateCampaign(campaignData)
      const index = campaigns.value.findIndex(c => c.id === editingCampaign.value.id)
      campaigns.value[index] = campaignData
      toast.success('Campaign berhasil diupdate')
    } else {
      // Create new campaign
      await campaignService.createCampaign(campaignData)
      campaigns.value.push(campaignData)
      toast.success('Campaign berhasil dibuat')
    }

    // Execute campaign if immediate or scheduled
    if (campaignForm.sendType === 'immediate' || campaignData.scheduled_at) {
      toast.info('Memproses campaign dengan payment links...')

      // Prepare payment config if needed
      const finalPaymentConfig = (needsPaymentLink.value && paymentConfig.generateLinks) ? {
        generateLinks: true,
        amount: parseInt(paymentConfig.amount),
        description: paymentConfig.description || `Kas Kelas ${new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}`,
        dueDate: paymentConfig.dueDate,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days
      } : null

      await executeEnhancedCampaign(campaignData, finalPaymentConfig)
    }

    closeModal()

  } catch (error) {
    console.error('Error saving campaign:', error)
    const errorMessage = error?.message || error?.toString() || 'Terjadi kesalahan saat menyimpan campaign'
    toast.error(`Gagal menyimpan campaign: ${errorMessage}`)
  } finally {
    saving.value = false
  }
}

const executeCampaign = async (campaign) => {
  try {
    // Use campaignService to execute the campaign
    const result = await campaignService.executeCampaign(campaign)

    if (result.success) {
      // Update local campaign data
      const index = campaigns.value.findIndex(c => c.id === campaign.id)
      if (index !== -1) {
        campaigns.value[index] = result.campaign
      }

      const { successCount, totalSent } = result.campaign.results
      toast.success(`Campaign berhasil dijadwalkan! ${successCount}/${totalSent} pesan terjadwal`)

      // Show details of scheduled messages
      if (result.results && result.results.length > 0) {
        const firstSchedule = new Date(result.results[0].scheduledTime).toLocaleString('id-ID')
        const lastSchedule = new Date(result.results[result.results.length - 1].scheduledTime).toLocaleString('id-ID')

        toast.info(`Pesan pertama: ${firstSchedule}, Pesan terakhir: ${lastSchedule}`, {
          timeout: 8000
        })
      }
    }

  } catch (error) {
    console.error('Error executing campaign:', error)
    const errorMessage = error?.message || error?.toString() || 'Terjadi kesalahan saat menjalankan campaign'
    toast.error(`Gagal menjalankan campaign: ${errorMessage}`)

    // Update campaign status to failed
    campaign.status = 'failed'
    await campaignService.updateCampaign(campaign)

    const index = campaigns.value.findIndex(c => c.id === campaign.id)
    if (index !== -1) {
      campaigns.value[index] = campaign
    }
  }
}

const executeEnhancedCampaign = async (campaign, paymentConfig = null) => {
  try {
    // Use enhanced campaign service with payment links
    const result = await enhancedCampaignService.executeEnhancedCampaign(campaign, paymentConfig)

    if (result.success) {
      // Update local campaign data
      const index = campaigns.value.findIndex(c => c.id === campaign.id)
      if (index !== -1) {
        campaigns.value[index] = result.campaign
      }

      const { successCount, totalSent, paymentLinksGenerated } = result.campaign.results

      if (paymentConfig && paymentLinksGenerated > 0) {
        toast.success(`🎉 Campaign + Payment Links berhasil! ${successCount}/${totalSent} pesan, ${paymentLinksGenerated} link dibuat`)
      } else {
        toast.success(`Campaign berhasil dijadwalkan! ${successCount}/${totalSent} pesan terjadwal`)
      }

      // Show details of scheduled messages
      if (result.results && result.results.length > 0) {
        const firstSchedule = new Date(result.results[0].scheduledTime).toLocaleString('id-ID')
        const lastSchedule = new Date(result.results[result.results.length - 1].scheduledTime).toLocaleString('id-ID')

        toast.info(`⏰ Jadwal: ${firstSchedule} - ${lastSchedule}`, {
          timeout: 8000
        })

        if (paymentLinksGenerated > 0) {
          toast.info(`💳 ${paymentLinksGenerated} Payment Links PakaSir berhasil dibuat dan diintegrasikan!`, {
            timeout: 6000
          })
        }
      }
    }

  } catch (error) {
    console.error('Error executing enhanced campaign:', error)
    const errorMessage = error?.message || error?.toString() || 'Terjadi kesalahan saat menjalankan enhanced campaign'
    toast.error(`Gagal menjalankan campaign: ${errorMessage}`)

    // Update campaign status to failed
    campaign.status = 'failed'
    await enhancedCampaignService.updateCampaign(campaign)

    const index = campaigns.value.findIndex(c => c.id === campaign.id)
    if (index !== -1) {
      campaigns.value[index] = campaign
    }
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

const getTemplatePreview = () => {
  if (!selectedTemplate.value) return 'Custom Template'

  const templates = {
    payment_reminder: '💰 Reminder Pembayaran Kas',
    payment_urgent: '🚨 Urgent - Pembayaran Terlambat',
    payment_first_notice: '📋 Pemberitahuan Pembayaran',
    info_announcement: '📢 Pengumuman Kelas',
    payment_confirmation: '✅ Konfirmasi Pembayaran',
    event_payment: '🎉 Pembayaran Kegiatan',
    thank_you: '🙏 Terima Kasih & Apresiasi',
    custom: '✏️ Custom Message'
  }

  return templates[selectedTemplate.value] || 'Unknown Template'
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

  try {
    await campaignService.deleteCampaign(campaignId)

    const index = campaigns.value.findIndex(c => c.id === campaignId)
    if (index !== -1) {
      campaigns.value.splice(index, 1)
      toast.success('Campaign berhasil dihapus')
    }
  } catch (error) {
    console.error('Error deleting campaign:', error)
    const errorMessage = error?.message || error?.toString() || 'Terjadi kesalahan saat menghapus campaign'
    toast.error(`Gagal menghapus campaign: ${errorMessage}`)
  }
}

const closeModal = () => {
  showCreateModal.value = false
  editingCampaign.value = null
  selectedTemplate.value = ''

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

  // Reset payment config
  Object.assign(paymentConfig, {
    generateLinks: false,
    amount: 50000,
    description: '',
    dueDate: ''
  })
}

const enableStarSender = () => {
  startsenderEnabled.value = true
  toast.info('Enabling StarSender components...')
}

const retryStarSender = () => {
  startsenderEnabled.value = true
  toast.info('Retrying StarSender initialization...')
}

// Lifecycle
onMounted(() => {
  loadData()
})
</script>
