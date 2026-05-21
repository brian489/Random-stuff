import { hashSeed, rngFromSeed } from '../seedRandom.js'

/**
 * @param {import('../installations.config.js').INSTALLATIONS[number]} inst
 */
export function draw(ctx, x, y, w, h, inst, time, opts) {
  const pal = inst.palette || ['#faf6ef', '#c17f59', '#3d2c24']
  const seed = hashSeed(inst.id)
  const rnd = rngFromSeed(seed)
  const ceilingY = opts?.ceilingY ?? y - 20
  const floorY = opts?.floorY ?? y + h + 80

  ctx.save()
  const cx = x + w * 0.5

  for (let rod = 0; rod < 2; rod++) {
    const rx = cx + (rod - 0.5) * w * 0.35
    ctx.strokeStyle = '#4a4035'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(rx - 40, ceilingY)
    ctx.lineTo(rx + 40, ceilingY)
    ctx.stroke()

    const n = 3
    for (let i = 0; i < n; i++) {
      const sx = rx - 30 + i * 30
      const strLen = y - ceilingY + 20 + i * 8
      ctx.strokeStyle = 'rgba(60,50,40,0.8)'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(sx, ceilingY)
      ctx.lineTo(sx, ceilingY + strLen)
      ctx.stroke()

      const ang = Math.sin(time * (1.1 + rod * 0.3) + i + seed * 0.01) * 0.35
      const py = ceilingY + strLen
      ctx.save()
      ctx.translate(sx, py)
      ctx.rotate(ang)
      ctx.fillStyle = pal[i % pal.length]
      if (i % 3 === 0) {
        ctx.fillRect(-8, 0, 16, 20)
      } else if (i % 3 === 1) {
        ctx.beginPath()
        ctx.arc(0, 10, 10, 0, Math.PI * 2)
        ctx.fill()
      } else {
        ctx.beginPath()
        ctx.moveTo(0, 0)
        ctx.lineTo(12, 22)
        ctx.lineTo(-12, 22)
        ctx.closePath()
        ctx.fill()
      }
      ctx.restore()

      const shX = sx + Math.sin(ang) * 15
      ctx.fillStyle = 'rgba(0,0,0,0.12)'
      ctx.beginPath()
      ctx.ellipse(shX, floorY - 2, 10, 3, 0, 0, Math.PI * 2)
      ctx.fill()
    }
  }

  ctx.restore()
}
