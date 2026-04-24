import { DAY_MODES } from './mealplan'
import { totalCubePortions } from './cubes'

const TONES = {
  good: 'good',
  info: 'info',
  warning: 'warning',
}

const HEADERS_BY_HOUR = [
  { max: 10, text: 'Guten Morgen' },
  { max: 14, text: 'Moin' },
  { max: 18, text: 'Hi' },
  { max: 22, text: 'Guten Abend' },
  { max: 24, text: 'Späte Stunde' },
]

export function greetingForHour(hour = new Date().getHours()) {
  return HEADERS_BY_HOUR.find((h) => hour < h.max)?.text ?? 'Hi'
}

function nameOnly(recipe) {
  if (!recipe) return null
  return recipe.name
}

function shortIngredientList(items, max = 2) {
  if (!items || items.length === 0) return ''
  if (items.length === 1) return items[0].name
  if (items.length <= max) return items.slice(0, -1).map((i) => i.name).join(', ') + ' und ' + items[items.length - 1].name
  return `${items[0].name}, ${items[1].name} und ${items.length - 2} weitere`
}

/**
 * Generates a Mila-style briefing based on current state.
 */
export function generateBriefing({ today = {}, openShopping = [], cubes = [], expiring = [] }) {
  const { mittag, abend, mode } = today
  const hasMittag = Boolean(mittag)
  const hasAbend = Boolean(abend)
  const planComplete = hasMittag && hasAbend
  const planEmpty = !hasMittag && !hasAbend
  const modeLabel = mode ? DAY_MODES[mode]?.label : null

  const cubePortions = totalCubePortions(cubes)

  const todayIngredients = new Set(
    [mittag, abend]
      .filter(Boolean)
      .flatMap((r) => r.ingredients || [])
      .filter((i) => !i.pantry_basic)
      .map((i) => i.name.trim().toLowerCase())
  )
  const missingForToday = openShopping.filter((s) =>
    todayIngredients.has(s.name.trim().toLowerCase())
  )

  const urgentExpiring = expiring.filter((e) => (e.daysLeft ?? 99) <= 2)

  if (planEmpty) {
    if (cubePortions === 0) {
      return {
        tone: TONES.warning,
        title: 'Kein Plan, leerer Freezer',
        body: 'Quick-Fix: Aglio e Olio in 15 min – Zutaten sind meist da. Oder Pizza, ist heute ok.',
        prefix: 'Mila sagt',
      }
    }
    const bestCube = [...cubes].sort((a, b) => (b.amount ?? 0) - (a.amount ?? 0))[0]
    return {
      tone: TONES.info,
      title: 'Plan fehlt für heute',
      body: `Freezer hat ${cubePortions} Portionen – heute einfach ${bestCube?.name ?? 'Freezer'} + Pasta?`,
      prefix: 'Mila sagt',
    }
  }

  if (planComplete) {
    if (missingForToday.length > 0) {
      const missingText = shortIngredientList(missingForToday)
      const dish = mode === 'from_prep' ? nameOnly(abend) : (nameOnly(abend) ?? nameOnly(mittag))
      return {
        tone: TONES.info,
        title: 'Fast easy',
        body: `${dish} steht, aber ${missingText} ${missingForToday.length === 1 ? 'fehlt' : 'fehlen'} noch.`,
        prefix: 'Mila sagt',
      }
    }

    if (urgentExpiring.length > 0) {
      return {
        tone: TONES.info,
        title: `Heute ${modeLabel?.toLowerCase() ?? 'easy'}`,
        body: `Plan läuft. Verbrauche aber heute oder morgen: ${urgentExpiring.slice(0, 2).map((e) => e.name).join(', ')}.`,
        prefix: 'Mila sagt',
      }
    }

    if (cubePortions < 4) {
      return {
        tone: TONES.good,
        title: `Heute ${modeLabel?.toLowerCase() ?? 'easy'}`,
        body: `${nameOnly(mittag)} Mittag, ${nameOnly(abend)} Abend. Freezer wird dünn – nächsten Kochtag Basis nachlegen.`,
        prefix: 'Mila sagt',
      }
    }

    if (mode === 'from_prep') {
      return {
        tone: TONES.good,
        title: 'Heute easy',
        body: `${nameOnly(abend) ?? 'Abendessen'} aus dem Prep. Kein Stress, kein Einkauf.`,
        prefix: 'Mila sagt',
      }
    }
    if (mode === 'grill') {
      return {
        tone: TONES.good,
        title: 'Grill-Abend',
        body: `${nameOnly(abend) ?? 'Grill'} steht. Alles da, Kohle anzünden.`,
        prefix: 'Mila sagt',
      }
    }
    return {
      tone: TONES.good,
      title: `Heute ${modeLabel?.toLowerCase() ?? 'geplant'}`,
      body: `${nameOnly(mittag) ?? 'Mittag'} & ${nameOnly(abend) ?? 'Abend'} stehen. Alles da.`,
      prefix: 'Mila sagt',
    }
  }

  const setMeal = hasMittag ? 'Mittag' : 'Abend'
  const setRecipe = hasMittag ? mittag : abend
  const openMeal = hasMittag ? 'Abend' : 'Mittag'
  const cubeHint = cubePortions > 0 ? ` Freezer hat ${cubePortions} Portionen als Backup.` : ''
  return {
    tone: TONES.info,
    title: `Nur ${setMeal} steht`,
    body: `${setRecipe.name} ist gesetzt. ${openMeal} noch frei – Zeit, etwas zu wählen.${cubeHint}`,
    prefix: 'Mila sagt',
  }
}

