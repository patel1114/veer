<script setup>
/* ============================================================
   SketchCanvas — the drawing "draws itself".

   1. The real artwork is run through a Sobel edge pass once, on
      load, to produce a pencil-outline under-drawing.
   2. The finished graphite is revealed on top through a mask built
      from soft pencil stamps (they layer up like real graphite).
   3. `play` runs an intro hatching pass, which flows straight into
   4. the finishing pass: a fast shading sweep over the whole sheet
      that resolves to the complete drawing. Fully automatic.
   5. `fill` (0→1, driven by scroll) also resolves the whole drawing.
   ============================================================ */
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { reducedMotion } from '../composables/motion'

const props = defineProps({
  src: { type: String, required: true },
  alt: { type: String, default: '' },
  play: { type: Boolean, default: false },
  fill: { type: Number, default: 0 },
})
const emit = defineEmits(['ready', 'played', 'finished'])

const box = ref(null)
const canvas = ref(null)
const tip = ref({ x: 0, y: 0, on: false })
const done = ref(false)

let ctx, img, edge, mask, mctx, layer, lctx
let w = 0, h = 0, dpr = 1
let last = null
let raf = 0
let ro
let playing = false
let autoFill = 0 // 0→1 while the automatic finish runs
let run = 0 // token: a newer pass cancels an older one
const tri = (v) => 1 - Math.abs(((v % 2) + 2) % 2 - 1) // 0→1→0

/* ---- 1. Edge pass: photo of a drawing → its pencil outline ---- */
function buildEdge(image) {
  const ew = Math.min(720, image.naturalWidth)
  const eh = Math.round((ew * image.naturalHeight) / image.naturalWidth)
  const c = document.createElement('canvas')
  c.width = ew
  c.height = eh
  const cx = c.getContext('2d', { willReadFrequently: true })
  cx.drawImage(image, 0, 0, ew, eh)
  const src = cx.getImageData(0, 0, ew, eh)
  const d = src.data
  const lum = new Float32Array(ew * eh)
  for (let i = 0, p = 0; i < d.length; i += 4, p++) lum[p] = d[i] * 0.299 + d[i + 1] * 0.587 + d[i + 2] * 0.114

  const out = cx.createImageData(ew, eh)
  const o = out.data
  for (let y = 1; y < eh - 1; y++) {
    for (let x = 1; x < ew - 1; x++) {
      const i = y * ew + x
      const tl = lum[i - ew - 1], t = lum[i - ew], tr = lum[i - ew + 1]
      const l = lum[i - 1], r = lum[i + 1]
      const bl = lum[i + ew - 1], b = lum[i + ew], br = lum[i + ew + 1]
      const gx = -tl - 2 * l - bl + tr + 2 * r + br
      const gy = -tl - 2 * t - tr + bl + 2 * b + br
      let mag = Math.sqrt(gx * gx + gy * gy)
      mag = mag < 22 ? 0 : (mag - 22) * 1.15 // drop paper grain
      // faint tonal ghost so the under-drawing isn't just lines
      const tone = 236 + (lum[i] / 255) * 12
      const v = Math.max(40, tone - mag)
      const k = i * 4
      o[k] = v
      o[k + 1] = v - 1
      o[k + 2] = v - 4
      o[k + 3] = 255
    }
  }
  cx.putImageData(out, 0, 0)
  return c
}

/* ---- sizing ---- */
function resize() {
  const r = box.value.getBoundingClientRect()
  dpr = Math.min(window.devicePixelRatio || 1, 2)
  const nw = Math.round(r.width * dpr)
  const nh = Math.round(r.height * dpr)
  if (nw === w && nh === h) return
  // keep what's been drawn when the box resizes
  const prev = mask && w ? mask : null
  w = nw
  h = nh
  canvas.value.width = w
  canvas.value.height = h
  const m = document.createElement('canvas')
  m.width = w
  m.height = h
  const mc = m.getContext('2d')
  if (prev) mc.drawImage(prev, 0, 0, w, h)
  mask = m
  mctx = mc
  layer = document.createElement('canvas')
  layer.width = w
  layer.height = h
  lctx = layer.getContext('2d')
  requestDraw()
}

/* ---- compositing ---- */
function draw() {
  raf = 0
  if (!img || !edge || !w) return
  ctx.globalCompositeOperation = 'source-over'
  ctx.globalAlpha = 1
  ctx.drawImage(edge, 0, 0, w, h)

  lctx.globalCompositeOperation = 'source-over'
  lctx.clearRect(0, 0, w, h)
  lctx.drawImage(img, 0, 0, w, h)
  lctx.globalCompositeOperation = 'destination-in'
  lctx.drawImage(mask, 0, 0)
  ctx.drawImage(layer, 0, 0)

  const f = Math.max(props.fill, autoFill)
  if (f > 0) {
    ctx.globalAlpha = Math.min(1, f)
    ctx.drawImage(img, 0, 0, w, h)
    ctx.globalAlpha = 1
  }
}

function requestDraw() {
  if (!raf) raf = requestAnimationFrame(draw)
}

