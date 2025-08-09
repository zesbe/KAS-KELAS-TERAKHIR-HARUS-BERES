
class KeepAliveService {
  constructor() {
    this.interval = null
    this.isActive = false
    this.pingUrl = window.location.origin
  }

  start() {
    if (this.isActive) return
    
    this.isActive = true
    console.log('🔄 Keep-alive service started')
    
    // Ping server every 4 minutes to keep it awake
    this.interval = setInterval(() => {
      this.ping()
    }, 4 * 60 * 1000) // 4 minutes
    
    // Initial ping
    this.ping()
  }

  stop() {
    if (this.interval) {
      clearInterval(this.interval)
      this.interval = null
    }
    this.isActive = false
    console.log('⏹️ Keep-alive service stopped')
  }

  async ping() {
    try {
      const response = await fetch(`${this.pingUrl}/ping`, {
        method: 'HEAD',
        cache: 'no-cache'
      })
      console.log('📡 Keep-alive ping:', response.status === 200 ? 'OK' : 'Failed')
    } catch (error) {
      console.warn('⚠️ Keep-alive ping failed:', error.message)
    }
  }

  // Auto-start on user activity
  setupActivityListener() {
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart']
    
    const onActivity = () => {
      if (!this.isActive) {
        this.start()
      }
    }
    
    events.forEach(event => {
      document.addEventListener(event, onActivity, { passive: true })
    })
  }
}

export default new KeepAliveService()
