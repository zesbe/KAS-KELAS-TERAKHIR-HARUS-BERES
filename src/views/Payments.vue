<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-semibold text-gray-900">Link Pembayaran</h1>
        <p class="text-sm text-gray-500 mt-1">Kelola link pembayaran untuk kas kelas</p>
      </div>
      <button 
        @click="showCreateModal = true"
        class="btn-primary"
      >
        <PlusIcon class="w-4 h-4 mr-2" />
        Buat Link Bayar
      </button>
    </div>

    <!-- Summary Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div class="card p-6">
        <div class="flex items-center">
          <div class="p-2 bg-primary-100 rounded-lg">
            <CreditCardIcon class="w-6 h-6 text-primary-600" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Total Link</p>
            <p class="text-2xl font-semibold text-gray-900">
              {{ store.paymentLinks.length }}
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
            <p class="text-sm font-medium text-gray-600">Pending</p>
            <p class="text-2xl font-semibold text-gray-900">
              {{ pendingPayments.length }}
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
              {{ completedPayments.length }}
            </p>
          </div>
        </div>
      </div>

      <div class="card p-6">
        <div class="flex items-center">
          <div class="p-2 bg-success-100 rounded-lg">
            <BanknotesIcon class="w-6 h-6 text-success-600" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Total Terkumpul</p>
            <p class="text-2xl font-semibold text-gray-900">
              {{ formatCurrency(totalCollected) }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Generate -->
    <div class="card p-6">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">Generate Link Cepat</h3>
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Jumlah</label>
          <input 
            v-model.number="quickGenerate.amount"
            type="number" 
            min="1000"
            step="1000"
            class="input-field"
            placeholder="Contoh: 25000"
          />
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Keterangan</label>
          <input 
            v-model="quickGenerate.description"
            type="text"
            class="input-field"
            placeholder="Contoh: Kas Bulanan Februari"
          />
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Target Siswa</label>
          <select v-model="quickGenerate.target" class="input-field">
            <option value="all">Semua Siswa</option>
            <option value="unpaid">Siswa Belum Bayar</option>
            <option value="selected">Pilih Manual</option>
          </select>
        </div>
        
        <div class="flex items-end">
          <button 
            @click="generateBulkLinks"
            :disabled="!quickGenerate.amount || !quickGenerate.description || generating"
            class="btn-primary w-full"
          >
            {{ generating ? 'Generating...' : 'Generate Links' }}
          </button>
        </div>
      </div>
      
      <!-- Student Selection for Manual Target -->
      <div v-if="quickGenerate.target === 'selected'" class="mt-4">
        <label class="block text-sm font-medium text-gray-700 mb-2">Pilih Siswa</label>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-2 max-h-48 overflow-y-auto">
          <label 
            v-for="student in store.students" 
            :key="student.id"
            class="flex items-center space-x-2 p-2 border rounded-lg hover:bg-gray-50"
          >
            <input 
              type="checkbox" 
              :value="student.id"
              v-model="quickGenerate.selectedStudents"
              class="rounded"
            />
            <span class="text-sm">{{ student.name }}</span>
          </label>
        </div>
      </div>
    </div>

    <!-- Payments Table -->
    <div class="card p-6">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold text-gray-900">Daftar Link Pembayaran</h3>
        <div class="flex space-x-2">
          <select v-model="statusFilter" class="input-field w-auto">
            <option value="">Semua Status</option>
            <option value="pending">Pending</option>
            <option value="completed">Selesai</option>
            <option value="expired">Expired</option>
          </select>
        </div>
      </div>
      
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Siswa
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Order ID
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Keterangan
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Jumlah
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
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
            <tr v-for="payment in filteredPayments" :key="payment.id">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <div class="flex items-center">
                  <div class="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                    <span class="text-primary-600 font-semibold text-xs">
                      {{ payment.student?.nickname?.charAt(0)?.toUpperCase() }}
                    </span>
                  </div>
                  <div>
                    <div class="font-medium">{{ payment.student?.name }}</div>
                    <div class="text-gray-500 text-xs">{{ payment.student?.nickname }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-500">
                {{ payment.order_id }}
              </td>
              <td class="px-6 py-4 text-sm text-gray-500">
                {{ payment.description }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {{ formatCurrency(payment.amount) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="getStatusClass(payment.status)">
                  {{ getStatusLabel(payment.status) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(payment.created_at) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div class="flex items-center space-x-2">
                  <button 
                    @click="copyPaymentLink(payment)"
                    class="text-primary-600 hover:text-primary-900"
                    title="Copy Link"
                  >
                    <LinkIcon class="w-4 h-4" />
                  </button>
                  <button 
                    @click="sendPaymentLink(payment)"
                    class="text-success-600 hover:text-success-900"
                    title="Kirim via WhatsApp"
                  >
                    <ChatBubbleLeftIcon class="w-4 h-4" />
                  </button>
                  <button 
                    @click="checkPaymentStatus(payment)"
                    class="text-warning-600 hover:text-warning-900"
                    title="Cek Status"
                  >
                    <ArrowPathIcon class="w-4 h-4" />
                  </button>
                  <button 
                    @click="deletePaymentLink(payment)"
                    class="text-red-600 hover:text-red-900"
                    title="Hapus"
                  >
                    <TrashIcon class="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        
        <div v-if="filteredPayments.length === 0" class="text-center py-8">
          <p class="text-sm text-gray-500">Tidak ada link pembayaran yang ditemukan</p>
        </div>
      </div>
    </div>

    <!-- Create Payment Link Modal -->
    <div 
      v-if="showCreateModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <div class="bg-white rounded-lg max-w-md w-full p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Buat Link Pembayaran</h3>
        
        <form @submit.prevent="createSingleLink" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Siswa</label>
            <select v-model="singleLink.studentId" required class="input-field">
              <option value="">Pilih Siswa</option>
              <option v-for="student in store.students" :key="student.id" :value="student.id">
                {{ student.name }} ({{ student.nickname }})
              </option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Jumlah</label>
            <input 
              v-model.number="singleLink.amount"
              type="number" 
              min="1000"
              step="1000"
              required
              class="input-field"
              placeholder="Masukkan jumlah"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Keterangan</label>
            <input 
              v-model="singleLink.description"
              type="text" 
              required
              class="input-field"
              placeholder="Contoh: Kas bulanan Februari"
            />
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
              :disabled="creating"
              class="btn-primary"
            >
              {{ creating ? 'Membuat...' : 'Buat Link' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Payment Link Preview Modal -->
    <div 
      v-if="showPreviewModal && previewPayment"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <div class="bg-white rounded-lg max-w-md w-full p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Link Pembayaran</h3>
        
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Siswa</label>
            <p class="text-sm text-gray-900">{{ previewPayment.student?.name }}</p>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Jumlah</label>
            <p class="text-sm text-gray-900">{{ formatCurrency(previewPayment.amount) }}</p>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Order ID</label>
            <p class="text-sm font-mono text-gray-900">{{ previewPayment.order_id }}</p>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Link Pembayaran</label>
            <div class="flex items-center space-x-2">
              <input 
                :value="previewPayment.payment_url"
                readonly
                class="input-field text-xs"
              />
              <button 
                @click="copyToClipboard(previewPayment.payment_url)"
                class="btn-secondary p-2"
              >
                <DocumentDuplicateIcon class="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
        
        <div class="flex justify-end space-x-3 pt-4">
          <button 
            @click="showPreviewModal = false"
            class="btn-secondary"
          >
            Tutup
          </button>
          <button 
            @click="sendWhatsAppMessage(previewPayment)"
            class="btn-success"
          >
            Kirim via WhatsApp
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useAppStore } from '@/stores'
import { useToast } from 'vue-toastification'
import pakasirService from '@/services/pakasir'
import starsenderService from '@/services/starsender'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'
import {
  PlusIcon,
  CreditCardIcon,
  ClockIcon,
  CheckCircleIcon,
  BanknotesIcon,
  LinkIcon,
  ChatBubbleLeftIcon,
  ArrowPathIcon,
  TrashIcon,
  DocumentDuplicateIcon
} from '@heroicons/vue/24/outline'

const store = useAppStore()
const toast = useToast()

const showCreateModal = ref(false)
const showPreviewModal = ref(false)
const previewPayment = ref(null)
const statusFilter = ref('')
const generating = ref(false)
const creating = ref(false)

const quickGenerate = reactive({
  amount: 25000,
  description: 'Kas Bulanan',
  target: 'all',
  selectedStudents: []
})

const singleLink = reactive({
  studentId: '',
  amount: 0,
  description: ''
})

const pendingPayments = computed(() => {
  return store.paymentLinks.filter(p => p.status === 'pending')
})

const completedPayments = computed(() => {
  return store.paymentLinks.filter(p => p.status === 'completed')
})

const totalCollected = computed(() => {
  return completedPayments.value.reduce((sum, p) => sum + p.amount, 0)
})

const filteredPayments = computed(() => {
  let payments = [...store.paymentLinks]
  
  if (statusFilter.value) {
    payments = payments.filter(p => p.status === statusFilter.value)
  }
  
  return payments.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
})

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount)
}

const formatDate = (dateString) => {
  return format(new Date(dateString), 'dd MMM yyyy HH:mm', { locale: id })
}

const getStatusLabel = (status) => {
  const labels = {
    pending: 'Pending',
    completed: 'Selesai',
    expired: 'Expired'
  }
  return labels[status] || status
}

const getStatusClass = (status) => {
  const classes = {
    pending: 'inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-warning-100 text-warning-800',
    completed: 'inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-success-100 text-success-800',
    expired: 'inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800'
  }
  return classes[status] || classes.pending
}

const generateBulkLinks = async () => {
  try {
    generating.value = true
    
    let targetStudents = []
    
    if (quickGenerate.target === 'all') {
      targetStudents = store.students
    } else if (quickGenerate.target === 'unpaid') {
      const paidStudentIds = store.transactions
        .filter(t => t.type === 'income' && t.status === 'completed')
        .map(t => t.student_id)
      targetStudents = store.students.filter(s => !paidStudentIds.includes(s.id))
    } else if (quickGenerate.target === 'selected') {
      targetStudents = store.students.filter(s => quickGenerate.selectedStudents.includes(s.id))
    }
    
    const promises = targetStudents.map(student => 
      store.generatePaymentLink(student.id, quickGenerate.amount, quickGenerate.description)
    )
    
    await Promise.all(promises)
    
    toast.success(`Berhasil generate ${targetStudents.length} link pembayaran`)
    
    // Reset form
    quickGenerate.selectedStudents = []
  } catch (error) {
    toast.error('Gagal generate link pembayaran')
    console.error('Error generating bulk links:', error)
  } finally {
    generating.value = false
  }
}

const createSingleLink = async () => {
  try {
    creating.value = true
    
    await store.generatePaymentLink(
      singleLink.studentId,
      singleLink.amount,
      singleLink.description
    )
    
    toast.success('Link pembayaran berhasil dibuat')
    showCreateModal.value = false
    
    // Reset form
    singleLink.studentId = ''
    singleLink.amount = 0
    singleLink.description = ''
  } catch (error) {
    toast.error('Gagal membuat link pembayaran')
    console.error('Error creating payment link:', error)
  } finally {
    creating.value = false
  }
}

const copyPaymentLink = async (payment) => {
  try {
    await navigator.clipboard.writeText(payment.payment_url)
    toast.success('Link berhasil disalin')
  } catch (error) {
    toast.error('Gagal menyalin link')
  }
}

const sendPaymentLink = (payment) => {
  previewPayment.value = payment
  showPreviewModal.value = true
}

const sendWhatsAppMessage = async (payment) => {
  try {
    const message = `Halo ${payment.student?.name} (${payment.student?.nickname}),

Silakan lakukan pembayaran kas kelas dengan detail berikut:

💰 Jumlah: ${formatCurrency(payment.amount)}
📝 Keterangan: ${payment.description}
🆔 Order ID: ${payment.order_id}

🔗 Link Pembayaran:
${payment.payment_url}

Terima kasih!

_Kas Kelas 1B SD Islam Al Husna_`

    await starsenderService.sendMessage(payment.student?.phone, message)
    
    toast.success('Pesan berhasil dikirim')
    showPreviewModal.value = false
  } catch (error) {
    toast.error('Gagal mengirim pesan')
    console.error('Error sending WhatsApp message:', error)
  }
}

const checkPaymentStatus = async (payment) => {
  try {
    const status = await pakasirService.checkTransactionStatus(payment.amount, payment.order_id)
    
    if (status.status === 'completed' && payment.status === 'pending') {
      // Update payment status
      await store.db.updatePaymentLink(payment.id, {
        status: 'completed',
        payment_method: status.payment_method || 'qris',
        completed_at: status.completed_at || new Date().toISOString()
      })
      
      // Create transaction
      await store.addTransaction({
        type: 'income',
        amount: payment.amount,
        description: payment.description,
        student_id: payment.student_id,
        payment_method: status.payment_method || 'qris',
        order_id: payment.order_id,
        status: 'completed',
        created_at: status.completed_at || new Date().toISOString()
      })
      
      toast.success('Status pembayaran berhasil diupdate')
    } else {
      toast.info(`Status: ${status.status || 'pending'}`)
    }
  } catch (error) {
    toast.error('Gagal mengecek status pembayaran')
    console.error('Error checking payment status:', error)
  }
}

const deletePaymentLink = async (payment) => {
  if (confirm('Apakah Anda yakin ingin menghapus link pembayaran ini?')) {
    try {
      await store.db.deletePaymentLink(payment.id)
      await store.fetchPaymentLinks()
      toast.success('Link pembayaran berhasil dihapus')
    } catch (error) {
      toast.error('Gagal menghapus link pembayaran')
      console.error('Error deleting payment link:', error)
    }
  }
}

const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text)
    toast.success('Berhasil disalin')
  } catch (error) {
    toast.error('Gagal menyalin')
  }
}
</script>
