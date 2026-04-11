import * as THREE from 'three'
import { getFigurePathTransform } from '../core/cameraPath.js'
import { figure, parts } from './figure.js'

export const WALK_FREQUENCY = 32
export const WALK_ARM_AMP = 0.55
export const WALK_LEG_AMP = 0.65

const _euler = new THREE.Euler()
const _qLie = new THREE.Quaternion()
const _qStand = new THREE.Quaternion()
const _qOut = new THREE.Quaternion()

const bind = {
  torso: new THREE.Euler(),
  head: new THREE.Euler(),
  leftUpperArm: new THREE.Euler(),
  leftLowerArm: new THREE.Euler(),
  rightUpperArm: new THREE.Euler(),
  rightLowerArm: new THREE.Euler(),
  leftUpperLeg: new THREE.Euler(),
  leftLowerLeg: new THREE.Euler(),
  rightUpperLeg: new THREE.Euler(),
  rightLowerLeg: new THREE.Euler(),
}

function captureBind() {
  for (const n of Object.keys(bind)) {
    if (parts[n]) bind[n].copy(parts[n].rotation)
  }
}

let captured = false

function lyingEuler(name) {
  const e = new THREE.Euler()
  switch (name) {
    case 'torso':
    case 'head':
      e.copy(bind[name])
      break
    case 'leftUpperArm':
      e.set(0, 0, 0.4)
      break
    case 'leftLowerArm':
      e.set(0.15, 0, 0)
      break
    case 'rightUpperArm':
      e.set(0, 0, -0.4)
      break
    case 'rightLowerArm':
      e.set(0.15, 0, 0)
      break
    case 'leftUpperLeg':
    case 'rightUpperLeg':
      e.set(0.02, 0, 0)
      break
    case 'leftLowerLeg':
    case 'rightLowerLeg':
      e.set(0.12, 0, 0)
      break
    default:
      break
  }
  return e
}

const limbNames = [
  'torso',
  'head',
  'leftUpperArm',
  'leftLowerArm',
  'rightUpperArm',
  'rightLowerArm',
  'leftUpperLeg',
  'leftLowerLeg',
  'rightUpperLeg',
  'rightLowerLeg',
]

export function update(t) {
  if (!captured) {
    captureBind()
    captured = true
  }

  const { position, facing } = getFigurePathTransform(t)
  const yaw = Math.atan2(facing.x, facing.z)

  const blendStand = Math.min(1, THREE.MathUtils.smoothstep(t / 0.15, 0, 1))

  const lieBodyX = -Math.PI / 2
  const standBodyX = 0
  const bodyRotX = THREE.MathUtils.lerp(lieBodyX, standBodyX, blendStand)
  const bodyY = THREE.MathUtils.lerp(0.28, 0, blendStand)

  figure.position.set(position.x, position.y + bodyY, position.z)
  figure.rotation.order = 'YXZ'
  figure.rotation.y = yaw
  figure.rotation.x = bodyRotX
  figure.rotation.z = 0

  const walkPhase = t > 0.2 ? Math.sin(t * WALK_FREQUENCY) : 0

  for (const n of limbNames) {
    _qLie.setFromEuler(lyingEuler(n))
    _qStand.setFromEuler(bind[n])
    _qOut.copy(_qLie).slerp(_qStand, blendStand)

    _euler.setFromQuaternion(_qOut)

    if (t > 0.2) {
      if (n.includes('Arm')) {
        const sign = n.includes('left') ? 1 : -1
        _euler.x += walkPhase * WALK_ARM_AMP * 0.25 * sign
        _euler.z += walkPhase * WALK_ARM_AMP * sign
      }
      if (n.includes('Leg')) {
        const sign = n.includes('left') ? 1 : -1
        _euler.x += walkPhase * WALK_LEG_AMP * -sign
      }
    }

    parts[n].rotation.set(_euler.x, _euler.y, _euler.z)
  }
}
