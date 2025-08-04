import axios from 'axios'

const PROJECT_SLUG = 'uangkasalhusna'
const API_KEY = 'u8e0CphRmRVuNwDyqnfNoeOwHa6UBpLg'
const BASE_URL = 'https://pakasir.zone.id'
const REDIRECT_URL = 'https://berbagiakun.com'

class PakasirService {
  // Generate payment URL
  generatePaymentUrl(amount, orderId) {
    return `${BASE_URL}/pay/${PROJECT_SLUG}/${amount}?order_id=${orderId}&qris_only=1&redirect=${REDIRECT_URL}`
  }

  // Generate unique order ID
  generateOrderId(studentNickname) {
    const now = new Date()
    const timestamp = now.toISOString().slice(2, 10).replace(/-/g, '') // YYMMDD
    const random = Math.random().toString(36).substring(2, 8).toUpperCase()
    return `${studentNickname.toUpperCase()}${timestamp}${random}`
  }

  // Check transaction status
  async checkTransactionStatus(amount, orderId) {
    try {
      const response = await axios.get(
        `${BASE_URL}/api/transactiondetail`,
        {
          params: {
            project: PROJECT_SLUG,
            amount: amount,
            order_id: orderId,
            api_key: API_KEY
          }
        }
      )
      return response.data
    } catch (error) {
      console.error('Error checking transaction status:', error)
      throw error
    }
  }

  // Create payment link for student
  createPaymentLink(student, amount, description = 'Kas Kelas') {
    const order_id = this.generateOrderId(student.nickname)
    const payment_url = this.generatePaymentUrl(amount, order_id)

    return {
      order_id,
      payment_url,
      amount,
      description,
      created_at: new Date().toISOString()
    }
  }

  // Format currency
  formatCurrency(amount) {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  // Validate webhook data
  validateWebhook(webhookData) {
    const requiredFields = ['amount', 'order_id', 'project', 'status', 'payment_method', 'completed_at']
    
    for (const field of requiredFields) {
      if (!webhookData[field]) {
        throw new Error(`Missing required field: ${field}`)
      }
    }

    if (webhookData.project !== PROJECT_SLUG) {
      throw new Error('Invalid project slug')
    }

    if (webhookData.status !== 'completed') {
      throw new Error('Payment not completed')
    }

    return true
  }
}

export default new PakasirService()
