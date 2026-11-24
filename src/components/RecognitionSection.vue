<script setup>
/* Recognition — two real moments on stage. Photos enter in graphite
   (greyscale) and bloom into colour as they reach the centre of the
   screen, with a gentle inner parallax. */
import { onMounted, onUnmounted, ref } from 'vue'
import { gsap, ScrollTrigger, reducedMotion } from '../composables/motion'
import { artworks } from '../data/artworks'
import { openViewer } from '../stores/ui'
import gadhvi from '../assets/veer-with-celebrity.jpg'
import kinjal from '../assets/veer-with-kinjal-dave.jpg'

const root = ref(null)
let ctx

const moments = [
  {
    img: gadhvi,
    name: 'Kirtidan Gadhvi',
    role: 'Gujarati folk singer',
    text: 'A hand-drawn portrait of Shri Ram, presented live on stage to the legendary voice of Gujarati folk music.',
    alt: 'Veer presenting his hand-drawn Shri Ram portrait to Kirtidan Gadhvi on stage',
    artId: 'lord-ram',
  },
  {
    img: kinjal,
    name: 'Kinjal Dave',
    role: 'Gujarati singer',
    text: 'A custom graphite portrait of the singer herself, presented to her on stage to a warm reception.',
    alt: 'Veer presenting a hand-drawn portrait to Kinjal Dave on stage',
  },
]

const openArt = (id) => {
  const i = artworks.findIndex((a) => a.id === id)
  if (i >= 0) openViewer(artworks, i, null)
}

onMounted(() => {
  if (reducedMotion) return
  ctx = gsap.context(() => {
    const mm = gsap.matchMedia()
    // Phones: one-shot colour bloom (a CSS transition), no per-frame filters.
    mm.add('(max-width: 900px)', () => {
      gsap.utils.toArray('.m-frame').forEach((frame) => {
        ScrollTrigger.create({ trigger: frame, start: 'top 70%', once: true, onEnter: () => frame.classList.add('bloom') })
      })
    })
    mm.add('(min-width: 901px)', () => gsap.utils.toArray('.m-frame').forEach((frame) => {
      const img = frame.querySelector('img')
      gsap.fromTo(
        img,
        { yPercent: -9, filter: 'grayscale(1) contrast(1.05)' },
        {
          yPercent: 9,
          filter: 'grayscale(0) contrast(1)',
          ease: 'none',
          scrollTrigger: { trigger: frame, start: 'top bottom', end: 'bottom top', scrub: true },
        },
      )
      gsap.fromTo(
        frame,
        { clipPath: 'inset(12% 8% 12% 8%)' },
        {
          clipPath: 'inset(0% 0% 0% 0%)',
          ease: 'power2.out',
          scrollTrigger: { trigger: frame, start: 'top 95%', end: 'top 40%', scrub: true },
        },
      )
    }))
  }, root.value)
})
onUnmounted(() => ctx?.revert())
</script>

<template>
  <section id="recognition" ref="root" class="rec wrap">
    <div class="section-head">
      <span class="label"><span class="label--accent">(05)</span>&nbsp; Recognition</span>
      <span class="label">Presented on stage</span>
    </div>

    <h2 v-split class="rec-title">Drawn for the <em>stage.</em></h2>

    <div class="moments">
      <article v-for="(m, i) in moments" :key="m.name" class="moment" :class="`moment--${i + 1}`">
        <div class="m-frame">
          <img :src="m.img" :alt="m.alt" loading="lazy" />
        </div>
        <div class="m-text">
          <span class="label">{{ m.role }}</span>
          <h3 v-split class="m-name">{{ m.name }}</h3>
          <p v-reveal="150">{{ m.text }}</p>
          <button v-if="m.artId" v-reveal="250" class="m-link" @click="openArt(m.artId)">
            <span class="roll"><span>See the drawing</span><span aria-hidden="true">See the drawing</span></span>
            <span class="arrow">→</span>
          </button>
        </div>
      </article>
    </div>
  </section>
</template>

<style scoped>
.rec {
  padding-block: clamp(80px, 12vw, 180px);
}

.rec-title {
  font-size: clamp(3rem, 10vw, 11rem);
  letter-spacing: -0.045em;
  margin-top: clamp(20px, 3vw, 40px);
}

.rec-title :deep(em) {
  color: var(--fg-mute);
}

.moments {
  margin-top: clamp(48px, 8vw, 120px);
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  column-gap: var(--gutter);
  row-gap: clamp(72px, 10vw, 160px);
}

.moment {
  display: grid;
  gap: 1.5rem;
  align-content: start;
}

.moment--1 {
  grid-column: 1 / 7;
}

.moment--2 {
  grid-column: 8 / 12;
  margin-top: clamp(80px, 22vw, 360px);
}

.m-frame {
  aspect-ratio: 3 / 4;
  overflow: hidden;
  background: var(--bg-raised);
}

.m-frame img {
  width: 100%;
  height: 118%;
  margin-top: -9%;
  object-fit: cover;
}

.m-text {
  display: grid;
  gap: 0.75rem;
  max-width: 44ch;
}

.m-name {
  font-size: clamp(2rem, 3.6vw, 3.6rem);
  letter-spacing: -0.03em;
}

.m-text p {
  color: var(--fg-soft);
}

.m-link {
  justify-self: start;
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.4rem 0;
  background: none;
  border: 0;
  border-bottom: 1px solid var(--line-strong);
  cursor: pointer;
  font-size: 0.92rem;
}

@media (max-width: 900px) {
  .rec {
    padding-block: 88px;
  }
  .rec-title {
    font-size: clamp(2.8rem, 13vw, 6rem);
  }
  .moments {
    row-gap: 64px;
    margin-top: 40px;
  }
  .moment--1,
  .moment--2 {
    grid-column: 1 / -1;
    margin-top: 0;
  }
  /* full-bleed photos on phones */
  .m-frame {
    margin-inline: calc(-1 * var(--gutter));
  }
  .m-frame img {
    height: 100%;
    margin-top: 0;
    filter: grayscale(1);
    transition: filter 1.6s var(--ease-soft);
  }
  .m-frame.bloom img {
    filter: none;
  }
  .m-name {
    font-size: clamp(2rem, 9vw, 3rem);
  }
}

@media (max-width: 900px) and (prefers-reduced-motion: reduce) {
  .m-frame img {
    filter: none;
  }
}
</style>
