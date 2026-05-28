<script setup>
import { site } from '../data/site'
import portrait from '../assets/veer-with-celebrity.jpg'

// TODO: tweak with Veer's own words / exact details.
const facts = [
  { label: 'Medium', value: 'Graphite & charcoal' },
  { label: 'Based in', value: site.location },
  { label: 'Specialty', value: 'Portraits & devotional art' },
]
</script>

<template>
  <section id="about" class="section about">
    <div class="container about-grid">
      <figure class="about-portrait" v-reveal>
        <img :src="portrait" :alt="`${site.name} presenting his artwork on stage`" />
        <figcaption>Veer presenting his Shri Ram portrait on stage.</figcaption>
      </figure>

      <div class="about-body">
        <p class="eyebrow" v-reveal>About the artist</p>
        <h2 v-reveal="80">Hand, eye, and a single graphite line</h2>

        <blockquote class="pull-quote" v-reveal="140">
          “I draw to slow the world down — to find the one line that holds a whole gesture.”
        </blockquote>

        <div class="about-text" v-reveal="200">
          <p>
            {{ site.name }} is a {{ site.role.toLowerCase() }} working in graphite and
            charcoal. His drawings move between lifelike portraits, family keepsakes and
            devotional art — always made by hand, always chasing the honesty of a single
            confident line.
          </p>
          <p>
            His portrait of Shri Ram was presented on stage to a celebrated artist — a
            proud moment for a practice built entirely on patience, observation and the
            slow build of tone. Every piece begins on paper and stays there: no filters,
            no shortcuts. <em>(Replace this with Veer's own words.)</em>
          </p>
        </div>

        <dl class="facts" v-reveal="260">
          <div v-for="fact in facts" :key="fact.label">
            <dt>{{ fact.label }}</dt>
            <dd>{{ fact.value }}</dd>
          </div>
        </dl>
      </div>
    </div>
  </section>
</template>

<style scoped>
.about {
  background: var(--paper-2);
  border-block: 1px solid var(--line);
}

.about-grid {
  display: grid;
  grid-template-columns: 0.85fr 1.15fr;
  gap: clamp(40px, 7vw, 96px);
  align-items: center;
}

.about-portrait {
  margin: 0;
}
.about-portrait img {
  width: 100%;
  height: auto;
  border: 1px solid var(--line);
  box-shadow: 0 30px 60px -35px rgba(21, 20, 15, 0.5);
}
.about-portrait figcaption {
  margin-top: 0.9rem;
  font-family: var(--display);
  font-style: italic;
  font-size: 0.95rem;
  color: var(--ink-mute);
}

.pull-quote {
  margin: 1.75rem 0;
  padding-left: 1.25rem;
  border-left: 2px solid var(--accent);
  font-family: var(--display);
  font-style: italic;
  font-size: clamp(1.25rem, 2.4vw, 1.7rem);
  line-height: 1.35;
  color: var(--ink);
}

.about-text {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 56ch;
}

.facts {
  display: flex;
  flex-wrap: wrap;
  gap: 2.5rem 3.5rem;
  margin: 2.5rem 0 0;
}
.facts dt {
  font-size: 0.72rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--ink-mute);
  margin-bottom: 0.35rem;
}
.facts dd {
  margin: 0;
  font-family: var(--display);
  font-size: 1.25rem;
  color: var(--ink);
}

@media (max-width: 860px) {
  .about-grid {
    grid-template-columns: 1fr;
  }
  .about-portrait {
    max-width: 360px;
  }
}
</style>
