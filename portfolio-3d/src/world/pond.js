import * as THREE from 'three'

const group = new THREE.Group()
/** @type {THREE.Mesh} */
let water
const fadeMeshes = []

export function init(scene) {
  const waterGeo = new THREE.CircleGeometry(10, 48)
  const waterMat = new THREE.MeshPhongMaterial({
    color: 0x2a6a8a,
    transparent: true,
    opacity: 0.82,
    shininess: 90,
    side: THREE.DoubleSide,
  })
  water = new THREE.Mesh(waterGeo, waterMat)
  water.rotation.x = -Math.PI / 2
  water.position.set(0, 0.02, 8)
  group.add(water)

  for (let i = 0; i < 10; i++) {
    const rockMat = new THREE.MeshLambertMaterial({ color: 0x3a3a3e, transparent: true, opacity: 1 })
    const rock = new THREE.Mesh(new THREE.DodecahedronGeometry(0.35 + Math.random() * 0.35, 0), rockMat)
    const a = Math.random() * Math.PI * 2
    const r = 3 + Math.random() * 6.5
    rock.position.set(Math.cos(a) * r, 0.2 + Math.random() * 0.15, 8 + Math.sin(a) * r)
    rock.scale.set(0.8 + Math.random(), 0.5 + Math.random() * 0.6, 0.7 + Math.random() * 0.5)
    rock.rotation.set(Math.random(), Math.random(), Math.random())
    group.add(rock)
    fadeMeshes.push(rock)
  }

  for (let i = 0; i < 36; i++) {
    const grassMat = new THREE.MeshLambertMaterial({ color: 0x4a6b42, transparent: true, opacity: 1 })
    const h = 0.5 + Math.random()
    const blade = new THREE.Mesh(new THREE.BoxGeometry(0.06, h, 0.12), grassMat)
    const a = Math.random() * Math.PI * 2
    const rr = 2 + Math.random() * 7.5
    blade.position.set(Math.cos(a) * rr, h / 2, 8 + Math.sin(a) * rr)
    blade.rotation.y = Math.random() * Math.PI
    group.add(blade)
    fadeMeshes.push(blade)
  }

  scene.add(group)
}

export function update(t) {
  const end = 0.25
  let vis = 1
  if (t >= end) vis = 0
  else if (t > end - 0.08) vis = 1 - (t - (end - 0.08)) / 0.08

  water.material.opacity = 0.82 * vis
  water.material.transparent = vis < 1
  water.visible = vis > 0.02

  for (const m of fadeMeshes) {
    m.material.opacity = vis
    m.material.transparent = vis < 1
    m.visible = vis > 0.02
  }
}
