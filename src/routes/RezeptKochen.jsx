import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { X, ChevronLeft, ChevronRight, Check } from 'lucide-react'
import { useRecipe, incrementCookCount } from '../db/hooks'

export default function RezeptKochen() {
  const { id } = useParams()
  const navigate = useNavigate()
  const recipe = useRecipe(id)
  const [step, setStep] = useState(0)

  useEffect(() => {
    document.documentElement.style.setProperty('background-color', '#1F1F1F')
    return () => document.documentElement.style.removeProperty('background-color')
  }, [])

  if (recipe === undefined) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center bg-ink-dark text-paper-dark">
        <p>Lade …</p>
      </div>
    )
  }
  if (recipe === null) {
    return (
      <div className="min-h-[100dvh] flex flex-col items-center justify-center bg-ink-dark text-paper-dark gap-3">
        <p>Rezept nicht gefunden</p>
        <Link to="/rezepte" className="text-terracotta underline">Zurück</Link>
      </div>
    )
  }

  const total = recipe.steps.length
  const isLast = step === total - 1
  const progress = total > 0 ? ((step + 1) / total) * 100 : 0

  async function finish() {
    await incrementCookCount(recipe.id)
    navigate(`/rezepte/${recipe.id}`)
  }

  return (
    <div className="min-h-[100dvh] bg-ink-dark text-paper-dark flex flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between px-5 pt-[max(env(safe-area-inset-top),1.25rem)] pb-4">
        <button
          onClick={() => navigate(`/rezepte/${recipe.id}`)}
          className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/15 transition"
          aria-label="Schließen"
        >
          <X size={20} strokeWidth={2} />
        </button>
        <div className="text-center">
          <p className="text-[10px] uppercase tracking-[0.2em] text-paper-dark/50 font-semibold">Kochen</p>
          <p className="text-sm font-medium truncate max-w-[60vw]">{recipe.name}</p>
        </div>
        <div className="w-10" />
      </div>

      {/* Progress */}
      <div className="px-5">
        <div className="h-1 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-terracotta transition-[width] duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-xs text-paper-dark/50 text-center mt-2 tabular-nums">
          Schritt {step + 1} von {total}
        </p>
      </div>

      {/* Step content */}
      <div className="flex-1 flex items-center justify-center px-6 py-10">
        <div className="max-w-2xl w-full">
          <div className="w-14 h-14 rounded-2xl bg-terracotta/20 text-terracotta flex items-center justify-center text-2xl font-bold mb-6 tabular-nums">
            {step + 1}
          </div>
          <p className="text-2xl md:text-3xl font-medium leading-relaxed text-paper-dark">
            {recipe.steps[step]}
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-3 px-5 pb-[max(env(safe-area-inset-bottom),1.5rem)]">
        <button
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
          className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center disabled:opacity-30 hover:bg-white/15 transition"
          aria-label="Zurück"
        >
          <ChevronLeft size={24} />
        </button>
        {isLast ? (
          <button
            onClick={finish}
            className="flex-1 flex items-center justify-center gap-2 bg-terracotta text-cream font-semibold py-4 rounded-2xl text-lg hover:brightness-95 transition"
          >
            <Check size={22} strokeWidth={2.5} />
            Fertig gekocht
          </button>
        ) : (
          <button
            onClick={() => setStep((s) => Math.min(total - 1, s + 1))}
            className="flex-1 flex items-center justify-center gap-2 bg-terracotta text-cream font-semibold py-4 rounded-2xl text-lg hover:brightness-95 transition"
          >
            Weiter
            <ChevronRight size={22} strokeWidth={2.5} />
          </button>
        )}
      </div>
    </div>
  )
}
