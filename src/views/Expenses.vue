<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-semibold text-gray-900">Pengeluaran</h1>
        <p class="text-sm text-gray-500 mt-1">Kelola semua pengeluaran kas kelas</p>
      </div>
      <div class="flex space-x-3">
        <button
          @click="exportExpenses"
          class="btn-secondary"
        >
          <DocumentArrowDownIcon class="w-4 h-4 mr-2" />
          Export CSV
        </button>
        <button
          @click="showAddModal = true"
          class="btn-primary"
        >
          <PlusIcon class="w-4 h-4 mr-2" />
          Tambah Pengeluaran
        </button>
      </div>
    </div>

    <!-- Summary Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div class="card p-6">
        <div class="flex items-center">
          <div class="p-2 bg-red-100 rounded-lg">
            <ReceiptPercentIcon class="w-6 h-6 text-red-600" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Total Pengeluaran</p>
            <p class="text-2xl font-semibold text-gray-900">
              {{ formatCurrency(totalExpenses) }}
            </p>
          </div>
        </div>
      </div>

      <div class="card p-6">
        <div class="flex items-center">
          <div class="p-2 bg-warning-100 rounded-lg">
            <ClockIcon class="w-6 h-6 text-warning-600" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Menunggu Persetujuan</p>
            <p class="text-2xl font-semibold text-gray-900">
              {{ pendingExpenses.length }}
            </p>
          </div>
        </div>
      </div>

      <div class="card p-6">
        <div class="flex items-center">
          <div class="p-2 bg-success-100 rounded-lg">
            <CheckCircleIcon class="w-6 h-6 text-success-600" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Disetujui</p>
            <p class="text-2xl font-semibold text-gray-900">
              {{ approvedExpenses.length }}
            </p>
          </div>
        </div>
      </div>

      <div class="card p-6">
        <div class="flex items-center">
          <div class="p-2 bg-gray-100 rounded-lg">
            <BanknotesIcon class="w-6 h-6 text-gray-600" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Sisa Saldo</p>
            <p class="text-2xl font-semibold text-gray-900">
              {{ formatCurrency(store.currentBalance) }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="card p-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Filter Status</label>
          <select v-model="filters.status" class="input-field">
            <option value="">Semua Status</option>
            <option value="pending">Menunggu Persetujuan</option>
            <option value="approved">Disetujui</option>
            <option value="rejected">Ditolak</option>
          </select>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Filter Kategori</label>
          <select v-model="filters.category" class="input-field">
            <option value="">Semua Kategori</option>
            <option value="kegiatan">Kegiatan Kelas</option>
            <option value="perlengkapan">Perlengkapan</option>
            <option value="konsumsi">Konsumsi</option>
            <option value="transport">Transport</option>
            <option value="lainnya">Lainnya</option>
          </select>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Dari Tanggal</label>
          <input v-model="filters.dateFrom" type="date" class="input-field" />
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Sampai Tanggal</label>
          <input v-model="filters.dateTo" type="date" class="input-field" />
        </div>
      </div>
    </div>

    <!-- Expenses Table -->
    <div class="card p-6">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tanggal
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Kategori
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
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="expense in filteredExpenses" :key="expense.id">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ formatDate(expense.created_at) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                  {{ getCategoryLabel(expense.category) }}
                </span>
              </td>
              <td class="px-6 py-4 text-sm text-gray-500">
                {{ expense.description }}
                <div v-if="expense.notes" class="text-xs text-gray-400 mt-1">
                  {{ expense.notes }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-red-600">
                {{ formatCurrency(expense.amount) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="getStatusClass(expense.status)">
                  {{ getStatusLabel(expense.status) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div class="flex items-center space-x-2">
                  <button 
                    v-if="expense.status === 'pending'"
                    @click="approveExpense(expense)"
                    class="text-success-600 hover:text-success-900"
                  >
                    Setujui
                  </button>
                  <button 
                    v-if="expense.status === 'pending'"
                    @click="rejectExpense(expense)"
                    class="text-red-600 hover:text-red-900"
                  >
                    Tolak
                  </button>
                  <button 
                    @click="editExpense(expense)"
                    class="text-primary-600 hover:text-primary-900"
                  >
                    Edit
                  </button>
                  <button 
                    @click="deleteExpense(expense)"
                    class="text-red-600 hover:text-red-900"
                  >
                    Hapus
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        
        <div v-if="filteredExpenses.length === 0" class="text-center py-8">
          <p class="text-sm text-gray-500">Tidak ada pengeluaran yang ditemukan</p>
        </div>
      </div>
    </div>

    <!-- Add/Edit Modal -->
    <div 
      v-if="showAddModal || editingExpense"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <div class="bg-white rounded-lg max-w-md w-full p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">
          {{ editingExpense ? 'Edit Pengeluaran' : 'Tambah Pengeluaran Baru' }}
        </h3>
        
        <form @submit.prevent="saveExpense" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Kategori</label>
            <select v-model="expenseForm.category" required class="input-field">
              <option value="">Pilih Kategori</option>
              <option value="kegiatan">Kegiatan Kelas</option>
              <option value="perlengkapan">Perlengkapan</option>
              <option value="konsumsi">Konsumsi</option>
              <option value="transport">Transport</option>
              <option value="lainnya">Lainnya</option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Jumlah</label>
            <input 
              v-model.number="expenseForm.amount"
              type="number" 
              min="1000"
              step="1000"
              required
              class="input-field"
              placeholder="Masukkan jumlah"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Keterangan</label>
            <input 
              v-model="expenseForm.description"
              type="text" 
              required
              class="input-field"
              placeholder="Contoh: Pembelian alat tulis"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Catatan (Opsional)</label>
            <textarea 
              v-model="expenseForm.notes"
              rows="3"
              class="input-field"
              placeholder="Catatan tambahan"
            ></textarea>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select v-model="expenseForm.status" class="input-field">
              <option value="pending">Menunggu Persetujuan</option>
              <option value="approved">Disetujui</option>
              <option value="rejected">Ditolak</option>
            </select>
          </div>

          <div v-if="expenseForm.status === 'approved'">
            <label class="block text-sm font-medium text-gray-700 mb-2">Disetujui Oleh</label>
            <input
              v-model="expenseForm.approved_by"
              type="text"
              class="input-field"
              placeholder="Nama yang menyetujui"
            />
          </div>
          
          <div class="flex justify-end space-x-3 pt-4">
            <button 
              type="button"
              @click="cancelEdit"
              class="btn-secondary"
            >
              Batal
            </button>
            <button 
              type="submit"
              :disabled="saving"
              class="btn-primary"
            >
              {{ saving ? 'Menyimpan...' : 'Simpan' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useAppStore } from '@/stores'
import { useToast } from 'vue-toastification'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'
import {
  PlusIcon,
  ReceiptPercentIcon,
  ClockIcon,
  CheckCircleIcon,
  BanknotesIcon,
  DocumentArrowDownIcon
} from '@heroicons/vue/24/outline'

const store = useAppStore()
const toast = useToast()

const showAddModal = ref(false)
const editingExpense = ref(null)
const saving = ref(false)

const filters = reactive({
  status: '',
  category: '',
  dateFrom: '',
  dateTo: ''
})

const expenseForm = reactive({
  category: '',
  amount: 0,
  description: '',
  notes: '',
  status: 'pending',
  approved_by: ''
})

const totalExpenses = computed(() => {
  return store.expenses
    .filter(e => e.status === 'approved')
    .reduce((sum, e) => sum + e.amount, 0)
})

const pendingExpenses = computed(() => {
  return store.expenses.filter(e => e.status === 'pending')
})

const approvedExpenses = computed(() => {
  return store.expenses.filter(e => e.status === 'approved')
})

const filteredExpenses = computed(() => {
  let expenses = [...store.expenses]
  
  if (filters.status) {
    expenses = expenses.filter(e => e.status === filters.status)
  }
  
  if (filters.category) {
    expenses = expenses.filter(e => e.category === filters.category)
  }
  
  if (filters.dateFrom) {
    expenses = expenses.filter(e => 
      new Date(e.created_at) >= new Date(filters.dateFrom)
    )
  }
  
  if (filters.dateTo) {
    expenses = expenses.filter(e => 
      new Date(e.created_at) <= new Date(filters.dateTo + 'T23:59:59')
    )
  }
  
  return expenses.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
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
  return format(new Date(dateString), 'dd MMM yyyy HH:mm', { locale: id })
}

const getCategoryLabel = (category) => {
  const labels = {
    kegiatan: 'Kegiatan Kelas',
    perlengkapan: 'Perlengkapan',
    konsumsi: 'Konsumsi',
    transport: 'Transport',
    lainnya: 'Lainnya'
  }
  return labels[category] || category
}

const getStatusLabel = (status) => {
  const labels = {
    pending: 'Menunggu Persetujuan',
    approved: 'Disetujui',
    rejected: 'Ditolak'
  }
  return labels[status] || status
}

const getStatusClass = (status) => {
  const classes = {
    pending: 'inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-warning-100 text-warning-800',
    approved: 'inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-success-100 text-success-800',
    rejected: 'inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800'
  }
  return classes[status] || classes.pending
}

const editExpense = (expense) => {
  editingExpense.value = expense
  expenseForm.category = expense.category
  expenseForm.amount = expense.amount
  expenseForm.description = expense.description
  expenseForm.notes = expense.notes || ''
  expenseForm.status = expense.status
  expenseForm.approved_by = expense.approved_by || ''
}

const approveExpense = async (expense) => {
  try {
    await store.updateExpense(expense.id, { status: 'approved' })
    toast.success('Pengeluaran berhasil disetujui')
  } catch (error) {
    toast.error('Gagal menyetujui pengeluaran')
    console.error('Error approving expense:', error)
  }
}

const rejectExpense = async (expense) => {
  if (confirm('Apakah Anda yakin ingin menolak pengeluaran ini?')) {
    try {
      await store.updateExpense(expense.id, { status: 'rejected' })
      toast.success('Pengeluaran berhasil ditolak')
    } catch (error) {
      toast.error('Gagal menolak pengeluaran')
      console.error('Error rejecting expense:', error)
    }
  }
}

const cancelEdit = () => {
  showAddModal.value = false
  editingExpense.value = null
  resetForm()
}

const resetForm = () => {
  expenseForm.category = ''
  expenseForm.amount = 0
  expenseForm.description = ''
  expenseForm.notes = ''
  expenseForm.status = 'pending'
}

const saveExpense = async () => {
  try {
    saving.value = true
    
    const expenseData = {
      category: expenseForm.category,
      amount: expenseForm.amount,
      description: expenseForm.description,
      notes: expenseForm.notes,
      status: expenseForm.status,
      created_at: new Date().toISOString()
    }

    if (editingExpense.value) {
      await store.updateExpense(editingExpense.value.id, expenseData)
      toast.success('Pengeluaran berhasil diupdate')
    } else {
      await store.addExpense(expenseData)
      toast.success('Pengeluaran baru berhasil ditambahkan')
    }

    cancelEdit()
  } catch (error) {
    toast.error('Gagal menyimpan pengeluaran')
    console.error('Error saving expense:', error)
  } finally {
    saving.value = false
  }
}

const deleteExpense = async (expense) => {
  if (confirm(`Apakah Anda yakin ingin menghapus pengeluaran ini?`)) {
    try {
      await store.deleteExpense(expense.id)
      toast.success('Pengeluaran berhasil dihapus')
    } catch (error) {
      toast.error('Gagal menghapus pengeluaran')
      console.error('Error deleting expense:', error)
    }
  }
}

const exportExpenses = () => {
  const headers = [
    'Tanggal',
    'Kategori',
    'Keterangan',
    'Catatan',
    'Jumlah',
    'Status',
    'Disetujui Oleh',
    'Tanggal Disetujui'
  ]

  const csvData = filteredExpenses.value.map(expense => [
    formatDate(expense.created_at),
    getCategoryLabel(expense.category),
    expense.description,
    expense.notes || '',
    expense.amount,
    getStatusLabel(expense.status),
    expense.approved_by || '',
    expense.approved_at ? formatDate(expense.approved_at) : ''
  ])

  const csvContent = [
    headers.join(','),
    ...csvData.map(row =>
      row.map(field => `"${field.toString().replace(/"/g, '""')}"`).join(',')
    )
  ].join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)

  const dateStr = new Date().toISOString().slice(0, 10)
  const filterStr = filters.status || filters.category ?
    `_${filters.status || 'all'}_${filters.category || 'all'}` : ''

  link.download = `pengeluaran_kas_kelas${filterStr}_${dateStr}.csv`
  link.click()

  toast.success('Data pengeluaran berhasil di-export')
}
</script>
