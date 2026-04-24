import { useMemo, useState } from 'react'
import { Plus } from 'lucide-react'
import { useAllPantry, addPantryItem, removePantryItem } from '../db/hooks'
import { LOCATIONS, LOCATION_LABELS } from '../lib/pantry'
import { CUBE_CATEGORY } from '../lib/cubes'
import PantryForm from '../components/pantry/PantryForm'
import PantryItem from '../components/pantry/PantryItem'
import FreezerBank from '../components/pantry/FreezerBank'
import { useToast } from '../components/ui/Toast'

export default function Vorrat() {
  const [activeLocation, setActiveLocation] = useState('kuehlschrank')
  const [addOpen, setAddOpen] = useState(false)
  const all = useAllPantry()
  const toast = useToast()

  const cubes = useMemo(() => {
    if (!all) return []
    return all
      .filter((i) => i.category === CUBE_CATEGORY && i.location === 'freezer')
      .sort((a, b) => (b.amount ?? 0) - (a.amount ?? 0))
  }, [all])

  const counts = useMemo(() => {
    const c = { kuehlschrank: 0, freezer: 0, vorrat: 0 }
    if (!all) return c
    for (const i of all) if (c[i.location] !== undefined) c[i.location]++
    return c
  }, [all])

  const visible = useMemo(() => {
    if (!all) return null
    return all
      .filter((i) => i.location === activeLocation)
      // On the freezer tab, hide cube rows – they live in FreezerBank
      .filter((i) => !(activeLocation === 'freezer' && i.category === CUBE_CATEGORY))
      .sort((a, b) => {
        if (!a.expires && !b.expires) return a.name.localeCompare(b.name, 'de')
        if (!a.expires) return 1
        if (!b.expires) return -1
        return new Date(a.expires) - new Date(b.expires)
      })
  }, [all, activeLocation])

  async function handleAdd(item) {
    await addPantryItem(item)
    toast(`${item.name} im ${LOCATION_LABELS[item.location]}`, { tone: 'success' })
    if (item.location !== activeLocation) setActiveLocation(item.location)
  }

  async function handleRemove(id, name) {
    await removePantryItem(id)
    toast(`${name} entfernt`, { tone: 'info' })
  }

  return (
    <div className="space-y-5">
      <header className="flex items-end justify-between gap-3">
        <div>
          <p className="text-[11px] text-ink/50 uppercase tracking-[0.15em] font-semibold">
            {all ? `${all.length} Artikel insgesamt` : 'Lade …'}
          </p>
          <h1 className="text-[32px] md:text-4xl font-semibold tracking-tight mt-1 leading-none">Vorrat</h1>
        </div>
        <button
          onClick={() => setAddOpen((v) => !v)}
          className={`flex items-center gap-1.5 font-medium px-4 py-2.5 rounded-xl shrink-0 transition ${
            addOpen
              ? 'bg-black/[0.04] text-ink/70 hover:bg-black/[0.08]'
              : 'bg-terracotta text-cream hover:brightness-95'
          }`}
        >
          <Plus size={16} strokeWidth={2.5} className={addOpen ? 'rotate-45 transition-transform' : 'transition-transform'} />
          <span className="text-sm">{addOpen ? 'Fertig' : 'Neu'}</span>
        </button>
      </header>

      {addOpen && (
        <PantryForm
          defaultLocation={activeLocation}
          onSave={handleAdd}
          onCancel={() => setAddOpen(false)}
        />
      )}

      <div className="flex gap-1 bg-white border border-black/5 rounded-xl p-1">
        {LOCATIONS.map((loc) => {
          const isActive = loc === activeLocation
          return (
            <button
              key={loc}
              onClick={() => setActiveLocation(loc)}
              className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition ${
                isActive
                  ? 'bg-terracotta/10 text-terracotta'
                  : 'text-ink/60 hover:bg-black/[0.03]'
              }`}
            >
              <span>{LOCATION_LABELS[loc]}</span>
              {counts[loc] > 0 && (
                <span className={`text-[10px] tabular-nums px-1.5 py-0.5 rounded-full ${
                  isActive ? 'bg-terracotta/20 text-terracotta' : 'bg-black/[0.05] text-ink/45'
                }`}>
                  {counts[loc]}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Freezer Bank erscheint nur auf dem Freezer-Tab */}
      {activeLocation === 'freezer' && <FreezerBank cubes={cubes} />}

      {/* Regular items list */}
      {!visible ? (
        <SkeletonList />
      ) : visible.length === 0 ? (
        activeLocation === 'freezer' && cubes.length > 0 ? null : (
          <EmptyState location={activeLocation} onAdd={() => setAddOpen(true)} />
        )
      ) : (
        <section>
          {activeLocation === 'freezer' && cubes.length > 0 && (
            <h2 className="text-[11px] uppercase tracking-[0.15em] text-ink/50 font-semibold mb-3 px-1">
              Sonstiges im Freezer
            </h2>
          )}
          <div className="bg-white rounded-2xl border border-black/5 divide-y divide-black/5 overflow-hidden">
            {visible.map((item) => (
              <PantryItem
                key={item.id}
                item={item}
                onRemove={() => handleRemove(item.id, item.name)}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

function SkeletonList() {
  return (
    <div className="bg-white rounded-2xl border border-black/5 divide-y divide-black/5 overflow-hidden animate-pulse">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 px-5 py-4">
          <div className="w-2.5 h-2.5 rounded-full bg-black/5 shrink-0" />
          <div className="flex-1 space-y-1.5">
            <div className="h-4 bg-black/5 rounded w-1/2" />
            <div className="h-3 bg-black/5 rounded w-1/3" />
          </div>
        </div>
      ))}
    </div>
  )
}

function EmptyState({ location, onAdd }) {
  return (
    <div className="bg-white rounded-2xl border border-black/5 p-10 text-center">
      <p className="font-medium">Nichts im {LOCATION_LABELS[location]}</p>
      <p className="text-sm text-ink/55 mt-1.5 max-w-sm mx-auto">
        Füg deinen ersten Artikel hinzu. Bei Freezer-Cubes Menge + Datum, Frisches am besten mit Ablaufdatum.
      </p>
      <button
        onClick={onAdd}
        className="mt-5 inline-flex items-center gap-1.5 bg-terracotta text-cream font-medium px-4 py-2.5 rounded-xl hover:brightness-95 transition"
      >
        <Plus size={14} /> Hinzufügen
      </button>
    </div>
  )
}
