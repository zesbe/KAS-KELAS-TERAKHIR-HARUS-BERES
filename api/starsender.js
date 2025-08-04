// Vercel API Route for StarSender WhatsApp Integration
// Replace Supabase Edge Function

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      error: 'Method not allowed',
      message: 'Only POST requests are allowed'
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

    const { action, number, message } = req.body

    if (!action) {
      return res.status(400).json({
        error: 'Missing required parameter',
        message: 'Action parameter is required'
      })
    }

    let url = ''
    let body = {}

    switch (action) {
      case 'send':
        if (!number || !message) {
          return res.status(400).json({
            error: 'Missing required parameters',
            message: 'Number and message are required for send action'
          })
        }
        url = 'https://api.starsender.online/api/send'
        body = { number, message }
        break

      case 'check-number':
        if (!number) {
          return res.status(400).json({
            error: 'Missing required parameter',
            message: 'Number is required for check-number action'
          })
        }
        url = 'https://api.starsender.online/api/check-number'
        body = { number }
        break

      default:
        return res.status(400).json({
          error: 'Invalid action',
          message: 'Valid actions are: send, check-number'
        })
    }

    // Make request to StarSender API
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    const data = await response.text()
    let jsonData

    try {
      jsonData = JSON.parse(data)
    } catch {
      jsonData = { message: data }
    }

    // Return response
    return res.status(response.ok ? 200 : response.status).json({
      success: response.ok,
      status: response.status,
      data: jsonData,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('StarSender API error:', error)
    
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message,
      timestamp: new Date().toISOString()
    })
  }
}
