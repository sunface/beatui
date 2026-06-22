// Skin registry: every *.css in styles/themes/ is a skin. The eager glob
// bundles them all; names derive from filenames. Adding a skin = dropping a
// file in — no registration.
const themeFiles = import.meta.glob('/src/styles/themes/*.css', {
  eager: true,
})

const HIDDEN_SKINS = new Set(['mono', 'ocean-breeze'])

export const skins = Object.keys(themeFiles)
  .map((path) =>
    path
      .split('/')
      .pop()!
      .replace(/\.css$/, '')
  )
  .filter((skin) => !HIDDEN_SKINS.has(skin))
  .sort((a, b) =>
    a === 'default' ? -1 : b === 'default' ? 1 : a.localeCompare(b)
  )

export type Skin = (typeof skins)[number]

export const DEFAULT_SKIN = 'graphite' as Skin
