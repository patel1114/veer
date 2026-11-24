<script setup>
import WaIcon from './WaIcon.vue'
import VaMark from './VaMark.vue'
/* Minimal fixed header: typographic wordmark, rolling nav labels,
   one clear CTA. Hides while scrolling down, returns on scroll up.
   Mobile: full-screen menu with staggered oversized links. */
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { site, waUrl } from '../data/site'
import { ui } from '../stores/ui'
import { lockScroll, unlockScroll } from '../composables/motion'

const links = [
  { label: 'Work', href: '#work', n: '01' },
  { label: 'Craft', href: '#craft', n: '02' },
  { label: 'Recognition', href: '#recognition', n: '03' },
  { label: 'Contact', href: '#contact', n: '04' },
]

const hidden = ref(false)
const scrolled = ref(false)
const menuOpen = ref(false)
let lastY = 0

const onScroll = () => {
  const y = window.scrollY
  scrolled.value = y > 40
  if (!menuOpen.value) hidden.value = y > lastY && y > 240
  lastY = y
}

const toggle = () => (menuOpen.value = !menuOpen.value)
const close = () => (menuOpen.value = false)
const onKey = (e) => e.key === 'Escape' && close()

watch(menuOpen, (open) => (open ? lockScroll() : unlockScroll()))

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  document.addEventListener('keydown', onKey)
})
onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
  document.removeEventListener('keydown', onKey)
})
</script>

<template>
  <header
    class="hdr"
    :class="{ 'is-hidden': hidden && !ui.viewer.open, 'is-scrolled': scrolled, 'is-ready': ui.introDone, 'menu-open': menuOpen }"
  >
    <div class="hdr-bar">
      <a href="#top" class="mark" aria-label="Veer Art — back to top" @click="close">
        <span class="mark-va"><VaMark /></span>
        <span class="mark-text">
          <span class="mark-name">Veer Art</span>
          <span class="mark-sub label">Graphite portraits</span>
        </span>
      </a>

      <nav class="nav" aria-label="Primary">
        <a v-for="l in links" :key="l.href" :href="l.href" class="nav-link">
          <span class="roll"><span>{{ l.label }}</span><span aria-hidden="true">{{ l.label }}</span></span>
        </a>
      </nav>

      <div class="hdr-actions">
        <a :href="waUrl()" target="_blank" rel="noopener" class="pill pill--wa hdr-cta">
          <WaIcon />
          <span class="roll"><span>Order a sketch</span><span aria-hidden="true">Order a sketch</span></span>
        </a>
        <button class="burger" :aria-expanded="menuOpen" aria-controls="mobile-menu" aria-label="Menu" @click="toggle">
          <span></span><span></span>
        </button>
      </div>
    </div>

    <!-- Mobile menu -->
    <div id="mobile-menu" class="mm" :class="{ open: menuOpen }" :inert="!menuOpen">
      <nav class="mm-nav" aria-label="Mobile">
        <a
          v-for="(l, i) in links"
          :key="l.href"
          :href="l.href"
          class="mm-link"
          :style="{ '--i': i }"
          @click="close"
        >
          <span class="label">{{ l.n }}</span>
          <span class="mm-text">{{ l.label }}</span>
        </a>
      </nav>
      <div class="mm-foot">
        <a :href="waUrl()" target="_blank" rel="noopener" class="pill pill--wa mm-cta" @click="close">
          <WaIcon />
          Order a sketch on WhatsApp <span class="arrow">→</span>
        </a>
        <div class="mm-quick">
          <a :href="`tel:+${site.whatsapp}`" class="label">Call</a>
          <a :href="site.socials[0].url" target="_blank" rel="noopener" class="label">Instagram</a>
          <a :href="`mailto:${site.email}`" class="label">Email</a>
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped>
.hdr {
  position: fixed;
  inset: 0 0 auto 0;
  z-index: 100;
  visibility: hidden;
  transition: transform 0.7s var(--ease-out);
}

.hdr.is-ready {
  visibility: visible;
}

.hdr.is-ready .hdr-bar {
  animation: hdr-in 1s var(--ease-out) 0.9s backwards;
}

@keyframes hdr-in {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
}

.hdr.is-ready.is-hidden {
  transform: translateY(-110%);
}

.hdr-bar {
  position: relative;
  z-index: 2;
  height: var(--header-h);
  padding-inline: var(--gutter);
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  transition:
    background-color 0.5s ease,
    backdrop-filter 0.5s ease;
}

