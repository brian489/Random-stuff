import { hashSeed, rngFromSeed } from '../seedRandom.js'

/**
 * @param {import('../installations.config.js').INSTALLATIONS[number]} inst
 */
export function draw(ctx, x, y, w, h, inst, time, _opts) {
  const pal = inst.palette || ['#e8d5b7', '#2c1810', '#8b6914']
  const seed = hashSeed(inst.id)
  const rnd = rngFromSeed(seed)

  ctx.save()
  ctx.shadowColor = 'rgba(0,0,0,0.35)'
  ctx.shadowBlur = 12
  ctx.shadowOffsetX = 6
  ctx.shadowOffsetY = 6
  ctx.fillStyle = '#1a1208'
  ctx.fillRect(x - 8, y - 8, w + 16, h + 16)
  ctx.shadowBlur = 0
  ctx.shadowOffsetX = 0
  ctx.shadowOffsetY = 0

  ctx.fillStyle = '#6b5420'
  ctx.fillRect(x - 5, y - 5, w + 10, h + 10)
  ctx.strokeStyle = '#c4a35a'
  ctx.lineWidth = 2
  ctx.strokeRect(x - 2, y - 2, w + 4, h + 4)

  const g = ctx.createLinearGradient(x, y, x + w, y + h)
  g.addColorStop(0, pal[0])
  g.addColorStop(0.5, pal[1] || pal[0])
  g.addColorStop(1, pal[2] || pal[0])
  ctx.fillStyle = g
  ctx.fillRect(x, y, w, h)

  ctx.strokeStyle = pal[2] || '#000'
  ctx.globalAlpha = 0.35
  for (let i = 0; i < 18; i++) {
    const r = rnd()
    ctx.lineWidth = 1 + rnd() * 3
    ctx.beginPath()
    ctx.moveTo(x + rnd() * w, y + rnd() * h)
    ctx.bezierCurveTo(
      x + rnd() * w,
      y + rnd() * h,
      x + rnd() * w,
      y + rnd() * h,
      x + rnd() * w,
      y + rnd() * h
    )
    ctx.stroke()
  }
  ctx.globalAlpha = 1

  const status = inst.status || 'complete'
  const cx = x + w - 10
  const cy = y + 10
  ctx.fillStyle = status === 'complete' ? '#4ade80' : status === 'wip' ? '#fbbf24' : '#9ca3af'
  ctx.beginPath()
  ctx.arc(cx, cy, 5, 0, Math.PI * 2)
  ctx.fill()

  ctx.restore()
}
