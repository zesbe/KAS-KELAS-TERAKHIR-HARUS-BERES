// Campaign Management Service
// Handles scheduled WhatsApp campaigns with StarSender integration

import { db } from '@/lib/supabase'
import starsenderService from './starsender'

class CampaignService {
  constructor() {
    this.runningCampaigns = new Map() // Track running campaigns
  }

  // Create new campaign
  async createCampaign(campaignData) {
    try {
      // Validate campaign data
      this.validateCampaignData(campaignData)

      // Prepare campaign for database
      const campaign = {
        ...campaignData,
        id: campaignData.id || this.generateCampaignId(),
        status: 'draft',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      // Save to database
      const { data, error } = await db.addCampaign ? 
        await db.addCampaign(campaign) :
        // Fallback to localStorage for now
        this.saveCampaignToStorage(campaign)

      if (error) throw error

      return { success: true, data: campaign }
    } catch (error) {
      console.error('Error creating campaign:', error)
      // Ensure error has a message property
      if (error && typeof error === 'object' && !error.message) {
        error.message = 'Failed to create campaign'
      }
      throw error
    }
  }

  // Execute campaign immediately or schedule it
  async executeCampaign(campaign, executeNow = false) {
    try {
      campaign.status = 'sending'
      
      // Get recipients based on target
      const recipients = await this.getRecipients(campaign.target, campaign.recipients)
      
      if (recipients.length === 0) {
        throw new Error('Tidak ada penerima yang valid')
      }

      // Calculate schedule times for each message
      const schedules = this.calculateScheduleTimes(campaign, recipients.length)
      
      const results = []
      
      for (let i = 0; i < recipients.length; i++) {
        const recipient = recipients[i]
        const scheduleTime = schedules[i]
        
        try {
          // Personalize message
          const personalizedMessage = this.personalizeMessage(campaign.message, recipient)
          
          // Send message via StarSender with schedule
          const sendOptions = {
            schedule: scheduleTime // Unix timestamp in milliseconds
          }
          
          console.log(`Scheduling message for ${recipient.name} at ${new Date(scheduleTime).toLocaleString()}`)
          
          const result = await starsenderService.sendMessage(
            recipient.phone, 
            personalizedMessage, 
            sendOptions
          )
          
          results.push({
            phone: recipient.phone,
            name: recipient.name,
            success: true,
            scheduledTime: scheduleTime,
            result: result
          })
          
        } catch (error) {
          console.error(`Failed to schedule message for ${recipient.name}:`, error)
          results.push({
            phone: recipient.phone,
            name: recipient.name,
            success: false,
            error: error.message,
            scheduledTime: scheduleTime
          })
        }
      }
      
      // Update campaign with results
      campaign.status = 'scheduled'
      campaign.started_at = new Date().toISOString()
      campaign.results = {
        totalSent: recipients.length,
        successCount: results.filter(r => r.success).length,
        failedCount: results.filter(r => !r.success).length,
        results: results
      }
      
      // Save updated campaign
      await this.updateCampaign(campaign)
      
      // Set completion timer
      this.setCompletionTimer(campaign, schedules)
      
      return {
        success: true,
        campaign: campaign,
        results: results
      }
      
    } catch (error) {
      console.error('Error executing campaign:', error)
      campaign.status = 'failed'
      await this.updateCampaign(campaign)
      throw error
    }
  }

  // Calculate schedule times for all messages
  calculateScheduleTimes(campaign, recipientCount) {
    const schedules = []
    
    // Base start time
    const startTime = campaign.scheduled_at ? 
      new Date(campaign.scheduled_at).getTime() : 
      Date.now()
    
    // Delay between messages in milliseconds
    const delayMs = (campaign.delay_minutes || 10) * 60 * 1000
    
    for (let i = 0; i < recipientCount; i++) {
      const scheduleTime = startTime + (i * delayMs)
      schedules.push(scheduleTime)
    }
    
    return schedules
  }

  // Personalize message with recipient data
  personalizeMessage(template, recipient) {
    return template
      .replace(/\[\[NAME\]\]/g, recipient.name || '')
      .replace(/\[\[NICKNAME\]\]/g, recipient.nickname || '')
      .replace(/\[\[PHONE\]\]/g, recipient.phone || '')
      .replace(/\{nama\}/g, recipient.name || '')
      .replace(/\{panggilan\}/g, recipient.nickname || '')
      .replace(/\{hp\}/g, recipient.phone || '')
  }

  // Get recipients based on target type
  async getRecipients(target, selectedIds = []) {
    try {
      // Get all students
      const { data: students, error } = await db.getStudents()
      if (error) throw error

      switch (target) {
        case 'all':
          return students
          
        case 'paid':
          return this.filterPaidStudents(students)
          
        case 'unpaid':
          return this.filterUnpaidStudents(students)
          
        case 'selected':
          return students.filter(s => selectedIds.includes(s.id))
          
        default:
          return []
      }
      
    } catch (error) {
      console.error('Error getting recipients:', error)
      return []
    }
  }

  // Filter students based on payment status
  filterPaidStudents(students) {
    // TODO: Implement based on actual payment data
    // For now, return empty array
    return []
  }

  filterUnpaidStudents(students) {
    // TODO: Implement based on actual payment data
    // For now, return all students as "unpaid"
    return students
  }

  // Set timer to mark campaign as completed
  setCompletionTimer(campaign, schedules) {
    if (schedules.length === 0) return
    
    // Get the last schedule time
    const lastScheduleTime = Math.max(...schedules)
    const completionTime = lastScheduleTime + (5 * 60 * 1000) // 5 minutes buffer
    
    const delay = completionTime - Date.now()
    
    if (delay > 0) {
      setTimeout(async () => {
        try {
          campaign.status = 'completed'
          campaign.completed_at = new Date().toISOString()
          await this.updateCampaign(campaign)
          
          console.log(`Campaign "${campaign.title}" marked as completed`)
        } catch (error) {
          console.error('Error marking campaign as completed:', error)
        }
      }, delay)
    }
  }

  // Update campaign in database
  async updateCampaign(campaign) {
    try {
      campaign.updated_at = new Date().toISOString()
      
      // Update in database
      const { data, error } = await db.updateCampaign ? 
        await db.updateCampaign(campaign.id, campaign) :
        // Fallback to localStorage
        this.updateCampaignInStorage(campaign)

      if (error) throw error
      
      return { success: true, data: campaign }
    } catch (error) {
      console.error('Error updating campaign:', error)
      throw error
    }
  }

  // Get all campaigns
  async getCampaigns() {
    try {
      const { data, error } = await db.getCampaigns ? 
        await db.getCampaigns() :
        // Fallback to localStorage
        this.getCampaignsFromStorage()

      if (error) throw error

      return { success: true, data: data || [] }
    } catch (error) {
      console.error('Error getting campaigns:', error)
      return { success: false, data: [] }
    }
  }

  // Delete campaign
  async deleteCampaign(campaignId) {
    try {
      const { data, error } = await db.deleteCampaign ? 
        await db.deleteCampaign(campaignId) :
        // Fallback to localStorage
        this.deleteCampaignFromStorage(campaignId)

      if (error) throw error

      return { success: true }
    } catch (error) {
      console.error('Error deleting campaign:', error)
      throw error
    }
  }

  // Generate unique campaign ID
  generateCampaignId() {
    return `campaign_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  // Validate campaign data
  validateCampaignData(campaign) {
    if (!campaign.title || campaign.title.trim() === '') {
      throw new Error('Judul campaign harus diisi')
    }
    
    if (!campaign.message || campaign.message.trim() === '') {
      throw new Error('Pesan campaign harus diisi')
    }
    
    if (!campaign.target) {
      throw new Error('Target penerima harus dipilih')
    }
    
    if (campaign.target === 'selected' && (!campaign.recipients || campaign.recipients.length === 0)) {
      throw new Error('Pilih minimal 1 penerima untuk target manual')
    }
  }

  // LocalStorage fallback methods
  saveCampaignToStorage(campaign) {
    const campaigns = this.getCampaignsFromStorage().data || []
    campaigns.push(campaign)
    localStorage.setItem('campaigns', JSON.stringify(campaigns))
    return { data: campaign, error: null }
  }

  updateCampaignInStorage(campaign) {
    const campaigns = this.getCampaignsFromStorage().data || []
    const index = campaigns.findIndex(c => c.id === campaign.id)
    
    if (index !== -1) {
      campaigns[index] = campaign
      localStorage.setItem('campaigns', JSON.stringify(campaigns))
    }
    
    return { data: campaign, error: null }
  }

  getCampaignsFromStorage() {
    try {
      const stored = localStorage.getItem('campaigns')
      const campaigns = stored ? JSON.parse(stored) : []
      return { data: campaigns, error: null }
    } catch (error) {
      console.error('Error reading campaigns from storage:', error)
      return { data: [], error: error }
    }
  }

  deleteCampaignFromStorage(campaignId) {
    const campaigns = this.getCampaignsFromStorage().data || []
    const filtered = campaigns.filter(c => c.id !== campaignId)
    localStorage.setItem('campaigns', JSON.stringify(filtered))
    return { data: null, error: null }
  }

  // Helper methods for UI
  getStatusLabel(status) {
    const labels = {
      draft: 'Draft',
      scheduled: 'Terjadwal',
      sending: 'Mengirim',
      completed: 'Selesai',
      failed: 'Gagal',
      cancelled: 'Dibatalkan'
    }
    return labels[status] || status
  }

  getTargetLabel(target) {
    const labels = {
      all: 'Semua Siswa',
      paid: 'Sudah Bayar',
      unpaid: 'Belum Bayar',
      selected: 'Pilihan Manual'
    }
    return labels[target] || target
  }

  // Check if campaign can be edited
  canEditCampaign(campaign) {
    return ['draft'].includes(campaign.status)
  }

  // Check if campaign can be deleted
  canDeleteCampaign(campaign) {
    return ['draft', 'scheduled', 'failed'].includes(campaign.status)
  }

  // Get campaign progress percentage
  getCampaignProgress(campaign) {
    if (!campaign.results) {
      return campaign.status === 'completed' ? 100 : 0
    }
    
    const { successCount, totalSent } = campaign.results
    return totalSent > 0 ? Math.round((successCount / totalSent) * 100) : 0
  }

  // Generate campaign preview data
  generateCampaignPreview(campaignForm, students) {
    const recipients = this.getRecipientsByTarget(campaignForm.target, campaignForm.selectedStudents, students)
    const totalRecipients = recipients.length
    
    const estimatedDuration = totalRecipients * campaignForm.delayMinutes // in minutes
    const startTime = campaignForm.sendType === 'scheduled' && campaignForm.scheduledDateTime ?
      new Date(campaignForm.scheduledDateTime) : new Date()
    
    const endTime = new Date(startTime.getTime() + estimatedDuration * 60 * 1000)
    
    return {
      totalRecipients,
      estimatedDuration,
      startTime,
      endTime,
      recipients
    }
  }

  // Get recipients by target (for preview)
  getRecipientsByTarget(target, selectedIds, students) {
    switch (target) {
      case 'all':
        return students
      case 'paid':
        return this.filterPaidStudents(students)
      case 'unpaid':
        return this.filterUnpaidStudents(students)
      case 'selected':
        return students.filter(s => selectedIds.includes(s.id))
      default:
        return []
    }
  }
}

export default new CampaignService()
