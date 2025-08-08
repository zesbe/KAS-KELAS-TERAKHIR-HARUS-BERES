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



    // Payment links
    paymentLinks: [],

    // UI state
    loading: {
      students: false,
      transactions: false,
      expenses: false,
      paymentLinks: false,
      global: false
    },
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
      this.loading.students = true
      this.loading.global = true
      try {
        const { data, error } = await db.getStudents()
        if (error) {
          this.databaseStatus = 'error'
          throw error
        }
        this.students = data || []
        // Check if we're getting mock data
        this.isUsingMockData = data && data.length > 0 && data[0].id === '1'
        this.databaseStatus = this.isUsingMockData ? 'mock' : 'connected'
      } catch (error) {
        this.error = this.formatError(error)
        this.databaseStatus = 'error'
        console.error('Error fetching students:', this.formatError(error))
      } finally {
        this.loading.students = false
        this.loading.global = false
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
      this.loading.transactions = true
      this.loading.global = true
      try {
        const { data, error } = await db.getTransactions()
        if (error) throw error
        this.transactions = data || []
      } catch (error) {
        this.error = this.formatError(error)
        console.error('Error fetching transactions:', this.formatError(error))
      } finally {
        this.loading.transactions = false
        this.loading.global = false
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

    async deletePaymentLink(id) {
      try {
        const { data, error } = await db.deletePaymentLink(id)
        if (error) throw error
        await this.fetchPaymentLinks()
        return data
      } catch (error) {
        this.error = error.message
        throw error
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
