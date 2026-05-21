import { useRef, useEffect, useState, useCallback } from 'react'
import { CONSTELLATION } from './constellation/stars.config.js'
import { getStarsSortedByOrder, getAnimationEdges } from './constellation/constellationMap.js'
import {
  init as initStarField,
  resize as resizeStarField,
  draw as drawStarField,
  updateShooting,
  resetShooting,
} from './constellation/starField.js'
import { drawStar } from './constellation/starNode.js'
import { drawSelectEffect } from './constellation/starEffects.js'
import { playStarSound } from './constellation/starSounds.js'
import {
  initEdges,
  updateEdges,
  drawEdges,
  allLinesComplete,
  updateParticles,
  boostEdgesForStar,
} from './constellation/connections.js'
import * as hover from './interactions/hover.js'
import * as select from './interactions/select.js'
import DetailPanel from './components/DetailPanel.jsx'

const BG_FADE_START = 300
const FIRST_IGNITE = 800
const IGNITE_GAP = 120
const IGNITE_DUR = 400
const LINE_DUR = 300
const NAME_PAUSE = 450
const CHROME_AFTER_NAME_MS = 550

const sorted = getStarsSortedByOrder()
const animEdges = getAnimationEdges()

const igniteStart = sorted.map((_, i) => FIRST_IGNITE + i * IGNITE_GAP)
const igniteEnd = igniteStart.map((s) => s + IGNITE_DUR)

const lineStartMs = []
let lineAcc = 0
for (let i = 0; i < animEdges.length; i++) {
  const [from] = animEdges[i]
  const fi = sorted.findIndex((s) => s.id === from.id)
  const start = Math.max(lineAcc, igniteEnd[fi] ?? 0)
  lineStartMs.push(start)
  lineAcc = start + LINE_DUR
}

initEdges(animEdges, lineStartMs)

const lastLineEnd = lineStartMs.length ? lineStartMs[lineStartMs.length - 1] + LINE_DUR : 0
const lastIgniteEnd = igniteEnd.length ? igniteEnd[igniteEnd.length - 1] : 0
const nameTriggerTime = Math.max(lastLineEnd, lastIgniteEnd) + NAME_PAUSE

function sizePair(bg, main) {
  const vw = window.innerWidth
  const vh = window.innerHeight
  const dpr = Math.min(window.devicePixelRatio, 2)
  const w = Math.floor(vw * dpr)
  const h = Math.floor(vh * dpr)
  for (const c of [bg, main]) {
    c.width = w
    c.height = h
    c.style.width = `${vw}px`
    c.style.height = `${vh}px`
  }
  return { w, h, vw, vh }
}

