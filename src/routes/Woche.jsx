import { useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import {
  DAY_KEYS,
  getISOWeek,
  formatWeekKey,
  getDatesOfWeek,
  addWeeks,
  isSameDay,
  formatWeekRange,
} from '../lib/date'
import { useMealplan, useAllRecipes, setMealplanSlot, setMealplanMode, clearMealplanSlot } from '../db/hooks'
import DayCard from '../components/week/DayCard'
import RecipePicker from '../components/week/RecipePicker'

export default function Woche() {
  const today = useMemo(() => new Date(), [])
  const [cursor, setCursor] = useState(() => getISOWeek(today))
  const weekKey = formatWeekKey(cursor)
  const plan = useMealplan(weekKey)
  const recipes = useAllRecipes()

  const [picker, setPicker] = useState(null) // { dayKey, slot }

  const dates = useMemo(() => getDatesOfWeek(cursor.year, cursor.week), [cursor])

  const recipesById = useMemo(() => {
    if (!recipes) return {}
    const map = {}
    for (const r of recipes) map[r.id] = r
    return map
  }, [recipes])

  const isCurrentWeek = useMemo(() => {
    const now = getISOWeek(today)
    return now.year === cursor.year && now.week === cursor.week
  }, [today, cursor])

  async function handlePick(recipe) {
    if (!picker) return
    await setMealplanSlot(weekKey, picker.dayKey, picker.slot, recipe.id)
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <header className="flex items-end justify-between gap-3">
        <div>
          <p className="text-[11px] text-ink/50 uppercase tracking-[0.15em] font-semibold">
            KW {String(cursor.week).padStart(2, '0')}
          </p>
          <h1 className="text-[32px] md:text-4xl font-semibold tracking-tight mt-1 leading-none">
            {formatWeekRange(dates)}
          </h1>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <NavBtn onClick={() => setCursor((c) => addWeeks(c, -1))} aria-label="Vorherige Woche">
            <ChevronLeft size={18} />
          </NavBtn>
          {!isCurrentWeek && (
            <button
              onClick={() => setCursor(getISOWeek(new Date()))}
              className="px-3 py-2 text-xs font-medium text-terracotta hover:bg-terracotta/10 rounded-xl transition"
            >
              Heute
            </button>
          )}
          <NavBtn onClick={() => setCursor((c) => addWeeks(c, 1))} aria-label="Nächste Woche">
            <ChevronRight size={18} />
          </NavBtn>
        </div>
      </header>

      {/* Days */}
      <div className="space-y-2.5">
        {DAY_KEYS.map((dayKey, i) => {
          const date = dates[i]
          const isToday = isSameDay(date, today)
          const day = plan?.days?.[dayKey]
          return (
            <DayCard
              key={dayKey}
              dayKey={dayKey}
              date={date}
              isToday={isToday}
              day={day}
              recipes={recipesById}
              onPickSlot={(slot) => setPicker({ dayKey, slot })}
              onClearSlot={(slot) => clearMealplanSlot(weekKey, dayKey, slot)}
              onChangeMode={(mode) => setMealplanMode(weekKey, dayKey, mode)}
            />
          )
        })}
      </div>

      {/* Picker */}
      <RecipePicker
        open={Boolean(picker)}
        onClose={() => setPicker(null)}
        onSelect={handlePick}
        title={
          picker
            ? `${picker.slot === 'mittag' ? 'Mittag' : 'Abend'} · ${
                DAY_KEYS.find((k) => k === picker.dayKey) ? dayLabelWithDate(picker.dayKey, dates) : ''
              }`
            : 'Rezept auswählen'
        }
      />
    </div>
  )
}

function NavBtn({ children, ...props }) {
  return (
    <button
      {...props}
      className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-black/5 text-ink/70 transition"
    >
      {children}
    </button>
  )
}

function dayLabelWithDate(dayKey, dates) {
  const idx = DAY_KEYS.indexOf(dayKey)
  if (idx < 0) return ''
  const d = dates[idx]
  return d.toLocaleDateString('de-DE', { weekday: 'short', day: 'numeric', month: 'short' })
}
