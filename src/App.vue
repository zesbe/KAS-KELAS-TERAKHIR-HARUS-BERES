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
            v-for="item in navigation"
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
            <div class="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <span class="text-gray-600 font-medium text-sm">A</span>
            </div>
            <div class="ml-3">
              <p class="text-sm font-medium text-gray-900">Admin</p>
              <p class="text-xs text-gray-500">Administrator</p>
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
    <div v-if="store.error" class="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:max-w-md z-50">
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
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useAppStore } from '@/stores'
import {
  Bars3Icon,
  XMarkIcon,
  HomeIcon,
  UsersIcon,
  BanknotesIcon,
  ReceiptPercentIcon,
  CreditCardIcon,
  SpeakerWaveIcon,
  DocumentChartBarIcon,
  CogIcon,
  ExclamationTriangleIcon
} from '@heroicons/vue/24/outline'

const store = useAppStore()

const navigation = [
  { name: 'Dashboard', label: 'Dashboard', href: '/', icon: HomeIcon },
  { name: 'Students', label: 'Data Siswa', href: '/students', icon: UsersIcon },
  { name: 'Transactions', label: 'Transaksi Kas', href: '/transactions', icon: BanknotesIcon },
  { name: 'Expenses', label: 'Pengeluaran', href: '/expenses', icon: ReceiptPercentIcon },
  { name: 'Payments', label: 'Link Pembayaran', href: '/payments', icon: CreditCardIcon },
  { name: 'Campaigns', label: 'Campaign Pesan', href: '/campaigns', icon: SpeakerWaveIcon },
  { name: 'Reports', label: 'Laporan', href: '/reports', icon: DocumentChartBarIcon },
  { name: 'Settings', label: 'Pengaturan', href: '/settings', icon: CogIcon }
]

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
      store.fetchPaymentLinks(),
      store.fetchCampaigns()
    ])
  } catch (error) {
    console.error('Error loading initial data:', error)
    // Clear the error in store to prevent showing failed fetch toast
    store.clearError()
  }
})
</script>
