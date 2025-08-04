<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-semibold text-gray-900">Laporan Keuangan</h1>
        <p class="text-sm text-gray-500 mt-1">Analisis dan laporan keuangan kas kelas</p>
      </div>
      <div class="flex space-x-3">
        <button @click="exportReport" class="btn-secondary">
          <DocumentArrowDownIcon class="w-4 h-4 mr-2" />
          Export PDF
        </button>
        <button @click="printReport" class="btn-primary">
          <PrinterIcon class="w-4 h-4 mr-2" />
          Print
        </button>
      </div>
    </div>

    <!-- Period Selector -->
    <div class="card p-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
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

    <!-- Charts -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Income vs Expenses Chart -->
      <div class="card p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Pemasukan vs Pengeluaran</h3>
        <div class="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
          <p class="text-gray-500">Chart akan ditampilkan di sini</p>
        </div>
      </div>

      <!-- Payment Methods Chart -->
      <div class="card p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Metode Pembayaran</h3>
        <div class="space-y-4">
          <div v-for="method in paymentMethods" :key="method.name" class="flex items-center justify-between">
            <div class="flex items-center">
              <div :class="['w-4 h-4 rounded-full mr-3', method.color]"></div>
              <span class="text-sm font-medium text-gray-700">{{ method.name }}</span>
            </div>
            <div class="text-right">
              <p class="text-sm font-semibold text-gray-900">{{ method.count }}</p>
              <p class="text-xs text-gray-500">{{ method.percentage }}%</p>
            </div>
          </div>
        </div>
      </div>
    </div>

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
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useAppStore } from '@/stores'
import { format, startOfMonth, endOfMonth, startOfYear, endOfYear, subMonths } from 'date-fns'
import { id } from 'date-fns/locale'
import {
  BanknotesIcon,
  ReceiptPercentIcon,
  CreditCardIcon,
  UsersIcon,
  DocumentArrowDownIcon,
  PrinterIcon
} from '@heroicons/vue/24/outline'

const store = useAppStore()

const selectedPeriod = ref('thisMonth')
const dateFrom = ref('')
const dateTo = ref('')

const reportData = reactive({
  totalIncome: 0,
  totalExpenses: 0,
  balance: 0,
  transactionCount: 0,
  paidStudents: [],
  unpaidStudents: [],
  detailedTransactions: []
})

const paymentMethods = computed(() => {
  const methods = {}
  const total = store.transactions.length

  store.transactions.forEach(t => {
    const method = t.payment_method || 'Manual'
    if (!methods[method]) {
      methods[method] = { count: 0, name: method }
    }
    methods[method].count++
  })

  const colors = ['bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-red-500', 'bg-purple-500']
  
  return Object.values(methods).map((method, index) => ({
    ...method,
    percentage: total > 0 ? Math.round((method.count / total) * 100) : 0,
    color: colors[index % colors.length]
  }))
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

  const fromDate = new Date(dateFrom.value)
  const toDate = new Date(dateTo.value + 'T23:59:59')

  // Filter transactions
  const filteredTransactions = store.transactions.filter(t => {
    const transactionDate = new Date(t.created_at)
    return transactionDate >= fromDate && transactionDate <= toDate
  })

  // Filter expenses
  const filteredExpenses = store.expenses.filter(e => {
    const expenseDate = new Date(e.created_at)
    return expenseDate >= fromDate && expenseDate <= toDate
  })

  // Calculate totals
  reportData.totalIncome = filteredTransactions
    .filter(t => t.type === 'income' && t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0)

  reportData.totalExpenses = filteredExpenses
    .filter(e => e.status === 'approved')
    .reduce((sum, e) => sum + e.amount, 0)

  reportData.balance = reportData.totalIncome - reportData.totalExpenses
  reportData.transactionCount = filteredTransactions.length + filteredExpenses.length

  // Calculate student payment status
  const paidStudentIds = filteredTransactions
    .filter(t => t.type === 'income' && t.status === 'completed')
    .map(t => t.student_id)

  const studentPayments = {}
  filteredTransactions
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
    ...filteredTransactions.map(t => ({
      date: t.created_at,
      type: t.type,
      description: t.description + (t.student?.name ? ` - ${t.student.name}` : ''),
      amount: t.amount
    })),
    ...filteredExpenses.map(e => ({
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

const exportReport = () => {
  // Implementation for PDF export
  console.log('Export PDF functionality to be implemented')
}

const printReport = () => {
  window.print()
}

onMounted(() => {
  updatePeriod()
})
</script>
