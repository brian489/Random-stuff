import { circularDist, slotCenterWorld } from '../world/gallery.js'

const STILL_THRESH = 22
const STILL_SEC = 2.5
const SNAP_RANGE = 0.5
const SNAP_DUR = 0.6

let stillTime = 0
let snapping = false
let snapProgress = 0
let snapFrom = 0
let snapTo = 0
let sitting = false

/**
 * @param {number} dt
 * @param {number} velocity
 * @param {number} charX wrapped world x
 */
export function updateIdleTimer(dt, velocity, charX, slotW, worldW, nSlots) {
  if (Math.abs(velocity) > STILL_THRESH) {
    stillTime = 0
    if (!snapping) sitting = false
    return {
      charDelta: 0,
      snapping: false,
      sitting,
      pulseSlot: sitting ? nearestBenchIndex(charX, slotW, worldW, nSlots) : -1,
    }
  }

  stillTime += dt

  if (snapping) {
    snapProgress += dt / SNAP_DUR
    const t = Math.min(1, snapProgress)
    const e = 1 - Math.pow(1 - t, 3)
    const x = snapFrom + (snapTo - snapFrom) * e
    const charDelta = x - charX
    if (t >= 1) {
      snapping = false
      sitting = true
      return { charDelta, snapping: false, sitting: true, pulseSlot: nearestBenchIndex(snapTo, slotW, worldW, nSlots) }
    }
    return { charDelta, snapping: true, sitting: false, pulseSlot: -1 }
  }

  if (stillTime < STILL_SEC) {
    return { charDelta: 0, snapping: false, sitting, pulseSlot: -1 }
  }

  const { idx, dist, bx } = nearestBench(charX, slotW, worldW, nSlots)
  if (dist < slotW * SNAP_RANGE) {
    snapping = true
    snapProgress = 0
    snapFrom = charX
    snapTo = bx
    stillTime = 0
    return { charDelta: 0, snapping: true, sitting: false, pulseSlot: idx }
  }

  return { charDelta: 0, snapping: false, sitting: false, pulseSlot: -1 }
}

function nearestBench(charX, slotW, worldW, n) {
  let best = slotCenterWorld(0, slotW)
  let bestD = Infinity
  let bestI = 0
  for (let i = 0; i < n; i++) {
    const bx = slotCenterWorld(i, slotW)
    const d = circularDist(charX, bx, worldW)
    if (d < bestD) {
      bestD = d
      best = bx
      bestI = i
    }
  }
  return { idx: bestI, dist: bestD, bx: best }
}

function nearestBenchIndex(charX, slotW, worldW, n) {
  let bestI = 0
  let bestD = Infinity
  for (let i = 0; i < n; i++) {
    const bx = slotCenterWorld(i, slotW)
    const d = circularDist(charX, bx, worldW)
    if (d < bestD) {
      bestD = d
      bestI = i
    }
  }
  return bestI
}

export function clearSitting() {
  sitting = false
}

export function isSitting() {
  return sitting
}
