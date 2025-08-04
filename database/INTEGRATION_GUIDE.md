# Panduan Integrasi Role Management Supabase

## 📋 Langkah-langkah Setup

### 1. **Jalankan SQL Script**
```bash
# Di Supabase Dashboard → SQL Editor
# Copy-paste isi dari ROLE_SETUP.sql dan jalankan
```

### 2. **Update Frontend Auth Store**
Buat file `src/stores/auth.js`:

```javascript
import { defineStore } from 'pinia'
import { supabase } from '@/lib/supabase'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    profile: null,
    loading: false
  }),

  getters: {
    isAuthenticated: (state) => !!state.user,
    userRole: (state) => state.profile?.role || 'viewer',
    isAdmin: (state) => state.profile?.role === 'admin',
    isBendahara: (state) => state.profile?.role === 'bendahara'
  },

  actions: {
    async initialize() {
      this.loading = true
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (session?.user) {
          this.user = session.user
          await this.fetchProfile()
        }
      } catch (error) {
        console.error('Auth initialization error:', error)
      } finally {
        this.loading = false
      }
    },

    async fetchProfile() {
      if (!this.user) return
      
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', this.user.id)
        .single()

      if (error) {
        console.error('Error fetching profile:', error)
        return
      }

      this.profile = data
    },

    async signIn(email, password) {
      this.loading = true
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        })

        if (error) throw error

        this.user = data.user
        await this.fetchProfile()
        return { success: true }
      } catch (error) {
        return { success: false, error: error.message }
      } finally {
        this.loading = false
      }
    },

    async signOut() {
      await supabase.auth.signOut()
      this.user = null
      this.profile = null
    },

    async updateProfile(updates) {
      if (!this.user) return

      const { error } = await supabase
        .from('user_profiles')
        .update(updates)
        .eq('id', this.user.id)

      if (!error) {
        this.profile = { ...this.profile, ...updates }
      }

      return { error }
    }
  }
})
```

### 3. **Update Permissions Composable**
Update `src/composables/usePermissions.js`:

```javascript
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'

export function usePermissions() {
  const authStore = useAuthStore()

  const hasPermission = async (permission, resource = 'all') => {
    if (!authStore.user) return false
    
    const { data } = await supabase.rpc('user_has_permission', {
      user_id: authStore.user.id,
      required_permission: permission,
      resource_name: resource
    })
    
    return data || false
  }

  const canAccessPage = (pageName) => {
    const role = authStore.userRole
    const pagePermissions = {
      dashboard: ['viewer', 'ketua_kelas', 'wali_kelas', 'bendahara', 'admin'],
      students: ['ketua_kelas', 'wali_kelas', 'admin'],
      transactions: ['bendahara', 'wali_kelas', 'admin'],
      expenses: ['bendahara', 'wali_kelas', 'admin'],
      payments: ['bendahara', 'admin'],
      reports: ['wali_kelas', 'bendahara', 'admin'],
      settings: ['admin']
    }
    
    return pagePermissions[pageName]?.includes(role) || false
  }

  return {
    hasPermission,
    canAccessPage,
    userRole: computed(() => authStore.userRole),
    isAdmin: computed(() => authStore.isAdmin)
  }
}
```

### 4. **Update Router dengan Auth Guard**
Update `src/router/index.js`:

```javascript
import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { usePermissions } from '@/composables/usePermissions'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/',
    name: 'Dashboard',
    component: () => import('@/views/Dashboard.vue'),
    meta: { requiresAuth: true, permission: 'dashboard' }
  },
  {
    path: '/students',
    name: 'Students',
    component: () => import('@/views/Students.vue'),
    meta: { requiresAuth: true, permission: 'students' }
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () => import('@/views/Settings.vue'),
    meta: { requiresAuth: true, permission: 'settings' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach(async (to) => {
  const authStore = useAuthStore()
  const permissions = usePermissions()

  // Initialize auth if not done
  if (!authStore.user && !authStore.loading) {
    await authStore.initialize()
  }

  // Check authentication
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return '/login'
  }

  // Check permissions
  if (to.meta.permission && !permissions.canAccessPage(to.meta.permission)) {
    return '/' // Redirect to dashboard if no permission
  }
})

export default router
```

## 🔧 Cara Penggunaan

### 1. **Membuat User Baru**
```javascript
// Via Supabase Auth (otomatis create profile dengan role 'viewer')
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password123',
  options: {
    data: {
      full_name: 'Nama User'
    }
  }
})
```

### 2. **Mengubah Role User (Admin Only)**
```javascript
// Di frontend (untuk admin)
const changeUserRole = async (userId, newRole) => {
  const { data, error } = await supabase.rpc('change_user_role', {
    target_user_id: userId,
    new_role: newRole
  })
  return { data, error }
}
```

### 3. **Cek Permission di Component**
```vue
<template>
  <div>
    <button v-if="canCreateStudent" @click="createStudent">
      Tambah Siswa
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { usePermissions } from '@/composables/usePermissions'

const permissions = usePermissions()
const canCreateStudent = ref(false)

onMounted(async () => {
  canCreateStudent.value = await permissions.hasPermission('create', 'students')
})
</script>
```

### 4. **Update Data dengan User Tracking**
```javascript
// Saat create/update data, tambahkan user info
const createStudent = async (studentData) => {
  const { data, error } = await supabase
    .from('students')
    .insert({
      ...studentData,
      created_by: authStore.user.id
    })
}

const updateStudent = async (id, updates) => {
  const { data, error } = await supabase
    .from('students')
    .update({
      ...updates,
      updated_by: authStore.user.id
    })
    .eq('id', id)
}
```

## 🚀 Testing

### 1. **Test Role Creation**
```sql
-- Di SQL Editor Supabase
-- Cek apakah user profiles terbuat otomatis
SELECT * FROM user_profiles;

-- Test permission function
SELECT user_has_permission(
  'user-uuid-here', 
  'read', 
  'students'
);
```

### 2. **Test di Frontend**
```javascript
// Di browser console
console.log('Current user role:', authStore.userRole)
console.log('Can access settings:', permissions.canAccessPage('settings'))
```

## 📝 Catatan Penting

1. **Supabase Auth**: User harus terdaftar melalui Supabase Auth terlebih dahulu
2. **Default Role**: User baru otomatis mendapat role 'viewer'
3. **Admin Setup**: Admin pertama harus diset manual via SQL atau Supabase Dashboard
4. **RLS**: Row Level Security melindungi data berdasarkan role
5. **Real-time**: Permissions akan ter-update real-time saat role berubah

## 🔒 Security Best Practices

1. Jangan expose user management di frontend untuk non-admin
2. Gunakan RPC functions untuk operasi sensitif
3. Validasi permissions di server-side (RLS)
4. Log user activities untuk audit trail
5. Implement proper session management
