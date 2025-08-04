<template>
  <div class="space-y-6">
    <!-- Financial Insights -->
    <div class="card p-6">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">Insight Keuangan</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Cash Flow Health -->
        <div class="space-y-4">
          <h4 class="text-md font-medium text-gray-700">Status Arus Kas</h4>
          <div class="flex items-center space-x-3">
            <div :class="[
              'w-4 h-4 rounded-full',
              cashFlowHealth.status === 'excellent' ? 'bg-green-500' :
              cashFlowHealth.status === 'good' ? 'bg-blue-500' :
              cashFlowHealth.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
            ]"></div>
            <span class="text-sm font-medium" :class="[
              cashFlowHealth.status === 'excellent' ? 'text-green-700' :
              cashFlowHealth.status === 'good' ? 'text-blue-700' :
              cashFlowHealth.status === 'warning' ? 'text-yellow-700' : 'text-red-700'
            ]">{{ cashFlowHealth.label }}</span>
          </div>
          <p class="text-sm text-gray-600">{{ cashFlowHealth.description }}</p>
          <div class="bg-gray-50 p-3 rounded-lg">
            <div class="text-sm">
              <div class="flex justify-between">
                <span>Rasio Pemasukan/Pengeluaran:</span>
                <span class="font-medium">{{ cashFlowHealth.ratio }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Collection Rate -->
        <div class="space-y-4">
          <h4 class="text-md font-medium text-gray-700">Tingkat Penagihan</h4>
          <div class="flex items-center space-x-3">
            <div :class="[
              'w-4 h-4 rounded-full',
              collectionRate.status === 'excellent' ? 'bg-green-500' :
              collectionRate.status === 'good' ? 'bg-blue-500' :
              collectionRate.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
            ]"></div>
            <span class="text-sm font-medium" :class="[
              collectionRate.status === 'excellent' ? 'text-green-700' :
              collectionRate.status === 'good' ? 'text-blue-700' :
              collectionRate.status === 'warning' ? 'text-yellow-700' : 'text-red-700'
            ]">{{ collectionRate.label }}</span>
          </div>
          <p class="text-sm text-gray-600">{{ collectionRate.description }}</p>
          <div class="bg-gray-50 p-3 rounded-lg">
            <div class="text-sm">
              <div class="flex justify-between">
                <span>Siswa yang sudah bayar:</span>
                <span class="font-medium">{{ collectionRate.percentage }}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Financial Predictions -->
    <div class="card p-6">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">Prediksi Keuangan</h3>
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Monthly Projection -->
        <div class="space-y-3">
          <h4 class="text-md font-medium text-gray-700">Proyeksi Bulan Depan</h4>
          <div class="space-y-2">
            <div class="flex justify-between text-sm">
              <span class="text-gray-600">Pemasukan Estimasi:</span>
              <span class="font-medium text-green-600">{{ formatCurrency(predictions.nextMonthIncome) }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-gray-600">Pengeluaran Estimasi:</span>
              <span class="font-medium text-red-600">{{ formatCurrency(predictions.nextMonthExpense) }}</span>
            </div>
            <div class="flex justify-between text-sm border-t pt-2">
              <span class="text-gray-700 font-medium">Saldo Akhir:</span>
              <span class="font-semibold" :class="[
                predictions.nextMonthBalance >= 0 ? 'text-green-600' : 'text-red-600'
              ]">{{ formatCurrency(predictions.nextMonthBalance) }}</span>
            </div>
          </div>
        </div>

        <!-- Target Achievement -->
        <div class="space-y-3">
          <h4 class="text-md font-medium text-gray-700">Target Pencapaian</h4>
          <div class="space-y-2">
            <div class="flex justify-between text-sm">
              <span class="text-gray-600">Target Bulanan:</span>
              <span class="font-medium">{{ formatCurrency(targets.monthlyTarget) }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-gray-600">Pencapaian:</span>
              <span class="font-medium" :class="[
                targets.achievementRate >= 100 ? 'text-green-600' : 
                targets.achievementRate >= 75 ? 'text-blue-600' : 'text-yellow-600'
              ]">{{ targets.achievementRate }}%</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2">
              <div 
                class="h-2 rounded-full" 
                :class="[
                  targets.achievementRate >= 100 ? 'bg-green-500' : 
                  targets.achievementRate >= 75 ? 'bg-blue-500' : 'bg-yellow-500'
                ]"
                :style="{ width: Math.min(targets.achievementRate, 100) + '%' }"
              ></div>
            </div>
          </div>
        </div>

        <!-- Recommendations -->
        <div class="space-y-3">
          <h4 class="text-md font-medium text-gray-700">Rekomendasi</h4>
          <div class="space-y-2">
            <div v-for="recommendation in recommendations" :key="recommendation.id" 
                 class="flex items-start space-x-2">
              <div :class="[
                'w-2 h-2 rounded-full mt-2 flex-shrink-0',
                recommendation.priority === 'high' ? 'bg-red-500' :
                recommendation.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
              ]"></div>
              <p class="text-sm text-gray-600">{{ recommendation.text }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Expense Analysis -->
    <div class="card p-6">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">Analisis Pengeluaran</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Expense Trends -->
        <div class="space-y-4">
          <h4 class="text-md font-medium text-gray-700">Trend Pengeluaran</h4>
          <div class="space-y-3">
            <div v-for="category in expenseAnalysis.categories" :key="category.name"
                 class="flex items-center justify-between">
              <div class="flex items-center space-x-3">
                <div class="w-3 h-3 rounded-full" :style="{ backgroundColor: category.color }"></div>
                <span class="text-sm text-gray-700">{{ category.name }}</span>
              </div>
              <div class="text-right">
                <div class="text-sm font-medium text-gray-900">{{ formatCurrency(category.amount) }}</div>
                <div class="text-xs text-gray-500">{{ category.percentage }}%</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Budget vs Actual -->
        <div class="space-y-4">
          <h4 class="text-md font-medium text-gray-700">Budget vs Aktual</h4>
          <div class="space-y-3">
            <div v-for="budget in budgetComparison" :key="budget.category"
                 class="space-y-2">
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">{{ budget.category }}</span>
                <span class="font-medium">{{ formatCurrency(budget.actual) }} / {{ formatCurrency(budget.budget) }}</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div 
                  class="h-2 rounded-full" 
                  :class="[
                    budget.percentage <= 100 ? 'bg-green-500' :
                    budget.percentage <= 125 ? 'bg-yellow-500' : 'bg-red-500'
                  ]"
                  :style="{ width: Math.min(budget.percentage, 100) + '%' }"
                ></div>
              </div>
              <div class="text-xs" :class="[
                budget.percentage <= 100 ? 'text-green-600' :
                budget.percentage <= 125 ? 'text-yellow-600' : 'text-red-600'
              ]">
                {{ budget.percentage > 100 ? 'Melebihi budget ' : 'Dalam budget ' }}
                ({{ budget.percentage }}%)
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

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

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount)
}

