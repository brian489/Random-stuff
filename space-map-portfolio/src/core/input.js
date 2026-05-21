import { focusEase } from './easing.js';

/**
 * @param {object} state
 * @param {HTMLCanvasElement} canvas
 */
export function setupInput(state, canvas) {
  const onWheel = (e) => {
    e.preventDefault();
    const dir = e.deltaY > 0 ? 1 : -1;
    state.cameraVelocity += dir * state.scrollAccel;
  };

  const onKeyDown = (e) => {
    if (e.key === 'ArrowLeft') state.keys.left = true;
    if (e.key === 'ArrowRight') state.keys.right = true;
    if (e.key === 'Escape' && state.focusedId) {
      state.closeFocus?.();
    }
  };

  const onKeyUp = (e) => {
    if (e.key === 'ArrowLeft') state.keys.left = false;
    if (e.key === 'ArrowRight') state.keys.right = false;
  };

  canvas.addEventListener('wheel', onWheel, { passive: false });
  window.addEventListener('keydown', onKeyDown);
  window.addEventListener('keyup', onKeyUp);

  return () => {
    canvas.removeEventListener('wheel', onWheel);
    window.removeEventListener('keydown', onKeyDown);
    window.removeEventListener('keyup', onKeyUp);
  };
}

export function updateCamera(state, dt) {
  const { keys, scrollAccel, friction, maxSpeed } = state;

  if (state.focusLerp) {
    const fl = state.focusLerp;
    fl.elapsed += dt;
    const t = Math.min(1, fl.elapsed / fl.duration);
    const eased = focusEase(t);
    state.cameraX = fl.from + (fl.to - fl.from) * eased;
    if (t >= 1) {
      state.focusLerp = null;
      state.cameraX = fl.to;
    }
    return;
  }

  if (keys.left) state.cameraVelocity -= scrollAccel * 0.35;
  if (keys.right) state.cameraVelocity += scrollAccel * 0.35;

  state.cameraVelocity *= friction;
  if (Math.abs(state.cameraVelocity) < 0.02) state.cameraVelocity = 0;
  state.cameraVelocity = Math.max(-maxSpeed, Math.min(maxSpeed, state.cameraVelocity));

  state.cameraX += state.cameraVelocity * dt * 60;

  const maxCam = Math.max(0, state.worldWidth - state.viewportWidth);
  state.cameraX = Math.max(0, Math.min(maxCam, state.cameraX));
}
