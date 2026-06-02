<script setup>
import { site, waUrl } from '../data/site'

const primary = site.socials[0]
</script>

<template>
  <section id="contact" class="section contact">
    <hr class="section-divider" />

    <div class="container contact-inner">
      <p class="eyebrow" v-reveal>Commission a piece</p>
      <h2 v-reveal="120">Order a sketch — or just follow the work.</h2>
      <p class="lede" v-reveal="240">
        Portraits, family keepsakes, devotional drawings. Send a quick message on
        WhatsApp with the photo you'd like drawn and I will take it from there.
      </p>

      <div class="contact-actions" v-reveal.scale="360">
        <a :href="waUrl()" target="_blank" rel="noopener" class="btn btn--wa">
          <svg viewBox="0 0 32 32" width="18" height="18" aria-hidden="true">
            <path
              fill="currentColor"
              d="M19.11 17.205c-.372 0-1.088 1.39-1.518 1.39a.63.63 0 0 1-.315-.1c-.802-.402-1.504-.817-2.163-1.447-.545-.516-1.146-1.29-1.46-1.963a.426.426 0 0 1-.073-.215c0-.33.99-.945.99-1.49 0-.143-.73-2.09-.832-2.335-.143-.372-.214-.487-.6-.487-.187 0-.36-.043-.53-.043-.302 0-.53.115-.746.315-.688.645-1.032 1.318-1.06 2.264v.114c-.014.99.36 1.853.832 2.696 1.13 2.035 2.535 3.79 4.484 5.044.616.4 2.087 1.092 2.847 1.092.832 0 1.49-.42 1.69-1.075.1-.345.115-.674.115-.992 0-.43-1.69-1.46-2.063-1.46v.144zM16.1 4C9.43 4 4 9.43 4 16.1c0 2.3.66 4.546 1.92 6.5L4 28.575l6.32-1.65a12.05 12.05 0 0 0 5.78 1.46h.014c6.67 0 12.087-5.4 12.087-12.07 0-3.227-1.26-6.27-3.54-8.555A12.05 12.05 0 0 0 16.1 4zm0 22.13c-1.95 0-3.85-.53-5.51-1.51l-.388-.23-4.083 1.075 1.075-3.97-.244-.402a9.94 9.94 0 0 1-1.547-5.328c0-5.508 4.483-9.992 9.992-9.992 2.665 0 5.17 1.04 7.057 2.926a9.92 9.92 0 0 1 2.92 7.066c0 5.51-4.484 9.964-9.992 9.964z"
            />
          </svg>
          Order on WhatsApp
        </a>
        <a :href="primary.url" target="_blank" rel="noopener" class="btn btn--insta">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
          </svg>
          Follow on Instagram
        </a>
      </div>

      <div class="contact-info" v-reveal="480">
        <a :href="`mailto:${site.email}`" class="link-underline email-link">
          {{ site.email }}
        </a>
        <span class="divider">·</span>
        <a :href="`tel:+91${site.whatsapp.slice(2)}`" class="link-underline phone-link">
          +91 {{ site.whatsapp.slice(2, 7) }} {{ site.whatsapp.slice(7) }}
        </a>
      </div>
    </div>
  </section>
</template>

<style scoped>
.contact {
  text-align: center;
  overflow: hidden;
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
  box-shadow: 0 12px 28px -8px rgba(37, 211, 102, 0.5);
}

.contact-info {
  margin-top: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.email-link,
.phone-link {
  color: var(--ink-soft);
  font-size: 0.95rem;
}

.divider {
  color: var(--ink-mute);
}

.btn--insta {
  background: linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%);
  border-color: transparent;
  color: #fff;
}

.btn--insta:hover {
  filter: brightness(1.15);
  box-shadow: 0 12px 28px -8px rgba(220, 39, 67, 0.45);
}

@media (max-width: 480px) {
  .contact-actions {
    flex-direction: column;
    gap: 0.75rem;
  }
  .contact-info {
    flex-direction: column;
    gap: 0.5rem;
  }
  .divider { display: none; }
}
</style>