.is-scrolled .hdr-bar {
  background: color-mix(in srgb, var(--bg) 72%, transparent);
  backdrop-filter: blur(14px) saturate(1.2);
  -webkit-backdrop-filter: blur(14px) saturate(1.2);
}

.menu-open .hdr-bar {
  background: transparent;
  backdrop-filter: none;
}

.mark {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  justify-self: start;
}

/* the VA monogram from the Veer Art logo */
.mark-va {
  height: 34px;
  transition: transform 0.6s var(--ease-out);
}

.mark:hover .mark-va {
  transform: rotate(-6deg) scale(1.06);
}

.mark-text {
  display: grid;
  gap: 0.2rem;
  padding-left: 0.75rem;
  border-left: 1px solid var(--line-strong);
}

.mark-name {
  font-family: var(--serif);
  font-size: 0.95rem;
  letter-spacing: 0.24em;
  text-transform: uppercase;
  line-height: 1;
}

.mark-sub {
  font-size: 0.6rem;
  line-height: 1;
}

@media (max-width: 900px) {
  .mark-va {
    height: 30px;
  }
  .mark-name {
    font-size: 0.88rem;
  }
}

.nav {
  display: flex;
  gap: 2.25rem;
}

.nav-link {
  font-size: 0.9rem;
  color: var(--fg-soft);
  transition: color 0.3s ease;
}

.nav-link:hover {
  color: var(--fg);
}

.hdr-actions {
  justify-self: end;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.hdr-cta {
  min-height: 42px;
  padding: 0 1.15rem;
  font-size: 0.85rem;
}

.burger {
  display: none;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 1px solid var(--line-strong);
  background: transparent;
  cursor: pointer;
  position: relative;
}

.burger span {
  position: absolute;
  left: 13px;
  right: 13px;
  height: 1.5px;
  background: var(--fg);
  transition: transform 0.5s var(--ease-out);
}

.burger span:first-child {
  top: 18px;
}
.burger span:last-child {
  top: 24px;
}

.menu-open .burger span:first-child {
  transform: translateY(3px) rotate(45deg);
}
.menu-open .burger span:last-child {
  transform: translateY(-3px) rotate(-45deg);
}

/* ---- Mobile menu ---- */
.mm {
  position: fixed;
  inset: 0;
  z-index: 1;
  background: var(--bg);
  padding: calc(var(--header-h) + 4vh) var(--gutter) var(--gutter);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  clip-path: inset(0 0 100% 0);
  transition: clip-path 0.8s var(--ease-in-out);
}

.mm.open {
  clip-path: inset(0 0 0 0);
}

.mm-nav {
  display: flex;
  flex-direction: column;
}

.mm-link {
  display: flex;
  align-items: baseline;
  gap: 1rem;
  padding: 0.6rem 0;
  border-bottom: 1px solid var(--line);
  overflow: hidden;
}

.mm-text {
  font-family: var(--serif);
  font-size: clamp(2.6rem, 12vw, 4.5rem);
  line-height: 1;
  letter-spacing: -0.03em;
  transform: translateY(110%);
  transition: transform 0.9s var(--ease-out);
  transition-delay: calc(var(--i) * 70ms + 150ms);
}

.mm.open .mm-text {
  transform: none;
}

.mm-foot {
  display: grid;
  gap: 1rem;
  padding-bottom: env(safe-area-inset-bottom, 0px);
  opacity: 0;
  transform: translateY(12px);
  transition:
    opacity 0.6s ease 0.45s,
    transform 0.8s var(--ease-out) 0.45s;
}

.mm.open .mm-foot {
  opacity: 1;
  transform: none;
}

.mm-cta {
  justify-content: center;
  min-height: 56px;
}

.mm-quick {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  border-top: 1px solid var(--line);
}

.mm-quick a {
  display: grid;
  place-items: center;
  min-height: 52px;
  color: var(--fg-soft);
}

.mm-quick a + a {
  border-left: 1px solid var(--line);
}

@media (min-width: 901px) {
  .mm {
    display: none;
  }
}

@media (max-width: 900px) {
  .hdr-bar {
    grid-template-columns: 1fr auto;
  }
  .nav,
  .hdr-cta {
    display: none;
  }
  .burger {
    display: block;
  }
}
</style>
