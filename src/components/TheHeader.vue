<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { site } from '../data/site'
import logo from '../assets/veer-art-logo.png'

const scrolled = ref(false)
const menuOpen = ref(false)

const links = [
  { label: 'Work', href: '#work' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
]

const onScroll = () => {
  scrolled.value = window.scrollY > 24
}

onMounted(() => {
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
})
onUnmounted(() => window.removeEventListener('scroll', onScroll))
</script>

<template>
  <header class="site-header" :class="{ 'is-scrolled': scrolled }">
    <div class="container bar">
      <a href="#top" class="brand" aria-label="Veer Art — home">
        <img :src="logo" alt="Veer Art" />
      </a>

      <nav class="nav" :class="{ open: menuOpen }" aria-label="Primary">
        <a
          v-for="link in links"
          :key="link.href"
          :href="link.href"
          class="nav-link"
          @click="menuOpen = false"
          >{{ link.label }}</a
        >
      </nav>

      <button
        class="menu-toggle"
        :aria-expanded="menuOpen"
        aria-label="Toggle menu"
        @click="menuOpen = !menuOpen"
      >
        <span :class="{ open: menuOpen }"></span>
      </button>
    </div>
  </header>
</template>

<style scoped>
.site-header {
  position: fixed;
  inset: 0 0 auto 0;
  z-index: 50;
  transition:
    background 0.35s ease,
    border-color 0.35s ease,
    backdrop-filter 0.35s ease;
  border-bottom: 1px solid transparent;
}

.site-header.is-scrolled {
  background: rgba(246, 244, 238, 0.82);
  backdrop-filter: blur(10px);
  border-bottom-color: var(--line);
}

.bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 76px;
}

.brand {
  display: flex;
  align-items: center;
}
.brand img {
  height: 58px;
  width: auto;
  display: block;
}

.nav {
  display: flex;
  gap: 2.5rem;
}

.nav-link {
  font-size: 0.95rem;
  font-weight: 500;
  color: var(--ink-soft);
  position: relative;
  padding: 0.25rem 0;
  transition: color 0.25s ease;
}

.nav-link::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 1px;
  background: var(--accent);
  transform: scaleX(0);
  transform-origin: right;
  transition: transform 0.3s ease;
}

.nav-link:hover {
  color: var(--ink);
}
.nav-link:hover::after {
  transform: scaleX(1);
  transform-origin: left;
}

/* Mobile menu toggle */
.menu-toggle {
  display: none;
  position: relative;
  width: 30px;
  height: 30px;
  background: none;
  border: none;
  cursor: pointer;
}
.menu-toggle span,
.menu-toggle span::before,
.menu-toggle span::after {
  content: '';
  position: absolute;
  left: 3px;
  width: 24px;
  height: 1.5px;
  background: var(--ink);
  transition: transform 0.3s ease;
}
.menu-toggle span {
  top: 14px;
}
.menu-toggle span::before {
  top: -7px;
}
.menu-toggle span::after {
  top: 7px;
}
.menu-toggle span.open {
  background: transparent;
}
.menu-toggle span.open::before {
  transform: translateY(7px) rotate(45deg);
}
.menu-toggle span.open::after {
  transform: translateY(-7px) rotate(-45deg);
}

@media (max-width: 720px) {
  .menu-toggle {
    display: block;
  }
  .nav {
    position: absolute;
    top: 76px;
    left: 0;
    right: 0;
    flex-direction: column;
    gap: 0;
    background: var(--paper);
    border-bottom: 1px solid var(--line);
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.35s ease;
  }
  .nav.open {
    max-height: 240px;
  }
  .nav-link {
    padding: 1.1rem var(--gutter);
    border-top: 1px solid var(--line);
  }
  .nav-link::after {
    display: none;
  }
}
</style>