/**
 * „Heute im Blick" – max 3 priorisierte Items. Bewusst ruhig formuliert.
 */
export function generateJetztWichtig({ today = {}, openShopping = [], cubes = [], expiring = [] }) {
  const actions = []
  const { mittag, abend, mode } = today

  const todayIngredients = new Set(
    [mittag, abend]
      .filter(Boolean)
      .flatMap((r) => r.ingredients || [])
      .filter((i) => !i.pantry_basic)
      .map((i) => i.name.trim().toLowerCase())
  )
  const needed = openShopping.filter((s) =>
    todayIngredients.has(s.name.trim().toLowerCase())
  )
  if (needed.length > 0) {
    actions.push({
      icon: 'shopping',
      title: `${needed.length} Zutat${needed.length === 1 ? '' : 'en'} heute einkaufen`,
      sub: needed.slice(0, 3).map((n) => n.name).join(', ') + (needed.length > 3 ? ' …' : ''),
      to: '/einkauf',
    })
  }

  const urgent = expiring.filter((e) => (e.daysLeft ?? 99) <= 2)
  if (urgent.length > 0) {
    actions.push({
      icon: 'expiring',
      title: `${urgent.length} Artikel läuft bald ab`,
      sub: urgent.slice(0, 3).map((u) => u.name).join(', '),
      to: '/vorrat',
    })
  }

  if (mode === 'from_prep' && abend) {
    actions.push({
      icon: 'thaw',
      title: 'Aus Freezer holen',
      sub: `${abend.name} für heute Abend auftauen`,
      to: '/vorrat',
    })
  }

  const cubeTotal = totalCubePortions(cubes)
  if (cubeTotal < 3) {
    actions.push({
      icon: 'cube',
      title: 'Freezer wird dünn',
      sub: `Nur ${cubeTotal} Portion${cubeTotal === 1 ? '' : 'en'} übrig – nächster Kochtag Basis nachlegen`,
      to: '/vorrat',
    })
  }

  if (actions.length < 3 && openShopping.length > 0 && needed.length === 0) {
    actions.push({
      icon: 'shopping',
      title: `${openShopping.length} Artikel auf der Liste`,
      sub: openShopping.slice(0, 3).map((i) => i.name).join(', ') + (openShopping.length > 3 ? ' …' : ''),
      to: '/einkauf',
    })
  }

  return actions.slice(0, 3)
}

/**
 * „Küchenlage" – ein beruhigendes Zwei-Wort-Status-Signal für die Home,
 * wenn „Heute im Blick" leer ist.
 *
 * Rückgabe:
 *   label:   'safe' | 'stabil' | 'improvisierbar' | 'dünn'
 *   detail:  kurzer, warmer Halbsatz zur Situation
 */
export function generateKuechenLage({ today = {}, cubes = [] }) {
  const hasMittag = Boolean(today.mittag)
  const hasAbend = Boolean(today.abend)
  const planComplete = hasMittag && hasAbend
  const hasAnyPlan = hasMittag || hasAbend
  const cubePortions = totalCubePortions(cubes)
  const cubesOkay = cubePortions >= 4

  if (planComplete && cubesOkay) {
    return { label: 'safe', detail: 'Plan steht, Freezer ist okay.' }
  }
  if (planComplete) {
    return { label: 'stabil', detail: 'Plan steht. Freezer wird dünn, aber heute reicht\'s.' }
  }
  if (cubesOkay) {
    return {
      label: 'improvisierbar',
      detail: hasAnyPlan ? 'Teilplan, aber Freezer fängt auf.' : 'Freezer rettet den Abend.',
    }
  }
  return { label: 'dünn', detail: 'Heute lieber einfach halten.' }
}
