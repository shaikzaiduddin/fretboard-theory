import type { ScalePattern } from '../types'

// Every scale and mode in the app lives here.
// Components never hardcode scale data — they always import from this file.
// This means adding a new scale in the future = add one object here,
// and it automatically appears everywhere in the UI.
//
// intervals: semitone distances from the root note (always starts with 0)
// degrees:   how musicians name each interval e.g. "R", "♭3", "♯4"
// steps:     whole/half step pattern — useful for music theory reference
// mode:      true only for entries in the modes section, used to render
//            the "── Modes ──" divider in the sidebar pattern list

export const SCALE_PATTERNS: ScalePattern[] = [

  // ─── SCALES ──────────────────────────────────────────────────────────────

  {
    name: 'Major',
    intervals: [0, 2, 4, 5, 7, 9, 11],
    steps: 'W W H W W W H',
    degrees: ['R', '2', '3', '4', '5', '6', '7'],
  },
  {
    name: 'Natural Minor',
    intervals: [0, 2, 3, 5, 7, 8, 10],
    steps: 'W H W W H W W',
    degrees: ['R', '2', '♭3', '4', '5', '♭6', '♭7'],
  },
  {
    name: 'Harmonic Minor',
    intervals: [0, 2, 3, 5, 7, 8, 11],
    steps: 'W H W W H A H',
    degrees: ['R', '2', '♭3', '4', '5', '♭6', '7'],
  },
  {
    name: 'Melodic Minor',
    intervals: [0, 2, 3, 5, 7, 9, 11],
    steps: 'W H W W W W H',
    degrees: ['R', '2', '♭3', '4', '5', '6', '7'],
  },
  {
    name: 'Pentatonic Major',
    intervals: [0, 2, 4, 7, 9],
    steps: 'W W m3 W m3',
    degrees: ['R', '2', '3', '5', '6'],
  },
  {
    name: 'Pentatonic Minor',
    intervals: [0, 3, 5, 7, 10],
    steps: 'm3 W W m3 W',
    degrees: ['R', '♭3', '4', '5', '♭7'],
  },
  {
    name: 'Blues',
    intervals: [0, 3, 5, 6, 7, 10],
    steps: 'm3 W H H m3 W',
    degrees: ['R', '♭3', '4', '♭5', '5', '♭7'],
  },
  {
    name: 'Whole Tone',
    intervals: [0, 2, 4, 6, 8, 10],
    steps: 'W W W W W W',
    degrees: ['R', '2', '3', '♯4', '♯5', '♭7'],
  },
  {
    name: 'Diminished HW',
    intervals: [0, 1, 3, 4, 6, 7, 9, 10],
    steps: 'H W H W H W H W',
    degrees: ['R', '♭2', '♭3', '3', '♭5', '5', '6', '♭7'],
  },
  {
    name: 'Diminished WH',
    intervals: [0, 2, 3, 5, 6, 8, 9, 11],
    steps: 'W H W H W H W H',
    degrees: ['R', '2', '♭3', '4', '♭5', '♭6', '6', '7'],
  },

  // ─── MODES ───────────────────────────────────────────────────────────────
  // All 7 modes of the major scale.
  // mode: true flags these for the sidebar divider rendering.
  // Notice Ionian is identical to Major — that's correct.
  // They're the same notes, but the context (which chord you're playing
  // over) determines which name you use.

  {
    name: 'Ionian (Mode I)',
    intervals: [0, 2, 4, 5, 7, 9, 11],
    steps: 'W W H W W W H',
    degrees: ['R', '2', '3', '4', '5', '6', '7'],
    mode: true,
  },
  {
    name: 'Dorian (Mode II)',
    intervals: [0, 2, 3, 5, 7, 9, 10],
    steps: 'W H W W W H W',
    degrees: ['R', '2', '♭3', '4', '5', '6', '♭7'],
    mode: true,
  },
  {
    name: 'Phrygian (Mode III)',
    intervals: [0, 1, 3, 5, 7, 8, 10],
    steps: 'H W W W H W W',
    degrees: ['R', '♭2', '♭3', '4', '5', '♭6', '♭7'],
    mode: true,
  },
  {
    name: 'Lydian (Mode IV)',
    intervals: [0, 2, 4, 6, 7, 9, 11],
    steps: 'W W W H W W H',
    degrees: ['R', '2', '3', '♯4', '5', '6', '7'],
    mode: true,
  },
  {
    name: 'Mixolydian (Mode V)',
    intervals: [0, 2, 4, 5, 7, 9, 10],
    steps: 'W W H W W H W',
    degrees: ['R', '2', '3', '4', '5', '6', '♭7'],
    mode: true,
  },
  {
    name: 'Aeolian (Mode VI)',
    intervals: [0, 2, 3, 5, 7, 8, 10],
    steps: 'W H W W H W W',
    degrees: ['R', '2', '♭3', '4', '5', '♭6', '♭7'],
    mode: true,
  },
  {
    name: 'Locrian (Mode VII)',
    intervals: [0, 1, 3, 5, 6, 8, 10],
    steps: 'H W W H W W W',
    degrees: ['R', '♭2', '♭3', '4', '♭5', '♭6', '♭7'],
    mode: true,
  },
]

