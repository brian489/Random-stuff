import { SECTORS } from '../nodes/nodes.config.js';

function hash32(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(a) {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function createBackgroundState(seed = 'starfield-v1') {
  const rand = mulberry32(hash32(seed));
  const stars = [];
  const count = 620;
  for (let i = 0; i < count; i++) {
    stars.push({
      x: rand() * 4000,
      y: rand() * 2000,
      r: 0.35 + rand() * 1.1,
      tw: rand() * Math.PI * 2,
      sp: 0.4 + rand() * 1.2,
      layer: rand(),
    });
  }
  const nebulae = [
    { x: 0.15, y: 0.25, r: 0.45, c: 'rgba(60, 20, 120, 0.18)' },
    { x: 0.55, y: 0.65, r: 0.55, c: 'rgba(10, 60, 140, 0.14)' },
    { x: 0.82, y: 0.3, r: 0.35, c: 'rgba(40, 30, 100, 0.12)' },
  ];
  return { stars, nebulae };
}

/**
 * @param {CanvasRenderingContext2D} ctx
 * @param {ReturnType<typeof createBackgroundState>} bg
 * @param {object} opts
 */
export function drawBackground(ctx, bg, opts) {
  const {
    width,
    height,
    cameraX,
    worldWidth,
    time,
    sectors = SECTORS,
  } = opts;

  ctx.save();
  ctx.fillStyle = '#060914';
  ctx.fillRect(0, 0, width, height);

  const vw = opts.viewportWidth ?? width;
  const camNorm = worldWidth > 0 ? cameraX / worldWidth : 0;

  for (let s = 0; s < sectors.length; s++) {
    const sec = sectors[s];
    const gx0 = ((sec.x0 * worldWidth - cameraX) / vw) * width;
    const gw = ((sec.x1 - sec.x0) * worldWidth / vw) * width;
    ctx.fillStyle =
      s % 2 === 0 ? 'rgba(20, 35, 70, 0.04)' : 'rgba(15, 25, 55, 0.05)';
    ctx.fillRect(gx0, 0, gw, height);

    ctx.font = '600 10px "IBM Plex Mono", monospace';
    ctx.fillStyle = 'rgba(90, 106, 154, 0.35)';
    ctx.textAlign = 'center';
    ctx.fillText(sec.label, gx0 + gw * 0.5, 28);
  }

  for (const n of bg.nebulae) {
    const cx = n.x * width - camNorm * width * 0.08;
    const cy = n.y * height;
    const rad = n.r * Math.max(width, height) * 0.85;
    const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, rad);
    g.addColorStop(0, n.c);
    g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, width, height);
  }

  const starParallax = 0.1;
  for (const st of bg.stars) {
    const layer = st.layer;
    const px = (st.x * 0.25 - cameraX * starParallax * (0.5 + layer)) % (width + 40);
    const wrapX = ((px % (width + 40)) + (width + 40)) % (width + 40) - 20;
    const py = (st.y * 0.15 + layer * 120) % height;
    const twinkle = 0.55 + 0.45 * Math.sin(time * 0.002 * st.sp + st.tw);
    ctx.fillStyle = `rgba(220, 235, 255, ${0.15 + twinkle * 0.55})`;
    ctx.fillRect(wrapX, py, st.r, st.r);
  }

  const gridStep = 56;
  const gridOffset = -(cameraX * 0.98) % gridStep;
  ctx.strokeStyle = 'rgba(80, 120, 200, 0.07)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (let x = gridOffset; x < width + gridStep; x += gridStep) {
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
  }
  for (let y = 0; y < height + gridStep; y += gridStep) {
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
  }
  ctx.stroke();

  ctx.restore();
}
