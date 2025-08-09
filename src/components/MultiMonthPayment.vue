<template>
  <div class="space-y-6">
    <!-- Multi-Month Payment Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
      <div>
        <h3 class="text-lg font-semibold text-gray-900">Pembayaran Multi-Bulan</h3>
        <p class="text-sm text-gray-500 mt-1">Buat link pembayaran untuk beberapa bulan sekaligus</p>
      </div>
      <button
        @click="showCreateModal = true"
        class="btn-primary w-full sm:w-auto"
      >
        <PlusIcon class="w-4 h-4 mr-2" />
        Buat Multi-Month
      </button>
    </div>

    <!-- Quick Multi-Month Templates -->
    <div class="card p-6">
      <h4 class="text-lg font-medium text-gray-900 mb-4">🎯 Template Pembayaran Populer</h4>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <button 
          v-for="template in quickTemplates" 
          :key="template.months"
          @click="useTemplate(template)"
          class="relative p-6 border-2 border-dashed border-gray-300 rounded-xl hover:border-primary-500 hover:bg-primary-50 transition-all duration-300 hover:shadow-lg group"
        >
          <div class="text-center">
            <!-- Badge for popular -->
            <div v-if="template.popular" class="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
              POPULER
            </div>
            
            <!-- Icon -->
            <div class="w-16 h-16 mx-auto mb-3 rounded-full flex items-center justify-center" 
                 :class="template.bgColor">
              <span class="text-2xl">{{ template.icon }}</span>
            </div>
            
            <!-- Title -->
            <div class="text-xl font-bold text-gray-900 mb-2">{{ template.label }}</div>
            
            <!-- Duration -->
            <div class="text-sm text-gray-600 mb-3">{{ template.months }} Bulan Berturut-turut</div>
            
            <!-- Price -->
            <div class="text-lg font-bold text-primary-600 mb-2">{{ formatCurrency(template.amount) }}</div>
            <div class="text-xs text-gray-500 mb-3">{{ template.months }} × {{ formatCurrency(50000) }}</div>
            
            <!-- Benefits -->
            <div class="text-xs text-gray-600 space-y-1">
              <div v-for="benefit in template.benefits" :key="benefit" class="flex items-center justify-center">
                <span class="text-green-500 mr-1">✓</span>
                {{ benefit }}
              </div>
            </div>
            
            <!-- Discount badge if any -->
            <div v-if="template.discount" class="mt-3">
              <span class="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
                {{ template.discount }}
              </span>
            </div>
          </div>
        </button>
      </div>
      
      <!-- Custom Template -->
      <div class="mt-6 pt-6 border-t border-gray-200">
        <div class="text-center">
          <button
            @click="showCreateModal = true"
            class="inline-flex items-center px-6 py-3 border border-primary-300 rounded-lg text-primary-700 bg-primary-50 hover:bg-primary-100 transition-colors"
          >
            <PlusIcon class="w-5 h-5 mr-2" />
            Buat Template Kustom
          </button>
          <p class="text-sm text-gray-500 mt-2">Atau buat pembayaran dengan periode dan jumlah sesuai kebutuhan</p>
        </div>
      </div>
    </div>

    <!-- Quick Actions Card -->
    <div class="card p-6">
      <h4 class="text-lg font-medium text-gray-900 mb-4">⚡ Aksi Cepat</h4>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="border rounded-lg p-4 bg-blue-50">
          <h5 class="font-medium text-blue-900 mb-2">💡 Tips Marking Manual</h5>
          <ul class="text-sm text-blue-800 space-y-1">
            <li>• Klik tombol "✓ Tandai Lunas" untuk mark individual payment</li>
            <li>• Gunakan "✓ Tandai Semua Lunas" untuk mark bulk dalam detail</li>
            <li>• Progress akan otomatis terupdate</li>
            <li>• Data tersimpan otomatis</li>
          </ul>
        </div>

        <div class="border rounded-lg p-4 bg-green-50">
          <h5 class="font-medium text-green-900 mb-2">📊 Status Overview</h5>
          <div class="text-sm space-y-1">
            <div class="flex justify-between">
              <span class="text-green-700">Lunas:</span>
              <span class="font-semibold">{{ multiMonthPayments.filter(p => p.status === 'completed').length }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-blue-700">Sebagian:</span>
              <span class="font-semibold">{{ multiMonthPayments.filter(p => p.status === 'partial').length }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-yellow-700">Pending:</span>
              <span class="font-semibold">{{ multiMonthPayments.filter(p => p.status === 'pending').length }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Multi-Month Payments List -->
    <div class="card p-6">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 space-y-2 sm:space-y-0">
        <h4 class="text-lg font-medium text-gray-900">Pembayaran Multi-Bulan</h4>
        <div class="flex space-x-2">
          <select v-model="filterStatus" class="input-field w-auto">
            <option value="">Semua Status</option>
            <option value="pending">Pending</option>
            <option value="partial">Sebagian</option>
            <option value="completed">Lunas</option>
          </select>
          <button
            @click="downloadMultiMonthPDF"
            class="btn-secondary flex items-center"
            title="Download PDF Report"
          >
            <DocumentArrowDownIcon class="w-4 h-4 mr-2" />
            <span class="hidden sm:inline">Download PDF</span>
            <span class="sm:hidden">PDF</span>
          </button>
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
                Periode
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Progress
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="payment in filteredPayments" :key="payment.id">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                    <span class="text-primary-600 font-semibold text-sm">
                      {{ payment.student?.name?.charAt(0)?.toUpperCase() }}
                    </span>
                  </div>
                  <div>
                    <div class="text-sm font-medium text-gray-900">{{ payment.student?.name }}</div>
                    <div class="text-sm text-gray-500">{{ payment.student?.nickname }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ payment.period_label }}</div>
                <div class="text-sm text-gray-500">{{ payment.months }} bulan</div>
                <div v-if="payment.payment_links" class="text-xs text-blue-600 mt-1">
                  {{ payment.payment_links.length }} link tersedia
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">{{ formatCurrency(payment.total_amount) }}</div>
                <div class="text-sm text-gray-500">{{ formatCurrency(payment.monthly_amount) }}/bulan</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="w-full bg-gray-200 rounded-full h-2 mb-1">
                  <div 
                    class="bg-primary-600 h-2 rounded-full" 
                    :style="{ width: payment.progress_percentage + '%' }"
                  ></div>
                </div>
                <div class="text-xs text-gray-500">
                  {{ payment.paid_amount }}/{{ payment.total_amount }} ({{ payment.progress_percentage }}%)
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="getStatusClass(payment.status)">
                  {{ getStatusLabel(payment.status) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div class="flex items-center space-x-2">
                  <button
                    @click="viewDetails(payment)"
                    class="text-primary-600 hover:text-primary-900"
                    title="Lihat Detail"
                  >
                    <EyeIcon class="w-4 h-4" />
                  </button>
                  <button
                    @click="sendReminder(payment)"
                    class="text-success-600 hover:text-success-900"
                    title="Kirim Reminder"
                  >
                    <ChatBubbleLeftIcon class="w-4 h-4" />
                  </button>
                  <button
                    @click="copyPaymentLink(payment)"
                    class="text-warning-600 hover:text-warning-900"
                    title="Copy Link"
                  >
                    <LinkIcon class="w-4 h-4" />
                  </button>
                  <button
                    @click="editPayment(payment)"
                    class="text-blue-600 hover:text-blue-900"
                    title="Edit Pembayaran"
                  >
                    <PencilIcon class="w-4 h-4" />
                  </button>
                  <button
                    @click="deletePayment(payment)"
                    class="text-red-600 hover:text-red-900"
                    title="Hapus Pembayaran"
                  >
                    <TrashIcon class="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Mobile Card View -->
      <div class="block sm:hidden space-y-4">
        <div v-for="payment in filteredPayments" :key="payment.id" class="bg-gray-50 rounded-lg p-4">
          <div class="flex items-center justify-between mb-3">
            <div class="flex items-center">
              <div class="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                <span class="text-primary-600 font-semibold text-sm">
                  {{ payment.student?.name?.charAt(0)?.toUpperCase() }}
                </span>
              </div>
              <div>
                <div class="font-medium text-sm">{{ payment.student?.name }}</div>
                <div class="text-gray-500 text-xs">{{ payment.period_label }}</div>
              </div>
            </div>
            <span :class="getStatusClass(payment.status)">
              {{ getStatusLabel(payment.status) }}
            </span>
          </div>
          
          <div class="space-y-2 text-sm">
            <div class="w-full bg-gray-200 rounded-full h-2">
              <div 
                class="bg-primary-600 h-2 rounded-full" 
                :style="{ width: payment.progress_percentage + '%' }"
              ></div>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Progress:</span>
              <span>{{ payment.progress_percentage }}%</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Total:</span>
              <span class="font-medium">{{ formatCurrency(payment.total_amount) }}</span>
            </div>
          </div>
          
          <div class="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-gray-200">
            <button @click="viewDetails(payment)" class="flex items-center justify-center text-primary-600 py-2">
              <EyeIcon class="w-4 h-4 mr-1" />
              <span class="text-xs">Detail</span>
            </button>
            <button @click="sendReminder(payment)" class="flex items-center justify-center text-success-600 py-2">
              <ChatBubbleLeftIcon class="w-4 h-4 mr-1" />
              <span class="text-xs">Kirim</span>
            </button>
            <button @click="copyPaymentLink(payment)" class="flex items-center justify-center text-warning-600 py-2">
              <LinkIcon class="w-4 h-4 mr-1" />
              <span class="text-xs">Copy</span>
            </button>
            <button @click="editPayment(payment)" class="flex items-center justify-center text-blue-600 py-2">
              <PencilIcon class="w-4 h-4 mr-1" />
              <span class="text-xs">Edit</span>
            </button>
          </div>
          <div class="flex justify-center mt-2">
            <button @click="deletePayment(payment)" class="flex items-center justify-center text-red-600 py-2 w-full">
              <TrashIcon class="w-4 h-4 mr-1" />
              <span class="text-xs">Hapus</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Create Multi-Month Modal -->
    <div
      v-if="showCreateModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <div class="bg-white rounded-lg max-w-lg w-full mx-4 p-6 max-h-[90vh] overflow-y-auto">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">
          {{ selectedPayment ? 'Edit Pembayaran Multi-Bulan' : 'Buat Pembayaran Multi-Bulan' }}
        </h3>
        
        <form @submit.prevent="createMultiMonthPayment" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Siswa</label>
            <select v-model="form.studentId" required class="input-field">
              <option value="">Pilih Siswa</option>
              <option v-for="student in students" :key="student.id" :value="student.id">
                {{ student.name }} ({{ student.nickname }})
              </option>
            </select>
          </div>
          
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Bulan Mulai</label>
              <select v-model="form.startMonth" required class="input-field">
                <option v-for="month in months" :key="month.value" :value="month.value">
                  {{ month.label }}
                </option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Tahun</label>
              <select v-model="form.year" required class="input-field">
                <option v-for="year in years" :key="year" :value="year">
                  {{ year }}
                </option>
              </select>
            </div>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Jumlah Bulan</label>
            <select v-model.number="form.months" required class="input-field" @change="calculateTotal">
              <option v-for="n in 12" :key="n" :value="n">
                {{ n }} bulan
              </option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Jumlah per Bulan</label>
            <input
              v-model.number="form.monthlyAmount"
              type="number"
              min="1"
              required
              class="input-field"
              @input="calculateTotal"
              placeholder="50000"
            />
          </div>

          <!-- Link Generation Options -->
          <div class="border rounded-lg p-4 bg-blue-50">
            <h4 class="font-medium text-blue-900 mb-3">💳 Opsi Generate Link Pembayaran</h4>

            <div class="space-y-3">
              <label class="flex items-start space-x-3">
                <input
                  v-model="form.linkType"
                  type="radio"
                  value="individual"
                  class="mt-1"
                />
                <div>
                  <div class="font-medium text-gray-900">Link Individual per Bulan</div>
                  <div class="text-sm text-gray-600">
                    Generate {{ form.months }} link terpisah ({{ formatCurrency(form.monthlyAmount) }} per link)
                  </div>
                  <div class="text-xs text-green-600 mt-1">
                    ✅ Orang tua bisa bayar bertahap • ✅ Tracking per bulan lebih detail
                  </div>
                </div>
              </label>

              <label class="flex items-start space-x-3">
                <input
                  v-model="form.linkType"
                  type="radio"
                  value="single"
                  class="mt-1"
                />
                <div>
                  <div class="font-medium text-gray-900">Link Total Sekaligus</div>
                  <div class="text-sm text-gray-600">
                    Generate 1 link untuk total {{ formatCurrency(form.monthlyAmount * form.months) }}
                  </div>
                  <div class="text-xs text-blue-600 mt-1">
                    ✅ Pembayaran sekaligus • ✅ Lebih praktis untuk orang tua
                  </div>
                </div>
              </label>

              <label class="flex items-start space-x-3">
                <input
                  v-model="form.linkType"
                  type="radio"
                  value="both"
                  class="mt-1"
                />
                <div>
                  <div class="font-medium text-gray-900">Kedua Opsi (Recommended)</div>
                  <div class="text-sm text-gray-600">
                    Generate link individual + link total (orang tua pilih sendiri)
                  </div>
                  <div class="text-xs text-purple-600 mt-1">
                    ✅ Fleksibilitas maksimal • ✅ Cocok untuk semua preferensi
                  </div>
                </div>
              </label>
            </div>
          </div>

          <!-- Summary -->
          <div class="bg-gray-50 p-4 rounded-lg">
            <h4 class="font-medium text-gray-900 mb-2">📋 Ringkasan Pembayaran</h4>
            <div class="space-y-1 text-sm">
              <div class="flex justify-between">
                <span>Periode:</span>
                <span>{{ form.months }} bulan ({{ getPeriodLabel() }})</span>
              </div>
              <div class="flex justify-between">
                <span>Jumlah per Bulan:</span>
                <span>{{ formatCurrency(form.monthlyAmount) }}</span>
              </div>
              <div class="flex justify-between font-bold border-t pt-1">
                <span>Total Pembayaran:</span>
                <span>{{ formatCurrency(form.monthlyAmount * form.months) }}</span>
              </div>
            </div>

            <!-- Link Generation Summary -->
            <div class="mt-3 pt-3 border-t border-gray-300">
              <h5 class="font-medium text-gray-900 mb-2">🔗 Link yang akan dibuat:</h5>
              <div class="space-y-1 text-xs">
                <div v-if="form.linkType === 'individual' || form.linkType === 'both'" class="text-green-600">
                  ✅ {{ form.months }} link individual ({{ formatCurrency(form.monthlyAmount) }} per link)
                </div>
                <div v-if="form.linkType === 'single' || form.linkType === 'both'" class="text-blue-600">
                  ✅ 1 link total sekaligus ({{ formatCurrency(form.monthlyAmount * form.months) }})
                </div>
                <div v-if="form.linkType === 'both'" class="text-purple-600 font-medium">
                  💡 Orang tua bisa pilih bayar bertahap atau sekaligus
                </div>
              </div>
            </div>
          </div>
          
          <div class="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              @click="closeCreateModal"
              class="btn-secondary"
            >
              Batal
            </button>
            <button 
              type="submit"
              :disabled="creating"
              class="btn-primary"
            >
              {{ creating ? 'Menyimpan...' : (selectedPayment ? 'Update Pembayaran' : 'Buat Pembayaran') }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Detail Modal -->
    <div
      v-if="showDetailModal && selectedPayment"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <div class="bg-white rounded-lg max-w-2xl w-full mx-4 p-6 max-h-[90vh] overflow-y-auto">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Detail Pembayaran Multi-Bulan</h3>
        
        <div class="space-y-6">
          <!-- Student Info -->
          <div class="flex items-center space-x-4">
            <div class="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
              <span class="text-primary-600 font-semibold text-xl">
                {{ selectedPayment.student?.name?.charAt(0)?.toUpperCase() }}
              </span>
            </div>
            <div>
              <h4 class="text-lg font-medium text-gray-900">{{ selectedPayment.student?.name }}</h4>
              <p class="text-sm text-gray-500">{{ selectedPayment.period_label }}</p>
            </div>
          </div>

          <!-- Progress -->
          <div>
            <div class="flex justify-between mb-2">
              <span class="text-sm font-medium text-gray-700">Progress Pembayaran</span>
              <span class="text-sm text-gray-500">{{ selectedPayment.progress_percentage }}%</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-3">
              <div 
                class="bg-primary-600 h-3 rounded-full" 
                :style="{ width: selectedPayment.progress_percentage + '%' }"
              ></div>
            </div>
            <div class="flex justify-between mt-2 text-sm text-gray-600">
              <span>{{ formatCurrency(selectedPayment.paid_amount) }}</span>
              <span>{{ formatCurrency(selectedPayment.total_amount) }}</span>
            </div>
          </div>

          <!-- Month Details -->
          <div>
            <div class="flex items-center justify-between mb-3">
              <h5 class="font-medium text-gray-900">Detail per Bulan</h5>
              <button
                v-if="selectedPayment.month_details && selectedPayment.month_details.some(m => !m.paid)"
                @click="markAllMonthsAsPaid(selectedPayment)"
                class="text-green-600 hover:text-green-800 text-xs px-3 py-1 border border-green-300 rounded-full hover:bg-green-50"
              >
                ✓ Tandai Semua Lunas
              </button>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div
                v-for="month in selectedPayment.month_details"
                :key="month.month"
                class="p-3 border rounded-lg"
                :class="month.paid ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'"
              >
                <div class="flex items-center justify-between">
                  <span class="text-sm font-medium">{{ month.label }}</span>
                  <div class="flex items-center space-x-2">
                    <span v-if="month.paid" class="text-green-600 text-xs">✓ Lunas</span>
                    <span v-else class="text-gray-500 text-xs">Belum bayar</span>
                    <button
                      v-if="!month.paid"
                      @click="markMonthAsPaid(selectedPayment, month)"
                      class="text-green-600 hover:text-green-800 text-xs px-2 py-1 border border-green-300 rounded hover:bg-green-50"
                      title="Tandai Lunas"
                    >
                      ✓ Tandai Lunas
                    </button>
                  </div>
                </div>
                <div class="text-xs text-gray-600 mt-1">
                  {{ formatCurrency(month.amount) }}
                </div>
                <div v-if="month.paid && month.paid_at" class="text-xs text-green-600 mt-1">
                  Dibayar: {{ formatDate(month.paid_at) }}
                </div>
              </div>
            </div>
          </div>

          <!-- Generated Payment Links -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-3">🔗 Link Pembayaran yang Dibuat</label>

            <div v-if="selectedPayment.payment_links && selectedPayment.payment_links.length > 0" class="space-y-3">
              <div
                v-for="link in selectedPayment.payment_links"
                :key="link.id"
                class="border rounded-lg p-3"
                :class="link.type === 'total' ? 'bg-blue-50 border-blue-200' : 'bg-green-50 border-green-200'"
              >
                <div class="flex items-center justify-between mb-2">
                  <div class="flex items-center space-x-2">
                    <span
                      :class="link.type === 'total' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'"
                      class="px-2 py-1 rounded-full text-xs font-medium"
                    >
                      {{ link.type === 'total' ? '💰 Total Sekaligus' : `📅 Bulan ${link.month}` }}
                    </span>
                    <span class="font-medium text-sm">{{ formatCurrency(link.amount) }}</span>
                  </div>
                  <div class="flex space-x-1">
                    <button
                      @click="copyToClipboard(link.url)"
                      class="p-1 text-gray-500 hover:text-gray-700"
                      title="Copy Link"
                    >
                      <DocumentDuplicateIcon class="w-4 h-4" />
                    </button>
                    <button
                      @click="sendPaymentLinkWhatsApp(link, selectedPayment.student)"
                      class="p-1 text-green-500 hover:text-green-700"
                      title="Kirim via WhatsApp"
                    >
                      <ChatBubbleLeftIcon class="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div class="text-xs text-gray-600 mb-2">
                  {{ link.description }}
                </div>

                <div class="text-xs font-mono text-gray-500 bg-white px-2 py-1 rounded border">
                  Order ID: {{ link.order_id }}
                </div>

                <div class="mt-2 flex items-center space-x-2">
                  <input
                    :value="link.url"
                    readonly
                    class="input-field text-xs flex-1"
                  />
                </div>
              </div>
            </div>

            <!-- Legacy single link fallback -->
            <div v-else class="border rounded-lg p-3 bg-gray-50">
              <div class="flex items-center space-x-2">
                <input
                  :value="selectedPayment.payment_url"
                  readonly
                  class="input-field text-xs flex-1"
                />
                <button
                  @click="copyToClipboard(selectedPayment.payment_url)"
                  class="btn-secondary p-2"
                >
                  <DocumentDuplicateIcon class="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div class="flex flex-col space-y-3 pt-6 border-t">
          <!-- First row: Edit/Delete -->
          <div class="flex space-x-3">
            <button
              @click="editPayment(selectedPayment)"
              class="btn-secondary text-blue-600 border-blue-300 hover:bg-blue-50 flex-1"
            >
              <PencilIcon class="w-4 h-4 mr-2" />
              Edit
            </button>
            <button
              @click="deletePayment(selectedPayment)"
              class="btn-secondary text-red-600 border-red-300 hover:bg-red-50 flex-1"
            >
              <TrashIcon class="w-4 h-4 mr-2" />
              Hapus
            </button>
          </div>

          <!-- Second row: WhatsApp options -->
          <div v-if="selectedPayment.payment_links && selectedPayment.payment_links.length > 1" class="flex space-x-3">
            <button
              @click="sendAllPaymentLinks(selectedPayment)"
              class="btn-success flex-1"
            >
              <ChatBubbleLeftIcon class="w-4 h-4 mr-2" />
              Kirim Semua Link ({{ selectedPayment.payment_links.length }})
            </button>
          </div>

          <!-- Third row: Close/Single reminder -->
          <div class="flex space-x-3">
            <button
              @click="showDetailModal = false"
              class="btn-secondary flex-1"
            >
              Tutup
            </button>
            <button
              @click="sendPaymentReminder(selectedPayment)"
              class="btn-success flex-1"
            >
              <ChatBubbleLeftIcon class="w-4 h-4 mr-2" />
              Kirim Reminder
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useToast } from 'vue-toastification'
import { useAppStore } from '@/stores'
import { getIndonesianTimeGreeting, getIndonesianTime } from '@/utils/timeGreeting'
import {
  PlusIcon,
  EyeIcon,
  ChatBubbleLeftIcon,
  LinkIcon,
  DocumentDuplicateIcon,
  PencilIcon,
  TrashIcon,
  DocumentArrowDownIcon
} from '@heroicons/vue/24/outline'

const store = useAppStore()
const toast = useToast()

const showCreateModal = ref(false)
const showDetailModal = ref(false)
const selectedPayment = ref(null)
const creating = ref(false)
const filterStatus = ref('')

const form = reactive({
  studentId: '',
  startMonth: new Date().getMonth() + 1,
  year: new Date().getFullYear(),
  months: 6,
  monthlyAmount: 50000,
  linkType: 'both' // 'individual', 'single', or 'both'
})

// Multi-month payments data (empty by default)
const multiMonthPayments = ref([])

const students = computed(() => store.students)

const months = [
  { value: 1, label: 'Januari' },
  { value: 2, label: 'Februari' },
  { value: 3, label: 'Maret' },
  { value: 4, label: 'April' },
  { value: 5, label: 'Mei' },
  { value: 6, label: 'Juni' },
  { value: 7, label: 'Juli' },
  { value: 8, label: 'Agustus' },
  { value: 9, label: 'September' },
  { value: 10, label: 'Oktober' },
  { value: 11, label: 'November' },
  { value: 12, label: 'Desember' }
]

const years = [2024, 2025, 2026]

const quickTemplates = [
  { 
    months: 3, 
    label: 'Paket Triwulan', 
    amount: 150000,
    icon: '📅',
    bgColor: 'bg-blue-100',
    popular: false,
    benefits: ['Bayar 3 bulan', 'Lebih terjangkau', 'Fleksibel'],
    discount: null
  },
  { 
    months: 6, 
    label: 'Paket Semester', 
    amount: 300000,
    icon: '🎯',
    bgColor: 'bg-green-100',
    popular: true,
    benefits: ['Bayar 6 bulan', 'Paling populer', 'Hemat waktu'],
    discount: 'REKOMENDASI'
  },
  { 
    months: 9, 
    label: 'Paket 3 Cawu', 
    amount: 450000,
    icon: '⭐',
    bgColor: 'bg-purple-100',
    popular: false,
    benefits: ['Bayar 9 bulan', 'Hampir setahun', 'Praktis'],
    discount: null
  }
]

const filteredPayments = computed(() => {
  if (!filterStatus.value) return multiMonthPayments.value
  return multiMonthPayments.value.filter(p => p.status === filterStatus.value)
})

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount)
}

const getStatusLabel = (status) => {
  const labels = {
    pending: 'Belum Bayar',
    partial: 'Sebagian',
    completed: 'Lunas'
  }
  return labels[status] || status
}

const getStatusClass = (status) => {
  const classes = {
    pending: 'inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800',
    partial: 'inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800',
    completed: 'inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800'
  }
  return classes[status] || classes.pending
}

const getPeriodLabel = () => {
  if (!form.startMonth || !form.months) return ''
  
  const startIdx = form.startMonth - 1
  const endIdx = (startIdx + form.months - 1) % 12
  
  return `${months[startIdx].label} - ${months[endIdx].label} ${form.year}`
}

const calculateTotal = () => {
  // Simple calculation without discount
  return form.monthlyAmount * form.months
}

const useTemplate = (template) => {
  form.months = template.months
  form.monthlyAmount = 50000
  showCreateModal.value = true
}

const getMonthName = (monthIndex) => {
  const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ]
  return monthNames[(monthIndex - 1) % 12]
}

const closeCreateModal = () => {
  showCreateModal.value = false
  selectedPayment.value = null

  // Reset form
  Object.assign(form, {
    studentId: '',
    startMonth: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    months: 6,
    monthlyAmount: 50000,
    linkType: 'both'
  })
}

const createMultiMonthPayment = async () => {
  creating.value = true
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))

    const student = students.value.find(s => s.id === form.studentId)
    const totalAmount = calculateTotal()

    if (selectedPayment.value) {
      // Edit mode - update existing payment
      const paymentToUpdate = selectedPayment.value
      const index = multiMonthPayments.value.findIndex(p => p.id === paymentToUpdate.id)

      if (index !== -1) {
        // Preserve paid amount and progress when editing
        const updatedPayment = {
          ...paymentToUpdate,
          student,
          period_label: getPeriodLabel(),
          months: form.months,
          monthly_amount: form.monthlyAmount,
          total_amount: totalAmount,
          progress_percentage: Math.round((paymentToUpdate.paid_amount / totalAmount) * 100),
          payment_url: `https://pakasir.zone.id/pay/uang-kas-kelas-1-ibnu-sina/${totalAmount}?order_id=${student.nickname.toUpperCase()}${paymentToUpdate.id}`
        }

        multiMonthPayments.value[index] = updatedPayment
        toast.success(`✅ Pembayaran ${student.name} berhasil diupdate!`)
      }
    } else {
      // Create mode - add new payment
      const baseOrderId = `${student.nickname.toUpperCase()}${Date.now()}`
      const paymentLinks = []

      // Generate links based on selected type
      if (form.linkType === 'individual' || form.linkType === 'both') {
        // Generate individual monthly links
        for (let i = 1; i <= form.months; i++) {
          const monthOrderId = `${baseOrderId}M${i.toString().padStart(2, '0')}`
          paymentLinks.push({
            id: `individual_${i}`,
            type: 'individual',
            month: i,
            amount: form.monthlyAmount,
            order_id: monthOrderId,
            url: `https://pakasir.zone.id/pay/uang-kas-kelas-1-ibnu-sina/${form.monthlyAmount}?order_id=${monthOrderId}`,
            description: `Kas Bulan ke-${i} (${getMonthName(form.startMonth + i - 1)})`
          })
        }
      }

      if (form.linkType === 'single' || form.linkType === 'both') {
        // Generate single total link
        const totalOrderId = `${baseOrderId}TOTAL`
        paymentLinks.push({
          id: 'total',
          type: 'total',
          amount: totalAmount,
          order_id: totalOrderId,
          url: `https://pakasir.zone.id/pay/uang-kas-kelas-1-ibnu-sina/${totalAmount}?order_id=${totalOrderId}`,
          description: `Kas ${form.months} Bulan Sekaligus`
        })
      }

      const newPayment = {
        id: Date.now().toString(),
        student,
        period_label: getPeriodLabel(),
        months: form.months,
        monthly_amount: form.monthlyAmount,
        total_amount: totalAmount,
        paid_amount: 0,
        progress_percentage: 0,
        status: 'pending',
        payment_url: paymentLinks[0]?.url || '', // Default to first link
        payment_links: paymentLinks,
        link_type: form.linkType,
        month_details: []
      }

      multiMonthPayments.value.unshift(newPayment)

      const linkCount = paymentLinks.length
      const linkTypes = form.linkType === 'both' ? 'individual + total' : form.linkType
      toast.success(`✅ Multi-Month Payment berhasil dibuat!\n${linkCount} link ${linkTypes} telah digenerate`)
    }

    closeCreateModal()

  } catch (error) {
    console.error('Error saving payment:', error)
    toast.error('Gagal menyimpan pembayaran multi-bulan')
  } finally {
    creating.value = false
  }
}

