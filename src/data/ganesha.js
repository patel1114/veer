/* ============================================================
   Lord Ganesha — line data for the splash sketch.
   Seated, four-armed: axe (upper right hand), lotus (upper left),
   abhaya mudra (lower right), bowl of modaks (lower left); trunk
   curling to his left; lotus seat; his mouse beside the seat.

   Coordinates live in the splash SVG's space (viewBox 0 -10 400 470).
   The head was drawn larger and is mapped into place by `head()`.
   Strokes are listed in the order an artist would draw them.
   ============================================================ */

/* ---- mapping for the head (authored at 1/0.55 scale around 200,120) ---- */
const S = 0.55
const HX = 200
const HY = 95
const r1 = (n) => Math.round(n * 10) / 10
const fx = (x) => r1(HX + (x - 200) * S)
const fy = (y) => r1(HY + (y - 120) * S)

/** Maps absolute (M L C Q) and relative (q) path commands. No arcs. */
function head(d) {
  const tok = d.match(/[a-zA-Z]|-?\d*\.?\d+/g)
  const out = []
  let cmd = 'M'
  for (let i = 0; i < tok.length; ) {
    if (/[a-zA-Z]/.test(tok[i])) {
      cmd = tok[i++]
      out.push(cmd)
      continue
    }
    const x = +tok[i]
    const y = +tok[i + 1]
    i += 2
    out.push(cmd === cmd.toUpperCase() ? `${fx(x)},${fy(y)}` : `${r1(x * S)},${r1(y * S)}`)
  }
  return out.join(' ')
}

/* A steady hand still trembles: nudge every absolute point by a
   tiny, repeatable amount so lines aren't machine-perfect. */
let seed = 17
const rand = () => ((seed = (seed * 16807) % 2147483647) / 2147483647) * 2 - 1
function hand(d, amt = 0.55) {
  if (/[Aa]/.test(d)) return d // leave arcs alone
  const tok = d.match(/[a-zA-Z]|-?\d*\.?\d+/g)
  const out = []
  let cmd = 'M'
  for (let i = 0; i < tok.length; ) {
    if (/[a-zA-Z]/.test(tok[i])) {
      cmd = tok[i++]
      out.push(cmd)
      continue
    }
    const x = +tok[i]
    const y = +tok[i + 1]
    i += 2
    out.push(cmd === cmd.toUpperCase() ? `${r1(x + rand() * amt)},${r1(y + rand() * amt)}` : `${x},${y}`)
  }
  return out.join(' ')
}

const circle = (cx, cy, r) => `M${cx - r},${cy} A${r},${r} 0 1,0 ${cx + r},${cy} A${r},${r} 0 1,0 ${cx - r},${cy}`
const ellipse = (cx, cy, rx, ry) =>
  `M${cx - rx},${cy} A${rx},${ry} 0 1,0 ${cx + rx},${cy} A${rx},${ry} 0 1,0 ${cx - rx},${cy}`

const hatchSet = (x0, x1, y0, y1, step, slant) => {
  const out = []
  for (let x = x0; x <= x1; x += step) out.push(`M${r1(x)},${y0} L${r1(x + slant)},${y1}`)
  return out
}

/* ---- 1. construction: light, fast guide lines ---- */
export const construction = ([
  'M200,22 L200,352',
  circle(200, 92, 46),
  'M132,140 L268,140',
  ellipse(200, 228, 58, 42),
  'M140,140 L102,168 L100,114',
  'M260,140 L298,168 L300,114',
  'M140,154 L128,214 L156,190',
  'M260,152 L284,224',
  'M102,300 L298,300',
  ellipse(200, 336, 120, 16),
]).map((d) => hand(d, 1.2)) // guide lines are looser

/* ---- 2. contours, in drawing order ----
   w: stroke weight (b = bold, n = normal, t = thin)
   re: gets a second, darker re-lining pass */
