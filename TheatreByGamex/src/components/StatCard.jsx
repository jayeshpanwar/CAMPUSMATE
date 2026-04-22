import { motion } from 'framer-motion'

export default function StatCard({ title, value, icon: Icon, trend, color = 'primary', delay = 0 }) {
  const colorClasses = {
    primary: 'from-primary-500 to-primary-600 shadow-primary-500/30',
    emerald: 'from-emerald-500 to-emerald-600 shadow-emerald-500/30',
    amber: 'from-amber-500 to-amber-600 shadow-amber-500/30',
    blue: 'from-blue-500 to-blue-600 shadow-blue-500/30'
  }

  const iconBgClasses = {
    primary: 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400',
    emerald: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400',
    amber: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400',
    blue: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="card p-6 relative overflow-hidden group"
    >
      {/* Background gradient decoration */}
      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${colorClasses[color]} opacity-5 rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-500`} />

      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-dark-500 dark:text-dark-400 mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-dark-900 dark:text-white">{value}</h3>
          {trend && (
            <p className={`text-sm mt-2 ${trend > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
              {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}% from last month
            </p>
          )}
        </div>
        <div className={`p-3 rounded-xl ${iconBgClasses[color]}`}>
          <Icon size={24} />
        </div>
      </div>
    </motion.div>
  )
}
