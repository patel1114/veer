<script setup>
import WaIcon from './WaIcon.vue'
/* ============================================================
   ArtworkViewer — full-screen study of one drawing.
   - Opens with a FLIP morph from the clicked thumbnail.
   - Mouse: a 2.6× loupe follows the cursor.
   - Touch: tap to zoom 2.6× at that point, drag to pan, tap again to
     fit. Swipe left/right (when not zoomed) to move between pieces.
   - Keyboard: ← → to move, Esc to close.
   - Per-piece CTA: "Order one like this" pre-fills WhatsApp.
   ============================================================ */
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { ui, closeViewer } from '../stores/ui'
import { waUrl } from '../data/site'
import { gsap, finePointer, reducedMotion, lockScroll, unlockScroll } from '../composables/motion'

const root = ref(null)
const imgBox = ref(null)
const closeBtn = ref(null)
const items = computed(() => ui.viewer.items)
const index = computed(() => ui.viewer.index)
const art = computed(() => items.value[index.value])
const pad = (n) => String(n).padStart(2, '0')
const dir = ref(1)
const descOpen = ref(false)
let lastFocus = null
let closing = false

const orderUrl = computed(() =>
  waUrl(`Hi Veer! I saw "${art.value?.title}" on your portfolio and I'd like to order a sketch like it. Could you share details?`),
)

/* ---- navigation ---- */
const go = (step) => {
  if (items.value.length < 2) return
  resetZoom()
  dir.value = step
  ui.viewer.index = (index.value + step + items.value.length) % items.value.length
}

const close = () => {
  if (closing) return
  closing = true
  if (reducedMotion) return closeViewer()
  gsap
    .timeline({ onComplete: closeViewer })
    .to('.v-panel > *, .v-ui', { opacity: 0, y: 12, duration: 0.3, stagger: 0.02, ease: 'power2.in' }, 0)
    .to(imgBox.value, { opacity: 0, scale: 0.94, duration: 0.45, ease: 'power3.in' }, 0)
    .to(root.value, { opacity: 0, duration: 0.45, ease: 'power2.in' }, 0.15)
}

const onKey = (e) => {
  if (e.key === 'Escape') close()
  else if (e.key === 'ArrowRight') go(1)
  else if (e.key === 'ArrowLeft') go(-1)
}

/* ---- touch: tap-to-zoom, drag-to-pan, swipe-to-navigate ---- */
const ZOOM = 2.6
const zoom = ref({ on: false, s: 1, x: 0, y: 0 })
let touch = null

const resetZoom = () => (zoom.value = { on: false, s: 1, x: 0, y: 0 })

const clampPan = (x, y, s) => {
  // the frame never scales — only the <img> inside it does
  const r = imgBox.value.getBoundingClientRect()
  const w = r.width
  const h = r.height
  return {
    x: Math.min(0, Math.max(-(s - 1) * w, x)),
    y: Math.min(0, Math.max(-(s - 1) * h, y)),
  }
}

const onPointerDown = (e) => {
  if (e.pointerType === 'mouse') return
  touch = { id: e.pointerId, x0: e.clientX, y0: e.clientY, t0: performance.now(), px: zoom.value.x, py: zoom.value.y, moved: false }
}

const onPointerMove = (e) => {
  if (e.pointerType === 'mouse') return onLoupe(e)
  if (!touch || e.pointerId !== touch.id) return
  const dx = e.clientX - touch.x0
  const dy = e.clientY - touch.y0
  if (Math.hypot(dx, dy) > 8) touch.moved = true
  if (zoom.value.on) {
    const p = clampPan(touch.px + dx, touch.py + dy, zoom.value.s)
    zoom.value = { ...zoom.value, ...p }
  }
}

const onPointerUp = (e) => {
  if (e.pointerType === 'mouse' || !touch) return
  const dx = e.clientX - touch.x0
  const dy = e.clientY - touch.y0
  const quick = performance.now() - touch.t0 < 350
  if (!touch.moved && quick) {
    // tap → toggle zoom at the tapped point
    if (zoom.value.on) resetZoom()
    else {
      const r = imgBox.value.getBoundingClientRect()
      const px = e.clientX - r.left
      const py = e.clientY - r.top
      zoom.value = { on: true, s: ZOOM, x: -(ZOOM - 1) * px, y: -(ZOOM - 1) * py }
    }
  } else if (!zoom.value.on && Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) {
    go(dx < 0 ? 1 : -1) // swipe
  }
  touch = null
}

