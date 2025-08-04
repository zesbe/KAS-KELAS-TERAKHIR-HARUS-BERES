<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Mobile menu overlay -->
    <div 
      v-if="store.sidebarOpen" 
      @click="store.toggleSidebar()"
      class="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
    ></div>

    <!-- Sidebar -->
    <div 
      :class="[
        'fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0',
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
          <div class="flex items-center">
            <div class="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
              <span class="text-primary-600 font-medium text-sm">
                {{ permissions.currentUser.name.charAt(0).toUpperCase() }}
              </span>
            </div>
            <div class="ml-3">
              <p class="text-sm font-medium text-gray-900">{{ permissions.currentUser.name }}</p>
              <p class="text-xs text-gray-500">{{ permissions.getRoleDisplayInfo(permissions.currentUser.role).name }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main content -->
    <div class="lg:pl-64">
      <!-- Top bar -->
      <header class="bg-white shadow-sm border-b border-gray-200">
        <div class="flex items-center justify-between px-4 py-3">
          <div class="flex items-center min-w-0 flex-1">
            <button
              @click="store.toggleSidebar()"
              class="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 mr-2"
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
      <main class="p-4 sm:p-6">
        <router-view />
      </main>
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
              <router-link to="/settings" class="mt-2 inline-block font-medium underline hover:no-underline">
                Fix in Settings
              </router-link>
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
import { onMounted, computed } from 'vue'
import { useAppStore } from '@/stores'
import { usePermissions } from '@/composables/usePermissions'
import {
  Bars3Icon,
  XMarkIcon,
  HomeIcon,
  UsersIcon,
  BanknotesIcon,
  ReceiptPercentIcon,
  CreditCardIcon,
  DocumentChartBarIcon,
  CogIcon,
  ExclamationTriangleIcon
} from '@heroicons/vue/24/outline'

const store = useAppStore()
const permissions = usePermissions()

const navigation = [
  { name: 'Dashboard', label: 'Dashboard', href: '/', icon: HomeIcon, requiresPermission: 'dashboard' },
  { name: 'Students', label: 'Data Siswa', href: '/students', icon: UsersIcon, requiresPermission: 'students' },
  { name: 'Transactions', label: 'Transaksi Kas', href: '/transactions', icon: BanknotesIcon, requiresPermission: 'transactions' },
  { name: 'Expenses', label: 'Pengeluaran', href: '/expenses', icon: ReceiptPercentIcon, requiresPermission: 'expenses' },
  { name: 'Payments', label: 'Link Pembayaran', href: '/payments', icon: CreditCardIcon, requiresPermission: 'payments' },
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

onMounted(async () => {
  // Load initial data with error handling
  try {
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
  } catch (error) {
    console.error('Error loading initial data:', error)
    // If we're successfully using mock data, clear the error
    if (store.isUsingMockData) {
      store.clearError()
    }
  }
})
</script>
