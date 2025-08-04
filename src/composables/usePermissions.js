import { computed, ref } from 'vue'

// Current user state (in real app, this would come from auth store)
const currentUser = ref({
  id: '1',
  name: 'Yudi Haryanto',
  email: 'yudi@alhusna.edu',
  role: 'admin',
  status: 'active'
})

// Role definitions with permissions
const rolePermissions = {
  admin: [
    'create', 'read', 'update', 'delete',
    'manage_users', 'manage_settings', 'export_data',
    'manage_transactions', 'manage_expenses', 'manage_students',
    'view_reports', 'export_reports', 'view_all'
  ],
  bendahara: [
    'create', 'read', 'update', 'delete',
    'manage_transactions', 'manage_expenses',
    'view_reports', 'export_reports'
  ],
  ketua_kelas: [
    'create', 'read', 'update',
    'manage_students', 'view_reports'
  ],
  wali_kelas: [
    'read', 'view_all', 'view_reports', 'export_reports'
  ],
  viewer: [
    'read', 'view_basic'
  ]
}

// Page access permissions
const pagePermissions = {
  dashboard: ['read'],
  students: ['manage_students', 'view_all', 'admin'],
  transactions: ['manage_transactions', 'view_all', 'admin'],
  payments: ['manage_transactions', 'view_all', 'admin'],
  expenses: ['manage_expenses', 'view_all', 'admin'],
  reports: ['view_reports', 'view_all', 'admin'],
  settings: ['manage_settings', 'admin']
}

export function usePermissions() {
  // Get current user permissions
  const userPermissions = computed(() => {
    return rolePermissions[currentUser.value.role] || []
  })

  // Check if user has specific permission
  const hasPermission = (permission) => {
    return userPermissions.value.includes(permission) || currentUser.value.role === 'admin'
  }

  // Check if user has any of the permissions
  const hasAnyPermission = (permissions) => {
    return permissions.some(permission => hasPermission(permission))
  }

  // Check if user can access a page
  const canAccessPage = (pageName) => {
    const requiredPermissions = pagePermissions[pageName] || ['read']
    return hasAnyPermission(requiredPermissions)
  }

  // Check if user can perform action on specific module
  const canPerformAction = (module, action) => {
    const permission = `${action}_${module}`
    return hasPermission(permission) || hasPermission(action) || hasPermission('view_all')
  }

  // Get user role info
  const getUserRole = () => {
    return {
      id: currentUser.value.role,
      permissions: userPermissions.value,
      isAdmin: currentUser.value.role === 'admin',
      isBendahara: currentUser.value.role === 'bendahara',
      isKetuaKelas: currentUser.value.role === 'ketua_kelas',
      isWaliKelas: currentUser.value.role === 'wali_kelas',
      isViewer: currentUser.value.role === 'viewer'
    }
  }

  // Update current user (for auth integration)
  const setCurrentUser = (user) => {
    currentUser.value = user
  }

  // Get filtered navigation items based on permissions
  const getFilteredNavigation = (navigationItems) => {
    return navigationItems.filter(item => {
      if (!item.requiresPermission) return true
      return canAccessPage(item.requiresPermission)
    })
  }

  // Check if user can edit/delete based on ownership and role
  const canModifyItem = (item, requiredPermission = 'update') => {
    // Admin can modify anything
    if (currentUser.value.role === 'admin') return true
    
    // Check if user has the required permission
    if (!hasPermission(requiredPermission)) return false
    
    // If item has owner, check ownership
    if (item.created_by) {
      return item.created_by === currentUser.value.id
    }
    
    return true
  }

  // Get role-based restrictions for UI elements
  const getUIRestrictions = () => {
    const role = currentUser.value.role
    
    return {
      canCreateStudents: hasPermission('manage_students'),
      canEditStudents: hasPermission('manage_students'),
      canDeleteStudents: hasPermission('manage_students') && role === 'admin',
      canCreateTransactions: hasPermission('manage_transactions'),
      canEditTransactions: hasPermission('manage_transactions'),
      canDeleteTransactions: hasPermission('manage_transactions') && ['admin', 'bendahara'].includes(role),
      canCreateExpenses: hasPermission('manage_expenses'),
      canEditExpenses: hasPermission('manage_expenses'),
      canDeleteExpenses: hasPermission('manage_expenses'),
      canManageUsers: hasPermission('manage_users'),
      canChangeSettings: hasPermission('manage_settings'),
      canExportData: hasPermission('export_data') || hasPermission('export_reports'),
      canViewAllReports: hasPermission('view_all') || hasPermission('view_reports'),
      canCreatePaymentLinks: hasPermission('manage_transactions'),
      canDeletePaymentLinks: hasPermission('manage_transactions') && ['admin', 'bendahara'].includes(role)
    }
  }

  // Get role display information
  const getRoleDisplayInfo = (roleId) => {
    const roleInfo = {
      admin: {
        name: 'Administrator',
        color: 'purple',
        description: 'Akses penuh ke semua fitur'
      },
      bendahara: {
        name: 'Bendahara',
        color: 'green',
        description: 'Mengelola keuangan dan transaksi'
      },
      ketua_kelas: {
        name: 'Ketua Kelas',
        color: 'blue',
        description: 'Mengelola data siswa'
      },
      wali_kelas: {
        name: 'Wali Kelas',
        color: 'yellow',
        description: 'Monitoring dan supervisi'
      },
      viewer: {
        name: 'Viewer',
        color: 'gray',
        description: 'Hanya dapat melihat data'
      }
    }
    
    return roleInfo[roleId] || roleInfo.viewer
  }

  return {
    currentUser,
    userPermissions,
    hasPermission,
    hasAnyPermission,
    canAccessPage,
    canPerformAction,
    canModifyItem,
    getUserRole,
    setCurrentUser,
    getFilteredNavigation,
    getUIRestrictions,
    getRoleDisplayInfo,
    rolePermissions
  }
}