/* swipes that start outside the image (e.g. on the sheet) still navigate */
let sx = 0, sy = 0
const onTouchStart = (e) => {
  sx = e.touches[0].clientX
  sy = e.touches[0].clientY
}
const onTouchEnd = (e) => {
  if (e.target.closest('.v-img')) return
  const dx = e.changedTouches[0].clientX - sx
  const dy = e.changedTouches[0].clientY - sy
  if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) go(dx < 0 ? 1 : -1)
}

/* ---- mouse loupe ---- */
const loupe = ref({ on: false, x: 0, y: 0, bx: 0, by: 0, bw: 0, bh: 0 })
const SIZE = 220
const onLoupe = (e) => {
  if (!finePointer) return
  const r = imgBox.value.getBoundingClientRect()
  const x = e.clientX - r.left
  const y = e.clientY - r.top
  loupe.value = {
    on: x >= 0 && y >= 0 && x <= r.width && y <= r.height,
    x,
    y,
    bw: r.width * ZOOM,
    bh: r.height * ZOOM,
    bx: -(x * ZOOM - SIZE / 2),
    by: -(y * ZOOM - SIZE / 2),
  }
}
const offLoupe = () => (loupe.value.on = false)

/* ---- image change: directional wipe ---- */
watch(index, async () => {
  offLoupe()
  descOpen.value = false
  if (reducedMotion) return
  await nextTick()
  gsap.fromTo(
    imgBox.value,
    { clipPath: dir.value > 0 ? 'inset(0 0 0 100%)' : 'inset(0 100% 0 0)' },
    { clipPath: 'inset(0 0 0 0%)', duration: 0.9, ease: 'expo.out' },
  )
  gsap.fromTo('.v-panel .v-anim', { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.7, stagger: 0.05, ease: 'power3.out' })
})

/* ---- open: FLIP from the thumbnail ---- */
onMounted(async () => {
  lastFocus = document.activeElement
  lockScroll()
  document.addEventListener('keydown', onKey)
  await nextTick()
  closeBtn.value?.focus({ preventScroll: true, focusVisible: false })
  if (reducedMotion) return

  const tl = gsap.timeline()
  tl.fromTo(root.value, { opacity: 0 }, { opacity: 1, duration: 0.45, ease: 'power2.out' }, 0)

  const from = ui.viewer.originRect
  const to = imgBox.value.getBoundingClientRect()
  if (from && to.width) {
    tl.fromTo(
      imgBox.value,
      {
        x: from.left - to.left,
        y: from.top - to.top,
        scaleX: from.width / to.width,
        scaleY: from.height / to.height,
        transformOrigin: '0 0',
      },
      { x: 0, y: 0, scaleX: 1, scaleY: 1, duration: 1, ease: 'expo.inOut', clearProps: 'transform' },
      0,
    )
  } else {
    tl.fromTo(
      imgBox.value,
      { clipPath: 'inset(100% 0 0 0)', scale: 1.06 },
      { clipPath: 'inset(0% 0 0 0)', scale: 1, duration: 1, ease: 'expo.inOut', clearProps: 'transform' },
      0,
    )
  }
  tl.fromTo(
    '.v-panel > *, .v-ui',
    { opacity: 0, y: 18 },
    { opacity: 1, y: 0, duration: 0.8, stagger: 0.05, ease: 'power3.out' },
    0.5,
  )
})

onUnmounted(() => {
  document.removeEventListener('keydown', onKey)
  unlockScroll()
  lastFocus?.focus?.({ preventScroll: true })
})
</script>

