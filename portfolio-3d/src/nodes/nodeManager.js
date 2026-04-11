import * as THREE from 'three'
import { cameraCurve } from '../core/cameraPath.js'
import { NODES } from './nodes.config.js'
import * as panel from '../ui/panel.js'

const orbs = []

export function init(scene) {
  for (const node of NODES) {
    const mat = new THREE.MeshStandardMaterial({
      color: 0x66ccff,
      emissive: new THREE.Color(0x4488ff),
      emissiveIntensity: 0.85,
      metalness: 0.2,
      roughness: 0.35,
    })
    const mesh = new THREE.Mesh(new THREE.SphereGeometry(0.35, 20, 20), mat)
    const u = THREE.MathUtils.clamp(node.t, 0, 1)
    mesh.position.copy(cameraCurve.getPointAt(u))
    mesh.userData.nodeT = node.t
    mesh.userData.node = node
    scene.add(mesh)
    orbs.push(mesh)
  }
}

export function update(t) {
  for (const node of NODES) {
    if (Math.abs(t - node.t) < 0.04) {
      panel.show(node)
    } else {
      panel.hide(node.t)
    }
  }

  for (const orb of orbs) {
    const nt = orb.userData.nodeT
    const prox = 1 - Math.min(1, Math.abs(t - nt) / 0.12)
    const pulse = 1 + 0.12 * Math.sin(t * 14 + nt * 40) * (0.3 + prox * 0.7)
    orb.scale.setScalar(pulse)
  }
}
