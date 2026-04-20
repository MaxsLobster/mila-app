import { useLiveQuery } from 'dexie-react-hooks'
import { db } from './schema'

export function useAllRecipes() {
  const recipes = useLiveQuery(
    () => db.recipes.orderBy('name').toArray(),
    []
  )
  return recipes ?? null
}

export function useRecipe(id) {
  const recipe = useLiveQuery(
    () => (id ? db.recipes.get(id) : undefined),
    [id]
  )
  return recipe
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
