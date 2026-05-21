import './style/main.css';
import { setupCanvas } from './core/canvas.js';
import { createLoop } from './core/renderer.js';
import { setupInput, updateCamera } from './core/input.js';
import {
  computeWorldWidth,
  nodeWorldPos,
  screenX,
} from './world/starMap.js';
import { createBackgroundState, drawBackground } from './world/background.js';
import { drawConnections } from './world/connections.js';
import { NODES, ROUTES, MAP_META, SECTORS } from './nodes/nodes.config.js';
import { drawStarNode } from './nodes/starNode.js';
import { pickNode } from './interactions/hover.js';
import { focusNode, closeFocus } from './interactions/focus.js';
import { createDetailPanel } from './ui/detailPanel.js';
import { createTopBar } from './ui/topBar.js';
import { createNodeIndex } from './ui/nodeIndex.js';
import { createMiniMap } from './ui/miniMap.js';

function getSectorLabel(nx) {
  for (let i = 0; i < SECTORS.length; i++) {
    const s = SECTORS[i];
    const last = i === SECTORS.length - 1;
    if (nx >= s.x0 && (last ? nx <= s.x1 : nx < s.x1)) {
      return `${s.label} · DEEP FIELD`;
    }
  }
  return 'DEEP FIELD';
}

function discoveryProgress(startTime, now, index, staggerMs = 150) {
  const t0 = startTime + index * staggerMs;
  const dur = 420;
  const u = (now - t0) / dur;
  if (u <= 0) return 0;
  if (u >= 1) return 1;
  return u * u * (3 - 2 * u);
}

function drawCategoryRings(ctx, state) {
  const map = new Map();
  for (const n of state.nodes) {
    const c = n.category || 'other';
    if (!map.has(c)) map.set(c, []);
    map.get(c).push(n);
  }
  ctx.save();
  for (const list of map.values()) {
    if (list.length < 2) continue;
    let sx = 0;
    let sy = 0;
    for (const n of list) {
      const w = nodeWorldPos(n, state.worldWidth, state.viewportHeight);
      sx += screenX(w.x, state.cameraX, n.depth);
      sy += w.y;
    }
    sx /= list.length;
    sy /= list.length;
    const rad = 52 + list.length * 8;
    ctx.strokeStyle = 'rgba(100, 160, 255, 0.14)';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 8]);
    ctx.beginPath();
    ctx.arc(sx, sy, rad, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.setLineDash([]);
  ctx.restore();
}

const canvas = /** @type {HTMLCanvasElement} */ (
  document.getElementById('world-canvas')
);
const sceneTilt = document.getElementById('scene-tilt');
const hudRoot = document.getElementById('hud-root');
const panelRoot = document.getElementById('panel-root');

const panel = createDetailPanel(panelRoot);

const nodeIndex = createNodeIndex(hudRoot);

const state = {
  canvas,
  nodes: NODES,
  routes: ROUTES,
  idToNode: new Map(NODES.map((n) => [n.id, n])),
  idToWorld: new Map(),
  routeParticles: new Map(),
  cameraX: 0,
  cameraVelocity: 0,
  cameraBeforeFocus: 0,
  scrollAccel: 2.4,
  friction: 0.92,
  maxSpeed: 28,
  keys: { left: false, right: false },
  worldWidth: 0,
  viewportWidth: 0,
  viewportHeight: 0,
  hoveredId: null,
  focusedId: null,
  dimOthers: false,
  focusLerp: null,
  routeDashPhase: 0,
  startTime: performance.now(),
  bg: createBackgroundState(),
};

const topBar = createTopBar(hudRoot, {
  onBack: () => closeFocus(state),
});

const stateRef = { current: state };

const miniMap = createMiniMap(hudRoot, stateRef);

panel.onBack(() => closeFocus(state));

state.openDetail = (node) => panel.open(node);
state.closeDetail = () => panel.close();
state.closeFocus = () => closeFocus(state);

state.onPickNode = (node) => {
  focusNode(state, node);
};

function rebuildWorldMetrics(width, height) {
  state.viewportWidth = width;
  state.viewportHeight = height;
  state.worldWidth = computeWorldWidth(width);
  state.idToWorld.clear();
  for (const n of state.nodes) {
    state.idToWorld.set(n.id, nodeWorldPos(n, state.worldWidth, height));
  }
  const maxCam = Math.max(0, state.worldWidth - width);
  state.cameraX = Math.min(state.cameraX, maxCam);
}

const view = setupCanvas(canvas, (w, h) => {
  rebuildWorldMetrics(w, h);
});

rebuildWorldMetrics(view.width, view.height);

stateRef.current = state;

function updateSectorHud(node) {
  if (node) {
    topBar.setSector(`SECTOR ${node.label} · ${getSectorLabel(node.x)}`);
  } else {
    topBar.setSector('SECTOR SCAN · DEEP FIELD');
  }
}

let visited = 0;
const visitedSet = new Set();

function markVisited(id) {
  if (!visitedSet.has(id)) {
    visitedSet.add(id);
    visited += 1;
    topBar.setNodeCount(visited, MAP_META.totalNodes);
  }
}

topBar.setNodeCount(0, MAP_META.totalNodes);

canvas.style.cursor = 'crosshair';

canvas.addEventListener('mousemove', (e) => {
  const hit = pickNode(state, e.clientX, e.clientY);
  canvas.style.cursor = hit ? 'pointer' : 'crosshair';
  state.hoveredId = hit?.id ?? null;
  if (hit) {
    nodeIndex.show(hit);
    updateSectorHud(hit);
  } else if (state.focusedId) {
    const f = state.idToNode.get(state.focusedId);
    if (f) {
      nodeIndex.show(f);
      updateSectorHud(f);
    }
  } else {
    nodeIndex.hide();
    updateSectorHud(null);
  }
});

canvas.addEventListener('mousedown', (e) => {
  const hit = pickNode(state, e.clientX, e.clientY);
  if (hit) {
    markVisited(hit.id);
    focusNode(state, hit);
    updateSectorHud(hit);
    nodeIndex.show(hit);
  } else {
    if (state.focusedId) closeFocus(state);
  }
});

setupInput(state, canvas);

if (sceneTilt) {
  sceneTilt.classList.add('is-warping');
  window.setTimeout(() => sceneTilt.classList.remove('is-warping'), 1200);
}

const ctx = view.ctx;

createLoop((dt, time) => {
  updateCamera(state, dt);

  const w = view.width;
  const h = view.height;

  drawBackground(ctx, state.bg, {
    width: w,
    height: h,
    cameraX: state.cameraX,
    worldWidth: state.worldWidth,
    viewportWidth: state.viewportWidth,
    time,
  });

  drawCategoryRings(ctx, state);

  drawConnections(state, ctx);

  const sorted = [...state.nodes].sort((a, b) => a.depth - b.depth);

  for (const node of sorted) {
    const wp = nodeWorldPos(node, state.worldWidth, h);
    const sx = screenX(wp.x, state.cameraX, node.depth);
    const sy = wp.y;

    const margin = 200;
    if (sx < -margin || sx > w + margin) continue;

    const disc = discoveryProgress(state.startTime, time, state.nodes.indexOf(node));
    const dim =
      state.dimOthers && state.focusedId && state.focusedId !== node.id
        ? 0.4
        : 1;

    drawStarNode(ctx, node, {
      x: sx,
      y: sy,
      time,
      hover: state.hoveredId === node.id,
      focus: state.focusedId === node.id,
      discovery: disc,
      dim,
    });
  }

  miniMap.draw();
}).start();
