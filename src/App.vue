<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Global loading overlay -->
    <div v-if="isLoading" class="fixed inset-0 z-50 bg-white bg-opacity-90 flex items-center justify-center">
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
        <p class="text-gray-600">Memuat halaman...</p>
      </div>
    </div>
    <!-- Mobile menu overlay -->
    <div 
      v-if="store.sidebarOpen" 
      @click="store.toggleSidebar()"
      class="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
    ></div>

    <!-- Sidebar -->
    <div
      :class="[
        'fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 lg:z-30',
        store.sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      ]"
    >
      <div class="flex flex-col h-full">
        <!-- Logo -->
        <div class="flex items-center px-4 sm:px-6 py-4 border-b border-gray-200">
          <div class="flex items-center">
            <div class="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span class="text-white font-bold text-sm">K</span>
            </div>
            <div class="ml-3">
              <h1 class="text-base sm:text-lg font-semibold text-gray-900">Kas Kelas 1B</h1>
              <p class="text-xs text-gray-500">SD Islam Al Husna</p>
            </div>
          </div>
        </div>

        <!-- Navigation -->
        <nav class="flex-1 px-4 py-4 space-y-1">
          <router-link
            v-for="item in filteredNavigation"
            :key="item.name"
            :to="item.href"
            @click="closeMobileSidebar"
            :class="[
              'sidebar-link rounded-lg',
              $route.name === item.name ? 'active' : ''
            ]"
          >
            <component :is="item.icon" class="w-5 h-5 mr-3" />
            {{ item.label }}
          </router-link>
        </nav>

        <!-- User info -->
        <div class="px-4 py-4 border-t border-gray-200">
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <div class="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                <span class="text-primary-600 font-medium text-sm">
                  {{ (permissions.currentUser?.name || 'U').charAt(0).toUpperCase() }}
                </span>
              </div>
              <div class="ml-3">
                <p class="text-sm font-medium text-gray-900">{{ permissions.currentUser?.name || 'User' }}</p>
                <p class="text-xs text-gray-500">{{ permissions.getRoleDisplayInfo(permissions.currentUser?.role || 'viewer').name }}</p>
              </div>
            </div>
            <button
              @click="handleLogout"
              class="p-1 text-gray-400 hover:text-gray-600"
              title="Logout"
            >
              <ArrowRightOnRectangleIcon class="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Main content -->
    <div class="lg:pl-64 min-h-screen flex flex-col">
      <!-- Top bar -->
      <header class="sticky top-0 z-40 bg-white shadow-sm border-b border-gray-200 lg:z-20">
        <div class="flex items-center justify-between px-4 py-3">
          <div class="flex items-center min-w-0 flex-1">
            <button
              @click="store.toggleSidebar()"
              class="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 mr-2 z-50"
            >
              <Bars3Icon class="w-6 h-6" />
            </button>
            <h2 class="text-lg sm:text-xl font-semibold text-gray-900 truncate">
              {{ $route.meta.title || 'Dashboard' }}
            </h2>
          </div>

          <div class="flex items-center space-x-2 sm:space-x-4">
            <!-- Database status indicator -->
            <div v-if="store.isUsingMockData" class="flex items-center space-x-1 px-2 py-1 bg-yellow-50 rounded-lg">
              <div class="w-2 h-2 bg-yellow-400 rounded-full"></div>
              <span class="text-xs text-yellow-700 font-medium">Demo Mode</span>
            </div>

            <!-- Balance indicator -->
            <div class="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-1 bg-success-50 rounded-lg">
              <span class="text-xs sm:text-sm text-success-600 font-medium">Saldo:</span>
              <span class="text-xs sm:text-sm font-semibold text-success-700">
                {{ formatCurrency(store.currentBalance) }}
              </span>
            </div>
          </div>
        </div>
      </header>

      <!-- Page content -->
      <main class="flex-1 p-4 sm:p-6 pt-6">
        <router-view />
      </main>

      <!-- Mobile floating menu button (visible when scrolled) -->
      <button
        v-if="showFloatingMenuButton"
        @click="store.toggleSidebar()"
        class="lg:hidden fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 transform hover:scale-110"
      >
        <Bars3Icon class="w-6 h-6" />
      </button>
    </div>

    <!-- Error toast -->
    <div v-if="store.error && !store.isUsingMockData" class="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:max-w-md z-50">
      <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
        <div class="flex items-start">
          <div class="flex-shrink-0">
            <ExclamationTriangleIcon class="h-5 w-5 text-red-400" />
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-red-800">Database Error</h3>
            <div class="mt-1 text-sm text-red-700">
              <p>{{ store.error }}</p>
              <div class="mt-2 flex gap-2">
                <button
                  @click="retryDataLoad"
                  :disabled="isLoading"
                  class="text-xs font-medium px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
                >
                  {{ isLoading ? 'Memuat...' : 'Coba Lagi' }}
                </button>
                <router-link to="/settings" class="text-xs font-medium px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700">
                  Pengaturan
                </router-link>
              </div>
            </div>
          </div>
          <div class="ml-auto pl-3">
            <button
              @click="store.clearError()"
              class="text-red-400 hover:text-red-600"
            >
              <span class="sr-only">Dismiss</span>
              <XMarkIcon class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Demo mode notification -->
    <div v-if="store.isUsingMockData" class="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:max-w-md z-50">
      <div class="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative">
        <div class="flex items-start">
          <div class="flex-shrink-0">
            <ExclamationTriangleIcon class="h-5 w-5 text-yellow-400" />
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-yellow-800">Demo Mode Active</h3>
            <div class="mt-1 text-sm text-yellow-700">
              <p>Using sample data. Database not configured yet.</p>
              <router-link to="/settings" class="mt-2 inline-block font-medium underline hover:no-underline">
                Setup Database
              </router-link>
            </div>
          </div>
          <div class="ml-auto pl-3">
            <button
              @click="store.isUsingMockData = false"
              class="text-yellow-400 hover:text-yellow-600"
            >
              <span class="sr-only">Dismiss</span>
              <XMarkIcon class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, computed, ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAppStore } from '@/stores'
