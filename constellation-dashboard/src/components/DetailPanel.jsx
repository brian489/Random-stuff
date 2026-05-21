import { useEffect, useRef } from 'react'
import { drawConstellationThumb } from './previewThumb.js'

/** @typedef {import('../constellation/stars.config.js').CONSTELLATION['stars'][number]} Star */

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

/**
 * @param {{ star: Star | null, open: boolean, onClose: () => void, timeSec: number }} props
 */
export default function DetailPanel({ star, open, onClose, timeSec }) {
  const canvasRef = useRef(/** @type {HTMLCanvasElement | null} */ (null))

  useEffect(() => {
    if (!star || !open || !canvasRef.current) return
    const thumb = canvasRef.current
    const tctx = thumb.getContext('2d')
    if (!tctx) return
    const r = window.devicePixelRatio || 1
    thumb.width = 160 * r
    thumb.height = 120 * r
    thumb.style.width = '160px'
    thumb.style.height = '120px'
    tctx.setTransform(1, 0, 0, 1, 0, 0)
    tctx.scale(r, r)
    drawConstellationThumb(tctx, 160, 120, star, timeSec)
  }, [star, open, timeSec])

  if (!star) return null

  const circumference = 2 * Math.PI * 15

  return (
    <aside className={`detail-panel ${open ? 'is-open' : ''}`} aria-hidden={!open}>
      <button type="button" className="detail-panel__close" aria-label="Close" onClick={onClose}>
        ×
      </button>
      <div className="detail-panel__row">
        <div className="detail-panel__thumb">
          <canvas ref={canvasRef} width={160} height={120} />
        </div>
        <div className="detail-panel__body">
          <p className="detail-panel__greek">{star.greekLabel || ''}</p>
          <h2 className="detail-panel__heading">{star.label}</h2>
          <div className="detail-panel__ring-wrap">
            <div className="detail-panel__ring">
              <svg viewBox="0 0 36 36">
                <circle className="detail-panel__ring-bg" cx="18" cy="18" r="15" />
                <circle
                  className="detail-panel__ring-fg"
                  cx="18"
                  cy="18"
                  r="15"
                  style={{
                    strokeDasharray: circumference,
                    strokeDashoffset: open ? 0 : circumference,
                    transition: 'stroke-dashoffset 0.9s cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                />
              </svg>
            </div>
            <p className="detail-panel__meta">{star.details?.date || ''}</p>
          </div>
          <p
            className="detail-panel__desc"
            dangerouslySetInnerHTML={{ __html: escapeHtml(star.details?.description || '') }}
          />
          <div className="detail-panel__stack">
            {(star.details?.stack || []).map((t) => (
              <span key={t} className="detail-panel__pill">
                {t}
              </span>
            ))}
          </div>
          <a className="detail-panel__link" href={star.details?.link || '#'} target="_blank" rel="noopener noreferrer">
            Open project →
          </a>
        </div>
      </div>
    </aside>
  )
}
