<script setup>
import { computed, ref } from 'vue'
import { artworks, CATEGORIES } from '../data/artworks'
import ArtworkLightbox from './ArtworkLightbox.vue'

const activeCategory = ref('All')
const filtered = computed(() =>
  activeCategory.value === 'All'
    ? artworks
    : artworks.filter((a) => a.category === activeCategory.value),
)

/* ---- Lightbox ---- */
const lightboxIndex = ref(-1)
const isOpen = computed(() => lightboxIndex.value >= 0)
const open = (i) => (lightboxIndex.value = i)
const close = () => (lightboxIndex.value = -1)
const navigate = (i) => (lightboxIndex.value = i)
</script>

<template>
  <section id="work" class="section gallery">
    <hr class="section-divider" />

    <div class="container">
      <header class="gallery-head">
        <p class="eyebrow" v-reveal>Selected Work</p>
        <h2 v-reveal="100">A gallery of drawings</h2>
        <p class="lede" v-reveal="200">
          Originals in graphite and charcoal. Tap any piece to view it large.
        </p>

        <div class="filters-wrap" v-reveal="300">
          <div class="filters" role="tablist" aria-label="Filter by category">
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
        </div>
      </header>

      <!-- CSS Columns masonry — images are NEVER cropped -->
      <div class="grid">
        <button
          v-for="(art, i) in filtered"
          :key="art.id"
          v-reveal.scale="Math.min(i, 8) * 80"
          class="tile"
          @click="open(i)"
        >
          <div class="tile-img-wrap">
            <img
              :src="art.image"
              :alt="art.title"
              loading="lazy"
            />
          </div>
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
  margin-bottom: clamp(28px, 5vw, 64px);
}

.filters-wrap {
  margin-top: 1.5rem;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
}
.filters-wrap::-webkit-scrollbar { display: none; }

.filters {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 2rem;
  border-bottom: 1px solid var(--line);
  padding: 0;
  margin-bottom: 2.5rem;
}

.chip {
  font-family: var(--sans);
  font-size: 0.92rem;
  font-weight: 500;
  letter-spacing: 0.05em;
  padding: 0.75rem 0.5rem;
  background: transparent;
  border: none;
  border-bottom: 2px solid transparent;
  color: var(--ink-mute);
  cursor: pointer;
  white-space: nowrap;
  margin-bottom: -1px;
  transition:
    color 0.25s ease,
    border-color 0.25s ease;
}

.chip:hover {
  color: var(--ink);
  border-bottom-color: var(--line);
}

.chip.active {
  color: var(--accent);
  border-bottom-color: var(--accent);
  font-weight: 600;
}

/* ======================================================
   CSS Columns masonry — no JS calculations needed.
   Every image displays at its FULL natural aspect ratio.
   ====================================================== */
.grid {
  columns: 3;
  column-gap: 20px;
}

.tile {
  display: block;
  break-inside: avoid;
  -webkit-column-break-inside: avoid;
  margin-bottom: 20px;
  padding: 0;
  border: none;
  background: var(--paper-2);
  cursor: pointer;
  overflow: hidden;
  border: 1px solid var(--line);
  border-radius: 8px;
  width: 100%;
  transition:
    box-shadow 0.5s var(--spring),
    transform 0.5s var(--spring);
}

.tile:hover {
  transform: translateY(-6px) !important;
  box-shadow: 0 24px 48px -16px rgba(21, 20, 15, 0.3);
}

.tile-img-wrap {
  overflow: hidden;
  border-radius: 7px;
}

.tile img {
  width: 100%;
  height: auto;
  display: block;
  object-fit: contain;
  transition: transform 0.7s var(--spring-snappy);
}

.tile:hover img {
  transform: scale(1.06);
}

.tile:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 3px;
}

/* ---- Responsive columns ---- */
@media (max-width: 900px) {
  .grid {
    columns: 2;
    column-gap: 16px;
  }
  .tile {
    margin-bottom: 16px;
  }
}

@media (max-width: 600px) {
  .filters-wrap {
    margin-inline: calc(-1 * var(--gutter));
    padding-inline: var(--gutter);
  }
  .filters {
    justify-content: flex-start;
    flex-wrap: nowrap;
    gap: 1.25rem;
    margin-bottom: 1.75rem;
  }
  .chip {
    font-size: 0.8rem;
    padding: 0.6rem 0.2rem;
  }
}

@media (max-width: 480px) {
  .grid {
    columns: 2;
    column-gap: 10px;
  }
  .tile {
    margin-bottom: 10px;
    border-radius: 6px;
  }
  .tile-img-wrap {
    border-radius: 5px;
  }
}
</style>
