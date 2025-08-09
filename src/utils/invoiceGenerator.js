// Utility for generating targeted invoices for specific students
export function generateInvoiceForStudent(studentId, paymentData = null) {
  // Try to find student from multiple sources
  let student = findStudentById(studentId)
  
  if (!student) {
    console.warn(`Student with ID ${studentId} not found`)
    return null
  }
  
  // Find latest payment for this student if not provided
  if (!paymentData) {
    paymentData = findLatestPaymentForStudent(studentId)
  }
  
  const orderId = paymentData?.order_id || `KAS${Date.now()}`
  
  return {
    id: paymentData?.id || `inv_${Date.now()}`,
    invoiceNumber: `INV-${orderId.slice(-8).toUpperCase()}`,
    orderId: orderId,
    student: {
      name: student.name,
      nickname: student.nickname || '',
      phone: student.phone || student.parent_phone || ''
    },
    description: paymentData?.description || `Kas Kelas Bulan ${getCurrentMonth()}`,
    amount: paymentData?.amount || 50000,
    period: paymentData?.period || getCurrentMonth(),
    paymentMethod: paymentData?.payment_method || 'qris',
    paidAt: paymentData?.completed_at || paymentData?.paid_at || new Date().toISOString(),
    createdAt: paymentData?.created_at || new Date().toISOString(),
    reference: paymentData?.reference || orderId.slice(-8).toUpperCase(),
    status: 'completed'
  }
}

export function findStudentById(studentId) {
  // Check main students collection
  const studentsData = localStorage.getItem('students')
  if (studentsData) {
    const students = JSON.parse(studentsData)
    const student = students.find(s => s.id === studentId)
    if (student) return student
  }
  
  // Check demo students
  const demoData = localStorage.getItem('demo_students')
  if (demoData) {
    const demoStudents = JSON.parse(demoData)
    const student = demoStudents.find(s => s.id === studentId)
    if (student) return student
  }
  
  return null
}

export function findLatestPaymentForStudent(studentId) {
  let latestPayment = null
  
  // Check payment links
  const paymentLinksData = localStorage.getItem('paymentLinks')
  if (paymentLinksData) {
    const paymentLinks = JSON.parse(paymentLinksData)
    const studentPayments = paymentLinks.filter(p => p.student_id === studentId)
    if (studentPayments.length > 0) {
      latestPayment = studentPayments.sort((a, b) => 
        new Date(b.created_at || b.completed_at || 0) - new Date(a.created_at || a.completed_at || 0)
      )[0]
    }
  }
  
  // Check transactions if no payment link found
  if (!latestPayment) {
    const transactionsData = localStorage.getItem('transactions')
    if (transactionsData) {
      const transactions = JSON.parse(transactionsData)
      const studentTransactions = transactions.filter(t => t.student_id === studentId)
      if (studentTransactions.length > 0) {
        latestPayment = studentTransactions.sort((a, b) => 
          new Date(b.created_at || 0) - new Date(a.created_at || 0)
        )[0]
      }
    }
  }
  
  return latestPayment
}

export function getAllStudentsWithPaymentStatus() {
  const allStudents = []
  
  // Get regular students
  const studentsData = localStorage.getItem('students')
  if (studentsData) {
    const students = JSON.parse(studentsData)
    allStudents.push(...students)
  }
  
  // Get demo students
  const demoData = localStorage.getItem('demo_students')
  if (demoData) {
    const demoStudents = JSON.parse(demoData)
    allStudents.push(...demoStudents)
  }
  
  // Add payment status to each student
  return allStudents.map(student => {
    const latestPayment = findLatestPaymentForStudent(student.id)
    return {
      ...student,
      hasPayment: !!latestPayment,
      latestPayment: latestPayment,
      totalPayments: countStudentPayments(student.id)
    }
  })
}

export function countStudentPayments(studentId) {
  let count = 0
  
  // Count payment links
  const paymentLinksData = localStorage.getItem('paymentLinks')
  if (paymentLinksData) {
    const paymentLinks = JSON.parse(paymentLinksData)
    count += paymentLinks.filter(p => p.student_id === studentId).length
  }
  
  // Count transactions
  const transactionsData = localStorage.getItem('transactions')
  if (transactionsData) {
    const transactions = JSON.parse(transactionsData)
    count += transactions.filter(t => t.student_id === studentId).length
  }
  
  return count
}

function getCurrentMonth() {
  return new Date().toLocaleDateString('id-ID', {
    month: 'long',
    year: 'numeric'
  })
}

// Generate invoice URL for a specific student
export function generateInvoiceUrl(studentId, orderId = null) {
  const baseUrl = window.location.origin + window.location.pathname.replace('/invoice', '')
  if (orderId) {
    return `${baseUrl}/invoice?orderId=${orderId}`
  } else {
    return `${baseUrl}/invoice?studentId=${studentId}`
  }
}

// Generate shareable invoice link with student name
export function generateShareableInvoiceText(invoice) {
  return `📄 *Invoice Kas Kelas SD Islam Al Husna*

👤 *Siswa:* ${invoice.student.name} (${invoice.student.nickname})
💰 *Total:* ${formatCurrency(invoice.amount)}
📅 *Periode:* ${invoice.period}
📋 *No. Invoice:* ${invoice.invoiceNumber}
✅ *Status:* LUNAS

🔗 *Link Invoice:* ${window.location.href}

_Sistem Kas Digital Kelas 1B_
_Komplek Keuangan, Jl. Guntur I_`
}

function formatCurrency(amount) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(amount)
}
