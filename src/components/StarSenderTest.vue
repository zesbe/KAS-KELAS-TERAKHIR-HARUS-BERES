<template>
  <div class="startsender-test">
    <div class="test-header">
      <h3 class="test-title">🧪 StarSender Test Console</h3>
      <p class="test-subtitle">Test CORS bypass and WhatsApp integration</p>
    </div>

    <div class="test-section">
      <h4>🚀 Quick Setup</h4>
      <div class="quick-setup">
        <button @click="setupDemo" class="test-btn primary">
          🌟 Setup Demo Environment
        </button>
        <button @click="quickTest" class="test-btn secondary">
          ⚡ Instant Force Test
        </button>
        <button @click="musicDemo" class="test-btn music">
          🎵 Music System Demo
        </button>
      </div>
    </div>

    <div class="test-section">
      <h4>📱 Quick WhatsApp Test</h4>
      <div class="test-form">
        <div class="form-group">
          <label>Phone Number</label>
          <input 
            v-model="testForm.phone" 
            type="text" 
            placeholder="628123456789"
            class="test-input"
          />
        </div>
        
        <div class="form-group">
          <label>Message</label>
          <textarea 
            v-model="testForm.message" 
            rows="4"
            placeholder="🌟 Test message from StarSender! 

Hello [[NAME]], this is a test message with CORS bypass capabilities.

