import axios from 'axios'
import { supabase } from '@/lib/supabase'

const BASE_URL = 'https://api.starsender.online'
const USE_SUPABASE_PROXY = true // Toggle untuk menggunakan Supabase proxy

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

      // Gunakan Supabase proxy jika tersedia
      if (USE_SUPABASE_PROXY && supabase) {
        try {
          return await this.sendMessageViaProxy(formattedNumber, message)
        } catch (proxyError) {
          console.warn('Edge Function failed, falling back to direct API:', proxyError.message)
          // Fall through to direct API call
        }
      }

      // Fallback ke direct API call
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
        throw new Error('CORS Error: Direct API calls blocked by browser security. For production, implement StarSender calls through your backend server.')
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

  // Send message via Supabase Edge Function proxy
  async sendMessageViaProxy(number, message) {
    try {
      const { data, error } = await supabase.functions.invoke('starsender-proxy', {
        body: {
          action: 'send',
          number: number,
          message: message
          // API key diambil dari environment variable di Edge Function
        }
      })

      if (error) {
        throw new Error(`Supabase proxy error: ${error.message}`)
      }

      if (!data.success) {
        throw new Error(`StarSender API error: ${data.status} - ${data.data?.message || 'Unknown error'}`)
      }

      return data.data
    } catch (error) {
      console.error('Error sending message via proxy:', error)
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

      // Gunakan Supabase proxy jika tersedia
      if (USE_SUPABASE_PROXY && supabase) {
        return await this.checkNumberViaProxy(formattedNumber)
      }

      // Fallback ke direct API call
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

  // Check number via Supabase Edge Function proxy
  async checkNumberViaProxy(number) {
    try {
      const { data, error } = await supabase.functions.invoke('starsender-proxy', {
        body: {
          action: 'check-number',
          number: number
          // API key diambil dari environment variable di Edge Function
        }
      })

      if (error) {
        throw new Error(`Supabase proxy error: ${error.message}`)
      }

      if (!data.success) {
        throw new Error(`StarSender API error: ${data.status} - ${data.data?.message || 'Unknown error'}`)
      }

      return data.data
    } catch (error) {
      console.error('Error checking number via proxy:', error)
      throw error
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
