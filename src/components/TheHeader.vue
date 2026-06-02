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
  // Auto-close menu on scroll
  if (menuOpen.value && window.scrollY > 100) {
    menuOpen.value = false
  }
}

const closeMenu = () => {
  menuOpen.value = false
}

// Close menu when clicking outside
const onClickOutside = (e) => {
  if (menuOpen.value && !e.target.closest('.site-header')) {
    menuOpen.value = false
  }
}

onMounted(() => {
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
  document.addEventListener('click', onClickOutside)

  // Ensure dark class is cleanly wiped so it defaults to light editorial theme
  document.documentElement.classList.remove('dark')
  localStorage.removeItem('theme')
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
  document.removeEventListener('click', onClickOutside)
})
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
          @click="closeMenu"
          >{{ link.label }}</a
        >
      </nav>

      <div class="header-actions">
        <button
          class="menu-toggle"
          :aria-expanded="menuOpen"
          aria-label="Toggle menu"
          @click.stop="menuOpen = !menuOpen"
        >
          <span :class="{ open: menuOpen }"></span>
        </button>
      </div>
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
  background: var(--header-bg);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-bottom-color: var(--line);
}

.bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 72px;
}

.brand {
  display: flex;
  align-items: center;
  z-index: 2;
}
.brand img {
  height: 52px;
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

/* Header actions layout */
.header-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  z-index: 2;
}



/* Mobile menu toggle */
.menu-toggle {
  display: none;
  position: relative;
  width: 36px;
  height: 36px;
  background: none;
  border: none;
  cursor: pointer;
}
.menu-toggle span,
.menu-toggle span::before,
.menu-toggle span::after {
  content: '';
  position: absolute;
  left: 6px;
  width: 24px;
  height: 1.5px;
  background: var(--ink);
  transition: transform 0.3s ease;
}
.menu-toggle span {
  top: 17px;
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
  .bar {
    height: 64px;
  }

  .brand img {
    height: 44px;
  }

  .menu-toggle {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .nav {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 0;
    background: var(--header-bg-solid);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    opacity: 0;
    visibility: hidden;
    transition:
      opacity 0.35s ease,
      visibility 0.35s ease;
    z-index: 1;
  }

  .nav.open {
    opacity: 1;
    visibility: visible;
  }

  .nav-link {
    font-size: 1.5rem;
    font-family: var(--display);
    font-weight: 400;
    padding: 1rem 0;
    color: var(--ink);
  }

  .nav-link::after {
    display: none;
  }
}
</style>
