<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
      <div>
        <h1 class="text-xl sm:text-2xl font-semibold text-gray-900">Pengeluaran</h1>
        <p class="text-sm text-gray-500 mt-1">Kelola semua pengeluaran kas kelas</p>
      </div>
      <div class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
        <div class="relative">
          <button
            @click="showExportMenu = !showExportMenu"
            class="btn-secondary w-full sm:w-auto"
          >
            <DocumentArrowDownIcon class="w-4 h-4 mr-2" />
            <span class="hidden sm:inline">Export Data</span>
            <span class="sm:hidden">Export</span>
            <ChevronDownIcon class="w-4 h-4 ml-1" />
          </button>

          <!-- Export dropdown menu -->
          <div v-if="showExportMenu" class="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-200 z-10">
            <div class="py-2">
              <div class="px-4 py-3 text-xs font-bold text-green-600 uppercase tracking-wider border-b border-gray-100 bg-green-50">
                📊 Excel Export
              </div>
              <button @click="exportExpensesToExcel" class="block w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-green-50 flex items-center">
                📋 Export Pengeluaran Excel
              </button>
              <button @click="exportByCategoryToExcel" class="block w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-green-50 flex items-center">
                📈 Export per Kategori Excel
              </button>
              <button @click="exportFilteredToExcel" class="block w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-green-50 flex items-center">
                🔍 Export Data Terfilter Excel
              </button>
              <div class="border-t border-gray-100 mt-1">
                <div class="px-4 py-3 text-xs font-bold text-blue-600 uppercase tracking-wider bg-blue-50">
                  📄 PDF Laporan
                </div>
                <button @click="showExpensesPdfModal = true" class="block w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 flex items-center">
                  📄 Laporan PDF Lengkap
                </button>
                <button @click="showExpensesSummaryPdfModal = true" class="block w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 flex items-center">
                  📋 Summary PDF
                </button>
              </div>
            </div>
          </div>
        </div>
        <button
          @click="showAddModal = true"
          class="btn-primary w-full sm:w-auto"
        >
          <PlusIcon class="w-4 h-4 mr-2" />
          <span class="hidden sm:inline">Tambah Pengeluaran</span>
          <span class="sm:hidden">Tambah</span>
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
                Persetujuan
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
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <div v-if="expense.status === 'approved'">
                  <div class="font-medium">{{ expense.approved_by || 'Admin' }}</div>
                  <div class="text-xs text-gray-400">
                    {{ expense.approved_at ? formatDate(expense.approved_at) : '' }}
                  </div>
                </div>
                <span v-else class="text-gray-400">-</span>
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
              min="1"
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
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import { useAppStore } from '@/stores'
import { useToast } from 'vue-toastification'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'
import exportService from '@/services/export'
import {
  PlusIcon,
  ReceiptPercentIcon,
  ClockIcon,
  CheckCircleIcon,
  BanknotesIcon,
  DocumentArrowDownIcon,
  ChevronDownIcon
} from '@heroicons/vue/24/outline'

const store = useAppStore()
const toast = useToast()

const showAddModal = ref(false)
const editingExpense = ref(null)
const saving = ref(false)
const showExportMenu = ref(false)

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
    const approvedBy = prompt('Masukkan nama yang menyetujui:', 'Admin')
    if (approvedBy) {
      await store.updateExpense(expense.id, {
        status: 'approved',
        approved_by: approvedBy,
        approved_at: new Date().toISOString()
      })
      toast.success('Pengeluaran berhasil disetujui')
    }
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
  expenseForm.approved_by = ''
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

    // Add approval fields if status is approved
    if (expenseForm.status === 'approved') {
      expenseData.approved_by = expenseForm.approved_by || 'Admin'
      expenseData.approved_at = new Date().toISOString()
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
  exportService.exportExpenses(filteredExpenses.value)
  showExportMenu.value = false
  toast.success('Data pengeluaran berhasil di-export')
}

const exportByCategory = () => {
  exportService.exportExpensesByCategory(store.expenses)
  showExportMenu.value = false
  toast.success('Data pengeluaran per kategori berhasil di-export')
}

const exportFiltered = () => {
  const headers = [
    'Tanggal',
    'Kategori',
    'Keterangan',
    'Catatan',
    'Jumlah (IDR)',
    'Status',
    'Disetujui Oleh',
    'Tanggal Disetujui'
  ]

  const csvData = filteredExpenses.value.map(expense => [
    exportService.formatDate(expense.created_at),
    getCategoryLabel(expense.category),
    expense.description,
    expense.notes || '',
    exportService.formatCurrency(expense.amount),
    getStatusLabel(expense.status),
    expense.approved_by || '',
    expense.approved_at ? exportService.formatDate(expense.approved_at) : ''
  ])

  const filterInfo = []
  if (filters.status) filterInfo.push(`status-${filters.status}`)
  if (filters.category) filterInfo.push(`kategori-${filters.category}`)
  if (filters.dateFrom) filterInfo.push(`dari-${filters.dateFrom}`)
  if (filters.dateTo) filterInfo.push(`sampai-${filters.dateTo}`)

  const filename = `pengeluaran_terfilter${filterInfo.length ? '_' + filterInfo.join('_') : ''}_${new Date().toISOString().slice(0, 10)}`

  exportService.downloadCSV(headers, csvData, filename)
  showExportMenu.value = false
  toast.success('Data pengeluaran terfilter berhasil di-export')
}

