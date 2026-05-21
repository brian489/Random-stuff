import { CONSTELLATION } from './stars.config.js'

/** @typedef {typeof CONSTELLATION.stars[number]} Star */

const byId = new Map(CONSTELLATION.stars.map((s) => [s.id, s]))

/** @returns {Star[]} */
export function getStarsSortedByOrder() {
  return [...CONSTELLATION.stars].sort((a, b) => a.order - b.order)
}

/** @param {string} id @returns {Star | undefined} */
export function getStarById(id) {
  return byId.get(id)
}

/** @returns {boolean} */
export function hasConnection(fromId, toId) {
  return CONSTELLATION.connections.some(([x, y]) => x === fromId && y === toId)
}

/**
 * Edges animated in load sequence: walk stars by `order`, include each config edge from star N to N+1.
 * Branch (alnitak → saiph) is appended after the main spine reaches rigel.
 */
export function getAnimationEdges() {
  const sorted = getStarsSortedByOrder()
  const primary = []
  for (let i = 0; i < sorted.length - 1; i++) {
    const a = sorted[i]
    const b = sorted[i + 1]
    if (hasConnection(a.id, b.id)) primary.push([a, b])
  }

  const extra = []
  for (const [fromId, toId] of CONSTELLATION.connections) {
    const from = byId.get(fromId)
    const to = byId.get(toId)
    if (!from || !to) continue
    const inPrimary = primary.some((e) => e[0].id === fromId && e[1].id === toId)
    if (!inPrimary) extra.push([from, to])
  }

  return [...primary, ...extra]
}
