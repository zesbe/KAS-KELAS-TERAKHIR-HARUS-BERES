<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-semibold text-gray-900">Transaksi Kas</h1>
        <p class="text-sm text-gray-500 mt-1">Kelola semua transaksi pemasukan kas kelas</p>
      </div>
      <button 
        @click="showAddModal = true"
        class="btn-primary"
      >
        <PlusIcon class="w-4 h-4 mr-2" />
        Tambah Transaksi
      </button>
    </div>

    <!-- Summary Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
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
          <div class="p-2 bg-warning-100 rounded-lg">
            <ClockIcon class="w-6 h-6 text-warning-600" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Transaksi Pending</p>
            <p class="text-2xl font-semibold text-gray-900">
              {{ pendingTransactions.length }}
            </p>
          </div>
        </div>
      </div>

      <div class="card p-6">
        <div class="flex items-center">
          <div class="p-2 bg-primary-100 rounded-lg">
            <UsersIcon class="w-6 h-6 text-primary-600" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Siswa Sudah Bayar</p>
            <p class="text-2xl font-semibold text-gray-900">
              {{ store.studentsByPaymentStatus.paid.length }}
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
            <option value="completed">Selesai</option>
            <option value="pending">Pending</option>
          </select>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Filter Siswa</label>
          <select v-model="filters.studentId" class="input-field">
            <option value="">Semua Siswa</option>
            <option v-for="student in store.students" :key="student.id" :value="student.id">
              {{ student.name }}
            </option>
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

    <!-- Transactions Table -->
    <div class="card p-6">
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
                Metode
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
            <tr v-for="transaction in filteredTransactions" :key="transaction.id">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ formatDate(transaction.created_at) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ transaction.student?.name || '-' }}
              </td>
              <td class="px-6 py-4 text-sm text-gray-500">
                {{ transaction.description }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-success-600">
                {{ formatCurrency(transaction.amount) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ transaction.payment_method || 'Manual' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="[
                  'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                  transaction.status === 'completed' ? 'bg-success-100 text-success-800' : 'bg-warning-100 text-warning-800'
                ]">
                  {{ transaction.status === 'completed' ? 'Selesai' : 'Pending' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div class="flex items-center space-x-2">
                  <button 
                    @click="editTransaction(transaction)"
                    class="text-primary-600 hover:text-primary-900"
                  >
                    Edit
                  </button>
                  <button 
                    @click="deleteTransaction(transaction)"
                    class="text-red-600 hover:text-red-900"
                  >
                    Hapus
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        
        <div v-if="filteredTransactions.length === 0" class="text-center py-8">
          <p class="text-sm text-gray-500">Tidak ada transaksi yang ditemukan</p>
        </div>
      </div>
    </div>

    <!-- Add/Edit Modal -->
    <div 
      v-if="showAddModal || editingTransaction"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <div class="bg-white rounded-lg max-w-md w-full p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">
          {{ editingTransaction ? 'Edit Transaksi' : 'Tambah Transaksi Baru' }}
        </h3>
        
        <form @submit.prevent="saveTransaction" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Siswa</label>
            <select v-model="transactionForm.student_id" required class="input-field">
              <option value="">Pilih Siswa</option>
              <option v-for="student in store.students" :key="student.id" :value="student.id">
                {{ student.name }} ({{ student.nickname }})
              </option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Jumlah</label>
            <input 
              v-model.number="transactionForm.amount"
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
              v-model="transactionForm.description"
              type="text" 
              required
              class="input-field"
              placeholder="Contoh: Kas bulanan Januari"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Metode Pembayaran</label>
            <select v-model="transactionForm.payment_method" class="input-field">
              <option value="cash">Tunai</option>
              <option value="qris">QRIS</option>
              <option value="transfer">Transfer</option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select v-model="transactionForm.status" class="input-field">
              <option value="completed">Selesai</option>
              <option value="pending">Pending</option>
            </select>
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
  BanknotesIcon,
  ClockIcon,
  UsersIcon
} from '@heroicons/vue/24/outline'

const store = useAppStore()
const toast = useToast()

const showAddModal = ref(false)
const editingTransaction = ref(null)
const saving = ref(false)

const filters = reactive({
  status: '',
  studentId: '',
  dateFrom: '',
  dateTo: ''
})

const transactionForm = reactive({
  student_id: '',
  amount: 0,
  description: '',
  payment_method: 'cash',
  status: 'completed'
})

const pendingTransactions = computed(() => {
  return store.transactions.filter(t => t.status === 'pending')
})

const filteredTransactions = computed(() => {
  let transactions = store.transactions.filter(t => t.type === 'income')
  
  if (filters.status) {
    transactions = transactions.filter(t => t.status === filters.status)
  }
  
  if (filters.studentId) {
    transactions = transactions.filter(t => t.student_id === filters.studentId)
  }
  
  if (filters.dateFrom) {
    transactions = transactions.filter(t => 
      new Date(t.created_at) >= new Date(filters.dateFrom)
    )
  }
  
  if (filters.dateTo) {
    transactions = transactions.filter(t => 
      new Date(t.created_at) <= new Date(filters.dateTo + 'T23:59:59')
    )
  }
  
  return transactions
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

const editTransaction = (transaction) => {
  editingTransaction.value = transaction
  transactionForm.student_id = transaction.student_id
  transactionForm.amount = transaction.amount
  transactionForm.description = transaction.description
  transactionForm.payment_method = transaction.payment_method || 'cash'
  transactionForm.status = transaction.status
}

const cancelEdit = () => {
  showAddModal.value = false
  editingTransaction.value = null
  resetForm()
}

const resetForm = () => {
  transactionForm.student_id = ''
  transactionForm.amount = 0
  transactionForm.description = ''
  transactionForm.payment_method = 'cash'
  transactionForm.status = 'completed'
}

const saveTransaction = async () => {
  try {
    saving.value = true
    
    const transactionData = {
      type: 'income',
      student_id: transactionForm.student_id,
      amount: transactionForm.amount,
      description: transactionForm.description,
      payment_method: transactionForm.payment_method,
      status: transactionForm.status,
      created_at: new Date().toISOString()
    }

    if (editingTransaction.value) {
      await store.db.updateTransaction(editingTransaction.value.id, transactionData)
      toast.success('Transaksi berhasil diupdate')
    } else {
      await store.addTransaction(transactionData)
      toast.success('Transaksi baru berhasil ditambahkan')
    }

    cancelEdit()
  } catch (error) {
    toast.error('Gagal menyimpan transaksi')
    console.error('Error saving transaction:', error)
  } finally {
    saving.value = false
  }
}

const deleteTransaction = async (transaction) => {
  if (confirm(`Apakah Anda yakin ingin menghapus transaksi ini?`)) {
    try {
      await store.db.deleteTransaction(transaction.id)
      await store.fetchTransactions()
      toast.success('Transaksi berhasil dihapus')
    } catch (error) {
      toast.error('Gagal menghapus transaksi')
      console.error('Error deleting transaction:', error)
    }
  }
}
</script>
