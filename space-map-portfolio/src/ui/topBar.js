import '../style/hud.css';
import { MAP_META } from '../nodes/nodes.config.js';

/**
 * @param {HTMLElement} root
 * @param {object} callbacks
 */
export function createTopBar(root, callbacks = {}) {
  const bar = document.createElement('header');
  bar.className = 'top-bar';
  bar.innerHTML = `
    <div class="top-bar__left">
      <button type="button" class="top-bar__back" aria-label="Back">‹</button>
      <span class="top-bar__title">${MAP_META.title}</span>
      <span class="top-bar__info" title="Portfolio map">ℹ</span>
    </div>
    <div class="top-bar__center" data-sector>SECTOR 0-1 · DEEP FIELD</div>
    <div class="top-bar__right">
      <span data-nodes>◈ 0 / ${MAP_META.totalNodes}</span>
      <button type="button" class="top-bar__gear" aria-label="Settings">⚙</button>
    </div>
  `;
  root.appendChild(bar);

  const sectorEl = bar.querySelector('[data-sector]');
  const nodesEl = bar.querySelector('[data-nodes]');

  bar.querySelector('.top-bar__back').addEventListener('click', () => {
    callbacks.onBack?.();
  });

  return {
    setSector(label) {
      sectorEl.textContent = label;
    },
    setNodeCount(visited, total) {
      nodesEl.textContent = `◈ ${visited} / ${total}`;
    },
  };
}
