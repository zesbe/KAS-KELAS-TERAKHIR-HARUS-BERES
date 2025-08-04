import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders } from "../_shared/cors.ts"

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Get API key from environment variable (lebih aman!)
    const apiKey = Deno.env.get('STARSENDER_DEVICE_API_KEY')

    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: 'StarSender API key not configured in environment' }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      )
    }

    const { action, phoneNumber, message, fileUrl, delay, schedule } = await req.json()

    // Format phone number
    function formatPhoneNumber(phone: string): string | null {
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
      return new Response(
        JSON.stringify({ error: 'Invalid phone number format' }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      )
    }

    let payload: any

    if (action === 'send' || !action) {
      // Send message (default action)
      if (!message && !fileUrl) {
        return new Response(
          JSON.stringify({ error: 'Either message text or file URL is required' }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        )
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
      return new Response(
        JSON.stringify({ error: 'Invalid action. Supported actions: send' }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      )
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
      return new Response(
        JSON.stringify({
          error: 'StarSender API error',
          message: responseData.message || 'Unknown error from StarSender API',
          details: responseData
        }),
        {
          status: response.status,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      )
    }

    if (!responseData.success) {
      console.error('StarSender operation failed:', responseData)
      return new Response(
        JSON.stringify({
          error: 'StarSender operation failed',
          message: responseData.message || 'Unknown error',
          details: responseData
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      )
    }

    console.log('StarSender API success:', responseData)

    // Return success response
    return new Response(
      JSON.stringify({
        success: true,
        data: responseData.data,
        message: responseData.message,
        phone: formattedPhone
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    )

  } catch (error) {
    console.error('StarSender proxy error:', error)
    
    return new Response(
      JSON.stringify({
        error: 'Internal server error',
        message: error.message
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    )
  }
})
