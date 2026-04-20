import { Link } from 'react-router-dom'
import { Clock, Star, ChefHat } from 'lucide-react'
import { CATEGORY_LABELS, formatTime } from '../../lib/recipe'
import MeshGradient, { variantForCuisine } from '../ui/MeshGradient'

export default function RecipeCard({ recipe }) {
  return (
    <Link
      to={`/rezepte/${recipe.id}`}
      className="group bg-white rounded-2xl overflow-hidden border border-black/5 hover:border-terracotta/30 transition block"
    >
      <div className="aspect-[4/3] relative">
        <MeshGradient variant={variantForCuisine(recipe.cuisine)} animated={false} />
        <div className="relative z-10 w-full h-full flex items-center justify-center">
          <ChefHat size={36} strokeWidth={1.5} className="text-white/80 drop-shadow-sm" />
        </div>
        {recipe.favorite && (
          <div className="absolute top-2.5 right-2.5 z-10 w-7 h-7 rounded-full bg-white/85 backdrop-blur flex items-center justify-center">
            <Star size={14} fill="currentColor" className="text-terracotta" />
          </div>
        )}
        {recipe.valerie_tauglich && (
          <span className="absolute top-2.5 left-2.5 z-10 text-[10px] font-medium px-2 py-0.5 bg-sage/90 text-white rounded-full">
            Valerie
          </span>
        )}
      </div>
      <div className="p-3.5">
        <h3 className="font-semibold text-[15px] leading-tight line-clamp-2">{recipe.name}</h3>
        <div className="flex items-center gap-2 mt-2 text-xs text-ink/55">
          <Clock size={12} />
          <span>{formatTime(recipe.time_min)}</span>
          <span className="text-ink/30">·</span>
          <span>{CATEGORY_LABELS[recipe.category]}</span>
        </div>
      </div>
    </Link>
  )
}
