import '../style/hud.css';

/**
 * @param {HTMLElement} root
 * @param {object} stateRef - mutable reference to state
 */
export function createMiniMap(root, stateRef) {
  const wrap = document.createElement('div');
  wrap.className = 'mini-map';
  const canvas = document.createElement('canvas');
  wrap.appendChild(canvas);
  root.appendChild(wrap);

  const ctx = canvas.getContext('2d');
  let dragging = false;

  function resize() {
    const r = wrap.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(r.width * dpr);
    canvas.height = Math.floor(r.height * dpr);
    canvas.style.width = `${r.width}px`;
    canvas.style.height = `${r.height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  resize();
  window.addEventListener('resize', resize);

  function draw() {
    const state = stateRef.current;
    if (!state || !ctx) return;
    const w = wrap.clientWidth;
    const h = wrap.clientHeight;
    ctx.save();
    ctx.fillStyle = 'rgba(4, 8, 22, 0.95)';
    ctx.fillRect(0, 0, w, h);

    const ww = state.worldWidth || 1;
    const vw = state.viewportWidth || w;

    for (const node of state.nodes) {
      const nx = (node.x * ww) / ww * w;
      const ny = node.y * h;
      let col = '#ffffff';
      if (node.status === 'wip') col = '#5b8cff';
      if (node.status === 'locked') col = '#2a3560';
      ctx.fillStyle = col;
      ctx.beginPath();
      ctx.arc(nx, ny, 2.2, 0, Math.PI * 2);
      ctx.fill();
    }

    const vx = (state.cameraX / ww) * w;
    const vwid = (vw / ww) * w;
    ctx.strokeStyle = 'rgba(120, 180, 255, 0.85)';
    ctx.lineWidth = 1;
    ctx.strokeRect(vx, 2, Math.max(8, vwid), h - 4);

    ctx.restore();
  }

  function screenToCamera(clientX) {
    const state = stateRef.current;
    const rect = wrap.getBoundingClientRect();
    const mx = clientX - rect.left;
    const ww = state.worldWidth;
    const vw = state.viewportWidth;
    const frac = mx / rect.width;
    const target = frac * ww - vw * 0.5;
    return Math.max(0, Math.min(Math.max(0, ww - vw), target));
  }

  wrap.addEventListener('mousedown', (e) => {
    dragging = true;
    stateRef.current.cameraX = screenToCamera(e.clientX);
    stateRef.current.cameraVelocity = 0;
  });
  window.addEventListener('mousemove', (e) => {
    if (!dragging) return;
    stateRef.current.cameraX = screenToCamera(e.clientX);
  });
  window.addEventListener('mouseup', () => {
    dragging = false;
  });

  wrap.addEventListener('click', (e) => {
    const state = stateRef.current;
    const rect = wrap.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    const w = rect.width;
    const h = rect.height;
    const ww = state.worldWidth;
    for (const node of state.nodes) {
      const nx = (node.x * ww) / ww * w;
      const ny = node.y * h;
      if (Math.hypot(mx - nx, my - ny) < 6) {
        state.onPickNode?.(node);
        break;
      }
    }
  });

  return {
    draw,
    resize,
  };
}
