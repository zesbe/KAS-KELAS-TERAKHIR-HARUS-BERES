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
        <div class="flex items-center px-6 py-4 border-b border-gray-200">
          <div class="flex items-center">
            <div class="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span class="text-white font-bold text-sm">K</span>
            </div>
            <div class="ml-3">
              <h1 class="text-lg font-semibold text-gray-900">Kas Kelas 1B</h1>
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
          <div class="flex items-center">
            <button
              @click="store.toggleSidebar()"
              class="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              <Bars3Icon class="w-6 h-6" />
            </button>
            <h2 class="ml-2 lg:ml-0 text-xl font-semibold text-gray-900">
              {{ $route.meta.title || 'Dashboard' }}
            </h2>
          </div>
          
          <div class="flex items-center space-x-4">
            <!-- Balance indicator -->
            <div class="hidden sm:flex items-center space-x-2 px-3 py-1 bg-success-50 rounded-lg">
              <span class="text-sm text-success-600 font-medium">Saldo:</span>
              <span class="text-sm font-semibold text-success-700">
                {{ formatCurrency(store.currentBalance) }}
              </span>
            </div>
          </div>
        </div>
      </header>

      <!-- Page content -->
      <main class="p-4 lg:p-6">
        <router-view />
      </main>
    </div>

    <!-- Error toast -->
    <div v-if="store.error" class="fixed bottom-4 right-4 z-50">
      <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative max-w-sm">
        <strong class="font-bold">Error!</strong>
        <span class="block sm:inline"> {{ store.error }}</span>
        <button 
          @click="store.clearError()"
          class="absolute top-0 bottom-0 right-0 px-4 py-3"
        >
          <span class="sr-only">Dismiss</span>
          <XMarkIcon class="w-4 h-4" />
        </button>
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
  CogIcon
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
  // Load initial data
  await Promise.all([
    store.fetchStudents(),
    store.fetchTransactions(),
    store.fetchExpenses(),
    store.fetchPaymentLinks(),
    store.fetchCampaigns()
  ])
})
</script>
