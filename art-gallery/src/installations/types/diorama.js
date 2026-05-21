import { hashSeed, rngFromSeed } from '../seedRandom.js'

/**
 * @param {import('../installations.config.js').INSTALLATIONS[number]} inst
 */
export function draw(ctx, x, y, w, h, inst, time, _opts) {
  const pal = inst.palette || ['#0d2818', '#4ade80', '#14532d']
  const seed = hashSeed(inst.id)
  const rnd = rngFromSeed(seed)

  ctx.save()
  const bx = x + w * 0.1
  const by = y + h * 0.12
  const bw = w * 0.8
  const bh = h * 0.76

  ctx.fillStyle = 'rgba(200, 220, 255, 0.08)'
  ctx.strokeStyle = 'rgba(255,255,255,0.45)'
  ctx.lineWidth = 2
  ctx.fillRect(bx, by, bw, bh)
  ctx.strokeRect(bx, by, bw, bh)

  ctx.strokeStyle = 'rgba(255,255,255,0.7)'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(bx + 3, by + 3)
  ctx.lineTo(bx + bw - 3, by + bh - 3)
  ctx.stroke()

  const ix = bx + bw * 0.15
  const iy = by + bh * 0.55
  ctx.fillStyle = pal[2] || '#14532d'
  ctx.fillRect(ix, iy, bw * 0.7, bh * 0.12)

  ctx.fillStyle = pal[1]
  ctx.beginPath()
  ctx.moveTo(ix + bw * 0.35, by + bh * 0.25)
  ctx.lineTo(ix + bw * 0.2, iy)
  ctx.lineTo(ix + bw * 0.5, iy)
  ctx.closePath()
  ctx.fill()

  ctx.fillStyle = pal[0]
  ctx.beginPath()
  ctx.arc(ix + bw * 0.3, iy - 8, 6, 0, Math.PI * 2)
  ctx.fill()

  const grad = ctx.createLinearGradient(bx, by, bx + bw, by)
  grad.addColorStop(0, 'rgba(255,255,255,0.15)')
  grad.addColorStop(0.4, 'rgba(255,255,255,0)')
  grad.addColorStop(1, 'rgba(255,255,255,0.05)')
  ctx.fillStyle = grad
  ctx.fillRect(bx, by, bw, bh)

  ctx.restore()
}
