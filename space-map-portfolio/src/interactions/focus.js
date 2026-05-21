import { cameraForFocus } from '../world/starMap.js';

/** @param {object} state */
export function focusNode(state, node) {
  if (!node) return;
  state.cameraBeforeFocus = state.cameraX;
  state.focusedId = node.id;
  state.dimOthers = true;

  const w = state.idToWorld.get(node.id);
  if (!w) return;

  const targetCam = cameraForFocus(
    w.x,
    state.viewportWidth,
    node.depth,
    0.35,
  );
  const maxCam = Math.max(0, state.worldWidth - state.viewportWidth);
  const to = Math.max(0, Math.min(maxCam, targetCam));

  state.focusLerp = {
    from: state.cameraX,
    to,
    elapsed: 0,
    duration: 0.5,
  };
  state.cameraVelocity = 0;

  state.openDetail?.(node);
}

/** @param {object} state */
export function closeFocus(state) {
  state.focusedId = null;
  state.dimOthers = false;
  state.closeDetail?.();

  const maxCam = Math.max(0, state.worldWidth - state.viewportWidth);
  const target = Math.max(0, Math.min(maxCam, state.cameraBeforeFocus ?? 0));

  state.focusLerp = {
    from: state.cameraX,
    to: target,
    elapsed: 0,
    duration: 0.45,
  };
}
