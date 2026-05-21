/**
 * @typedef {'walking' | 'slowing' | 'idle_standing' | 'sitting' | 'looking'} CharState
 */

/** @type {CharState} */
let state = 'idle_standing'
let walkDistance = 0
let breathT = 0
let sitBlend = 0
let lookBlend = 0
let lastVelSign = 1

/**
 * @param {number} dt
 * @param {number} velocity
 * @param {{ sitting: boolean, looking: boolean, snapActive: boolean }} flags
 */
export function updateAnimator(dt, velocity, flags) {
  breathT += dt

  if (flags.looking) {
    lookBlend = Math.min(1, lookBlend + dt * 3)
    state = 'looking'
  } else {
    lookBlend = Math.max(0, lookBlend - dt * 2)
  }

  if (flags.sitting || flags.snapActive) {
    sitBlend = Math.min(1, sitBlend + dt * 1.8)
    state = 'sitting'
    return { state, walkPhase: walkDistance, breathT, sitBlend, lookBlend, facing: lastVelSign }
  }
  sitBlend = Math.max(0, sitBlend - dt * 2)

  const v = Math.abs(velocity)
  if (v > 35) {
    state = 'walking'
    walkDistance += v * dt * 0.018
    lastVelSign = velocity >= 0 ? 1 : -1
  } else if (v > 8 || state === 'slowing') {
    state = 'slowing'
    walkDistance += v * dt * 0.01
    if (v < 8) state = 'idle_standing'
  } else {
    state = 'idle_standing'
  }

  return { state, walkPhase: walkDistance, breathT, sitBlend, lookBlend, facing: lastVelSign }
}

export function resetAnimator() {
  state = 'idle_standing'
  walkDistance = 0
  sitBlend = 0
  lookBlend = 0
}
