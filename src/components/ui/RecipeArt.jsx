import { useEffect, useRef } from 'react'
import { illustrationFor } from './RecipeIllustration'

/**
 * Primary recipe artwork. If the recipe has a hand-crafted SVG illustration
 * (most seed recipes do), render that. Otherwise fall back to a procedurally
 * generated canvas composition derived from the recipe's name/cuisine.
 */

const PALETTES = {
  italienisch:   { bg: '#F0DBCF', palette: ['#8B1E3F', '#E89B6B', '#3E5A3C', '#C87D5A', '#F4E4C1'], style: 'fields' },
  asiatisch:     { bg: '#F5E9D5', palette: ['#2B5D4A', '#E8A835', '#C44735', '#C87D5A', '#1F3A2E'], style: 'botanical' },
  japanisch:     { bg: '#F5EDD8', palette: ['#C94F4F', '#3E5A3C', '#E8C197', '#1F3A2E', '#8B1E3F'], style: 'botanical' },
  vietnamesisch: { bg: '#F5F0E0', palette: ['#7DB56E', '#E89B91', '#D4BC7C', '#3E5A3C', '#C44735'], style: 'waves' },
  chinesisch:    { bg: '#F4E4C1', palette: ['#B73939', '#E8A835', '#1F3A2E', '#5A2E20', '#F2DF80'], style: 'fields' },
  koreanisch:    { bg: '#F5E9D5', palette: ['#D4564F', '#E8C197', '#5A7A47', '#7A3E2F', '#F2DF80'], style: 'fields' },
  thailaendisch: { bg: '#F0DBCF', palette: ['#C44735', '#E8A835', '#7DB56E', '#3E5A3C', '#F5EDD8'], style: 'botanical' },
  indisch:       { bg: '#F4E4C1', palette: ['#E89735', '#C44735', '#C4A55A', '#5A7A47', '#8B3E2F'], style: 'fields' },
  levante:       { bg: '#F4E4C1', palette: ['#C44735', '#E8A835', '#8B1E3F', '#3E5A3C', '#D4A67C'], style: 'tile' },
  mediterran:    { bg: '#F5E9D5', palette: ['#2E5C7B', '#5A7A8F', '#E89B6B', '#3E5A3C', '#C4B087'], style: 'waves' },
  griechisch:    { bg: '#F5F0E0', palette: ['#5A8FBA', '#2E5C7B', '#E8A77C', '#3E5A3C', '#F5EDD8'], style: 'waves' },
  franzoesisch:  { bg: '#F5E9D5', palette: ['#6B2E3E', '#D4A76A', '#3E3A52', '#A3B18A', '#E8D5AB'], style: 'fields' },
  amerikanisch:  { bg: '#F4E4C1', palette: ['#7A3E2F', '#C87D5A', '#E8C197', '#2A1F1A', '#D4A76A'], style: 'fields' },
  fusion:        { bg: '#F0DBCF', palette: ['#8B1E3F', '#2B5D4A', '#E8A835', '#9E8CA8', '#C87D5A'], style: 'fields' },
}

