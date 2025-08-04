<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
      <div>
        <h1 class="text-xl sm:text-2xl font-semibold text-gray-900">Data Siswa</h1>
        <p class="text-sm text-gray-500 mt-1">Kelola data siswa kelas 1B SD Islam Al Husna</p>
      </div>
      <button
        @click="showAddModal = true"
        class="btn-primary w-full sm:w-auto"
      >
        <PlusIcon class="w-4 h-4 mr-2" />
        Tambah Siswa
      </button>
    </div>

    <!-- Students Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
      <div
        v-for="student in store.students"
        :key="student.id"
        class="card p-4 sm:p-6 hover:shadow-md transition-shadow"
      >
        <div class="flex items-center space-x-4">
          <div class="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
            <span class="text-primary-600 font-semibold text-lg">
              {{ student.nickname?.charAt(0)?.toUpperCase() || student.name?.charAt(0)?.toUpperCase() }}
            </span>
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-gray-900 truncate">{{ student.name }}</p>
            <p class="text-sm text-gray-500">{{ student.nickname }}</p>
            <p class="text-xs text-gray-400 mt-1">{{ student.phone }}</p>
          </div>
        </div>
        
        <div class="mt-4 flex items-center justify-between">
          <div class="flex items-center space-x-2">
            <span :class="[
              'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
              getPaymentStatus(student.id) === 'paid' 
                ? 'bg-success-100 text-success-800' 
                : 'bg-red-100 text-red-800'
            ]">
              {{ getPaymentStatus(student.id) === 'paid' ? 'Sudah Bayar' : 'Belum Bayar' }}
            </span>
          </div>
          
          <div class="flex items-center space-x-2">
            <button 
              @click="editStudent(student)"
              class="p-1 text-gray-400 hover:text-primary-600"
            >
              <PencilIcon class="w-4 h-4" />
            </button>
            <button 
              @click="deleteStudent(student)"
              class="p-1 text-gray-400 hover:text-red-600"
            >
              <TrashIcon class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="store.students.length === 0" class="text-center py-12">
      <UsersIcon class="w-12 h-12 text-gray-400 mx-auto mb-4" />
      <h3 class="text-lg font-medium text-gray-900 mb-2">Belum ada data siswa</h3>
      <p class="text-gray-500 mb-4">Mulai dengan menambahkan data siswa pertama.</p>
      <button 
        @click="showAddModal = true"
        class="btn-primary"
      >
        Tambah Siswa
      </button>
    </div>

    <!-- Add/Edit Modal -->
    <div
      v-if="showAddModal || editingStudent"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <div class="bg-white rounded-lg max-w-md w-full mx-4 p-4 sm:p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">
          {{ editingStudent ? 'Edit Siswa' : 'Tambah Siswa Baru' }}
        </h3>
        
        <form @submit.prevent="saveStudent" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Nama Lengkap</label>
            <input 
              v-model="studentForm.name"
              type="text" 
              required
              class="input-field"
              placeholder="Masukkan nama lengkap"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Nama Panggilan</label>
            <input 
              v-model="studentForm.nickname"
              type="text" 
              required
              class="input-field"
              placeholder="Masukkan nama panggilan"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Nomor WhatsApp Orang Tua</label>
            <input 
              v-model="studentForm.phone"
              type="text" 
              required
              class="input-field"
              placeholder="Contoh: +62 812-3456-7890"
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

    <!-- Delete Confirmation Modal -->
    <div
      v-if="deletingStudent"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <div class="bg-white rounded-lg max-w-md w-full mx-4 p-4 sm:p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Hapus Siswa</h3>
        <p class="text-gray-600 mb-6">
          Apakah Anda yakin ingin menghapus <strong>{{ deletingStudent.name }}</strong>? 
          Tindakan ini tidak dapat dibatalkan.
        </p>
        
        <div class="flex justify-end space-x-3">
          <button 
            @click="deletingStudent = null"
            class="btn-secondary"
          >
            Batal
          </button>
          <button 
            @click="confirmDelete"
            :disabled="deleting"
            class="btn-danger"
          >
            {{ deleting ? 'Menghapus...' : 'Hapus' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useAppStore } from '@/stores'
import { useToast } from 'vue-toastification'
import {
  PlusIcon,
  UsersIcon,
  PencilIcon,
  TrashIcon
} from '@heroicons/vue/24/outline'

const store = useAppStore()
const toast = useToast()

const showAddModal = ref(false)
const editingStudent = ref(null)
const deletingStudent = ref(null)
const saving = ref(false)
const deleting = ref(false)

const studentForm = reactive({
  name: '',
  nickname: '',
  phone: ''
})

const getPaymentStatus = (studentId) => {
  const paidStudents = store.transactions
    .filter(t => t.type === 'income' && t.status === 'completed')
    .map(t => t.student_id)
  
  return paidStudents.includes(studentId) ? 'paid' : 'unpaid'
}

const editStudent = (student) => {
  editingStudent.value = student
  studentForm.name = student.name
  studentForm.nickname = student.nickname
  studentForm.phone = student.phone
}

const deleteStudent = (student) => {
  deletingStudent.value = student
}

const cancelEdit = () => {
  showAddModal.value = false
  editingStudent.value = null
  resetForm()
}

const resetForm = () => {
  studentForm.name = ''
  studentForm.nickname = ''
  studentForm.phone = ''
}

const saveStudent = async () => {
  try {
    saving.value = true
    
    const studentData = {
      name: studentForm.name,
      nickname: studentForm.nickname,
      phone: studentForm.phone
    }

    if (editingStudent.value) {
      await store.db.updateStudent(editingStudent.value.id, studentData)
      toast.success('Data siswa berhasil diupdate')
    } else {
      await store.addStudent(studentData)
      toast.success('Siswa baru berhasil ditambahkan')
    }

    cancelEdit()
  } catch (error) {
    toast.error('Gagal menyimpan data siswa')
    console.error('Error saving student:', error)
  } finally {
    saving.value = false
  }
}

const confirmDelete = async () => {
  try {
    deleting.value = true
    
    await store.db.deleteStudent(deletingStudent.value.id)
    await store.fetchStudents()
    
    toast.success('Siswa berhasil dihapus')
    deletingStudent.value = null
  } catch (error) {
    toast.error('Gagal menghapus siswa')
    console.error('Error deleting student:', error)
  } finally {
    deleting.value = false
  }
}
</script>
