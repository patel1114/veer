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

## Notes

- `category` must be one of the values in `CATEGORIES` (top of `artworks.js`):
  `Portraits`, `Couples & Family`, `Children`, `Devotional`. Add new ones there if needed.
- Set `feature: true` on a piece to make it span larger in the gallery grid.
- Use `pairWith: '<id>'` to mark a second photo of the same drawing (a detail
  shot or another angle) so it sits next to its companion.
- For best quality/size, export photos around **1600px on the long edge** as
  `.webp` or `.jpg`.
- The artist photo in the About section lives one level up at
  `src/assets/veer-with-celebrity.jpg`, and the brand logo at
  `src/assets/veer-art-logo.png` (also in `public/` for the favicon) — replace
  those files (keep the names) to update them.
