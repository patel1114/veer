/* ============================================================
   Artwork catalogue — the single source of truth for the gallery.
   These are Veer's real graphite & charcoal drawings.

   Display order is set by CURATION at the bottom of this file —
   best work first. Two photos of the SAME drawing (a full view + a
   close-up or process shot) are kept next to each other on purpose.

   HOW TO ADD / REPLACE A SKETCH
   -----------------------------
   1. Drop the image file into  src/assets/artworks/
      (formats: .jpg .jpeg .png .webp)
   2. Add or edit an entry below; set `image` to the filename.
   3. Set `aspect` to the image's width / height
      (e.g. a 3024×4032 photo -> aspect: 3024 / 4032).
   4. `category` must be one of CATEGORIES below.
   5. Optional flags: `feature` (spans larger in the grid),
      `pairWith` (id of the companion photo of the same drawing).
   ============================================================ */

const files = import.meta.glob('../assets/artworks/*.{svg,png,jpg,jpeg,webp}', {
  eager: true,
  query: '?url',
  import: 'default',
})

// 800px copies for phones & thumbnails (same filenames, in ./sm/).
const smallFiles = import.meta.glob('../assets/artworks/sm/*.{png,jpg,jpeg,webp}', {
  eager: true,
  query: '?url',
  import: 'default',
})

const img = (name) => {
  const hit = Object.entries(files).find(([path]) => path.endsWith(`/${name}`))
  if (!hit) console.warn(`[artworks] image not found: ${name}`)
  return hit ? hit[1] : ''
}

const smallOf = (url) => {
  const name = Object.entries(files).find(([, u]) => u === url)?.[0].split('/').pop()
  const hit = name && Object.entries(smallFiles).find(([path]) => path.endsWith(`/${name}`))
  return hit ? hit[1] : url // falls back to the full image if no small copy exists
}

/* srcset helper: lets the browser pick 800px on phones, full size on big screens */
export const srcsetOf = (art) => (art.thumb !== art.image ? `${art.thumb} 800w, ${art.image} 1600w` : undefined)

export const CATEGORIES = [
  'All',
  'Portraits',
  'Couples & Family',
  'Children',
  'Devotional',
]

