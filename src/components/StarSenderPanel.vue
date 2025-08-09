<template>
  <div class="startsender-panel">
    <!-- Header with Music Visualizer -->
    <div class="panel-header">
      <div class="header-content">
        <div class="title-section">
          <h2 class="panel-title">
            🌟 StarSender Control Panel
          </h2>
          <p class="panel-subtitle">Enhanced WhatsApp Broadcasting with CORS Bypass</p>
        </div>
        
        <div class="music-section">
          <div class="music-controls">
            <button 
              @click="toggleMusic" 
              :class="['music-btn', { active: isPlaying }]"
            >
              <span v-if="isPlaying">🎵</span>
              <span v-else>🔇</span>
            </button>
            <button @click="nextSong" class="music-btn">⏭️</button>
          </div>
          <div class="music-info">
            <div class="song-name">{{ currentSong }}</div>
            <div class="music-visualizer" v-if="isPlaying">
              <div class="bar" v-for="i in 8" :key="i"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Status Dashboard -->
    <div class="status-dashboard">
      <div class="status-card">
        <div class="status-icon">🚀</div>
        <div class="status-info">
          <div class="status-label">Status</div>
          <div class="status-value" :class="statusClass">{{ status }}</div>
        </div>
      </div>
      
      <div class="status-card">
        <div class="status-icon">📊</div>
        <div class="status-info">
          <div class="status-label">Progress</div>
          <div class="status-value">{{ sent }}/{{ total }}</div>
        </div>
      </div>
      
      <div class="status-card">
        <div class="status-icon">⚡</div>
        <div class="status-info">
          <div class="status-label">Success Rate</div>
          <div class="status-value">{{ successRate }}%</div>
        </div>
      </div>
      
      <div class="status-card">
        <div class="status-icon">❌</div>
        <div class="status-info">
          <div class="status-label">Failed</div>
          <div class="status-value">{{ failed }}</div>
        </div>
      </div>
    </div>

    <!-- Progress Bar -->
    <div class="progress-section" v-if="total > 0">
      <div class="progress-header">
        <span class="progress-label">Broadcasting Progress</span>
        <span class="progress-percentage">{{ Math.round(percentage) }}%</span>
      </div>
      <div class="progress-bar-container">
        <div 
          class="progress-bar" 
          :style="{ width: percentage + '%' }"
        ></div>
        <div class="progress-glow" :style="{ width: percentage + '%' }"></div>
      </div>
      <div class="progress-stats">
        <span>ETA: {{ estimatedTimeLeft }}</span>
        <span>Speed: {{ messagesPerMinute }}/min</span>
      </div>
    </div>

    <!-- Campaign Controls -->
    <div class="campaign-controls">
      <button 
        @click="startCampaign" 
        :disabled="isRunning"
        class="control-btn start-btn"
      >
        <span class="btn-icon">🚀</span>
        Start Broadcasting
      </button>
      
      <button 
        @click="pauseCampaign" 
        :disabled="!isRunning"
        class="control-btn pause-btn"
      >
        <span class="btn-icon">⏸️</span>
        Pause
      </button>
      
      <button 
        @click="resumeCampaign" 
        :disabled="!isPaused"
        class="control-btn resume-btn"
      >
        <span class="btn-icon">▶️</span>
        Resume
      </button>
      
      <button 
        @click="stopCampaign" 
        :disabled="!isRunning && !isPaused"
        class="control-btn stop-btn"
      >
        <span class="btn-icon">⏹️</span>
        Stop
      </button>
    </div>

    <!-- CORS Bypass Status -->
    <div class="cors-status">
      <h3 class="cors-title">🛡️ CORS Bypass Status</h3>
      <div class="cors-methods">
        <div 
          v-for="method in corsStatus" 
          :key="method.name"
          :class="['cors-method', { active: method.active, success: method.success }]"
        >
          <span class="method-name">{{ method.name }}</span>
          <span class="method-status">{{ method.status }}</span>
        </div>
      </div>
      <button @click="testCORSBypass" class="test-btn">
        🧪 Test CORS Bypass
      </button>
    </div>

    <!-- Recent Messages -->
    <div class="recent-messages" v-if="recentMessages.length > 0">
      <h3 class="messages-title">📨 Recent Messages</h3>
      <div class="messages-list">
        <div 
          v-for="message in recentMessages" 
          :key="message.id"
          :class="['message-item', { success: message.success, failed: !message.success }]"
        >
          <div class="message-info">
            <div class="message-recipient">{{ message.name }} ({{ message.phone }})</div>
            <div class="message-time">{{ formatTime(message.timestamp) }}</div>
          </div>
          <div class="message-status">
            <span v-if="message.success" class="status-success">✅ {{ message.method }}</span>
            <span v-else class="status-failed">❌ {{ message.error }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="quick-actions">
      <button @click="openWhatsAppWeb" class="action-btn">
        📱 Open WhatsApp Web
      </button>
      <button @click="exportResults" class="action-btn">
        📊 Export Results
      </button>
      <button @click="clearLogs" class="action-btn">
        🗑️ Clear Logs
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import startsender from '@/services/startsender'

// Reactive state
const isPlaying = ref(false)
const currentSong = ref('Ready')
const status = ref('Ready')
const sent = ref(0)
const total = ref(0)
const failed = ref(0)
const isRunning = ref(false)
const isPaused = ref(false)
const recentMessages = ref([])
const startTime = ref(null)

// CORS status
const corsStatus = ref([
  { name: 'Direct', active: false, success: false, status: 'Standby' },
  { name: 'Proxy', active: false, success: false, status: 'Standby' },
  { name: 'JSONP', active: false, success: false, status: 'Standby' },
  { name: 'Pixel', active: false, success: false, status: 'Standby' },
  { name: 'iFrame', active: false, success: false, status: 'Standby' }
])

// Computed properties
const percentage = computed(() => {
  if (total.value === 0) return 0
  return (sent.value / total.value) * 100
})

const successRate = computed(() => {
  if (sent.value === 0) return 0
  return Math.round(((sent.value - failed.value) / sent.value) * 100)
})

const statusClass = computed(() => {
  switch (status.value) {
    case 'Broadcasting': return 'status-active'
    case 'Paused': return 'status-paused'
    case 'Completed': return 'status-success'
    case 'Failed': return 'status-error'
    default: return 'status-ready'
  }
})

const estimatedTimeLeft = computed(() => {
  if (!isRunning.value || total.value === 0) return '--'
  
  const remaining = total.value - sent.value
  const elapsed = startTime.value ? Date.now() - startTime.value : 0
  const rate = sent.value > 0 ? elapsed / sent.value : 0
  const eta = remaining * rate
  
  return formatDuration(eta)
})

const messagesPerMinute = computed(() => {
  if (!startTime.value || sent.value === 0) return 0
  
  const elapsed = (Date.now() - startTime.value) / 1000 / 60 // minutes
  return Math.round(sent.value / elapsed)
})

// Methods
const toggleMusic = () => {
  if (isPlaying.value) {
    startsender.stopMusic()
  } else {
    startsender.playMusic()
  }
}

const nextSong = () => {
  startsender.nextSong()
}

const startCampaign = () => {
  isRunning.value = true
  isPaused.value = false
  status.value = 'Broadcasting'
  startTime.value = Date.now()
  
  startsender.playMusic()
  
  // Emit event to parent
  window.dispatchEvent(new CustomEvent('startsender:start'))
}

const pauseCampaign = () => {
  isPaused.value = true
  isRunning.value = false
  status.value = 'Paused'
  
  startsender.pauseCampaign()
}

const resumeCampaign = () => {
  isPaused.value = false
  isRunning.value = true
  status.value = 'Broadcasting'
  
  startsender.resumeCampaign()
}

const stopCampaign = () => {
  isRunning.value = false
  isPaused.value = false
  status.value = 'Stopped'
  
  startsender.stopCampaign()
  
  // Emit event to parent
  window.dispatchEvent(new CustomEvent('startsender:stop'))
}

const testCORSBypass = async () => {
  status.value = 'Testing CORS...'
  
  try {
    const results = await startsender.testCORSBypass()
    
    // Update CORS status
    corsStatus.value.forEach(method => {
      const result = results.find(r => r.url.includes(method.name.toLowerCase()))
      if (result) {
        method.success = result.success
        method.status = result.success ? 'Working' : 'Failed'
        method.active = result.success
      }
    })
    
    status.value = 'CORS Test Complete'
    
    setTimeout(() => {
      status.value = 'Ready'
    }, 3000)
    
  } catch (error) {
    status.value = 'CORS Test Failed'
    console.error('CORS test failed:', error)
  }
}

const openWhatsAppWeb = () => {
  window.open('https://web.whatsapp.com', '_blank', 'noopener,noreferrer')
}

const exportResults = () => {
  const data = {
    campaign: {
      sent: sent.value,
      total: total.value,
      failed: failed.value,
      successRate: successRate.value
    },
    messages: recentMessages.value,
    corsStatus: corsStatus.value,
    timestamp: new Date().toISOString()
  }
  
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `startsender-results-${Date.now()}.json`
  a.click()
  URL.revokeObjectURL(url)
}

const clearLogs = () => {
  recentMessages.value = []
  sent.value = 0
  total.value = 0
  failed.value = 0
}

const formatTime = (timestamp) => {
  return new Date(timestamp).toLocaleTimeString('id-ID')
}

const formatDuration = (ms) => {
  if (ms < 60000) return '< 1 min'
  
  const minutes = Math.floor(ms / 60000)
  const hours = Math.floor(minutes / 60)
  
  if (hours > 0) {
    return `${hours}h ${minutes % 60}m`
  }
  
  return `${minutes}m`
}

// Event listeners
const handleProgress = (event) => {
  const { sent: newSent, total: newTotal, failed: newFailed } = event.detail
  sent.value = newSent
  total.value = newTotal
  failed.value = newFailed
}

const handleComplete = (event) => {
  isRunning.value = false
  isPaused.value = false
  status.value = 'Completed'
  
  startsender.stopMusic()
}

// Lifecycle
onMounted(() => {
  // Listen for StarSender events
  window.addEventListener('startsender:progress', handleProgress)
  window.addEventListener('startsender:complete', handleComplete)

  // Initialize status from StarSender (with error handling)
  try {
    const stats = startsender.getStats()
    isPlaying.value = stats.isPlaying || false
    currentSong.value = stats.currentSong || 'Ready'
    status.value = stats.status === 'active' ? 'Broadcasting' : 'Ready'
  } catch (error) {
    console.log('StarSender not fully loaded yet, using defaults')
    isPlaying.value = false
    currentSong.value = 'Ready'
    status.value = 'Ready'
  }
})

onUnmounted(() => {
  window.removeEventListener('startsender:progress', handleProgress)
  window.removeEventListener('startsender:complete', handleComplete)
})
</script>

<style scoped>
.startsender-panel {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20px;
  padding: 24px;
  color: white;
  font-family: 'Inter', sans-serif;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

.panel-header {
  margin-bottom: 24px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
}

.panel-title {
  font-size: 28px;
  font-weight: 700;
  margin: 0;
  background: linear-gradient(45deg, #fff, #f0f8ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.panel-subtitle {
  color: rgba(255, 255, 255, 0.8);
  margin: 4px 0 0 0;
  font-size: 14px;
}

.music-section {
  display: flex;
  align-items: center;
  gap: 12px;
}

.music-controls {
  display: flex;
  gap: 8px;
}

.music-btn {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 16px;
}

.music-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.05);
}

.music-btn.active {
  background: rgba(255, 255, 255, 0.4);
  box-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
}

.music-info {
  text-align: right;
}

.song-name {
  font-weight: 600;
  font-size: 14px;
}

.music-visualizer {
  display: flex;
  gap: 2px;
  height: 16px;
  align-items: end;
  margin-top: 4px;
}

.bar {
  width: 3px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 2px;
  animation: bounce 1s infinite;
}

.bar:nth-child(1) { animation-delay: 0.1s; }
.bar:nth-child(2) { animation-delay: 0.2s; }
.bar:nth-child(3) { animation-delay: 0.3s; }
.bar:nth-child(4) { animation-delay: 0.4s; }
.bar:nth-child(5) { animation-delay: 0.5s; }
.bar:nth-child(6) { animation-delay: 0.6s; }
.bar:nth-child(7) { animation-delay: 0.7s; }
.bar:nth-child(8) { animation-delay: 0.8s; }

@keyframes bounce {
  0%, 100% { height: 4px; }
  50% { height: 16px; }
}

.status-dashboard {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.status-card {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  transition: transform 0.3s ease;
}

.status-card:hover {
  transform: translateY(-2px);
}

.status-icon {
  font-size: 24px;
}

.status-label {
  font-size: 12px;
  opacity: 0.8;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.status-value {
  font-size: 18px;
  font-weight: 700;
  margin-top: 2px;
}

.status-active { color: #4ade80; }
.status-paused { color: #fbbf24; }
.status-success { color: #22c55e; }
.status-error { color: #ef4444; }
.status-ready { color: #e5e7eb; }

.progress-section {
  margin-bottom: 24px;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.progress-label {
  font-weight: 600;
}

.progress-percentage {
  font-weight: 700;
}

.progress-bar-container {
  position: relative;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  height: 20px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #4ade80, #22c55e);
  border-radius: 10px;
  transition: width 0.5s ease;
}

.progress-glow {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  border-radius: 10px;
  animation: shimmer 2s infinite;
}

@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

.progress-stats {
  display: flex;
  justify-content: space-between;
  margin-top: 8px;
  font-size: 12px;
  opacity: 0.8;
}

.campaign-controls {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.control-btn {
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 12px;
  padding: 12px 20px;
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  min-width: 120px;
  justify-content: center;
}

.control-btn:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
}

.control-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.start-btn:hover:not(:disabled) { background: rgba(34, 197, 94, 0.3); }
.pause-btn:hover:not(:disabled) { background: rgba(251, 191, 36, 0.3); }
.resume-btn:hover:not(:disabled) { background: rgba(59, 130, 246, 0.3); }
.stop-btn:hover:not(:disabled) { background: rgba(239, 68, 68, 0.3); }

.cors-status {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 24px;
}

.cors-title {
  margin: 0 0 12px 0;
  font-size: 16px;
  font-weight: 600;
}

.cors-methods {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
  flex-wrap: wrap;
}

.cors-method {
  padding: 6px 12px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.1);
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.cors-method.success {
  background: rgba(34, 197, 94, 0.3);
}

.cors-method.active {
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
}

.test-btn {
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  padding: 8px 16px;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
}

.test-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.recent-messages {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 24px;
}

.messages-title {
  margin: 0 0 12px 0;
  font-size: 16px;
  font-weight: 600;
}

.messages-list {
  max-height: 200px;
  overflow-y: auto;
}

.message-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  font-size: 14px;
}

.message-item:last-child {
  border-bottom: none;
}

.message-recipient {
  font-weight: 600;
}

.message-time {
  font-size: 12px;
  opacity: 0.7;
}

.status-success { color: #4ade80; }
.status-failed { color: #f87171; }

.quick-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.action-btn {
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 10px 16px;
  color: white;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  flex: 1;
  min-width: 140px;
  text-align: center;
}

.action-btn:hover {
  background: rgba(255, 255, 255, 0.25);
  transform: translateY(-1px);
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    text-align: center;
  }
  
  .campaign-controls {
    flex-direction: column;
  }
  
  .control-btn {
    min-width: auto;
  }
  
  .quick-actions {
    flex-direction: column;
  }
}
</style>
