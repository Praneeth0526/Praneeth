'use client'

import { motion, useReducedMotion } from 'framer-motion'

/* ─────────────────────────────────────────────
   Float wrapper — gentle y-oscillation
───────────────────────────────────────────── */
interface FloatProps {
  children: React.ReactNode
  delay?: number
  amplitude?: number
  duration?: number
  className?: string
}

function Float({ children, delay = 0, amplitude = 6, duration = 4 }: FloatProps) {
  const prefersReducedMotion = useReducedMotion()
  return (
    <motion.div
      animate={prefersReducedMotion ? {} : { y: [0, -amplitude, 0] }}
      transition={{ duration, delay, repeat: Infinity, ease: 'easeInOut' }}
    >
      {children}
    </motion.div>
  )
}

/* ─── Chrome Shelf with object ──────────────── */
function Shelf({
  children,
  delay = 0,
}: {
  children: React.ReactNode
  delay?: number
}) {
  return (
    <Float delay={delay} amplitude={5} duration={3.8 + delay * 0.2}>
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
        className="flex items-center"
      >
        {/* Bracket arm from pole */}
        <div
          style={{
            height: '4px',
            width: '28px',
            background: 'linear-gradient(90deg, #9aa0b0 0%, #c8cdd8 60%, #d8dde6 100%)',
            flexShrink: 0,
          }}
        />
        {/* Object card */}
        <div
          style={{
            width: '88px',
            height: '76px',
            borderRadius: '16px',
            background: 'linear-gradient(145deg, #ffffff 0%, #f2f4f7 100%)',
            boxShadow:
              '0 10px 36px rgba(0,0,0,0.14), 0 2px 8px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.95)',
            border: '1px solid rgba(255,255,255,0.85)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {children}
        </div>
      </motion.div>
    </Float>
  )
}

/* ─── Yellow / Blue Arrow Signs ─────────────── */
interface ArrowSignProps {
  lines: string[]
  bgColor: string
  textColor: string
  direction: 'right' | 'left'
  delay?: number
  rotate?: number
  width?: number
  height?: number
  fontSize?: number
}

function ArrowSign({
  lines,
  bgColor,
  textColor,
  direction,
  delay = 0,
  rotate = 0,
  width = 320,
  height = 68,
  fontSize = 13,
}: ArrowSignProps) {
  const tip = height / 2
  const shaft = direction === 'right' ? width - tip : width - tip

  // Arrow polygon: right-pointing or left-pointing
  const pts =
    direction === 'right'
      ? `0,0 ${shaft},0 ${width},${tip} ${shaft},${height} 0,${height}`
      : `${tip},0 ${width},0 ${width},${height} ${tip},${height} 0,${tip}`

  // Bolt positions
  const boltY = tip
  const bolt1X = direction === 'right' ? 18 : tip + 18
  const bolt2X = direction === 'right' ? shaft - 16 : width - 18

  // Text centred in the sign body (excluding the arrow tip area)
  const textX = direction === 'right' ? shaft / 2 : (tip + width) / 2

  return (
    <Float delay={delay} amplitude={3.5} duration={5 + delay}>
      <motion.div
        initial={{ opacity: 0, x: direction === 'right' ? -24 : 24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
        style={{ transform: `rotate(${rotate}deg)` }}
      >
        <svg
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          style={{ display: 'block', filter: 'drop-shadow(0 8px 28px rgba(0,0,0,0.22))' }}
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id={`sign-fill-${direction}-${bgColor.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={bgColor} stopOpacity="1" />
              <stop offset="100%" stopColor={bgColor} stopOpacity="0.88" />
            </linearGradient>
          </defs>
          {/* Sign body */}
          <polygon
            points={pts}
            fill={`url(#sign-fill-${direction}-${bgColor.replace('#', '')})`}
            stroke="rgba(0,0,0,0.18)"
            strokeWidth="1.5"
          />
          {/* Sheen highlight on top edge */}
          <polygon
            points={pts}
            fill="none"
            stroke="rgba(255,255,255,0.25)"
            strokeWidth="1"
          />
          {/* Bolt 1 */}
          <circle cx={bolt1X} cy={boltY} r="5.5" fill="rgba(0,0,0,0.2)" />
          <circle cx={bolt1X} cy={boltY} r="3.5" fill="rgba(255,255,255,0.35)" />
          <circle cx={bolt1X} cy={boltY} r="1.5" fill="rgba(0,0,0,0.3)" />
          {/* Bolt 2 */}
          <circle cx={bolt2X} cy={boltY} r="5.5" fill="rgba(0,0,0,0.2)" />
          <circle cx={bolt2X} cy={boltY} r="3.5" fill="rgba(255,255,255,0.35)" />
          <circle cx={bolt2X} cy={boltY} r="1.5" fill="rgba(0,0,0,0.3)" />
          {/* Text — multiline if needed */}
          {lines.map((line, i) => {
            const lineH = fontSize * 1.25
            const totalH = lines.length * lineH
            const startY = boltY - totalH / 2 + lineH / 2 + i * lineH
            return (
              <text
                key={i}
                x={textX}
                y={startY + 1}
                textAnchor="middle"
                dominantBaseline="middle"
                fill={textColor}
                fontSize={fontSize}
                fontWeight="900"
                fontFamily="Inter, -apple-system, sans-serif"
                letterSpacing="0.07em"
              >
                {line}
              </text>
            )
          })}
        </svg>
      </motion.div>
    </Float>
  )
}

/* ─── Chrome Circular Dish / Mirror ─────────── */
function ChromeDish() {
  return (
    <Float delay={0.4} amplitude={8} duration={5.5}>
      <motion.div
        initial={{ opacity: 0, scale: 0.82, rotate: -6 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ duration: 1, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        style={{
          width: 250,
          height: 250,
          borderRadius: '50%',
          position: 'relative',
        }}
      >
        {/* Outer chrome bezel */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            background:
              'conic-gradient(from 200deg, #9aa0b0, #dde0e8, #c8cdd8, #eef0f3, #a0a8b8, #d8dce4, #b0b8c8, #9aa0b0)',
            boxShadow:
              '0 24px 72px rgba(0,0,0,0.28), 0 8px 24px rgba(0,0,0,0.14), inset 0 3px 6px rgba(255,255,255,0.5)',
          }}
        />
        {/* Inner sky reflection */}
        <div
          style={{
            position: 'absolute',
            inset: '12px',
            borderRadius: '50%',
            overflow: 'hidden',
            background:
              'radial-gradient(ellipse at 42% 38%, #c0d8f0 0%, #8ab8e0 28%, #5896cc 52%, #2668b0 76%, #144888 100%)',
          }}
        >
          {/* Cloud puff 1 */}
          <div
            style={{
              position: 'absolute',
              top: '28%',
              left: '10%',
              width: '75%',
              height: '38%',
              background:
                'radial-gradient(ellipse, rgba(255,255,255,0.75) 0%, rgba(255,255,255,0.35) 45%, transparent 100%)',
              borderRadius: '50%',
              filter: 'blur(9px)',
            }}
          />
          {/* Cloud puff 2 */}
          <div
            style={{
              position: 'absolute',
              top: '52%',
              left: '28%',
              width: '48%',
              height: '28%',
              background:
                'radial-gradient(ellipse, rgba(255,255,255,0.55) 0%, transparent 70%)',
              borderRadius: '50%',
              filter: 'blur(6px)',
            }}
          />
          {/* Name + role text */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '3px',
            }}
          >
            <span
              style={{
                color: 'rgba(255,255,255,0.94)',
                fontSize: '21px',
                fontWeight: 800,
                fontFamily: 'Inter, sans-serif',
                letterSpacing: '0.05em',
                textShadow: '0 1px 10px rgba(0,0,60,0.4)',
              }}
            >
              PRANEETH G
            </span>
            <span
              style={{
                color: 'rgba(255,255,255,0.68)',
                fontSize: '7.5px',
                fontWeight: 500,
                fontFamily: 'Inter, sans-serif',
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
              }}
            >
              SOFTWARE ENGINEER
            </span>
            {/* Terminal chip */}
            <div
              style={{
                marginTop: '8px',
                background: 'rgba(0,0,0,0.72)',
                borderRadius: '6px',
                padding: '4px 10px',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <span
                style={{
                  color: '#50fa7b',
                  fontSize: '12px',
                  fontFamily: 'monospace',
                  fontWeight: 700,
                }}
              >
                &gt;_
              </span>
            </div>
          </div>
        </div>
        {/* Inner chrome ring highlight */}
        <div
          style={{
            position: 'absolute',
            inset: '6px',
            borderRadius: '50%',
            border: '1.5px solid rgba(255,255,255,0.4)',
            pointerEvents: 'none',
          }}
        />
      </motion.div>
    </Float>
  )
}

/* ─── Blue Whale ────────────────────────────── */
function BlueWhale() {
  return (
    <Float delay={0} amplitude={12} duration={6}>
      <motion.div
        initial={{ opacity: 0, y: -24, scale: 0.78 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1.0, delay: 0.0, ease: [0.22, 1, 0.36, 1] }}
        style={{ fontSize: '80px', lineHeight: 1, display: 'flex', alignItems: 'center' }}
        title="Blue Whale"
      >
        🐋
      </motion.div>
    </Float>
  )
}

/* ─── URL Badge ─────────────────────────────── */
function UrlBadge() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 1.3, ease: [0.22, 1, 0.36, 1] }}
      style={{
        background: '#1769FF',
        borderRadius: '8px',
        padding: '5px 12px',
        display: 'inline-block',
        boxShadow: '0 4px 16px rgba(23,105,255,0.35)',
      }}
    >
      <span
        style={{
          color: '#fff',
          fontSize: '11px',
          fontWeight: 700,
          fontFamily: 'Inter, sans-serif',
          letterSpacing: '0.04em',
        }}
      >
        praneethg.dev
      </span>
    </motion.div>
  )
}

/* ─── Server Rack SVG ───────────────────────── */
function ServerRack() {
  const units = [
    { y: 4, color: '#1a1a2e', led: '#00ff88' },
    { y: 18, color: '#16213e', led: '#00aaff' },
    { y: 32, color: '#0f3460', led: '#00aaff' },
    { y: 46, color: '#1a1a2e', led: '#00ff88' },
  ]
  return (
    <svg width="54" height="62" viewBox="0 0 60 62" fill="none">
      {units.map((u, i) => (
        <g key={i}>
          <rect x="4" y={u.y} width="52" height="12" rx="2.5" fill={u.color} />
          <circle cx="13" cy={u.y + 6} r="2.5" fill={u.led} />
          <circle cx="20" cy={u.y + 6} r="2.5" fill="rgba(255,255,255,0.15)" />
          <rect x="30" y={u.y + 3} width="20" height="6" rx="1" fill="rgba(255,255,255,0.07)" />
        </g>
      ))}
    </svg>
  )
}

/* ─── AI Cube SVG ───────────────────────────── */
function AICube() {
  return (
    <svg width="54" height="54" viewBox="0 0 54 54" fill="none">
      <defs>
        <linearGradient id="ai-cube-grad" x1="0" y1="0" x2="54" y2="54" gradientUnits="userSpaceOnUse">
          <stop stopColor="#5aabff" />
          <stop offset="1" stopColor="#1769FF" />
        </linearGradient>
      </defs>
      <rect x="3" y="3" width="48" height="48" rx="10" fill="url(#ai-cube-grad)" />
      <rect x="3" y="3" width="48" height="48" rx="10" stroke="rgba(255,255,255,0.28)" strokeWidth="1" fill="none" />
      <circle cx="11" cy="11" r="3" fill="rgba(255,255,255,0.28)" />
      <circle cx="43" cy="43" r="3" fill="rgba(255,255,255,0.18)" />
      <text
        x="27" y="33"
        textAnchor="middle"
        fill="white"
        fontSize="22"
        fontWeight="900"
        fontFamily="Inter, sans-serif"
        letterSpacing="-0.5"
      >
        AI
      </text>
    </svg>
  )
}

/* ═══════════════════════════════════════════════
   MAIN SIGNPOST SCENE
═══════════════════════════════════════════════ */
export default function SignpostScene() {
  // Scene dimensions — pole is at 40% from left so dish has space on the left
  const SCENE_W = 580
  const SCENE_H = 820
  const POLE_X = 230   // pole centre x — puts shelves on right, dish on left
  const POLE_W = 28

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'visible',
      }}
      role="img"
      aria-label="3D signpost illustration — Praneeth G's specialisms"
    >
      <div
        style={{
          position: 'relative',
          width: SCENE_W,
          height: SCENE_H,
          flexShrink: 0,
        }}
      >
        {/* ── Chrome Pole ───────────────────── */}
        <motion.div
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 0.8, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
          style={{
            position: 'absolute',
            left: POLE_X - POLE_W / 2,
            top: 60,
            bottom: 40,
            width: POLE_W,
            background:
              'linear-gradient(90deg, #8c929e 0%, #c4c9d4 20%, #e8eaf0 42%, #d4d8e2 58%, #b0b6c2 80%, #9098a8 100%)',
            boxShadow:
              '4px 0 18px rgba(0,0,0,0.13), -2px 0 6px rgba(0,0,0,0.06)',
            borderRadius: '15px',
          }}
        />

        {/* ── Blue Whale at top ────────────────── */}
        <div
          style={{
            position: 'absolute',
            top: -30,
            left: 0,
            right: 0,
            display: 'flex',
            justifyContent: 'center',
            zIndex: 20,
          }}
        >
          <BlueWhale />
        </div>

        {/* ── Yellow "SOFTWARE ENGINEER" sign ──── */}
        {/* Points right (east), sits just below whale */}
        <div
          style={{
            position: 'absolute',
            top: 82,
            left: POLE_X - 10,
            zIndex: 12,
          }}
        >
          <ArrowSign
            lines={['SOFTWARE ENGINEER']}
            bgColor="#FFDE00"
            textColor="#111111"
            direction="right"
            delay={0.3}
            rotate={-1.5}
            width={300}
            height={66}
            fontSize={14}
          />
        </div>

        {/* ── Chrome Dish (left of pole, mid-height) */}
        <div
          style={{
            position: 'absolute',
            top: 190,
            left: 0,
            zIndex: 8,
          }}
        >
          <ChromeDish />
        </div>

        {/* ── Shelf 1: Server Rack ──────────── */}
        <div style={{ position: 'absolute', top: 180, left: POLE_X + POLE_W / 2, zIndex: 10 }}>
          <Shelf delay={0.45}>
            <ServerRack />
          </Shelf>
        </div>

        {/* ── Shelf 2: AI Cube ──────────────── */}
        <div style={{ position: 'absolute', top: 285, left: POLE_X + POLE_W / 2, zIndex: 10 }}>
          <Shelf delay={0.6}>
            <AICube />
          </Shelf>
        </div>

        {/* ── Shelf 3: Linux Penguin ────────── */}
        <div style={{ position: 'absolute', top: 388, left: POLE_X + POLE_W / 2, zIndex: 10 }}>
          <Shelf delay={0.75}>
            <span style={{ fontSize: '42px', lineHeight: 1 }}>🐧</span>
          </Shelf>
        </div>

        {/* ── Blue "DATA ENGINEERING…" sign ────── */}
        {/* Left-pointing arrow — sits to the LEFT of the pole */}
        <div
          style={{
            position: 'absolute',
            top: 435,
            left: 0,
            zIndex: 12,
          }}
        >
          <ArrowSign
            lines={['DATA ENGINEERING / AI / NLP /', 'SYSTEMS ENGINEERING']}
            bgColor="#1769FF"
            textColor="#ffffff"
            direction="left"
            delay={0.5}
            rotate={2}
            width={240}
            height={70}
            fontSize={10}
          />
        </div>

        {/* ── Shelf 4: DNA ──────────────────── */}
        <div style={{ position: 'absolute', top: 500, left: POLE_X + POLE_W / 2, zIndex: 10 }}>
          <Shelf delay={0.9}>
            <span style={{ fontSize: '40px', lineHeight: 1 }}>🧬</span>
          </Shelf>
        </div>

        {/* ── Shelf 5: Tea Cup ──────────────── */}
        <div style={{ position: 'absolute', top: 608, left: POLE_X + POLE_W / 2, zIndex: 10 }}>
          <Shelf delay={1.05}>
            <span style={{ fontSize: '40px', lineHeight: 1 }}>☕</span>
          </Shelf>
        </div>

        {/* ── URL Badge ────────────────────── */}
        <div
          style={{
            position: 'absolute',
            bottom: 60,
            left: POLE_X - 56,
            zIndex: 20,
          }}
        >
          <UrlBadge />
        </div>

        {/* Ground shadow */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: '240px',
            height: '24px',
            background:
              'radial-gradient(ellipse, rgba(0,0,0,0.1) 0%, transparent 70%)',
            borderRadius: '50%',
            zIndex: 0,
          }}
        />
      </div>
    </div>
  )
}
