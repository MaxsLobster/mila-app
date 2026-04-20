const VARIANTS = {
  warm:         ['#E8A77C', '#C87D5A', '#C3D0AA'],
  italienisch:  ['#E89B6B', '#D4846A', '#A3B18A'],
  asiatisch:    ['#C8D4A0', '#D4BC7C', '#C87D5A'],
  levante:      ['#D4A67C', '#C4A05A', '#C4B087'],
  mediterran:   ['#A8BAC4', '#A3B18A', '#D4A67C'],
  fusion:       ['#C87D5A', '#A3B18A', '#9E8CA8'],
  sage:         ['#B8C4A0', '#C3D0AA', '#E8D5AB'],
  dusk:         ['#B49CB8', '#C87D5A', '#A3B18A'],
}

export default function MeshGradient({ variant = 'warm', animated = true, className = '', baseColor }) {
  const colors = VARIANTS[variant] ?? VARIANTS.warm
  return (
    <div
      className={`mesh-wrap ${animated ? 'mesh-animated' : ''} ${className}`}
      style={baseColor ? { backgroundColor: baseColor } : undefined}
      aria-hidden
    >
      <div className="mesh-blob mesh-blob-1" style={{ background: colors[0] }} />
      <div className="mesh-blob mesh-blob-2" style={{ background: colors[1] }} />
      <div className="mesh-blob mesh-blob-3" style={{ background: colors[2] }} />
    </div>
  )
}

export function variantForCuisine(cuisine) {
  return VARIANTS[cuisine] ? cuisine : 'warm'
}
