/* ============================================================
   v-reveal  — fade + rise when the element enters the viewport.
               v-reveal="120"  → 120ms delay
   v-split   — masks each word and slides it up, staggered.
               v-split="200"   → 200ms delay before the stagger
               v-split.manual  → only animates when `.is-in` is added
                                 by a parent timeline (e.g. the hero)
   ============================================================ */
import { reducedMotion } from './motion'

let io

const observer = () => {
  if (io || typeof IntersectionObserver === 'undefined') return io
  io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          e.target.classList.add('is-in')
          io.unobserve(e.target)
        }
      }
    },
    { threshold: 0.15, rootMargin: '0px 0px -6% 0px' },
  )
  return io
}

const watch = (el) => {
  const o = observer()
  if (!o || reducedMotion) el.classList.add('is-in')
  else o.observe(el)
}

export const reveal = {
  mounted(el, binding) {
    el.setAttribute('data-reveal', '')
    if (binding.value) el.style.setProperty('--d', `${binding.value}ms`)
    watch(el)
  },
  unmounted(el) {
    io?.unobserve(el)
  },
}

/* Wraps every word of the element's text in mask spans.
   Inline <em>/<span> children keep their styling. */
function splitWords(root) {
  let i = 0
  const walk = (node) => {
    for (const child of [...node.childNodes]) {
      if (child.nodeType === Node.TEXT_NODE) {
        const parts = child.textContent.split(/(\s+)/)
        const frag = document.createDocumentFragment()
        for (const part of parts) {
          if (!part) continue
          if (/^\s+$/.test(part)) {
            frag.appendChild(document.createTextNode(' '))
            continue
          }
          const word = document.createElement('span')
          word.className = 'split-word'
          const inner = document.createElement('span')
          inner.className = 'split-inner'
          inner.style.setProperty('--i', i++)
          inner.textContent = part
          word.appendChild(inner)
          frag.appendChild(word)
        }
        child.replaceWith(frag)
      } else if (child.nodeType === Node.ELEMENT_NODE && child.tagName !== 'BR') {
        walk(child)
      }
    }
  }
  walk(root)
}

export const split = {
  mounted(el, binding) {
    if (!el.dataset.split) {
      el.dataset.split = ''
      el.setAttribute('aria-label', el.textContent.replace(/\s+/g, ' ').trim())
      splitWords(el)
      el.querySelectorAll('.split-word').forEach((w) => w.setAttribute('aria-hidden', 'true'))
    }
    if (binding.value) el.style.setProperty('--d', `${binding.value}ms`)
    if (!binding.modifiers.manual) watch(el)
    else if (reducedMotion) el.classList.add('is-in')
  },
  unmounted(el) {
    io?.unobserve(el)
  },
}
