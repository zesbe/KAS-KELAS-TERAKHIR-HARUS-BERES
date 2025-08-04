# Setup StarSender WhatsApp API

## Panduan Konfigurasi StarSender API Terbaru

### 1. Dapatkan API Key
1. Login ke dashboard StarSender: https://app.starsender.online
2. Buat device baru atau gunakan device yang sudah ada
3. Copy Device API Key dari device tersebut

### 2. Konfigurasi Environment Variables

#### Untuk Development (Local)
Buat file `.env.local` atau update `.env`:
```env
VITE_STARSENDER_DEVICE_API_KEY=your-device-api-key-here
```

#### Untuk Production (Vercel)
Set environment variable di Vercel Dashboard:
```bash
# Via Vercel CLI
vercel env add STARSENDER_DEVICE_API_KEY

# Via Vercel Dashboard
# Settings > Environment Variables
# Name: STARSENDER_DEVICE_API_KEY
# Value: your-device-api-key-here
```

#### Untuk Supabase Edge Functions
Set secret di Supabase:
```bash
supabase secrets set STARSENDER_DEVICE_API_KEY=your-device-api-key-here
```

### 3. Format API StarSender Baru

**Endpoint:** `POST https://api.starsender.online/api/send`

**Headers:**
- `Content-Type: application/json`
- `Authorization: your-device-api-key`

**Body Parameters:**
- `messageType`: "text" atau "media"
- `to`: Nomor telefon (format: 628xxx atau 08xxx)
- `body`: Pesan teks (opsional untuk media)
- `file`: URL file untuk media (opsional)
- `delay`: Delay dalam detik (opsional)
- `schedule`: Unix timestamp dalam milidetik (opsional)

### 4. Contoh Penggunaan

#### Kirim Pesan Teks
```javascript
const response = await fetch('https://api.starsender.online/api/send', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'your-device-api-key'
  },
  body: JSON.stringify({
    messageType: 'text',
    to: '628123456789',
    body: 'Halo, ini pesan dari sistem kas kelas!'
  })
})
```

#### Kirim Pesan Media
```javascript
const response = await fetch('https://api.starsender.online/api/send', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'your-device-api-key'
  },
  body: JSON.stringify({
    messageType: 'media',
    to: '628123456789',
    body: 'Silakan download file berikut:',
    file: 'https://example.com/file.pdf'
  })
})
```

#### Kirim Pesan dengan Delay
```javascript
const response = await fetch('https://api.starsender.online/api/send', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'your-device-api-key'
  },
  body: JSON.stringify({
    messageType: 'text',
    to: '628123456789',
    body: 'Pesan ini akan dikirim dengan delay 30 detik',
    delay: 30
  })
})
```

### 5. Response Format

**Success Response:**
```json
{
  "success": true,
  "data": {},
  "message": "Success sent message"
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Error message here"
}
```

### 6. Testing

#### Test dari Browser Console
```javascript
// Test konfigurasi
const result = await starsenderService.testConnectionSafe()
console.log(result)

// Test kirim pesan
const response = await starsenderService.sendMessage(
  '628123456789', 
  'Test pesan dari sistem kas kelas'
)
console.log(response)
```

#### Test dari Settings Page
1. Buka aplikasi → Settings
2. Scroll ke bagian "StarSender WhatsApp API"
3. Klik tombol "Test Configuration"
4. Periksa hasil di toast notification

### 7. Fitur yang Tersedia

#### Di Service (starsenderService)
- `sendMessage(phone, message, options)` - Kirim pesan teks
- `sendMediaMessage(phone, message, fileUrl, options)` - Kirim pesan media
- `sendBroadcastMessage(phoneNumbers, message, options)` - Kirim ke multiple nomor
- `generatePaymentMessage(paymentData)` - Generate template pesan pembayaran
- `generateReminderMessage(paymentData)` - Generate template reminder
- `formatPhoneNumber(phone)` - Format nomor telefon
- `testConnectionSafe()` - Test konfigurasi

#### Template Pesan Otomatis
- **Payment Message**: Template untuk notifikasi pembayaran baru
- **Reminder Message**: Template untuk reminder pembayaran tertunggak

### 8. Troubleshooting

#### Error: "API key not configured"
- Pastikan environment variable `VITE_STARSENDER_DEVICE_API_KEY` sudah diset
- Restart development server setelah menambah environment variable

#### Error: "Invalid phone number"
- Nomor telefon harus dalam format angka
- Sistem otomatis convert 08xxx → 628xxx
- Pastikan nomor telefon valid dan aktif

#### Error: "CORS Error"
- Terjadi saat akses langsung dari browser
- Gunakan proxy API (Vercel/Supabase) untuk production
- Untuk development, gunakan service worker atau disable CORS

#### Error: "Unauthorized" atau "Invalid API key"
- Periksa API key di dashboard StarSender
- Pastikan device masih aktif
- Regenerate API key jika diperlukan

### 9. Best Practices

#### Rate Limiting
- Tambahkan delay antar pesan (minimum 1 detik)
- Gunakan `sendBroadcastMessage()` untuk multiple nomor
- Monitor usage di dashboard StarSender

#### Error Handling
- Selalu gunakan try-catch
- Log error untuk debugging
- Berikan feedback yang jelas ke user

#### Security
- Jangan expose API key di frontend
- Gunakan environment variables
- Untuk production, proses melalui backend

### 10. Example Implementation

Lihat implementasi lengkap di:
- `src/services/starsender.js` - Service utama
- `src/views/Payments.vue` - Penggunaan untuk notifikasi pembayaran
- `src/views/Settings.vue` - Konfigurasi dan testing
- `api/starsender.js` - Vercel API proxy
- `supabase/functions/starsender-proxy/index.ts` - Supabase Edge Function proxy

---

## Update dari API Lama

### Perubahan Utama:
1. **Endpoint baru**: `/api/send` (tidak ada `/api/check-number`)
2. **Parameter baru**: `messageType`, `to`, `body`, `file`
3. **Header baru**: `Authorization` langsung dengan API key
4. **Response format**: Standar `{success, data, message}`

### Migration:
- Update semua service untuk menggunakan format baru
- Test ulang semua fungsi pengiriman pesan
- Update dokumentasi dan panduan
