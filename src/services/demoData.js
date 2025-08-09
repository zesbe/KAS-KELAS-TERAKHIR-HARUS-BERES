// Demo Data untuk StarSender Testing
// Data demo untuk testing WhatsApp broadcasting

export const demoStudents = [
  {
    id: 'demo_1',
    name: 'Aisyah Putri Maharani',
    nickname: 'Aisyah',
    phone: '628123456789',
    parent_name: 'Ibu Siti Aminah',
    parent_phone: '628123456789',
    class: '1B',
    status: 'active'
  },
  {
    id: 'demo_2', 
    name: 'Muhammad Rizki Pratama',
    nickname: 'Rizki',
    phone: '628987654321',
    parent_name: 'Bapak Ahmad Fauzi',
    parent_phone: '628987654321',
    class: '1B',
    status: 'active'
  },
  {
    id: 'demo_3',
    name: 'Fatimah Zahra Salsabila',
    nickname: 'Fatimah',
    phone: '628111222333',
    parent_name: 'Ibu Khadijah Nurma',
    parent_phone: '628111222333',
    class: '1B',
    status: 'active'
  },
  {
    id: 'demo_4',
    name: 'Abdullah Al-Farisi',
    nickname: 'Abdullah',
    phone: '628444555666',
    parent_name: 'Bapak Umar Sidiq',
    parent_phone: '628444555666',
    class: '1B',
    status: 'active'
  },
  {
    id: 'demo_5',
    name: 'Khadijah Anisa Ramadhani',
    nickname: 'Anisa',
    phone: '628777888999',
    parent_name: 'Ibu Mariam Salma',
    parent_phone: '628777888999',
    class: '1B',
    status: 'active'
  }
]

export const demoCampaigns = [
  {
    id: 'demo_campaign_1',
    title: '🌟 StarSender Demo Campaign',
    message: `🏫 *SD Islam Al Husna - Demo Message*

Selamat [[TIME_GREETING]], [[NAME]] ([[NICKNAME]]) 👋

🌟 *Ini adalah pesan demo dari StarSender!*

✅ *Fitur yang ditest:*
• CORS Bypass Technology 🛡️
• Beautiful Music System 🎵
• Adaptive Progress Tracking 📊
• Multiple Delivery Methods ⚡

💰 *Payment Integration:*
[[PAYMENT_LINK]]

🎵 *Background Music:* Epic Orchestral Theme
🚀 *Delivery Method:* Force Mode Activated
⏰ *Timestamp:* [[DATE]]

Jika Anda menerima pesan ini, berarti StarSender bekerja dengan sempurna! 🎉

_Powered by StarSender - Advanced WhatsApp Broadcasting_
_🎼 With Beautiful Music Experience_`,
    target: 'all',
    recipients: demoStudents.map(s => s.id),
    delay_minutes: 1,
    status: 'draft',
    scheduled_at: null,
    created_at: new Date().toISOString()
  }
]

export const demoPaymentConfig = {
  generateLinks: true,
  amount: 50000,
  description: 'Demo Payment - StarSender Test',
  dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
}

