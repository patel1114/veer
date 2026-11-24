<script setup>
/* The Veer Art VA monogram as crisp vector line art.
   Inherits `color`; `ring` adds the logo's double ring. */
import { ring as ringPaths, stems, hairlines } from '../data/monogram'

defineProps({
  ring: { type: Boolean, default: false },
})
</script>

<template>
  <svg
    class="va"
    :viewBox="ring ? '0 0 120 120' : '30 33 56 56'"
    role="img"
    aria-label="Veer Art"
    focusable="false"
  >
    <template v-if="ring">
      <path :d="ringPaths[0]" fill="none" stroke="currentColor" stroke-width="1.3" />
      <path :d="ringPaths[1]" fill="none" stroke="currentColor" stroke-width="0.6" />
    </template>
    <path v-for="(d, i) in stems" :key="'s' + i" :d="d" fill="currentColor" />
    <path
      v-for="(d, i) in hairlines"
      :key="'h' + i"
      :d="d"
      fill="none"
      stroke="currentColor"
      stroke-width="0.9"
      stroke-linecap="square"
    />
  </svg>
</template>

<style scoped>
.va {
  display: block;
  height: 100%;
  width: auto;
  overflow: visible;
}
</style>
