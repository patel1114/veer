<script setup>
import TheHeader from './components/TheHeader.vue'
import HeroSection from './components/HeroSection.vue'
import GallerySection from './components/GallerySection.vue'
import AboutSection from './components/AboutSection.vue'
import ContactSection from './components/ContactSection.vue'
import TheFooter from './components/TheFooter.vue'
import WhatsappFab from './components/WhatsappFab.vue'
</script>

<template>
  <TheHeader />
  <main>
    <HeroSection />
    <GallerySection />
    <AboutSection />
    <ContactSection />
  </main>
  <TheFooter />
  <WhatsappFab />
</template>