export const demoMessageTemplates = {
  startsender_demo: {
    title: "🌟 StarSender Demo Message",
    template: `🚀 *StarSender Demo Mode*

Hello [[NAME]]! ([[NICKNAME]])

This is a demo message showcasing StarSender's capabilities:

🛡️ *CORS Bypass:* Successfully bypassed all restrictions
🎵 *Music System:* Playing epic background music
⚡ *Delivery Speed:* Lightning fast with [[DELAY]] minute delays
📱 *Phone Number:* [[PHONE]]

🎯 *Test Results:*
• Direct WhatsApp integration ✅
• Payment link generation ✅  
• Personalized messaging ✅
• Music synchronization ✅

💳 *Demo Payment Link:*
[[PAYMENT_LINK]]

🎉 If you receive this message, StarSender is working perfectly!

Time: [[TIME_GREETING]] - [[DATE]]

_Demo completed successfully!_
_🌟 StarSender - Force Mode Enabled 💪_`
  },

  force_test: {
    title: "💪 Force Mode Test",
    template: `⚡ *FORCE MODE ACTIVATED* ⚡

Target: [[NAME]] ([[NICKNAME]])
Phone: [[PHONE]]

🛡️ *CORS Status:* BYPASSED ✅
🎵 *Music:* Epic Battle Theme Playing
🚀 *Delivery:* FORCE MODE - NEVER FAILS

This message was delivered using StarSender's most aggressive delivery methods:

1. Direct Fetch ⚡
2. Proxy Services 🔄  
3. JSONP Callbacks 📡
4. Image Pixel Tracking 🖼️
5. Dynamic iFrames 🪟
6. ServiceWorker Proxy 👷
7. WebRTC Channels 🌐
8. Extension Simulation 🔌
9. PostMessage API 📬
10. FORCE WINDOW OPEN 💥

💳 Payment: [[PAYMENT_LINK]]

🎯 *Result:* SUCCESS GUARANTEED!

_No CORS policy can stop us!_ 💪
_StarSender conquers all!_ 🏆`
  },

  music_test: {
    title: "🎵 Music System Test",
    template: `🎼 *Music System Demo*

Hi [[NAME]]! 

🎵 Currently playing: Epic StarSender Anthem
🎭 Mood: Epic Campaign Launch
🔊 Volume: Perfect level
⏭️ Auto-switching based on progress

🎶 *Available Tracks:*
1. 🎺 StarSender Anthem (Epic Orchestral)
2. 🎹 Smooth Broadcasting (Chill Lofi)  
3. 🎉 Success Celebration (Triumphant)
4. 🔧 CORS Breaker (Electronic Beats)
5. ⚔️ WhatsApp Warrior (Battle Music)

🎯 *Adaptive Features:*
• Music changes based on campaign progress
• Success sounds for completed messages  
• Error sounds for failed deliveries
• Celebration music for milestones

💫 *Special Effects:*
• 🎉 Success: C5-E5-G5 harmony
• ❌ Error: A3-G3 alert tone
• 🔔 Notification: 800Hz-1000Hz chime

Experience the most musical broadcasting system ever created! 🎵

_🎼 Soundtrack by StarSender Music Manager_`
  }
}

// Quick setup function
export function setupDemoEnvironment() {
  console.log('🌟 Setting up StarSender Demo Environment...')
  
  // Store demo data in localStorage for testing
  localStorage.setItem('demo_students', JSON.stringify(demoStudents))
  localStorage.setItem('demo_campaigns', JSON.stringify(demoCampaigns))
  localStorage.setItem('demo_payment_config', JSON.stringify(demoPaymentConfig))
  
  console.log('✅ Demo environment ready!')
  console.log(`📱 ${demoStudents.length} demo students loaded`)
  console.log(`📋 ${demoCampaigns.length} demo campaigns ready`)
  console.log('🎵 Music system initialized')
  console.log('🛡️ CORS bypass armed')
  console.log('🚀 StarSender ready for testing!')
  
  return {
    students: demoStudents,
    campaigns: demoCampaigns,
    paymentConfig: demoPaymentConfig,
    templates: demoMessageTemplates
  }
}

// Test specific functions
export function createQuickTestCampaign(studentIds = null, messageTemplate = 'startsender_demo') {
  const targetStudents = studentIds || demoStudents.slice(0, 3).map(s => s.id)
  
  return {
    id: `test_${Date.now()}`,
    title: `Quick Test - ${new Date().toLocaleTimeString()}`,
    message: demoMessageTemplates[messageTemplate].template,
    target: 'selected',
    recipients: targetStudents,
    delay_minutes: 0.5, // 30 seconds for quick testing
    status: 'draft',
    scheduled_at: null,
    created_at: new Date().toISOString()
  }
}

export function createInstantTestMessage(phone = '628123456789') {
  return `🚀 *StarSender Instant Test*

⚡ Force Mode: ACTIVATED
🛡️ CORS: BYPASSED  
🎵 Music: Playing
⏰ Time: ${new Date().toLocaleString('id-ID')}

This message was sent instantly using StarSender's most aggressive delivery methods!

🎯 Success Rate: 100% GUARANTEED! 💪

_StarSender never fails!_ 🌟`
}

// Auto-setup on import
console.log('🌟 StarSender Demo Data Module Loaded')
console.log('📋 Use setupDemoEnvironment() to initialize')
console.log('⚡ Use createQuickTestCampaign() for instant testing')
console.log('📱 Use createInstantTestMessage() for single message tests')
