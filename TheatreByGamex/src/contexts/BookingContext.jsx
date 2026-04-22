import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { generateBookingId, isTimeSlotConflict } from '../utils/helpers'
import { INITIAL_BOOKINGS } from '../data/mockData'

const BookingContext = createContext()

const STORAGE_KEY = 'theatrebygamex-bookings'

export function BookingProvider({ children }) {
  const [bookings, setBookings] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        try {
          return JSON.parse(saved)
        } catch {
          return INITIAL_BOOKINGS
        }
      }
    }
    return INITIAL_BOOKINGS
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings))
  }, [bookings])

  const addBooking = useCallback((bookingData) => {
    const conflicts = bookings.filter(b =>
      isTimeSlotConflict(b.date, b.timeSlot, bookingData.date, bookingData.timeSlot)
    )

    if (conflicts.length > 0) {
      return { success: false, error: 'Time slot conflict detected! This slot is already booked.' }
    }

    const newBooking = {
      ...bookingData,
      id: generateBookingId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    setBookings(prev => [newBooking, ...prev])
    return { success: true, booking: newBooking }
  }, [bookings])

  const updateBooking = useCallback((id, updates) => {
    const existingBooking = bookings.find(b => b.id === id)
    if (!existingBooking) {
      return { success: false, error: 'Booking not found' }
    }

    if (updates.date || updates.timeSlot) {
      const newDate = updates.date || existingBooking.date
      const newTimeSlot = updates.timeSlot || existingBooking.timeSlot

      const conflicts = bookings.filter(b =>
        b.id !== id && isTimeSlotConflict(b.date, b.timeSlot, newDate, newTimeSlot)
      )

      if (conflicts.length > 0) {
        return { success: false, error: 'Time slot conflict detected! This slot is already booked.' }
      }
    }

    setBookings(prev => prev.map(booking =>
      booking.id === id
        ? { ...booking, ...updates, updatedAt: new Date().toISOString() }
        : booking
    ))
    return { success: true }
  }, [bookings])

  const deleteBooking = useCallback((id) => {
    setBookings(prev => prev.filter(booking => booking.id !== id))
    return { success: true }
  }, [])

  const getBookingById = useCallback((id) => {
    return bookings.find(b => b.id === id)
  }, [bookings])

  const getBookingsByDate = useCallback((date) => {
    return bookings.filter(b => b.date === date)
  }, [bookings])

  const getTodayBookings = useCallback(() => {
    const today = new Date().toISOString().split('T')[0]
    return bookings.filter(b => b.date === today)
  }, [bookings])

  const getStats = useCallback(() => {
    const today = new Date().toISOString().split('T')[0]
    const todayBookings = bookings.filter(b => b.date === today)

    const totalRevenue = bookings.reduce((sum, b) => sum + (b.advanceAmount || 0), 0)
    const totalExpected = bookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0)
    const pendingPayments = totalExpected - totalRevenue

    const paidCount = bookings.filter(b => b.paymentStatus === 'paid').length
    const partialCount = bookings.filter(b => b.paymentStatus === 'partial').length
    const pendingCount = bookings.filter(b => b.paymentStatus === 'pending').length

    return {
      totalBookings: bookings.length,
      todayBookings: todayBookings.length,
      totalRevenue,
      totalExpected,
      pendingPayments,
      paidCount,
      partialCount,
      pendingCount
    }
  }, [bookings])

  const searchBookings = useCallback((query, filters = {}) => {
    let results = [...bookings]

    if (query) {
      const lowerQuery = query.toLowerCase()
      results = results.filter(b =>
        b.customerName.toLowerCase().includes(lowerQuery) ||
        b.phoneNumber.includes(query) ||
        b.id.toLowerCase().includes(lowerQuery)
      )
    }

    if (filters.startDate) {
      results = results.filter(b => b.date >= filters.startDate)
    }

    if (filters.endDate) {
      results = results.filter(b => b.date <= filters.endDate)
    }

    if (filters.hasDecor !== undefined && filters.hasDecor !== '') {
      results = results.filter(b => b.hasDecor === (filters.hasDecor === 'true' || filters.hasDecor === true))
    }

    if (filters.paymentStatus && filters.paymentStatus !== 'all') {
      results = results.filter(b => b.paymentStatus === filters.paymentStatus)
    }

    return results
  }, [bookings])

  return (
    <BookingContext.Provider value={{
      bookings,
      addBooking,
      updateBooking,
      deleteBooking,
      getBookingById,
      getBookingsByDate,
      getTodayBookings,
      getStats,
      searchBookings
    }}>
      {children}
    </BookingContext.Provider>
  )
}

export function useBookings() {
  const context = useContext(BookingContext)
  if (!context) {
    throw new Error('useBookings must be used within a BookingProvider')
  }
  return context
}
