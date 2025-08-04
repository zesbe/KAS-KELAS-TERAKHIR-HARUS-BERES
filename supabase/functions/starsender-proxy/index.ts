import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { corsHeaders } from '../_shared/cors.ts'

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
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    const { action, number, message } = await req.json()

    let url = ''
    let body = {}

    switch (action) {
      case 'send':
        if (!number || !message) {
          return new Response(
            JSON.stringify({ error: 'Number and message are required for send action' }),
            { 
              status: 400, 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            }
          )
        }
        url = 'https://api.starsender.online/api/send'
        body = { number, message }
        break

      case 'check-number':
        if (!number) {
          return new Response(
            JSON.stringify({ error: 'Number is required for check-number action' }),
            { 
              status: 400, 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            }
          )
        }
        url = 'https://api.starsender.online/api/check-number'
        body = { number }
        break

      default:
        return new Response(
          JSON.stringify({ error: 'Invalid action. Use "send" or "check-number"' }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
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

    return new Response(
      JSON.stringify({
        success: response.ok,
        status: response.status,
        data: jsonData
      }),
      {
        status: response.ok ? 200 : response.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
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
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})
