import './style/main.css'
import './style/panel.css'
import './style/progressBar.css'

import { init as initScene, scene, camera, renderer } from './core/scene.js'
import { init as initProgress, getT } from './core/progress.js'
import { getCameraTransform } from './core/cameraPath.js'
import * as pond from './world/pond.js'
import * as forest from './world/forest.js'
import * as clearing from './world/clearing.js'
import { init as initFigure } from './character/figure.js'
import * as figureAnimator from './character/figureAnimator.js'
import * as nodeManager from './nodes/nodeManager.js'
import * as panel from './ui/panel.js'
import { init as initProgressBar } from './ui/progressBar.js'
import { init as initOverlay } from './ui/overlay.js'

const canvas = document.getElementById('canvas')
if (!canvas) {
  throw new Error('Missing #canvas')
}

initScene(canvas)
initProgress()
initFigure(scene)
pond.init(scene)
forest.init(scene)
clearing.init(scene)
panel.init()
initProgressBar()
initOverlay()
nodeManager.init(scene)

function onProgressUpdate() {
  const t = getT()
  const { position, lookAt } = getCameraTransform(t)
  camera.position.copy(position)
  camera.lookAt(lookAt)
  pond.update(t)
  forest.update(t)
  clearing.update(t, scene)
  nodeManager.update(t)
}

window.addEventListener('progressUpdate', onProgressUpdate)
onProgressUpdate()

function animate() {
  requestAnimationFrame(animate)
  figureAnimator.update(getT())
  renderer.render(scene, camera)
}

animate()
