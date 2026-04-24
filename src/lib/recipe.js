export const CATEGORY_LABELS = {
  schnell: 'Schnell',
  mealprep: 'Mealprep',
  wochenende: 'Wochenende',
  grill: 'Grill',
  fruehstueck: 'Frühstück',
}

export const CUISINE_LABELS = {
  italienisch:     'Italienisch',
  levante:         'Levante',
  asiatisch:       'Asiatisch',
  japanisch:       'Japanisch',
  vietnamesisch:   'Vietnamesisch',
  chinesisch:      'Chinesisch',
  koreanisch:      'Koreanisch',
  thailaendisch:   'Thailändisch',
  indisch:         'Indisch',
  mediterran:      'Mediterran',
  griechisch:      'Griechisch',
  franzoesisch:    'Französisch',
  amerikanisch:    'Amerikanisch',
  fusion:          'Fusion',
}

export const DEVICE_LABELS = {
  thermomix: 'Thermomix',
  bge: 'Big Green Egg',
  plancha: 'Plancha',
  dutch_oven: 'Dutch Oven',
  ofen: 'Ofen',
  pfanne: 'Pfanne',
  wok: 'Wok',
  topf: 'Topf',
}

export const CATEGORIES = Object.keys(CATEGORY_LABELS)
export const CUISINES = Object.keys(CUISINE_LABELS)
export const DEVICES = Object.keys(DEVICE_LABELS)

export function emptyRecipe() {
  return {
    id: crypto.randomUUID(),
    name: '',
    category: 'mealprep',
    cuisine: 'italienisch',
    time_min: 30,
    portions: 4,
    valerie_tauglich: false,
    device: [],
    seasonal: null,
    ingredients: [{ name: '', amount: '', unit: '', pantry_basic: false }],
    steps: [''],
    notes: '',
    favorite: false,
    times_cooked: 0,
    created_at: new Date().toISOString(),
  }
}

export function formatTime(min) {
  if (min < 60) return `${min} min`
  const h = Math.floor(min / 60)
  const m = min % 60
  return m === 0 ? `${h} h` : `${h}h ${m}min`
}
