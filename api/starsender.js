// Vercel API Route for StarSender WhatsApp Integration
// Updated dengan API format terbaru

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'Method not allowed',
      message: 'Only POST method is supported'
    })
  }

  try {
    // Get API key from environment variable
    const apiKey = process.env.STARSENDER_DEVICE_API_KEY

    if (!apiKey) {
      return res.status(500).json({
        error: 'StarSender API key not configured',
        message: 'Please set STARSENDER_DEVICE_API_KEY environment variable'
      })
    }

    const { action, phoneNumber, message, fileUrl, delay, schedule } = req.body

    // Format phone number
    function formatPhoneNumber(phone) {
      if (!phone) return null
      
      let cleaned = phone.replace(/\D/g, '')
      
      if (cleaned.startsWith('0')) {
        cleaned = '62' + cleaned.substring(1)
      } else if (cleaned.startsWith('8')) {
        cleaned = '62' + cleaned
      } else if (!cleaned.startsWith('62')) {
        cleaned = '62' + cleaned
      }
      
      return cleaned
    }

    const formattedPhone = formatPhoneNumber(phoneNumber)
    if (!formattedPhone) {
      return res.status(400).json({
        error: 'Invalid phone number',
        message: 'Please provide a valid phone number'
      })
    }

    let payload
    
    if (action === 'send' || !action) {
      // Send message (default action)
      if (!message && !fileUrl) {
        return res.status(400).json({
          error: 'Missing message content',
          message: 'Either message text or file URL is required'
        })
      }

      if (fileUrl) {
        // Media message
        payload = {
          messageType: 'media',
          to: formattedPhone,
          body: message || '',
          file: fileUrl
        }
      } else {
        // Text message
        payload = {
          messageType: 'text',
          to: formattedPhone,
          body: message
        }
      }

      // Add optional parameters
      if (delay) {
        payload.delay = parseInt(delay)
      }
      
      if (schedule) {
        payload.schedule = schedule
      }

    } else {
      return res.status(400).json({
        error: 'Invalid action',
        message: 'Supported actions: send'
      })
    }

    console.log('Making request to StarSender API:', {
      to: formattedPhone,
      messageType: payload.messageType,
      hasFile: !!payload.file,
      hasDelay: !!payload.delay,
      hasSchedule: !!payload.schedule
    })

    // Make request to StarSender API
    const response = await fetch('https://api.starsender.online/api/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': apiKey
      },
      body: JSON.stringify(payload)
    })

    const responseData = await response.json()

    if (!response.ok) {
      console.error('StarSender API error:', response.status, responseData)
      return res.status(response.status).json({
        error: 'StarSender API error',
        message: responseData.message || 'Unknown error from StarSender API',
        details: responseData
      })
    }

    if (!responseData.success) {
      console.error('StarSender operation failed:', responseData)
      return res.status(400).json({
        error: 'StarSender operation failed',
        message: responseData.message || 'Unknown error',
        details: responseData
      })
    }

    console.log('StarSender API success:', responseData)

    // Return success response
    res.status(200).json({
      success: true,
      data: responseData.data,
      message: responseData.message,
      phone: formattedPhone
    })

  } catch (error) {
    console.error('StarSender API error:', error)
    
    res.status(500).json({
      error: 'Internal server error',
      message: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    })
  }
}
