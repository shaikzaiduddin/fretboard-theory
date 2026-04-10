// ─── NOTE NAMES ───────────────────────────────────────────────────────────────
// A union type means the value must be exactly one of these strings.
// TypeScript will error if you try to pass "H" or "Bb" — only these 12 are valid.
// This mirrors the 12 notes of the Western chromatic scale.
export type NoteName =
  | 'C' | 'C#' | 'D' | 'D#' | 'E' | 'F'
  | 'F#' | 'G' | 'G#' | 'A' | 'A#' | 'B'

// ─── CATEGORY ─────────────────────────────────────────────────────────────────
// The four main sections of the app sidebar.
// Using a union type means if you rename a category, TypeScript shows every
// place in the codebase that needs updating. You can't miss one.
export type Category = 'scales' | 'triads' | 'seventh' | 'modes'

// ─── LABEL MODE ───────────────────────────────────────────────────────────────
// Controls what text appears inside each dot on the fretboard.
export type LabelMode = 'note' | 'interval' | 'none'

// ─── STRING COUNT ─────────────────────────────────────────────────────────────
// A literal type — only exactly 6, 7, or 8 are valid.
// If someone passes 5 or 9, TypeScript catches it at compile time.
export type StringCount = 6 | 7 | 8

// ─── SCALE PATTERN ────────────────────────────────────────────────────────────
// Represents one scale or mode — Major, Dorian, Blues, etc.
// This is the shape of every object in your scales data file.
export interface ScalePattern {
  name: string        // "Major", "Dorian", "Blues"
  intervals: number[] // semitone distances from root e.g. [0,2,4,5,7,9,11]
  steps: string       // human readable e.g. "W W H W W W H"
  degrees: string[]   // interval names e.g. ["R","2","3","4","5","6","7"]
  mode?: boolean      // optional — true only for mode entries in the scales list
}

// ─── SOLO GUIDE ───────────────────────────────────────────────────────────────
// The theory content shown in the Solo Guide panel for each scale.
// s1/s2/s3/av store interval numbers (0-11), not note names,
// because the guide must work in any key.
export interface SoloGuide {
  s1: number[]    // anchor intervals — strongest landing notes
  s2: number[]    // colour intervals — add character without clashing
  s3: number[]    // passing intervals — use in motion, don't land on them
  av: number[]    // avoid intervals — clash with the underlying chord
  theory: string  // explanation paragraph
  tip: string     // the "Pro Move" practice tip
}

// ─── TUNING PRESET ────────────────────────────────────────────────────────────
// One tuning preset e.g. Standard, Drop D, Open G.
// The tunings Record maps string count to an array of semitone values.
// Record<6 | 7 | 8, number[]> means: an object that must have keys 6, 7, and 8,
// each holding an array of numbers (the open string pitches as semitones).
export interface TuningPreset {
  label: string
  tunings: Record<StringCount, number[]>
}

// ─── DIATONIC CHORD ───────────────────────────────────────────────────────────
// One chord in a diatonic context e.g. the ii chord in a major key.
export interface DiatonicChord {
  degree: string      // "I", "ii", "iii", "IV", "V", "vi", "vii°"
  type: 'maj' | 'min' | 'dim' | 'dom'
  intervals: number[] // intervals that make up this chord type
}

// ─── FRETBOARD NOTE ───────────────────────────────────────────────────────────
// Represents a single highlighted position on the fretboard.
// Used internally by the fretboard renderer.
export interface FretboardNote {
  string: number   // 0 = lowest string
  fret: number     // 0 = open string
  interval: number // semitone distance from root (0-11)
  degree: string   // interval name e.g. "R", "3", "♭7"
}