/* ---- 2. Brush: soft stamps spaced along the stroke ---- */
function stamp(x, y, r, a) {
  const g = mctx.createRadialGradient(x, y, 0, x, y, r)
  g.addColorStop(0, `rgba(0,0,0,${a})`)
  g.addColorStop(0.55, `rgba(0,0,0,${a * 0.55})`)
  g.addColorStop(1, 'rgba(0,0,0,0)')
  mctx.fillStyle = g
  mctx.beginPath()
  mctx.arc(x, y, r, 0, Math.PI * 2)
  mctx.fill()
}

function strokeTo(x, y, r = w * 0.085, a = 0.28) {
  if (!last) last = { x, y }
  const dx = x - last.x
  const dy = y - last.y
  const dist = Math.hypot(dx, dy)
  const step = Math.max(2, r * 0.22)
  for (let s = 0; s <= dist; s += step) {
    const t = dist ? s / dist : 0
    stamp(last.x + dx * t, last.y + dy * t, r, a)
  }
  last = { x, y }
  requestDraw()
}


/* ---- 4. Automatic finish on hover / tap ---- */
function finish() {
  if (done.value || !w) return
  const token = ++run // supersedes the intro pass if it's still going
  playing = true
  last = null
  const dur = reducedMotion ? 0 : 1600
  const sweeps = 7
  const from = autoFill
  const start = performance.now()
  const frame = (now) => {
    if (token !== run) return
    const t = dur ? Math.min(1, (now - start) / dur) : 1
    const e = 1 - Math.pow(1 - t, 2)
    const nx = 0.08 + 0.84 * tri(e * sweeps)
    const ny = 0.04 + 0.92 * e
    strokeTo(nx * w, ny * h, w * 0.16, 0.5)
    // the shading pass leads; the full tone settles in behind it
    const k = Math.max(0, (t - 0.35) / 0.65)
    autoFill = from + (1 - from) * (k * k * (3 - 2 * k))
    tip.value = { x: (nx * w) / dpr, y: (ny * h) / dpr, on: t < 1 }
    requestDraw()
    if (t < 1) requestAnimationFrame(frame)
    else complete()
  }
  requestAnimationFrame(frame)
}

function complete() {
  playing = false
  last = null
  autoFill = 1
  tip.value = { ...tip.value, on: false }
  done.value = true
  requestDraw()
  emit('finished')
}

/* ---- 3. Autoplay: a hatching pass, top to bottom ---- */
function autoplay() {
  if (playing || done.value || !w) return
  playing = true
  last = null
  const token = ++run
  const dur = 2600
  const sweeps = 9
  const start = performance.now()
  const frame = (now) => {
    if (token !== run) return
    const t = Math.min(1, (now - start) / dur)
    const e = 1 - Math.pow(1 - t, 1.6)
    const nx = 0.12 + 0.8 * tri(e * sweeps)
    const ny = 0.08 + 0.86 * e
    strokeTo(nx * w, ny * h, w * 0.11, 0.34)
    tip.value = { x: (nx * w) / dpr, y: (ny * h) / dpr, on: t < 1 }
    if (t < 1) requestAnimationFrame(frame)
    else {
      playing = false
      last = null
      emit('played')
      finish() // flows straight into the full drawing — no interaction needed
    }
  }
  requestAnimationFrame(frame)
}

watch(
  () => props.fill,
  (f) => {
    requestDraw()
    if (f >= 1 && !done.value) {
      run++ // stop any pass in progress
      complete()
    }
  },
)
watch(
  () => props.play,
  (p) => p && autoplay(),
)

onMounted(() => {
  ctx = canvas.value.getContext('2d')
  img = new Image()
  img.decoding = 'async'
  img.onload = () => {
    edge = buildEdge(img)
    resize()
    if (reducedMotion) {
      mctx.fillRect(0, 0, w, h)
      complete()
    }
    emit('ready')
    if (props.play) autoplay()
  }
  img.src = props.src
  ro = new ResizeObserver(() => img?.complete && edge && resize())
  ro.observe(box.value)
})

onUnmounted(() => {
  ro?.disconnect()
  cancelAnimationFrame(raf)
})
</script>

<template>
  <div
    ref="box"
    class="sketch"
    role="img"
    :aria-label="alt"
  >
    <canvas ref="canvas"></canvas>
    <span class="tip" :class="{ on: tip.on }" :style="{ transform: `translate(${tip.x}px, ${tip.y}px)` }" aria-hidden="true"></span>
  </div>
</template>

<style scoped>
.sketch {
  position: relative;
  width: 100%;
  height: 100%;
  background: #efeee9;
  touch-action: pan-y;
  overflow: hidden;
}

.sketch canvas {
  width: 100%;
  height: 100%;
}

/* the pencil point during autoplay */
.tip {
  position: absolute;
  left: 0;
  top: 0;
  width: 14px;
  height: 14px;
  margin: -7px 0 0 -7px;
  border-radius: 50%;
  background: var(--sindoor);
  box-shadow: 0 0 0 6px rgba(229, 67, 42, 0.18);
  opacity: 0;
  transition: opacity 0.4s ease;
  pointer-events: none;
}

.tip.on {
  opacity: 1;
}
</style>
