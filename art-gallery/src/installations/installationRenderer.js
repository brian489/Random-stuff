import * as painting from './types/painting.js'
import * as sculpture from './types/sculpture.js'
import * as screenWork from './types/screenWork.js'
import * as neonSign from './types/neonSign.js'
import * as diorama from './types/diorama.js'
import * as mobileHanging from './types/mobileHanging.js'
import { ART_Y, ART_H } from '../world/background.js'

/**
 * @typedef {import('./installations.config.js').INSTALLATIONS[number]} Inst
 */

/**
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} slotLeftScreen
 * @param {number} slotW
 * @param {number} vh
 * @param {Inst} inst
 * @param {number} time
 * @param {object} [opts]
 */
export function drawInstallation(ctx, slotLeftScreen, slotW, vh, inst, time, opts = {}) {
  const pulse = opts.pulseScale ?? 1
  const artW = slotW * 0.5
  const artH = vh * ART_H * 0.92
  const artX = slotLeftScreen + (slotW - artW) / 2
  const artY = vh * ART_Y
  const floorY = vh * 0.78
  const ceilingY = vh * 0.08
  const base = { ...opts, floorY, ceilingY, nightMode: opts.nightMode }

  ctx.save()
  if (pulse !== 1) {
    const cx = slotLeftScreen + slotW * 0.5
    const cy = vh * (ART_Y + ART_H * 0.46)
    ctx.translate(cx, cy)
    ctx.scale(pulse, pulse)
    ctx.translate(-cx, -cy)
  }

  switch (inst.type) {
    case 'painting':
      painting.draw(ctx, artX, artY, artW, artH, inst, time, base)
      break
    case 'sculpture':
      sculpture.draw(ctx, artX, artY - vh * 0.08, artW, artH + vh * 0.08, inst, time, base)
      break
    case 'screenWork':
      screenWork.draw(ctx, artX, artY, artW, artH, inst, time, base)
      break
    case 'neonSign':
      neonSign.draw(ctx, artX, artY, artW, artH, inst, time, base)
      break
    case 'diorama':
      diorama.draw(ctx, artX, artY, artW, artH, inst, time, base)
      break
    case 'mobileHanging':
      mobileHanging.draw(ctx, slotLeftScreen + slotW * 0.12, artY - vh * 0.02, slotW * 0.76, artH + vh * 0.1, inst, time, base)
      break
    default:
      painting.draw(ctx, artX, artY, artW, artH, inst, time, base)
  }

  ctx.restore()
}

/**
 * @param {number} vw
 */
export function isSlotVisible(slotLeftScreen, vw, slotW) {
  return slotLeftScreen > -slotW && slotLeftScreen < vw + slotW
}

/**
 * @param {CanvasRenderingContext2D} ctx thumb context
 * @param {number} tw
 * @param {number} th
 * @param {Inst} inst
 */
export function drawInstallationThumb(ctx, tw, th, inst, time, nightMode) {
  ctx.save()
  ctx.scale(tw / 160, th / 120)
  drawInstallation(ctx, 0, 160, 120, inst, time, { nightMode })
  ctx.restore()
}
