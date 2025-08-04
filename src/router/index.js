import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: () => import('@/views/Dashboard.vue'),
    meta: { title: 'Dashboard' }
  },
  {
    path: '/students',
    name: 'Students',
    component: () => import('@/views/Students.vue'),
    meta: { title: 'Data Siswa' }
  },
  {
    path: '/transactions',
    name: 'Transactions',
    component: () => import('@/views/Transactions.vue'),
    meta: { title: 'Transaksi Kas' }
  },
  {
    path: '/expenses',
    name: 'Expenses',
    component: () => import('@/views/Expenses.vue'),
    meta: { title: 'Pengeluaran' }
  },
  {
    path: '/payments',
    name: 'Payments',
    component: () => import('@/views/Payments.vue'),
    meta: { title: 'Link Pembayaran' }
  },

  {
    path: '/reports',
    name: 'Reports',
    component: () => import('@/views/Reports.vue'),
    meta: { title: 'Laporan Keuangan' }
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () => import('@/views/Settings.vue'),
    meta: { title: 'Pengaturan' }
  },
  {
    path: '/webhook/payment',
    name: 'PaymentWebhook',
    component: () => import('@/views/PaymentWebhook.vue'),
    meta: { title: 'Payment Webhook', hideInNav: true }
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
