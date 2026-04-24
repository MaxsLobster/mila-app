import { useEffect } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from './schema'
import { getISOWeek, formatWeekKey, dayKeyForDate } from '../lib/date'
import { categorize } from '../lib/shopping'
import { daysUntil } from '../lib/pantry'
import { CUBE_CATEGORY, CUBE_UNIT } from '../lib/cubes'
import { ensureSkeletonWeek, currentWeekKey } from '../lib/weekSkeleton'

const LOADING = Symbol('loading')

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

/**
 * Returns:
 *   undefined → still loading
 *   null      → not yet created
 *   object    → week plan
 */
export function useMealplan(weekKey) {
  const res = useLiveQuery(
    () => db.mealplan.get(weekKey).then((v) => v ?? null),
    [weekKey],
    LOADING
  )
  return res === LOADING ? undefined : res
}

export function useTodayMealplan() {
  const now = new Date()
  const weekKey = formatWeekKey(getISOWeek(now))
  const dayKey = dayKeyForDate(now)
  const plan = useMealplan(weekKey)
  return {
    weekKey,
    dayKey,
    day: plan?.days?.[dayKey],
    plan,
    loading: plan === undefined,
  }
}

/**
 * Side-effect hook: if the current ISO week has no mealplan yet, create a
 * skeleton plan with Mila's default rhythm. Idempotent — only fires once
 * per missing week per session.
 */
export function useEnsureCurrentWeek() {
  const weekKey = currentWeekKey()
  const plan = useMealplan(weekKey)
  useEffect(() => {
    if (plan === undefined) return // loading
    if (plan !== null) return      // already exists
    ensureSkeletonWeek(weekKey).catch((err) => console.warn('ensureSkeletonWeek failed', err))
  }, [plan, weekKey])
}

export async function setMealplanSlot(weekKey, dayKey, slot, recipeId) {
  const existing = await db.mealplan.get(weekKey)
  const days = { ...(existing?.days ?? {}) }
  days[dayKey] = { ...(days[dayKey] ?? {}), [slot]: recipeId }
  await db.mealplan.put({ ...(existing ?? { week: weekKey }), week: weekKey, days, skeleton: false })
}

export async function setMealplanMode(weekKey, dayKey, mode) {
  const existing = await db.mealplan.get(weekKey)
  const days = { ...(existing?.days ?? {}) }
  const day = { ...(days[dayKey] ?? {}) }
  if (mode) day.mode = mode
  else delete day.mode
  days[dayKey] = day
  await db.mealplan.put({ ...(existing ?? { week: weekKey }), week: weekKey, days, skeleton: false })
}

export async function clearMealplanSlot(weekKey, dayKey, slot) {
  const existing = await db.mealplan.get(weekKey)
  if (!existing) return
  const day = existing.days?.[dayKey]
  if (!day) return
  const updated = { ...day }
  delete updated[slot]
  await db.mealplan.put({ ...existing, days: { ...existing.days, [dayKey]: updated } })
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

/**
 * Idempotent regenerate from weekplan:
 *   - Keep all manual items untouched.
 *   - Replace all existing recipe-sourced items with the freshly aggregated set.
 *   - If the user had already checked a recipe item, preserve that checked state
 *     for the matching name (they already bought it).
 *
 * @param {Array} aggregated  items produced by generateFromWeekplan
 * @returns {{ added: number, updated: number, removed: number, kept: number }}
 */
export async function syncShoppingFromRecipes(aggregated) {
  const existing = await db.shopping.toArray()
  const manual = existing.filter((i) => i.source !== 'recipe')
  const oldRecipeItems = existing.filter((i) => i.source === 'recipe')

  // Keep checked-state when name matches old recipe item (user bought it already)
  const checkedMap = new Map(
    oldRecipeItems
      .filter((i) => i.checked)
      .map((i) => [i.name.trim().toLowerCase(), true])
  )

  // Also: don't add recipe-items whose name matches an existing MANUAL item
  const manualNames = new Set(manual.map((i) => i.name.trim().toLowerCase()))

  const nextRecipeItems = aggregated
    .filter((i) => !manualNames.has(i.name.trim().toLowerCase()))
    .map((i) => ({
      ...i,
      checked: checkedMap.get(i.name.trim().toLowerCase()) || false,
    }))

  let added = 0, updated = 0
  const oldByName = new Map(oldRecipeItems.map((i) => [i.name.trim().toLowerCase(), i]))
  const finalItems = []
  for (const next of nextRecipeItems) {
    const key = next.name.trim().toLowerCase()
    const prev = oldByName.get(key)
    if (prev) {
      updated++
      finalItems.push({ ...prev, amount: next.amount, recipe_id: next.recipe_id, category: next.category })
      oldByName.delete(key)
    } else {
      added++
      finalItems.push(next)
    }
  }
  const removed = oldByName.size

  await db.transaction('rw', db.shopping, async () => {
    // Delete all old recipe items
    const toDelete = oldRecipeItems.map((i) => i.id)
    if (toDelete.length) await db.shopping.bulkDelete(toDelete)
    if (finalItems.length) await db.shopping.bulkAdd(finalItems)
  })

  return { added, updated, removed, kept: manual.length }
}

/* ───────────────────────── Pantry ───────────────────────── */

export function useAllPantry() {
  const items = useLiveQuery(() => db.pantry.toArray(), [])
  return items ?? null
}

export function useFreezerCubes() {
  const items = useLiveQuery(
    () => db.pantry.where('location').equals('freezer').toArray(),
    []
  )
  if (!items) return null
  return items.filter((i) => i.category === CUBE_CATEGORY).sort((a, b) => (b.amount ?? 0) - (a.amount ?? 0))
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
    amount: partial.amount ?? '',
    unit: (partial.unit ?? '').trim(),
    expires: partial.expires || null,
    added: new Date().toISOString(),
    category: partial.category ?? null,
    target: partial.target ?? null,
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

/* ───────────────────────── Cubes ───────────────────────── */

export async function addCubeType(name, target = 6) {
  const trimmed = name.trim()
  if (!trimmed) return null
  const item = {
    id: crypto.randomUUID(),
    name: trimmed,
    location: 'freezer',
    amount: 0,
    unit: CUBE_UNIT,
    category: CUBE_CATEGORY,
    target,
    expires: null,
    added: new Date().toISOString(),
  }
  await db.pantry.add(item)
  return item
}

export async function adjustCubePortions(id, delta) {
  const cube = await db.pantry.get(id)
  if (!cube) return
  const next = Math.max(0, (Number(cube.amount) || 0) + delta)
  await db.pantry.update(id, { amount: next })
}

export async function setCubeTarget(id, target) {
  await db.pantry.update(id, { target: Math.max(1, Number(target) || 1) })
}

export async function removeCube(id) {
  await db.pantry.delete(id)
}

/* ───────────────────────── Settings ───────────────────────── */

export function useSetting(key, fallback) {
  const res = useLiveQuery(
    () => db.settings.get(key).then((v) => v?.value ?? fallback),
    [key]
  )
  return res
}

export async function setSetting(key, value) {
  await db.settings.put({ key, value })
}
