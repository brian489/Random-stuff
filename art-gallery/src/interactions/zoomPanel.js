/**
 * @typedef {import('../installations/installations.config.js').INSTALLATIONS[number]} Inst
 */

/** @type {Inst | null} */
let zoomedInst = null

export function getZoomedInstallation() {
  return zoomedInst
}

/**
 * @param {Inst} inst
 * @param {number} focusScreenX logical px
 * @param {number} focusScreenY logical px
 */
export function openZoom(inst, focusScreenX, focusScreenY) {
  zoomedInst = inst
  const wrap = document.getElementById('canvas-wrap')
  if (!wrap) return
  const vw = window.innerWidth
  const vh = window.innerHeight
  const s = 1.82
  const tx = vw * 0.5 - s * focusScreenX
  const ty = vh * 0.5 - s * focusScreenY
  wrap.classList.add('is-zoomed')
  wrap.style.transform = `translate(${tx}px, ${ty}px) scale(${s})`
}

export function closeZoom() {
  zoomedInst = null
  const wrap = document.getElementById('canvas-wrap')
  if (!wrap) return
  wrap.classList.remove('is-zoomed')
  wrap.style.transform = ''
}
