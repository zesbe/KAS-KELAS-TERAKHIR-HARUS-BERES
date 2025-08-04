import { defineStore } from 'pinia'
import { db } from '@/lib/supabase'
import pakasirService from '@/services/pakasir'
import starsenderService from '@/services/starsender'

export const useAppStore = defineStore('app', {
  state: () => ({
    // Students data
    students: [],

    // Financial data
    transactions: [],
    expenses: [],
    totalBalance: 0,

    // Campaigns
    campaigns: [],
    activeCampaign: null,

    // Payment links
    paymentLinks: [],

    // UI state
    loading: false,
    error: null,

    // Database status
    isUsingMockData: false,
    databaseStatus: 'unknown', // 'connected', 'mock', 'error'

    // Sidebar state
    sidebarOpen: false
  }),

  getters: {
    // Financial calculations
    totalIncome: (state) => {
      return state.transactions
        .filter(t => t.type === 'income' && t.status === 'completed')
        .reduce((sum, t) => sum + t.amount, 0)
    },
    
    totalExpenses: (state) => {
      return state.expenses
        .filter(e => e.status === 'approved')
        .reduce((sum, e) => sum + e.amount, 0)
    },
    
    currentBalance: (state) => {
      return state.totalIncome - state.totalExpenses
    },
    
    // Recent transactions
    recentTransactions: (state) => {
      return state.transactions.slice(0, 10)
    },
    
    // Pending payments
    pendingPayments: (state) => {
      return state.paymentLinks.filter(p => p.status === 'pending')
    },
    
    // Students by payment status
    studentsByPaymentStatus: (state) => {
      const paidStudents = state.transactions
        .filter(t => t.type === 'income' && t.status === 'completed')
        .map(t => t.student_id)
      
      return {
        paid: state.students.filter(s => paidStudents.includes(s.id)),
        unpaid: state.students.filter(s => !paidStudents.includes(s.id))
      }
    }
  },

  actions: {
    // Students management
    async fetchStudents() {
      this.loading = true
      try {
        const { data, error } = await db.getStudents()
        if (error) throw error
        this.students = data || []
      } catch (error) {
        this.error = this.formatError(error)
        console.error('Error fetching students:', this.formatError(error))
      } finally {
        this.loading = false
      }
    },

    async addStudent(studentData) {
      try {
        const { data, error } = await db.addStudent(studentData)
        if (error) throw error
        await this.fetchStudents()
        return data
      } catch (error) {
        this.error = error.message
        throw error
      }
    },

    // Transactions management
    async fetchTransactions() {
      this.loading = true
      try {
        const { data, error } = await db.getTransactions()
        if (error) throw error
        this.transactions = data || []
      } catch (error) {
        this.error = this.formatError(error)
        console.error('Error fetching transactions:', this.formatError(error))
      } finally {
        this.loading = false
      }
    },

    async addTransaction(transactionData) {
      try {
        const { data, error } = await db.addTransaction(transactionData)
        if (error) throw error
        await this.fetchTransactions()
        return data
      } catch (error) {
        this.error = error.message
        throw error
      }
    },

    // Expenses management
    async fetchExpenses() {
      try {
        const { data, error } = await db.getExpenses()
        if (error) throw error
        this.expenses = data || []
      } catch (error) {
        this.error = this.formatError(error)
        console.error('Error fetching expenses:', this.formatError(error))
      }
    },

    async addExpense(expenseData) {
      try {
        const { data, error } = await db.addExpense(expenseData)
        if (error) throw error
        await this.fetchExpenses()
        return data
      } catch (error) {
        this.error = error.message
        throw error
      }
    },

    async updateExpense(id, updates) {
      try {
        const { data, error } = await db.updateExpense(id, updates)
        if (error) throw error
        await this.fetchExpenses()
        return data
      } catch (error) {
        this.error = error.message
        throw error
      }
    },

    async deleteExpense(id) {
      try {
        const { data, error } = await db.deleteExpense(id)
        if (error) throw error
        await this.fetchExpenses()
        return data
      } catch (error) {
        this.error = error.message
        throw error
      }
    },

    // Payment links management
    async fetchPaymentLinks() {
      try {
        const { data, error } = await db.getPaymentLinks()
        if (error) throw error
        this.paymentLinks = data || []
      } catch (error) {
        this.error = this.formatError(error)
        console.error('Error fetching payment links:', this.formatError(error))
      }
    },

    async generatePaymentLink(studentId, amount, description) {
      try {
        const student = this.students.find(s => s.id === studentId)
        if (!student) throw new Error('Student not found')

        const paymentData = pakasirService.createPaymentLink(student, amount, description)
        
        const { data, error } = await db.addPaymentLink({
          ...paymentData,
          student_id: studentId,
          status: 'pending'
        })
        
        if (error) throw error
        await this.fetchPaymentLinks()
        return data
      } catch (error) {
        this.error = error.message
        throw error
      }
    },

    // Campaign management
    async fetchCampaigns() {
      try {
        const { data, error } = await db.getCampaigns()
        if (error) throw error
        this.campaigns = data || []
      } catch (error) {
        this.error = this.formatError(error)
        console.error('Error fetching campaigns:', this.formatError(error))
      }
    },

    async sendCampaign(campaignData) {
      try {
        this.loading = true
        
        // Save campaign to database
        const { data: campaign, error } = await db.addCampaign({
          ...campaignData,
          status: 'sending',
          created_at: new Date().toISOString()
        })
        
        if (error) throw error

        // Send messages via StarSender
        const recipients = campaignData.recipients.map(studentId => {
          const student = this.students.find(s => s.id === studentId)
          return {
            name: student.name,
            phone: student.phone
          }
        })

        const results = await starsenderService.sendCampaign(
          recipients,
          campaignData.message,
          campaignData.delay_minutes
        )

        // Update campaign status
        await db.updateCampaign(campaign[0].id, {
          status: 'completed',
          results: results,
          completed_at: new Date().toISOString()
        })

        await this.fetchCampaigns()
        return results
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    // Webhook handling
    async handlePaymentWebhook(webhookData) {
      try {
        // Validate webhook
        pakasirService.validateWebhook(webhookData)

        // Find corresponding payment link
        const paymentLink = this.paymentLinks.find(p => p.order_id === webhookData.order_id)
        if (!paymentLink) throw new Error('Payment link not found')

        // Update payment link status
        await db.updatePaymentLink(paymentLink.id, {
          status: 'completed',
          payment_method: webhookData.payment_method,
          completed_at: webhookData.completed_at
        })

        // Create income transaction
        await db.addTransaction({
          type: 'income',
          amount: webhookData.amount,
          description: paymentLink.description,
          student_id: paymentLink.student_id,
          payment_method: webhookData.payment_method,
          order_id: webhookData.order_id,
          status: 'completed',
          created_at: webhookData.completed_at
        })

        // Refresh data
        await this.fetchPaymentLinks()
        await this.fetchTransactions()

        return true
      } catch (error) {
        this.error = error.message
        throw error
      }
    },

    // UI actions
    toggleSidebar() {
      this.sidebarOpen = !this.sidebarOpen
    },

    clearError() {
      this.error = null
    },

    // Helper method to format errors properly
    formatError(error) {
      if (!error) return 'Unknown error occurred'

      // Handle network errors
      if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
        return 'Network connection failed. Please check your internet connection and try again.'
      }

      // Handle Supabase specific errors
      if (error.message) {
        return error.message
      }

      // Handle error objects
      if (typeof error === 'object') {
        if (error.error_description) return error.error_description
        if (error.error) return error.error
        return JSON.stringify(error, null, 2)
      }

      // Fallback
      return error.toString()
    }
  }
})
