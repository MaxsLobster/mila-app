import { Link } from 'react-router-dom'
import { Sun, Moon, Timer, ChevronRight } from 'lucide-react'
import { DAY_MODES } from '../../lib/mealplan'
import { formatTime } from '../../lib/recipe'

export default function TodayTimeline({ dayKey, day, mittag, abend, weekKey }) {
  const mode = day?.mode
  const modeConf = mode ? DAY_MODES[mode] : null
  const prep = computePrepHint({ mode, mittag, abend })

  return (
    <section>
      <div className="flex items-center justify-between mb-3 px-1">
        <h2 className="text-[11px] uppercase tracking-[0.15em] text-ink/50 font-semibold">
          Heute
        </h2>
        {modeConf && (
          <span className="text-[11px] font-medium px-2 py-0.5 bg-black/[0.04] text-ink/65 rounded-full">
            {modeConf.emoji} {modeConf.label}
          </span>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-black/5 divide-y divide-black/5 overflow-hidden">
        <Row
          icon={Sun}
          label="Mittag"
          recipe={mittag}
          href={mittag ? `/rezepte/${mittag.id}` : `/woche`}
          hasPlan={Boolean(day?.mittag)}
        />
        <Row
          icon={Moon}
          label="Abend"
          recipe={abend}
          href={abend ? `/rezepte/${abend.id}` : `/woche`}
          hasPlan={Boolean(day?.abend)}
        />
        {prep && (
          <div className="flex items-center gap-3 px-4 py-3">
            <span className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
              <Timer size={17} strokeWidth={2} />
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] uppercase tracking-wider font-semibold text-ink/45">Vorbereitung</p>
              <p className="font-medium text-[15px] leading-tight mt-0.5">{prep.title}</p>
              {prep.sub && <p className="text-xs text-ink/55 mt-0.5">{prep.sub}</p>}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

function Row({ icon: Icon, label, recipe, href, hasPlan }) {
  return (
    <Link to={href} className="flex items-center gap-3 px-4 py-3 hover:bg-black/[0.02] transition">
      <span className="w-9 h-9 rounded-xl bg-black/[0.04] text-ink/60 flex items-center justify-center shrink-0">
        <Icon size={17} strokeWidth={2} />
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] uppercase tracking-wider font-semibold text-ink/45">{label}</p>
        {recipe ? (
          <p className="font-medium text-[15px] leading-tight mt-0.5 truncate">{recipe.name}</p>
        ) : hasPlan ? (
          <p className="italic text-[15px] text-ink/45 leading-tight mt-0.5">Rezept gelöscht</p>
        ) : (
          <p className="italic text-[15px] text-ink/45 leading-tight mt-0.5">Noch offen</p>
        )}
        {recipe && (
          <p className="text-xs text-ink/50 mt-0.5">{formatTime(recipe.time_min)} · {recipe.portions} Portionen</p>
        )}
      </div>
      <ChevronRight size={16} className="text-ink/25 shrink-0" />
    </Link>
  )
}

function computePrepHint({ mode, mittag, abend }) {
  if (mode === 'from_prep' && abend) {
    return {
      title: 'Portion aus Freezer rausnehmen',
      sub: `Für ${abend.name} heute Abend auftauen`,
    }
  }
  const checkName = (recipe) => {
    if (!recipe?.ingredients) return false
    return recipe.ingredients.some((i) =>
      /hack|rind|lamm|hähnchen|fleisch|fisch/i.test(i.name) && !i.pantry_basic
    )
  }
  if (mode === 'mealprep_cook_day' && (checkName(mittag) || checkName(abend))) {
    return {
      title: 'Fleisch bereitstellen',
      sub: 'Heute ist Kochtag – Fleisch aus Kühlschrank auf Zimmertemperatur',
    }
  }
  return null
}
