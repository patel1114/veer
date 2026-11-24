<script setup>
import WaIcon from './WaIcon.vue'
/* Selected work.
   Desktop: a pinned horizontal gallery — vertical scroll drives the
            track sideways; each drawing settles from a slight zoom.
   Phones:  a native swipe carousel (scroll-snap), one drawing per
            screen with a peek of the next, a live counter, and focus
            scaling via CSS scroll timelines (compositor-only).
   Images keep their proportions; phones download the 800px copies. */
import { onMounted, onUnmounted, ref } from 'vue'
import { artworks, srcsetOf } from '../data/artworks'
import { openViewer } from '../stores/ui'
import { gsap, reducedMotion } from '../composables/motion'
import { waUrl } from '../data/site'

const root = ref(null)
const track = ref(null)
const current = ref(1)
const progress = ref(0)
const total = artworks.length
const originals = artworks.filter((a) => !a.pairWith).length
const pad = (n) => String(n).padStart(2, '0')
const sizes = '(max-width: 900px) 82vw, 40vw'

const open = (i, e) => {
  const img = e.currentTarget.querySelector('img')
  openViewer(artworks, i, img)
}

/* ---- phone carousel: counter + progress from native scroll ---- */
let raf = 0
const onTrackScroll = () => {
  if (raf) return
  raf = requestAnimationFrame(() => {
    raf = 0
    const el = track.value
    if (!el || window.innerWidth > 900) return
    const max = el.scrollWidth - el.clientWidth
    progress.value = max > 0 ? el.scrollLeft / max : 0
    const card = el.querySelector('.card')
    const step = card ? card.offsetWidth + parseFloat(getComputedStyle(el).columnGap || 0) : 1
    current.value = Math.min(total, Math.round(el.scrollLeft / step) + 1)
  })
}

const nudge = (dir) => {
  const el = track.value
  const card = el?.querySelector('.card')
  if (!card) return
  el.scrollBy({ left: dir * (card.offsetWidth + 14), behavior: reducedMotion ? 'auto' : 'smooth' })
}

let mm

onMounted(() => {
  if (reducedMotion) return
  mm = gsap.matchMedia()
  mm.add('(min-width: 901px)', () => {
    const distance = () => track.value.scrollWidth - window.innerWidth
    const tween = gsap.to(track.value, {
      x: () => -distance(),
      ease: 'none',
      scrollTrigger: {
        trigger: '.work-pin',
        start: 'top top',
        end: () => `+=${distance()}`,
        pin: true,
        scrub: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          progress.value = self.progress
          current.value = Math.min(total, Math.max(1, Math.round(self.progress * (total - 1)) + 1))
        },
      },
    })

    gsap.utils.toArray('.card').forEach((card) => {
      const img = card.querySelector('img')
      if (!img) return
      gsap.fromTo(
        img,
        { scale: 1.14 },
        {
          scale: 1,
          ease: 'none',
          scrollTrigger: { trigger: card, containerAnimation: tween, start: 'left right', end: 'center 60%', scrub: true },
        },
      )
      const cap = card.querySelector('.card-cap')
      gsap.fromTo(
        cap,
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          ease: 'power2.out',
          scrollTrigger: { trigger: card, containerAnimation: tween, start: 'left 85%', end: 'left 55%', scrub: true },
        },
      )
    })
  }, root.value)
})

onUnmounted(() => {
  mm?.revert()
  cancelAnimationFrame(raf)
})
</script>

