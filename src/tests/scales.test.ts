import { describe, it, expect } from 'vitest'
import {
  SCALE_PATTERNS,
  SCALES_ONLY,
  MODES_ONLY,
  TRIAD_PATTERNS,
  SEVENTH_PATTERNS,
  PATTERNS_BY_CATEGORY,
} from '../data/scales'

describe('SCALE_PATTERNS', () => {
  it('every pattern starts with interval 0 (root)', () => {
    SCALE_PATTERNS.forEach(p => {
      expect(p.intervals[0]).toBe(0)
    })
  })

  it('every pattern has matching intervals and degrees length', () => {
    // If intervals has 7 entries, degrees must also have 7.
    // A mismatch means a typo when writing the data.
    SCALE_PATTERNS.forEach(p => {
      expect(p.intervals.length).toBe(p.degrees.length)
    })
  })

  it('all intervals are within 0-11', () => {
    SCALE_PATTERNS.forEach(p => {
      p.intervals.forEach(iv => {
        expect(iv).toBeGreaterThanOrEqual(0)
        expect(iv).toBeLessThanOrEqual(11)
      })
    })
  })

  it('contains exactly 7 modes', () => {
    expect(MODES_ONLY.length).toBe(7)
  })

  it('SCALES_ONLY contains no modes', () => {
    SCALES_ONLY.forEach(p => {
      expect(p.mode).toBeFalsy()
    })
  })
})

describe('TRIAD_PATTERNS', () => {
  it('every triad has exactly 3 intervals', () => {
    TRIAD_PATTERNS.forEach(p => {
      expect(p.intervals.length).toBe(3)
    })
  })
})

describe('SEVENTH_PATTERNS', () => {
  it('every seventh chord has exactly 4 intervals', () => {
    SEVENTH_PATTERNS.forEach(p => {
      expect(p.intervals.length).toBe(4)
    })
  })
})

describe('PATTERNS_BY_CATEGORY', () => {
  it('has all four categories', () => {
    expect(PATTERNS_BY_CATEGORY.scales).toBeDefined()
    expect(PATTERNS_BY_CATEGORY.triads).toBeDefined()
    expect(PATTERNS_BY_CATEGORY.seventh).toBeDefined()
    expect(PATTERNS_BY_CATEGORY.modes).toBeDefined()
  })

  it('modes category contains only mode patterns', () => {
    PATTERNS_BY_CATEGORY.modes.forEach(p => {
      expect(p.mode).toBe(true)
    })
  })
})