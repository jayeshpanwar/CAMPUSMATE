import { useState } from 'react'
import { ThemeProvider } from './contexts/ThemeContext'
import { BookingProvider } from './contexts/BookingContext'
import { ToastProvider } from './contexts/ToastContext'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import Bookings from './pages/Bookings'
import Calendar from './pages/Calendar'
import Reports from './pages/Reports'
import Settings from './pages/Settings'
import Toast from './components/Toast'

function AppContent() {
  const [currentPage, setCurrentPage] = useState('dashboard')

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard onNavigate={setCurrentPage} />
      case 'bookings':
        return <Bookings />
      case 'calendar':
        return <Calendar />
      case 'reports':
        return <Reports />
      case 'settings':
        return <Settings />
      default:
        return <Dashboard onNavigate={setCurrentPage} />
    }
  }

  return (
    <div className="min-h-screen bg-dark-50 dark:bg-dark-950">
      <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <main className="lg:ml-20 pb-20 lg:pb-0">
        <div className="max-w-5xl mx-auto p-4 sm:p-6">
          {renderPage()}
        </div>
      </main>
      <Toast />
    </div>
  )
}

function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <BookingProvider>
          <AppContent />
        </BookingProvider>
      </ToastProvider>
    </ThemeProvider>
  )
}

export default App
