export function init() {
  const el = document.createElement('div')
  el.className = 'final-overlay'
  el.innerHTML = `
    <div class="final-overlay__inner">
      <p class="final-overlay__name">Your Name</p>
      <p class="final-overlay__title">Designer · Developer</p>
      <a class="final-overlay__contact" href="mailto:hello@example.com">hello@example.com</a>
    </div>
  `
  document.body.appendChild(el)

  function onProgress(e) {
    const t = e.detail?.t ?? 0
    if (t > 0.88) {
      el.classList.add('final-overlay--visible')
    } else {
      el.classList.remove('final-overlay--visible')
    }
  }

  window.addEventListener('progressUpdate', onProgress)
  onProgress({ detail: { t: 0 } })
}
