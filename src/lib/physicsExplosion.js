import Matter from 'matter-js'

function isMotionEnabled() {
  if (typeof document === 'undefined') return false
  return document.documentElement.dataset.motion === 'full'
}

export function explodeElement(element, options = {}) {
  return new Promise((resolve) => {
    // Motion off / reduced → skip the fancy animation
    if (!isMotionEnabled()) {
      resolve()
      return
    }

    const rect = element.getBoundingClientRect()
    if (rect.width === 0 || rect.height === 0) { resolve(); return }

    const {
      direction = Math.sign((rect.left + rect.width / 2) - window.innerWidth / 2) || 1,
      gravity = 1.4,
      bounce = 0.35,
      maxDuration = 2800,
      shards = false,
    } = options

    const container = document.createElement('div')
    container.style.cssText = `
      position: fixed;
      inset: 0;
      pointer-events: none;
      z-index: 9999;
      overflow: hidden;
    `
    document.body.appendChild(container)

    const originalOpacity = element.style.opacity
    element.style.transition = 'opacity 80ms linear'
    element.style.opacity = '0'

    const makeClone = () => {
      const clone = element.cloneNode(true)
      clone.style.cssText = `
        position: absolute;
        left: 0; top: 0;
        width: ${rect.width}px;
        height: ${rect.height}px;
        margin: 0;
        transform: translate(${rect.left}px, ${rect.top}px);
        transform-origin: center center;
        will-change: transform;
        box-shadow: 0 8px 24px rgba(0,0,0,0.12);
        opacity: 1;
      `
      return clone
    }

    const engine = Matter.Engine.create()
    engine.gravity.y = gravity
    engine.gravity.scale = 0.0015

    const W = window.innerWidth
    const H = window.innerHeight
    const floor = Matter.Bodies.rectangle(W / 2, H + 400, W * 2, 40, { isStatic: true })
    Matter.Composite.add(engine.world, floor)

    const clones = []
    const bodies = []

    if (shards) {
      const cols = 3, rows = 2
      const pw = rect.width / cols
      const ph = rect.height / rows
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const shard = document.createElement('div')
          shard.style.cssText = `
            position: absolute;
            left: 0; top: 0;
            width: ${pw}px;
            height: ${ph}px;
            background: white;
            border-radius: 4px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.08);
            transform: translate(${rect.left + c * pw}px, ${rect.top + r * ph}px);
            will-change: transform;
          `
          container.appendChild(shard)
          clones.push(shard)
          const body = Matter.Bodies.rectangle(
            rect.left + c * pw + pw / 2,
            rect.top + r * ph + ph / 2,
            pw, ph,
            { restitution: bounce, friction: 0.15, density: 0.002 }
          )
          Matter.Body.setVelocity(body, {
            x: direction * (2 + Math.random() * 5) + (c - (cols - 1) / 2) * 2,
            y: -6 - Math.random() * 4,
          })
          Matter.Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.4)
          bodies.push(body)
          Matter.Composite.add(engine.world, body)
        }
      }
    } else {
      const clone = makeClone()
      container.appendChild(clone)
      clones.push(clone)
      const body = Matter.Bodies.rectangle(
        rect.left + rect.width / 2,
        rect.top + rect.height / 2,
        rect.width, rect.height,
        { restitution: bounce, friction: 0.12, density: 0.002 }
      )
      Matter.Body.setVelocity(body, {
        x: direction * (3 + Math.random() * 4),
        y: -8 - Math.random() * 3,
      })
      Matter.Body.setAngularVelocity(body, direction * (0.08 + Math.random() * 0.15))
      bodies.push(body)
      Matter.Composite.add(engine.world, body)
    }

    const start = performance.now()
    let raf = 0
    function tick(now) {
      Matter.Engine.update(engine, 16)
      let stillOnScreen = false
      for (let i = 0; i < bodies.length; i++) {
        const b = bodies[i]
        const clone = clones[i]
        if (!clone) continue
        const x = b.position.x - (shards ? clone.offsetWidth / 2 : rect.width / 2)
        const y = b.position.y - (shards ? clone.offsetHeight / 2 : rect.height / 2)
        clone.style.transform = `translate(${x}px, ${y}px) rotate(${b.angle}rad)`
        if (b.position.y < H + 200) stillOnScreen = true
      }
      if (!stillOnScreen || now - start > maxDuration) {
        cancelAnimationFrame(raf)
        container.remove()
        element.style.opacity = originalOpacity
        Matter.World.clear(engine.world, false)
        Matter.Engine.clear(engine)
        resolve()
        return
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
  })
}
