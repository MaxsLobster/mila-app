import { flushSync } from 'react-dom'

export function navigateWithTransition(navigate, to) {
  if (typeof document !== 'undefined' && document.startViewTransition) {
    document.startViewTransition(() => {
      flushSync(() => navigate(to))
    })
  } else {
    navigate(to)
  }
}

export function heroTransitionName(recipeId) {
  return recipeId ? `recipe-hero-${recipeId}` : undefined
}

export function titleTransitionName(recipeId) {
  return recipeId ? `recipe-title-${recipeId}` : undefined
}
