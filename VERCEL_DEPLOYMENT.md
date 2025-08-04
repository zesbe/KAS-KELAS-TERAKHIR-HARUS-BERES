# Migrasi dari Supabase Edge Function ke Vercel API Routes

## 📋 Langkah-langkah Deploy

### 1. **Setup Environment Variable di Vercel**

#### Via Vercel Dashboard:
1. Buka [Vercel Dashboard](https://vercel.com/dashboard)
2. Pilih project Anda
3. Masuk ke **Settings** → **Environment Variables**
4. Tambahkan:
   ```
   Key: STARSENDER_DEVICE_API_KEY
   Value: [your-starsender-device-api-key]
   Environment: Production, Preview, Development
   ```

#### Via Vercel CLI:
```bash
# Install Vercel CLI jika belum
npm i -g vercel

# Login ke Vercel
vercel login

# Set environment variable
vercel env add STARSENDER_DEVICE_API_KEY
# Masukkan API key StarSender Anda
```

### 2. **Deploy ke Vercel**

#### Deploy Manual:
```bash
# Clone repository
git clone [your-repo-url]
cd kas-kelas-management

# Deploy ke Vercel
vercel --prod
```

#### Deploy via Git Integration:
1. Connect repository di Vercel Dashboard
2. Setiap push ke main branch akan auto-deploy
3. Preview deployments untuk pull requests

### 3. **Update Environment Variables Frontend**

Tambahkan di file `.env` lokal atau environment Vercel:
```env
# URL Vercel app Anda setelah deploy
VITE_VERCEL_API_URL=https://your-app-name.vercel.app
```

### 4. **Test API Route**

Setelah deploy, test endpoint:
```bash
# Test via curl
curl -X POST https://your-app-name.vercel.app/api/starsender \
  -H "Content-Type: application/json" \
  -d '{
    "action": "check-number",
    "number": "628123456789"
  }'
```

Expected response:
```json
{
  "success": true,
  "status": 200,
  "data": { ... },
  "timestamp": "2024-01-20T10:30:00.000Z"
}
```

## 🔧 Konfigurasi Vercel

### vercel.json
File `vercel.json` sudah include konfigurasi:
- Function timeout: 30 detik
- CORS headers
- Environment variables
- API routes mapping

### API Route Structure
```
project/
├── api/
│   └── starsender.js    # Main API endpoint
├── vercel.json          # Vercel configuration
└── src/                 # Frontend source
```

## 🚀 Keunggulan Vercel vs Supabase Edge Function

### ✅ **Vercel Advantages:**
- **Easier deployment**: Git integration
- **Better performance**: Global edge network
- **Simpler setup**: No additional CLI needed
- **Free tier**: Generous limits for small projects
- **Integrated**: Works seamlessly with frontend

### ❌ **Supabase Edge Function Issues Fixed:**
- ~~CORS complications~~
- ~~Separate deployment process~~
- ~~Additional CLI requirements~~
- ~~Complex environment setup~~

## 🔄 Migration Checklist

- [x] Create Vercel API route (`api/starsender.js`)
- [x] Update StarSender service to use Vercel
- [x] Add Vercel configuration (`vercel.json`)
- [x] Set environment variables in Vercel
- [ ] Deploy to Vercel
- [ ] Update frontend environment variables
- [ ] Test WhatsApp functionality
- [ ] Remove Supabase Edge Function (optional)

## 🐛 Troubleshooting

### Error: "API key not configured"
```bash
# Check environment variables in Vercel
vercel env ls

# Add missing env var
vercel env add STARSENDER_DEVICE_API_KEY
```

### Error: "Function timeout"
- Vercel functions have 10s timeout on free plan
- Upgrade to Pro for 60s timeout
- Or optimize API calls

### CORS Issues
- `vercel.json` includes CORS headers
- Check if headers are applied correctly
- Test with different browsers

## 📱 Testing Scenarios

### 1. **Development (Local)**
```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# API will be available at /api/starsender
```

### 2. **Production (Vercel)**
```bash
# Test live endpoint
curl -X POST https://your-app.vercel.app/api/starsender \
  -H "Content-Type: application/json" \
  -d '{"action": "check-number", "number": "628123456789"}'
```

### 3. **WhatsApp Integration Test**
1. Login ke aplikasi kas kelas
2. Buat payment link baru
3. Klik "Kirim via WhatsApp"
4. Cek apakah pesan terkirim

## 🔐 Security Notes

1. **API Key Protection**: 
   - API key disimpan di Vercel environment variables
   - Tidak terexpose di frontend
   - Secure transmission via HTTPS

2. **CORS Policy**:
   - Configured untuk allow origins
   - Headers properly set
   - Preflight requests handled

3. **Rate Limiting**:
   - Implement rate limiting jika diperlukan
   - Monitor usage di Vercel analytics

## 📊 Monitoring

### Vercel Analytics
- Function invocations
- Response times
- Error rates
- Bandwidth usage

### Logs
```bash
# View function logs
vercel logs --follow
```

## 💰 Cost Comparison

### Supabase Edge Functions
- Free: 500K edge function invocations/month
- Pro: $25/month + usage

### Vercel Functions
- Free: 100K function invocations/month
- Pro: $20/month + usage

**Recommendation**: Vercel lebih cost-effective untuk project kecil-menengah.
