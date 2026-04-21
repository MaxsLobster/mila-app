import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Clock, Star, ChefHat } from 'lucide-react'
import { CATEGORY_LABELS, formatTime } from '../../lib/recipe'
import MeshGradient, { variantForCuisine } from '../ui/MeshGradient'
import { navigateWithTransition, heroTransitionName, titleTransitionName } from '../../lib/transition'

export default function RecipeCard({ recipe }) {
  const navigate = useNavigate()
  const cardRef = useRef(null)

  function handleClick(e) {
    e.preventDefault()
    navigateWithTransition(navigate, `/rezepte/${recipe.id}`)
  }

  function handlePointerMove(e) {
    const el = cardRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width - 0.5  // -0.5 to 0.5
    const py = (e.clientY - rect.top) / rect.height - 0.5
    el.style.setProperty('--tilt-x', `${py * -6}deg`)
    el.style.setProperty('--tilt-y', `${px * 8}deg`)
    el.style.setProperty('--lift', '6px')
    el.style.setProperty('--shine-x', `${(px + 0.5) * 100}%`)
    el.style.setProperty('--shine-y', `${(py + 0.5) * 100}%`)
  }

  function handlePointerLeave() {
    const el = cardRef.current
    if (!el) return
    el.style.setProperty('--tilt-x', '0deg')
    el.style.setProperty('--tilt-y', '0deg')
    el.style.setProperty('--lift', '0px')
  }

  return (
    <a
      ref={cardRef}
      href={`#/rezepte/${recipe.id}`}
      onClick={handleClick}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      data-mesh-host
      className="card-tilt group bg-white rounded-2xl overflow-hidden border border-black/5 hover:border-terracotta/30 block relative"
    >
      <div
        className="aspect-[4/3] relative"
        style={{ viewTransitionName: heroTransitionName(recipe.id) }}
      >
        <MeshGradient variant={variantForCuisine(recipe.cuisine)} animated interactive />
        <div className="relative z-10 w-full h-full flex items-center justify-center card-icon-float">
          <ChefHat size={36} strokeWidth={1.5} className="text-white/80 drop-shadow-sm" />
        </div>
        <div className="card-shine" aria-hidden />
        {recipe.favorite && (
          <div className="absolute top-2.5 right-2.5 z-20 w-7 h-7 rounded-full bg-white/85 backdrop-blur flex items-center justify-center">
            <Star size={14} fill="currentColor" className="text-terracotta" />
          </div>
        )}
        {recipe.valerie_tauglich && (
          <span className="absolute top-2.5 left-2.5 z-20 text-[10px] font-medium px-2 py-0.5 bg-sage/90 text-white rounded-full">
            Valerie
          </span>
        )}
      </div>
      <div className="p-3.5">
        <h3
          className="font-semibold text-[15px] leading-tight line-clamp-2"
          style={{ viewTransitionName: titleTransitionName(recipe.id) }}
        >
          {recipe.name}
        </h3>
        <div className="flex items-center gap-2 mt-2 text-xs text-ink/55">
          <Clock size={12} />
          <span>{formatTime(recipe.time_min)}</span>
          <span className="text-ink/30">·</span>
          <span>{CATEGORY_LABELS[recipe.category]}</span>
        </div>
      </div>
    </a>
  )
}
