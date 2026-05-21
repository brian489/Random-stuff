/**
 * @param {(dt: number, time: number) => void} tick
 */
export function createLoop(tick) {
  let raf = 0;
  let last = performance.now();

  const frame = (time) => {
    const dt = Math.min((time - last) / 1000, 0.05);
    last = time;
    tick(dt, time);
    raf = requestAnimationFrame(frame);
  };

  return {
    start() {
      last = performance.now();
      raf = requestAnimationFrame(frame);
    },
    stop() {
      cancelAnimationFrame(raf);
    },
  };
}
