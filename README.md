# Kas Kelas Management System

Sistem Manajemen Kas Kelas SD Islam Al Husna - Aplikasi web untuk mengelola keuangan kas kelas dengan fitur lengkap.

## 🚀 Deployment

### Vercel Deployment
1. Fork/clone repository ini
2. Connect ke Vercel
3. Set environment variables:
   ```
   VITE_SUPABASE_URL=your-supabase-project-url
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```
4. Deploy otomatis akan berjalan

### Netlify Deployment
1. Fork/clone repository ini
2. Connect ke Netlify
3. Set build command: `npm run build`
4. Set publish directory: `dist`
5. Set environment variables (sama seperti Vercel)
6. Deploy

## 🔧 Fixes Applied

### Build Issues Fixed:
- ✅ Installed missing dependencies (`xlsx`, `file-saver`)
- ✅ Fixed ES module imports for xlsx library
- ✅ Updated Vite configuration for better production builds
- ✅ Added proper chunk splitting for optimization

### Browser Compatibility:
- ✅ Added browser compatibility checks
- ✅ Improved error handling for older browsers
- ✅ Fixed router navigation issues
- ✅ Added fallbacks for missing browser features

### Deployment Configuration:
- ✅ Updated `vercel.json` for proper SPA routing
- ✅ Created `netlify.toml` for Netlify deployment
- ✅ Added proper environment variable templates
- ✅ Improved build optimization settings

### Error Handling:
- ✅ Enhanced global error handlers
- ✅ Added chunk loading error recovery
- ✅ Improved network error fallbacks
- ✅ Better navigation guard error handling

## 📦 Dependencies

### Production Dependencies:
- Vue 3.4+ with Composition API
- Vue Router 4 for navigation
- Pinia for state management
- Supabase for database
- Tailwind CSS for styling
- Chart.js for data visualization
- XLSX for Excel export functionality
- File-saver for file downloads

### Development Dependencies:
- Vite 5 for build tooling
- PostCSS and Autoprefixer
- Vue plugin for Vite

## 🛠 Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🌐 Environment Variables

Create a `.env` file based on `.env.example`:

```env
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_APP_NAME="Kas Kelas Management"
VITE_APP_VERSION=1.0.0
```

## 📝 Features

- 👥 Manajemen data siswa
- 💰 Pencatatan transaksi kas masuk/keluar
- 📊 Laporan keuangan dengan visualisasi
- 💳 Link pembayaran digital
- 📱 Campaign WhatsApp
- 📈 Dashboard analitik
- 📋 Export data ke Excel/PDF
- 🔒 Sistem autentikasi dan otorisasi

## 🔍 Troubleshooting

### Build Errors:
- Pastikan semua dependencies terinstall dengan `npm install`
- Check Node.js version (recommended: 18+)
- Clear cache dengan `npm cache clean --force`

### Deployment Issues:
- Verify environment variables di platform hosting
- Check build logs untuk error spesifik
- Pastikan `dist` folder ter-generate dengan benar

### Browser Compatibility:
- Aplikasi memerlukan browser modern dengan ES6+ support
- Disable ad blockers jika terjadi masalah loading
- Clear browser cache dan cookies

## 📄 License

MIT License - lihat file LICENSE untuk detail lengkap.

## 🤝 Contributing

1. Fork repository
2. Create feature branch
3. Commit changes
4. Push ke branch
5. Create Pull Request

## 📞 Support

Jika mengalami masalah, silakan buat issue di GitHub repository atau hubungi maintainer.
