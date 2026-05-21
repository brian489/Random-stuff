/**
 * @param {number} xWorld
 * @param {number} cameraX
 * @param {number} worldW
 * @param {number} vw
 * @param {number} [margin]
 */
export function worldToScreen(xWorld, cameraX, worldW, vw, margin = 400) {
  let s = xWorld - cameraX
  while (s < -margin) s += worldW
  while (s > vw + margin) s -= worldW
  return s
}

export function wrapWorldX(x, worldW) {
  let v = x % worldW
  if (v < 0) v += worldW
  return v
}

/**
 * @param {number} cameraX
 * @param {number} targetX
 * @param {number} t lerp factor
 */
export function lerpCamera(cameraX, targetX, t) {
  return cameraX + (targetX - cameraX) * t
}

export function slotCenterX(index, slotW) {
  return index * slotW + slotW * 0.5
}

export function slotLeftX(index, slotW) {
  return index * slotW
}

/**
 * @param {number} xWorld char position
 * @param {number} slotW
 * @param {number} n
 */
export function nearestSlotIndex(xWorld, slotW, n) {
  const i = Math.floor(xWorld / slotW)
  const wrapped = ((i % n) + n) % n
  return wrapped
}

export function circularDist(a, b, worldW) {
  const d = Math.abs(a - b)
  return Math.min(d, worldW - d)
}

export function slotCenterWorld(i, slotW) {
  return i * slotW + slotW * 0.5
}
