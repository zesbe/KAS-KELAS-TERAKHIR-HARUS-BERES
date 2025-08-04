<template>
  <div class="space-y-6">
    <!-- Role Management Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
      <div>
        <h3 class="text-lg font-semibold text-gray-900">Role Management</h3>
        <p class="text-sm text-gray-500 mt-1">Kelola pengguna dan hak akses sistem</p>
      </div>
      <button
        @click="showAddUserModal = true"
        class="btn-primary w-full sm:w-auto"
      >
        <UserPlusIcon class="w-4 h-4 mr-2" />
        Tambah Pengguna
      </button>
    </div>

    <!-- Current User Info -->
    <div class="card p-6">
      <div class="flex items-center space-x-4">
        <div class="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
          <UserIcon class="w-6 h-6 text-primary-600" />
        </div>
        <div>
          <h4 class="text-lg font-medium text-gray-900">{{ currentUser.name }}</h4>
          <div class="flex items-center space-x-2">
            <span :class="getRoleBadgeClass(currentUser.role)">
              {{ getRoleLabel(currentUser.role) }}
            </span>
            <span class="text-sm text-gray-500">• Aktif sejak {{ formatDate(currentUser.created_at) }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Role Definitions -->
    <div class="card p-6">
      <h4 class="text-lg font-medium text-gray-900 mb-4">Definisi Peran</h4>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div v-for="role in roleDefinitions" :key="role.id" class="border rounded-lg p-4">
          <div class="flex items-center justify-between mb-3">
            <h5 class="font-medium text-gray-900">{{ role.name }}</h5>
            <span :class="getRoleBadgeClass(role.id)">
              {{ role.users }} users
            </span>
          </div>
          <p class="text-sm text-gray-600 mb-3">{{ role.description }}</p>
          <div class="space-y-2">
            <h6 class="text-xs font-medium text-gray-700 uppercase tracking-wide">Hak Akses:</h6>
            <div class="flex flex-wrap gap-1">
              <span 
                v-for="permission in role.permissions" 
                :key="permission"
                class="inline-flex items-center px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded"
              >
                {{ getPermissionLabel(permission) }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Users List -->
    <div class="card p-6">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 space-y-2 sm:space-y-0">
        <h4 class="text-lg font-medium text-gray-900">Daftar Pengguna</h4>
        <div class="flex space-x-2">
          <select v-model="filterRole" class="input-field w-auto">
            <option value="">Semua Peran</option>
            <option v-for="role in roleDefinitions" :key="role.id" :value="role.id">
              {{ role.name }}
            </option>
          </select>
        </div>
      </div>

      <!-- Desktop Table View -->
      <div class="hidden sm:block overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Pengguna
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Peran
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Terakhir Aktif
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="user in filteredUsers" :key="user.id">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                    <span class="text-primary-600 font-semibold text-sm">
                      {{ user.name.charAt(0).toUpperCase() }}
                    </span>
                  </div>
                  <div>
                    <div class="text-sm font-medium text-gray-900">{{ user.name }}</div>
                    <div class="text-sm text-gray-500">{{ user.email }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="getRoleBadgeClass(user.role)">
                  {{ getRoleLabel(user.role) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="[
                  'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                  user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                ]">
                  {{ user.status === 'active' ? 'Aktif' : 'Nonaktif' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(user.last_active) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div class="flex items-center space-x-2">
                  <button 
                    @click="editUser(user)"
                    class="text-primary-600 hover:text-primary-900"
                    title="Edit User"
                  >
                    <PencilIcon class="w-4 h-4" />
                  </button>
                  <button 
                    v-if="user.id !== currentUser.id"
                    @click="toggleUserStatus(user)"
                    :class="[
                      'hover:text-gray-900',
                      user.status === 'active' ? 'text-red-600' : 'text-green-600'
                    ]"
                    :title="user.status === 'active' ? 'Nonaktifkan' : 'Aktifkan'"
                  >
                    <LockClosedIcon v-if="user.status === 'active'" class="w-4 h-4" />
                    <LockOpenIcon v-else class="w-4 h-4" />
                  </button>
                  <button 
                    v-if="user.id !== currentUser.id && currentUser.role === 'admin'"
                    @click="deleteUser(user)"
                    class="text-red-600 hover:text-red-900"
                    title="Hapus User"
                  >
                    <TrashIcon class="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Mobile Card View -->
      <div class="block sm:hidden space-y-4">
        <div v-for="user in filteredUsers" :key="user.id" class="bg-gray-50 rounded-lg p-4">
          <div class="flex items-center justify-between mb-3">
            <div class="flex items-center">
              <div class="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                <span class="text-primary-600 font-semibold text-sm">
                  {{ user.name.charAt(0).toUpperCase() }}
                </span>
              </div>
              <div>
                <div class="font-medium text-sm">{{ user.name }}</div>
                <div class="text-gray-500 text-xs">{{ user.email }}</div>
              </div>
            </div>
            <div class="flex items-center space-x-2">
              <button @click="editUser(user)" class="text-primary-600">
                <PencilIcon class="w-4 h-4" />
              </button>
              <button 
                v-if="user.id !== currentUser.id"
                @click="toggleUserStatus(user)"
                :class="user.status === 'active' ? 'text-red-600' : 'text-green-600'"
              >
                <LockClosedIcon v-if="user.status === 'active'" class="w-4 h-4" />
                <LockOpenIcon v-else class="w-4 h-4" />
              </button>
            </div>
          </div>
          <div class="space-y-2 text-sm">
            <div class="flex justify-between">
              <span class="text-gray-600">Peran:</span>
              <span :class="getRoleBadgeClass(user.role)">{{ getRoleLabel(user.role) }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Status:</span>
              <span :class="[
                user.status === 'active' ? 'text-green-600' : 'text-red-600'
              ]">{{ user.status === 'active' ? 'Aktif' : 'Nonaktif' }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Terakhir Aktif:</span>
              <span>{{ formatDate(user.last_active) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add/Edit User Modal -->
    <div
      v-if="showAddUserModal || showEditUserModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <div class="bg-white rounded-lg max-w-md w-full mx-4 p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">
          {{ showEditUserModal ? 'Edit Pengguna' : 'Tambah Pengguna Baru' }}
        </h3>
        
        <form @submit.prevent="saveUser" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Nama Lengkap</label>
            <input 
              v-model="userForm.name"
              type="text" 
              required
              class="input-field"
              placeholder="Masukkan nama lengkap"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input 
              v-model="userForm.email"
              type="email" 
              required
              class="input-field"
              placeholder="contoh@email.com"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Peran</label>
            <select v-model="userForm.role" required class="input-field">
              <option value="">Pilih Peran</option>
              <option v-for="role in roleDefinitions" :key="role.id" :value="role.id">
                {{ role.name }}
              </option>
            </select>
          </div>

          <div v-if="!showEditUserModal">
            <label class="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input 
              v-model="userForm.password"
              type="password" 
              required
              class="input-field"
              placeholder="Minimal 6 karakter"
            />
          </div>
          
          <div class="flex justify-end space-x-3 pt-4">
            <button 
              type="button"
              @click="closeModal"
              class="btn-secondary"
            >
              Batal
            </button>
            <button 
              type="submit"
              :disabled="saving"
              class="btn-primary"
            >
              {{ saving ? 'Menyimpan...' : (showEditUserModal ? 'Update' : 'Tambah') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useToast } from 'vue-toastification'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'
import {
  UserIcon,
  UserPlusIcon,
  PencilIcon,
  TrashIcon,
  LockClosedIcon,
  LockOpenIcon
} from '@heroicons/vue/24/outline'

const toast = useToast()

const showAddUserModal = ref(false)
const showEditUserModal = ref(false)
const saving = ref(false)
const filterRole = ref('')

const currentUser = reactive({
  id: '1',
  name: 'Yudi Haryanto',
  email: 'yudi@alhusna.edu',
  role: 'admin',
  created_at: '2024-01-15T00:00:00Z'
})

const userForm = reactive({
  id: null,
  name: '',
  email: '',
  role: '',
  password: ''
})

const users = ref([
  {
    id: '1',
    name: 'Yudi Haryanto',
    email: 'yudi@alhusna.edu',
    role: 'admin',
    status: 'active',
    last_active: '2024-01-20T10:30:00Z',
    created_at: '2024-01-15T00:00:00Z'
  },
  {
    id: '2',
    name: 'Siti Nurhaliza',
    email: 'siti.bendahara@alhusna.edu',
    role: 'bendahara',
    status: 'active',
    last_active: '2024-01-20T09:15:00Z',
    created_at: '2024-01-16T00:00:00Z'
  },
  {
    id: '3',
    name: 'Ahmad Ketua',
    email: 'ahmad.ketua@alhusna.edu',
    role: 'ketua_kelas',
    status: 'active',
    last_active: '2024-01-19T16:45:00Z',
    created_at: '2024-01-17T00:00:00Z'
  },
  {
    id: '4',
    name: 'Bu Aminah',
    email: 'aminah.wali@alhusna.edu',
    role: 'wali_kelas',
    status: 'active',
    last_active: '2024-01-20T08:00:00Z',
    created_at: '2024-01-18T00:00:00Z'
  },
  {
    id: '5',
    name: 'Rina Viewer',
    email: 'rina@alhusna.edu',
    role: 'viewer',
    status: 'inactive',
    last_active: '2024-01-15T12:00:00Z',
    created_at: '2024-01-19T00:00:00Z'
  }
])

const roleDefinitions = computed(() => [
  {
    id: 'admin',
    name: 'Administrator',
    description: 'Akses penuh ke semua fitur sistem termasuk manajemen pengguna',
    permissions: ['create', 'read', 'update', 'delete', 'manage_users', 'manage_settings', 'export_data'],
    users: users.value.filter(u => u.role === 'admin').length
  },
  {
    id: 'bendahara',
    name: 'Bendahara',
    description: 'Mengelola keuangan, transaksi, dan laporan keuangan',
    permissions: ['create', 'read', 'update', 'delete', 'manage_transactions', 'manage_expenses', 'export_reports'],
    users: users.value.filter(u => u.role === 'bendahara').length
  },
  {
    id: 'ketua_kelas',
    name: 'Ketua Kelas',
    description: 'Mengelola data siswa dan melihat laporan keuangan',
    permissions: ['create', 'read', 'update', 'manage_students', 'view_reports'],
    users: users.value.filter(u => u.role === 'ketua_kelas').length
  },
  {
    id: 'wali_kelas',
    name: 'Wali Kelas',
    description: 'Akses ke semua data untuk monitoring dan supervisi',
    permissions: ['read', 'view_all', 'view_reports', 'export_reports'],
    users: users.value.filter(u => u.role === 'wali_kelas').length
  },
  {
    id: 'viewer',
    name: 'Viewer',
    description: 'Hanya dapat melihat data tanpa akses edit',
    permissions: ['read', 'view_basic'],
    users: users.value.filter(u => u.role === 'viewer').length
  }
])

const filteredUsers = computed(() => {
  if (!filterRole.value) return users.value
  return users.value.filter(user => user.role === filterRole.value)
})

const formatDate = (dateString) => {
  return format(new Date(dateString), 'dd MMM yyyy', { locale: id })
}

const getRoleLabel = (roleId) => {
  const role = roleDefinitions.value.find(r => r.id === roleId)
  return role ? role.name : roleId
}

const getRoleBadgeClass = (roleId) => {
  const classes = {
    admin: 'inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800',
    bendahara: 'inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800',
    ketua_kelas: 'inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800',
    wali_kelas: 'inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800',
    viewer: 'inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800'
  }
  return classes[roleId] || classes.viewer
}

const getPermissionLabel = (permission) => {
  const labels = {
    create: 'Buat',
    read: 'Lihat',
    update: 'Edit',
    delete: 'Hapus',
    manage_users: 'Kelola User',
    manage_settings: 'Kelola Setting',
    manage_transactions: 'Kelola Transaksi',
    manage_expenses: 'Kelola Pengeluaran',
    manage_students: 'Kelola Siswa',
    view_reports: 'Lihat Laporan',
    export_reports: 'Export Laporan',
    export_data: 'Export Data',
    view_all: 'Lihat Semua',
    view_basic: 'Lihat Dasar'
  }
  return labels[permission] || permission
}

const editUser = (user) => {
  userForm.id = user.id
  userForm.name = user.name
  userForm.email = user.email
  userForm.role = user.role
  userForm.password = ''
  showEditUserModal.value = true
}

const toggleUserStatus = async (user) => {
  try {
    const newStatus = user.status === 'active' ? 'inactive' : 'active'
    const action = newStatus === 'active' ? 'mengaktifkan' : 'menonaktifkan'
    
    if (confirm(`Apakah Anda yakin ingin ${action} pengguna ${user.name}?`)) {
      user.status = newStatus
      toast.success(`Pengguna ${user.name} berhasil ${newStatus === 'active' ? 'diaktifkan' : 'dinonaktifkan'}`)
    }
  } catch (error) {
    toast.error('Gagal mengubah status pengguna')
    console.error('Error toggling user status:', error)
  }
}

const deleteUser = async (user) => {
  try {
    if (confirm(`Apakah Anda yakin ingin menghapus pengguna ${user.name}? Tindakan ini tidak dapat dibatalkan.`)) {
      const index = users.value.findIndex(u => u.id === user.id)
      if (index > -1) {
        users.value.splice(index, 1)
        toast.success(`Pengguna ${user.name} berhasil dihapus`)
      }
    }
  } catch (error) {
    toast.error('Gagal menghapus pengguna')
    console.error('Error deleting user:', error)
  }
}

const saveUser = async () => {
  try {
    saving.value = true
    
    if (showEditUserModal.value) {
      // Update existing user
      const user = users.value.find(u => u.id === userForm.id)
      if (user) {
        user.name = userForm.name
        user.email = userForm.email
        user.role = userForm.role
        toast.success('Pengguna berhasil diupdate')
      }
    } else {
      // Add new user
      const newUser = {
        id: Date.now().toString(),
        name: userForm.name,
        email: userForm.email,
        role: userForm.role,
        status: 'active',
        last_active: new Date().toISOString(),
        created_at: new Date().toISOString()
      }
      users.value.push(newUser)
      toast.success('Pengguna baru berhasil ditambahkan')
    }
    
    closeModal()
  } catch (error) {
    toast.error('Gagal menyimpan pengguna')
    console.error('Error saving user:', error)
  } finally {
    saving.value = false
  }
}

const closeModal = () => {
  showAddUserModal.value = false
  showEditUserModal.value = false
  
  // Reset form
  userForm.id = null
  userForm.name = ''
  userForm.email = ''
  userForm.role = ''
  userForm.password = ''
}

onMounted(() => {
  // Initialize component
})
</script>
