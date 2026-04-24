import { createContext, useContext, useEffect, useState } from 'react'

const MotionContext = createContext({
  setting: 'full',
  effective: 'full',
  setSetting: () => {},
})

const STORAGE_KEY = 'mila:motion'

export function MotionProvider({ children }) {
  const [setting, setSettingState] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) ?? 'full'
    } catch {
      return 'full'
    }
  })

  const [prefersReduced, setPrefersReduced] = useState(() => {
    if (typeof window === 'undefined') return false
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  })

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onChange = (e) => setPrefersReduced(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  // If user explicitly chose 'full' and OS says reduce, downgrade to 'reduced'.
  // If user chose 'reduced' or 'off', respect choice.
  const effective = prefersReduced && setting === 'full' ? 'reduced' : setting

  function setSetting(value) {
    setSettingState(value)
    try { localStorage.setItem(STORAGE_KEY, value) } catch { /* ignore */ }
  }

  // Apply global class for CSS-only components that need it
  useEffect(() => {
    document.documentElement.dataset.motion = effective
  }, [effective])

  return (
    <MotionContext.Provider value={{ setting, effective, setSetting, prefersReduced }}>
      {children}
    </MotionContext.Provider>
  )
}

export function useMotion() {
  return useContext(MotionContext)
}

// Convenience derived booleans
export function useMotionFlags() {
  const { effective } = useMotion()
  return {
    motion: effective,
    fluidAnimated: effective === 'full',      // WebGL shader animated
    fluidOn: effective !== 'off',              // show any mesh at all
    physicsOn: effective === 'full',           // Matter.js explosions
    tiltOn: effective === 'full',              // 3D card tilt
    transitionsOn: effective !== 'off',        // view transitions
  }
}
