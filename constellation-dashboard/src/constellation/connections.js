/**
 * Constellation lines: full connections, hover brighten, flowing particles.
 * Edge `startDelay` is ms from scene load (matches star ignite timeline).
 */

const LINE_RGB = '120, 160, 255'

/**
 * @typedef {import('./stars.config.js').CONSTELLATION['stars'][number]} Star
 * @typedef {{ from: Star, to: Star, startDelay: number, durationMs: number, done: boolean, hoverBoost: number }} EdgeRuntime
 */

/** @type {EdgeRuntime[]} */
let edges = []

/** @type {number[]} */
let particleT = []

/**
 * @param {ReturnType<import('./constellationMap.js').getAnimationEdges>} pairs
 * @param {number[]} lineStartDelays ms from load when each line begins drawing
 */
export function initEdges(pairs, lineStartDelays) {
  edges = pairs.map(([from, to], i) => ({
    from,
    to,
    startDelay: lineStartDelays[i] ?? 0,
    durationMs: 300,
    done: false,
    hoverBoost: 0,
  }))
  particleT = pairs.map(() => Math.random())
}

/** @param {number} elapsedMs ms since scene load */
export function updateEdges(elapsedMs) {
  for (const e of edges) {
    if (e.done) continue
    const t = (elapsedMs - e.startDelay) / e.durationMs
    if (t >= 1) e.done = true
    e.hoverBoost *= 0.9
  }
}

/** @param {string | null} hoverId */
export function boostEdgesForStar(hoverId) {
  if (!hoverId) return
  for (const e of edges) {
    if (e.from.id === hoverId || e.to.id === hoverId) {
      e.hoverBoost = Math.min(1, e.hoverBoost + 0.4)
    }
  }
}

/**
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} elapsedMs ms since scene load
 */
export function drawEdges(ctx, w, h, elapsedMs, flowEnabled) {
  const toPx = (sx, sy) => [sx * w, sy * h]

  for (let i = 0; i < edges.length; i++) {
    const e = edges[i]
    const [x1, y1] = toPx(e.from.x, e.from.y)
    const [x2, y2] = toPx(e.to.x, e.to.y)
    const dx = x2 - x1
    const dy = y2 - y1
    const len = Math.hypot(dx, dy) || 1
    const ux = dx / len
    const uy = dy / len

    let rawT = (elapsedMs - e.startDelay) / e.durationMs
    if (rawT < 0) continue
    rawT = Math.min(1, rawT)

    const lineFrac = rawT
    const xEnd = x1 + ux * len * lineFrac
    const yEnd = y1 + uy * len * lineFrac

    const boost = e.hoverBoost
    ctx.save()
    ctx.strokeStyle = `rgba(${LINE_RGB}, ${0.3 + boost * 0.28})`
    ctx.lineWidth = 1.35 + boost * 1.1
    ctx.lineCap = 'round'
    ctx.shadowColor = `rgba(${LINE_RGB}, 0.4)`
    ctx.shadowBlur = 6 + boost * 14
    ctx.beginPath()
    ctx.moveTo(x1, y1)
    ctx.lineTo(xEnd, yEnd)
    ctx.stroke()
    ctx.shadowBlur = 0

    ctx.strokeStyle = `rgba(${LINE_RGB}, ${0.1 + boost * 0.12})`
    ctx.lineWidth = 4
    ctx.beginPath()
    ctx.moveTo(x1, y1)
    ctx.lineTo(xEnd, yEnd)
    ctx.stroke()
    ctx.restore()

    const lineComplete = rawT >= 1
    if (flowEnabled && lineComplete) {
      const p = particleT[i] ?? 0
      const px = x1 + ux * len * p
      const py = y1 + uy * len * p
      ctx.save()
      ctx.fillStyle = 'rgba(230, 240, 255, 0.6)'
      ctx.beginPath()
      ctx.arc(px, py, 1.5, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()
    }
  }
}

/** @param {number} dt */
export function updateParticles(dt) {
  for (let i = 0; i < particleT.length; i++) {
    const e = edges[i]
    if (!e || !e.done) continue
    particleT[i] = (particleT[i] ?? 0) + dt * (0.12 + (i % 4) * 0.03)
    if (particleT[i] > 1) particleT[i] -= 1
  }
}

/** @param {number} elapsedMs */
export function allLinesComplete(elapsedMs) {
  if (!edges.length) return false
  return edges.every((e) => (elapsedMs - e.startDelay) / e.durationMs >= 1)
}

export function getEdges() {
  return edges
}
