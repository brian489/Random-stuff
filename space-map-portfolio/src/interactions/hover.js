import { nodeWorldPos, screenX } from '../world/starMap.js';
import { getMissionCardBounds } from '../nodes/missionCard.js';
import { CARD_UI_SCALE } from '../nodes/starNode.js';

/** Circle around star center (covers glow + spikes at max scale). */
const STAR_HIT_RADIUS = 88;

/**
 * @param {object} state
 * @param {number} clientX
 * @param {number} clientY
 */
export function pickNode(state, clientX, clientY) {
  const rect = state.canvas.getBoundingClientRect();
  const mx = clientX - rect.left;
  const my = clientY - rect.top;

  let best = null;
  let bestScore = Infinity;

  for (const node of state.nodes) {
    const w = nodeWorldPos(node, state.worldWidth, state.viewportHeight);
    const sx = screenX(w.x, state.cameraX, node.depth);
    const sy = w.y;

    const dStar = Math.hypot(mx - sx, my - sy);
    const onStar = dStar < STAR_HIT_RADIUS;

    const card = getMissionCardBounds(node, sx, sy, CARD_UI_SCALE);
    const onCard =
      mx >= card.left &&
      mx <= card.left + card.width &&
      my >= card.top &&
      my <= card.top + card.height;

    if (!onStar && !onCard) continue;

    const score = onStar
      ? dStar
      : Math.hypot(
          mx - (card.left + card.width * 0.5),
          my - (card.top + card.height * 0.5),
        );

    if (score < bestScore) {
      best = node;
      bestScore = score;
    }
  }

  return best;
}
