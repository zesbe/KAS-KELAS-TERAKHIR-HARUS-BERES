<template>
  <div class="space-y-6">
    <!-- Monthly Trend Chart -->
    <div class="card p-6">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">Trend Keuangan Bulanan</h3>
      <div class="h-80">
        <Line 
          :data="monthlyTrendData" 
          :options="monthlyTrendOptions"
          v-if="monthlyTrendData.datasets.length > 0"
        />
        <div v-else class="h-full flex items-center justify-center bg-gray-50 rounded-lg">
          <p class="text-gray-500">Tidak ada data untuk ditampilkan</p>
        </div>
      </div>
    </div>

    <!-- Income vs Expenses Comparison -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="card p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Perbandingan Pemasukan vs Pengeluaran</h3>
        <div class="h-64">
          <Bar 
            :data="incomeExpenseData" 
            :options="barChartOptions"
            v-if="incomeExpenseData.datasets.length > 0"
          />
          <div v-else class="h-full flex items-center justify-center bg-gray-50 rounded-lg">
            <p class="text-gray-500">Tidak ada data</p>
          </div>
        </div>
      </div>

      <div class="card p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Distribusi Metode Pembayaran</h3>
        <div class="h-64">
          <Doughnut 
            :data="paymentMethodData" 
            :options="doughnutOptions"
            v-if="paymentMethodData.datasets.length > 0"
          />
          <div v-else class="h-full flex items-center justify-center bg-gray-50 rounded-lg">
            <p class="text-gray-500">Tidak ada data</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Student Payment Rate -->
    <div class="card p-6">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">Tingkat Pembayaran Siswa</h3>
      <div class="h-64">
        <Pie 
          :data="studentPaymentData" 
          :options="pieOptions"
          v-if="studentPaymentData.datasets.length > 0"
        />
        <div v-else class="h-full flex items-center justify-center bg-gray-50 rounded-lg">
          <p class="text-gray-500">Tidak ada data</p>
        </div>
      </div>
    </div>

    <!-- Balance Trend -->
    <div class="card p-6">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">Trend Saldo Kas</h3>
      <div class="h-80">
        <Line 
          :data="balanceTrendData" 
          :options="balanceTrendOptions"
          v-if="balanceTrendData.datasets.length > 0"
        />
        <div v-else class="h-full flex items-center justify-center bg-gray-50 rounded-lg">
          <p class="text-gray-500">Tidak ada data untuk ditampilkan</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, watch } from 'vue'
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  BarElement,
  Title, 
  Tooltip, 
  Legend,
  ArcElement
} from 'chart.js'
import { Line, Bar, Doughnut, Pie } from 'vue-chartjs'
import { format, startOfMonth, endOfMonth, eachMonthOfInterval, subMonths } from 'date-fns'
import { id } from 'date-fns/locale'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
)

const props = defineProps({
  transactions: {
    type: Array,
    default: () => []
  },
  expenses: {
    type: Array,
    default: () => []
  },
  students: {
    type: Array,
    default: () => []
  },
  period: {
    type: Object,
    default: () => ({ from: '', to: '' })
  }
})

// Format currency for display in tooltips
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount)
}

// Monthly trend data (last 6 months)
const monthlyTrendData = computed(() => {
  const endDate = new Date()
  const startDate = subMonths(endDate, 5)
  const months = eachMonthOfInterval({ start: startDate, end: endDate })

  const labels = months.map(month => format(month, 'MMM yyyy', { locale: id }))
  
  const incomeData = months.map(month => {
    const monthStart = startOfMonth(month)
    const monthEnd = endOfMonth(month)
    
    return props.transactions
      .filter(t => {
        const date = new Date(t.created_at)
        return t.type === 'income' && 
               t.status === 'completed' &&
               date >= monthStart && 
               date <= monthEnd
      })
      .reduce((sum, t) => sum + t.amount, 0)
  })

  const expenseData = months.map(month => {
    const monthStart = startOfMonth(month)
    const monthEnd = endOfMonth(month)
    
    return props.expenses
      .filter(e => {
        const date = new Date(e.created_at)
        return e.status === 'approved' &&
               date >= monthStart && 
               date <= monthEnd
      })
      .reduce((sum, e) => sum + e.amount, 0)
  })

  return {
    labels,
    datasets: [
      {
        label: 'Pemasukan',
        data: incomeData,
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.4,
        fill: true
      },
      {
        label: 'Pengeluaran',
        data: expenseData,
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        tension: 0.4,
        fill: true
      }
    ]
  }
})