// Cash flow health analysis
const cashFlowHealth = computed(() => {
  const totalIncome = props.transactions
    .filter(t => t.type === 'income' && t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0)

  const totalExpenses = props.expenses
    .filter(e => e.status === 'approved')
    .reduce((sum, e) => sum + e.amount, 0)

  const ratio = totalExpenses > 0 ? (totalIncome / totalExpenses).toFixed(2) : 'N/A'
  const balance = totalIncome - totalExpenses

  if (balance > totalIncome * 0.5) {
    return {
      status: 'excellent',
      label: 'Sangat Sehat',
      description: 'Kas sangat stabil dengan surplus tinggi',
      ratio
    }
  } else if (balance > 0) {
    return {
      status: 'good',
      label: 'Sehat',
      description: 'Kas dalam kondisi baik dengan surplus',
      ratio
    }
  } else if (balance > -totalIncome * 0.2) {
    return {
      status: 'warning',
      label: 'Perlu Perhatian',
      description: 'Kas hampir defisit, perlu monitoring',
      ratio
    }
  } else {
    return {
      status: 'critical',
      label: 'Kritis',
      description: 'Kas defisit, perlu tindakan segera',
      ratio
    }
  }
})

// Collection rate analysis
const collectionRate = computed(() => {
  const paidStudents = props.transactions
    .filter(t => t.type === 'income' && t.status === 'completed')
    .map(t => t.student_id)

  const uniquePaidStudents = [...new Set(paidStudents)].length
  const totalStudents = props.students.length
  const percentage = totalStudents > 0 ? Math.round((uniquePaidStudents / totalStudents) * 100) : 0

  if (percentage >= 90) {
    return {
      status: 'excellent',
      label: 'Sangat Baik',
      description: 'Tingkat pembayaran sangat tinggi',
      percentage
    }
  } else if (percentage >= 75) {
    return {
      status: 'good',
      label: 'Baik',
      description: 'Tingkat pembayaran cukup baik',
      percentage
    }
  } else if (percentage >= 50) {
    return {
      status: 'warning',
      label: 'Perlu Ditingkatkan',
      description: 'Masih banyak siswa yang belum bayar',
      percentage
    }
  } else {
    return {
      status: 'critical',
      label: 'Rendah',
      description: 'Tingkat pembayaran sangat rendah',
      percentage
    }
  }
})

