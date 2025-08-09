import { format } from 'date-fns'
import { id } from 'date-fns/locale'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'

// Ensure xlsx is properly loaded for production builds
if (typeof window !== 'undefined' && !window.XLSX) {
  window.XLSX = XLSX
}

class ExportService {
  constructor() {
    this.className = 'Kelas 1B SD Islam Al Husna'
    this.academicYear = '2025/2026'
  }

  // Format currency for export
  formatCurrency(amount) {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  // Format date for export
  formatDate(dateString) {
    return format(new Date(dateString), 'dd/MM/yyyy HH:mm', { locale: id })
  }

  // Download CSV utility
  downloadCSV(headers, data, filename) {
    const csvContent = [
      headers.join(','),
      ...data.map(row => 
        row.map(field => {
          const fieldStr = field?.toString() || ''
          return `"${fieldStr.replace(/"/g, '""')}"`
        }).join(',')
      )
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `${filename}.csv`
    link.click()
  }

  // Download JSON utility
  downloadJSON(content, filename) {
    const blob = new Blob([content], { type: 'application/json' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `${filename}.json`
    link.click()
  }

  // Download Excel utility
  downloadExcel(worksheets, filename) {
    const wb = XLSX.utils.book_new()

    worksheets.forEach(({ name, data, headers }) => {
      let wsData = []

      // Add headers if provided
      if (headers) {
        wsData.push(headers)
      }

      // Add data
      wsData = wsData.concat(data)

      const ws = XLSX.utils.aoa_to_sheet(wsData)

      // Auto-size columns
      const range = XLSX.utils.decode_range(ws['!ref'])
      const colWidths = []

      for (let C = range.s.c; C <= range.e.c; ++C) {
        let maxWidth = 10
        for (let R = range.s.r; R <= range.e.r; ++R) {
          const cellAddress = XLSX.utils.encode_cell({ r: R, c: C })
          const cell = ws[cellAddress]
          if (cell && cell.v) {
            const cellLength = cell.v.toString().length
            if (cellLength > maxWidth) {
              maxWidth = Math.min(cellLength, 50) // Max width 50
            }
          }
        }
        colWidths.push({ width: maxWidth })
      }

      ws['!cols'] = colWidths
      XLSX.utils.book_append_sheet(wb, ws, name)
    })

    XLSX.writeFile(wb, `${filename}.xlsx`)
  }

  // Export students data
  exportStudents(students) {
    const headers = ['No', 'Nama Lengkap', 'Nama Panggilan', 'No. HP Orang Tua', 'Tanggal Input']
    const data = students.map((student, index) => [
      index + 1,
      student.name,
      student.nickname,
      student.phone,
      this.formatDate(student.created_at || new Date().toISOString())
    ])

    const timestamp = new Date().toISOString().slice(0, 10)
    this.downloadCSV(headers, data, `data_siswa_${this.className.replace(/\s+/g, '_')}_${timestamp}`)
  }

  // Export transactions
  exportTransactions(transactions, students) {
    const headers = [
      'Tanggal',
      'Nama Siswa',
      'Nama Panggilan', 
      'Keterangan',
      'Jumlah (IDR)',
      'Status',
      'Metode Pembayaran',
      'Order ID'
    ]

    const data = transactions.map(transaction => {
      const student = students.find(s => s.id === transaction.student_id)
      return [
        this.formatDate(transaction.created_at),
        student?.name || '',
        student?.nickname || '',
        transaction.description,
        transaction.amount,
        transaction.status === 'completed' ? 'Selesai' : 'Pending',
        transaction.payment_method || 'Manual',
        transaction.order_id || ''
      ]
    })

    const timestamp = new Date().toISOString().slice(0, 10)
    this.downloadCSV(headers, data, `transaksi_kas_${timestamp}`)
  }

  // Export expenses with detailed information
  exportExpenses(expenses) {
    const headers = [
      'Tanggal',
      'Kategori',
      'Keterangan',
      'Catatan',
      'Jumlah (IDR)',
      'Status',
      'Disetujui Oleh',
      'Tanggal Disetujui'
    ]

    const categoryLabels = {
      kegiatan: 'Kegiatan Kelas',
      perlengkapan: 'Perlengkapan',
      konsumsi: 'Konsumsi',
      transport: 'Transport',
      lainnya: 'Lainnya'
    }

    const statusLabels = {
      pending: 'Menunggu Persetujuan',
      approved: 'Disetujui',
      rejected: 'Ditolak'
    }

    const data = expenses.map(expense => [
      this.formatDate(expense.created_at),
      categoryLabels[expense.category] || expense.category,
      expense.description,
      expense.notes || '',
      expense.amount,
      statusLabels[expense.status] || expense.status,
      expense.approved_by || '',
      expense.approved_at ? this.formatDate(expense.approved_at) : ''
    ])

    const timestamp = new Date().toISOString().slice(0, 10)
    this.downloadCSV(headers, data, `pengeluaran_kas_${timestamp}`)
  }

  // Export comprehensive financial report
  exportComprehensiveReport(reportData, period) {
    const headers = ['Kategori', 'Keterangan', 'Nilai', 'Unit', 'Persentase']

    // Calculate percentages
    const totalStudents = reportData.paidStudents.length + reportData.unpaidStudents.length
    const paidPercentage = totalStudents > 0 ? Math.round((reportData.paidStudents.length / totalStudents) * 100) : 0

    const data = [
      ['=== INFORMASI UMUM ===', '', '', '', ''],
      ['Kelas', this.className, '', '', ''],
      ['Tahun Ajaran', this.academicYear, '', '', ''],
      ['Periode Laporan', period.from + ' s/d ' + period.to, '', '', ''],
      ['Tanggal Export', this.formatDate(new Date().toISOString()), '', '', ''],
      ['', '', '', '', ''],

      ['=== RINGKASAN KEUANGAN ===', '', '', '', ''],
      ['Total Pemasukan', this.formatCurrency(reportData.totalIncome), reportData.totalIncome, 'IDR', '100%'],
      ['Total Pengeluaran', this.formatCurrency(reportData.totalExpenses), reportData.totalExpenses, 'IDR', Math.round((reportData.totalExpenses / reportData.totalIncome) * 100) + '%'],
      ['Saldo Akhir', this.formatCurrency(reportData.balance), reportData.balance, 'IDR', reportData.balance >= 0 ? 'Surplus' : 'Defisit'],
      ['', '', '', '', ''],

      ['=== STATUS PEMBAYARAN ===', '', '', '', ''],
      ['Total Siswa', totalStudents, totalStudents, 'Orang', '100%'],
      ['Siswa Sudah Bayar', reportData.paidStudents.length, reportData.paidStudents.length, 'Orang', paidPercentage + '%'],
      ['Siswa Belum Bayar', reportData.unpaidStudents.length, reportData.unpaidStudents.length, 'Orang', (100 - paidPercentage) + '%'],
      ['', '', '', '', ''],

      ['=== DETAIL SISWA SUDAH BAYAR ===', '', '', '', ''],
      ['Nama', 'Total Dibayar', 'Status', '', ''],
      ...reportData.paidStudents.map(student => [
        student.name + ' (' + student.nickname + ')',
        this.formatCurrency(student.totalPaid),
        'Lunas',
        student.phone,
        ''
      ]),
      ['', '', '', '', ''],

      ['=== DETAIL SISWA BELUM BAYAR ===', '', '', '', ''],
      ['Nama', 'Status', 'No. HP Orang Tua', '', ''],
      ...reportData.unpaidStudents.map(student => [
        student.name + ' (' + student.nickname + ')',
        'Belum Bayar',
        student.phone,
        '',
        ''
      ])
    ]

    const timestamp = new Date().toISOString().slice(0, 10)
    this.downloadCSV(headers, data, `laporan_lengkap_kas_${this.className.replace(/\s+/g, '_')}_${timestamp}`)
  }

  // Export payment status summary
  exportPaymentStatus(students, transactions) {
    const headers = ['No', 'Nama Siswa', 'Nama Panggilan', 'No. HP Orang Tua', 'Status Pembayaran', 'Total Dibayar', 'Tanggal Terakhir Bayar']

    // Calculate payment status for each student
    const paymentData = students.map((student, index) => {
      const studentTransactions = transactions.filter(t => 
        t.student_id === student.id && t.type === 'income' && t.status === 'completed'
      )

      const totalPaid = studentTransactions.reduce((sum, t) => sum + t.amount, 0)
      const lastPayment = studentTransactions.length > 0 ? 
        Math.max(...studentTransactions.map(t => new Date(t.created_at))) : null

      return [
        index + 1,
        student.name,
        student.nickname,
        student.phone,
        totalPaid > 0 ? 'Sudah Bayar' : 'Belum Bayar',
        totalPaid > 0 ? this.formatCurrency(totalPaid) : '-',
        lastPayment ? this.formatDate(lastPayment) : '-'
      ]
    })

    const timestamp = new Date().toISOString().slice(0, 10)
    this.downloadCSV(headers, paymentData, `status_pembayaran_${timestamp}`)
  }

  // Export expenses by category
  exportExpensesByCategory(expenses) {
    const categoryLabels = {
      kegiatan: 'Kegiatan Kelas',
      perlengkapan: 'Perlengkapan',
      konsumsi: 'Konsumsi',
      transport: 'Transport',
      lainnya: 'Lainnya'
    }

    // Group expenses by category
    const categoryTotals = {}
    const categoryDetails = {}

    expenses.filter(e => e.status === 'approved').forEach(expense => {
      const category = expense.category
      if (!categoryTotals[category]) {
        categoryTotals[category] = 0
        categoryDetails[category] = []
      }
      categoryTotals[category] += expense.amount
      categoryDetails[category].push(expense)
    })

    const headers = ['Kategori', 'Keterangan', 'Tanggal', 'Jumlah (IDR)', 'Disetujui Oleh']
    const data = []

    Object.entries(categoryTotals).forEach(([category, total]) => {
      // Add category header
      data.push([
        categoryLabels[category] || category,
        `=== TOTAL: ${this.formatCurrency(total)} ===`,
        '',
        '',
        ''
      ])

      // Add category details
      categoryDetails[category].forEach(expense => {
        data.push([
          '',
          expense.description,
          this.formatDate(expense.created_at),
          this.formatCurrency(expense.amount),
          expense.approved_by || ''
        ])
      })

      // Add spacing
      data.push(['', '', '', '', ''])
    })

    const timestamp = new Date().toISOString().slice(0, 10)
    this.downloadCSV(headers, data, `pengeluaran_per_kategori_${timestamp}`)
  }

  // Create backup file with all data
  createBackup(allData) {
    const backupData = {
      metadata: {
        class: this.className,
        academic_year: this.academicYear,
        exported_at: new Date().toISOString(),
        version: '1.0.0',
        total_students: allData.students.length,
        total_transactions: allData.transactions.length,
        total_expenses: allData.expenses.length,
        current_balance: allData.currentBalance || 0
      },
      data: allData
    }

    const jsonContent = JSON.stringify(backupData, null, 2)
    const timestamp = new Date().toISOString().slice(0, 10)
    this.downloadJSON(jsonContent, `backup_kas_${this.className.replace(/\s+/g, '_')}_${timestamp}`)
  }
}

export default new ExportService()
