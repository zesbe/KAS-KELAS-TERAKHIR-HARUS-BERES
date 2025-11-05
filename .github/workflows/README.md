# GitHub Actions Workflows

## Keep Supabase Database Active

Workflow ini secara otomatis melakukan ping ke database Supabase setiap hari untuk mencegah database pause pada free tier.

### Cara Kerja

- **Schedule**: Berjalan otomatis setiap hari jam 00:00 UTC (07:00 WIB)
- **Action**: Melakukan query sederhana ke tabel `students` untuk menjaga database tetap aktif
- **Manual Trigger**: Dapat di-trigger secara manual melalui GitHub Actions tab

### Setup

Untuk menggunakan workflow ini, Anda perlu menambahkan secrets berikut di repository GitHub:

1. Buka repository di GitHub
2. Pergi ke **Settings** → **Secrets and variables** → **Actions**
3. Tambahkan secrets berikut:

   - `VITE_SUPABASE_URL`: URL Supabase project Anda
   - `VITE_SUPABASE_ANON_KEY`: Anon/Public key dari Supabase project

### Cara Mendapatkan Supabase Credentials

1. Login ke [Supabase Dashboard](https://app.supabase.com)
2. Pilih project Anda
3. Pergi ke **Settings** → **API**
4. Copy:
   - **Project URL** untuk `VITE_SUPABASE_URL`
   - **anon public** key untuk `VITE_SUPABASE_ANON_KEY`

### Manual Trigger

Untuk menjalankan workflow secara manual:

1. Buka tab **Actions** di repository GitHub
2. Pilih workflow "Keep Supabase Database Active"
3. Klik tombol **Run workflow**
4. Pilih branch dan klik **Run workflow**

### Monitoring

Anda dapat melihat status dan log dari setiap run di tab **Actions** pada repository GitHub.

### Catatan

- Workflow ini membantu mencegah database Supabase pada free tier yang akan pause setelah periode inaktif
- Query yang dilakukan sangat ringan (hanya count) sehingga tidak membebani database
- Jika terjadi error, workflow akan gagal dan Anda akan menerima notifikasi (jika diaktifkan)
