/**
 * @typedef {import('../installations/installations.config.js').INSTALLATIONS[number]} Inst
 */

/**
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} slotLeftScreen
 * @param {number} slotW
 * @param {number} vh
 * @param {Inst} inst
 * @param {number} alpha 0-1 fade when near
 */
export function drawWallLabel(ctx, slotLeftScreen, slotW, vh, inst, alpha) {
  const cx = slotLeftScreen + slotW * 0.5
  const y = vh * 0.57
  const w = Math.min(slotW * 0.42, 200)
  const h = 52

  ctx.save()
  ctx.globalAlpha = alpha
  ctx.fillStyle = 'rgba(252, 250, 245, 0.94)'
  ctx.fillRect(cx - w / 2, y, w, h)
  ctx.strokeStyle = 'rgba(0,0,0,0.08)'
  ctx.strokeRect(cx - w / 2, y, w, h)

  ctx.fillStyle = '#1a1814'
  ctx.font = '600 11px "DM Sans", sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText(inst.title, cx, y + 16)

  ctx.fillStyle = 'rgba(26,24,20,0.55)'
  ctx.font = '400 9px "DM Sans", sans-serif'
  ctx.fillText(inst.subtitle || '', cx, y + 30)

  const placard = (inst.placard || '').split('\n')[0]
  ctx.font = '400 8px "Cormorant Garamond", serif'
  ctx.fillStyle = 'rgba(26,24,20,0.45)'
  ctx.fillText(placard, cx, y + 44)

  ctx.restore()
}
