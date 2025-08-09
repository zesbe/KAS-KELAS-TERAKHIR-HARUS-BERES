<template>
  <div class="space-y-6">
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
    <div v-if="!isSupabaseConfigured" class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
      <div class="flex">
        <div class="flex-shrink-0">
          <ExclamationTriangleIcon class="h-5 w-5 text-yellow-400" />
        </div>
        <div class="ml-3">
          <h3 class="text-sm font-medium text-yellow-800">Mode Pengembangan</h3>
          <div class="mt-2 text-sm text-yellow-700">
            <p>Aplikasi berjalan dengan data simulasi. Untuk menggunakan database real, konfigurasikan Supabase di Settings.</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Dashboard Header -->
    <div class="relative overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-2xl p-8 shadow-2xl">
      <div class="absolute inset-0 bg-black opacity-10"></div>
      <div class="absolute -top-10 -right-10 w-40 h-40 bg-white opacity-10 rounded-full"></div>
      <div class="absolute -bottom-10 -left-10 w-32 h-32 bg-white opacity-10 rounded-full"></div>

      <div class="relative flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 class="text-3xl font-bold text-white mb-2">
            ✨ Dashboard Kas Kelas
          </h1>
          <p class="text-blue-100 text-lg">
            Overview keuangan dan statistik pembayaran
          </p>
        </div>

        <!-- Desktop report button -->
        <button
          @click="showPdfModal = true"
          class="hidden sm:flex mt-6 sm:mt-0 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 items-center border border-white/30 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          title="Dashboard Report Options"
        >
          <DocumentArrowDownIcon class="w-5 h-5 mr-2" />
          Laporan Dashboard
        </button>

        <!-- Mobile flip report button -->
        <div class="sm:hidden mt-4">
          <button
            @click="showMobileDownload = !showMobileDownload"
            class="w-full bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white font-semibold py-2 px-4 rounded-xl transition-all duration-300 flex items-center justify-center border border-white/30 shadow-lg"
            title="Toggle Report Options"
          >
            <DocumentArrowDownIcon class="w-4 h-4 mr-2" />
            <span class="text-sm">Laporan</span>
            <svg
              :class="['w-4 h-4 ml-2 transition-transform duration-300', showMobileDownload ? 'rotate-180' : '']"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <!-- Mobile report content -->
          <div
            :class="['overflow-hidden transition-all duration-300', showMobileDownload ? 'max-h-20 mt-2' : 'max-h-0']"
          >
            <button
              @click="showPdfModal = true"
              class="w-full bg-white/30 backdrop-blur-sm hover:bg-white/40 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 flex items-center justify-center text-sm border border-white/40"
              title="Dashboard Report Options"
            >
              <DocumentArrowDownIcon class="w-4 h-4 mr-2" />
              Pilih Aksi Laporan
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Statistics Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div class="card p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
        <div class="flex items-center">
          <div class="p-3 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl shadow-lg">
            <BanknotesIcon class="w-7 h-7 text-white" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-green-700">💰 Total Pemasukan</p>
            <p class="text-2xl font-bold text-green-800">
              {{ formatCurrency(store.totalIncome) }}
            </p>
          </div>
        </div>
      </div>

      <div class="card p-6 bg-gradient-to-br from-red-50 to-rose-50 border-red-200">
        <div class="flex items-center">
          <div class="p-3 bg-gradient-to-br from-red-500 to-rose-500 rounded-xl shadow-lg">
            <ReceiptPercentIcon class="w-7 h-7 text-white" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-red-700">📄 Total Pengeluaran</p>
            <p class="text-2xl font-bold text-red-800">
              {{ formatCurrency(store.totalExpenses) }}
            </p>
          </div>
        </div>
      </div>

      <div class="card p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
        <div class="flex items-center">
          <div class="p-3 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl shadow-lg">
            <CreditCardIcon class="w-7 h-7 text-white" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-blue-700">💳 Saldo Saat Ini</p>
            <p class="text-2xl font-bold text-blue-800">
              {{ formatCurrency(store.currentBalance) }}
            </p>
          </div>
        </div>
      </div>

      <div class="card p-6 bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200">
        <div class="flex items-center">
          <div class="p-3 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl shadow-lg">
            <UsersIcon class="w-7 h-7 text-white" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-orange-700">👥 Total Siswa</p>
            <p class="text-2xl font-bold text-orange-800">
              {{ store.students.length }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Payment Status -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="card p-6 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
        <h3 class="text-xl font-bold text-gray-800 mb-6 flex items-center">
          <span class="text-2xl mr-2">📊</span>
          Status Pembayaran Siswa
        </h3>
        <div class="space-y-4">
          <div class="flex items-center justify-between p-4 bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl border border-green-200 shadow-sm">
            <div class="flex items-center">
              <div class="w-4 h-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full shadow-md"></div>
              <span class="ml-3 text-sm font-semibold text-green-800">✅ Sudah Bayar</span>
            </div>
            <span class="text-lg font-bold text-green-700 bg-green-200 px-3 py-1 rounded-full">
              {{ store.studentsByPaymentStatus.paid.length }} siswa
            </span>
          </div>
          <div class="flex items-center justify-between p-4 bg-gradient-to-r from-red-100 to-rose-100 rounded-xl border border-red-200 shadow-sm">
            <div class="flex items-center">
              <div class="w-4 h-4 bg-gradient-to-r from-red-500 to-rose-500 rounded-full shadow-md"></div>
              <span class="ml-3 text-sm font-semibold text-red-800">❌ Belum Bayar</span>
            </div>
            <span class="text-lg font-bold text-red-700 bg-red-200 px-3 py-1 rounded-full">
              {{ store.studentsByPaymentStatus.unpaid.length }} siswa
            </span>
          </div>
        </div>
      </div>

      <div class="card p-6 bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
        <h3 class="text-xl font-bold text-gray-800 mb-6 flex items-center">
          <span class="text-2xl mr-2">⏳</span>
          Link Pembayaran Pending
        </h3>
        <div class="space-y-3">
          <div
            v-for="payment in store.pendingPayments.slice(0, 5)"
            :key="payment.id"
            class="flex items-center justify-between p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-orange-200 shadow-sm hover:shadow-md transition-all duration-300"
          >
            <div>
              <p class="text-sm font-semibold text-gray-800">{{ payment.student?.name }}</p>
              <p class="text-xs text-orange-600 font-medium">{{ formatCurrency(payment.amount) }}</p>
            </div>
            <span class="text-xs bg-gradient-to-r from-yellow-400 to-orange-400 text-white font-semibold px-3 py-1 rounded-full shadow-sm">
              Pending
            </span>
          </div>
          <div v-if="store.pendingPayments.length === 0" class="text-center py-8">
            <div class="text-4xl mb-2">🎉</div>
            <p class="text-sm text-gray-600 font-medium">Tidak ada pembayaran pending</p>
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

const downloadDashboardPDF = async () => {
  try {
    const pdfContent = generateDashboardPDFContent()
    const timestamp = new Date().toLocaleDateString('id-ID').replace(/\//g, '_')
    const fileName = `Dashboard_Kas_Kelas_${timestamp}.html`

    // Create complete HTML content
    const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Dashboard Report - ${new Date().toLocaleDateString('id-ID')}</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.5; }
    h1 { color: #1f2937; border-bottom: 3px solid #3b82f6; padding-bottom: 15px; }
    h2 { color: #374151; margin-top: 30px; border-left: 4px solid #3b82f6; padding-left: 10px; }
    .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 15px; margin: 20px 0; }
    .stat-card { border: 1px solid #d1d5db; padding: 15px; border-radius: 8px; background-color: #f9fafb; }
    .stat-value { font-size: 24px; font-weight: bold; color: #1f2937; }
    .stat-label { color: #6b7280; font-size: 14px; margin-bottom: 5px; }
    table { width: 100%; border-collapse: collapse; margin: 20px 0; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
    th, td { border: 1px solid #d1d5db; padding: 10px; text-align: left; font-size: 12px; }
    th { background-color: #f3f4f6; font-weight: bold; }
    .income { color: #059669; font-weight: bold; }
    .expense { color: #dc2626; font-weight: bold; }
    .footer { margin-top: 30px; text-align: center; color: #6b7280; font-size: 12px; border-top: 1px solid #d1d5db; padding-top: 15px; }
    tr:nth-child(even) { background-color: #f9fafb; }
    .mobile-info { background-color: #ecfdf5; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981; }
    @media print { .mobile-info { display: none; } }
    @media (max-width: 768px) {
      .stats-grid { grid-template-columns: 1fr; }
      table { font-size: 10px; }
      th, td { padding: 6px; }
    }
  </style>
</head>
<body>
  <div class="mobile-info">
    <h3 style="color: #065f46; margin: 0 0 10px 0;">📱 Panduan Download:</h3>
    <ul style="margin: 0; color: #047857; font-size: 14px;">
      <li><strong>Mobile:</strong> Menu browser (⋮) → "Simpan halaman" atau "Unduh"</li>
      <li><strong>Share:</strong> Gunakan tombol share browser untuk kirim via WhatsApp</li>
      <li><strong>Print:</strong> Menu browser → "Cetak" → "Simpan sebagai PDF"</li>
    </ul>
  </div>
  ${pdfContent}
  <div class="footer">Generated on ${new Date().toLocaleString('id-ID')} | Dashboard Kas Kelas</div>
</body>
</html>`

    // Detect mobile device
    const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)

    if (isMobile) {
      // Mobile: Open in new tab with instructions
      const newWindow = window.open('', '_blank')
      if (newWindow) {
        newWindow.document.write(htmlContent)
        newWindow.document.close()
        toast.success('📱 Laporan terbuka di tab baru. Gunakan menu browser (⋮) untuk download!', { timeout: 6000 })
      } else {
        // Fallback: Create blob and download link
        createDownloadLink(htmlContent, fileName)
      }
    } else {
      // Desktop: Create download link AND open preview
      createDownloadLink(htmlContent, fileName)

      // Open preview in new tab
      setTimeout(() => {
        const previewWindow = window.open('', '_blank')
        if (previewWindow) {
          previewWindow.document.write(htmlContent)
          previewWindow.document.close()
        }
      }, 300)
    }

    console.log('✅ Dashboard PDF Report generated successfully')

  } catch (error) {
    console.error('Error generating Dashboard PDF:', error)
    toast.error('Gagal membuat PDF report dashboard')
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
