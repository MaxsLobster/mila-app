import { db } from '../db/schema'
import { DAY_KEYS, getISOWeek, formatWeekKey } from './date'

/**
 * Mila's default rhythm (from briefing):
 *   Mo Kochtag · Di Aus Prep · Mi Frisch · Do Aus Prep
 *   Fr Frisch · Sa Grill · So Frei/Ofen
 */
export const DEFAULT_RHYTHM = {
  mo: { mode: 'mealprep_cook_day' },
  di: { mode: 'from_prep' },
  mi: { mode: 'fresh' },
  do: { mode: 'from_prep' },
  fr: { mode: 'fresh' },
  sa: { mode: 'grill' },
  so: { mode: 'frei' },
}

export function buildSkeletonDays() {
  const days = {}
  for (const key of DAY_KEYS) {
    days[key] = { ...DEFAULT_RHYTHM[key] }
  }
  return days
}

/**
 * Creates a skeleton mealplan for the given week key if none exists yet.
 * Returns { created: boolean, plan }.
 */
export async function ensureSkeletonWeek(weekKey) {
  const existing = await db.mealplan.get(weekKey)
  if (existing) return { created: false, plan: existing }
  const plan = { week: weekKey, days: buildSkeletonDays(), skeleton: true }
  await db.mealplan.put(plan)
  return { created: true, plan }
}

export function currentWeekKey(date = new Date()) {
  return formatWeekKey(getISOWeek(date))
}
