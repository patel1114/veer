<script setup>
/* The close. One unmistakable action (a magnetic WhatsApp disc),
   then the other ways to reach Veer as large, calm rows. */
import { onMounted, onUnmounted, ref } from 'vue'
import { site, waUrl } from '../data/site'
import { gsap, finePointer, reducedMotion } from '../composables/motion'

const disc = ref(null)
const phone = `+91 ${site.whatsapp.slice(2, 7)} ${site.whatsapp.slice(7)}`
const insta = site.socials[0]

const rows = [
  { k: 'WhatsApp', v: phone, href: waUrl(), ext: true },
  { k: 'Call', v: phone, href: `tel:+${site.whatsapp}` },
  { k: 'Email', v: site.email, href: `mailto:${site.email}` },
  { k: 'Instagram', v: insta.handle, href: insta.url, ext: true },
]

let xTo, yTo, ixTo, iyTo
const magnetic = finePointer && !reducedMotion

const onMove = (e) => {
  const r = disc.value.getBoundingClientRect()
  const dx = e.clientX - (r.left + r.width / 2)
  const dy = e.clientY - (r.top + r.height / 2)
  xTo(dx * 0.35)
  yTo(dy * 0.35)
  ixTo(dx * 0.15)
  iyTo(dy * 0.15)
}
const onLeave = () => {
  xTo(0)
  yTo(0)
  ixTo(0)
  iyTo(0)
}

onMounted(() => {
  if (!magnetic) return
  const inner = disc.value.querySelector('.disc-inner')
  xTo = gsap.quickTo(disc.value, 'x', { duration: 0.9, ease: 'elastic.out(1, 0.4)' })
  yTo = gsap.quickTo(disc.value, 'y', { duration: 0.9, ease: 'elastic.out(1, 0.4)' })
  ixTo = gsap.quickTo(inner, 'x', { duration: 0.9, ease: 'elastic.out(1, 0.4)' })
  iyTo = gsap.quickTo(inner, 'y', { duration: 0.9, ease: 'elastic.out(1, 0.4)' })
})
onUnmounted(() => gsap.killTweensOf(disc.value))
</script>

<template>
  <section id="contact" class="contact wrap">
    <div class="section-head">
      <span class="label"><span class="label--accent">(06)</span>&nbsp; Commission</span>
      <span class="label">Replies on WhatsApp</span>
    </div>

    <div class="c-hero">
      <h2 v-split class="c-title">Let’s draw <br /><em>your story.</em></h2>

      <div class="c-disc-zone" @pointermove="magnetic && onMove($event)" @pointerleave="magnetic && onLeave()">
        <a ref="disc" :href="waUrl()" target="_blank" rel="noopener" class="disc">
          <span class="disc-inner">
            <svg viewBox="0 0 32 32" width="26" height="26" aria-hidden="true">
              <path
                fill="currentColor"
                d="M16.1 4C9.43 4 4 9.43 4 16.1c0 2.3.66 4.546 1.92 6.5L4 28.575l6.32-1.65a12.05 12.05 0 0 0 5.78 1.46h.014c6.67 0 12.087-5.4 12.087-12.07 0-3.227-1.26-6.27-3.54-8.555A12.05 12.05 0 0 0 16.1 4zm0 22.13c-1.95 0-3.85-.53-5.51-1.51l-.388-.23-4.083 1.075 1.075-3.97-.244-.402a9.94 9.94 0 0 1-1.547-5.328c0-5.508 4.483-9.992 9.992-9.992 2.665 0 5.17 1.04 7.057 2.926a9.92 9.92 0 0 1 2.92 7.066c0 5.51-4.484 9.964-9.992 9.964zm3.01-8.925c-.372 0-1.088 1.39-1.518 1.39a.63.63 0 0 1-.315-.1c-.802-.402-1.504-.817-2.163-1.447-.545-.516-1.146-1.29-1.46-1.963a.426.426 0 0 1-.073-.215c0-.33.99-.945.99-1.49 0-.143-.73-2.09-.832-2.335-.143-.372-.214-.487-.6-.487-.187 0-.36-.043-.53-.043-.302 0-.53.115-.746.315-.688.645-1.032 1.318-1.06 2.264v.114c-.014.99.36 1.853.832 2.696 1.13 2.035 2.535 3.79 4.484 5.044.616.4 2.087 1.092 2.847 1.092.832 0 1.49-.42 1.69-1.075.1-.345.115-.674.115-.992 0-.43-1.69-1.46-2.063-1.46z"
              />
            </svg>
            <span>Order on <br />WhatsApp</span>
          </span>
        </a>
      </div>
    </div>

    <p v-reveal class="c-lede">
      Send the photo you’d like drawn — a portrait, a couple, the whole family, or a deity for your home. I’ll reply with
      what’s possible and take it from there.
    </p>

    <ul class="c-rows">
      <li v-for="(r, i) in rows" :key="r.k" v-reveal="i * 90">
        <a :href="r.href" :target="r.ext ? '_blank' : undefined" :rel="r.ext ? 'noopener' : undefined" class="c-row">
          <span class="label">{{ r.k }}</span>
          <span class="c-val">
            <span class="roll"><span>{{ r.v }}</span><span aria-hidden="true">{{ r.v }}</span></span>
          </span>
          <span class="arrow c-arrow">→</span>
        </a>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.contact {
  padding-block: clamp(96px, 14vw, 200px) clamp(64px, 8vw, 120px);
}

