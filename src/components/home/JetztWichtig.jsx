import { Link } from 'react-router-dom'
import { ShoppingCart, Snowflake, Clock, Thermometer, ChevronRight } from 'lucide-react'

const ICONS = {
  shopping: ShoppingCart,
  expiring: Clock,
  thaw: Thermometer,
  cube: Snowflake,
}

const ICON_TONES = {
  shopping: 'bg-terracotta/10 text-terracotta',
  expiring: 'bg-amber-100 text-amber-700',
  thaw: 'bg-sage/20 text-sage',
  cube: 'bg-[#AABCC4]/25 text-[#2E5C7B]',
}

export default function JetztWichtig({ actions }) {
  if (!actions || actions.length === 0) {
    return (
      <section>
        <h2 className="text-[11px] uppercase tracking-[0.15em] text-ink/50 font-semibold mb-3 px-1">
          Jetzt wichtig
        </h2>
        <div className="bg-white rounded-2xl border border-black/5 p-5 flex items-center gap-3">
          <span className="w-9 h-9 rounded-xl bg-sage/20 flex items-center justify-center shrink-0">
            <span className="text-sage text-lg leading-none">✓</span>
          </span>
          <p className="text-[15px] text-ink/70 leading-tight">Nix dringendes. Entspann dich.</p>
        </div>
      </section>
    )
  }

  return (
    <section>
      <h2 className="text-[11px] uppercase tracking-[0.15em] text-ink/50 font-semibold mb-3 px-1">
        Jetzt wichtig
      </h2>
      <div className="bg-white rounded-2xl border border-black/5 divide-y divide-black/5 overflow-hidden">
        {actions.map((action, i) => {
          const Icon = ICONS[action.icon] ?? ShoppingCart
          const tone = ICON_TONES[action.icon] ?? ICON_TONES.shopping
          const Element = action.to ? Link : 'div'
          const props = action.to ? { to: action.to } : {}
          return (
            <Element
              key={i}
              {...props}
              className="flex items-center gap-3 px-4 py-3 hover:bg-black/[0.02] transition"
            >
              <span className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${tone}`}>
                <Icon size={17} strokeWidth={2} />
              </span>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-[15px] leading-tight">{action.title}</p>
                {action.sub && <p className="text-xs text-ink/55 mt-0.5 truncate">{action.sub}</p>}
              </div>
              {action.to && <ChevronRight size={16} className="text-ink/25 shrink-0" />}
            </Element>
          )
        })}
      </div>
    </section>
  )
}
