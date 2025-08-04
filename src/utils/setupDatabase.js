import { createClient } from '@supabase/supabase-js'

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const setupDatabase = async () => {
  const supabase = createClient(supabaseUrl, supabaseAnonKey)
  
  console.log('Setting up database tables...')
  
  try {
    // Check if tables exist by trying to fetch from students table
    const { data, error } = await supabase.from('students').select('count').limit(1)
    
    if (error && error.message.includes('relation "students" does not exist')) {
      throw new Error('Database tables do not exist. Please run the SQL schema in Supabase SQL Editor first.')
    }
    
    // If we get here, tables exist. Let's check if we have any data
    const { data: existingStudents } = await supabase.from('students').select('count')
    
    if (!existingStudents || existingStudents.length === 0) {
      console.log('No existing data found. Inserting sample data...')
      
      // Insert sample students
      const students = [
        { name: 'Aqilnafi Segara', nickname: 'Nafi', phone: '+62 856-2468-7313' },
        { name: 'Arkaan Jawara Bayanaka', nickname: 'Arkaan', phone: '+62 821-1475-9339' },
        { name: 'Athafariz Zehan Sasongko', nickname: 'Atha', phone: '+62 812-9670-7505' },
        { name: 'Azma Raudhatul Jannah', nickname: 'Azma', phone: '+62 856-8500-062' },
        { name: 'Dizya Nayara Khanza Pujiarto', nickname: 'Dizya', phone: '+62 812-8147-6276' },
        { name: 'Elvano Devika Putra', nickname: 'Elvano', phone: '+62 812-9585-0096' },
        { name: 'Khalifa Adzkayra Marissa', nickname: 'Marissa', phone: '+62 877-4168-6950' },
        { name: 'Khalisa Adiba Nuha', nickname: 'Adiba', phone: '+62 813-2877-9423' },
        { name: 'Kirana Febriana Hakim', nickname: 'Kirana', phone: '+62 812-9759-7757' },
        { name: 'M. Abil Shidiq Arsalaan', nickname: 'Abil', phone: '+62 812-1172-3429' },
        { name: 'Mikhayla Putri Mahfud', nickname: 'Mikha', phone: '+62 813-8241-6552' },
        { name: 'Radeva Zehan Elfathan', nickname: 'Radeva', phone: '+62 811-9403-103' },
        { name: 'Sekar Hanun Ayudia', nickname: 'Sekar', phone: '+62 812-2595-0048' },
        { name: 'Shahia Fitri Kalita', nickname: 'Shahia', phone: '+62 858-8163-6149' },
        { name: 'Sheila Hapsari Paramita', nickname: 'Sheila', phone: '+62 822-6021-8027' },
        { name: 'Tedra Sagara Drew Permana', nickname: 'Saga', phone: '+62 877-8539-3962' },
        { name: 'Tiara Shanum Wicaksono', nickname: 'Shanum', phone: '+62 857-1663-5953' },
        { name: 'Yumna Rizqy Humaira', nickname: 'Una', phone: '+62 813-1007-5190' },
        { name: 'Zaidan Mufid', nickname: 'Zaidan', phone: '+62 813-1684-0991' },
        { name: 'Zanna Kirania Simanjuntak', nickname: 'Nia', phone: '+62 812-9076-6367' }
      ]
      
      const { error: insertError } = await supabase.from('students').insert(students)
      if (insertError) throw insertError
      
      console.log('Sample students inserted successfully!')
      
      // Insert sample transactions
      const { data: insertedStudents } = await supabase.from('students').select('id, nickname').limit(5)
      
      if (insertedStudents && insertedStudents.length > 0) {
        const sampleTransactions = [
          {
            student_id: insertedStudents[0].id,
            type: 'income',
            amount: 25000,
            description: 'Kas Bulanan Januari',
            status: 'completed',
            payment_method: 'qris'
          },
          {
            student_id: insertedStudents[1].id,
            type: 'income',
            amount: 25000,
            description: 'Kas Bulanan Januari',
            status: 'completed',
            payment_method: 'cash'
          },
          {
            student_id: insertedStudents[2].id,
            type: 'income',
            amount: 25000,
            description: 'Kas Bulanan Januari',
            status: 'completed',
            payment_method: 'qris'
          }
        ]
        
        const { error: transactionError } = await supabase.from('transactions').insert(sampleTransactions)
        if (transactionError) throw transactionError
        
        console.log('Sample transactions inserted successfully!')
      }
      
      // Insert sample expenses
      const sampleExpenses = [
        {
          category: 'perlengkapan',
          amount: 15000,
          description: 'Pembelian spidol dan kertas',
          notes: 'Untuk kegiatan belajar',
          status: 'approved',
          approved_by: 'Admin'
        },
        {
          category: 'kegiatan',
          amount: 30000,
          description: 'Snack untuk acara kelas',
          notes: 'Acara perpisahan semester',
          status: 'pending'
        }
      ]
      
      const { error: expenseError } = await supabase.from('expenses').insert(sampleExpenses)
      if (expenseError) throw expenseError
      
      console.log('Sample expenses inserted successfully!')
    }
    
    return { success: true, message: 'Database setup completed successfully!' }
    
  } catch (error) {
    console.error('Database setup error:', error)
    return { success: false, error: error.message }
  }
}

export const checkDatabaseStatus = async () => {
  const supabase = createClient(supabaseUrl, supabaseAnonKey)
  
  try {
    // Try to connect and check if tables exist
    const { data, error } = await supabase.from('students').select('count').limit(1)
    
    if (error) {
      if (error.message.includes('relation "students" does not exist')) {
        return { 
          connected: true, 
          tablesExist: false, 
          message: 'Connected to Supabase but tables do not exist. Please run the SQL schema first.' 
        }
      }
      return { 
        connected: false, 
        tablesExist: false, 
        message: `Connection error: ${error.message}` 
      }
    }
    
    return { 
      connected: true, 
      tablesExist: true, 
      message: 'Successfully connected to Supabase database!' 
    }
    
  } catch (error) {
    return { 
      connected: false, 
      tablesExist: false, 
      message: `Connection failed: ${error.message}` 
    }
  }
}
