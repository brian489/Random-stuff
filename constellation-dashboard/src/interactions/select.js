/**
 * @typedef {import('../constellation/stars.config.js').CONSTELLATION['stars'][number]} Star
 */

/** @type {Star | null} */
let selected = null

let pulseStartSec = -1

/** @type {{ s: number, tx: number, ty: number }} */
let zoomState = { s: 1, tx: 0, ty: 0 }

/** @returns {Star | null} */
export function getSelected() {
  return selected
}

/** @returns {boolean} */
export function isSelected() {
  return selected !== null
}

export function getZoomState() {
  return zoomState
}

/**
 * Map pointer inside canvas element to normalized star space (0–1), inverting active zoom.
 */
export function clientToNormalized(clientX, clientY, rect) {
  const mx = clientX - rect.left
  const my = clientY - rect.top
  if (!selected || zoomState.s === 1) {
    return { nx: mx / rect.width, ny: my / rect.height }
  }
  const { s, tx, ty } = zoomState
  const lx = (mx - tx) / s
  const ly = (my - ty) / s
  return { nx: lx / rect.width, ny: ly / rect.height }
}

/**
 * @param {Star | null} star
 * @param {number} timeSec
 * @param {HTMLElement | null} zoomEl
 */
export function selectStar(star, timeSec, zoomEl) {
  selected = star
  const zoom = zoomEl ?? /** @type {HTMLElement | null} */ (document.getElementById('main-zoom'))
  if (!zoom) return

  if (!star) {
    zoom.classList.remove('is-selected')
    zoom.style.setProperty('--zoom-scale', '1')
    zoom.style.setProperty('--zoom-tx', '0px')
    zoom.style.setProperty('--zoom-ty', '0px')
    zoomState = { s: 1, tx: 0, ty: 0 }
    document.body.style.cursor = ''
    pulseStartSec = -1
    return
  }

  pulseStartSec = timeSec
  document.body.style.cursor = 'pointer'

  const s = 2.35
  const px = star.x * window.innerWidth
  const py = star.y * window.innerHeight
  const cx = window.innerWidth / 2
  const cy = window.innerHeight / 2
  const tx = cx - s * px
  const ty = cy - s * py
  zoomState = { s, tx, ty }

  zoom.classList.add('is-selected')
  zoom.style.setProperty('--zoom-scale', String(s))
  zoom.style.setProperty('--zoom-tx', `${tx}px`)
  zoom.style.setProperty('--zoom-ty', `${ty}px`)
}

export function closeSelect(timeSec, zoomEl) {
  selectStar(null, timeSec, zoomEl)
}

/** @returns {number} -1 if no pulse */
export function getPulseStartSec() {
  return pulseStartSec
}

export function clearPulse() {
  pulseStartSec = -1
}
