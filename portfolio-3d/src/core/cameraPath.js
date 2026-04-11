import * as THREE from 'three'

/**
 * Authoritative layout: spline through pond → forest corridor → clearing.
 * ~10 control points.
 */
const controlPoints = [
  new THREE.Vector3(0, 2.2, 12),
  new THREE.Vector3(2, 2.4, 6),
  new THREE.Vector3(4, 2.8, 0),
  new THREE.Vector3(6, 3.2, -8),
  new THREE.Vector3(10, 3.5, -18),
  new THREE.Vector3(16, 4, -28),
  new THREE.Vector3(24, 4.5, -36),
  new THREE.Vector3(32, 5, -42),
  new THREE.Vector3(40, 5.5, -46),
  new THREE.Vector3(48, 6, -48),
  new THREE.Vector3(52, 6.5, -50),
]

export const cameraCurve = new THREE.CatmullRomCurve3(controlPoints, false, 'catmullrom', 0.5)

const figureOffset = new THREE.Vector3(-1.2, -1.6, 0.5)
const figurePoints = controlPoints.map((p) => p.clone().add(figureOffset))
export const figureCurve = new THREE.CatmullRomCurve3(figurePoints, false, 'catmullrom', 0.5)

const lookAhead = 0.01

/**
 * @param {number} t0
 * @returns {{ position: THREE.Vector3, lookAt: THREE.Vector3 }}
 */
export function getCameraTransform(t0) {
  const u = THREE.MathUtils.clamp(t0, 0, 1)
  const position = cameraCurve.getPointAt(u)
  const lookU = THREE.MathUtils.clamp(u + lookAhead, 0, 1)
  const lookAt = cameraCurve.getPointAt(lookU)
  return { position, lookAt }
}

/**
 * @param {number} t0
 * @returns {{ position: THREE.Vector3, facing: THREE.Vector3 }}
 */
export function getFigurePathTransform(t0) {
  const u = THREE.MathUtils.clamp(t0, 0, 1)
  const position = figureCurve.getPointAt(u)
  const nextU = THREE.MathUtils.clamp(u + 0.02, 0, 1)
  const facing = figureCurve.getPointAt(nextU).sub(position).normalize()
  if (facing.lengthSq() < 1e-6) facing.set(0, 0, -1)
  return { position, facing }
}
