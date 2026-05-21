import './style/main.css'
import './style/panel.css'

import { initCanvas } from './core/canvas.js'
import { startLoop } from './core/renderer.js'
import { initInput, updateInput, getVelocity, clearKeys } from './core/input.js'
import { INSTALLATIONS, prepareInstallations } from './installations/installations.config.js'
import { getSlotWidth, getWorldWidth } from './world/worldWidth.js'
import {
  worldToScreen,
  wrapWorldX,
  lerpCamera,
  slotLeftX,
  circularDist,
  slotCenterWorld,
} from './world/gallery.js'
import * as bg from './world/background.js'
import { drawInstallation, isSlotVisible } from './installations/installationRenderer.js'
import { drawBench } from './world/bench.js'
import { drawWallLabel } from './ui/roomLabel.js'
import { drawCharacter } from './character/character.js'
import { updateAnimator } from './character/characterAnimator.js'
import { updateIdleTimer, isSitting } from './interactions/idleTimer.js'
import { openZoom, closeZoom } from './interactions/zoomPanel.js'
import { initDetailPanel, openDetailPanel, closeDetailPanel, isPanelOpen } from './ui/detailPanel.js'

const { canvas, getSize } = initCanvas()
const installations = prepareInstallations([...INSTALLATIONS])
const n = installations.length

let charXWorld = 0
let cameraX = 0
let openingT = 0
let openingComplete = false
let nightMode = false
let timeSec = 0
let lastPulseSlot = -1
let lastSnapActive = false
let frameDt = 1 / 60

const visitors = [
  { x: 400, v: 32 },
  { x: 1800, v: -26 },
]

initInput()
initDetailPanel()
setupControls()
const progressDots = setupProgressDots()

function slotW() {
  return getSlotWidth(getSize().vw)
}

function worldWidth() {
  return getWorldWidth(getSize().vw, n)
}

function syncWorldDims() {
  const sw = slotW()
  const ww = worldWidth()
  return { sw, ww }
}

function setupControls() {
  const root = document.getElementById('ui-root')
  if (!root) return
  const wrap = document.createElement('div')
  wrap.className = 'gallery-controls'
  const night = document.createElement('button')
  night.type = 'button'
  night.textContent = '🌙'
  night.title = 'Day / night'
  const audio = document.createElement('button')
  audio.type = 'button'
  audio.textContent = '🔊'
  audio.title = 'Ambient (quiet)'
  wrap.appendChild(night)
  wrap.appendChild(audio)
  root.appendChild(wrap)

  night.addEventListener('click', () => {
    nightMode = !nightMode
    document.body.classList.toggle('night-mode', nightMode)
    night.classList.toggle('is-on', nightMode)
  })

  let actx = /** @type {AudioContext | null} */ (null)
  let gn = /** @type {GainNode | null} */ (null)
  let aOn = false
  audio.addEventListener('click', () => {
    if (!actx) {
      actx = new AudioContext()
      const o = actx.createOscillator()
      gn = actx.createGain()
      o.type = 'sine'
      o.frequency.value = 60
      o.connect(gn)
      gn.connect(actx.destination)
      gn.gain.value = 0
      o.start()
    }
    if (actx.state === 'suspended') void actx.resume()
    aOn = !aOn
    audio.classList.toggle('is-on', aOn)
    gn?.gain.setTargetAtTime(aOn ? 0.02 : 0, actx.currentTime, 0.08)
  })
}

function setupProgressDots() {
  const root = document.getElementById('ui-root')
  if (!root) return null
  const row = document.createElement('div')
  row.className = 'progress-dots'
  const dots = []
  for (let i = 0; i < n; i++) {
    const s = document.createElement('span')
    row.appendChild(s)
    dots.push(s)
  }
  root.appendChild(row)
  return dots
}

{
  const { vw } = getSize()
  const sw = getSlotWidth(vw)
  charXWorld = sw * 0.35
  cameraX = charXWorld - vw * 0.45
}

function screenToWorldX(clientX, rect, vw, cam, ww) {
  const mx = ((clientX - rect.left) / rect.width) * vw
  return wrapWorldX(cam + mx, ww)
}

function slotAtWorld(wx, sw) {
  let i = Math.floor(wx / sw)
  i = ((i % n) + n) % n
  return i
}

function canInteractWithSlot(slotIdx, sw, ww) {
  const cx = slotCenterWorld(slotIdx, sw)
  return circularDist(charXWorld, cx, ww) < sw * 0.58
}

canvas.addEventListener('click', (e) => {
  if (!openingComplete || isPanelOpen()) return
  const { vw, vh } = getSize()
  const { sw, ww } = syncWorldDims()
  const rect = canvas.getBoundingClientRect()
  const wx = screenToWorldX(e.clientX, rect, vw, cameraX, ww)
  const idx = slotAtWorld(wx, sw)
  if (!canInteractWithSlot(idx, sw, ww)) return
  const inst = installations[idx]
  const slotLeft = worldToScreen(slotLeftX(idx, sw), cameraX, ww, vw)
  const focusX = slotLeft + sw * 0.5
  const focusY = vh * (bg.ART_Y + bg.ART_H * 0.45)
  openZoom(inst, focusX, focusY)
  openDetailPanel(inst, timeSec, nightMode)
})

window.addEventListener('gallery:closePanel', () => {
  closeZoom()
})

window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && isPanelOpen()) {
    closeDetailPanel()
    closeZoom()
    clearKeys()
  }
})

document.addEventListener('pointerdown', (e) => {
  if (!isPanelOpen()) return
  const t = /** @type {HTMLElement | null} */ (e.target)
  if (t?.closest?.('.detail-panel')) return
  if (t?.closest?.('.gallery-controls')) return
  closeDetailPanel()
  closeZoom()
})

