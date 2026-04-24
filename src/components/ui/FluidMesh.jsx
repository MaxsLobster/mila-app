import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { useMotionFlags } from '../../lib/motion'

export const FLUID_PALETTES = {
  warm:         ['#E8A77C', '#C87D5A', '#C3D0AA', '#F0DBCF'],
  italienisch:  ['#E89B6B', '#D4846A', '#A3B18A', '#F4E4C1'],
  asiatisch:    ['#C8D4A0', '#D4BC7C', '#C87D5A', '#F5E9D5'],
  levante:      ['#D4A67C', '#C4A05A', '#C4B087', '#F4E4C1'],
  mediterran:   ['#A8BAC4', '#A3B18A', '#D4A67C', '#F5E9D5'],
  fusion:       ['#C87D5A', '#A3B18A', '#9E8CA8', '#F0DBCF'],
  sage:         ['#B8C4A0', '#C3D0AA', '#E8D5AB', '#F5EDD8'],
  dusk:         ['#7D6591', '#C87D5A', '#A3B18A', '#2A2540'],
  hearth:       ['#C87D5A', '#8B3E2F', '#E89B6B', '#1A1614'],
}

export function paletteForCuisine(cuisine) {
  return FLUID_PALETTES[cuisine] ?? FLUID_PALETTES.warm
}

const VERTEX = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`

const FRAGMENT = /* glsl */ `
  precision highp float;
  uniform float uTime;
  uniform vec2  uMouse;
  uniform float uMouseStrength;
  uniform vec2  uResolution;
  uniform vec3  uColor1;
  uniform vec3  uColor2;
  uniform vec3  uColor3;
  uniform vec3  uColor4;
  varying vec2 vUv;

  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                       -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0))
                   + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
                            dot(x12.zw,x12.zw)), 0.0);
    m = m * m;
    m = m * m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 4; i++) {
      v += a * snoise(p);
      p *= 2.0;
      a *= 0.5;
    }
    return v;
  }

  void main() {
    float aspect = uResolution.x / max(uResolution.y, 1.0);
    vec2 uv = vUv;
    vec2 uvA = vec2(uv.x * aspect, uv.y);
    float t = uTime * 0.18;

    vec2 mouseUv = vec2(uMouse.x * aspect, uMouse.y);
    float dM = distance(uvA, mouseUv);
    float mouseField = exp(-dM * 3.2) * uMouseStrength;
    vec2  mouseForce = normalize(uvA - mouseUv + 0.0001) * mouseField * 0.35;

    vec2 flow1 = vec2(
      fbm(uvA * 1.4 + vec2(t, t * 0.7)),
      fbm(uvA * 1.4 + vec2(-t * 0.9, t * 0.5) + 5.2)
    );
    vec2 uvAdv = uvA + flow1 * 0.35 + mouseForce;
    vec2 flow2 = vec2(
      fbm(uvAdv * 2.2 - vec2(t * 0.6, t * 0.3)),
      fbm(uvAdv * 2.2 - vec2(t * 0.4, -t * 0.5) + 9.1)
    );
    vec2 uvFinal = uvAdv + flow2 * 0.22;

    float n1 = smoothstep(-0.4, 0.6, fbm(uvFinal * 2.4 + vec2(t * 0.5, 0.0)));
    float n2 = smoothstep(-0.4, 0.6, fbm(uvFinal * 2.0 - vec2(0.0, t * 0.4) + 3.3));
    float n3 = smoothstep(-0.4, 0.6, fbm(uvFinal * 1.7 + vec2(t * 0.2, t * 0.3) + 7.7));
    float n4 = smoothstep(-0.4, 0.6, fbm(uvFinal * 3.1 - vec2(t * 0.3, t * 0.6) + 12.0));

    float total = n1 + n2 + n3 + n4 + 0.001;
    vec3 col = (uColor1 * n1 + uColor2 * n2 + uColor3 * n3 + uColor4 * n4) / total;
    col = mix(col, col * 1.25 + vec3(0.04), mouseField);

    float grain = (snoise(vUv * uResolution.xy * 0.8 + t * 50.0)) * 0.03;
    col += grain;

    gl_FragColor = vec4(col, 1.0);
  }