const viewDetails = (payment) => {
  selectedPayment.value = payment
  showDetailModal.value = true
}

const sendReminder = async (payment) => {
  try {
    // Create beautiful comprehensive reminder message with dynamic greeting
    const student = payment.student
    const remainingAmount = payment.total_amount - payment.paid_amount
    const progressPercent = payment.progress_percentage
    const greeting = getIndonesianTimeGreeting()

    let message = `🔔 *REMINDER PEMBAYARAN MULTI-BULAN* 🔔

Assalamu'alaikum Wr. Wb.

${greeting} Bapak/Ibu orang tua dari *${student.name}* (${student.nickname}) 👋

Kami ingin mengingatkan mengenai status pembayaran kas kelas multi-bulan:

📊 *STATUS PEMBAYARAN SAAT INI:*
🏷️ Periode: *${payment.period_label}*
💰 Total Pembayaran: *${formatCurrency(payment.total_amount)}*
✅ Sudah Dibayar: *${formatCurrency(payment.paid_amount)}*
⏳ Sisa Pembayaran: *${formatCurrency(remainingAmount)}*
📈 Progress: *${progressPercent}%*

`

    if (payment.status === 'pending') {
      message += `⚠️ *STATUS: BELUM ADA PEMBAYARAN*

Mohon segera lakukan pembayaran untuk periode *${payment.period_label}*.

🎯 *PILIHAN PEMBAYARAN:*
${payment.payment_links && payment.payment_links.length > 1 ? 
'✅ Bayar Sekaligus (lebih praktis)\n✅ Bayar Bertahap (lebih fleksibel)' : 
'✅ Gunakan link pembayaran di bawah'}

`
    } else if (payment.status === 'partial') {
      message += `⏳ *STATUS: PEMBAYARAN SEBAGIAN*

Terima kasih sudah melakukan pembayaran sebagian! 🙏
Mohon lanjutkan pembayaran untuk bulan-bulan berikutnya.

💡 *SISA PEMBAYARAN:*
Tinggal *${formatCurrency(remainingAmount)}* lagi untuk melengkapi pembayaran periode ini.

`
    }

    // Add payment links if available
    if (payment.payment_links && payment.payment_links.length > 0) {
      message += `🔗 *LINK PEMBAYARAN TERSEDIA:*

`
      payment.payment_links.forEach((link, index) => {
        const icon = link.type === 'total' ? '💰' : '📅'
        message += `${icon} *${link.description}*
💵 ${formatCurrency(link.amount)}
🔗 ${link.url}

`
      })
    } else {
      message += `🔗 *LINK PEMBAYARAN:*
${payment.payment_url}

`
    }

    message += `💳 *METODE PEMBAYARAN:*
✅ Scan QR Code QRIS
✅ GoPay, OVO, DANA, ShopeePay
✅ Transfer Bank (via QRIS)
✅ Kartu Kredit/Debit

📞 *BANTUAN & SUPPORT:*
Jika ada pertanyaan atau kesulitan dalam pembayaran, silakan hubungi bendahara kelas.

Terima kasih atas perhatian dan kerjasamanya! 🙏

Wassalamu'alaikum Wr. Wb.

---
*📱 Dikirim: ${greeting} (${getIndonesianTime()})*
*🤖 Sistem Kas Kelas Otomatis*
*🔔 Pesan Reminder Otomatis*`

    // Simulate sending WhatsApp message
    const whatsappUrl = `https://wa.me/${student.phone?.replace(/\D/g, '').replace(/^0/, '62')}?text=${encodeURIComponent(message)}`

    // Open WhatsApp in new tab
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer')

    toast.success(`📤 Reminder Premium dikirim ke ${student.name}!\n📊 Progress: ${progressPercent}%`, {
      timeout: 5000
    })

  } catch (error) {
    console.error('Error sending reminder:', error)
    toast.error('Gagal mengirim reminder')
  }
}

