import { useState } from 'react'
import { Plus, Minus, Trash2, Snowflake } from 'lucide-react'
import {
  SUGGESTED_CUBES,
  cubeStatus,
  cubeToneClasses,
  totalCubePortions,
  totalCubeTarget,
  statusForTotal,
  CUBE_TARGET_TOTAL_MIN,
} from '../../lib/cubes'
import { addCubeType, adjustCubePortions, removeCube } from '../../db/hooks'
import { useToast } from '../ui/Toast'

export default function FreezerBank({ cubes }) {
  const [adding, setAdding] = useState(false)
  const toast = useToast()

  const list = cubes ?? []
  const total = totalCubePortions(list)
  const targetTotal = totalCubeTarget(list) || CUBE_TARGET_TOTAL_MIN
  const totalStatus = statusForTotal(total)

  async function quickAdd(name, target) {
    await addCubeType(name, target)
    toast(`${name} angelegt`, { tone: 'success' })
    setAdding(false)
  }

  async function handleCustomAdd(e) {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const name = String(form.get('name') || '').trim()
    const target = Number(form.get('target') || 6)
    if (!name) return
    await addCubeType(name, target)
    toast(`${name} angelegt`, { tone: 'success' })
    e.currentTarget.reset()
    setAdding(false)
  }

  return (
    <section>
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <h2 className="text-[11px] uppercase tracking-[0.15em] text-ink/50 font-semibold">
            Freezer-Bank
          </h2>
          <FreezerTotalBadge total={total} target={targetTotal} status={totalStatus} />
        </div>
        <button
          onClick={() => setAdding((v) => !v)}
          className="text-[11px] text-terracotta font-semibold hover:underline"
        >
          {adding ? 'Schließen' : '+ Neuer Cube-Typ'}
        </button>
      </div>

      {adding && (
        <div className="bg-white rounded-2xl border border-black/5 p-4 mb-3 space-y-3">
          <p className="text-xs text-ink/55 font-medium">Vorschläge (tippen zum Anlegen):</p>
          <div className="flex flex-wrap gap-1.5">
            {SUGGESTED_CUBES
              .filter((s) => !list.some((c) => c.name.toLowerCase() === s.name.toLowerCase()))
              .map((s) => (
                <button
                  key={s.name}
                  onClick={() => quickAdd(s.name, s.target)}
                  className="text-xs px-3 py-1.5 bg-black/[0.03] hover:bg-terracotta/10 hover:text-terracotta border border-black/10 rounded-full transition"
                >
                  {s.name}
                </button>
              ))}
          </div>
          <form onSubmit={handleCustomAdd} className="flex gap-2 pt-2 border-t border-black/5">
            <input
              type="text"
              name="name"
              required
              placeholder="Eigener Name (z. B. Linsen-Stew)"
              className="flex-1 border border-black/10 rounded-lg px-3 py-2.5 text-[14px] focus:outline-none focus:border-terracotta/40"
            />
            <input
              type="number"
              name="target"
              defaultValue={6}
              min={1}
              max={20}
              className="w-16 border border-black/10 rounded-lg px-2 py-2.5 text-[14px] text-center focus:outline-none focus:border-terracotta/40"
              aria-label="Ziel-Portionen"
            />
            <button
              type="submit"
              className="bg-terracotta text-cream font-medium w-11 h-11 rounded-lg hover:brightness-95 transition flex items-center justify-center shrink-0"
              aria-label="Anlegen"
            >
              <Plus size={16} />
            </button>
          </form>
        </div>
      )}

      {list.length === 0 ? (
        <EmptyBank onStart={() => setAdding(true)} />
      ) : (
        <div className="bg-white rounded-2xl border border-black/5 divide-y divide-black/5 overflow-hidden">
          {list.map((cube) => (
            <CubeRow key={cube.id} cube={cube} />
          ))}
        </div>
      )}
    </section>
  )
}

