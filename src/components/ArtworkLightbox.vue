<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'

const props = defineProps({
  items: { type: Array, required: true },
  index: { type: Number, required: true },
})
const emit = defineEmits(['close', 'navigate'])

const dialog = ref(null)
const current = computed(() => props.items[props.index] ?? null)
const hasItems = computed(() => props.items.length > 0)

const next = () => emit('navigate', (props.index + 1) % props.items.length)
const prev = () =>
  emit('navigate', (props.index - 1 + props.items.length) % props.items.length)

const onKey = (e) => {
  if (e.key === 'Escape') emit('close')
  else if (e.key === 'ArrowRight') next()
  else if (e.key === 'ArrowLeft') prev()
}

/* ---- Touch swipe support for mobile ---- */
const touchStartX = ref(0)
const touchStartY = ref(0)
const swiping = ref(false)

const onTouchStart = (e) => {
  touchStartX.value = e.touches[0].clientX
  touchStartY.value = e.touches[0].clientY
  swiping.value = true
}

const onTouchEnd = (e) => {
  if (!swiping.value) return
  swiping.value = false
  const dx = e.changedTouches[0].clientX - touchStartX.value
  const dy = e.changedTouches[0].clientY - touchStartY.value
  // Only trigger if horizontal swipe is dominant and > 50px
  if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) {
    if (dx < 0) next()
    else prev()
  }
}

/* ---- Mock client reviews ---- */
const reviews = [
  {
    name: 'Priya M.',
    location: 'Ahmedabad',
    stars: 5,
    text: 'Veer captured every detail of my father\'s portrait. It\'s now the centerpiece of our living room. Truly a treasure.',
  },
  {
    name: 'Rohan S.',
    location: 'Mumbai',
    stars: 5,
    text: 'I commissioned a couple portrait for our anniversary. My wife cried when she saw it. Worth every rupee.',
  },
  {
    name: 'Anita D.',
    location: 'Puri',
    stars: 5,
    text: 'The Jagannath drawing Veer made for our temple is breathtaking. People think it\'s printed!',
  },
  {
    name: 'Karan P.',
    location: 'Surat',
    stars: 5,
    text: 'Got a sketch of my daughter — the likeness is uncanny. Veer is incredibly patient and professional.',
  },
]

onMounted(() => {
  document.addEventListener('keydown', onKey)
  document.body.classList.add('is-locked')
  dialog.value?.focus()
})
onUnmounted(() => {
  document.removeEventListener('keydown', onKey)
  document.body.classList.remove('is-locked')
})

watch(
  () => props.index,
  () => dialog.value?.focus(),
)
</script>

<template>
  <div
    v-if="hasItems && current"
    class="lb"
    role="dialog"
    aria-modal="true"
    :aria-label="`Artwork: ${current.title}`"
    @click.self="emit('close')"
    @touchstart.passive="onTouchStart"
    @touchend.passive="onTouchEnd"
  >
    <button class="lb-close" aria-label="Close" @click="emit('close')">
      <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden="true">
        <path d="M3 3l16 16M19 3L3 19" stroke="currentColor" stroke-width="1.6" />
      </svg>
    </button>

    <button class="lb-nav prev" aria-label="Previous" @click="prev">
      <svg width="34" height="34" viewBox="0 0 34 34" aria-hidden="true">
        <path d="M21 5L9 17l12 12" stroke="currentColor" stroke-width="1.6" fill="none" />
      </svg>
    </button>

    <div
      ref="dialog"
      tabindex="-1"
      class="lb-stage"
      @click.stop
    >
      <figure class="lb-figure">
        <img :key="current.id" :src="current.image" :alt="current.title" />
      </figure>

      <!-- Client Reviews Section -->
      <section class="lb-reviews">
        <h3 class="lb-reviews-title">Client Reviews</h3>
        <div class="lb-reviews-grid">
          <article v-for="(review, ri) in reviews" :key="ri" class="review-card">
            <div class="review-stars">
              <span v-for="s in review.stars" :key="s" class="star">★</span>
            </div>
            <p class="review-text">"{{ review.text }}"</p>
            <p class="review-author">
              {{ review.name }}
              <span class="review-location">{{ review.location }}</span>
            </p>
          </article>
        </div>
      </section>
    </div>

    <button class="lb-nav next" aria-label="Next" @click="next">
      <svg width="34" height="34" viewBox="0 0 34 34" aria-hidden="true">
        <path d="M13 5l12 12-12 12" stroke="currentColor" stroke-width="1.6" fill="none" />
      </svg>
    </button>

    <p class="lb-counter">{{ index + 1 }} / {{ items.length }}</p>

    <!-- Mobile swipe hint -->
    <p class="lb-swipe-hint">Swipe to navigate</p>
  </div>
</template>

