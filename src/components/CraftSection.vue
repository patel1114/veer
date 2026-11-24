<script setup>
/* The proof. The page turns to paper, then scrolling pushes into the
   camo portrait until it hands over to the real close-up photograph
   of the same drawing — stubble, skin, ear — all graphite. */
import { onMounted, onUnmounted, ref } from 'vue'
import { gsap, reducedMotion } from '../composables/motion'
import full from '../assets/artworks/camo-portrait.jpg'
import detail from '../assets/artworks/camo-portrait-detail.jpg'
import desk from '../assets/artworks/father-son-desk.jpg'

const root = ref(null)
const phase = ref(0)
let ctx

const steps = [
  {
    n: '01',
    title: 'Share a photo',
    body: 'Send the photo you love on WhatsApp. We agree on size, who is in it and the feeling you want to keep.',
  },
  {
    n: '02',
    title: 'Drawn by hand',
    body: 'Graphite and charcoal built up layer by layer, from the first light outline to the deepest black.',
  },
  {
    n: '03',
    title: 'Yours to keep',
    body: 'A one-of-one original on paper — ready to frame, to gift, to hand down.',
  },
]

onMounted(() => {
  if (reducedMotion) {
    phase.value = 1
    return
  }
  ctx = gsap.context(() => {
    const tl = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: '.zoom',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1,
        onUpdate: (s) => (phase.value = s.progress > 0.66 ? 1 : 0),
      },
    })
    // Scale + origin are calibrated so the zoomed full drawing lines up
    // with the framing of the close-up photo before the crossfade.
    tl.fromTo('.z-full', { scale: 1 }, { scale: 2, duration: 1, ease: 'power1.in' })
      .fromTo('.z-detail', { opacity: 0 }, { opacity: 1, duration: 0.3 }, 0.92)
      .to('.z-ring', { scale: 0.4, opacity: 0, duration: 0.35 }, 0.1)
      .to({}, { duration: 0.3 })
  }, root.value)
})

onUnmounted(() => ctx?.revert())
</script>

<template>
  <section id="craft" ref="root" class="craft" data-theme="paper">
    <header class="wrap craft-head">
      <div class="section-head">
        <span class="label"><span class="label--accent">(03)</span>&nbsp; The craft</span>
        <span class="label">Scroll to look closer</span>
      </div>
      <h2 v-split class="craft-title">Every strand. Every pore. <em>By hand.</em></h2>
    </header>

    <div class="zoom">
      <div class="zoom-sticky">
        <div class="z-stage">
          <img class="z-full" :src="full" alt="The Camo Shirt, full drawing" />
          <img class="z-detail" :src="detail" alt="Close-up of the same drawing: ear, stubble and skin rendered in graphite" />
          <span class="z-ring" aria-hidden="true"></span>
        </div>

        <div class="z-notes">
          <div class="z-note" :class="{ on: phase === 0 }">
            <span class="label label--accent">Full view</span>
            <p>The Camo Shirt. Graphite on paper, 2024.</p>
          </div>
          <div class="z-note" :class="{ on: phase === 1 }">
            <span class="label label--accent">Close-up · same drawing</span>
            <p>Not a photograph. Each hair of the beard and every fold of the ear is pencil on paper.</p>
          </div>
        </div>
      </div>
    </div>

    <div class="wrap studio">
      <figure class="desk" v-reveal>
        <div class="desk-frame">
          <img :src="desk" alt="A father-and-son portrait in progress on Veer's desk, with pencils and the proportion grid visible" loading="lazy" />
        </div>
        <figcaption class="label">On the desk — the proportion grid still visible on the paper</figcaption>
      </figure>

      <ol class="steps">
        <li v-for="(s, i) in steps" :key="s.n" v-reveal="i * 120" class="step">
          <span class="step-n">{{ s.n }}</span>
          <div>
            <h3 class="step-title">{{ s.title }}</h3>
            <p class="step-body">{{ s.body }}</p>
          </div>
        </li>
      </ol>
    </div>
  </section>
</template>

<style scoped>
.craft {
  padding-block: clamp(96px, 14vw, 200px) clamp(80px, 12vw, 160px);
}

