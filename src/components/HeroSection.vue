<script setup>
import WaIcon from './WaIcon.vue'
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { site, waUrl } from '../data/site'
import { ui } from '../stores/ui'
import { gsap, ScrollTrigger, reducedMotion } from '../composables/motion'
import SketchCanvas from './SketchCanvas.vue'
import heroImg from '../assets/artworks/chief-minister.jpg'

// Landscape drawing: the frame takes the drawing's own proportions.
const heroAspect = 1600 / 1204

const root = ref(null)
const title = ref(null)
const play = ref(false)
const fill = ref(reducedMotion ? 1 : 0)
const played = ref(false)
const finished = ref(false)
let ctx

/* Intro choreography — runs the moment the preloader lifts. */
const intro = () => {
  title.value?.classList.add('is-in')
  root.value?.classList.add('is-in')
  setTimeout(() => (play.value = true), 900)
}

watch(
  () => ui.introDone,
  (v) => v && intro(),
)

onMounted(() => {
  if (ui.introDone) intro()
  if (reducedMotion) return

  ctx = gsap.context(() => {
    // Scrolling out of the hero finishes the drawing and separates
    // the layers: title lifts faster than the artwork.
    ScrollTrigger.create({
      trigger: root.value,
      start: 'top top',
      end: 'bottom 30%',
      scrub: true,
      onUpdate: (self) => (fill.value = gsap.utils.clamp(0, 1, self.progress * 1.35)),
    })
    // Layer parallax is a desktop flourish; on phones the stacked
    // layout already moves naturally and we save the work.
    gsap.matchMedia().add('(min-width: 901px)', () => {
      gsap.to('.hero-title', {
        yPercent: -28,
        ease: 'none',
        scrollTrigger: { trigger: root.value, start: 'top top', end: 'bottom top', scrub: true },
      })
      gsap.to('.hero-art', {
        yPercent: -8,
        ease: 'none',
        scrollTrigger: { trigger: root.value, start: 'top top', end: 'bottom top', scrub: true },
      })
    })
  }, root.value)
})

onUnmounted(() => ctx?.revert())
</script>

<template>
  <section ref="root" class="hero" aria-labelledby="hero-title">
    <div class="hero-grid">
      <p class="hero-kicker label">
        <span class="fade" style="--d: 300ms"><span class="dot"></span>&nbsp; Hyper-real graphite &amp; charcoal</span>
      </p>

      <h1 id="hero-title" ref="title" v-split.manual="150" class="hero-title">
        Memories, <br /><em>drawn</em> <br class="br-lg" />by hand.
      </h1>

      <figure class="hero-art" :style="{ '--hero-ar': heroAspect }">
        <div class="hero-art-frame">
          <SketchCanvas
            :src="heroImg"
            alt="Chief Minister, West Bengal — a formal graphite portrait by Veer, revealed stroke by stroke"
            :play="play"
            :fill="fill"
            @played="played = true"
            @finished="finished = true"
          />
        </div>
        <figcaption class="hero-cap">
          <span class="label">Chief Minister, West Bengal — Graphite &amp; charcoal, 2024</span>
        </figcaption>
      </figure>

      <div class="hero-foot">
        <p class="hero-intro fade" style="--d: 700ms">{{ site.intro }}</p>
        <div class="hero-ctas fade" style="--d: 850ms">
          <a :href="waUrl()" target="_blank" rel="noopener" class="pill pill--wa">
          <WaIcon />
            <span class="roll cta-long"><span>Commission a portrait</span><span aria-hidden="true">Commission a portrait</span></span>
            <span class="cta-short">Order a sketch</span>
            <span class="arrow">→</span>
          </a>
          <a href="#work" class="pill">
            <span class="roll"><span>See the work</span><span aria-hidden="true">See the work</span></span>
          </a>
        </div>
      </div>

      <a href="#statement" class="hero-scroll label fade" style="--d: 1100ms" aria-label="Scroll down">
        <span class="scroll-line"></span> Scroll
      </a>
    </div>
  </section>
</template>

<style scoped>
.hero {
  position: relative;
  min-height: 100svh;
  padding: calc(var(--header-h) + 2vh) var(--gutter) clamp(24px, 4vh, 48px);
  display: flex;
}

.hero-grid {
  position: relative;
  flex: 1;
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  grid-template-rows: auto 1fr auto;
  column-gap: var(--gutter);
  width: 100%;
  max-width: var(--maxw);
  margin-inline: auto;
}

.hero-kicker {
  grid-column: 1 / 8;
  grid-row: 1;
  align-self: start;
  padding-top: 2vh;
  overflow: hidden;
}

/* Giant title floats over the drawing; difference blend turns it to
   ink wherever it crosses the paper. */
.hero-title {
  grid-column: 1 / 13;
  grid-row: 2;
  align-self: center;
  position: relative;
  z-index: 2;
  font-size: clamp(3.4rem, 9.4vw, 11rem);
  line-height: 0.88;
  letter-spacing: -0.045em;
  color: var(--paper-50);
  mix-blend-mode: difference;
  pointer-events: none;
}

.hero-title :deep(em) {
  font-style: italic;
  letter-spacing: -0.03em;
}

