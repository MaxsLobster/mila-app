import { useLiveQuery } from 'dexie-react-hooks'
import { db } from './schema'
import { getISOWeek, formatWeekKey, dayKeyForDate } from '../lib/date'
import { categorize } from '../lib/shopping'
import { daysUntil } from '../lib/pantry'

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

/* ───────────────────────── Shopping ───────────────────────── */

export function useShoppingItems() {
  const items = useLiveQuery(() => db.shopping.toArray(), [])
  return items ?? null
}

export async function addShoppingItem(partial) {
  const item = {
    id: crypto.randomUUID(),
    name: (partial.name ?? '').trim(),
    amount: (partial.amount ?? '').trim(),
    category: partial.category ?? categorize(partial.name ?? ''),
    source: partial.source ?? 'manual',
    recipe_id: partial.recipe_id ?? null,
    checked: false,
    added: new Date().toISOString(),
  }
  if (!item.name) return null
  await db.shopping.add(item)
  return item
}

export async function addShoppingItems(items) {
  const existing = await db.shopping.toArray()
  const existingNames = new Set(existing.map((i) => i.name.trim().toLowerCase()))
  const newItems = items.filter((i) => !existingNames.has(i.name.trim().toLowerCase()))
  if (newItems.length > 0) await db.shopping.bulkAdd(newItems)
  return newItems.length
}

export async function toggleShoppingItem(id, checked) {
  await db.shopping.update(id, { checked })
}

export async function removeShoppingItem(id) {
  await db.shopping.delete(id)
}

export async function clearCheckedShopping() {
  const all = await db.shopping.toArray()
  const checkedIds = all.filter((i) => i.checked).map((i) => i.id)
  if (checkedIds.length > 0) await db.shopping.bulkDelete(checkedIds)
  return checkedIds.length
}

/* ───────────────────────── Pantry ───────────────────────── */

export function useAllPantry() {
  const items = useLiveQuery(() => db.pantry.toArray(), [])
  return items ?? null
}

export function usePantryExpiring(maxDays = 14) {
  const items = useLiveQuery(async () => {
    const all = await db.pantry.toArray()
    return all
      .map((i) => ({ ...i, daysLeft: daysUntil(i.expires) }))
      .filter((i) => i.daysLeft !== null && i.daysLeft <= maxDays)
      .sort((a, b) => a.daysLeft - b.daysLeft)
  }, [maxDays])
  return items ?? null
}

export async function addPantryItem(partial) {
  const item = {
    id: crypto.randomUUID(),
    name: (partial.name ?? '').trim(),
    location: partial.location,
    amount: (partial.amount ?? '').trim(),
    unit: (partial.unit ?? '').trim(),
    expires: partial.expires || null,
    added: new Date().toISOString(),
    category: partial.category ?? null,
  }
  if (!item.name || !item.location) return null
  await db.pantry.add(item)
  return item
}

export async function updatePantryItem(id, changes) {
  await db.pantry.update(id, changes)
}

export async function removePantryItem(id) {
  await db.pantry.delete(id)
}
