<template>
  <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <!-- Logo -->
      <div class="flex justify-center">
        <div class="w-16 h-16 bg-primary-600 rounded-xl flex items-center justify-center">
          <span class="text-white font-bold text-2xl">K</span>
        </div>
      </div>
      <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
        Kas Kelas 1B
      </h2>
      <p class="mt-2 text-center text-sm text-gray-600">
        SD Islam Al Husna
      </p>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <!-- Login Form -->
        <form @submit.prevent="handleLogin" class="space-y-6">
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">
              Email / Username
            </label>
            <div class="mt-1">
              <input
                id="email"
                v-model="form.email"
                type="text"
                autocomplete="email"
                required
                class="input-field"
                placeholder="Masukkan email atau username"
              />
            </div>
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">
              Password
            </label>
            <div class="mt-1 relative">
              <input
                id="password"
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                autocomplete="current-password"
                required
                class="input-field pr-10"
                placeholder="Masukkan password"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <EyeIcon v-if="!showPassword" class="h-5 w-5 text-gray-400" />
                <EyeSlashIcon v-else class="h-5 w-5 text-gray-400" />
              </button>
            </div>
          </div>

          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <input
                id="remember-me"
                v-model="form.rememberMe"
                type="checkbox"
                class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label for="remember-me" class="ml-2 block text-sm text-gray-900">
                Ingat saya
              </label>
            </div>

            <div class="text-sm">
              <a href="#" class="font-medium text-primary-600 hover:text-primary-500">
                Lupa password?
              </a>
            </div>
          </div>

          <div>
            <button
              type="submit"
              :disabled="loading"
              class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="loading" class="flex items-center">
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Masuk...
              </span>
              <span v-else>Masuk</span>
            </button>
          </div>
        </form>

        <!-- Quick Login Options -->
        <div class="mt-6">
          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-300" />
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-2 bg-white text-gray-500">Login Cepat untuk Demo</span>
            </div>
          </div>

          <div class="mt-6 grid grid-cols-1 gap-3">
            <button
              v-for="demoUser in demoUsers"
              :key="demoUser.email"
              @click="quickLogin(demoUser)"
              class="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
            >
              <div class="flex items-center">
                <div :class="[
                  'w-6 h-6 rounded-full flex items-center justify-center mr-3 text-xs font-medium text-white',
                  getRoleColor(demoUser.role)
                ]">
                  {{ demoUser.name.charAt(0) }}
                </div>
                <div class="text-left">
                  <div class="text-sm font-medium text-gray-900">{{ demoUser.name }}</div>
                  <div class="text-xs text-gray-500">{{ getRoleLabel(demoUser.role) }}</div>
                </div>
              </div>
            </button>
          </div>
        </div>

        <!-- Error Message -->
        <div v-if="error" class="mt-4 bg-red-50 border border-red-200 rounded-md p-3">
          <div class="flex">
            <div class="flex-shrink-0">
              <ExclamationTriangleIcon class="h-5 w-5 text-red-400" />
            </div>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-red-800">
                Login Gagal
              </h3>
              <div class="mt-1 text-sm text-red-700">
                {{ error }}
              </div>
            </div>
          </div>
        </div>

        <!-- Info -->
        <div class="mt-6 bg-blue-50 border border-blue-200 rounded-md p-3">
          <div class="flex">
            <div class="flex-shrink-0">
              <InformationCircleIcon class="h-5 w-5 text-blue-400" />
            </div>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-blue-800">
                Demo Mode
              </h3>
              <div class="mt-1 text-sm text-blue-700">
                <p>Gunakan tombol "Login Cepat" di atas untuk mencoba berbagai role:</p>
                <ul class="mt-2 space-y-1 text-xs">
                  <li>• <strong>Administrator:</strong> Akses penuh semua fitur</li>
                  <li>• <strong>Bendahara:</strong> Kelola keuangan dan transaksi</li>
                  <li>• <strong>Ketua Kelas:</strong> Kelola data siswa</li>
                  <li>• <strong>Wali Kelas:</strong> Monitoring dan laporan</li>
                  <li>• <strong>Viewer:</strong> Hanya melihat data</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import { usePermissions } from '@/composables/usePermissions'
import {
  EyeIcon,
  EyeSlashIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon
} from '@heroicons/vue/24/outline'

const router = useRouter()
const toast = useToast()
const permissions = usePermissions()

const loading = ref(false)
const showPassword = ref(false)
const error = ref('')

const form = reactive({
  email: '',
  password: '',
  rememberMe: false
})

// Demo users for quick login
const demoUsers = [
  {
    id: '1',
    name: 'Yudi Haryanto',
    email: 'yudi@alhusna.edu',
    role: 'admin',
    password: 'admin123'
  },
  {
    id: '2',
    name: 'Siti Bendahara',
    email: 'siti@alhusna.edu',
    role: 'bendahara',
    password: 'bendahara123'
  },
  {
    id: '3',
    name: 'Ahmad Ketua',
    email: 'ahmad@alhusna.edu',
    role: 'ketua_kelas',
    password: 'ketua123'
  },
  {
    id: '4',
    name: 'Bu Aminah',
    email: 'aminah@alhusna.edu',
    role: 'wali_kelas',
    password: 'wali123'
  },
  {
    id: '5',
    name: 'Rina Viewer',
    email: 'rina@alhusna.edu',
    role: 'viewer',
    password: 'viewer123'
  }
]

const handleLogin = async () => {
  loading.value = true
  error.value = ''

  try {
    // Find user by email/username
    const user = demoUsers.find(u => 
      u.email === form.email || 
      u.name.toLowerCase().includes(form.email.toLowerCase())
    )

    if (!user) {
      throw new Error('User tidak ditemukan')
    }

    if (user.password !== form.password) {
      throw new Error('Password salah')
    }

    // Set current user in permissions
    permissions.setCurrentUser({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: 'active'
    })

    // Store in localStorage for persistence
    localStorage.setItem('currentUser', JSON.stringify({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: 'active',
      loginTime: new Date().toISOString()
    }))

    toast.success(`Selamat datang, ${user.name}!`)
    
    // Redirect to dashboard
    router.push('/')

  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

const quickLogin = async (user) => {
  form.email = user.email
  form.password = user.password
  await handleLogin()
}

const getRoleLabel = (role) => {
  const labels = {
    admin: 'Administrator',
    bendahara: 'Bendahara',
    ketua_kelas: 'Ketua Kelas',
    wali_kelas: 'Wali Kelas',
    viewer: 'Viewer'
  }
  return labels[role] || role
}

const getRoleColor = (role) => {
  const colors = {
    admin: 'bg-purple-500',
    bendahara: 'bg-green-500',
    ketua_kelas: 'bg-blue-500',
    wali_kelas: 'bg-yellow-500',
    viewer: 'bg-gray-500'
  }
  return colors[role] || 'bg-gray-500'
}
</script>
