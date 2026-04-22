import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Plus, Minus, Check, ChevronDown, Trash2, MessageCircle } from 'lucide-react'
import { useBookings } from '../contexts/BookingContext'
import { useToast } from '../contexts/ToastContext'
import { validateBookingForm, getPaymentStatus, calculateRemainingAmount, formatDate, getTimeSlotLabel } from '../utils/helpers'
import { TIME_SLOTS, DECOR_THEMES, ADDON_OPTIONS } from '../data/mockData'

const initialFormState = {
  customerName: '',
  phoneNumber: '',
  date: '',
  timeSlot: '',
  numberOfPersons: 2,
  hasDecor: false,
  decorTheme: '',
  addons: [],
  totalAmount: 5000,
  advanceAmount: 0,
  notes: ''
}

export default function BookingModal({ isOpen, onClose, editBooking = null }) {
  const { addBooking, updateBooking, deleteBooking } = useBookings()
  const { success, error } = useToast()
  const [form, setForm] = useState(initialFormState)
  const [errors, setErrors] = useState({})
  const [showAddons, setShowAddons] = useState(false)

  useEffect(() => {
    if (editBooking) {
      setForm({
        customerName: editBooking.customerName || '',
        phoneNumber: editBooking.phoneNumber || '',
        date: editBooking.date || '',
        timeSlot: editBooking.timeSlot || '',
        numberOfPersons: editBooking.numberOfPersons || 2,
        hasDecor: editBooking.hasDecor || false,
        decorTheme: editBooking.decorTheme || '',
        addons: editBooking.addons || [],
        totalAmount: editBooking.totalAmount || 5000,
        advanceAmount: editBooking.advanceAmount || 0,
        notes: editBooking.notes || ''
      })
    } else {
      setForm(initialFormState)
    }
    setErrors({})
    setShowAddons(false)
  }, [editBooking, isOpen])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }))
  }

  const toggleAddon = (addon) => {
    setForm(prev => ({
      ...prev,
      addons: prev.addons.includes(addon)
        ? prev.addons.filter(a => a !== addon)
        : [...prev.addons, addon]
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const validation = validateBookingForm(form)
    if (!validation.isValid) {
      setErrors(validation.errors)
      error('Please fill required fields')
      return
    }

    const bookingData = {
      ...form,
      paymentStatus: getPaymentStatus(form.advanceAmount, form.totalAmount)
    }

    if (editBooking) {
      const result = updateBooking(editBooking.id, bookingData)
      if (result.success) { success('Booking updated'); onClose() }
      else error(result.error)
    } else {
      const result = addBooking(bookingData)
      if (result.success) { success('Booking created'); onClose() }
      else error(result.error)
    }
  }

  const handleDelete = () => {
    if (editBooking && confirm('Cancel this booking?')) {
      deleteBooking(editBooking.id)
      success('Booking cancelled')
      onClose()
    }
  }

  const handleWhatsApp = () => {
    const message = encodeURIComponent(
      `Hi ${form.customerName}! Reminder for your theatre booking on ${formatDate(form.date)} at ${getTimeSlotLabel(form.timeSlot)}. - TheatreByGamex`
    )
    window.open(`https://wa.me/91${form.phoneNumber.replace(/\D/g, '')}?text=${message}`, '_blank')
  }

  const remainingAmount = calculateRemainingAmount(form.totalAmount, form.advanceAmount)

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60]">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/40"
            onClick={onClose}
          />

          {/* Sheet */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="absolute bottom-0 left-0 right-0 bg-white dark:bg-dark-900 rounded-t-3xl max-h-[95vh] flex flex-col"
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-10 h-1 bg-dark-200 dark:bg-dark-700 rounded-full" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-5 pb-4">
              <h2 className="text-xl font-bold text-dark-900 dark:text-white">
                {editBooking ? 'Edit Booking' : 'New Booking'}
              </h2>
              <div className="flex gap-2">
                {editBooking && (
                  <>
                    <button onClick={handleWhatsApp} className="p-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600">
                      <MessageCircle size={20} />
                    </button>
                    <button onClick={handleDelete} className="p-2.5 rounded-xl bg-red-100 dark:bg-red-900/30 text-red-600">
                      <Trash2 size={20} />
                    </button>
                  </>
                )}
                <button onClick={onClose} className="p-2.5 rounded-xl bg-dark-100 dark:bg-dark-800">
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-5 pb-safe">
              <div className="space-y-5 pb-32">
                {/* Customer Info */}
                <div className="space-y-3">
                  <div>
                    <label className="label">Name</label>
                    <input
                      type="text"
                      name="customerName"
                      value={form.customerName}
                      onChange={handleChange}
                      className={`input ${errors.customerName ? 'ring-2 ring-red-500/30' : ''}`}
                      placeholder="Customer name"
                    />
                  </div>
                  <div>
                    <label className="label">Phone</label>
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={form.phoneNumber}
                      onChange={handleChange}
                      className={`input ${errors.phoneNumber ? 'ring-2 ring-red-500/30' : ''}`}
                      placeholder="10-digit number"
                    />
                  </div>
                </div>

                {/* Date & Time */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="label">Date</label>
                    <input
                      type="date"
                      name="date"
                      value={form.date}
                      onChange={handleChange}
                      className={`input ${errors.date ? 'ring-2 ring-red-500/30' : ''}`}
                    />
                  </div>
                  <div>
                    <label className="label">Time</label>
                    <select
                      name="timeSlot"
                      value={form.timeSlot}
                      onChange={handleChange}
                      className={`input ${errors.timeSlot ? 'ring-2 ring-red-500/30' : ''}`}
                    >
                      <option value="">Select</option>
                      {TIME_SLOTS.map(slot => (
                        <option key={slot.value} value={slot.value}>{slot.shortLabel}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Persons */}
                <div>
                  <label className="label">Guests</label>
                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      onClick={() => setForm(p => ({ ...p, numberOfPersons: Math.max(1, p.numberOfPersons - 1) }))}
                      className="w-12 h-12 rounded-2xl bg-dark-100 dark:bg-dark-800 flex items-center justify-center active:scale-95"
                    >
                      <Minus size={20} />
                    </button>
                    <span className="text-3xl font-bold w-12 text-center text-dark-900 dark:text-white">
                      {form.numberOfPersons}
                    </span>
                    <button
                      type="button"
                      onClick={() => setForm(p => ({ ...p, numberOfPersons: p.numberOfPersons + 1 }))}
                      className="w-12 h-12 rounded-2xl bg-dark-100 dark:bg-dark-800 flex items-center justify-center active:scale-95"
                    >
                      <Plus size={20} />
                    </button>
                  </div>
                </div>

                {/* Decor Toggle */}
                <div className="flex items-center justify-between p-4 bg-dark-50 dark:bg-dark-800 rounded-2xl">
                  <span className="font-medium text-dark-900 dark:text-white">Add Decoration</span>
                  <button
                    type="button"
                    onClick={() => setForm(p => ({ ...p, hasDecor: !p.hasDecor, decorTheme: p.hasDecor ? '' : p.decorTheme }))}
                    className={`w-14 h-8 rounded-full transition-colors ${form.hasDecor ? 'bg-primary-500' : 'bg-dark-300 dark:bg-dark-600'}`}
                  >
                    <motion.div
                      animate={{ x: form.hasDecor ? 26 : 4 }}
                      className="w-6 h-6 bg-white rounded-full shadow"
                    />
                  </button>
                </div>

                {form.hasDecor && (
                  <div>
                    <label className="label">Theme</label>
                    <select
                      name="decorTheme"
                      value={form.decorTheme}
                      onChange={handleChange}
                      className="input"
                    >
                      <option value="">Select theme</option>
                      {DECOR_THEMES.map(theme => (
                        <option key={theme} value={theme}>{theme}</option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Add-ons */}
                <div>
                  <button
                    type="button"
                    onClick={() => setShowAddons(!showAddons)}
                    className="flex items-center justify-between w-full p-4 bg-dark-50 dark:bg-dark-800 rounded-2xl"
                  >
                    <span className="font-medium text-dark-900 dark:text-white">
                      Add-ons {form.addons.length > 0 && `(${form.addons.length})`}
                    </span>
                    <ChevronDown size={20} className={`transition-transform ${showAddons ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {showAddons && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="flex flex-wrap gap-2 pt-3">
                          {ADDON_OPTIONS.map(addon => (
                            <button
                              key={addon}
                              type="button"
                              onClick={() => toggleAddon(addon)}
                              className={`px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                                form.addons.includes(addon)
                                  ? 'bg-primary-500 text-white'
                                  : 'bg-dark-100 dark:bg-dark-800 text-dark-600 dark:text-dark-400'
                              }`}
                            >
                              {form.addons.includes(addon) && <Check size={14} className="inline mr-1" />}
                              {addon}
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Payment */}
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="label">Total ₹</label>
                      <input
                        type="number"
                        name="totalAmount"
                        value={form.totalAmount}
                        onChange={handleChange}
                        className="input"
                        min="0"
                      />
                    </div>
                    <div>
                      <label className="label">Advance ₹</label>
                      <input
                        type="number"
                        name="advanceAmount"
                        value={form.advanceAmount}
                        onChange={handleChange}
                        className="input"
                        min="0"
                      />
                    </div>
                  </div>
                  {remainingAmount > 0 && (
                    <p className="text-sm text-amber-600 font-medium">
                      Due: ₹{remainingAmount.toLocaleString()}
                    </p>
                  )}
                </div>

                {/* Notes */}
                <div>
                  <label className="label">Notes</label>
                  <textarea
                    name="notes"
                    value={form.notes}
                    onChange={handleChange}
                    rows={2}
                    className="input resize-none"
                    placeholder="Any special requests..."
                  />
                </div>
              </div>

              {/* Fixed Footer */}
              <div className="fixed bottom-0 left-0 right-0 p-5 bg-white dark:bg-dark-900 border-t border-dark-100 dark:border-dark-800 safe-area-pb">
                <button type="submit" className="btn-primary w-full py-4">
                  {editBooking ? 'Save Changes' : 'Create Booking'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
