<script setup>
import WaIcon from './WaIcon.vue'
/* Persistent commission shortcut.
   Desktop: a compact pill, bottom-right.
   Phones:  a full-width dock in the thumb zone — WhatsApp (primary)
            plus one-tap call. Content gets bottom padding so the dock
            never covers it (see --dock-h in style.css).
   Hidden in the hero (it has its own CTAs), at the contact section
   (which IS the CTA), at the footer, and inside the viewer. */
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { site, waUrl } from '../data/site'
import { ui } from '../stores/ui'

const pastHero = ref(false)
const hiddenBy = ref(new Set())
let io

const show = computed(() => ui.introDone && pastHero.value && hiddenBy.value.size === 0 && !ui.viewer.open)
const tel = `tel:+${site.whatsapp}`

const onScroll = () => {
  const mobile = window.innerWidth <= 900
  pastHero.value = window.scrollY > window.innerHeight * (mobile ? 0.55 : 0.85)
}

onMounted(() => {
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
  if (!('IntersectionObserver' in window)) return
  io = new IntersectionObserver(
    (entries) => {
      const next = new Set(hiddenBy.value)
      for (const e of entries) e.isIntersecting ? next.add(e.target) : next.delete(e.target)
      hiddenBy.value = next
    },
    { threshold: 0.02 },
  )
  ;['contact', 'site-footer'].forEach((id) => {
    const el = document.getElementById(id)
    if (el) io.observe(el)
  })
})
onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
  io?.disconnect()
})
</script>

<template>
  <!-- Desktop pill -->
  <a
    class="fab"
    :class="{ show }"
    :href="waUrl()"
    target="_blank"
    rel="noopener"
    aria-label="Order a sketch on WhatsApp"
    :tabindex="show ? 0 : -1"
  >
    <WaIcon />
    <span class="roll"><span>Order a sketch</span><span aria-hidden="true">Order a sketch</span></span>
  </a>

  <!-- Mobile dock -->
  <div class="dock" :class="{ show }" :inert="!show">
    <a :href="waUrl()" target="_blank" rel="noopener" class="dock-main tap">
      <svg viewBox="0 0 32 32" width="20" height="20" aria-hidden="true">
        <path
          fill="currentColor"
          d="M16.1 4C9.43 4 4 9.43 4 16.1c0 2.3.66 4.546 1.92 6.5L4 28.575l6.32-1.65a12.05 12.05 0 0 0 5.78 1.46h.014c6.67 0 12.087-5.4 12.087-12.07 0-3.227-1.26-6.27-3.54-8.555A12.05 12.05 0 0 0 16.1 4zm0 22.13c-1.95 0-3.85-.53-5.51-1.51l-.388-.23-4.083 1.075 1.075-3.97-.244-.402a9.94 9.94 0 0 1-1.547-5.328c0-5.508 4.483-9.992 9.992-9.992 2.665 0 5.17 1.04 7.057 2.926a9.92 9.92 0 0 1 2.92 7.066c0 5.51-4.484 9.964-9.992 9.964zm3.01-8.925c-.372 0-1.088 1.39-1.518 1.39a.63.63 0 0 1-.315-.1c-.802-.402-1.504-.817-2.163-1.447-.545-.516-1.146-1.29-1.46-1.963a.426.426 0 0 1-.073-.215c0-.33.99-.945.99-1.49 0-.143-.73-2.09-.832-2.335-.143-.372-.214-.487-.6-.487-.187 0-.36-.043-.53-.043-.302 0-.53.115-.746.315-.688.645-1.032 1.318-1.06 2.264v.114c-.014.99.36 1.853.832 2.696 1.13 2.035 2.535 3.79 4.484 5.044.616.4 2.087 1.092 2.847 1.092.832 0 1.49-.42 1.69-1.075.1-.345.115-.674.115-.992 0-.43-1.69-1.46-2.063-1.46z"
        />
      </svg>
      <span class="dock-text">
        <strong>Order your sketch</strong>
        <small>Chat on WhatsApp</small>
      </span>
      <span class="dock-arrow" aria-hidden="true">→</span>
    </a>
    <a :href="tel" class="dock-call tap" aria-label="Call Veer">
      <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
        <path
          fill="none"
          stroke="currentColor"
          stroke-width="1.6"
          stroke-linejoin="round"
          d="M5 3.5h3.2l1.6 4.3-2.1 1.4a11 11 0 0 0 5.1 5.1l1.4-2.1 4.3 1.6V17a2 2 0 0 1-2 2A15.5 15.5 0 0 1 3 5.5a2 2 0 0 1 2-2z"
        />
      </svg>
    </a>
  </div>
