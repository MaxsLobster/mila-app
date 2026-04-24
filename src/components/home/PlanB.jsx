import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Sparkles, Snowflake, Pizza, Zap, X } from 'lucide-react'
import { totalCubePortions } from '../../lib/cubes'
import { useToast } from '../ui/Toast'
import { setMealplanMode } from '../../db/hooks'

export default function PlanB({ cubes = [], weekKey, dayKey, onPick }) {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const toast = useToast()

  const cubePortions = totalCubePortions(cubes)
  const bestCube = [...cubes]
    .filter((c) => (c.amount ?? 0) > 0)
    .sort((a, b) => (b.amount ?? 0) - (a.amount ?? 0))[0]

  const options = []

  if (bestCube) {
    options.push({
      icon: Snowflake,
      title: `${bestCube.name} + Pasta`,
      sub: `15 min · ${bestCube.amount} Portion${bestCube.amount === 1 ? '' : 'en'} im Freezer`,
      tone: 'bg-[#AABCC4]/25 text-[#2E5C7B]',
      onClick: async () => {
        await setMealplanMode(weekKey, dayKey, 'from_prep')
        navigate('/vorrat')
        toast(`${bestCube.name} – bon appétit 🥡`, { tone: 'success' })
      },
    })
  }

  options.push({
    icon: Zap,
    title: 'Aglio e Olio oder Shakshuka',
    sub: '15–25 min · Zutaten meist da',
    tone: 'bg-terracotta/10 text-terracotta',
    onClick: () => {
      navigate('/rezepte')
      toast('Schnell-Kategorie gefiltert', { tone: 'info' })
    },
  })

  options.push({
    icon: Pizza,
    title: 'Pizza holen',
    sub: 'Ist heute ok. Keine Schuld.',
    tone: 'bg-amber-100 text-amber-700',
    onClick: async () => {
      await setMealplanMode(weekKey, dayKey, 'frei')
      toast('Pizza-Mode aktiviert 🍕', { tone: 'success' })
      setOpen(false)
    },
  })

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="w-full bg-gradient-to-br from-terracotta/8 to-sage/10 rounded-2xl p-4 border border-terracotta/15 flex items-center gap-3 hover:from-terracotta/12 hover:to-sage/14 transition text-left"
      >
        <span className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shrink-0 shadow-sm">
          <Sparkles size={18} className="text-terracotta" strokeWidth={2.2} />
        </span>
        <div className="flex-1">
          <p className="font-medium text-[15px] leading-tight">Kein Bock? Plan B</p>
          <p className="text-xs text-ink/55 mt-0.5">Freezer-Option · Schnell-Rezept · Pizza</p>
        </div>
        <span className="text-ink/30">›</span>
      </button>
    )
  }

  return (
    <section>
      <div className="flex items-center justify-between mb-3 px-1">
        <h2 className="text-[11px] uppercase tracking-[0.15em] text-ink/50 font-semibold">
          Plan B
        </h2>
        <button
          onClick={() => setOpen(false)}
          className="text-ink/40 hover:text-ink p-1 -m-1"
          aria-label="Schließen"
        >
          <X size={16} />
        </button>
      </div>
      <div className="bg-white rounded-2xl border border-black/5 divide-y divide-black/5 overflow-hidden">
        {options.map((opt, i) => (
          <button
            key={i}
            onClick={opt.onClick}
            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-black/[0.02] transition text-left"
          >
            <span className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${opt.tone}`}>
              <opt.icon size={17} strokeWidth={2.2} />
            </span>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-[15px] leading-tight">{opt.title}</p>
              <p className="text-xs text-ink/55 mt-0.5">{opt.sub}</p>
            </div>
          </button>
        ))}
      </div>
    </section>
  )
}
