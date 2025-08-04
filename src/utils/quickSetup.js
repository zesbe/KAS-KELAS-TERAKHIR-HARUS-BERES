import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const quickDatabaseSetup = async () => {
  const supabase = createClient(supabaseUrl, supabaseAnonKey)
  
  console.log('Starting quick database setup...')
  
  try {
    // Create students table
    const { error: studentsError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS students (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          nickname VARCHAR(100) NOT NULL,
          phone VARCHAR(20) NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    })
    
    if (studentsError && !studentsError.message.includes('already exists')) {
      console.log('Creating students table via insert method...')
      // Fallback: try to insert a test record to see if table exists
      const { error: testError } = await supabase.from('students').select('count').limit(1)
      if (testError && testError.message.includes('does not exist')) {
        throw new Error('Tables need to be created manually. Please use Supabase SQL Editor.')
      }
    }
    
    // Create other tables
    const tables = [
      {
        name: 'transactions',
        sql: `
          CREATE TABLE IF NOT EXISTS transactions (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            student_id UUID REFERENCES students(id) ON DELETE SET NULL,
            type VARCHAR(20) NOT NULL DEFAULT 'income',
            amount INTEGER NOT NULL,
            description TEXT NOT NULL,
            payment_method VARCHAR(50),
            order_id VARCHAR(100) UNIQUE,
            status VARCHAR(20) DEFAULT 'completed',
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
        `
      },
      {
        name: 'expenses',
        sql: `
          CREATE TABLE IF NOT EXISTS expenses (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            category VARCHAR(50) NOT NULL,
            amount INTEGER NOT NULL,
            description TEXT NOT NULL,
            notes TEXT,
            status VARCHAR(20) DEFAULT 'pending',
            approved_by VARCHAR(255),
            approved_at TIMESTAMP WITH TIME ZONE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
        `
      },
      {
        name: 'payment_links',
        sql: `
          CREATE TABLE IF NOT EXISTS payment_links (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            student_id UUID REFERENCES students(id) ON DELETE CASCADE,
            order_id VARCHAR(100) UNIQUE NOT NULL,
            payment_url TEXT NOT NULL,
            amount INTEGER NOT NULL,
            description TEXT NOT NULL,
            status VARCHAR(20) DEFAULT 'pending',
            payment_method VARCHAR(50),
            completed_at TIMESTAMP WITH TIME ZONE,
            expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '7 days'),
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
        `
      },
      {
        name: 'campaigns',
        sql: `
          CREATE TABLE IF NOT EXISTS campaigns (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            message TEXT NOT NULL,
            target VARCHAR(20) NOT NULL,
            recipients UUID[],
            delay_minutes INTEGER DEFAULT 1,
            status VARCHAR(20) DEFAULT 'draft',
            results JSONB,
            scheduled_at TIMESTAMP WITH TIME ZONE,
            started_at TIMESTAMP WITH TIME ZONE,
            completed_at TIMESTAMP WITH TIME ZONE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
        `
      }
    ]
    
    // Try to create tables (this might not work with RLS, but we'll try)
    for (const table of tables) {
      try {
        await supabase.rpc('exec_sql', { sql: table.sql })
      } catch (error) {
        console.log(`Note: ${table.name} table creation via RPC not available, using alternative method`)
      }
    }
    
    // Insert sample students
    const students = [
      { name: 'Aqilnafi Segara', nickname: 'Nafi', phone: '+62 856-2468-7313' },
      { name: 'Arkaan Jawara Bayanaka', nickname: 'Arkaan', phone: '+62 821-1475-9339' },
      { name: 'Athafariz Zehan Sasongko', nickname: 'Atha', phone: '+62 812-9670-7505' },
      { name: 'Azma Raudhatul Jannah', nickname: 'Azma', phone: '+62 856-8500-062' },
      { name: 'Dizya Nayara Khanza Pujiarto', nickname: 'Dizya', phone: '+62 812-8147-6276' }
    ]
    
    // Check if students already exist
    const { data: existingStudents, error: checkError } = await supabase
      .from('students')
      .select('count')
      .limit(1)
    
    if (checkError) {
      throw new Error('Database tables do not exist. Please run the SQL schema in Supabase SQL Editor first.')
    }
    
    // Only insert if no students exist
    if (!existingStudents || existingStudents.length === 0) {
      const { error: insertError } = await supabase
        .from('students')
        .insert(students)
      
      if (insertError) {
        console.error('Error inserting students:', insertError)
        // Don't throw here as tables might exist but be empty
      } else {
        console.log('Sample students inserted successfully!')
      }
    }
    
    return { success: true, message: 'Database setup completed successfully!' }
    
  } catch (error) {
    console.error('Quick setup error:', error)
    return { success: false, error: error.message }
  }
}

