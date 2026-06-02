<script setup>
import { site } from '../data/site'
import featured from '../assets/artworks/camo-portrait.jpg'
import { onMounted, onUnmounted, ref } from 'vue'

/* ---- Staggered hero entrance ---- */
const ready = ref(false)
onMounted(() => {
  // Delay so it plays AFTER the intro screen fades out
  setTimeout(() => { ready.value = true }, 2400)
})

/* ---- Parallax on the hero image ---- */
const parallaxY = ref(0)
const onScroll = () => {
  parallaxY.value = window.scrollY * 0.15
}
onMounted(() => window.addEventListener('scroll', onScroll, { passive: true }))
onUnmounted(() => window.removeEventListener('scroll', onScroll))
</script>

<template>
  <section id="top" class="hero" :class="{ ready }">
    <!-- Animated background grain -->
    <div class="hero-bg-accent"></div>

    <div class="container hero-grid">
      <div class="hero-text">
        <p class="eyebrow hero-eyebrow">
          <span class="hero-stagger" style="--si:0">{{ site.name }}</span>
          <span class="hero-stagger" style="--si:1"> — </span>
          <span class="hero-stagger" style="--si:2">{{ site.role }}</span>
        </p>

        <h1 class="hero-headline">
          <span
            v-for="(word, wi) in site.tagline.split(' ')"
            :key="wi"
            class="hero-word"
            :style="{ '--wi': wi }"
          >{{ word }}&nbsp;</span>
        </h1>

        <p class="lede hero-lede">{{ site.intro }}</p>

        <div class="hero-actions">
          <a href="#work" class="btn hero-btn" style="--bi:0">View the work</a>
          <a href="#contact" class="btn btn--ghost hero-btn" style="--bi:1">Order now</a>
        </div>
      </div>

      <figure class="hero-art" :style="{ transform: `translateY(${parallaxY}px)` }">
        <div class="hero-art-frame">
          <img :src="featured" alt="One of my hyper-real graphite portraits" />
        </div>
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
  overflow: hidden;
}

/* Animated accent gradient in the background */
.hero-bg-accent {
  position: absolute;
  top: -30%;
  right: -20%;
  width: 600px;
  height: 600px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(154, 59, 34, 0.08) 0%, transparent 70%);
  animation: bg-float 8s ease-in-out infinite;
  pointer-events: none;
}

@keyframes bg-float {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(-40px, 30px) scale(1.1); }
  66% { transform: translate(20px, -20px) scale(0.95); }
}

.hero-grid {
  display: grid;
  grid-template-columns: 1.15fr 0.85fr;
  align-items: center;
  gap: clamp(32px, 6vw, 96px);
}

/* ---- Staggered eyebrow ---- */
.hero-eyebrow {
  overflow: hidden;
}

.hero-stagger {
  display: inline-block;
  opacity: 0;
  transform: translateY(100%);
  transition: opacity 0.8s var(--spring), transform 0.8s var(--spring);
  transition-delay: calc(var(--si) * 80ms + 200ms);
}

.ready .hero-stagger {
  opacity: 1;
  transform: none;
}

/* ---- Word-by-word headline ---- */
.hero-headline {
  margin: 0.2em 0 0.4em;
  overflow: hidden;
}

.hero-word {
  display: inline-block;
  opacity: 0;
  transform: translateY(100%) rotate(5deg);
  filter: blur(8px);
  transition:
    opacity 0.8s var(--spring),
    transform 1s var(--spring),
    filter 0.6s ease;
  transition-delay: calc(var(--wi) * 120ms + 400ms);
}

.ready .hero-word {
  opacity: 1;
  transform: none;
  filter: blur(0);
}

/* ---- Lede paragraph ---- */
.hero-lede {
  opacity: 0;
  transform: translateY(30px);
  filter: blur(4px);
  transition: opacity 0.8s ease 0.9s, transform 0.8s var(--spring) 0.9s, filter 0.6s ease 0.9s;
}

.ready .hero-lede {
  opacity: 1;
  transform: none;
  filter: blur(0);
}

/* ---- CTA buttons ---- */
.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 2.5rem;
}

.hero-btn {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.6s ease, transform 0.6s var(--spring);
  /* Keep button hover transitions too */
}

.ready .hero-btn {
  opacity: 1;
  transform: none;
  transition-delay: calc(var(--bi) * 100ms + 1100ms);
}

/* Re-apply hover after reveal */
.ready .hero-btn:hover {
  transform: translateY(-3px) scale(1.02);
}

/* ---- Hero artwork with clip-path reveal ---- */
.hero-art {
  margin: 0;
  position: relative;
  justify-self: end;
  max-width: 420px;
  will-change: transform;
}

.hero-art-frame {
  overflow: hidden;
  clip-path: inset(100% 0 0 0);
  transition: clip-path 1.2s var(--ease-out-expo) 0.6s;
}

.ready .hero-art-frame {
  clip-path: inset(0 0 0 0);
}

.hero-art img {
  width: 100%;
  height: auto;
  border: 1px solid var(--line);
  box-shadow:
    0 1px 0 rgba(255, 255, 255, 0.6) inset,
    0 30px 60px -30px rgba(21, 20, 15, 0.45);
  transform: scale(1.1);
  transition: transform 1.4s var(--ease-out-expo) 0.6s;
}

.ready .hero-art img {
  transform: scale(1);
}

.hero-art figcaption {
  font-family: var(--display);
  font-style: italic;
  font-size: 0.95rem;
  color: var(--ink-mute);
  margin-top: 0.9rem;
  text-align: right;
  opacity: 0;
  transition: opacity 0.6s ease 1.6s;
}

.ready .hero-art figcaption {
  opacity: 1;
}

/* ---- Scroll cue ---- */
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
  opacity: 0;
  transition: opacity 0.6s ease 2s;
}

.ready .scroll-cue {
  opacity: 1;
}

.scroll-cue svg {
  animation: bob 1.8s ease-in-out infinite;
}

@keyframes bob {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(8px); }
}

@media (prefers-reduced-motion: reduce) {
  .scroll-cue svg { animation: none; }
  .hero-word, .hero-stagger, .hero-lede, .hero-btn, .hero-art-frame, .hero-art img, .hero-art figcaption, .scroll-cue {
    opacity: 1 !important;
    transform: none !important;
    filter: none !important;
    clip-path: none !important;
    transition: none !important;
  }
}

@media (max-width: 860px) {
  .hero { padding-block: 100px 56px; }
  .hero-grid { grid-template-columns: 1fr; gap: 40px; }
  .hero-art { justify-self: start; max-width: 300px; }
  .hero-art figcaption { text-align: left; }
  .scroll-cue { display: none; }
  .hero-bg-accent { width: 400px; height: 400px; top: -20%; right: -30%; }
}

@media (max-width: 480px) {
  .hero { padding-block: 88px 40px; min-height: auto; }
  .hero-art { max-width: 260px; }
  .hero-actions { flex-direction: column; margin-top: 2rem; }
}
</style>
