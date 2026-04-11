import * as THREE from 'three'

/**
 * @typedef {Object} FigureParts
 * @property {THREE.Mesh} head
 * @property {THREE.Mesh} torso
 * @property {THREE.Mesh} leftUpperArm
 * @property {THREE.Mesh} leftLowerArm
 * @property {THREE.Mesh} rightUpperArm
 * @property {THREE.Mesh} rightLowerArm
 * @property {THREE.Mesh} leftUpperLeg
 * @property {THREE.Mesh} leftLowerLeg
 * @property {THREE.Mesh} rightUpperLeg
 * @property {THREE.Mesh} rightLowerLeg
 */

export const figure = new THREE.Group()

/** @type {FigureParts} */
export const parts = {}

function addLimb(geo, mat, x, y, z, rx, ry, rz, name) {
  const m = new THREE.Mesh(geo, mat)
  m.position.set(x, y, z)
  m.rotation.set(rx, ry, rz)
  figure.add(m)
  parts[name] = m
  return m
}

export function init(scene) {
  const skin = new THREE.MeshLambertMaterial({ color: 0xc8a882 })
  const cloth = new THREE.MeshLambertMaterial({ color: 0x3a4a6a })

  parts.head = new THREE.Mesh(new THREE.SphereGeometry(0.22, 16, 16), skin)
  parts.head.position.set(0, 1.38, 0)
  figure.add(parts.head)

  parts.torso = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.26, 0.72, 12), cloth)
  parts.torso.position.set(0, 0.82, 0)
  figure.add(parts.torso)

  const armGeo = new THREE.CylinderGeometry(0.07, 0.07, 0.38, 8)
  const foreGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.34, 8)
  const thighGeo = new THREE.CylinderGeometry(0.1, 0.09, 0.42, 8)
  const shinGeo = new THREE.CylinderGeometry(0.08, 0.07, 0.38, 8)

  addLimb(armGeo, skin, -0.32, 1.05, 0, 0, 0, 0.15, 'leftUpperArm')
  addLimb(foreGeo, skin, -0.52, 0.78, 0, 0.2, 0, 0.15, 'leftLowerArm')
  addLimb(armGeo, skin, 0.32, 1.05, 0, 0, 0, -0.15, 'rightUpperArm')
  addLimb(foreGeo, skin, 0.52, 0.78, 0, 0.2, 0, -0.15, 'rightLowerArm')

  addLimb(thighGeo, cloth, -0.14, 0.42, 0, 0, 0, 0, 'leftUpperLeg')
  addLimb(shinGeo, skin, -0.14, 0.12, 0, 0, 0, 0, 'leftLowerLeg')
  addLimb(thighGeo, cloth, 0.14, 0.42, 0, 0, 0, 0, 'rightUpperLeg')
  addLimb(shinGeo, skin, 0.14, 0.12, 0, 0, 0, 0, 'rightLowerLeg')

  scene.add(figure)
}
