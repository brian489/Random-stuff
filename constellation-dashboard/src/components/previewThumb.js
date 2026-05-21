/**
 * Mini canvas preview for the detail panel (constellation has no 3D installs).
 * @param {import('../constellation/stars.config.js').CONSTELLATION['stars'][number]} star
 */
export function drawConstellationThumb(ctx, w, h, star, timeSec) {
  const g = ctx.createRadialGradient(w * 0.5, h * 0.45, 2, w * 0.5, h * 0.45, h * 0.55)
  g.addColorStop(0, 'rgba(255, 255, 255, 0.95)')
  g.addColorStop(0.25, 'rgba(180, 210, 255, 0.5)')
  g.addColorStop(1, 'rgba(30, 40, 80, 0.3)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, w, h)

  const scale = typeof star.sizeScale === 'number' ? star.sizeScale : 1
  const r = 8 * scale
  ctx.save()
  ctx.translate(w * 0.5, h * 0.45)
  for (let i = 3; i >= 0; i--) {
    ctx.beginPath()
    ctx.fillStyle = `rgba(200, 220, 255, ${0.06 * (i + 1)})`
    ctx.arc(0, 0, r + i * 10, 0, Math.PI * 2)
    ctx.fill()
  }
  ctx.fillStyle = '#fff'
  ctx.beginPath()
  ctx.arc(0, 0, r, 0, Math.PI * 2)
  ctx.fill()
  ctx.restore()

  ctx.fillStyle = 'rgba(200, 210, 255, 0.4)'
  ctx.font = '600 10px Outfit, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText((star.selectEffect || 'star').toUpperCase(), w * 0.5, h * 0.88)
}
