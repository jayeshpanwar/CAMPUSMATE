import { useState, useMemo } from 'react'
import { FileSpreadsheet, FileText, Download } from 'lucide-react'
import { useBookings } from '../contexts/BookingContext'
import { useToast } from '../contexts/ToastContext'
import { exportToExcel, exportToPDF } from '../utils/export'
import { formatCurrency } from '../utils/helpers'

export default function Reports() {
  const { bookings, searchBookings } = useBookings()
  const { success, error } = useToast()
  const [dateRange, setDateRange] = useState({ startDate: '', endDate: '' })
  const [exportFormat, setExportFormat] = useState('excel')

  const filteredBookings = useMemo(() => searchBookings('', dateRange), [searchBookings, dateRange])

  const stats = useMemo(() => {
    const totalRevenue = filteredBookings.reduce((sum, b) => sum + (b.advanceAmount || 0), 0)
    const totalExpected = filteredBookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0)
    return {
      count: filteredBookings.length,
      collected: totalRevenue,
      pending: totalExpected - totalRevenue,
      guests: filteredBookings.reduce((sum, b) => sum + (b.numberOfPersons || 0), 0)
    }
  }, [filteredBookings])

  const handleExport = () => {
    if (filteredBookings.length === 0) {
      error('No bookings to export')
      return
    }
    try {
      if (exportFormat === 'excel') {
        exportToExcel(filteredBookings, 'TheatreByGamex')
      } else {
        exportToPDF(filteredBookings, 'TheatreByGamex')
      }
      success('Exported successfully!')
    } catch {
      error('Export failed')
    }
  }

  const setQuickRange = (days) => {
    const today = new Date()
    const start = days === 0 ? today : new Date(today.getTime() - days * 24 * 60 * 60 * 1000)
    setDateRange({
      startDate: start.toISOString().split('T')[0],
      endDate: today.toISOString().split('T')[0]
    })
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-dark-900 dark:text-white">Reports</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="card p-4">
          <p className="text-xs text-dark-400 uppercase font-medium">Bookings</p>
          <p className="text-2xl font-bold text-dark-900 dark:text-white">{stats.count}</p>
        </div>
        <div className="card p-4">
          <p className="text-xs text-dark-400 uppercase font-medium">Guests</p>
          <p className="text-2xl font-bold text-dark-900 dark:text-white">{stats.guests}</p>
        </div>
        <div className="card p-4">
          <p className="text-xs text-dark-400 uppercase font-medium">Collected</p>
          <p className="text-xl font-bold text-emerald-600">{formatCurrency(stats.collected)}</p>
        </div>
        <div className="card p-4">
          <p className="text-xs text-dark-400 uppercase font-medium">Pending</p>
          <p className="text-xl font-bold text-amber-600">{formatCurrency(stats.pending)}</p>
        </div>
      </div>

      {/* Quick Filters */}
      <div className="card p-4 space-y-4">
        <p className="text-xs text-dark-400 uppercase font-medium">Date Range</p>
        <div className="flex flex-wrap gap-2">
          {[
            { label: 'Today', days: 0 },
            { label: '7 days', days: 7 },
            { label: '30 days', days: 30 },
            { label: 'All', days: -1 }
          ].map(({ label, days }) => (
            <button
              key={label}
              onClick={() => days === -1 ? setDateRange({ startDate: '', endDate: '' }) : setQuickRange(days)}
              className="px-4 py-2 rounded-xl bg-dark-100 dark:bg-dark-800 text-sm font-medium active:scale-95"
            >
              {label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">From</label>
            <input
              type="date"
              value={dateRange.startDate}
              onChange={(e) => setDateRange(p => ({ ...p, startDate: e.target.value }))}
              className="input"
            />
          </div>
          <div>
            <label className="label">To</label>
            <input
              type="date"
              value={dateRange.endDate}
              onChange={(e) => setDateRange(p => ({ ...p, endDate: e.target.value }))}
              className="input"
            />
          </div>
        </div>
      </div>

      {/* Export */}
      <div className="card p-4 space-y-4">
        <p className="text-xs text-dark-400 uppercase font-medium">Export Format</p>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setExportFormat('excel')}
            className={`flex items-center gap-3 p-4 rounded-xl transition-colors ${
              exportFormat === 'excel' ? 'bg-emerald-100 dark:bg-emerald-900/30' : 'bg-dark-50 dark:bg-dark-800'
            }`}
          >
            <FileSpreadsheet className={`w-6 h-6 ${exportFormat === 'excel' ? 'text-emerald-600' : 'text-dark-400'}`} />
            <div className="text-left">
              <p className="font-medium text-dark-900 dark:text-white">Excel</p>
              <p className="text-xs text-dark-400">.xlsx</p>
            </div>
          </button>
          <button
            onClick={() => setExportFormat('pdf')}
            className={`flex items-center gap-3 p-4 rounded-xl transition-colors ${
              exportFormat === 'pdf' ? 'bg-red-100 dark:bg-red-900/30' : 'bg-dark-50 dark:bg-dark-800'
            }`}
          >
            <FileText className={`w-6 h-6 ${exportFormat === 'pdf' ? 'text-red-600' : 'text-dark-400'}`} />
            <div className="text-left">
              <p className="font-medium text-dark-900 dark:text-white">PDF</p>
              <p className="text-xs text-dark-400">.pdf</p>
            </div>
          </button>
        </div>

        <button onClick={handleExport} disabled={stats.count === 0} className="btn-primary w-full">
          <Download size={18} />
          Export {stats.count} Bookings
        </button>
      </div>
    </div>
  )
}
