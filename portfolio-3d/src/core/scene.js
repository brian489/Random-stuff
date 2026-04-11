import * as THREE from 'three'

/** @type {THREE.Scene} */
export let scene
/** @type {THREE.PerspectiveCamera} */
export let camera
/** @type {THREE.WebGLRenderer} */
export let renderer

export function init(canvas) {
  scene = new THREE.Scene()
  scene.background = new THREE.Color(0x6a8caf)

  const aspect = canvas.clientWidth / canvas.clientHeight || 1
  camera = new THREE.PerspectiveCamera(55, aspect, 0.1, 500)
  camera.position.set(0, 3, 15)

  renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: false,
  })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.setSize(canvas.clientWidth, canvas.clientHeight, false)
  renderer.outputColorSpace = THREE.SRGBColorSpace

  const ambient = new THREE.AmbientLight(0x404060, 0.45)
  scene.add(ambient)

  const sun = new THREE.DirectionalLight(0xffe8cc, 0.95)
  sun.position.set(-18, 28, 12)
  scene.add(sun)

  const hemi = new THREE.HemisphereLight(0x87a8c9, 0x3d2f28, 0.55)
  scene.add(hemi)

  function onResize() {
    const w = canvas.clientWidth
    const h = canvas.clientHeight
    if (!w || !h) return
    camera.aspect = w / h
    camera.updateProjectionMatrix()
    renderer.setSize(w, h, false)
  }

  window.addEventListener('resize', onResize)
  onResize()
}
