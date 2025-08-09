import { createApp } from 'vue'
import { createPinia } from 'pinia'
import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'

import App from './App.vue'
import router from './router'
import './style.css'

// Global error handling for unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
  console.warn('Unhandled promise rejection:', event.reason)

  // Prevent the default browser error handling for network errors
  if (event.reason?.message?.includes('Failed to fetch') ||
      event.reason?.message?.includes('NetworkError') ||
      event.reason?.message?.includes('fetch')) {
    event.preventDefault()
    console.info('Network error handled gracefully - using mock data fallback')
  }
})

// Global error handler for JavaScript errors
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error)

  // Check if it's a chunk loading error (common in SPA)
  if (event.message?.includes('Loading chunk') ||
      event.message?.includes('ChunkLoadError')) {
    console.info('Chunk loading error detected - refreshing page')
    window.location.reload()
  }
})

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.use(Toast, {
  position: 'top-right',
  timeout: 5000,
  closeOnClick: true,
  pauseOnFocusLoss: true,
  pauseOnHover: true,
  draggable: true,
  draggablePercent: 0.6,
  showCloseButtonOnHover: false,
  hideProgressBar: false,
  closeButton: 'button',
  icon: true,
  rtl: false
})

app.mount('#app')
