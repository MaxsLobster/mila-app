import { Link } from 'react-router-dom'
import { X, Plus } from 'lucide-react'
import { DAY_LABELS_LONG, formatDayDate } from '../../lib/date'
import { DAY_MODES, MODE_KEYS, SLOTS, SLOT_LABELS } from '../../lib/mealplan'

export default function DayCard({
  dayKey,
  date,
  isToday,
  day,
  recipes,
  onPickSlot,
  onClearSlot,
  onChangeMode,
}) {
  return (
    <article
      className={`bg-white rounded-2xl border overflow-hidden transition ${
        isToday ? 'border-terracotta/40 shadow-[0_0_0_3px_rgba(200,125,90,0.08)]' : 'border-black/5'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3">
        <div>
          <div className="flex items-baseline gap-2.5">
            <h3 className={`text-[17px] font-semibold leading-tight ${isToday ? 'text-terracotta' : ''}`}>
              {DAY_LABELS_LONG[dayKey]}
            </h3>
            <span className="text-sm text-ink/50">{formatDayDate(date)}</span>
            {isToday && (
              <span className="text-[10px] uppercase font-bold tracking-wider text-terracotta bg-terracotta/10 px-1.5 py-0.5 rounded">
                Heute
              </span>
            )}
          </div>
        </div>

        {/* Mode select */}
        <div className="relative">
          <select
            value={day?.mode ?? ''}
            onChange={(e) => onChangeMode(e.target.value)}
            className={`appearance-none text-xs font-medium pr-7 pl-3 py-1.5 rounded-full cursor-pointer transition ${
              day?.mode
                ? 'bg-terracotta/10 text-terracotta border border-terracotta/20'
                : 'bg-black/[0.04] text-ink/55 border border-black/5 hover:border-black/15'
            }`}
          >
            <option value="">Modus</option>
            {MODE_KEYS.map((m) => (
              <option key={m} value={m}>{DAY_MODES[m].emoji} {DAY_MODES[m].label}</option>
            ))}
          </select>
          <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-current opacity-60">▾</span>
        </div>
      </div>

      {/* Slots */}
      <div className="border-t border-black/5 divide-y divide-black/5">
        {SLOTS.map((slot) => {
          const recipeId = day?.[slot]
          const recipe = recipeId ? recipes[recipeId] : null
          return (
            <div key={slot} className="flex items-center gap-3 px-5 py-3">
              <span className="text-[11px] uppercase tracking-wider font-semibold text-ink/40 w-12 shrink-0">
                {SLOT_LABELS[slot]}
              </span>
              {recipe ? (
                <>
                  <Link
                    to={`/rezepte/${recipe.id}`}
                    className="flex-1 min-w-0 font-medium hover:text-terracotta transition truncate"
                  >
                    {recipe.name}
                  </Link>
                  <button
                    onClick={() => onPickSlot(slot)}
                    className="text-xs text-ink/50 hover:text-ink px-2 py-1 rounded"
                  >
                    ändern
                  </button>
                  <button
                    onClick={() => onClearSlot(slot)}
                    className="p-1.5 rounded-lg hover:bg-black/5 text-ink/40 hover:text-red-600 transition"
                    aria-label="Entfernen"
                  >
                    <X size={15} />
                  </button>
                </>
              ) : recipeId ? (
                <span className="flex-1 text-sm text-ink/40 italic">Rezept gelöscht</span>
              ) : (
                <button
                  onClick={() => onPickSlot(slot)}
                  className="flex-1 flex items-center gap-1.5 text-sm text-ink/40 hover:text-terracotta transition text-left"
                >
                  <Plus size={14} strokeWidth={2.2} />
                  <span>Rezept wählen</span>
                </button>
              )}
            </div>
          )
        })}
      </div>
    </article>
  )
}
