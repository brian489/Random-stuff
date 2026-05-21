/**
 * @param {number} viewportWidth logical css px
 * @param {number} count installation count
 */
export function getSlotWidth(viewportWidth) {
  return viewportWidth * 0.7
}

export function getWorldWidth(viewportWidth, installationCount) {
  return getSlotWidth(viewportWidth) * installationCount
}