export const contours = [
  // head & crown
  { d: head('M168,72 L174,46 Q186,32 190,19 Q200,3 210,19 Q214,32 226,46 L232,72'), w: 'b', re: true },
  { d: head('M162,75 Q200,63 238,75'), w: 'n' },
  { d: head('M168,70 q5,-7 10,0 q5,-7 10,0 q5,-7 10,0 q5,-7 10,0 q5,-7 10,0 q5,-7 10,0'), w: 't' },
  { d: head('M175,48 Q200,40 225,48'), w: 't' },
  { d: head('M184,32 Q200,26 216,32'), w: 't' },
  { d: head('M200,11 L200,1'), w: 'n' },
  { d: head('M168,72 C156,67 151,57 158,50'), w: 't' },
  { d: head('M232,72 C244,67 249,57 242,50'), w: 't' },
  { d: head('M166,76 C150,86 146,108 152,128'), w: 'n' },
  { d: head('M234,76 C250,86 254,108 248,128'), w: 'n' },
  { d: head('M156,86 C112,62 68,80 70,122 C72,162 110,178 152,150'), w: 'b', re: true },
  { d: head('M244,86 C288,62 332,80 330,122 C328,162 290,178 248,150'), w: 'b', re: true },
  { d: head('M150,100 C120,90 98,106 100,128 C102,146 122,152 146,140'), w: 't' },
  { d: head('M250,100 C280,90 302,106 300,128 C298,146 278,152 254,140'), w: 't' },
  { d: head('M168,110 Q178,101 188,110 Q178,116 168,110'), w: 'n' },
  { d: head('M212,110 Q222,101 232,110 Q222,116 212,110'), w: 'n' },
  { d: head('M188,120 C184,150 186,182 198,206 C208,224 234,228 244,211 C252,196 240,184 227,193'), w: 'b', re: true },
  { d: head('M212,120 C214,146 212,170 216,186 C220,198 231,203 236,196'), w: 'n' },
  { d: head('M189,140 Q200,146 212,140'), w: 't' },
  { d: head('M188,156 Q200,162 213,156'), w: 't' },
  { d: head('M190,172 Q202,178 214,171'), w: 't' },
  { d: head('M180,132 C170,146 166,158 174,168'), w: 'n' },
  { d: head('M186,134 C180,148 178,158 174,168'), w: 'n' },
  { d: head('M152,128 C156,148 168,158 182,152'), w: 'n' },
  { d: head('M248,128 C244,148 232,158 218,152'), w: 'n' },
  { d: head('M179,158 Q185,165 191,161'), w: 't' },

  // shoulders & upper arms (axe / lotus)
  { d: 'M152,130 C146,133 142,136 138,140', w: 'n' },
  { d: 'M248,130 C254,133 258,136 262,140', w: 'n' },
  { d: 'M138,138 C120,142 106,154 100,170 C96,152 96,134 98,116', w: 'n', re: true },
  { d: 'M144,152 C130,154 118,158 112,160 C110,146 110,132 112,118', w: 't' },
  { d: 'M96,118 C94,108 100,100 108,100 C116,100 118,110 114,118 C110,122 100,122 96,118', w: 'n' },
  { d: 'M98,110 C104,108 110,108 116,110', w: 't' },
  { d: 'M104,52 L106,100', w: 'n' },
  { d: 'M110,52 L111,100', w: 'n' },
  { d: 'M104,52 Q107,46 110,52', w: 't' },
  { d: 'M104,58 C92,50 80,52 74,58 C76,72 84,82 96,82 C100,78 102,72 104,70', w: 'n', re: true },
  { d: 'M262,138 C280,142 294,154 300,170 C304,152 304,134 302,116', w: 'n', re: true },
  { d: 'M256,152 C270,154 282,158 288,160 C290,146 290,132 288,118', w: 't' },
  { d: 'M304,118 C306,108 300,100 292,100 C284,100 282,110 286,118 C290,122 300,122 304,118', w: 'n' },
  { d: 'M302,110 C296,108 290,108 284,110', w: 't' },
  { d: 'M295,100 C296,90 298,82 300,74', w: 't' },
  { d: 'M300,74 C292,62 294,48 300,40 C306,48 308,62 300,74', w: 'n' },
  { d: 'M300,74 C288,72 280,62 280,52 C290,54 298,64 300,74', w: 'n' },
  { d: 'M300,74 C312,72 320,62 320,52 C310,54 302,64 300,74', w: 'n' },
  { d: 'M300,74 C284,78 272,72 268,64 C280,62 294,68 300,74', w: 't' },
  { d: 'M300,74 C316,78 328,72 332,64 C320,62 306,68 300,74', w: 't' },

  // torso, ornaments, belly
  { d: 'M146,158 C142,170 142,182 148,192', w: 'n' },
  { d: 'M254,158 C258,170 258,182 252,192', w: 'n' },
  { d: 'M168,124 C172,138 180,148 190,150', w: 't' },
  { d: 'M160,132 C168,160 186,172 200,174 C214,172 232,160 240,132', w: 't' },
  { d: 'M156,136 C180,176 216,214 252,244', w: 't' },
  { d: 'M148,192 C128,214 138,254 170,264 C186,270 214,270 230,264 C262,254 272,214 252,192', w: 'b', re: true },
  { d: 'M146,222 C176,240 224,240 254,222', w: 'n' },
  { d: 'M147,228 C176,246 224,246 253,228', w: 't' },
  { d: 'M196,208 C196,204 204,204 204,208 C204,212 198,212 198,209', w: 't' },

  // lower arms: abhaya hand, bowl of modaks
  { d: 'M138,154 C128,172 124,194 128,214 C132,222 142,220 146,212 C150,206 152,200 154,196', w: 'n', re: true },
  { d: 'M146,172 C142,184 140,196 142,204 C146,198 150,192 152,188', w: 't' },
  { d: 'M148,196 C144,184 145,170 148,162 C150,156 156,156 157,163 L158,170 C159,160 165,160 166,168 C168,180 166,190 162,198', w: 'n' },
  { d: 'M152,160 L153,176', w: 't' },
  { d: 'M161,162 L161,176', w: 't' },
  { d: 'M162,186 C168,182 170,176 168,172', w: 't' },
  { d: 'M262,150 C276,170 286,196 284,222', w: 'n', re: true },
  { d: 'M254,172 C264,190 270,206 270,224', w: 't' },
  { d: 'M248,232 C262,228 284,228 298,232', w: 'n' },
  { d: 'M250,232 Q272,256 296,232', w: 'n', re: true },
  { d: 'M260,231 C256,223 262,216 265,212 C268,216 273,223 270,231', w: 't' },
  { d: 'M272,230 C268,220 274,212 278,208 C282,212 287,220 284,230', w: 't' },
  { d: 'M284,231 C281,224 286,218 289,215 C292,218 296,224 293,231', w: 't' },

  // legs (seated, crossed) & dhoti
  { d: 'M152,258 C128,266 110,280 104,298 C100,310 112,316 126,314', w: 'n', re: true },
  { d: 'M248,258 C272,266 290,280 296,298 C300,310 288,316 274,314', w: 'n', re: true },
  { d: 'M126,314 C160,312 200,310 238,306', w: 'n' },
  { d: 'M274,314 C240,318 200,320 164,318', w: 't' },
  { d: 'M222,304 C232,292 250,288 262,294 C258,304 240,308 222,304', w: 'n' },
  { d: 'M110,312 C104,318 108,326 118,324', w: 't' },
  { d: 'M140,282 C170,292 230,292 260,282', w: 't' },
  { d: 'M172,270 C174,284 178,296 182,308', w: 't' },
  { d: 'M226,270 C224,282 222,292 220,300', w: 't' },

  // lotus seat
  { d: 'M84,326 C140,316 260,316 316,326', w: 'n' },
  ...Array.from({ length: 10 }, (_, i) => {
    const x = 85 + i * 23
    return { d: `M${x},346 C${x + 2},334 ${x + 7},326 ${x + 11.5},322 C${x + 16},326 ${x + 21},334 ${x + 23},346`, w: 't' }
  }),
  { d: 'M80,348 C140,356 260,356 320,348', w: 'n' },

  // the mouse
  { d: 'M326,346 C326,334 344,328 356,336 C364,342 360,352 348,354 C338,356 326,354 326,346', w: 'n' },
  { d: 'M338,334 C336,326 344,324 346,332', w: 't' },
  { d: 'M356,336 C362,338 366,342 362,346', w: 't' },
  { d: 'M326,348 C314,352 308,346 302,352', w: 't' },

  // the halo, last
  { d: circle(200, 95, 80), w: 't' },
  { d: circle(200, 95, 74), w: 't' },
].map((c) => ({ ...c, d: hand(c.d) }))

