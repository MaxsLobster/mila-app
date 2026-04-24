import { useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Trash2, Sparkles, BookOpen, ShoppingCart, RefreshCw } from 'lucide-react'
import {
  useShoppingItems,
  addShoppingItem,
  toggleShoppingItem,
  removeShoppingItem,
  clearCheckedShopping,
  syncShoppingFromRecipes,
  useMealplan,
  useAllRecipes,
} from '../db/hooks'
import { getISOWeek, formatWeekKey } from '../lib/date'
import {
  SHOPPING_CATEGORIES,
  CATEGORY_ORDER,
  categorize,
  parseManualInput,
  generateFromWeekplan,
} from '../lib/shopping'
import { useToast } from '../components/ui/Toast'
import { explodeElement } from '../lib/physicsExplosion'

export default function Einkauf() {
  const items = useShoppingItems()
  const [newItem, setNewItem] = useState('')
  const toast = useToast()

  const weekKey = formatWeekKey(getISOWeek(new Date()))
  const plan = useMealplan(weekKey)
  const recipes = useAllRecipes()
  const recipesById = useMemo(() => {
    if (!recipes) return {}
    return Object.fromEntries(recipes.map((r) => [r.id, r]))
  }, [recipes])

  const grouped = useMemo(() => {
    if (!items) return null
    const g = {}
    for (const cat of CATEGORY_ORDER) g[cat] = []
    for (const item of items) {
      const cat = item.category && g[item.category] ? item.category : categorize(item.name)
      g[cat].push(item)
    }
    for (const cat of CATEGORY_ORDER) {
      g[cat].sort((a, b) => {
        if (a.checked !== b.checked) return a.checked ? 1 : -1
        return a.name.localeCompare(b.name, 'de')
      })
    }
    return g
  }, [items])

  const openCount = items?.filter((i) => !i.checked).length ?? 0
  const checkedCount = items?.filter((i) => i.checked).length ?? 0

  async function handleAdd(e) {
    e.preventDefault()
    const { name, amount } = parseManualInput(newItem)
    if (!name) return
    await addShoppingItem({ name, amount })
    setNewItem('')
  }

  async function handleSync() {
    const aggregated = generateFromWeekplan(plan, recipesById)
    if (aggregated.length === 0) {
      toast('Kein Rezept diese Woche – plane erst einen Tag.', { tone: 'info' })
      return
    }
    const { added, updated, removed, kept } = await syncShoppingFromRecipes(aggregated)
    const parts = []
    if (added) parts.push(`${added} neu`)
    if (updated) parts.push(`${updated} aktualisiert`)
    if (removed) parts.push(`${removed} entfernt`)
    const summary = parts.length ? parts.join(' · ') : 'alles schon aktuell'
    toast(`Aus Wochenplan: ${summary}`, { tone: 'success' })
  }

  async function handleClearChecked() {
    if (!confirm(`${checkedCount} abgehakte Artikel löschen?`)) return
    await clearCheckedShopping()
    toast(`${checkedCount} Artikel entfernt`, { tone: 'success' })
  }

  const hasAny = items && items.length > 0

  return (
    <div className="space-y-5">
      <header>
        <p className="text-[11px] text-ink/50 uppercase tracking-[0.15em] font-semibold">
          {hasAny ? `${openCount} offen${checkedCount > 0 ? ` · ${checkedCount} besorgt` : ''}` : 'Leere Liste'}
        </p>
        <h1 className="text-[32px] md:text-4xl font-semibold tracking-tight mt-1 leading-none">Einkauf</h1>
      </header>

      <form onSubmit={handleAdd} className="flex gap-2">
        <input
          type="text"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          placeholder="Artikel hinzufügen (z. B. Milch 2 l)"
          className="flex-1 bg-white border border-black/10 rounded-xl px-4 py-3 text-[15px] placeholder:text-ink/40 focus:outline-none focus:border-terracotta/40"
        />
        <button
          type="submit"
          disabled={!newItem.trim()}
          className="bg-terracotta text-cream font-medium px-4 rounded-xl disabled:opacity-40 hover:brightness-95 transition flex items-center gap-1.5"
        >
          <Plus size={16} strokeWidth={2.5} />
          <span className="hidden md:inline text-sm">Hinzufügen</span>
        </button>
      </form>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={handleSync}
          disabled={!plan || !recipes}
          className="flex items-center gap-2 bg-sage/10 text-ink border border-sage/25 font-medium px-3.5 py-2 rounded-xl hover:bg-sage/15 transition text-sm disabled:opacity-50"
        >
          <RefreshCw size={14} className="text-sage" strokeWidth={2.2} />
          Aus Wochenplan
        </button>
        {checkedCount > 0 && (
          <button
            onClick={handleClearChecked}
            className="flex items-center gap-2 bg-white text-ink/70 border border-black/10 font-medium px-3.5 py-2 rounded-xl hover:bg-black/5 transition text-sm"
          >
            <Trash2 size={14} />
            Abgehakte löschen ({checkedCount})
          </button>
        )}
      </div>

      {!grouped ? (
        <SkeletonList />
      ) : !hasAny ? (
        <EmptyState />
      ) : (
        <div className="space-y-6">
          {CATEGORY_ORDER.map((cat) => {
            const catItems = grouped[cat]
            if (!catItems || catItems.length === 0) return null
            return (
              <CategorySection
                key={cat}
                category={cat}
                items={catItems}
                onToggle={toggleShoppingItem}
                onRemove={removeShoppingItem}
              />
            )
          })}
        </div>
      )}
    </div>
  )
}

