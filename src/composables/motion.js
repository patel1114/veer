/* ============================================================
   Motion core — Lenis smooth scroll driven by the GSAP ticker,
   so ScrollTrigger scrubs and the scroll itself share one clock.
   ============================================================ */
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export { gsap, ScrollTrigger }

export const reducedMotion =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

export const finePointer =
  typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches

let lenis = null

export function initSmoothScroll() {
  if (reducedMotion || lenis) return lenis
  lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
  })
  lenis.on('scroll', ScrollTrigger.update)
  gsap.ticker.add((time) => lenis.raf(time * 1000))
  gsap.ticker.lagSmoothing(0)
  return lenis
}

export function getLenis() {
  return lenis
}

export function scrollToTarget(target, opts = {}) {
  const el = typeof target === 'string' ? document.querySelector(target) : target
  if (target === '#top' || target === 0) {
    lenis ? lenis.scrollTo(0, { duration: 1.6 }) : window.scrollTo({ top: 0 })
    return
  }
  if (!el) return
  if (lenis) lenis.scrollTo(el, { duration: 1.6, offset: opts.offset ?? 0 })
  else el.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' })
}

export function lockScroll() {
  document.body.classList.add('is-locked')
  lenis?.stop()
}

export function unlockScroll() {
  document.body.classList.remove('is-locked')
  lenis?.start()
}
