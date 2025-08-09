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
    <div class="card p-4 sm:p-6">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">Generate Link Cepat</h3>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Jumlah</label>
          <input
            v-model.number="quickGenerate.amount"
            type="number"
            min="1"
            class="input-field"
            placeholder="Contoh: 50000"
          />
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Keterangan</label>
          <input 
            v-model="quickGenerate.description"
            type="text"
            class="input-field"
            placeholder="Contoh: Kas Bulanan Februari"
          />
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Target Siswa</label>
          <select v-model="quickGenerate.target" class="input-field">
            <option value="all">Semua Siswa</option>
            <option value="unpaid">Siswa Belum Bayar</option>
            <option value="selected">Pilih Manual</option>
          </select>
        </div>
        
        <div class="flex items-end">
          <button 
            @click="generateBulkLinks"
            :disabled="!quickGenerate.amount || !quickGenerate.description || generating"
            class="btn-primary w-full"
          >
            {{ generating ? 'Generating...' : 'Generate Links' }}
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
            @click="downloadPaymentsPDF"
            class="btn-secondary flex items-center"
            title="Download PDF Report"
          >
            <DocumentArrowDownIcon class="w-4 h-4 mr-2" />
            <span class="hidden sm:inline">Download PDF</span>
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
          <div class="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-gray-200">
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
      <div class="bg-white rounded-lg max-w-md w-full mx-4 p-4 sm:p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Buat Link Pembayaran</h3>
        
        <form @submit.prevent="createSingleLink" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Siswa</label>
            <select v-model="singleLink.studentId" required class="input-field">
              <option value="">Pilih Siswa</option>
              <option v-for="student in store.students" :key="student.id" :value="student.id">
                {{ student.name }} ({{ student.nickname }})
              </option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Jumlah</label>
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
            <label class="block text-sm font-medium text-gray-700 mb-2">Keterangan</label>
            <input 
              v-model="singleLink.description"
              type="text" 
              required
              class="input-field"
              placeholder="Contoh: Kas bulanan Februari"
            />
          </div>
          
          <div class="flex justify-end space-x-3 pt-4">
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
              class="btn-primary"
            >
              {{ creating ? 'Membuat...' : 'Buat Link' }}
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

const quickGenerate = reactive({
  amount: 50000,
  description: 'Kas Bulanan',
  target: 'all',
  selectedStudents: []
})

const singleLink = reactive({
  studentId: '',
  amount: 0,
  description: ''
})

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
    
    if (quickGenerate.target === 'all') {
      targetStudents = store.students
    } else if (quickGenerate.target === 'unpaid') {
      const paidStudentIds = store.transactions
        .filter(t => t.type === 'income' && t.status === 'completed')
        .map(t => t.student_id)
      targetStudents = store.students.filter(s => !paidStudentIds.includes(s.id))
    } else if (quickGenerate.target === 'selected') {
      targetStudents = store.students.filter(s => quickGenerate.selectedStudents.includes(s.id))
    }
    
    const promises = targetStudents.map(student => 
      store.generatePaymentLink(student.id, quickGenerate.amount, quickGenerate.description)
    )
    
    await Promise.all(promises)
    
    toast.success(`Berhasil generate ${targetStudents.length} link pembayaran`)
    
    // Reset form
    quickGenerate.selectedStudents = []
  } catch (error) {
    toast.error('Gagal generate link pembayaran')
    console.error('Error generating bulk links:', error)
  } finally {
    generating.value = false
  }
}

