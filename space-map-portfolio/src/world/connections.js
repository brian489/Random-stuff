import { nodeWorldPos, screenX } from './starMap.js';

/**
 * @param {string} id
 * @param {Map<string, object>} idToNode
 */
function getNode(id, idToNode) {
  return idToNode.get(id);
}

/**
 * @param {object} state
 * @param {CanvasRenderingContext2D} ctx
 */
export function drawConnections(state, ctx) {
  const {
    routes,
    idToNode,
    worldWidth,
    viewportHeight,
    cameraX,
    dt,
    hoveredId,
    focusedId,
  } = state;

  if (!routes?.length) return;

  state.routeDashPhase = (state.routeDashPhase || 0) + dt * 42;
  const dashPhase = state.routeDashPhase;

  ctx.save();
  ctx.lineWidth = 1;

  for (const pair of routes) {
    const [aId, bId] = pair;
    const a = getNode(aId, idToNode);
    const b = getNode(bId, idToNode);
    if (!a || !b) continue;

    const wa = nodeWorldPos(a, worldWidth, viewportHeight);
    const wb = nodeWorldPos(b, worldWidth, viewportHeight);
    const ax = screenX(wa.x, cameraX, a.depth);
    const ay = wa.y;
    const bx = screenX(wb.x, cameraX, b.depth);
    const by = wb.y;

    const lockedEnd = b.status === 'locked';
    let tEnd = 1;
    if (lockedEnd) tEnd = 0.6;

    const mx = ax + (bx - ax) * tEnd;
    const my = ay + (by - ay) * tEnd;

    const bright =
      hoveredId === aId ||
      hoveredId === bId ||
      focusedId === aId ||
      focusedId === bId;

    ctx.strokeStyle = bright
      ? 'rgba(130, 180, 255, 0.45)'
      : 'rgba(100, 160, 255, 0.25)';
    ctx.setLineDash([6, 10]);
    ctx.lineDashOffset = -dashPhase % 20;

    ctx.beginPath();
    ctx.moveTo(ax, ay);
    ctx.lineTo(mx, my);
    ctx.stroke();

    ctx.setLineDash([]);
    ctx.lineDashOffset = 0;

    if (lockedEnd) {
      ctx.fillStyle = 'rgba(200, 120, 140, 0.85)';
      ctx.font = '11px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('✕', mx, my);
    }

    drawRouteParticles(ctx, state, aId, bId, ax, ay, mx, my, dt);
  }

  ctx.restore();
}

/**
 * Ambient particles along route segments.
 */
function drawRouteParticles(ctx, state, aId, bId, x0, y0, x1, y1, dt) {
  const key = `${aId}-${bId}`;
  let pack = state.routeParticles.get(key);
  if (!pack) {
    pack = { phase: Math.random() * 6.28 };
    state.routeParticles.set(key, pack);
  }
  pack.phase += dt * (0.35 + (hashPair(aId, bId) % 200) / 400);

  const dx = x1 - x0;
  const dy = y1 - y0;
  const len = Math.hypot(dx, dy) || 1;
  const ux = dx / len;
  const uy = dy / len;

  const u = (Math.sin(pack.phase * 1.7) * 0.5 + 0.5) * 0.92;
  const px = x0 + ux * len * u;
  const py = y0 + uy * len * u;

  ctx.fillStyle = 'rgba(140, 190, 255, 0.55)';
  ctx.fillRect(px - 1, py - 1, 2, 2);
}

function hashPair(a, b) {
  let h = 0;
  const s = a + b;
  for (let i = 0; i < s.length; i++) h = (h + s.charCodeAt(i) * (i + 1)) % 997;
  return h;
}
