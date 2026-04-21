import BottomNav from './BottomNav'
import Sidebar from './Sidebar'

export default function AppShell({ children }) {
  return (
    <div className="min-h-[100dvh]">
      {/* Global SVG defs for goo filter (used by BottomNav) */}
      <svg className="absolute w-0 h-0 pointer-events-none" aria-hidden>
        <defs>
          <filter id="nav-goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0
                      0 1 0 0 0
                      0 0 1 0 0
                      0 0 0 22 -10"
              result="goo"
            />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>
      </svg>

      <Sidebar />
      <main className="pb-24 md:pb-10 md:pl-64">
        <div className="max-w-3xl mx-auto px-5 pt-6 md:pt-10">
          {children}
        </div>
      </main>
      <BottomNav />
    </div>
  )
}
