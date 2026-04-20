export const DAY_KEYS = ['mo', 'di', 'mi', 'do', 'fr', 'sa', 'so']

export const DAY_LABELS_SHORT = { mo: 'Mo', di: 'Di', mi: 'Mi', do: 'Do', fr: 'Fr', sa: 'Sa', so: 'So' }

export const DAY_LABELS_LONG = {
  mo: 'Montag', di: 'Dienstag', mi: 'Mittwoch', do: 'Donnerstag',
  fr: 'Freitag', sa: 'Samstag', so: 'Sonntag',
}

export function getISOWeek(date) {
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  const dayNum = d.getDay() || 7
  d.setDate(d.getDate() + 4 - dayNum)
  const yearStart = new Date(d.getFullYear(), 0, 1)
  const weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7)
  return { year: d.getFullYear(), week: weekNo }
}

export function formatWeekKey({ year, week }) {
  return `${year}-W${String(week).padStart(2, '0')}`
}

export function parseWeekKey(key) {
  const [y, w] = key.split('-W')
  return { year: Number(y), week: Number(w) }
}

export function getMondayOfWeek(year, week) {
  const jan4 = new Date(year, 0, 4)
  const jan4DayOffset = (jan4.getDay() + 6) % 7
  const week1Monday = new Date(jan4)
  week1Monday.setDate(jan4.getDate() - jan4DayOffset)
  const monday = new Date(week1Monday)
  monday.setDate(week1Monday.getDate() + (week - 1) * 7)
  return monday
}

export function getDatesOfWeek(year, week) {
  const monday = getMondayOfWeek(year, week)
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    return d
  })
}

export function addWeeks({ year, week }, delta) {
  const monday = getMondayOfWeek(year, week)
  monday.setDate(monday.getDate() + delta * 7)
  return getISOWeek(monday)
}

export function isSameDay(a, b) {
  return a.getFullYear() === b.getFullYear()
    && a.getMonth() === b.getMonth()
    && a.getDate() === b.getDate()
}

export function dayKeyForDate(date) {
  return DAY_KEYS[(date.getDay() + 6) % 7]
}

export function formatDayDate(date) {
  return date.toLocaleDateString('de-DE', { day: 'numeric', month: 'short' })
}

export function formatWeekRange(dates) {
  const first = dates[0]
  const last = dates[dates.length - 1]
  const sameMonth = first.getMonth() === last.getMonth()
  const firstStr = first.toLocaleDateString('de-DE', { day: 'numeric', month: sameMonth ? undefined : 'short' })
  const lastStr = last.toLocaleDateString('de-DE', { day: 'numeric', month: 'short' })
  return sameMonth ? `${first.getDate()}.–${lastStr}` : `${firstStr} – ${lastStr}`
}
