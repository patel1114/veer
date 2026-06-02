/* ============================================================
   v-reveal — dramatic scroll-reveal directive.

   Usage:
     <div v-reveal>…</div>            slides UP 80px with blur
     <div v-reveal="200">…</div>      with 200ms stagger delay
     <div v-reveal.left>…</div>       slides from LEFT with rotation
     <div v-reveal.right>…</div>      slides from RIGHT with rotation
     <div v-reveal.scale>…</div>      scales UP from 70% with heavy blur
   ============================================================ */

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

let observer

const ensureObserver = () => {
  if (observer || typeof IntersectionObserver === 'undefined') return observer
  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible')
          observer.unobserve(entry.target)
        }
      }
    },
    { threshold: 0.05, rootMargin: '0px 0px -8% 0px' },
  )
  return observer
}

export const revealDirective = {
  mounted(el, binding) {
    el.setAttribute('data-reveal', '')

    // Direction modifiers
    if (binding.modifiers?.left) {
      el.setAttribute('data-reveal-dir', 'left')
    } else if (binding.modifiers?.right) {
      el.setAttribute('data-reveal-dir', 'right')
    } else if (binding.modifiers?.scale) {
      el.setAttribute('data-reveal-dir', 'scale')
    }

    if (binding.value) el.style.setProperty('--reveal-delay', `${binding.value}ms`)

    const io = ensureObserver()
    if (!io || prefersReducedMotion()) {
      el.classList.add('is-visible')
      return
    }
    io.observe(el)
  },
  unmounted(el) {
    observer?.unobserve(el)
  },
}
