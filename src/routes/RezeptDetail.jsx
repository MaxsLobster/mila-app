import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, Star, Edit3, Trash2, ChefHat, Clock, Users, Flame, Baby } from 'lucide-react'
import { useRecipe, toggleFavorite, deleteRecipe } from '../db/hooks'
import { CATEGORY_LABELS, CUISINE_LABELS, DEVICE_LABELS, formatTime } from '../lib/recipe'
import MeshGradient, { variantForCuisine } from '../components/ui/MeshGradient'
import { useToast } from '../components/ui/Toast'

export default function RezeptDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const recipe = useRecipe(id)
  const toast = useToast()

  if (recipe === undefined) return <SkeletonDetail />
  if (recipe === null) return <NotFound />

  async function handleDelete() {
    if (!confirm(`"${recipe.name}" wirklich löschen?`)) return
    await deleteRecipe(recipe.id)
    toast(`"${recipe.name}" gelöscht`, { tone: 'info' })
    navigate('/rezepte')
  }

  async function handleFavorite() {
    await toggleFavorite(recipe.id, recipe.favorite)
    toast(recipe.favorite ? 'Favorit entfernt' : 'Zu Favoriten', { tone: 'success' })
  }

  return (
    <div className="space-y-6">
      <Link to="/rezepte" className="inline-flex items-center gap-1.5 text-sm text-ink/60 hover:text-ink">
        <ArrowLeft size={16} />
        Alle Rezepte
      </Link>

      {/* Hero */}
      <div className="bg-white rounded-2xl overflow-hidden border border-black/5">
        <div className="aspect-[16/9] relative">
          <MeshGradient variant={variantForCuisine(recipe.cuisine)} />
          <div className="relative z-10 w-full h-full flex items-center justify-center">
            <ChefHat size={56} strokeWidth={1.5} className="text-white/80 drop-shadow" />
          </div>
          <button
            onClick={handleFavorite}
            className="absolute top-3 right-3 z-20 w-10 h-10 rounded-full bg-white/90 backdrop-blur flex items-center justify-center hover:bg-white transition"
            aria-label={recipe.favorite ? 'Favorit entfernen' : 'Als Favorit markieren'}
          >
            <Star
              size={18}
              fill={recipe.favorite ? 'currentColor' : 'none'}
              className={recipe.favorite ? 'text-terracotta' : 'text-ink/50'}
              strokeWidth={2}
            />
          </button>
        </div>

        <div className="p-5 md:p-6 space-y-4">
          <div>
            <div className="flex flex-wrap gap-1.5 mb-2.5">
              <Badge>{CATEGORY_LABELS[recipe.category]}</Badge>
              <Badge>{CUISINE_LABELS[recipe.cuisine]}</Badge>
              {recipe.valerie_tauglich && (
                <Badge tone="sage">
                  <Baby size={11} strokeWidth={2.5} /> Valerie
                </Badge>
              )}
            </div>
            <h1 className="text-2xl md:text-3xl font-semibold tracking-tight leading-tight">{recipe.name}</h1>
          </div>

          <div className="flex flex-wrap gap-4 text-sm text-ink/65">
            <Meta icon={Clock}>{formatTime(recipe.time_min)}</Meta>
            <Meta icon={Users}>{recipe.portions} Portionen</Meta>
            {recipe.device?.length > 0 && (
              <Meta icon={Flame}>{recipe.device.map((d) => DEVICE_LABELS[d]).join(', ')}</Meta>
            )}
            {recipe.times_cooked > 0 && (
              <Meta icon={null}>{recipe.times_cooked}× gekocht</Meta>
            )}
          </div>

          <div className="flex gap-2 pt-1">
            <Link
              to={`/rezepte/${recipe.id}/kochen`}
              className="flex-1 bg-terracotta text-cream font-medium py-3 rounded-xl hover:brightness-95 active:brightness-90 transition text-center"
            >
              Kochen starten
            </Link>
            <Link
              to={`/rezepte/${recipe.id}/bearbeiten`}
              className="px-4 py-3 border border-black/10 rounded-xl hover:bg-black/[0.03] transition"
              aria-label="Bearbeiten"
            >
              <Edit3 size={17} className="text-ink/70" />
            </Link>
            <button
              onClick={handleDelete}
              className="px-4 py-3 border border-black/10 rounded-xl hover:bg-red-50 hover:border-red-200 transition group"
              aria-label="Löschen"
            >
              <Trash2 size={17} className="text-ink/60 group-hover:text-red-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Ingredients */}
      <section>
        <h2 className="text-[11px] uppercase tracking-[0.15em] text-ink/50 font-semibold mb-3 px-1">
          Zutaten <span className="text-ink/30 normal-case font-normal">· für {recipe.portions} Portionen</span>
        </h2>
        <div className="bg-white rounded-2xl border border-black/5 divide-y divide-black/5 overflow-hidden">
          {recipe.ingredients.map((ing, i) => (
            <div key={i} className="flex items-baseline justify-between gap-3 px-5 py-3">
              <span className={`${ing.pantry_basic ? 'text-ink/60' : 'text-ink'}`}>{ing.name}</span>
              <span className="text-sm text-ink/55 shrink-0 tabular-nums">
                {ing.amount}{ing.unit && ing.amount ? ' ' : ''}{ing.unit}
              </span>
            </div>
          ))}
        </div>
        {recipe.ingredients.some((i) => i.pantry_basic) && (
          <p className="text-xs text-ink/40 mt-2 px-1">Grau = Pantry-Basics, kommen nicht auf die Einkaufsliste.</p>
        )}
      </section>

      {/* Steps */}
      <section>
        <h2 className="text-[11px] uppercase tracking-[0.15em] text-ink/50 font-semibold mb-3 px-1">
          Schritte
        </h2>
        <ol className="space-y-3">
          {recipe.steps.map((step, i) => (
            <li key={i} className="bg-white rounded-2xl border border-black/5 p-4 flex gap-4">
              <span className="w-7 h-7 shrink-0 rounded-full bg-terracotta/10 text-terracotta flex items-center justify-center text-sm font-semibold tabular-nums">
                {i + 1}
              </span>
              <p className="leading-relaxed text-[15px] text-ink/85">{step}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Notes */}
      {recipe.notes && (
        <section>
          <h2 className="text-[11px] uppercase tracking-[0.15em] text-ink/50 font-semibold mb-3 px-1">
            Notizen
          </h2>
          <div className="bg-sage/10 border border-sage/20 rounded-2xl p-5 text-[15px] text-ink/85 leading-relaxed whitespace-pre-wrap">
            {recipe.notes}
          </div>
        </section>
      )}
    </div>
  )
}

function Badge({ children, tone = 'neutral' }) {
  const classes = tone === 'sage'
    ? 'bg-sage/20 text-ink/80'
    : 'bg-black/[0.04] text-ink/70'
  return (
    <span className={`inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-full ${classes}`}>
      {children}
    </span>
  )
}

function Meta({ icon: Icon, children }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      {Icon && <Icon size={14} strokeWidth={2} className="text-ink/45" />}
      {children}
    </span>
  )
}

function SkeletonDetail() {
  return (
    <div className="space-y-5 animate-pulse">
      <div className="h-4 w-32 bg-black/5 rounded" />
      <div className="bg-white rounded-2xl border border-black/5 overflow-hidden">
        <div className="aspect-[16/9] bg-black/5" />
        <div className="p-5 space-y-3">
          <div className="h-8 bg-black/5 rounded w-3/4" />
          <div className="h-4 bg-black/5 rounded w-1/2" />
          <div className="h-12 bg-black/5 rounded-xl mt-4" />
        </div>
      </div>
    </div>
  )
}

function NotFound() {
  return (
    <div className="text-center py-16">
      <p className="font-medium text-lg">Rezept nicht gefunden</p>
      <Link to="/rezepte" className="inline-block mt-4 text-terracotta hover:underline">
        Zurück zu allen Rezepten
      </Link>
    </div>
  )
}
