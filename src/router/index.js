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
    path: '/campaigns',
    name: 'Campaigns',
    component: () => import('@/views/CampaignsNew.vue'),
    meta: {
      title: 'Campaign WhatsApp',
      requiresAuth: true,
      permission: 'campaigns'
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
  },
  {
    path: '/invoice',
    name: 'Invoice',
    component: () => import('@/views/Invoice.vue'),
    meta: {
      title: 'Invoice Pembayaran',
      hideInNav: true,
      requiresAuth: false
    }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: {
      template: `
        <div class="flex items-center justify-center min-h-screen">
          <div class="text-center">
            <h1 class="text-4xl font-bold text-gray-900 mb-4">404</h1>
            <p class="text-gray-600 mb-4">Halaman tidak ditemukan</p>
            <router-link to="/" class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
              Kembali ke Dashboard
            </router-link>
          </div>
        </div>
      `
    },
    meta: {
      title: 'Halaman Tidak Ditemukan',
      requiresAuth: false
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation Guards with improved error handling
router.beforeEach(async (to, from, next) => {
  try {
    const permissions = usePermissions()

    // Initialize auth if not done
    await permissions.initializeAuth()

    const isAuthenticated = permissions.isAuthenticated.value
    const requiresAuth = to.meta.requiresAuth !== false
    const guestOnly = to.meta.guestOnly === true

    // Update page title
    document.title = to.meta.title ? `${to.meta.title} - Kas Kelas 1B` : 'Kas Kelas 1B'

    // If route is guest only (like login) and user is authenticated
    if (guestOnly && isAuthenticated) {
      return next('/')
    }

    // If route requires auth and user is not authenticated
    if (requiresAuth && !isAuthenticated) {
      return next('/login')
    }

    // Check permissions for protected routes
    if (to.meta.permission && isAuthenticated) {
      const hasAccess = permissions.canAccessPage(to.meta.permission)
      if (!hasAccess) {
        // Redirect to dashboard if no permission
        return next('/')
      }
    }

    next()
  } catch (error) {
    console.error('Navigation guard error:', error)
    // Fallback navigation
    if (to.path !== '/login' && to.meta.requiresAuth !== false) {
      next('/login')
    } else {
      next()
    }
  }
})

// Handle route errors
router.onError((error) => {
  console.error('Router error:', error)
})

export default router