<template>
  <section id="work" ref="root" class="work">
    <header class="wrap work-head">
      <div class="section-head">
        <span class="label"><span class="label--accent">(02)</span>&nbsp; Selected work</span>
        <span class="label">{{ originals }} originals<span class="hide-sm"> · 2023 — 2024</span></span>
      </div>
      <h2 v-split class="work-title">The <em>work,</em> up close.</h2>
      <p class="work-hint label">Swipe to browse · tap to open</p>
    </header>

    <div class="work-pin">
      <div ref="track" class="track" @scroll.passive="onTrackScroll">
        <article
          v-for="(art, i) in artworks"
          :key="art.id"
          class="card"
          :class="{ 'card--feature': art.feature, 'card--low': i % 2 === 1 }"
          :style="{ '--ar': art.aspect }"
        >
          <button class="card-frame tap" data-cursor="view" :aria-label="`Open ${art.title}`" @click="open(i, $event)">
            <img
              :src="art.image"
              :srcset="srcsetOf(art)"
              :sizes="sizes"
              :alt="`${art.title} — ${art.medium}`"
              loading="lazy"
              decoding="async"
            />
          </button>
          <div class="card-cap">
            <span class="label card-n">{{ pad(i + 1) }} / {{ pad(total) }}</span>
            <h3 class="card-title">{{ art.title }}</h3>
            <span class="label">{{ art.medium }} · {{ art.year }}</span>
          </div>
        </article>

        <aside class="card card-end">
          <p class="label">Next in the sketchbook</p>
          <p class="end-title">Your story <em>could be next.</em></p>
          <a :href="waUrl()" target="_blank" rel="noopener" class="pill pill--wa">
          <WaIcon />
            <span class="roll"><span>Start a commission</span><span aria-hidden="true">Start a commission</span></span>
            <span class="arrow">→</span>
          </a>
        </aside>
      </div>

      <div class="work-hud">
        <span class="label hud-n" aria-live="polite">{{ pad(current) }}</span>
        <span class="hud-bar" aria-hidden="true"><span :style="{ transform: `scaleX(${progress})` }"></span></span>
        <span class="label">{{ pad(total) }}</span>
        <span class="hud-btns">
          <button class="hud-btn tap" aria-label="Previous drawing" @click="nudge(-1)">←</button>
          <button class="hud-btn tap" aria-label="Next drawing" @click="nudge(1)">→</button>
        </span>
      </div>
    </div>
  </section>
</template>

<style scoped>
.work {
  padding-top: clamp(64px, 10vw, 140px);
}

.work-title {
  font-size: clamp(3rem, 10vw, 11rem);
  letter-spacing: -0.045em;
  margin-top: clamp(20px, 3vw, 40px);
}

.work-title :deep(em) {
  color: var(--fg-mute);
}

.work-hint {
  display: none;
}

.work-pin {
  position: relative;
  height: 100svh;
  display: flex;
  align-items: center;
  overflow: hidden;
}

.track {
  display: flex;
  align-items: center;
  gap: clamp(40px, 6vw, 110px);
  padding-inline: var(--gutter) 12vw;
  will-change: transform;
}

.card {
  --h: 56svh;
  flex: none;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.card--feature {
  --h: 66svh;
}

.card--low {
  transform: translateY(5svh);
}

.card-frame {
  display: block;
  height: var(--h);
  aspect-ratio: var(--ar);
  padding: 0;
  border: 0;
  background: var(--bg-raised);
  overflow: hidden;
  cursor: pointer;
  box-shadow: 0 40px 80px -50px rgba(0, 0, 0, 0.9);
}

.card-frame img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform-origin: center;
  transition: filter 0.8s var(--ease-out);
}

.card-frame:hover img {
  filter: contrast(1.06);
}

.card-cap {
  display: grid;
  gap: 0.3rem;
  max-width: calc(var(--h) * var(--ar));
}

.card-title {
  font-size: clamp(1.3rem, 1.9vw, 1.9rem);
  line-height: 1.05;
  letter-spacing: -0.02em;
}

.card-n {
  color: var(--accent);
}

.card-end {
  width: min(34vw, 520px);
  gap: 1.5rem;
  padding-left: clamp(24px, 4vw, 64px);
  border-left: 1px solid var(--line);
  align-items: flex-start;
}

.end-title {
  font-family: var(--serif);
  font-size: clamp(2.4rem, 4.6vw, 5rem);
  line-height: 0.95;
  letter-spacing: -0.035em;
}

