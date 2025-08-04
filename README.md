# Sistem Manajemen Kas Kelas 1B SD Islam Al Husna

Aplikasi web modern untuk mengelola kas kelas dengan fitur lengkap termasuk manajemen keuangan, kampanye pesan WhatsApp, dan integrasi pembayaran digital.

## 🌟 Fitur Utama

### 📊 Manajemen Keuangan
- **Dashboard Keuangan**: Overview saldo, pemasukan, pengeluaran
- **Transaksi Kas**: Pencatatan pemasukan dengan detail lengkap
- **Manajemen Pengeluaran**: Sistem approval untuk pengeluaran kelas
- **Laporan Keuangan**: Laporan detail dengan filter periode dan export

### 👥 Manajemen Siswa
- **Data Siswa**: Kelola data siswa dan kontak orang tua
- **Status Pembayaran**: Tracking pembayaran per siswa
- **Import Data**: Load data siswa default dengan mudah

### 💳 Pembayaran Digital (Pakasir Integration)
- **Generate Link Bayar**: Buat link pembayaran unik per siswa
- **QRIS Payment**: Pembayaran dengan QRIS
- **Auto Update**: Webhook otomatis update status pembayaran
- **Bulk Generation**: Generate banyak link sekaligus

### 📱 Campaign WhatsApp (StarSender Integration)
- **Template Pesan**: Template siap pakai untuk berbagai keperluan
- **Scheduling**: Atur jeda pengiriman antar pesan
- **Target Audience**: Kirim ke semua siswa, yang sudah/belum bayar, atau pilih manual
- **Delivery Report**: Laporan status pengiriman pesan

### 🔧 Fitur Tambahan
- **Responsive Design**: Mobile-friendly interface
- **Modern UI**: Clean dan intuitive design dengan Tailwind CSS
- **Real-time Updates**: Data selalu up-to-date
- **Export Data**: Export ke CSV/JSON
- **Webhook Support**: Integrasi payment gateway otomatis

## 🚀 Tech Stack

- **Frontend**: Vue 3 + Composition API
- **Styling**: Tailwind CSS
- **Icons**: Heroicons
- **Charts**: Chart.js + Vue-ChartJS
- **State Management**: Pinia
- **Routing**: Vue Router
- **HTTP Client**: Axios
- **Notifications**: Vue Toastification
- **Date Handling**: date-fns
- **Build Tool**: Vite

### Backend & Database
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Real-time**: Supabase Realtime

### Integrations
- **WhatsApp API**: StarSender
- **Payment Gateway**: Pakasir
- **Notifications**: Vue Toastification

## 📁 Struktur Project

```
kas-kelas-management/
├── src/
│   ���── components/           # Reusable components
│   ├── views/               # Page components
│   │   ├── Dashboard.vue    # Main dashboard
│   │   ├── Students.vue     # Student management
│   │   ├── Transactions.vue # Income transactions
│   │   ├── Expenses.vue     # Expense management
│   │   ├── Payments.vue     # Payment links
│   │   ├── Campaigns.vue    # WhatsApp campaigns
│   │   ├── Reports.vue      # Financial reports
│   │   ├── Settings.vue     # System settings
│   │   └── PaymentWebhook.vue # Webhook handler
│   ├── stores/              # Pinia stores
│   ├── services/            # API services
│   │   ├── starsender.js    # WhatsApp API
│   │   └── pakasir.js       # Payment API
│   ├── lib/                 # Utilities
│   │   └── supabase.js      # Database client
│   ├── router/              # Vue Router config
│   └── style.css            # Global styles
├── public/                  # Static assets
└── docs/                    # Documentation
```

## 🛠️ Setup & Installation

### Prerequisites
- Node.js 16+
- npm/yarn
- Supabase account
- StarSender account
- Pakasir account

