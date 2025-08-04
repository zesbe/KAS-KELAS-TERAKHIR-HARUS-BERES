# Setup Database Supabase PostgreSQL

Panduan lengkap untuk setup database PostgreSQL di Supabase untuk Sistem Manajemen Kas Kelas.

## 🚀 Quick Start

### 1. Buat Project Supabase Baru

1. Masuk ke [Supabase Dashboard](https://app.supabase.com)
2. Klik "New Project"
3. Pilih Organization dan beri nama project: `kas-kelas-1b`
4. Set password untuk database
5. Pilih region terdekat (Singapore untuk Indonesia)
6. Klik "Create new project"

### 2. Setup Database Schema

1. Tunggu project selesai dibuat (± 2 menit)
2. Masuk ke **SQL Editor** di sidebar
3. Copy semua isi file `schema.sql`
4. Paste di SQL Editor
5. Klik **Run** untuk execute

### 3. Verifikasi Setup

Setelah menjalankan schema, verifikasi dengan query berikut:

```sql
-- Cek semua tabel sudah dibuat
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';

-- Cek data siswa sudah terisi
SELECT COUNT(*) as total_siswa FROM students;

-- Cek views berfungsi
SELECT * FROM financial_summary;
SELECT * FROM student_payment_status LIMIT 5;
```

## 📊 Struktur Database

### Tables Created:

1. **students** - Data siswa kelas 1B
2. **transactions** - Transaksi kas (pemasukan/pengeluaran)
3. **expenses** - Pengeluaran kelas
4. **payment_links** - Link pembayaran Pakasir
5. **campaigns** - Campaign pesan WhatsApp
6. **webhook_logs** - Log webhook dari payment gateway

### Views Created:

1. **financial_summary** - Summary keuangan keseluruhan
2. **student_payment_status** - Status pembayaran per siswa

### Features Included:

✅ **Auto-timestamps** dengan trigger `updated_at`  
✅ **Foreign key constraints** untuk data integrity  
✅ **Check constraints** untuk validasi data  
✅ **Indexes** untuk performance optimal  
✅ **Sample data** 20 siswa kelas 1B  
✅ **Auto-transaction creation** dari payment webhook  
✅ **Optimized queries** untuk dashboard  

## 🔑 Environment Variables

Setelah setup database, ambil credentials:

1. Masuk ke **Settings** → **API**
2. Copy **Project URL** dan **anon public key**
3. Update file `.env`:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

## 🔒 Row Level Security (RLS)

Untuk keamanan production, uncomment bagian RLS di `schema.sql`:

```sql
-- Enable RLS
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
-- ... dst

-- Create policies
CREATE POLICY "Allow authenticated users" ON students
    FOR ALL USING (auth.role() = 'authenticated');
-- ... dst
```

## 📈 Monitoring & Performance

### Performance Monitoring

1. Masuk ke **Database** → **Query Performance**
2. Monitor slow queries
3. Optimize dengan indexes tambahan jika perlu

### Storage Usage

1. Masuk ke **Settings** → **Usage**
2. Monitor database size
3. Set up alerts untuk usage limits

## 🔄 Backup Strategy

### Automatic Backups

Supabase melakukan automatic backup harian, tapi untuk safety tambahan:

### Manual Backup

```sql
-- Export ke CSV
COPY students TO '/tmp/students_backup.csv' WITH CSV HEADER;
COPY transactions TO '/tmp/transactions_backup.csv' WITH CSV HEADER;
```

### Scheduled Backups

Buat Function untuk backup otomatis:

```sql
CREATE OR REPLACE FUNCTION backup_daily()
RETURNS void AS $$
BEGIN
    -- Log backup activity
    INSERT INTO webhook_logs (source, event_type, payload) 
    VALUES ('system', 'backup', '{"status": "started"}');
END;
$$ LANGUAGE plpgsql;

-- Schedule dengan pg_cron (jika tersedia)
-- SELECT cron.schedule('backup-daily', '0 2 * * *', 'SELECT backup_daily();');
```

## 🚨 Troubleshooting

### Common Issues:

**Error: "function gen_random_uuid() does not exist"**
```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
```

**Error: "permission denied for table"**
- Check RLS policies
- Verify anon key permissions

**Slow queries:**
```sql
-- Check missing indexes
SELECT schemaname, tablename, attname, n_distinct, correlation
FROM pg_stats
WHERE schemaname = 'public'
ORDER BY tablename;
```

**Connection issues:**
- Verify VITE_SUPABASE_URL format
- Check firewall/network restrictions
- Verify anon key is correct

## 📞 Support Resources

- [Supabase Documentation](https://supabase.com/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [SQL Tutorial](https://www.w3schools.com/sql/)

## 🔄 Schema Updates

Untuk update schema di future:

1. Backup data terlebih dahulu
2. Test di development environment
3. Create migration script
4. Apply dengan SQL Editor

### Migration Script Template:

```sql
-- Migration: Add new column
-- Date: YYYY-MM-DD
-- Description: Add email field to students

BEGIN;

-- Add new column
ALTER TABLE students ADD COLUMN email VARCHAR(255);

-- Add validation
ALTER TABLE students ADD CONSTRAINT valid_email 
    CHECK (email IS NULL OR email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');

-- Create index
CREATE INDEX idx_students_email ON students(email);

COMMIT;
```

## ✅ Verification Checklist

Setelah setup, pastikan:

- [ ] Semua 6 tabel berhasil dibuat
- [ ] Data 20 siswa terisi dengan benar
- [ ] Views `financial_summary` dan `student_payment_status` berfungsi
- [ ] Triggers untuk `updated_at` aktif
- [ ] Foreign key constraints bekerja
- [ ] Environment variables sudah diset di aplikasi
- [ ] Koneksi dari aplikasi berhasil
- [ ] RLS dikonfigurasi sesuai kebutuhan (opsional)

---

**🎉 Database Setup Complete!**

Sekarang Anda siap menggunakan aplikasi Sistem Manajemen Kas Kelas dengan database PostgreSQL yang robust dan scalable.