.hero-art {
  grid-column: 6 / 13;
  grid-row: 1 / 4;
  justify-self: end;
  align-self: center;
  margin: 0;
  /* as wide as the columns allow, but never taller than ~62% of the screen */
  width: min(100%, calc(62svh * var(--hero-ar)));
  display: flex;
  flex-direction: column;
}

.hero-art-frame {
  aspect-ratio: var(--hero-ar);
  /* contain the drawing's intro zoom — without this the scaled drawing
     widens the page on phones and everything shifts off-centre */
  overflow: hidden;
  clip-path: inset(100% 0 0 0);
  transition: clip-path 1.5s var(--ease-in-out) 0.25s;
  box-shadow: 0 50px 90px -40px rgba(0, 0, 0, 0.8);
}

.hero-art-frame :deep(.sketch) {
  transform: scale(1.18);
  transition: transform 2s var(--ease-out) 0.25s;
}

.is-in .hero-art-frame {
  clip-path: inset(0 0 0 0);
}

.is-in .hero-art-frame :deep(.sketch) {
  transform: none;
}

.hero-cap {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 0.35rem 1rem;
  padding-top: 0.8rem;
}

.hint {
  color: var(--accent);
  opacity: 0;
  transform: translateY(6px);
  transition:
    opacity 0.6s ease,
    transform 0.6s var(--ease-out);
}

.hint.show {
  opacity: 1;
  transform: none;
}

.hint-touch {
  display: none;
}

@media (hover: none) {
  .hint-desk { display: none; }
  .hint-touch { display: inline; }
}

.hero-foot {
  grid-column: 1 / 6;
  grid-row: 3;
  align-self: end;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding-bottom: 0.5rem;
}

.hero-intro {
  max-width: 44ch;
  color: var(--fg-soft);
  font-size: clamp(0.98rem, 1.1vw, 1.08rem);
}

.hero-ctas {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.hero-scroll {
  position: absolute;
  left: 50%;
  bottom: 0;
  display: none;
  align-items: center;
  gap: 0.6rem;
}

.scroll-line {
  width: 1px;
  height: 28px;
  background: var(--line-strong);
  position: relative;
  overflow: hidden;
}

.scroll-line::after {
  content: '';
  position: absolute;
  inset: 0;
  background: var(--fg);
  animation: scroll-line 2.2s var(--ease-in-out) infinite;
}

@keyframes scroll-line {
  0% { transform: translateY(-100%); }
  60%, 100% { transform: translateY(100%); }
}

/* Simple fades for the supporting copy */
.fade {
  display: inline-block;
  opacity: 0;
  transform: translateY(18px);
  transition:
    opacity 1s var(--ease-out),
    transform 1.1s var(--ease-out);
  transition-delay: var(--d, 0ms);
}

.is-in .fade {
  opacity: 1;
  transform: none;
}

.hero-scroll.fade {
  display: none;
}

.cta-short {
  display: none;
}

@media (max-width: 900px) {
  .hero-title :deep(.br-lg) {
    display: none;
  }
}

@media (min-width: 1100px) {
  .hero-scroll.fade { display: inline-flex; }
}

/* ============================================================
   Phones & tablets — composed for a vertical screen:
   headline → full-bleed drawing → one line of copy → two CTAs.
   ============================================================ */
@media (max-width: 900px) {
  .hero {
    min-height: 0;
    padding: calc(var(--header-h) + 12px) var(--gutter) 40px;
  }
  .hero-grid {
    display: flex;
    flex-direction: column;
  }
  .hero-kicker {
    padding-top: 0;
  }
  .hero-title {
    font-size: clamp(2.9rem, 13.4vw, 6.5rem);
    line-height: 0.92;
    margin: 0.9rem 0 1.4rem;
    mix-blend-mode: normal;
  }
  /* edge-to-edge drawing: the artwork owns the screen */
  .hero-art {
    width: calc(100% + 2 * var(--gutter));
    max-width: none;
    height: auto;
    margin-inline: calc(-1 * var(--gutter));
    justify-self: auto;
  }
  .hero-art-frame {
    aspect-ratio: var(--hero-ar);
    flex: none;
    box-shadow: none;
  }
  .hero-cap {
    padding: 0.75rem var(--gutter) 0;
  }
  .hero-foot {
    padding-top: 1.75rem;
    gap: 1.25rem;
  }
  .hero-intro {
    font-size: 1.02rem;
    line-height: 1.55;
  }
}

/* Tablet: keep the drawing framed rather than full-bleed */
@media (min-width: 601px) and (max-width: 900px) {
  .hero-art {
    width: 100%;
    margin-inline: 0;
  }
  .hero-cap {
    padding-inline: 0;
  }
}

@media (max-width: 480px) {
  .hero-ctas {
    display: grid;
    grid-template-columns: 1.35fr 1fr;
    gap: 0.6rem;
  }
  .hero-ctas .pill {
    justify-content: center;
    min-height: 52px;
    padding: 0 1rem;
    font-size: 0.9rem;
  }
  .hero-ctas .arrow {
    display: none;
  }
  .hero-ctas .pill {
    white-space: nowrap;
  }
  .cta-long {
    display: none;
  }
  .cta-short {
    display: inline;
  }
  .hero-cap {
    flex-direction: column;
    gap: 0.35rem;
  }
}
</style>
