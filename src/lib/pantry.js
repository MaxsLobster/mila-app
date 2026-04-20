export const LOCATIONS = ['kuehlschrank', 'freezer', 'vorrat']

export const LOCATION_LABELS = {
  kuehlschrank: 'Kühlschrank',
  freezer: 'Freezer',
  vorrat: 'Vorrat',
}

function parseLocalDate(str) {
  if (!str) return null
  const [y, m, d] = str.split('-').map(Number)
  if (!y || !m || !d) return null
  return new Date(y, m - 1, d)
}

export function daysUntil(dateStr) {
  const target = parseLocalDate(dateStr)
  if (!target) return null
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  target.setHours(0, 0, 0, 0)
  return Math.round((target - now) / 86400000)
}

export function expiryTone(days) {
  if (days === null || days === undefined) return 'neutral'
  if (days < 0) return 'expired'
  if (days <= 2) return 'urgent'
  if (days <= 7) return 'soon'
  if (days <= 30) return 'fresh'
  return 'neutral'
}

export function formatExpiry(days) {
  if (days === null || days === undefined) return 'ohne Datum'
  if (days < 0) return `abgelaufen (${Math.abs(days)} T)`
  if (days === 0) return 'heute!'
  if (days === 1) return 'morgen'
  if (days < 14) return `in ${days} Tagen`
  if (days < 60) return `in ${Math.round(days / 7)} Wochen`
  return `in ${Math.round(days / 30)} Monaten`
}

export function toneClasses(tone) {
  switch (tone) {
    case 'urgent':
    case 'expired':
      return 'bg-red-100 text-red-700'
    case 'soon':
      return 'bg-amber-100 text-amber-800'
    case 'fresh':
      return 'bg-sage/20 text-ink/70'
    default:
      return 'bg-black/[0.04] text-ink/55'
  }
}

export function toneDotColor(tone) {
  switch (tone) {
    case 'urgent':
    case 'expired':
      return 'bg-red-500'
    case 'soon':
      return 'bg-amber-500'
    case 'fresh':
      return 'bg-sage'
    default:
      return 'bg-black/15'
  }
}