function CategorySection({ category, items, onToggle, onRemove }) {
  return (
    <section>
      <h2 className="text-[11px] uppercase tracking-[0.15em] text-ink/50 font-semibold mb-3 px-1">
        {SHOPPING_CATEGORIES[category].label}
      </h2>
      <div className="bg-white rounded-2xl border border-black/5 divide-y divide-black/5 overflow-hidden">
        {items.map((item) => (
          <ShoppingItem
            key={item.id}
            item={item}
            onToggle={() => onToggle(item.id, !item.checked)}
            onRemove={() => onRemove(item.id)}
          />
        ))}
      </div>
    </section>
  )
}

function ShoppingItem({ item, onToggle, onRemove }) {
  const rowRef = useRef(null)

  async function handleRemove() {
    const el = rowRef.current
    if (el) await explodeElement(el, { shards: false, gravity: 1.4 })
    onRemove()
  }

  return (
    <div ref={rowRef} className={`flex items-center gap-3 px-4 py-3 bg-white ${item.checked ? 'opacity-50' : ''}`}>
      <button
        onClick={onToggle}
        className={`w-6 h-6 rounded-full border-2 shrink-0 flex items-center justify-center transition ${
          item.checked ? 'bg-sage border-sage' : 'border-black/20 hover:border-terracotta'
        }`}
        aria-label={item.checked ? 'Abhaken aufheben' : 'Abhaken'}
      >
        {item.checked && (
          <svg viewBox="0 0 20 20" className="w-3.5 h-3.5 text-white" fill="currentColor">
            <path d="M7.5 13.5 3.5 9.5 2 11l5.5 5.5L18 6l-1.5-1.5z" />
          </svg>
        )}
      </button>

      <div className="flex-1 min-w-0">
        <div className={`flex items-baseline gap-2 ${item.checked ? 'line-through' : ''}`}>
          <span className="font-medium truncate">{item.name}</span>
          {item.amount && (
            <span className="text-sm text-ink/50 shrink-0 tabular-nums">{item.amount}</span>
          )}
        </div>
        {item.recipe_id && (
          <Link
            to={`/rezepte/${item.recipe_id}`}
            className="text-xs text-terracotta hover:underline inline-flex items-center gap-1 mt-0.5"
          >
            <BookOpen size={10} strokeWidth={2.2} /> Rezept
          </Link>
        )}
      </div>

      <button
        onClick={handleRemove}
        className="p-1.5 text-ink/30 hover:text-red-600 transition"
        aria-label="Löschen"
      >
        <Trash2 size={14} />
      </button>
    </div>
  )
}

function SkeletonList() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-4 w-24 bg-black/5 rounded" />
      <div className="bg-white rounded-2xl border border-black/5 divide-y divide-black/5 overflow-hidden">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 px-4 py-3">
            <div className="w-6 h-6 rounded-full bg-black/5 shrink-0" />
            <div className="flex-1 h-4 bg-black/5 rounded" />
          </div>
        ))}
      </div>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="bg-white rounded-2xl border border-black/5 p-10 text-center">
      <div className="w-14 h-14 rounded-2xl bg-terracotta/10 text-terracotta flex items-center justify-center mx-auto mb-4">
        <ShoppingCart size={24} strokeWidth={1.8} />
      </div>
      <p className="font-medium">Leere Einkaufsliste</p>
      <p className="text-sm text-ink/55 mt-1.5 max-w-sm mx-auto leading-relaxed">
        Tipp was ein oder generier dir die Liste aus deinem Wochenplan.
      </p>
    </div>
  )
}
