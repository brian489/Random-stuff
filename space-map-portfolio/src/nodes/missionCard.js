import { hash32 } from './hash.js';

/**
 * Screen-space bounds for the mission card (for hit-testing).
 * Must stay in sync with `drawMissionCard` layout.
 */
export function getMissionCardBounds(node, x, y, scale = 1) {
  const h = hash32(node.id);
  const side = h % 2 === 0 ? 'left' : 'right';
  const w = 110 * scale;
  const hgt = 44 * scale;
  const left = side === 'left' ? x - w - 18 * scale : x + 18 * scale;
  const top = y + 14 * scale;
  return { left, top, width: w, height: hgt };
}

/**
 * @param {CanvasRenderingContext2D} ctx
 * @param {object} node
 * @param {object} opts
 */
export function drawMissionCard(ctx, node, opts) {
  const {
    x,
    y,
    side,
    hover,
    time,
    scale = 1,
  } = opts;

  const w = 110 * scale;
  const h = 44 * scale;
  const pad = 8 * scale;
  const cornerRadius = 4 * scale;

  const left = side === 'left' ? x - w - 18 * scale : x + 18 * scale;
  const top = y + 14 * scale;

  ctx.save();
  ctx.lineWidth = 1;

  const cx = side === 'left' ? left + w : left;
  const cy = top + h * 0.35;
  ctx.strokeStyle = hover
    ? 'rgba(78, 127, 255, 0.95)'
    : 'rgba(80, 130, 255, 0.45)';
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(cx, cy);
  ctx.stroke();

  ctx.fillStyle = 'rgba(8, 14, 40, 0.88)';
  ctx.strokeStyle = hover
    ? 'rgba(78, 127, 255, 0.75)'
    : 'rgba(80, 130, 255, 0.4)';

  roundRect(ctx, left, top, w, h, cornerRadius);
  ctx.fill();
  ctx.stroke();

  const fsTag = `${Math.round(9 * scale)}px "IBM Plex Mono", monospace`;
  const fsMain = `${Math.round(10 * scale)}px "IBM Plex Mono", monospace`;
  const fsLabel = `${Math.round(11 * scale)}px "IBM Plex Mono", monospace`;

  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';

  const tag = node.status === 'wip' ? 'WIP' : node.status === 'locked' ? 'LOCKED' : '';
  if (tag) {
    ctx.font = fsTag;
    ctx.fillStyle = 'rgba(78, 127, 255, 0.9)';
    ctx.fillText(`◈  ${tag}`, left + pad, top + pad * 0.6);
    ctx.font = fsLabel;
    ctx.fillStyle = hover ? '#e8eeff' : 'rgba(200, 210, 255, 0.85)';
    ctx.fillText(node.label, left + pad, top + pad * 2.1);
  } else {
    ctx.font = fsMain;
    ctx.fillStyle = hover ? '#e8eeff' : 'rgba(200, 210, 255, 0.85)';
    ctx.fillText(`◈  ${node.title.slice(0, 14)}`, left + pad, top + pad * 0.65);
    ctx.fillStyle = 'rgba(154, 170, 210, 0.9)';
    ctx.font = fsLabel;
    ctx.fillText(node.label, left + pad, top + pad * 2.05);
  }

  if (node.status === 'locked') {
    ctx.fillStyle = 'rgba(180, 190, 220, 0.75)';
    ctx.font = `${11 * scale}px sans-serif`;
    ctx.fillText('🔒', left + w - pad - 14 * scale, top + h - pad - 12 * scale);
  }

  ctx.restore();
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}
