import { NavLink } from 'react-router-dom'
import { Home, Calendar, BookOpen, ShoppingCart, Snowflake, Settings as SettingsIcon } from 'lucide-react'

const primary = [
  { to: '/', label: 'Heute', icon: Home, end: true },
  { to: '/woche', label: 'Woche', icon: Calendar },
  { to: '/rezepte', label: 'Rezepte', icon: BookOpen },
  { to: '/einkauf', label: 'Einkauf', icon: ShoppingCart },
  { to: '/vorrat', label: 'Vorrat', icon: Snowflake },
]

export default function Sidebar() {
  return (
    <aside className="hidden md:flex flex-col fixed top-0 left-0 bottom-0 w-64 bg-cream border-r border-black/5 p-6 z-30">
      <div className="mb-10">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-terracotta flex items-center justify-center">
            <span className="text-cream font-bold text-lg leading-none">M</span>
          </div>
          <div>
            <h1 className="text-xl font-semibold tracking-tight leading-tight">Mila</h1>
            <p className="text-[11px] text-ink/50 leading-tight">Familie Armborst</p>
          </div>
        </div>
      </div>

      <nav className="flex flex-col gap-1 flex-1">
        {primary.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors ${
                isActive
                  ? 'bg-terracotta/10 text-terracotta font-medium'
                  : 'text-ink/70 hover:bg-black/5'
              }`
            }
          >
            <Icon size={18} strokeWidth={2} />
            <span className="text-sm">{label}</span>
          </NavLink>
        ))}
      </nav>

      <NavLink
        to="/settings"
        className={({ isActive }) =>
          `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors ${
            isActive ? 'bg-terracotta/10 text-terracotta font-medium' : 'text-ink/60 hover:bg-black/5'
          }`
        }
      >
        <SettingsIcon size={18} strokeWidth={2} />
        <span className="text-sm">Settings</span>
      </NavLink>
    </aside>
  )
}
