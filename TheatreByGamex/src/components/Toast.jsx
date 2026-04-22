import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, XCircle, AlertCircle, Info } from 'lucide-react'
import { useToast } from '../contexts/ToastContext'

const icons = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertCircle,
  info: Info
}

const colors = {
  success: 'bg-emerald-500',
  error: 'bg-red-500',
  warning: 'bg-amber-500',
  info: 'bg-dark-800'
}

export default function Toast() {
  const { toasts, removeToast } = useToast()

  return (
    <div className="fixed top-4 left-4 right-4 z-[100] flex flex-col items-center gap-2 pointer-events-none">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => {
          const Icon = icons[toast.type] || Info

          return (
            <motion.button
              key={toast.id}
              initial={{ opacity: 0, y: -20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              layout
              onClick={() => removeToast(toast.id)}
              className={`flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-xl text-white pointer-events-auto max-w-sm ${colors[toast.type]}`}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <p className="text-sm font-medium">{toast.message}</p>
            </motion.button>
          )
        })}
      </AnimatePresence>
    </div>
  )
}
