import type { ReactNode } from 'react'
import { motion } from 'framer-motion'

interface PageShellProps {
  title: string
  subtitle?: string
  children: ReactNode
}

export default function PageShell({ title, subtitle, children }: PageShellProps) {
  return (
    <motion.section 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8"
    >
      <div className="mb-6 overflow-hidden rounded-[2rem] glass p-8 shadow-soft relative before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/40 before:to-transparent before:pointer-events-none">
        <div className="mb-8 relative z-10">
          <h1 className="text-4xl font-heading font-bold text-neutral-900 tracking-tight">{title}</h1>
          {subtitle ? <p className="mt-3 max-w-3xl text-sm leading-relaxed text-neutral-600 font-sans">{subtitle}</p> : null}
        </div>
        <div className="relative z-10">
          {children}
        </div>
      </div>
    </motion.section>
  )
}
