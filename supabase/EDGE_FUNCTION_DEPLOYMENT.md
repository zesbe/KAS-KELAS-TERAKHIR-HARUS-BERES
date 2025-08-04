# StarSender Proxy Edge Function Deployment

## Overview
This Edge Function acts as a proxy between the frontend and StarSender API to solve CORS issues.

## Prerequisites
1. Supabase CLI installed
2. Supabase project configured
3. StarSender Device API Key

## Deployment Steps

### 1. Login to Supabase
```bash
supabase login
```

### 2. Link to your project
```bash
supabase link --project-ref YOUR_PROJECT_REF
```

### 3. Set Environment Variable
Set your StarSender Device API Key as environment variable:

**Via Supabase Dashboard:**
1. Go to Edge Functions
2. Click on Settings
3. Add environment variable:
   - Name: `STARSENDER_DEVICE_API_KEY`
   - Value: `your-device-api-key-here`

**Via CLI:**
```bash
supabase secrets set STARSENDER_DEVICE_API_KEY=your-device-api-key-here
```

### 4. Deploy the Edge Function
```bash
supabase functions deploy starsender-proxy
```

### 5. Test the deployment
```bash
curl -i --location --request POST 'https://YOUR_PROJECT_REF.supabase.co/functions/v1/starsender-proxy' \
  --header 'Authorization: Bearer YOUR_ANON_KEY' \
  --header 'Content-Type: application/json' \
  --data-raw '{
    "action": "send",
    "number": "628123456789",
    "message": "Test message"
  }'
```

## Edge Function Features

### Supported Actions
- **send**: Send WhatsApp message
- **check-number**: Check if WhatsApp number exists

### Request Format
```json
{
  "action": "send|check-number",
  "number": "628123456789",
  "message": "Your message here", // Required for 'send' action
  "apiKey": "your-device-api-key"
}
```

### Response Format
```json
{
  "success": true,
  "status": 200,
  "data": {
    // StarSender API response
  }
}
```

## Security Features
- CORS headers configured
- API key validation
- Error handling
- Request validation

## Monitoring
Check Edge Function logs in Supabase Dashboard:
1. Go to Edge Functions
2. Select 'starsender-proxy'
3. View logs and metrics

## Troubleshooting

### Common Issues
1. **401 Unauthorized**: Check your Supabase anon key
2. **Function not found**: Ensure function is deployed correctly
3. **StarSender API errors**: Verify Device API Key is correct

### Debug Commands
```bash
# View function logs
supabase functions logs starsender-proxy

# Test locally
supabase functions serve

# Deploy with debug
supabase functions deploy starsender-proxy --debug
```