// PDF Generation Functions
const downloadExpensesPDF = () => {
  try {
    const htmlContent = generateExpensesPDFContent()
    openPDFWindow(htmlContent, 'Lengkap')
    showExportMenu.value = false
    toast.success('PDF Laporan Pengeluaran berhasil di-generate!')
  } catch (error) {
    console.error('Error generating PDF:', error)
    toast.error('Gagal generate PDF Laporan Pengeluaran')
  }
}

const downloadExpensesSummaryPDF = () => {
  try {
    const htmlContent = generateExpensesSummaryPDFContent()
    openPDFWindow(htmlContent, 'Summary')
    showExportMenu.value = false
    toast.success('PDF Summary Pengeluaran berhasil di-generate!')
  } catch (error) {
    console.error('Error generating Summary PDF:', error)
    toast.error('Gagal generate PDF Summary Pengeluaran')
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
      background: linear-gradient(135deg, #dc2626, #b91c1c);
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
    .expense-amount { color: #dc2626; font-weight: 600; }
    .status-approved { color: #059669; font-weight: 500; }
    .status-pending { color: #d97706; font-weight: 500; }
    .status-rejected { color: #dc2626; font-weight: 500; }
    .highlight { background-color: #fef2f2; }
    .summary-box {
      background: #f8fafc;
      padding: 20px;
      border-radius: 8px;
      margin-bottom: 20px;
      border-left: 4px solid #dc2626;
    }
    .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
    .grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 15px; }
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
    .category-tag {
      display: inline-block;
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 0.8rem;
      font-weight: 500;
      background: #f3f4f6;
      color: #374151;
    }
    @media print {
      body { margin: 0; }
      .header { background: #dc2626 !important; -webkit-print-color-adjust: exact; }
    }
  </style>
`

const generateExpensesPDFContent = () => {
  const currentDate = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Laporan Lengkap Pengeluaran Kas Kelas</title>
      ${generatePDFStyles()}
    </head>
    <body>
      <div class="header">
        <h1>💸 Laporan Lengkap Pengeluaran</h1>
        <h2>SD Islam Al Husna - Kelas 1B</h2>
        <p>Komplek Keuangan, Jl. Guntur I</p>
        <p>Tanggal Cetak: ${currentDate}</p>
        ${filters.dateFrom || filters.dateTo ? `<p>Periode: ${filters.dateFrom || 'Awal'} - ${filters.dateTo || 'Sekarang'}</p>` : ''}
      </div>

      <!-- Executive Summary -->
      <div class="summary-box">
        <h3 style="margin-bottom: 15px; color: #1f2937;">📊 Ringkasan Pengeluaran</h3>
        <div class="grid-3">
          <div style="text-align: center;">
            <div style="font-size: 1.5rem; font-weight: bold; color: #dc2626;">${formatCurrency(totalExpenses.value)}</div>
            <div style="font-size: 0.9rem; color: #6b7280;">Total Pengeluaran</div>
          </div>
          <div style="text-align: center;">
            <div style="font-size: 1.5rem; font-weight: bold; color: #d97706;">${pendingExpenses.value.length}</div>
            <div style="font-size: 0.9rem; color: #6b7280;">Menunggu Persetujuan</div>
          </div>
          <div style="text-align: center;">
            <div style="font-size: 1.5rem; font-weight: bold; color: #059669;">${approvedExpenses.value.length}</div>
            <div style="font-size: 0.9rem; color: #6b7280;">Disetujui</div>
          </div>
        </div>
      </div>

      <!-- Expenses by Category -->
      <div class="section">
        <h3 class="section-title">📈 Pengeluaran per Kategori</h3>
        <table class="table">
          <thead>
            <tr>
              <th>Kategori</th>
              <th>Jumlah Item</th>
              <th>Total Pengeluaran</th>
              <th>Persentase</th>
            </tr>
          </thead>
          <tbody>
            ${generateCategoryBreakdown()}
          </tbody>
        </table>
      </div>

      <!-- Detailed Expenses -->
      <div class="section">
        <h3 class="section-title">📋 Detail Pengeluaran</h3>
        <table class="table">
          <thead>
            <tr>
              <th style="width: 12%">Tanggal</th>
              <th style="width: 15%">Kategori</th>
              <th style="width: 30%">Keterangan</th>
              <th style="width: 15%">Jumlah</th>
              <th style="width: 12%">Status</th>
              <th style="width: 16%">Disetujui Oleh</th>
            </tr>
          </thead>
          <tbody>
            ${filteredExpenses.value.map((expense, index) => `
              <tr ${index % 2 === 0 ? 'class="highlight"' : ''}>
                <td>${formatDate(expense.created_at)}</td>
                <td><span class="category-tag">${getCategoryLabel(expense.category)}</span></td>
                <td>
                  ${expense.description}
                  ${expense.notes ? `<br><small style="color: #6b7280;">${expense.notes}</small>` : ''}
                </td>
                <td class="expense-amount">${formatCurrency(expense.amount)}</td>
                <td class="status-${expense.status}">${getStatusLabel(expense.status)}</td>
                <td>${expense.approved_by || '-'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      <!-- Financial Impact -->
      <div class="section">
        <h3 class="section-title">💰 Dampak Keuangan</h3>
        <div class="grid-2">
          <div class="card">
            <h4 style="color: #059669; margin-bottom: 10px;">💵 Saldo Kas</h4>
            <table class="table">
              <tr>
                <td><strong>Saldo Saat Ini</strong></td>
                <td style="color: ${store.currentBalance >= 0 ? '#059669' : '#dc2626'}; font-weight: bold;">
                  ${formatCurrency(store.currentBalance)}
                </td>
              </tr>
              <tr>
                <td><strong>Total Pemasukan</strong></td>
                <td style="color: #059669;">${formatCurrency(store.totalIncome)}</td>
              </tr>
              <tr>
                <td><strong>Total Pengeluaran</strong></td>
                <td style="color: #dc2626;">${formatCurrency(totalExpenses.value)}</td>
              </tr>
            </table>
          </div>

          <div class="card">
            <h4 style="color: #6b7280; margin-bottom: 10px;">📊 Statistik</h4>
            <table class="table">
              <tr>
                <td><strong>Total Item Pengeluaran</strong></td>
                <td>${filteredExpenses.value.length}</td>
              </tr>
              <tr>
                <td><strong>Rata-rata per Item</strong></td>
                <td>${filteredExpenses.value.length > 0 ? formatCurrency(totalExpenses.value / approvedExpenses.value.length) : 'Rp 0'}</td>
              </tr>
              <tr>
                <td><strong>Item Terbesar</strong></td>
                <td>${filteredExpenses.value.length > 0 ? formatCurrency(Math.max(...filteredExpenses.value.filter(e => e.status === 'approved').map(e => e.amount))) : 'Rp 0'}</td>
              </tr>
            </table>
          </div>
        </div>
      </div>

      <div class="footer">
        <p>© ${new Date().getFullYear()} SD Islam Al Husna - Sistem Kas Digital Kelas 1B</p>
        <p>Laporan Pengeluaran dibuat pada ${new Date().toLocaleString('id-ID')}</p>
        <p style="margin-top: 5px;">📍 Komplek Keuangan, Jl. Guntur I | 📞 (021) 7654-321</p>
      </div>
    </body>
    </html>
  `
}

const generateExpensesSummaryPDFContent = () => {
  const currentDate = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Summary Pengeluaran Kas Kelas</title>
      ${generatePDFStyles()}
    </head>
    <body>
      <div class="header">
        <h1>📋 Summary Pengeluaran</h1>
        <h2>SD Islam Al Husna - Kelas 1B</h2>
        <p>Komplek Keuangan, Jl. Guntur I</p>
        <p>Tanggal Cetak: ${currentDate}</p>
      </div>

      <!-- Key Metrics -->
      <div class="summary-box">
        <h3 style="margin-bottom: 15px; color: #1f2937;">🎯 Key Metrics</h3>
        <div class="grid-3">
          <div style="text-align: center; padding: 15px; background: #fef2f2; border-radius: 8px;">
            <div style="font-size: 1.8rem; font-weight: bold; color: #dc2626;">${formatCurrency(totalExpenses.value)}</div>
            <div style="font-size: 0.9rem; color: #991b1b; margin-top: 5px;">Total Pengeluaran</div>
          </div>
          <div style="text-align: center; padding: 15px; background: #fefbeb; border-radius: 8px;">
            <div style="font-size: 1.8rem; font-weight: bold; color: #d97706;">${pendingExpenses.value.length}</div>
            <div style="font-size: 0.9rem; color: #92400e; margin-top: 5px;">Pending</div>
          </div>
          <div style="text-align: center; padding: 15px; background: #f0fdf4; border-radius: 8px;">
            <div style="font-size: 1.8rem; font-weight: bold; color: #059669;">${approvedExpenses.value.length}</div>
            <div style="font-size: 0.9rem; color: #047857; margin-top: 5px;">Disetujui</div>
          </div>
        </div>
      </div>

      <!-- Category Summary -->
      <div class="section">
        <h3 class="section-title">📊 Summary per Kategori</h3>
        <table class="table">
          <thead>
            <tr>
              <th>Kategori</th>
              <th>Jumlah</th>
              <th>Total</th>
              <th>%</th>
            </tr>
          </thead>
          <tbody>
            ${generateCategoryBreakdown()}
          </tbody>
        </table>
      </div>

      <!-- Recent Expenses -->
      <div class="section">
        <h3 class="section-title">🕒 Pengeluaran Terbaru</h3>
        <table class="table">
          <thead>
            <tr>
              <th>Tanggal</th>
              <th>Kategori</th>
              <th>Keterangan</th>
              <th>Jumlah</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${filteredExpenses.value.slice(0, 10).map((expense, index) => `
              <tr ${index % 2 === 0 ? 'class="highlight"' : ''}>
                <td>${formatDate(expense.created_at)}</td>
                <td><span class="category-tag">${getCategoryLabel(expense.category)}</span></td>
                <td>${expense.description}</td>
                <td class="expense-amount">${formatCurrency(expense.amount)}</td>
                <td class="status-${expense.status}">${getStatusLabel(expense.status)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      <!-- Financial Health -->
      <div class="grid-2">
        <div class="card">
          <h4 style="color: #059669; margin-bottom: 15px;">💰 Kesehatan Keuangan</h4>
          <table class="table">
            <tr>
              <td><strong>Saldo Kas</strong></td>
              <td style="color: ${store.currentBalance >= 0 ? '#059669' : '#dc2626'}; font-weight: bold;">
                ${formatCurrency(store.currentBalance)}
              </td>
            </tr>
            <tr>
              <td><strong>Rasio Pengeluaran</strong></td>
              <td>${store.totalIncome > 0 ? Math.round((totalExpenses.value / store.totalIncome) * 100) : 0}%</td>
            </tr>
          </table>
        </div>

        <div class="card">
          <h4 style="color: #6b7280; margin-bottom: 15px;">📈 Quick Stats</h4>
          <table class="table">
            <tr>
              <td><strong>Rata-rata Pengeluaran</strong></td>
              <td>${approvedExpenses.value.length > 0 ? formatCurrency(totalExpenses.value / approvedExpenses.value.length) : 'Rp 0'}</td>
            </tr>
            <tr>
              <td><strong>Pengeluaran Terbesar</strong></td>
              <td>${filteredExpenses.value.length > 0 ? formatCurrency(Math.max(...filteredExpenses.value.filter(e => e.status === 'approved').map(e => e.amount))) : 'Rp 0'}</td>
            </tr>
          </table>
        </div>
      </div>

      <div class="footer">
        <p>© ${new Date().getFullYear()} SD Islam Al Husna - Sistem Kas Digital Kelas 1B</p>
        <p>Summary Pengeluaran dibuat pada ${new Date().toLocaleString('id-ID')}</p>
      </div>
    </body>
    </html>
  `
}

const generateCategoryBreakdown = () => {
  const categoryTotals = {}

  filteredExpenses.value
    .filter(e => e.status === 'approved')
    .forEach(e => {
      const category = getCategoryLabel(e.category)
      if (!categoryTotals[category]) {
        categoryTotals[category] = { count: 0, amount: 0 }
      }
      categoryTotals[category].count += 1
      categoryTotals[category].amount += e.amount
    })

  const totalAmount = Object.values(categoryTotals).reduce((sum, cat) => sum + cat.amount, 0)

  return Object.entries(categoryTotals)
    .sort((a, b) => b[1].amount - a[1].amount)
    .map(([category, data]) => {
      const percentage = totalAmount > 0 ? ((data.amount / totalAmount) * 100).toFixed(1) : 0
      return `
        <tr>
          <td><span class="category-tag">${category}</span></td>
          <td>${data.count} item</td>
          <td class="expense-amount">${formatCurrency(data.amount)}</td>
          <td>${percentage}%</td>
        </tr>
      `
    }).join('')
}

const openPDFWindow = (htmlContent, reportType) => {
  const printWindow = window.open('', '_blank')
  if (!printWindow) {
    throw new Error('Popup blocked. Please allow popups for this site.')
  }

  printWindow.document.write(htmlContent)
  printWindow.document.close()

  printWindow.addEventListener('load', () => {
    setTimeout(() => {
      printWindow.print()
      // Close window after printing
      setTimeout(() => {
        printWindow.close()
      }, 1000)
    }, 500)
  })
}

// Close export menu when clicking outside
const handleClickOutside = (event) => {
  if (showExportMenu.value && !event.target.closest('.relative')) {
    showExportMenu.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
