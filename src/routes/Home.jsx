import { useMemo } from 'react'
import {
  useTodayMealplan,
  useRecipe,
  useShoppingItems,
  usePantryExpiring,
  useFreezerCubes,
  useEnsureCurrentWeek,
} from '../db/hooks'
import { DAY_LABELS_LONG } from '../lib/date'
import { generateBriefing, generateJetztWichtig, greetingForHour } from '../lib/briefing'
import BriefingCard from '../components/home/BriefingCard'
import TodayTimeline from '../components/home/TodayTimeline'
import JetztWichtig from '../components/home/JetztWichtig'
import PlanB from '../components/home/PlanB'

export default function Home() {
  useEnsureCurrentWeek()

  const now = new Date()
  const datum = now.toLocaleDateString('de-DE', { day: 'numeric', month: 'long' })
  const greeting = greetingForHour(now.getHours())

  const today = useTodayMealplan()
  const mittag = useRecipe(today.day?.mittag)
  const abend = useRecipe(today.day?.abend)
  const shopping = useShoppingItems()
  const expiring = usePantryExpiring(14)
  const cubes = useFreezerCubes()

  const openShopping = useMemo(
    () => (shopping ?? []).filter((i) => !i.checked),
    [shopping]
  )

  const briefing = useMemo(
    () => generateBriefing({
      today: { mittag, abend, mode: today.day?.mode },
      openShopping,
      cubes: cubes ?? [],
      expiring: expiring ?? [],
    }),
    [mittag, abend, today.day?.mode, openShopping, cubes, expiring]
  )

  const actions = useMemo(
    () => generateJetztWichtig({
      today: { mittag, abend, mode: today.day?.mode },
      openShopping,
      cubes: cubes ?? [],
      expiring: expiring ?? [],
    }),
    [mittag, abend, today.day?.mode, openShopping, cubes, expiring]
  )

  return (
    <div className="space-y-5">
      <header>
        <p className="text-[11px] text-ink/50 uppercase tracking-[0.15em] font-semibold">
          {greeting} · {DAY_LABELS_LONG[today.dayKey]}
        </p>
        <h1 className="text-[30px] md:text-4xl font-semibold tracking-tight mt-1 leading-none">{datum}</h1>
      </header>

      <BriefingCard briefing={briefing} />

      <TodayTimeline
        dayKey={today.dayKey}
        day={today.day}
        weekKey={today.weekKey}
        mittag={mittag}
        abend={abend}
      />

      <JetztWichtig actions={actions} />

      <PlanB
        cubes={cubes ?? []}
        weekKey={today.weekKey}
        dayKey={today.dayKey}
      />
    </div>
  )
}
