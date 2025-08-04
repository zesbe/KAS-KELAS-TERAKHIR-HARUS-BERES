# 📢 Campaign WhatsApp - Dokumentasi Lengkap

## 🚀 Fitur Campaign Terjadwal dengan StarSender

Sistem Campaign WhatsApp memungkinkan Anda mengirim pesan ke banyak nomor secara otomatis dengan jadwal yang telah ditentukan dan jeda yang aman antar pesan.

---

## ✨ Fitur Utama

### 🎯 **Smart Targeting**
- **Semua Siswa**: Kirim ke seluruh database siswa
- **Siswa Belum Bayar**: Target siswa yang belum melunasi pembayaran
- **Siswa Sudah Bayar**: Target siswa yang sudah membayar
- **Pilihan Manual**: Pilih siswa secara spesifik

### ⏰ **Jadwal Fleksibel**
- **Kirim Sekarang**: Eksekusi campaign langsung
- **Jadwal Terpilih**: Tentukan tanggal dan jam mulai campaign
- **Jeda Aman**: Interval 1-60 menit antar pesan untuk menghindari spam

### 📝 **Template Dinamis**
- **Variable Replacement**: [[NAME]], [[NICKNAME]], [[PHONE]]
- **Template Kustom**: Buat pesan sesuai kebutuhan
- **Preview Real-time**: Lihat hasil akhir sebelum kirim

### 📊 **Monitoring Lengkap**
- **Progress Tracking**: Monitor status pengiriman real-time
- **Detail Results**: Lihat hasil per nomor (berhasil/gagal)
- **Campaign Analytics**: Statistik lengkap campaign

---

## 🔧 Cara Penggunaan

### 1. **Membuat Campaign Baru**

```
1. Klik "Buat Campaign Baru"
2. Isi Judul Campaign (contoh: "Reminder Kas Januari")
3. Tulis template pesan dengan variable:
   - [[NAME]] = Nama siswa
   - [[NICKNAME]] = Panggilan siswa
   - [[PHONE]] = Nomor HP
```

**Contoh Template:**
```
🏫 *Reminder Kas Kelas 1B*
SD Islam Al Husna

Halo [[NAME]] ([[NICKNAME]]),

Silakan melakukan pembayaran kas kelas untuk bulan Januari 2024.

💰 Jumlah: Rp 50.000
📅 Jatuh Tempo: 31 Januari 2024

Terima kasih atas perhatiannya! 🙏

_Pesan otomatis dari Sistem Kas Kelas_
```

### 2. **Memilih Target Penerima**

- **Semua Siswa (20 siswa)**: Kirim ke seluruh database
- **Siswa Belum Bayar**: Otomatis filter berdasarkan status pembayaran
- **Pilih Manual**: Centang siswa yang diinginkan

### 3. **Mengatur Jadwal**

**Opsi Jadwal:**
- **Kirim Sekarang**: Campaign dimulai langsung
- **Jadwalkan**: Pilih tanggal & jam mulai

**Pengaturan Jeda:**
- **1 menit**: Cepat (gunakan dengan hati-hati)
- **10 menit**: Recommended (aman dari spam)
- **30 menit**: Sangat aman
- **1 jam**: Untuk campaign besar

### 4. **Preview & Eksekusi**

Sebelum menjalankan, sistem akan menampilkan:
- Total penerima
- Jadwal mulai
- Estimasi selesai
- Preview pesan

---

## ⚙️ Teknologi & Keamanan

### 🔗 **Integrasi StarSender**
- **Endpoint**: `https://api.starsender.online/api/send`
- **Schedule Parameter**: Menggunakan Unix timestamp
- **Auto Format**: Nomor otomatis ke format 628xxx

### 🛡️ **Fitur Keamanan**
- **Rate Limiting**: Jeda minimum 1 menit antar pesan
- **Spam Prevention**: Interval yang dapat dikonfigurasi
- **Error Handling**: Retry logic untuk kegagalan
- **API Key Protection**: Environment variable yang aman

### 📱 **Format Pesan**
```javascript
{
  "messageType": "text",
  "to": "628123456789",
  "body": "Pesan yang dipersonalisasi",
  "schedule": 1703980800000  // Unix timestamp
}
```

---

## 📈 Contoh Skenario Penggunaan

### **Skenario 1: Reminder Pembayaran Bulanan**
```
Campaign: "Reminder Kas Februari 2024"
Target: Siswa Belum Bayar (15 siswa)
Jadwal: Setiap tanggal 25, jam 08:00
Jeda: 10 menit
Estimasi Selesai: 2.5 jam
```

### **Skenario 2: Pengumuman Kegiatan**
```
Campaign: "Pengumuman Study Tour"
Target: Semua Siswa (20 siswa)
Jadwal: H-7 sebelum acara, jam 19:00
Jeda: 5 menit
Estimasi Selesai: 1.7 jam
```

### **Skenario 3: Follow-up Pembayaran**
```
Campaign: "Follow-up Tunggakan"
Target: Pilihan Manual (5 siswa)
Jadwal: Setiap Jumat, jam 16:00
Jeda: 15 menit
Estimasi Selesai: 1.25 jam
```

---

