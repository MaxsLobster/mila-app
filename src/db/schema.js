import Dexie from 'dexie'

export const db = new Dexie('mila')

db.version(1).stores({
  recipes: 'id, name, category, cuisine, favorite, valerie_tauglich',
  mealplan: 'week',
  pantry: 'id, location, expires, name',
  shopping: 'id, category, checked',
  settings: 'key',
})
