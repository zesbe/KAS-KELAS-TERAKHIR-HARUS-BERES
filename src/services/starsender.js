// StarSender WhatsApp API Service
// Updated dengan API terbaru menggunakan Supabase Edge Function proxy

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const PROXY_URL = `${SUPABASE_URL}/functions/v1/starsender-proxy`

class StarSenderService {
  constructor() {
    this.deviceApiKey = import.meta.env.VITE_STARSENDER_DEVICE_API_KEY
  }

  // Format phone number untuk StarSender API
  formatPhoneNumber(phone) {
    if (!phone) return null
    
    // Remove semua non-digit characters
    let cleaned = phone.replace(/\D/g, '')
    
    // Handle berbagai format nomor Indonesia
    if (cleaned.startsWith('0')) {
      // Ubah 08xxx menjadi 628xxx
      cleaned = '62' + cleaned.substring(1)
    } else if (cleaned.startsWith('8')) {
      // Ubah 8xxx menjadi 628xxx
      cleaned = '62' + cleaned
    } else if (!cleaned.startsWith('62')) {
      // Jika tidak ada kode negara, tambahkan 62
      cleaned = '62' + cleaned
    }
    
    return cleaned
  }

  // Validasi konfigurasi API key
  validateConfiguration() {
    if (!this.deviceApiKey || this.deviceApiKey === 'your-device-api-key') {
      throw new Error('StarSender Device API key belum dikonfigurasi. Silakan set environment variable VITE_STARSENDER_DEVICE_API_KEY')
    }
    return true
  }

