import { drawInstallationThumb } from '../installations/installationRenderer.js'

/**
 * @typedef {import('../installations/installations.config.js').INSTALLATIONS[number]} Inst
 */

let panel = /** @type {HTMLElement | null} */ (null)
let thumbCanvas = /** @type {HTMLCanvasElement | null} */ (null)

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

export function initDetailPanel() {
  const root = document.getElementById('ui-root')
  if (!root) return

  panel = document.createElement('aside')
  panel.className = 'detail-panel'
  panel.innerHTML = `
    <button type="button" class="detail-panel__close" aria-label="Close">×</button>
    <div class="detail-panel__row">
      <div class="detail-panel__thumb"><canvas width="320" height="240"></canvas></div>
      <div class="detail-panel__body">
        <p class="detail-panel__type" data-f="type"></p>
        <h2 class="detail-panel__title" data-f="title"></h2>
        <p class="detail-panel__subtitle" data-f="sub"></p>
        <span class="detail-panel__status" data-f="status"></span>
        <p class="detail-panel__desc" data-f="desc"></p>
        <div class="detail-panel__stack" data-f="stack"></div>
        <a class="detail-panel__link" data-f="link" href="#" target="_blank" rel="noopener">Visit project →</a>
      </div>
    </div>
  `
  root.appendChild(panel)
  thumbCanvas = /** @type {HTMLCanvasElement} */ (panel.querySelector('canvas'))

  panel.querySelector('.detail-panel__close')?.addEventListener('click', () => {
    closeDetailPanel()
    window.dispatchEvent(new CustomEvent('gallery:closePanel'))
  })
}

/**
 * @param {Inst} inst
 * @param {number} time
 * @param {boolean} nightMode
 */
export function openDetailPanel(inst, time, nightMode) {
  if (!panel || !thumbCanvas) return
  panel.classList.add('is-open')

  const typeLabel =
    inst.type === 'screenWork'
      ? 'Screen work'
      : inst.type === 'neonSign'
        ? 'Neon'
        : inst.type.charAt(0).toUpperCase() + inst.type.slice(1)

  setText('[data-f="type"]', typeLabel)
  setText('[data-f="title"]', inst.title)
  setText('[data-f="sub"]', inst.subtitle || '')
  setHtml('[data-f="desc"]', escapeHtml(inst.description || ''))

  const st = inst.status || 'complete'
  const el = panel.querySelector('[data-f="status"]')
  if (el) {
    el.className = `detail-panel__status detail-panel__status--${st}`
    el.textContent = st === 'complete' ? 'Complete' : st === 'wip' ? 'In progress' : 'Concept'
  }

  const stack = panel.querySelector('[data-f="stack"]')
  if (stack) {
    stack.innerHTML = (inst.stack || []).map((t) => `<span class="detail-panel__pill">${escapeHtml(t)}</span>`).join('')
  }

  const link = /** @type {HTMLAnchorElement | null} */ (panel.querySelector('[data-f="link"]'))
  if (link) link.href = inst.link || '#'

  const tctx = thumbCanvas.getContext('2d')
  if (tctx) {
    const r = window.devicePixelRatio || 1
    thumbCanvas.width = 160 * r
    thumbCanvas.height = 120 * r
    thumbCanvas.style.width = '160px'
    thumbCanvas.style.height = '120px'
    tctx.setTransform(1, 0, 0, 1, 0, 0)
    tctx.scale(r, r)
    tctx.fillStyle = '#0f0e0c'
    tctx.fillRect(0, 0, 160, 120)
    drawInstallationThumb(tctx, 160, 120, inst, time, nightMode)
  }
}

function setText(sel, text) {
  const n = panel?.querySelector(sel)
  if (n) n.textContent = text
}

function setHtml(sel, html) {
  const n = panel?.querySelector(sel)
  if (n) n.innerHTML = html
}

export function closeDetailPanel() {
  panel?.classList.remove('is-open')
}

export function isPanelOpen() {
  return panel?.classList.contains('is-open') ?? false
}
