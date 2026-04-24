import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Clock, Star } from 'lucide-react'
import { CATEGORY_LABELS, formatTime } from '../../lib/recipe'
import RecipeArt from '../ui/RecipeArt'
import { navigateWithTransition, heroTransitionName, titleTransitionName } from '../../lib/transition'
import { useMotionFlags } from '../../lib/motion'

export default function RecipeCard({ recipe }) {
  const navigate = useNavigate()
  const cardRef = useRef(null)
  const { tiltOn, transitionsOn } = useMotionFlags()

  function handleClick(e) {
    e.preventDefault()
    if (transitionsOn) {
      navigateWithTransition(navigate, `/rezepte/${recipe.id}`)
    } else {
      navigate(`/rezepte/${recipe.id}`)
    }
  }

  function handlePointerMove(e) {
    if (!tiltOn) return
    const el = cardRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width - 0.5
    const py = (e.clientY - rect.top) / rect.height - 0.5
    el.style.setProperty('--tilt-x', `${py * -8}deg`)
    el.style.setProperty('--tilt-y', `${px * 10}deg`)
    el.style.setProperty('--lift', '8px')
    el.style.setProperty('--shine-x', `${(px + 0.5) * 100}%`)
    el.style.setProperty('--shine-y', `${(py + 0.5) * 100}%`)
  }

  function handlePointerLeave() {
    if (!tiltOn) return
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
      className={`${tiltOn ? 'card-tilt' : ''} group bg-white rounded-2xl overflow-hidden border border-black/5 hover:border-terracotta/30 block relative`}
    >
      <div
        className="aspect-[4/3] relative overflow-hidden"
        style={{ viewTransitionName: heroTransitionName(recipe.id) }}
      >
        <RecipeArt recipe={recipe} />
        <div className="card-shine" aria-hidden />
        {recipe.favorite && (
          <div className="absolute top-2.5 right-2.5 z-20 w-7 h-7 rounded-full bg-white/90 backdrop-blur flex items-center justify-center">
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
