import { db } from '../db/schema'

export const BACKUP_VERSION = 1

export async function exportBackup() {
  const [recipes, mealplan, pantry, shopping, settings] = await Promise.all([
    db.recipes.toArray(),
    db.mealplan.toArray(),
    db.pantry.toArray(),
    db.shopping.toArray(),
    db.settings.toArray(),
  ])
  return {
    app: 'mila',
    version: BACKUP_VERSION,
    exportedAt: new Date().toISOString(),
    data: { recipes, mealplan, pantry, shopping, settings },
  }
}

export function downloadBackup(backup) {
  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const ts = new Date().toISOString().slice(0, 10)
  const a = document.createElement('a')
  a.href = url
  a.download = `mila-backup-${ts}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

/**
 * Validates a backup file. Returns { ok, error, data? }.
 */
export function validateBackup(raw) {
  if (!raw || typeof raw !== 'object') return { ok: false, error: 'Keine gültige Datei' }
  if (raw.app !== 'mila') return { ok: false, error: 'Nicht von Mila exportiert' }
  if (typeof raw.version !== 'number') return { ok: false, error: 'Versionsnummer fehlt' }
  if (raw.version > BACKUP_VERSION) return { ok: false, error: `Backup ist von einer neueren Version (${raw.version})` }
  if (!raw.data || typeof raw.data !== 'object') return { ok: false, error: 'Datenobjekt fehlt' }
  const { recipes, mealplan, pantry, shopping, settings } = raw.data
  if (!Array.isArray(recipes)) return { ok: false, error: 'recipes nicht als Array' }
  if (!Array.isArray(mealplan)) return { ok: false, error: 'mealplan nicht als Array' }
  if (!Array.isArray(pantry)) return { ok: false, error: 'pantry nicht als Array' }
  if (!Array.isArray(shopping)) return { ok: false, error: 'shopping nicht als Array' }
  if (!Array.isArray(settings)) return { ok: false, error: 'settings nicht als Array' }
  return { ok: true, data: raw.data }
}

/**
 * Replace-import: wipes all tables and inserts from backup.
 */
export async function importBackupReplace(data) {
  await db.transaction('rw', [db.recipes, db.mealplan, db.pantry, db.shopping, db.settings], async () => {
    await Promise.all([
      db.recipes.clear(),
      db.mealplan.clear(),
      db.pantry.clear(),
      db.shopping.clear(),
      db.settings.clear(),
    ])
    await Promise.all([
      data.recipes.length ? db.recipes.bulkAdd(data.recipes) : null,
      data.mealplan.length ? db.mealplan.bulkAdd(data.mealplan) : null,
      data.pantry.length ? db.pantry.bulkAdd(data.pantry) : null,
      data.shopping.length ? db.shopping.bulkAdd(data.shopping) : null,
      data.settings.length ? db.settings.bulkAdd(data.settings) : null,
    ])
  })
}

/**
 * Merge-import: upsert by id/week/key, doesn't delete existing records.
 */
export async function importBackupMerge(data) {
  await db.transaction('rw', [db.recipes, db.mealplan, db.pantry, db.shopping, db.settings], async () => {
    if (data.recipes.length) await db.recipes.bulkPut(data.recipes)
    if (data.mealplan.length) await db.mealplan.bulkPut(data.mealplan)
    if (data.pantry.length) await db.pantry.bulkPut(data.pantry)
    if (data.shopping.length) await db.shopping.bulkPut(data.shopping)
    if (data.settings.length) await db.settings.bulkPut(data.settings)
  })
}

export async function readFileAsJson(file) {
  const text = await file.text()
  try {
    return JSON.parse(text)
  } catch (err) {
    throw new Error('JSON-Datei konnte nicht gelesen werden')
  }
}
