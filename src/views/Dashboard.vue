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
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Dashboard Kas Kelas</h1>
        <p class="mt-1 text-sm text-gray-500">
          Overview keuangan dan statistik pembayaran
        </p>
      </div>
      <!-- Download Options Dropdown -->
      <div class="relative mt-4 sm:mt-0">
        <button
          @click="showDownloadOptions = !showDownloadOptions"
          class="btn-primary flex items-center w-full sm:w-auto"
          :class="{ 'rounded-b-none': showDownloadOptions }"
        >
          <DocumentArrowDownIcon class="w-4 h-4 mr-2" />
          <span class="hidden sm:inline">Download PDF Report</span>
          <span class="sm:hidden">Download PDF</span>
          <ChevronDownIcon class="w-4 h-4 ml-2 transition-transform duration-200" :class="{ 'rotate-180': showDownloadOptions }" />
        </button>
        
        <!-- Dropdown Options -->
        <div 
          v-if="showDownloadOptions"
          class="absolute right-0 top-full z-50 w-full sm:w-64 bg-white border border-gray-200 rounded-b-lg shadow-lg"
          @click.stop
        >
          <!-- Mobile-friendly options -->
          <div class="p-2 space-y-1">
            <!-- Quick Print Option -->
            <button
              @click="quickPrintDashboard"
              class="w-full flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
            >
              <PrinterIcon class="w-4 h-4 mr-3 text-blue-600" />
              <div class="text-left">
                <div class="font-medium">📱 Print Langsung</div>
                <div class="text-xs text-gray-500">Buka dialog print browser</div>
              </div>
            </button>
            
            <!-- View PDF Option -->
            <button
              @click="viewDashboardPDF"
              class="w-full flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
            >
              <EyeIcon class="w-4 h-4 mr-3 text-green-600" />
              <div class="text-left">
                <div class="font-medium">👁️ Lihat PDF</div>
                <div class="text-xs text-gray-500">Buka di tab baru untuk save/share</div>
              </div>
            </button>
            
            <!-- Download HTML Option -->
            <button
              @click="downloadDashboardHTML"
              class="w-full flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
            >
              <ArrowDownTrayIcon class="w-4 h-4 mr-3 text-purple-600" />
              <div class="text-left">
                <div class="font-medium">💾 Download HTML</div>
                <div class="text-xs text-gray-500">File HTML yang bisa dibuka offline</div>
              </div>
            </button>
            
            <!-- Share Option -->
            <button
              @click="shareDashboard"
              class="w-full flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
            >
              <ShareIcon class="w-4 h-4 mr-3 text-orange-600" />
              <div class="text-left">
                <div class="font-medium">📤 Share</div>
                <div class="text-xs text-gray-500">Bagikan via WhatsApp/apps lain</div>
              </div>
            </button>
          </div>
          
          <!-- Close button for mobile -->
          <div class="border-t border-gray-200 p-2">
            <button
              @click="showDownloadOptions = false"
              class="w-full px-3 py-2 text-sm text-gray-500 hover:bg-gray-100 rounded-md transition-colors"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Statistics Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div class="card p-6">
        <div class="flex items-center">
          <div class="p-2 bg-success-100 rounded-lg">
            <BanknotesIcon class="w-6 h-6 text-success-600" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Total Pemasukan</p>
            <p class="text-2xl font-semibold text-gray-900">
              {{ formatCurrency(store.totalIncome) }}
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
              {{ formatCurrency(store.totalExpenses) }}
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
            <p class="text-sm font-medium text-gray-600">Saldo Saat Ini</p>
            <p class="text-2xl font-semibold text-gray-900">
              {{ formatCurrency(store.currentBalance) }}
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
            <p class="text-sm font-medium text-gray-600">Total Siswa</p>
            <p class="text-2xl font-semibold text-gray-900">
              {{ store.students.length }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Payment Status -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="card p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Status Pembayaran Siswa</h3>
        <div class="space-y-4">
          <div class="flex items-center justify-between p-3 bg-success-50 rounded-lg">
            <div class="flex items-center">
              <div class="w-3 h-3 bg-success-500 rounded-full"></div>
              <span class="ml-3 text-sm font-medium text-success-900">Sudah Bayar</span>
            </div>
            <span class="text-sm font-semibold text-success-700">
              {{ store.studentsByPaymentStatus.paid.length }} siswa
            </span>
          </div>
          <div class="flex items-center justify-between p-3 bg-red-50 rounded-lg">
            <div class="flex items-center">
              <div class="w-3 h-3 bg-red-500 rounded-full"></div>
              <span class="ml-3 text-sm font-medium text-red-900">Belum Bayar</span>
            </div>
            <span class="text-sm font-semibold text-red-700">
              {{ store.studentsByPaymentStatus.unpaid.length }} siswa
            </span>
          </div>
        </div>
      </div>

      <div class="card p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Link Pembayaran Pending</h3>
        <div class="space-y-3">
          <div 
            v-for="payment in store.pendingPayments.slice(0, 5)" 
            :key="payment.id"
            class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
          >
            <div>
              <p class="text-sm font-medium text-gray-900">{{ payment.student?.name }}</p>
              <p class="text-xs text-gray-500">{{ formatCurrency(payment.amount) }}</p>
            </div>
            <span class="text-xs bg-warning-100 text-warning-800 px-2 py-1 rounded-full">
              Pending
            </span>
          </div>
          <div v-if="store.pendingPayments.length === 0" class="text-center py-4">
            <p class="text-sm text-gray-500">Tidak ada pembayaran pending</p>
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

    <!-- Quick Payment Actions -->
    <div class="card p-4 sm:p-6">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold text-gray-900">💳 Pembayaran Cepat</h3>
        <button
          @click="showQuickPaymentModal = true"
          class="btn-primary text-sm"
        >
          <PlusIcon class="w-4 h-4 mr-2" />
          Buat Link Pembayaran
        </button>
      </div>

      <!-- Quick Payment Options -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <!-- Multi-Month Templates -->
        <div class="bg-blue-50 rounded-lg p-4">
          <h4 class="font-semibold text-blue-900 mb-3">🗓️ Kas Bulanan</h4>
          <div class="space-y-2">
            <button
              @click="createMultiMonthPayment(3)"
              class="w-full btn-outline text-sm py-2"
            >
              3 Bulan - {{ formatCurrency(150000) }}
            </button>
            <button
              @click="createMultiMonthPayment(6)"
              class="w-full btn-outline text-sm py-2"
            >
              6 Bulan - {{ formatCurrency(300000) }}
            </button>
            <button
              @click="createMultiMonthPayment(12)"
              class="w-full btn-outline text-sm py-2"
            >
              12 Bulan - {{ formatCurrency(600000) }}
            </button>
          </div>
        </div>

        <!-- Custom Payment Templates -->
        <div class="bg-green-50 rounded-lg p-4">
          <h4 class="font-semibold text-green-900 mb-3">🎯 Template Khusus</h4>
          <div class="space-y-2">
            <button
              @click="createCustomPayment('disaster', 'Iuran Bencana Alam', 25000)"
              class="w-full btn-outline text-sm py-2"
            >
              Iuran Bencana - {{ formatCurrency(25000) }}
            </button>
            <button
              @click="createCustomPayment('event', 'Iuran Acara Kelas', 30000)"
              class="w-full btn-outline text-sm py-2"
            >
              Acara Kelas - {{ formatCurrency(30000) }}
            </button>
            <button
              @click="createCustomPayment('equipment', 'Perlengkapan Kelas', 40000)"
              class="w-full btn-outline text-sm py-2"
            >
              Perlengkapan - {{ formatCurrency(40000) }}
            </button>
          </div>
        </div>

        <!-- Quick Mark as Paid -->
        <div class="bg-yellow-50 rounded-lg p-4">
          <h4 class="font-semibold text-yellow-900 mb-3">✅ Tandai Lunas</h4>
          <div class="space-y-2">
            <select v-model="quickMarkStudent" class="input-field text-sm">
              <option value="">Pilih Siswa...</option>
              <option v-for="student in store.students" :key="student.id" :value="student.id">
                {{ student.name }} ({{ student.nickname }})
              </option>
            </select>
            <select v-model="quickMarkMonth" class="input-field text-sm">
              <option value="">Pilih Bulan...</option>
              <option v-for="month in availableMonths" :key="month.value" :value="month.value">
                {{ month.label }}
              </option>
            </select>
            <button
              @click="quickMarkAsPaid"
              :disabled="!quickMarkStudent || !quickMarkMonth"
              class="w-full btn-success text-sm py-2"
              :class="{ 'opacity-50 cursor-not-allowed': !quickMarkStudent || !quickMarkMonth }"
            >
              Tandai Sudah Bayar
            </button>
          </div>
        </div>
      </div>

      <!-- Recent Unpaid Students -->
      <div class="border-t pt-4">
        <h4 class="font-medium text-gray-900 mb-3">👥 Siswa Belum Bayar Bulan Ini</h4>
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
          <button
            v-for="student in unpaidStudentsThisMonth.slice(0, 8)"
            :key="student.id"
            @click="quickMarkStudentPaid(student)"
            class="flex items-center p-2 bg-red-50 rounded-lg hover:bg-red-100 transition-colors text-left"
          >
            <div class="w-8 h-8 bg-red-200 rounded-full flex items-center justify-center mr-2">
              <span class="text-red-700 font-semibold text-xs">
                {{ student.nickname?.charAt(0)?.toUpperCase() }}
              </span>
            </div>
            <div class="flex-1 min-w-0">
              <div class="text-sm font-medium text-red-900 truncate">{{ student.name }}</div>
              <div class="text-xs text-red-600">Belum bayar</div>
            </div>
          </button>
        </div>
        <div v-if="unpaidStudentsThisMonth.length > 8" class="text-center mt-2">
          <span class="text-sm text-gray-500">
            dan {{ unpaidStudentsThisMonth.length - 8 }} siswa lainnya
          </span>
        </div>
      </div>
    </div>

    <!-- Monthly Payment Tracking -->
    <MonthlyPaymentTracker />

    <!-- Quick Actions -->
    <div class="card p-4 sm:p-6">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">Aksi Cepat</h3>
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <router-link
          to="/payments"
          class="flex flex-col items-center p-3 sm:p-4 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors"
        >
          <CreditCardIcon class="w-6 h-6 sm:w-8 sm:h-8 text-primary-600 mb-2" />
          <span class="text-xs sm:text-sm font-medium text-primary-900">Link Pembayaran</span>
        </router-link>

        <router-link
          to="/students"
          class="flex flex-col items-center p-3 sm:p-4 bg-success-50 rounded-lg hover:bg-success-100 transition-colors"
        >
          <UsersIcon class="w-6 h-6 sm:w-8 sm:h-8 text-success-600 mb-2" />
          <span class="text-xs sm:text-sm font-medium text-success-900">Data Siswa</span>
        </router-link>

        <router-link
          to="/expenses"
          class="flex flex-col items-center p-3 sm:p-4 bg-warning-50 rounded-lg hover:bg-warning-100 transition-colors"
        >
          <BanknotesIcon class="w-6 h-6 sm:w-8 sm:h-8 text-warning-600 mb-2" />
          <span class="text-xs sm:text-sm font-medium text-warning-900">Pengeluaran</span>
        </router-link>

        <router-link
          to="/reports"
          class="flex flex-col items-center p-3 sm:p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
        >
          <ChartBarIcon class="w-6 h-6 sm:w-8 sm:h-8 text-purple-600 mb-2" />
          <span class="text-xs sm:text-sm font-medium text-purple-900">Laporan</span>
        </router-link>
      </div>
    </div>

    <!-- Quick Payment Modal -->
    <div
      v-if="showQuickPaymentModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <div class="bg-white rounded-lg max-w-4xl w-full mx-4 p-6 max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-xl font-semibold text-gray-900">🚀 Buat Link Pembayaran</h3>
          <button
            @click="showQuickPaymentModal = false"
            class="text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon class="w-6 h-6" />
          </button>
        </div>

        <!-- Payment Type Selection -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <!-- Monthly Payment -->
          <div class="border-2 border-blue-200 rounded-lg p-4 bg-blue-50">
            <div class="flex items-center mb-3">
              <div class="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center mr-3">
                <CalendarIcon class="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 class="font-semibold text-blue-900">Kas Bulanan</h4>
                <p class="text-sm text-blue-600">Rp 50.000/bulan</p>
              </div>
            </div>
            <div class="space-y-2">
              <button
                @click="openPaymentForm('monthly', 3, 150000)"
                class="w-full btn-outline text-sm py-2 border-blue-300 text-blue-700 hover:bg-blue-100"
              >
                3 Bulan - {{ formatCurrency(150000) }}
              </button>
              <button
                @click="openPaymentForm('monthly', 6, 300000)"
                class="w-full btn-outline text-sm py-2 border-blue-300 text-blue-700 hover:bg-blue-100"
              >
                6 Bulan - {{ formatCurrency(300000) }}
              </button>
              <button
                @click="openPaymentForm('monthly', 12, 600000)"
                class="w-full btn-outline text-sm py-2 border-blue-300 text-blue-700 hover:bg-blue-100"
              >
                12 Bulan - {{ formatCurrency(600000) }}
              </button>
            </div>
          </div>

          <!-- Emergency Fund -->
          <div class="border-2 border-red-200 rounded-lg p-4 bg-red-50">
            <div class="flex items-center mb-3">
              <div class="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center mr-3">
                <ExclamationTriangleIcon class="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 class="font-semibold text-red-900">Iuran Darurat</h4>
                <p class="text-sm text-red-600">Untuk keperluan mendesak</p>
              </div>
            </div>
            <div class="space-y-2">
              <button
                @click="openPaymentForm('emergency', 1, 25000, 'Iuran Bencana Alam')"
                class="w-full btn-outline text-sm py-2 border-red-300 text-red-700 hover:bg-red-100"
              >
                Bencana Alam - {{ formatCurrency(25000) }}
              </button>
              <button
                @click="openPaymentForm('emergency', 1, 30000, 'Bantuan Siswa Sakit')"
                class="w-full btn-outline text-sm py-2 border-red-300 text-red-700 hover:bg-red-100"
              >
                Bantuan Sakit - {{ formatCurrency(30000) }}
              </button>
              <button
                @click="openPaymentForm('emergency', 1, 20000, 'Dana Darurat Kelas')"
                class="w-full btn-outline text-sm py-2 border-red-300 text-red-700 hover:bg-red-100"
              >
                Dana Darurat - {{ formatCurrency(20000) }}
              </button>
            </div>
          </div>

          <!-- Event Fund -->
          <div class="border-2 border-green-200 rounded-lg p-4 bg-green-50">
            <div class="flex items-center mb-3">
              <div class="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center mr-3">
                <GiftIcon class="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 class="font-semibold text-green-900">Acara & Kegiatan</h4>
                <p class="text-sm text-green-600">Event kelas & sekolah</p>
              </div>
            </div>
            <div class="space-y-2">
              <button
                @click="openPaymentForm('event', 1, 50000, 'Acara Perpisahan Kelas')"
                class="w-full btn-outline text-sm py-2 border-green-300 text-green-700 hover:bg-green-100"
              >
                Perpisahan - {{ formatCurrency(50000) }}
              </button>
              <button
                @click="openPaymentForm('event', 1, 35000, 'Perayaan Hari Guru')"
                class="w-full btn-outline text-sm py-2 border-green-300 text-green-700 hover:bg-green-100"
              >
                Hari Guru - {{ formatCurrency(35000) }}
              </button>
              <button
                @click="openPaymentForm('event', 1, 40000, 'Field Trip Kelas')"
                class="w-full btn-outline text-sm py-2 border-green-300 text-green-700 hover:bg-green-100"
              >
                Field Trip - {{ formatCurrency(40000) }}
              </button>
            </div>
          </div>

          <!-- Equipment Fund -->
          <div class="border-2 border-purple-200 rounded-lg p-4 bg-purple-50">
            <div class="flex items-center mb-3">
              <div class="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center mr-3">
                <CogIcon class="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 class="font-semibold text-purple-900">Perlengkapan</h4>
                <p class="text-sm text-purple-600">Fasilitas & alat kelas</p>
              </div>
            </div>
            <div class="space-y-2">
              <button
                @click="openPaymentForm('equipment', 1, 45000, 'Perlengkapan Kebersihan')"
                class="w-full btn-outline text-sm py-2 border-purple-300 text-purple-700 hover:bg-purple-100"
              >
                Kebersihan - {{ formatCurrency(45000) }}
              </button>
              <button
                @click="openPaymentForm('equipment', 1, 60000, 'Alat Tulis Kelas')"
                class="w-full btn-outline text-sm py-2 border-purple-300 text-purple-700 hover:bg-purple-100"
              >
                Alat Tulis - {{ formatCurrency(60000) }}
              </button>
              <button
                @click="openPaymentForm('equipment', 1, 35000, 'Dekorasi Kelas')"
                class="w-full btn-outline text-sm py-2 border-purple-300 text-purple-700 hover:bg-purple-100"
              >
                Dekorasi - {{ formatCurrency(35000) }}
              </button>
            </div>
          </div>

          <!-- Custom Payment -->
          <div class="border-2 border-gray-200 rounded-lg p-4 bg-gray-50">
            <div class="flex items-center mb-3">
              <div class="w-10 h-10 bg-gray-500 rounded-lg flex items-center justify-center mr-3">
                <PencilIcon class="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 class="font-semibold text-gray-900">Custom</h4>
                <p class="text-sm text-gray-600">Buat sendiri</p>
              </div>
            </div>
            <button
              @click="openPaymentForm('custom', 1, 0, '')"
              class="w-full btn-outline text-sm py-2 border-gray-300 text-gray-700 hover:bg-gray-100"
            >
              Buat Custom
            </button>
          </div>
        </div>

        <!-- Payment Form -->
        <div v-if="showPaymentForm" class="border-t pt-6">
          <h4 class="text-lg font-semibold text-gray-900 mb-4">📝 Detail Pembayaran</h4>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Jenis Pembayaran</label>
                <input
                  v-model="paymentForm.type"
                  type="text"
                  readonly
                  class="input-field bg-gray-100"
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Keterangan</label>
                <input
                  v-model="paymentForm.description"
                  type="text"
                  class="input-field"
                  placeholder="Masukkan keterangan pembayaran"
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Jumlah (IDR)</label>
                <input
                  v-model.number="paymentForm.amount"
                  type="number"
                  min="1000"
                  class="input-field"
                  placeholder="50000"
                />
              </div>
            </div>
            
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Target Siswa</label>
                <select v-model="paymentForm.target" class="input-field">
                  <option value="all">Semua Siswa</option>
                  <option value="unpaid">Siswa Belum Bayar</option>
                  <option value="selected">Pilih Manual</option>
                </select>
              </div>
              
              <div v-if="paymentForm.type === 'monthly'">
                <label class="block text-sm font-medium text-gray-700 mb-2">Durasi (Bulan)</label>
                <input
                  v-model.number="paymentForm.months"
                  type="number"
                  min="1"
                  max="12"
                  class="input-field"
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Catatan (Opsional)</label>
                <textarea
                  v-model="paymentForm.notes"
                  rows="3"
                  class="input-field"
                  placeholder="Catatan tambahan untuk pembayaran ini"
                ></textarea>
              </div>
            </div>
          </div>

          <!-- Student Selection -->
          <div v-if="paymentForm.target === 'selected'" class="mt-6">
            <label class="block text-sm font-medium text-gray-700 mb-2">Pilih Siswa</label>
            <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 max-h-48 overflow-y-auto">
              <label
                v-for="student in store.students"
                :key="student.id"
                class="flex items-center space-x-2 p-2 border rounded-lg hover:bg-gray-50"
              >
                <input
                  type="checkbox"
                  :value="student.id"
                  v-model="paymentForm.selectedStudents"
                  class="rounded"
                />
                <span class="text-sm">{{ student.name }} ({{ student.nickname }})</span>
              </label>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex justify-between mt-6 pt-4 border-t">
            <button
              @click="resetPaymentForm"
              class="btn-secondary"
            >
              Reset
            </button>
            <button
              @click="createPaymentLinks"
              :disabled="!paymentForm.description || !paymentForm.amount"
              class="btn-primary"
              :class="{ 'opacity-50 cursor-not-allowed': !paymentForm.description || !paymentForm.amount }"
            >
              Buat Link Pembayaran
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useAppStore } from '@/stores'
import { useToast } from 'vue-toastification'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'
import MonthlyPaymentTracker from '@/components/MonthlyPaymentTracker.vue'
import { runDatabaseDiagnostics, generateSetupRecommendation } from '@/utils/databaseDiagnostics'
import {
  BanknotesIcon,
  ReceiptPercentIcon,
  CreditCardIcon,
  UsersIcon,
  SpeakerWaveIcon,
  DocumentChartBarIcon,
  ExclamationTriangleIcon,
  DocumentArrowDownIcon,
  ChevronDownIcon,
  PrinterIcon,
  EyeIcon,
  ArrowDownTrayIcon,
  ShareIcon,
  PlusIcon,
  CalendarIcon,
  GiftIcon,
  CogIcon,
  PencilIcon,
  ChartBarIcon,
  XMarkIcon
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

// Download options dropdown
const showDownloadOptions = ref(false)

// Quick Payment Modal
const showQuickPaymentModal = ref(false)
const quickMarkStudent = ref('')
const quickMarkMonth = ref('')
const quickMarkAmount = ref(0)
const quickMarkDuration = ref(0)

// Quick Payment Form Modal
const showPaymentForm = ref(false)
const paymentForm = ref({
  type: '',
  description: '',
  amount: 0,
  target: 'all',
  months: 0,
  notes: '',
  selectedStudents: []
})

// Available months for payment marking (last 6 months + next 6 months)
const availableMonths = computed(() => {
  const months = []
  const now = new Date()
  
  // Add past 6 months
  for (let i = 6; i >= 1; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
    months.push({
      value: date.toISOString().slice(0, 7),
      label: `${date.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })} (${i} bulan lalu)`
    })
  }
  
  // Add current month
  months.push({
    value: now.toISOString().slice(0, 7),
    label: `${now.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })} (Bulan ini)`
  })
  
  // Add next 6 months
  for (let i = 1; i <= 6; i++) {
    const date = new Date(now.getFullYear(), now.getMonth() + i, 1)
    months.push({
      value: date.toISOString().slice(0, 7),
      label: `${date.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })} (${i} bulan ke depan)`
    })
  }
  
  return months
})

// Get unpaid students for a specific month (default current month)
const getUnpaidStudentsForMonth = (targetMonth = null) => {
  const monthCode = targetMonth || new Date().toISOString().slice(0, 7)
  
  return store.students.filter(student => {
    // Check if student has paid for the target month
    const hasPaidForMonth = store.transactions.some(t => {
      const paymentMonth = t.month || new Date(t.created_at).toISOString().slice(0, 7)
      return t.student_id === student.id && 
             t.type === 'income' && 
             t.status === 'completed' && 
             paymentMonth === monthCode
    })
    
    return !hasPaidForMonth
  })
}

// Get unpaid students for the current month (for display)
const unpaidStudentsThisMonth = computed(() => {
  return getUnpaidStudentsForMonth()
})

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

    const printWindow = window.open('', '_blank')
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Dashboard Report - ${new Date().toLocaleDateString('id-ID')}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { color: #1f2937; border-bottom: 2px solid #3b82f6; padding-bottom: 10px; }
            h2 { color: #374151; margin-top: 20px; }
            .stats-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin: 20px 0; }
            .stat-card { border: 1px solid #d1d5db; padding: 15px; border-radius: 8px; }
            .stat-value { font-size: 24px; font-weight: bold; color: #1f2937; }
            .stat-label { color: #6b7280; font-size: 14px; margin-bottom: 5px; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th, td { border: 1px solid #d1d5db; padding: 8px; text-align: left; }
            th { background-color: #f3f4f6; font-weight: bold; }
            .income { color: #059669; }
            .expense { color: #dc2626; }
            .footer { margin-top: 30px; text-align: center; color: #6b7280; font-size: 12px; }
          </style>
        </head>
        <body>
          ${pdfContent}
          <div class="footer">
            Generated on ${new Date().toLocaleString('id-ID')} | Dashboard Kas Kelas
          </div>
        </body>
        </html>
      `)
      printWindow.document.close()

      setTimeout(() => {
        printWindow.print()
      }, 500)
    }

    console.log('✅ Dashboard PDF Report generated successfully')

  } catch (error) {
    console.error('Error generating Dashboard PDF:', error)
    alert('Gagal membuat PDF report dashboard')
  }
}

// Close dropdown when clicking outside
const handleClickOutside = (event) => {
  if (!event.target.closest('.relative')) {
    showDownloadOptions.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

// Quick Print - langsung buka dialog print browser
const quickPrintDashboard = () => {
  showDownloadOptions.value = false
  
  try {
    const pdfContent = generateDashboardPDFContent()
    const printContent = generatePrintableHTML(pdfContent)
    
    const printWindow = window.open('', '_blank')
    if (printWindow) {
      printWindow.document.write(printContent)
      printWindow.document.close()
      
      printWindow.onload = () => {
        printWindow.focus()
        printWindow.print()
      }
    }
  } catch (error) {
    console.error('Error in quick print:', error)
  }
}

// View PDF - buka di tab baru untuk save/share
const viewDashboardPDF = () => {
  showDownloadOptions.value = false
  
  try {
    const pdfContent = generateDashboardPDFContent()
    const printContent = generatePrintableHTML(pdfContent)
    
    const printWindow = window.open('', '_blank')
    if (printWindow) {
      printWindow.document.write(printContent)
      printWindow.document.close()
      printWindow.document.title = `Dashboard Report - ${new Date().toLocaleDateString('id-ID')}`
    }
  } catch (error) {
    console.error('Error viewing PDF:', error)
  }
}

// Download HTML file
const downloadDashboardHTML = () => {
  showDownloadOptions.value = false
  
  try {
    const pdfContent = generateDashboardPDFContent()
    const htmlContent = generatePrintableHTML(pdfContent)
    
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `Dashboard-Report-${new Date().toISOString().split('T')[0]}.html`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    console.log('Dashboard HTML downloaded successfully')
  } catch (error) {
    console.error('Error downloading HTML:', error)
  }
}

// Share dashboard report
const shareDashboard = async () => {
  showDownloadOptions.value = false
  
  const shareData = {
    title: `Dashboard Report Kas Kelas 1B - ${new Date().toLocaleDateString('id-ID')}`,
    text: `Dashboard Report Kas Kelas 1B
    
📊 Total Pemasukan: ${formatCurrency(store.totalIncome)}
💸 Total Pengeluaran: ${formatCurrency(store.totalExpenses)}
💰 Saldo Saat Ini: ${formatCurrency(store.currentBalance)}
👥 Total Siswa: ${store.students.length}

Generated: ${new Date().toLocaleString('id-ID')}`,
    url: window.location.href
  }
  
  if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
    try {
      await navigator.share(shareData)
    } catch (error) {
      console.log('Share canceled or failed:', error)
      fallbackCopyToClipboard(shareData.text)
    }
  } else {
    fallbackCopyToClipboard(shareData.text)
  }
}

// Fallback copy to clipboard
const fallbackCopyToClipboard = async (text) => {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text)
      console.log('Report data copied to clipboard')
    } else {
      // Fallback for non-secure contexts
      const textArea = document.createElement('textarea')
      textArea.value = text
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      console.log('Report data copied to clipboard (fallback)')
    }
  } catch (error) {
    console.error('Failed to copy to clipboard:', error)
  }
}

// Generate printable HTML with better mobile styling
const generatePrintableHTML = (content) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Dashboard Report - ${new Date().toLocaleDateString('id-ID')}</title>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.4;
          color: #333;
          background: white;
          margin: 20px;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
        h1 { 
          color: #1f2937; 
          border-bottom: 2px solid #3b82f6; 
          padding-bottom: 10px;
          margin-bottom: 20px;
        }
        h2 { 
          color: #374151; 
          margin-top: 20px;
          margin-bottom: 10px;
        }
        .stats-grid { 
          display: grid; 
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); 
          gap: 15px; 
          margin: 20px 0; 
        }
        .stat-card { 
          border: 1px solid #d1d5db; 
          padding: 15px; 
          border-radius: 8px;
          background: #f9fafb;
        }
        .stat-value { 
          font-size: 18px; 
          font-weight: bold; 
          color: #1f2937; 
          margin-top: 5px;
        }
        .stat-label { 
          color: #6b7280; 
          font-size: 12px; 
          margin-bottom: 5px; 
        }
        table { 
          width: 100%; 
          border-collapse: collapse; 
          margin: 20px 0; 
          font-size: 12px;
        }
        th, td { 
          border: 1px solid #d1d5db; 
          padding: 6px; 
          text-align: left; 
        }
        th { 
          background-color: #f3f4f6; 
          font-weight: bold; 
        }
        .income { color: #059669; font-weight: bold; }
        .expense { color: #dc2626; font-weight: bold; }
        .footer { 
          margin-top: 30px; 
          text-align: center; 
          color: #6b7280; 
          font-size: 10px;
          border-top: 1px solid #e5e7eb;
          padding-top: 20px;
        }
        
        @media print {
          body { margin: 10px; }
          .stats-grid { grid-template-columns: repeat(2, 1fr); }
          table { font-size: 10px; }
          th, td { padding: 4px; }
        }
        
        @media (max-width: 600px) {
          .stats-grid { grid-template-columns: 1fr; }
          table { font-size: 10px; }
          th, td { padding: 4px; }
        }
      </style>
    </head>
    <body>
      ${content}
      <div class="footer">
        Generated on ${new Date().toLocaleString('id-ID')} | Dashboard Report Kas Kelas 1B SD Islam Al Husna
      </div>
    </body>
    </html>
  `
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

// Quick Mark as Paid
const quickMarkAsPaid = async () => {
  if (!quickMarkStudent.value || !quickMarkMonth.value) return

  const amount = prompt('Masukkan jumlah pembayaran (IDR):', '50000')
  if (!amount || amount === '') return

  try {
    const result = await store.markPaymentAsPaid(quickMarkStudent.value, parseInt(amount), quickMarkMonth.value)
    quickMarkStudent.value = ''
    quickMarkMonth.value = ''
    toast.success(`✅ ${result.student} berhasil ditandai sudah bayar untuk ${result.month}!`)
  } catch (error) {
    console.error('Error marking payment as paid:', error)
    toast.error('Gagal menandai pembayaran: ' + error.message)
  }
}

// Create multi-month payment link
const createMultiMonthPayment = async (months) => {
  const totalAmount = months * 50000 // 50k per month
  
  if (!confirm(`Buat link pembayaran ${months} bulan (${formatCurrency(totalAmount)}) untuk siswa yang belum bayar?`)) {
    return
  }

  try {
    // Only target unpaid students
    const unpaidStudents = getUnpaidStudentsForMonth()
    const studentIds = unpaidStudents.map(s => s.id)
    
    if (studentIds.length === 0) {
      toast.info('📋 Semua siswa sudah membayar bulan ini!')
      return
    }
    
    const results = await store.createMultiMonthPayment(studentIds, totalAmount, months)
    
    const successful = results.filter(r => r.success).length
    const skipped = results.filter(r => r.skipped).length
    const failed = results.filter(r => !r.success && !r.skipped).length
    
    let message = []
    if (successful > 0) message.push(`✅ ${successful} link berhasil dibuat`)
    if (skipped > 0) message.push(`⏭️ ${skipped} siswa sudah bayar`)
    if (failed > 0) message.push(`❌ ${failed} link gagal dibuat`)
    
    if (successful > 0) {
      toast.success(`🎉 Link pembayaran ${months} bulan: ${message.join(', ')}`)
    } else {
      toast.warning(`⚠️ ${message.join(', ')}`)
    }
  } catch (error) {
    console.error('Error creating multi-month payment:', error)
    toast.error('Gagal membuat link pembayaran: ' + error.message)
  }
}

// Create custom payment link
const createCustomPayment = async (type, description, amount) => {
  if (!confirm(`Buat link pembayaran "${description}" (${formatCurrency(amount)}) untuk semua siswa?`)) {
    return
  }

  try {
    const studentIds = store.students.map(s => s.id)
    const results = await store.createCustomPayment(studentIds, 1, type, description, amount)
    
    const successful = results.filter(r => r.success).length
    const skipped = results.filter(r => r.skipped).length
    const failed = results.filter(r => !r.success && !r.skipped).length
    
    let message = []
    if (successful > 0) message.push(`✅ ${successful} link berhasil dibuat`)
    if (skipped > 0) message.push(`⏭️ ${skipped} link sudah ada`)
    if (failed > 0) message.push(`❌ ${failed} link gagal dibuat`)
    
    if (successful > 0) {
      toast.success(`🎯 "${description}": ${message.join(', ')}`)
    } else {
      toast.warning(`⚠️ ${message.join(', ')}`)
    }
  } catch (error) {
    console.error('Error creating custom payment:', error)
    toast.error('Gagal membuat link pembayaran: ' + error.message)
  }
}

// Open payment form for creating custom payment links
const openPaymentForm = (type, months, amount, description = '') => {
  paymentForm.value.type = type
  paymentForm.value.months = months
  paymentForm.value.amount = amount
  paymentForm.value.description = description
  paymentForm.value.target = 'all' // Default to all students
  paymentForm.value.selectedStudents = []
  paymentForm.value.notes = ''
  showPaymentForm.value = true
}

// Reset payment form
const resetPaymentForm = () => {
  paymentForm.value = {
    type: '',
    description: '',
    amount: 0,
    target: 'all',
    months: 0,
    notes: '',
    selectedStudents: []
  }
}

// Create payment links based on form data
const createPaymentLinks = async () => {
  if (!paymentForm.value.description || paymentForm.value.amount <= 0) {
    toast.error('Keterangan dan jumlah pembayaran harus diisi.')
    return
  }

  let selectedStudentIds = []
  if (paymentForm.value.target === 'all') {
    selectedStudentIds = store.students.map(s => s.id)
  } else if (paymentForm.value.target === 'unpaid') {
    selectedStudentIds = unpaidStudentsThisMonth.value.map(s => s.id)
  } else if (paymentForm.value.target === 'selected') {
    selectedStudentIds = paymentForm.value.selectedStudents
  }

  if (selectedStudentIds.length === 0) {
    toast.error('Tidak ada siswa yang dipilih.')
    return
  }

  try {
    let results = []
    
    if (paymentForm.value.type === 'monthly') {
      results = await store.createMultiMonthPayment(selectedStudentIds, paymentForm.value.amount, paymentForm.value.months)
    } else {
      results = await store.createCustomPayment(selectedStudentIds, 1, paymentForm.value.type, paymentForm.value.description, paymentForm.value.amount)
    }
    
    const successful = results.filter(r => r.success).length
    const skipped = results.filter(r => r.skipped).length
    const failed = results.filter(r => !r.success && !r.skipped).length
    
    let message = []
    if (successful > 0) message.push(`✅ ${successful} link berhasil dibuat`)
    if (skipped > 0) message.push(`⏭️ ${skipped} siswa dilewati`)
    if (failed > 0) message.push(`❌ ${failed} link gagal dibuat`)
    
    if (successful > 0) {
      toast.success(`🚀 "${paymentForm.value.description}": ${message.join(', ')}`)
    } else {
      toast.warning(`⚠️ ${message.join(', ')}`)
    }
    
    showPaymentForm.value = false
    showQuickPaymentModal.value = false
    resetPaymentForm()
  } catch (error) {
    console.error('Error creating payment links:', error)
    toast.error('Gagal membuat link pembayaran: ' + error.message)
  }
}

// Quick mark a specific student as paid
const quickMarkStudentPaid = async (student) => {
  const currentMonth = new Date().toISOString().slice(0, 7)
  const amount = prompt(`Masukkan jumlah pembayaran untuk ${student.name} (IDR):`, '50000')
  if (!amount || amount === '') return

  try {
    const result = await store.markPaymentAsPaid(student.id, parseInt(amount), currentMonth)
    toast.success(`✅ ${result.student} berhasil ditandai sudah bayar untuk ${result.month}!`)
  } catch (error) {
    console.error('Error marking payment as paid:', error)
    toast.error('Gagal menandai pembayaran: ' + error.message)
  }
}
</script>