function nearestSlotIndex(charX, sw, ww) {
  let best = 0
  let bestD = Infinity
  for (let i = 0; i < n; i++) {
    const d = circularDist(charX, slotCenterWorld(i, sw), ww)
    if (d < bestD) {
      bestD = d
      best = i
    }
  }
  return best
}

function drawVisitors(ctx, vw, vh, cam, ww, sw) {
  ctx.save()
  for (const v of visitors) {
    const sx = worldToScreen(v.x, cam, ww, vw)
    if (sx < -60 || sx > vw + 60) continue
    ctx.save()
    ctx.translate(sx, vh * 0.79)
    ctx.scale(0.68, 0.68)
    ctx.globalAlpha = 0.5
    ctx.fillStyle = '#2a241c'
    ctx.fillRect(-8, -24, 16, 28)
    ctx.fillStyle = '#c8c0b4'
    ctx.fillRect(-12, -40, 24, 20)
    ctx.beginPath()
    ctx.arc(0, -48, 8, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()
  }
  ctx.restore()
}

startLoop({
  update(dt, now) {
    frameDt = dt
    timeSec = now / 1000
    const { vw } = getSize()
    const { sw, ww } = syncWorldDims()

    let velocity = updateInput(dt)

    if (!openingComplete) {
      openingT += dt
      if (openingT < 2.2) velocity = 88
      else if (openingT < 2.85) velocity *= 0.35
      else {
        velocity = 0
        openingComplete = true
      }
    }

    const idle = updateIdleTimer(dt, velocity, charXWorld, sw, ww, n)
    lastPulseSlot = idle.pulseSlot
    lastSnapActive = idle.snapping

    if (idle.snapping) {
      charXWorld = wrapWorldX(charXWorld + idle.charDelta, ww)
    } else {
      charXWorld = wrapWorldX(charXWorld + velocity * dt, ww)
    }

    cameraX = lerpCamera(cameraX, charXWorld - vw * 0.42, 0.08)

    const nearIdx = nearestSlotIndex(charXWorld, sw, ww)
    if (progressDots) {
      progressDots.forEach((d, i) => d.classList.toggle('is-active', i === nearIdx))
    }

    visitors.forEach((v) => {
      v.x = wrapWorldX(v.x + v.v * dt, ww)
    })
  },

  draw() {
    const { w, h, vw, vh } = getSize()
    const ctx = /** @type {CanvasRenderingContext2D} */ (canvas.getContext('2d'))
    if (!ctx) return

    const { sw, ww } = syncWorldDims()

    ctx.save()
    ctx.setTransform(1, 0, 0, 1, 0, 0)
    ctx.scale(w / vw, h / vh)

    const openingLight = openingComplete ? 1 : Math.min(1, openingT / 2.1)

    bg.drawCeiling(ctx, vw, vh, cameraX, ww, sw, openingLight, nightMode)
    bg.drawWallSections(ctx, vw, vh, cameraX, ww, sw, installations, nightMode)

    let nearestSlot = 0
    let nearestD = Infinity
    for (let i = 0; i < n; i++) {
      const d = circularDist(charXWorld, slotCenterWorld(i, sw), ww)
      if (d < nearestD) {
        nearestD = d
        nearestSlot = i
      }
    }

    bg.drawSpotlights(
      ctx,
      vw,
      vh,
      cameraX,
      ww,
      sw,
      installations,
      timeSec,
      nearestSlot,
      lastPulseSlot,
      nightMode
    )

    for (let i = 0; i < n; i++) {
      const left = slotLeftX(i, sw)
      const sx = worldToScreen(left, cameraX, ww, vw)
      if (!isSlotVisible(sx, vw, sw)) continue
      const pulse = lastPulseSlot === i && isSitting() ? 1 + Math.sin(timeSec * 3) * 0.015 : 1
      drawInstallation(ctx, sx, sw, vh, installations[i], timeSec, { nightMode, pulseScale: pulse })
    }

    for (let i = 0; i < n; i++) {
      const left = slotLeftX(i, sw)
      const sx = worldToScreen(left, cameraX, ww, vw)
      if (!isSlotVisible(sx, vw, sw)) continue
      const d = circularDist(charXWorld, slotCenterWorld(i, sw), ww)
      const labelA = i === nearestSlot ? Math.min(1, 0.28 + (1 - d / (sw * 0.62)) * 0.72) : 0.26
      drawWallLabel(ctx, sx, sw, vh, installations[i], labelA)
    }

    bg.drawDadoAndLower(ctx, vw, vh, nightMode)
    bg.drawFloor(ctx, vw, vh, cameraX, ww, nightMode)

    for (let i = 0; i < n; i++) {
      const left = slotLeftX(i, sw)
      const sx = worldToScreen(left, cameraX, ww, vw)
      if (!isSlotVisible(sx, vw, sw)) continue
      drawBench(ctx, sx, sw, vh, installations[i])
    }

    drawVisitors(ctx, vw, vh, cameraX, ww, sw)

    const charScreenX = worldToScreen(charXWorld, cameraX, ww, vw)
    const vel = getVelocity()
    const anim = updateAnimator(frameDt, vel, {
      sitting: isSitting(),
      looking: isPanelOpen(),
      snapActive: lastSnapActive,
    })
    const footPulse =
      Math.abs(Math.sin(timeSec * 9)) * (Math.abs(vel) > 18 ? 0.85 : 0.12)

    drawCharacter(ctx, charScreenX, vh, anim, footPulse)

    ctx.restore()
  },
})
