<template>
  <div
    v-if="show"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
  >
    <div class="bg-white rounded-2xl max-w-md w-full mx-4 p-6 shadow-2xl transform transition-all duration-300 scale-100">
      <div class="text-center mb-6">
        <div class="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <DocumentTextIcon class="w-8 h-8 text-white" />
        </div>
        <h3 class="text-xl font-bold text-gray-800 mb-2">📄 Pilih Aksi Laporan</h3>
        <p class="text-gray-600 text-sm">
          Pilih apakah Anda ingin mencetak langsung atau mengunduh file laporan
        </p>
      </div>

      <div class="space-y-3">
        <!-- Print Option -->
        <button
          @click="handlePrint"
          class="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:-translate-y-1"
        >
          <PrinterIcon class="w-5 h-5 mr-3" />
          <div class="text-left">
            <div class="font-semibold">🖨️ Cetak Langsung</div>
            <div class="text-sm text-green-100">Buka dialog printer untuk cetak</div>
          </div>
        </button>

        <!-- Download Option -->
        <button
          @click="handleDownload"
          class="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:-translate-y-1"
        >
          <DocumentArrowDownIcon class="w-5 h-5 mr-3" />
          <div class="text-left">
            <div class="font-semibold">💾 Download File</div>
            <div class="text-sm text-blue-100">Simpan file ke perangkat</div>
          </div>
        </button>

        <!-- Preview Option (bonus) -->
        <button
          @click="handlePreview"
          class="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:-translate-y-1"
        >
          <EyeIcon class="w-5 h-5 mr-3" />
          <div class="text-left">
            <div class="font-semibold">👁️ Preview Dulu</div>
            <div class="text-sm text-purple-100">Lihat sebelum print/download</div>
          </div>
        </button>
      </div>

      <!-- Cancel Button -->
      <div class="mt-6 pt-4 border-t border-gray-200">
        <button
          @click="$emit('close')"
          class="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-xl transition-all duration-200"
        >
          Batal
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineEmits } from 'vue'
import {
  DocumentTextIcon,
  DocumentArrowDownIcon,
  PrinterIcon,
  EyeIcon
} from '@heroicons/vue/24/outline'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'print', 'download', 'preview'])

const handlePrint = () => {
  emit('print')
}

const handleDownload = () => {
  emit('download')
}

const handlePreview = () => {
  emit('preview')
}
</script>
