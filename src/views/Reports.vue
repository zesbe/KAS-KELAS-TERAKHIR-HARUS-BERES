<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
      <div>
        <h1 class="text-xl sm:text-2xl font-semibold text-gray-900">Laporan Keuangan</h1>
        <p class="text-sm text-gray-500 mt-1">Analisis dan laporan keuangan kas kelas</p>
      </div>
      <div class="relative">
        <button
          @click="showExportMenu = !showExportMenu"
          class="btn-primary w-full sm:w-auto"
        >
          <DocumentArrowDownIcon class="w-4 h-4 mr-2" />
          <span class="hidden sm:inline">Export & PDF</span>
          <span class="sm:hidden">Export</span>
          <ChevronDownIcon class="w-4 h-4 ml-1" />
        </button>

        <!-- Export dropdown menu -->
        <div v-if="showExportMenu" class="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-200 z-10">
          <div class="py-2">
            <div class="px-4 py-3 text-xs font-bold text-green-600 uppercase tracking-wider border-b border-gray-100 bg-green-50">
              📊 Excel Export
            </div>
            <button @click="exportSummaryToExcel" class="block w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-green-50 flex items-center">
              📋 Export Summary Excel
            </button>
            <button @click="exportDetailToExcel" class="block w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-green-50 flex items-center">
              📈 Export Detail Excel
            </button>
            <button @click="exportCompleteToExcel" class="block w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-green-50 flex items-center">
              🔍 Export Lengkap Excel
            </button>
            <div class="border-t border-gray-100 mt-1">
              <div class="px-4 py-3 text-xs font-bold text-blue-600 uppercase tracking-wider bg-blue-50">
                📄 PDF Laporan
              </div>
              <button @click="showDetailPdfModal = true" class="block w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 flex items-center">
                📄 Laporan PDF Detail
              </button>
              <button @click="showSummaryPdfModal = true" class="block w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 flex items-center">
                📋 Summary PDF
              </button>
              <button @click="showCompletePdfModal = true" class="block w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 flex items-center">
                📄 PDF Lengkap
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Period Selector -->
    <div class="card p-4 sm:p-6">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Periode Laporan</label>
          <select v-model="selectedPeriod" @change="updatePeriod" class="input-field">
            <option value="thisMonth">Bulan Ini</option>
            <option value="lastMonth">Bulan Lalu</option>
            <option value="thisYear">Tahun Ini</option>
            <option value="custom">Kustom</option>
          </select>
        </div>
        
        <div v-if="selectedPeriod === 'custom'">
          <label class="block text-sm font-medium text-gray-700 mb-2">Dari Tanggal</label>
          <input v-model="dateFrom" type="date" class="input-field" @change="filterData" />
        </div>
        
        <div v-if="selectedPeriod === 'custom'">
          <label class="block text-sm font-medium text-gray-700 mb-2">Sampai Tanggal</label>
          <input v-model="dateTo" type="date" class="input-field" @change="filterData" />
        </div>
      </div>
    </div>

    <!-- Summary Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div class="card p-6">
        <div class="flex items-center">
          <div class="p-2 bg-success-100 rounded-lg">
            <BanknotesIcon class="w-6 h-6 text-success-600" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Total Pemasukan</p>
            <p class="text-2xl font-semibold text-gray-900">
              {{ formatCurrency(reportData.totalIncome) }}
            </p>
          </div>
        </div>
      </div>

      <div class="card p-6">
        <div class="flex items-center">
          <div class="p-2 bg-red-100 rounded-lg">
            <ReceiptPercentIcon class="w-6 h-6 text-red-600" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Total Pengeluaran</p>
            <p class="text-2xl font-semibold text-gray-900">
              {{ formatCurrency(reportData.totalExpenses) }}
            </p>
          </div>
        </div>
      </div>

      <div class="card p-6">
        <div class="flex items-center">
          <div class="p-2 bg-primary-100 rounded-lg">
            <CreditCardIcon class="w-6 h-6 text-primary-600" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Saldo Akhir</p>
            <p class="text-2xl font-semibold text-gray-900">
              {{ formatCurrency(reportData.balance) }}
            </p>
          </div>
        </div>
      </div>

      <div class="card p-6">
        <div class="flex items-center">
          <div class="p-2 bg-warning-100 rounded-lg">
            <UsersIcon class="w-6 h-6 text-warning-600" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Transaksi</p>
            <p class="text-2xl font-semibold text-gray-900">
              {{ reportData.transactionCount }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Analytics Dashboard -->
    <FinancialCharts
      :transactions="filteredTransactions"
      :expenses="filteredExpenses"
      :students="store.students"
      :period="{ from: dateFrom, to: dateTo }"
    />

    <!-- Quick Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <!-- Payment Rate -->
      <div class="card p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Tingkat Pembayaran</h3>
        <div class="space-y-3">
          <div class="flex justify-between items-center">
            <span class="text-sm text-gray-600">Rate Pembayaran</span>
            <span class="text-lg font-semibold text-primary-600">{{ paymentRate }}%</span>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-2">
            <div
              class="bg-primary-600 h-2 rounded-full"
              :style="{ width: paymentRate + '%' }"
            ></div>
          </div>
          <div class="text-xs text-gray-500">
            {{ reportData.paidStudents.length }} dari {{ store.students.length }} siswa
          </div>
        </div>
      </div>

      <!-- Average Payment -->
      <div class="card p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Rata-rata Pembayaran</h3>
        <div class="space-y-2">
          <div class="text-2xl font-bold text-gray-900">
            {{ formatCurrency(averagePayment) }}
          </div>
          <div class="text-sm text-gray-500">
            Per siswa yang sudah bayar
          </div>
          <div class="text-xs text-gray-400">
            Total: {{ formatCurrency(reportData.totalIncome) }}
          </div>
        </div>
      </div>

      <!-- Expense Categories -->
      <div class="card p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Kategori Pengeluaran</h3>
        <div class="space-y-2">
          <div v-for="category in topExpenseCategories" :key="category.name" class="flex justify-between items-center">
            <span class="text-sm text-gray-600">{{ category.name }}</span>
            <span class="text-sm font-medium text-gray-900">{{ formatCurrency(category.amount) }}</span>
          </div>
          <div v-if="topExpenseCategories.length === 0" class="text-sm text-gray-500 text-center py-4">
            Belum ada pengeluaran
          </div>
        </div>
      </div>
    </div>

    <!-- Analytics Insights -->
    <AnalyticsInsights
      :transactions="filteredTransactions"
      :expenses="filteredExpenses"
      :students="store.students"
      :period="{ from: dateFrom, to: dateTo }"
    />

    <!-- Payment Status by Student -->
    <div class="card p-6">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">Status Pembayaran Siswa</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Paid Students -->
        <div>
          <h4 class="text-md font-medium text-success-600 mb-3">Sudah Bayar ({{ reportData.paidStudents.length }})</h4>
          <div class="space-y-2 max-h-64 overflow-y-auto">
            <div 
              v-for="student in reportData.paidStudents" 
              :key="student.id"
              class="flex items-center justify-between p-3 bg-success-50 rounded-lg"
            >
              <span class="text-sm font-medium text-success-900">{{ student.name }}</span>
              <span class="text-xs text-success-600">{{ formatCurrency(student.totalPaid) }}</span>
            </div>
          </div>
        </div>

        <!-- Unpaid Students -->
        <div>
          <h4 class="text-md font-medium text-red-600 mb-3">Belum Bayar ({{ reportData.unpaidStudents.length }})</h4>
          <div class="space-y-2 max-h-64 overflow-y-auto">
            <div 
              v-for="student in reportData.unpaidStudents" 
              :key="student.id"
              class="flex items-center justify-between p-3 bg-red-50 rounded-lg"
            >
              <span class="text-sm font-medium text-red-900">{{ student.name }}</span>
              <span class="text-xs text-red-600">Belum Bayar</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Detailed Transactions -->
    <div class="card p-6">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">Detail Transaksi</h3>
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tanggal
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Jenis
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Keterangan
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Pemasukan
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Pengeluaran
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Saldo
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="(item, index) in reportData.detailedTransactions" :key="index">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ formatDate(item.date) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ item.type === 'income' ? 'Pemasukan' : 'Pengeluaran' }}
              </td>
              <td class="px-6 py-4 text-sm text-gray-500">
                {{ item.description }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-success-600">
                {{ item.type === 'income' ? formatCurrency(item.amount) : '-' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-red-600">
                {{ item.type === 'expense' ? formatCurrency(item.amount) : '-' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {{ formatCurrency(item.balance) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- PDF Action Modals -->
    <PdfActionModal
      :show="showDetailPdfModal"
      @close="showDetailPdfModal = false"
      @print="handleDetailPrint"
      @download="handleDetailDownload"
      @preview="handleDetailPreview"
    />

    <PdfActionModal
      :show="showSummaryPdfModal"
      @close="showSummaryPdfModal = false"
      @print="handleSummaryPrint"
      @download="handleSummaryDownload"
      @preview="handleSummaryPreview"
    />

    <PdfActionModal
      :show="showCompletePdfModal"
      @close="showCompletePdfModal = false"
      @print="handleCompletePrint"
      @download="handleCompleteDownload"
      @preview="handleCompletePreview"
    />
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useAppStore } from '@/stores'
import { useToast } from 'vue-toastification'
import { format, startOfMonth, endOfMonth, startOfYear, endOfYear, subMonths } from 'date-fns'
import { id } from 'date-fns/locale'
import exportService from '@/services/export'
import FinancialCharts from '@/components/FinancialCharts.vue'
import AnalyticsInsights from '@/components/AnalyticsInsights.vue'
import PdfActionModal from '@/components/PdfActionModal.vue'
import {
  BanknotesIcon,
  ReceiptPercentIcon,
  CreditCardIcon,
  UsersIcon,
  DocumentArrowDownIcon,
  ChevronDownIcon
} from '@heroicons/vue/24/outline'

const store = useAppStore()
const toast = useToast()

const selectedPeriod = ref('thisMonth')
const dateFrom = ref('')
const dateTo = ref('')

// Modal states
const showExportMenu = ref(false)
const showDetailPdfModal = ref(false)
const showSummaryPdfModal = ref(false)
const showCompletePdfModal = ref(false)

const filteredTransactions = computed(() => {
  if (!dateFrom.value || !dateTo.value) return []

  const fromDate = new Date(dateFrom.value)
  const toDate = new Date(dateTo.value + 'T23:59:59')

  return store.transactions.filter(t => {
    const transactionDate = new Date(t.created_at)
    return transactionDate >= fromDate && transactionDate <= toDate
  })
})

const filteredExpenses = computed(() => {
  if (!dateFrom.value || !dateTo.value) return []

  const fromDate = new Date(dateFrom.value)
  const toDate = new Date(dateTo.value + 'T23:59:59')

  return store.expenses.filter(e => {
    const expenseDate = new Date(e.created_at)
    return expenseDate >= fromDate && expenseDate <= toDate
  })
})

const paymentRate = computed(() => {
  if (store.students.length === 0) return 0
  return Math.round((reportData.paidStudents.length / store.students.length) * 100)
})

const averagePayment = computed(() => {
  if (reportData.paidStudents.length === 0) return 0
  return reportData.totalIncome / reportData.paidStudents.length
})

const topExpenseCategories = computed(() => {
  const categoryTotals = {}

  filteredExpenses.value
    .filter(e => e.status === 'approved')
    .forEach(e => {
      const category = getCategoryLabel(e.category)
      categoryTotals[category] = (categoryTotals[category] || 0) + e.amount
    })

  return Object.entries(categoryTotals)
    .map(([name, amount]) => ({ name, amount }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 5)
})

const reportData = reactive({
  totalIncome: 0,
  totalExpenses: 0,
  balance: 0,
  transactionCount: 0,
  paidStudents: [],
  unpaidStudents: [],
  detailedTransactions: []
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
  return format(new Date(dateString), 'dd MMM yyyy', { locale: id })
}

const updatePeriod = () => {
  const now = new Date()
  
  switch (selectedPeriod.value) {
    case 'thisMonth':
      dateFrom.value = format(startOfMonth(now), 'yyyy-MM-dd')
      dateTo.value = format(endOfMonth(now), 'yyyy-MM-dd')
      break
    case 'lastMonth':
      const lastMonth = subMonths(now, 1)
      dateFrom.value = format(startOfMonth(lastMonth), 'yyyy-MM-dd')
      dateTo.value = format(endOfMonth(lastMonth), 'yyyy-MM-dd')
      break
    case 'thisYear':
      dateFrom.value = format(startOfYear(now), 'yyyy-MM-dd')
      dateTo.value = format(endOfYear(now), 'yyyy-MM-dd')
      break
  }
  
  if (selectedPeriod.value !== 'custom') {
    filterData()
  }
}

const filterData = () => {
  if (!dateFrom.value || !dateTo.value) return

  // Calculate totals using computed filtered data
  reportData.totalIncome = filteredTransactions.value
    .filter(t => t.type === 'income' && t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0)

  reportData.totalExpenses = filteredExpenses.value
    .filter(e => e.status === 'approved')
    .reduce((sum, e) => sum + e.amount, 0)

  reportData.balance = reportData.totalIncome - reportData.totalExpenses
  reportData.transactionCount = filteredTransactions.value.length + filteredExpenses.value.length

  // Calculate student payment status
  const paidStudentIds = filteredTransactions.value
    .filter(t => t.type === 'income' && t.status === 'completed')
    .map(t => t.student_id)

  const studentPayments = {}
  filteredTransactions.value
    .filter(t => t.type === 'income' && t.status === 'completed')
    .forEach(t => {
      if (!studentPayments[t.student_id]) {
        studentPayments[t.student_id] = 0
      }
      studentPayments[t.student_id] += t.amount
    })

  reportData.paidStudents = store.students
    .filter(s => paidStudentIds.includes(s.id))
    .map(s => ({
      ...s,
      totalPaid: studentPayments[s.id] || 0
    }))

  reportData.unpaidStudents = store.students
    .filter(s => !paidStudentIds.includes(s.id))

  // Create detailed transaction list
  const allTransactions = [
    ...filteredTransactions.value.map(t => ({
      date: t.created_at,
      type: t.type,
      description: t.description + (t.student?.name ? ` - ${t.student.name}` : ''),
      amount: t.amount
    })),
    ...filteredExpenses.value.map(e => ({
      date: e.created_at,
      type: 'expense',
      description: e.description,
      amount: e.amount
    }))
  ].sort((a, b) => new Date(a.date) - new Date(b.date))

  let runningBalance = 0
  reportData.detailedTransactions = allTransactions.map(t => {
    if (t.type === 'income') {
      runningBalance += t.amount
    } else {
      runningBalance -= t.amount
    }
    return {
      ...t,
      balance: runningBalance
    }
  })
}

// Excel export functions
const exportSummaryToExcel = () => {
  showExportMenu.value = false
  const headers = ['Keterangan', 'Jumlah (IDR)', 'Detail']
  const data = [
    ['Total Pemasukan', exportService.formatCurrency(reportData.totalIncome), `${reportData.paidStudents.length} siswa`],
    ['Total Pengeluaran', exportService.formatCurrency(reportData.totalExpenses), getExpensesByCategory()],
    ['Saldo Akhir', exportService.formatCurrency(reportData.balance), reportData.balance >= 0 ? 'Surplus' : 'Defisit'],
    ['Total Transaksi', reportData.transactionCount, 'Semua jenis'],
    ['Siswa Sudah Bayar', reportData.paidStudents.length, `${Math.round((reportData.paidStudents.length / (reportData.paidStudents.length + reportData.unpaidStudents.length)) * 100)}%`],
    ['Siswa Belum Bayar', reportData.unpaidStudents.length, `${Math.round((reportData.unpaidStudents.length / (reportData.paidStudents.length + reportData.unpaidStudents.length)) * 100)}%`],
    ['Periode', `${dateFrom.value} s/d ${dateTo.value}`, 'Filter aktif']
  ]

  exportService.downloadExcel(headers, data, `ringkasan_keuangan_${getPeriodString()}`)
  toast.success('📊 Ringkasan Excel berhasil di-export!')
}

const exportDetailToExcel = () => {
  showExportMenu.value = false
  const headers = [
    'Tanggal',
    'Jenis',
    'Keterangan',
    'Siswa/Kategori',
    'Pemasukan (IDR)',
    'Pengeluaran (IDR)',
    'Saldo (IDR)',
    'Status',
    'Metode Pembayaran'
  ]

  const data = reportData.detailedTransactions.map(item => [
    exportService.formatDate(item.date),
    item.type === 'income' ? 'Pemasukan' : 'Pengeluaran',
    item.description,
    item.student_name || item.category || '',
    item.type === 'income' ? exportService.formatCurrency(item.amount) : '',
    item.type === 'expense' ? exportService.formatCurrency(item.amount) : '',
    exportService.formatCurrency(item.balance),
    item.status || '',
    item.payment_method || ''
  ])

  exportService.downloadExcel(headers, data, `detail_transaksi_${getPeriodString()}`)
  toast.success('📈 Detail Excel berhasil di-export!')
}

const exportCompleteToExcel = () => {
  showExportMenu.value = false
  const headers = [
    'Tanggal', 'Jenis', 'Keterangan', 'Pemasukan', 'Pengeluaran', 'Saldo',
    'Siswa', 'Kategori', 'Status', 'Metode'
  ]

  const summaryData = [
    ['RINGKASAN KEUANGAN', '', '', '', '', '', '', '', '', ''],
    ['Total Pemasukan', '', '', formatCurrency(reportData.totalIncome), '', '', '', '', '', ''],
    ['Total Pengeluaran', '', '', '', formatCurrency(reportData.totalExpenses), '', '', '', '', ''],
    ['Saldo Akhir', '', '', '', '', formatCurrency(reportData.balance), '', '', '', ''],
    ['', '', '', '', '', '', '', '', '', ''],
    ['DETAIL TRANSAKSI', '', '', '', '', '', '', '', '', '']
  ]

  const transactionData = reportData.detailedTransactions.map(item => [
    exportService.formatDate(item.date),
    item.type === 'income' ? 'Pemasukan' : 'Pengeluaran',
    item.description,
    item.type === 'income' ? formatCurrency(item.amount) : '',
    item.type === 'expense' ? formatCurrency(item.amount) : '',
    formatCurrency(item.balance),
    item.student_name || '',
    item.category || '',
    item.status || '',
    item.payment_method || ''
  ])

  const allData = [...summaryData, ...transactionData]

  exportService.downloadExcel(headers, allData, `laporan_lengkap_${getPeriodString()}`)
  toast.success('🔍 Laporan Lengkap Excel berhasil di-export!')
}

const getExpensesByCategory = () => {
  const categoryTotals = {}
  store.expenses
    .filter(e => e.status === 'approved')
    .forEach(e => {
      categoryTotals[e.category] = (categoryTotals[e.category] || 0) + e.amount
    })

  return Object.entries(categoryTotals)
    .map(([cat, total]) => `${getCategoryLabel(cat)}: ${formatCurrency(total)}`)
    .join('; ')
}

const getCategoryLabel = (category) => {
  const labels = {
    kegiatan: 'Kegiatan',
    perlengkapan: 'Perlengkapan',
    konsumsi: 'Konsumsi',
    transport: 'Transport',
    lainnya: 'Lainnya'
  }
  return labels[category] || category
}

const getPeriodString = () => {
  const from = dateFrom.value.replace(/-/g, '')
  const to = dateTo.value.replace(/-/g, '')
  return `${from}_${to}`
}

// PDF modal handlers
const handleDetailPrint = () => {
  showDetailPdfModal.value = false
  showExportMenu.value = false
  printDetailPDF()
}

const handleDetailDownload = () => {
  showDetailPdfModal.value = false
  showExportMenu.value = false
  downloadDetailPDFFile()
}

const handleDetailPreview = () => {
  showDetailPdfModal.value = false
  showExportMenu.value = false
  previewDetailPDF()
}

const handleSummaryPrint = () => {
  showSummaryPdfModal.value = false
  showExportMenu.value = false
  printSummaryPDF()
}

const handleSummaryDownload = () => {
  showSummaryPdfModal.value = false
  showExportMenu.value = false
  downloadSummaryPDFFile()
}

const handleSummaryPreview = () => {
  showSummaryPdfModal.value = false
  showExportMenu.value = false
  previewSummaryPDF()
}

const handleCompletePrint = () => {
  showCompletePdfModal.value = false
  showExportMenu.value = false
  printCompletePDF()
}

const handleCompleteDownload = () => {
  showCompletePdfModal.value = false
  showExportMenu.value = false
  downloadCompletePDFFile()
}

const handleCompletePreview = () => {
  showCompletePdfModal.value = false
  showExportMenu.value = false
  previewCompletePDF()
}

// Print functions
const printDetailPDF = () => {
  try {
    const htmlContent = generateDetailPDFContent()
    const printWindow = window.open('', '_blank')
    if (printWindow) {
      printWindow.document.write(htmlContent)
      printWindow.document.close()
      printWindow.onload = () => {
        printWindow.focus()
        printWindow.print()
      }
      toast.success('🖨️ Dialog printer dibuka!')
    }
  } catch (error) {
    console.error('Print error:', error)
    toast.error('Gagal membuka printer')
  }
}

const printSummaryPDF = () => {
  try {
    const htmlContent = generateSummaryPDFContent()
    const printWindow = window.open('', '_blank')
    if (printWindow) {
      printWindow.document.write(htmlContent)
      printWindow.document.close()
      printWindow.onload = () => {
        printWindow.focus()
        printWindow.print()
      }
      toast.success('🖨️ Dialog printer dibuka!')
    }
  } catch (error) {
    console.error('Print error:', error)
    toast.error('Gagal membuka printer')
  }
}

const printCompletePDF = () => {
  try {
    const htmlContent = generateCompletePDFContent()
    const printWindow = window.open('', '_blank')
    if (printWindow) {
      printWindow.document.write(htmlContent)
      printWindow.document.close()
      printWindow.onload = () => {
        printWindow.focus()
        printWindow.print()
      }
      toast.success('🖨️ Dialog printer dibuka!')
    }
  } catch (error) {
    console.error('Print error:', error)
    toast.error('Gagal membuka printer')
  }
}

// Download functions
const downloadDetailPDFFile = () => {
  try {
    const htmlContent = generateDetailPDFContent()
    const timestamp = new Date().toLocaleDateString('id-ID').replace(/\//g, '_')
    const fileName = `Laporan_Detail_${timestamp}.html`
    createDownloadLink(htmlContent, fileName)
  } catch (error) {
    console.error('Download error:', error)
    toast.error('Gagal download laporan')
  }
}

const downloadSummaryPDFFile = () => {
  try {
    const htmlContent = generateSummaryPDFContent()
    const timestamp = new Date().toLocaleDateString('id-ID').replace(/\//g, '_')
    const fileName = `Laporan_Summary_${timestamp}.html`
    createDownloadLink(htmlContent, fileName)
  } catch (error) {
    console.error('Download error:', error)
    toast.error('Gagal download laporan')
  }
}

const downloadCompletePDFFile = () => {
  try {
    const htmlContent = generateCompletePDFContent()
    const timestamp = new Date().toLocaleDateString('id-ID').replace(/\//g, '_')
    const fileName = `Laporan_Lengkap_${timestamp}.html`
    createDownloadLink(htmlContent, fileName)
  } catch (error) {
    console.error('Download error:', error)
    toast.error('Gagal download laporan')
  }
}

// Preview functions
const previewDetailPDF = () => {
  try {
    const htmlContent = generateDetailPDFContent()
    const previewWindow = window.open('', '_blank')
    if (previewWindow) {
      previewWindow.document.write(htmlContent)
      previewWindow.document.close()
      toast.success('👁️ Preview dibuka di tab baru!')
    }
  } catch (error) {
    console.error('Preview error:', error)
    toast.error('Gagal membuka preview')
  }
}

const previewSummaryPDF = () => {
  try {
    const htmlContent = generateSummaryPDFContent()
    const previewWindow = window.open('', '_blank')
    if (previewWindow) {
      previewWindow.document.write(htmlContent)
      previewWindow.document.close()
      toast.success('👁️ Preview dibuka di tab baru!')
    }
  } catch (error) {
    console.error('Preview error:', error)
    toast.error('Gagal membuka preview')
  }
}

const previewCompletePDF = () => {
  try {
    const htmlContent = generateCompletePDFContent()
    const previewWindow = window.open('', '_blank')
    if (previewWindow) {
      previewWindow.document.write(htmlContent)
      previewWindow.document.close()
      toast.success('👁️ Preview dibuka di tab baru!')
    }
  } catch (error) {
    console.error('Preview error:', error)
    toast.error('Gagal membuka preview')
  }
}

// Helper function to create downloadable file
const createDownloadLink = (content, fileName) => {
  try {
    const blob = new Blob([content], { type: 'text/html;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = fileName
    link.style.display = 'none'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    setTimeout(() => URL.revokeObjectURL(url), 1000)
    toast.success('✅ File laporan berhasil di-download!')
  } catch (error) {
    console.error('Download error:', error)
    toast.error('Gagal download file. Silakan coba lagi.')
  }
}

const generatePDFStyles = () => `
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      line-height: 1.4;
      color: #333;
      background: white;
      margin: 20px;
    }
    .header {
      text-align: center;
      margin-bottom: 30px;
      padding: 20px;
      background: linear-gradient(135deg, #2563eb, #1d4ed8);
      color: white;
      border-radius: 8px;
    }
    .header h1 { font-size: 2rem; margin-bottom: 0.5rem; }
    .header h2 { font-size: 1.2rem; margin-bottom: 1rem; opacity: 0.9; }
    .header p { font-size: 0.9rem; opacity: 0.8; }
    .section { margin-bottom: 30px; }
    .section-title {
      font-size: 1.3rem;
      font-weight: 600;
      color: #1f2937;
      margin-bottom: 15px;
      padding-bottom: 5px;
      border-bottom: 2px solid #e5e7eb;
    }
    .table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 20px;
      background: white;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }
    .table th, .table td {
      border: 1px solid #e5e7eb;
      padding: 12px;
      text-align: left;
    }
    .table th {
      background: #f8fafc;
      font-weight: 600;
      color: #374151;
      font-size: 0.9rem;
    }
    .table td { font-size: 0.9rem; }
    .positive { color: #059669; font-weight: 500; }
    .negative { color: #dc2626; font-weight: 500; }
    .highlight { background-color: #f0f9ff; }
    .summary-box {
      background: #f8fafc;
      padding: 20px;
      border-radius: 8px;
      margin-bottom: 20px;
      border-left: 4px solid #2563eb;
    }
    .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
    .card {
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      padding: 15px;
    }
    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #e5e7eb;
      text-align: center;
      color: #6b7280;
      font-size: 0.8rem;
    }
    @media print {
      body { margin: 0; }
      .header { background: #2563eb !important; -webkit-print-color-adjust: exact; }
    }
  </style>
`

const generateDetailPDFContent = () => `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
    <title>Laporan Detail Keuangan Kas Kelas</title>
    ${generatePDFStyles()}
  </head>
  <body>
    <div class="header">
      <h1>📊 Laporan Detail Keuangan</h1>
      <h2>SD Islam Al Husna - Kelas 1B</h2>
      <p>Komplek Keuangan, Jl. Guntur I</p>
      <p>Periode: ${formatDate(dateFrom.value)} - ${formatDate(dateTo.value)}</p>
      <p>Tanggal Cetak: ${formatDate(new Date().toISOString().split('T')[0])}</p>
    </div>

    <div class="section">
      <h3 class="section-title">📋 Detail Transaksi Lengkap</h3>
      <table class="table">
        <thead>
          <tr>
            <th style="width: 12%">Tanggal</th>
            <th style="width: 10%">Jenis</th>
            <th style="width: 30%">Keterangan</th>
            <th style="width: 15%">Pemasukan</th>
            <th style="width: 15%">Pengeluaran</th>
            <th style="width: 18%">Saldo Running</th>
          </tr>
        </thead>
        <tbody>
          ${reportData.detailedTransactions.map((item, index) => `
            <tr ${index % 2 === 0 ? 'class="highlight"' : ''}>
              <td>${formatDate(item.date)}</td>
              <td><strong>${item.type === 'income' ? '💰 Masuk' : '💸 Keluar'}</strong></td>
              <td>${item.description}</td>
              <td class="${item.type === 'income' ? 'positive' : ''}">${item.type === 'income' ? formatCurrency(item.amount) : '-'}</td>
              <td class="${item.type === 'expense' ? 'negative' : ''}">${item.type === 'expense' ? formatCurrency(item.amount) : '-'}</td>
              <td class="${item.balance >= 0 ? 'positive' : 'negative'}"><strong>${formatCurrency(item.balance)}</strong></td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>

    <div class="grid-2">
      <div class="card">
        <h4 style="color: #059669; margin-bottom: 10px;">✅ Siswa Sudah Bayar (${reportData.paidStudents.length})</h4>
        <table class="table">
          <thead>
            <tr>
              <th>Nama Siswa</th>
              <th>Total Bayar</th>
            </tr>
          </thead>
          <tbody>
            ${reportData.paidStudents.map(student => `
              <tr>
                <td>${student.name}</td>
                <td class="positive">${formatCurrency(student.totalPaid)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      <div class="card">
        <h4 style="color: #dc2626; margin-bottom: 10px;">❌ Siswa Belum Bayar (${reportData.unpaidStudents.length})</h4>
        <table class="table">
          <thead>
            <tr>
              <th>Nama Siswa</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${reportData.unpaidStudents.map(student => `
              <tr>
                <td>${student.name}</td>
                <td class="negative">Belum Bayar</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>

    <div class="footer">
      <p>© ${new Date().getFullYear()} SD Islam Al Husna - Sistem Kas Digital Kelas 1B</p>
      <p>Laporan ini dibuat secara otomatis pada ${new Date().toLocaleString('id-ID')}</p>
    </div>
  </body>
  </html>
`

const generateSummaryPDFContent = () => `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
    <title>Laporan Summary Keuangan Kas Kelas</title>
    ${generatePDFStyles()}
  </head>
  <body>
    <div class="header">
      <h1>📈 Laporan Summary Keuangan</h1>
      <h2>SD Islam Al Husna - Kelas 1B</h2>
      <p>Komplek Keuangan, Jl. Guntur I</p>
      <p>Periode: ${formatDate(dateFrom.value)} - ${formatDate(dateTo.value)}</p>
      <p>Tanggal Cetak: ${formatDate(new Date().toISOString().split('T')[0])}</p>
    </div>

    <div class="summary-box">
      <h3 style="margin-bottom: 15px; color: #1f2937;">💰 Ringkasan Keuangan</h3>
      <table class="table">
        <tr>
          <td style="width: 40%"><strong>💵 Total Pemasukan</strong></td>
          <td class="positive" style="font-size: 1.1rem;"><strong>${formatCurrency(reportData.totalIncome)}</strong></td>
        </tr>
        <tr>
          <td><strong>💸 Total Pengeluaran</strong></td>
          <td class="negative" style="font-size: 1.1rem;"><strong>${formatCurrency(reportData.totalExpenses)}</strong></td>
        </tr>
        <tr style="background: #f0f9ff;">
          <td><strong>🏦 Saldo Akhir</strong></td>
          <td class="${reportData.balance >= 0 ? 'positive' : 'negative'}" style="font-size: 1.2rem;">
            <strong>${formatCurrency(reportData.balance)}</strong>
          </td>
        </tr>
        <tr>
          <td><strong>📊 Total Transaksi</strong></td>
          <td style="font-weight: 600;">${reportData.transactionCount} transaksi</td>
        </tr>
      </table>
    </div>

    <div class="grid-2">
      <div class="card">
        <h4 style="color: #2563eb; margin-bottom: 10px;">👥 Status Pembayaran</h4>
        <table class="table">
          <tr>
            <td><strong>✅ Sudah Bayar</strong></td>
            <td class="positive">${reportData.paidStudents.length} siswa (${paymentRate.value}%)</td>
          </tr>
          <tr>
            <td><strong>❌ Belum Bayar</strong></td>
            <td class="negative">${reportData.unpaidStudents.length} siswa (${100 - paymentRate.value}%)</td>
          </tr>
          <tr>
            <td><strong>💰 Rata-rata Bayar</strong></td>
            <td>${formatCurrency(averagePayment.value)}</td>
          </tr>
        </table>
      </div>

      <div class="card">
        <h4 style="color: #059669; margin-bottom: 10px;">📈 Kategori Pengeluaran</h4>
        <table class="table">
          ${topExpenseCategories.value.map(category => `
            <tr>
              <td>${category.name}</td>
              <td class="negative">${formatCurrency(category.amount)}</td>
            </tr>
          `).join('')}
          ${topExpenseCategories.value.length === 0 ? '<tr><td colspan="2" style="text-align: center; color: #6b7280;">Belum ada pengeluaran</td></tr>' : ''}
        </table>
      </div>
    </div>

    <div class="footer">
      <p>© ${new Date().getFullYear()} SD Islam Al Husna - Sistem Kas Digital Kelas 1B</p>
      <p>Summary dibuat pada ${new Date().toLocaleString('id-ID')}</p>
    </div>
  </body>
  </html>
`

const generateCompletePDFContent = () => `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
    <title>Laporan Lengkap Keuangan Kas Kelas</title>
    ${generatePDFStyles()}
  </head>
  <body>
    <div class="header">
      <h1>📋 Laporan Lengkap Keuangan</h1>
      <h2>SD Islam Al Husna - Kelas 1B</h2>
      <p>Komplek Keuangan, Jl. Guntur I</p>
      <p>Periode: ${formatDate(dateFrom.value)} - ${formatDate(dateTo.value)}</p>
      <p>Tanggal Cetak: ${formatDate(new Date().toISOString().split('T')[0])}</p>
    </div>

    <!-- Executive Summary -->
    <div class="summary-box">
      <h3 style="margin-bottom: 15px; color: #1f2937;">🎯 Executive Summary</h3>
      <table class="table">
        <tr>
          <td style="width: 40%"><strong>💵 Total Pemasukan</strong></td>
          <td class="positive" style="font-size: 1.1rem;"><strong>${formatCurrency(reportData.totalIncome)}</strong></td>
        </tr>
        <tr>
          <td><strong>💸 Total Pengeluaran</strong></td>
          <td class="negative" style="font-size: 1.1rem;"><strong>${formatCurrency(reportData.totalExpenses)}</strong></td>
        </tr>
        <tr style="background: #f0f9ff;">
          <td><strong>🏦 Saldo Akhir</strong></td>
          <td class="${reportData.balance >= 0 ? 'positive' : 'negative'}" style="font-size: 1.2rem;">
            <strong>${formatCurrency(reportData.balance)}</strong>
          </td>
        </tr>
        <tr>
          <td><strong>📊 Total Transaksi</strong></td>
          <td style="font-weight: 600;">${reportData.transactionCount} transaksi</td>
        </tr>
        <tr>
          <td><strong>👥 Rate Pembayaran</strong></td>
          <td style="font-weight: 600;">${paymentRate.value}% (${reportData.paidStudents.length}/${store.students.length} siswa)</td>
        </tr>
      </table>
    </div>

    <!-- Payment Status -->
    <div class="section">
      <h3 class="section-title">👥 Status Pembayaran Siswa</h3>
      <div class="grid-2">
        <div class="card">
          <h4 style="color: #059669; margin-bottom: 10px;">✅ Sudah Bayar (${reportData.paidStudents.length} siswa)</h4>
          <table class="table">
            <thead>
              <tr>
                <th>Nama Siswa</th>
                <th>Total Pembayaran</th>
              </tr>
            </thead>
            <tbody>
              ${reportData.paidStudents.map(student => `
                <tr>
                  <td>${student.name}</td>
                  <td class="positive">${formatCurrency(student.totalPaid)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <div class="card">
          <h4 style="color: #dc2626; margin-bottom: 10px;">❌ Belum Bayar (${reportData.unpaidStudents.length} siswa)</h4>
          <table class="table">
            <thead>
              <tr>
                <th>Nama Siswa</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${reportData.unpaidStudents.map(student => `
                <tr>
                  <td>${student.name}</td>
                  <td class="negative">Belum Bayar</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Detailed Transactions -->
    <div class="section">
      <h3 class="section-title">📋 Detail Transaksi Lengkap</h3>
      <table class="table">
        <thead>
          <tr>
            <th style="width: 12%">Tanggal</th>
            <th style="width: 10%">Jenis</th>
            <th style="width: 30%">Keterangan</th>
            <th style="width: 15%">Pemasukan</th>
            <th style="width: 15%">Pengeluaran</th>
            <th style="width: 18%">Saldo Running</th>
          </tr>
        </thead>
        <tbody>
          ${reportData.detailedTransactions.map((item, index) => `
            <tr ${index % 2 === 0 ? 'class="highlight"' : ''}>
              <td>${formatDate(item.date)}</td>
              <td><strong>${item.type === 'income' ? '💰 Masuk' : '💸 Keluar'}</strong></td>
              <td>${item.description}</td>
              <td class="${item.type === 'income' ? 'positive' : ''}">${item.type === 'income' ? formatCurrency(item.amount) : '-'}</td>
              <td class="${item.type === 'expense' ? 'negative' : ''}">${item.type === 'expense' ? formatCurrency(item.amount) : '-'}</td>
              <td class="${item.balance >= 0 ? 'positive' : 'negative'}"><strong>${formatCurrency(item.balance)}</strong></td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>

    <!-- Expense Categories -->
    ${topExpenseCategories.value.length > 0 ? `
    <div class="section">
      <h3 class="section-title">📈 Kategori Pengeluaran</h3>
      <table class="table">
        <thead>
          <tr>
            <th>Kategori</th>
            <th>Total Pengeluaran</th>
            <th>Persentase</th>
          </tr>
        </thead>
        <tbody>
          ${topExpenseCategories.value.map(category => {
            const percentage = reportData.totalExpenses > 0 ? ((category.amount / reportData.totalExpenses) * 100).toFixed(1) : 0
            return `
              <tr>
                <td>${category.name}</td>
                <td class="negative">${formatCurrency(category.amount)}</td>
                <td>${percentage}%</td>
              </tr>
            `
          }).join('')}
        </tbody>
      </table>
    </div>
    ` : ''}

    <div class="footer">
      <p>© ${new Date().getFullYear()} SD Islam Al Husna - Sistem Kas Digital Kelas 1B</p>
      <p>Laporan lengkap dibuat pada ${new Date().toLocaleString('id-ID')}</p>
      <p style="margin-top: 5px;">📍 Komplek Keuangan, Jl. Guntur I | 📞 (021) 7654-321</p>
    </div>
  </body>
  </html>
`


onMounted(() => {
  updatePeriod()
})
</script>
