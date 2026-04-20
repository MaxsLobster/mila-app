import { Clock, ChefHat, ShoppingCart, Sparkles } from 'lucide-react'
import { todayPlan, pantryExpiring, shoppingOpen } from '../mock/today'

const wochentage = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag']

function expireTone(days) {
  if (days <= 2) return 'bg-red-100 text-red-700'
  if (days <= 5) return 'bg-amber-100 text-amber-800'
  return 'bg-sage/20 text-ink/70'
}

export default function Home() {
  const now = new Date()
  const datum = now.toLocaleDateString('de-DE', { day: 'numeric', month: 'long' })
  const tag = wochentage[now.getDay()]

  return (
    <div className="space-y-7">
      <header>
        <p className="text-[11px] text-ink/50 uppercase tracking-[0.15em] font-semibold">{tag}</p>
        <h1 className="text-[32px] md:text-4xl font-semibold tracking-tight mt-1 leading-none">{datum}</h1>
      </header>

      {/* Heute auf dem Plan */}
      <section>
        <h2 className="text-[11px] uppercase tracking-[0.15em] text-ink/50 font-semibold mb-3 px-1">
          Heute auf dem Plan
        </h2>
        <article className="bg-white rounded-2xl overflow-hidden border border-black/5 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
          <div className="aspect-[16/9] bg-gradient-to-br from-terracotta-soft via-terracotta/30 to-sage-soft flex items-center justify-center">
            <ChefHat size={56} strokeWidth={1.5} className="text-white/70" />
          </div>
          <div className="p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h3 className="text-xl font-semibold leading-tight">{todayPlan.name}</h3>
                <div className="flex items-center gap-2 mt-2 text-sm text-ink/55">
                  <Clock size={14} strokeWidth={2.2} />
                  <span>{todayPlan.time_min} min</span>
                  <span aria-hidden className="text-ink/30">·</span>
                  <span>{todayPlan.mode}</span>
                </div>
              </div>
              {todayPlan.valerie && (
                <span className="text-[11px] font-medium px-2.5 py-1 bg-sage/20 text-ink/80 rounded-full shrink-0">
                  Valerie ✓
                </span>
              )}
            </div>
            <div className="flex gap-2 mt-5">
              <button className="flex-1 bg-terracotta text-cream font-medium py-3 rounded-xl hover:brightness-95 active:brightness-90 transition">
                Rezept anzeigen
              </button>
              <button className="px-4 py-3 border border-black/10 rounded-xl hover:bg-black/[0.03] active:bg-black/[0.06] transition text-sm font-medium text-ink/75">
                Aus Vorrat
              </button>
            </div>
          </div>
        </article>
      </section>

      {/* Vorrat-Check */}
      <section>
        <h2 className="text-[11px] uppercase tracking-[0.15em] text-ink/50 font-semibold mb-3 px-1">
          Vorrat-Check
        </h2>
        <div className="bg-white rounded-2xl border border-black/5 divide-y divide-black/5 overflow-hidden">
          {pantryExpiring.map((item) => (
            <div key={item.id} className="flex items-center justify-between px-5 py-3.5">
              <div className="min-w-0">
                <p className="font-medium leading-tight">{item.name}</p>
                <p className="text-xs text-ink/50 mt-0.5">{item.location} · {item.amount}</p>
              </div>
              <span className={`text-[11px] font-medium px-2.5 py-1 rounded-full shrink-0 ${expireTone(item.daysLeft)}`}>
                in {item.daysLeft} {item.daysLeft === 1 ? 'Tag' : 'Tagen'}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Einkaufsliste */}
      <section>
        <h2 className="text-[11px] uppercase tracking-[0.15em] text-ink/50 font-semibold mb-3 px-1">
          Noch einzukaufen
        </h2>
        <button className="w-full bg-white rounded-2xl p-5 border border-black/5 flex items-center gap-4 hover:border-terracotta/30 active:bg-black/[0.02] transition text-left">
          <div className="w-11 h-11 bg-terracotta/10 rounded-xl flex items-center justify-center shrink-0">
            <ShoppingCart size={20} className="text-terracotta" strokeWidth={2} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium">{shoppingOpen.count} Artikel offen</p>
            <p className="text-sm text-ink/55 truncate">{shoppingOpen.preview}</p>
          </div>
          <span className="text-ink/30 text-xl leading-none">›</span>
        </button>
      </section>

      {/* Freestyle Quick Action */}
      <section>
        <button className="w-full bg-gradient-to-br from-terracotta/8 to-sage/10 rounded-2xl p-5 border border-terracotta/15 flex items-center gap-4 hover:from-terracotta/12 hover:to-sage/14 active:brightness-95 transition text-left">
          <div className="w-11 h-11 bg-white rounded-xl flex items-center justify-center shrink-0 shadow-sm">
            <Sparkles size={20} className="text-terracotta" strokeWidth={2} />
          </div>
          <div className="flex-1">
            <p className="font-medium">Was hab ich da?</p>
            <p className="text-sm text-ink/60">Freestyle-Vorschlag aus Vorrat <span className="text-ink/40">(bald)</span></p>
          </div>
        </button>
      </section>
    </div>
  )
}