export default function App() {
  const bgRef = useRef(/** @type {HTMLCanvasElement | null} */ (null))
  const mainRef = useRef(/** @type {HTMLCanvasElement | null} */ (null))
  const mainZoomRef = useRef(/** @type {HTMLDivElement | null} */ (null))
  const tooltipRef = useRef(/** @type {HTMLDivElement | null} */ (null))
  const loadT0Ref = useRef(performance.now())
  const pendingResetRef = useRef(false)
  const litAnimTokenRef = useRef(0)

  const [hovered, setHovered] = useState(/** @type {typeof sorted[0] | null} */ (null))
  const [selectedStar, setSelectedStar] = useState(/** @type {typeof sorted[0] | null} */ (null))
  const [panelOpen, setPanelOpen] = useState(false)
  const [chromeVisible, setChromeVisible] = useState(false)
  const [titleVisible, setTitleVisible] = useState(false)
  const [litLetters, setLitLetters] = useState(/** @type {number[]} */ ([]))
  const [bgVisible, setBgVisible] = useState(false)
  const [audioUiVisible, setAudioUiVisible] = useState(false)
  const [timeSec, setTimeSec] = useState(0)

  const hoveredRef = useRef(hovered)
  hoveredRef.current = hovered

  const closeAll = useCallback(() => {
    const t = performance.now() / 1000
    select.closeSelect(t, mainZoomRef.current)
    setSelectedStar(null)
    setPanelOpen(false)
  }, [])

  const resetAnimation = useCallback(() => {
    closeAll()
    loadT0Ref.current = performance.now()
    initEdges(animEdges, lineStartMs)
    resetShooting(loadT0Ref.current)
    litAnimTokenRef.current++
    pendingResetRef.current = true
    setBgVisible(false)
    setTitleVisible(false)
    setLitLetters([])
    setChromeVisible(false)
    setAudioUiVisible(false)
  }, [closeAll])

  useEffect(() => {
    resetShooting(loadT0Ref.current)
  }, [])

  useEffect(() => {
    const bg = bgRef.current
    const main = mainRef.current
    if (!bg || !main) return

    const { w, h } = sizePair(bg, main)
    initStarField(w, h)

    let raf = 0
    let alive = true
    let frameDt = 1 / 60
    let flowEnabled = false
    let bgShown = false
    let nameShown = false
    let chromeShown = false
    let titleShownAt = 0

    const onResize = () => {
      const sz = sizePair(bg, main)
      resizeStarField(sz.w, sz.h)
    }
    window.addEventListener('resize', onResize)

    const pointerToCanvas = (clientX, clientY) => {
      const rect = main.getBoundingClientRect()
      const { nx, ny } = select.clientToNormalized(clientX, clientY, rect)
      return { mx: nx * main.width, my: ny * main.height, rect }
    }

    const isStarInteractive = (elapsedMs, starIndex) => elapsedMs >= igniteStart[starIndex]

    const onMove = (e) => {
      const px = (e.clientX / window.innerWidth - 0.5) * 2
      const py = (e.clientY / window.innerHeight - 0.5) * 2
      document.documentElement.style.setProperty('--pcx-bg', `${-px * 4}px`)
      document.documentElement.style.setProperty('--pcy-bg', `${-py * 4}px`)
      document.documentElement.style.setProperty('--pcx-main', `${-px * 12}px`)
      document.documentElement.style.setProperty('--pcy-main', `${-py * 12}px`)

      const { mx, my } = pointerToCanvas(e.clientX, e.clientY)
      const elapsed = performance.now() - loadT0Ref.current
      let hit = hover.hitTest(mx, my, sorted, main.width, main.height)
      const idx = hit ? sorted.findIndex((s) => s.id === hit.id) : -1
      if (idx >= 0 && !isStarInteractive(elapsed, idx)) hit = null
      setHovered(hit)
      hover.updateTooltip(tooltipRef.current, hit, e.clientX, e.clientY)
      document.body.style.cursor = hit ? 'pointer' : ''
    }

    const onLeave = () => {
      setHovered(null)
      hover.updateTooltip(tooltipRef.current, null, 0, 0)
    }

    const onClick = (e) => {
      const elapsed = performance.now() - loadT0Ref.current
      const { mx, my } = pointerToCanvas(e.clientX, e.clientY)
      const hit = hover.hitTest(mx, my, sorted, main.width, main.height)
      const idx = hit ? sorted.findIndex((s) => s.id === hit.id) : -1
      if (!hit || idx < 0 || !isStarInteractive(elapsed, idx)) return
      const tSec = performance.now() / 1000
      void playStarSound(hit.selectSound || { wave: 'sine', freq: 440, duration: 0.12 })
      setSelectedStar(hit)
      select.selectStar(hit, tSec, mainZoomRef.current)
      setPanelOpen(true)
    }

    main.addEventListener('mousemove', onMove)
    main.addEventListener('mouseleave', onLeave)
    main.addEventListener('click', onClick)

    const loop = (now) => {
      if (!alive) return
      raf = requestAnimationFrame(loop)
      const dt = Math.min(0.05, (now - (loop.lastNow || now)) / 1000)
      loop.lastNow = now
      frameDt = dt

      const elapsed = now - loadT0Ref.current
      setTimeSec(now / 1000)

      if (pendingResetRef.current) {
        pendingResetRef.current = false
        bgShown = false
        nameShown = false
        chromeShown = false
        flowEnabled = false
        titleShownAt = 0
        loop.lastNow = now
      }

      if (!bgShown && elapsed >= BG_FADE_START) {
        bgShown = true
        setBgVisible(true)
      }

      if (!nameShown && elapsed >= nameTriggerTime) {
        nameShown = true
        setTitleVisible(true)
        titleShownAt = now
        const token = ++litAnimTokenRef.current
        const name = CONSTELLATION.name.toUpperCase()
        let li = 0
        for (let i = 0; i < name.length; i++) {
          if (name[i] === ' ') continue
          const j = li++
          window.setTimeout(() => {
            if (litAnimTokenRef.current !== token) return
            setLitLetters((prev) => [...prev, j])
          }, 60 + j * 85)
        }
      }

      if (nameShown && !chromeShown && now - titleShownAt > CHROME_AFTER_NAME_MS) {
        chromeShown = true
        setChromeVisible(true)
        setAudioUiVisible(true)
      }

      updateEdges(elapsed)
      boostEdgesForStar(hoveredRef.current?.id ?? null)

      if (allLinesComplete(elapsed)) {
        flowEnabled = true
        updateParticles(dt)
      }

      const pulseStart = select.getPulseStartSec()
      if (pulseStart >= 0 && now / 1000 - pulseStart > 1.05) {
        select.clearPulse()
      }

      const bgCtx = /** @type {CanvasRenderingContext2D} */ (bg.getContext('2d'))
      const ctx = /** @type {CanvasRenderingContext2D} */ (main.getContext('2d'))
      if (!bgCtx || !ctx) return

      drawStarField(bgCtx, main.width, main.height, now / 1000)
      updateShooting(bgCtx, main.width, main.height, frameDt, now)

      ctx.clearRect(0, 0, main.width, main.height)
      drawEdges(ctx, main.width, main.height, elapsed, flowEnabled)

      const sel = select.getSelected()
      const dimOthers = sel !== null

      sorted.forEach((star, i) => {
        const start = igniteStart[i]
        const ignElapsed = elapsed - start
        const lit = ignElapsed >= 0
        const igniteT = !lit ? 0 : Math.min(1, ignElapsed / IGNITE_DUR)
        const isHover = hoveredRef.current?.id === star.id
        const px = star.x * main.width
        const py = star.y * main.height
        drawStar(ctx, px, py, star, {
          lit,
          igniteT,
          timeSec: now / 1000,
          hover: isHover,
          dimOthers,
        })
      })

      const pStart = select.getPulseStartSec()
      if (pStart >= 0 && sel) {
        const dtEff = now / 1000 - pStart
        if (dtEff < 1.05) {
          const px = sel.x * main.width
          const py = sel.y * main.height
          const effect = sel.selectEffect || 'rings'
          drawSelectEffect(ctx, px, py, dtEff, effect)
        }
      }
    }
    loop.lastNow = performance.now()
    raf = requestAnimationFrame(loop)

    return () => {
      alive = false
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
      main.removeEventListener('mousemove', onMove)
      main.removeEventListener('mouseleave', onLeave)
      main.removeEventListener('click', onClick)
    }
  }, [])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape' && panelOpen) closeAll()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [panelOpen, closeAll])

  useEffect(() => {
    const onDoc = (e) => {
      if (!panelOpen) return
      const t = /** @type {HTMLElement | null} */ (e.target)
      if (t?.closest?.('.detail-panel')) return
      if (t?.closest?.('.audio-toggle') || t?.closest?.('.audio-panel')) return
      if (t?.closest?.('.reset-animation-btn')) return
      closeAll()
    }
    document.addEventListener('pointerdown', onDoc)
    return () => document.removeEventListener('pointerdown', onDoc)
  }, [panelOpen, closeAll])

  const nameUpper = CONSTELLATION.name.toUpperCase()
  let letterIndex = 0

  return (
    <div className="app">
      <div id="stage" aria-hidden="true">
        <canvas id="bg-canvas" ref={bgRef} className={bgVisible ? 'is-visible' : ''} />
        <div id="main-layer">
          <div id="main-zoom" ref={mainZoomRef}>
            <canvas id="main-canvas" ref={mainRef} />
          </div>
        </div>
      </div>
      <div className="vignette" aria-hidden="true" />
      <div className="nebula" aria-hidden="true" />

      <div id="ui-root">
        <button
          type="button"
          className="reset-animation-btn"
          title="Replay intro animation"
          onClick={resetAnimation}
        >
          Replay intro
        </button>

        <div ref={tooltipRef} className="tooltip" role="tooltip" />

        <div className={`constellation-title ${titleVisible ? 'is-visible' : ''}`} aria-hidden="true">
          {nameUpper.split('').map((ch, i) => {
            if (ch === ' ') return <span key={`sp-${i}`}> </span>
            const idx = letterIndex++
            return (
              <span key={i} className={litLetters.includes(idx) ? 'is-lit' : ''}>
                {ch}
              </span>
            )
          })}
        </div>

        <div className={`legend chrome ${chromeVisible ? 'is-visible' : ''}`}>
          <div className="legend__row">
            <span className="legend__dot legend__dot--full" /> Click a star for details
          </div>
          <div className="legend__row">
            <span className="legend__dot legend__dot--half" /> Scroll or arrows to explore
          </div>
        </div>

        <div className={`chrome chrome__title ${chromeVisible ? 'is-visible' : ''}`}>
          {CONSTELLATION.name} · portfolio map
        </div>

        <div className={`clock-hud chrome ${chromeVisible ? 'is-visible' : ''}`}>
          <ClockHud active={chromeVisible} />
        </div>

        <AudioToggle visible={audioUiVisible} />

        <DetailPanel
          star={selectedStar}
          open={panelOpen}
          timeSec={timeSec}
          onClose={() => {
            closeAll()
          }}
        />
      </div>
    </div>
  )
}