// Separate arrays for the sidebar tabs that show only one category.
// These filter SCALE_PATTERNS rather than duplicating data.
// Single source of truth — if you edit a pattern above, 
// these automatically reflect the change.
export const SCALES_ONLY = SCALE_PATTERNS.filter(p => !p.mode)
export const MODES_ONLY  = SCALE_PATTERNS.filter(p => p.mode)

// Triad patterns
export const TRIAD_PATTERNS: ScalePattern[] = [
  {
    name: 'Major',
    intervals: [0, 4, 7],
    steps: '1–3–5',
    degrees: ['R', '3', '5'],
  },
  {
    name: 'Minor',
    intervals: [0, 3, 7],
    steps: '1–♭3–5',
    degrees: ['R', '♭3', '5'],
  },
  {
    name: 'Diminished',
    intervals: [0, 3, 6],
    steps: '1–♭3–♭5',
    degrees: ['R', '♭3', '♭5'],
  },
  {
    name: 'Augmented',
    intervals: [0, 4, 8],
    steps: '1–3–♯5',
    degrees: ['R', '3', '♯5'],
  },
  {
    name: 'Sus2',
    intervals: [0, 2, 7],
    steps: '1–2–5',
    degrees: ['R', '2', '5'],
  },
  {
    name: 'Sus4',
    intervals: [0, 5, 7],
    steps: '1–4–5',
    degrees: ['R', '4', '5'],
  },
]

// Seventh chord patterns
export const SEVENTH_PATTERNS: ScalePattern[] = [
  {
    name: 'Major 7th',
    intervals: [0, 4, 7, 11],
    steps: '1–3–5–7',
    degrees: ['R', '3', '5', '7'],
  },
  {
    name: 'Dominant 7th',
    intervals: [0, 4, 7, 10],
    steps: '1–3–5–♭7',
    degrees: ['R', '3', '5', '♭7'],
  },
  {
    name: 'Minor 7th',
    intervals: [0, 3, 7, 10],
    steps: '1–♭3–5–♭7',
    degrees: ['R', '♭3', '5', '♭7'],
  },
  {
    name: 'Minor Maj7',
    intervals: [0, 3, 7, 11],
    steps: '1–♭3–5–7',
    degrees: ['R', '♭3', '5', '7'],
  },
  {
    name: 'Half Dim 7th',
    intervals: [0, 3, 6, 10],
    steps: '1–♭3–♭5–♭7',
    degrees: ['R', '♭3', '♭5', '♭7'],
  },
  {
    name: 'Diminished 7th',
    intervals: [0, 3, 6, 9],
    steps: '1–♭3–♭5–♭♭7',
    degrees: ['R', '♭3', '♭5', '♭♭7'],
  },
  {
    name: 'Augmented Maj7',
    intervals: [0, 4, 8, 11],
    steps: '1–3–♯5–7',
    degrees: ['R', '3', '♯5', '7'],
  },
  {
    name: 'Dom 7 Sus4',
    intervals: [0, 5, 7, 10],
    steps: '1–4–5–♭7',
    degrees: ['R', '4', '5', '♭7'],
  },
]

// A lookup map so components can get all patterns for a category
// without a switch statement. Clean and extensible.
export const PATTERNS_BY_CATEGORY = {
  scales:  SCALE_PATTERNS,
  triads:  TRIAD_PATTERNS,
  seventh: SEVENTH_PATTERNS,
  modes:   MODES_ONLY,
} as const