const copyPaymentLink = async (payment) => {
  try {
    await navigator.clipboard.writeText(payment.payment_url)
    toast.success('Link berhasil disalin')
  } catch (error) {
    toast.error('Gagal menyalin link')
  }
}

const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text)
    toast.success('Berhasil disalin')
  } catch (error) {
    toast.error('Gagal menyalin')
  }
}

const sendPaymentReminder = async (payment) => {
  // Use the same comprehensive reminder as sendReminder
  await sendReminder(payment)
  showDetailModal.value = false
}

const sendPaymentLinkWhatsApp = async (link, student) => {
  try {
    const studentName = student?.name || 'Siswa'
    const phone = student?.phone || ''

    // Create beautiful message based on link type with dynamic greeting
    const greeting = getIndonesianTimeGreeting()
    let message = `🎯 *LINK PEMBAYARAN KAS KELAS* 🎯

Assalamu'alaikum Wr. Wb.

${greeting} Bapak/Ibu orang tua dari *${studentName}* 👋

Dengan hormat, kami mengirimkan link pembayaran kas kelas untuk kemudahan Bapak/Ibu.

`

    if (link.type === 'total') {
      message += `💰 *PEMBAYARAN SEKALIGUS*
🏷️ ${link.description.toUpperCase()}
💵 Jumlah: *${formatCurrency(link.amount)}*

✨ *KEUNTUNGAN BAYAR SEKALIGUS:*
✅ Lebih praktis dan efisien
✅ Tidak perlu ingat jadwal bulanan
✅ Sekali bayar, langsung lunas untuk beberapa bulan
✅ Hemat waktu dan tenaga`
    } else {
      message += `📅 *PEMBAYARAN BERTAHAP*
🏷️ ${link.description.toUpperCase()}
💵 Jumlah: *${formatCurrency(link.amount)}*

✨ *KEUNTUNGAN BAYAR BERTAHAP:*
✅ Lebih fleksibel sesuai budget
✅ Bayar per bulan sesuai kemampuan
✅ Bisa mulai kapan saja
✅ Tidak memberatkan keuangan`
    }

    message += `

🔗 *LINK PEMBAYARAN:*
${link.url}

💳 *METODE PEMBAYARAN TERSEDIA:*
✅ Scan QR Code QRIS
✅ GoPay, OVO, DANA, ShopeePay
✅ Transfer Bank (via QRIS)
✅ Kartu Kredit/Debit

📱 *CARA PEMBAYARAN:*
1. Klik link di atas
2. Pilih metode pembayaran
3. Scan QR Code atau ikuti instruksi
4. Selesai! Pembayaran otomatis tercatat

📞 *BANTUAN:*
Jika ada kesulitan, silakan hubungi bendahara kelas.

Terima kasih atas kepercayaan dan kerjasamanya! 🙏

Wassalamu'alaikum Wr. Wb.

---
*📝 Order ID: \`${link.order_id}\`*
*📱 Dikirim: ${greeting} (${getIndonesianTime()})*
*🤖 Sistem Kas Kelas Otomatis*`

    // Clean phone number for WhatsApp (Indonesian format)
    const cleanPhone = phone.replace(/\D/g, '').replace(/^0/, '62')

    // Create WhatsApp URL
    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`

    // Open WhatsApp directly
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer')

    toast.success(`📱 Template Premium dikirim ke ${studentName}!\n🎯 ${link.description}`, {
      timeout: 4000
    })

  } catch (error) {
    console.error('Error opening WhatsApp:', error)
    toast.error('Gagal membuka WhatsApp')
  }
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const markMonthAsPaid = async (payment, month) => {
  if (!confirm(`Tandai ${month.label} untuk ${payment.student?.name} sebagai LUNAS?\n\nJumlah: ${formatCurrency(month.amount)}`)) {
    return
  }

  try {
    // Update month as paid
    month.paid = true
    month.paid_at = new Date().toISOString()

    // Recalculate payment progress
    const paidMonths = payment.month_details.filter(m => m.paid).length
    const totalMonths = payment.month_details.length
    const newPaidAmount = paidMonths * payment.monthly_amount
    const newProgressPercentage = Math.round((paidMonths / totalMonths) * 100)

    // Update payment object
    payment.paid_amount = newPaidAmount
    payment.progress_percentage = newProgressPercentage

    // Update status based on progress
    if (newProgressPercentage === 100) {
      payment.status = 'completed'
    } else if (newProgressPercentage > 0) {
      payment.status = 'partial'
    }

    // Save to localStorage (in a real app, this would be API call)
    localStorage.setItem('multiMonthPayments', JSON.stringify(multiMonthPayments.value))

    toast.success(`✅ ${month.label} berhasil ditandai LUNAS!\nProgress: ${newProgressPercentage}%`, {
      timeout: 4000
    })

  } catch (error) {
    console.error('Error marking month as paid:', error)
    toast.error('Gagal menandai bulan sebagai lunas')
  }
}

const markAllMonthsAsPaid = async (payment) => {
  const unpaidMonths = payment.month_details.filter(m => !m.paid)
  const totalUnpaidAmount = unpaidMonths.length * payment.monthly_amount

  if (!confirm(`Tandai SEMUA bulan yang belum lunas untuk ${payment.student?.name}?\n\n${unpaidMonths.length} bulan × ${formatCurrency(payment.monthly_amount)} = ${formatCurrency(totalUnpaidAmount)}`)) {
    return
  }

  try {
    const currentTime = new Date().toISOString()

    // Mark all unpaid months as paid
    unpaidMonths.forEach(month => {
      month.paid = true
      month.paid_at = currentTime
    })

    // Update payment progress to 100%
    payment.paid_amount = payment.total_amount
    payment.progress_percentage = 100
    payment.status = 'completed'

    // Save to localStorage (in a real app, this would be API call)
    localStorage.setItem('multiMonthPayments', JSON.stringify(multiMonthPayments.value))

    toast.success(`🎉 SEMUA bulan berhasil ditandai LUNAS!\n${payment.student?.name} - ${formatCurrency(totalUnpaidAmount)}`, {
      timeout: 5000
    })

  } catch (error) {
    console.error('Error marking all months as paid:', error)
    toast.error('Gagal menandai semua bulan sebagai lunas')
  }
}

const downloadMultiMonthPDF = async () => {
  try {
    const pdfContent = generateMultiMonthPDFContent()

    const printWindow = window.open('', '_blank')
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Laporan Multi-Month Payment - ${new Date().toLocaleDateString('id-ID')}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { color: #1f2937; border-bottom: 2px solid #3b82f6; padding-bottom: 10px; }
            h2 { color: #374151; margin-top: 20px; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th, td { border: 1px solid #d1d5db; padding: 8px; text-align: left; }
            th { background-color: #f3f4f6; font-weight: bold; }
            .status-pending { color: #d97706; }
            .status-partial { color: #2563eb; }
            .status-completed { color: #059669; }
            .summary { background-color: #f9fafb; padding: 15px; border-radius: 8px; margin: 20px 0; }
            .footer { margin-top: 30px; text-align: center; color: #6b7280; font-size: 12px; }
            .progress-bar { width: 100%; height: 20px; background-color: #e5e7eb; border-radius: 10px; }
            .progress-fill { height: 100%; background-color: #3b82f6; border-radius: 10px; }
          </style>
        </head>
        <body>
          ${pdfContent}
          <div class="footer">
            Generated on ${new Date().toLocaleString('id-ID')} | Sistem Kas Kelas Multi-Month
          </div>
        </body>
        </html>
      `)
      printWindow.document.close()

      setTimeout(() => {
        printWindow.print()
      }, 500)
    }

    toast.success('PDF Report Multi-Month siap untuk di-print/save')

  } catch (error) {
    console.error('Error generating Multi-Month PDF:', error)
    toast.error('Gagal membuat PDF report')
  }
}

