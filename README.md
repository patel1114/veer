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

## Deploy to Vercel

Vercel auto-detects Vite — no extra config needed (`vercel.json` is included
for completeness). Pick one of the two paths:

### A) Quick CLI deploy (recommended)

```powershell
npx vercel login     # one-time: log in with email / GitHub
npm run deploy       # deploys to production (alias for `vercel --prod`)
```

The first run will ask a couple of setup questions ("Set up and deploy?", project
name, scope). Accept the defaults — it'll build and give you a live `*.vercel.app`
URL. Every subsequent `npm run deploy` ships a new production build.

### B) GitHub + Vercel dashboard (auto-deploys on push)

1. Create a new repo on GitHub.
2. `git remote add origin <repo url>` then `git push -u origin main`.
3. On [vercel.com](https://vercel.com/new), "Import" that repo. Framework
   auto-detects as **Vite**. Click Deploy.
4. Every push to `main` now redeploys production automatically.

## Editing the site (no deep coding needed)

| What you want to change | File |
| --- | --- |
| Name, tagline, intro, email, WhatsApp, Instagram | `src/data/site.js` |
| The drawings — order, titles, mediums, descriptions | `src/data/artworks.js` |
| How to add/replace sketch images | `src/assets/artworks/README.md` |
| Artist statement | `src/components/StatementSection.vue` |
| Process steps ("Share a photo" …) | `src/components/CraftSection.vue` |
| Stage / celebrity moments | `src/components/RecognitionSection.vue` |
| Colours, fonts, spacing tokens | top of `src/style.css` |

## Structure

Single scrolling page, composed in `src/App.vue`:

**Preloader → Hero (self-drawing sketch) → Marquee → Statement → Work
(horizontal gallery) → Craft (zoom-in proof, paper theme) → What I draw →
Recognition → Contact → Footer**, plus a full-screen artwork viewer with a
magnifying loupe.

Motion stack: [GSAP](https://gsap.com) + ScrollTrigger for scroll-driven
animation, [Lenis](https://lenis.darkroom.engineering) for smooth scrolling
(`src/composables/motion.js`). `v-reveal` and `v-split` directives
(`src/composables/directives.js`) handle entrance animations. Everything
respects `prefers-reduced-motion`; the custom cursor only appears on mouse /
trackpad devices.

The hero's sketch effect (`src/components/SketchCanvas.vue`) is generated live
from the real drawing with an edge-detection pass — swap the image in
`HeroSection.vue` and the effect follows.