// Income vs Expenses bar chart
const incomeExpenseData = computed(() => {
  const totalIncome = props.transactions
    .filter(t => t.type === 'income' && t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0)

  const totalExpenses = props.expenses
    .filter(e => e.status === 'approved')
    .reduce((sum, e) => sum + e.amount, 0)

  return {
    labels: ['Periode Saat Ini'],
    datasets: [
      {
        label: 'Pemasukan',
        data: [totalIncome],
        backgroundColor: 'rgba(34, 197, 94, 0.8)',
        borderColor: 'rgb(34, 197, 94)',
        borderWidth: 1
      },
      {
        label: 'Pengeluaran',
        data: [totalExpenses],
        backgroundColor: 'rgba(239, 68, 68, 0.8)',
        borderColor: 'rgb(239, 68, 68)',
        borderWidth: 1
      }
    ]
  }
})

// Payment method distribution
const paymentMethodData = computed(() => {
  const methods = {}
  
  props.transactions
    .filter(t => t.type === 'income' && t.status === 'completed')
    .forEach(t => {
      const method = t.payment_method || 'Manual'
      methods[method] = (methods[method] || 0) + 1
    })

  const labels = Object.keys(methods)
  const data = Object.values(methods)
  const colors = [
    'rgba(59, 130, 246, 0.8)',   // Blue
    'rgba(34, 197, 94, 0.8)',    // Green
    'rgba(245, 158, 11, 0.8)',   // Yellow
    'rgba(239, 68, 68, 0.8)',    // Red
    'rgba(168, 85, 247, 0.8)',   // Purple
    'rgba(236, 72, 153, 0.8)'    // Pink
  ]

  return {
    labels,
    datasets: [
      {
        data,
        backgroundColor: colors.slice(0, labels.length),
        borderWidth: 2,
        borderColor: '#ffffff'
      }
    ]
  }
})

// Student payment rate
const studentPaymentData = computed(() => {
  const paidStudentIds = props.transactions
    .filter(t => t.type === 'income' && t.status === 'completed')
    .map(t => t.student_id)

  const uniquePaidStudents = [...new Set(paidStudentIds)].length
  const totalStudents = props.students.length
  const unpaidStudents = totalStudents - uniquePaidStudents

  return {
    labels: ['Sudah Bayar', 'Belum Bayar'],
    datasets: [
      {
        data: [uniquePaidStudents, unpaidStudents],
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',
          'rgba(239, 68, 68, 0.8)'
        ],
        borderWidth: 2,
        borderColor: '#ffffff'
      }
    ]
  }
})

// Balance trend over time
const balanceTrendData = computed(() => {
  // Combine all transactions and expenses, sort by date
  const allItems = [
    ...props.transactions.map(t => ({
      date: new Date(t.created_at),
      amount: t.type === 'income' && t.status === 'completed' ? t.amount : 0,
      type: 'income'
    })),
    ...props.expenses.map(e => ({
      date: new Date(e.created_at),
      amount: e.status === 'approved' ? -e.amount : 0,
      type: 'expense'
    }))
  ].sort((a, b) => a.date - b.date)

  const labels = []
  const balanceData = []
  let runningBalance = 0

  allItems.forEach(item => {
    runningBalance += item.amount
    labels.push(format(item.date, 'dd MMM', { locale: id }))
    balanceData.push(runningBalance)
  })

  // Limit to last 30 data points for readability
  const maxPoints = 30
  const startIndex = Math.max(0, labels.length - maxPoints)

  return {
    labels: labels.slice(startIndex),
    datasets: [
      {
        label: 'Saldo Kas',
        data: balanceData.slice(startIndex),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true,
        pointBackgroundColor: 'rgb(59, 130, 246)',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2
      }
    ]
  }
})

// Chart options
const monthlyTrendOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top'
    },
    tooltip: {
      callbacks: {
        label: function(context) {
          return `${context.dataset.label}: ${formatCurrency(context.parsed.y)}`
        }
      }
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        callback: function(value) {
          return formatCurrency(value)
        }
      }
    }
  }
}

const barChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top'
    },
    tooltip: {
      callbacks: {
        label: function(context) {
          return `${context.dataset.label}: ${formatCurrency(context.parsed.y)}`
        }
      }
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        callback: function(value) {
          return formatCurrency(value)
        }
      }
    }
  }
}

const doughnutOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom'
    },
    tooltip: {
      callbacks: {
        label: function(context) {
          const total = context.dataset.data.reduce((a, b) => a + b, 0)
          const percentage = Math.round((context.parsed / total) * 100)
          return `${context.label}: ${context.parsed} (${percentage}%)`
        }
      }
    }
  }
}

const pieOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom'
    },
    tooltip: {
      callbacks: {
        label: function(context) {
          const total = context.dataset.data.reduce((a, b) => a + b, 0)
          const percentage = Math.round((context.parsed / total) * 100)
          return `${context.label}: ${context.parsed} siswa (${percentage}%)`
        }
      }
    }
  }
}

const balanceTrendOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top'
    },
    tooltip: {
      callbacks: {
        label: function(context) {
          return `${context.dataset.label}: ${formatCurrency(context.parsed.y)}`
        }
      }
    }
  },
  scales: {
    y: {
      ticks: {
        callback: function(value) {
          return formatCurrency(value)
        }
      }
    }
  }
}
</script>