`

let liveContexts = 0
const MAX_CONTEXTS = 6

export default function FluidMesh({
  variant = 'warm',
  colors,
  interactive = true,
  className = '',
  intensity = 1.0,
}) {
  const { fluidAnimated, fluidOn } = useMotionFlags()
  const containerRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    if (!fluidOn) return // motion off → fallback only
    if (liveContexts >= MAX_CONTEXTS) return

    const testCanvas = document.createElement('canvas')
    const gl = testCanvas.getContext('webgl2') || testCanvas.getContext('webgl')
    if (!gl) return

    liveContexts++

    const palette = (colors ?? FLUID_PALETTES[variant] ?? FLUID_PALETTES.warm).map(c => new THREE.Color(c))
    const rect = container.getBoundingClientRect()
    const width = Math.max(rect.width, 1)
    const height = Math.max(rect.height, 1)

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false, premultipliedAlpha: false })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8))
    renderer.setSize(width, height, false)
    renderer.domElement.style.cssText = 'width:100%;height:100%;display:block;'
    container.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)

    const uniforms = {
      uTime:          { value: Math.random() * 100 },
      uMouse:         { value: new THREE.Vector2(0.5, 0.5) },
      uMouseStrength: { value: 0 },
      uResolution:    { value: new THREE.Vector2(width, height) },
      uColor1:        { value: palette[0] },
      uColor2:        { value: palette[1] },
      uColor3:        { value: palette[2] },
      uColor4:        { value: palette[3] ?? palette[0] },
    }

    const material = new THREE.ShaderMaterial({ uniforms, vertexShader: VERTEX, fragmentShader: FRAGMENT })
    const geometry = new THREE.PlaneGeometry(2, 2)
    const mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh)

    const target = { x: 0.5, y: 0.5, strength: 0 }
    const current = { x: 0.5, y: 0.5, strength: 0 }
    const allowInteractive = interactive && fluidAnimated

    function onPointer(e) {
      const r = container.getBoundingClientRect()
      target.x = Math.max(0, Math.min(1, (e.clientX - r.left) / r.width))
      target.y = Math.max(0, Math.min(1, 1 - (e.clientY - r.top) / r.height))
      target.strength = 1
    }
    function onLeave() { target.strength = 0 }

    if (allowInteractive) {
      container.addEventListener('pointermove', onPointer)
      container.addEventListener('pointerleave', onLeave)
      container.addEventListener('touchmove', (e) => {
        const t = e.touches[0]
        if (t) onPointer(t)
      }, { passive: true })
    }

    const ro = new ResizeObserver(() => {
      const r = container.getBoundingClientRect()
      const w = Math.max(r.width, 1)
      const h = Math.max(r.height, 1)
      renderer.setSize(w, h, false)
      uniforms.uResolution.value.set(w, h)
    })
    ro.observe(container)

    // Static render path (reduced motion): render once, no RAF loop
    if (!fluidAnimated) {
      // Render a single snapshot at a semi-random time offset so different
      // instances don't look identical
      uniforms.uTime.value = Math.random() * 50
      renderer.render(scene, camera)
      return () => {
        ro.disconnect()
        geometry.dispose()
        material.dispose()
        renderer.dispose()
        if (renderer.domElement.parentElement === container) {
          container.removeChild(renderer.domElement)
        }
        liveContexts = Math.max(0, liveContexts - 1)
      }
    }

    let raf = 0
    let last = performance.now()
    function tick(now) {
      const dt = Math.min((now - last) / 1000, 0.1)
      last = now
      uniforms.uTime.value += dt * intensity

      current.x += (target.x - current.x) * 0.12
      current.y += (target.y - current.y) * 0.12
      current.strength += (target.strength - current.strength) * 0.08

      uniforms.uMouse.value.set(current.x, current.y)
      uniforms.uMouseStrength.value = current.strength

      renderer.render(scene, camera)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      if (allowInteractive) {
        container.removeEventListener('pointermove', onPointer)
        container.removeEventListener('pointerleave', onLeave)
      }
      geometry.dispose()
      material.dispose()
      renderer.dispose()
      if (renderer.domElement.parentElement === container) {
        container.removeChild(renderer.domElement)
      }
      liveContexts = Math.max(0, liveContexts - 1)
    }
  }, [variant, colors, interactive, intensity, fluidAnimated, fluidOn])

  const palette = colors ?? FLUID_PALETTES[variant] ?? FLUID_PALETTES.warm

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 overflow-hidden ${className}`}
      aria-hidden
      style={{
        background: `linear-gradient(135deg, ${palette.slice(0, 2).join(', ')})`,
      }}
    />
  )
}