.craft-title {
  font-size: clamp(2.8rem, 8.4vw, 9.5rem);
  letter-spacing: -0.045em;
  margin-top: clamp(20px, 3vw, 40px);
  max-width: 14ch;
}

.craft-title :deep(em) {
  color: var(--accent);
}

.zoom {
  height: 280svh;
  position: relative;
}

.zoom-sticky {
  position: sticky;
  top: 0;
  height: 100svh;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: var(--gutter);
  padding-inline: var(--gutter);
  overflow: hidden;
}

.z-stage {
  grid-column: 2;
  position: relative;
  height: min(82svh, 900px);
  aspect-ratio: 3 / 4;
  overflow: hidden;
  background: #efeee9;
  box-shadow: 0 50px 100px -50px rgba(12, 12, 11, 0.45);
}

.z-stage img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.z-full {
  transform-origin: 61.5% 2.3%;
}

.z-detail {
  opacity: 0;
}

/* marks where we're about to zoom */
.z-ring {
  position: absolute;
  left: 55.7%;
  top: 26.2%;
  width: 50%;
  aspect-ratio: 1;
  translate: -50% -50%;
  border: 1.5px solid var(--sindoor);
  border-radius: 50%;
  pointer-events: none;
}

.z-notes {
  grid-column: 3;
  position: relative;
  align-self: end;
  padding-bottom: 12svh;
  min-height: 9rem;
}

.z-note {
  position: absolute;
  inset: auto 0 12svh 0;
  max-width: 30ch;
  display: grid;
  gap: 0.6rem;
  opacity: 0;
  transform: translateY(16px);
  transition:
    opacity 0.6s ease,
    transform 0.8s var(--ease-out);
}

.z-note.on {
  opacity: 1;
  transform: none;
}

.z-note p {
  font-family: var(--serif);
  font-size: clamp(1.15rem, 1.6vw, 1.6rem);
  line-height: 1.2;
  letter-spacing: -0.01em;
}

.studio {
  margin-top: clamp(48px, 8vw, 120px);
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  column-gap: var(--gutter);
  row-gap: 3rem;
  align-items: center;
}

.desk {
  grid-column: 1 / 6;
  margin: 0;
  display: grid;
  gap: 0.8rem;
}

.desk-frame {
  aspect-ratio: 3 / 4;
  overflow: hidden;
  box-shadow: 0 40px 80px -40px rgba(12, 12, 11, 0.45);
}

.desk-frame img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 1.4s var(--ease-out);
}

.desk:hover .desk-frame img {
  transform: scale(1.04);
}

.steps {
  grid-column: 7 / 13;
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
}

.step {
  display: grid;
  grid-template-columns: clamp(4.5rem, 7vw, 7rem) 1fr;
  gap: var(--gutter);
  padding-block: clamp(20px, 2.6vw, 36px);
  border-top: 1px solid var(--line-strong);
}

.step:last-child {
  border-bottom: 1px solid var(--line-strong);
}

.step-n {
  font-family: var(--serif);
  font-style: italic;
  font-size: clamp(3rem, 5vw, 5rem);
  line-height: 0.9;
  color: var(--accent);
}

.step-title {
  font-size: clamp(1.5rem, 2.2vw, 2.2rem);
  letter-spacing: -0.02em;
  margin-bottom: 0.6rem;
}

.step-body {
  color: var(--fg-soft);
  max-width: 40ch;
}

@media (prefers-reduced-motion: reduce) {
  .zoom { height: auto; }
  .zoom-sticky { position: relative; height: auto; padding-block: 48px; }
  .z-full, .z-ring { display: none; }
  .z-detail { opacity: 1; }
}

@media (max-width: 900px) {
  .zoom {
    height: 220svh;
  }
  .zoom-sticky {
    grid-template-columns: 1fr;
    grid-template-rows: 1fr auto;
    align-content: center;
    padding-block: calc(var(--header-h) + 8px) 24px;
  }
  .z-stage {
    grid-column: 1;
    height: auto;
    width: min(100%, 60svh);
    justify-self: center;
  }
  .z-notes {
    grid-column: 1;
    align-self: start;
    padding-bottom: 0;
    min-height: 6.5rem;
  }
  .z-note {
    inset: 0 0 auto 0;
  }
  .desk,
  .steps {
    grid-column: 1 / -1;
  }
}
</style>
