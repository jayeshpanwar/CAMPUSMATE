import { motion } from 'framer-motion'
import {
  Calendar,
  Clock,
  Users,
  ChevronRight,
  Sparkles
} from 'lucide-react'
import { formatDate, formatCurrency, getTimeSlotLabel, getStatusColor } from '../utils/helpers'
import { TIME_SLOTS } from '../data/mockData'

export default function BookingCard({ booking, onEdit, onDelete, index = 0, compact = false }) {
  const shortSlot = TIME_SLOTS.find(s => s.value === booking.timeSlot)?.shortLabel || booking.timeSlot

  if (compact) {
    return (
      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.03 }}
        onClick={() => onEdit(booking)}
        className="card p-4 w-full text-left active:scale-[0.98] transition-transform"
      >
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-dark-900 dark:text-white truncate">
                {booking.customerName}
              </h3>
              <span className={getStatusColor(booking.paymentStatus)}>
                {booking.paymentStatus}
              </span>
            </div>
            <p className="text-sm text-dark-500 mt-0.5">
              {shortSlot} · {booking.numberOfPersons} guests
            </p>
          </div>
          <div className="text-right pl-3">
            <p className="font-bold text-dark-900 dark:text-white">
              {formatCurrency(booking.totalAmount)}
            </p>
          </div>
        </div>
      </motion.button>
    )
  }

  return (
    <motion.button
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03 }}
      onClick={() => onEdit(booking)}
      className="card p-4 w-full text-left active:scale-[0.98] transition-transform"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-semibold text-dark-900 dark:text-white truncate text-base">
              {booking.customerName}
            </h3>
            <span className={getStatusColor(booking.paymentStatus)}>
              {booking.paymentStatus}
            </span>
          </div>

          {/* Details */}
          <div className="flex flex-wrap items-center gap-3 text-sm text-dark-500">
            <span className="flex items-center gap-1.5">
              <Calendar size={14} className="text-primary-500" />
              {formatDate(booking.date, 'MMM d')}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock size={14} className="text-primary-500" />
              {shortSlot}
            </span>
            <span className="flex items-center gap-1.5">
              <Users size={14} className="text-primary-500" />
              {booking.numberOfPersons}
            </span>
            {booking.hasDecor && (
              <span className="flex items-center gap-1.5 text-purple-500">
                <Sparkles size={14} />
                Decor
              </span>
            )}
          </div>

          {/* Addons preview */}
          {booking.addons?.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {booking.addons.slice(0, 2).map((addon, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 bg-dark-100 dark:bg-dark-800 text-dark-500 text-xs rounded-lg"
                >
                  {addon}
                </span>
              ))}
              {booking.addons.length > 2 && (
                <span className="px-2 py-0.5 text-dark-400 text-xs">
                  +{booking.addons.length - 2}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          <div className="text-right">
            <p className="text-lg font-bold text-dark-900 dark:text-white">
              {formatCurrency(booking.totalAmount)}
            </p>
            {booking.advanceAmount > 0 && booking.advanceAmount < booking.totalAmount && (
              <p className="text-xs text-amber-500">
                Due: {formatCurrency(booking.totalAmount - booking.advanceAmount)}
              </p>
            )}
          </div>
          <ChevronRight size={18} className="text-dark-300" />
        </div>
      </div>
    </motion.button>
  )
}
