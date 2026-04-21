import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { X, ChevronLeft, ChevronRight, Check } from 'lucide-react'
import { useRecipe, incrementCookCount } from '../db/hooks'
import MeshGradient, { variantForCuisine } from '../components/ui/MeshGradient'

export default function RezeptKochen() {
  const { id } = useParams()
  const navigate = useNavigate()
  const recipe = useRecipe(id)
  const [step, setStep] = useState(0)
  const [burst, setBurst] = useState(0)

  useEffect(() => {
    document.documentElement.style.setProperty('background-color', '#161615')
    return () => document.documentElement.style.removeProperty('background-color')
  }, [])

  if (recipe === undefined) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center bg-[#161615] text-paper-dark">
        <p>Lade …</p>
      </div>
    )
  }
  if (recipe === null) {
    return (
      <div className="min-h-[100dvh] flex flex-col items-center justify-center bg-[#161615] text-paper-dark gap-3">
        <p>Rezept nicht gefunden</p>
        <Link to="/rezepte" className="text-terracotta underline">Zurück</Link>
      </div>
    )
  }

  const total = recipe.steps.length
  const isLast = step === total - 1
  const progress = total > 0 ? ((step + 1) / total) * 100 : 0

  function next() {
    setStep((s) => Math.min(total - 1, s + 1))
    setBurst((b) => b + 1)
  }

  async function finish() {
    await incrementCookCount(recipe.id)
    navigate(`/rezepte/${recipe.id}`)
  }

  return (
    <div className="min-h-[100dvh] relative overflow-hidden text-paper-dark flex flex-col">
      {/* Ambient hearth background */}
      <div className="absolute inset-0 z-0 opacity-50">
        <MeshGradient variant={variantForCuisine(recipe.cuisine)} animated timeAware={false} />
      </div>
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#161615]/40 via-[#161615]/70 to-[#161615]" />

      {/* Top bar */}
      <div className="relative z-10 flex items-center justify-between px-5 pt-[max(env(safe-area-inset-top),1.25rem)] pb-4">
        <button
          onClick={() => navigate(`/rezepte/${recipe.id}`)}
          className="w-10 h-10 rounded-full bg-white/10 backdrop-blur flex items-center justify-center hover:bg-white/15 transition"
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
      <div className="relative z-10 px-5">
        <div className="h-1 bg-white/10 rounded-full overflow-hidden backdrop-blur">
          <div
            className="h-full bg-gradient-to-r from-terracotta via-[#E89B6B] to-sage transition-[width] duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-xs text-paper-dark/50 text-center mt-2 tabular-nums">
          Schritt {step + 1} von {total}
        </p>
      </div>

      {/* Step content */}
      <div key={step} className="relative z-10 flex-1 flex items-center justify-center px-6 py-10 animate-[step-in_0.5s_cubic-bezier(0.2,0.8,0.3,1)]">
        <div className="max-w-2xl w-full">
          <div className="relative w-16 h-16 rounded-2xl bg-terracotta/25 backdrop-blur text-terracotta flex items-center justify-center text-2xl font-bold mb-6 tabular-nums border border-terracotta/30">
            {step + 1}
            {burst > 0 && (
              <span
                key={burst}
                className="absolute inset-0 rounded-2xl border-2 border-terracotta animate-[burst_0.6s_ease-out]"
              />
            )}
          </div>
          <p className="text-2xl md:text-3xl font-medium leading-relaxed text-paper-dark drop-shadow">
            {recipe.steps[step]}
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="relative z-10 flex gap-3 px-5 pb-[max(env(safe-area-inset-bottom),1.5rem)]">
        <button
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
          className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur flex items-center justify-center disabled:opacity-30 hover:bg-white/15 transition"
          aria-label="Zurück"
        >
          <ChevronLeft size={24} />
        </button>
        {isLast ? (
          <button
            onClick={finish}
            className="flex-1 flex items-center justify-center gap-2 bg-terracotta text-cream font-semibold py-4 rounded-2xl text-lg hover:brightness-95 transition shadow-lg shadow-terracotta/30"
          >
            <Check size={22} strokeWidth={2.5} />
            Fertig gekocht
          </button>
        ) : (
          <button
            onClick={next}
            className="flex-1 flex items-center justify-center gap-2 bg-terracotta text-cream font-semibold py-4 rounded-2xl text-lg hover:brightness-95 transition shadow-lg shadow-terracotta/30"
          >
            Weiter
            <ChevronRight size={22} strokeWidth={2.5} />
          </button>
        )}
      </div>

      <style>{`
        @keyframes step-in {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes burst {
          0% { transform: scale(1); opacity: 0.8; }
          100% { transform: scale(1.8); opacity: 0; }
        }
      `}</style>
    </div>
  )
}