  // Kirim pesan teks
  async sendMessage(phoneNumber, message, options = {}) {
    try {
      this.validateConfiguration()
      
      const formattedPhone = this.formatPhoneNumber(phoneNumber)
      if (!formattedPhone) {
        throw new Error('Nomor telefon tidak valid')
      }

      const payload = {
        messageType: 'text',
        to: formattedPhone,
        body: message,
        ...options
      }

      // Jika ada delay, tambahkan ke payload
      if (options.delay) {
        payload.delay = parseInt(options.delay)
      }

      // Jika ada schedule, tambahkan ke payload
      if (options.schedule) {
        payload.schedule = options.schedule
      }

      console.log('Sending message to StarSender via proxy:', {
        to: formattedPhone,
        messageLength: message.length,
        hasDelay: !!options.delay,
        hasSchedule: !!options.schedule
      })

      const response = await fetch(PROXY_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({
          action: 'send',
          phoneNumber: formattedPhone,
          message: message,
          delay: options.delay,
          schedule: options.schedule
        })
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(`HTTP ${response.status}: ${errorData.message || response.statusText}`)
      }

      const data = await response.json()
      
      if (!data.success) {
        throw new Error(data.message || 'Gagal mengirim pesan')
      }

      console.log('Message sent successfully:', data)
      return {
        success: true,
        data: data.data,
        message: data.message
      }

    } catch (error) {
      console.error('StarSender send message error:', error)
      
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Gagal terhubung ke StarSender API. Periksa koneksi internet.')
      }
      
      throw error
    }
  }

  // Kirim pesan dengan file (media)
  async sendMediaMessage(phoneNumber, message, fileUrl, options = {}) {
    try {
      this.validateConfiguration()
      
      const formattedPhone = this.formatPhoneNumber(phoneNumber)
      if (!formattedPhone) {
        throw new Error('Nomor telefon tidak valid')
      }

      if (!fileUrl) {
        throw new Error('URL file harus diisi untuk pesan media')
      }

      const payload = {
        messageType: 'media',
        to: formattedPhone,
        body: message || '',
        file: fileUrl,
        ...options
      }

      // Jika ada delay, tambahkan ke payload
      if (options.delay) {
        payload.delay = parseInt(options.delay)
      }

      // Jika ada schedule, tambahkan ke payload
      if (options.schedule) {
        payload.schedule = options.schedule
      }

      console.log('Sending media message to StarSender via proxy:', {
        to: formattedPhone,
        fileUrl,
        messageLength: message?.length || 0,
        hasDelay: !!options.delay,
        hasSchedule: !!options.schedule
      })

      const response = await fetch(PROXY_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({
          action: 'send',
          phoneNumber: formattedPhone,
          message: message || '',
          fileUrl: fileUrl,
          delay: options.delay,
          schedule: options.schedule
        })
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(`HTTP ${response.status}: ${errorData.message || response.statusText}`)
      }

      const data = await response.json()
      
      if (!data.success) {
        throw new Error(data.message || 'Gagal mengirim pesan media')
      }

      console.log('Media message sent successfully:', data)
      return {
        success: true,
        data: data.data,
        message: data.message
      }

    } catch (error) {
      console.error('StarSender send media message error:', error)
      
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Gagal terhubung ke StarSender API. Periksa koneksi internet.')
      }
      
      throw error
    }
  }

  // Kirim pesan ke multiple nomor (broadcast)
  async sendBroadcastMessage(phoneNumbers, message, options = {}) {
    try {
      this.validateConfiguration()
      
      if (!Array.isArray(phoneNumbers) || phoneNumbers.length === 0) {
        throw new Error('Daftar nomor telefon harus berupa array dan tidak boleh kosong')
      }

      const results = []
      const delay = options.delayBetweenMessages || 1 // Default 1 detik antar pesan

      for (let i = 0; i < phoneNumbers.length; i++) {
        const phone = phoneNumbers[i]
        
        try {
          // Tambahkan delay antar pesan untuk menghindari rate limit
          const messageDelay = (options.delay || 0) + (i * delay)
          
          const result = await this.sendMessage(phone, message, {
            ...options,
            delay: messageDelay
          })
          
          results.push({
            phone,
            success: true,
            result
          })
          
        } catch (error) {
          console.error(`Failed to send message to ${phone}:`, error)
          results.push({
            phone,
            success: false,
            error: error.message
          })
        }

        // Delay antar request untuk menghindari rate limit
        if (i < phoneNumbers.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 500))
        }
      }

      const successCount = results.filter(r => r.success).length
      const failedCount = results.filter(r => !r.success).length

      return {
        success: true,
        totalSent: phoneNumbers.length,
        successCount,
        failedCount,
        results
      }

    } catch (error) {
      console.error('StarSender broadcast error:', error)
      throw error
    }
  }

  // Test koneksi (safe mode - hanya validasi konfigurasi)
  async testConnectionSafe() {
    try {
      this.validateConfiguration()
      
      return {
        success: true,
        message: 'StarSender konfigurasi valid',
        deviceKeyConfigured: true,
        note: 'API key format valid. Test pengiriman akan dilakukan saat mengirim pesan.'
      }
    } catch (error) {
      throw new Error(`Konfigurasi StarSender error: ${error.message}`)
    }
  }

  // Get status konfigurasi
  getConfigurationStatus() {
    return {
      deviceApiKey: {
        configured: !!this.deviceApiKey && this.deviceApiKey !== 'your-device-api-key',
        masked: this.deviceApiKey ? `${this.deviceApiKey.substring(0, 8)}...` : 'Not set'
      },
      ready: !!this.deviceApiKey && this.deviceApiKey !== 'your-device-api-key'
    }
  }

  // Format pesan dengan template
  formatMessage(template, data = {}) {
    let message = template
    
    // Replace placeholders dengan data
    Object.keys(data).forEach(key => {
      const placeholder = `{${key}}`
      message = message.replace(new RegExp(placeholder, 'g'), data[key] || '')
    })
    
    return message
  }

  // Generate template pesan pembayaran
  generatePaymentMessage(paymentData) {
    const {
      studentName,
      amount,
      description,
      dueDate,
      orderId,
      paymentUrl
    } = paymentData

    return `🏫 *Pembayaran Kas Kelas 1B*
SD Islam Al Husna

Halo, Orang Tua/Wali dari *${studentName}*

📋 *Detail Pembayaran:*
• Keterangan: ${description}
• Jumlah: Rp ${amount?.toLocaleString('id-ID')}
• Jatuh Tempo: ${dueDate}
• Order ID: ${orderId}

💳 *Link Pembayaran:*
${paymentUrl}

Silakan klik link di atas untuk melakukan pembayaran.

Terima kasih atas perhatiannya! 🙏

_Pesan otomatis dari Sistem Kas Kelas_`
  }

  // Generate template reminder pembayaran
  generateReminderMessage(paymentData) {
    const {
      studentName,
      amount,
      description,
      daysOverdue,
      paymentUrl
    } = paymentData

    return `🔔 *Reminder Pembayaran Kas Kelas*
SD Islam Al Husna

Halo, Orang Tua/Wali dari *${studentName}*

⚠️ Pembayaran kas kelas telah melewati jatuh tempo ${daysOverdue} hari.

📋 *Detail:*
• Keterangan: ${description}
• Jumlah: Rp ${amount?.toLocaleString('id-ID')}

💳 *Link Pembayaran:*
${paymentUrl}

Mohon segera melakukan pembayaran. Terima kasih! 🙏

_Pesan reminder otomatis_`
  }
}

export default new StarSenderService()
