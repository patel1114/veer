<script setup>
/* The artist's statement, set large. Each word "inks in" from
   graphite-grey to full as you read down the page (scroll-scrubbed). */
import { onMounted, onUnmounted, ref } from 'vue'
import { gsap, reducedMotion } from '../composables/motion'

const root = ref(null)
const text =
  'I draw to slow the world down — to find the one line that holds a whole gesture. Every portrait is built by hand, layer on layer of graphite, until a photograph becomes something you can hold.'
const words = text.split(' ')
let ctx

onMounted(() => {
  if (reducedMotion) return
  ctx = gsap.context(() => {
    gsap.fromTo(
      '.st-word',
      { opacity: 0.14 },
      {
        opacity: 1,
        ease: 'none',
        stagger: 0.12,
        scrollTrigger: { trigger: '.st-text', start: 'top 78%', end: 'bottom 45%', scrub: true },
      },
    )
  }, root.value)
})
onUnmounted(() => ctx?.revert())
</script>

<template>
  <section id="statement" ref="root" class="statement wrap">
    <div class="st-side">
      <p class="label" v-reveal><span class="label--accent">(01)</span>&nbsp; The practice</p>
    </div>
    <p class="st-text" :aria-label="text">
      <span v-for="(w, i) in words" :key="i" class="st-word" aria-hidden="true">{{ w + ' ' }}</span>
    </p>
    <div class="st-meta">
      <div v-reveal="0">
        <span class="label">Medium</span>
        <p>Graphite, charcoal &amp; colour pencil on paper</p>
      </div>
      <div v-reveal="100">
        <span class="label">Subjects</span>
        <p>Portraits, couples, families, children, devotional</p>
      </div>
      <div v-reveal="200">
        <span class="label">Studio</span>
        <p>Gujarat, India — commissions by WhatsApp</p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.statement {
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  column-gap: var(--gutter);
  row-gap: clamp(40px, 6vw, 80px);
  padding-block: clamp(96px, 16vw, 220px);
}

.st-side {
  grid-column: 1 / 3;
  padding-top: 0.9em;
}

.st-text {
  grid-column: 3 / 13;
  font-family: var(--serif);
  font-size: clamp(1.75rem, 4.1vw, 4.4rem);
  line-height: 1.08;
  letter-spacing: -0.025em;
  text-wrap: pretty;
}

.st-word {
  opacity: 0.14;
}

.st-meta {
  grid-column: 3 / 13;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--gutter);
  border-top: 1px solid var(--line);
  padding-top: 1.25rem;
}

.st-meta p {
  margin-top: 0.5rem;
  color: var(--fg-soft);
  font-size: 0.95rem;
  max-width: 28ch;
}

@media (prefers-reduced-motion: reduce) {
  .st-word { opacity: 1; }
}

@media (max-width: 900px) {
  .st-side,
  .st-text,
  .st-meta {
    grid-column: 1 / -1;
  }
  .st-meta {
    grid-template-columns: 1fr;
    gap: 1.25rem;
  }
}
</style>
