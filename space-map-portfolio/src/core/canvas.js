/**
 * @param {HTMLCanvasElement} canvas
 * @param {(width: number, height: number) => void} onResize
 */
export function setupCanvas(canvas, onResize) {
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('2D context unavailable');

  let width = 0;
  let height = 0;
  let dpr = 1;

  function resize() {
    const parent = canvas.parentElement;
    const w = parent ? parent.clientWidth : window.innerWidth;
    const h = parent ? parent.clientHeight : window.innerHeight;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = w;
    height = h;
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    onResize(w, h);
  }

  resize();
  window.addEventListener('resize', resize);

  return {
    get ctx() {
      return ctx;
    },
    get width() {
      return width;
    },
    get height() {
      return height;
    },
    get dpr() {
      return dpr;
    },
    resize,
  };
}
