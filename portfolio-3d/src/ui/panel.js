import { NODES } from '../nodes/nodes.config.js'

/** @type {Map<number, HTMLElement>} */
const panels = new Map()

export function init() {
  const root = document.getElementById('ui-root')
  if (!root) return

  for (const node of NODES) {
    const el = document.createElement('div')
    el.className = 'panel'
    el.dataset.nodeT = String(node.t)
    el.innerHTML = `
      <span class="panel__tag">${escapeHtml(node.tag)}</span>
      <h2 class="panel__title">${escapeHtml(node.title)}</h2>
      <p class="panel__desc">${escapeHtml(node.description)}</p>
      <a class="panel__link" href="${escapeAttr(node.link)}">View →</a>
    `
    root.appendChild(el)
    panels.set(node.t, el)
  }
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function escapeAttr(s) {
  return String(s).replace(/"/g, '&quot;')
}

export function show(node) {
  const el = panels.get(node.t)
  if (el) el.classList.add('panel--visible')
}

export function hide(nodeT) {
  const el = panels.get(nodeT)
  if (el) el.classList.remove('panel--visible')
}