<style scoped>
.lb {
  position: fixed;
  inset: 0;
  z-index: 100;
  background: var(--overlay);
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: start;
  gap: clamp(8px, 3vw, 40px);
  padding: clamp(16px, 4vw, 56px);
  animation: lb-in 0.4s var(--ease-out-expo);
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

@keyframes lb-in {
  from {
    opacity: 0;
    backdrop-filter: blur(0);
  }
  to {
    opacity: 1;
    backdrop-filter: blur(20px);
  }
}

.lb-stage {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  outline: none;
  padding-bottom: 60px;
}

.lb-figure {
  margin: 0;
  display: flex;
  justify-content: center;
}

.lb-figure img {
  max-width: 100%;
  max-height: 65vh;
  width: auto;
  height: auto;
  object-fit: contain;
  box-shadow: 0 40px 80px -30px rgba(0, 0, 0, 0.7);
  animation: img-in 0.5s var(--spring);
  border-radius: 2px;
}

@keyframes img-in {
  from {
    opacity: 0;
    transform: scale(0.95);
    filter: blur(8px);
  }
  to {
    opacity: 1;
    transform: scale(1);
    filter: blur(0);
  }
}

/* ---- Client Reviews ---- */
.lb-reviews {
  width: 100%;
  max-width: 800px;
  padding-top: 1rem;
}

.lb-reviews-title {
  text-align: center;
  color: rgba(246, 244, 238, 0.9);
  font-family: var(--display);
  font-size: 1.4rem;
  font-weight: 400;
  margin-bottom: 1.25rem;
  letter-spacing: 0.02em;
}

.lb-reviews-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.review-card {
  background: rgba(246, 244, 238, 0.07);
  border: 1px solid rgba(246, 244, 238, 0.12);
  border-radius: 12px;
  padding: 1.25rem;
  backdrop-filter: blur(8px);
  transition: background 0.3s ease, border-color 0.3s ease;
  animation: review-in 0.5s var(--spring) both;
}

.review-card:nth-child(1) { animation-delay: 0.2s; }
.review-card:nth-child(2) { animation-delay: 0.3s; }
.review-card:nth-child(3) { animation-delay: 0.4s; }
.review-card:nth-child(4) { animation-delay: 0.5s; }

@keyframes review-in {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}

.review-card:hover {
  background: rgba(246, 244, 238, 0.12);
  border-color: rgba(246, 244, 238, 0.2);
}

.review-stars {
  margin-bottom: 0.6rem;
}

.star {
  color: #f5c518;
  font-size: 0.95rem;
  letter-spacing: 0.1em;
}

.review-text {
  color: rgba(246, 244, 238, 0.85);
  font-size: 0.9rem;
  line-height: 1.55;
  font-style: italic;
  margin-bottom: 0.75rem;
}

.review-author {
  font-size: 0.82rem;
  font-weight: 600;
  color: rgba(246, 244, 238, 0.7);
  letter-spacing: 0.03em;
}

.review-location {
  font-weight: 400;
  margin-left: 0.4rem;
  color: rgba(246, 244, 238, 0.45);
}

/* ---- Controls ---- */
.lb-close,
.lb-nav {
  background: none;
  border: 1px solid rgba(246, 244, 238, 0.2);
  border-radius: 999px;
  color: var(--paper);
  cursor: pointer;
  display: grid;
  place-items: center;
  transition:
    background 0.3s ease,
    border-color 0.3s ease,
    transform 0.3s var(--spring);
}
.lb-close:hover,
.lb-nav:hover {
  background: rgba(246, 244, 238, 0.12);
  border-color: rgba(246, 244, 238, 0.5);
  transform: scale(1.08);
}

.lb-nav {
  width: 52px;
  height: 52px;
  position: sticky;
  top: 50%;
}

.lb-close {
  position: fixed;
  top: clamp(12px, 3vw, 28px);
  right: clamp(12px, 3vw, 28px);
  width: 44px;
  height: 44px;
  z-index: 2;
}

.lb-counter {
  position: fixed;
  bottom: clamp(12px, 3vw, 24px);
  left: 50%;
  transform: translateX(-50%);
  font-size: 0.8rem;
  letter-spacing: 0.15em;
  color: rgba(246, 244, 238, 0.5);
}

.lb-swipe-hint {
  display: none;
}

/* ---- Mobile ---- */
@media (max-width: 680px) {
  .lb {
    grid-template-columns: 1fr;
    padding: 12px;
    padding-top: 56px;
    align-items: start;
  }

  .lb-nav {
    position: fixed;
    bottom: 48px;
    top: auto;
    z-index: 2;
    width: 48px;
    height: 48px;
  }
  .lb-nav.prev {
    left: 16px;
  }
  .lb-nav.next {
    right: 16px;
  }

  .lb-figure img {
    max-height: 50vh;
    width: 100%;
  }

  .lb-reviews-grid {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }

  .review-card {
    padding: 1rem;
  }

  .lb-swipe-hint {
    display: block;
    position: fixed;
    bottom: 12px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 0.7rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: rgba(246, 244, 238, 0.35);
    animation: hint-fade 3s ease forwards;
  }

  @keyframes hint-fade {
    0%, 70% { opacity: 1; }
    100% { opacity: 0; }
  }

  .lb-counter {
    bottom: auto;
    top: 18px;
    left: 50%;
  }
}

@media (max-width: 380px) {
  .review-text {
    font-size: 0.82rem;
  }
  .review-card {
    padding: 0.8rem;
  }
}
</style>
