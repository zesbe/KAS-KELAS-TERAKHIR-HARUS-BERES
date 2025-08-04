// Payment Notification Service
// Auto-send WhatsApp notifications when payment is successful via webhook

import { db } from '@/lib/supabase'
import starsenderService from './starsender'
import enhancedCampaignService from './enhancedCampaignService'

class PaymentNotificationService {
  constructor() {
    this.webhookQueue = new Map() // Queue untuk webhook processing
  }

  // Process webhook dan kirim notifikasi otomatis
  async processPaymentWebhook(webhookData) {
    try {
      console.log('Processing payment webhook:', webhookData)

      // Validate webhook data
      if (!webhookData.order_id || !webhookData.amount) {
        throw new Error('Webhook data incomplete: missing order_id or amount')
      }

      // Get payment link data from database using order_id
      const paymentLinkData = await this.getPaymentLinkByOrderId(webhookData.order_id)
      
      if (!paymentLinkData) {
        console.warn(`Payment link not found for order_id: ${webhookData.order_id}`)
        // Still process but won't send notification
        return await this.saveWebhookLog(webhookData, false, 'Payment link not found in database')
      }

      // Update payment link status to completed
      await this.updatePaymentLinkStatus(paymentLinkData.id, {
        status: 'completed',
        payment_method: webhookData.payment_method,
        completed_at: webhookData.completed_at || new Date().toISOString(),
        webhook_data: webhookData
      })

      // Get student info
      const student = await this.getStudentById(paymentLinkData.student_id)
      
      if (!student) {
        console.warn(`Student not found for ID: ${paymentLinkData.student_id}`)
        return await this.saveWebhookLog(webhookData, false, 'Student not found')
      }

      // Create transaction record
      await this.createTransactionRecord({
        student_id: student.id,
        type: 'income',
        amount: parseInt(webhookData.amount),
        description: paymentLinkData.description || 'Kas Kelas',
        payment_method: webhookData.payment_method,
        order_id: webhookData.order_id,
        status: 'completed',
        completed_at: webhookData.completed_at
      })

      // Generate dan kirim notifikasi WhatsApp
      await this.sendPaymentSuccessNotification(student, paymentLinkData, webhookData)

      // Save webhook log as processed
      await this.saveWebhookLog(webhookData, true, 'Successfully processed and notification sent')

      return {
        success: true,
        message: 'Payment processed and notification sent',
        student: student,
        paymentData: paymentLinkData
      }

    } catch (error) {
      console.error('Error processing payment webhook:', error)
      
      // Save error log
      await this.saveWebhookLog(webhookData, false, error.message)
      
      throw error
    }
  }

  // Kirim notifikasi WhatsApp pembayaran sukses
  async sendPaymentSuccessNotification(student, paymentData, webhookData) {
    try {
      console.log(`Sending payment success notification to ${student.name}`)

      // Generate confirmation message
      const confirmationMessage = this.generatePaymentConfirmationMessage(
        student, 
        paymentData, 
        webhookData
      )

      // Send via StarSender
      const result = await starsenderService.sendMessage(
        student.phone,
        confirmationMessage
      )

      console.log(`Payment confirmation sent to ${student.name}:`, result)
      return result

    } catch (error) {
      console.error(`Failed to send payment confirmation to ${student.name}:`, error)
      throw error
    }
  }