const createSingleLink = async () => {
  try {
    creating.value = true
    
    await store.generatePaymentLink(
      singleLink.studentId,
      singleLink.amount,
      singleLink.description
    )
    
    toast.success('Link pembayaran berhasil dibuat')
    showCreateModal.value = false
    
    // Reset form
    singleLink.studentId = ''
    singleLink.amount = 0
    singleLink.description = ''
  } catch (error) {
    toast.error('Gagal membuat link pembayaran')
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
  if (!confirm(`Tandai pembayaran ${payment.student?.name} sebagai LUNAS?\n\nJumlah: ${formatCurrency(payment.amount)}\nKeterangan: ${payment.description}`)) {
    return
  }

  try {
    // Update payment status to completed
    await store.db.updatePaymentLink(payment.id, {
      status: 'completed',
      payment_method: 'manual', // Manual marking
      completed_at: new Date().toISOString(),
      notes: 'Ditandai lunas secara manual oleh admin'
    })

    // Create transaction record
    await store.addTransaction({
      type: 'income',
      amount: payment.amount,
      description: payment.description + ' (Manual)',
      student_id: payment.student_id,
      payment_method: 'manual',
      order_id: payment.order_id,
      status: 'completed',
      created_at: new Date().toISOString(),
      notes: 'Pembayaran ditandai lunas secara manual'
    })

    // Refresh data
    await store.fetchPaymentLinks()
    await store.fetchTransactions()

    toast.success(`✅ ${payment.student?.name} berhasil ditandai LUNAS!`, {
      timeout: 4000
    })

  } catch (error) {
    console.error('Error marking payment as paid:', error)
    toast.error('Gagal menandai pembayaran sebagai lunas')
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
    // Create PDF content
    const pdfContent = generatePaymentsPDFContent()

    // Create a temporary HTML element for PDF generation
    const element = document.createElement('div')
    element.innerHTML = pdfContent
    element.style.position = 'absolute'
    element.style.left = '-9999px'
    element.style.top = '-9999px'
    document.body.appendChild(element)

    // Simple implementation: Create a new window with the content
    const printWindow = window.open('', '_blank')
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Laporan Pembayaran - ${new Date().toLocaleDateString('id-ID')}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { color: #1f2937; border-bottom: 2px solid #3b82f6; padding-bottom: 10px; }
            h2 { color: #374151; margin-top: 20px; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th, td { border: 1px solid #d1d5db; padding: 8px; text-align: left; }
            th { background-color: #f3f4f6; font-weight: bold; }
            .status-pending { color: #d97706; }
            .status-completed { color: #059669; }
            .status-expired { color: #dc2626; }
            .summary { background-color: #f9fafb; padding: 15px; border-radius: 8px; margin: 20px 0; }
            .footer { margin-top: 30px; text-align: center; color: #6b7280; font-size: 12px; }
          </style>
        </head>
        <body>
          ${pdfContent}
          <div class="footer">
            Generated on ${new Date().toLocaleString('id-ID')} | Sistem Kas Kelas
          </div>
        </body>
        </html>
      `)
      printWindow.document.close()

      setTimeout(() => {
        printWindow.print()
      }, 500)
    }

    // Clean up
    document.body.removeChild(element)

    toast.success('PDF Report siap untuk di-print/save')

  } catch (error) {
    console.error('Error generating PDF:', error)
    toast.error('Gagal membuat PDF report')
  }
}

const generatePaymentsPDFContent = () => {
  const payments = filteredPayments.value
  const totalAmount = payments.reduce((sum, p) => sum + p.amount, 0)
  const pendingCount = payments.filter(p => p.status === 'pending').length
  const completedCount = payments.filter(p => p.status === 'completed').length

  let tableRows = ''
  payments.forEach(payment => {
    const statusClass = `status-${payment.status}`
    tableRows += `
      <tr>
        <td>${payment.student?.name || '-'}</td>
        <td>${payment.student?.nickname || '-'}</td>
        <td>${formatCurrency(payment.amount)}</td>
        <td>${payment.description}</td>
        <td class="${statusClass}">${getStatusLabel(payment.status)}</td>
        <td>${formatDate(payment.created_at)}</td>
        <td style="font-family: monospace; font-size: 11px;">${payment.order_id}</td>
      </tr>
    `
  })

  return `
    <h1>📊 Laporan Pembayaran Kas Kelas</h1>

    <div class="summary">
      <h2>📈 Ringkasan</h2>
      <p><strong>Total Link Pembayaran:</strong> ${payments.length}</p>
      <p><strong>Pending:</strong> ${pendingCount} | <strong>Selesai:</strong> ${completedCount}</p>
      <p><strong>Total Amount:</strong> ${formatCurrency(totalAmount)}</p>
      <p><strong>Filter Status:</strong> ${statusFilter.value || 'Semua Status'}</p>
    </div>

    <h2>📋 Detail Pembayaran</h2>
    <table>
      <thead>
        <tr>
          <th>Nama Siswa</th>
          <th>Nickname</th>
          <th>Jumlah</th>
          <th>Keterangan</th>
          <th>Status</th>
          <th>Tanggal Dibuat</th>
          <th>Order ID</th>
        </tr>
      </thead>
      <tbody>
        ${tableRows || '<tr><td colspan="7" style="text-align: center; color: #6b7280;">Tidak ada data pembayaran</td></tr>'}
      </tbody>
    </table>
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
