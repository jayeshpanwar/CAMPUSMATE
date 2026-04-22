import { useState } from 'react'
import { Sun, Moon, Download, Upload, Trash2 } from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'
import { useBookings } from '../contexts/BookingContext'
import { useToast } from '../contexts/ToastContext'
import DeleteConfirmModal from '../components/DeleteConfirmModal'

export default function Settings() {
  const { theme, setTheme } = useTheme()
  const { bookings } = useBookings()
  const { success, error } = useToast()
  const [showClearModal, setShowClearModal] = useState(false)

  const handleExport = () => {
    const data = { bookings, exportedAt: new Date().toISOString(), version: '1.0' }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `theatrebygamex_backup.json`
    a.click()
    URL.revokeObjectURL(url)
    success('Backup exported')
  }

  const handleImport = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result)
        if (data.bookings && Array.isArray(data.bookings)) {
          localStorage.setItem('theatrebygamex-bookings', JSON.stringify(data.bookings))
          success('Imported! Refreshing...')
          setTimeout(() => window.location.reload(), 1000)
        }
      } catch {
        error('Invalid file format')
      }
    }
    reader.readAsText(file)
  }

  const handleClear = () => {
    localStorage.removeItem('theatrebygamex-bookings')
    success('Data cleared!')
    setTimeout(() => window.location.reload(), 1000)
    setShowClearModal(false)
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-dark-900 dark:text-white">Settings</h1>

      {/* Theme */}
      <div className="card p-4 space-y-3">
        <p className="text-xs text-dark-400 uppercase font-medium">Appearance</p>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setTheme('light')}
            className={`flex items-center gap-3 p-4 rounded-xl transition-colors ${
              theme === 'light' ? 'bg-amber-100 dark:bg-amber-900/30' : 'bg-dark-50 dark:bg-dark-800'
            }`}
          >
            <Sun className={`w-6 h-6 ${theme === 'light' ? 'text-amber-600' : 'text-dark-400'}`} />
            <span className="font-medium text-dark-900 dark:text-white">Light</span>
          </button>
          <button
            onClick={() => setTheme('dark')}
            className={`flex items-center gap-3 p-4 rounded-xl transition-colors ${
              theme === 'dark' ? 'bg-indigo-100 dark:bg-indigo-900/30' : 'bg-dark-50 dark:bg-dark-800'
            }`}
          >
            <Moon className={`w-6 h-6 ${theme === 'dark' ? 'text-indigo-600' : 'text-dark-400'}`} />
            <span className="font-medium text-dark-900 dark:text-white">Dark</span>
          </button>
        </div>
      </div>

      {/* Data */}
      <div className="card p-4 space-y-4">
        <p className="text-xs text-dark-400 uppercase font-medium">Data</p>

        <div className="flex items-center justify-between p-3 bg-dark-50 dark:bg-dark-800 rounded-xl">
          <span className="text-dark-600 dark:text-dark-400">Total bookings</span>
          <span className="font-bold text-dark-900 dark:text-white">{bookings.length}</span>
        </div>

        <button onClick={handleExport} className="btn-secondary w-full justify-center">
          <Download size={18} /> Export Backup
        </button>

        <label className="btn-secondary w-full justify-center cursor-pointer">
          <Upload size={18} /> Import Backup
          <input type="file" accept=".json" onChange={handleImport} className="hidden" />
        </label>

        <button
          onClick={() => setShowClearModal(true)}
          className="w-full py-3 text-sm font-medium text-red-500 active:bg-red-50 dark:active:bg-red-900/20 rounded-xl transition-colors"
        >
          <Trash2 size={16} className="inline mr-2" />
          Clear All Data
        </button>
      </div>

      {/* About */}
      <div className="card p-4 space-y-3">
        <p className="text-xs text-dark-400 uppercase font-medium">About</p>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-dark-500">Version</span>
            <span className="font-medium text-dark-900 dark:text-white">1.0.0</span>
          </div>
          <div className="flex justify-between">
            <span className="text-dark-500">Storage</span>
            <span className="font-medium text-dark-900 dark:text-white">Local</span>
          </div>
        </div>
      </div>

      <DeleteConfirmModal
        isOpen={showClearModal}
        onClose={() => setShowClearModal(false)}
        onConfirm={handleClear}
        title="Clear Data"
        message="Delete all bookings? This cannot be undone."
      />
    </div>
  )
}
