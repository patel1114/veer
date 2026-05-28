<script setup>
import { site, waUrl } from '../data/site'
import featured from '../assets/artworks/camo-portrait.jpg'
</script>

<template>
  <section id="top" class="hero">
    <div class="container hero-grid">
      <div class="hero-text">
        <p class="eyebrow" v-reveal>{{ site.name }} — {{ site.role }}</p>
        <h1 v-reveal="80">{{ site.tagline }}</h1>
        <p class="lede" v-reveal="180">{{ site.intro }}</p>
        <div class="hero-actions" v-reveal="260">
          <a href="#work" class="btn">View the work</a>
          <a :href="waUrl()" target="_blank" rel="noopener" class="btn btn--ghost">
            Order a sketch
          </a>
        </div>
      </div>

      <figure class="hero-art" v-reveal="160">
        <img :src="featured" alt="Hyper-real graphite portrait by Veer" />
        <figcaption>The Camo Shirt — graphite on paper</figcaption>
      </figure>
    </div>

    <a href="#work" class="scroll-cue" aria-label="Scroll to the work">
      <span>Scroll</span>
      <svg width="14" height="34" viewBox="0 0 14 34" fill="none" aria-hidden="true">
        <path d="M7 0v30M1 24l6 6 6-6" stroke="currentColor" stroke-width="1.4" />
      </svg>
    </a>
  </section>
</template>

<style scoped>
.hero {
  position: relative;
  min-height: 100svh;
  display: flex;
  align-items: center;
  padding-block: 120px 80px;
}

.hero-grid {
  display: grid;
  grid-template-columns: 1.15fr 0.85fr;
  align-items: center;
  gap: clamp(32px, 6vw, 96px);
}

.hero-text h1 {
  margin: 0.2em 0 0.4em;
  /* slight optical italic flourish on the display face */
  font-optical-sizing: auto;
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 2.5rem;
}

.hero-art {
  margin: 0;
  position: relative;
  justify-self: end;
  max-width: 420px;
  /* nudge the art off-axis for the editorial, asymmetric feel */
  transform: translateY(24px);
}

.hero-art img {
  width: 100%;
  height: auto;
  border: 1px solid var(--line);
  box-shadow:
    0 1px 0 rgba(255, 255, 255, 0.6) inset,
    0 30px 60px -30px rgba(21, 20, 15, 0.45);
}

.hero-art figcaption {
  font-family: var(--display);
  font-style: italic;
  font-size: 0.95rem;
  color: var(--ink-mute);
  margin-top: 0.9rem;
  text-align: right;
}

.scroll-cue {
  position: absolute;
  left: var(--gutter);
  bottom: 32px;
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  font-size: 0.7rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--ink-mute);
}

.scroll-cue svg {
  animation: bob 1.8s ease-in-out infinite;
}

@keyframes bob {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(6px);
  }
}

@media (prefers-reduced-motion: reduce) {
  .scroll-cue svg {
    animation: none;
  }
}

@media (max-width: 860px) {
  .hero-grid {
    grid-template-columns: 1fr;
    gap: 48px;
  }
  .hero-art {
    justify-self: start;
    transform: none;
    max-width: 320px;
  }
  .hero-art figcaption {
    text-align: left;
  }
  .scroll-cue {
    display: none;
  }
}
</style>
