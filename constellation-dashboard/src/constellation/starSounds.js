/** @typedef {{ wave?: OscillatorType, freq: number, duration?: number }} SoundPreset */

let audioCtx = /** @type {AudioContext | null} */ (null)

/**
 * @param {SoundPreset} preset
 */
export async function playStarSound(preset) {
  try {
    const Ctx = window.AudioContext || window.webkitAudioContext
    if (!Ctx) return
    if (!audioCtx) audioCtx = new Ctx()
    if (audioCtx.state === 'suspended') await audioCtx.resume()

    const wave = preset.wave || 'sine'
    const freq = preset.freq
    const dur = Math.min(0.35, Math.max(0.04, preset.duration ?? 0.12))

    const osc = audioCtx.createOscillator()
    const g = audioCtx.createGain()
    osc.type = wave
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime)

    g.gain.setValueAtTime(0.0001, audioCtx.currentTime)
    g.gain.exponentialRampToValueAtTime(0.12, audioCtx.currentTime + 0.02)
    g.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + dur)

    osc.connect(g)
    g.connect(audioCtx.destination)
    osc.start(audioCtx.currentTime)
    osc.stop(audioCtx.currentTime + dur + 0.05)
  } catch {
    /* ignore */
  }
}

