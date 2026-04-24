import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Plus, Search, Star, Baby } from 'lucide-react'
import { useAllRecipes } from '../db/hooks'
import { CATEGORY_LABELS, CATEGORIES } from '../lib/recipe'
import RecipeCard from '../components/recipe/RecipeCard'
import FilterChips from '../components/recipe/FilterChips'

export default function Rezepte() {
  const recipes = useAllRecipes()
  const [searchParams] = useSearchParams()
  const urlCategory = searchParams.get('category')

  const [query, setQuery] = useState('')
  const [category, setCategory] = useState(() =>
    urlCategory && CATEGORIES.includes(urlCategory) ? urlCategory : null
  )
  const [onlyFav, setOnlyFav] = useState(false)
  const [onlyValerie, setOnlyValerie] = useState(false)

  // React to URL changes (e.g. Plan-B click while Rezepte is already open)
  useEffect(() => {
    if (urlCategory && CATEGORIES.includes(urlCategory)) {
      setCategory(urlCategory)
    }
  }, [urlCategory])

  const filtered = useMemo(() => {
    if (!recipes) return null
    const q = query.trim().toLowerCase()
    return recipes.filter((r) => {
      if (q && !r.name.toLowerCase().includes(q)) return false
      if (category && r.category !== category) return false
      if (onlyFav && !r.favorite) return false
      if (onlyValerie && !r.valerie_tauglich) return false
      return true
    })
  }, [recipes, query, category, onlyFav, onlyValerie])

  const categoryOptions = CATEGORIES.map((c) => ({ value: c, label: CATEGORY_LABELS[c] }))

  return (
    <div className="space-y-5">
      <header className="flex items-end justify-between gap-3">
        <div>
          <p className="text-[11px] text-ink/50 uppercase tracking-[0.15em] font-semibold">Bibliothek</p>
          <h1 className="text-[32px] md:text-4xl font-semibold tracking-tight mt-1 leading-none">Rezepte</h1>
        </div>
        <Link
          to="/rezepte/neu"
          className="flex items-center gap-1.5 bg-terracotta text-cream font-medium px-4 py-2.5 rounded-xl hover:brightness-95 active:brightness-90 transition shrink-0"
        >
          <Plus size={16} strokeWidth={2.5} />
          <span className="text-sm">Neu</span>
        </Link>
      </header>

      <div className="relative">
        <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink/40" />
        <input
          type="search"
          placeholder="Rezept suchen …"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full bg-white border border-black/5 rounded-xl pl-11 pr-4 py-3 text-[15px] placeholder:text-ink/40 focus:outline-none focus:border-terracotta/40"
        />
      </div>

      <FilterChips options={categoryOptions} value={category} onChange={setCategory} />

      <div className="flex gap-2">
        <ToggleBtn active={onlyFav} onClick={() => setOnlyFav((v) => !v)} icon={Star} label="Favoriten" />
        <ToggleBtn active={onlyValerie} onClick={() => setOnlyValerie((v) => !v)} icon={Baby} label="Valerie" />
      </div>

      {filtered === null ? (
        <SkeletonGrid />
      ) : filtered.length === 0 ? (
        <EmptyState hasRecipes={(recipes?.length ?? 0) > 0} />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          {filtered.map((r) => (
            <RecipeCard key={r.id} recipe={r} />
          ))}
        </div>
      )}

      {filtered && filtered.length > 0 && (
        <p className="text-center text-xs text-ink/40 pt-2">
          {filtered.length} von {recipes.length} Rezepten
        </p>
      )}
    </div>
  )
}

function ToggleBtn({ active, onClick, icon: Icon, label }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-medium transition ${
        active
          ? 'bg-terracotta/10 text-terracotta border border-terracotta/30'
          : 'bg-white border border-black/10 text-ink/60 hover:border-terracotta/30'
      }`}
    >
      <Icon size={14} strokeWidth={active ? 2.5 : 2} />
      {label}
    </button>
  )
}

function SkeletonGrid() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="bg-white rounded-2xl border border-black/5 overflow-hidden animate-pulse">
          <div className="aspect-[4/3] bg-black/5" />
          <div className="p-3.5 space-y-2">
            <div className="h-4 bg-black/5 rounded" />
            <div className="h-3 bg-black/5 rounded w-2/3" />
          </div>
        </div>
      ))}
    </div>
  )
}

function EmptyState({ hasRecipes }) {
  return (
    <div className="bg-white rounded-2xl border border-black/5 p-10 text-center">
      <p className="font-medium">
        {hasRecipes ? 'Keine Treffer' : 'Noch keine Rezepte'}
      </p>
      <p className="text-sm text-ink/55 mt-1.5 max-w-sm mx-auto">
        {hasRecipes
          ? 'Probier andere Filter oder suche nach einem anderen Begriff.'
          : 'Leg dein erstes Rezept an – oben rechts auf „Neu".'}
      </p>
    </div>
  )
}
