'use client'

import { motion } from 'framer-motion'
import type { CSSProperties } from 'react'

interface FooterMetaBarProps {
  className?: string
  style?: CSSProperties
}

const META = [
  { label: 'BASE', value: 'MYSURU | BENGALURU' },
  { label: 'FOCUS', value: 'DATA ENGINEERING, AI, NLP, SYSTEMS ENGINEERING' },
  { label: 'INDEX', value: 'PORTFOLIO 2026' },
]

export default function FooterMetaBar({ className = '', style }: FooterMetaBarProps) {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className={`flex flex-row items-start ${className}`}
      style={{ gap: 0, ...style }}
      aria-label="Site metadata"
    >
      {META.map((item, i) => (
        <div
          key={item.label}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
            paddingRight: '24px',
            paddingLeft: i > 0 ? '24px' : 0,
            borderLeft: i > 0 ? '1px solid rgba(17,17,17,0.12)' : 'none',
            minWidth: 0,
          }}
        >
          <span
            style={{
              fontSize: '8.5px',
              fontWeight: 500,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: '#6F6F6F',
              whiteSpace: 'nowrap',
            }}
          >
            {item.label}
          </span>
          <span
            style={{
              fontSize: '10px',
              fontWeight: 700,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              color: '#111111',
              lineHeight: 1.5,
            }}
          >
            {item.value}
          </span>
        </div>
      ))}
    </motion.footer>
  )
}
