'use client'

import { motion } from 'framer-motion'

interface EyebrowLabelProps {
  children: React.ReactNode
  className?: string
  delay?: number
}

export default function EyebrowLabel({ children, className = '', delay = 0 }: EyebrowLabelProps) {
  return (
    <motion.p
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      className={`text-[11px] font-medium tracking-[0.18em] uppercase text-[var(--text-secondary)] select-none ${className}`}
    >
      {children}
    </motion.p>
  )
}
