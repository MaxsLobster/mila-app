import { Link } from 'react-router-dom'
import { Clock, ChefHat, ShoppingCart, Sparkles, Moon, Calendar } from 'lucide-react'
import { useTodayMealplan, useRecipe } from '../db/hooks'
import { formatTime } from '../lib/recipe'
import { DAY_LABELS_LONG } from '../lib/date'
import { DAY_MODES } from '../lib/mealplan'
import { pantryExpiring, shoppingOpen } from '../mock/today'

export default function Home() {
  const now = new Date()
  const datum = now.toLocaleDateString('de-DE', { day: 'numeric', month: 'long' })
  const today = useTodayMealplan()
  const mittag = useRecipe(today.day?.mittag)
  const abend = useRecipe(today.day?.abend)

  // Pick primary (mittag preferred, fallback abend)
  const primary = mittag || abend
  const secondary = mittag && abend ? abend : null

  return (
    <div className="space-y-7">
      <header>
        <p className="text-[11px] text-ink/50 uppercase tracking-[0.15em] font-semibold">
          {DAY_LABELS_LONG[today.dayKey]}
        </p>
        <h1 className="text-[32px] md:text-4xl font-semibold tracking-tight mt-1 leading-none">{datum}</h1>
      </header>

      {/* Heute auf dem Plan */}
      <section>
        <div className="flex items-center justify-between mb-3 px-1">
          <h2 className="text-[11px] uppercase tracking-[0.15em] text-ink/50 font-semibold">
            Heute auf dem Plan
          </h2>
          {today.day?.mode && (
            <span className="text-[11px] font-medium px-2 py-0.5 bg-terracotta/10 text-terracotta rounded-full">
              {DAY_MODES[today.day.mode].emoji} {DAY_MODES[today.day.mode].label}
            </span>
          )}
        </div>

        {today.loading ? (
          <div className="bg-white rounded-2xl border border-black/5 aspect-[16/10] animate-pulse" />
        ) : primary ? (
          <>
            <TodayCard
              recipe={primary}
              slotLabel={mittag ? 'Mittag' : 'Abend'}
            />
            {secondary && (
              <Link
                to={`/rezepte/${secondary.id}`}
                className="mt-2 w-full bg-white rounded-2xl p-4 border border-black/5 flex items-center gap-3 hover:border-terracotta/30 transition group"
              >
                <div className="w-10 h-10 rounded-xl bg-sage/15 flex items-center justify-center shrink-0">
                  <Moon size={17} className="text-sage" strokeWidth={2} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] uppercase tracking-wider text-ink/50 font-semibold">Abends</p>
                  <p className="font-medium leading-tight truncate">{secondary.name}</p>
                </div>
                <span className="text-ink/30">›</span>
              </Link>
            )}
          </>
        ) : (
          <EmptyPlanCard />
        )}
      </section>

      {/* Vorrat-Check (mock bis M5) */}
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
              <span className={`text-[11px] font-medium px-2.5 py-1 rounded-full shrink-0 ${
                item.daysLeft <= 2 ? 'bg-red-100 text-red-700'
                  : item.daysLeft <= 5 ? 'bg-amber-100 text-amber-800'
                  : 'bg-sage/20 text-ink/70'
              }`}>
                in {item.daysLeft} {item.daysLeft === 1 ? 'Tag' : 'Tagen'}
              </span>
            </div>
          ))}
        </div>
        <p className="text-xs text-ink/35 mt-2 px-1">Mock-Daten – echter Vorrat in M5.</p>
      </section>

      {/* Einkaufsliste (mock bis M4) */}
      <section>
        <h2 className="text-[11px] uppercase tracking-[0.15em] text-ink/50 font-semibold mb-3 px-1">
          Noch einzukaufen
        </h2>
        <Link
          to="/einkauf"
          className="w-full bg-white rounded-2xl p-5 border border-black/5 flex items-center gap-4 hover:border-terracotta/30 transition"
        >
          <div className="w-11 h-11 bg-terracotta/10 rounded-xl flex items-center justify-center shrink-0">
            <ShoppingCart size={20} className="text-terracotta" strokeWidth={2} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium">{shoppingOpen.count} Artikel offen</p>
            <p className="text-sm text-ink/55 truncate">{shoppingOpen.preview}</p>
          </div>
          <span className="text-ink/30 text-xl leading-none">›</span>
        </Link>
      </section>

      {/* Freestyle */}
      <section>
        <button className="w-full bg-gradient-to-br from-terracotta/8 to-sage/10 rounded-2xl p-5 border border-terracotta/15 flex items-center gap-4 hover:from-terracotta/12 hover:to-sage/14 transition text-left">
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

function TodayCard({ recipe, slotLabel }) {
  return (
    <article className="bg-white rounded-2xl overflow-hidden border border-black/5 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
      <div className="aspect-[16/9] bg-gradient-to-br from-terracotta-soft via-terracotta/30 to-sage-soft flex items-center justify-center">
        <ChefHat size={56} strokeWidth={1.5} className="text-white/70" />
      </div>
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[11px] uppercase tracking-wider font-semibold text-ink/45 mb-1">{slotLabel}</p>
            <h3 className="text-xl font-semibold leading-tight">{recipe.name}</h3>
            <div className="flex items-center gap-2 mt-2 text-sm text-ink/55">
              <Clock size={14} strokeWidth={2.2} />
              <span>{formatTime(recipe.time_min)}</span>
              <span className="text-ink/30">·</span>
              <span>{recipe.portions} Portionen</span>
            </div>
          </div>
          {recipe.valerie_tauglich && (
            <span className="text-[11px] font-medium px-2.5 py-1 bg-sage/20 text-ink/80 rounded-full shrink-0">
              Valerie ✓
            </span>
          )}
        </div>
        <div className="flex gap-2 mt-5">
          <Link
            to={`/rezepte/${recipe.id}`}
            className="flex-1 bg-terracotta text-cream font-medium py-3 rounded-xl hover:brightness-95 transition text-center"
          >
            Rezept anzeigen
          </Link>
          <Link
            to={`/rezepte/${recipe.id}/kochen`}
            className="px-4 py-3 border border-black/10 rounded-xl hover:bg-black/[0.03] transition text-sm font-medium text-ink/75"
          >
            Kochen
          </Link>
        </div>
      </div>
    </article>
  )
}

function EmptyPlanCard() {
  return (
    <div className="bg-white rounded-2xl border border-black/5 p-8 text-center">
      <div className="w-14 h-14 rounded-2xl bg-terracotta/10 text-terracotta flex items-center justify-center mx-auto mb-4">
        <Calendar size={24} strokeWidth={1.8} />
      </div>
      <p className="font-medium">Für heute ist nichts geplant</p>
      <p className="text-sm text-ink/55 mt-1.5 mb-5 max-w-sm mx-auto">
        Öffne die Wochenansicht und weise dem heutigen Tag ein Rezept zu.
      </p>
      <Link
        to="/woche"
        className="inline-block bg-terracotta text-cream font-medium px-5 py-2.5 rounded-xl hover:brightness-95 transition"
      >
        Zur Wochenansicht
      </Link>
    </div>
  )
}