### 1. Clone Repository
```bash
git clone <repository-url>
cd kas-kelas-management
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Variables
```bash
cp .env.example .env
```

Edit `.env` file:
```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# StarSender WhatsApp API
VITE_STARSENDER_DEVICE_API_KEY=your-device-api-key
VITE_STARSENDER_ACCOUNT_API_KEY=your-account-api-key
```

### 4. Setup Database
Create tables in Supabase (see Database Schema section)

### 5. Run Development Server
```bash
npm run dev
```

### 6. Build for Production
```bash
npm run build
```

## 📊 Database Schema

### Students Table
```sql
CREATE TABLE students (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR NOT NULL,
  nickname VARCHAR NOT NULL,
  phone VARCHAR NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Transactions Table
```sql
CREATE TABLE transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES students(id),
  type VARCHAR NOT NULL CHECK (type IN ('income', 'expense')),
  amount INTEGER NOT NULL,
  description TEXT NOT NULL,
  payment_method VARCHAR,
  order_id VARCHAR,
  status VARCHAR DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Expenses Table
```sql
CREATE TABLE expenses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category VARCHAR NOT NULL,
  amount INTEGER NOT NULL,
  description TEXT NOT NULL,
  notes TEXT,
  status VARCHAR DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Payment Links Table
```sql
CREATE TABLE payment_links (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES students(id),
  order_id VARCHAR UNIQUE NOT NULL,
  payment_url TEXT NOT NULL,
  amount INTEGER NOT NULL,
  description TEXT NOT NULL,
  status VARCHAR DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'expired')),
  payment_method VARCHAR,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Campaigns Table
```sql
CREATE TABLE campaigns (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR NOT NULL,
  message TEXT NOT NULL,
  target VARCHAR NOT NULL,
  recipients UUID[],
  delay_minutes INTEGER DEFAULT 1,
  status VARCHAR DEFAULT 'draft' CHECK (status IN ('draft', 'sending', 'completed', 'failed')),
  results JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);
```

## 🔧 Configuration

### StarSender API
1. Daftar di [StarSender](https://starsender.online)
2. Dapatkan Device API Key dari menu device
3. Dapatkan Account API Key dari menu profile
4. Masukkan ke environment variables

### Pakasir Payment Gateway
1. Daftar di [Pakasir](https://pakasir.zone.id)
2. Buat project dengan slug: `uangkasalhusna`
3. Dapatkan API Key
4. Setup webhook URL untuk auto-update payment status

### Supabase Database
1. Buat project baru di [Supabase](https://supabase.com)
2. Jalankan SQL script untuk membuat tables
3. Setup Row Level Security (RLS) sesuai kebutuhan
4. Dapatkan URL dan Anon Key

## 📱 Usage Guide

### 1. Setup Awal
- Masuk ke menu **Settings**
- Klik "Muat Data Siswa Default" untuk mengisi data 20 siswa kelas 1B
- Test koneksi API StarSender dan Supabase

### 2. Generate Link Pembayaran
- Masuk ke menu **Link Pembayaran**
- Gunakan "Generate Link Cepat" untuk semua siswa atau siswa yang belum bayar
- Atau buat link individual per siswa

### 3. Kirim Campaign WhatsApp
- Masuk ke menu **Campaign Pesan**
- Pilih template atau buat pesan custom
- Pilih target penerima dan atur jeda pengiriman
- Kirim campaign

### 4. Monitor Pembayaran
- Dashboard menampilkan status pembayaran real-time
- Menu **Transaksi Kas** untuk detail semua transaksi
- Payment webhook otomatis update status

### 5. Kelola Pengeluaran
- Menu **Pengeluaran** untuk catat pengeluaran kelas
- Sistem approval untuk kontrol pengeluaran
- Kategori pengeluaran untuk laporan yang lebih detail

### 6. Laporan Keuangan
- Menu **Laporan** untuk analisis keuangan
- Filter berdasarkan periode
- Export ke PDF/CSV

## 🔒 Security Features

- Environment variables untuk sensitive data
- API key management
- Input validation
- HTTPS-only production deployment
- Supabase Row Level Security

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm run build
vercel --prod
```

### Netlify
```bash
npm run build
# Upload dist/ folder to Netlify
```

### Manual Server
```bash
npm run build
# Upload dist/ folder to web server
# Configure nginx/apache for SPA routing
```

## 🤝 Contributing

1. Fork repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## 📄 License

MIT License - see LICENSE file for details

## 👥 Credits

**Developed for:**
- SD Islam Al Husna - Kelas 1B
- Tahun Pelajaran 2025/2026

**Tech Stack Credits:**
- Vue.js Team for the awesome framework
- Tailwind CSS for utility-first styling
- Supabase for backend-as-a-service
- StarSender for WhatsApp API
- Pakasir for payment gateway

## 📞 Support

Untuk pertanyaan teknis atau support, silakan:
1. Buka issue di GitHub repository
2. Kontak developer melalui email
3. Dokumentasi lengkap tersedia di `/docs`

---

**Made with ❤️ for SD Islam Al Husna**
