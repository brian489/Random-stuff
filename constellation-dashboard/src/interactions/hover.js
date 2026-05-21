/**
 * @typedef {import('../constellation/stars.config.js').CONSTELLATION['stars'][number]} Star
 */

/**
 * @param {number} mx canvas pixel x
 * @param {number} my canvas pixel y
 * @param {Star[]} stars
 * @param {number} w
 * @param {number} h
 * @returns {Star | null}
 */
export function hitTest(mx, my, stars, w, h) {
  let best = null
  let bestD = Infinity
  for (const s of stars) {
    const px = s.x * w
    const py = s.y * h
    const d = Math.hypot(mx - px, my - py)
    const hitR = 24 + (typeof s.sizeScale === 'number' ? s.sizeScale : 1) * 22
    if (d < hitR && d < bestD) {
      bestD = d
      best = s
    }
  }
  return best
}

/**
 * @param {HTMLElement | null} el
 * @param {Star | null} star
 * @param {number} clientX
 * @param {number} clientY
 */
export function updateTooltip(el, star, clientX, clientY) {
  if (!el) return
  if (!star) {
    el.classList.remove('is-visible')
    return
  }
  el.classList.add('is-visible')
  el.style.left = `${clientX}px`
  el.style.top = `${clientY}px`
  el.textContent = star.label
}
