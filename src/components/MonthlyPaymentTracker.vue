<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
      <div>
        <h3 class="text-lg font-semibold text-gray-900">📅 Tracking Pembayaran Bulanan</h3>
        <p class="text-sm text-gray-500 mt-1">Kelola pembayaran kas kelas per bulan dengan mudah</p>
      </div>
      <div class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
        <select v-model="selectedYear" @change="loadMonthlyData" class="input-field w-full sm:w-auto">
          <option v-for="year in availableYears" :key="year" :value="year">{{ year }}</option>
        </select>
        <button @click="exportMonthlyReport" class="btn-secondary w-full sm:w-auto">
          <DocumentArrowDownIcon class="w-4 h-4 mr-2" />
          Export Bulanan
        </button>
      </div>
    </div>

    <!-- Current Month Summary -->
    <div class="card p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200">
      <div class="flex items-center justify-between mb-4">
        <h4 class="text-lg font-semibold text-blue-900">
          📊 {{ currentMonthName }} {{ selectedYear }}
        </h4>
        <div class="flex items-center space-x-4">
          <div class="text-center">
            <div class="text-2xl font-bold text-green-600">{{ currentMonthStats.paid }}</div>
            <div class="text-xs text-gray-600">Sudah Bayar</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-red-600">{{ currentMonthStats.unpaid }}</div>
            <div class="text-xs text-gray-600">Belum Bayar</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-blue-600">{{ currentMonthStats.rate }}%</div>
            <div class="text-xs text-gray-600">Rate Bayar</div>
          </div>
        </div>
      </div>
      
      <!-- Progress Bar -->
      <div class="w-full bg-gray-200 rounded-full h-3 mb-4">
        <div
          class="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full transition-all duration-500"
          :style="{ width: currentMonthStats.rate + '%' }"
        ></div>
      </div>
      
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
        <div class="flex justify-between">
          <span class="text-gray-600">Total Pemasukan:</span>
          <span class="font-semibold text-green-600">{{ formatCurrency(currentMonthStats.totalIncome) }}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-gray-600">Target Bulan Ini:</span>
          <span class="font-semibold">{{ formatCurrency(monthlyTarget) }}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-gray-600">Pencapaian:</span>
          <span 
            class="font-semibold"
            :class="currentMonthStats.totalIncome >= monthlyTarget ? 'text-green-600' : 'text-orange-600'"
          >
            {{ Math.round((currentMonthStats.totalIncome / monthlyTarget) * 100) }}%
          </span>
        </div>
      </div>
    </div>

    <!-- Monthly Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div 
        v-for="month in monthlyData" 
        :key="month.monthCode"
        class="card p-4 hover:shadow-lg transition-shadow duration-200"
        :class="month.isCurrentMonth ? 'ring-2 ring-blue-500 bg-blue-50' : ''"
      >
        <div class="flex items-center justify-between mb-3">
          <h5 class="font-semibold text-gray-900">
            {{ month.monthName }} {{ month.year }}
          </h5>
          <div class="flex items-center space-x-2">
            <span 
              class="px-2 py-1 text-xs rounded-full"
              :class="getMonthStatusClass(month)"
            >
              {{ getMonthStatus(month) }}
            </span>
            <button
              @click="markAllPaid(month)"
              class="text-green-600 hover:text-green-800 p-1"
              title="Tandai semua lunas"
              v-if="month.unpaidStudents.length > 0"
            >
              <CheckCircleIcon class="w-4 h-4" />
            </button>
          </div>
        </div>

        <div class="space-y-3">
          <!-- Stats -->
          <div class="grid grid-cols-3 gap-2 text-center">
            <div class="bg-green-50 rounded-lg p-2">
              <div class="text-lg font-bold text-green-600">{{ month.paidStudents.length }}</div>
              <div class="text-xs text-green-700">Lunas</div>
            </div>
            <div class="bg-red-50 rounded-lg p-2">
              <div class="text-lg font-bold text-red-600">{{ month.unpaidStudents.length }}</div>
              <div class="text-xs text-red-700">Belum</div>
            </div>
            <div class="bg-blue-50 rounded-lg p-2">
              <div class="text-lg font-bold text-blue-600">{{ month.paymentRate }}%</div>
              <div class="text-xs text-blue-700">Rate</div>
            </div>
          </div>

          <!-- Progress -->
          <div class="w-full bg-gray-200 rounded-full h-2">
            <div
              class="h-2 rounded-full transition-all duration-300"
              :class="month.paymentRate >= 80 ? 'bg-green-500' : month.paymentRate >= 50 ? 'bg-yellow-500' : 'bg-red-500'"
              :style="{ width: month.paymentRate + '%' }"
            ></div>
          </div>

          <!-- Income -->
          <div class="text-center">
            <div class="text-sm font-semibold text-gray-900">
              {{ formatCurrency(month.totalIncome) }}
            </div>
            <div class="text-xs text-gray-500">Total Pemasukan</div>
          </div>

          <!-- Action Buttons -->
          <div class="flex space-x-2">
            <button
              @click="viewMonthDetails(month)"
              class="btn-outline text-xs py-1 px-2 flex-1"
            >
              Detail
            </button>
            <button
              @click="generateLinksForMonth(month)"
              class="btn-secondary text-xs py-1 px-2 flex-1"
              v-if="month.unpaidStudents.length > 0"
            >
              Generate
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Monthly Details Modal -->
    <div
      v-if="showDetailsModal && selectedMonth"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <div class="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div class="p-6 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-gray-900">
              Detail {{ selectedMonth.monthName }} {{ selectedMonth.year }}
            </h3>
            <button @click="showDetailsModal = false" class="text-gray-400 hover:text-gray-600">
              <XMarkIcon class="w-6 h-6" />
            </button>
          </div>
        </div>
        
        <div class="p-6 overflow-y-auto max-h-[70vh]">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Paid Students -->
            <div>
              <h4 class="font-semibold text-green-600 mb-3">
                ✅ Sudah Bayar ({{ selectedMonth.paidStudents.length }})
              </h4>
              <div class="space-y-2 max-h-64 overflow-y-auto">
                <div
                  v-for="student in selectedMonth.paidStudents"
                  :key="student.id"
                  class="flex items-center justify-between p-3 bg-green-50 rounded-lg"
                >
                  <span class="text-sm font-medium text-green-900">{{ student.name }}</span>
                  <div class="text-right">
                    <div class="text-xs text-green-600">{{ formatCurrency(student.monthlyAmount) }}</div>
                    <div class="text-xs text-green-500">{{ formatDate(student.paidDate) }}</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Unpaid Students -->
            <div>
              <h4 class="font-semibold text-red-600 mb-3">
                ❌ Belum Bayar ({{ selectedMonth.unpaidStudents.length }})
              </h4>
              <div class="space-y-2 max-h-64 overflow-y-auto">
                <div
                  v-for="student in selectedMonth.unpaidStudents"
                  :key="student.id"
                  class="flex items-center justify-between p-3 bg-red-50 rounded-lg"
                >
                  <span class="text-sm font-medium text-red-900">{{ student.name }}</span>
                  <button
                    @click="markStudentAsPaid(student, selectedMonth)"
                    class="btn-success text-xs py-1 px-2"
                  >
                    Tandai Lunas
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Monthly Transactions -->
          <div class="mt-6">
            <h4 class="font-semibold text-gray-900 mb-3">📋 Transaksi Bulan Ini</h4>
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Tanggal</th>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Siswa</th>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Keterangan</th>
                    <th class="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Jumlah</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="transaction in selectedMonth.transactions" :key="transaction.id">
                    <td class="px-4 py-2 text-sm text-gray-900">{{ formatDate(transaction.created_at) }}</td>
                    <td class="px-4 py-2 text-sm text-gray-900">{{ transaction.student?.name || '-' }}</td>
                    <td class="px-4 py-2 text-sm text-gray-500">{{ transaction.description }}</td>
                    <td class="px-4 py-2 text-sm font-medium text-green-600 text-right">
                      {{ formatCurrency(transaction.amount) }}
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
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useAppStore } from '@/stores'
import { useToast } from 'vue-toastification'
import { format, startOfMonth, endOfMonth } from 'date-fns'
import { id } from 'date-fns/locale'
import {
  DocumentArrowDownIcon,
  CheckCircleIcon,
  XMarkIcon
} from '@heroicons/vue/24/outline'

