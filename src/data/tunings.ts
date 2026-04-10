import type { TuningPreset } from '../types'

// Open string pitches represented as semitone indices (0=C, 1=C#... 11=B).
// Arrays go from lowest string to highest string.
//
// Why semitones instead of Hz frequencies?
// Because semitones are what we need for fretboard calculation —
// to find what note is on fret 5 of string 2, we do:
//   normalise(tuning[2] + 5)
// That gives us a note index 0-11 we can look up in NOTES[].
// Hz frequencies are only needed when synthesising audio (Phase 3).
//
// Standard 6-string reference:
//   String 1 (lowest) = E2 = index 4
//   String 2          = A2 = index 9
//   String 3          = D3 = index 2
//   String 4          = G3 = index 7
//   String 5          = B3 = index 11
//   String 6 (highest)= E4 = index 4
//
// 7-string adds a low B (index 11) below the low E.
// 8-string adds a low F# (index 6) below the low B.

export const TUNING_PRESETS: TuningPreset[] = [
  {
    label: 'Standard',
    tunings: {
      6: [4, 9, 2, 7, 11, 4],
      7: [11, 4, 9, 2, 7, 11, 4],
      8: [6, 11, 4, 9, 2, 7, 11, 4],
    },
  },
  {
    label: 'Drop D',
    tunings: {
      6: [2, 9, 2, 7, 11, 4],
      7: [11, 2, 9, 2, 7, 11, 4],
      8: [6, 11, 2, 9, 2, 7, 11, 4],
    },
  },
  {
    label: 'Open G',
    tunings: {
      6: [2, 7, 2, 7, 11, 2],
      7: [11, 2, 7, 2, 7, 11, 2],
      8: [6, 11, 2, 7, 2, 7, 11, 2],
    },
  },
  {
    label: 'DADGAD',
    tunings: {
      6: [2, 9, 2, 7, 9, 2],
      7: [11, 2, 9, 2, 7, 9, 2],
      8: [6, 11, 2, 9, 2, 7, 9, 2],
    },
  },
]

// String name labels for display on the fretboard left edge.
// Indexed to match TUNING_PRESETS order.
// These are the note names of each open string, low to high.
export const TUNING_LABELS: Record<string, Record<number, string[]>> = {
  Standard: {
    6: ['E', 'A', 'D', 'G', 'B', 'e'],
    7: ['B', 'E', 'A', 'D', 'G', 'B', 'e'],
    8: ['F#', 'B', 'E', 'A', 'D', 'G', 'B', 'e'],
  },
  'Drop D': {
    6: ['D', 'A', 'D', 'G', 'B', 'e'],
    7: ['B', 'D', 'A', 'D', 'G', 'B', 'e'],
    8: ['F#', 'B', 'D', 'A', 'D', 'G', 'B', 'e'],
  },
  'Open G': {
    6: ['D', 'G', 'D', 'G', 'B', 'D'],
    7: ['B', 'D', 'G', 'D', 'G', 'B', 'D'],
    8: ['F#', 'B', 'D', 'G', 'D', 'G', 'B', 'D'],
  },
  DADGAD: {
    6: ['D', 'A', 'D', 'G', 'A', 'D'],
    7: ['B', 'D', 'A', 'D', 'G', 'A', 'D'],
    8: ['F#', 'B', 'D', 'A', 'D', 'G', 'A', 'D'],
  },
}

// The default tuning used when the app first loads.
export const DEFAULT_TUNING_LABEL = 'Standard'
export const DEFAULT_STRING_COUNT = 6