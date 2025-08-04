import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Auth helpers
export const auth = {
  signUp: (email, password) => supabase.auth.signUp({ email, password }),
  signIn: (email, password) => supabase.auth.signInWithPassword({ email, password }),
  signOut: () => supabase.auth.signOut(),
  getUser: () => supabase.auth.getUser(),
  onAuthStateChange: (callback) => supabase.auth.onAuthStateChange(callback)
}

// Database helpers
export const db = {
  // Students
  getStudents: () => supabase.from('students').select('*').order('name'),
  addStudent: (student) => supabase.from('students').insert(student),
  updateStudent: (id, updates) => supabase.from('students').update(updates).eq('id', id),
  deleteStudent: (id) => supabase.from('students').delete().eq('id', id),

  // Transactions (kas masuk/keluar)
  getTransactions: () => supabase.from('transactions').select(`
    *,
    student:students(name, nickname)
  `).order('created_at', { ascending: false }),
  addTransaction: (transaction) => supabase.from('transactions').insert(transaction),
  updateTransaction: (id, updates) => supabase.from('transactions').update(updates).eq('id', id),

  // Campaigns
  getCampaigns: () => supabase.from('campaigns').select('*').order('created_at', { ascending: false }),
  addCampaign: (campaign) => supabase.from('campaigns').insert(campaign),
  updateCampaign: (id, updates) => supabase.from('campaigns').update(updates).eq('id', id),

  // Payment links
  getPaymentLinks: () => supabase.from('payment_links').select(`
    *,
    student:students(name, nickname)
  `).order('created_at', { ascending: false }),
  addPaymentLink: (link) => supabase.from('payment_links').insert(link),
  updatePaymentLink: (id, updates) => supabase.from('payment_links').update(updates).eq('id', id),

  // Expenses
  getExpenses: () => supabase.from('expenses').select('*').order('created_at', { ascending: false }),
  addExpense: (expense) => supabase.from('expenses').insert(expense),
  updateExpense: (id, updates) => supabase.from('expenses').update(updates).eq('id', id),
  deleteExpense: (id) => supabase.from('expenses').delete().eq('id', id)
}
