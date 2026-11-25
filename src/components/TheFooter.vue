<script setup>
/* Footer: live studio clock (IST), back-to-top, and an oversized
   wordmark that rises into place as the page ends. */
import { onMounted, onUnmounted, ref } from 'vue'
import { site } from '../data/site'

const year = new Date().getFullYear()
const time = ref('')
let t

const fmt = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'Asia/Kolkata',
  hour: '2-digit',
  minute: '2-digit',
})
const tick = () => (time.value = fmt.format(new Date()))

onMounted(() => {
  tick()
  t = setInterval(tick, 15000)
})
onUnmounted(() => clearInterval(t))
</script>

<template>
  <footer id="site-footer" class="ftr">
    <div class="wrap ftr-top">
      <div>
        <span class="label">Studio time</span>
        <p>{{ time }} IST · {{ site.location }}</p>
      </div>
      <div>
        <span class="label">Follow the work</span>
        <p>
          <a v-for="s in site.socials" :key="s.label" :href="s.url" target="_blank" rel="noopener">
            <span class="roll"><span>{{ s.handle }}</span><span aria-hidden="true">{{ s.handle }}</span></span>
          </a>
        </p>
      </div>
      <a href="#top" class="to-top">
        <span class="roll"><span>Back to top ↑</span><span aria-hidden="true">Back to top ↑</span></span>
      </a>
    </div>

    <div class="wordmark" aria-hidden="true">
      <span v-reveal>Veer Art</span>
    </div>

    <div class="wrap ftr-bottom">
      <span class="label">© {{ year }} {{ site.name }} Art — all drawings are original works</span>
      <span class="label">Graphite · Charcoal · Paper</span>
    </div>
  </footer>
</template>

<style scoped>
.ftr {
  border-top: 1px solid var(--line);
  padding-top: clamp(32px, 4vw, 56px);
  overflow: hidden;
}

.ftr-top {
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  gap: var(--gutter);
  align-items: start;
}

.ftr-top p {
  margin-top: 0.4rem;
  color: var(--fg-soft);
}

.to-top {
  font-size: 0.9rem;
  color: var(--fg-soft);
}

.wordmark {
  font-family: var(--serif);
  font-style: italic;
  font-size: 19vw;
  font-weight: 500; /* heavier hairlines so it reads on dark */
  line-height: 1;
  letter-spacing: -0.035em;
  white-space: nowrap;
  text-align: center;
  margin-top: clamp(32px, 6vw, 80px);
  overflow: hidden;
  /* room above and below so no part of the letters is clipped */
  padding-block: 0.02em 0.06em;
}

.wordmark span {
  display: inline-block;
  /* room for the italic overhang so the last letter isn't clipped */
  padding-inline: 0.06em 0.12em;
  color: var(--fg);
}

.wordmark :deep([data-reveal]) {
  transform: translate3d(0, 40%, 0);
  transition-duration: 1.4s, 1.6s;
}

.wordmark :deep([data-reveal].is-in) {
  transform: none;
}

.ftr-bottom {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 0.5rem 1.5rem;
  padding-block: 1.25rem;
  border-top: 1px solid var(--line);
}

@media (max-width: 700px) {
  .ftr-top {
    grid-template-columns: 1fr;
  }
}
</style>
