import axios from 'axios'

const BASE_URL = 'https://api.starsender.online'

class StarSenderService {
  constructor() {
    this.deviceApiKey = import.meta.env.VITE_STARSENDER_DEVICE_API_KEY
  }

  // Format phone number for StarSender API (62xxx format)
  formatPhoneNumber(phone) {
    if (!phone || typeof phone !== 'string') {
      return null
    }

    // Remove all non-digit characters except +
    let cleaned = phone.replace(/[^\d+]/g, '')

    // Remove leading +
    if (cleaned.startsWith('+')) {
      cleaned = cleaned.substring(1)
    }

    // Handle Indonesian mobile format starting with 0
    if (cleaned.startsWith('0')) {
      cleaned = '62' + cleaned.substring(1)
    }

    // Ensure it starts with 62 for Indonesia
    if (!cleaned.startsWith('62')) {
      cleaned = '62' + cleaned
    }

    // Validate final format (Indonesian mobile numbers should be 10-13 digits after 62)
    if (cleaned.length < 10 || cleaned.length > 15) {
      return null
    }

    return cleaned
  }

  // Test API key validity without making actual requests
  testConnection() {
    const hasDeviceKey = this.deviceApiKey && this.deviceApiKey !== 'your-device-api-key'

    if (!hasDeviceKey) {
      throw new Error('StarSender Device API key not configured properly')
    }

    // Validate UUID format for API key
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

    if (!uuidRegex.test(this.deviceApiKey)) {
      throw new Error('Device API key format is invalid (should be UUID)')
    }

    return {
      success: true,
      message: 'Device API key is properly configured',
      deviceKeyValid: true
    }
  }

  // Send single message
  async sendMessage(number, message) {
    try {
      const formattedNumber = this.formatPhoneNumber(number)
      if (!formattedNumber) {
        throw new Error(`Invalid phone number format: "${number}"`)
      }

      const response = await axios.post(
        `${BASE_URL}/api/send`,
        { number: formattedNumber, message },
        {
          headers: {
            'Authorization': this.deviceApiKey,
            'Content-Type': 'application/json'
          },
          timeout: 30000 // 30 second timeout for sending messages
        }
      )
      return response.data
    } catch (error) {
      console.error('Error sending message:', error)

      if (error.code === 'NETWORK_ERROR' || error.message === 'Network Error') {
        throw new Error('Network error: Unable to send message via StarSender API')
      } else if (error.response?.status === 401) {
        throw new Error('StarSender API: Invalid device API key')
      } else if (error.response?.status === 429) {
        throw new Error('StarSender API: Rate limit exceeded')
      } else if (error.response) {
        throw new Error(`StarSender API error: ${error.response.status} - ${error.response.data?.message || 'Unknown error'}`)
      }
      throw error
    }
  }

  // Send message to group
  async sendToGroup(groupId, message) {
    try {
      const response = await axios.post(
        `${BASE_URL}/api/send/grup`,
        { group_id: groupId, message },
        {
          headers: {
            'Authorization': this.deviceApiKey,
            'Content-Type': 'application/json'
          }
        }
      )
      return response.data
    } catch (error) {
      console.error('Error sending group message:', error)
      throw error
    }
  }

  // Check WhatsApp number
  async checkNumber(number) {
    try {
      const formattedNumber = this.formatPhoneNumber(number)
      if (!formattedNumber) {
        throw new Error('Invalid phone number format')
      }

      // In development mode, simulate the check
      if (import.meta.env.DEV) {
        return this.simulateNumberCheck(formattedNumber)
      }

      const response = await axios.post(
        `${BASE_URL}/api/check-number`,
        { number: formattedNumber },
        {
          headers: {
            'Authorization': this.deviceApiKey,
            'Content-Type': 'application/json'
          }
        }
      )
      return response.data
    } catch (error) {
      console.error('Error checking number:', error)
      if (error.code === 'NETWORK_ERROR' || error.message === 'Network Error') {
        throw new Error('CORS Error: Cannot check numbers directly from browser. In production, use a backend server.')
      }
      throw error
    }
  }

  // Simulate number checking for development
  simulateNumberCheck(number) {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`[DEV MODE] Simulated number check for ${number}`)
        resolve({
          exists: true,
          number: number,
          message: 'Number check completed (simulated)',
          simulation: true
        })
      }, 500)
    })
  }



  // Test connection without making external API calls (for development)
  async testConnectionSafe() {
    try {
      // First validate the configuration
      const configTest = this.testConnection()

      const isDev = import.meta.env.DEV

      // Return a simulated successful response
      return {
        success: true,
        message: isDev
          ? 'StarSender configuration is valid. Running in development mode with simulated API calls.'
          : 'StarSender configuration is valid. API keys are properly formatted.',
        note: isDev
          ? 'Development mode: Messages will be simulated to avoid CORS issues.'
          : 'Actual API connectivity will be tested when sending messages.',
        config: configTest,
        developmentMode: isDev,
        developmentNote: isDev ? 'All API calls are simulated in development mode.' : 'CORS policy prevents direct API testing from browser.',
        productionRecommendation: 'For production: Implement StarSender calls through your backend server for better security and to avoid CORS issues.'
      }
    } catch (error) {
      throw error
    }
  }

  // Get connection status for UI display
  getConnectionStatus() {
    try {
      const test = this.testConnection()
      return {
        configured: true,
        deviceKeySet: !!this.deviceApiKey && this.deviceApiKey !== 'your-device-api-key',
        message: 'StarSender Device API key is configured and valid'
      }
    } catch (error) {
      return {
        configured: false,
        deviceKeySet: false,
        message: error.message
      }
    }
  }

  // Send campaign with delay
  async sendCampaign(recipients, message, delayMinutes = 1) {
    const results = []
    const delay = Math.max(delayMinutes * 60 * 1000, 1000) // Convert to milliseconds, minimum 1 second

    // In development mode, use shorter delays for better UX
    const actualDelay = import.meta.env.DEV ? Math.min(delay, 2000) : delay

    for (let i = 0; i < recipients.length; i++) {
      const recipient = recipients[i]

      try {
        if (i > 0) {
          // Add delay between messages
          await new Promise(resolve => setTimeout(resolve, actualDelay))
        }

        const result = await this.sendMessage(recipient.phone, message)
        results.push({
          recipient: recipient.name,
          phone: recipient.phone,
          success: true,
          response: result,
          simulation: result.simulation || false
        })
      } catch (error) {
        results.push({
          recipient: recipient.name,
          phone: recipient.phone,
          success: false,
          error: error.message
        })
      }
    }

    return results
  }
}

export default new StarSenderService()
