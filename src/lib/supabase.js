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
        const timeoutMs = 5000 // Reduced to 5 seconds
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), timeoutMs)

        return fetch(url, {
          ...options,
          signal: controller.signal
        }).finally(() => {
          clearTimeout(timeoutId)
        }).catch(error => {
          console.warn('Supabase fetch failed, falling back to mock data:', error.message)
          // Instead of throwing, we'll let the db helpers handle fallback
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

// Helper function to safely execute Supabase operations with fallback
const safeSupabaseOperation = async (operation, fallback) => {
  if (!isSupabaseConfigured) {
    console.info('Supabase not configured, using mock data')
    return fallback()
  }

  try {
    const result = await operation()
    return result
  } catch (error) {
    console.warn('Supabase operation failed, falling back to mock data:', error.message)
    return fallback()
  }
}

// Database helpers - use mock data when Supabase is not configured or not accessible
export const db = {
  // Students
  getStudents: async () => {
    return safeSupabaseOperation(
      () => supabase.from('students').select('*').order('name'),
      () => mockDb.getStudents()
    )
  },
  addStudent: (student) => safeSupabaseOperation(
    () => supabase.from('students').insert(student),
    () => mockDb.addStudent(student)
  ),
  updateStudent: (id, updates) => safeSupabaseOperation(
    () => supabase.from('students').update(updates).eq('id', id),
    () => mockDb.updateStudent(id, updates)
  ),
  deleteStudent: (id) => safeSupabaseOperation(
    () => supabase.from('students').delete().eq('id', id),
    () => mockDb.deleteStudent(id)
  ),

  // Transactions (kas masuk/keluar)
  getTransactions: async () => {
    return safeSupabaseOperation(
      () => supabase.from('transactions').select(`
        *,
        student:students(name, nickname)
      `).order('created_at', { ascending: false }),
      () => mockDb.getTransactions()
    )
  },
  addTransaction: (transaction) => safeSupabaseOperation(
    () => supabase.from('transactions').insert(transaction),
    () => mockDb.addTransaction(transaction)
  ),
  updateTransaction: (id, updates) => safeSupabaseOperation(
    () => supabase.from('transactions').update(updates).eq('id', id),
    () => mockDb.updateTransaction(id, updates)
  ),



  // Payment links
  getPaymentLinks: async () => {
    if (!isSupabaseConfigured) return mockDb.getPaymentLinks()
    try {
      return await supabase.from('payment_links').select(`
        *,
        student:students(name, nickname, phone)
      `).order('created_at', { ascending: false })
    } catch (error) {
      console.warn('Falling back to mock data due to error:', error.message)
      return mockDb.getPaymentLinks()
    }
  },
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
  getExpenses: async () => {
    if (!isSupabaseConfigured) return mockDb.getExpenses()
    try {
      return await supabase.from('expenses').select('*').order('created_at', { ascending: false })
    } catch (error) {
      console.warn('Falling back to mock data due to error:', error.message)
      return mockDb.getExpenses()
    }
  },
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
