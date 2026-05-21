/**
 * Edit this file to add/change projects. Omit `type` to auto-assign (no adjacent duplicates).
 */
export const INSTALLATIONS = [
  {
    id: 'aurora-reader',
    type: 'painting',
    title: 'Aurora Reader',
    subtitle: 'Web Application · 2024',
    description: 'A calm reading app with typography-led layouts and offline caches.',
    stack: ['React', 'Vite', 'IndexedDB'],
    link: 'https://example.com',
    status: 'complete',
    palette: ['#e8d5b7', '#2c1810', '#8b6914'],
    placard: 'Oil on canvas, 2024\n48 × 36 in.',
  },
  {
    id: 'neon-index',
    // type omitted → auto
    title: 'Neon Index',
    subtitle: 'Design System · 2025',
    description: 'Token-driven UI kit with luminous accents for dark dashboards.',
    stack: ['Figma', 'CSS', 'Storybook'],
    link: 'https://example.com',
    status: 'wip',
    palette: ['#1a0a2e', '#ff6b9d', '#7c3aed'],
    placard: 'Mixed media, 2025',
  },
  {
    id: 'marble-api',
    title: 'Marble API',
    subtitle: 'Backend · 2023',
    description: 'GraphQL gateway with marble-smooth caching layers.',
    stack: ['Node.js', 'PostgreSQL', 'Redis'],
    link: 'https://example.com',
    status: 'complete',
    palette: ['#e8e4df', '#6b6b70', '#2d2d32'],
    placard: 'Cast resin, 2023',
  },
  {
    id: 'signal-garden',
    title: 'Signal Garden',
    subtitle: 'Installation · 2024',
    description: 'Live data orchard visualizing MQTT streams as growth rings.',
    stack: ['WebSocket', 'Canvas', 'Rust'],
    link: 'https://example.com',
    status: 'concept',
    palette: ['#0d2818', '#4ade80', '#14532d'],
    placard: 'Living diorama, 2024',
  },
  {
    id: 'crt-memo',
    title: 'CRT Memo',
    subtitle: 'Productivity · 2024',
    description: 'Notes app with phosphor decay shaders and scanlines.',
    stack: ['TypeScript', 'Electron'],
    link: 'https://example.com',
    status: 'wip',
    palette: ['#0c0c0c', '#33ff66', '#1a3320'],
    placard: 'CRT assembly, 2024',
  },
  {
    id: 'paper-mobile',
    title: 'Paper Mobile',
    subtitle: 'Art piece · 2025',
    description: 'Kinetic paper forms suspended in a draft of warm light.',
    stack: ['Paper', 'Brass', 'Motion'],
    link: 'https://example.com',
    status: 'complete',
    palette: ['#faf6ef', '#c17f59', '#3d2c24'],
    placard: 'Paper & thread, 2025',
  },
]

const TYPE_CYCLE = ['painting', 'sculpture', 'screenWork', 'neonSign', 'diorama', 'mobileHanging']

/**
 * @param {typeof INSTALLATIONS} list
 */
export function prepareInstallations(list) {
  let prev = /** @type {string | null} */ (null)
  return list.map((inst, i) => {
    let t = inst.type
    if (!t) {
      for (let k = 0; k < TYPE_CYCLE.length; k++) {
        const cand = TYPE_CYCLE[(i + k) % TYPE_CYCLE.length]
        if (cand !== prev) {
          t = cand
          break
        }
      }
      if (!t) t = TYPE_CYCLE[i % TYPE_CYCLE.length]
    }
    prev = t
    return { ...inst, type: /** @type {typeof t} */ (t) }
  })
}