const generateMultiMonthPDFContent = () => {
  const payments = filteredPayments.value
  const totalStudents = payments.length
  const completedPayments = payments.filter(p => p.status === 'completed').length
  const partialPayments = payments.filter(p => p.status === 'partial').length
  const pendingPayments = payments.filter(p => p.status === 'pending').length
  const totalAmount = payments.reduce((sum, p) => sum + p.total_amount, 0)
  const totalPaidAmount = payments.reduce((sum, p) => sum + p.paid_amount, 0)

  let tableRows = ''
  payments.forEach(payment => {
    const statusClass = `status-${payment.status}`
    tableRows += `
      <tr>
        <td>${payment.student?.name || '-'}</td>
        <td>${payment.period_label}</td>
        <td>${payment.months} bulan</td>
        <td>${formatCurrency(payment.total_amount)}</td>
        <td>${formatCurrency(payment.paid_amount)}</td>
        <td>
          <div class="progress-bar">
            <div class="progress-fill" style="width: ${payment.progress_percentage}%"></div>
          </div>
          ${payment.progress_percentage}%
        </td>
        <td class="${statusClass}">${getStatusLabel(payment.status)}</td>
      </tr>
    `
  })

  return `
    <h1>📊 Laporan Pembayaran Multi-Bulan</h1>

    <div class="summary">
      <h2>📈 Ringkasan</h2>
      <p><strong>Total Siswa:</strong> ${totalStudents}</p>
      <p><strong>Lunas:</strong> ${completedPayments} | <strong>Sebagian:</strong> ${partialPayments} | <strong>Pending:</strong> ${pendingPayments}</p>
      <p><strong>Total Amount:</strong> ${formatCurrency(totalAmount)}</p>
      <p><strong>Total Terbayar:</strong> ${formatCurrency(totalPaidAmount)}</p>
      <p><strong>Progress Keseluruhan:</strong> ${Math.round((totalPaidAmount / totalAmount) * 100) || 0}%</p>
      <p><strong>Filter Status:</strong> ${filterStatus.value || 'Semua Status'}</p>
    </div>

    <h2>📋 Detail Pembayaran Multi-Bulan</h2>
    <table>
      <thead>
        <tr>
          <th>Nama Siswa</th>
          <th>Periode</th>
          <th>Durasi</th>
          <th>Total Amount</th>
          <th>Terbayar</th>
          <th>Progress</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        ${tableRows || '<tr><td colspan="7" style="text-align: center; color: #6b7280;">Tidak ada data pembayaran multi-bulan</td></tr>'}
      </tbody>
    </table>
  `
}