const store = useAppStore()
const toast = useToast()

const selectedYear = ref(2024)
const monthlyData = ref([])
const showDetailsModal = ref(false)
const selectedMonth = ref(null)
const monthlyTarget = ref(50000 * store.students.length) // Assuming 50k per student per month

const availableYears = computed(() => {
  const currentYear = new Date().getFullYear()
  return [currentYear - 1, currentYear, currentYear + 1]
})

const currentMonthName = computed(() => {
  return new Date().toLocaleDateString('id-ID', { month: 'long' })
})

const currentMonthStats = computed(() => {
  const currentMonthCode = new Date().toISOString().slice(0, 7)
  const currentMonth = monthlyData.value.find(m => m.monthCode === currentMonthCode)
  
  if (!currentMonth) {
    return {
      paid: 0,
      unpaid: store.students.length,
      rate: 0,
      totalIncome: 0
    }
  }
  
  return {
    paid: currentMonth.paidStudents.length,
    unpaid: currentMonth.unpaidStudents.length,
    rate: currentMonth.paymentRate,
    totalIncome: currentMonth.totalIncome
  }
})

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(amount)
}

const formatDate = (dateString) => {
  return format(new Date(dateString), 'dd MMM yyyy', { locale: id })
}

const loadMonthlyData = () => {
  const months = []
  const year = selectedYear.value


  // Generate 12 months for the selected year
  for (let i = 0; i < 12; i++) {
    const monthDate = new Date(year, i, 1)
    const monthCode = monthDate.toISOString().slice(0, 7) // YYYY-MM
    const monthName = monthDate.toLocaleDateString('id-ID', { month: 'long' })

    // Debug logging for 2025
    if (year === 2025 && (i === 7 || i === 8)) { // August (7) and September (8)
      console.log(`📅 Month ${i} (${monthName}):`, {
        monthDate: monthDate.toISOString(),
        monthCode,
        monthName
      })
    }
    const currentDate = new Date()
    const currentYear = currentDate.getFullYear()
    const currentMonthCode = currentDate.toISOString().slice(0, 7)

    // Only highlight as current month if we're viewing the current year AND it's the current month
    // Disable highlighting for 2025 since it's a future year
    const isCurrentMonth = (year === currentYear) && (monthCode === currentMonthCode) && (year <= 2024)
    
    // Get transactions for this month
    const monthTransactions = store.transactions.filter(t => {
      const transactionMonth = new Date(t.created_at).toISOString().slice(0, 7)
      const matches = transactionMonth === monthCode && t.type === 'income' && t.status === 'completed'

      // Debug logging for August and September 2025
      if ((monthName === 'Agustus' || monthName === 'September') && year === 2025) {
        console.log(`🔍 ${monthName} ${year} (${monthCode}):`, {
          transaction: t.description,
          created_at: t.created_at,
          transactionMonth,
          monthCode,
          matches,
          student: t.student?.name
        })
      }

      return matches
    })
    
    // Get paid student IDs for this month
    const paidStudentIds = monthTransactions.map(t => t.student_id)
    
    // Calculate student payment details
    const studentPayments = {}
    monthTransactions.forEach(t => {
      if (!studentPayments[t.student_id]) {
        studentPayments[t.student_id] = { amount: 0, date: t.created_at }
      }
      studentPayments[t.student_id].amount += t.amount
      if (new Date(t.created_at) > new Date(studentPayments[t.student_id].date)) {
        studentPayments[t.student_id].date = t.created_at
      }
    })
    
    const paidStudents = store.students
      .filter(s => paidStudentIds.includes(s.id))
      .map(s => ({
        ...s,
        monthlyAmount: studentPayments[s.id]?.amount || 0,
        paidDate: studentPayments[s.id]?.date
      }))
    
    const unpaidStudents = store.students.filter(s => !paidStudentIds.includes(s.id))
    
    const totalIncome = monthTransactions.reduce((sum, t) => sum + t.amount, 0)
    const paymentRate = store.students.length > 0 ? 
      Math.round((paidStudents.length / store.students.length) * 100) : 0
    
    months.push({
      monthCode,
      monthName,
      year,
      isCurrentMonth,
      paidStudents,
      unpaidStudents,
      transactions: monthTransactions,
      totalIncome,
      paymentRate
    })
  }
  
  monthlyData.value = months.reverse() // Most recent first
}