// Financial predictions
const predictions = computed(() => {
  const monthlyIncome = props.transactions
    .filter(t => t.type === 'income' && t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0)

  const monthlyExpense = props.expenses
    .filter(e => e.status === 'approved')
    .reduce((sum, e) => sum + e.amount, 0)

  // Simple prediction based on current month data
  const nextMonthIncome = monthlyIncome * 1.1 // Assume 10% growth
  const nextMonthExpense = monthlyExpense * 1.05 // Assume 5% increase
  const nextMonthBalance = nextMonthIncome - nextMonthExpense

  return {
    nextMonthIncome,
    nextMonthExpense,
    nextMonthBalance
  }
})

// Target analysis
const targets = computed(() => {
  const currentIncome = props.transactions
    .filter(t => t.type === 'income' && t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0)

  // Assume target is 25k per student per month
  const monthlyTarget = props.students.length * 25000
  const achievementRate = monthlyTarget > 0 ? Math.round((currentIncome / monthlyTarget) * 100) : 0

  return {
    monthlyTarget,
    achievementRate,
    currentIncome
  }
})

// Recommendations
const recommendations = computed(() => {
  const recs = []
  
  if (collectionRate.value.percentage < 75) {
    recs.push({
      id: 1,
      priority: 'high',
      text: 'Tingkatkan follow-up pembayaran siswa yang belum bayar'
    })
  }

  if (cashFlowHealth.value.status === 'warning' || cashFlowHealth.value.status === 'critical') {
    recs.push({
      id: 2,
      priority: 'high',
      text: 'Tinjau dan kurangi pengeluaran yang tidak penting'
    })
  }

  if (targets.value.achievementRate < 100) {
    recs.push({
      id: 3,
      priority: 'medium',
      text: 'Pertimbangkan strategi untuk mencapai target bulanan'
    })
  }

  if (recs.length === 0) {
    recs.push({
      id: 4,
      priority: 'low',
      text: 'Kondisi keuangan baik, pertahankan manajemen yang konsisten'
    })
  }

  return recs
})

// Expense analysis
const expenseAnalysis = computed(() => {
  const categoryTotals = {}
  const total = props.expenses
    .filter(e => e.status === 'approved')
    .reduce((sum, e) => sum + e.amount, 0)

  props.expenses
    .filter(e => e.status === 'approved')
    .forEach(e => {
      const category = getCategoryLabel(e.category)
      categoryTotals[category] = (categoryTotals[category] || 0) + e.amount
    })

  const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6']
  
  const categories = Object.entries(categoryTotals)
    .map(([name, amount], index) => ({
      name,
      amount,
      percentage: total > 0 ? Math.round((amount / total) * 100) : 0,
      color: colors[index % colors.length]
    }))
    .sort((a, b) => b.amount - a.amount)

  return { categories, total }
})

// Budget comparison (mock data - in real app, get from settings)
const budgetComparison = computed(() => {
  const budgets = {
    'Kegiatan': 200000,
    'Perlengkapan': 150000,
    'Konsumsi': 100000,
    'Transport': 75000,
    'Lainnya': 50000
  }

  return Object.entries(budgets).map(([category, budget]) => {
    const actual = expenseAnalysis.value.categories
      .find(c => c.name === category)?.amount || 0
    
    return {
      category,
      budget,
      actual,
      percentage: budget > 0 ? Math.round((actual / budget) * 100) : 0
    }
  })
})

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
</script>
