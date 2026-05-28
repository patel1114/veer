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

onMounted(() => {
  document.addEventListener('keydown', onKey)
  document.body.classList.add('is-locked')
  // move focus into the dialog for keyboard users
  dialog.value?.focus()
})
onUnmounted(() => {
  document.removeEventListener('keydown', onKey)
  document.body.classList.remove('is-locked')
})

// keep focus on the dialog when navigating between pieces
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
    :aria-label="`${current.title}, ${current.medium}, ${current.year}`"
    @click.self="emit('close')"
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

    <figure
      ref="dialog"
      tabindex="-1"
      class="lb-stage"
      @click.stop
    >
      <img :key="current.id" :src="current.image" :alt="current.title" />
      <figcaption>
        <span class="lb-title">{{ current.title }}</span>
        <span class="lb-meta">{{ current.medium }} · {{ current.year }}</span>
        <span class="lb-desc" v-if="current.description">{{ current.description }}</span>
      </figcaption>
    </figure>

    <button class="lb-nav next" aria-label="Next" @click="next">
      <svg width="34" height="34" viewBox="0 0 34 34" aria-hidden="true">
        <path d="M13 5l12 12-12 12" stroke="currentColor" stroke-width="1.6" fill="none" />
      </svg>
    </button>

    <p class="lb-counter">{{ index + 1 }} / {{ items.length }}</p>
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
  align-items: center;
  gap: clamp(8px, 3vw, 40px);
  padding: clamp(20px, 5vw, 56px);
  animation: lb-in 0.3s ease;
}

@keyframes lb-in {
  from {
    opacity: 0;
  }
}

.lb-stage {
  margin: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.25rem;
  max-height: 100%;
  outline: none;
}

.lb-stage img {
  max-width: 100%;
  max-height: 72vh;
  width: auto;
  height: auto;
  object-fit: contain;
  box-shadow: 0 40px 80px -30px rgba(0, 0, 0, 0.7);
  animation: img-in 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes img-in {
  from {
    opacity: 0;
    transform: scale(0.98);
  }
}

.lb-stage figcaption {
  text-align: center;
  color: var(--paper);
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  max-width: 60ch;
}

.lb-title {
  font-family: var(--display);
  font-size: 1.5rem;
}
.lb-meta {
  font-size: 0.85rem;
  letter-spacing: 0.06em;
  color: rgba(246, 244, 238, 0.65);
}
.lb-desc {
  font-style: italic;
  color: rgba(246, 244, 238, 0.8);
  margin-top: 0.25rem;
}

.lb-close,
.lb-nav {
  background: none;
  border: 1px solid rgba(246, 244, 238, 0.25);
  border-radius: 999px;
  color: var(--paper);
  cursor: pointer;
  display: grid;
  place-items: center;
  transition:
    background 0.25s ease,
    border-color 0.25s ease;
}
.lb-close:hover,
.lb-nav:hover {
  background: rgba(246, 244, 238, 0.12);
  border-color: rgba(246, 244, 238, 0.6);
}

.lb-nav {
  width: 56px;
  height: 56px;
}

.lb-close {
  position: absolute;
  top: clamp(16px, 4vw, 32px);
  right: clamp(16px, 4vw, 32px);
  width: 46px;
  height: 46px;
  z-index: 2;
}

.lb-counter {
  position: absolute;
  bottom: clamp(16px, 4vw, 28px);
  left: 50%;
  transform: translateX(-50%);
  font-size: 0.8rem;
  letter-spacing: 0.15em;
  color: rgba(246, 244, 238, 0.6);
}

@media (max-width: 680px) {
  .lb {
    grid-template-columns: 1fr;
  }
  .lb-nav {
    position: absolute;
    bottom: 56px;
    z-index: 2;
  }
  .lb-nav.prev {
    left: clamp(16px, 6vw, 40px);
  }
  .lb-nav.next {
    right: clamp(16px, 6vw, 40px);
  }
  .lb-stage img {
    max-height: 62vh;
  }
}
</style>
