import * as THREE from 'three'

const group = new THREE.Group()

export function init(scene) {
  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(120, 120, 1, 1),
    new THREE.MeshLambertMaterial({ color: 0x2a2218 })
  )
  ground.rotation.x = -Math.PI / 2
  ground.position.set(22, 0, -22)
  group.add(ground)

  const trunkGeo = new THREE.CylinderGeometry(0.12, 0.18, 1.2, 8)
  const canopyGeo = new THREE.ConeGeometry(0.85, 1.8, 10)

  for (let i = 0; i < 20; i++) {
    const z = -2 - i * 2.2 - Math.random() * 0.8
    const xL = 4 + Math.sin(i * 0.7) * 2 + (Math.random() - 0.5) * 2
    const xR = 14 + Math.sin(i * 0.5) * 2.5 + (Math.random() - 0.5) * 2
    for (const x of [xL, xR]) {
      const trunk = new THREE.Mesh(
        trunkGeo,
        new THREE.MeshLambertMaterial({ color: 0x3d2e22 })
      )
      const scale = 0.85 + Math.random() * 0.5
      trunk.scale.set(scale, scale, scale)
      trunk.position.set(x, 0.6 * scale, z)
      group.add(trunk)

      const canopy = new THREE.Mesh(
        canopyGeo,
        new THREE.MeshLambertMaterial({
          color: new THREE.Color().setHSL(0.28 + Math.random() * 0.06, 0.45 + Math.random() * 0.2, 0.22 + Math.random() * 0.1),
        })
      )
      canopy.scale.setScalar(0.9 + Math.random() * 0.4)
      canopy.position.set(x, 1.8 * scale, z)
      group.add(canopy)
    }
  }

  const leafMat = new THREE.MeshLambertMaterial({
    color: 0x3d5c38,
    transparent: true,
    opacity: 0.45,
    side: THREE.DoubleSide,
  })
  for (let i = 0; i < 40; i++) {
    const leaf = new THREE.Mesh(new THREE.PlaneGeometry(0.35, 0.5), leafMat)
    leaf.position.set(5 + Math.random() * 12, 0.3 + Math.random() * 3, -4 - Math.random() * 28)
    leaf.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * 0.5)
    group.add(leaf)
  }

  const beamGroup = new THREE.Group()
  for (let i = 0; i < 4; i++) {
    const spot = new THREE.SpotLight(0xc8e8ff, 1.2, 45, 0.45, 0.35, 1)
    const bx = 8 + i * 5
    const bz = -10 - i * 6
    spot.position.set(bx, 14, bz)
    spot.target.position.set(bx + 0.5, 0, bz - 2)
    group.add(spot)
    group.add(spot.target)

    const cone = new THREE.Mesh(
      new THREE.ConeGeometry(1.8, 12, 16, 1, true),
      new THREE.MeshBasicMaterial({
        color: 0xaaccff,
        transparent: true,
        opacity: 0.12,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        side: THREE.DoubleSide,
      })
    )
    cone.position.set(bx, 7, bz - 1)
    cone.rotation.x = Math.PI
    beamGroup.add(cone)
  }
  group.add(beamGroup)

  scene.add(group)
}

export function update(_t) {
  /* visibility handled by materials / scene; optional wind could go here */
}