function CubeRow({ cube }) {
  const status = cubeStatus(cube.amount ?? 0, cube.target ?? 6)
  const toneCls = cubeToneClasses(status)
  const target = cube.target ?? 6
  const current = cube.amount ?? 0

  async function handleMinus() {
    if (current === 0) return
    await adjustCubePortions(cube.id, -1)
  }
  async function handlePlus() {
    await adjustCubePortions(cube.id, +1)
  }
  async function handleRemove() {
    if (!confirm(`"${cube.name}" komplett aus der Bank entfernen?`)) return
    await removeCube(cube.id)
  }

  const pct = Math.min(100, (current / target) * 100)

  return (
    <div className="flex items-center gap-3 px-4 py-4">
      <span className="w-10 h-10 rounded-xl bg-[#AABCC4]/25 text-[#2E5C7B] flex items-center justify-center shrink-0">
        <Snowflake size={18} strokeWidth={2} />
      </span>

      <div className="flex-1 min-w-0">
        <div className="flex items-baseline justify-between gap-2">
          <p className="font-medium leading-tight truncate">{cube.name}</p>
          <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border shrink-0 ${toneCls}`}>
            {statusLabel(status)}
          </span>
        </div>
        <div className="mt-2">
          <div className="h-1.5 bg-black/[0.06] rounded-full overflow-hidden">
            <div
              className={`h-full transition-[width] duration-300 ease-out ${
                status === 'empty' ? 'bg-red-400' :
                status === 'low' ? 'bg-amber-500' :
                status === 'ok' ? 'bg-sage' : 'bg-sage'
              }`}
              style={{ width: `${pct}%` }}
            />
          </div>
          <p className="text-xs text-ink/55 mt-1 tabular-nums">
            {current} / {target} Portionen
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1.5 shrink-0">
        <button
          onClick={handleMinus}
          disabled={current === 0}
          className="w-11 h-11 rounded-full border border-black/10 hover:bg-black/5 disabled:opacity-30 flex items-center justify-center text-ink/65 transition"
          aria-label="Minus eine Portion"
        >
          <Minus size={16} strokeWidth={2.5} />
        </button>
        <button
          onClick={handlePlus}
          className="w-11 h-11 rounded-full bg-terracotta/10 hover:bg-terracotta/20 text-terracotta flex items-center justify-center transition"
          aria-label="Plus eine Portion"
        >
          <Plus size={16} strokeWidth={2.5} />
        </button>
        <button
          onClick={handleRemove}
          className="w-10 h-10 rounded-full hover:bg-red-50 text-ink/35 hover:text-red-600 flex items-center justify-center transition ml-0.5"
          aria-label="Cube-Typ entfernen"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  )
}

function statusLabel(status) {
  switch (status) {
    case 'empty': return 'LEER'
    case 'low': return 'NIEDRIG'
    case 'ok': return 'OK'
    case 'good': return 'GUT'
    default: return ''
  }
}

function FreezerTotalBadge({ total, target, status }) {
  const tone = cubeToneClasses(status)
  return (
    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${tone}`}>
      {total} / {target}
    </span>
  )
}

function EmptyBank({ onStart }) {
  return (
    <div className="bg-white rounded-2xl border border-black/5 p-6 text-center">
      <div className="w-12 h-12 rounded-2xl bg-[#AABCC4]/25 text-[#2E5C7B] flex items-center justify-center mx-auto mb-3">
        <Snowflake size={20} strokeWidth={1.8} />
      </div>
      <p className="font-medium text-[15px]">Keine Cubes angelegt</p>
      <p className="text-xs text-ink/55 mt-1.5 max-w-xs mx-auto leading-relaxed">
        6-8 Notfall-Portionen sind das Ziel. Bolognese, Dal, Curry – alles was sich einfrieren lässt.
      </p>
      <button
        onClick={onStart}
        className="mt-4 inline-flex items-center gap-1.5 bg-terracotta text-cream font-medium text-sm px-4 py-2.5 rounded-xl hover:brightness-95 transition"
      >
        <Plus size={14} /> Ersten Cube-Typ anlegen
      </button>
    </div>
  )
}