  // Generate pesan konfirmasi pembayaran
  generatePaymentConfirmationMessage(student, paymentData, webhookData) {
    const paymentDate = new Date(webhookData.completed_at || Date.now())
    const formattedDate = paymentDate.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })

    const currentMonth = new Date().toLocaleDateString('id-ID', { 
      month: 'long', 
      year: 'numeric' 
    })

    // Generate referensi number (last 8 digits of order_id)
    const referenceNumber = webhookData.order_id.slice(-8).toUpperCase()

    return `✅ *Pembayaran Berhasil Diterima*
SD Islam Al Husna

Terima kasih ${student.name} (${student.nickname})! ���

💰 *Detail Pembayaran:*
• Jumlah: Rp ${parseInt(webhookData.amount).toLocaleString('id-ID')}
• Tanggal: ${formattedDate}
• Metode: ${this.formatPaymentMethod(webhookData.payment_method)}
• Ref: ${referenceNumber}

📋 *Status Kas Terbaru:*
• Bulan: ${currentMonth}
• Status: LUNAS ✅
• Keterangan: ${paymentData.description || 'Kas Kelas'}

🎉 Pembayaran Anda telah dikonfirmasi dan tercatat dalam sistem kas kelas.

Terima kasih atas kepercayaan dan kerjasamanya! 💙

_Konfirmasi Otomatis - Bendahara Kelas 1B_
_💻 Sistem Kas Digital SD Islam Al Husna_

📱 Butuh bantuan? Hubungi Bu Siti: 0812-xxxx-xxxx`
  }

  // Format payment method untuk display
  formatPaymentMethod(method) {
    if (!method) return 'Transfer Bank'
    
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

    return methodMap[method.toLowerCase()] || method.toUpperCase()
  }

  // Get payment link by order_id
  async getPaymentLinkByOrderId(orderId) {
    try {
      // Try database first
      const { data, error } = await db.getPaymentLinks ? 
        await db.getPaymentLinks() : 
        { data: [], error: null }

      if (!error && data) {
        const paymentLink = data.find(link => link.order_id === orderId)
        if (paymentLink) return paymentLink
      }

      // Fallback to localStorage
      const stored = localStorage.getItem('paymentLinks')
      if (stored) {
        const links = JSON.parse(stored)
        return links.find(link => link.order_id === orderId)
      }

      return null
    } catch (error) {
      console.error('Error getting payment link:', error)
      return null
    }
  }

  // Get student by ID  
  async getStudentById(studentId) {
    try {
      const { data: students, error } = await db.getStudents()
      if (error) throw error

      return students.find(student => student.id === studentId)
    } catch (error) {
      console.error('Error getting student:', error)
      return null
    }
  }

  // Update payment link status
  async updatePaymentLinkStatus(linkId, updates) {
    try {
      const { data, error } = await db.updatePaymentLink ? 
        await db.updatePaymentLink(linkId, {
          ...updates,
          updated_at: new Date().toISOString()
        }) :
        this.updatePaymentLinkInStorage(linkId, updates)

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error updating payment link:', error)
      throw error
    }
  }

  // Create transaction record
  async createTransactionRecord(transactionData) {
    try {
      const transaction = {
        ...transactionData,
        id: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 8)}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      const { data, error } = await db.addTransaction ? 
        await db.addTransaction(transaction) :
        this.saveTransactionToStorage(transaction)

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error creating transaction:', error)
      throw error
    }
  }

  // Save webhook log
  async saveWebhookLog(webhookData, processed = false, message = '') {
    try {
      const logData = {
        id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 8)}`,
        source: 'pakasir',
        event_type: 'payment_webhook',
        order_id: webhookData.order_id,
        payload: webhookData,
        processed: processed,
        error_message: processed ? null : message,
        created_at: new Date().toISOString()
      }

      // Try to save to database webhook_logs table
      const { data, error } = await db.addWebhookLog ? 
        await db.addWebhookLog(logData) :
        this.saveWebhookLogToStorage(logData)

      return data
    } catch (error) {
      console.error('Error saving webhook log:', error)
      return null
    }
  }

  // Store payment link (for testing and enhanced campaigns)
  async storePaymentLink(linkData) {
    try {
      const completeData = {
        id: linkData.id || `pl_${Date.now()}_${Math.random().toString(36).substr(2, 8)}`,
        student_id: linkData.student_id,
        order_id: linkData.order_id,
        payment_url: linkData.payment_url,
        amount: parseInt(linkData.amount),
        description: linkData.description || 'Kas Kelas',
        status: linkData.status || 'pending',
        payment_method: linkData.payment_method || null,
        completed_at: linkData.completed_at || null,
        expires_at: linkData.expires_at || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        campaign_id: linkData.campaign_id || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      console.log('Storing payment link:', completeData.order_id, 'for student:', linkData.student_id)

      const { data, error } = await db.addPaymentLink ?
        await db.addPaymentLink(completeData) :
        this.storePaymentLinkToStorage(completeData)

      if (error) throw error

      console.log('Payment link stored successfully:', completeData.order_id)
      return data
    } catch (error) {
      console.error('Error storing payment link:', error)
      throw error
    }
  }

  // Storage fallback methods
  updatePaymentLinkInStorage(linkId, updates) {
    try {
      const stored = localStorage.getItem('paymentLinks')
      if (stored) {
        const links = JSON.parse(stored)
        const index = links.findIndex(link => link.id === linkId)
        
        if (index !== -1) {
          links[index] = { ...links[index], ...updates }
          localStorage.setItem('paymentLinks', JSON.stringify(links))
        }
      }
      return { data: updates, error: null }
    } catch (error) {
      return { data: null, error: error }
    }
  }

  saveTransactionToStorage(transaction) {
    try {
      const stored = localStorage.getItem('transactions')
      const transactions = stored ? JSON.parse(stored) : []
      transactions.push(transaction)
      localStorage.setItem('transactions', JSON.stringify(transactions))
      return { data: transaction, error: null }
    } catch (error) {
      return { data: null, error: error }
    }
  }

  saveWebhookLogToStorage(logData) {
    try {
      const stored = localStorage.getItem('webhookLogs')
      const logs = stored ? JSON.parse(stored) : []
      logs.push(logData)
      localStorage.setItem('webhookLogs', JSON.stringify(logs))
      return { data: logData, error: null }
    } catch (error) {
      return { data: null, error: error }
    }
  }

  storePaymentLinkToStorage(linkData) {
    try {
      const stored = localStorage.getItem('paymentLinks')
      const links = stored ? JSON.parse(stored) : []
      links.push(linkData)
      localStorage.setItem('paymentLinks', JSON.stringify(links))
      return { data: linkData, error: null }
    } catch (error) {
      return { data: null, error: error }
    }
  }

  // Test notification for development
  async testPaymentNotification(studentId, amount = 50000) {
    try {
      const student = await this.getStudentById(studentId)
      if (!student) {
        throw new Error('Student not found')
      }

      const mockPaymentData = {
        description: 'Test Payment - Kas Kelas',
        amount: amount
      }

      const mockWebhookData = {
        order_id: `TEST${Date.now()}`,
        amount: amount,
        payment_method: 'qris',
        completed_at: new Date().toISOString()
      }

      await this.sendPaymentSuccessNotification(student, mockPaymentData, mockWebhookData)
      
      return {
        success: true,
        message: `Test notification sent to ${student.name}`
      }
    } catch (error) {
      console.error('Error sending test notification:', error)
      throw error
    }
  }

  // Get payment statistics
  async getPaymentStatistics() {
    try {
      // Get all payment links
      const { data: paymentLinks } = await db.getPaymentLinks ? 
        await db.getPaymentLinks() : 
        { data: JSON.parse(localStorage.getItem('paymentLinks') || '[]') }

      // Get transactions
      const { data: transactions } = await db.getTransactions ? 
        await db.getTransactions() : 
        { data: JSON.parse(localStorage.getItem('transactions') || '[]') }

      const stats = {
        totalLinks: paymentLinks.length,
        completedPayments: paymentLinks.filter(link => link.status === 'completed').length,
        pendingPayments: paymentLinks.filter(link => link.status === 'pending').length,
        totalRevenue: transactions
          .filter(txn => txn.type === 'income' && txn.status === 'completed')
          .reduce((sum, txn) => sum + txn.amount, 0),
        conversionRate: paymentLinks.length > 0 ? 
          (paymentLinks.filter(link => link.status === 'completed').length / paymentLinks.length * 100).toFixed(2) : 0
      }

      return stats
    } catch (error) {
      console.error('Error getting payment statistics:', error)
      return {
        totalLinks: 0,
        completedPayments: 0,
        pendingPayments: 0,
        totalRevenue: 0,
        conversionRate: 0
      }
    }
  }

  // Mass notification untuk multiple payments (jika diperlukan)
  async sendBulkPaymentNotifications(orderIds) {
    const results = []
    
    for (const orderId of orderIds) {
      try {
        const paymentLink = await this.getPaymentLinkByOrderId(orderId)
        if (paymentLink && paymentLink.status === 'completed') {
          const student = await this.getStudentById(paymentLink.student_id)
          
          const mockWebhookData = {
            order_id: orderId,
            amount: paymentLink.amount,
            payment_method: 'manual',
            completed_at: paymentLink.completed_at || new Date().toISOString()
          }

          await this.sendPaymentSuccessNotification(student, paymentLink, mockWebhookData)
          
          results.push({
            orderId,
            student: student.name,
            success: true
          })
        }
      } catch (error) {
        results.push({
          orderId,
          success: false,
          error: error.message
        })
      }
    }

    return results
  }
}

export default new PaymentNotificationService()
