/**
 * Canvas 2D star rendering: glow layers, twinkle, configurable size.
 */

/**
 * @typedef {import('./stars.config.js').CONSTELLATION['stars'][number]} Star
 */

/**
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} px
 * @param {number} py
 * @param {Star} star
 * @param {{ lit: boolean, igniteT: number, timeSec: number, hover: boolean, dimOthers: boolean }} opts
 */
export function drawStar(ctx, px, py, star, opts) {
  const { lit, igniteT, timeSec, hover, dimOthers } = opts
  const phase = star.id.split('').reduce((a, c) => a + c.charCodeAt(0), 0) * 0.01
  const tw = 0.92 + 0.08 * Math.sin(timeSec * 2.2 + phase)
  const sizeScale = typeof star.sizeScale === 'number' ? star.sizeScale : 1

  const baseR = 5 * sizeScale
  const layers = [8, 16, 30]

  if (!lit) {
    return
  }

  const flash = igniteT > 0 && igniteT < 1 ? Math.sin(igniteT * Math.PI) * 0.55 : 0
  const scale = Math.min(1, Math.max(0, igniteT < 1 ? igniteT * 1.08 + flash * 0.35 : 1 + flash * 0.1))
  const hoverScale = hover ? 1.4 : 1
  const dim = dimOthers ? 0.15 : 1

  const alphaCore = tw * dim
  const r = baseR * scale * hoverScale

  ctx.save()
  ctx.translate(px, py)

  for (let i = layers.length - 1; i >= 0; i--) {
    const blurR = layers[i] * scale * hoverScale * 0.06
    const a = (0.045 / (i + 1)) * alphaCore
    ctx.beginPath()
    ctx.fillStyle = `rgba(200, 220, 255, ${a})`
    ctx.arc(0, 0, r + blurR * 4, 0, Math.PI * 2)
    ctx.fill()
  }

  ctx.beginPath()
  ctx.fillStyle = `rgba(255,255,255,${0.95 * alphaCore})`
  ctx.arc(0, 0, r, 0, Math.PI * 2)
  ctx.fill()

  ctx.rotate(-Math.PI / 2)
  ctx.strokeStyle = `rgba(120, 160, 255, ${0.22 * dim})`
  ctx.lineWidth = 1.25
  ctx.beginPath()
  ctx.arc(0, 0, r + 9, 0, Math.PI * 2 * 0.998)
  ctx.stroke()

  ctx.restore()
}

/**
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} timeSec local time since pulse start
 */
export function drawPulsarRings(ctx, px, py, timeSec) {
  ctx.save()
  ctx.translate(px, py)
  for (let i = 0; i < 3; i++) {
    const t = timeSec * 1.8 - i * 0.22
    if (t <= 0) continue
    const radius = 12 + t * 90
    const a = Math.max(0, 0.55 - t * 0.45)
    ctx.beginPath()
    ctx.strokeStyle = `rgba(120, 200, 255, ${a})`
    ctx.lineWidth = 2
    ctx.arc(0, 0, radius, 0, Math.PI * 2)
    ctx.stroke()
  }
  ctx.restore()
}
