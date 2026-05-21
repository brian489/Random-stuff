/**
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} screenX center
 * @param {number} vh
 * @param {ReturnType<import('./characterAnimator.js').updateAnimator>} anim
 * @param {number} footPulse 0-1 shadow squash
 */
export function drawCharacter(ctx, screenX, vh, anim, footPulse) {
  const baseY = vh * 0.78
  const breath = 1 + Math.sin(anim.breathT * 2.2) * 0.02 * (1 - anim.sitBlend)
  const scale = 1 * breath
  const sit = anim.sitBlend
  const look = anim.lookBlend

  const legSwing = Math.sin(anim.walkPhase * 1.4) * 0.35 * (1 - sit)
  const armSwing = -Math.sin(anim.walkPhase * 1.4) * 0.4 * (1 - sit)

  ctx.save()
  ctx.translate(screenX, baseY)
  ctx.scale(scale, scale)

  ctx.fillStyle = 'rgba(0,0,0,0.15)'
  ctx.beginPath()
  ctx.ellipse(0, 4, 18 - footPulse * 4, 5 - footPulse * 1.5, 0, 0, Math.PI * 2)
  ctx.fill()

  const bodyY = sit * 18 - look * 4 * anim.facing
  ctx.fillStyle = '#2c241c'
  if (sit < 0.5) {
    ctx.save()
    ctx.rotate(legSwing * 0.15)
    ctx.fillRect(-7, -8, 14, 32)
    ctx.restore()
    ctx.save()
    ctx.rotate(-legSwing * 0.15)
    ctx.fillRect(-7, -8, 14, 32)
    ctx.restore()
  } else {
    ctx.fillRect(-8, 0, 16, 22)
    ctx.fillRect(-8, 12, 16, 10)
  }

  ctx.fillStyle = '#e8e0d4'
  roundRect(ctx, -14, -42 + bodyY, 28, 36, 6)
  ctx.fill()

  ctx.fillStyle = '#d4c8b8'
  ctx.beginPath()
  ctx.arc(0, -52 + bodyY, 10, 0, Math.PI * 2)
  ctx.fill()

  if (look > 0.01) {
    ctx.fillStyle = '#1a1510'
    ctx.beginPath()
    ctx.arc(-3 * anim.facing * look, -54 + bodyY, 2, 0, Math.PI * 2)
    ctx.arc(3 - 2 * anim.facing * look, -54 + bodyY, 2, 0, Math.PI * 2)
    ctx.fill()
  } else {
    ctx.fillStyle = '#1a1510'
    ctx.beginPath()
    ctx.arc(-3, -54 + bodyY, 2, 0, Math.PI * 2)
    ctx.arc(3, -54 + bodyY, 2, 0, Math.PI * 2)
    ctx.fill()
  }

  ctx.strokeStyle = '#c4a35a'
  ctx.lineWidth = 1
  ctx.stroke()

  if (sit < 0.8) {
    ctx.strokeStyle = '#2c241c'
    ctx.lineWidth = 4
    ctx.lineCap = 'round'
    ctx.beginPath()
    ctx.moveTo(-18, -28 + bodyY)
    ctx.lineTo(-26, -8 + bodyY + armSwing * 12)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(18, -28 + bodyY)
    ctx.lineTo(26, -8 + bodyY - armSwing * 12)
    ctx.stroke()
  } else {
    ctx.strokeStyle = '#2c241c'
    ctx.lineWidth = 4
    ctx.beginPath()
    ctx.moveTo(12, -30 + bodyY)
    ctx.lineTo(28, -18 + bodyY)
    ctx.stroke()
  }

  ctx.restore()
}

function roundRect(ctx, x, y, w, h, r) {
  const rr = Math.min(r, w / 2, h / 2)
  ctx.beginPath()
  ctx.moveTo(x + rr, y)
  ctx.arcTo(x + w, y, x + w, y + h, rr)
  ctx.arcTo(x + w, y + h, x, y + h, rr)
  ctx.arcTo(x, y + h, x, y, rr)
  ctx.arcTo(x, y, x + w, y, rr)
  ctx.closePath()
}