function ClockHud({ active }) {
  const [text, setText] = useState('RA 05h 55m · DEC +07° 24′')
  useEffect(() => {
    if (!active) return
    let baseRa = 5 + 55 / 60
    let baseDec = 7 + 24 / 60
    let last = performance.now()
    let raf = 0
    const tick = (now) => {
      raf = requestAnimationFrame(tick)
      const dt = (now - last) / 1000
      last = now
      baseRa += dt * 0.00012
      baseDec += Math.sin(now * 0.0003) * dt * 0.02
      const H = Math.floor(baseRa)
      const M = Math.floor((baseRa - H) * 60)
      const s = Math.floor((((baseRa - H) * 60 - M) * 60) % 60)
      const sign = baseDec >= 0 ? '+' : '−'
      const D = Math.floor(Math.abs(baseDec))
      const m = Math.floor((Math.abs(baseDec) - D) * 60)
      setText(
        `RA ${String(H).padStart(2, '0')}h ${String(M).padStart(2, '0')}m ${String(s).padStart(2, '0')}s · DEC ${sign}${D}° ${String(m).padStart(2, '0')}′`
      )
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [active])
  return text
}

function AudioToggle({ visible }) {
  const [on, setOn] = useState(false)
  const [showVol, setShowVol] = useState(false)
  const ctxRef = useRef(/** @type {AudioContext | null} */ (null))
  const gainRef = useRef(/** @type {GainNode | null} */ (null))

  return (
    <>
      <button
        type="button"
        className={`audio-toggle ${visible ? 'is-visible' : ''} ${on ? 'is-on' : ''}`}
        aria-label="Toggle ambient audio"
        onClick={() => {
          if (!ctxRef.current) {
            const Ctx = window.AudioContext || window.webkitAudioContext || null
            if (!Ctx) return
            const ctx = new Ctx()
            const osc = ctx.createOscillator()
            const g = ctx.createGain()
            osc.type = 'sine'
            osc.frequency.value = 55
            osc.connect(g)
            g.connect(ctx.destination)
            g.gain.value = 0
            osc.start()
            ctxRef.current = ctx
            gainRef.current = g
          }
          const ctx = ctxRef.current
          if (ctx?.state === 'suspended') void ctx.resume()
          const next = !on
          setOn(next)
          setShowVol(next)
          gainRef.current?.gain.setTargetAtTime(next ? 0.04 : 0, ctxRef.current.currentTime, 0.08)
        }}
      >
        ♪
      </button>
      <div className={`audio-panel ${showVol && on ? 'is-visible' : ''}`}>
        <label htmlFor="amb-vol">Ambient</label>
        <input
          id="amb-vol"
          type="range"
          min="0"
          max="100"
          defaultValue="12"
          onChange={(e) => {
            const v = Number(e.target.value) / 100
            const ctx = ctxRef.current
            if (!ctx || !gainRef.current || !on) return
            gainRef.current.gain.setTargetAtTime(v * 0.06, ctx.currentTime, 0.05)
          }}
        />
      </div>
    </>
  )
}
