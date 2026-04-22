import { motion } from 'framer-motion'
import {
  LayoutDashboard,
  CalendarDays,
  BookOpen,
  FileBarChart,
  Settings,
  Film
} from 'lucide-react'

const navItems = [
  { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
  { id: 'bookings', label: 'Bookings', icon: BookOpen },
  { id: 'calendar', label: 'Calendar', icon: CalendarDays },
  { id: 'reports', label: 'Reports', icon: FileBarChart },
  { id: 'settings', label: 'Settings', icon: Settings }
]

export default function Sidebar({ currentPage, setCurrentPage, isOpen, setIsOpen }) {
  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex fixed left-0 top-0 h-full w-20 bg-white dark:bg-dark-900 border-r border-dark-100 dark:border-dark-800 flex-col z-50">
        {/* Logo */}
        <div className="flex items-center justify-center p-4 border-b border-dark-100 dark:border-dark-800">
          <div className="w-11 h-11 rounded-2xl bg-primary-500 flex items-center justify-center">
            <Film className="w-6 h-6 text-white" />
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 flex flex-col items-center py-4 gap-1">
          {navItems.map((item) => {
            const isActive = currentPage === item.id
            const Icon = item.icon

            return (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                className={`relative w-14 h-14 flex flex-col items-center justify-center rounded-2xl transition-all duration-200
                  ${isActive
                    ? 'bg-primary-500 text-white'
                    : 'text-dark-400 hover:bg-dark-100 dark:hover:bg-dark-800 hover:text-dark-600 dark:hover:text-dark-200'
                  }`}
              >
                <Icon size={22} />
                <span className="text-[10px] font-medium mt-0.5">{item.label}</span>
              </button>
            )
          })}
        </nav>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden bottom-nav">
        {navItems.map((item) => {
          const isActive = currentPage === item.id
          const Icon = item.icon

          return (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id)}
              className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-xl transition-all
                ${isActive
                  ? 'text-primary-500'
                  : 'text-dark-400'
                }`}
            >
              <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
              <span className={`text-[10px] mt-0.5 ${isActive ? 'font-semibold' : 'font-medium'}`}>
                {item.label}
              </span>
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute -bottom-1 w-1 h-1 rounded-full bg-primary-500"
                />
              )}
            </button>
          )
        })}
      </nav>
    </>
  )
}
