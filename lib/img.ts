/** Neutral 4:3 placeholder used when a product/master/etc. has no image. */
export const PLACEHOLDER =
  'data:image/svg+xml;charset=utf-8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">` +
      `<rect width="400" height="300" fill="#efe9df"/>` +
      `<path d="M150 190l38-46 26 30 20-22 30 38z" fill="#d8cfbf"/>` +
      `<circle cx="160" cy="120" r="16" fill="#d8cfbf"/>` +
      `</svg>`,
  )

/** Returns a safe image src — never an empty string. */
export const img = (src?: string | null) => (src && src.trim() ? src : PLACEHOLDER)
