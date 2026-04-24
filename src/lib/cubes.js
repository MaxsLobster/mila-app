/**
 * Freezer cubes are a special subset of pantry items:
 *   - location: 'freezer'
 *   - category: 'sauce_cube'
 *   - unit:     'Portionen'
 *   - amount:   number (current portions, 0 = empty)
 *   - target:   number (goal portions, e.g. 8)
 */

export const CUBE_CATEGORY = 'sauce_cube'
export const CUBE_UNIT = 'Portionen'

export const SUGGESTED_CUBES = [
  { name: 'Bolognese-Cubes',    target: 8 },
  { name: 'Dal-Cubes',          target: 6 },
  { name: 'Curry-Cubes',        target: 6 },
  { name: 'Brühe-Cubes',        target: 8 },
  { name: 'Bärlauch-Pesto',     target: 6 },
  { name: 'Tomatensauce-Cubes', target: 8 },
]

export const CUBE_TARGET_TOTAL_MIN = 6  // family emergency threshold
export const CUBE_TARGET_TOTAL_MAX = 8

export function cubeStatus(current, target) {
  if (!current || current === 0) return 'empty'
  const ratio = current / (target || 1)
  if (ratio <= 0.25) return 'low'
  if (ratio <= 0.66) return 'ok'
  return 'good'
}

export function cubeToneClasses(status) {
  switch (status) {
    case 'empty': return 'bg-red-100 text-red-700 border-red-200'
    case 'low':   return 'bg-amber-100 text-amber-800 border-amber-200'
    case 'ok':    return 'bg-sage/20 text-ink/75 border-sage/30'
    case 'good':  return 'bg-sage/30 text-ink/80 border-sage/40'
    default:      return 'bg-black/[0.04] text-ink/55 border-black/5'
  }
}

export function isCube(pantryItem) {
  return pantryItem?.category === CUBE_CATEGORY && pantryItem?.location === 'freezer'
}

export function totalCubePortions(cubes) {
  return cubes.reduce((sum, c) => sum + (Number(c.amount) || 0), 0)
}

export function totalCubeTarget(cubes) {
  return cubes.reduce((sum, c) => sum + (Number(c.target) || 0), 0)
}

export function statusForTotal(total) {
  if (total === 0) return 'empty'
  if (total < 4) return 'low'
  if (total < 6) return 'ok'
  return 'good'
}