const catalogue = [
  {
    id: 'camo-full',
    title: 'The Camo Shirt',
    medium: 'Graphite on paper',
    year: '2024',
    category: 'Portraits',
    image: img('camo-portrait.jpg'),
    aspect: 960 / 1280,
    feature: true,
    description:
      'A hyper-real graphite portrait — every fold of the camouflage and strand of hair built up by hand.',
  },
  {
    id: 'camo-detail',
    title: 'The Camo Shirt — Detail',
    medium: 'Graphite on paper',
    year: '2024',
    category: 'Portraits',
    image: img('camo-portrait-detail.jpg'),
    aspect: 960 / 1280,
    pairWith: 'camo-full',
    description: 'A close-up showing the skin, stubble and ear rendered stroke by stroke.',
  },
  {
    id: 'lord-ram',
    title: 'Shri Ram',
    medium: 'Graphite & charcoal',
    year: '2024',
    category: 'Devotional',
    image: img('lord-ram.jpg'),
    aspect: 1440 / 1800,
    description:
      'A devotional study of the young Lord Ram with bow and arrow — the piece gifted on stage to a celebrated artist.',
  },
  {
    id: 'couple-suit',
    title: 'Together',
    medium: 'Graphite & charcoal',
    year: '2024',
    category: 'Couples & Family',
    image: img('couple-suit.jpg'),
    aspect: 960 / 1280,
    description: 'A couple in formal dress — the patterned saree drawn thread by thread.',
  },
  {
    id: 'turban',
    title: 'The Pagh',
    medium: 'Graphite on paper',
    year: '2024',
    category: 'Portraits',
    image: img('turban-portrait.jpg'),
    aspect: 960 / 1280,
    description: 'A proud portrait crowned by an intricately tied traditional turban.',
  },
  {
    id: 'family-three',
    title: 'Family Portrait',
    medium: 'Graphite & charcoal',
    year: '2024',
    category: 'Couples & Family',
    image: img('family-three.jpg'),
    aspect: 3035 / 2728,
    feature: true,
    description: 'Mother, father and child — a commissioned keepsake in soft tonal graphite.',
  },
  {
    id: 'father-son',
    title: 'Laughter',
    medium: 'Graphite & charcoal',
    year: '2024',
    category: 'Couples & Family',
    image: img('father-son.jpg'),
    aspect: 1200 / 1600,
    feature: true,
    description:
      'A father and his laughing baby, cheek to cheek — deep charcoal blacks against soft, glowing skin.',
  },
  {
    id: 'father-son-desk',
    title: 'Laughter — On the Desk',
    medium: 'Graphite & charcoal',
    year: '2024',
    category: 'Couples & Family',
    image: img('father-son-desk.jpg'),
    aspect: 1200 / 1600,
    pairWith: 'father-son',
    description:
      'The same drawing on the studio desk — the faint proportion grid still visible on the paper beside the pencils.',
  },
  {
    id: 'couple-sherwani',
    title: 'The Celebration',
    medium: 'Graphite & charcoal',
    year: '2024',
    category: 'Couples & Family',
    feature: true,
    image: img('couple-sherwani.jpg'),
    aspect: 3024 / 4032,
    description: 'A festive couple portrait — deep blacks against the detailed weave of the saree.',
  },
  {
    id: 'police-officer',
    title: 'Satyamev Jayate',
    medium: 'Graphite on paper',
    year: '2024',
    category: 'Portraits',
    image: img('police-officer.jpg'),
    aspect: 960 / 1280,
    description: 'A police officer in uniform beneath the State Emblem — a portrait of quiet authority.',
  },
  {
    id: 'chief-minister',
    title: 'Chief Minister, West Bengal',
    medium: 'Graphite & charcoal',
    year: '2024',
    category: 'Portraits',
    image: img('chief-minister.jpg'),
    aspect: 1600 / 1204,
    feature: true,
    description:
      'A formal portrait at the desk — the carved chair, the State Emblem and the tricolour, all rendered in graphite.',
  },
  {
    id: 'baby-yellow',
    title: 'Little One in Yellow',
    medium: 'Graphite & colour pencil',
    year: '2024',
    category: 'Children',
    image: img('baby-yellow.jpg'),
    aspect: 3024 / 4032,
    description: 'A baby at rest — a single touch of yellow brings the dhoti to life against the grey.',
  },
  {
    id: 'baby-car',
    title: 'First Drive',
    medium: 'Graphite on paper',
    year: '2024',
    category: 'Children',
    image: img('baby-car.jpg'),
    aspect: 3024 / 4032,
    description: 'A little girl at the wheel of her toy car, caught mid-laugh.',
  },
  {
    id: 'baby-car-wide',
    title: 'First Drive — Full View',
    medium: 'Graphite on paper',
    year: '2024',
    category: 'Children',
    image: img('baby-car-wide.jpg'),
    aspect: 4030 / 2907,
    pairWith: 'baby-car',
    description: 'The complete composition — the gleaming toy car rendered in full.',
  },
  {
    id: 'glasses',
    title: 'The Gentleman',
    medium: 'Graphite on paper',
    year: '2023',
    category: 'Portraits',
    image: img('glasses-portrait.jpg'),
    aspect: 1192 / 1600,
    description: 'A soft, lifelike portrait study — gentle gradients and a steady gaze.',
  },
  {
    id: 'jagannath',
    title: 'Jagannath, Balabhadra & Subhadra',
    medium: 'Graphite & charcoal',
    year: '2023',
    category: 'Devotional',
    image: img('jagannath.jpg'),
    aspect: 2608 / 3460,
    description: 'The deities of Puri before their temple — an ornate, detailed devotional drawing.',
  },
]

/* ------------------------------------------------------------
   CURATION ORDER — strongest work first. This is the order of the
   gallery, the subject previews and the viewer. A detail / process
   photo sits right after its drawing. Reorder ids here to re-curate;
   anything not listed is appended at the end.
   ------------------------------------------------------------ */
const CURATION = [
  'camo-full',
  'camo-detail',
  'father-son',
  'father-son-desk',
  'couple-sherwani',
  'chief-minister',
  'couple-suit',
  'family-three',
  'turban',
  'police-officer',
  'glasses',
  'baby-car',
  'baby-car-wide',
  'baby-yellow',
  'jagannath',
  'lord-ram',
]

const rank = (id) => {
  const i = CURATION.indexOf(id)
  return i === -1 ? CURATION.length : i
}

export const artworks = catalogue
  .slice()
  .sort((a, b) => rank(a.id) - rank(b.id))
  .map((a) => ({ ...a, thumb: smallOf(a.image) }))
