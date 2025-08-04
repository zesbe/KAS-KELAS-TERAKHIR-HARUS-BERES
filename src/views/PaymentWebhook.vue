<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center p-4">
    <div class="max-w-md w-full">
      <!-- Success State -->
      <div v-if="status === 'success'" class="text-center">
        <div class="w-16 h-16 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircleIcon class="w-8 h-8 text-success-600" />
        </div>
        <h1 class="text-2xl font-semibold text-gray-900 mb-2">Pembayaran Berhasil!</h1>
        <p class="text-gray-600 mb-6">Terima kasih, pembayaran Anda telah berhasil diproses.</p>
        
        <div class="card p-6 text-left mb-6">
          <h3 class="font-semibold text-gray-900 mb-3">Detail Pembayaran</h3>
          <div class="space-y-2 text-sm">
            <div class="flex justify-between">
              <span class="text-gray-600">Jumlah:</span>
              <span class="font-medium">{{ formatCurrency(paymentData.amount) }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Order ID:</span>
              <span class="font-medium font-mono">{{ paymentData.order_id }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Metode:</span>
              <span class="font-medium">{{ paymentData.payment_method?.toUpperCase() }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Waktu:</span>
              <span class="font-medium">{{ formatDate(paymentData.completed_at) }}</span>
            </div>
          </div>
        </div>
        
        <div class="space-y-3">
          <button @click="goHome" class="btn-primary w-full">
            Kembali ke Dashboard
          </button>
          <button @click="downloadReceipt" class="btn-secondary w-full">
            Download Bukti Pembayaran
          </button>
        </div>
      </div>

      <!-- Processing State -->
      <div v-else-if="status === 'processing'" class="text-center">
        <div class="w-16 h-16 bg-warning-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <ClockIcon class="w-8 h-8 text-warning-600 animate-spin" />
        </div>
        <h1 class="text-2xl font-semibold text-gray-900 mb-2">Memproses Pembayaran</h1>
        <p class="text-gray-600 mb-6">Mohon tunggu, kami sedang memverifikasi pembayaran Anda...</p>
        
        <div class="card p-6">
          <div class="flex items-center space-x-3">
            <div class="w-3 h-3 bg-warning-500 rounded-full animate-pulse"></div>
            <span class="text-sm text-gray-600">Verifikasi pembayaran...</span>
          </div>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="status === 'error'" class="text-center">
        <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <ExclamationTriangleIcon class="w-8 h-8 text-red-600" />
        </div>
        <h1 class="text-2xl font-semibold text-gray-900 mb-2">Terjadi Kesalahan</h1>
        <p class="text-gray-600 mb-6">{{ errorMessage }}</p>
        
        <div class="space-y-3">
          <button @click="retry" class="btn-primary w-full">
            Coba Lagi
          </button>
          <button @click="goHome" class="btn-secondary w-full">
            Kembali ke Dashboard
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div v-else class="text-center">
        <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <div class="w-6 h-6 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <h1 class="text-2xl font-semibold text-gray-900 mb-2">Loading...</h1>
        <p class="text-gray-600">Memuat informasi pembayaran...</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAppStore } from '@/stores'
import { useToast } from 'vue-toastification'
import pakasirService from '@/services/pakasir'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'
import {
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon
} from '@heroicons/vue/24/outline'

const route = useRoute()
const router = useRouter()
const store = useAppStore()
const toast = useToast()

const status = ref('loading')
const paymentData = ref({})
const errorMessage = ref('')

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount)
}

const formatDate = (dateString) => {
  return format(new Date(dateString), 'dd MMMM yyyy, HH:mm', { locale: id })
}

const processWebhook = async () => {
  try {
    status.value = 'processing'
    
    // Get webhook data from URL params or body
    const webhookData = {
      amount: parseInt(route.query.amount),
      order_id: route.query.order_id,
      project: route.query.project,
      status: route.query.status,
      payment_method: route.query.payment_method,
      completed_at: route.query.completed_at || new Date().toISOString()
    }

    // Validate webhook data
    if (!webhookData.amount || !webhookData.order_id) {
      throw new Error('Data pembayaran tidak lengkap')
    }

    // Process the webhook
    await store.handlePaymentWebhook(webhookData)
    
    paymentData.value = webhookData
    status.value = 'success'
    
    toast.success('Pembayaran berhasil diproses!')
  } catch (error) {
    console.error('Webhook processing error:', error)
    errorMessage.value = error.message || 'Gagal memproses pembayaran'
    status.value = 'error'
  }
}

const goHome = () => {
  router.push('/')
}

const retry = () => {
  processWebhook()
}

const downloadReceipt = () => {
  // Generate simple receipt
  const receiptData = {
    orderid: paymentData.value.order_id,
    amount: paymentData.value.amount,
    payment_method: paymentData.value.payment_method,
    completed_at: paymentData.value.completed_at,
    project: 'Kas Kelas 1B SD Islam Al Husna'
  }

  const receiptText = `
BUKTI PEMBAYARAN
Kas Kelas 1B SD Islam Al Husna

Order ID: ${receiptData.orderid}
Jumlah: ${formatCurrency(receiptData.amount)}
Metode: ${receiptData.payment_method?.toUpperCase()}
Waktu: ${formatDate(receiptData.completed_at)}

Terima kasih atas pembayaran Anda!
  `.trim()

  const element = document.createElement('a')
  const file = new Blob([receiptText], { type: 'text/plain' })
  element.href = URL.createObjectURL(file)
  element.download = `receipt-${receiptData.orderid}.txt`
  document.body.appendChild(element)
  element.click()
  document.body.removeChild(element)
}

onMounted(() => {
  processWebhook()
})
</script>
