import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  build: {
    rollupOptions: {
      external: [],
      output: {
        globals: {}
      }
    },
    commonjsOptions: {
      include: [/xlsx/, /file-saver/, /node_modules/]
    },
    assetsInclude: ['**/*.xlsx'],
    target: 'esnext'
  },
  optimizeDeps: {
    include: ['xlsx', 'file-saver'],
    force: true
  },
  define: {
    global: 'globalThis'
  },
  server: {
    port: 3000,
    host: true,
    allowedHosts: [
      '2ff2dda1-43b9-4de5-8368-0944130ddbb3-00-2ouujk1qdccdq.sisko.replit.dev',
      '.replit.dev'
    ]
  }
})
