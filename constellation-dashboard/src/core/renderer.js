/**
 * Global animation loop with delta time (seconds) and monotonic time (ms).
 * @param {{ update: (dt: number, now: number) => void, draw: () => void }} hooks
 */
export function startLoop(hooks) {
  let last = performance.now()

  function frame(now) {
    const dt = Math.min(0.064, (now - last) / 1000)
    last = now
    hooks.update(dt, now)
    hooks.draw()
    requestAnimationFrame(frame)
  }

  requestAnimationFrame(frame)
}
