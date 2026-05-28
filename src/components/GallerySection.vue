<script setup>
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { artworks, CATEGORIES } from '../data/artworks'
import ArtworkLightbox from './ArtworkLightbox.vue'

const activeCategory = ref('All')
const filtered = computed(() =>
  activeCategory.value === 'All'
    ? artworks
    : artworks.filter((a) => a.category === activeCategory.value),
)

/* ---- Lightbox state ---- */
const lightboxIndex = ref(-1)
const isOpen = computed(() => lightboxIndex.value >= 0)
const open = (i) => (lightboxIndex.value = i)
const close = () => (lightboxIndex.value = -1)
const navigate = (i) => (lightboxIndex.value = i)

/* ---- Masonry: each tile spans N grid rows so varied aspect ratios sit
   flush with no cropping. The height is derived from the tile's WIDTH and
   the artwork's aspect ratio (width is reliable even before the image
   loads, unlike the cell-constrained height), then refined to the image's
   true ratio once it has loaded. ---- */
const grid = ref(null)
const ROW = 8 // must match grid-auto-rows in CSS (px)
const GAP = 24 // must match grid gap in CSS (px)

const sizeTile = (tile, ratio) => {
  const w = tile.getBoundingClientRect().width
  if (!w || !ratio) return
  const h = w / ratio
  const span = Math.max(1, Math.ceil((h + GAP) / (ROW + GAP)))
  tile.style.gridRowEnd = `span ${span}`
}

const resizeSpans = () => {
  const el = grid.value
  if (!el) return
  el.querySelectorAll('.tile').forEach((tile, i) => {
    const art = filtered.value[i]
    if (!art) return
    const im = tile.querySelector('img')
    const ratio =
      im && im.naturalWidth && im.naturalHeight
        ? im.naturalWidth / im.naturalHeight
        : art.aspect || 1
    sizeTile(tile, ratio)
  })
}

// Re-measure once each image has decoded (true ratio may differ slightly
// from the declared one) so the layout settles precisely.
const attachImageListeners = () => {
  grid.value?.querySelectorAll('.tile img').forEach((im) => {
    if (im.complete) return
    im.addEventListener('load', resizeSpans, { once: true })
  })
}

let ro
onMounted(() => {
  resizeSpans()
  attachImageListeners()
  ro = new ResizeObserver(resizeSpans)
  ro.observe(grid.value)
})
onUnmounted(() => ro?.disconnect())

// Recompute after the filtered list re-renders.
watch(filtered, () =>
  nextTick(() => {
    resizeSpans()
    attachImageListeners()
  }),
)
</script>

<template>
  <section id="work" class="section gallery">
    <div class="container">
      <header class="gallery-head">
        <p class="eyebrow" v-reveal>Selected Work</p>
        <h2 v-reveal="80">A gallery of drawings</h2>
        <p class="lede" v-reveal="160">
          Originals in graphite and charcoal. Click any piece to view it large.
        </p>

        <div class="filters" v-reveal="220" role="tablist" aria-label="Filter by category">
          <button
            v-for="cat in CATEGORIES"
            :key="cat"
            class="chip"
            :class="{ active: activeCategory === cat }"
            role="tab"
            :aria-selected="activeCategory === cat"
            @click="activeCategory = cat"
          >
            {{ cat }}
          </button>
        </div>
      </header>

      <div ref="grid" class="grid">
        <button
          v-for="(art, i) in filtered"
          :key="art.id"
          v-reveal="Math.min(i, 7) * 55"
          class="tile"
          :class="{ feature: art.feature }"
          @click="open(i)"
        >
          <img
            :src="art.image"
            :alt="art.title"
            loading="lazy"
            :style="{ aspectRatio: String(art.aspect) }"
          />
          <span class="tile-info">
            <span class="tile-title">{{ art.title }}</span>
            <span class="tile-meta">{{ art.medium }}</span>
          </span>
        </button>
      </div>
    </div>

    <ArtworkLightbox
      v-if="isOpen"
      :items="filtered"
      :index="lightboxIndex"
      @close="close"
      @navigate="navigate"
    />
  </section>
</template>

<style scoped>
.gallery-head {
  max-width: var(--maxw);
  margin-bottom: clamp(36px, 6vw, 64px);
}

.filters {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
  margin-top: 2rem;
}

.chip {
  font-family: var(--sans);
  font-size: 0.85rem;
  font-weight: 500;
  padding: 0.5em 1.1em;
  border-radius: 999px;
  border: 1px solid var(--line);
  background: transparent;
  color: var(--ink-soft);
  cursor: pointer;
  transition:
    background 0.2s ease,
    color 0.2s ease,
    border-color 0.2s ease;
}
.chip:hover {
  border-color: var(--ink-mute);
  color: var(--ink);
}
.chip.active {
  background: var(--ink);
  border-color: var(--ink);
  color: var(--paper);
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  grid-auto-rows: 8px;
  gap: 24px;
  grid-auto-flow: row dense;
}

.tile {
  position: relative;
  padding: 0;
  margin: 0;
  border: none;
  background: var(--paper-2);
  cursor: pointer;
  overflow: hidden;
  display: block;
  border: 1px solid var(--line);
}

.tile img {
  width: 100%;
  height: auto;
  display: block;
  transition:
    transform 0.6s cubic-bezier(0.16, 1, 0.3, 1),
    filter 0.4s ease;
}

.tile:hover img,
.tile:focus-visible img {
  transform: scale(1.04);
}

.tile-info {
  position: absolute;
  inset: auto 0 0 0;
  padding: 1.4rem 1.2rem 1.1rem;
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  text-align: left;
  color: var(--paper);
  background: linear-gradient(to top, rgba(21, 20, 15, 0.78), rgba(21, 20, 15, 0));
  opacity: 0;
  transform: translateY(8px);
  transition:
    opacity 0.35s ease,
    transform 0.35s ease;
}

.tile:hover .tile-info,
.tile:focus-visible .tile-info {
  opacity: 1;
  transform: none;
}

.tile-title {
  font-family: var(--display);
  font-size: 1.2rem;
}
.tile-meta {
  font-size: 0.8rem;
  color: rgba(246, 244, 238, 0.78);
}

.tile:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 3px;
}

@media (min-width: 900px) {
  .tile.feature {
    grid-column: span 2;
  }
}
</style>
