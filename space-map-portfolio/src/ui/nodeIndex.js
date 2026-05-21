import '../style/hud.css';

/**
 * @param {HTMLElement} root
 */
export function createNodeIndex(root) {
  const el = document.createElement('div');
  el.className = 'node-index';
  el.innerHTML = `
    <strong data-line1>NODE —</strong>
    <span data-line2>Designation: —</span>
  `;
  root.appendChild(el);

  const line1 = el.querySelector('[data-line1]');
  const line2 = el.querySelector('[data-line2]');

  return {
    el,
    show(node) {
      if (!node) {
        el.classList.remove('is-visible');
        return;
      }
      line1.textContent = `NODE ${node.label}`;
      line2.textContent = `Designation: ${node.title}`;
      el.classList.add('is-visible');
    },
    hide() {
      el.classList.remove('is-visible');
    },
  };
}
