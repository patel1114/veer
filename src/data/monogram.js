/* ============================================================
   The VA monogram from the Veer Art logo, redrawn as vector line
   art (viewBox 0 0 120 120) so it stays crisp, works on dark and
   paper, and can be drawn stroke by stroke in the splash.

   Didone construction like the original: the V's thick left stem
   and the A's thick right stem; hairline inner strokes that meet
   at the shared apex; the A's crossbar is an arch.
   ============================================================ */

/* Letterforms are authored large, then set into the ring at the same
   proportions as the original logo (monogram ≈ half the ring's height). */
const K = 0.75
const fit = (d) =>
  d.replace(/(-?\d*\.?\d+),(-?\d*\.?\d+)/g, (_, x, y) => {
    const X = 57.6 + (+x - 60.5) * K
    const Y = 62.4 + (+y - 61.5) * K
    return `${Math.round(X * 100) / 100},${Math.round(Y * 100) / 100}`
  })

export const ring = [
  // outer and inner rings
  'M60,4 A56,56 0 1,1 59.99,4',
  'M60,8.6 A51.4,51.4 0 1,1 59.99,8.6',
]

/* thick stems: drawn as outlines, then filled with ink */
export const stems = ([
  // V — thick left stem
  'M27,27 L38,27 L57.5,86 L53,86 Z',
  // A — thick right stem
  'M68.6,27 L72.4,27 L94,96 L83,96 Z',
]).map(fit)

/* hairlines & serifs */
export const hairlines = ([
  // V — top-left serif
  'M23,27 L42,27',
  // V — hairline right arm, up to the shared apex
  'M55.3,86 L70.5,27',
  // A — hairline left leg
  'M70.5,27 L51,96',
  // A — the arched crossbar
  'M54.6,83 C58,70 64,66.5 69.5,67.5 C76,68.6 81,76 84.6,90',
  // A — foot serifs
  'M46.5,96 L56,96',
  'M80,96 L98,96',
]).map(fit)

/* "VEER ART" set under the monogram, as in the logo */
export const wordmark = { text: 'VEER ART', x: 60, y: 99 }
