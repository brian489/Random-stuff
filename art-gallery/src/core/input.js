const MAX_SPEED = 420
const ACCEL = 1800
const FRICTION = 6.5

let targetVel = 0
let velocity = 0
let scrollAccum = 0

export function initInput() {
  window.addEventListener(
    'wheel',
    (e) => {
      e.preventDefault()
      scrollAccum += e.deltaY > 0 ? 1 : -1
    },
    { passive: false }
  )

  window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') targetVel = MAX_SPEED
    if (e.key === 'ArrowLeft') targetVel = -MAX_SPEED
  })

  window.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowRight' && targetVel > 0) targetVel = 0
    if (e.key === 'ArrowLeft' && targetVel < 0) targetVel = 0
  })
}

/**
 * @param {number} dt
 * @returns {number} current velocity (world units / sec, logical px)
 */
export function updateInput(dt) {
  if (scrollAccum !== 0) {
    targetVel = scrollAccum > 0 ? MAX_SPEED : -MAX_SPEED
    scrollAccum = 0
  }

  const rate = targetVel === 0 ? FRICTION : ACCEL
  velocity += (targetVel - velocity) * Math.min(1, rate * dt)

  if (Math.abs(velocity) < 4 && targetVel === 0) velocity = 0

  return velocity
}

export function getVelocity() {
  return velocity
}

export function getTargetVelocity() {
  return targetVel
}

export function clearKeys() {
  targetVel = 0
}
