// Mock data for development when Supabase is not configured

const mockStudents = [
  { id: '1', name: 'Aqilnafi Segara', nickname: 'Nafi', phone: '+62 856-2468-7313', created_at: '2024-01-15T08:00:00Z' },
  { id: '2', name: 'Arkaan Jawara Bayanaka', nickname: 'Arkaan', phone: '+62 821-1475-9339', created_at: '2024-01-15T08:00:00Z' },
  { id: '3', name: 'Athafariz Zehan Sasongko', nickname: 'Atha', phone: '+62 812-9670-7505', created_at: '2024-01-15T08:00:00Z' },
  { id: '4', name: 'Azma Raudhatul Jannah', nickname: 'Azma', phone: '+62 856-8500-062', created_at: '2024-01-15T08:00:00Z' },
  { id: '5', name: 'Dizya Nayara Khanza Pujiarto', nickname: 'Dizya', phone: '+62 812-8147-6276', created_at: '2024-01-15T08:00:00Z' }
]

const mockTransactions = [
  {
    id: '1',
    student_id: '1',
    type: 'income',
    amount: 50000,
    description: 'Kas Bulanan Januari',
    status: 'completed',
    payment_method: 'qris',
    created_at: '2024-01-20T10:00:00Z',
    student: { name: 'Aqilnafi Segara', nickname: 'Nafi' }
  },
  {
    id: '2',
    student_id: '2',
    type: 'income',
    amount: 50000,
    description: 'Kas Bulanan Januari',
    status: 'completed',
    payment_method: 'cash',
    created_at: '2024-01-22T09:00:00Z',
    student: { name: 'Arkaan Jawara Bayanaka', nickname: 'Arkaan' }
  },
  {
    id: '3',
    student_id: '3',
    type: 'income',
    amount: 50000,
    description: 'Kas Bulanan Januari',
    status: 'completed',
    payment_method: 'qris',
    created_at: '2024-01-25T11:00:00Z',
    student: { name: 'Athafariz Zehan Sasongko', nickname: 'Atha' }
  }
]

const mockExpenses = [
  {
    id: '1',
    category: 'perlengkapan',
    amount: 15000,
    description: 'Pembelian spidol dan kertas',
    notes: 'Untuk kegiatan belajar',
    status: 'approved',
    approved_by: 'Admin',
    approved_at: '2024-01-26T08:00:00Z',
    created_at: '2024-01-25T14:00:00Z'
  },
  {
    id: '2',
    category: 'kegiatan',
    amount: 30000,
    description: 'Snack untuk acara kelas',
    notes: 'Acara perpisahan semester',
    status: 'pending',
    created_at: '2024-01-28T10:00:00Z'
  }
]

const mockPaymentLinks = [
  {
    id: '1',
    student_id: '4',
    order_id: 'AZMA240130ABC123',
    payment_url: 'https://pakasir.zone.id/pay/uang-kas-kelas-1-ibnu-sina/50000?order_id=AZMA240130ABC123',
    amount: 50000,
    description: 'Kas Bulanan Februari',
    status: 'pending',
    created_at: '2024-01-30T08:00:00Z',
    student: { name: 'Azma Raudhatul Jannah', nickname: 'Azma', phone: '+62 856-8500-062' }
  },
  {
    id: '2',
    student_id: '5',
    order_id: 'DIZYA240130DEF456',
    payment_url: 'https://pakasir.zone.id/pay/uang-kas-kelas-1-ibnu-sina/50000?order_id=DIZYA240130DEF456',
    amount: 50000,
    description: 'Kas Bulanan Februari',
    status: 'pending',
    created_at: '2024-01-30T08:30:00Z',
    student: { name: 'Dizya Nayara Khanza Pujiarto', nickname: 'Dizya', phone: '+62 812-8147-6276' }
  }
]



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


}