const getMonthStatus = (month) => {
  if (month.paymentRate === 100) return 'Lengkap'
  if (month.paymentRate >= 80) return 'Baik'
  if (month.paymentRate >= 50) return 'Sedang'
  if (month.paymentRate > 0) return 'Kurang'
  return 'Kosong'
}

const getMonthStatusClass = (month) => {
  if (month.paymentRate === 100) return 'bg-green-100 text-green-800'
  if (month.paymentRate >= 80) return 'bg-blue-100 text-blue-800'
  if (month.paymentRate >= 50) return 'bg-yellow-100 text-yellow-800'
  if (month.paymentRate > 0) return 'bg-orange-100 text-orange-800'
  return 'bg-gray-100 text-gray-800'
}

const viewMonthDetails = (month) => {
  selectedMonth.value = month
  showDetailsModal.value = true
}

const markStudentAsPaid = async (student, month) => {
  try {
    const amount = 50000 // Default amount
    const description = `Kas Kelas ${month.monthName} ${month.year}`
    
    // Create transaction
    await store.addTransaction({
      type: 'income',
      amount,
      description,
      student_id: student.id,
      payment_method: 'manual',
      status: 'completed',
      month: month.monthCode,
      created_at: new Date().toISOString(),
      notes: `Pembayaran manual untuk ${month.monthName} ${month.year}`
    })
    
    toast.success(`✅ ${student.name} berhasil ditandai LUNAS untuk ${month.monthName}!`)
    
    // Refresh data
    loadMonthlyData()
    
    // Update modal data
    if (selectedMonth.value?.monthCode === month.monthCode) {
      const updatedMonth = monthlyData.value.find(m => m.monthCode === month.monthCode)
      selectedMonth.value = updatedMonth
    }
    
  } catch (error) {
    console.error('Error marking student as paid:', error)
    toast.error('Gagal menandai siswa sebagai lunas')
  }
}

