export const DAY_MODES = {
  mealprep_cook_day: {
    label: 'Kochtag',
    emoji: '🥡',
    description: 'Meal-Prep kochen',
    tone: 'terracotta',
  },
  from_prep: {
    label: 'Aus Prep',
    emoji: '🍱',
    description: 'Aus dem Vorrat aufwärmen',
    tone: 'sage',
  },
  fresh: {
    label: 'Frisch',
    emoji: '🍳',
    description: 'Frisch gekocht',
    tone: 'neutral',
  },
  grill: {
    label: 'Grill',
    emoji: '🔥',
    description: 'Am Grill / BGE',
    tone: 'terracotta-soft',
  },
  frei: {
    label: 'Frei',
    emoji: '—',
    description: 'Außer Haus / kein Plan',
    tone: 'muted',
  },
}

export const MODE_KEYS = Object.keys(DAY_MODES)

export const SLOTS = ['mittag', 'abend']

export const SLOT_LABELS = {
  mittag: 'Mittag',
  abend: 'Abend',
}
