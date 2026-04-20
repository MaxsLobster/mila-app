import { NavLink } from 'react-router-dom'
import { Home, Calendar, BookOpen, ShoppingCart, Snowflake } from 'lucide-react'

const items = [
  { to: '/', label: 'Heute', icon: Home, end: true },
  { to: '/woche', label: 'Woche', icon: Calendar },
  { to: '/rezepte', label: 'Rezepte', icon: BookOpen },
  { to: '/einkauf', label: 'Einkauf', icon: ShoppingCart },
  { to: '/vorrat', label: 'Vorrat', icon: Snowflake },
]

export default function BottomNav() {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-cream/95 backdrop-blur border-t border-black/5 z-40">
      <div className="flex justify-around items-center h-16 px-1 pb-[env(safe-area-inset-bottom)]">
        {items.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center gap-0.5 flex-1 h-full transition-colors ${
                isActive ? 'text-terracotta' : 'text-ink/45'
              }`
            }
          >
            <Icon size={22} strokeWidth={2} />
            <span className="text-[10px] font-medium tracking-wide">{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
