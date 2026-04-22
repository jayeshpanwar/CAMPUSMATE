import * as XLSX from 'xlsx'
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import { formatDate, formatCurrency, getTimeSlotLabel } from './helpers'

export function exportToExcel(bookings, filename = 'bookings') {
  const data = bookings.map(booking => ({
    'Booking ID': booking.id,
    'Customer Name': booking.customerName,
    'Phone Number': booking.phoneNumber,
    'Date': formatDate(booking.date, 'dd/MM/yyyy'),
    'Time Slot': getTimeSlotLabel(booking.timeSlot),
    'Persons': booking.numberOfPersons,
    'Decor': booking.hasDecor ? 'Yes' : 'No',
    'Decor Theme': booking.decorTheme || '-',
    'Add-ons': booking.addons?.join(', ') || '-',
    'Total Amount': booking.totalAmount,
    'Advance Paid': booking.advanceAmount,
    'Remaining': booking.totalAmount - booking.advanceAmount,
    'Payment Status': booking.paymentStatus?.charAt(0).toUpperCase() + booking.paymentStatus?.slice(1),
    'Notes': booking.notes || '-',
    'Created': formatDate(booking.createdAt, 'dd/MM/yyyy HH:mm')
  }))

  const ws = XLSX.utils.json_to_sheet(data)

  const colWidths = [
    { wch: 18 },
    { wch: 20 },
    { wch: 15 },
    { wch: 12 },
    { wch: 20 },
    { wch: 8 },
    { wch: 6 },
    { wch: 15 },
    { wch: 25 },
    { wch: 12 },
    { wch: 12 },
    { wch: 12 },
    { wch: 12 },
    { wch: 30 },
    { wch: 18 }
  ]
  ws['!cols'] = colWidths

  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Bookings')

  const dateStr = new Date().toISOString().split('T')[0]
  XLSX.writeFile(wb, `${filename}_${dateStr}.xlsx`)
}

export function exportToPDF(bookings, filename = 'bookings') {
  const doc = new jsPDF('l', 'mm', 'a4')

  doc.setFontSize(20)
  doc.setTextColor(169, 70, 239)
  doc.text('TheatreByGamex', 14, 20)

  doc.setFontSize(12)
  doc.setTextColor(100, 100, 100)
  doc.text('Booking Report', 14, 28)

  doc.setFontSize(10)
  doc.text(`Generated: ${formatDate(new Date().toISOString(), 'dd MMMM yyyy, HH:mm')}`, 14, 35)
  doc.text(`Total Bookings: ${bookings.length}`, 14, 41)

  const tableData = bookings.map(booking => [
    booking.id,
    booking.customerName,
    booking.phoneNumber,
    formatDate(booking.date, 'dd/MM/yy'),
    getTimeSlotLabel(booking.timeSlot),
    booking.numberOfPersons,
    booking.hasDecor ? 'Yes' : 'No',
    formatCurrency(booking.totalAmount),
    formatCurrency(booking.advanceAmount),
    booking.paymentStatus?.charAt(0).toUpperCase() + booking.paymentStatus?.slice(1)
  ])

  autoTable(doc, {
    startY: 48,
    head: [[
      'Booking ID',
      'Customer',
      'Phone',
      'Date',
      'Time Slot',
      'Persons',
      'Decor',
      'Total',
      'Advance',
      'Status'
    ]],
    body: tableData,
    styles: {
      fontSize: 8,
      cellPadding: 3
    },
    headStyles: {
      fillColor: [169, 70, 239],
      textColor: 255,
      fontStyle: 'bold'
    },
    alternateRowStyles: {
      fillColor: [250, 245, 255]
    },
    columnStyles: {
      0: { cellWidth: 28 },
      1: { cellWidth: 30 },
      2: { cellWidth: 25 },
      3: { cellWidth: 20 },
      4: { cellWidth: 35 },
      5: { cellWidth: 15 },
      6: { cellWidth: 15 },
      7: { cellWidth: 22 },
      8: { cellWidth: 22 },
      9: { cellWidth: 18 }
    }
  })

  const totalRevenue = bookings.reduce((sum, b) => sum + (b.advanceAmount || 0), 0)
  const totalExpected = bookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0)
  const pending = totalExpected - totalRevenue

  const finalY = doc.lastAutoTable.finalY + 10
  doc.setFontSize(10)
  doc.setTextColor(60, 60, 60)
  doc.text(`Summary:`, 14, finalY)
  doc.text(`Total Expected: ${formatCurrency(totalExpected)}`, 14, finalY + 6)
  doc.text(`Total Collected: ${formatCurrency(totalRevenue)}`, 14, finalY + 12)
  doc.text(`Pending: ${formatCurrency(pending)}`, 14, finalY + 18)

  const dateStr = new Date().toISOString().split('T')[0]
  doc.save(`${filename}_${dateStr}.pdf`)
}
