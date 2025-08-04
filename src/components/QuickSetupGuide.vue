<template>
  <div class="bg-white rounded-lg border border-gray-200 p-6">
    <h3 class="text-lg font-semibold text-gray-900 mb-4">Quick Database Setup</h3>
    
    <div class="space-y-4">
      <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p class="text-sm text-yellow-800">
          <strong>Issue:</strong> Database tables don't exist yet. This is causing the "[object Object]" errors.
        </p>
      </div>
      
      <div class="space-y-3">
        <h4 class="font-medium text-gray-900">Option 1: Quick Auto Setup</h4>
        <ol class="text-sm text-gray-600 space-y-1 ml-4 list-decimal">
          <li>Go to Settings page</li>
          <li>Find "Database Setup" section</li>
          <li>Click "Check Database Status"</li>
          <li>Click "Quick Setup (Auto)"</li>
        </ol>
      </div>
      
      <div class="space-y-3">
        <h4 class="font-medium text-gray-900">Option 2: Manual Setup</h4>
        <ol class="text-sm text-gray-600 space-y-1 ml-4 list-decimal">
          <li>Go to your <a href="https://app.supabase.com" target="_blank" class="text-blue-600 underline">Supabase Dashboard</a></li>
          <li>Click on "SQL Editor" in the sidebar</li>
          <li>Click "New query"</li>
          <li>Copy and paste this SQL:</li>
        </ol>
        
        <div class="bg-gray-50 rounded-lg p-3 mt-2">
          <pre class="text-xs text-gray-800 overflow-x-auto">{{ quickSQL }}</pre>
        </div>
        
        <button @click="copySQL" class="btn-secondary text-sm">
          Copy SQL to Clipboard
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useToast } from 'vue-toastification'

const toast = useToast()

const quickSQL = `-- Quick setup for Kas Kelas tables
CREATE TABLE IF NOT EXISTS students (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  nickname VARCHAR(100) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES students(id),
  type VARCHAR(20) DEFAULT 'income',
  amount INTEGER NOT NULL,
  description TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'completed',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS expenses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category VARCHAR(50) NOT NULL,
  amount INTEGER NOT NULL,
  description TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS payment_links (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES students(id),
  order_id VARCHAR(100) UNIQUE NOT NULL,
  payment_url TEXT NOT NULL,
  amount INTEGER NOT NULL,
  description TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS campaigns (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  target VARCHAR(20) NOT NULL,
  status VARCHAR(20) DEFAULT 'draft',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert sample students
INSERT INTO students (name, nickname, phone) VALUES
('Aqilnafi Segara', 'Nafi', '+62 856-2468-7313'),
('Arkaan Jawara Bayanaka', 'Arkaan', '+62 821-1475-9339'),
('Athafariz Zehan Sasongko', 'Atha', '+62 812-9670-7505');`

const copySQL = () => {
  navigator.clipboard.writeText(quickSQL).then(() => {
    toast.success('SQL copied! Paste it in Supabase SQL Editor and run it.')
  }).catch(() => {
    toast.error('Failed to copy. Please select and copy the SQL manually.')
  })
}
</script>
