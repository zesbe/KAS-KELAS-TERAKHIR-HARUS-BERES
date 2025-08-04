import axios from 'axios'

const BASE_URL = 'https://api.starsender.online'

class StarSenderService {
  constructor() {
    this.deviceApiKey = import.meta.env.VITE_STARSENDER_DEVICE_API_KEY
  }

  // Format phone number for StarSender API (62xxx format)
  formatPhoneNumber(phone) {
    if (!phone) return null

    // Remove all non-digit characters except +
    let cleaned = phone.replace(/[^\d+]/g, '')

    // Remove leading + or 0
    if (cleaned.startsWith('+')) {
      cleaned = cleaned.substring(1)
    }
    if (cleaned.startsWith('0')) {
      cleaned = '62' + cleaned.substring(1)
    }

    // Ensure it starts with 62 for Indonesia
    if (!cleaned.startsWith('62')) {
      cleaned = '62' + cleaned
    }

    return cleaned
  }

  // Test API key validity without making actual requests
  testConnection() {
    const hasDeviceKey = this.deviceApiKey && this.deviceApiKey !== 'your-device-api-key'
    const hasAccountKey = this.accountApiKey && this.accountApiKey !== 'your-account-api-key'

    if (!hasDeviceKey || !hasAccountKey) {
      throw new Error('StarSender API keys not configured properly')
    }

    // Validate UUID format for API keys
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

    if (!uuidRegex.test(this.deviceApiKey)) {
      throw new Error('Device API key format is invalid (should be UUID)')
    }

    if (!uuidRegex.test(this.accountApiKey)) {
      throw new Error('Account API key format is invalid (should be UUID)')
    }

    return {
      success: true,
      message: 'API keys are properly configured',
      deviceKeyValid: true,
      accountKeyValid: true
    }
  }

  // Send single message
  async sendMessage(number, message) {
    try {
      const formattedNumber = this.formatPhoneNumber(number)
      if (!formattedNumber) {
        throw new Error('Invalid phone number format')
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
      throw error
    }
  }

  // Get device status
  async getDevices() {
    try {
      const response = await axios.get(
        `${BASE_URL}/api/devices`,
        {
          headers: {
            'Authorization': this.accountApiKey,
            'Content-Type': 'application/json'
          },
          timeout: 10000 // 10 second timeout
        }
      )
      return response.data
    } catch (error) {
      console.error('Error getting devices:', error)

      // Handle different types of errors
      if (error.code === 'NETWORK_ERROR' || error.message === 'Network Error') {
        throw new Error('Network error: Unable to connect to StarSender API. This might be due to CORS policy or network connectivity issues.')
      } else if (error.response) {
        // Server responded with error status
        throw new Error(`StarSender API error: ${error.response.status} - ${error.response.data?.message || 'Unknown error'}`)
      } else if (error.request) {
        // Request was made but no response received
        throw new Error('StarSender API timeout: No response received from server')
      } else {
        throw new Error(`StarSender configuration error: ${error.message}`)
      }
    }
  }

  // Test connection without making external API calls (for development)
  async testConnectionSafe() {
    try {
      // First validate the configuration
      const configTest = this.testConnection()

      // Return a simulated successful response
      return {
        success: true,
        message: 'StarSender configuration is valid. API keys are properly formatted.',
        note: 'Actual API connectivity will be tested when sending messages.',
        config: configTest,
        developmentNote: 'CORS policy prevents direct API testing from browser. In production, use backend proxy.',
        productionRecommendation: 'Implement StarSender calls through your backend server for better security and to avoid CORS issues.'
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
        accountKeySet: !!this.accountApiKey && this.accountApiKey !== 'your-account-api-key',
        message: 'StarSender API keys are configured and valid'
      }
    } catch (error) {
      return {
        configured: false,
        deviceKeySet: false,
        accountKeySet: false,
        message: error.message
      }
    }
  }

  // Send campaign with delay
  async sendCampaign(recipients, message, delayMinutes = 1) {
    const results = []
    const delay = delayMinutes * 60 * 1000 // Convert to milliseconds

    for (let i = 0; i < recipients.length; i++) {
      const recipient = recipients[i]
      
      try {
        if (i > 0) {
          // Add delay between messages
          await new Promise(resolve => setTimeout(resolve, delay))
        }

        const result = await this.sendMessage(recipient.phone, message)
        results.push({
          recipient: recipient.name,
          phone: recipient.phone,
          success: true,
          response: result
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