.end-title em {
  color: var(--fg-mute);
}

.work-hud {
  position: absolute;
  left: var(--gutter);
  right: var(--gutter);
  bottom: clamp(20px, 4vh, 40px);
  display: flex;
  align-items: center;
  gap: 1rem;
}

.hud-bar {
  flex: 1;
  height: 1px;
  background: var(--line);
  overflow: hidden;
}

.hud-bar span {
  display: block;
  height: 100%;
  background: var(--fg);
  transform-origin: left;
}

.hud-btns {
  display: none;
}

/* ============================================================
   Phones & tablets — native swipe carousel
   ============================================================ */
@media (max-width: 900px) {
  .hide-sm {
    display: none;
  }

  .work {
    padding-top: 72px;
  }

  .work-title {
    font-size: clamp(2.8rem, 13vw, 6rem);
  }

  .work-hint {
    display: block;
    margin-top: 1rem;
  }

  .work-pin {
    height: auto;
    display: block;
    overflow: visible;
    padding-block: 28px 8px;
  }

  .track {
    --card-w: min(82vw, 440px);
    flex-direction: row;
    align-items: flex-start;
    gap: 14px;
    padding-inline: var(--gutter);
    overflow-x: auto;
    overscroll-behavior-x: contain;
    scroll-snap-type: x mandatory;
    scroll-padding-inline: var(--gutter);
    scrollbar-width: none;
    will-change: auto;
    -webkit-overflow-scrolling: touch;
  }

  .track::-webkit-scrollbar {
    display: none;
  }

  .card,
  .card--feature {
    --h: auto;
    width: var(--card-w);
    scroll-snap-align: start;
    gap: 0.9rem;
  }

  .card--low {
    transform: none;
  }

  /* Uniform 3:4 "mount": portrait drawings fill it, landscape pieces
     sit matted inside — the whole drawing is always visible. */
  .card-frame {
    width: 100%;
    height: auto;
    aspect-ratio: 3 / 4;
    box-shadow: none;
  }

  .card-frame img {
    object-fit: contain;
  }

  .card-cap {
    max-width: none;
    padding-right: 0.5rem;
  }

  .card-title {
    font-size: 1.45rem;
  }

  .card-end {
    width: var(--card-w);
    aspect-ratio: 3 / 4;
    justify-content: center;
    padding: 28px;
    border: 1px solid var(--line);
    background: var(--bg-raised);
    scroll-snap-align: start;
  }

  .end-title {
    font-size: clamp(2.4rem, 11vw, 3.6rem);
  }

  /* trailing space so the last card can snap to the start */
  .track::after {
    content: '';
    flex: none;
    width: 1px;
  }

  .work-hud {
    position: static;
    padding: 18px var(--gutter) 0;
    gap: 0.8rem;
  }

  .hud-n {
    color: var(--fg);
    min-width: 1.6em;
  }

  .hud-btns {
    display: flex;
    gap: 8px;
    margin-left: 0.4rem;
  }

  .hud-btn {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    border: 1px solid var(--line-strong);
    background: none;
    font-size: 1rem;
    cursor: pointer;
    transition: transform 0.25s var(--ease-out);
  }

  /* Focus effect: the snapped drawing is crisp and full; its
     neighbours recede. Runs on the compositor where supported. */
  @supports (animation-timeline: view()) {
    .card {
      animation: card-focus linear both;
      animation-timeline: view(inline);
    }
  }
}

@keyframes card-focus {
  0% { opacity: 0.35; scale: 0.92; }
  35%, 65% { opacity: 1; scale: 1; }
  100% { opacity: 0.35; scale: 0.92; }
}

@media (prefers-reduced-motion: reduce) and (min-width: 901px) {
  .work-pin {
    height: auto;
    overflow-x: auto;
    padding-block: 60px;
  }
  .work-hud {
    display: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .card {
    animation: none !important;
  }
}
</style>
