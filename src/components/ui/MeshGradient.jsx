import { useEffect, useRef } from 'react'

const VARIANTS = {
  warm:         ['#E8A77C', '#C87D5A', '#C3D0AA'],
  italienisch:  ['#E89B6B', '#D4846A', '#A3B18A'],
  asiatisch:    ['#C8D4A0', '#D4BC7C', '#C87D5A'],
  levante:      ['#D4A67C', '#C4A05A', '#C4B087'],
  mediterran:   ['#A8BAC4', '#A3B18A', '#D4A67C'],
  fusion:       ['#C87D5A', '#A3B18A', '#9E8CA8'],
  sage:         ['#B8C4A0', '#C3D0AA', '#E8D5AB'],
  dusk:         ['#B49CB8', '#C87D5A', '#A3B18A'],
}

// Tints by time of day: morning fresh, noon warm, evening deeper, night cool
function timeOfDayShift(hour) {
  if (hour >= 5 && hour < 10)  return { hueRotate: -8, saturation: 1.05, brightness: 1.02 } // dawn – slightly cool, crisp
  if (hour >= 10 && hour < 15) return { hueRotate: 0,  saturation: 1.00, brightness: 1.00 } // midday – neutral
  if (hour >= 15 && hour < 18) return { hueRotate: 4,  saturation: 1.05, brightness: 0.98 } // afternoon – warm golden
  if (hour >= 18 && hour < 21) return { hueRotate: 12, saturation: 1.10, brightness: 0.94 } // dusk – deeper warm
  return { hueRotate: -15, saturation: 0.85, brightness: 0.82 }                              // night – cool, moody
}

export default function MeshGradient({
  variant = 'warm',
  animated = true,
  interactive = false,
  timeAware = true,
  className = '',
}) {
  const colors = VARIANTS[variant] ?? VARIANTS.warm
  const containerRef = useRef(null)
  const blobsRef = useRef([])
  const pointerRef = useRef({ x: 0.5, y: 0.5, targetX: 0.5, targetY: 0.5 })
  const tRef = useRef(Math.random() * 100)

  // Time-of-day filter
  const tint = timeAware ? timeOfDayShift(new Date().getHours()) : { hueRotate: 0, saturation: 1, brightness: 1 }
  const filterCss = `hue-rotate(${tint.hueRotate}deg) saturate(${tint.saturation}) brightness(${tint.brightness})`

  // RAF-driven continuous motion + pointer parallax
  useEffect(() => {
    if (!animated) return
    let raf = 0

    function tick() {
      tRef.current += 0.006
      const t = tRef.current

      // Ease pointer toward target for smooth parallax
      pointerRef.current.x += (pointerRef.current.targetX - pointerRef.current.x) * 0.06
      pointerRef.current.y += (pointerRef.current.targetY - pointerRef.current.y) * 0.06
      const px = (pointerRef.current.x - 0.5) * 2   // -1..1
      const py = (pointerRef.current.y - 0.5) * 2

      const blobs = blobsRef.current
      if (blobs[0]) {
        const x = Math.sin(t) * 18 + px * (interactive ? 12 : 0)
        const y = Math.cos(t * 0.7) * 14 + py * (interactive ? 10 : 0)
        const s = 1 + Math.sin(t * 0.5) * 0.10
        blobs[0].style.transform = `translate3d(${x}%, ${y}%, 0) scale(${s})`
      }
      if (blobs[1]) {
        const x = Math.cos(t * 0.8) * -20 - px * (interactive ? 14 : 0)
        const y = Math.sin(t * 0.6) * 18 - py * (interactive ? 8 : 0)
        const s = 1 + Math.cos(t * 0.4) * 0.08
        blobs[1].style.transform = `translate3d(${x}%, ${y}%, 0) scale(${s})`
      }
      if (blobs[2]) {
        const x = Math.sin(t * 0.5) * 14 + px * (interactive ? 6 : 0)
        const y = Math.cos(t * 0.9) * -16 + py * (interactive ? 14 : 0)
        const s = 1 + Math.sin(t * 0.7) * 0.12
        blobs[2].style.transform = `translate3d(${x}%, ${y}%, 0) scale(${s})`
      }
      raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [animated, interactive])

  // Pointer tracking
  useEffect(() => {
    if (!interactive) return
    const el = containerRef.current
    if (!el) return

    function handlePointer(e) {
      const rect = el.getBoundingClientRect()
      const x = (e.clientX - rect.left) / rect.width
      const y = (e.clientY - rect.top) / rect.height
      pointerRef.current.targetX = Math.max(0, Math.min(1, x))
      pointerRef.current.targetY = Math.max(0, Math.min(1, y))
    }

    function reset() {
      pointerRef.current.targetX = 0.5
      pointerRef.current.targetY = 0.5
    }

    const parent = el.closest('[data-mesh-host]') ?? el.parentElement
    parent?.addEventListener('pointermove', handlePointer)
    parent?.addEventListener('pointerleave', reset)
    return () => {
      parent?.removeEventListener('pointermove', handlePointer)
      parent?.removeEventListener('pointerleave', reset)
    }
  }, [interactive])

  return (
    <div
      ref={containerRef}
      className={`mesh-wrap ${className}`}
      style={{ filter: filterCss }}
      aria-hidden
    >
      <div
        ref={(el) => { if (el) blobsRef.current[0] = el }}
        className="mesh-blob mesh-blob-1"
        style={{ background: colors[0] }}
      />
      <div
        ref={(el) => { if (el) blobsRef.current[1] = el }}
        className="mesh-blob mesh-blob-2"
        style={{ background: colors[1] }}
      />
      <div
        ref={(el) => { if (el) blobsRef.current[2] = el }}
        className="mesh-blob mesh-blob-3"
        style={{ background: colors[2] }}
      />
    </div>
  )
}

export function variantForCuisine(cuisine) {
  return VARIANTS[cuisine] ? cuisine : 'warm'
}