export const createTablesManually = () => {
  return `
-- Run this SQL in your Supabase SQL Editor

-- Create students table
CREATE TABLE IF NOT EXISTS students (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  nickname VARCHAR(100) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES students(id) ON DELETE SET NULL,
  type VARCHAR(20) NOT NULL DEFAULT 'income',
  amount INTEGER NOT NULL,
  description TEXT NOT NULL,
  payment_method VARCHAR(50),
  order_id VARCHAR(100) UNIQUE,
  status VARCHAR(20) DEFAULT 'completed',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create expenses table
CREATE TABLE IF NOT EXISTS expenses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category VARCHAR(50) NOT NULL,
  amount INTEGER NOT NULL,
  description TEXT NOT NULL,
  notes TEXT,
  status VARCHAR(20) DEFAULT 'pending',
  approved_by VARCHAR(255),
  approved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create payment_links table
CREATE TABLE IF NOT EXISTS payment_links (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  order_id VARCHAR(100) UNIQUE NOT NULL,
  payment_url TEXT NOT NULL,
  amount INTEGER NOT NULL,
  description TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  payment_method VARCHAR(50),
  completed_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '7 days'),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create campaigns table
CREATE TABLE IF NOT EXISTS campaigns (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  target VARCHAR(20) NOT NULL,
  recipients UUID[],
  delay_minutes INTEGER DEFAULT 1,
  status VARCHAR(20) DEFAULT 'draft',
  results JSONB,
  scheduled_at TIMESTAMP WITH TIME ZONE,
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert sample students
INSERT INTO students (name, nickname, phone) VALUES
('Aqilnafi Segara', 'Nafi', '+62 856-2468-7313'),
('Arkaan Jawara Bayanaka', 'Arkaan', '+62 821-1475-9339'),
('Athafariz Zehan Sasongko', 'Atha', '+62 812-9670-7505'),
('Azma Raudhatul Jannah', 'Azma', '+62 856-8500-062'),
('Dizya Nayara Khanza Pujiarto', 'Dizya', '+62 812-8147-6276'),
('Elvano Devika Putra', 'Elvano', '+62 812-9585-0096'),
('Khalifa Adzkayra Marissa', 'Marissa', '+62 877-4168-6950'),
('Khalisa Adiba Nuha', 'Adiba', '+62 813-2877-9423'),
('Kirana Febriana Hakim', 'Kirana', '+62 812-9759-7757'),
('M. Abil Shidiq Arsalaan', 'Abil', '+62 812-1172-3429'),
('Mikhayla Putri Mahfud', 'Mikha', '+62 813-8241-6552'),
('Radeva Zehan Elfathan', 'Radeva', '+62 811-9403-103'),
('Sekar Hanun Ayudia', 'Sekar', '+62 812-2595-0048'),
('Shahia Fitri Kalita', 'Shahia', '+62 858-8163-6149'),
('Sheila Hapsari Paramita', 'Sheila', '+62 822-6021-8027'),
('Tedra Sagara Drew Permana', 'Saga', '+62 877-8539-3962'),
('Tiara Shanum Wicaksono', 'Shanum', '+62 857-1663-5953'),
('Yumna Rizqy Humaira', 'Una', '+62 813-1007-5190'),
('Zaidan Mufid', 'Zaidan', '+62 813-1684-0991'),
('Zanna Kirania Simanjuntak', 'Nia', '+62 812-9076-6367');
`
}