<template>
  <div
    v-if="art"
    ref="root"
    class="viewer"
    role="dialog"
    aria-modal="true"
    :aria-label="`${art.title} — ${index + 1} of ${items.length}`"
    @touchstart.passive="onTouchStart"
    @touchend.passive="onTouchEnd"
  >
    <aside class="v-panel">
      <span class="label v-anim v-count">{{ pad(index + 1) }} / {{ pad(items.length) }} · {{ art.category }}</span>
      <h2 class="v-title v-anim">{{ art.title }}</h2>
      <p class="label v-sub v-anim">{{ art.medium }} · {{ art.year }}</p>
      <p class="v-desc v-anim" :class="{ open: descOpen }" @click="descOpen = !descOpen">{{ art.description }}</p>
      <dl class="v-meta v-anim">
        <div><dt class="label">Medium</dt><dd>{{ art.medium }}</dd></div>
        <div><dt class="label">Year</dt><dd>{{ art.year }}</dd></div>
      </dl>
      <a :href="orderUrl" target="_blank" rel="noopener" class="pill pill--wa v-cta v-anim">
          <WaIcon />
        <span class="roll"><span>Order one like this</span><span aria-hidden="true">Order one like this</span></span>
        <span class="arrow">→</span>
      </a>
      <p class="label v-hint v-anim">
        <span class="hint-mouse">Hover the drawing to magnify</span>
        <span class="hint-touch">{{ zoom.on ? 'Drag to explore · tap to fit' : 'Tap the drawing to zoom in' }}</span>
      </p>
    </aside>

    <div class="v-stage" @click.self="close">
      <div
        ref="imgBox"
        class="v-img"
        :class="{ zoomed: zoom.on }"
        :style="{ '--ar': art.aspect }"
        :data-cursor="finePointer ? 'loupe' : null"
        @pointerdown="onPointerDown"
        @pointermove="onPointerMove"
        @pointerup="onPointerUp"
        @pointercancel="touch = null"
        @pointerleave="offLoupe"
      >
        <img
          :key="art.id"
          :src="art.image"
          :alt="`${art.title} — ${art.medium}`"
          draggable="false"
          :style="zoom.on || zoom.s !== 1 ? { transform: `translate(${zoom.x}px, ${zoom.y}px) scale(${zoom.s})` } : null"
        />
        <span
          v-if="finePointer"
          class="loupe"
          :class="{ on: loupe.on }"
          :style="{
            transform: `translate(${loupe.x - 110}px, ${loupe.y - 110}px)`,
            backgroundImage: `url(${art.image})`,
            backgroundSize: `${loupe.bw}px ${loupe.bh}px`,
            backgroundPosition: `${loupe.bx}px ${loupe.by}px`,
          }"
          aria-hidden="true"
        ></span>
      </div>
    </div>

    <div class="v-ui">
      <button class="v-btn tap" aria-label="Previous drawing" :disabled="items.length < 2" @click="go(-1)">
        <span aria-hidden="true">←</span>
      </button>
      <button class="v-btn tap" aria-label="Next drawing" :disabled="items.length < 2" @click="go(1)">
        <span aria-hidden="true">→</span>
      </button>
    </div>

    <button ref="closeBtn" class="v-close" aria-label="Close viewer" @click="close">
      <span class="roll v-close-text"><span>Close</span><span aria-hidden="true">Close</span></span>
      <span class="v-x" aria-hidden="true"></span>
    </button>
  </div>
</template>

<style scoped>
.viewer {
  /* the viewer is always "night", regardless of page theme */
  --bg: var(--graphite-950);
  --bg-raised: var(--graphite-900);
  --fg: var(--paper-50);
  --fg-soft: #c9c6bf;
  --fg-mute: var(--graphite-400);
  --line: rgba(243, 241, 236, 0.12);
  --line-strong: rgba(243, 241, 236, 0.28);

  position: fixed;
  inset: 0;
  z-index: 500;
  background: rgba(12, 12, 11, 0.985);
  color: var(--fg);
  display: grid;
  grid-template-columns: minmax(280px, 380px) 1fr;
  grid-template-rows: 1fr auto;
  gap: 0 var(--gutter);
  padding: calc(var(--header-h) + 8px) var(--gutter) var(--gutter);
}

.v-panel {
  grid-row: 1 / 3;
  align-self: end;
  display: grid;
  gap: 1.1rem;
  align-content: end;
  padding-bottom: 0.25rem;
}

.v-count {
  color: var(--accent);
}

.v-title {
  font-size: clamp(2.2rem, 3.6vw, 3.8rem);
  line-height: 0.95;
  letter-spacing: -0.035em;
}

.v-sub {
  display: none;
}

.v-desc {
  color: var(--fg-soft);
  max-width: 36ch;
}

.v-meta {
  display: flex;
  gap: 2.5rem;
  margin: 0;
  padding-top: 1rem;
  border-top: 1px solid var(--line);
}

.v-meta dd {
  margin: 0.3rem 0 0;
  font-size: 0.95rem;
}

.v-cta {
  justify-self: start;
  margin-top: 0.5rem;
}

.v-hint {
  margin-top: 0.25rem;
}

.hint-touch {
  display: none;
}

@media (hover: none) {
  .hint-mouse { display: none; }
  .hint-touch { display: inline; }
}

.v-stage {
  grid-column: 2;
  grid-row: 1;
  min-height: 0;
  container-type: size;
  display: grid;
  place-items: center;
}

.v-img {
  position: relative;
  aspect-ratio: var(--ar);
  height: min(100cqh, 100cqw / var(--ar));
  box-shadow: 0 60px 120px -50px rgba(0, 0, 0, 0.9);
  background: #efeee9;
  will-change: transform;
}

