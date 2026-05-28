# Veer — Sketch Artist Portfolio

A premium, single-page editorial portfolio for **Veer**, a graphite & charcoal
sketch artist. Built with Vue 3 + Vite.

## Develop

```bash
npm install
npm run dev      # local dev server with hot reload
npm run build    # production build → dist/
npm run preview  # preview the production build
```

## Editing the site (no deep coding needed)

| What you want to change | File |
| --- | --- |
| Name, role, tagline, email, social links | `src/data/site.js` |
| The gallery — which sketches show, titles, mediums | `src/data/artworks.js` |
| How to add/replace real sketch images | `src/assets/artworks/README.md` |
| Bio / artist statement & facts | `src/components/AboutSection.vue` |
| Artist photo | `src/assets/artist-portrait.svg` (replace, keep name) |

Anything marked `TODO` in the code is a placeholder to replace with Veer's
real details (email, Instagram handle, bio).

## Structure

Single scrolling page: **Hero → Gallery → About → Contact**, composed in
`src/App.vue`. Sections live in `src/components/`. Scroll-reveal animations come
from the global `v-reveal` directive (`src/composables/useScrollReveal.js`) and
respect `prefers-reduced-motion`.

The gallery uses elegant SVG placeholders so it looks finished before real
artwork arrives — see `src/assets/artworks/README.md` to swap them in.
