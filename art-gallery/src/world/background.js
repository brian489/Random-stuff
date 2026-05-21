import { worldToScreen, slotLeftX } from './gallery.js'

/**
 * @typedef {import('../installations/installations.config.js').INSTALLATIONS[number]} Inst
 */

export const CEILING_H = 0.07
export const WALL_TOP = 0.07
export const WALL_BOTTOM = 0.63
export const DADO_BOTTOM = 0.72
export const FLOOR_TOP = 0.72
export const ART_Y = 0.34
export const ART_H = 0.22

/**
 * @param {CanvasRenderingContext2D} ctx
 */
export function drawCeiling(ctx, vw, vh, cameraX, worldW, slotW, openingLightProgress, nightMode) {
  const base = ctx.createLinearGradient(0, 0, 0, vh * CEILING_H)
  if (nightMode) {
    base.addColorStop(0, '#0a0908')
    base.addColorStop(1, '#151210')
  } else {
    base.addColorStop(0, '#2a2620')
    base.addColorStop(1, '#1e1c18')
  }
  ctx.fillStyle = base
  ctx.fillRect(0, 0, vw, vh * CEILING_H)

  const fixtures = Math.max(8, Math.ceil(worldW / (slotW * 0.45)))
  for (let k = 0; k < fixtures; k++) {
    const xw = k * slotW * 0.45 + slotW * 0.2
    const sx = worldToScreen(xw, cameraX, worldW, vw)
    if (sx < -100 || sx > vw + 100) continue
    const on = openingLightProgress >= k / Math.max(1, fixtures - 1)
    const fw = Math.min(slotW * 0.12, 56)
    const fh = 9
    ctx.fillStyle = on ? (nightMode ? '#4a4030' : '#3a3630') : '#1a1816'
    ctx.fillRect(sx - fw / 2, vh * CEILING_H - fh, fw, fh)
    if (on) {
      const g = ctx.createRadialGradient(sx, vh * CEILING_H, 2, sx, vh * CEILING_H + 40, 140)
      g.addColorStop(0, nightMode ? 'rgba(255, 200, 140, 0.4)' : 'rgba(255, 250, 230, 0.24)')
      g.addColorStop(1, 'rgba(255, 255, 255, 0)')
      ctx.fillStyle = g
      ctx.fillRect(sx - 120, vh * CEILING_H - 5, 240, 150)
    }
  }
}

/**
 * @param {Inst[]} installations
 */
export function drawWallSections(ctx, vw, vh, cameraX, worldW, slotW, installations, nightMode) {
  const wallH = (WALL_BOTTOM - WALL_TOP) * vh
  const y = vh * WALL_TOP
  const n = installations.length

  for (let i = 0; i < n; i++) {
    const left = slotLeftX(i, slotW)
    let sx = worldToScreen(left, cameraX, worldW, vw)
    while (sx < -slotW) sx += worldW
    while (sx > vw) sx -= worldW
    if (sx < -slotW - 20 || sx > vw + 20) continue
    const pal = installations[i].palette || ['#d4cfc4']
    ctx.fillStyle = pal[0]
    ctx.globalAlpha = nightMode ? 0.2 : 0.3
    ctx.fillRect(sx, y, slotW + 3, wallH)
    ctx.globalAlpha = 1
  }

  ctx.fillStyle = nightMode ? 'rgba(18,16,14,0.58)' : 'rgba(195,190,180,0.48)'
  ctx.fillRect(0, y, vw, wallH)
}

/**
 * @param {Inst[]} installations
 */
export function drawSpotlights(
  ctx,
  vw,
  vh,
  cameraX,
  worldW,
  slotW,
  installations,
  time,
  nearestSlot,
  pulseSlot,
  nightMode
) {
  const n = installations.length
  const artY = vh * ART_Y
  const artH = vh * ART_H
  const ceilingY = vh * CEILING_H

  for (let i = 0; i < n; i++) {
    const cxw = slotLeftX(i, slotW) + slotW * 0.5
    const sx = worldToScreen(cxw, cameraX, worldW, vw)
    if (sx < -slotW || sx > vw + slotW) continue

    const near = nearestSlot === i
    const pulse = pulseSlot === i ? 1 + Math.sin(time * 3) * 0.015 : 1
    const baseA = near ? 0.16 : 0.07
    const a = baseA * pulse * (nightMode ? 1.35 : 1)

    ctx.fillStyle = nightMode ? `rgba(255, 210, 160, ${a})` : `rgba(255, 248, 220, ${a})`
    ctx.beginPath()
    ctx.moveTo(sx - 42 * pulse, ceilingY)
    ctx.lineTo(sx + 42 * pulse, ceilingY)
    ctx.lineTo(sx + slotW * 0.3, artY + artH)
    ctx.lineTo(sx - slotW * 0.3, artY + artH)
    ctx.closePath()
    ctx.fill()
  }
}

export function drawDadoAndLower(ctx, vw, vh, nightMode) {
  const y0 = vh * WALL_BOTTOM
  const y1 = vh * DADO_BOTTOM
  ctx.fillStyle = nightMode ? '#1c1a17' : '#a8a090'
  ctx.fillRect(0, y0, vw, y1 - y0)
  ctx.strokeStyle = nightMode ? 'rgba(196,163,90,0.35)' : 'rgba(196,163,90,0.55)'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(0, y0)
  ctx.lineTo(vw, y0)
  ctx.stroke()
}

export function drawFloor(ctx, vw, vh, cameraX, worldW, nightMode) {
  const y0 = vh * FLOOR_TOP
  const grad = ctx.createLinearGradient(0, y0, 0, vh)
  grad.addColorStop(0, nightMode ? '#1f1812' : '#4a3828')
  grad.addColorStop(1, nightMode ? '#120e0a' : '#2d2218')
  ctx.fillStyle = grad
  ctx.fillRect(0, y0, vw, vh - y0)

  const vpX = vw * 0.5
  const planks = 28
  ctx.strokeStyle = nightMode ? 'rgba(0,0,0,0.4)' : 'rgba(30,20,12,0.45)'
  ctx.lineWidth = 1
  for (let i = -5; i < planks + 5; i++) {
    const t = i / planks
    const xb = t * vw * 3 - vw
    ctx.beginPath()
    ctx.moveTo(xb, vh)
    ctx.quadraticCurveTo(vpX + (t - 0.5) * 200, vh * 0.85, vpX + (xb - vpX) * 0.08, y0)
    ctx.stroke()
  }

  ctx.fillStyle = nightMode ? '#0f0d0b' : '#2a2018'
  ctx.fillRect(0, vh - 8, vw, 8)
}