/* ---- 3. shading: clip regions + hatching ---- */
export const clips = {
  'g-ear-l': head('M156,86 C112,62 68,80 70,122 C72,162 110,178 152,150 Z'),
  'g-ear-r': head('M244,86 C288,62 332,80 330,122 C328,162 290,178 248,150 Z'),
  'g-crown': head('M168,72 L174,46 Q186,32 190,19 Q200,3 210,19 Q214,32 226,46 L232,72 Z'),
  'g-belly': 'M148,192 C128,214 138,254 170,264 C186,270 214,270 230,264 C262,254 272,214 252,192 Z',
  'g-lap': 'M146,258 C176,276 224,276 254,258 L266,294 C222,304 178,304 134,294 Z',
  'g-seat': 'M84,326 C140,316 260,316 316,326 L318,348 L82,348 Z',
}

const mapHatch = (list) => list.map(head)

export const hatching = [
  { clip: 'g-ear-l', lines: mapHatch(hatchSet(60, 150, 70, 175, 8, -26)) },
  { clip: 'g-ear-r', lines: mapHatch(hatchSet(250, 340, 70, 175, 8, 26)) },
  { clip: 'g-crown', lines: mapHatch(hatchSet(166, 236, 4, 74, 7, -14)) },
  { clip: 'g-belly', lines: hatchSet(214, 282, 188, 272, 5.5, -22) },
  { clip: 'g-lap', lines: hatchSet(120, 280, 254, 306, 6.5, 14) },
  { clip: 'g-seat', lines: hatchSet(70, 332, 314, 350, 7.5, 10) },
]

/* ---- 4. soft graphite tone (blended) ---- */
export const smudges = [
  { cx: 238, cy: 236, rx: 24, ry: 32, o: 0.2 },
  { cx: 200, cy: 124, rx: 42, ry: 10, o: 0.18 },
  { cx: 200, cy: 288, rx: 74, ry: 11, o: 0.2 },
  { cx: 200, cy: 352, rx: 124, ry: 8, o: 0.22 },
  { cx: fx(100), cy: fy(124), rx: 14, ry: 20, o: 0.16 },
  { cx: fx(300), cy: fy(124), rx: 14, ry: 20, o: 0.16 },
]

/* ---- 5. finishing marks ---- */
export const pupils = [
  [fx(179), fy(109.5), 1.9],
  [fx(221), fy(109.5), 1.9],
]
export const jewels = [
  [fx(200), fy(-2), 2],
  [fx(200), fy(56), 1.8],
  [fx(187), fy(58), 1.2],
  [fx(213), fy(58), 1.2],
  [fx(200), fy(37), 1.3],
  [350, 340, 1.4], // the mouse's eye
]
export const tilak = head('M200,80 L200,96')
export const bindu = [fx(200), fy(101), 1.7]
