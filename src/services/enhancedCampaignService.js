// Enhanced Campaign Service with Auto Payment Link Generation
// Integrates PakaSir payment links directly into campaign messages

import { db } from '@/lib/supabase'
import starsenderService from './starsender'
import pakasirService from './pakasir'

class EnhancedCampaignService {
  constructor() {
    this.runningCampaigns = new Map()
    this.paymentLinks = new Map() // Cache generated payment links
  }

  // Professional message templates for different scenarios
  getMessageTemplates() {
    return {
      payment_reminder: {
        title: "Reminder Pembayaran Kas",
        template: `🏫 *Reminder Kas Kelas 1B*
SD Islam Al Husna

Selamat [[TIME_GREETING]], [[NAME]] ([[NICKNAME]]) 👋

💰 *Pembayaran Kas Bulan [[MONTH]]*
• Jumlah: [[AMOUNT]]
• Jatuh Tempo: [[DUE_DATE]]
• Status: Belum Lunas

[[PAYMENT_LINK]]

Silakan klik link di atas untuk pembayaran yang mudah dan aman melalui QRIS/Transfer.

Terima kasih atas perhatian dan kerjasamanya! 🙏

_Pesan otomatis dari Bendahara Kelas 1B_
_📱 Sistem Kas Digital - SD Islam Al Husna_`,
        variables: ['NAME', 'NICKNAME', 'TIME_GREETING', 'MONTH', 'AMOUNT', 'DUE_DATE', 'PAYMENT_LINK']
      },

      payment_urgent: {
        title: "Urgent - Pembayaran Terlambat",
        template: `🚨 *URGENT - Pembayaran Kas Terlambat*
SD Islam Al Husna

[[NAME]] ([[NICKNAME]]),

Pembayaran kas kelas Anda telah melewati jatuh tempo [[OVERDUE_DAYS]] hari.

⚠️ *Detail Tunggakan:*
• Bulan: [[MONTH]]
• Jumlah: [[AMOUNT]]
• Jatuh Tempo: [[DUE_DATE]]
• Denda: [[PENALTY_AMOUNT]]

💳 *Bayar Sekarang:*
[[PAYMENT_LINK]]

Mohon segera melunasi untuk menghindari denda lebih lanjut.

🤝 *Butuh Bantuan?*
Hubungi Bendahara: Bu Siti (0812-xxxx-xxxx)

_Sistem Kas Digital - SD Islam Al Husna_`,
        variables: ['NAME', 'NICKNAME', 'MONTH', 'AMOUNT', 'DUE_DATE', 'OVERDUE_DAYS', 'PENALTY_AMOUNT', 'PAYMENT_LINK']
      },

      payment_first_notice: {
        title: "Pemberitahuan Pembayaran Kas",
        template: `🏫 *Pemberitahuan Kas Kelas 1B*
SD Islam Al Husna

Kepada Yth. Orang Tua/Wali [[NAME]] ([[NICKNAME]]) 🙏

📋 *Informasi Pembayaran Kas Bulan [[MONTH]]:*
• Jumlah: [[AMOUNT]]
• Periode: [[PERIOD]]
• Jatuh Tempo: [[DUE_DATE]]
• Untuk: [[DESCRIPTION]]

💳 *Link Pembayaran Mudah:*
[[PAYMENT_LINK]]
_Pembayaran via QRIS/Transfer Bank_

✅ *Manfaat Kas Kelas:*
• Kegiatan pembelajaran
• Perlengkapan kelas
• Kebersihan dan kesehatan
• Dana darurat kelas

Terima kasih atas partisipasi dalam kemajuan pendidikan anak! 💙

_Bendahara Kelas 1B - SD Islam Al Husna_
_💻 Sistem Digital untuk Transparansi_`,
        variables: ['NAME', 'NICKNAME', 'MONTH', 'AMOUNT', 'PERIOD', 'DUE_DATE', 'DESCRIPTION', 'PAYMENT_LINK']
      },

      info_announcement: {
        title: "Pengumuman Kelas",
        template: `📢 *Pengumuman Kelas 1B*
SD Islam Al Husna

Kepada Seluruh Orang Tua/Wali Siswa Kelas 1B 👨‍👩‍👧‍👦

📋 *[[ANNOUNCEMENT_TITLE]]*

[[ANNOUNCEMENT_CONTENT]]

📅 *Detail Kegiatan:*
• Tanggal: [[EVENT_DATE]]
• Waktu: [[EVENT_TIME]]
• Tempat: [[EVENT_LOCATION]]
• Biaya: [[EVENT_COST]]

[[PAYMENT_LINK_IF_NEEDED]]

📞 *Informasi Lebih Lanjut:*
Bu Aminah (Wali Kelas): 0813-xxxx-xxxx

Mohon perhatian dan partisipasinya. Terima kasih! 🙏

_Wali Kelas 1B - SD Islam Al Husna_`,
        variables: ['ANNOUNCEMENT_TITLE', 'ANNOUNCEMENT_CONTENT', 'EVENT_DATE', 'EVENT_TIME', 'EVENT_LOCATION', 'EVENT_COST', 'PAYMENT_LINK_IF_NEEDED']
      },

      payment_confirmation: {
        title: "Konfirmasi Pembayaran",
        template: `✅ *Pembayaran Berhasil Diterima*
SD Islam Al Husna

Terima kasih [[NAME]] ([[NICKNAME]])! 🙏

💰 *Detail Pembayaran:*
• Jumlah: [[AMOUNT]]
• Tanggal: [[PAYMENT_DATE]]
• Metode: [[PAYMENT_METHOD]]
• Ref: [[REFERENCE_NUMBER]]

📋 *Status Kas Terbaru:*
• Total Terbayar: [[TOTAL_PAID]]
• Sisa Bulan Ini: [[REMAINING_BALANCE]]
• Status: LUNAS ✅

🎉 Anak Anda kini terdaftar sebagai siswa yang telah melunasi kas kelas bulan [[MONTH]].

Terima kasih atas kepercayaan dan kerjasamanya! 💙

_Bendahara Kelas 1B - SD Islam Al Husna_
_💻 Notifikasi Otomatis Sistem Kas Digital_`,
        variables: ['NAME', 'NICKNAME', 'AMOUNT', 'PAYMENT_DATE', 'PAYMENT_METHOD', 'REFERENCE_NUMBER', 'TOTAL_PAID', 'REMAINING_BALANCE', 'MONTH']
      },

      event_payment: {
        title: "Pembayaran Kegiatan Khusus",
        template: `🎉 *Pembayaran Kegiatan: [[EVENT_NAME]]*
SD Islam Al Husna

Kepada Orang Tua/Wali [[NAME]] ([[NICKNAME]]) 👋

🎯 *Detail Kegiatan:*
• Nama: [[EVENT_NAME]]
• Tanggal: [[EVENT_DATE]]
• Biaya: [[AMOUNT]]
• Include: [[EVENT_INCLUDES]]
• Deadline: [[DUE_DATE]]

💳 *Pembayaran Mudah:*
[[PAYMENT_LINK]]

📝 *Catatan Penting:*
[[EVENT_NOTES]]

🤝 *Kontak Koordinator:*
[[COORDINATOR_NAME]]: [[COORDINATOR_PHONE]]

Mari bersama-sama menciptakan pengalaman belajar yang bermakna untuk anak-anak! 🌟

_Panitia Kegiatan - SD Islam Al Husna_`,
        variables: ['EVENT_NAME', 'NAME', 'NICKNAME', 'EVENT_DATE', 'AMOUNT', 'EVENT_INCLUDES', 'DUE_DATE', 'EVENT_NOTES', 'COORDINATOR_NAME', 'COORDINATOR_PHONE', 'PAYMENT_LINK']
      },

      thank_you: {
        title: "Terima Kasih & Apresiasi",
        template: `🙏 *Terima Kasih Atas Partisipasi*
SD Islam Al Husna

Kepada [[NAME]] ([[NICKNAME]]) yang luar biasa! ⭐

🎯 *Apresiasi untuk:*
[[APPRECIATION_REASON]]

💙 *Kontribusi Anda:*
• [[CONTRIBUTION_DETAILS]]
• Dampak: [[IMPACT_DESCRIPTION]]

🏆 *Pencapaian Kelas:*
[[CLASS_ACHIEVEMENTS]]

Terima kasih telah menjadi bagian dari keluarga besar Kelas 1B. Semangat terus! 💪

_Wali Kelas 1B - SD Islam Al Husna_
_"Bersama Membangun Generasi Cerdas & Berkarakter"_`,
        variables: ['NAME', 'NICKNAME', 'APPRECIATION_REASON', 'CONTRIBUTION_DETAILS', 'IMPACT_DESCRIPTION', 'CLASS_ACHIEVEMENTS']
      }
    }
  }

