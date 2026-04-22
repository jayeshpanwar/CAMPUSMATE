import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Plus, Users } from 'lucide-react'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, addMonths, subMonths, getDay } from 'date-fns'
import { useBookings } from '../contexts/BookingContext'
import BookingModal from '../components/BookingModal'
import { formatCurrency } from '../utils/helpers'
import { TIME_SLOTS } from '../data/mockData'

export default function Calendar() {
  const { bookings } = useBookings()
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [showBookingModal, setShowBookingModal] = useState(false)
  const [editBooking, setEditBooking] = useState(null)

  const days = useMemo(() => {
    return eachDayOfInterval({ start: startOfMonth(currentMonth), end: endOfMonth(currentMonth) })
  }, [currentMonth])

  const startDayOfWeek = getDay(startOfMonth(currentMonth))

  const getBookingsForDate = (date) => {
    const dateStr = format(date, 'yyyy-MM-dd')
    return bookings.filter(b => b.date === dateStr)
  }

  const selectedDateBookings = getBookingsForDate(selectedDate)

  const handleSlotClick = (slot) => {
    const dateStr = format(selectedDate, 'yyyy-MM-dd')
    const existing = bookings.find(b => b.date === dateStr && b.timeSlot === slot.value)
    if (existing) {
      setEditBooking(existing)
    } else {
      setEditBooking(null)
    }
    setShowBookingModal(true)
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-dark-900 dark:text-white">Calendar</h1>
        <button
          onClick={() => { setEditBooking(null); setShowBookingModal(true) }}
          className="w-12 h-12 rounded-2xl bg-primary-500 text-white flex items-center justify-center active:scale-95"
        >
          <Plus size={24} />
        </button>
      </div>

      {/* Month Navigation */}
      <div className="card p-4">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            className="p-2 rounded-xl bg-dark-100 dark:bg-dark-800 active:scale-95"
          >
            <ChevronLeft size={20} />
          </button>
          <h2 className="text-lg font-bold text-dark-900 dark:text-white">
            {format(currentMonth, 'MMMM yyyy')}
          </h2>
          <button
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            className="p-2 rounded-xl bg-dark-100 dark:bg-dark-800 active:scale-95"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Day Headers */}
        <div className="grid grid-cols-7 mb-2">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
            <div key={i} className="text-center text-xs font-medium text-dark-400 py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: startDayOfWeek }).map((_, i) => (
            <div key={`empty-${i}`} className="aspect-square" />
          ))}

          {days.map((day) => {
            const dayBookings = getBookingsForDate(day)
            const isSelected = isSameDay(day, selectedDate)
            const isCurrentDay = isToday(day)

            return (
              <button
                key={day.toISOString()}
                onClick={() => setSelectedDate(day)}
                className={`aspect-square rounded-xl flex flex-col items-center justify-center relative transition-all active:scale-95
                  ${isSelected
                    ? 'bg-primary-500 text-white'
                    : isCurrentDay
                      ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600'
                      : 'text-dark-900 dark:text-white'
                  }`}
              >
                <span className="text-sm font-medium">{format(day, 'd')}</span>
                {dayBookings.length > 0 && (
                  <div className={`w-1.5 h-1.5 rounded-full mt-0.5 ${isSelected ? 'bg-white' : 'bg-primary-500'}`} />
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Selected Date */}
      <div className="card p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-dark-900 dark:text-white">
              {format(selectedDate, 'EEEE, MMM d')}
            </h3>
            <p className="text-sm text-dark-400">
              {selectedDateBookings.length} booking{selectedDateBookings.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {/* Time Slots */}
        <div className="space-y-2">
          {TIME_SLOTS.map(slot => {
            const booking = bookings.find(
              b => b.date === format(selectedDate, 'yyyy-MM-dd') && b.timeSlot === slot.value
            )

            return (
              <button
                key={slot.value}
                onClick={() => handleSlotClick(slot)}
                className={`w-full p-3 rounded-xl text-left transition-colors active:scale-[0.98] ${
                  booking
                    ? 'bg-primary-50 dark:bg-primary-900/20'
                    : 'bg-dark-50 dark:bg-dark-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-dark-900 dark:text-white text-sm">
                      {slot.shortLabel}
                    </p>
                    <p className="text-xs text-dark-400">{slot.label}</p>
                  </div>
                  {booking ? (
                    <span className="text-xs font-medium text-primary-600 bg-primary-100 dark:bg-primary-900/30 px-2 py-1 rounded-lg">
                      Booked
                    </span>
                  ) : (
                    <span className="text-xs font-medium text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30 px-2 py-1 rounded-lg">
                      Open
                    </span>
                  )}
                </div>

                {booking && (
                  <div className="mt-2 pt-2 border-t border-primary-100 dark:border-primary-800">
                    <p className="font-medium text-dark-900 dark:text-white text-sm">
                      {booking.customerName}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-dark-500 mt-1">
                      <span className="flex items-center gap-1">
                        <Users size={12} /> {booking.numberOfPersons}
                      </span>
                      <span>{formatCurrency(booking.totalAmount)}</span>
                    </div>
                  </div>
                )}
              </button>
            )
          })}
        </div>
      </div>

      <BookingModal
        isOpen={showBookingModal}
        onClose={() => { setShowBookingModal(false); setEditBooking(null) }}
        editBooking={editBooking}
      />
    </div>
  )
}
