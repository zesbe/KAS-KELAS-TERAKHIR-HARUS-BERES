// Mock data for development when Supabase is not configured

const mockStudents = []

const mockTransactions = []

const mockExpenses = []

const mockPaymentLinks = []



// Mock API responses
export const mockDb = {
  getStudents: () => Promise.resolve({ data: mockStudents, error: null }),
  addStudent: (student) => {
    const newStudent = { 
      ...student, 
      id: String(mockStudents.length + 1), 
      created_at: new Date().toISOString() 
    }
    mockStudents.push(newStudent)
    return Promise.resolve({ data: [newStudent], error: null })
  },
  updateStudent: (id, updates) => {
    const index = mockStudents.findIndex(s => s.id === id)
    if (index !== -1) {
      mockStudents[index] = { ...mockStudents[index], ...updates }
      return Promise.resolve({ data: [mockStudents[index]], error: null })
    }
    return Promise.resolve({ data: null, error: { message: 'Student not found' } })
  },
  deleteStudent: (id) => {
    const index = mockStudents.findIndex(s => s.id === id)
    if (index !== -1) {
      const deleted = mockStudents.splice(index, 1)
      return Promise.resolve({ data: deleted, error: null })
    }
    return Promise.resolve({ data: null, error: { message: 'Student not found' } })
  },

  getTransactions: () => Promise.resolve({ data: mockTransactions, error: null }),
  addTransaction: (transaction) => {
    const newTransaction = { 
      ...transaction, 
      id: String(mockTransactions.length + 1), 
      created_at: new Date().toISOString() 
    }
    // Add student info if available
    if (transaction.student_id) {
      const student = mockStudents.find(s => s.id === transaction.student_id)
      if (student) {
        newTransaction.student = { name: student.name, nickname: student.nickname }
      }
    }
    mockTransactions.push(newTransaction)
    return Promise.resolve({ data: [newTransaction], error: null })
  },
  updateTransaction: (id, updates) => {
    const index = mockTransactions.findIndex(t => t.id === id)
    if (index !== -1) {
      mockTransactions[index] = { ...mockTransactions[index], ...updates }
      return Promise.resolve({ data: [mockTransactions[index]], error: null })
    }
    return Promise.resolve({ data: null, error: { message: 'Transaction not found' } })
  },

  getExpenses: () => Promise.resolve({ data: mockExpenses, error: null }),
  addExpense: (expense) => {
    const newExpense = { 
      ...expense, 
      id: String(mockExpenses.length + 1), 
      created_at: new Date().toISOString() 
    }
    mockExpenses.push(newExpense)
    return Promise.resolve({ data: [newExpense], error: null })
  },
  updateExpense: (id, updates) => {
    const index = mockExpenses.findIndex(e => e.id === id)
    if (index !== -1) {
      mockExpenses[index] = { ...mockExpenses[index], ...updates }
      return Promise.resolve({ data: [mockExpenses[index]], error: null })
    }
    return Promise.resolve({ data: null, error: { message: 'Expense not found' } })
  },
  deleteExpense: (id) => {
    const index = mockExpenses.findIndex(e => e.id === id)
    if (index !== -1) {
      const deleted = mockExpenses.splice(index, 1)
      return Promise.resolve({ data: deleted, error: null })
    }
    return Promise.resolve({ data: null, error: { message: 'Expense not found' } })
  },

  getPaymentLinks: () => Promise.resolve({ data: mockPaymentLinks, error: null }),
  addPaymentLink: (link) => {
    const newLink = { 
      ...link, 
      id: String(mockPaymentLinks.length + 1), 
      created_at: new Date().toISOString() 
    }
    // Add student info if available
    if (link.student_id) {
      const student = mockStudents.find(s => s.id === link.student_id)
      if (student) {
        newLink.student = { name: student.name, nickname: student.nickname, phone: student.phone }
      }
    }
    mockPaymentLinks.push(newLink)
    return Promise.resolve({ data: [newLink], error: null })
  },
  updatePaymentLink: (id, updates) => {
    const index = mockPaymentLinks.findIndex(p => p.id === id)
    if (index !== -1) {
      mockPaymentLinks[index] = { ...mockPaymentLinks[index], ...updates }
      return Promise.resolve({ data: [mockPaymentLinks[index]], error: null })
    }
    return Promise.resolve({ data: null, error: { message: 'Payment link not found' } })
  },
  deletePaymentLink: (id) => {
    const index = mockPaymentLinks.findIndex(p => p.id === id)
    if (index !== -1) {
      const deleted = mockPaymentLinks.splice(index, 1)
      return Promise.resolve({ data: deleted, error: null })
    }
    return Promise.resolve({ data: null, error: { message: 'Payment link not found' } })
  },

  // Mock campaigns data
  mockCampaigns: [],

  getCampaigns: () => {
    return Promise.resolve({ data: mockDb.mockCampaigns, error: null })
  },

  addCampaign: (campaign) => {
    const newCampaign = {
      ...campaign,
      id: campaign.id || String(mockDb.mockCampaigns.length + 1),
      created_at: new Date().toISOString()
    }
    mockDb.mockCampaigns.push(newCampaign)
    return Promise.resolve({ data: newCampaign, error: null })
  },

  updateCampaign: (id, updates) => {
    const index = mockDb.mockCampaigns.findIndex(c => c.id === id)
    if (index !== -1) {
      mockDb.mockCampaigns[index] = { ...mockDb.mockCampaigns[index], ...updates }
      return Promise.resolve({ data: mockDb.mockCampaigns[index], error: null })
    }
    return Promise.resolve({ data: null, error: { message: 'Campaign not found' } })
  },

  deleteCampaign: (id) => {
    const index = mockDb.mockCampaigns.findIndex(c => c.id === id)
    if (index !== -1) {
      const deleted = mockDb.mockCampaigns.splice(index, 1)
      return Promise.resolve({ data: deleted, error: null })
    }
    return Promise.resolve({ data: null, error: { message: 'Campaign not found' } })
  },

  // Mock webhook logs
  mockWebhookLogs: [],

  addWebhookLog: (log) => {
    const newLog = {
      ...log,
      id: log.id || String(mockDb.mockWebhookLogs.length + 1),
      created_at: new Date().toISOString()
    }
    mockDb.mockWebhookLogs.push(newLog)
    return Promise.resolve({ data: [newLog], error: null })
  }
}
