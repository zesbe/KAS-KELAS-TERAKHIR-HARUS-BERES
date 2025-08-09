<template>
  <div class="space-y-8">
    <!-- Database Setup Notice -->
    <div v-if="isSupabaseConfigured && needsDatabaseSetup" class="space-y-4">
      <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div class="flex">
          <div class="flex-shrink-0">
            <ExclamationTriangleIcon class="h-5 w-5 text-blue-400" />
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-blue-800">Database Setup Required</h3>
            <div class="mt-2 text-sm text-blue-700">
              <p>Your Supabase database is connected but tables need to be created.</p>
              <div class="mt-3 flex flex-wrap gap-2">
                <router-link to="/settings" class="btn-primary text-xs py-1 px-3">
                  Go to Settings
                </router-link>
                <button @click="runDiagnostics" class="btn-secondary text-xs py-1 px-3">
                  Run Diagnostics
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Diagnostics Results -->
      <div v-if="setupRecommendation" class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div class="flex">
          <div class="flex-shrink-0">
            <ExclamationTriangleIcon class="h-5 w-5 text-yellow-400" />
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-yellow-800">{{ setupRecommendation.title }}</h3>
            <div class="mt-2 text-sm text-yellow-700">
              <p>{{ setupRecommendation.message }}</p>
              <ul class="mt-2 list-disc list-inside space-y-1">
                <li v-for="action in setupRecommendation.actions" :key="action">{{ action }}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Development Notice -->
    <div v-if="!isSupabaseConfigured" class="bg-amber-50 border border-amber-200 rounded-xl p-5" style="box-shadow: var(--shadow-enterprise)">
      <div class="flex">
        <div class="flex-shrink-0">
          <ExclamationTriangleIcon class="h-5 w-5 text-amber-500" />
        </div>
        <div class="ml-4">
          <h3 class="text-sm font-semibold text-amber-800 tracking-tight">Development Mode</h3>
          <div class="mt-2 text-sm text-amber-700">
            <p>Application is running with simulation data. Configure Supabase in Settings for real database.</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Dashboard Header -->
    <div class="relative overflow-hidden bg-slate-900 rounded-xl p-8" style="box-shadow: var(--shadow-enterprise-lg)">
      <div class="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"></div>
      <div class="absolute top-0 right-0 w-64 h-64 bg-slate-700 opacity-10 rounded-full transform translate-x-32 -translate-y-32"></div>

      <div class="relative flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 class="text-3xl font-bold text-white mb-3 tracking-tight">
            Financial Dashboard
          </h1>
          <p class="text-slate-300 text-lg font-medium">
            Class fund overview and payment analytics
          </p>
        </div>

        <!-- Desktop report button -->
        <button
          @click="showPdfModal = true"
          class="hidden sm:flex mt-6 sm:mt-0 bg-white hover:bg-slate-50 text-slate-900 font-semibold py-3 px-6 rounded-lg transition-all duration-200 items-center border border-slate-200"
          style="box-shadow: var(--shadow-enterprise-md)"
          title="Generate Reports"
        >
          <DocumentArrowDownIcon class="w-5 h-5 mr-2" />
          Generate Report
        </button>

        <!-- Mobile flip report button -->
        <div class="sm:hidden mt-6">
          <button
            @click="showMobileDownload = !showMobileDownload"
            class="w-full bg-white hover:bg-slate-50 text-slate-900 font-semibold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center border border-slate-200"
            style="box-shadow: var(--shadow-enterprise-md)"
            title="Toggle Report Options"
          >
            <DocumentArrowDownIcon class="w-5 h-5 mr-2" />
            <span class="text-sm font-semibold">Reports</span>
            <svg
              :class="['w-4 h-4 ml-2 transition-transform duration-200', showMobileDownload ? 'rotate-180' : '']"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <!-- Mobile report content -->
          <div
            :class="['overflow-hidden transition-all duration-300', showMobileDownload ? 'max-h-20 mt-3' : 'max-h-0']"
          >
            <button
              @click="showPdfModal = true"
              class="w-full bg-slate-100 hover:bg-slate-200 text-slate-900 font-medium py-2.5 px-4 rounded-lg transition-all duration-200 flex items-center justify-center text-sm border border-slate-200"
              title="Generate Reports"
            >
              <DocumentArrowDownIcon class="w-4 h-4 mr-2" />
              Select Report Action
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Statistics Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div class="stat-card">
        <div class="flex items-center justify-between">
          <div>
            <p class="stat-label">Total Income</p>
            <p class="stat-value text-emerald-600">
              {{ formatCurrency(store.totalIncome) }}
            </p>
            <p class="stat-change positive text-xs mt-1">+12.5% from last month</p>
          </div>
          <div class="p-3 bg-emerald-100 rounded-lg">
            <BanknotesIcon class="w-6 h-6 text-emerald-600" />
          </div>
        </div>
      </div>

      <div class="stat-card">
        <div class="flex items-center justify-between">
          <div>
            <p class="stat-label">Total Expenses</p>
            <p class="stat-value text-red-600">
              {{ formatCurrency(store.totalExpenses) }}
            </p>
            <p class="stat-change negative text-xs mt-1">+8.2% from last month</p>
          </div>
          <div class="p-3 bg-red-100 rounded-lg">
            <ReceiptPercentIcon class="w-6 h-6 text-red-600" />
          </div>
        </div>
      </div>

      <div class="stat-card">
        <div class="flex items-center justify-between">
          <div>
            <p class="stat-label">Current Balance</p>
            <p class="stat-value text-slate-900">
              {{ formatCurrency(store.currentBalance) }}
            </p>
            <p class="stat-change positive text-xs mt-1">Available funds</p>
          </div>
          <div class="p-3 bg-blue-100 rounded-lg">
            <CreditCardIcon class="w-6 h-6 text-blue-600" />
          </div>
        </div>
      </div>

      <div class="stat-card">
        <div class="flex items-center justify-between">
          <div>
            <p class="stat-label">Total Students</p>
            <p class="stat-value text-slate-900">
              {{ store.students.length }}
            </p>
            <p class="stat-change text-xs mt-1 text-slate-500">Active members</p>
          </div>
          <div class="p-3 bg-slate-100 rounded-lg">
            <UsersIcon class="w-6 h-6 text-slate-600" />
          </div>
        </div>
      </div>
    </div>

    <!-- Payment Status -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="card">
        <div class="card-header">
          <h3 class="heading-3 flex items-center">
            <div class="w-2 h-2 bg-emerald-500 rounded-full mr-3"></div>
            Payment Status
          </h3>
        </div>
        <div class="card-body">
        <div class="space-y-4">
          <div class="flex items-center justify-between p-4 bg-emerald-50 rounded-lg border border-emerald-100">
            <div class="flex items-center">
              <div class="w-3 h-3 bg-emerald-500 rounded-full mr-3"></div>
              <span class="text-sm font-semibold text-slate-700">Paid</span>
            </div>
            <span class="badge-success">
              {{ store.studentsByPaymentStatus.paid.length }} students
            </span>
          </div>
          <div class="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-100">
            <div class="flex items-center">
              <div class="w-3 h-3 bg-red-500 rounded-full mr-3"></div>
              <span class="text-sm font-semibold text-slate-700">Unpaid</span>
            </div>
            <span class="badge-danger">
              {{ store.studentsByPaymentStatus.unpaid.length }} students
            </span>
          </div>
        </div>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <h3 class="heading-3 flex items-center">
            <div class="w-2 h-2 bg-amber-500 rounded-full mr-3"></div>
            Pending Payments
          </h3>
        </div>
        <div class="card-body">
        <div class="space-y-3">
          <div
            v-for="payment in store.pendingPayments.slice(0, 5)"
            :key="payment.id"
            class="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100 hover:bg-slate-100 transition-colors duration-200"
          >
            <div>
              <p class="text-sm font-semibold text-slate-900">{{ payment.student?.name }}</p>
              <p class="text-xs text-slate-500 font-medium">{{ formatCurrency(payment.amount) }}</p>
            </div>
            <span class="badge-warning">
              Pending
            </span>
          </div>
          <div v-if="store.pendingPayments.length === 0" class="text-center py-8">
            <div class="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg class="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <p class="text-sm text-slate-600 font-medium">No pending payments</p>
          </div>
        </div>
        </div>
      </div>
    </div>

    <!-- Recent Transactions -->
    <div class="card p-4 sm:p-6">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold text-gray-900">Transaksi Terbaru</h3>
        <router-link
          to="/transactions"
          class="text-sm text-primary-600 hover:text-primary-500"
        >
          Lihat Semua
        </router-link>
      </div>

      <!-- Mobile Card View -->
      <div class="block sm:hidden space-y-3">
        <div v-for="transaction in store.recentTransactions" :key="transaction.id" class="bg-gray-50 rounded-lg p-3">
          <div class="flex items-center justify-between mb-2">
            <div class="font-medium text-sm">{{ transaction.student?.name || '-' }}</div>
            <span :class="[
              'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
              transaction.status === 'completed' ? 'bg-success-100 text-success-800' : 'bg-warning-100 text-warning-800'
            ]">
              {{ transaction.status === 'completed' ? 'Selesai' : 'Pending' }}
            </span>
          </div>
          <div class="space-y-1 text-sm">
            <div class="flex justify-between">
              <span class="text-gray-600">Keterangan:</span>
              <span class="text-right">{{ transaction.description }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Jumlah:</span>
              <span :class="transaction.type === 'income' ? 'text-success-600' : 'text-red-600'" class="font-medium">
                {{ transaction.type === 'income' ? '+' : '-' }}{{ formatCurrency(transaction.amount) }}
              </span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Tanggal:</span>
              <span class="text-xs">{{ formatDate(transaction.created_at) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Desktop Table View -->
      <div class="hidden sm:block overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tanggal
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Siswa
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
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="transaction in store.recentTransactions" :key="transaction.id">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ formatDate(transaction.created_at) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ transaction.student?.name || '-' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ transaction.description }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <span :class="transaction.type === 'income' ? 'text-success-600' : 'text-red-600'">
                  {{ transaction.type === 'income' ? '+' : '-' }}{{ formatCurrency(transaction.amount) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="[
                  'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                  transaction.status === 'completed' ? 'bg-success-100 text-success-800' : 'bg-warning-100 text-warning-800'
                ]">
                  {{ transaction.status === 'completed' ? 'Selesai' : 'Pending' }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
        
      <div v-if="store.recentTransactions.length === 0" class="text-center py-8">
        <p class="text-sm text-gray-500">Belum ada transaksi</p>
      </div>
    </div>

    <!-- Monthly Payment Tracking -->
    <MonthlyPaymentTracker />

    <!-- PDF Action Modal -->
    <PdfActionModal
      :show="showPdfModal"
      @close="showPdfModal = false"
      @print="handleDashboardPrint"
      @download="handleDashboardDownload"
      @preview="handleDashboardPreview"
    />

    <!-- Quick Actions -->
    <div class="card p-6 bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50">
      <h3 class="text-2xl font-bold text-gray-800 mb-6 flex items-center">
        <span class="text-2xl mr-2">⚡</span>
        Aksi Cepat
      </h3>
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <router-link
          to="/payments"
          class="group flex flex-col items-center p-6 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl hover:from-blue-200 hover:to-indigo-200 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-xl border border-blue-200"
        >
          <div class="p-3 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300">
            <CreditCardIcon class="w-8 h-8 text-white" />
          </div>
          <span class="text-sm font-semibold text-blue-800 text-center mt-3">💳 Buat Link Bayar</span>
        </router-link>

        <router-link
          to="/campaigns"
          class="group flex flex-col items-center p-6 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl hover:from-green-200 hover:to-emerald-200 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-xl border border-green-200"
        >
          <div class="p-3 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300">
            <SpeakerWaveIcon class="w-8 h-8 text-white" />
          </div>
          <span class="text-sm font-semibold text-green-800 text-center mt-3">📢 Kirim Pesan</span>
        </router-link>

        <router-link
          to="/expenses"
          class="group flex flex-col items-center p-6 bg-gradient-to-br from-orange-100 to-amber-100 rounded-2xl hover:from-orange-200 hover:to-amber-200 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-xl border border-orange-200"
        >
          <div class="p-3 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300">
            <ReceiptPercentIcon class="w-8 h-8 text-white" />
          </div>
          <span class="text-sm font-semibold text-orange-800 text-center mt-3">💰 Catat Pengeluaran</span>
        </router-link>

        <router-link
          to="/reports"
          class="group flex flex-col items-center p-6 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl hover:from-purple-200 hover:to-pink-200 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-xl border border-purple-200"
        >
          <div class="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300">
            <DocumentChartBarIcon class="w-8 h-8 text-white" />
          </div>
          <span class="text-sm font-semibold text-purple-800 text-center mt-3">📊 Lihat Laporan</span>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useAppStore } from '@/stores'
import { useToast } from 'vue-toastification'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'
import { runDatabaseDiagnostics, generateSetupRecommendation } from '@/utils/databaseDiagnostics'
import MonthlyPaymentTracker from '@/components/MonthlyPaymentTracker.vue'
import PdfActionModal from '@/components/PdfActionModal.vue'
import {
  BanknotesIcon,
  ReceiptPercentIcon,
  CreditCardIcon,
  UsersIcon,
  SpeakerWaveIcon,
  DocumentChartBarIcon,
  ExclamationTriangleIcon,
  DocumentArrowDownIcon
} from '@heroicons/vue/24/outline'

const store = useAppStore()
const toast = useToast()

// Check if Supabase is configured
const isSupabaseConfigured = import.meta.env.VITE_SUPABASE_URL &&
  import.meta.env.VITE_SUPABASE_ANON_KEY &&
  !import.meta.env.VITE_SUPABASE_URL.includes('your-project') &&
  !import.meta.env.VITE_SUPABASE_ANON_KEY.includes('your-anon-key')

// Database diagnostics
const diagnostics = ref(null)
const setupRecommendation = ref(null)

// Mobile download toggle
const showMobileDownload = ref(false)

// PDF action modal
const showPdfModal = ref(false)

// Check if database setup is needed (no data loaded despite being configured)
const needsDatabaseSetup = computed(() => {
  return isSupabaseConfigured &&
    store.students.length === 0 &&
    store.transactions.length === 0 &&
    store.expenses.length === 0
})

// Run diagnostics when there are data loading issues
const runDiagnostics = async () => {
  if (isSupabaseConfigured && needsDatabaseSetup.value) {
    try {
      console.log('Running database diagnostics...')
      diagnostics.value = await runDatabaseDiagnostics()
      setupRecommendation.value = generateSetupRecommendation(diagnostics.value)
      console.log('Diagnostics results:', diagnostics.value)
      console.log('Setup recommendation:', setupRecommendation.value)
    } catch (error) {
      console.error('Error running diagnostics:', error)
    }
  }
}

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

// Legacy function - now just calls download
const downloadDashboardPDF = () => {
  handleDashboardDownload()
}

// Handle PDF actions from modal
const handleDashboardPrint = () => {
  showPdfModal.value = false
  printDashboardPDF()
}

const handleDashboardDownload = () => {
  showPdfModal.value = false
  downloadDashboardPDFFile()
}

const handleDashboardPreview = () => {
  showPdfModal.value = false
  previewDashboardPDF()
}

// Print function - opens print dialog
const printDashboardPDF = () => {
  try {
    const pdfContent = generateDashboardPDFContent()
    const printWindow = window.open('', '_blank', 'width=800,height=600')

    if (printWindow) {
      const printContent = `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><title>Dashboard Kas Kelas</title>
<style>
body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.5; }
h1 { color: #1f2937; border-bottom: 3px solid #3b82f6; padding-bottom: 15px; }
h2 { color: #374151; margin-top: 30px; border-left: 4px solid #3b82f6; padding-left: 10px; }
table { width: 100%; border-collapse: collapse; margin: 20px 0; }
th, td { border: 1px solid #d1d5db; padding: 10px; text-align: left; font-size: 12px; }
th { background-color: #f3f4f6; font-weight: bold; }
.income { color: #059669; font-weight: bold; }
.expense { color: #dc2626; font-weight: bold; }
tr:nth-child(even) { background-color: #f9fafb; }
@media print { body { margin: 0; } }
</style></head><body>${pdfContent}</body></html>`

      printWindow.document.write(printContent)
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

// Download function - saves file
const downloadDashboardPDFFile = () => {
  try {
    const pdfContent = generateDashboardPDFContent()
    const timestamp = new Date().toLocaleDateString('id-ID').replace(/\//g, '_')
    const fileName = `Dashboard_Kas_Kelas_${timestamp}.html`

    const htmlContent = `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Dashboard Kas Kelas - ${new Date().toLocaleDateString('id-ID')}</title>
<style>
body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.5; }
h1 { color: #1f2937; border-bottom: 3px solid #3b82f6; padding-bottom: 15px; }
h2 { color: #374151; margin-top: 30px; border-left: 4px solid #3b82f6; padding-left: 10px; }
table { width: 100%; border-collapse: collapse; margin: 20px 0; }
th, td { border: 1px solid #d1d5db; padding: 10px; text-align: left; font-size: 12px; }
th { background-color: #f3f4f6; font-weight: bold; }
.income { color: #059669; font-weight: bold; }
.expense { color: #dc2626; font-weight: bold; }
tr:nth-child(even) { background-color: #f9fafb; }
.download-info { background-color: #ecfdf5; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981; }
@media print { .download-info { display: none; } }
</style></head><body>
<div class="download-info">
<h3 style="color: #065f46;">💾 File Berhasil Didownload!</h3>
<p style="color: #047857;">Gunakan Ctrl+P untuk print atau share via browser.</p>
</div>
${pdfContent}
</body></html>`

    createDownloadLink(htmlContent, fileName)
  } catch (error) {
    console.error('Download error:', error)
    toast.error('Gagal download laporan')
  }
}

// Preview function - opens in new tab for viewing
const previewDashboardPDF = () => {
  try {
    const pdfContent = generateDashboardPDFContent()

    const htmlContent = `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Preview - Dashboard Kas Kelas</title>
<style>
body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.5; }
h1 { color: #1f2937; border-bottom: 3px solid #3b82f6; padding-bottom: 15px; }
h2 { color: #374151; margin-top: 30px; border-left: 4px solid #3b82f6; padding-left: 10px; }
table { width: 100%; border-collapse: collapse; margin: 20px 0; }
th, td { border: 1px solid #d1d5db; padding: 10px; text-align: left; font-size: 12px; }
th { background-color: #f3f4f6; font-weight: bold; }
.income { color: #059669; font-weight: bold; }
.expense { color: #dc2626; font-weight: bold; }
tr:nth-child(even) { background-color: #f9fafb; }
.preview-info { background-color: #dbeafe; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #3b82f6; }
.action-buttons { position: fixed; top: 20px; right: 20px; display: flex; gap: 10px; z-index: 1000; }
.btn { padding: 10px 15px; border-radius: 8px; font-weight: bold; border: none; cursor: pointer; text-decoration: none; }
.btn-print { background: #059669; color: white; }
</style></head><body>
<div class="action-buttons">
<button onclick="window.print()" class="btn btn-print">🖨️ Print</button>
</div>
<div class="preview-info">
<h3 style="color: #1e40af;">👁️ Preview Mode</h3>
<p style="color: #1d4ed8;">Ini adalah preview laporan. Gunakan tombol Print di atas atau Ctrl+P.</p>
</div>
${pdfContent}
</body></html>`

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

    // Cleanup
    setTimeout(() => URL.revokeObjectURL(url), 1000)

    toast.success('✅ File laporan berhasil di-download!')
  } catch (error) {
    console.error('Download error:', error)
    toast.error('Gagal download file. Silakan coba lagi.')
  }
}

const generateDashboardPDFContent = () => {
  // Get ALL transactions, not just 10
  const allTransactions = store.transactions || []

  // Also get all students with payment status
  const allStudents = store.students || []
  const paidStudentIds = allTransactions
    .filter(t => t.type === 'income' && t.status === 'completed')
    .map(t => t.student_id)

  const studentsWithStatus = allStudents.map(student => ({
    ...student,
    hasPaid: paidStudentIds.includes(student.id),
    paymentCount: allTransactions.filter(t =>
      t.student_id === student.id &&
      t.type === 'income' &&
      t.status === 'completed'
    ).length
  }))

  // Generate recent transactions table (show latest 15)
  let transactionRows = ''
  const recentTransactions = allTransactions.slice(0, 15)
  recentTransactions.forEach(transaction => {
    const amountClass = transaction.type === 'income' ? 'income' : 'expense'
    const amountSign = transaction.type === 'income' ? '+' : '-'
    transactionRows += `
      <tr>
        <td>${transaction.student?.name || '-'}</td>
        <td>${transaction.description}</td>
        <td class="${amountClass}">${amountSign}${formatCurrency(transaction.amount)}</td>
        <td>${transaction.status === 'completed' ? 'Selesai' : 'Pending'}</td>
        <td>${formatDate(transaction.created_at)}</td>
      </tr>
    `
  })

  // Generate ALL students payment status table
  let studentRows = ''
  studentsWithStatus.forEach(student => {
    const statusClass = student.hasPaid ? 'income' : 'expense'
    const statusText = student.hasPaid ? '✅ Sudah Bayar' : '❌ Belum Bayar'
    studentRows += `
      <tr>
        <td>${student.name}</td>
        <td>${student.nickname}</td>
        <td>${student.phone || '-'}</td>
        <td>${student.paymentCount}</td>
        <td class="${statusClass}">${statusText}</td>
      </tr>
    `
  })

  return `
    <h1>📊 Dashboard Report Kas Kelas</h1>

    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-label">💰 Total Pemasukan</div>
        <div class="stat-value income">${formatCurrency(store.totalIncome)}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">📄 Total Pengeluaran</div>
        <div class="stat-value expense">${formatCurrency(store.totalExpenses)}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">💳 Saldo Kas</div>
        <div class="stat-value">${formatCurrency(store.totalIncome - store.totalExpenses)}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">👥 Total Siswa</div>
        <div class="stat-value">${store.students.length}</div>
      </div>
    </div>

    <h2>👥 Status Pembayaran Semua Siswa (${allStudents.length} Siswa)</h2>
    <table>
      <thead>
        <tr>
          <th>Nama Siswa</th>
          <th>Nickname</th>
          <th>No. HP</th>
          <th>Total Bayar</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        ${studentRows || '<tr><td colspan="5" style="text-align: center; color: #6b7280;">Tidak ada data siswa</td></tr>'}
      </tbody>
    </table>

    <h2>📋 Transaksi Terbaru (15 Terakhir)</h2>
    <table>
      <thead>
        <tr>
          <th>Siswa</th>
          <th>Keterangan</th>
          <th>Jumlah</th>
          <th>Status</th>
          <th>Tanggal</th>
        </tr>
      </thead>
      <tbody>
        ${transactionRows || '<tr><td colspan="5" style="text-align: center; color: #6b7280;">Tidak ada transaksi</td></tr>'}
      </tbody>
    </table>

    <h2>📈 Ringkasan Lengkap</h2>
    <p><strong>Total Siswa:</strong> ${allStudents.length}</p>
    <p><strong>Siswa Sudah Bayar:</strong> ${studentsWithStatus.filter(s => s.hasPaid).length}</p>
    <p><strong>Siswa Belum Bayar:</strong> ${studentsWithStatus.filter(s => !s.hasPaid).length}</p>
    <p><strong>Total Pemasukan:</strong> ${formatCurrency(store.totalIncome)}</p>
    <p><strong>Total Pengeluaran:</strong> ${formatCurrency(store.totalExpenses)}</p>
    <p><strong>Saldo Kas:</strong> ${formatCurrency(store.totalIncome - store.totalExpenses)}</p>
    <p><strong>Total Transaksi:</strong> ${allTransactions.length}</p>
  `
}
</script>
