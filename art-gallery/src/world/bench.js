import { slotLeftX } from './gallery.js'
import { hashSeed, rngFromSeed } from '../installations/seedRandom.js'

/**
 * @typedef {import('../installations/installations.config.js').INSTALLATIONS[number]} Inst
 */

/**
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} slotLeftScreen
 * @param {number} slotW
 * @param {number} vh
 * @param {Inst} inst
 */
export function drawBench(ctx, slotLeftScreen, slotW, vh, inst) {
  const cx = slotLeftScreen + slotW * 0.5
  const seatY = vh * 0.76
  const bw = slotW * 0.38
  const bh = 10
  const legH = 22

  ctx.save()
  ctx.fillStyle = '#2a2218'
  ctx.fillRect(cx - bw * 0.5, seatY, bw, bh)

  ctx.fillStyle = '#1a1510'
  ctx.fillRect(cx - bw * 0.45 - 4, seatY - 28, 6, 30)
  ctx.fillRect(cx + bw * 0.45 - 2, seatY - 28, 6, 30)

  ctx.fillStyle = '#252018'
  for (const lx of [-bw * 0.35, bw * 0.35]) {
    ctx.fillRect(cx + lx - 3, seatY + bh, 6, legH)
  }

  const seed = hashSeed(inst.id + '-bench')
  const rnd = rngFromSeed(seed)
  const prop = seed % 3
  ctx.fillStyle = inst.palette?.[1] || '#8b7355'
  if (prop === 0) {
    ctx.fillRect(cx - 18, seatY - 4, 24, 16)
  } else if (prop === 1) {
    ctx.beginPath()
    ctx.arc(cx + 10, seatY - 6, 7, 0, Math.PI * 2)
    ctx.fill()
  } else {
    ctx.strokeStyle = inst.palette?.[2] || '#c4a35a'
    ctx.lineWidth = 2
    ctx.strokeRect(cx - 14, seatY - 8, 22, 14)
  }

  ctx.restore()
}

/**
 * @param {number} i slot index
 */
export function benchCenterWorld(i, slotW) {
  return slotLeftX(i, slotW) + slotW * 0.5
}