  // Auto-generate payment link and integrate into message
  async generatePaymentCampaign(campaignData, paymentConfig = null) {
    try {
      // Get recipients
      const recipients = await this.getRecipients(campaignData.target, campaignData.recipients)
      
      // Generate payment links for each recipient if payment is required
      const recipientsWithLinks = []
      
      for (const recipient of recipients) {
        let paymentLink = null
        
        if (paymentConfig && paymentConfig.generateLinks) {
          // Generate unique payment link for this student
          const paymentData = pakasirService.createPaymentLink(
            recipient,
            paymentConfig.amount,
            paymentConfig.description || 'Kas Kelas'
          )
          
          // Store payment link
          await this.storePaymentLink({
            student_id: recipient.id,
            order_id: paymentData.order_id,
            payment_url: paymentData.payment_url,
            amount: paymentConfig.amount,
            description: paymentConfig.description,
            expires_at: paymentConfig.expiresAt || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            campaign_id: campaignData.id
          })
          
          paymentLink = paymentData.payment_url
        }
        
        recipientsWithLinks.push({
          ...recipient,
          paymentLink
        })
      }
      
      return recipientsWithLinks
      
    } catch (error) {
      console.error('Error generating payment campaign:', error)
      throw error
    }
  }

  // Store payment link in database
  async storePaymentLink(linkData) {
    try {
      const { data, error } = await db.addPaymentLink ? 
        await db.addPaymentLink(linkData) :
        this.storePaymentLinkToStorage(linkData)

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error storing payment link:', error)
      throw error
    }
  }

