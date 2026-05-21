import { drawPulsarRings } from './starNode.js'

/**
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} px
 * @param {number} py
 * @param {number} t time since effect start (sec)
 * @param {string} effect rings | burst | sparkle | hex | beam
 */
export function drawSelectEffect(ctx, px, py, t, effect) {
  switch (effect) {
    case 'burst':
      drawBurst(ctx, px, py, t)
      break
    case 'sparkle':
      drawSparkle(ctx, px, py, t)
      break
    case 'hex':
      drawHex(ctx, px, py, t)
      break
    case 'beam':
      drawBeam(ctx, px, py, t)
      break
    case 'rings':
    default:
      drawPulsarRings(ctx, px, py, t)
      break
  }
}

function drawBurst(ctx, px, py, t) {
  ctx.save()
  ctx.translate(px, py)
  const n = 14
  for (let i = 0; i < n; i++) {
    const ang = (i / n) * Math.PI * 2 + t * 0.4
    const len = 25 + t * 110
    const a = Math.max(0, 0.7 - t * 0.65)
    ctx.strokeStyle = `rgba(160, 210, 255, ${a})`
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(0, 0)
    ctx.lineTo(Math.cos(ang) * len, Math.sin(ang) * len)
    ctx.stroke()
  }
  ctx.restore()
}

function drawSparkle(ctx, px, py, t) {
  ctx.save()
  ctx.translate(px, py)
  for (let i = 0; i < 10; i++) {
    const ang = (i / 10) * Math.PI * 2 + t * 2.5
    const rad = 15 + Math.sin(t * 8 + i) * 8 + t * 40
    const a = Math.max(0, 0.55 - t * 0.5)
    ctx.fillStyle = `rgba(255, 250, 220, ${a})`
    ctx.beginPath()
    ctx.arc(Math.cos(ang) * rad, Math.sin(ang) * rad, 2.5, 0, Math.PI * 2)
    ctx.fill()
  }
  ctx.restore()
}

function drawHex(ctx, px, py, t) {
  ctx.save()
  ctx.translate(px, py)
  const sides = 6
  for (let ring = 0; ring < 3; ring++) {
    const R = 18 + ring * 28 + t * 75
    const a = Math.max(0, 0.5 - t * 0.42 - ring * 0.12)
    ctx.strokeStyle = `rgba(140, 190, 255, ${a})`
    ctx.lineWidth = 2
    ctx.beginPath()
    for (let i = 0; i <= sides; i++) {
      const ang = (i / sides) * Math.PI * 2 - Math.PI / 2 + t * 0.3
      const x = Math.cos(ang) * R
      const y = Math.sin(ang) * R
      if (i === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    }
    ctx.closePath()
    ctx.stroke()
  }
  ctx.restore()
}

function drawBeam(ctx, px, py, t) {
  ctx.save()
  ctx.translate(px, py)
  const w = 40 + t * 80
  const h = 200 + t * 100
  const g = ctx.createLinearGradient(-w, 0, w, 0)
  const a = Math.max(0, 0.35 - t * 0.3)
  g.addColorStop(0, `rgba(100, 180, 255, 0)`)
  g.addColorStop(0.5, `rgba(200, 230, 255, ${a})`)
  g.addColorStop(1, `rgba(100, 180, 255, 0)`)
  ctx.fillStyle = g
  ctx.fillRect(-w * 0.5, -h * 0.85, w, h)
  ctx.restore()
}
