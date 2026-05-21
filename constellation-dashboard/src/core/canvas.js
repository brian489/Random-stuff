/**
 * Full-viewport canvas pair: passive background + main constellation layer.
 * @returns {{ bg: HTMLCanvasElement, main: HTMLCanvasElement, resize: () => void, getSize: () => { w: number, h: number } }}
 */
export function initCanvases() {
  const bg = /** @type {HTMLCanvasElement} */ (document.getElementById('bg-canvas'))
  const main = /** @type {HTMLCanvasElement} */ (document.getElementById('main-canvas'))

  if (!bg || !main) {
    throw new Error('Missing #bg-canvas or #main-canvas')
  }

  let w = 0
  let h = 0

  function resize() {
    w = Math.floor(window.innerWidth * window.devicePixelRatio)
    h = Math.floor(window.innerHeight * window.devicePixelRatio)
    for (const c of [bg, main]) {
      c.width = w
      c.height = h
      c.style.width = `${window.innerWidth}px`
      c.style.height = `${window.innerHeight}px`
    }
  }

  resize()
  window.addEventListener('resize', resize)

  return {
    bg,
    main,
    resize,
    getSize: () => ({ w, h }),
  }
}