function hashString(str) {
  let h = 2166136261
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

function mulberry32(seed) {
  let a = seed >>> 0
  return function () {
    a = (a + 0x6D2B79F5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function getConfig(cuisine) {
  return PALETTES[cuisine] ?? PALETTES.fusion
}

function drawFields(ctx, rand, cfg, w, h) {
  ctx.fillStyle = cfg.bg
  ctx.fillRect(0, 0, w, h)
  const fields = 4 + Math.floor(rand() * 3)
  for (let i = 0; i < fields; i++) {
    const color = cfg.palette[Math.floor(rand() * cfg.palette.length)]
    ctx.fillStyle = color
    ctx.globalAlpha = 0.55 + rand() * 0.35
    const baseY = rand() * h
    const amplitude = h * (0.15 + rand() * 0.25)
    const freq = 0.003 + rand() * 0.006
    const phase = rand() * Math.PI * 2
    ctx.beginPath()
    ctx.moveTo(0, h)
    for (let x = 0; x <= w; x += 6) {
      const y = baseY + Math.sin(x * freq + phase) * amplitude + Math.sin(x * freq * 2.5 + phase) * amplitude * 0.3
      ctx.lineTo(x, y)
    }
    ctx.lineTo(w, h)
    ctx.closePath()
    ctx.fill()
  }
  ctx.globalAlpha = 1
}

function drawBotanical(ctx, rand, cfg, w, h) {
  ctx.fillStyle = cfg.bg
  ctx.fillRect(0, 0, w, h)
  const grad = ctx.createLinearGradient(0, 0, w, h)
  grad.addColorStop(0, cfg.palette[0] + '30')
  grad.addColorStop(1, cfg.palette[1] + '20')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, w, h)
  const leaves = 8 + Math.floor(rand() * 10)
  for (let i = 0; i < leaves; i++) {
    ctx.save()
    const cx = rand() * w
    const cy = rand() * h
    const rot = rand() * Math.PI * 2
    const len = 30 + rand() * Math.min(w, h) * 0.35
    const wid = 6 + rand() * 14
    const color = cfg.palette[Math.floor(rand() * cfg.palette.length)]
    ctx.translate(cx, cy)
    ctx.rotate(rot)
    ctx.fillStyle = color
    ctx.globalAlpha = 0.6 + rand() * 0.4
    ctx.beginPath()
    ctx.moveTo(-len / 2, 0)
    ctx.bezierCurveTo(-len / 2, -wid, len / 2, -wid, len / 2, 0)
    ctx.bezierCurveTo(len / 2, wid, -len / 2, wid, -len / 2, 0)
    ctx.fill()
    ctx.restore()
  }
  ctx.globalAlpha = 1
}

function drawTile(ctx, rand, cfg, w, h) {
  ctx.fillStyle = cfg.bg
  ctx.fillRect(0, 0, w, h)
  const cellSize = Math.min(w, h) / (3.5 + rand() * 2)
  const cols = Math.ceil(w / cellSize) + 1
  const rows = Math.ceil(h / cellSize) + 1
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const jx = (rand() - 0.5) * cellSize * 0.6
      const jy = (rand() - 0.5) * cellSize * 0.6
      const x = c * cellSize + jx
      const y = r * cellSize + jy
      const size = cellSize * (0.5 + rand() * 0.5)
      const color = cfg.palette[Math.floor(rand() * cfg.palette.length)]
      ctx.fillStyle = color
      ctx.globalAlpha = 0.75 + rand() * 0.25
      ctx.beginPath()
      const sides = 6
      for (let s = 0; s < sides; s++) {
        const a = (s / sides) * Math.PI * 2 + rand() * 0.3
        const px = x + Math.cos(a) * size / 2
        const py = y + Math.sin(a) * size / 2
        if (s === 0) ctx.moveTo(px, py)
        else ctx.lineTo(px, py)
      }
      ctx.closePath()
      ctx.fill()
    }
  }
  ctx.globalAlpha = 1
}

function drawWaves(ctx, rand, cfg, w, h) {
  ctx.fillStyle = cfg.bg
  ctx.fillRect(0, 0, w, h)
  const bands = 6 + Math.floor(rand() * 4)
  for (let i = 0; i < bands; i++) {
    const y0 = (i / bands) * h
    const amp = 10 + rand() * 40
    const freq = 0.005 + rand() * 0.015
    const phase = rand() * Math.PI * 2
    const color = cfg.palette[Math.floor(rand() * cfg.palette.length)]
    ctx.fillStyle = color
    ctx.globalAlpha = 0.55 + rand() * 0.35
    ctx.beginPath()
    ctx.moveTo(0, y0)
    for (let x = 0; x <= w; x += 4) {
      const y = y0 + Math.sin(x * freq + phase) * amp + Math.cos(x * freq * 2.1 + phase) * amp * 0.4
      ctx.lineTo(x, y)
    }
    ctx.lineTo(w, h)
    ctx.lineTo(0, h)
    ctx.closePath()
    ctx.fill()
  }
  ctx.globalAlpha = 1
}

function drawAccents(ctx, rand, cfg, w, h, count) {
  for (let i = 0; i < count; i++) {
    const x = rand() * w
    const y = rand() * h
    const radius = 2 + rand() * 5
    const color = cfg.palette[Math.floor(rand() * cfg.palette.length)]
    ctx.fillStyle = color
    ctx.globalAlpha = 0.7 + rand() * 0.3
    ctx.beginPath()
    ctx.arc(x, y, radius, 0, Math.PI * 2)
    ctx.fill()
  }
  const lines = 2 + Math.floor(rand() * 3)
  for (let i = 0; i < lines; i++) {
    const color = cfg.palette[Math.floor(rand() * cfg.palette.length)]
    ctx.strokeStyle = color
    ctx.lineWidth = 1.5 + rand() * 2
    ctx.globalAlpha = 0.6
    ctx.beginPath()
    let x = rand() * w
    let y = rand() * h
    ctx.moveTo(x, y)
    const steps = 20 + Math.floor(rand() * 25)
    for (let j = 0; j < steps; j++) {
      x += (rand() - 0.5) * 22
      y += (rand() - 0.5) * 22
      ctx.lineTo(x, y)
    }
    ctx.stroke()
  }
  ctx.globalAlpha = 1
}

function ProceduralCanvas({ recipe, grainy = true }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const rect = canvas.getBoundingClientRect()
    const w = Math.max(rect.width, 1)
    const h = Math.max(rect.height, 1)
    canvas.width = w * dpr
    canvas.height = h * dpr
    const ctx = canvas.getContext('2d')
    ctx.scale(dpr, dpr)

    const cfg = getConfig(recipe.cuisine)
    const seed = hashString((recipe.name ?? '') + '::' + (recipe.id ?? ''))
    const rand = mulberry32(seed)

    switch (cfg.style) {
      case 'botanical': drawBotanical(ctx, rand, cfg, w, h); break
      case 'tile':      drawTile(ctx, rand, cfg, w, h);      break
      case 'waves':     drawWaves(ctx, rand, cfg, w, h);     break
      case 'fields':
      default:          drawFields(ctx, rand, cfg, w, h);    break
    }

    const accents = Math.min(Math.max(recipe.ingredients?.length ?? 6, 6), 40)
    drawAccents(ctx, rand, cfg, w, h, accents)

    if (grainy) {
      ctx.globalAlpha = 0.08
      for (let i = 0; i < (w * h) / 60; i++) {
        const x = rand() * w
        const y = rand() * h
        ctx.fillStyle = rand() > 0.5 ? '#000' : '#fff'
        ctx.fillRect(x, y, 1, 1)
      }
      ctx.globalAlpha = 1
    }

    const vgrad = ctx.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.3, w / 2, h / 2, Math.max(w, h) * 0.7)
    vgrad.addColorStop(0, 'rgba(0,0,0,0)')
    vgrad.addColorStop(1, 'rgba(0,0,0,0.25)')
    ctx.fillStyle = vgrad
    ctx.fillRect(0, 0, w, h)
  }, [recipe.name, recipe.id, recipe.cuisine, recipe.ingredients?.length, grainy])

  return <canvas ref={canvasRef} className="w-full h-full block" aria-hidden />
}

export default function RecipeArt({ recipe, className = '', grainy = true }) {
  const Illustration = illustrationFor(recipe?.id)
  if (Illustration) {
    return (
      <div className={`w-full h-full ${className}`}>
        <Illustration />
      </div>
    )
  }
  return (
    <div className={`w-full h-full ${className}`}>
      <ProceduralCanvas recipe={recipe} grainy={grainy} />
    </div>
  )
}
