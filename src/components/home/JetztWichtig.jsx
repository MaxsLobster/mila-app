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

const STATUS_STYLES = {
  safe:           'bg-sage/15 text-ink/75 border-sage/25',
  stabil:         'bg-sage/12 text-ink/75 border-sage/20',
  improvisierbar: 'bg-amber-50 text-amber-900/85 border-amber-200/60',
  dünn:           'bg-[#F0DBCF]/60 text-ink/75 border-terracotta/20',
}

export default function JetztWichtig({ actions, kuechenLage }) {
  if (!actions || actions.length === 0) {
    return (
      <section>
        <h2 className="text-[11px] uppercase tracking-[0.15em] text-ink/50 font-semibold mb-3 px-1">
          Heute im Blick
        </h2>
        <div className="bg-white rounded-2xl border border-black/5 p-5">
          <div className="flex items-center gap-3">
            <span className="w-9 h-9 rounded-xl bg-sage/20 flex items-center justify-center shrink-0">
              <span className="text-sage text-lg leading-none">✓</span>
            </span>
            <p className="text-[15px] text-ink/75 leading-snug">
              Alles ruhig. Du musst gerade nichts entscheiden.
            </p>
          </div>
          {kuechenLage && (
            <div
              className={`mt-4 text-[13px] leading-relaxed rounded-xl border px-3.5 py-2.5 ${
                STATUS_STYLES[kuechenLage.label] ?? STATUS_STYLES.safe
              }`}
            >
              <span className="font-semibold">Küchenlage: {kuechenLage.label}.</span>{' '}
              {kuechenLage.detail}
            </div>
          )}
        </div>
      </section>
    )
  }

  return (
    <section>
      <h2 className="text-[11px] uppercase tracking-[0.15em] text-ink/50 font-semibold mb-3 px-1">
        Heute im Blick
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
