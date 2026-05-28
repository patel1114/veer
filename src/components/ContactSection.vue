<script setup>
import { site, waUrl } from '../data/site'

const primary = site.socials[0] // featured social (Instagram by default)
</script>

<template>
  <section id="contact" class="section contact">
    <div class="container contact-inner">
      <p class="eyebrow" v-reveal>Commission a piece</p>
      <h2 v-reveal="80">Order a sketch — or just follow the work.</h2>
      <p class="lede" v-reveal="160">
        Portraits, family keepsakes, devotional drawings. Send a quick message on
        WhatsApp with the photo you'd like drawn and Veer will take it from there.
      </p>

      <div class="contact-actions" v-reveal="220">
        <a :href="waUrl()" target="_blank" rel="noopener" class="btn btn--wa">
          <svg viewBox="0 0 32 32" width="18" height="18" aria-hidden="true">
            <path
              fill="currentColor"
              d="M19.11 17.205c-.372 0-1.088 1.39-1.518 1.39a.63.63 0 0 1-.315-.1c-.802-.402-1.504-.817-2.163-1.447-.545-.516-1.146-1.29-1.46-1.963a.426.426 0 0 1-.073-.215c0-.33.99-.945.99-1.49 0-.143-.73-2.09-.832-2.335-.143-.372-.214-.487-.6-.487-.187 0-.36-.043-.53-.043-.302 0-.53.115-.746.315-.688.645-1.032 1.318-1.06 2.264v.114c-.014.99.36 1.853.832 2.696 1.13 2.035 2.535 3.79 4.484 5.044.616.4 2.087 1.092 2.847 1.092.832 0 1.49-.42 1.69-1.075.1-.345.115-.674.115-.992 0-.43-1.69-1.46-2.063-1.46v.144zM16.1 4C9.43 4 4 9.43 4 16.1c0 2.3.66 4.546 1.92 6.5L4 28.575l6.32-1.65a12.05 12.05 0 0 0 5.78 1.46h.014c6.67 0 12.087-5.4 12.087-12.07 0-3.227-1.26-6.27-3.54-8.555A12.05 12.05 0 0 0 16.1 4zm0 22.13c-1.95 0-3.85-.53-5.51-1.51l-.388-.23-4.083 1.075 1.075-3.97-.244-.402a9.94 9.94 0 0 1-1.547-5.328c0-5.508 4.483-9.992 9.992-9.992 2.665 0 5.17 1.04 7.057 2.926a9.92 9.92 0 0 1 2.92 7.066c0 5.51-4.484 9.964-9.992 9.964z"
            />
          </svg>
          Order on WhatsApp
        </a>
        <a :href="primary.url" target="_blank" rel="noopener" class="btn btn--ghost">
          Follow on {{ primary.label }}
        </a>
        <a :href="`mailto:${site.email}`" class="link-underline email-link">
          {{ site.email }}
        </a>
      </div>

      <ul class="socials" v-reveal="280">
        <li v-for="s in site.socials" :key="s.label">
          <a :href="s.url" target="_blank" rel="noopener" class="link-underline">
            {{ s.label }} <span class="handle">{{ s.handle }}</span>
          </a>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.contact {
  text-align: center;
}

.contact-inner {
  max-width: 760px;
}
.contact-inner .lede {
  margin-inline: auto;
}

.contact h2 {
  margin: 0.3em 0 0.5em;
}

.contact-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 1rem 1.5rem;
  margin-top: 2.5rem;
}

.btn--wa {
  background: #25d366;
  border-color: #25d366;
  color: #fff;
}
.btn--wa:hover {
  background: #1ebe5b;
  border-color: #1ebe5b;
  color: #fff;
}

.email-link {
  color: var(--ink-soft);
  font-size: 0.95rem;
}

.socials {
  list-style: none;
  padding: 0;
  margin: 3rem 0 0;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1rem 2.5rem;
}

.socials .handle {
  color: var(--ink-mute);
  font-weight: 400;
  margin-left: 0.35rem;
}
</style>
