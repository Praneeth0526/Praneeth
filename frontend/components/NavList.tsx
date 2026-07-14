'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

const NAV_LINKS = [
  { label: 'Home',       href: '#home' },
  { label: 'About',      href: '#about' },
  { label: 'Projects',   href: '#projects' },
  { label: 'Experience', href: '#experience' },
  { label: 'Connect',    href: '#connect' },
]

interface NavListProps {
  orientation?: 'vertical' | 'horizontal'
  align?: 'left' | 'right'
  className?: string
}

export default function NavList({ orientation = 'vertical', align = 'right', className = '' }: NavListProps) {
  const containerClass =
    orientation === 'horizontal'
      ? 'flex flex-row gap-8'
      : 'flex flex-col gap-[10px]'

  const alignClass = align === 'right' ? 'items-end' : 'items-start'

  return (
    <nav aria-label="Primary navigation">
      <ul className={`${containerClass} ${alignClass} ${className}`}>
        {NAV_LINKS.map((link, i) => (
          <motion.li
            key={link.href}
            initial={{ opacity: 0, x: 6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.4,
              delay: 0.5 + i * 0.07,
              ease: [0.22, 1, 0.36, 1],
            }}
            style={{ listStyle: 'none' }}
          >
            <Link
              href={link.href}
              className={`
                text-[11px] font-medium tracking-[0.16em] uppercase
                text-[var(--text-secondary)] no-underline
                transition-all duration-200 ease-out
                hover:text-[var(--text-primary)] hover:translate-x-[2px]
                inline-block
                ${align === 'right' ? 'text-right' : 'text-left'}
              `}
            >
              {link.label}
            </Link>
          </motion.li>
        ))}
      </ul>
    </nav>
  )
}
