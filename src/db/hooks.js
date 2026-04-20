import { useLiveQuery } from 'dexie-react-hooks'
import { db } from './schema'
import { getISOWeek, formatWeekKey, dayKeyForDate } from '../lib/date'

/* ───────────────────────── Recipes ───────────────────────── */

export function useAllRecipes() {
  const recipes = useLiveQuery(() => db.recipes.orderBy('name').toArray(), [])
  return recipes ?? null
}

export function useRecipe(id) {
  return useLiveQuery(() => (id ? db.recipes.get(id) : undefined), [id])
}

export async function saveRecipe(recipe) {
  await db.recipes.put(recipe)
}

export async function deleteRecipe(id) {
  await db.recipes.delete(id)
}

export async function toggleFavorite(id, current) {
  await db.recipes.update(id, { favorite: !current })
}

export async function incrementCookCount(id) {
  const r = await db.recipes.get(id)
  if (r) await db.recipes.update(id, { times_cooked: (r.times_cooked ?? 0) + 1 })
}

/* ───────────────────────── Mealplan ───────────────────────── */

export function useMealplan(weekKey) {
  return useLiveQuery(() => db.mealplan.get(weekKey), [weekKey])
}

export function useTodayMealplan() {
  const now = new Date()
  const weekKey = formatWeekKey(getISOWeek(now))
  const dayKey = dayKeyForDate(now)
  const plan = useLiveQuery(() => db.mealplan.get(weekKey), [weekKey])
  return {
    weekKey,
    dayKey,
    day: plan?.days?.[dayKey],
    loading: plan === undefined,
  }
}

export async function setMealplanSlot(weekKey, dayKey, slot, recipeId) {
  const existing = await db.mealplan.get(weekKey)
  const days = { ...(existing?.days ?? {}) }
  days[dayKey] = { ...(days[dayKey] ?? {}), [slot]: recipeId }
  await db.mealplan.put({ week: weekKey, days })
}

export async function setMealplanMode(weekKey, dayKey, mode) {
  const existing = await db.mealplan.get(weekKey)
  const days = { ...(existing?.days ?? {}) }
  const day = { ...(days[dayKey] ?? {}) }
  if (mode) day.mode = mode
  else delete day.mode
  days[dayKey] = day
  await db.mealplan.put({ week: weekKey, days })
}

export async function clearMealplanSlot(weekKey, dayKey, slot) {
  const existing = await db.mealplan.get(weekKey)
  if (!existing) return
  const day = existing.days?.[dayKey]
  if (!day) return
  const updated = { ...day }
  delete updated[slot]
  await db.mealplan.put({ week: weekKey, days: { ...existing.days, [dayKey]: updated } })
}
