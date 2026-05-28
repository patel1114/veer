<script setup>
/* Persistent floating WhatsApp button — the highest-converting CTA
   for commission inquiries. Stays visible across the page, opens
   wa.me with a prefilled message. */
import { waUrl } from '../data/site'
</script>

<template>
  <a
    class="wa-fab"
    :href="waUrl()"
    target="_blank"
    rel="noopener"
    aria-label="Order a sketch on WhatsApp"
  >
    <svg viewBox="0 0 32 32" width="28" height="28" aria-hidden="true">
      <path
        fill="#fff"
        d="M19.11 17.205c-.372 0-1.088 1.39-1.518 1.39a.63.63 0 0 1-.315-.1c-.802-.402-1.504-.817-2.163-1.447-.545-.516-1.146-1.29-1.46-1.963a.426.426 0 0 1-.073-.215c0-.33.99-.945.99-1.49 0-.143-.73-2.09-.832-2.335-.143-.372-.214-.487-.6-.487-.187 0-.36-.043-.53-.043-.302 0-.53.115-.746.315-.688.645-1.032 1.318-1.06 2.264v.114c-.014.99.36 1.853.832 2.696 1.13 2.035 2.535 3.79 4.484 5.044.616.4 2.087 1.092 2.847 1.092.832 0 1.49-.42 1.69-1.075.1-.345.115-.674.115-.992 0-.43-1.69-1.46-2.063-1.46v.144zM16.1 4C9.43 4 4 9.43 4 16.1c0 2.3.66 4.546 1.92 6.5L4 28.575l6.32-1.65a12.05 12.05 0 0 0 5.78 1.46h.014c6.67 0 12.087-5.4 12.087-12.07 0-3.227-1.26-6.27-3.54-8.555A12.05 12.05 0 0 0 16.1 4zm0 22.13c-1.95 0-3.85-.53-5.51-1.51l-.388-.23-4.083 1.075 1.075-3.97-.244-.402a9.94 9.94 0 0 1-1.547-5.328c0-5.508 4.483-9.992 9.992-9.992 2.665 0 5.17 1.04 7.057 2.926a9.92 9.92 0 0 1 2.92 7.066c0 5.51-4.484 9.964-9.992 9.964z"
      />
    </svg>
    <span class="wa-fab-label">Order a sketch</span>
  </a>
</template>

<style scoped>
.wa-fab {
  position: fixed;
  z-index: 60;
  right: clamp(16px, 3vw, 28px);
  bottom: clamp(16px, 3vw, 28px);
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.9rem 1.2rem 0.9rem 1.05rem;
  background: #25d366;
  color: #fff;
  font-family: var(--sans);
  font-size: 0.95rem;
  font-weight: 500;
  border-radius: 999px;
  box-shadow:
    0 12px 32px -10px rgba(37, 211, 102, 0.55),
    0 4px 14px rgba(21, 20, 15, 0.18);
  transition:
    transform 0.25s ease,
    box-shadow 0.25s ease;
  text-decoration: none;
}

.wa-fab:hover {
  transform: translateY(-2px);
  box-shadow:
    0 16px 36px -10px rgba(37, 211, 102, 0.7),
    0 6px 18px rgba(21, 20, 15, 0.22);
}

.wa-fab svg {
  flex: none;
  display: block;
}

/* On narrow screens, show just the icon to save space. */
@media (max-width: 540px) {
  .wa-fab {
    padding: 0.85rem;
    width: 56px;
    height: 56px;
    justify-content: center;
  }
  .wa-fab-label {
    display: none;
  }
}
</style>
