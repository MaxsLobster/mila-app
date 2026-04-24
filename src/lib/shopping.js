import { DAY_KEYS } from './date'

export const SHOPPING_CATEGORIES = {
  obst_gemuese: { label: 'Obst & Gemüse' },
  kuehl: { label: 'Kühlregal' },
  trocken: { label: 'Trocken & Vorrat' },
  getraenke: { label: 'Getränke' },
  sonstiges: { label: 'Sonstiges' },
}

export const CATEGORY_ORDER = ['obst_gemuese', 'kuehl', 'trocken', 'getraenke', 'sonstiges']

const RULES = [
  {
    cat: 'trocken',
    keywords: [
      'tomatenmark', 'passata', 'kokosmilch', 'brühe', 'currypaste', 'fischsauce',
      'sojasauce', 'chia', 'haferflock', 'flocken', 'reis', 'linse', 'mehl',
      'pasta', 'spaghetti', 'nudel', 'pinienkern', 'mandel', 'olivenöl', 'öl',
      'essig', 'dose', 'gewürz', 'paste', 'zucker', 'sirup', 'honig', 'bambus',
      'palmzucker', 'pulver', 'brot', 'toast', 'cracker', 'nüsse',
    ],
  },
  {
    cat: 'kuehl',
    keywords: [
      'hack', 'rind', 'schwein', 'hähnch', 'lamm', 'fisch', 'wurst', 'speck',
      'garnele', 'milch', 'joghurt', 'butter', 'käse', 'parmesan', 'feta',
      'sahne', 'quark', 'frischkäse', 'eier', 'creme', 'mozzarella', 'ricotta',
    ],
  },
  {
    cat: 'getraenke',
    keywords: ['wein', 'bier', 'limonad', 'cola', 'prosecco'],
  },
  {
    cat: 'obst_gemuese',
    keywords: [
      'karotte', 'sellerie', 'zwiebel', 'knoblauch', 'paprika', 'tomate',
      'basilikum', 'petersilie', 'koriander', 'thymian', 'rosmarin', 'zitrone',
      'limette', 'ingwer', 'spargel', 'aubergine', 'kartoffel', 'bärlauch',
      'beere', 'banane', 'kräuter', 'zuckerschot', 'apfel', 'birne', 'salat',
      'gurk', 'lauch', 'schalotte', 'peperoncino', 'chili', 'kapern', 'minze',
      'dill', 'avocado', 'kresse', 'zweige', 'topping',
    ],
  },
]

export function categorize(name) {
  const n = (name || '').toLowerCase()
  for (const { cat, keywords } of RULES) {
    for (const kw of keywords) {
      if (n.includes(kw)) return cat
    }
  }
  return 'sonstiges'
}

export function parseManualInput(text) {
  const trimmed = text.trim()
  if (!trimmed) return { name: '', amount: '' }
  const match = trimmed.match(/^(.+?)\s+(\d+(?:[.,]\d+)?\s*[a-zA-ZäöüÄÖÜßμ]*)$/)
  if (match) return { name: match[1].trim(), amount: match[2].trim() }
  return { name: trimmed, amount: '' }
}

function formatAmount(ing) {
  const amt = (ing.amount ?? '').toString().trim()
  const unit = (ing.unit ?? '').trim()
  if (!amt && !unit) return ''
  if (!amt) return unit
  if (!unit) return amt
  return `${amt} ${unit}`
}

function parseQuantity(amountStr) {
  if (!amountStr) return { num: null, unit: '' }
  const m = String(amountStr).match(/^\s*([\d.,]+)\s*(.*)$/)
  if (!m) return { num: null, unit: String(amountStr).trim() }
  const num = parseFloat(m[1].replace(',', '.'))
  return { num: Number.isNaN(num) ? null : num, unit: (m[2] || '').trim() }
}

function combineAmounts(existingAmount, newAmount) {
  const a = parseQuantity(existingAmount)
  const b = parseQuantity(newAmount)
  if (a.num !== null && b.num !== null && a.unit === b.unit) {
    const sum = Number((a.num + b.num).toFixed(2))
    return a.unit ? `${sum} ${a.unit}` : String(sum)
  }
  if (!existingAmount) return newAmount
  if (!newAmount) return existingAmount
  return `${existingAmount} + ${newAmount}`
}

export function generateFromWeekplan(plan, recipesById) {
  const items = new Map()

  for (const dayKey of DAY_KEYS) {
    const day = plan?.days?.[dayKey]
    if (!day) continue
    for (const slot of ['mittag', 'abend']) {
      const recipeId = day[slot]
      if (!recipeId) continue
      const recipe = recipesById[recipeId]
      if (!recipe) continue
      for (const ing of recipe.ingredients ?? []) {
        if (ing.pantry_basic) continue
        if (!ing.name?.trim()) continue
        const key = ing.name.trim().toLowerCase()
        const existing = items.get(key)
        const ingAmt = formatAmount(ing)
        if (existing) {
          existing.amount = combineAmounts(existing.amount, ingAmt)
          existing.recipeIds.add(recipeId)
        } else {
          items.set(key, {
            name: ing.name.trim(),
            amount: ingAmt,
            recipeIds: new Set([recipeId]),
          })
        }
      }
    }
  }

  const now = new Date().toISOString()
  return Array.from(items.values()).map((item) => ({
    id: crypto.randomUUID(),
    name: item.name,
    amount: item.amount,
    category: categorize(item.name),
    source: 'recipe',
    recipe_id: item.recipeIds.size === 1 ? [...item.recipeIds][0] : null,
    checked: false,
    added: now,
  }))
}
