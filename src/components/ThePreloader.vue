<script setup>
/* ============================================================
   Preloader — an artist sketching Lord Ganesha from scratch.

   The way a real drawing comes together:
     1. light construction lines block in the proportions
     2. contours go down over them, head first, at hand speed
        (each stroke's duration follows its length)
     3. key contours get a second, darker re-lining pass
     4. pencil hatching in the shadows, then blended graphite tone
     5. guide lines fade back as if lightly erased; the tilak goes
        on in sindoor; the signature is traced and inked
   A real pencil rides every stroke. Then a charcoal sweep with a
   rough brush edge wipes up and becomes the (dark) site.
   The sequence never ends before the hero drawing + fonts load.
   ============================================================ */
import { onMounted, onUnmounted, ref } from 'vue'
import { gsap, reducedMotion, lockScroll, unlockScroll } from '../composables/motion'
import { ui } from '../stores/ui'
import heroImg from '../assets/artworks/chief-minister.jpg'
import { construction, contours, clips, hatching, smudges, pupils, jewels, tilak, bindu } from '../data/ganesha'
import * as mono from '../data/monogram'

const root = ref(null)
const svg = ref(null)
const pencil = ref(null)
const sweep = ref(null)
const pct = ref(0)
const gone = ref(false)
let tl
let stopClock = () => {}

const relines = contours.filter((c) => c.re)
/* small, deterministic variation so no two strokes are identical */
const vary = (i) => 0.78 + ((i * 7919) % 23) / 100

const loadImage = (src) =>
  new Promise((res) => {
    const img = new Image()
    img.onload = img.onerror = res
    img.src = src
  })

const fontReady = () =>
  Promise.race([
    document.fonts?.load('italic 400 120px "Bodoni Moda"') ?? Promise.resolve(),
    new Promise((r) => setTimeout(r, 900)),
  ])

