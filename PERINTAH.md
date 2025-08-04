STARSENDER WHATSAPP API GUIDE

BASE URL: https://api.starsender.online

API KEYS:
- Device API Key: For sending messages (get from device menu)
- Account API Key: For account management (get from profile menu)

KEY ENDPOINTS:

SEND MESSAGE:
POST /api/send
Headers: Authorization (Device API key)
Body: { "number": "62xxx", "message": "text" }

SEND TO GROUP:
POST /api/send/grup
Headers: Authorization (Device API key)

CHECK WHATSAPP NUMBER:
POST /api/check-number
Headers: Authorization (Device API key)

CAMPAIGN MANAGEMENT:
POST /api/campaigns (Account API key)
POST /api/campaigns/users (Account API key)

CONTACT MANAGEMENT:
POST /api/contacts (Account API key)
GET /api/groups (Account API key)

DEVICE MANAGEMENT:
GET /api/devices (Account API key)
POST /api/devices/create/scan (Account API key)
POST /api/devices/{id}/relog (Account API key)

WHATSAPP GROUPS:
GET /api/whatsapp/groups (Device API key)

WEBHOOK DATA:
{
  "device": "device_name",
  "message": "incoming_message",
  "from": "sender_number",
  "timestamp": "time"
}

VUE 3 EXAMPLE:
```javascript
const kirimPesan = async () => {
  const response = await axios.post(
    'https://api.starsender.online/api/send',
    { number: '62xxx', message: 'Hello' },
    { headers: { 'Authorization': 'DEVICE_API_KEY' } }
  )
}
```

RESPONSE FORMAT:
{ "success": true, "data": {}, "message": "Success sent message" }

PAKASIR PAYMENT INTEGRATION GUIDE

PROJECT DATA:
- Slug: uangkasalhusna
- API Key: u8e0CphRmRVuNwDyqnfNoeOwHa6UBpLg
- Website: berbagiakun.com

PAYMENT URL:
https://pakasir.zone.id/pay/{slug}/{amount}?order_id={order_id}&qris_only=1&redirect=https://berbagiakun.com

WEBHOOK RESPONSE:
{
  "amount": 22000,
  "order_id": "240910HDE7C9",
  "project": "uangkasalhusna",
  "status": "completed",
  "payment_method": "qris",
  "completed_at": "2024-09-10T08:07:02.819+07:00"
}

STATUS CHECK API:
GET https://pakasir.zone.id/api/transactiondetail?project=uangkasalhusna&amount={amount}&order_id={order_id}&api_key=u8e0CphRmRVuNwDyqnfNoeOwHa6UBpLg

IMPLEMENTATION NOTES:
- Register webhook URL in project settings
- Validate amount & order_id from webhook
- Use status API for verification
- Always use HTTPS for webhook endpoint

data siswa:
DATA SISWA KELAS 1B SD ISLAM AL HUSNA
Tahun Pelajaran 2025/2026

DAFTAR SISWA & NOMOR WA ORANG TUA:
1. Aqilnafi Segara (Nafi) – +62 856-2468-7313
2. Arkaan Jawara Bayanaka (Arkaan) – +62 821-1475-9339
3. Athafariz Zehan Sasongko (Atha) – +62 812-9670-7505
4. Azma Raudhatul Jannah (Azma) – +62 856-8500-062
5. Dizya Nayara Khanza Pujiarto (Dizya) – +62 812-8147-6276
6. Elvano Devika Putra (Elvano) – +62 812-9585-0096
7. Khalifa Adzkayra Marissa (Marissa) – +62 877-4168-6950
8. Khalisa Adiba Nuha (Adiba) – +62 813-2877-9423
9. Kirana Febriana Hakim (Kirana) – +62 812-9759-7757
10. M. Abil Shidiq Arsalaan (Abil) – +62 812-1172-3429
11. Mikhayla Putri Mahfud (Mikha) – +62 813-8241-6552
12. Radeva Zehan Elfathan (Radeva) – +62 811-9403-103
13. Sekar Hanun Ayudia (Sekar) – +62 812-2595-0048
14. Shahia Fitri Kalita (Shahia) – +62 858-8163-6149
15. Sheila Hapsari Paramita (Sheila) – +62 822-6021-8027
16. Tedra Sagara Drew Permana (Saga) – +62 877-8539-3962
17. Tiara Shanum Wicaksono (Shanum) – +62 857-1663-5953
18. Yumna Rizqy Humaira (Una) – +62 813-1007-5190
19. Zaidan Mufid (Zaidan) – +62 813-1684-0991
20. Zanna Kirania Simanjuntak (Nia) – +62 812-9076-6367

Tolong buatkan sistem management kas kelas, pelaporan keuangan dan fitur campaigns pesan yang bisa atur jeda kirim jeda pesan misal 1 menit 5 menit atupun sesuai keinginan dan kemudian akan dihandle oleh startsender, jadi website kirim campaigns, dan generate link pembayaran menggunakan id unik diawali nama masing-masing dan otomatis kirim campaigns ke nomor yang ditandai.
Dan ada fitur wehbook ketika pembayaran berhasil maka sistem keuangan akan update otomatis, dan tambahkan fitur pengeluaran.

Bantu buatkan tambahkan fitur yang menurut kamu wajib, buatkan grade enterprise, mobile modern app dan web modern app. buatkan tampipan web yang cantik dan menarik

catatan:
frontend: vue3 + tailwind
backend + database: full supabase
