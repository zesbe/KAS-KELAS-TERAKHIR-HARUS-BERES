<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Invoice Container -->
      <div class="bg-white shadow-xl rounded-lg overflow-hidden" id="invoice-content">
        <!-- Header dengan Logo dan Branding -->
        <div class="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-6">
          <div class="flex justify-between items-start">
            <div>
              <div class="flex items-center space-x-3 mb-4">
                <div class="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                  <span class="text-blue-600 font-bold text-lg">SD</span>
                </div>
                <div>
                  <h1 class="text-2xl font-bold">SD Islam Al Husna</h1>
                  <p class="text-blue-100">Kelas 1B - Sistem Kas Digital</p>
                </div>
              </div>
              <div class="text-sm text-blue-100 space-y-1">
                <p>📍 Komplek Keuangan, Jl. Guntur I</p>
                <p>📞 (021) 7654-321 | 📧 admin@sdislamalhusnakelas1b.sch.id</p>
              </div>
            </div>
            <div class="text-right">
              <div class="bg-white bg-opacity-20 rounded-lg px-4 py-3">
                <h2 class="text-xl font-bold">INVOICE</h2>
                <p class="text-sm">Bukti Pembayaran</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Invoice Details -->
        <div class="px-8 py-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <!-- Student Information -->
            <div>
              <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <UserIcon class="w-5 h-5 mr-2 text-blue-600" />
                Informasi Siswa
              </h3>
              <div class="bg-gray-50 rounded-lg p-4 space-y-2">
                <div class="flex justify-between">
                  <span class="text-gray-600">Nama Lengkap:</span>
                  <span class="font-medium">{{ invoice.student.name }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Nama Panggilan:</span>
                  <span class="font-medium">{{ invoice.student.nickname }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Nomor HP:</span>
                  <span class="font-medium">{{ invoice.student.phone }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Kelas:</span>
                  <span class="font-medium">1B</span>
                </div>
              </div>
            </div>

            <!-- Payment Information -->
            <div>
              <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <DocumentTextIcon class="w-5 h-5 mr-2 text-green-600" />
                Detail Invoice
              </h3>
              <div class="bg-gray-50 rounded-lg p-4 space-y-2">
                <div class="flex justify-between">
                  <span class="text-gray-600">No. Invoice:</span>
                  <span class="font-medium font-mono">{{ invoice.invoiceNumber }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Tanggal Invoice:</span>
                  <span class="font-medium">{{ formatDate(invoice.createdAt) }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Order ID:</span>
                  <span class="font-medium font-mono">{{ invoice.orderId }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Status:</span>
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <CheckCircleIcon class="w-3 h-3 mr-1" />
                    LUNAS
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Payment Details Table -->
          <div class="mb-8">
            <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <CreditCardIcon class="w-5 h-5 mr-2 text-purple-600" />
              Rincian Pembayaran
            </h3>
            <div class="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <table class="w-full">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Keterangan
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Periode
                    </th>
                    <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Jumlah
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm font-medium text-gray-900">{{ invoice.description }}</div>
                      <div class="text-sm text-gray-500">Kas Kelas 1B</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm text-gray-900">{{ invoice.period || getCurrentMonth() }}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-right">
                      <div class="text-sm font-medium text-gray-900">{{ formatCurrency(invoice.amount) }}</div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Payment Summary -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <!-- Payment Method -->
            <div>
              <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <CreditCardIcon class="w-5 h-5 mr-2 text-indigo-600" />
                Metode Pembayaran
              </h3>
              <div class="bg-gray-50 rounded-lg p-4">
                <div class="flex items-center justify-between mb-2">
                  <span class="text-gray-600">Metode:</span>
                  <span class="font-medium">{{ formatPaymentMethod(invoice.paymentMethod) }}</span>
                </div>
                <div class="flex items-center justify-between mb-2">
                  <span class="text-gray-600">Tanggal Bayar:</span>
                  <span class="font-medium">{{ formatDateTime(invoice.paidAt) }}</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-gray-600">Referensi:</span>
                  <span class="font-medium font-mono text-sm">{{ invoice.reference }}</span>
                </div>
              </div>
            </div>

            <!-- Total Summary -->
            <div>
              <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <CalculatorIcon class="w-5 h-5 mr-2 text-emerald-600" />
                Ringkasan Total
              </h3>
              <div class="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
                <div class="space-y-2">
                  <div class="flex justify-between text-sm">
                    <span class="text-gray-600">Subtotal:</span>
                    <span>{{ formatCurrency(invoice.amount) }}</span>
                  </div>
                  <div class="flex justify-between text-sm">
                    <span class="text-gray-600">Biaya Admin:</span>
                    <span>Rp 0</span>
                  </div>
                  <div class="border-t border-green-200 pt-2">
                    <div class="flex justify-between items-center">
                      <span class="text-lg font-semibold text-gray-900">Total Dibayar:</span>
                      <span class="text-xl font-bold text-green-600">{{ formatCurrency(invoice.amount) }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Success Message -->
          <div class="bg-gradient-to-r from-green-100 to-emerald-100 border border-green-200 rounded-lg p-6 mb-8">
            <div class="flex items-center">
              <CheckCircleIcon class="w-8 h-8 text-green-600 mr-4" />
              <div>
                <h4 class="text-lg font-semibold text-green-800">Pembayaran Berhasil!</h4>
                <p class="text-green-700 mt-1">
                  Terima kasih atas pembayaran kas kelas. Pembayaran Anda telah berhasil diproses dan dicatat dalam sistem.
                </p>
              </div>
            </div>
          </div>

          <!-- Important Notes -->
          <div class="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <h4 class="text-lg font-semibold text-blue-800 mb-3 flex items-center">
              <InformationCircleIcon class="w-5 h-5 mr-2" />
              Catatan Penting
            </h4>
            <ul class="text-blue-700 space-y-2 text-sm">
              <li class="flex items-start">
                <span class="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Simpan invoice ini sebagai bukti pembayaran yang sah
              </li>
              <li class="flex items-start">
                <span class="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Pembayaran telah dikonfirmasi dan tercatat dalam sistem kas kelas
              </li>
              <li class="flex items-start">
                <span class="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Untuk pertanyaan, hubungi bendahara kelas atau wali kelas
              </li>
              <li class="flex items-start">
                <span class="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Invoice ini dibuat otomatis oleh sistem dan tidak memerlukan tanda tangan
              </li>
            </ul>
          </div>

          <!-- Contact Information -->
          <div class="border-t border-gray-200 pt-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h5 class="font-semibold text-gray-900 mb-2">Bendahara Kelas 1B</h5>
                <p class="text-sm text-gray-600">Bu Siti Nurhayati</p>
                <p class="text-sm text-gray-600">📱 0812-3456-7890</p>
                <p class="text-sm text-gray-600">✉️ bendahara.1b@sdislamalhusnakelas1b.sch.id</p>
              </div>
              <div>
                <h5 class="font-semibold text-gray-900 mb-2">Wali Kelas 1B</h5>
                <p class="text-sm text-gray-600">Bu Aminah Rahmawati, S.Pd</p>
                <p class="text-sm text-gray-600">📱 0813-9876-5432</p>
                <p class="text-sm text-gray-600">✉️ walikelas.1b@sdislamalhusnakelas1b.sch.id</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="bg-gray-100 px-8 py-4 border-t border-gray-200">
          <div class="flex flex-col md:flex-row justify-between items-center text-sm text-gray-600">
            <div>
              <p>&copy; {{ new Date().getFullYear() }} SD Islam Al Husna - Sistem Kas Digital Kelas 1B</p>
            </div>
            <div class="mt-2 md:mt-0">
              <p>Dicetak pada: {{ formatDateTime(new Date()) }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
        <button
          @click="printInvoice"
          class="btn-primary inline-flex items-center justify-center"
        >
          <PrinterIcon class="w-5 h-5 mr-2" />
          Cetak Invoice
        </button>
        <button
          @click="downloadPDF"
          class="btn-secondary inline-flex items-center justify-center"
        >
          <ArrowDownTrayIcon class="w-5 h-5 mr-2" />
          Download PDF
        </button>
        <button
          @click="shareInvoice"
          class="btn-outline inline-flex items-center justify-center"
        >
          <ShareIcon class="w-5 h-5 mr-2" />
          Bagikan
        </button>
        <router-link
          to="/payments"
          class="btn-outline inline-flex items-center justify-center"
        >
          <ArrowLeftIcon class="w-5 h-5 mr-2" />
          Kembali
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  UserIcon,
  DocumentTextIcon,
  CreditCardIcon,
  CheckCircleIcon,
  CalculatorIcon,
  InformationCircleIcon,
  PrinterIcon,
  ArrowDownTrayIcon,
  ShareIcon,
  ArrowLeftIcon
} from '@heroicons/vue/24/outline'

const route = useRoute()
const router = useRouter()

// Invoice data
const invoice = ref({
  id: '',
  invoiceNumber: '',
  orderId: '',
  student: {
    name: '',
    nickname: '',
    phone: ''
  },
  description: 'Kas Kelas',
  amount: 0,
  period: '',
  paymentMethod: '',
  paidAt: '',
  createdAt: '',
  reference: '',
  status: 'completed'
})

// Loading state
const loading = ref(true)

onMounted(async () => {
  await loadInvoiceData()
})

// Load invoice data from URL params or localStorage
async function loadInvoiceData() {
  try {
    const { orderId, studentId } = route.query
    
    if (orderId) {
      // Load from URL parameters (coming from payment success)
      await loadFromOrderId(orderId)
    } else if (studentId) {
      // Load from student ID
      await loadFromStudentId(studentId)
    } else {
      // Try to load from localStorage (last payment)
      loadFromStorage()
    }
  } catch (error) {
    console.error('Error loading invoice:', error)
    // Fallback to demo data
    loadDemoData()
  } finally {
    loading.value = false
  }
}

async function loadFromOrderId(orderId) {
  // Try to find payment link data
  const stored = localStorage.getItem('paymentLinks')
  if (stored) {
    const links = JSON.parse(stored)
    const paymentLink = links.find(link => link.order_id === orderId)

    if (paymentLink) {
      // Get student data from multiple sources
      let student = null

      // First try from students collection
      const studentsData = localStorage.getItem('students')
      if (studentsData) {
        const students = JSON.parse(studentsData)
        student = students.find(s => s.id === paymentLink.student_id)
      }

      // If not found, try from demo students
      if (!student) {
        const demoData = localStorage.getItem('demo_students')
        if (demoData) {
          const demoStudents = JSON.parse(demoData)
          student = demoStudents.find(s => s.id === paymentLink.student_id)
        }
      }

      // If still not found, check if payment link has embedded student data
      if (!student && paymentLink.student) {
        student = paymentLink.student
      }

      if (student) {
        invoice.value = {
          id: paymentLink.id,
          invoiceNumber: `INV-${orderId.slice(-8).toUpperCase()}`,
          orderId: orderId,
          student: {
            name: student.name,
            nickname: student.nickname || '',
            phone: student.phone || student.parent_phone || ''
          },
          description: paymentLink.description || `Kas Kelas Bulan ${getCurrentMonth()}`,
          amount: paymentLink.amount,
          period: paymentLink.period || getCurrentMonth(),
          paymentMethod: paymentLink.payment_method || 'qris',
          paidAt: paymentLink.completed_at || paymentLink.paid_at || new Date().toISOString(),
          createdAt: paymentLink.created_at || new Date().toISOString(),
          reference: paymentLink.reference || orderId.slice(-8).toUpperCase(),
          status: 'completed'
        }
        return
      }
    }
  }

  // Try to find in transactions data
  const transactionsData = localStorage.getItem('transactions')
  if (transactionsData) {
    const transactions = JSON.parse(transactionsData)
    const transaction = transactions.find(t => t.order_id === orderId || t.id === orderId)

    if (transaction) {
      // Get student data
      let student = null
      const studentsData = localStorage.getItem('students')
      if (studentsData) {
        const students = JSON.parse(studentsData)
        student = students.find(s => s.id === transaction.student_id)
      }

      if (student) {
        invoice.value = {
          id: transaction.id,
          invoiceNumber: `INV-${orderId.slice(-8).toUpperCase()}`,
          orderId: orderId,
          student: {
            name: student.name,
            nickname: student.nickname || '',
            phone: student.phone || student.parent_phone || ''
          },
          description: transaction.description || `Kas Kelas Bulan ${getCurrentMonth()}`,
          amount: transaction.amount,
          period: transaction.period || getCurrentMonth(),
          paymentMethod: transaction.payment_method || 'qris',
          paidAt: transaction.paid_at || transaction.created_at || new Date().toISOString(),
          createdAt: transaction.created_at || new Date().toISOString(),
          reference: transaction.reference || orderId.slice(-8).toUpperCase(),
          status: 'completed'
        }
        return
      }
    }
  }

  // If not found, load demo data
  loadDemoData()
}

async function loadFromStudentId(studentId) {
  let student = null

  // Try to get student data from multiple sources
  const studentsData = localStorage.getItem('students')
  if (studentsData) {
    const students = JSON.parse(studentsData)
    student = students.find(s => s.id === studentId)
  }

  // If not found, try demo students
  if (!student) {
    const demoData = localStorage.getItem('demo_students')
    if (demoData) {
      const demoStudents = JSON.parse(demoData)
      student = demoStudents.find(s => s.id === studentId)
    }
  }

  if (student) {
    // Look for the latest payment for this student
    let latestPayment = null

    // Check payment links
    const paymentLinksData = localStorage.getItem('paymentLinks')
    if (paymentLinksData) {
      const paymentLinks = JSON.parse(paymentLinksData)
      const studentPayments = paymentLinks.filter(p => p.student_id === studentId)
      if (studentPayments.length > 0) {
        latestPayment = studentPayments.sort((a, b) =>
          new Date(b.created_at || b.completed_at || 0) - new Date(a.created_at || a.completed_at || 0)
        )[0]
      }
    }

    // Check transactions
    if (!latestPayment) {
      const transactionsData = localStorage.getItem('transactions')
      if (transactionsData) {
        const transactions = JSON.parse(transactionsData)
        const studentTransactions = transactions.filter(t => t.student_id === studentId)
        if (studentTransactions.length > 0) {
          latestPayment = studentTransactions.sort((a, b) =>
            new Date(b.created_at || 0) - new Date(a.created_at || 0)
          )[0]
        }
      }
    }

    const orderId = latestPayment?.order_id || `KAS${Date.now()}`
    invoice.value = {
      id: latestPayment?.id || `inv_${Date.now()}`,
      invoiceNumber: `INV-${orderId.slice(-8).toUpperCase()}`,
      orderId: orderId,
      student: {
        name: student.name,
        nickname: student.nickname || '',
        phone: student.phone || student.parent_phone || ''
      },
      description: latestPayment?.description || `Kas Kelas Bulan ${getCurrentMonth()}`,
      amount: latestPayment?.amount || 50000,
      period: latestPayment?.period || getCurrentMonth(),
      paymentMethod: latestPayment?.payment_method || 'qris',
      paidAt: latestPayment?.completed_at || latestPayment?.paid_at || new Date().toISOString(),
      createdAt: latestPayment?.created_at || new Date().toISOString(),
      reference: latestPayment?.reference || orderId.slice(-8).toUpperCase(),
      status: 'completed'
    }
    return
  }

  loadDemoData()
}

function loadFromStorage() {
  const stored = localStorage.getItem('lastInvoice')
  if (stored) {
    invoice.value = JSON.parse(stored)
  } else {
    loadDemoData()
  }
}

function loadDemoData() {
  const orderId = `KAS${Date.now()}`
  invoice.value = {
    id: `inv_${Date.now()}`,
    invoiceNumber: `INV-${orderId.slice(-8)}`,
    orderId: orderId,
    student: {
      name: 'Aqilnafi Segara',
      nickname: 'Nafi',
      phone: '+62 856-2468-7313'
    },
    description: 'Kas Kelas Bulan ' + getCurrentMonth(),
    amount: 50000,
    period: getCurrentMonth(),
    paymentMethod: 'qris',
    paidAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    reference: orderId.slice(-8),
    status: 'completed'
  }
}

// Utility functions
function formatCurrency(amount) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(amount)
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

function formatDateTime(dateString) {
  return new Date(dateString).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

function formatPaymentMethod(method) {
  const methodMap = {
    'qris': 'QRIS',
    'bca': 'Transfer BCA',
    'mandiri': 'Transfer Mandiri',
    'bni': 'Transfer BNI',
    'bri': 'Transfer BRI',
    'gopay': 'GoPay',
    'ovo': 'OVO',
    'dana': 'DANA',
    'linkaja': 'LinkAja'
  }
  return methodMap[method?.toLowerCase()] || method?.toUpperCase() || 'Transfer Bank'
}

function getCurrentMonth() {
  return new Date().toLocaleDateString('id-ID', {
    month: 'long',
    year: 'numeric'
  })
}

// Actions
function printInvoice() {
  // Hide action buttons before printing
  const actionButtons = document.querySelector('.mt-8.flex')
  if (actionButtons) {
    actionButtons.style.display = 'none'
  }
  
  window.print()
  
  // Show buttons again after printing
  setTimeout(() => {
    if (actionButtons) {
      actionButtons.style.display = 'flex'
    }
  }, 1000)
}

async function downloadPDF() {
  try {
    // Hide action buttons before generating PDF
    const actionButtons = document.querySelector('.mt-8.flex')
    if (actionButtons) {
      actionButtons.style.display = 'none'
    }

    // Generate PDF content
    const invoiceElement = document.getElementById('invoice-content')
    if (!invoiceElement) {
      throw new Error('Invoice content not found')
    }

    // Create a new window for PDF generation
    const printWindow = window.open('', '_blank')
    if (!printWindow) {
      throw new Error('Could not open print window')
    }

    // Create PDF content with proper styling
    const pdfContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Invoice ${invoice.value.invoiceNumber} - ${invoice.value.student.name}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.4;
            color: #333;
            background: white;
          }
          .invoice-container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            box-shadow: none;
          }
          .header {
            background: linear-gradient(135deg, #2563eb, #1d4ed8);
            color: white;
            padding: 2rem;
          }
          .header-content {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
          }
          .logo-section { flex: 1; }
          .logo-circle {
            width: 60px;
            height: 60px;
            background: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 1rem;
          }
          .logo-text { color: #2563eb; font-weight: bold; font-size: 1.2rem; }
          .school-name { font-size: 1.8rem; font-weight: bold; margin-bottom: 0.5rem; }
          .school-subtitle { color: #bfdbfe; font-size: 0.9rem; margin-bottom: 1rem; }
          .school-address { color: #dbeafe; font-size: 0.8rem; }
          .invoice-badge {
            background: rgba(255,255,255,0.2);
            padding: 1rem;
            border-radius: 8px;
            text-align: center;
          }
          .invoice-title { font-size: 1.3rem; font-weight: bold; }
          .invoice-subtitle { font-size: 0.8rem; margin-top: 0.5rem; }

          .content { padding: 2rem; }
          .section { margin-bottom: 2rem; }
          .section-title {
            font-size: 1.1rem;
            font-weight: 600;
            color: #1f2937;
            margin-bottom: 1rem;
            display: flex;
            align-items: center;
          }
          .icon { width: 20px; height: 20px; margin-right: 8px; }

          .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; }
          .info-box {
            background: #f9fafb;
            border-radius: 8px;
            padding: 1.5rem;
          }
          .info-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 0.75rem;
          }
          .info-row:last-child { margin-bottom: 0; }
          .info-label { color: #6b7280; font-size: 0.9rem; }
          .info-value { font-weight: 500; font-size: 0.9rem; }

          .payment-table {
            width: 100%;
            border-collapse: collapse;
            background: white;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            overflow: hidden;
          }
          .payment-table th {
            background: #f9fafb;
            padding: 1rem;
            text-align: left;
            font-size: 0.8rem;
            font-weight: 600;
            color: #6b7280;
            text-transform: uppercase;
          }
          .payment-table td {
            padding: 1rem;
            border-top: 1px solid #e5e7eb;
          }

          .summary-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; }
          .summary-box {
            background: #f0fdf4;
            border: 1px solid #bbf7d0;
            border-radius: 8px;
            padding: 1.5rem;
          }
          .summary-total {
            font-size: 1.3rem;
            font-weight: bold;
            color: #059669;
          }

          .success-banner {
            background: linear-gradient(135deg, #d1fae5, #a7f3d0);
            border: 1px solid #bbf7d0;
            border-radius: 8px;
            padding: 1.5rem;
            margin: 1.5rem 0;
          }
          .success-title { color: #065f46; font-weight: 600; font-size: 1.1rem; margin-bottom: 0.5rem; }
          .success-text { color: #047857; }

          .notes-box {
            background: #eff6ff;
            border: 1px solid #bfdbfe;
            border-radius: 8px;
            padding: 1.5rem;
          }
          .notes-title { color: #1e40af; font-weight: 600; margin-bottom: 1rem; }
          .notes-list { list-style: none; }
          .notes-list li { color: #1e40af; margin-bottom: 0.5rem; font-size: 0.9rem; }
          .notes-bullet { color: #60a5fa; margin-right: 0.5rem; }

          .contact-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 2rem;
            padding-top: 1.5rem;
            border-top: 1px solid #e5e7eb;
          }
          .contact-box h5 { font-weight: 600; margin-bottom: 0.5rem; }
          .contact-box p { font-size: 0.9rem; color: #6b7280; margin-bottom: 0.25rem; }

          .footer {
            background: #f9fafb;
            padding: 1.5rem;
            border-top: 1px solid #e5e7eb;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          .footer-text { font-size: 0.9rem; color: #6b7280; }

          @media print {
            body { margin: 0; }
            .invoice-container { margin: 0; max-width: none; }
          }
        </style>
      </head>
      <body>
        <div class="invoice-container">
          <div class="header">
            <div class="header-content">
              <div class="logo-section">
                <div class="logo-circle">
                  <span class="logo-text">SD</span>
                </div>
                <h1 class="school-name">SD Islam Al Husna</h1>
                <p class="school-subtitle">Kelas 1B - Sistem Kas Digital</p>
                <div class="school-address">
                  <p>📍 Komplek Keuangan, Jl. Guntur I</p>
                  <p>📞 (021) 7654-321 | 📧 admin@sdislamalhusnakelas1b.sch.id</p>
                </div>
              </div>
              <div class="invoice-badge">
                <div class="invoice-title">INVOICE</div>
                <div class="invoice-subtitle">Bukti Pembayaran</div>
              </div>
            </div>
          </div>

          <div class="content">
            <div class="info-grid">
              <div class="section">
                <h3 class="section-title">👤 Informasi Siswa</h3>
                <div class="info-box">
                  <div class="info-row">
                    <span class="info-label">Nama Lengkap:</span>
                    <span class="info-value">${invoice.value.student.name}</span>
                  </div>
                  <div class="info-row">
                    <span class="info-label">Nama Panggilan:</span>
                    <span class="info-value">${invoice.value.student.nickname || '-'}</span>
                  </div>
                  <div class="info-row">
                    <span class="info-label">Nomor HP:</span>
                    <span class="info-value">${invoice.value.student.phone || '-'}</span>
                  </div>
                  <div class="info-row">
                    <span class="info-label">Kelas:</span>
                    <span class="info-value">1B</span>
                  </div>
                </div>
              </div>

              <div class="section">
                <h3 class="section-title">📄 Detail Invoice</h3>
                <div class="info-box">
                  <div class="info-row">
                    <span class="info-label">No. Invoice:</span>
                    <span class="info-value">${invoice.value.invoiceNumber}</span>
                  </div>
                  <div class="info-row">
                    <span class="info-label">Tanggal Invoice:</span>
                    <span class="info-value">${formatDate(invoice.value.createdAt)}</span>
                  </div>
                  <div class="info-row">
                    <span class="info-label">Order ID:</span>
                    <span class="info-value">${invoice.value.orderId}</span>
                  </div>
                  <div class="info-row">
                    <span class="info-label">Status:</span>
                    <span class="info-value" style="color: #059669; font-weight: 600;">✅ LUNAS</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="section">
              <h3 class="section-title">💳 Rincian Pembayaran</h3>
              <table class="payment-table">
                <thead>
                  <tr>
                    <th>Keterangan</th>
                    <th>Periode</th>
                    <th style="text-align: right;">Jumlah</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <div style="font-weight: 500;">${invoice.value.description}</div>
                      <div style="color: #6b7280; font-size: 0.9rem;">Kas Kelas 1B</div>
                    </td>
                    <td>${invoice.value.period || getCurrentMonth()}</td>
                    <td style="text-align: right; font-weight: 500;">${formatCurrency(invoice.value.amount)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="summary-grid">
              <div class="section">
                <h3 class="section-title">💳 Metode Pembayaran</h3>
                <div class="info-box">
                  <div class="info-row">
                    <span class="info-label">Metode:</span>
                    <span class="info-value">${formatPaymentMethod(invoice.value.paymentMethod)}</span>
                  </div>
                  <div class="info-row">
                    <span class="info-label">Tanggal Bayar:</span>
                    <span class="info-value">${formatDateTime(invoice.value.paidAt)}</span>
                  </div>
                  <div class="info-row">
                    <span class="info-label">Referensi:</span>
                    <span class="info-value">${invoice.value.reference}</span>
                  </div>
                </div>
              </div>

              <div class="section">
                <h3 class="section-title">💰 Ringkasan Total</h3>
                <div class="summary-box">
                  <div class="info-row">
                    <span class="info-label">Subtotal:</span>
                    <span class="info-value">${formatCurrency(invoice.value.amount)}</span>
                  </div>
                  <div class="info-row">
                    <span class="info-label">Biaya Admin:</span>
                    <span class="info-value">Rp 0</span>
                  </div>
                  <div style="border-top: 1px solid #bbf7d0; padding-top: 0.75rem; margin-top: 0.75rem;">
                    <div class="info-row">
                      <span style="font-size: 1.1rem; font-weight: 600;">Total Dibayar:</span>
                      <span class="summary-total">${formatCurrency(invoice.value.amount)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="success-banner">
              <div class="success-title">✅ Pembayaran Berhasil!</div>
              <div class="success-text">
                Terima kasih atas pembayaran kas kelas. Pembayaran Anda telah berhasil diproses dan dicatat dalam sistem.
              </div>
            </div>

            <div class="notes-box">
              <h4 class="notes-title">ℹ️ Catatan Penting</h4>
              <ul class="notes-list">
                <li><span class="notes-bullet">•</span> Simpan invoice ini sebagai bukti pembayaran yang sah</li>
                <li><span class="notes-bullet">•</span> Pembayaran telah dikonfirmasi dan tercatat dalam sistem kas kelas</li>
                <li><span class="notes-bullet">•</span> Untuk pertanyaan, hubungi bendahara kelas atau wali kelas</li>
                <li><span class="notes-bullet">•</span> Invoice ini dibuat otomatis oleh sistem dan tidak memerlukan tanda tangan</li>
              </ul>
            </div>

            <div class="contact-grid">
              <div class="contact-box">
                <h5>Bendahara Kelas 1B</h5>
                <p>Bu Siti Nurhayati</p>
                <p>📱 0812-3456-7890</p>
                <p>✉️ bendahara.1b@sdislamalhusnakelas1b.sch.id</p>
              </div>
              <div class="contact-box">
                <h5>Wali Kelas 1B</h5>
                <p>Bu Aminah Rahmawati, S.Pd</p>
                <p>📱 0813-9876-5432</p>
                <p>✉️ walikelas.1b@sdislamalhusnakelas1b.sch.id</p>
              </div>
            </div>
          </div>

          <div class="footer">
            <div class="footer-text">
              © ${new Date().getFullYear()} SD Islam Al Husna - Sistem Kas Digital Kelas 1B
            </div>
            <div class="footer-text">
              Dicetak pada: ${formatDateTime(new Date())}
            </div>
          </div>
        </div>
      </body>
      </html>
    `

    // Write content to new window
    printWindow.document.write(pdfContent)
    printWindow.document.close()

    // Wait for content to load then trigger print
    printWindow.addEventListener('load', () => {
      setTimeout(() => {
        printWindow.print()

        // Close window after printing
        setTimeout(() => {
          printWindow.close()
        }, 1000)
      }, 500)
    })

    // Show action buttons again
    setTimeout(() => {
      if (actionButtons) {
        actionButtons.style.display = 'flex'
      }
    }, 2000)

  } catch (error) {
    console.error('Error generating PDF:', error)
    alert('Terjadi kesalahan saat membuat PDF. Silakan coba lagi.')

    // Ensure buttons are shown again
    const actionButtons = document.querySelector('.mt-8.flex')
    if (actionButtons) {
      actionButtons.style.display = 'flex'
    }
  }
}

function shareInvoice() {
  if (navigator.share) {
    navigator.share({
      title: `Invoice ${invoice.value.invoiceNumber}`,
      text: `Invoice pembayaran kas kelas untuk ${invoice.value.student.name}`,
      url: window.location.href
    })
  } else {
    // Fallback: copy to clipboard
    navigator.clipboard.writeText(window.location.href)
    alert('Link invoice telah disalin ke clipboard!')
  }
}

// Save to localStorage for future reference
function saveInvoice() {
  localStorage.setItem('lastInvoice', JSON.stringify(invoice.value))
}

// Save when data changes
computed(() => {
  if (invoice.value.id) {
    saveInvoice()
  }
  return invoice.value
})
</script>

<style scoped>
@media print {
  .btn-primary,
  .btn-secondary,
  .btn-outline {
    display: none !important;
  }
  
  .min-h-screen {
    min-height: auto;
  }
  
  .shadow-xl {
    box-shadow: none !important;
  }
  
  .bg-gray-50 {
    background-color: white !important;
  }
}

.btn-primary {
  @apply bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200;
}

.btn-secondary {
  @apply bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200;
}

.btn-outline {
  @apply border border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-900 font-medium py-2 px-4 rounded-lg transition-colors duration-200 bg-white hover:bg-gray-50;
}
</style>
