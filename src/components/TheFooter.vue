<script setup>
import { site } from '../data/site'
import logo from '../assets/veer-art-logo.png'
const year = new Date().getFullYear()
</script>

<template>
  <footer class="site-footer">
    <div class="container footer-inner">
      <a href="#top" class="brand" aria-label="Veer Art — back to top">
        <img :src="logo" alt="Veer Art" />
      </a>

      <ul class="footer-socials">
        <li v-for="s in site.socials" :key="s.label">
          <a :href="s.url" target="_blank" rel="noopener" class="link-underline">{{
            s.label
          }}</a>
        </li>
      </ul>

      <p class="copy">© {{ year }} {{ site.name }}. All drawings are original works.</p>
    </div>
  </footer>
</template>

<style scoped>
.site-footer {
  border-top: 1px solid var(--line);
  padding-block: 48px;
}

.footer-inner {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
}

.brand img {
  height: 72px;
  width: auto;
  display: block;
}

.footer-socials {
  list-style: none;
  display: flex;
  gap: 1.75rem;
  padding: 0;
  margin: 0;
  font-size: 0.9rem;
}

.copy {
  font-size: 0.82rem;
  color: var(--ink-mute);
  flex-basis: 100%;
  border-top: 1px solid var(--line);
  padding-top: 1.5rem;
  margin-top: 0.5rem;
}
</style>
