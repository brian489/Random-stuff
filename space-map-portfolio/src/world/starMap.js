import { NODES } from '../nodes/nodes.config.js';

export const SLOT_FRAC = 0.65;

/**
 * @param {number} viewportWidth
 */
export function computeWorldWidth(viewportWidth) {
  return NODES.length * viewportWidth * SLOT_FRAC;
}

/**
 * @param {typeof NODES[0]} node
 * @param {number} worldWidth
 * @param {number} canvasHeight
 */
export function nodeWorldPos(node, worldWidth, canvasHeight) {
  return {
    x: node.x * worldWidth,
    y: node.y * canvasHeight,
  };
}

/**
 * Parallax: far = lower depth multiplier on camera pan.
 * @param {number} depth
 */
export function parallaxFactor(depth) {
  return 0.45 + 0.45 * depth;
}

/**
 * @param {number} worldX
 * @param {number} cameraX
 * @param {number} depth
 */
export function screenX(worldX, cameraX, depth) {
  return worldX - cameraX * parallaxFactor(depth);
}

/**
 * Focus target: node appears at `frac` of viewport width from left.
 * @param {number} worldX
 * @param {number} viewportWidth
 * @param {number} depth
 * @param {number} [frac=0.35]
 */
export function cameraForFocus(worldX, viewportWidth, depth, frac = 0.35) {
  const p = parallaxFactor(depth);
  return (worldX - frac * viewportWidth) / p;
}
