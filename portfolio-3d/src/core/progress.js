/** @type {number} Scroll progress 0..1 */
export let t = 0

const WHEEL_STEP = 0.004
const KEY_STEP = 0.003

function clamp01(v) {
  return Math.min(1, Math.max(0, v))
}

function setT(next) {
  const clamped = clamp01(next)
  if (clamped === t) return
  t = clamped
  window.dispatchEvent(
    new CustomEvent('progressUpdate', { detail: { t } })
  )
}

function onWheel(e) {
  e.preventDefault()
  const delta = e.deltaY > 0 ? WHEEL_STEP : -WHEEL_STEP
  setT(t + delta)
}

function onKeyDown(e) {
  if (e.key === 'ArrowDown') {
    e.preventDefault()
    setT(t + KEY_STEP)
  } else if (e.key === 'ArrowUp') {
    e.preventDefault()
    setT(t - KEY_STEP)
  }
}

export function init() {
  window.addEventListener('wheel', onWheel, { passive: false })
  window.addEventListener('keydown', onKeyDown)
}

export function getT() {
  return t
}
