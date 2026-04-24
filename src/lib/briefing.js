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
 * Inputs are the already-resolved data the caller has.
 *
 * @param {Object} ctx
 * @param {Object} ctx.today           - { mittag, abend, mode } recipe objects (or null)
 * @param {Array}  ctx.openShopping    - open shopping items
 * @param {Array}  ctx.cubes           - freezer cubes
 * @param {Array}  ctx.expiring        - pantry items expiring ≤ 3 days
 * @returns {{ tone, title, body, prefix }}
 */
export function generateBriefing({ today = {}, openShopping = [], cubes = [], expiring = [] }) {
  const { mittag, abend, mode } = today
  const hasMittag = Boolean(mittag)
  const hasAbend = Boolean(abend)
  const planComplete = hasMittag && hasAbend
  const planEmpty = !hasMittag && !hasAbend
  const modeLabel = mode ? DAY_MODES[mode]?.label : null

  const cubePortions = totalCubePortions(cubes)

  // Filter shopping items that match today's recipe ingredients
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

  // ─── Cascade ───

  // 1. Plan fehlt komplett
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

  // 2. Plan komplett
  if (planComplete) {
    // Urgent shopping that blocks today's cooking
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

    // Dringend ablaufend
    if (urgentExpiring.length > 0) {
      return {
        tone: TONES.info,
        title: `Heute ${modeLabel?.toLowerCase() ?? 'easy'}`,
        body: `Plan läuft. Verbrauche aber heute oder morgen: ${urgentExpiring.slice(0, 2).map((e) => e.name).join(', ')}.`,
        prefix: 'Mila sagt',
      }
    }

    // Freezer dünn trotz guten Plans
    if (cubePortions < 4) {
      return {
        tone: TONES.good,
        title: `Heute ${modeLabel?.toLowerCase() ?? 'easy'}`,
        body: `${nameOnly(mittag)} Mittag, ${nameOnly(abend)} Abend. Freezer wird dünn – nächsten Kochtag Basis nachlegen.`,
        prefix: 'Mila sagt',
      }
    }

    // Alles rund
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

  // 3. Plan nur teilweise
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
 * Generates a "Jetzt wichtig" action list – 1 to 3 items, prioritized.
 */
export function generateJetztWichtig({ today = {}, openShopping = [], cubes = [], expiring = [] }) {
  const actions = []
  const { mittag, abend, mode } = today

  // 1. Shopping items needed today
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

  // 2. Expiring urgently (≤2 days)
  const urgent = expiring.filter((e) => (e.daysLeft ?? 99) <= 2)
  if (urgent.length > 0) {
    actions.push({
      icon: 'expiring',
      title: `${urgent.length} Artikel läuft bald ab`,
      sub: urgent.slice(0, 3).map((u) => u.name).join(', '),
      to: '/vorrat',
    })
  }

  // 3. Vorbereitung: Abends from_prep → rausnehmen
  if (mode === 'from_prep' && abend) {
    actions.push({
      icon: 'thaw',
      title: 'Aus Freezer holen',
      sub: `${abend.name} für heute Abend auftauen`,
      to: '/vorrat',
    })
  }

  // 4. Cubes low overall
  const cubeTotal = totalCubePortions(cubes)
  if (cubeTotal < 3) {
    actions.push({
      icon: 'cube',
      title: 'Freezer wird dünn',
      sub: `Nur ${cubeTotal} Portion${cubeTotal === 1 ? '' : 'en'} übrig – nächster Kochtag Basis nachlegen`,
      to: '/vorrat',
    })
  }

  // 5. Open shopping (non-urgent, general reminder)
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
