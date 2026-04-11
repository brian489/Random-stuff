import * as THREE from 'three'

const group = new THREE.Group()
let monolith
let stars
const dawn = new THREE.Color(0x6a8caf)
const dusk = new THREE.Color(0x2d1f4a)

export function init(scene) {
  const ground = new THREE.Mesh(
    new THREE.CircleGeometry(35, 64),
    new THREE.MeshLambertMaterial({ color: 0x5a8a52 })
  )
  ground.rotation.x = -Math.PI / 2
  ground.position.set(52, 0.01, -50)
  group.add(ground)

  monolith = new THREE.Mesh(
    new THREE.BoxGeometry(1.2, 7, 1.2),
    new THREE.MeshStandardMaterial({
      color: 0x2a2830,
      metalness: 0.3,
      roughness: 0.35,
      emissive: new THREE.Color(0xffd9a3),
      emissiveIntensity: 0.35,
    })
  )
  monolith.position.set(52, 3.5, -50)
  group.add(monolith)

  const starCount = 2000
  const positions = new Float32Array(starCount * 3)
  for (let i = 0; i < starCount; i++) {
    const r = 40 + Math.random() * 80
    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos(2 * Math.random() - 1)
    positions[i * 3] = 52 + r * Math.sin(phi) * Math.cos(theta)
    positions[i * 3 + 1] = 8 + r * Math.cos(phi) * 0.8
    positions[i * 3 + 2] = -50 + r * Math.sin(phi) * Math.sin(theta)
  }
  const starGeo = new THREE.BufferGeometry()
  starGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  const starMat = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.08,
    transparent: true,
    opacity: 0,
    sizeAttenuation: true,
    depthWrite: false,
  })
  stars = new THREE.Points(starGeo, starMat)
  group.add(stars)

  scene.add(group)
}

export function update(t, sceneRef) {
  if (!sceneRef || !sceneRef.background) return

  const c = new THREE.Color().lerpColors(dawn, dusk, t)
  sceneRef.background.copy(c)

  if (stars && stars.material) {
    const fade = THREE.MathUtils.smoothstep(t, 0.72, 0.92)
    stars.material.opacity = fade * 0.9
    stars.visible = fade > 0.02
  }
}