onMounted(async () => {
  if (reducedMotion) {
    ui.introDone = true
    gone.value = true
    return
  }
  lockScroll()
  const mobile = window.innerWidth <= 900
  const speed = mobile ? 1.55 : 1.35 // authored at 1×; tune the pace here

  let loaded = false
  const assets = Promise.all([loadImage(heroImg), fontReady()]).then(() => (loaded = true))

  /* ---- the pencil: follows the point being drawn ---- */
  // each stroke's own screen matrix (cached), so strokes inside
  // transformed groups — the monogram — are followed exactly
  let ctms = new WeakMap()
  const ctmOf = (el) => {
    let m = ctms.get(el)
    if (!m) ctms.set(el, (m = el.getScreenCTM()))
    return m
  }
  gsap.set(pencil.value, { transformOrigin: '0px 9px' })
  const setX = gsap.quickSetter(pencil.value, 'x', 'px')
  const setY = gsap.quickSetter(pencil.value, 'y', 'px')
  const setR = gsap.quickSetter(pencil.value, 'rotation', 'deg')
  let lastX = 0
  let tilt = 0
  const movePencil = (el, pt) => {
    const m = ctmOf(el)
    const x = m.a * pt.x + m.c * pt.y + m.e
    const y = m.b * pt.x + m.d * pt.y + m.f
    // the hand tilts a little with the direction of travel
    tilt += (gsap.utils.clamp(-7, 7, (x - lastX) * 0.9) - tilt) * 0.2
    lastX = x
    setX(x)
    setY(y)
    setR(-38 + tilt)
  }

  /* ---- a phase: strokes drawn one after another within [t0, t1],
          each taking time in proportion to its length ---- */
  const phase = (sel, t0, t1, { follow = true, ease = 'power1.inOut', overlap = 0 } = {}) => {
    const els = [...svg.value.querySelectorAll(sel)]
    if (!els.length) return
    const lens = els.map((el) => el.getTotalLength())
    const total = lens.reduce((a, b) => a + b, 0)
    let cursor = t0
    els.forEach((el, i) => {
      const len = lens[i]
      const slot = ((t1 - t0) * len) / total
      el.style.strokeDasharray = `${len} ${len}`
      el.style.strokeDashoffset = len
      const p = { v: 0 }
      tl.to(
        p,
        {
          v: 1,
          duration: Math.max(0.035, slot * (1 + overlap)),
          ease,
          onUpdate: () => {
            el.style.strokeDashoffset = len * (1 - p.v)
            if (follow) movePencil(el, el.getPointAtLength(len * p.v))
          },
        },
        cursor,
      )
      cursor += slot
    })
  }

  tl = gsap.timeline({ paused: true })

  // paper: grid + labels
  tl.fromTo('.pl-grid line', { scale: 0, transformOrigin: '50% 50%' }, { scale: 1, duration: 0.9, stagger: 0.04, ease: 'expo.out' }, 0)
    .fromTo('.pl-meta > *', { yPercent: 110 }, { yPercent: 0, duration: 0.8, stagger: 0.06, ease: 'expo.out' }, 0.1)
    .fromTo(pencil.value, { opacity: 0, scale: 0.9 }, { opacity: 1, scale: mobile ? 0.72 : 1, duration: 0.3, ease: 'power2.out' }, 0.05)

  // 1 — construction
  phase('.c-line', 0.15, 0.95, { ease: 'power2.out', overlap: 0.25 })
  // 2 — contours
  phase('.k-line', 0.95, 2.95)
  // 3 — re-lining (the hand firming up lines, no new travel)
  phase('.r-line', 2.75, 3.2, { follow: false, overlap: 0.6 })
  // 4 — hatching
  phase('.h-line', 2.95, 3.55, { ease: 'none' })
  tl.to('.smudge', { opacity: (i, el) => +el.dataset.o, duration: 0.7, stagger: 0.06, ease: 'power1.out' }, 3.25)
    .to('.c-line', { opacity: 0.16, duration: 0.7, ease: 'power1.inOut' }, 3.35)
    .fromTo('.g-dot', { opacity: 0, scale: 0, transformOrigin: '50% 50%' }, { opacity: 1, scale: 1, duration: 0.3, stagger: 0.05, ease: 'back.out(3)' }, 3.4)
  // 5 — tilak in sindoor, bindu
  phase('.g-tilak', 3.6, 3.74, { follow: true, ease: 'power2.out' })
  tl.fromTo('.g-bindu', { opacity: 0, scale: 0, transformOrigin: '50% 50%' }, { opacity: 1, scale: 1, duration: 0.3, ease: 'back.out(3)' }, 3.76)

  // 6 — the signature: the Veer Art monogram, drawn like the logo —
  //     ring, then the letters; thick stems traced, then inked
  phase('.m-ring', 3.8, 4.18, { ease: 'power2.inOut' })
  phase('.m-line', 4.18, 4.62)
  tl.to('.m-stem', { fillOpacity: 1, duration: 0.4, stagger: 0.08, ease: 'power2.out' }, 4.5)
    .fromTo('.m-word', { opacity: 0, letterSpacing: '0.6em' }, { opacity: 1, letterSpacing: '0.3em', duration: 0.7, ease: 'expo.out' }, 4.55)
    // the pencil lifts away
    .to(pencil.value, { x: '+=140', y: '-=90', rotation: -24, opacity: 0, duration: 0.55, ease: 'power2.in' }, 4.64)
    .fromTo('.pl-line', { yPercent: 110 }, { yPercent: 0, duration: 0.8, ease: 'expo.out' }, 4.62)
    .to({}, { duration: 0.15 })

  // counter: follows the drawing, but holds at 96% until assets are in
  tl.eventCallback('onUpdate', () => {
    const v = Math.round(tl.progress() * 100)
    pct.value = loaded ? v : Math.min(96, v)
  })

  const onResize = () => (ctms = new WeakMap())
  window.addEventListener('resize', onResize)

  /* Our own clock. The site disables GSAP's lag smoothing (for smooth
     scroll), so a slow first paint would make the drawing jump ahead and
     skip strokes. Instead we advance at most ~1/30 s per frame: on a slow
     device the sketch plays a little slower, but every stroke is seen. */
  let frozen = false
  let raf = 0
  let last = 0
  const drawn = new Promise((done) => {
    const step = (now) => {
      if (!last) last = now
      const dt = Math.min((now - last) / 1000, 1 / 30)
      last = now
      if (!frozen) tl.time(Math.min(tl.duration(), tl.time() + dt * speed))
      if (tl.time() >= tl.duration()) return done()
      raf = requestAnimationFrame(step)
    }
    // start after the first paint so frame one isn't lost to layout
    requestAnimationFrame(() => (raf = requestAnimationFrame(step)))
  })
  stopClock = () => cancelAnimationFrame(raf)
  if (import.meta.env.DEV) {
    // dev only: lets visual tests freeze the sketch at exact moments
    window.__splash = { tl, freeze: () => (frozen = true) }
  }
  await drawn
  await assets
  pct.value = 100
  window.removeEventListener('resize', onResize)

  // hand-off: charcoal sweep becomes the site
  const k = 1 / speed
  const exit = gsap.timeline({
    onComplete: () => {
      gone.value = true
      unlockScroll()
    },
  })
  exit
    .to('.pl-stage', { scale: 0.97, opacity: 0, duration: 0.7, ease: 'power3.in' }, 0.15)
    .to(sweep.value, { y: () => -sweep.value.offsetHeight, duration: 1.3 * k, ease: 'expo.inOut' }, 0.05)
    .add(() => (ui.introDone = true), 1.0 * k)
    .to(root.value, { opacity: 0, duration: 0.35, ease: 'power1.out' })
})

