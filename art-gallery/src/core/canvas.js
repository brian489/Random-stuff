/**
 * @returns {{ canvas: HTMLCanvasElement, resize: () => void, getSize: () => { w: number, h: number, vw: number, vh: number } }}
 */
export function initCanvas() {
  const canvas = /** @type {HTMLCanvasElement} */ (document.getElementById('game-canvas'))
  if (!canvas) throw new Error('Missing #game-canvas')

  let w = 0
  let h = 0
  let vw = 0
  let vh = 0

  function resize() {
    vw = window.innerWidth
    vh = window.innerHeight
    w = Math.floor(vw * window.devicePixelRatio)
    h = Math.floor(vh * window.devicePixelRatio)
    canvas.width = w
    canvas.height = h
    canvas.style.width = `${vw}px`
    canvas.style.height = `${vh}px`
  }

  resize()
  window.addEventListener('resize', resize)

  return {
    canvas,
    resize,
    getSize: () => ({ w, h, vw, vh }),
  }
}
