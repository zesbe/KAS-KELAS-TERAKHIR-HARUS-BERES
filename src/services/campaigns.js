// Campaign Management Service
// Kelola campaign WhatsApp dengan fitur scheduling dan bulk sending

import whatsappSender from './whatsappSender'

class CampaignManager {
  constructor() {
    this.campaigns = []
    this.isExecuting = false
  }

  // Buat campaign baru
  createCampaign(campaignData) {
    const campaign = {
      id: this.generateId(),
      title: campaignData.title,
      message: campaignData.message,
      recipients: campaignData.recipients || [],
      target: campaignData.target || 'selected',
      delaySeconds: campaignData.delaySeconds || 3,
      status: 'draft',
      createdAt: new Date().toISOString(),
      results: null
    }

    this.campaigns.push(campaign)
    this.saveCampaigns()
    
    return campaign
  }

  // Execute campaign
  async executeCampaign(campaignId) {
    const campaign = this.getCampaignById(campaignId)
    if (!campaign) {
      throw new Error('Campaign not found')
    }

    if (this.isExecuting) {
      throw new Error('Another campaign is currently running')
    }

    try {
      this.isExecuting = true
      campaign.status = 'running'
      campaign.startedAt = new Date().toISOString()
      
      console.log(`🚀 Executing campaign: ${campaign.title}`)
      console.log(`📱 Recipients: ${campaign.recipients.length}`)
      console.log(`⏱️ Delay: ${campaign.delaySeconds} seconds between messages`)

      // Execute bulk send
      const results = await whatsappSender.sendBulkMessages(
        campaign.recipients,
        campaign.message,
        campaign.delaySeconds
      )

      campaign.status = 'completed'
      campaign.completedAt = new Date().toISOString()
      campaign.results = results

      this.saveCampaigns()

      return {
        success: true,
        campaign: campaign,
        results: results
      }

    } catch (error) {
      campaign.status = 'failed'
      campaign.error = error.message
      this.saveCampaigns()
      throw error
    } finally {
      this.isExecuting = false
    }
  }

  // Get all campaigns
  getCampaigns() {
    return this.campaigns
  }

  // Get campaign by ID
  getCampaignById(id) {
    return this.campaigns.find(c => c.id === id)
  }

  // Update campaign
  updateCampaign(id, updates) {
    const campaign = this.getCampaignById(id)
    if (campaign) {
      Object.assign(campaign, updates)
      this.saveCampaigns()
      return campaign
    }
    return null
  }

  // Delete campaign
  deleteCampaign(id) {
    const index = this.campaigns.findIndex(c => c.id === id)
    if (index !== -1) {
      this.campaigns.splice(index, 1)
      this.saveCampaigns()
      return true
    }
    return false
  }

  // Generate unique ID
  generateId() {
    return 'campaign_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
  }

  // Save to localStorage
  saveCampaigns() {
    try {
      localStorage.setItem('whatsapp_campaigns', JSON.stringify(this.campaigns))
    } catch (error) {
      console.warn('Could not save campaigns:', error)
    }
  }

  // Load from localStorage
  loadCampaigns() {
    try {
      const stored = localStorage.getItem('whatsapp_campaigns')
      if (stored) {
        this.campaigns = JSON.parse(stored)
      }
    } catch (error) {
      console.warn('Could not load campaigns:', error)
      this.campaigns = []
    }
  }

  // Create quick demo campaign
  createDemoCampaign(students) {
    if (this.campaigns.length === 0 && students.length > 0) {
      const demoCampaign = {
        id: 'demo_campaign',
        title: 'Demo Campaign WhatsApp',
        message: `Halo [[NAME]]! 

Ini adalah demo campaign WhatsApp dari Sistem Kas Kelas 1B.

🏫 SD Islam Al Husna
📱 WhatsApp: [[PHONE]]

Pesan ini dikirim menggunakan teknologi CORS Bypass untuk memastikan delivery yang sukses.

Terima kasih! 🙏`,
        recipients: students.slice(0, 3), // Only first 3 students for demo
        target: 'selected',
        delaySeconds: 2,
        status: 'draft',
        createdAt: new Date().toISOString(),
        results: null
      }

      this.campaigns.push(demoCampaign)
      this.saveCampaigns()
    }
  }

  // Get campaign statistics
  getStats() {
    const total = this.campaigns.length
    const completed = this.campaigns.filter(c => c.status === 'completed').length
    const running = this.campaigns.filter(c => c.status === 'running').length
    const failed = this.campaigns.filter(c => c.status === 'failed').length

    return {
      total,
      completed,
      running,
      failed,
      draft: total - completed - running - failed
    }
  }
}

// Create global instance
const campaignManager = new CampaignManager()

// Load existing campaigns
campaignManager.loadCampaigns()

// Export
export default campaignManager

console.log('📋 Campaign Manager initialized')
