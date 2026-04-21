import { useEffect, useMemo, useState } from 'react'
import { X, Search, Clock } from 'lucide-react'
import { useAllRecipes } from '../../db/hooks'
import { CATEGORY_LABELS, formatTime } from '../../lib/recipe'
import RecipeArt from '../ui/RecipeArt'

export default function RecipePicker({ open, onClose, onSelect, title = 'Rezept auswählen' }) {
  const recipes = useAllRecipes()
  const [query, setQuery] = useState('')

  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [open])

  const filtered = useMemo(() => {
    if (!recipes) return null
    const q = query.trim().toLowerCase()
    if (!q) return recipes
    return recipes.filter((r) => r.name.toLowerCase().includes(q))
  }, [recipes, query])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
      <button
        aria-label="Schließen"
        onClick={onClose}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
      />
      <div className="relative w-full md:max-w-lg max-h-[85vh] bg-cream rounded-t-3xl md:rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-[slide-up_0.2s_ease-out]">
        <div className="md:hidden flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 bg-ink/15 rounded-full" />
        </div>

        <div className="flex items-center justify-between px-5 py-3 border-b border-black/5">
          <h2 className="font-semibold text-lg">{title}</h2>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full hover:bg-black/5 flex items-center justify-center transition"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-4 border-b border-black/5">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/40" />
            <input
              type="search"
              autoFocus
              placeholder="Suchen …"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-white border border-black/10 rounded-xl pl-9 pr-3 py-2.5 text-[15px] placeholder:text-ink/40 focus:outline-none focus:border-terracotta/40"
            />
          </div>
        </div>

        <div className="overflow-y-auto flex-1 p-2">
          {filtered === null && <div className="p-6 text-center text-ink/50">Lade …</div>}
          {filtered !== null && filtered.length === 0 && (
            <div className="p-6 text-center text-ink/50">Keine Treffer.</div>
          )}
          {filtered?.map((r) => (
            <button
              key={r.id}
              onClick={() => { onSelect(r); onClose() }}
              className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-white active:bg-white transition text-left"
            >
              <div className="w-11 h-11 rounded-xl overflow-hidden relative shrink-0">
                <RecipeArt recipe={r} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium leading-tight truncate">{r.name}</p>
                <div className="flex items-center gap-1.5 text-xs text-ink/55 mt-1">
                  <Clock size={11} />
                  <span>{formatTime(r.time_min)}</span>
                  <span className="text-ink/30">·</span>
                  <span>{CATEGORY_LABELS[r.category]}</span>
                  {r.valerie_tauglich && (
                    <>
                      <span className="text-ink/30">·</span>
                      <span className="text-sage">Valerie ✓</span>
                    </>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes slide-up {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  )
}