.c-hero {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: var(--gutter);
  margin-top: clamp(24px, 4vw, 56px);
}

.c-title {
  font-size: clamp(3.2rem, 12vw, 14rem);
  line-height: 0.86;
  letter-spacing: -0.05em;
}

.c-title :deep(em) {
  color: var(--accent);
}

.c-disc-zone {
  flex: none;
  padding: 40px;
  margin: -40px;
}

.disc {
  --s: clamp(150px, 15vw, 220px);
  width: var(--s);
  height: var(--s);
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: var(--wa);
  color: var(--wa-ink);
  position: relative;
  overflow: hidden;
  isolation: isolate;
}

.disc::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: -1;
  border-radius: 50%;
  background: var(--paper-50);
  transform: scale(0);
  transition: transform 0.7s var(--ease-out);
}

.disc:hover {
  color: var(--graphite-950);
}

.disc:hover::before {
  transform: scale(1);
}

.disc-inner {
  display: grid;
  justify-items: center;
  gap: 0.6rem;
  text-align: center;
  font-size: 0.95rem;
  font-weight: 600;
  line-height: 1.2;
  transition: color 0.4s ease;
}

.c-lede {
  max-width: 52ch;
  margin-top: clamp(40px, 6vw, 80px);
  font-size: clamp(1.05rem, 1.4vw, 1.3rem);
  color: var(--fg-soft);
}

.c-rows {
  list-style: none;
  margin: clamp(40px, 6vw, 80px) 0 0;
  padding: 0;
  border-top: 1px solid var(--line);
}

.c-row {
  display: grid;
  grid-template-columns: 10rem 1fr auto;
  align-items: center;
  gap: var(--gutter);
  padding: clamp(18px, 2.4vw, 30px) 0;
  border-bottom: 1px solid var(--line);
  transition: padding 0.6s var(--ease-out);
}

.c-row:hover {
  padding-left: clamp(8px, 1.2vw, 18px);
}

.c-val {
  font-family: var(--serif);
  font-size: clamp(1.5rem, 3.4vw, 3.2rem);
  letter-spacing: -0.025em;
  overflow-wrap: anywhere;
}

.c-arrow {
  font-size: 1.4rem;
  color: var(--accent);
}

@media (max-width: 760px) {
  .contact {
    padding-block: 88px 56px;
  }
  .c-hero {
    flex-direction: column;
    align-items: stretch;
    gap: 32px;
  }
  .c-title {
    font-size: clamp(3rem, 15vw, 6rem);
  }
  /* the disc becomes a full-width, thumb-sized button */
  .c-disc-zone {
    padding: 0;
    margin: 0;
  }
  .disc {
    width: 100%;
    height: 64px;
    border-radius: 18px;
    transition: transform 0.25s var(--ease-out);
  }
  .disc:active {
    transform: scale(0.97);
  }
  .disc::before {
    display: none;
  }
  .disc:hover {
    color: var(--wa-ink);
  }
  .disc:active {
    background: var(--wa-deep);
  }
  .disc-inner {
    display: flex;
    gap: 0.7rem;
    font-size: 1.02rem;
  }
  .disc-inner br {
    display: none;
  }
  .c-lede {
    margin-top: 32px;
  }
  .c-row {
    grid-template-columns: 1fr auto;
    row-gap: 0.25rem;
    min-height: 64px;
  }
  .c-row:hover {
    padding-left: 0;
  }
  .c-row .label {
    grid-column: 1 / -1;
  }
  .c-val {
    font-size: clamp(1.4rem, 6.4vw, 2rem);
  }
}
</style>