onUnmounted(() => {
  stopClock()
  tl?.kill()
})
</script>

<template>
  <div v-if="!gone" ref="root" class="pl" aria-hidden="true">
    <!-- proportion grid -->
    <svg class="pl-grid" preserveAspectRatio="none" viewBox="0 0 100 100">
      <line v-for="x in [12.5, 25, 37.5, 50, 62.5, 75, 87.5]" :key="'x' + x" :x1="x" y1="0" :x2="x" y2="100" />
      <line v-for="y in [20, 40, 60, 80]" :key="'y' + y" x1="0" :y1="y" x2="100" :y2="y" />
      <line class="diag" x1="0" y1="0" x2="100" y2="100" />
      <line class="diag" x1="100" y1="0" x2="0" y2="100" />
    </svg>

    <div class="pl-meta">
      <span class="label"><span>Veer — Studio sketchbook</span></span>
      <span class="label"><span>Graphite · Charcoal · Paper</span></span>
    </div>

    <div class="pl-stage">
      <div class="pl-art-wrap">
      <svg ref="svg" class="pl-art" viewBox="0 -10 400 502" fill="none">
        <defs>
          <radialGradient id="tone">
            <stop offset="0" stop-color="#2b2a26" stop-opacity="1" />
            <stop offset="1" stop-color="#2b2a26" stop-opacity="0" />
          </radialGradient>
          <clipPath v-for="(d, id) in clips" :id="id" :key="id"><path :d="d" /></clipPath>
        </defs>

        <!-- blended tone sits under the lines -->
        <g>
          <ellipse
            v-for="(s, i) in smudges"
            :key="'sm' + i"
            class="smudge"
            :cx="s.cx"
            :cy="s.cy"
            :rx="s.rx"
            :ry="s.ry"
            :data-o="s.o"
          />
        </g>

        <g class="art">
          <path v-for="(d, i) in construction" :key="'c' + i" class="s c-line" :d="d" />

          <g v-for="h in hatching" :key="h.clip" :clip-path="`url(#${h.clip})`">
            <path v-for="(d, i) in h.lines" :key="h.clip + i" class="s h-line" :d="d" :style="{ opacity: vary(i) * 0.6 }" />
          </g>

          <path
            v-for="(c, i) in contours"
            :key="'k' + i"
            class="s k-line"
            :class="`w-${c.w}`"
            :d="c.d"
            :style="{ opacity: vary(i) }"
          />
          <path v-for="(c, i) in relines" :key="'r' + i" class="s r-line" :d="c.d" transform="translate(0.7 0.45)" />

          <circle v-for="(p, i) in [...pupils, ...jewels]" :key="'d' + i" class="g-dot" :cx="p[0]" :cy="p[1]" :r="p[2]" />
          <path class="s g-tilak" :d="tilak" />
          <circle class="g-bindu" :cx="bindu[0]" :cy="bindu[1]" :r="bindu[2]" />
        </g>

        <!-- signature: the Veer Art monogram -->
        <g class="mono" transform="translate(141.5 374) scale(0.975)">
          <path v-for="(d, i) in mono.ring" :key="'mr' + i" class="s m-ring" :class="{ inner: i }" :d="d" />
          <path v-for="(d, i) in mono.stems" :key="'ms' + i" class="s m-line m-stem" :d="d" />
          <path v-for="(d, i) in mono.hairlines" :key="'mh' + i" class="s m-line" :d="d" />
          <text class="m-word" :x="mono.wordmark.x" :y="mono.wordmark.y" text-anchor="middle">{{ mono.wordmark.text }}</text>
        </g>
      </svg>
      </div>

      <p class="pl-line-wrap"><span class="pl-line label">Every portrait begins with a single line.</span></p>
    </div>

    <!-- the artist's pencil: point at the origin, body up and to the right -->
    <div ref="pencil" class="pencil">
      <svg viewBox="0 0 176 18" width="176" height="18">
        <defs>
          <linearGradient id="pc-body" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stop-color="#3b3b3a" />
            <stop offset="0.45" stop-color="#232322" />
            <stop offset="1" stop-color="#121211" />
          </linearGradient>
          <linearGradient id="pc-wood" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stop-color="#ecd5b0" />
            <stop offset="1" stop-color="#c9a77a" />
          </linearGradient>
        </defs>
        <path d="M0,9 L8,6.6 L8,11.4 Z" fill="#2a2a29" />
        <path d="M8,6.6 L28,0.5 Q30,3 28,5 Q31,9 28,13 Q30,15 28,17.5 L8,11.4 Z" fill="url(#pc-wood)" />
        <rect x="28" y="0.5" width="122" height="17" fill="url(#pc-body)" />
        <rect x="28" y="5.6" width="122" height="0.8" fill="#4a4a48" />
        <rect x="28" y="11.6" width="122" height="0.8" fill="#0a0a0a" />
        <text x="62" y="12" font-size="6.4" font-family="Geist Mono, monospace" letter-spacing="1.2" fill="#b9a27a">VEER · 4B</text>
        <rect x="150" y="0" width="9" height="18" fill="#b9a27a" />
        <rect x="152" y="0" width="1" height="18" fill="#8d7a56" />
        <rect x="156" y="0" width="1" height="18" fill="#8d7a56" />
        <path d="M159,0.5 L172,0.5 Q176,0.5 176,5 L176,13 Q176,17.5 172,17.5 L159,17.5 Z" fill="#c9786a" />
      </svg>
    </div>

    <div class="pl-count label">
      <span class="pl-dot"></span> Sketching&nbsp;<span class="num">{{ String(pct).padStart(3, '0') }}%</span>
    </div>

    <!-- charcoal sweep with a rough brush edge -->
    <div ref="sweep" class="sweep">
      <svg class="sweep-edge" viewBox="0 0 100 20" preserveAspectRatio="none">
        <defs>
          <filter id="charcoal" x="-5%" y="-40%" width="110%" height="180%">
            <feTurbulence type="fractalNoise" baseFrequency="0.9 0.35" numOctaves="3" seed="7" />
            <feDisplacementMap in="SourceGraphic" scale="3.2" />
          </filter>
        </defs>
        <path
          class="dry"
          d="M0,14 C4,9 7,16 11,11 C15,6 18,13 23,9 C27,5 31,12 35,8 C40,3 44,11 49,7 C53,3 57,10 62,6 C66,2 70,9 75,6 C79,3 83,10 88,7 C92,4 96,9 100,6 L100,40 L0,40 Z"
        />
        <path
          d="M0,17 C6,13 9,18 15,14 C21,10 26,16 33,12 C39,9 44,15 51,11 C57,8 63,14 70,10 C76,7 82,13 89,10 C94,8 97,12 100,10 L100,40 L0,40 Z"
        />
      </svg>
      <div class="sweep-body"></div>
    </div>
  </div>
