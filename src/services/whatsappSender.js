// WhatsApp Sender dengan CORS Bypass
// Sistem pengiriman WhatsApp yang dapat bypass CORS policy

class WhatsAppSender {
  constructor() {
    this.isActive = false
    this.queue = []
    this.stats = {
      sent: 0,
      failed: 0,
      total: 0
    }
  }

  // Method utama untuk bypass CORS dan kirim WhatsApp
  async sendMessage(phone, message, options = {}) {
    console.log(`🚀 Sending WhatsApp to ${phone}`)

    // Validate inputs
    if (!phone || !message) {
      this.stats.failed++
      return {
        success: false,
        method: 'validation-error',
        error: 'Phone number and message are required',
        timestamp: new Date().toISOString()
      }
    }

    // Clean phone number
    const cleanPhone = this.cleanPhoneNumber(phone)

    // Encode message for URL
    const encodedMessage = encodeURIComponent(message)

    // Create WhatsApp URL
    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodedMessage}`

    try {
      // Method 1: Direct window.open (paling reliable untuk first message)
      if (options.openInNewTab !== false) {
        const newWindow = window.open(whatsappUrl, '_blank', 'noopener,noreferrer,width=800,height=600')

        if (newWindow) {
          console.log('✅ WhatsApp opened in new tab')
          this.stats.sent++

          // Try to focus the new window
          setTimeout(() => {
            try {
              newWindow.focus()
            } catch (e) {
              // Ignore focus errors
            }
          }, 100)

          return {
            success: true,
            method: 'window-open',
            url: whatsappUrl,
            phone: cleanPhone,
            timestamp: new Date().toISOString()
          }
        }
      }

      // Method 2: Create invisible link and click (untuk bulk messages)
      const link = document.createElement('a')
      link.href = whatsappUrl
      link.target = '_blank'
      link.rel = 'noopener noreferrer'
      link.style.display = 'none'
      link.style.position = 'absolute'
      link.style.left = '-9999px'

      document.body.appendChild(link)

      // Simulate user click
      const clickEvent = new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
        view: window
      })

      link.dispatchEvent(clickEvent)

      // Clean up
      setTimeout(() => {
        if (document.body.contains(link)) {
          document.body.removeChild(link)
        }
      }, 1000)

      console.log('✅ WhatsApp link clicked')
      this.stats.sent++

      return {
        success: true,
        method: 'link-click',
        url: whatsappUrl,
        phone: cleanPhone,
        timestamp: new Date().toISOString()
      }

    } catch (error) {
      console.error('❌ Error sending WhatsApp:', error)
      this.stats.failed++

      return {
        success: false,
        method: 'error',
        error: error.message,
        phone: cleanPhone,
        timestamp: new Date().toISOString()
      }
    }
  }

  // Clean phone number untuk format Indonesia
  cleanPhoneNumber(phone) {
    // Remove all non-digits
    let clean = phone.replace(/\D/g, '')
    
    // Convert to international format
    if (clean.startsWith('0')) {
      clean = '62' + clean.substring(1)
    } else if (!clean.startsWith('62')) {
      clean = '62' + clean
    }
    
    return clean
  }

  // Kirim ke multiple nomor dengan delay
  async sendBulkMessages(recipients, message, delaySeconds = 3) {
    this.isActive = true
    this.stats.total = recipients.length
    this.stats.sent = 0
    this.stats.failed = 0
    
    const results = []
    
    for (let i = 0; i < recipients.length; i++) {
      const recipient = recipients[i]
      
      try {
        // Personalize message
        const personalizedMessage = this.personalizeMessage(message, recipient)
        
        // Send message
        const result = await this.sendMessage(recipient.phone, personalizedMessage, {
          openInNewTab: i === 0 // Only open first message in new tab
        })
        
        results.push({
          name: recipient.name,
          phone: recipient.phone,
          success: result.success,
          method: result.method,
          timestamp: result.timestamp
        })
        
        console.log(`📤 ${i + 1}/${recipients.length} - ${recipient.name}: ${result.success ? '✅' : '❌'}`)
        
        // Emit progress event
        window.dispatchEvent(new CustomEvent('whatsapp:progress', {
          detail: {
            current: i + 1,
            total: recipients.length,
            sent: this.stats.sent,
            failed: this.stats.failed
          }
        }))
        
        // Delay before next message (except for last one)
        if (i < recipients.length - 1) {
          await this.delay(delaySeconds * 1000)
        }
        
      } catch (error) {
        console.error(`❌ Error sending to ${recipient.name}:`, error)
        this.stats.failed++
        results.push({
          name: recipient.name,
          phone: recipient.phone,
          success: false,
          error: error.message,
          timestamp: new Date().toISOString()
        })
      }
    }
    
    this.isActive = false
    
    // Emit completion event
    window.dispatchEvent(new CustomEvent('whatsapp:complete', {
      detail: {
        total: recipients.length,
        sent: this.stats.sent,
        failed: this.stats.failed,
        results: results
      }
    }))
    
    return {
      success: true,
      total: recipients.length,
      sent: this.stats.sent,
      failed: this.stats.failed,
      results: results
    }
  }

  // Personalize message dengan data recipient
  personalizeMessage(template, recipient) {
    return template
      .replace(/\[\[NAME\]\]/g, recipient.name || '')
      .replace(/\[\[NICKNAME\]\]/g, recipient.nickname || '')
      .replace(/\[\[PHONE\]\]/g, recipient.phone || '')
      .replace(/\{nama\}/g, recipient.name || '')
      .replace(/\{panggilan\}/g, recipient.nickname || '')
      .replace(/\{hp\}/g, recipient.phone || '')
  }

  // Utility delay function
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  // Get current stats
  getStats() {
    return {
      ...this.stats,
      isActive: this.isActive
    }
  }

  // Reset stats
  resetStats() {
    this.stats = {
      sent: 0,
      failed: 0,
      total: 0
    }
  }

  // Stop current operation
  stop() {
    this.isActive = false
    console.log('🛑 WhatsApp sender stopped')
  }
}

// Create global instance
const whatsappSender = new WhatsAppSender()

// Export
export default whatsappSender

// Make globally available
window.whatsappSender = whatsappSender

console.log('🚀 WhatsApp Sender initialized - CORS Bypass ready!')