</template>

<style scoped>
/* ---------- Desktop pill ---------- */
.fab {
  position: fixed;
  z-index: 90;
  right: var(--gutter);
  bottom: clamp(16px, 3vw, 32px);
  display: inline-flex;
  align-items: center;
  gap: 0.7rem;
  height: 50px;
  padding: 0 1.3rem 0 1.1rem;
  border-radius: 999px;
  background: var(--wa);
  color: var(--wa-ink);
  font-size: 0.9rem;
  font-weight: 600;
  box-shadow: 0 20px 40px -18px rgba(0, 0, 0, 0.6);
  transform: translateY(calc(100% + 48px));
  opacity: 0;
  transition:
    transform 0.8s var(--ease-out),
    opacity 0.5s ease,
    background-color 0.3s ease;
}

.fab.show {
  transform: none;
  opacity: 1;
}

.fab:hover {
  background: var(--wa-deep);
}

.fab-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #25d366;
  animation: ping 2.4s var(--ease-out) infinite;
}

@keyframes ping {
  0% { box-shadow: 0 0 0 0 rgba(37, 211, 102, 0.55); }
  70%, 100% { box-shadow: 0 0 0 10px rgba(37, 211, 102, 0); }
}

/* ---------- Mobile dock ---------- */
.dock {
  display: none;
}

@media (max-width: 900px) {
  .fab {
    display: none;
  }

  .dock {
    position: fixed;
    z-index: 90;
    left: 10px;
    right: 10px;
    bottom: calc(10px + env(safe-area-inset-bottom, 0px));
    display: flex;
    gap: 8px;
    padding: 6px;
    border-radius: 22px;
    background: rgba(20, 20, 19, 0.82);
    backdrop-filter: blur(18px) saturate(1.3);
    -webkit-backdrop-filter: blur(18px) saturate(1.3);
    border: 1px solid rgba(243, 241, 236, 0.12);
    box-shadow: 0 20px 50px -20px rgba(0, 0, 0, 0.7);
    transform: translateY(calc(100% + 24px));
    transition: transform 0.7s var(--ease-out);
  }

  .dock.show {
    transform: none;
  }

  .dock-main {
    flex: 1;
    min-width: 0;
    height: 52px;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0 1rem;
    border-radius: 16px;
    background: var(--wa);
    color: var(--wa-ink);
    transition:
      transform 0.25s var(--ease-out),
      background-color 0.2s ease;
  }

  .dock-main:active {
    background: var(--wa-deep);
  }

  .dock-main svg {
    flex: none;
  }

  .dock-text {
    display: grid;
    line-height: 1.15;
    min-width: 0;
  }

  .dock-text strong {
    font-size: 0.95rem;
    font-weight: 600;
  }

  .dock-text small {
    font-size: 0.75rem;
    color: rgba(5, 46, 22, 0.72);
  }

  .dock-arrow {
    margin-left: auto;
    font-size: 1.1rem;
  }

  .dock-call {
    flex: none;
    width: 52px;
    height: 52px;
    display: grid;
    place-items: center;
    border-radius: 16px;
    color: var(--paper-50);
    border: 1px solid rgba(243, 241, 236, 0.18);
    transition: transform 0.25s var(--ease-out);
  }
}
</style>
