<template>
  <div class="space-y-6">
    <!-- Multi-Month Payment Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
      <div>
        <h3 class="text-lg font-semibold text-gray-900">Pembayaran Multi-Bulan</h3>
        <p class="text-sm text-gray-500 mt-1">Buat link pembayaran untuk beberapa bulan sekaligus</p>
      </div>
      <button
        @click="showCreateModal = true"
        class="btn-primary w-full sm:w-auto"
      >
        <PlusIcon class="w-4 h-4 mr-2" />
        Buat Multi-Month
      </button>
    </div>

    <!-- Quick Multi-Month Templates -->
    <div class="card p-6">
      <h4 class="text-lg font-medium text-gray-900 mb-4">Template Cepat</h4>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button 
          v-for="template in quickTemplates" 
          :key="template.months"
          @click="useTemplate(template)"
          class="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors"
        >
          <div class="text-center">
            <div class="text-2xl font-bold text-primary-600">{{ template.months }}</div>
            <div class="text-sm font-medium text-gray-900 mt-1">{{ template.label }}</div>
            <div class="text-xs text-gray-500 mt-1">{{ formatCurrency(template.amount) }}</div>
            <div class="text-xs text-gray-600 mt-1">{{ template.months }} × Rp 50.000</div>
          </div>
        </button>
      </div>
    </div>

    <!-- Multi-Month Payments List -->
    <div class="card p-6">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 space-y-2 sm:space-y-0">
        <h4 class="text-lg font-medium text-gray-900">Pembayaran Multi-Bulan</h4>
        <div class="flex space-x-2">
          <select v-model="filterStatus" class="input-field w-auto">
            <option value="">Semua Status</option>
            <option value="pending">Pending</option>
            <option value="partial">Sebagian</option>
            <option value="completed">Lunas</option>
          </select>
        </div>
      </div>

      <!-- Desktop Table View -->
      <div class="hidden sm:block overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Siswa
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Periode
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Progress
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="payment in filteredPayments" :key="payment.id">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                    <span class="text-primary-600 font-semibold text-sm">
                      {{ payment.student?.name?.charAt(0)?.toUpperCase() }}
                    </span>
                  </div>
                  <div>
                    <div class="text-sm font-medium text-gray-900">{{ payment.student?.name }}</div>
                    <div class="text-sm text-gray-500">{{ payment.student?.nickname }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ payment.period_label }}</div>
                <div class="text-sm text-gray-500">{{ payment.months }} bulan</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">{{ formatCurrency(payment.total_amount) }}</div>
                <div class="text-sm text-gray-500">{{ formatCurrency(payment.monthly_amount) }}/bulan</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="w-full bg-gray-200 rounded-full h-2 mb-1">
                  <div 
                    class="bg-primary-600 h-2 rounded-full" 
                    :style="{ width: payment.progress_percentage + '%' }"
                  ></div>
                </div>
                <div class="text-xs text-gray-500">
                  {{ payment.paid_amount }}/{{ payment.total_amount }} ({{ payment.progress_percentage }}%)
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="getStatusClass(payment.status)">
                  {{ getStatusLabel(payment.status) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div class="flex items-center space-x-2">
                  <button 
                    @click="viewDetails(payment)"
                    class="text-primary-600 hover:text-primary-900"
                    title="Lihat Detail"
                  >
                    <EyeIcon class="w-4 h-4" />
                  </button>
                  <button 
                    @click="sendReminder(payment)"
                    class="text-success-600 hover:text-success-900"
                    title="Kirim Reminder"
                  >
                    <ChatBubbleLeftIcon class="w-4 h-4" />
                  </button>
                  <button 
                    @click="copyPaymentLink(payment)"
                    class="text-warning-600 hover:text-warning-900"
                    title="Copy Link"
                  >
                    <LinkIcon class="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Mobile Card View -->
      <div class="block sm:hidden space-y-4">
        <div v-for="payment in filteredPayments" :key="payment.id" class="bg-gray-50 rounded-lg p-4">
          <div class="flex items-center justify-between mb-3">
            <div class="flex items-center">
              <div class="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                <span class="text-primary-600 font-semibold text-sm">
                  {{ payment.student?.name?.charAt(0)?.toUpperCase() }}
                </span>
              </div>
              <div>
                <div class="font-medium text-sm">{{ payment.student?.name }}</div>
                <div class="text-gray-500 text-xs">{{ payment.period_label }}</div>
              </div>
            </div>
            <span :class="getStatusClass(payment.status)">
              {{ getStatusLabel(payment.status) }}
            </span>
          </div>
          
          <div class="space-y-2 text-sm">
            <div class="w-full bg-gray-200 rounded-full h-2">
              <div 
                class="bg-primary-600 h-2 rounded-full" 
                :style="{ width: payment.progress_percentage + '%' }"
              ></div>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Progress:</span>
              <span>{{ payment.progress_percentage }}%</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Total:</span>
              <span class="font-medium">{{ formatCurrency(payment.total_amount) }}</span>
            </div>
          </div>
          
          <div class="flex items-center justify-center space-x-3 mt-3 pt-3 border-t border-gray-200">
            <button @click="viewDetails(payment)" class="flex items-center text-primary-600">
              <EyeIcon class="w-4 h-4 mr-1" />
              <span class="text-xs">Detail</span>
            </button>
            <button @click="sendReminder(payment)" class="flex items-center text-success-600">
              <ChatBubbleLeftIcon class="w-4 h-4 mr-1" />
              <span class="text-xs">Kirim</span>
            </button>
            <button @click="copyPaymentLink(payment)" class="flex items-center text-warning-600">
              <LinkIcon class="w-4 h-4 mr-1" />
              <span class="text-xs">Copy</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Create Multi-Month Modal -->
    <div
      v-if="showCreateModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <div class="bg-white rounded-lg max-w-lg w-full mx-4 p-6 max-h-[90vh] overflow-y-auto">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Buat Pembayaran Multi-Bulan</h3>
        
        <form @submit.prevent="createMultiMonthPayment" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Siswa</label>
            <select v-model="form.studentId" required class="input-field">
              <option value="">Pilih Siswa</option>
              <option v-for="student in students" :key="student.id" :value="student.id">
                {{ student.name }} ({{ student.nickname }})
              </option>
            </select>
          </div>
          
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Bulan Mulai</label>
              <select v-model="form.startMonth" required class="input-field">
                <option v-for="month in months" :key="month.value" :value="month.value">
                  {{ month.label }}
                </option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Tahun</label>
              <select v-model="form.year" required class="input-field">
                <option v-for="year in years" :key="year" :value="year">
                  {{ year }}
                </option>
              </select>
            </div>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Jumlah Bulan</label>
            <select v-model.number="form.months" required class="input-field" @change="calculateTotal">
              <option v-for="n in 12" :key="n" :value="n">
                {{ n }} bulan
              </option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Jumlah per Bulan</label>
            <input
              v-model.number="form.monthlyAmount"
              type="number"
              min="1"
              required
              class="input-field"
              @input="calculateTotal"
              placeholder="50000"
            />
          </div>



          <!-- Summary -->
          <div class="bg-gray-50 p-4 rounded-lg">
            <h4 class="font-medium text-gray-900 mb-2">Ringkasan Pembayaran</h4>
            <div class="space-y-1 text-sm">
              <div class="flex justify-between">
                <span>Periode:</span>
                <span>{{ form.months }} bulan ({{ getPeriodLabel() }})</span>
              </div>
              <div class="flex justify-between">
                <span>Jumlah per Bulan:</span>
                <span>{{ formatCurrency(form.monthlyAmount) }}</span>
              </div>
              <div class="flex justify-between font-bold border-t pt-1">
                <span>Total Pembayaran:</span>
                <span>{{ formatCurrency(form.monthlyAmount * form.months) }}</span>
              </div>
              <div class="text-blue-600 text-xs mt-2">
                Pembayaran untuk {{ form.months }} bulan kas kelas
              </div>
            </div>
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
              {{ creating ? 'Membuat...' : 'Buat Pembayaran' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Detail Modal -->
    <div
      v-if="showDetailModal && selectedPayment"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <div class="bg-white rounded-lg max-w-2xl w-full mx-4 p-6 max-h-[90vh] overflow-y-auto">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Detail Pembayaran Multi-Bulan</h3>
        
        <div class="space-y-6">
          <!-- Student Info -->
          <div class="flex items-center space-x-4">
            <div class="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
              <span class="text-primary-600 font-semibold text-xl">
                {{ selectedPayment.student?.name?.charAt(0)?.toUpperCase() }}
              </span>
            </div>
            <div>
              <h4 class="text-lg font-medium text-gray-900">{{ selectedPayment.student?.name }}</h4>
              <p class="text-sm text-gray-500">{{ selectedPayment.period_label }}</p>
            </div>
          </div>

          <!-- Progress -->
          <div>
            <div class="flex justify-between mb-2">
              <span class="text-sm font-medium text-gray-700">Progress Pembayaran</span>
              <span class="text-sm text-gray-500">{{ selectedPayment.progress_percentage }}%</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-3">
              <div 
                class="bg-primary-600 h-3 rounded-full" 
                :style="{ width: selectedPayment.progress_percentage + '%' }"
              ></div>
            </div>
            <div class="flex justify-between mt-2 text-sm text-gray-600">
              <span>{{ formatCurrency(selectedPayment.paid_amount) }}</span>
              <span>{{ formatCurrency(selectedPayment.total_amount) }}</span>
            </div>
          </div>

          <!-- Month Details -->
          <div>
            <h5 class="font-medium text-gray-900 mb-3">Detail per Bulan</h5>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div 
                v-for="month in selectedPayment.month_details" 
                :key="month.month"
                class="p-3 border rounded-lg"
                :class="month.paid ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'"
              >
                <div class="flex items-center justify-between">
                  <span class="text-sm font-medium">{{ month.label }}</span>
                  <span v-if="month.paid" class="text-green-600 text-xs">✓ Lunas</span>
                  <span v-else class="text-gray-500 text-xs">Belum bayar</span>
                </div>
                <div class="text-xs text-gray-600 mt-1">
                  {{ formatCurrency(month.amount) }}
                </div>
              </div>
            </div>
          </div>

          <!-- Payment Link -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Link Pembayaran</label>
            <div class="flex items-center space-x-2">
              <input 
                :value="selectedPayment.payment_url"
                readonly
                class="input-field text-xs"
              />
              <button 
                @click="copyToClipboard(selectedPayment.payment_url)"
                class="btn-secondary p-2"
              >
                <DocumentDuplicateIcon class="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
        
        <div class="flex justify-end space-x-3 pt-6 border-t">
          <button 
            @click="showDetailModal = false"
            class="btn-secondary"
          >
            Tutup
          </button>
          <button 
            @click="sendPaymentReminder(selectedPayment)"
            class="btn-success"
          >
            Kirim Reminder
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useToast } from 'vue-toastification'
import { useAppStore } from '@/stores'
import {
  PlusIcon,
  EyeIcon,
  ChatBubbleLeftIcon,
  LinkIcon,
  DocumentDuplicateIcon
} from '@heroicons/vue/24/outline'

const store = useAppStore()
const toast = useToast()

const showCreateModal = ref(false)
const showDetailModal = ref(false)
const selectedPayment = ref(null)
const creating = ref(false)
const filterStatus = ref('')

const form = reactive({
  studentId: '',
  startMonth: new Date().getMonth() + 1,
  year: new Date().getFullYear(),
  months: 6,
  monthlyAmount: 50000
})

// Sample data for demo
const multiMonthPayments = ref([
  {
    id: '1',
    student: { id: '1', name: 'Aqilnafi Segara', nickname: 'Nafi' },
    period_label: 'Feb - Jul 2024',
    months: 6,
    monthly_amount: 50000,
    total_amount: 300000,
    paid_amount: 150000,
    progress_percentage: 50,
    status: 'partial',
    payment_url: 'https://pakasir.zone.id/pay/uang-kas-kelas-1-ibnu-sina/140000?order_id=NAFI240201ABC123',
    month_details: [
      { month: 2, label: 'Februari 2024', amount: 50000, paid: true },
      { month: 3, label: 'Maret 2024', amount: 50000, paid: true },
      { month: 4, label: 'April 2024', amount: 50000, paid: true },
      { month: 5, label: 'Mei 2024', amount: 50000, paid: false },
      { month: 6, label: 'Juni 2024', amount: 50000, paid: false },
      { month: 7, label: 'Juli 2024', amount: 50000, paid: false }
    ]
  },
  {
    id: '2',
    student: { id: '2', name: 'Arkaan Jawara Bayanaka', nickname: 'Arkaan' },
    period_label: 'Jan - Des 2024',
    months: 12,
    monthly_amount: 50000,
    total_amount: 600000,
    paid_amount: 600000,
    progress_percentage: 100,
    status: 'completed',
    payment_url: 'https://pakasir.zone.id/pay/uang-kas-kelas-1-ibnu-sina/600000?order_id=ARKAAN240101XYZ789',
    month_details: []
  }
])

const students = computed(() => store.students)

const months = [
  { value: 1, label: 'Januari' },
  { value: 2, label: 'Februari' },
  { value: 3, label: 'Maret' },
  { value: 4, label: 'April' },
  { value: 5, label: 'Mei' },
  { value: 6, label: 'Juni' },
  { value: 7, label: 'Juli' },
  { value: 8, label: 'Agustus' },
  { value: 9, label: 'September' },
  { value: 10, label: 'Oktober' },
  { value: 11, label: 'November' },
  { value: 12, label: 'Desember' }
]

const years = [2024, 2025, 2026]

const quickTemplates = [
  { months: 3, label: '3 Bulan', amount: 150000 },
  { months: 6, label: '6 Bulan', amount: 300000 },
  { months: 12, label: '1 Tahun', amount: 600000 }
]

const filteredPayments = computed(() => {
  if (!filterStatus.value) return multiMonthPayments.value
  return multiMonthPayments.value.filter(p => p.status === filterStatus.value)
})

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount)
}

const getStatusLabel = (status) => {
  const labels = {
    pending: 'Belum Bayar',
    partial: 'Sebagian',
    completed: 'Lunas'
  }
  return labels[status] || status
}

const getStatusClass = (status) => {
  const classes = {
    pending: 'inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800',
    partial: 'inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800',
    completed: 'inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800'
  }
  return classes[status] || classes.pending
}

const getPeriodLabel = () => {
  if (!form.startMonth || !form.months) return ''
  
  const startIdx = form.startMonth - 1
  const endIdx = (startIdx + form.months - 1) % 12
  
  return `${months[startIdx].label} - ${months[endIdx].label} ${form.year}`
}

const calculateTotal = () => {
  // Simple calculation without discount
  return form.monthlyAmount * form.months
}

const useTemplate = (template) => {
  form.months = template.months
  form.monthlyAmount = 50000
  showCreateModal.value = true
}

const createMultiMonthPayment = async () => {
  creating.value = true
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const student = students.value.find(s => s.id === form.studentId)
    const totalAmount = calculateTotal()
    const newPayment = {
      id: Date.now().toString(),
      student,
      period_label: getPeriodLabel(),
      months: form.months,
      monthly_amount: form.monthlyAmount,
      total_amount: totalAmount,
      paid_amount: 0,
      progress_percentage: 0,
      status: 'pending',
      payment_url: `https://pakasir.zone.id/pay/uang-kas-kelas-1-ibnu-sina/${totalAmount}?order_id=${student.nickname.toUpperCase()}${Date.now()}`,
      month_details: []
    }
    
    multiMonthPayments.value.unshift(newPayment)
    
    toast.success('Pembayaran multi-bulan berhasil dibuat!')
    showCreateModal.value = false
    
    // Reset form
    Object.assign(form, {
      studentId: '',
      startMonth: new Date().getMonth() + 1,
      year: new Date().getFullYear(),
      months: 6,
      monthlyAmount: 50000
    })
    
  } catch (error) {
    toast.error('Gagal membuat pembayaran multi-bulan')
  } finally {
    creating.value = false
  }
}

const viewDetails = (payment) => {
  selectedPayment.value = payment
  showDetailModal.value = true
}

const sendReminder = (payment) => {
  toast.success(`Reminder dikirim ke ${payment.student.name}`)
}

const copyPaymentLink = async (payment) => {
  try {
    await navigator.clipboard.writeText(payment.payment_url)
    toast.success('Link berhasil disalin')
  } catch (error) {
    toast.error('Gagal menyalin link')
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

const sendPaymentReminder = (payment) => {
  toast.success(`Reminder pembayaran dikirim ke ${payment.student.name}`)
  showDetailModal.value = false
}

onMounted(() => {
  // Component initialization
})
</script>
