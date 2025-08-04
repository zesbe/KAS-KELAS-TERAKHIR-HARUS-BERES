<template>
  <div class="space-y-6">
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
    <div class="card p-6">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold text-gray-900">Transaksi Terbaru</h3>
        <router-link 
          to="/transactions" 
          class="text-sm text-primary-600 hover:text-primary-500"
        >
          Lihat Semua
        </router-link>
      </div>
      
      <div class="overflow-x-auto">
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
        
        <div v-if="store.recentTransactions.length === 0" class="text-center py-8">
          <p class="text-sm text-gray-500">Belum ada transaksi</p>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="card p-6">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">Aksi Cepat</h3>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <router-link 
          to="/payments" 
          class="flex flex-col items-center p-4 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors"
        >
          <CreditCardIcon class="w-8 h-8 text-primary-600 mb-2" />
          <span class="text-sm font-medium text-primary-900">Buat Link Bayar</span>
        </router-link>
        
        <router-link 
          to="/campaigns" 
          class="flex flex-col items-center p-4 bg-success-50 rounded-lg hover:bg-success-100 transition-colors"
        >
          <SpeakerWaveIcon class="w-8 h-8 text-success-600 mb-2" />
          <span class="text-sm font-medium text-success-900">Kirim Pesan</span>
        </router-link>
        
        <router-link 
          to="/expenses" 
          class="flex flex-col items-center p-4 bg-warning-50 rounded-lg hover:bg-warning-100 transition-colors"
        >
          <ReceiptPercentIcon class="w-8 h-8 text-warning-600 mb-2" />
          <span class="text-sm font-medium text-warning-900">Catat Pengeluaran</span>
        </router-link>
        
        <router-link 
          to="/reports" 
          class="flex flex-col items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
        >
          <DocumentChartBarIcon class="w-8 h-8 text-purple-600 mb-2" />
          <span class="text-sm font-medium text-purple-900">Lihat Laporan</span>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAppStore } from '@/stores'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'
import {
  BanknotesIcon,
  ReceiptPercentIcon,
  CreditCardIcon,
  UsersIcon,
  SpeakerWaveIcon,
  DocumentChartBarIcon
} from '@heroicons/vue/24/outline'

const store = useAppStore()

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
</script>
