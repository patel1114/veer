/* Tiny shared UI state — no store library needed for this size. */
import { reactive } from 'vue'

export const ui = reactive({
  // Preloader finished → hero intro may play
  introDone: false,

  // Artwork viewer
  viewer: {
    open: false,
    items: [],
    index: 0,
    originRect: null, // DOMRect of the clicked image, for the FLIP opening
  },
})

export function openViewer(items, index, originEl) {
  ui.viewer.items = items
  ui.viewer.index = index
  ui.viewer.originRect = originEl ? originEl.getBoundingClientRect() : null
  ui.viewer.open = true
}

export function closeViewer() {
  ui.viewer.open = false
}
