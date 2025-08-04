import axios from 'axios'

const BASE_URL = 'https://api.starsender.online'

class StarSenderService {
  constructor() {
    this.deviceApiKey = import.meta.env.VITE_STARSENDER_DEVICE_API_KEY
    this.accountApiKey = import.meta.env.VITE_STARSENDER_ACCOUNT_API_KEY
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
      const response = await axios.post(
        `${BASE_URL}/api/send`,
        { number, message },
        {
          headers: {
            'Authorization': this.deviceApiKey,
            'Content-Type': 'application/json'
          }
        }
      )
      return response.data
    } catch (error) {
      console.error('Error sending message:', error)
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
      const response = await axios.post(
        `${BASE_URL}/api/check-number`,
        { number },
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
            'Authorization': this.accountApiKey
          }
        }
      )
      return response.data
    } catch (error) {
      console.error('Error getting devices:', error)
      throw error
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
