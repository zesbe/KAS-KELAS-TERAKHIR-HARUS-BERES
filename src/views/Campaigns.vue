<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Campaign WhatsApp</h1>
        <p class="mt-1 text-sm text-gray-500">
          Broadcast pesan otomatis ke multiple nomor WhatsApp
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

    <!-- StarSender Status & Quick Actions -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- StarSender Status -->
      <div class="card p-6">
        <div class="flex items-center justify-between mb-4">
          <div>
            <h3 class="text-lg font-semibold text-gray-900 flex items-center">
              🌟 StarSender Status
            </h3>
            <p class="text-sm text-gray-600">Sistem broadcast WhatsApp</p>
          </div>
          <div :class="starSenderReady ? 'text-green-600' : 'text-red-600'">
            <CheckCircleIcon v-if="starSenderReady" class="w-6 h-6" />
            <XCircleIcon v-else class="w-6 h-6" />
          </div>
        </div>
        
        <div class="space-y-2">
          <div class="flex items-center justify-between text-sm">
            <span class="text-gray-600">Status:</span>
            <span :class="starSenderReady ? 'text-green-600' : 'text-red-600'">
              {{ starSenderReady ? 'Ready' : 'Not Configured' }}
            </span>
          </div>
          <div class="flex items-center justify-between text-sm">
            <span class="text-gray-600">Total Sent:</span>
            <span class="text-gray-900">{{ broadcastStats.totalSent }}</span>
          </div>
          <div class="flex items-center justify-between text-sm">
            <span class="text-gray-600">Success Rate:</span>
            <span class="text-green-600">{{ broadcastStats.successRate }}%</span>
          </div>
        </div>

        <div class="mt-4 pt-4 border-t border-gray-200">
          <button 
            @click="testBroadcast"
            :disabled="!starSenderReady || testing"
            class="btn-sm btn-secondary w-full"
          >
            {{ testing ? 'Testing...' : '🧪 Test Broadcast' }}
          </button>
        </div>
      </div>

      <!-- Quick Broadcast -->
      <div class="card p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">⚡ Quick Broadcast</h3>
        
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Target</label>
            <select v-model="quickBroadcast.target" class="input-field">
              <option value="all">Semua Siswa ({{ students.length }})</option>
              <option value="unpaid">Belum Bayar ({{ unpaidStudents.length }})</option>
              <option value="paid">Sudah Bayar ({{ paidStudents.length }})</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Pesan Cepat</label>
            <select v-model="quickBroadcast.template" @change="applyQuickTemplate" class="input-field">
              <option value="">-- Pilih Template --</option>
              <option value="reminder">💰 Reminder Pembayaran</option>
              <option value="multi_month_offer">🎯 Penawaran Multi-Bulan (3,6,9)</option>
              <option value="payment_options">💳 Opsi Pembayaran Fleksibel</option>
              <option value="urgent">🚨 Urgent - Pembayaran Segera</option>
              <option value="announcement">📢 Pengumuman Penting</option>
              <option value="custom">✏️ Custom Message</option>
            </select>
          </div>

          <div>
            <textarea 
              v-model="quickBroadcast.message"
              rows="3"
              class="input-field"
              placeholder="Ketik pesan atau pilih template..."
            ></textarea>
          </div>

          <button 
            @click="sendQuickBroadcast"
            :disabled="!quickBroadcast.message || broadcasting"
            class="btn-primary w-full"
          >
            {{ broadcasting ? 'Mengirim...' : '🚀 Kirim Sekarang' }}
          </button>
        </div>
      </div>
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
            <p class="text-sm font-medium text-gray-600">Broadcast Hari Ini</p>
            <p class="text-2xl font-semibold text-gray-900">{{ todayBroadcasts }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Broadcasting Progress -->
    <div v-if="broadcasting || broadcastProgress.active" class="card p-6">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold text-gray-900">📤 Broadcasting Progress</h3>
        <button 
          v-if="broadcasting"
          @click="stopBroadcast"
          class="btn-sm btn-secondary"
        >
          🛑 Stop
        </button>
      </div>
      
      <div class="space-y-4">
        <!-- Progress Bar -->
        <div>
          <div class="flex justify-between text-sm text-gray-600 mb-2">
            <span>Progress: {{ broadcastProgress.current }}/{{ broadcastProgress.total }}</span>
            <span>{{ Math.round((broadcastProgress.current / broadcastProgress.total) * 100) }}%</span>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-2">
            <div 
              class="bg-blue-600 h-2 rounded-full transition-all duration-300" 
              :style="{ width: (broadcastProgress.current / broadcastProgress.total) * 100 + '%' }"
            ></div>
          </div>
        </div>

        <!-- Live Stats -->
        <div class="grid grid-cols-3 gap-4 text-center">
          <div>
            <div class="text-2xl font-bold text-green-600">{{ broadcastProgress.sent }}</div>
            <div class="text-sm text-gray-500">Berhasil</div>
          </div>
          <div>
            <div class="text-2xl font-bold text-red-600">{{ broadcastProgress.failed }}</div>
            <div class="text-sm text-gray-500">Gagal</div>
          </div>
          <div>
            <div class="text-2xl font-bold text-blue-600">{{ broadcastProgress.remaining }}</div>
            <div class="text-sm text-gray-500">Sisa</div>
          </div>
        </div>

        <!-- Current Message -->
        <div v-if="broadcastProgress.currentRecipient" class="text-sm text-gray-600 text-center">
          Mengirim ke: <strong>{{ broadcastProgress.currentRecipient.name }}</strong> 
          ({{ broadcastProgress.currentRecipient.phone }})
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
                  <div class="text-sm text-gray-500 truncate max-w-xs">{{ campaign.message.substring(0, 50) }}...</div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ getTargetLabel(campaign.target) }}</div>
                <div class="text-sm text-gray-500">{{ campaign.totalRecipients || 0 }} nomor</div>
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
                    @click="executeCampaign(campaign)"
                    class="text-green-600 hover:text-green-900"
                  >
                    Jalankan
                  </button>
                  <button 
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
          <p class="mt-1 text-sm text-gray-500">Mulai dengan membuat campaign pertama atau gunakan Quick Broadcast.</p>
        </div>
      </div>
    </div>

    <!-- Create Campaign Modal -->
    <div v-if="showCreateModal"
         class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4"
         @click="closeModal">
      <div class="relative w-full max-w-2xl bg-white rounded-lg shadow-xl max-h-full overflow-y-auto"
           @click.stop>
        <div class="p-6">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-xl font-medium text-gray-900">Buat Campaign Baru</h3>
            <button @click="closeModal" class="text-gray-400 hover:text-gray-600">
              <XMarkIcon class="w-6 h-6" />
            </button>
          </div>

          <form @submit.prevent="saveCampaign" class="space-y-6">
            <!-- Campaign Title -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
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
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Template Pesan
              </label>
              <select v-model="campaignForm.template" @change="applyTemplate" class="input-field mb-3">
                <option value="">-- Pilih Template --</option>
                <option value="payment_reminder">💰 Reminder Pembayaran Kas</option>
                <option value="payment_urgent">🚨 Urgent - Pembayaran Terlambat</option>
                <option value="announcement">📢 Pengumuman Kelas</option>
                <option value="event">🎉 Informasi Kegiatan</option>
                <option value="thanks">🙏 Terima Kasih</option>
                <option value="custom">✏️ Custom Message</option>
              </select>
              
              <textarea
                v-model="campaignForm.message"
                rows="8"
                required
                class="input-field"
                placeholder="Ketik pesan Anda di sini..."
              ></textarea>
              
              <div class="mt-2 text-sm text-gray-500">
                <p><strong>Variable tersedia:</strong> [[NAME]], [[NICKNAME]], [[PHONE]]</p>
              </div>
            </div>

            <!-- Target Recipients -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Target Penerima
              </label>
              <div class="space-y-2">
                <label class="flex items-center">
                  <input v-model="campaignForm.target" type="radio" value="all" class="mr-2" />
                  Semua Siswa ({{ students.length }} siswa)
                </label>
                <label class="flex items-center">
                  <input v-model="campaignForm.target" type="radio" value="unpaid" class="mr-2" />
                  Siswa Belum Bayar ({{ unpaidStudents.length }} siswa)
                </label>
                <label class="flex items-center">
                  <input v-model="campaignForm.target" type="radio" value="paid" class="mr-2" />
                  Siswa Sudah Bayar ({{ paidStudents.length }} siswa)
                </label>
              </div>
            </div>

            <!-- Delay Setting -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Jeda Antar Pesan (detik)
              </label>
              <select v-model="campaignForm.delay" class="input-field">
                <option value="3">3 detik (cepat)</option>
                <option value="5">5 detik</option>
                <option value="10">10 detik (recommended)</option>
                <option value="15">15 detik</option>
                <option value="30">30 detik (aman)</option>
              </select>
            </div>

            <!-- Actions -->
            <div class="flex flex-col sm:flex-row sm:justify-end space-y-3 sm:space-y-0 sm:space-x-3 pt-6 border-t border-gray-200">
              <button type="button" @click="closeModal" class="btn-secondary">
                Batal
              </button>
              <button type="submit" :disabled="saving" class="btn-primary">
                {{ saving ? 'Menyimpan...' : 'Simpan Campaign' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Campaign Detail Modal -->
    <div v-if="showDetailModal"
         class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4"
         @click="showDetailModal = false">
      <div class="relative w-full max-w-2xl bg-white rounded-lg shadow-xl max-h-full overflow-y-auto"
           @click.stop>
        <div class="p-6">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-xl font-medium text-gray-900">
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
                <p class="text-sm text-gray-900">{{ selectedCampaign.totalRecipients || 0 }} nomor</p>
              </div>
            </div>

            <!-- Message Preview -->
            <div>
              <label class="text-sm font-medium text-gray-500">Pesan</label>
              <div class="mt-1 p-3 bg-gray-50 rounded-lg">
                <pre class="whitespace-pre-wrap text-sm text-gray-900">{{ selectedCampaign.message }}</pre>
              </div>
            </div>

            <!-- Results -->
            <div v-if="selectedCampaign.results" class="border rounded-lg p-4">
              <h4 class="font-medium text-gray-900 mb-3">📊 Hasil Broadcast</h4>
              <div class="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div class="text-2xl font-bold text-green-600">{{ selectedCampaign.results.sent || 0 }}</div>
                  <div class="text-sm text-gray-500">Berhasil</div>
                </div>
                <div>
                  <div class="text-2xl font-bold text-red-600">{{ selectedCampaign.results.failed || 0 }}</div>
                  <div class="text-sm text-gray-500">Gagal</div>
                </div>
                <div>
                  <div class="text-2xl font-bold text-blue-600">{{ selectedCampaign.results.total || 0 }}</div>
                  <div class="text-sm text-gray-500">Total</div>
                </div>
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
import whatsappSender from '@/services/whatsappSender'
import {
  PlusIcon,
  CalendarDaysIcon,
  CheckCircleIcon,
  ClockIcon,
  PaperAirplaneIcon,
  XMarkIcon,
  XCircleIcon
} from '@heroicons/vue/24/outline'

const store = useAppStore()
const toast = useToast()

// State
const campaigns = ref([])
const students = ref([])
const loading = ref(false)
const saving = ref(false)
const testing = ref(false)
const broadcasting = ref(false)
const showCreateModal = ref(false)
const showDetailModal = ref(false)
const selectedCampaign = ref(null)

// StarSender status
const starSenderReady = ref(true) // Always ready for wa.me method
const broadcastStats = reactive({
  totalSent: 0,
  successRate: 100
})

// Broadcasting progress
const broadcastProgress = reactive({
  active: false,
  current: 0,
  total: 0,
  sent: 0,
  failed: 0,
  remaining: 0,
  currentRecipient: null
})

// Quick broadcast form
const quickBroadcast = reactive({
  target: 'unpaid',
  template: '',
  message: ''
})

// Campaign form
const campaignForm = reactive({
  title: '',
  message: '',
  target: 'unpaid',
  template: '',
  delay: 10
})

// Computed
const unpaidStudents = computed(() => {
  // For demo, return all students as unpaid
  return students.value
})

const paidStudents = computed(() => {
  // For demo, return empty array
  return []
})

const todayBroadcasts = computed(() => {
  return campaigns.value.filter(c => {
    if (!c.executedAt) return false
    const today = new Date().toDateString()
    const campaignDate = new Date(c.executedAt).toDateString()
    return today === campaignDate
  }).length
})

// Message templates
const messageTemplates = {
  reminder: `Halo [[NAME]]! 👋

💰 **Reminder Pembayaran Kas Kelas**

Ini adalah pengingat pembayaran kas kelas untuk bulan ini.

Silakan segera lakukan pembayaran agar administrasi kelas tetap lancar.

Terima kasih! 🙏`,

  multi_month_offer: `🎯 *PENAWARAN SPESIAL PEMBAYARAN MULTI-BULAN* 🎯

Assalamu'alaikum Wr. Wb.

Halo Bapak/Ibu orang tua dari *[[NAME]]* 👋

Kami menawarkan kemudahan pembayaran kas kelas dengan sistem *MULTI-BULAN* yang lebih praktis!

📦 *PAKET PEMBAYARAN TERSEDIA:*

1. 📅 *PAKET TRIWULAN (3 Bulan)*
   💰 Rp 150.000 (3 × Rp 50.000)
   ✅ Lebih terjangkau
   ✅ Fleksibel

2. 🎯 *PAKET SEMESTER (6 Bulan)* - POPULER!
   💰 Rp 300.000 (6 × Rp 50.000)
   ✅ Paling praktis
   ✅ Hemat waktu

3. ⭐ *PAKET 3 CAWU (9 Bulan)*
   💰 Rp 450.000 (9 × Rp 50.000)
   ✅ Hampir setahun
   ✅ Sangat praktis

💡 *KEUNTUNGAN MULTI-BULAN:*
✅ Tidak perlu ingat bayar setiap bulan
✅ Bisa pilih bayar sekaligus atau bertahap
✅ Link pembayaran otomatis tersedia
✅ Tracking progress yang jelas

🔗 Untuk membuat link pembayaran, silakan hubungi bendahara kelas atau akses sistem kas kelas.

Terima kasih! 🙏

Wassalamu'alaikum Wr. Wb.`,

  payment_options: `💳 *OPSI PEMBAYARAN FLEKSIBEL* 💳

Assalamu'alaikum Wr. Wb.

Halo *[[NAME]]* 👋

Untuk kemudahan pembayaran kas kelas, kami menyediakan berbagai opsi:

🎯 *PILIHAN PEMBAYARAN:*

1. 📅 *BULANAN REGULER*
   💰 Rp 50.000/bulan
   ✅ Bayar setiap bulan
   ✅ Paling fleksibel

2. 💰 *MULTI-BULAN SEKALIGUS*
   💰 Pilih: 3, 6, atau 9 bulan
   ✅ Lebih praktis
   ✅ Tidak perlu repot setiap bulan

3. 🔄 *KOMBINASI*
   ✅ Bayar bertahap per bulan
   ✅ Atau sekaligus (terserah pilihan)

💳 *METODE PEMBAYARAN:*
✅ QRIS (Scan QR Code)
✅ GoPay, OVO, DANA, ShopeePay
✅ Transfer Bank
✅ Kartu Kredit/Debit

🔗 Link pembayaran akan dikirimkan sesuai pilihan Bapak/Ibu.

Silakan hubungi bendahara untuk memilih opsi yang paling sesuai!

Terima kasih! 🙏

Wassalamu'alaikum Wr. Wb.`,

  urgent: `🚨 **URGENT** - [[NAME]]

Pembayaran kas kelas sudah memasuki batas waktu. Mohon segera melakukan pembayaran hari ini.

Hubungi bendahara jika ada kendala.

Terima kasih atas perhatiannya! 🙏`,

  announcement: `📢 **Pengumuman Penting**

Halo [[NAME]]!

Ada pengumuman penting untuk kelas kita. Silakan check group WA atau hubungi ketua kelas untuk informasi lebih lanjut.

Terima kasih! 🙏`,

  payment_reminder: `Halo [[NAME]]! 👋

💰 Reminder pembayaran kas kelas bulan ini:

• Jumlah: Rp 50.000
• Jatuh tempo: Akhir bulan
• Status: Belum bayar

Silakan segera lakukan pembayaran. Terima kasih! 🙏`,

  payment_urgent: `🚨 URGENT - [[NAME]]

Pembayaran kas kelas sudah terlambat! Mohon segera bayar hari ini untuk menghindari denda.

Hubungi bendahara jika ada kendala: 08xxx

Terima kasih! 🙏`,

  announcement: `📢 **Pengumuman Kelas**

Halo [[NAME]]!

Ada informasi penting untuk kelas. Silakan baca dengan seksama dan konfirmasi jika diperlukan.

Detail akan disampaikan di group kelas.

Terima kasih! 🙏`,

  event: `🎉 **Info Kegiatan Kelas**

Halo [[NAME]]!

Ada kegiatan kelas yang akan datang. Mohon persiapkan diri dan catat tanggalnya ya!

Info lengkap di group WA kelas.

Sampai jumpa! 👋`,

  thanks: `🙏 **Terima Kasih**

Halo [[NAME]]!

Terima kasih atas partisipasi aktif dalam kegiatan kelas. Dukungan kalian sangat berarti!

Keep up the good work! 💪`
}

// Methods
const loadData = async () => {
  try {
    loading.value = true
    
    // Load students
    await store.fetchStudents()
    students.value = store.students || []
    
    // Load campaigns from localStorage
    const storedCampaigns = localStorage.getItem('campaigns')
    if (storedCampaigns) {
      campaigns.value = JSON.parse(storedCampaigns)
    }
    
    // Load broadcast stats
    const storedStats = localStorage.getItem('broadcastStats')
    if (storedStats) {
      const stats = JSON.parse(storedStats)
      Object.assign(broadcastStats, stats)
    }
    
  } catch (error) {
    console.error('Error loading data:', error)
    toast.error('Gagal memuat data')
  } finally {
    loading.value = false
  }
}

const testBroadcast = async () => {
  testing.value = true
  try {
    const testMessage = "🧪 Test broadcast dari Campaign System - " + new Date().toLocaleTimeString()
    
    // Try to send to first student
    if (students.value.length > 0) {
      const testStudent = students.value[0]
      const result = await whatsappSender.sendMessage(testStudent.phone, testMessage)
      
      if (result.success) {
        toast.success('Test broadcast berhasil! WhatsApp terbuka.')
      } else {
        toast.error('Test broadcast gagal: ' + result.error)
      }
    } else {
      toast.warning('Tidak ada data siswa untuk test')
    }
  } catch (error) {
    console.error('Test broadcast error:', error)
    toast.error('Error saat test broadcast')
  } finally {
    testing.value = false
  }
}

const applyQuickTemplate = () => {
  if (quickBroadcast.template && messageTemplates[quickBroadcast.template]) {
    quickBroadcast.message = messageTemplates[quickBroadcast.template]
  }
}

const sendQuickBroadcast = async () => {
  if (!quickBroadcast.message.trim()) {
    toast.error('Pesan tidak boleh kosong')
    return
  }
  
  broadcasting.value = true
  
  try {
    // Get recipients based on target
    let recipients = []
    switch (quickBroadcast.target) {
      case 'all':
        recipients = students.value
        break
      case 'unpaid':
        recipients = unpaidStudents.value
        break
      case 'paid':
        recipients = paidStudents.value
        break
    }
    
    if (recipients.length === 0) {
      toast.warning('Tidak ada penerima yang dipilih')
      return
    }
    
    // Start broadcasting
    await startBroadcast(recipients, quickBroadcast.message, 5) // 5 second delay
    
    // Clear form
    quickBroadcast.message = ''
    quickBroadcast.template = ''
    
  } catch (error) {
    console.error('Quick broadcast error:', error)
    toast.error('Gagal mengirim quick broadcast')
  } finally {
    broadcasting.value = false
  }
}

const startBroadcast = async (recipients, message, delaySeconds = 10) => {
  // Initialize progress
  broadcastProgress.active = true
  broadcastProgress.current = 0
  broadcastProgress.total = recipients.length
  broadcastProgress.sent = 0
  broadcastProgress.failed = 0
  broadcastProgress.remaining = recipients.length
  
  const results = []
  
  try {
    for (let i = 0; i < recipients.length && broadcasting.value; i++) {
      const recipient = recipients[i]
      
      // Update current recipient
      broadcastProgress.currentRecipient = recipient
      
      try {
        // Personalize message
        const personalizedMessage = message
          .replace(/\[\[NAME\]\]/g, recipient.name || '')
          .replace(/\[\[NICKNAME\]\]/g, recipient.nickname || '')
          .replace(/\[\[PHONE\]\]/g, recipient.phone || '')
        
        // Send message
        const result = await whatsappSender.sendMessage(recipient.phone, personalizedMessage, {
          openInNewTab: i === 0 // Only open first message in new tab
        })
        
        if (result.success) {
          broadcastProgress.sent++
          toast.success(`✅ Terkirim ke ${recipient.name}`, { timeout: 2000 })
        } else {
          broadcastProgress.failed++
          toast.error(`❌ Gagal ke ${recipient.name}`, { timeout: 2000 })
        }
        
        results.push({
          name: recipient.name,
          phone: recipient.phone,
          success: result.success,
          timestamp: result.timestamp
        })
        
      } catch (error) {
        console.error(`Error sending to ${recipient.name}:`, error)
        broadcastProgress.failed++
        results.push({
          name: recipient.name,
          phone: recipient.phone,
          success: false,
          error: error.message
        })
      }
      
      // Update progress
      broadcastProgress.current = i + 1
      broadcastProgress.remaining = recipients.length - (i + 1)
      
      // Delay before next message (except for last one)
      if (i < recipients.length - 1 && broadcasting.value) {
        await new Promise(resolve => setTimeout(resolve, delaySeconds * 1000))
      }
    }
    
    // Update stats
    broadcastStats.totalSent += broadcastProgress.sent
    localStorage.setItem('broadcastStats', JSON.stringify(broadcastStats))
    
    // Show completion message
    const successRate = Math.round((broadcastProgress.sent / recipients.length) * 100)
    toast.success(`🎉 Broadcast selesai! ${broadcastProgress.sent}/${recipients.length} berhasil (${successRate}%)`)
    
  } finally {
    broadcastProgress.active = false
    broadcastProgress.currentRecipient = null
  }
  
  return results
}

const stopBroadcast = () => {
  broadcasting.value = false
  toast.info('🛑 Broadcast dihentikan')
}

const applyTemplate = () => {
  if (campaignForm.template && messageTemplates[campaignForm.template]) {
    campaignForm.message = messageTemplates[campaignForm.template]
  }
}

const saveCampaign = async () => {
  if (!campaignForm.title.trim() || !campaignForm.message.trim()) {
    toast.error('Judul dan pesan harus diisi')
    return
  }
  
  saving.value = true
  
  try {
    // Get recipients
    let recipients = []
    switch (campaignForm.target) {
      case 'all':
        recipients = students.value
        break
      case 'unpaid':
        recipients = unpaidStudents.value
        break
      case 'paid':
        recipients = paidStudents.value
        break
    }
    
    const campaign = {
      id: 'campaign_' + Date.now(),
      title: campaignForm.title,
      message: campaignForm.message,
      target: campaignForm.target,
      totalRecipients: recipients.length,
      delay: parseInt(campaignForm.delay),
      status: 'draft',
      createdAt: new Date().toISOString(),
      results: null
    }
    
    campaigns.value.push(campaign)
    
    // Save to localStorage
    localStorage.setItem('campaigns', JSON.stringify(campaigns.value))
    
    toast.success('Campaign berhasil dibuat')
    closeModal()
    
  } catch (error) {
    console.error('Error saving campaign:', error)
    toast.error('Gagal menyimpan campaign')
  } finally {
    saving.value = false
  }
}

const executeCampaign = async (campaign) => {
  if (!confirm(`Yakin ingin menjalankan campaign "${campaign.title}"?`)) return
  
  broadcasting.value = true
  
  try {
    // Get recipients
    let recipients = []
    switch (campaign.target) {
      case 'all':
        recipients = students.value
        break
      case 'unpaid':
        recipients = unpaidStudents.value
        break
      case 'paid':
        recipients = paidStudents.value
        break
    }
    
    if (recipients.length === 0) {
      toast.warning('Tidak ada penerima untuk campaign ini')
      return
    }
    
    // Update campaign status
    campaign.status = 'running'
    campaign.executedAt = new Date().toISOString()
    
    // Start broadcast
    const results = await startBroadcast(recipients, campaign.message, campaign.delay)
    
    // Update campaign with results
    campaign.status = 'completed'
    campaign.results = {
      total: recipients.length,
      sent: broadcastProgress.sent,
      failed: broadcastProgress.failed,
      details: results
    }
    
    // Save updated campaigns
    localStorage.setItem('campaigns', JSON.stringify(campaigns.value))
    
  } catch (error) {
    console.error('Error executing campaign:', error)
    campaign.status = 'failed'
    toast.error('Gagal menjalankan campaign')
  } finally {
    broadcasting.value = false
  }
}

const viewCampaign = (campaign) => {
  selectedCampaign.value = campaign
  showDetailModal.value = true
}

const deleteCampaign = (campaignId) => {
  if (!confirm('Yakin ingin menghapus campaign ini?')) return
  
  const index = campaigns.value.findIndex(c => c.id === campaignId)
  if (index !== -1) {
    campaigns.value.splice(index, 1)
    localStorage.setItem('campaigns', JSON.stringify(campaigns.value))
    toast.success('Campaign berhasil dihapus')
  }
}

const closeModal = () => {
  showCreateModal.value = false
  
  // Reset form
  Object.assign(campaignForm, {
    title: '',
    message: '',
    target: 'unpaid',
    template: '',
    delay: 10
  })
}

const getTargetLabel = (target) => {
  const labels = {
    all: 'Semua Siswa',
    paid: 'Sudah Bayar',
    unpaid: 'Belum Bayar'
  }
  return labels[target] || target
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
    running: 'bg-yellow-100 text-yellow-800',
    completed: 'bg-green-100 text-green-800',
    failed: 'bg-red-100 text-red-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

const getProgress = (campaign) => {
  if (!campaign.results) {
    return campaign.status === 'completed' ? 100 : 0
  }
  return Math.round((campaign.results.sent / campaign.results.total) * 100)
}

// Event listeners for WhatsApp sender events
const setupWhatsAppEventListeners = () => {
  window.addEventListener('whatsapp:progress', (event) => {
    const { current, total, sent, failed } = event.detail
    broadcastProgress.current = current
    broadcastProgress.total = total
    broadcastProgress.sent = sent
    broadcastProgress.failed = failed
    broadcastProgress.remaining = total - current
  })
  
  window.addEventListener('whatsapp:complete', (event) => {
    const { total, sent, failed } = event.detail
    broadcastProgress.active = false
    broadcastStats.totalSent += sent
    localStorage.setItem('broadcastStats', JSON.stringify(broadcastStats))
  })
}

// Lifecycle
onMounted(() => {
  loadData()
  setupWhatsAppEventListeners()
})

onUnmounted(() => {
  // Stop any ongoing broadcast
  broadcasting.value = false
})
</script>
