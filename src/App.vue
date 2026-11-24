<script setup>
import { onMounted, onUnmounted, nextTick } from 'vue'
import { initSmoothScroll, scrollToTarget, ScrollTrigger } from './composables/motion'
import { ui } from './stores/ui'

import ThePreloader from './components/ThePreloader.vue'
import TheCursor from './components/TheCursor.vue'
import TheHeader from './components/TheHeader.vue'
import HeroSection from './components/HeroSection.vue'
import MarqueeBand from './components/MarqueeBand.vue'
import StatementSection from './components/StatementSection.vue'
import WorkSection from './components/WorkSection.vue'
import CraftSection from './components/CraftSection.vue'
import SubjectsSection from './components/SubjectsSection.vue'
import RecognitionSection from './components/RecognitionSection.vue'
import ContactSection from './components/ContactSection.vue'
import TheFooter from './components/TheFooter.vue'
import ArtworkViewer from './components/ArtworkViewer.vue'
import WhatsappFab from './components/WhatsappFab.vue'

/* All in-page anchors glide through Lenis instead of jumping. */
const onAnchorClick = (e) => {
  const a = e.target.closest('a[href^="#"]')
  if (!a) return
  const href = a.getAttribute('href')
  if (href.length < 2) return
  e.preventDefault()
  scrollToTarget(href)
  history.replaceState(null, '', href === '#top' ? location.pathname : href)
}

/* Sections marked data-theme="paper" flip the whole page to paper
   as they cross the middle of the viewport — a seamless hand-off. */
let themeTriggers = []
const setupThemes = () => {
  themeTriggers = [...document.querySelectorAll('[data-theme]')].map((section) =>
    ScrollTrigger.create({
      trigger: section,
      start: 'top 55%',
      end: 'bottom 45%',
      onToggle: ({ isActive }) => {
        if (isActive) document.documentElement.dataset.theme = section.dataset.theme
        else if (document.documentElement.dataset.theme === section.dataset.theme)
          delete document.documentElement.dataset.theme
      },
    }),
  )
}

const refresh = () => ScrollTrigger.refresh()

onMounted(async () => {
  initSmoothScroll()
  document.addEventListener('click', onAnchorClick)
  await nextTick()
  setupThemes()
  window.addEventListener('load', refresh)
  document.fonts?.ready.then(refresh)
})

onUnmounted(() => {
  document.removeEventListener('click', onAnchorClick)
  window.removeEventListener('load', refresh)
  themeTriggers.forEach((t) => t.kill())
})
</script>

<template>
  <ThePreloader />
  <TheCursor />
  <div class="grain" aria-hidden="true"></div>

  <TheHeader />
  <main id="top">
    <HeroSection />
    <MarqueeBand />
    <StatementSection />
    <WorkSection />
    <CraftSection />
    <SubjectsSection />
    <RecognitionSection />
    <ContactSection />
  </main>
  <TheFooter />

  <WhatsappFab />
  <ArtworkViewer v-if="ui.viewer.open" />
</template>