  // Enhanced message personalization with payment links
  personalizeMessageEnhanced(template, recipient, campaignData, paymentConfig = null) {
    let message = template

    // Basic recipient info
    message = message
      .replace(/\[\[NAME\]\]/g, recipient.name || '')
      .replace(/\[\[NICKNAME\]\]/g, recipient.nickname || '')
      .replace(/\[\[PHONE\]\]/g, recipient.phone || '')

    // Time-based greetings
    const now = new Date()
    const hour = now.getHours()
    let timeGreeting = 'Selamat Pagi'
    if (hour >= 11 && hour < 15) timeGreeting = 'Selamat Siang'
    else if (hour >= 15 && hour < 18) timeGreeting = 'Selamat Sore'
    else if (hour >= 18) timeGreeting = 'Selamat Malam'
    
    message = message.replace(/\[\[TIME_GREETING\]\]/g, timeGreeting)

    // Date and time variables
    const currentDate = now.toLocaleDateString('id-ID')
    const currentMonth = now.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })
    
    message = message
      .replace(/\[\[CURRENT_DATE\]\]/g, currentDate)
      .replace(/\[\[MONTH\]\]/g, currentMonth)

    // Payment-specific variables
    if (paymentConfig) {
      message = message
        .replace(/\[\[AMOUNT\]\]/g, `Rp ${paymentConfig.amount.toLocaleString('id-ID')}`)
        .replace(/\[\[DESCRIPTION\]\]/g, paymentConfig.description || 'Kas Kelas')
        .replace(/\[\[DUE_DATE\]\]/g, paymentConfig.dueDate || 'Akhir bulan')
    }

    // Payment link
    if (recipient.paymentLink) {
      const formattedLink = `💳 *BAYAR SEKARANG*
${recipient.paymentLink}

✅ Pembayaran aman via QRIS/Transfer
⚡ Konfirmasi otomatis real-time
📱 Akses 24/7 dari HP Anda`

      message = message.replace(/\[\[PAYMENT_LINK\]\]/g, formattedLink)
    } else {
      // Remove payment link placeholder if no link
      message = message.replace(/\[\[PAYMENT_LINK\]\]/g, '')
    }

    // Remove empty payment link placeholders
    message = message
      .replace(/\[\[PAYMENT_LINK_IF_NEEDED\]\]/g, recipient.paymentLink ? 
        `💳 Link Pembayaran: ${recipient.paymentLink}` : '')

    // Clean up extra line breaks
    message = message.replace(/\n{3,}/g, '\n\n')

    return message.trim()
  }

  // Execute enhanced campaign with payment links
  async executeEnhancedCampaign(campaign, paymentConfig = null) {
    try {
      campaign.status = 'sending'
      
      // Generate recipients with payment links if needed
      const recipients = paymentConfig ? 
        await this.generatePaymentCampaign(campaign, paymentConfig) :
        await this.getRecipients(campaign.target, campaign.recipients)
      
      if (recipients.length === 0) {
        throw new Error('Tidak ada penerima yang valid')
      }

      // Calculate schedule times
      const schedules = this.calculateScheduleTimes(campaign, recipients.length)
      
      const results = []
      
      for (let i = 0; i < recipients.length; i++) {
        const recipient = recipients[i]
        const scheduleTime = schedules[i]
        
        try {
          // Personalize message with enhanced variables and payment link
          const personalizedMessage = this.personalizeMessageEnhanced(
            campaign.message, 
            recipient, 
            campaign, 
            paymentConfig
          )
          
          console.log(`Scheduling enhanced message for ${recipient.name} at ${new Date(scheduleTime).toLocaleString()}`)
          
          // Send message via StarSender with schedule
          const result = await starsenderService.sendMessage(
            recipient.phone, 
            personalizedMessage, 
            { schedule: scheduleTime }
          )
          
          results.push({
            phone: recipient.phone,
            name: recipient.name,
            success: true,
            scheduledTime: scheduleTime,
            hasPaymentLink: !!recipient.paymentLink,
            paymentLink: recipient.paymentLink,
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
      campaign.payment_config = paymentConfig
      campaign.results = {
        totalSent: recipients.length,
        successCount: results.filter(r => r.success).length,
        failedCount: results.filter(r => !r.success).length,
        paymentLinksGenerated: results.filter(r => r.hasPaymentLink).length,
        results: results
      }
      
      // Save campaign
      await this.updateCampaign(campaign)
      
      // Set completion timer
      this.setCompletionTimer(campaign, schedules)
      
      return {
        success: true,
        campaign: campaign,
        results: results
      }
      
    } catch (error) {
      console.error('Error executing enhanced campaign:', error)
      campaign.status = 'failed'
      await this.updateCampaign(campaign)
      throw error
    }
  }

  // Inherit methods from base campaign service
  async getRecipients(target, selectedIds = []) {
    try {
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

  filterUnpaidStudents(students) {
    // TODO: Implement based on actual payment data
    return students
  }

  filterPaidStudents(students) {
    // TODO: Implement based on actual payment data  
    return []
  }

  calculateScheduleTimes(campaign, recipientCount) {
    const schedules = []
    const startTime = campaign.scheduled_at ? 
      new Date(campaign.scheduled_at).getTime() : 
      Date.now()
    const delayMs = (campaign.delay_minutes || 10) * 60 * 1000
    
    for (let i = 0; i < recipientCount; i++) {
      schedules.push(startTime + (i * delayMs))
    }
    
    return schedules
  }

  async updateCampaign(campaign) {
    try {
      campaign.updated_at = new Date().toISOString()
      
      const { data, error } = await db.updateCampaign ? 
        await db.updateCampaign(campaign.id, campaign) :
        this.updateCampaignInStorage(campaign)

      if (error) throw error
      return { success: true, data: campaign }
    } catch (error) {
      console.error('Error updating campaign:', error)
      throw error
    }
  }

  setCompletionTimer(campaign, schedules) {
    if (schedules.length === 0) return
    
    const lastScheduleTime = Math.max(...schedules)
    const completionTime = lastScheduleTime + (5 * 60 * 1000)
    const delay = completionTime - Date.now()
    
    if (delay > 0) {
      setTimeout(async () => {
        try {
          campaign.status = 'completed'
          campaign.completed_at = new Date().toISOString()
          await this.updateCampaign(campaign)
          console.log(`Enhanced campaign "${campaign.title}" completed`)
        } catch (error) {
          console.error('Error marking campaign as completed:', error)
        }
      }, delay)
    }
  }

  // Storage fallback methods
  storePaymentLinkToStorage(linkData) {
    const links = JSON.parse(localStorage.getItem('paymentLinks') || '[]')
    links.push(linkData)
    localStorage.setItem('paymentLinks', JSON.stringify(links))
    return { data: linkData, error: null }
  }

  updateCampaignInStorage(campaign) {
    const campaigns = JSON.parse(localStorage.getItem('campaigns') || '[]')
    const index = campaigns.findIndex(c => c.id === campaign.id)
    
    if (index !== -1) {
      campaigns[index] = campaign
    } else {
      campaigns.push(campaign)
    }
    
    localStorage.setItem('campaigns', JSON.stringify(campaigns))
    return { data: campaign, error: null }
  }

  // Quick campaign creators for common scenarios
  createPaymentReminderCampaign(amount, dueDate, month) {
    const template = this.getMessageTemplates().payment_reminder.template
    return {
      title: `Reminder Kas ${month}`,
      message: template,
      paymentConfig: {
        generateLinks: true,
        amount: amount,
        description: `Kas Kelas ${month}`,
        dueDate: dueDate
      }
    }
  }

  createEventPaymentCampaign(eventName, amount, eventDate, eventDetails) {
    const template = this.getMessageTemplates().event_payment.template
    return {
      title: `Pembayaran ${eventName}`,
      message: template
        .replace(/\[\[EVENT_NAME\]\]/g, eventName)
        .replace(/\[\[EVENT_DATE\]\]/g, eventDate)
        .replace(/\[\[EVENT_INCLUDES\]\]/g, eventDetails.includes || '')
        .replace(/\[\[EVENT_NOTES\]\]/g, eventDetails.notes || '')
        .replace(/\[\[COORDINATOR_NAME\]\]/g, eventDetails.coordinator || 'Panitia')
        .replace(/\[\[COORDINATOR_PHONE\]\]/g, eventDetails.phone || ''),
      paymentConfig: {
        generateLinks: true,
        amount: amount,
        description: eventName,
        dueDate: eventDetails.deadline
      }
    }
  }
}

export default new EnhancedCampaignService()