const markAllPaid = async (month) => {
  if (month.unpaidStudents.length === 0) {
    toast.info('Semua siswa sudah bayar untuk bulan ini')
    return
  }
  
  const confirmed = confirm(
    `Tandai SEMUA ${month.unpaidStudents.length} siswa sebagai LUNAS untuk ${month.monthName} ${month.year}?\n\n` +
    `Total akan menambah: ${formatCurrency(month.unpaidStudents.length * 50000)}`
  )
  
  if (!confirmed) return
  
  try {
    const promises = month.unpaidStudents.map(student => 
      store.addTransaction({
        type: 'income',
        amount: 50000,
        description: `Kas Kelas ${month.monthName} ${month.year} (Bulk)`,
        student_id: student.id,
        payment_method: 'manual_bulk',
        status: 'completed',
        month: month.monthCode,
        created_at: new Date().toISOString(),
        notes: `Pembayaran bulk untuk ${month.monthName} ${month.year}`
      })
    )
    
    await Promise.all(promises)
    
    toast.success(`✅ Semua ${month.unpaidStudents.length} siswa berhasil ditandai LUNAS untuk ${month.monthName}!`)
    loadMonthlyData()
    
  } catch (error) {
    console.error('Error marking all students as paid:', error)
    toast.error('Gagal menandai semua siswa sebagai lunas')
  }
}

const generateLinksForMonth = async (month) => {
  if (month.unpaidStudents.length === 0) {
    toast.info('Semua siswa sudah bayar untuk bulan ini')
    return
  }
  
  try {
    const description = `Kas Kelas ${month.monthName} ${month.year}`
    const results = await store.generateBulkPaymentLinks(50000, description, false)
    
    const successful = results.filter(r => r.success).length
    toast.success(`✅ Berhasil generate ${successful} link pembayaran untuk ${month.monthName}`)
    
  } catch (error) {
    console.error('Error generating links:', error)
    toast.error('Gagal generate link pembayaran')
  }
}

const exportMonthlyReport = () => {
  // Create CSV data for monthly report
  const headers = ['Bulan', 'Tahun', 'Sudah Bayar', 'Belum Bayar', 'Rate (%)', 'Total Pemasukan', 'Status']
  const data = monthlyData.value.map(month => [
    month.monthName,
    month.year,
    month.paidStudents.length,
    month.unpaidStudents.length,
    month.paymentRate,
    month.totalIncome,
    getMonthStatus(month)
  ])
  
  // Simple CSV export
  const csvContent = [
    headers.join(','),
    ...data.map(row => row.join(','))
  ].join('\n')
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  link.setAttribute('href', url)
  link.setAttribute('download', `laporan_bulanan_${selectedYear.value}.csv`)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  
  toast.success('Laporan bulanan berhasil di-export!')
}

onMounted(() => {
  loadMonthlyData()
})
</script>

<style scoped>
.btn-success {
  @apply bg-green-600 hover:bg-green-700 text-white font-medium py-1 px-2 rounded transition-colors duration-200;
}
</style>
