import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Home, Calendar, BookOpen, ShoppingCart, Snowflake } from 'lucide-react'

const items = [
  { to: '/', label: 'Heute', icon: Home, match: (p) => p === '/' },
  { to: '/woche', label: 'Woche', icon: Calendar, match: (p) => p.startsWith('/woche') },
  { to: '/rezepte', label: 'Rezepte', icon: BookOpen, match: (p) => p.startsWith('/rezepte') },
  { to: '/einkauf', label: 'Einkauf', icon: ShoppingCart, match: (p) => p.startsWith('/einkauf') },
  { to: '/vorrat', label: 'Vorrat', icon: Snowflake, match: (p) => p.startsWith('/vorrat') },
]

export default function BottomNav() {
  const location = useLocation()
  const navigate = useNavigate()
  const containerRef = useRef(null)
  const itemRefs = useRef([])
  const [indicator, setIndicator] = useState(null)
  const prevIndexRef = useRef(0)

  const activeIndex = items.findIndex((it) => it.match(location.pathname))

  useEffect(() => {
    if (activeIndex < 0) return
    const el = itemRefs.current[activeIndex]
    const container = containerRef.current
    if (!el || !container) return

    const elRect = el.getBoundingClientRect()
    const containerRect = container.getBoundingClientRect()
    const centerX = elRect.left + elRect.width / 2 - containerRect.left
    const centerY = elRect.top + elRect.height / 2 - containerRect.top

    // Stretch horizontally in direction of motion, then settle back
    const direction = activeIndex - prevIndexRef.current
    const distance = Math.abs(direction)
    prevIndexRef.current = activeIndex

    if (distance > 0) {
      const stretchX = Math.min(1 + distance * 0.35, 2.4)
      const skew = direction > 0 ? -4 : 4
      // Phase 1: stretch toward target
      setIndicator({ x: centerX, y: centerY, scaleX: stretchX, scaleY: 0.7, skew, phase: 'stretch' })
      // Phase 2: settle
      setTimeout(() => {
        setIndicator({ x: centerX, y: centerY, scaleX: 1, scaleY: 1, skew: 0, phase: 'settle' })
      }, 180)
    } else {
      setIndicator({ x: centerX, y: centerY, scaleX: 1, scaleY: 1, skew: 0, phase: 'idle' })
    }
  }, [activeIndex, location.pathname])

  return (
    <nav
      ref={containerRef}
      className="md:hidden fixed bottom-0 left-0 right-0 bg-cream/90 backdrop-blur-md border-t border-black/5 z-40"
      style={{ filter: 'url(#nav-goo)' }}
    >
      {/* Gooey blob indicator */}
      {indicator && (
        <span
          className="absolute pointer-events-none"
          style={{
            left: indicator.x - 22,
            top: indicator.y - 22,
            width: 44,
            height: 44,
            borderRadius: '50%',
            background: 'var(--color-terracotta)',
            opacity: 0.15,
            transform: `scaleX(${indicator.scaleX}) scaleY(${indicator.scaleY}) skewX(${indicator.skew}deg)`,
            transition: indicator.phase === 'stretch'
              ? 'transform 180ms cubic-bezier(0.25, 0.9, 0.3, 1), left 300ms cubic-bezier(0.25, 0.9, 0.3, 1), top 180ms ease'
              : 'transform 280ms cubic-bezier(0.34, 1.56, 0.64, 1), left 0ms, top 0ms',
          }}
        />
      )}

      <div className="flex justify-around items-center h-16 px-1 pb-[env(safe-area-inset-bottom)] relative">
        {items.map(({ to, label, icon: Icon, match }, i) => {
          const isActive = match(location.pathname)
          return (
            <button
              key={to}
              ref={(el) => { itemRefs.current[i] = el }}
              onClick={() => navigate(to)}
              className={`flex flex-col items-center justify-center gap-0.5 flex-1 h-full transition-colors relative z-10 ${
                isActive ? 'text-terracotta' : 'text-ink/45'
              }`}
            >
              <Icon size={22} strokeWidth={isActive ? 2.2 : 2} />
              <span className="text-[10px] font-medium tracking-wide">{label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
