import { format, parseISO, isSameDay } from 'date-fns'

export function generateBookingId() {
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `TBG-${timestamp}-${random}`
}

export function formatDate(dateString, formatStr = 'MMM dd, yyyy') {
  try {
    return format(parseISO(dateString), formatStr)
  } catch {
    return dateString
  }
}

export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount || 0)
}

export function formatPhoneNumber(phone) {
  const cleaned = ('' + phone).replace(/\D/g, '')
  if (cleaned.length === 10) {
    return `${cleaned.slice(0, 5)} ${cleaned.slice(5)}`
  }
  return phone
}

export function isTimeSlotConflict(date1, timeSlot1, date2, timeSlot2) {
  return date1 === date2 && timeSlot1 === timeSlot2
}

export function getPaymentStatus(advanceAmount, totalAmount) {
  if (!advanceAmount || advanceAmount === 0) return 'pending'
  if (advanceAmount >= totalAmount) return 'paid'
  return 'partial'
}

export function calculateRemainingAmount(totalAmount, advanceAmount) {
  return Math.max(0, (totalAmount || 0) - (advanceAmount || 0))
}

export function getStatusColor(status) {
  switch (status) {
    case 'paid':
      return 'badge-success'
    case 'partial':
      return 'badge-warning'
    case 'pending':
      return 'badge-danger'
    default:
      return 'badge-info'
  }
}

export function validateBookingForm(data) {
  const errors = {}

  if (!data.customerName?.trim()) {
    errors.customerName = 'Customer name is required'
  }

  if (!data.phoneNumber?.trim()) {
    errors.phoneNumber = 'Phone number is required'
  } else if (!/^\d{10}$/.test(data.phoneNumber.replace(/\D/g, ''))) {
    errors.phoneNumber = 'Please enter a valid 10-digit phone number'
  }

  if (!data.date) {
    errors.date = 'Date is required'
  }

  if (!data.timeSlot) {
    errors.timeSlot = 'Time slot is required'
  }

  if (!data.numberOfPersons || data.numberOfPersons < 1) {
    errors.numberOfPersons = 'Number of persons must be at least 1'
  }

  if (data.hasDecor && !data.decorTheme?.trim()) {
    errors.decorTheme = 'Decor theme is required when decor is selected'
  }

  if (data.advanceAmount < 0) {
    errors.advanceAmount = 'Advance amount cannot be negative'
  }

  if (data.totalAmount < 0) {
    errors.totalAmount = 'Total amount cannot be negative'
  }

  if (data.advanceAmount > data.totalAmount) {
    errors.advanceAmount = 'Advance amount cannot exceed total amount'
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

export function getTimeSlotLabel(slot) {
  const slots = {
    'morning': '9:00 AM - 12:00 PM',
    'afternoon': '12:00 PM - 3:00 PM',
    'evening': '3:00 PM - 6:00 PM',
    'night': '6:00 PM - 9:00 PM',
    'late-night': '9:00 PM - 12:00 AM'
  }
  return slots[slot] || slot
}

export function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate()
}

export function getFirstDayOfMonth(year, month) {
  return new Date(year, month, 1).getDay()
}

export function isSameDateString(date1, date2) {
  return date1 === date2
}

export function getTodayString() {
  return new Date().toISOString().split('T')[0]
}