✅ If you receive this, StarSender is working perfectly!"
            class="test-input"
          ></textarea>
        </div>
        
        <button @click="sendTestMessage" :disabled="sending" class="test-btn primary">
          <span v-if="sending">🚀 Sending...</span>
          <span v-else>📤 Send Test Message</span>
        </button>
      </div>
    </div>

    <div class="test-section">
      <h4>🛡️ CORS Bypass Test</h4>
      <div class="cors-tests">
        <button @click="testCORS" :disabled="testingCORS" class="test-btn secondary">
          <span v-if="testingCORS">🧪 Testing...</span>
          <span v-else>🧪 Test All Methods</span>
        </button>
        
        <div v-if="corsResults.length > 0" class="cors-results">
          <div 
            v-for="result in corsResults" 
            :key="result.method"
            :class="['cors-result', { success: result.success, failed: !result.success }]"
          >
            <span class="method-name">{{ result.method }}</span>
            <span class="method-status">{{ result.success ? '✅ Working' : '❌ Failed' }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="test-section">
      <h4>🎵 Music System Test</h4>
      <div class="music-controls">
        <button @click="playMusic" class="test-btn music">🎵 Play Music</button>
        <button @click="stopMusic" class="test-btn music">🔇 Stop Music</button>
        <button @click="nextSong" class="test-btn music">⏭️ Next Song</button>
      </div>
      <div class="current-song">
        Current: {{ currentSong }}
      </div>
    </div>

    <div class="test-section">
      <h4>🚀 Bulk Test Campaign</h4>
      <div class="bulk-test">
        <div class="form-group">
          <label>Number of Test Messages</label>
          <input 
            v-model.number="bulkTest.count" 
            type="number" 
            min="1" 
            max="10"
            class="test-input"
          />
        </div>
        
        <div class="form-group">
          <label>Delay Between Messages (seconds)</label>
          <input 
            v-model.number="bulkTest.delay" 
            type="number" 
            min="1" 
            max="60"
            class="test-input"
          />
        </div>
        
        <button @click="runBulkTest" :disabled="bulkTesting" class="test-btn primary">
          <span v-if="bulkTesting">🚀 Running Test {{ bulkProgress }}/{{ bulkTest.count }}</span>
          <span v-else>🚀 Run Bulk Test</span>
        </button>
      </div>
    </div>

    <div class="test-logs" v-if="logs.length > 0">
      <h4>📋 Test Logs</h4>
      <div class="logs-container">
        <div 
          v-for="log in logs" 
          :key="log.id"
          :class="['log-entry', log.type]"
        >
          <span class="log-time">{{ formatTime(log.timestamp) }}</span>
          <span class="log-message">{{ log.message }}</span>
        </div>
      </div>
      <button @click="clearLogs" class="test-btn small">🗑️ Clear Logs</button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import startsender from '@/services/startsender'
import { setupDemoEnvironment, createQuickTestCampaign, createInstantTestMessage, demoMessageTemplates } from '@/services/demoData'

// Test form
const testForm = reactive({
  phone: '628123456789',
  message: `🌟 Test message from StarSender!

Hello [[NAME]], this is a test message with CORS bypass capabilities.

✅ If you receive this, StarSender is working perfectly!

🎵 Music: Playing beautiful tunes while sending
🛡️ CORS: Bypassed successfully
⚡ Speed: Lightning fast delivery

Time: ${new Date().toLocaleString('id-ID')}

_Powered by StarSender - Force Mode Enabled_ 💪`
})

// Bulk test
const bulkTest = reactive({
  count: 3,
  delay: 5
})

// State
const sending = ref(false)
const testingCORS = ref(false)
const bulkTesting = ref(false)
const bulkProgress = ref(0)
const corsResults = ref([])
const logs = ref([])
const currentSong = ref('Ready')

// Methods
const addLog = (message, type = 'info') => {
  logs.value.unshift({
    id: Date.now(),
    timestamp: new Date(),
    message,
    type
  })
  
  // Keep only last 50 logs
  if (logs.value.length > 50) {
    logs.value = logs.value.slice(0, 50)
  }
}

const sendTestMessage = async () => {
  if (!testForm.phone || !testForm.message) {
    addLog('❌ Phone number and message are required', 'error')
    return
  }

  sending.value = true
  addLog(`🚀 Sending test message to ${testForm.phone}`, 'info')

  try {
    const result = await startsender.sendMessage(testForm.phone, testForm.message, {
      openInNewTab: true
    })

    if (result.success) {
      addLog(`✅ Message sent successfully via ${result.method}`, 'success')
      addLog(`📱 WhatsApp URL: ${result.url}`, 'info')
    } else {
      addLog('❌ Failed to send message', 'error')
    }
  } catch (error) {
    addLog(`❌ Error: ${error.message}`, 'error')
  } finally {
    sending.value = false
  }
}

const testCORS = async () => {
  testingCORS.value = true
  corsResults.value = []
  addLog('🧪 Starting CORS bypass test...', 'info')

  try {
    const results = await startsender.testCORSBypass()
    corsResults.value = results.map(r => ({
      method: r.url.split('/')[2] || 'Unknown',
      success: r.success
    }))

    const successCount = results.filter(r => r.success).length
    addLog(`🧪 CORS test completed: ${successCount}/${results.length} methods working`, 'success')
  } catch (error) {
    addLog(`❌ CORS test failed: ${error.message}`, 'error')
  } finally {
    testingCORS.value = false
  }
}

const playMusic = () => {
  startsender.playMusic()
  addLog('🎵 Music started', 'info')
  updateMusicStatus()
}

const stopMusic = () => {
  startsender.stopMusic()
  addLog('🔇 Music stopped', 'info')
  updateMusicStatus()
}

const nextSong = () => {
  startsender.nextSong()
  addLog('⏭️ Switched to next song', 'info')
  updateMusicStatus()
}

const updateMusicStatus = () => {
  const stats = startsender.getStats()
  currentSong.value = stats.currentSong
}

const runBulkTest = async () => {
  if (bulkTest.count < 1 || bulkTest.count > 10) {
    addLog('❌ Bulk test count must be between 1 and 10', 'error')
    return
  }

  bulkTesting.value = true
  bulkProgress.value = 0
  
  addLog(`🚀 Starting bulk test: ${bulkTest.count} messages with ${bulkTest.delay}s delay`, 'info')

  const testPhones = [
    '628123456789',
    '628987654321',
    '628111222333',
    '628444555666',
    '628777888999'
  ]

  for (let i = 0; i < bulkTest.count; i++) {
    bulkProgress.value = i + 1
    const phone = testPhones[i % testPhones.length]
    const message = `🧪 Bulk Test Message #${i + 1}

This is automated test message #${i + 1} of ${bulkTest.count}

🌟 StarSender Force Mode
🛡️ CORS Bypass: Active
⚡ Speed Test: ${bulkTest.delay}s intervals

Timestamp: ${new Date().toLocaleString('id-ID')}

_Test completed successfully!_ ✅`

    try {
      const result = await startsender.sendMessage(phone, message, {
        openInNewTab: i === 0 // Only open first message
      })
      
      addLog(`✅ Bulk test ${i + 1}/${bulkTest.count}: ${result.method}`, 'success')
    } catch (error) {
      addLog(`❌ Bulk test ${i + 1}/${bulkTest.count} failed: ${error.message}`, 'error')
    }

    // Delay before next message (except for last one)
    if (i < bulkTest.count - 1) {
      addLog(`⏳ Waiting ${bulkTest.delay} seconds...`, 'info')
      await new Promise(resolve => setTimeout(resolve, bulkTest.delay * 1000))
    }
  }

  addLog('🎊 Bulk test completed!', 'success')
  bulkTesting.value = false
  bulkProgress.value = 0
}

const clearLogs = () => {
  logs.value = []
  addLog('🗑️ Logs cleared', 'info')
}

const formatTime = (timestamp) => {
  return timestamp.toLocaleTimeString('id-ID')
}

// Initialize
onMounted(() => {
  addLog('🌟 StarSender Test Console initialized', 'info')
  updateMusicStatus()
})
</script>

<style scoped>
.startsender-test {
  background: #1f2937;
  border-radius: 12px;
  padding: 20px;
  color: white;
  font-family: 'Inter', sans-serif;
}

.test-header {
  margin-bottom: 24px;
  text-align: center;
}

.test-title {
  font-size: 24px;
  font-weight: 700;
  margin: 0;
  color: #60a5fa;
}

.test-subtitle {
  color: #9ca3af;
  margin: 8px 0 0 0;
  font-size: 14px;
}

.test-section {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
}

.test-section h4 {
  margin: 0 0 12px 0;
  color: #f3f4f6;
  font-size: 16px;
  font-weight: 600;
}

.test-form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.form-group label {
  font-size: 14px;
  font-weight: 500;
  color: #d1d5db;
}

.test-input {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  padding: 8px 12px;
  color: white;
  font-size: 14px;
}

.test-input:focus {
  outline: none;
  border-color: #60a5fa;
  box-shadow: 0 0 0 2px rgba(96, 165, 250, 0.2);
}

.test-input::placeholder {
  color: #9ca3af;
}

.test-btn {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  padding: 10px 16px;
  color: white;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
}

.test-btn:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-1px);
}

