import { createApp } from 'vue'
import { createPinia } from 'pinia'
import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'

import App from './App.vue'
import router from './router'
import './style.css'
import keepAlive from './services/keepAlive'

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

// Handle server hibernation recovery
let hibernationRecoveryAttempts = 0
const maxRecoveryAttempts = 3

window.addEventListener('beforeunload', () => {
  // Reset recovery attempts when user navigates away
  hibernationRecoveryAttempts = 0
})

// Check for 404 errors and auto-recover
const originalFetch = window.fetch
window.fetch = async function(...args) {
  try {
    const response = await originalFetch.apply(this, args)
    
    // Reset attempts on successful response
    if (response.ok) {
      hibernationRecoveryAttempts = 0
    }
    
    // Handle 404 that might indicate server hibernation
    if (response.status === 404 && hibernationRecoveryAttempts < maxRecoveryAttempts) {
      hibernationRecoveryAttempts++
      console.log(`🔄 Server might be sleeping, recovery attempt ${hibernationRecoveryAttempts}/${maxRecoveryAttempts}`)
      
      // Wait and retry
      await new Promise(resolve => setTimeout(resolve, 2000 * hibernationRecoveryAttempts))
      return originalFetch.apply(this, args)
    }
    
    return response
  } catch (error) {
    // Handle network errors that might indicate server hibernation
    if (error.message.includes('Failed to fetch') && hibernationRecoveryAttempts < maxRecoveryAttempts) {
      hibernationRecoveryAttempts++
      console.log(`🔄 Network error, recovery attempt ${hibernationRecoveryAttempts}/${maxRecoveryAttempts}`)
      
      await new Promise(resolve => setTimeout(resolve, 3000 * hibernationRecoveryAttempts))
      return originalFetch.apply(this, args)
    }
    
    throw error
  }
}

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

// Initialize keep-alive service
keepAlive.setupActivityListener()
keepAlive.start()
