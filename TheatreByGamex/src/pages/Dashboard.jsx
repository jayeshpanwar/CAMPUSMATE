import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, ChevronRight } from 'lucide-react'
import { useBookings } from '../contexts/BookingContext'
import { useToast } from '../contexts/ToastContext'
import BookingCard from '../components/BookingCard'
import BookingModal from '../components/BookingModal'
import DeleteConfirmModal from '../components/DeleteConfirmModal'
import { formatCurrency, formatDate } from '../utils/helpers'

export default function Dashboard({ onNavigate }) {
  const { bookings, getStats, getTodayBookings, deleteBooking } = useBookings()
  const { success } = useToast()
  const [showBookingModal, setShowBookingModal] = useState(false)
  const [editBooking, setEditBooking] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)

  const stats = getStats()
  const todayBookings = getTodayBookings()
  const upcomingBookings = [...bookings]
    .filter(b => b.date >= new Date().toISOString().split('T')[0])
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 5)

  const handleEdit = (booking) => {
    setEditBooking(booking)
    setShowBookingModal(true)
  }

  const confirmDelete = () => {
    if (deleteTarget) {
      deleteBooking(deleteTarget.id)
      success('Booking cancelled')
      setDeleteTarget(null)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-dark-900 dark:text-white">
            TheatreByGamex
          </h1>
          <p className="text-sm text-dark-400">
            {formatDate(new Date().toISOString(), 'EEEE, MMM d')}
          </p>
        </div>
        <button
          onClick={() => setShowBookingModal(true)}
          className="w-12 h-12 rounded-2xl bg-primary-500 text-white flex items-center justify-center active:scale-95 transition-transform"
        >
          <Plus size={24} />
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-4"
        >
          <p className="text-xs text-dark-400 font-medium uppercase tracking-wide">Today</p>
          <p className="text-3xl font-bold text-dark-900 dark:text-white mt-1">
            {stats.todayBookings}
          </p>
          <p className="text-sm text-dark-500">bookings</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="card p-4"
        >
          <p className="text-xs text-dark-400 font-medium uppercase tracking-wide">Revenue</p>
          <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
            {formatCurrency(stats.totalRevenue)}
          </p>
          <p className="text-sm text-dark-500">collected</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card p-4"
        >
          <p className="text-xs text-dark-400 font-medium uppercase tracking-wide">Total</p>
          <p className="text-3xl font-bold text-dark-900 dark:text-white mt-1">
            {stats.totalBookings}
          </p>
          <p className="text-sm text-dark-500">bookings</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="card p-4"
        >
          <p className="text-xs text-dark-400 font-medium uppercase tracking-wide">Pending</p>
          <p className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1">
            {formatCurrency(stats.pendingPayments)}
          </p>
          <p className="text-sm text-dark-500">to collect</p>
        </motion.div>
      </div>

      {/* Today's Bookings */}
      {todayBookings.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-dark-900 dark:text-white">Today</h2>
            <span className="text-sm text-dark-400">{todayBookings.length} bookings</span>
          </div>
          <div className="space-y-2">
            {todayBookings.map((booking, index) => (
              <BookingCard
                key={booking.id}
                booking={booking}
                onEdit={handleEdit}
                onDelete={setDeleteTarget}
                index={index}
                compact
              />
            ))}
          </div>
        </motion.div>
      )}

      {/* Upcoming Bookings */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
      >
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-dark-900 dark:text-white">Upcoming</h2>
          <button
            onClick={() => onNavigate('bookings')}
            className="text-sm text-primary-500 font-medium flex items-center gap-1"
          >
            View all <ChevronRight size={16} />
          </button>
        </div>

        {upcomingBookings.length > 0 ? (
          <div className="space-y-2">
            {upcomingBookings.map((booking, index) => (
              <BookingCard
                key={booking.id}
                booking={booking}
                onEdit={handleEdit}
                onDelete={setDeleteTarget}
                index={index}
              />
            ))}
          </div>
        ) : (
          <div className="card p-8 text-center">
            <p className="text-dark-400">No upcoming bookings</p>
            <button
              onClick={() => setShowBookingModal(true)}
              className="mt-3 text-primary-500 font-medium"
            >
              Add your first booking
            </button>
          </div>
        )}
      </motion.div>

      {/* Modals */}
      <BookingModal
        isOpen={showBookingModal}
        onClose={() => { setShowBookingModal(false); setEditBooking(null) }}
        editBooking={editBooking}
      />

      <DeleteConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        title="Cancel Booking"
        message={`Cancel booking for ${deleteTarget?.customerName}?`}
      />
    </div>
  )
}
