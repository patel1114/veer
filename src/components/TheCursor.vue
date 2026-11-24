<script setup>
/* Two-part cursor (fine pointers only):
   - a dot that tracks the pointer exactly
   - a ring that trails with inertia and morphs by context:
       [data-cursor="view"]  → large disc labelled "View"
       [data-cursor="draw"]  → pencil ring labelled "Draw"
       links / buttons       → slightly enlarged ring
   Native cursor stays visible for text fields and accessibility. */
import { onMounted, onUnmounted, ref } from 'vue'
import { gsap, finePointer, reducedMotion } from '../composables/motion'

const enabled = finePointer && !reducedMotion
const ring = ref(null)
const dot = ref(null)
const state = ref('')
const label = ref('')
const hidden = ref(true)

let xRing, yRing, xDot, yDot

const onMove = (e) => {
  hidden.value = false
  xDot(e.clientX)
  yDot(e.clientY)
  xRing(e.clientX)
  yRing(e.clientY)

  const target = e.target.closest?.('[data-cursor], a, button')
  if (!target) {
    state.value = ''
    label.value = ''
    return
  }
  const kind = target.dataset?.cursor
  if (kind) {
    state.value = kind
    label.value = target.dataset.cursorLabel || (kind === 'view' ? 'View' : kind === 'draw' ? 'Draw' : '')
  } else {
    state.value = 'link'
    label.value = ''
  }
}

const onLeave = () => (hidden.value = true)

onMounted(() => {
  if (!enabled) return
  document.documentElement.classList.add('has-cursor')
  xRing = gsap.quickTo(ring.value, 'x', { duration: 0.55, ease: 'power3.out' })
  yRing = gsap.quickTo(ring.value, 'y', { duration: 0.55, ease: 'power3.out' })
  xDot = gsap.quickTo(dot.value, 'x', { duration: 0.08, ease: 'none' })
  yDot = gsap.quickTo(dot.value, 'y', { duration: 0.08, ease: 'none' })
  window.addEventListener('pointermove', onMove, { passive: true })
  document.addEventListener('pointerleave', onLeave)
})

onUnmounted(() => {
  window.removeEventListener('pointermove', onMove)
  document.removeEventListener('pointerleave', onLeave)
})
</script>

<template>
  <div v-if="enabled" class="cursor" :class="[state && `is-${state}`, { 'is-hidden': hidden }]" aria-hidden="true">
    <div ref="ring" class="c-ring">
      <span class="c-disc"></span>
      <span class="c-label">{{ label }}</span>
    </div>
    <div ref="dot" class="c-dot"></div>
  </div>
</template>

<style scoped>
.cursor {
  position: fixed;
  inset: 0;
  z-index: 900;
  pointer-events: none;
  transition: opacity 0.3s ease;
}

.cursor.is-hidden {
  opacity: 0;
}

.c-ring,
.c-dot {
  position: absolute;
  top: 0;
  left: 0;
  will-change: transform;
}

.c-dot {
  width: 6px;
  height: 6px;
  margin: -3px 0 0 -3px;
  border-radius: 50%;
  background: var(--accent);
  transition: opacity 0.3s ease;
}

.c-ring {
  width: 0;
  height: 0;
}

.c-disc {
  position: absolute;
  left: 0;
  top: 0;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 1px solid var(--fg-mute);
  transform: translate(-50%, -50%);
  transition:
    width 0.55s var(--ease-out),
    height 0.55s var(--ease-out),
    background-color 0.4s ease,
    border-color 0.4s ease;
}

.c-label {
  position: absolute;
  left: 0;
  top: 0;
  transform: translate(-50%, -50%) scale(0.6);
  opacity: 0;
  font-family: var(--mono);
  font-size: 0.68rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--graphite-950);
  white-space: nowrap;
  transition:
    opacity 0.3s ease,
    transform 0.5s var(--ease-out);
}

.is-link .c-disc {
  width: 56px;
  height: 56px;
  border-color: var(--fg);
}

.is-view .c-disc {
  width: 96px;
  height: 96px;
  background: var(--paper-50);
  border-color: var(--paper-50);
}

.is-draw .c-disc {
  width: 64px;
  height: 64px;
  background: var(--sindoor);
  border-color: var(--sindoor);
}

.is-draw .c-label {
  color: var(--paper-50);
}

.is-view .c-label,
.is-draw .c-label {
  opacity: 1;
  transform: translate(-50%, -50%) scale(1);
}

.is-view .c-dot,
.is-draw .c-dot {
  opacity: 0;
}

/* inside the viewer's loupe the magnifier is the cursor */
.is-loupe .c-disc,
.is-loupe .c-dot {
  opacity: 0;
}
</style>