</template>

<style scoped>
.pl {
  position: fixed;
  inset: 0;
  z-index: 1000;
  overflow: hidden;
  color: var(--graphite-950);
  background-color: var(--paper-50);
  /* paper tooth + a soft vignette */
  background-image:
    radial-gradient(120% 90% at 50% 40%, transparent 55%, rgba(60, 50, 30, 0.1) 100%),
    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0.35 0 0 0 0 0.32 0 0 0 0 0.27 0 0 0 0.14 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
}

/* ---- grid ---- */
.pl-grid {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.pl-grid line {
  stroke: rgba(12, 12, 11, 0.07);
  stroke-width: 1;
  vector-effect: non-scaling-stroke;
}

.pl-grid line.diag {
  stroke: rgba(12, 12, 11, 0.04);
}

/* ---- meta ---- */
.pl-meta {
  position: absolute;
  top: var(--gutter);
  left: var(--gutter);
  right: var(--gutter);
  display: flex;
  justify-content: space-between;
  overflow: hidden;
}

.pl-meta > * {
  display: block;
  color: #6f6b62;
}

/* ---- stage ---- */
.pl-stage {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  align-content: center;
  gap: clamp(4px, 1.4vh, 14px);
  padding: var(--gutter);
}

.pl-art {
  height: min(80svh, 760px);
  width: auto;
  max-width: 92vw;
  overflow: visible;
}

.pl-art-wrap {
  display: grid;
  place-items: center;
}

@media (max-width: 900px) {
  .pl-art {
    height: auto;
    width: min(94vw, 62svh);
  }
}

.s {
  fill: none;
  stroke-linecap: round;
  stroke-linejoin: round;
  /* hidden until the timeline measures and draws each stroke */
  stroke-dasharray: 3000;
  stroke-dashoffset: 3000;
}

/* construction: quick, light, a harder lead */
.c-line {
  stroke: #9b968b;
  stroke-width: 0.7;
}

/* contours: a soft 4B */
.k-line {
  stroke: #26251f;
}
.k-line.w-b { stroke-width: 1.7; }
.k-line.w-n { stroke-width: 1.25; }
.k-line.w-t { stroke-width: 0.85; stroke: #3b3a35; }

/* re-lining: darker, finer, slightly offset */
.r-line {
  stroke: #121211;
  stroke-width: 0.8;
  opacity: 0.75;
}

.h-line {
  stroke: #3a3934;
  stroke-width: 0.55;
}

.smudge {
  fill: url(#tone);
  opacity: 0;
}

.g-dot {
  fill: #141412;
  opacity: 0;
}

.g-tilak {
  stroke: var(--sindoor);
  stroke-width: 1.8;
}

.g-bindu {
  fill: var(--sindoor);
  opacity: 0;
}

/* signature: the monogram */
.m-ring {
  stroke: #1d1c19;
  stroke-width: 1.4;
}
.m-ring.inner {
  stroke-width: 0.65;
}
.m-line {
  stroke: #141412;
  stroke-width: 0.9;
  stroke-linecap: square;
}
.m-stem {
  fill: #141412;
  fill-opacity: 0;
  stroke-width: 0.6;
}
.m-word {
  font-family: var(--serif);
  font-size: 6.4px;
  font-weight: 500;
  letter-spacing: 0.3em;
  fill: #1d1c19;
  opacity: 0;
}

.pl-line-wrap {
  overflow: hidden;
  margin: 0;
}

.pl-line {
  display: block;
  color: #5d5a52;
  letter-spacing: 0.12em;
  text-align: center;
}

/* ---- the pencil ---- */
.pencil {
  position: absolute;
  left: 0;
  top: 0;
  width: 176px;
  height: 18px;
  margin-top: -9px; /* the point sits exactly on the line */
  transform-origin: 0 9px;
  pointer-events: none;
  opacity: 0;
  filter: drop-shadow(10px 16px 8px rgba(40, 30, 15, 0.22));
  will-change: transform;
}

.pencil svg {
  display: block;
}

/* ---- counter ---- */
.pl-count {
  position: absolute;
  left: var(--gutter);
  bottom: calc(var(--gutter) + env(safe-area-inset-bottom, 0px));
  display: inline-flex;
  align-items: center;
  color: #6f6b62;
}

.pl-count .num {
  color: var(--graphite-950);
  font-variant-numeric: tabular-nums;
}

.pl-dot {
  width: 7px;
  height: 7px;
  margin-right: 0.6rem;
  border-radius: 50%;
  background: var(--sindoor);
  animation: pulse 1.1s ease-in-out infinite;
}

@keyframes pulse {
  50% { opacity: 0.25; }
}

/* ---- charcoal sweep ---- */
.sweep {
  position: absolute;
  left: 0;
  right: 0;
  top: 100%;
  height: calc(100% + 16vh);
  pointer-events: none;
  will-change: transform;
}

.sweep-edge {
  display: block;
  width: 100%;
  height: 16vh;
  overflow: visible;
}

.sweep-edge path {
  fill: var(--graphite-950);
  filter: url(#charcoal);
}

.sweep-edge path.dry {
  opacity: 0.3;
}

.sweep-body {
  height: calc(100% - 16vh);
  margin-top: -3vh;
  position: relative;
  background: var(--graphite-950);
}

@media (max-width: 600px) {
  .pl-meta > *:last-child {
    display: none;
  }
  .pl-line {
    letter-spacing: 0.06em;
    max-width: 26ch;
    margin-inline: auto;
    text-wrap: balance;
    line-height: 1.6;
  }
}
</style>
