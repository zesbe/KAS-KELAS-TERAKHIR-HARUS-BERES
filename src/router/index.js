import { createRouter, createWebHistory } from 'vue-router'
import { usePermissions } from '@/composables/usePermissions'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
    meta: {
      title: 'Login',
      requiresAuth: false,
      guestOnly: true
    }
  },
  {
    path: '/',
    name: 'Dashboard',
    component: () => import('@/views/Dashboard.vue'),
    meta: {
      title: 'Dashboard',
      requiresAuth: true,
      permission: 'dashboard'
    }
  },
  {
    path: '/students',
    name: 'Students',
    component: () => import('@/views/Students.vue'),
    meta: {
      title: 'Data Siswa',
      requiresAuth: true,
      permission: 'students'
    }
  },
  {
    path: '/transactions',
    name: 'Transactions',
    component: () => import('@/views/Transactions.vue'),
    meta: {
      title: 'Transaksi Kas',
      requiresAuth: true,
      permission: 'transactions'
    }
  },
  {
    path: '/expenses',
    name: 'Expenses',
    component: () => import('@/views/Expenses.vue'),
    meta: {
      title: 'Pengeluaran',
      requiresAuth: true,
      permission: 'expenses'
    }
  },
  {
    path: '/payments',
    name: 'Payments',
    component: () => import('@/views/Payments.vue'),
    meta: {
      title: 'Link Pembayaran',
      requiresAuth: true,
      permission: 'payments'
    }
  },
  {
    path: '/reports',
    name: 'Reports',
    component: () => import('@/views/Reports.vue'),
    meta: {
      title: 'Laporan Keuangan',
      requiresAuth: true,
      permission: 'reports'
    }
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () => import('@/views/Settings.vue'),
    meta: {
      title: 'Pengaturan',
      requiresAuth: true,
      permission: 'settings'
    }
  },
  {
    path: '/webhook/payment',
    name: 'PaymentWebhook',
    component: () => import('@/views/PaymentWebhook.vue'),
    meta: {
      title: 'Payment Webhook',
      hideInNav: true,
      requiresAuth: false
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Update page title
router.beforeEach((to) => {
  document.title = to.meta.title ? `${to.meta.title} - Kas Kelas 1B` : 'Kas Kelas 1B'
})

export default router
