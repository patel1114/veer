<script setup>
/* Infinite subject marquee. Scroll velocity nudges its speed and
   direction, so the page feels physically connected to the hand. */
import { onMounted, onUnmounted, ref } from 'vue'
import { gsap, ScrollTrigger, reducedMotion } from '../composables/motion'

const words = ['Portraits', 'Couples', 'Families', 'Children', 'Devotional', 'Keepsakes']
const track = ref(null)
let tween, st

onMounted(() => {
  if (reducedMotion) return
  tween = gsap.to(track.value, { xPercent: -50, duration: 38, ease: 'none', repeat: -1 })
  st = ScrollTrigger.create({
    onUpdate: (self) => {
      const v = self.getVelocity() / 260
      const dir = self.direction
      gsap.to(tween, {
        timeScale: dir * gsap.utils.clamp(1, 6, Math.abs(v) + 1),
        duration: 0.2,
        overwrite: true,
        onComplete: () => gsap.to(tween, { timeScale: dir, duration: 1.2 }),
      })
    },
  })
})

onUnmounted(() => {
  tween?.kill()
  st?.kill()
})
</script>

<template>
  <div class="marquee" aria-hidden="true">
    <div ref="track" class="track">
      <template v-for="n in 2" :key="n">
        <span v-for="w in words" :key="`${n}-${w}`" class="item">
          {{ w }}<span class="sep">✦</span>
        </span>
      </template>
    </div>
  </div>
</template>

<style scoped>
.marquee {
  overflow: hidden;
  border-block: 1px solid var(--line);
  padding-block: clamp(14px, 2vw, 26px);
  margin-top: clamp(24px, 6vh, 64px);
}

.track {
  display: flex;
  width: max-content;
  will-change: transform;
}

.item {
  display: inline-flex;
  align-items: center;
  font-family: var(--serif);
  font-size: clamp(2rem, 5.5vw, 5.5rem);
  line-height: 1;
  letter-spacing: -0.03em;
  white-space: nowrap;
  padding-right: 0.5em;
}

.item:nth-child(even) {
  font-style: italic;
  color: var(--fg-mute);
}

.sep {
  font-family: var(--sans);
  font-size: 0.35em;
  color: var(--accent);
  padding-left: 0.5em;
}
</style>
