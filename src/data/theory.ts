import type { NoteName } from '../types'

// The 12 notes of the chromatic scale as display strings.
// Index 0 = C, index 1 = C#, ... index 11 = B.
// This ordering is fundamental — every calculation in this app
// produces a number 0-11 that indexes into this array.
export const NOTES: NoteName[] = [
  'C', 'C#', 'D', 'D#', 'E', 'F',
  'F#', 'G', 'G#', 'A', 'A#', 'B'
]

// Role colors — each interval type has a consistent color across the whole app.
// Stored here so the fretboard renderer and the legend both use the same source.
// Index = semitone interval from root (0-11).
export const ROLE_COLORS: Record<number, string> = {
  0:  '#c9a84c', // root — gold
  1:  '#7a6850', // ♭2
  2:  '#7a6850', // 2nd
  3:  '#7dc87a', // ♭3 — green (minor third)
  4:  '#7dc87a', // 3rd — green (major third)
  5:  '#7a6850', // 4th
  6:  '#cc7a7a', // ♭5 — red (diminished fifth)
  7:  '#cc7a7a', // 5th — red (perfect fifth)
  8:  '#cc7a7a', // ♯5
  9:  '#7a6850', // 6th
  10: '#b57acc', // ♭7 — purple
  11: '#b57acc', // 7th — purple
}

// Human readable names for each interval.
export const ROLE_NAMES: Record<number, string> = {
  0:  'Root',
  1:  '♭2nd',
  2:  '2nd',
  3:  '♭3rd — Minor 3rd',
  4:  '3rd — Major 3rd',
  5:  '4th',
  6:  '♭5th — Diminished 5th',
  7:  '5th — Perfect 5th',
  8:  '♯5th — Augmented 5th',
  9:  '6th',
  10: '♭7th — Minor 7th',
  11: '7th — Major 7th',
}

// ─── CORE CALCULATION FUNCTIONS ───────────────────────────────────────────────

// normalise keeps any number within the 0-11 range.
// This is the most important utility in the whole app.
//
// Why double modulo? JavaScript's % operator can return negative numbers.
// Example: -1 % 12 = -1 in JavaScript (not 11 like you'd expect).
// The pattern ((n % 12) + 12) % 12 handles this correctly:
//   -1  → ((-1 % 12) + 12) % 12 = (-1 + 12) % 12 = 11 ✓
//   13  → ((13 % 12) + 12) % 12 = (1  + 12) % 12 = 1  ✓
//   0   → ((0  % 12) + 12) % 12 = (0  + 12) % 12 = 0  ✓
export function normalise(n: number): number {
  return ((n % 12) + 12) % 12
}

// Returns the note name for a given root + interval combination.
// Example: noteName(0, 4) → 'E'  (C major third)
//          noteName(9, 3) → 'C'  (A minor third)
//          noteName(5, 7) → 'C'  (F perfect fifth)
export function noteName(root: number, interval: number): NoteName {
  return NOTES[normalise(root + interval)]
}

// Returns the open string frequency in Hz for a given string index
// and tuning array. Then calculates the fretted note frequency.
//
// The formula 2^(fret/12) comes from equal temperament tuning —
// each semitone is the 12th root of 2 (≈1.0595) higher than the last.
// 12 semitones = one octave = exactly double the frequency.
// Example: A4 = 440Hz, A5 = 880Hz, A3 = 220Hz.
export function fretToFreq(
  stringIndex: number,
  fret: number,
  openFreqs: number[]
): number {
  return openFreqs[stringIndex] * Math.pow(2, fret / 12)
}

// Builds the complete set of notes that should appear on the fretboard
// for a given root and interval pattern.
// Returns a Set for O(1) lookup — when rendering 100+ dots,
// checking noteSet.has(n) is much faster than array.includes(n).
export function buildNoteSet(
  root: number,
  intervals: number[]
): Set<number> {
  return new Set(intervals.map(iv => normalise(root + iv)))
}

// Builds a lookup map from note index → interval info.
// Used by the fretboard renderer to know what color and label
// to show for each dot.
export function buildIntervalMap(
  root: number,
  intervals: number[],
  degrees: string[]
): Record<number, { interval: number; degree: string }> {
  const map: Record<number, { interval: number; degree: string }> = {}
  intervals.forEach((iv, idx) => {
    const noteIndex = normalise(root + iv)
    // Only set if not already set — root takes priority over duplicates
    if (!(noteIndex in map)) {
      map[noteIndex] = { interval: iv, degree: degrees[idx] }
    }
  })
  return map
}