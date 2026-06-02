<script setup>
import { ref, onMounted } from 'vue'
import TheHeader from './components/TheHeader.vue'
import HeroSection from './components/HeroSection.vue'
import GallerySection from './components/GallerySection.vue'
import AboutSection from './components/AboutSection.vue'
import ContactSection from './components/ContactSection.vue'
import TheFooter from './components/TheFooter.vue'
import WhatsappFab from './components/WhatsappFab.vue'

/* ---- Cinematic page intro ---- */
const introDone = ref(false)

onMounted(() => {
  // Let the intro animation play, then reveal the site
  setTimeout(() => {
    introDone.value = true
  }, 2200)
})
</script>

<template>
  <!-- Cinematic Intro Loader -->
  <transition name="intro-fade">
    <div v-if="!introDone" class="intro-screen">
      <div class="intro-content">
        <div class="intro-line intro-line--1"></div>
        <h1 class="intro-name">Veer</h1>
        <p class="intro-role">Sketch Artist</p>
        <div class="intro-line intro-line--2"></div>
      </div>
    </div>
  </transition>

  <div class="site-wrap" :class="{ 'is-revealed': introDone }">
    <TheHeader />
    <main>
      <HeroSection />
      <GallerySection />
      <AboutSection />
      <ContactSection />
    </main>
    <TheFooter />
    <WhatsappFab />
  </div>
</template>

<style>
/* ---- Intro Screen ---- */
.intro-screen {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: #15140f;
  display: flex;
  align-items: center;
  justify-content: center;
}

.intro-content {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.intro-name {
  font-family: var(--display);
  font-size: clamp(3rem, 10vw, 7rem);
  color: #f6f4ee;
  font-weight: 300;
  letter-spacing: 0.08em;
  animation: intro-text-up 1s cubic-bezier(0.22, 1, 0.36, 1) 0.3s both;
}

.intro-role {
  font-family: var(--sans);
  font-size: clamp(0.8rem, 2vw, 1rem);
  color: rgba(246, 244, 238, 0.5);
  letter-spacing: 0.3em;
  text-transform: uppercase;
  animation: intro-text-up 1s cubic-bezier(0.22, 1, 0.36, 1) 0.5s both;
}

.intro-line {
  width: 60px;
  height: 1px;
  background: #9a3b22;
}

.intro-line--1 {
  animation: intro-line-draw 0.8s cubic-bezier(0.22, 1, 0.36, 1) 0.1s both;
}
.intro-line--2 {
  animation: intro-line-draw 0.8s cubic-bezier(0.22, 1, 0.36, 1) 0.7s both;
}

@keyframes intro-text-up {
  from {
    opacity: 0;
    transform: translateY(30px);
    filter: blur(8px);
  }
  to {
    opacity: 1;
    transform: none;
    filter: blur(0);
  }
}

@keyframes intro-line-draw {
  from {
    transform: scaleX(0);
    opacity: 0;
  }
  to {
    transform: scaleX(1);
    opacity: 1;
  }
}

/* Intro fade-out */
.intro-fade-leave-active {
  transition: opacity 0.6s ease, transform 0.6s cubic-bezier(0.22, 1, 0.36, 1);
}
.intro-fade-leave-to {
  opacity: 0;
  transform: scale(1.05);
}

/* Site reveal after intro */
.site-wrap {
  opacity: 0;
  transition: opacity 0.8s ease 0.1s;
}
.site-wrap.is-revealed {
  opacity: 1;
}
</style>
