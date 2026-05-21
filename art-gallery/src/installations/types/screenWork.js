/**
 * @param {import('../installations.config.js').INSTALLATIONS[number]} inst
 */
export function draw(ctx, x, y, w, h, inst, time, _opts) {
  const pal = inst.palette || ['#0c0c0c', '#33ff66', '#1a3320']
  const skew = 0.06

  ctx.save()
  ctx.translate(x + w * 0.5, y + h * 0.5)
  ctx.transform(1, 0, skew, 1, -w * 0.5, -h * 0.5)

  ctx.fillStyle = '#0a0a0a'
  ctx.fillRect(-4, -4, w + 8, h + 8)

  const glow = pal[1] || '#4af'
  const shift = (Math.sin(time * 0.8) * 0.5 + 0.5) * 40
  const g = ctx.createLinearGradient(0, 0, w, h)
  g.addColorStop(0, glow)
  g.addColorStop(0.5, pal[2] || glow)
  g.addColorStop(1, pal[0] || '#000')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, w, h)

  ctx.fillStyle = `rgba(255,255,255,${0.04 + Math.sin(time * 2) * 0.02})`
  for (let ly = 0; ly < h; ly += 4) {
    ctx.fillRect(0, ly + ((time * 40) % 4), w, 1)
  }

  ctx.strokeStyle = 'rgba(255,255,255,0.35)'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(2, 4)
  ctx.lineTo(w - 6, 8)
  ctx.stroke()

  ctx.fillStyle = '#22c55e'
  ctx.beginPath()
  ctx.arc(w - 10, h - 10, 3, 0, Math.PI * 2)
  ctx.fill()

  ctx.restore()
}
