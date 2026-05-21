const COUNT = 300

/** @type {{ x: number, y: number, s: number, phase: number, speed: number }[]} */
let stars = []

export function init(w, h) {
  stars = []
  for (let i = 0; i < COUNT; i++) {
    stars.push({
      x: Math.random() * w,
      y: Math.random() * h,
      s: 0.5 + Math.random(),
      phase: Math.random() * Math.PI * 2,
      speed: 0.4 + Math.random() * 1.2,
    })
  }
}

export function resize(w, h) {
  init(w, h)
}

/** @param {CanvasRenderingContext2D} ctx */
export function draw(ctx, w, h, timeSec) {
  ctx.save()
  ctx.fillStyle = '#04050f'
  ctx.fillRect(0, 0, w, h)

  for (const st of stars) {
    const tw = 0.55 + 0.45 * Math.sin(timeSec * st.speed + st.phase)
    ctx.globalAlpha = tw * 0.85
    ctx.fillStyle = 'rgba(220, 230, 255, 0.9)'
    ctx.beginPath()
    ctx.arc(st.x, st.y, st.s * (w / 1920), 0, Math.PI * 2)
    ctx.fill()
  }
  ctx.restore()
}

/** Shooting streak state */
let nextShoot = 0
let shoot = null

function scheduleShoot(now) {
  nextShoot = now + (8 + Math.random() * 7) * 1000
}

export function resetShooting(now) {
  scheduleShoot(now)
  shoot = null
}

/**
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} w
 * @param {number} h
 * @param {number} dt
 * @param {number} nowMs
 */
export function updateShooting(ctx, w, h, dt, nowMs) {
  if (nextShoot === 0) scheduleShoot(nowMs)

  if (!shoot) {
    if (nowMs >= nextShoot) {
      const angle = Math.random() * Math.PI * 0.35 + Math.PI * 0.1
      const len = w * (0.35 + Math.random() * 0.25)
      const sx = Math.random() * w * 0.85
      const sy = Math.random() * h * 0.4
      shoot = { sx, sy, angle, len, t: 0, life: 0.55 + Math.random() * 0.2 }
      scheduleShoot(nowMs)
    }
    return
  }

  shoot.t += dt / shoot.life
  if (shoot.t >= 1) {
    shoot = null
    return
  }

  const { sx, sy, angle, len } = shoot
  const ease = shoot.t * shoot.t
  const x2 = sx + Math.cos(angle) * len * ease
  const y2 = sy + Math.sin(angle) * len * ease
  const alpha = (1 - shoot.t) * 0.85

  ctx.save()
  const grad = ctx.createLinearGradient(sx, sy, x2, y2)
  grad.addColorStop(0, `rgba(255,255,255,0)`)
  grad.addColorStop(0.15, `rgba(255,255,255,${alpha * 0.25})`)
  grad.addColorStop(0.55, `rgba(255,255,255,${alpha})`)
  grad.addColorStop(1, `rgba(200,220,255,0)`)
  ctx.strokeStyle = grad
  ctx.lineWidth = 1.2
  ctx.lineCap = 'round'
  ctx.beginPath()
  ctx.moveTo(sx, sy)
  ctx.lineTo(x2, y2)
  ctx.stroke()
  ctx.restore()
}