.test-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.test-btn.primary {
  background: #3b82f6;
  border-color: #3b82f6;
}

.test-btn.primary:hover:not(:disabled) {
  background: #2563eb;
}

.test-btn.secondary {
  background: #6b7280;
  border-color: #6b7280;
}

.test-btn.secondary:hover:not(:disabled) {
  background: #4b5563;
}

.test-btn.music {
  background: #8b5cf6;
  border-color: #8b5cf6;
}

.test-btn.music:hover:not(:disabled) {
  background: #7c3aed;
}

.test-btn.small {
  padding: 6px 12px;
  font-size: 12px;
}

.cors-tests {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.cors-results {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.cors-result {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.05);
}

.cors-result.success {
  background: rgba(34, 197, 94, 0.2);
  border: 1px solid rgba(34, 197, 94, 0.3);
}

.cors-result.failed {
  background: rgba(239, 68, 68, 0.2);
  border: 1px solid rgba(239, 68, 68, 0.3);
}

.music-controls {
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
  flex-wrap: wrap;
}

.current-song {
  font-size: 14px;
  color: #d1d5db;
  font-style: italic;
}

.bulk-test {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  align-items: end;
}

.bulk-test .test-btn {
  grid-column: span 2;
}

.test-logs {
  background: rgba(0, 0, 0, 0.3);
  border-radius: 8px;
  padding: 16px;
}

.test-logs h4 {
  margin: 0 0 12px 0;
  color: #f3f4f6;
  font-size: 16px;
  font-weight: 600;
}

.logs-container {
  max-height: 200px;
  overflow-y: auto;
  margin-bottom: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  padding: 8px;
}

.log-entry {
  display: flex;
  gap: 12px;
  padding: 4px 0;
  font-size: 13px;
  font-family: 'Courier New', monospace;
}

.log-time {
  color: #9ca3af;
  min-width: 80px;
}

.log-message {
  flex: 1;
}

.log-entry.info .log-message { color: #d1d5db; }
.log-entry.success .log-message { color: #4ade80; }
.log-entry.error .log-message { color: #f87171; }

@media (max-width: 768px) {
  .bulk-test {
    grid-template-columns: 1fr;
  }
  
  .bulk-test .test-btn {
    grid-column: span 1;
  }
  
  .music-controls {
    flex-direction: column;
  }
}
</style>
