export function init() {
  const bar = document.createElement('div')
  bar.className = 'progress-bar'
  const fill = document.createElement('div')
  fill.className = 'progress-bar__fill'
  bar.appendChild(fill)
  document.body.appendChild(bar)

  function onProgress(e) {
    const t = e.detail?.t ?? 0
    fill.style.width = `${t * 100}%`
  }

  window.addEventListener('progressUpdate', onProgress)
  onProgress({ detail: { t: 0 } })
}
