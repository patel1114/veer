/* ============================================================
   Lord Ganesha — line data for the splash sketch.
   An original drawing in the pose of a pandal Ganesha: seated on a
   serpent-hooded throne, one leg folded, the other lowered to a
   footstool. Upper right hand raised in blessing, upper left holding
   a lotus, lower right holding a flute, lower left resting on the
   throne. Ornate crown with lotus buds, beaded halo, garlands, sash,
   a dark draped dhoti, and his mouse at the foot of the throne.

   Coordinates live in the splash SVG's space (viewBox 0 -10 400 502);
   the figure occupies roughly x 60–340, y 0–366. The monogram below it
   is placed by the preloader. Strokes are in the order an artist
   would draw them.
   ============================================================ */

const r1 = (n) => Math.round(n * 10) / 10

/* A steady hand still trembles: nudge every absolute point by a
   tiny, repeatable amount so lines aren't machine-perfect. */
let seed = 17
const rand = () => ((seed = (seed * 16807) % 2147483647) / 2147483647) * 2 - 1
function hand(d, amt = 0.5) {
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

/* the halo */
const HX = 205
const HY = 104

/* ---- 1. construction: light, fast guide lines ---- */
export const construction = [
  'M205,4 L205,362', // centre line
  circle(205, 96, 30), // head
  'M166,130 L244,130', // shoulders
  ellipse(205, 204, 42, 28), // belly
  'M172,130 L136,102 L120,52', // raised arm
  'M238,130 L304,102', // lotus arm
  'M166,158 L90,152', // flute arm
  'M242,170 L300,206', // resting arm
  'M74,188 L118,124', // flute
  'M178,228 L132,256 L238,276', // folded leg
  'M238,226 L272,252 L240,350', // lowered leg
  ellipse(205, 298, 104, 12), // seat
].map((d) => hand(d, 1.2)) // guide lines are looser

/* ---- 2. contours, in drawing order ----
   w: stroke weight (b = bold, n = normal, t = thin)
   re: gets a second, darker re-lining pass */
export const contours = [
  // crown
  { d: 'M184,80 L188,62 Q196,52 200,40 Q205,30 210,40 Q214,52 222,62 L226,80', w: 'b', re: true },
  { d: 'M181,82 Q205,74 229,82', w: 'n' },
  { d: 'M185,78 q4,-5 8,0 q4,-5 8,0 q4,-5 8,0 q4,-5 8,0 q4,-5 8,0', w: 't' },
  { d: 'M189,62 Q205,56 221,62', w: 't' },
  { d: 'M195,48 Q205,44 215,48', w: 't' },
  { d: 'M205,31 L205,24', w: 'n' },
  { d: 'M184,80 C176,76 173,68 178,62', w: 't' },
  { d: 'M226,80 C234,76 237,68 232,62', w: 't' },

  // face & ears
  { d: 'M187,83 C180,91 179,105 184,117', w: 'n' },
  { d: 'M223,83 C230,91 231,105 226,117', w: 'n' },
  { d: 'M185,88 C163,76 141,86 142,108 C143,128 161,139 183,125', w: 'b', re: true },
  { d: 'M225,88 C247,76 269,86 268,108 C267,128 249,139 227,125', w: 'b', re: true },
  { d: 'M182,96 C166,90 154,98 155,110 C156,121 167,125 180,119', w: 't' },
  { d: 'M228,96 C244,90 256,98 255,110 C254,121 243,125 230,119', w: 't' },
  { d: 'M191,100 Q196,95 201,100 Q196,103 191,100', w: 'n' },
  { d: 'M209,100 Q214,95 219,100 Q214,103 209,100', w: 'n' },

  // trunk, curling to his left
  { d: 'M198,109 C195,132 197,152 205,166 C211,177 228,179 234,169 C239,159 231,151 223,157', w: 'b', re: true },
  { d: 'M212,109 C214,127 213,141 216,151 C219,159 226,162 229,157', w: 'n' },
  { d: 'M198,121 Q205,125 212,121', w: 't' },
  { d: 'M198,133 Q205,137 213,133', w: 't' },
  { d: 'M200,145 Q207,149 214,144', w: 't' },
  { d: 'M193,117 C186,125 184,133 189,139', w: 'n' },
  { d: 'M196,118 C192,126 191,133 189,139', w: 'n' },
  { d: 'M184,117 C186,127 191,133 197,133', w: 't' },
  { d: 'M226,117 C225,124 222,129 217,131', w: 't' },

  // upper right arm, raised in blessing
  { d: 'M171,129 C151,121 135,108 129,94 C124,84 120,78 117,72', w: 'n', re: true },
  { d: 'M177,140 C159,131 147,118 141,104 C136,94 132,84 130,74', w: 't' },
  { d: 'M115,72 C109,62 107,50 110,38 Q112,30 117,32 Q121,26 125,30 Q130,26 133,31 Q138,29 139,36 C140,48 136,60 131,74', w: 'n', re: true },
  { d: 'M117,32 L118,50', w: 't' },
  { d: 'M125,30 L125,49', w: 't' },
  { d: 'M133,31 L132,50', w: 't' },
  { d: 'M132,62 C138,56 143,55 145,59 C146,63 140,69 133,71', w: 't' },
  { d: 'M115,73 Q123,77 131,74', w: 't' },
  { d: 'M115,77 Q123,81 131,78', w: 't' },
  { d: 'M150,118 Q156,112 160,122', w: 't' },

  // upper left arm, holding a lotus
  { d: 'M238,126 C256,116 274,108 296,98', w: 'n', re: true },
  { d: 'M241,140 C260,130 280,122 300,110', w: 't' },
  { d: 'M296,96 C304,88 314,88 318,94 C322,100 316,110 306,112 C303,112 300,110 300,110', w: 'n' },
  { d: 'M296,97 Q299,104 300,110', w: 't' },
  { d: 'M262,112 Q268,118 266,126', w: 't' },
  { d: 'M311,90 C312,82 313,76 315,70', w: 't' },
  { d: 'M315,68 C309,60 310,50 315,44 C320,50 321,60 315,68', w: 'n' },
  { d: 'M315,68 C305,67 299,60 298,53 C306,54 313,61 315,68', w: 'n' },
  { d: 'M315,68 C325,67 331,60 332,53 C324,54 317,61 315,68', w: 'n' },
  { d: 'M315,68 C303,72 293,68 290,62 C300,61 310,64 315,68', w: 't' },
  { d: 'M315,68 C327,72 337,68 340,62 C330,61 320,64 315,68', w: 't' },

  // lower right arm, holding the flute
  { d: 'M167,150 C145,144 120,144 101,147', w: 'n', re: true },
  { d: 'M166,166 C143,162 120,162 103,164', w: 't' },
  { d: 'M101,145 C93,143 87,149 89,157 C91,165 99,167 105,163', w: 'n' },
  { d: 'M101,146 Q98,155 103,164', w: 't' },
  { d: 'M74,187 L114,126', w: 'n' },
  { d: 'M78,190 L118,129', w: 'n' },
  { d: 'M114,126 Q117,125 118,129', w: 't' },
  { d: 'M74,187 Q75,191 78,190', w: 't' },
  { d: 'M76,190 C74,198 72,204 70,212', w: 't' },
  { d: 'M78,191 C78,199 78,205 77,212', w: 't' },

  // lower left arm, resting on the throne
  { d: 'M244,160 C262,168 280,180 294,190', w: 'n', re: true },
  { d: 'M240,176 C258,184 274,196 288,204', w: 't' },
  { d: 'M292,188 C302,188 310,194 312,202 L314,214', w: 'n' },
  { d: 'M306,198 L308,216', w: 't' },
  { d: 'M300,201 L300,217', w: 't' },
  { d: 'M290,190 Q287,198 288,204', w: 't' },
  { d: 'M288,204 C292,212 298,216 306,216', w: 't' },

  // torso, necklaces, garlands
  { d: 'M170,135 C162,153 160,171 166,186', w: 'n' },
  { d: 'M240,135 C248,153 250,171 244,186', w: 'n' },
  { d: 'M182,130 C188,148 222,148 228,130', w: 'n' },
  { d: 'M205,147 C200,152 200,158 205,162 C210,158 210,152 205,147', w: 't' },
  // garlands draped across the chest, down to the belly
  { d: 'M176,132 C176,166 192,184 205,186 C218,184 234,166 234,132', w: 't' },
  { d: 'M180,131 C181,160 194,175 205,177 C216,175 229,160 230,131', w: 't' },
  { d: 'M201,186 L205,196 L209,186', w: 't' },
  { d: 'M166,186 C152,202 158,222 176,228 C192,232 218,232 234,228 C252,222 258,202 244,186', w: 'b', re: true },
  { d: 'M161,212 C188,224 222,224 249,212', w: 'n' },
  { d: 'M196,196 C196,192 203,192 203,196 C203,200 198,200 198,197', w: 't' },

  // the sash, falling past both arms
  { d: 'M150,166 C142,196 138,236 137,286', w: 't' },
  { d: 'M160,168 C152,198 149,236 148,284', w: 't' },
  { d: 'M137,286 L148,284', w: 't' },
  { d: 'M286,206 C292,230 296,256 298,280', w: 't' },
  { d: 'M297,208 C303,232 306,256 308,278', w: 't' },
  { d: 'M298,280 L308,278', w: 't' },

  // legs & dhoti: one folded, one lowered
  { d: 'M168,226 C150,232 136,240 130,252 C126,262 134,272 148,272', w: 'b', re: true },
  { d: 'M148,272 C178,276 210,278 236,276', w: 'n' },
  { d: 'M236,268 C244,262 256,264 258,272 C252,280 242,280 236,276', w: 'n' },
  { d: 'M240,226 C258,230 270,238 272,252', w: 'b', re: true },
  { d: 'M272,252 C272,282 262,312 247,336', w: 'n', re: true },
  { d: 'M240,272 C238,296 232,318 226,336', w: 'n' },
  { d: 'M225,338 C220,346 224,352 236,352 C248,352 256,348 252,340', w: 'n' },
  { d: 'M228,334 Q238,338 248,334', w: 't' },
  { d: 'M231,347 L231,352', w: 't' },
  { d: 'M237,348 L237,353', w: 't' },
  { d: 'M243,347 L243,352', w: 't' },
  { d: 'M200,232 C206,256 214,284 226,318', w: 't' },
  { d: 'M184,234 C196,250 210,260 224,266', w: 't' },
  { d: 'M250,242 C255,262 256,284 252,306', w: 't' },
  { d: 'M146,252 C164,256 184,258 204,258', w: 't' },

  // the serpent-hooded throne
  { d: 'M102,312 C94,290 102,266 118,260 C130,268 132,290 126,312', w: 'n' },
  { d: 'M110,306 C106,290 110,276 118,272', w: 't' },
  { d: 'M84,318 C78,300 84,282 96,278 C104,284 106,300 102,318', w: 't' },
  { d: 'M284,312 C278,292 284,270 300,264 C314,272 316,292 308,312', w: 'n' },
  { d: 'M300,276 C306,282 306,296 302,306', w: 't' },
  { d: 'M308,318 C304,300 310,284 322,282 C330,290 332,304 326,318', w: 't' },
  { d: 'M90,320 C150,310 260,310 320,320', w: 'n' },
  { d: 'M92,332 C150,324 260,324 318,332', w: 't' },
  { d: 'M212,352 L262,352 L264,360 L210,360 Z', w: 'n' },
  ...Array.from({ length: 10 }, (_, i) => {
    const x = 94 + i * 22.4
    return { d: `M${r1(x)},366 C${r1(x + 2)},357 ${r1(x + 7)},351 ${r1(x + 11.2)},348 C${r1(x + 15.4)},351 ${r1(x + 20.4)},357 ${r1(x + 22.4)},366`, w: 't' }
  }),
  { d: 'M88,367 C150,372 260,372 322,367', w: 'n' },

  // his mouse, at the foot of the throne
  { d: 'M112,350 C112,340 126,334 136,340 C142,344 140,352 132,354 C124,356 112,356 112,350', w: 'n' },
  { d: 'M126,338 C124,332 130,330 132,336', w: 't' },
  { d: 'M136,340 C142,342 146,346 142,350', w: 't' },
  { d: 'M112,352 C102,356 98,350 90,356', w: 't' },

  // lotus buds rising behind the crown
  { d: 'M199,38 C196,26 190,16 182,8', w: 't' },
  { d: 'M182,8 C176,4 174,-3 178,-7 C183,-4 185,3 182,8', w: 't' },
  { d: 'M211,38 C215,26 222,16 230,10', w: 't' },
  { d: 'M230,10 C232,3 238,-1 242,1 C241,6 236,10 230,10', w: 't' },

  // the halo, last
  { d: circle(HX, HY, 76), w: 't' },
  { d: circle(HX, HY, 69), w: 't' },
].map((c) => ({ ...c, d: hand(c.d) }))

/* ---- 3. shading: clip regions + hatching ---- */
export const clips = {
  'g-ear-l': 'M185,88 C163,76 141,86 142,108 C143,128 161,139 183,125 Z',
  'g-ear-r': 'M225,88 C247,76 269,86 268,108 C267,128 249,139 227,125 Z',
  'g-crown': 'M184,80 L188,62 Q196,52 200,40 Q205,30 210,40 Q214,52 222,62 L226,80 Z',
  'g-dhoti':
    'M162,214 C150,228 130,240 128,256 C127,270 140,274 150,274 C180,278 212,280 238,278 L247,336 C262,312 272,282 272,252 C270,236 258,226 248,214 Z',
  'g-belly': 'M166,186 C152,202 158,222 176,228 C192,232 218,232 234,228 C252,222 258,202 244,186 Z',
  'g-hood-l': 'M84,318 C78,296 88,268 118,260 C130,268 134,292 126,318 Z',
  'g-hood-r': 'M284,318 C278,292 286,268 300,264 C318,272 332,296 326,318 Z',
  'g-seat': 'M90,320 C150,310 260,310 320,320 L318,334 L92,334 Z',
}

export const hatching = [
  { clip: 'g-ear-l', lines: hatchSet(138, 188, 76, 140, 6, -16) },
  { clip: 'g-ear-r', lines: hatchSet(222, 272, 76, 140, 6, 16) },
  { clip: 'g-crown', lines: hatchSet(182, 230, 28, 82, 5, -10) },
  // the dark dhoti: two crossing passes
  { clip: 'g-dhoti', lines: hatchSet(110, 290, 210, 340, 4.5, 26) },
  { clip: 'g-dhoti', lines: hatchSet(150, 320, 210, 340, 6.5, -30) },
  { clip: 'g-belly', lines: hatchSet(224, 262, 184, 232, 5, -14) },
  { clip: 'g-hood-l', lines: hatchSet(76, 136, 258, 320, 5.5, 12) },
  { clip: 'g-hood-r', lines: hatchSet(276, 336, 258, 320, 5.5, -12) },
  { clip: 'g-seat', lines: hatchSet(80, 330, 308, 336, 7, 8) },
]

/* ---- 4. soft graphite tone (blended) ---- */
export const smudges = [
  { cx: 208, cy: 262, rx: 52, ry: 34, o: 0.3 }, // dhoti
  { cx: 236, cy: 206, rx: 18, ry: 22, o: 0.18 }, // belly shadow
  { cx: 205, cy: 130, rx: 30, ry: 8, o: 0.16 }, // under the chin
  { cx: 205, cy: 324, rx: 112, ry: 9, o: 0.22 }, // seat
  { cx: 205, cy: 368, rx: 118, ry: 6, o: 0.2 }, // base
  { cx: 108, cy: 296, rx: 22, ry: 26, o: 0.14 }, // left hoods
  { cx: 304, cy: 296, rx: 22, ry: 26, o: 0.14 }, // right hoods
]

/* ---- 5. finishing marks ---- */
export const pupils = [
  [196, 99.6, 1.7],
  [214, 99.6, 1.7],
]

// beads around the halo, skipping the arcs hidden behind the arms
const haloBeads = Array.from({ length: 24 }, (_, i) => (i / 24) * Math.PI * 2)
  .filter((a) => {
    const deg = (a * 180) / Math.PI
    return !(deg > 140 && deg < 215) && !(deg > 318 || deg < 30) && !(deg > 60 && deg < 120)
  })
  .map((a) => [r1(HX + Math.cos(a) * 72.5), r1(HY + Math.sin(a) * 72.5), 0.9])

export const jewels = [
  [205, 21, 1.9], // crown finial
  [205, 66, 1.8],
  [195, 71, 1.1],
  [215, 71, 1.1],
  [205, 53, 1.2],
  [205, 155, 1.3], // pendant
  [134, 344, 1.3], // the mouse's eye
  [82, 177, 0.9], // flute holes
  [86.5, 170, 0.9],
  [108, 138, 0.9],
  [112.5, 131, 0.9],
  [292, 210, 1], // ring
  ...haloBeads,
]
export const tilak = 'M205,82 L205,92'
export const bindu = [205, 95, 1.6]
