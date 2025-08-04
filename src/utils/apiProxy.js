// Development helper for API calls that may have CORS issues

export const createProxyRequest = async (url, options = {}) => {
  // In development, you can use a CORS proxy service
  const isDevelopment = import.meta.env.DEV
  
  if (isDevelopment && options.useCorsProxy) {
    // Use a public CORS proxy (only for development)
    const corsProxyUrl = 'https://cors-anywhere.herokuapp.com/'
    const proxiedUrl = corsProxyUrl + url
    
    return fetch(proxiedUrl, {
      ...options,
      headers: {
        ...options.headers,
        'X-Requested-With': 'XMLHttpRequest'
      }
    })
  }
  
  // For production or when not using proxy, make direct request
  return fetch(url, options)
}

export const testApiEndpoint = async (url, headers = {}) => {
  try {
    const response = await fetch(url, {
      method: 'HEAD', // Use HEAD to test connectivity without downloading data
      headers: {
        ...headers,
        'Accept': 'application/json'
      },
      mode: 'no-cors' // This will prevent CORS errors but won't give detailed response
    })
    
    return {
      success: true,
      message: 'Endpoint is reachable',
      status: 'ok'
    }
  } catch (error) {
    return {
      success: false,
      message: `Endpoint test failed: ${error.message}`,
      error: error.message
    }
  }
}

// Production recommendation
export const getProductionRecommendation = () => {
  return {
    title: 'Production Deployment Recommendation',
    message: `For production use, implement StarSender API calls through your backend server to avoid CORS issues.
    
Example backend endpoint:
POST /api/whatsapp/send
{
  "number": "+628123456789",
  "message": "Hello World"
}

This endpoint would then make the actual call to StarSender API from your server.`,
    benefits: [
      'No CORS issues',
      'Better security (API keys on server)',
      'Rate limiting control',
      'Request logging and monitoring',
      'Error handling and retry logic'
    ]
  }
}