## 🔄 Workflow Campaign

```
1. DRAFT
   ↓ (Save Campaign)
   
2. SCHEDULED
   ↓ (StarSender Processing)
   
3. SENDING
   ↓ (All messages scheduled)
   
4. COMPLETED
   ↓ (Results available)
```

### **Status Campaign:**
- **Draft**: Campaign dibuat, belum dijalankan
- **Scheduled**: Campaign dijadwalkan di StarSender
- **Sending**: Sedang dalam proses pengiriman
- **Completed**: Semua pesan terkirim
- **Failed**: Campaign gagal dijalankan

---

## 📊 Monitoring & Analytics

### **Dashboard Campaign**
- Total campaign: Draft, Scheduled, Completed
- Success rate: Persentase keberhasilan
- Recent activity: Campaign terbaru

### **Detail Results**
```
Total Sent: 20 pesan
Berhasil: 18 pesan (90%)
Gagal: 2 pesan (10%)

Detail per nomor:
✅ 628123456789 - Aqilnafi Segara
❌ 628987654321 - Invalid number
✅ 628555666777 - Arkaan Jawara
```

### **Performance Metrics**
- Average delivery rate
- Peak sending times
- Error patterns
- Cost per campaign

---

## ⚠️ Best Practices

### **Timing yang Optimal**
- **Weekdays**: 08:00-17:00 (jam kerja)
- **Weekend**: 09:00-12:00 (pagi hari)
- **Hindari**: 22:00-06:00 (malam hari)

### **Pengaturan Jeda**
- **1-5 menit**: Hanya untuk campaign kecil (<10 nomor)
- **10-15 menit**: Ideal untuk campaign menengah (10-50 nomor)
- **30-60 menit**: Untuk campaign besar (>50 nomor)

### **Template Pesan**
```
✅ DO:
- Gunakan nama personal [[NAME]]
- Sertakan informasi yang jelas
- Tambahkan emoji untuk menarik perhatian
- Cantumkan sumber pesan

❌ DON'T:
- Pesan terlalu panjang (>500 karakter)
- Gunakan CAPS LOCK berlebihan
- Kirim tanpa personalisasi
- Spam dengan frekuensi tinggi
```

### **Target Audience**
- **Semua Siswa**: Untuk pengumuman umum
- **Belum Bayar**: Untuk reminder pembayaran
- **Sudah Bayar**: Untuk konfirmasi/terima kasih
- **Manual**: Untuk follow-up spesifik

---

## 🔧 Konfigurasi Environment

```env
# StarSender API Configuration
VITE_STARSENDER_DEVICE_API_KEY=your-device-api-key-here

# Campaign Settings (Optional)
VITE_CAMPAIGN_MIN_DELAY=60000           # 1 minute minimum
VITE_CAMPAIGN_MAX_RECIPIENTS=100        # Maximum per campaign
VITE_CAMPAIGN_TIMEOUT=300000           # 5 minutes timeout
```

---

## 🚨 Troubleshooting

### **Campaign Tidak Jalan**
1. Periksa API key StarSender
2. Cek koneksi internet
3. Verifikasi format nomor HP
4. Review error logs

### **Pesan Tidak Terkirim**
1. Pastikan nomor HP valid (format 628xxx)
2. Cek saldo/quota StarSender
3. Verifikasi device status aktif
4. Periksa message content

### **Performance Issues**
1. Kurangi jumlah penerima per campaign
2. Tingkatkan jeda antar pesan
3. Bagi campaign besar jadi beberapa batch
4. Monitor system resources

---

## 🎯 Roadmap & Future Features

### **V2.0 - Enhanced Features**
- [ ] **Media Campaigns**: Support gambar, dokumen, video
- [ ] **Campaign Templates**: Template pre-built untuk berbagai kebutuhan
- [ ] **Auto-retry**: Retry otomatis untuk pesan gagal
- [ ] **Delivery Reports**: Laporan detail delivery status

### **V2.1 - Advanced Analytics**
- [ ] **Campaign ROI**: Analisis return on investment
- [ ] **A/B Testing**: Test variasi pesan
- [ ] **Engagement Metrics**: Track respons dan interaksi
- [ ] **Custom Fields**: Variable tambahan selain nama/nomor

### **V2.2 - Integration & Automation**
- [ ] **Webhook Integration**: Trigger otomatis dari events
- [ ] **Calendar Sync**: Integrasi dengan Google Calendar
- [ ] **Payment Triggers**: Auto-campaign berdasarkan status pembayaran
- [ ] **Multi-channel**: Support email, SMS, push notification

---

## 📞 Support & Assistance

### **Technical Support**
- **Documentation**: [Campaign Guide](link-to-docs)
- **Video Tutorial**: [How to Setup Campaigns](link-to-video)
- **FAQ**: [Common Issues & Solutions](link-to-faq)

### **Contact Information**
- **Developer**: Tim Development Kas Kelas
- **Email**: support@kaskelas.app
- **WhatsApp**: +62 xxx-xxxx-xxxx

---

**🎉 Campaign WhatsApp siap digunakan untuk meningkatkan komunikasi dengan orang tua siswa secara efisien dan terorganisir!**

*Last updated: January 2024*