const sendAllPaymentLinks = async (payment) => {
  if (!payment.payment_links || payment.payment_links.length === 0) {
    toast.warning('Tidak ada link pembayaran untuk dikirim')
    return
  }

  try {
    const student = payment.student
    const studentName = student?.name || 'Siswa'
    const phone = student?.phone || ''

    // Create beautiful comprehensive message with all payment options
    const greeting = getIndonesianTimeGreeting()
    let message = `🌟 *PEMBAYARAN KAS KELAS MULTI-BULAN* 🌟

Assalamu'alaikum Wr. Wb.

${greeting} Bapak/Ibu orang tua dari *${studentName}* 👋

Kami menyediakan *BEBERAPA OPSI PEMBAYARAN* yang dapat dipilih sesuai kemudahan Bapak/Ibu:

📋 *PILIHAN PEMBAYARAN TERSEDIA:*

`

    // Add each payment link option with better formatting
    payment.payment_links.forEach((link, index) => {
      const icon = link.type === 'total' ? '💰' : '📅'
      const typeLabel = link.type === 'total' ? 'SEKALIGUS' : 'BERTAHAP'
      
      message += `${index + 1}. ${icon} *${link.description.toUpperCase()}*
   💵 Jumlah: *${formatCurrency(link.amount)}*
   🏷️ Tipe: ${typeLabel}
   🔗 Link: ${link.url}
   📝 Order ID: \`${link.order_id}\`

`
    })

    message += `🎯 *KEUNTUNGAN SETIAP OPSI:*

${payment.payment_links.find(l => l.type === 'total') ? '💰 *Bayar Sekaligus:*\n   ✅ Lebih praktis dan cepat\n   ✅ Tidak perlu ingat jadwal bulanan\n   ✅ Sekali bayar, langsung lunas\n\n' : ''}${payment.payment_links.find(l => l.type === 'individual') ? '📅 *Bayar Bertahap:*\n   ✅ Lebih fleksibel sesuai budget\n   ✅ Bayar per bulan sesuai kebutuhan\n   ✅ Bisa mulai kapan saja\n\n' : ''}💳 *METODE PEMBAYARAN TERSEDIA:*

✅ Scan QR Code QRIS
✅ GoPay, OVO, DANA, ShopeePay
✅ Transfer Bank (via QRIS)
✅ Kartu Kredit/Debit

📞 *BANTUAN & SUPPORT:*
Jika ada pertanyaan atau kesulitan dalam pembayaran, silakan hubungi bendahara kelas.

Terima kasih atas kepercayaan dan kerjasamanya! 🙏

Wassalamu'alaikum Wr. Wb.

---
*📱 Dikirim: ${greeting} (${getIndonesianTime()})*
*🤖 Sistem Kas Kelas Otomatis*
*⚡ Powered by Multi-Month Payment*`

    // Clean phone number for WhatsApp (Indonesian format)
    const cleanPhone = phone.replace(/\D/g, '').replace(/^0/, '62')

    // Create WhatsApp URL
    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`

    // Open WhatsApp directly
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer')

    toast.success(`📱 Template Premium dikirim ke ${studentName}!\n🎯 ${payment.payment_links.length} opsi pembayaran tersedia`, {
      timeout: 5000
    })

  } catch (error) {
    console.error('Error opening WhatsApp:', error)
    toast.error('Gagal membuka WhatsApp')
  }
}

const editPayment = (payment) => {
  // Populate form with payment data for editing
  const student = payment.student
  form.studentId = student.id
  form.months = payment.months
  form.monthlyAmount = payment.monthly_amount

  // Set start month and year from period
  const currentDate = new Date()
  form.startMonth = currentDate.getMonth() + 1
  form.year = currentDate.getFullYear()

  // Store the payment being edited
  selectedPayment.value = payment
  showCreateModal.value = true

  toast.info(`Editing pembayaran untuk ${student.name}`)
}

const deletePayment = (payment) => {
  if (!confirm(`Yakin ingin menghapus pembayaran multi-bulan untuk ${payment.student.name}?\n\nPeriode: ${payment.period_label}\nTotal: ${formatCurrency(payment.total_amount)}`)) {
    return
  }

  try {
    // Find and remove payment from array
    const index = multiMonthPayments.value.findIndex(p => p.id === payment.id)
    if (index !== -1) {
      multiMonthPayments.value.splice(index, 1)
      toast.success(`✅ Pembayaran ${payment.student.name} berhasil dihapus`)
    } else {
      toast.warning('Pembayaran tidak ditemukan')
    }
  } catch (error) {
    console.error('Error deleting payment:', error)
    toast.error('Gagal menghapus pembayaran')
  }
}

onMounted(() => {
  // Component initialization
})
</script>
