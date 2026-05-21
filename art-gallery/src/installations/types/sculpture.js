import { hashSeed, rngFromSeed } from '../seedRandom.js'

/**
 * @param {import('../installations.config.js').INSTALLATIONS[number]} inst
 */
export function draw(ctx, x, y, w, h, inst, time, opts) {
  const pal = inst.palette || ['#e8e4df', '#6b6b70', '#2d2d32']
  const seed = hashSeed(inst.id)
  const variant = seed % 3
  const rnd = rngFromSeed(seed)
  const floorY = opts?.floorY ?? y + h + 40
  const cx = x + w * 0.5
  const plinthTop = floorY - h * 0.15
  const plinthW = w * 0.55
  const plinthH = floorY - (y + h * 0.35)

  ctx.save()
  ctx.fillStyle = pal[0]
  ctx.beginPath()
  ctx.moveTo(cx - plinthW * 0.35, floorY)
  ctx.lineTo(cx + plinthW * 0.35, floorY)
  ctx.lineTo(cx + plinthW * 0.42, plinthTop)
  ctx.lineTo(cx - plinthW * 0.42, plinthTop)
  ctx.closePath()
  ctx.fill()

  for (let i = 0; i < 20; i++) {
    ctx.strokeStyle = `rgba(0,0,0,${0.06 + rnd() * 0.08})`
    ctx.beginPath()
    ctx.moveTo(cx - plinthW * 0.4, plinthTop + i * 3)
    ctx.lineTo(cx + plinthW * 0.4, plinthTop + i * 3 + rnd() * 2)
    ctx.stroke()
  }

  const ox = cx
  const oy = plinthTop - 8

  ctx.fillStyle = 'rgba(0,0,0,0.12)'
  ctx.beginPath()
  ctx.ellipse(ox, plinthTop + 2, plinthW * 0.25, 8, 0, 0, Math.PI * 2)
  ctx.fill()

  if (variant === 0) {
    for (let k = 0; k < 5; k++) {
      ctx.globalAlpha = 0.45 - k * 0.07
      ctx.fillStyle = pal[1]
      ctx.beginPath()
      ctx.ellipse(ox + (rnd() - 0.5) * 20, oy - k * 14, 22 - k * 2, 28, rnd() * 0.5, 0, Math.PI * 2)
      ctx.fill()
    }
    ctx.globalAlpha = 1
  } else if (variant === 1) {
    ctx.fillStyle = pal[1]
    ctx.beginPath()
    ctx.moveTo(ox, oy - 50)
    ctx.lineTo(ox + 25, oy - 10)
    ctx.lineTo(ox + 10, oy)
    ctx.lineTo(ox - 10, oy)
    ctx.lineTo(ox - 25, oy - 10)
    ctx.closePath()
    ctx.fill()
    ctx.fillStyle = pal[2] || pal[0]
    ctx.globalAlpha = 0.7
    ctx.fillRect(ox - 15, oy - 35, 30, 20)
    ctx.globalAlpha = 1
  } else {
    ctx.fillStyle = pal[1]
    ctx.beginPath()
    ctx.arc(ox, oy - 35, 14, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillRect(ox - 10, oy - 22, 20, 28)
    ctx.beginPath()
    ctx.arc(ox, oy - 8, 12, 0, Math.PI * 2)
    ctx.fill()
  }

  ctx.restore()
}
