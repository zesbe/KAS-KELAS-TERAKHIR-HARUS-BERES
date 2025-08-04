import { createClient } from '@supabase/supabase-js'
import { mockDb } from '@/services/mockData'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Check if Supabase is properly configured
const isSupabaseConfigured = supabaseUrl && supabaseAnonKey &&
  !supabaseUrl.includes('your-project') &&
  !supabaseAnonKey.includes('your-anon-key')

export const supabase = isSupabaseConfigured ?
  createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false
    },
    global: {
      fetch: (url, options = {}) => {
        // Add timeout and retry logic
        const timeoutMs = 10000 // 10 seconds
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), timeoutMs)

        return fetch(url, {
          ...options,
          signal: controller.signal
        }).finally(() => {
          clearTimeout(timeoutId)
        }).catch(error => {
          if (error.name === 'AbortError') {
            throw new Error('Request timeout - please check your connection')
          }
          throw error
        })
      }
    }
  }) :
  null

// Auth helpers
export const auth = {
  signUp: (email, password) => isSupabaseConfigured ?
    supabase.auth.signUp({ email, password }) :
    Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }),
  signIn: (email, password) => isSupabaseConfigured ?
    supabase.auth.signInWithPassword({ email, password }) :
    Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }),
  signOut: () => isSupabaseConfigured ?
    supabase.auth.signOut() :
    Promise.resolve({ error: null }),
  getUser: () => isSupabaseConfigured ?
    supabase.auth.getUser() :
    Promise.resolve({ data: { user: null }, error: null }),
  onAuthStateChange: (callback) => isSupabaseConfigured ?
    supabase.auth.onAuthStateChange(callback) :
    callback('SIGNED_OUT', null)
}

// Helper function to check if we should use mock data
const shouldUseMockData = async () => {
  if (!isSupabaseConfigured) return true

  try {
    // Quick connectivity test
    const { error } = await supabase.from('students').select('count', { count: 'exact', head: true })
    return !!error
  } catch (error) {
    console.warn('Supabase connection failed, falling back to mock data:', error.message)
    return true
  }
}

// Database helpers - use mock data when Supabase is not configured or not accessible
export const db = {
  // Students
  getStudents: async () => {
    if (!isSupabaseConfigured) return mockDb.getStudents()
    try {
      return await supabase.from('students').select('*').order('name')
    } catch (error) {
      console.warn('Falling back to mock data due to error:', error.message)
      return mockDb.getStudents()
    }
  },
  addStudent: (student) => isSupabaseConfigured ?
    supabase.from('students').insert(student) :
    mockDb.addStudent(student),
  updateStudent: (id, updates) => isSupabaseConfigured ?
    supabase.from('students').update(updates).eq('id', id) :
    mockDb.updateStudent(id, updates),
  deleteStudent: (id) => isSupabaseConfigured ?
    supabase.from('students').delete().eq('id', id) :
    mockDb.deleteStudent(id),

  // Transactions (kas masuk/keluar)
  getTransactions: () => isSupabaseConfigured ?
    supabase.from('transactions').select(`
      *,
      student:students(name, nickname)
    `).order('created_at', { ascending: false }) :
    mockDb.getTransactions(),
  addTransaction: (transaction) => isSupabaseConfigured ?
    supabase.from('transactions').insert(transaction) :
    mockDb.addTransaction(transaction),
  updateTransaction: (id, updates) => isSupabaseConfigured ?
    supabase.from('transactions').update(updates).eq('id', id) :
    mockDb.updateTransaction(id, updates),

  // Campaigns
  getCampaigns: () => isSupabaseConfigured ?
    supabase.from('campaigns').select('*').order('created_at', { ascending: false }) :
    mockDb.getCampaigns(),
  addCampaign: (campaign) => isSupabaseConfigured ?
    supabase.from('campaigns').insert(campaign) :
    mockDb.addCampaign(campaign),
  updateCampaign: (id, updates) => isSupabaseConfigured ?
    supabase.from('campaigns').update(updates).eq('id', id) :
    mockDb.updateCampaign(id, updates),

  // Payment links
  getPaymentLinks: () => isSupabaseConfigured ?
    supabase.from('payment_links').select(`
      *,
      student:students(name, nickname)
    `).order('created_at', { ascending: false }) :
    mockDb.getPaymentLinks(),
  addPaymentLink: (link) => isSupabaseConfigured ?
    supabase.from('payment_links').insert(link) :
    mockDb.addPaymentLink(link),
  updatePaymentLink: (id, updates) => isSupabaseConfigured ?
    supabase.from('payment_links').update(updates).eq('id', id) :
    mockDb.updatePaymentLink(id, updates),
  deletePaymentLink: (id) => isSupabaseConfigured ?
    supabase.from('payment_links').delete().eq('id', id) :
    mockDb.deletePaymentLink(id),

  // Expenses
  getExpenses: () => isSupabaseConfigured ?
    supabase.from('expenses').select('*').order('created_at', { ascending: false }) :
    mockDb.getExpenses(),
  addExpense: (expense) => isSupabaseConfigured ?
    supabase.from('expenses').insert(expense) :
    mockDb.addExpense(expense),
  updateExpense: (id, updates) => isSupabaseConfigured ?
    supabase.from('expenses').update(updates).eq('id', id) :
    mockDb.updateExpense(id, updates),
  deleteExpense: (id) => isSupabaseConfigured ?
    supabase.from('expenses').delete().eq('id', id) :
    mockDb.deleteExpense(id)
}
