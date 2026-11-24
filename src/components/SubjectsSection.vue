<script setup>
/* "What I draw" — the commission menu as a typographic index.
   Desktop: hovering a row summons a floating preview that trails the
   cursor with inertia, tilts with velocity, and cycles through that
   subject's drawings. Click opens the viewer filtered to the subject. */
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { artworks } from '../data/artworks'
import { openViewer } from '../stores/ui'
import { gsap, finePointer, reducedMotion } from '../composables/motion'

const subjects = [
  { name: 'Portraits', key: 'Portraits', blurb: 'The likeness, the expression — the person, not just the face.' },
  { name: 'Couples & Family', key: 'Couples & Family', blurb: 'Weddings, anniversaries, everyone you love in one frame.' },
  { name: 'Children', key: 'Children', blurb: 'First smiles and first drives, kept long after they grow.' },
  { name: 'Devotional', key: 'Devotional', blurb: 'Deities drawn with devotion — for homes, temples and gifts.' },
]

const rows = computed(() =>
  subjects.map((s) => ({ ...s, items: artworks.filter((a) => a.category === s.key) })),
)

const preview = ref(null)
const active = ref(-1)
const frame = ref(0)
const interactive = finePointer && !reducedMotion
let xTo, yTo, rotTo, lastX = 0, cycle

const enter = (i) => {
  active.value = i
  frame.value = 0
  clearInterval(cycle)
  cycle = setInterval(() => {
    const n = rows.value[active.value]?.items.length || 1
    frame.value = (frame.value + 1) % n
  }, 900)
}
const leave = () => {
  active.value = -1
  clearInterval(cycle)
}

const onMove = (e) => {
  if (!interactive) return
  xTo(e.clientX)
  yTo(e.clientY)
  const v = gsap.utils.clamp(-12, 12, (e.clientX - lastX) * 0.6)
  rotTo(v)
  lastX = e.clientX
}

const openSubject = (row) => openViewer(row.items, 0, null)

onMounted(() => {
  if (!interactive) return
  xTo = gsap.quickTo(preview.value, 'x', { duration: 0.7, ease: 'power3.out' })
  yTo = gsap.quickTo(preview.value, 'y', { duration: 0.7, ease: 'power3.out' })
  rotTo = gsap.quickTo(preview.value, 'rotation', { duration: 0.9, ease: 'power3.out' })
})
onUnmounted(() => clearInterval(cycle))
</script>

<template>
  <section id="subjects" class="subjects wrap" @pointermove="onMove">
    <div class="section-head">
      <span class="label"><span class="label--accent">(04)</span>&nbsp; What I draw</span>
      <span class="label">Tap a subject to browse</span>
    </div>

    <ul class="rows" @pointerleave="leave">
      <li v-for="(row, i) in rows" :key="row.key" v-reveal="i * 80">
        <button
          class="row"
          :class="{ dim: active !== -1 && active !== i }"
          data-cursor="view"
          :data-cursor-label="`Browse`"
          @pointerenter="interactive && enter(i)"
          @click="openSubject(row)"
        >
          <span class="label row-n">{{ String(i + 1).padStart(2, '0') }}</span>
          <span class="row-name">{{ row.name }}</span>
          <span class="row-blurb">{{ row.blurb }}</span>
          <span class="row-count label">{{ row.items.length }} works</span>
          <span class="row-thumbs" aria-hidden="true">
            <img v-for="it in row.items.slice(0, 3)" :key="it.id" :src="it.thumb" alt="" loading="lazy" decoding="async" />
          </span>
        </button>
      </li>
    </ul>

    <div v-if="interactive" ref="preview" class="preview" :class="{ on: active !== -1 }" aria-hidden="true">
      <div class="preview-inner">
        <template v-for="(row, ri) in rows" :key="row.key">
          <img
            v-for="(it, ii) in row.items"
            :key="it.id"
            :src="it.thumb"
            alt=""
            loading="lazy"
            :class="{ show: ri === active && ii === frame }"
          />
        </template>
      </div>
    </div>
  </section>
</template>

<style scoped>
.subjects {
  padding-block: clamp(96px, 14vw, 200px);
  position: relative;
}

.rows {
  list-style: none;
  margin: 0;
  padding: 0;
}

.row {
  width: 100%;
  display: grid;
  grid-template-columns: 4rem minmax(0, 1.4fr) minmax(0, 1fr) auto;
  align-items: center;
  gap: var(--gutter);
  padding: clamp(18px, 2.6vw, 34px) 0;
  border: 0;
  border-bottom: 1px solid var(--line);
  background: none;
  text-align: left;
  cursor: pointer;
  position: relative;
  transition: opacity 0.5s var(--ease-out);
}

.row::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: -1px;
  height: 1px;
  background: var(--fg);
  transform: scaleX(0);
  transform-origin: right;
  transition: transform 0.8s var(--ease-out);
}

.row:hover::after {
  transform: scaleX(1);
  transform-origin: left;
}

.row.dim {
  opacity: 0.28;
}

.row-n {
  color: var(--accent);
}

.row-name {
  font-family: var(--serif);
  font-size: clamp(2.2rem, 6.4vw, 6.6rem);
  line-height: 1;
  letter-spacing: -0.04em;
  transition:
    transform 0.8s var(--ease-out),
    font-style 0s;
}

.row:hover .row-name {
  transform: translateX(clamp(8px, 1.5vw, 24px));
  font-style: italic;
}

.row-blurb {
  color: var(--fg-soft);
  max-width: 34ch;
  font-size: 0.95rem;
}

.row-thumbs {
  display: none;
}

/* Floating preview */
.preview {
  position: fixed;
  left: 0;
  top: 0;
  z-index: 40;
  pointer-events: none;
  width: clamp(220px, 20vw, 320px);
  aspect-ratio: 3 / 4;
  margin: calc(clamp(220px, 20vw, 320px) * -0.66) 0 0 calc(clamp(220px, 20vw, 320px) * -0.5);
}

.preview-inner {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: var(--bg-raised);
  clip-path: inset(50% 50% 50% 50%);
  transition: clip-path 0.7s var(--ease-out);
  box-shadow: 0 40px 80px -30px rgba(0, 0, 0, 0.8);
}

.preview.on .preview-inner {
  clip-path: inset(0 0 0 0);
}

.preview img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0;
  transform: scale(1.08);
  transition:
    opacity 0.45s ease,
    transform 1.2s var(--ease-out);
}

.preview img.show {
  opacity: 1;
  transform: none;
}

/* Phones & touch: no floating preview — each subject shows a
   three-up grid of its drawings instead, so the art leads. */
@media (hover: none), (max-width: 900px) {
  .subjects {
    padding-block: 88px;
  }
  .row {
    grid-template-columns: 2rem 1fr auto;
    row-gap: 0.7rem;
    padding: 26px 0 28px;
  }
  .row-name {
    font-size: clamp(2.2rem, 10.5vw, 4rem);
  }
  .row-blurb {
    grid-column: 1 / -1;
    font-size: 0.98rem;
  }
  .row-count {
    grid-column: 3;
    grid-row: 1;
  }
  .row-thumbs {
    grid-column: 1 / -1;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 6px;
    margin-top: 0.3rem;
  }
  .row-thumbs img {
    width: 100%;
    aspect-ratio: 3 / 4;
    object-fit: cover;
    background: var(--bg-raised);
  }
  .row.dim {
    opacity: 1;
  }
  .row:active .row-name {
    font-style: italic;
  }
}
</style>
