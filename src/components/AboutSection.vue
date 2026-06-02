<script setup>
import { site } from '../data/site'
import portrait from '../assets/veer-with-celebrity.jpg'
import kinjalDave from '../assets/veer-with-kinjal-dave.jpg'
</script>

<template>
  <section id="about" class="section about">
    <hr class="section-divider" />

    <div class="container about-grid">
      <!-- Image clip-path reveal from left -->
      <figure class="about-portrait" v-reveal.left>
        <div class="portrait-frame">
          <img :src="portrait" alt="Presenting my handmade Shri Ram portrait to Kirtidan Gadhvi" />
        </div>
        <figcaption>Presenting my hand-drawn Shri Ram portrait to Kirtidan Gadhvi on stage.</figcaption>
      </figure>

      <div class="about-body">
        <p class="eyebrow" v-reveal>About me</p>
        <h2 v-reveal="100">Hand, eye, and a single graphite line</h2>

        <blockquote class="pull-quote" v-reveal="200">
          "I draw to slow the world down — to find the one line that holds a whole gesture."
        </blockquote>

        <div class="about-text" v-reveal="300">
          <p>
            I am a {{ site.role.toLowerCase() }} working in graphite and charcoal. 
            My drawings move between lifelike portraits, family keepsakes, and devotional 
            art — always made entirely by hand, always chasing the honesty of a single 
            confident line.
          </p>
          <p>
            A landmark moment in my career was presenting my detailed, hand-drawn portrait of Shri Ram live on stage to the legendary Gujarati singer and cultural icon, <strong>Kirtidan Gadhvi</strong>. This prestigious recognition stands as a testament to a practice built entirely on patience, deep focus, and the slow, beautiful build of tone on paper.
          </p>
        </div>
      </div>
    </div>

    <!-- Single Celebrity Highlight: Kinjal Dave -->
    <div class="container celeb-highlight">
      <div class="celeb-content">
        <figure class="celeb-card" v-reveal.right="100">
          <div class="celeb-img-wrap">
            <img :src="kinjalDave" alt="Presenting my handmade portrait to Kinjal Dave" />
          </div>
        </figure>

        <div class="celeb-text" v-reveal="200">
          <p class="eyebrow">Celebrity Recognition</p>
          <h3>Kinjal Dave</h3>
          <p class="celeb-desc">
            A proud moment presenting a custom hand-drawn portrait to the renowned 
            Gujarati singer Kinjal Dave on stage. It was an honor to share my craft with 
            her and receive such warm appreciation for my meticulous work.
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.about {
  background: var(--paper-2);
  border-block: 1px solid var(--line);
  overflow: hidden;
}

.about-grid {
  display: grid;
  grid-template-columns: 0.85fr 1.15fr;
  gap: clamp(32px, 7vw, 96px);
  align-items: center;
}

/* ---- Portrait with clip reveal ---- */
.about-portrait {
  margin: 0;
}

.portrait-frame {
  overflow: hidden;
  border-radius: 6px;
}

.portrait-frame img {
  width: 100%;
  height: auto;
  border: 1px solid var(--line);
  box-shadow: 0 30px 60px -35px rgba(21, 20, 15, 0.5);
  transition: transform 0.8s var(--spring);
}

.about-portrait:hover .portrait-frame img {
  transform: scale(1.04);
}

.about-portrait figcaption {
  margin-top: 0.9rem;
  font-family: var(--display);
  font-style: italic;
  font-size: 0.92rem;
  color: var(--ink-mute);
}

.pull-quote {
  margin: 1.75rem 0;
  padding-left: 1.25rem;
  border-left: 3px solid var(--accent);
  font-family: var(--display);
  font-style: italic;
  font-size: clamp(1.15rem, 2.2vw, 1.65rem);
  line-height: 1.35;
  color: var(--ink);
  position: relative;
}

/* Animated accent line on the quote */
.pull-quote::before {
  content: '';
  position: absolute;
  left: -3px;
  top: 0;
  width: 3px;
  height: 100%;
  background: var(--accent);
  transform-origin: top;
  animation: quote-line 2s var(--ease-out-expo) forwards;
}

@keyframes quote-line {
  from { transform: scaleY(0); }
  to { transform: scaleY(1); }
}

.about-text {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 56ch;
}



/* ---- Celebrity Highlight ---- */
.celeb-highlight {
  margin-top: clamp(56px, 8vw, 120px);
}

.celeb-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: clamp(32px, 5vw, 80px);
  align-items: center;
}

.celeb-card {
  margin: 0;
}

.celeb-img-wrap {
  overflow: hidden;
  border-radius: 8px;
  box-shadow: 0 24px 56px -20px rgba(21, 20, 15, 0.35);
  transition: transform 0.5s var(--spring);
}

.celeb-img-wrap:hover {
  transform: translateY(-4px);
}

.celeb-img-wrap img {
  width: 100%;
  height: auto;
  display: block;
  transition: transform 0.7s var(--spring-snappy);
}

.celeb-img-wrap:hover img {
  transform: scale(1.04);
}

.celeb-text h3 {
  margin: 0.3em 0 0.6em;
  font-size: clamp(1.5rem, 3vw, 2.2rem);
}

.celeb-desc {
  color: var(--ink-soft);
  max-width: 44ch;
  line-height: 1.7;
}

/* ---- Mobile ---- */
@media (max-width: 860px) {
  .about-grid {
    grid-template-columns: 1fr;
    gap: 32px;
  }
  .about-portrait {
    max-width: 100%;
    order: 1;
  }
  .about-body {
    order: -1;
  }
  .celeb-content {
    grid-template-columns: 1fr;
    gap: 24px;
  }
  .celeb-card {
    order: 1;
  }
  .celeb-text {
    order: -1;
  }
}

@media (max-width: 480px) {
  .pull-quote {
    margin: 1.25rem 0;
    padding-left: 1rem;
  }
}
</style>
