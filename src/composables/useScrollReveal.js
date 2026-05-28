/* ============================================================
   v-reveal — a tiny scroll-reveal directive.

   Usage in templates:
     <div v-reveal>…</div>            fades/rises in when scrolled into view
     <div v-reveal="120">…</div>      with a 120ms stagger delay

   Styling lives in style.css under [data-reveal] / .is-visible.
   Respects prefers-reduced-motion (elements just show, no animation).
   ============================================================ */

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

// One shared observer for every element — cheap and consistent.
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
    { threshold: 0.15, rootMargin: '0px 0px -10% 0px' },
  )
  return observer
}

export const revealDirective = {
  mounted(el, binding) {
    el.setAttribute('data-reveal', '')
    if (binding.value) el.style.setProperty('--reveal-delay', `${binding.value}ms`)

    // No IO support or reduced motion → reveal immediately.
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
