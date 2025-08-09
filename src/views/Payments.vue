<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
      <div>
        <h1 class="text-xl sm:text-2xl font-semibold text-gray-900">Link Pembayaran</h1>
        <p class="text-sm text-gray-500 mt-1">Kelola link pembayaran untuk kas kelas</p>
      </div>
      <div class="flex flex-col sm:flex-row gap-3">
        <router-link
          to="/invoice"
          class="btn-outline w-full sm:w-auto inline-flex items-center justify-center"
        >
          <DocumentTextIcon class="w-4 h-4 mr-2" />
          <span class="hidden sm:inline">Lihat Invoice</span>
          <span class="sm:hidden">Invoice</span>
        </router-link>
        <button
          @click="showCreateModal = true"
          class="btn-primary w-full sm:w-auto"
        >
          <PlusIcon class="w-4 h-4 mr-2" />
          <span class="hidden sm:inline">Buat Link Bayar</span>
          <span class="sm:hidden">Buat Link</span>
        </button>
      </div>
    </div>

    <!-- Tabs -->
    <div class="border-b border-gray-200">
      <nav class="-mb-px flex space-x-8">
        <button
          @click="activeTab = 'single'"
          :class="[
            'whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm',
            activeTab === 'single'
              ? 'border-primary-500 text-primary-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          ]"
        >
          Pembayaran Bulanan
        </button>
        <button
          @click="activeTab = 'multi'"
          :class="[
            'whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm',
            activeTab === 'multi'
              ? 'border-primary-500 text-primary-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          ]"
        >
          Multi-Bulan
          <span class="ml-2 bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5 rounded-full">
            NEW
          </span>
        </button>
      </nav>
    </div>

    <!-- Tab Content -->
    <div v-if="activeTab === 'single'">
      <!-- Summary Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div class="card p-6">
        <div class="flex items-center">
          <div class="p-2 bg-primary-100 rounded-lg">
            <CreditCardIcon class="w-6 h-6 text-primary-600" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Total Link</p>
            <p class="text-2xl font-semibold text-gray-900">
              {{ store.paymentLinks.length }}
            </p>
          </div>
        </div>
      </div>

      <div class="card p-6">
        <div class="flex items-center">
          <div class="p-2 bg-warning-100 rounded-lg">
            <ClockIcon class="w-6 h-6 text-warning-600" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Pending</p>
            <p class="text-2xl font-semibold text-gray-900">
              {{ pendingPayments.length }}
            </p>
          </div>
        </div>
      </div>

      <div class="card p-6">
        <div class="flex items-center">
          <div class="p-2 bg-success-100 rounded-lg">
            <CheckCircleIcon class="w-6 h-6 text-success-600" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Selesai</p>
            <p class="text-2xl font-semibold text-gray-900">
              {{ completedPayments.length }}
            </p>
          </div>
        </div>
      </div>

      <div class="card p-6">
        <div class="flex items-center">
          <div class="p-2 bg-success-100 rounded-lg">
            <BanknotesIcon class="w-6 h-6 text-success-600" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Total Terkumpul</p>
            <p class="text-2xl font-semibold text-gray-900">
              {{ formatCurrency(totalCollected) }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Generate -->
    <div class="card p-6 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border-2 border-blue-200">
      <h3 class="text-xl font-bold text-gray-800 mb-6 flex items-center">
        <span class="text-2xl mr-2">⚡</span>
        Generate Link Pembayaran Cepat
      </h3>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2">💰 Jumlah</label>
          <input
            v-model.number="quickGenerate.amount"
            type="number"
            min="1"
            class="input-field"
            placeholder="Contoh: 50000"
          />
        </div>

        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2">📅 Bulan Pembayaran</label>
          <select v-model="quickGenerate.paymentMonth" class="input-field">
            <option v-for="month in availableMonths" :key="month.value" :value="month.value">
              {{ month.label }}
            </option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2">📝 Keterangan</label>
          <input
            v-model="quickGenerate.description"
            type="text"
            class="input-field"
            :placeholder="quickGenerate.autoDescription"
          />
        </div>

        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2">👥 Target Siswa</label>
          <select v-model="quickGenerate.target" class="input-field">
            <option value="all">Semua Siswa</option>
            <option value="unpaid">Siswa Belum Bayar</option>
            <option value="selected">Pilih Manual</option>
          </select>
        </div>

        <div class="flex items-end">
          <button
            @click="generateBulkLinks"
            :disabled="!quickGenerate.amount || (!quickGenerate.description && !quickGenerate.autoDescription) || generating"
            class="btn-primary w-full flex items-center justify-center"
          >
            <span v-if="generating" class="flex items-center">
              <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Generating...
            </span>
            <span v-else class="flex items-center">
              <span class="mr-1">⚡</span>
              Generate Links
            </span>
          </button>
        </div>
      </div>
      
      <!-- Student Selection for Manual Target -->
      <div v-if="quickGenerate.target === 'selected'" class="mt-4">
        <label class="block text-sm font-medium text-gray-700 mb-2">Pilih Siswa</label>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 max-h-48 overflow-y-auto">
          <label 
            v-for="student in store.students" 
            :key="student.id"
            class="flex items-center space-x-2 p-2 border rounded-lg hover:bg-gray-50"
          >
            <input 
              type="checkbox" 
              :value="student.id"
              v-model="quickGenerate.selectedStudents"
              class="rounded"
            />
            <span class="text-sm">{{ student.name }}</span>
          </label>
        </div>
      </div>
    </div>

    <!-- Bulk WhatsApp Messaging -->
    <div class="card p-4 sm:p-6">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">Kirim Pesan WhatsApp Massal</h3>

      <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
        <p class="text-sm text-yellow-800">
          <strong>Catatan:</strong> Pengiriman pesan langsung dari browser mungkin diblokir oleh CORS policy.
          Untuk production yang stabil, implementasikan API calls melalui backend server.
        </p>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Target Pesan</label>
          <select v-model="bulkMessage.target" class="input-field">
            <option value="pending">Link Pembayaran Pending</option>
            <option value="all">Semua Link Pembayaran</option>
            <option value="selected">Pilih Manual</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Jeda Antar Pesan (menit)</label>
          <input
            v-model.number="bulkMessage.delayMinutes"
            type="number"
            min="1"
            max="60"
            class="input-field"
            placeholder="1"
          />
        </div>

        <div class="sm:col-span-2">
          <label class="block text-sm font-medium text-gray-700 mb-2">Template Pesan</label>
          <select v-model="bulkMessage.template" class="input-field">
            <option value="reminder">Pengingat Pembayaran</option>
            <option value="custom">Pesan Kustom</option>
          </select>
        </div>
      </div>

      <!-- Custom Message Template -->
      <div v-if="bulkMessage.template === 'custom'" class="mt-4">
        <label class="block text-sm font-medium text-gray-700 mb-2">Pesan Kustom</label>
        <textarea
          v-model="bulkMessage.customMessage"
          rows="4"
          class="input-field"
          placeholder="Tulis pesan kustom di sini..."
        ></textarea>
        <p class="text-sm text-gray-500 mt-1">
          Gunakan {nama}, {jumlah}, {keterangan}, {link} untuk data dinamis
        </p>
      </div>

      <!-- Payment Selection for Manual Target -->
      <div v-if="bulkMessage.target === 'selected'" class="mt-4">
        <label class="block text-sm font-medium text-gray-700 mb-2">Pilih Link Pembayaran</label>
        <div class="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto">
          <label
            v-for="payment in store.paymentLinks"
            :key="payment.id"
            class="flex items-center space-x-2 p-2 border rounded-lg hover:bg-gray-50"
          >
            <input
              type="checkbox"
              :value="payment.id"
              v-model="bulkMessage.selectedPayments"
              class="rounded"
            />
            <span class="text-sm">{{ payment.student?.name }} - {{ formatCurrency(payment.amount) }} - {{ payment.description }}</span>
          </label>
        </div>
      </div>

      <div class="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
        <div class="text-sm text-gray-600">
          <span class="font-medium">{{ getTargetPayments().length }}</span> pesan akan dikirim
        </div>
        <button
          @click="sendBulkMessages"
          :disabled="sending || getTargetPayments().length === 0"
          class="btn-primary"
        >
          {{ sending ? 'Mengirim...' : 'Kirim Pesan WhatsApp' }}
        </button>
      </div>
    </div>

    <!-- Payments Table -->
    <div class="card p-4 sm:p-6">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 space-y-2 sm:space-y-0">
        <h3 class="text-lg font-semibold text-gray-900">Daftar Link Pembayaran</h3>
        <div class="flex space-x-2">
          <select v-model="statusFilter" class="input-field w-full sm:w-auto">
            <option value="">Semua Status</option>
            <option value="pending">Pending</option>
            <option value="completed">Selesai</option>
            <option value="expired">Expired</option>
          </select>
          <button
            @click="showPaymentsPdfModal = true"
            class="btn-secondary flex items-center"
            title="Laporan PDF Options"
          >
            <DocumentArrowDownIcon class="w-4 h-4 mr-2" />
            <span class="hidden sm:inline">Laporan PDF</span>
            <span class="sm:hidden">PDF</span>
          </button>
        </div>
      </div>
      
      <!-- Mobile Card View -->
      <div class="block sm:hidden space-y-4">
        <div v-for="payment in filteredPayments" :key="payment.id" class="bg-gray-50 rounded-lg p-4">
          <div class="flex items-center justify-between mb-2">
            <div class="flex items-center">
              <div class="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                <span class="text-primary-600 font-semibold text-xs">
                  {{ payment.student?.nickname?.charAt(0)?.toUpperCase() }}
                </span>
              </div>
              <div>
                <div class="font-medium text-sm">{{ payment.student?.name }}</div>
                <div class="text-gray-500 text-xs">{{ payment.student?.nickname }}</div>
              </div>
            </div>
            <span :class="getStatusClass(payment.status)">
              {{ getStatusLabel(payment.status) }}
            </span>
          </div>
          <div class="space-y-1 text-sm">
            <div class="flex justify-between">
              <span class="text-gray-600">Jumlah:</span>
              <span class="font-medium">{{ formatCurrency(payment.amount) }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Keterangan:</span>
              <span class="text-right">{{ payment.description }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Order ID:</span>
              <span class="font-mono text-xs">{{ payment.order_id }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Dibuat:</span>
              <span class="text-xs">{{ formatDate(payment.created_at) }}</span>
            </div>
          </div>
          <div class="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-gray-200">
            <button
              @click="copyPaymentLink(payment)"
              class="flex items-center justify-center text-primary-600 hover:text-primary-900 py-2"
              title="Copy Link"
            >
              <LinkIcon class="w-4 h-4 mr-1" />
              <span class="text-xs">Copy</span>
            </button>
            <button
              @click="sendPaymentLink(payment)"
              class="flex items-center justify-center text-success-600 hover:text-success-900 py-2"
              title="Kirim via WhatsApp"
            >
              <ChatBubbleLeftIcon class="w-4 h-4 mr-1" />
              <span class="text-xs">Kirim</span>
            </button>
            <button
              @click="viewInvoice(payment)"
              class="flex items-center justify-center text-purple-600 hover:text-purple-900 py-2"
              title="Lihat Invoice"
            >
              <DocumentTextIcon class="w-4 h-4 mr-1" />
              <span class="text-xs">Invoice</span>
            </button>
            <button
              v-if="payment.status === 'pending'"
              @click="markAsPaid(payment)"
              class="flex items-center justify-center text-green-600 hover:text-green-900 py-2"
              title="Tandai Lunas"
            >
              <CheckCircleIcon class="w-4 h-4 mr-1" />
              <span class="text-xs">Lunas</span>
            </button>
            <button
              @click="checkPaymentStatus(payment)"
              class="flex items-center justify-center text-warning-600 hover:text-warning-900 py-2"
              title="Cek Status"
            >
              <ArrowPathIcon class="w-4 h-4 mr-1" />
              <span class="text-xs">Cek</span>
            </button>
          </div>
          <div class="flex justify-center mt-2">
            <button
              @click="deletePaymentLink(payment)"
              class="flex items-center justify-center text-red-600 hover:text-red-900 py-2 w-full"
            >
              <TrashIcon class="w-4 h-4 mr-1" />
              <span class="text-xs">Hapus</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Desktop Table View -->
      <div class="hidden sm:block overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Siswa
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Order ID
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Keterangan
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Jumlah
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Dibuat
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="payment in filteredPayments" :key="payment.id">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <div class="flex items-center">
                  <div class="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                    <span class="text-primary-600 font-semibold text-xs">
                      {{ payment.student?.nickname?.charAt(0)?.toUpperCase() }}
                    </span>
                  </div>
                  <div>
                    <div class="font-medium">{{ payment.student?.name }}</div>
                    <div class="text-gray-500 text-xs">{{ payment.student?.nickname }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-500">
                {{ payment.order_id }}
              </td>
              <td class="px-6 py-4 text-sm text-gray-500">
                {{ payment.description }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {{ formatCurrency(payment.amount) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="getStatusClass(payment.status)">
                  {{ getStatusLabel(payment.status) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(payment.created_at) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div class="flex items-center space-x-2">
                  <button
                    @click="copyPaymentLink(payment)"
                    class="text-primary-600 hover:text-primary-900"
                    title="Copy Link"
                  >
                    <LinkIcon class="w-4 h-4" />
                  </button>
                  <button
                    @click="sendPaymentLink(payment)"
                    class="text-success-600 hover:text-success-900"
                    title="Kirim via WhatsApp"
                  >
                    <ChatBubbleLeftIcon class="w-4 h-4" />
                  </button>
                  <button
                    v-if="payment.status === 'pending'"
                    @click="markAsPaid(payment)"
                    class="text-green-600 hover:text-green-900"
                    title="Tandai Lunas"
                  >
                    <CheckCircleIcon class="w-4 h-4" />
                  </button>
                  <button
                    @click="viewInvoice(payment)"
                    class="text-purple-600 hover:text-purple-900"
                    title="Lihat Invoice"
                  >
                    <DocumentTextIcon class="w-4 h-4" />
                  </button>
                  <button
                    @click="checkPaymentStatus(payment)"
                    class="text-warning-600 hover:text-warning-900"
                    title="Cek Status"
                  >
                    <ArrowPathIcon class="w-4 h-4" />
                  </button>
                  <button
                    @click="deletePaymentLink(payment)"
                    class="text-red-600 hover:text-red-900"
                    title="Hapus"
                  >
                    <TrashIcon class="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
        
      <div v-if="filteredPayments.length === 0" class="text-center py-8">
        <p class="text-sm text-gray-500">Tidak ada link pembayaran yang ditemukan</p>
      </div>
    </div>

    <!-- Create Payment Link Modal -->
    <div
      v-if="showCreateModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <div class="bg-white rounded-2xl max-w-lg w-full mx-4 p-6 shadow-2xl">
        <h3 class="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <span class="text-2xl mr-2">💳</span>
          Buat Link Pembayaran
        </h3>

        <form @submit.prevent="createSingleLink" class="space-y-4">
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">👤 Siswa</label>
            <select v-model="singleLink.studentId" required class="input-field">
              <option value="">Pilih Siswa</option>
              <option v-for="student in store.students" :key="student.id" :value="student.id">
                {{ student.name }} ({{ student.nickname }})
              </option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">💰 Jumlah</label>
            <input
              v-model.number="singleLink.amount"
              type="number"
              min="1"
              required
              class="input-field"
              placeholder="Masukkan jumlah"
            />
          </div>

          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">📅 Bulan Pembayaran</label>
            <select v-model="singleLink.paymentMonth" required class="input-field">
              <option v-for="month in availableMonths" :key="month.value" :value="month.value">
                {{ month.label }}
              </option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">📝 Keterangan</label>
            <input
              v-model="singleLink.description"
              type="text"
              class="input-field"
              :placeholder="singleLink.autoDescription"
            />
            <p class="text-xs text-gray-500 mt-1">Kosongkan untuk menggunakan keterangan otomatis</p>
          </div>

          <div class="flex justify-end space-x-3 pt-6">
            <button
              type="button"
              @click="showCreateModal = false"
              class="btn-secondary"
            >
              Batal
            </button>
            <button
              type="submit"
              :disabled="creating"
              class="btn-primary flex items-center"
            >
              <span v-if="creating" class="flex items-center">
                <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Membuat...
              </span>
              <span v-else class="flex items-center">
                <span class="mr-1">💳</span>
                Buat Link
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Payment Link Preview Modal -->
    <div
      v-if="showPreviewModal && previewPayment"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <div class="bg-white rounded-lg max-w-md w-full mx-4 p-4 sm:p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Link Pembayaran</h3>
        
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Siswa</label>
            <p class="text-sm text-gray-900">{{ previewPayment.student?.name }}</p>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Jumlah</label>
            <p class="text-sm text-gray-900">{{ formatCurrency(previewPayment.amount) }}</p>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Order ID</label>
            <p class="text-sm font-mono text-gray-900">{{ previewPayment.order_id }}</p>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Link Pembayaran</label>
            <div class="flex items-center space-x-2">
              <input 
                :value="previewPayment.payment_url"
                readonly
                class="input-field text-xs"
              />
              <button 
                @click="copyToClipboard(previewPayment.payment_url)"
                class="btn-secondary p-2"
              >
                <DocumentDuplicateIcon class="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
        
        <div class="flex justify-end space-x-3 pt-4">
          <button 
            @click="showPreviewModal = false"
            class="btn-secondary"
          >
            Tutup
          </button>
          <button
            @click="sendWhatsAppMessage(previewPayment)"
            class="btn-success"
          >
            <ChatBubbleLeftIcon class="w-4 h-4 mr-2" />
            Kirim via WhatsApp
          </button>
        </div>
      </div>
    </div>

    <!-- PDF Action Modal -->
    <PdfActionModal
      :show="showPaymentsPdfModal"
      @close="showPaymentsPdfModal = false"
      @print="handlePaymentsPrint"
      @download="handlePaymentsDownload"
      @preview="handlePaymentsPreview"
    />

    <!-- CORS Error Modal -->
    <div
      v-if="showCorsErrorModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <div class="bg-white rounded-lg max-w-md w-full mx-4 p-4 sm:p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Tidak Dapat Mengirim Pesan</h3>

        <div class="space-y-4">
          <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p class="text-sm text-yellow-800">
              <strong>CORS Error:</strong> Browser memblokir API call langsung ke StarSender.
              Untuk production, implementasikan API calls melalui backend server.
            </p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Pesan untuk {{ corsErrorData.studentName }}:</label>
            <textarea
              :value="corsErrorData.message"
              readonly
              rows="6"
              class="input-field text-xs"
            ></textarea>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Nomor WhatsApp:</label>
            <div class="flex items-center space-x-2">
              <input
                :value="corsErrorData.phone"
                readonly
                class="input-field text-sm"
              />
              <button
                @click="copyToClipboard(corsErrorData.phone)"
                class="btn-secondary p-2"
                title="Copy nomor"
              >
                <DocumentDuplicateIcon class="w-4 h-4" />
              </button>
            </div>
          </div>

          <div class="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p class="text-sm text-blue-800">
              <strong>Alternatif:</strong> Copy pesan dan nomor di atas, lalu kirim manual melalui WhatsApp Web atau aplikasi WhatsApp.
            </p>
          </div>
        </div>

        <div class="flex justify-between space-x-3 pt-4">
          <button
            @click="copyMessageAndNumber"
            class="btn-primary flex-1"
          >
            Copy Pesan & Nomor
          </button>
          <button
            @click="openWhatsAppWeb"
            class="btn-success flex-1"
          >
            Buka WhatsApp Web
          </button>
          <button
            @click="showCorsErrorModal = false"
            class="btn-secondary"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
    </div>

    <!-- Multi-Month Tab -->
    <div v-else-if="activeTab === 'multi'">
      <MultiMonthPayment />
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useAppStore } from '@/stores'
import { useToast } from 'vue-toastification'
import { useRouter } from 'vue-router'
import pakasirService from '@/services/pakasir'
import MultiMonthPayment from '@/components/MultiMonthPayment.vue'
import PdfActionModal from '@/components/PdfActionModal.vue'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'
import { getIndonesianTimeGreeting, getIndonesianTime } from '@/utils/timeGreeting'
import {
  PlusIcon,
  CreditCardIcon,
  ClockIcon,
  CheckCircleIcon,
  BanknotesIcon,
  LinkIcon,
  ChatBubbleLeftIcon,
  ArrowPathIcon,
  TrashIcon,
  DocumentDuplicateIcon,
  DocumentTextIcon,
  DocumentArrowDownIcon
} from '@heroicons/vue/24/outline'

const store = useAppStore()
const toast = useToast()
const router = useRouter()

const showCreateModal = ref(false)
const showPreviewModal = ref(false)
const previewPayment = ref(null)
const statusFilter = ref('')
const generating = ref(false)
const creating = ref(false)
const activeTab = ref('single')

// Generate available months for payment (academic year style)
const generateAvailableMonths = () => {
  const months = []
  const currentDate = new Date()
  const currentYear = currentDate.getFullYear()

  // Academic year months (August to July)
  const academicMonths = [
    { month: 7, name: 'Agustus' },   // August (7)
    { month: 8, name: 'September' }, // September (8)
    { month: 9, name: 'Oktober' },   // October (9)
    { month: 10, name: 'November' }, // November (10)
    { month: 11, name: 'Desember' }, // December (11)
    { month: 0, name: 'Januari' },   // January (0) - next year
    { month: 1, name: 'Februari' },  // February (1) - next year
    { month: 2, name: 'Maret' },     // March (2) - next year
    { month: 3, name: 'April' },     // April (3) - next year
    { month: 4, name: 'Mei' },       // May (4) - next year
    { month: 5, name: 'Juni' },      // June (5) - next year
    { month: 6, name: 'Juli' }       // July (6) - next year
  ]

  academicMonths.forEach(({ month, name }) => {
    // For August-December, use current year
    // For January-July, use next year
    const year = month >= 7 ? currentYear : currentYear + 1
    const monthDate = new Date(year, month, 1)
    const monthCode = monthDate.toISOString().slice(0, 7) // YYYY-MM

    months.push({
      value: monthCode,
      label: `${name} ${year}`,
      name: name,
      year: year
    })
  })

  return months
}

const availableMonths = ref(generateAvailableMonths())

// Find current month or default to first available
const getCurrentMonth = () => {
  const currentMonthCode = new Date().toISOString().slice(0, 7)
  const foundMonth = availableMonths.value.find(m => m.value === currentMonthCode)
  return foundMonth ? foundMonth.value : availableMonths.value[0].value
}

const quickGenerate = reactive({
  amount: 50000,
  paymentMonth: getCurrentMonth(),
  description: '',
  target: 'all',
  selectedStudents: []
})

// Auto-generate description based on selected month
const autoDescription = computed(() => {
  const selectedMonth = availableMonths.value.find(m => m.value === quickGenerate.paymentMonth)
  return selectedMonth ? `Kas Kelas ${selectedMonth.name} ${selectedMonth.year}` : 'Kas Bulanan'
})

// Update quickGenerate to include auto description
quickGenerate.autoDescription = autoDescription

const singleLink = reactive({
  studentId: '',
  amount: 50000,
  paymentMonth: getCurrentMonth(),
  description: ''
})

// Auto-generate description for single link based on selected month
const singleAutoDescription = computed(() => {
  const selectedMonth = availableMonths.value.find(m => m.value === singleLink.paymentMonth)
  return selectedMonth ? `Kas Kelas ${selectedMonth.name} ${selectedMonth.year}` : 'Kas Bulanan'
})

// Add auto description to singleLink
singleLink.autoDescription = singleAutoDescription

const bulkMessage = reactive({
  target: 'pending',
  delayMinutes: 1,
  template: 'reminder',
  customMessage: '',
  selectedPayments: []
})

const sending = ref(false)
const showCorsErrorModal = ref(false)
const corsErrorData = ref({
  phone: '',
  message: '',
  studentName: ''
})

const pendingPayments = computed(() => {
  return store.paymentLinks.filter(p => p.status === 'pending')
})

const completedPayments = computed(() => {
  return store.paymentLinks.filter(p => p.status === 'completed')
})

const totalCollected = computed(() => {
  return completedPayments.value.reduce((sum, p) => sum + p.amount, 0)
})

const filteredPayments = computed(() => {
  let payments = [...store.paymentLinks]

  if (statusFilter.value) {
    payments = payments.filter(p => p.status === statusFilter.value)
  }

  return payments.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
})



const formatCurrency = (amount) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount)
}

const formatDate = (dateString) => {
  return format(new Date(dateString), 'dd MMM yyyy HH:mm', { locale: id })
}

const getStatusLabel = (status) => {
  const labels = {
    pending: 'Pending',
    completed: 'Selesai',
    expired: 'Expired'
  }
  return labels[status] || status
}

const getStatusClass = (status) => {
  const classes = {
    pending: 'inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-warning-100 text-warning-800',
    completed: 'inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-success-100 text-success-800',
    expired: 'inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800'
  }
  return classes[status] || classes.pending
}

const generateBulkLinks = async () => {
  try {
    generating.value = true

    let targetStudents = []
    const selectedMonth = availableMonths.value.find(m => m.value === quickGenerate.paymentMonth)
    const monthDisplay = selectedMonth ? `${selectedMonth.name} ${selectedMonth.year}` : 'Bulan terpilih'

    // Use description or auto-generated description
    const finalDescription = quickGenerate.description || autoDescription.value

    if (quickGenerate.target === 'all') {
      targetStudents = store.students
    } else if (quickGenerate.target === 'unpaid') {
      // Filter students who haven't paid for the selected month
      const paidStudentIds = store.transactions
        .filter(t => {
          const transactionMonth = new Date(t.created_at).toISOString().slice(0, 7)
          return t.type === 'income' &&
                 t.status === 'completed' &&
                 transactionMonth === quickGenerate.paymentMonth
        })
        .map(t => t.student_id)

      targetStudents = store.students.filter(s => !paidStudentIds.includes(s.id))

      if (targetStudents.length === 0) {
        toast.info(`🎉 Semua siswa sudah membayar untuk ${monthDisplay}!`)
        return
      }
    } else if (quickGenerate.target === 'selected') {
      targetStudents = store.students.filter(s => quickGenerate.selectedStudents.includes(s.id))
    }

    // Show confirmation for bulk generation
    if (targetStudents.length > 5) {
      const confirmed = confirm(`Generate link pembayaran untuk ${targetStudents.length} siswa?\n\n📅 Bulan: ${monthDisplay}\n💰 Jumlah: ${formatCurrency(quickGenerate.amount)}\n📝 Keterangan: ${finalDescription}`)
      if (!confirmed) return
    }

    // Generate payment links for each student
    const results = []
    for (const student of targetStudents) {
      try {
        await store.generatePaymentLink(
          student.id,
          quickGenerate.amount,
          finalDescription
        )
        results.push({ success: true, student: student.name })
      } catch (error) {
        results.push({ success: false, student: student.name, error: error.message })
      }
    }

    const successful = results.filter(r => r.success).length
    const failed = results.filter(r => !r.success).length

    if (successful > 0) {
      toast.success(`✅ Berhasil generate ${successful} link pembayaran untuk ${monthDisplay}`)
    }
    if (failed > 0) {
      toast.warning(`⚠️ ${failed} link gagal dibuat (mungkin siswa sudah bayar)`)
    }

    // Reset form
    quickGenerate.selectedStudents = []
  } catch (error) {
    toast.error('Gagal generate link pembayaran: ' + error.message)
    console.error('Error generating bulk links:', error)
  } finally {
    generating.value = false
  }
}

const createSingleLink = async () => {
  try {
    creating.value = true

    const student = store.students.find(s => s.id === singleLink.studentId)
    const selectedMonth = availableMonths.value.find(m => m.value === singleLink.paymentMonth)
    const monthDisplay = selectedMonth ? `${selectedMonth.name} ${selectedMonth.year}` : 'Bulan terpilih'

    // Use description or auto-generated description
    const finalDescription = singleLink.description || singleAutoDescription.value

    await store.generatePaymentLink(
      singleLink.studentId,
      singleLink.amount,
      finalDescription
    )

    toast.success(`✅ Link pembayaran berhasil dibuat untuk ${student?.name} - ${monthDisplay}`)
    showCreateModal.value = false

    // Reset form
    singleLink.studentId = ''
    singleLink.amount = 50000
    singleLink.paymentMonth = getCurrentMonth()
    singleLink.description = ''
  } catch (error) {
    if (error.message.includes('sudah membayar')) {
      toast.warning(error.message)
    } else {
      toast.error('Gagal membuat link pembayaran: ' + error.message)
    }
    console.error('Error creating payment link:', error)
  } finally {
    creating.value = false
  }
}

const copyPaymentLink = async (payment) => {
  try {
    // Try modern clipboard API first
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(payment.payment_url)
      toast.success('Link berhasil disalin ke clipboard')
    } else {
      // Fallback for older browsers or non-secure contexts
      const textArea = document.createElement('textarea')
      textArea.value = payment.payment_url
      textArea.style.position = 'fixed'
      textArea.style.left = '-999999px'
      textArea.style.top = '-999999px'
      document.body.appendChild(textArea)
      textArea.focus()
      textArea.select()

      try {
        document.execCommand('copy')
        toast.success('Link berhasil disalin')
      } catch (err) {
        toast.error('Gagal menyalin link - silakan copy manual')
        console.error('Copy fallback failed:', err)
      } finally {
        document.body.removeChild(textArea)
      }
    }
  } catch (error) {
    console.error('Error copying payment link:', error)
    toast.error('Gagal menyalin link - silakan copy manual')
  }
}

const sendPaymentLink = (payment) => {
  // Send directly to WhatsApp without modal
  sendWhatsAppMessage(payment)
}

const sendWhatsAppMessage = async (payment) => {
  try {
    const student = payment.student
    const studentName = student?.name || 'Siswa'
    const studentNickname = student?.nickname || studentName
    const phone = student?.phone || ''

    // Create professional message template with dynamic greeting
    const greeting = getIndonesianTimeGreeting()
    const message = `Assalamu'alaikum Wr. Wb.

${greeting} orang tua dari ${studentName}

Dengan hormat, kami ingin mengingatkan mengenai pembayaran uang kas kelas untuk bulan ini sebesar ${formatCurrency(payment.amount)}

Untuk kemudahan pembayaran, Bapak/Ibu dapat menggunakan link pembayaran berikut:

${payment.payment_url}

Pembayaran dapat dilakukan melalui QRIS dengan berbagai metode:

✅ Scan QR Code
✅ E-Wallet (GoPay, OVO, DANA, ShopeePay)

Terima kasih atas perhatian dan kerjasamanya.

Wassalamu'alaikum Wr. Wb.

---
*Order ID: ${payment.order_id}*
*Dikirim: ${greeting} (${getIndonesianTime()})*
*Sistem Kas Kelas Otomatis*`

    // Clean phone number for WhatsApp (Indonesian format)
    const cleanPhone = phone.replace(/\D/g, '').replace(/^0/, '62')

    // Create WhatsApp URL
    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`

    // Open WhatsApp directly
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer')

    toast.success(`📱 WhatsApp terbuka untuk ${studentName}`, {
      timeout: 3000
    })

    // Close preview modal if open
    showPreviewModal.value = false

  } catch (error) {
    console.error('Error opening WhatsApp:', error)
    toast.error('Gagal membuka WhatsApp')
  }
}

const checkPaymentStatus = async (payment) => {
  try {
    const status = await pakasirService.checkTransactionStatus(payment.amount, payment.order_id)
    
    if (status.status === 'completed' && payment.status === 'pending') {
      // Update payment status
      await store.db.updatePaymentLink(payment.id, {
        status: 'completed',
        payment_method: status.payment_method || 'qris',
        completed_at: status.completed_at || new Date().toISOString()
      })
      
      // Create transaction
      await store.addTransaction({
        type: 'income',
        amount: payment.amount,
        description: payment.description,
        student_id: payment.student_id,
        payment_method: status.payment_method || 'qris',
        order_id: payment.order_id,
        status: 'completed',
        created_at: status.completed_at || new Date().toISOString()
      })
      
      toast.success('Status pembayaran berhasil diupdate')
    } else {
      toast.info(`Status: ${status.status || 'pending'}`)
    }
  } catch (error) {
    toast.error('Gagal mengecek status pembayaran')
    console.error('Error checking payment status:', error)
  }
}

const markAsPaid = async (payment) => {
  const currentMonth = new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })

  if (!confirm(`Tandai pembayaran ${payment.student?.name} sebagai LUNAS untuk bulan ${currentMonth}?\n\nJumlah: ${formatCurrency(payment.amount)}\nKeterangan: ${payment.description}\n\n⚠️ Ini akan menambah saldo kas kelas dan menandai siswa sebagai sudah bayar bulan ini.`)) {
    return
  }

  try {
    const now = new Date().toISOString()
    const currentMonthCode = now.slice(0, 7) // YYYY-MM format

    // Update payment status to completed
    await store.updatePaymentLink(payment.id, {
      status: 'completed',
      payment_method: 'manual',
      completed_at: now,
      month: currentMonthCode,
      notes: `Ditandai lunas secara manual oleh admin pada ${new Date().toLocaleString('id-ID')}`
    })

    // Create transaction record that will automatically update balance
    await store.addTransaction({
      type: 'income',
      amount: payment.amount,
      description: `${payment.description} - ${currentMonth} (Manual)`,
      student_id: payment.student_id,
      payment_method: 'manual',
      order_id: payment.order_id,
      status: 'completed',
      month: currentMonthCode,
      created_at: now,
      notes: `Pembayaran manual - ${payment.student?.name} untuk ${currentMonth}`
    })

    // Refresh data to update UI and balance
    await store.fetchPaymentLinks()
    await store.fetchTransactions()

    // Show success with balance update info
    const newBalance = store.currentBalance
    toast.success(`✅ ${payment.student?.name} berhasil ditandai LUNAS!\n💰 Saldo kas bertambah: ${formatCurrency(payment.amount)}\n📊 Saldo saat ini: ${formatCurrency(newBalance)}`, {
      timeout: 6000
    })

  } catch (error) {
    console.error('Error marking payment as paid:', error)
    toast.error('Gagal menandai pembayaran sebagai lunas: ' + error.message)
  }
}

const deletePaymentLink = async (payment) => {
  if (confirm('Apakah Anda yakin ingin menghapus link pembayaran ini?')) {
    try {
      await store.deletePaymentLink(payment.id)
      toast.success('Link pembayaran berhasil dihapus')
    } catch (error) {
      toast.error('Gagal menghapus link pembayaran')
      console.error('Error deleting payment link:', error)
    }
  }
}

const viewInvoice = (payment) => {
  // Navigate to invoice page with specific order ID for targeted invoice
  if (payment.order_id) {
    router.push({ path: '/invoice', query: { orderId: payment.order_id } })
  } else if (payment.student_id) {
    router.push({ path: '/invoice', query: { studentId: payment.student_id } })
  } else {
    toast.warning('Data pembayaran tidak lengkap untuk membuat invoice')
  }
}

const copyToClipboard = async (text) => {
  try {
    // Try modern clipboard API first
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text)
      toast.success('Berhasil disalin ke clipboard')
    } else {
      // Fallback for older browsers or non-secure contexts
      const textArea = document.createElement('textarea')
      textArea.value = text
      textArea.style.position = 'fixed'
      textArea.style.left = '-999999px'
      textArea.style.top = '-999999px'
      document.body.appendChild(textArea)
      textArea.focus()
      textArea.select()

      try {
        document.execCommand('copy')
        toast.success('Berhasil disalin')
      } catch (err) {
        toast.warning('Silakan copy manual dari text yang ditampilkan')
        console.error('Copy fallback failed:', err)
      } finally {
        document.body.removeChild(textArea)
      }
    }
  } catch (error) {
    console.error('Error copying to clipboard:', error)
    toast.error('Gagal menyalin - silakan copy manual')
  }
}

const copyMessageAndNumber = async () => {
  const text = `Nomor: ${corsErrorData.value.phone}\n\nPesan:\n${corsErrorData.value.message}`
  try {
    await navigator.clipboard.writeText(text)
    toast.success('Pesan dan nomor berhasil disalin!')
  } catch (error) {
    toast.error('Gagal menyalin')
  }
}

const openWhatsAppWeb = () => {
  const phone = corsErrorData.value.phone.replace(/[^\d]/g, '') // Remove non-digits
  const message = encodeURIComponent(corsErrorData.value.message)
  const whatsappUrl = `https://web.whatsapp.com/send?phone=${phone}&text=${message}`
  window.open(whatsappUrl, '_blank')
  toast.info('WhatsApp Web dibuka di tab baru')
}

const getTargetPayments = () => {
  if (bulkMessage.target === 'pending') {
    return store.paymentLinks.filter(p => p.status === 'pending')
  } else if (bulkMessage.target === 'all') {
    return store.paymentLinks
  } else if (bulkMessage.target === 'selected') {
    return store.paymentLinks.filter(p => bulkMessage.selectedPayments.includes(p.id))
  }
  return []
}

const generateMessageTemplate = (payment) => {
  if (bulkMessage.template === 'custom') {
    return bulkMessage.customMessage
      .replace('{nama}', payment.student?.name || '')
      .replace('{jumlah}', formatCurrency(payment.amount))
      .replace('{keterangan}', payment.description)
      .replace('{link}', payment.payment_url)
  }

  // Default professional reminder template with dynamic greeting
  const student = payment.student
  const studentName = student?.name || 'Siswa'
  const greeting = getIndonesianTimeGreeting()

  return `Assalamu'alaikum Wr. Wb.

${greeting} orang tua dari ${studentName}

Dengan hormat, kami ingin mengingatkan mengenai pembayaran uang kas kelas untuk bulan ini sebesar ${formatCurrency(payment.amount)}

Untuk kemudahan pembayaran, Bapak/Ibu dapat menggunakan link pembayaran berikut:

${payment.payment_url}

Pembayaran dapat dilakukan melalui QRIS dengan berbagai metode:

✅ Scan QR Code
✅ E-Wallet (GoPay, OVO, DANA, ShopeePay)

Terima kasih atas perhatian dan kerjasamanya.

Wassalamu'alaikum Wr. Wb.

---
*Order ID: ${payment.order_id}*
*Dikirim: ${greeting} (${getIndonesianTime()})*
*Sistem Kas Kelas Otomatis*`
}

const downloadPaymentsPDF = async () => {
  try {
    const pdfContent = generatePaymentsPDFContent()
    const timestamp = new Date().toLocaleDateString('id-ID').replace(/\//g, '_')
    const fileName = `Laporan_Pembayaran_${timestamp}.html`

    // Create complete HTML content
    const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Laporan Pembayaran - ${new Date().toLocaleDateString('id-ID')}</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.5; }
    h1 { color: #1f2937; border-bottom: 3px solid #3b82f6; padding-bottom: 15px; margin-bottom: 20px; }
    h2 { color: #374151; margin-top: 30px; margin-bottom: 15px; border-left: 4px solid #3b82f6; padding-left: 10px; }
    h3 { color: #4b5563; margin-top: 20px; margin-bottom: 10px; }
    table { width: 100%; border-collapse: collapse; margin: 20px 0; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
    th, td { border: 1px solid #d1d5db; padding: 10px; text-align: left; font-size: 11px; }
    th { background-color: #f3f4f6; font-weight: bold; color: #374151; }
    .status-pending { color: #d97706; font-weight: bold; }
    .status-completed { color: #059669; font-weight: bold; }
    .status-expired { color: #dc2626; font-weight: bold; }
    .summary { background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #3b82f6; }
    .footer { margin-top: 30px; text-align: center; color: #6b7280; font-size: 12px; border-top: 1px solid #d1d5db; padding-top: 15px; }
    tr:nth-child(even) { background-color: #f9fafb; }
    .mobile-info { background-color: #ecfdf5; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981; }
    @media print { .mobile-info { display: none; } }
    @media (max-width: 768px) {
      table { font-size: 9px; }
      th, td { padding: 6px; }
      .summary { padding: 15px; }
    }
  </style>
</head>
<body>
  <div class="mobile-info">
    <h3 style="color: #065f46; margin: 0 0 10px 0;">📱 Panduan Download:</h3>
    <ul style="margin: 0; color: #047857; font-size: 14px;">
      <li><strong>Mobile:</strong> Menu browser (��) → "Simpan halaman" atau "Unduh"</li>
      <li><strong>Share:</strong> Gunakan tombol share browser untuk kirim via WhatsApp</li>
      <li><strong>Print:</strong> Menu browser → "Cetak" → "Simpan sebagai PDF"</li>
    </ul>
  </div>
  ${pdfContent}
  <div class="footer">
    Generated on ${new Date().toLocaleString('id-ID')} | Sistem Kas Kelas SD Islam Al Husna
  </div>
</body>
</html>`

    // Detect mobile device
    const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)

    if (isMobile) {
      // Mobile: Open in new tab with download instructions
      const newWindow = window.open('', '_blank')
      if (newWindow) {
        newWindow.document.write(htmlContent)
        newWindow.document.close()
        toast.success('📱 Laporan terbuka di tab baru. Gunakan menu browser (⋮) untuk download!', { timeout: 6000 })
      } else {
        // Fallback for blocked popups
        createPaymentDownloadLink(htmlContent, fileName)
      }
    } else {
      // Desktop: Direct download + preview
      createPaymentDownloadLink(htmlContent, fileName)

      // Open preview
      setTimeout(() => {
        const previewWindow = window.open('', '_blank')
        if (previewWindow) {
          previewWindow.document.write(htmlContent)
          previewWindow.document.close()
        }
      }, 300)
    }

    console.log('✅ Payment PDF Report generated successfully')

  } catch (error) {
    console.error('Error generating PDF:', error)
    toast.error('Gagal membuat PDF report')
  }
}

// Helper function for payment download
const createPaymentDownloadLink = (content, fileName) => {
  try {
    const blob = new Blob([content], { type: 'text/html;charset=utf-8' })
    const url = URL.createObjectURL(blob)

    const link = document.createElement('a')
    link.href = url
    link.download = fileName
    link.style.display = 'none'

    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    // Cleanup
    setTimeout(() => URL.revokeObjectURL(url), 1000)

    toast.success('✅ File laporan pembayaran berhasil di-download!')
  } catch (error) {
    console.error('Download error:', error)
    toast.error('Gagal download file. Silakan coba lagi.')
  }
}

const generatePaymentsPDFContent = () => {
  const payments = filteredPayments.value
  const totalAmount = payments.reduce((sum, p) => sum + p.amount, 0)
  const totalCollected = payments.filter(p => p.status === 'completed').reduce((sum, p) => sum + p.amount, 0)
  const totalPending = payments.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0)
  const pendingCount = payments.filter(p => p.status === 'pending').length
  const completedCount = payments.filter(p => p.status === 'completed').length
  const expiredCount = payments.filter(p => p.status === 'expired').length

  let tableRows = ''
  payments.forEach(payment => {
    const statusClass = `status-${payment.status}`
    const notes = payment.notes || payment.month || '-'
    const paymentMethod = payment.payment_method || '-'
    const completedAt = payment.completed_at ? formatDate(payment.completed_at) : '-'

    tableRows += `
      <tr>
        <td>${payment.student?.name || '-'}</td>
        <td>${payment.student?.nickname || '-'}</td>
        <td>${payment.student?.phone || '-'}</td>
        <td>${formatCurrency(payment.amount)}</td>
        <td>${payment.description}</td>
        <td class="${statusClass}">${getStatusLabel(payment.status)}</td>
        <td>${paymentMethod}</td>
        <td>${formatDate(payment.created_at)}</td>
        <td>${completedAt}</td>
        <td style="font-family: monospace; font-size: 10px;">${payment.order_id}</td>
        <td style="font-size: 11px; max-width: 200px; word-wrap: break-word;">${notes}</td>
      </tr>
    `
  })

  // Generate student payment summary
  const studentSummary = {}
  payments.forEach(payment => {
    const studentId = payment.student_id
    const studentName = payment.student?.name || 'Unknown'

    if (!studentSummary[studentId]) {
      studentSummary[studentId] = {
        name: studentName,
        nickname: payment.student?.nickname || '-',
        phone: payment.student?.phone || '-',
        totalAmount: 0,
        paidAmount: 0,
        pendingAmount: 0,
        paymentCount: 0,
        completedCount: 0,
        pendingCount: 0
      }
    }

    studentSummary[studentId].totalAmount += payment.amount
    studentSummary[studentId].paymentCount += 1

    if (payment.status === 'completed') {
      studentSummary[studentId].paidAmount += payment.amount
      studentSummary[studentId].completedCount += 1
    } else if (payment.status === 'pending') {
      studentSummary[studentId].pendingAmount += payment.amount
      studentSummary[studentId].pendingCount += 1
    }
  })

  let studentSummaryRows = ''
  Object.values(studentSummary).forEach(student => {
    const paymentRate = student.totalAmount > 0 ? Math.round((student.paidAmount / student.totalAmount) * 100) : 0
    studentSummaryRows += `
      <tr>
        <td>${student.name}</td>
        <td>${student.nickname}</td>
        <td>${student.phone}</td>
        <td>${student.paymentCount}</td>
        <td>${formatCurrency(student.totalAmount)}</td>
        <td style="color: #059669;">${formatCurrency(student.paidAmount)}</td>
        <td style="color: #d97706;">${formatCurrency(student.pendingAmount)}</td>
        <td style="color: ${paymentRate >= 80 ? '#059669' : paymentRate >= 50 ? '#d97706' : '#dc2626'};">${paymentRate}%</td>
      </tr>
    `
  })

  return `
    <h1>📊 Laporan Pembayaran Kas Kelas</h1>
    <p style="color: #6b7280; margin-bottom: 20px;">Generated on ${new Date().toLocaleString('id-ID')}</p>

    <div class="summary">
      <h2>📈 Ringkasan Keuangan</h2>
      <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin: 15px 0;">
        <div>
          <p><strong>📋 Total Link Pembayaran:</strong> ${payments.length}</p>
          <p><strong>✅ Selesai:</strong> ${completedCount} link</p>
          <p><strong>⏳ Pending:</strong> ${pendingCount} link</p>
          <p><strong>❌ Expired:</strong> ${expiredCount} link</p>
        </div>
        <div>
          <p><strong>💰 Total Nominal:</strong> ${formatCurrency(totalAmount)}</p>
          <p><strong>💚 Sudah Terkumpul:</strong> ${formatCurrency(totalCollected)}</p>
          <p><strong>🔸 Belum Terkumpul:</strong> ${formatCurrency(totalPending)}</p>
          <p><strong>📊 Filter Status:</strong> ${statusFilter.value || 'Semua Status'}</p>
        </div>
      </div>
    </div>

    <h2>👥 Ringkasan Per Siswa</h2>
    <table style="margin-bottom: 30px;">
      <thead>
        <tr>
          <th>Nama Siswa</th>
          <th>Nickname</th>
          <th>No. HP</th>
          <th>Jumlah Link</th>
          <th>Total Nominal</th>
          <th>Sudah Bayar</th>
          <th>Belum Bayar</th>
          <th>Rate Bayar</th>
        </tr>
      </thead>
      <tbody>
        ${studentSummaryRows || '<tr><td colspan="8" style="text-align: center; color: #6b7280;">Tidak ada data siswa</td></tr>'}
      </tbody>
    </table>

    <h2>📋 Detail Pembayaran Lengkap</h2>
    <table>
      <thead>
        <tr>
          <th>Nama Siswa</th>
          <th>Nickname</th>
          <th>No. HP</th>
          <th>Jumlah</th>
          <th>Keterangan</th>
          <th>Status</th>
          <th>Metode</th>
          <th>Dibuat</th>
          <th>Selesai</th>
          <th>Order ID</th>
          <th>Catatan</th>
        </tr>
      </thead>
      <tbody>
        ${tableRows || '<tr><td colspan="11" style="text-align: center; color: #6b7280;">Tidak ada data pembayaran</td></tr>'}
      </tbody>
    </table>

    <div style="margin-top: 30px; padding: 15px; background-color: #f9fafb; border-radius: 8px;">
      <h3 style="color: #374151; margin-bottom: 10px;">📝 Catatan Laporan</h3>
      <ul style="margin: 0; padding-left: 20px; color: #6b7280; font-size: 12px;">
        <li>Laporan ini dibuat secara otomatis dari sistem Kas Kelas</li>
        <li>Data yang ditampilkan sesuai dengan filter yang dipilih: <strong>${statusFilter.value || 'Semua Status'}</strong></li>
        <li>Kolom "Catatan" berisi informasi tambahan seperti bulan pembayaran atau notes dari admin</li>
        <li>Rate bayar dihitung dari: (Jumlah sudah bayar / Total nominal) × 100%</li>
        <li>Untuk pertanyaan atau klarifikasi, hubungi admin sistem kas kelas</li>
      </ul>
    </div>
  `
}

const sendBulkMessages = async () => {
  try {
    sending.value = true
    const targetPayments = getTargetPayments()

    if (targetPayments.length === 0) {
      toast.error('Tidak ada pembayaran yang dipilih')
      return
    }

    const results = []
    const delaySeconds = bulkMessage.delayMinutes * 60

    for (let i = 0; i < targetPayments.length; i++) {
      const payment = targetPayments[i]
      const student = payment.student
      const phone = student?.phone || ''

      try {
        if (i > 0) {
          // Add delay between messages
          await new Promise(resolve => setTimeout(resolve, delaySeconds * 1000))
        }

        const message = generateMessageTemplate(payment)

        // Clean phone number for WhatsApp (Indonesian format)
        const cleanPhone = phone.replace(/\D/g, '').replace(/^0/, '62')

        // Create WhatsApp URL
        const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`

        // Open WhatsApp (only first one opens in new tab, others use link click method)
        if (i === 0) {
          window.open(whatsappUrl, '_blank', 'noopener,noreferrer')
        } else {
          // For subsequent messages, use invisible link method to avoid popup blocks
          const link = document.createElement('a')
          link.href = whatsappUrl
          link.target = '_blank'
          link.rel = 'noopener noreferrer'
          link.style.display = 'none'
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
        }

        results.push({
          recipient: student?.name,
          phone: phone,
          success: true
        })

        toast.success(`📱 ${i + 1}/${targetPayments.length} - WhatsApp dibuka untuk ${student?.name}`, {
          timeout: 2000
        })

      } catch (error) {
        results.push({
          recipient: student?.name,
          phone: phone,
          success: false,
          error: error.message
        })

        toast.error(`❌ Gagal membuka WhatsApp untuk ${student?.name}`)
      }
    }

    const successCount = results.filter(r => r.success).length
    const failCount = results.filter(r => !r.success).length

    toast.success(`🎉 Selesai! ${successCount} WhatsApp terbuka${failCount > 0 ? `, ${failCount} gagal` : ''}`)

    // Reset form
    bulkMessage.selectedPayments = []
  } catch (error) {
    toast.error('Gagal mengirim pesan massal')
    console.error('Error sending bulk messages:', error)
  } finally {
    sending.value = false
  }
}
</script>