.v-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform-origin: 0 0;
  user-select: none;
  -webkit-user-select: none;
  -webkit-touch-callout: none;
}

/* touch zoom: clip to the frame, animate taps but not drags */
@media (hover: none) {
  .v-img {
    overflow: hidden;
    touch-action: none;
  }
  .v-img img {
    transition: transform 0.45s var(--ease-out);
  }
  .v-img.zoomed img {
    transition: none;
  }
}

.loupe {
  position: absolute;
  left: 0;
  top: 0;
  width: 220px;
  height: 220px;
  border-radius: 50%;
  background-repeat: no-repeat;
  border: 1.5px solid var(--paper-50);
  box-shadow:
    0 0 0 1px rgba(0, 0, 0, 0.25),
    0 30px 60px -20px rgba(0, 0, 0, 0.7);
  pointer-events: none;
  opacity: 0;
  scale: 0.6;
  transition:
    opacity 0.25s ease,
    scale 0.4s var(--ease-out);
}

.loupe.on {
  opacity: 1;
  scale: 1;
}

.v-ui {
  grid-column: 2;
  grid-row: 2;
  display: flex;
  justify-content: center;
  gap: 0.75rem;
  padding-top: 1rem;
}

.v-btn {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  border: 1px solid var(--line-strong);
  background: none;
  cursor: pointer;
  font-size: 1.1rem;
  transition:
    background-color 0.4s ease,
    color 0.4s ease,
    border-color 0.4s ease,
    transform 0.25s var(--ease-out);
}

.v-btn:hover:not(:disabled) {
  background: var(--fg);
  color: var(--bg);
  border-color: var(--fg);
}

.v-btn:disabled {
  opacity: 0.3;
  cursor: default;
}

.v-close {
  position: absolute;
  top: calc(var(--header-h) / 2 - 22px);
  right: var(--gutter);
  height: 44px;
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0 0 0 1rem;
  background: none;
  border: 0;
  cursor: pointer;
  font-size: 0.9rem;
}

.v-close:focus:not(:focus-visible) {
  outline: none;
}

.v-x {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 1px solid var(--line-strong);
  position: relative;
  transition: transform 0.6s var(--ease-out);
}

.v-x::before,
.v-x::after {
  content: '';
  position: absolute;
  left: 13px;
  right: 13px;
  top: 50%;
  height: 1.5px;
  background: currentColor;
  transform: rotate(45deg);
}

.v-x::after {
  transform: rotate(-45deg);
}

.v-close:hover .v-x {
  transform: rotate(90deg);
}

/* ============================================================
   Phones — drawing first, compact sheet in the thumb zone
   ============================================================ */
@media (max-width: 900px) {
  .viewer {
    height: 100dvh;
    grid-template-columns: 1fr;
    grid-template-rows: minmax(0, 1fr) auto;
    gap: 0;
    padding: calc(var(--header-h) + 4px) 0 calc(14px + env(safe-area-inset-bottom, 0px));
  }

  .v-stage {
    grid-column: 1;
    grid-row: 1;
    padding: 0 12px;
  }

  .v-img {
    box-shadow: none;
  }

  .v-panel {
    grid-column: 1;
    grid-row: 2;
    gap: 0.4rem;
    padding: 18px var(--gutter) 0;
    align-self: start;
  }

  .v-title {
    font-size: clamp(1.7rem, 8vw, 2.4rem);
    line-height: 1;
  }

  .v-sub {
    display: block;
  }

  .v-count .cat,
  .v-meta {
    display: none;
  }

  .v-desc {
    font-size: 0.92rem;
    line-height: 1.45;
    max-width: none;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    margin-top: 0.2rem;
  }

  .v-desc.open {
    -webkit-line-clamp: unset;
  }

  .v-cta {
    margin-top: 0.7rem;
    min-height: 52px;
  }

  .v-hint {
    order: -1;
    margin: 0 0 0.25rem;
    color: var(--fg-mute);
  }

  /* prev/next sit level with the CTA, right-aligned */
  .v-ui {
    grid-column: 1;
    grid-row: 2;
    align-self: end;
    justify-self: end;
    padding: 0 var(--gutter) 0 0;
    gap: 8px;
  }

  .v-btn {
    width: 52px;
    height: 52px;
  }

  .v-close {
    top: calc(var(--header-h) / 2 - 22px);
    right: 12px;
  }

  .v-close-text {
    display: none;
  }
}
</style>
