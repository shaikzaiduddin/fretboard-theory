export const INTERVAL_COLORS: Record<string, string> = {
  // ── Root ──
  'R':  '#e8b931',
  '1':  '#e8b931',

  // ── 2nds ──
  'b2': '#64b5f6',
  'm2': '#64b5f6',
  '2':  '#64b5f6',
  'M2': '#64b5f6',

  // ── 3rds — define major/minor chord quality ──
  'b3': '#4ade80',
  'm3': '#4ade80',
  '3':  '#4ade80',
  'M3': '#4ade80',

  // ── 4ths ──
  '4':  '#fb923c',
  'P4': '#fb923c',
  '#4': '#f472b6',  // tritone / Lydian raised 4th
  'b5': '#f472b6',  // diminished 5th = same as tritone

  // ── 5ths ──
  '5':  '#22d3ee',  // teal — perfect 5th, stable and open
  'P5': '#22d3ee',
  '#5': '#a78bfa',  // augmented 5th
  'b6': '#a78bfa',  // enharmonic of augmented 5th

  // ── 6ths ──
  '6':  '#a78bfa',  // lavender
  'M6': '#a78bfa',

  // ── 7ths ──
  'b7': '#ec4899',  // rose — dominant 7th tension
  'm7': '#ec4899',
  '7':  '#f472b6',  // fuchsia — major 7th leading tone
  'M7': '#f472b6',
}

// Colours for the Solo Guide landing note tiers.
// Kept separate because these map to guide concepts (anchor/colour/passing/avoid)
// rather than specific intervals.
export const VARIANT_COLORS = {
  anchor:  '#e8b931',  // gold  — notes to land and resolve on
  colour:  '#4ade80',  // green — colour tones that define the scale flavour
  passing: '#64b5f6',  // blue  — transitional notes, don't linger here
  avoid:   '#f87171',  // red   — creates unwanted dissonance, use with care
} as const

export type VariantKey = keyof typeof VARIANT_COLORS

// ─── HELPER FUNCTIONS ────────────────────────────────────────────────────────

/** Returns the display colour for any interval label string. Falls back to neutral grey. */
export function getIntervalColor(interval: string): string {
  return INTERVAL_COLORS[interval] ?? '#9ca3af'
}

/** Returns the colour for a Solo Guide tier. */
export function getVariantColor(variant: VariantKey): string {
  return VARIANT_COLORS[variant]
}

/** Background tint for note pills — 18% opacity of the interval colour.
 *  Used for pill backgrounds in InfoBar and SoloGuide.
 *  The hex suffix 18 = 18/255 ≈ 6% in rgba terms — subtle tint, not solid fill. */
export function getIntervalBgColor(interval: string): string {
  return `${getIntervalColor(interval)}18`
}

/** Border colour for note pills — 35% opacity. More visible than bg tint. */
export function getIntervalBorderColor(interval: string): string {
  return `${getIntervalColor(interval)}35`
}