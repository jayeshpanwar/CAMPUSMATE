import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Plus, X, SlidersHorizontal } from 'lucide-react'
import { useBookings } from '../contexts/BookingContext'
import { useToast } from '../contexts/ToastContext'
import BookingCard from '../components/BookingCard'
import BookingModal from '../components/BookingModal'
import DeleteConfirmModal from '../components/DeleteConfirmModal'

export default function Bookings() {
  const { bookings, searchBookings, deleteBooking } = useBookings()
  const { success } = useToast()

  const [searchQuery, setSearchQuery] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    hasDecor: '',
    paymentStatus: 'all'
  })

  const [showBookingModal, setShowBookingModal] = useState(false)
  const [editBooking, setEditBooking] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)

  const filteredBookings = useMemo(() => {
    return searchBookings(searchQuery, filters)
      .sort((a, b) => new Date(b.date) - new Date(a.date))
  }, [searchBookings, searchQuery, filters])

  const clearFilters = () => {
    setFilters({ startDate: '', endDate: '', hasDecor: '', paymentStatus: 'all' })
    setSearchQuery('')
  }

  const hasActiveFilters = filters.startDate || filters.endDate ||
    filters.hasDecor !== '' || filters.paymentStatus !== 'all'

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
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-dark-900 dark:text-white">Bookings</h1>
        <button
          onClick={() => setShowBookingModal(true)}
          className="w-12 h-12 rounded-2xl bg-primary-500 text-white flex items-center justify-center active:scale-95 transition-transform"
        >
          <Plus size={24} />
        </button>
      </div>

      {/* Search */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
          <input
            type="text"
            placeholder="Search name or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input pl-12 pr-10"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1"
            >
              <X size={18} className="text-dark-400" />
            </button>
          )}
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`btn-icon ${hasActiveFilters ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600' : ''}`}
        >
          <SlidersHorizontal size={20} />
        </button>
      </div>

      {/* Filters */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="card p-4 space-y-3"
          >
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">From</label>
                <input
                  type="date"
                  value={filters.startDate}
                  onChange={(e) => setFilters(prev => ({ ...prev, startDate: e.target.value }))}
                  className="input"
                />
              </div>
              <div>
                <label className="label">To</label>
                <input
                  type="date"
                  value={filters.endDate}
                  onChange={(e) => setFilters(prev => ({ ...prev, endDate: e.target.value }))}
                  className="input"
                />
              </div>
            </div>

            <div className="flex gap-2">
              {['all', 'paid', 'partial', 'pending'].map(status => (
                <button
                  key={status}
                  onClick={() => setFilters(prev => ({ ...prev, paymentStatus: status }))}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-medium capitalize transition-colors ${
                    filters.paymentStatus === status
                      ? 'bg-primary-500 text-white'
                      : 'bg-dark-100 dark:bg-dark-800 text-dark-600 dark:text-dark-400'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>

            {hasActiveFilters && (
              <button onClick={clearFilters} className="text-sm text-primary-500 font-medium">
                Clear filters
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Count */}
      <p className="text-sm text-dark-400">
        {filteredBookings.length} {filteredBookings.length === 1 ? 'booking' : 'bookings'}
      </p>

      {/* List */}
      <div className="space-y-2">
        <AnimatePresence mode="popLayout">
          {filteredBookings.length > 0 ? (
            filteredBookings.map((booking, index) => (
              <BookingCard
                key={booking.id}
                booking={booking}
                onEdit={handleEdit}
                onDelete={setDeleteTarget}
                index={index}
              />
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="card p-8 text-center"
            >
              <p className="text-dark-400">No bookings found</p>
              {(searchQuery || hasActiveFilters) && (
                <button onClick={clearFilters} className="mt-2 text-primary-500 font-medium">
                  Clear search
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

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
