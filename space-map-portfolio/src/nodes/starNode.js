import { drawMissionCard } from './missionCard.js';
import { hash32 } from './hash.js';

/** Larger on-canvas star glyphs; hit area uses related constants in hover.js */
export const STAR_VISUAL_SCALE = 1.55;
export const CARD_UI_SCALE = 1.2;

/**
 * @param {CanvasRenderingContext2D} ctx
 * @param {object} node
 * @param {object} opts
 */
export function drawStarNode(ctx, node, opts) {
  const {
    x,
    y,
    time,
    hover,
    focus,
    discovery = 1,
    dim = 1,
  } = opts;

  const h = hash32(node.id);
  const baseScale =
    (0.85 + (h % 100) / 400) * (hover ? 1.3 : 1) * STAR_VISUAL_SCALE;
  const scale = baseScale * (0.4 + 0.6 * discovery);
  const status = node.status;

  const alpha =
    status === 'locked'
      ? 0.45
      : status === 'wip'
        ? 0.78
        : 1;
  const flicker =
    status === 'wip' ? 0.08 * Math.sin(time * 0.008 + h * 0.01) : 0;

  ctx.save();
  ctx.globalAlpha = Math.min(1, alpha * dim + flicker);
  ctx.translate(x, y);
  ctx.scale(scale, scale);

  const glowLayers = status === 'locked' ? 1 : status === 'wip' ? 2 : 3;
  const coreColor =
    status === 'locked'
      ? '#2a3560'
      : status === 'wip'
        ? '#5b8cff'
        : '#ffffff';

  for (let g = glowLayers; g >= 1; g--) {
    const r = 8 + g * 10 + (hover ? 6 : 0);
    const grd = ctx.createRadialGradient(0, 0, 0, 0, 0, r);
    grd.addColorStop(0, hexToRgba(node.previewColor || coreColor, 0.08 + g * 0.05));
    grd.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grd;
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.fill();
  }

  const rot = time * (status === 'locked' ? 0 : status === 'wip' ? 0.0004 : 0.0008);

  switch (node.type) {
    case 'pulsar':
      drawPulsar(ctx, coreColor, rot, status, hover);
      break;
    case 'binary':
      drawBinary(ctx, coreColor, time, status, hover);
      break;
    case 'nebula':
      drawNebula(ctx, node.previewColor, time, status);
      break;
    case 'blackhole':
      drawBlackhole(ctx, time, hover);
      break;
    case 'station':
      drawStation(ctx, coreColor, time, status);
      break;
    default:
      drawPulsar(ctx, coreColor, rot, status, hover);
  }

  if (focus) {
    drawReticle(ctx, time);
    drawOrbitRing(ctx, time);
  }

  ctx.restore();

  const cardSide = (h % 2 === 0) ? 'left' : 'right';
  drawMissionCard(ctx, node, {
    x,
    y,
    side: cardSide,
    hover,
    time,
    scale: CARD_UI_SCALE,
  });
}

function hexToRgba(hex, a) {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!m) return `rgba(255,255,255,${a})`;
  return `rgba(${parseInt(m[1], 16)},${parseInt(m[2], 16)},${parseInt(m[3], 16)},${a})`;
}

function drawPulsar(ctx, color, rot, status, hover) {
  ctx.save();
  ctx.rotate(rot);
  const spike = 18 + (hover ? 14 : 0);
  ctx.strokeStyle = color;
  ctx.lineWidth = status === 'locked' ? 1 : 1.5;
  for (let i = 0; i < 4; i++) {
    ctx.rotate(Math.PI / 2);
    ctx.beginPath();
    ctx.moveTo(0, -4);
    ctx.lineTo(0, -spike);
    ctx.stroke();
  }
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(0, 0, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawBinary(ctx, color, time, status, hover) {
  const r = 5 + (hover ? 2 : 0);
  const d = 10 + Math.sin(time * 0.002) * 2;
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(-d * 0.5, 0, r, 0, Math.PI * 2);
  ctx.arc(d * 0.5, 0, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = hexToRgba(color, 0.35);
  ctx.beginPath();
  ctx.arc(0, 0, d + r + 4, 0, Math.PI * 2);
  ctx.stroke();
}

function drawNebula(ctx, tint, time, status) {
  const blobs = 4;
  for (let i = 0; i < blobs; i++) {
    const ang = (i / blobs) * Math.PI * 2 + time * 0.0003;
    const ox = Math.cos(ang) * 10;
    const oy = Math.sin(ang) * 8;
    const rad = 16 + i * 6;
    const g = ctx.createRadialGradient(ox, oy, 0, ox, oy, rad);
    g.addColorStop(0, hexToRgba(tint || '#5b8cff', status === 'locked' ? 0.12 : 0.28));
    g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(ox, oy, rad, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawBlackhole(ctx, time, hover) {
  const ring = 22 + (hover ? 4 : 0);
  const g = ctx.createRadialGradient(0, 0, 4, 0, 0, ring);
  g.addColorStop(0, 'rgba(5,8,20,0.95)');
  g.addColorStop(0.55, 'rgba(40,90,200,0.35)');
  g.addColorStop(0.85, 'rgba(120,180,255,0.25)');
  g.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(0, 0, ring, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = `rgba(180,210,255,${0.15 + Math.sin(time * 0.003) * 0.05})`;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(0, 0, ring * 0.55, 0, Math.PI * 2);
  ctx.stroke();
}

function drawStation(ctx, color, time, status) {
  const sides = 8;
  const r = 14;
  ctx.beginPath();
  for (let i = 0; i <= sides; i++) {
    const a = (i / sides) * Math.PI * 2 - Math.PI / 8;
    const x = Math.cos(a) * r;
    const y = Math.sin(a) * r;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.strokeStyle = color;
  ctx.lineWidth = status === 'locked' ? 1 : 1.5;
  ctx.stroke();
  const blink = Math.sin(time * 0.01) > 0 ? 1 : 0.3;
  ctx.fillStyle = `rgba(255,200,120,${0.4 * blink})`;
  ctx.fillRect(-3, -r - 2, 2, 2);
  ctx.fillStyle = `rgba(120,200,255,${0.5 * blink})`;
  ctx.fillRect(r - 2, 2, 2, 2);
}

function drawReticle(ctx, time) {
  const s = 28 + Math.sin(time * 0.004) * 2;
  const L = 9;
  ctx.strokeStyle = 'rgba(120, 200, 255, 0.85)';
  ctx.lineWidth = 1.5;
  const corners = [
    [-s, -s],
    [s, -s],
    [s, s],
    [-s, s],
  ];
  for (const [cx, cy] of corners) {
    const sx = Math.sign(cx);
    const sy = Math.sign(cy);
    ctx.beginPath();
    ctx.moveTo(cx, cy - sy * L);
    ctx.lineTo(cx, cy);
    ctx.lineTo(cx - sx * L, cy);
    ctx.stroke();
  }
}

function drawOrbitRing(ctx, time) {
  const r = 40;
  ctx.strokeStyle = 'rgba(100, 160, 255, 0.25)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(0, 0, r, 0, Math.PI * 2);
  ctx.stroke();
  const a = time * 0.0012;
  const ox = Math.cos(a) * r;
  const oy = Math.sin(a) * r;
  ctx.fillStyle = 'rgba(180, 220, 255, 0.9)';
  ctx.beginPath();
  ctx.arc(ox, oy, 2.5, 0, Math.PI * 2);
  ctx.fill();
}
