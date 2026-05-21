import { hashSeed, rngFromSeed } from '../seedRandom.js'

/**
 * @param {import('../installations.config.js').INSTALLATIONS[number]} inst
 */
export function draw(ctx, x, y, w, h, inst, time, opts) {
  const pal = inst.palette || ['#1a0a2e', '#ff6b9d', '#7c3aed']
  const seed = hashSeed(inst.id)
  const rnd = rngFromSeed(seed)
  const flick = 0.88 + 0.12 * Math.sin(time * (3 + (seed % 5) * 0.3) + seed)
  const night = opts?.nightMode

  ctx.save()
  ctx.fillStyle = '#12081a'
  ctx.fillRect(x, y, w, h)

  const text = inst.title.split(' ')[0] || 'OPEN'
  ctx.font = `600 ${Math.min(h * 0.35, 28)}px "DM Sans", sans-serif`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'

  const cx = x + w / 2
  const cy = y + h / 2

  for (let pass = 0; pass < 3; pass++) {
    const lw = 14 - pass * 4
    const a = (0.25 + pass * 0.2) * flick * (night ? 1.2 : 1)
    ctx.strokeStyle = pal[1 + (pass % 2)] || pal[1]
    ctx.globalAlpha = a
    ctx.lineWidth = lw
    ctx.lineJoin = 'round'
    ctx.strokeText(text, cx, cy)
  }
  ctx.globalAlpha = 0.95 * flick
  ctx.fillStyle = pal[0]
  ctx.fillText(text, cx, cy)
  ctx.globalAlpha = 1

  ctx.strokeStyle = pal[2] || pal[1]
  ctx.globalAlpha = 0.4 * flick
  ctx.lineWidth = 2
  for (let i = 0; i < 4; i++) {
    ctx.beginPath()
    ctx.moveTo(x + rnd() * w, y + rnd() * h)
    ctx.lineTo(x + rnd() * w, y + rnd() * h)
    ctx.stroke()
  }
  ctx.globalAlpha = 1

  ctx.restore()
}
