# Artwork images

This folder holds Veer's real sketch photos (`.jpg`). The gallery is driven
entirely by `src/data/artworks.js` — adding or swapping a piece is quick.

## To add or replace a sketch

1. **Drop the image here** — put the real file (`.jpg`, `.png`, `.webp`, or `.svg`)
   into this folder: `src/assets/artworks/`.
2. **Point an entry at it** — open `src/data/artworks.js` and set the entry's
   `image:` to the new filename, e.g. `image: img('veer-portrait-01.jpg')`.
3. **Set the aspect ratio** — update `aspect:` to the image's `width / height`
   (e.g. a 2000×3000 photo → `aspect: 2000 / 3000`). This stops the grid from
   jumping while the picture loads.
4. Update `title`, `medium`, `year`, and `category` while you're there.

## Phone-sized copies (recommended)

Phones load the 800px copies in `src/assets/artworks/sm/` (same filename as
the full image). When you add a new drawing, also save an ~800px-wide copy
there. If you skip it, the site still works and simply uses the full image.

## Notes

- `category` must be one of the values in `CATEGORIES` (top of `artworks.js`):
  `Portraits`, `Couples & Family`, `Children`, `Devotional`. Add new ones there if needed.
- Set `feature: true` on a piece to show it taller in the horizontal gallery.
- Use `pairWith: '<id>'` to mark a second photo of the same drawing (a detail
  shot or another angle) so it sits next to its companion.
- For best quality/size, export photos around **1600px on the long edge** as
  `.webp` or `.jpg`.
- The stage photos in the Recognition section live one level up at
  `src/assets/veer-with-celebrity.jpg` and `veer-with-kinjal-dave.jpg`, and the brand logo (used as the favicon) at
  `public/veer-art-logo.png` — replace
  those files (keep the names) to update them.
