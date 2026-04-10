import { describe, it, expect } from 'vitest'
import {
  normalise,
  noteName,
  buildNoteSet,
  buildIntervalMap,
} from '../data/theory'

// ─── normalise ────────────────────────────────────────────────────────────────
describe('normalise', () => {
  it('leaves numbers 0-11 unchanged', () => {
    expect(normalise(0)).toBe(0)
    expect(normalise(6)).toBe(6)
    expect(normalise(11)).toBe(11)
  })

  it('wraps 12 back to 0', () => {
    expect(normalise(12)).toBe(0)
  })

  it('wraps numbers above 12', () => {
    expect(normalise(13)).toBe(1)
    expect(normalise(24)).toBe(0)
    expect(normalise(14)).toBe(2)
  })

  it('handles negative numbers correctly', () => {
    // This is the tricky case — JavaScript % returns negative for negative inputs
    expect(normalise(-1)).toBe(11)  // one semitone below C = B
    expect(normalise(-12)).toBe(0)  // one octave below = same note
    expect(normalise(-13)).toBe(11) // 13 below = B
  })
})

// ─── noteName ─────────────────────────────────────────────────────────────────
describe('noteName', () => {
  it('finds the correct note for C major intervals', () => {
    expect(noteName(0, 0)).toBe('C')   // root
    expect(noteName(0, 4)).toBe('E')   // major 3rd
    expect(noteName(0, 7)).toBe('G')   // perfect 5th
    expect(noteName(0, 11)).toBe('B')  // major 7th
  })

  it('transposes correctly for A root', () => {
    expect(noteName(9, 0)).toBe('A')   // root
    expect(noteName(9, 3)).toBe('C')   // minor 3rd above A
    expect(noteName(9, 7)).toBe('E')   // perfect 5th above A
  })

  it('wraps around correctly past B', () => {
    expect(noteName(11, 2)).toBe('C#') // B(11) + 2 = 13 → normalise = 1 = C#
    expect(noteName(10, 4)).toBe('D')  // A#(10) + 4 = 14 → normalise = 2 = D
  })
})

// ─── buildNoteSet ─────────────────────────────────────────────────────────────
describe('buildNoteSet', () => {
  it('builds the correct set for C major scale', () => {
    // C major intervals: [0,2,4,5,7,9,11]
    // C  D  E  F  G  A  B
    // 0  2  4  5  7  9  11
    const set = buildNoteSet(0, [0, 2, 4, 5, 7, 9, 11])
    expect(set.has(0)).toBe(true)   // C
    expect(set.has(2)).toBe(true)   // D
    expect(set.has(4)).toBe(true)   // E
    expect(set.has(1)).toBe(false)  // C# — not in C major
    expect(set.has(3)).toBe(false)  // D# — not in C major
    expect(set.size).toBe(7)
  })

  it('builds correct set for A minor pentatonic', () => {
    // A minor pentatonic: root(9) + [0,3,5,7,10]
    // A  C  D  E  G
    // 9  0  2  4  7
    const set = buildNoteSet(9, [0, 3, 5, 7, 10])
    expect(set.has(9)).toBe(true)  // A
    expect(set.has(0)).toBe(true)  // C
    expect(set.has(2)).toBe(true)  // D
    expect(set.has(4)).toBe(true)  // E
    expect(set.has(7)).toBe(true)  // G
    expect(set.size).toBe(5)
  })
})

// ─── buildIntervalMap ─────────────────────────────────────────────────────────
describe('buildIntervalMap', () => {
  it('maps note indices to interval info for C major triad', () => {
    // C major triad: [0,4,7] → C, E, G
    const map = buildIntervalMap(0, [0, 4, 7], ['R', '3', '5'])
    expect(map[0]).toEqual({ interval: 0, degree: 'R' })  // C = root
    expect(map[4]).toEqual({ interval: 4, degree: '3' })  // E = major 3rd
    expect(map[7]).toEqual({ interval: 7, degree: '5' })  // G = perfect 5th
  })

  it('root takes priority when intervals map to same note', () => {
    // Edge case: if two intervals produce the same note index,
    // the first one (root) should win
    const map = buildIntervalMap(0, [0, 12], ['R', 'octave'])
    expect(map[0].degree).toBe('R')
  })
})