import { usePermissions } from '@/composables/usePermissions'
import { useToast } from 'vue-toastification'
import {
  Bars3Icon,
  XMarkIcon,
  HomeIcon,
  UsersIcon,
  BanknotesIcon,
  ReceiptPercentIcon,
  CreditCardIcon,
  DocumentChartBarIcon,
  MegaphoneIcon,
  CogIcon,
  ExclamationTriangleIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/vue/24/outline'

const store = useAppStore()
const permissions = usePermissions()
const router = useRouter()
const route = useRoute()
const toast = useToast()

// Global loading state
const isLoading = ref(false)

// Floating menu button state
const showFloatingMenuButton = ref(false)

// Scroll detection for floating button
const handleScroll = () => {
  // Show floating button if scrolled down more than 100px on mobile
  if (window.innerWidth < 1024) {
    showFloatingMenuButton.value = window.scrollY > 100
  } else {
    showFloatingMenuButton.value = false
  }
}

const navigation = [
  { name: 'Dashboard', label: 'Dashboard', href: '/', icon: HomeIcon, requiresPermission: 'dashboard' },
  { name: 'Students', label: 'Data Siswa', href: '/students', icon: UsersIcon, requiresPermission: 'students' },
  { name: 'Transactions', label: 'Transaksi Kas', href: '/transactions', icon: BanknotesIcon, requiresPermission: 'transactions' },
  { name: 'Expenses', label: 'Pengeluaran', href: '/expenses', icon: ReceiptPercentIcon, requiresPermission: 'expenses' },
  { name: 'Payments', label: 'Link Pembayaran', href: '/payments', icon: CreditCardIcon, requiresPermission: 'payments' },
  { name: 'Campaigns', label: 'Campaign WhatsApp', href: '/campaigns', icon: MegaphoneIcon, requiresPermission: 'campaigns' },
  { name: 'Reports', label: 'Laporan', href: '/reports', icon: DocumentChartBarIcon, requiresPermission: 'reports' },
  { name: 'Settings', label: 'Pengaturan', href: '/settings', icon: CogIcon, requiresPermission: 'settings' }
]

const filteredNavigation = computed(() => {
  return navigation.filter(item => {
    if (!item.requiresPermission) return true
    return permissions.canAccessPage(item.requiresPermission)
  })
})

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount)
}

const closeMobileSidebar = () => {
  if (window.innerWidth < 1024) {
    store.sidebarOpen = false
  }
}

const handleLogout = () => {
  if (confirm('Apakah Anda yakin ingin logout?')) {
    permissions.logout()
    toast.success('Berhasil logout')
    router.push('/login')
  }
}

// Watch for route changes to show loading
watch(() => route.path, (newPath, oldPath) => {
  if (newPath !== oldPath) {
    console.log('Route changed:', oldPath, '->', newPath)
    isLoading.value = true
    // Hide loading after a short delay to allow component to mount
    const timer = setTimeout(() => {
      console.log('Loading finished for:', newPath)
      isLoading.value = false
    }, 300)

    // Clear timer if component unmounts
    return () => clearTimeout(timer)
  }
}, { immediate: false })

// Handle router errors (disabled for debug)
router.onError((error) => {
  console.error('Router error:', error)
  isLoading.value = false
  // toast.error('Gagal memuat halaman. Silakan coba lagi.')
})

// Global error handler
const handleGlobalError = (errorInfo) => {
  console.error('Global app error:', errorInfo)
  toast.error('Terjadi kesalahan pada aplikasi')
}

const retryDataLoad = async () => {
  try {
    isLoading.value = true
    await store.retryLoadAll()
    toast.success('Data berhasil dimuat')
  } catch (error) {
    toast.error('Gagal memuat data. Silakan coba lagi.')
  } finally {
    isLoading.value = false
  }
}

onMounted(async () => {
  // Add scroll event listener
  window.addEventListener('scroll', handleScroll)
  window.addEventListener('resize', handleScroll)

  // Initial auth check
  await permissions.initializeAuth()

  // Load initial data with error handling and retry mechanism
  let retryCount = 0
  const maxRetries = 3

  while (retryCount < maxRetries) {
    try {
      isLoading.value = true

      await Promise.all([
        store.fetchStudents(),
        store.fetchTransactions(),
        store.fetchExpenses(),
        store.fetchPaymentLinks()
      ])

      // If we're using mock data successfully, clear any errors
      if (store.isUsingMockData && !store.error) {
        console.log('Successfully loaded demo data')
      }
      break // Success, exit retry loop
    } catch (error) {
      retryCount++
      console.error(`Error loading initial data (attempt ${retryCount}):`, error)

      if (retryCount >= maxRetries) {
        // If we're successfully using mock data, clear the error
        if (store.isUsingMockData) {
          store.clearError()
        } else {
          toast.error('Gagal memuat data. Silakan refresh halaman.')
        }
      } else {
        // Wait before retry
        await new Promise(resolve => setTimeout(resolve, 1000 * retryCount))
      }
    } finally {
      if (retryCount >= maxRetries || !store.error) {
        isLoading.value = false
      }
    }
  }
})

// Cleanup on unmount
const { onUnmounted } = require('vue')
onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('resize', handleScroll)
})
</script>
