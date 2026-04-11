import { describe, it, expect } from 'vitest'
import { SOLO_GUIDES } from '../data/soloGuides'
import { SCALE_PATTERNS } from '../data/scales'

describe('SOLO_GUIDES', () => {
  it('has a guide for every scale and mode', () => {
    // Every pattern in SCALE_PATTERNS must have a matching
    // entry in SOLO_GUIDES. If you add a new scale but forget
    // to add its guide, this test catches it immediately.
    SCALE_PATTERNS.forEach(pattern => {
      expect(SOLO_GUIDES[pattern.name]).toBeDefined()
    })
  })

  it('every guide has all required fields', () => {
    Object.entries(SOLO_GUIDES).forEach(([, guide]) => {
      expect(guide.s1).toBeDefined()
      expect(guide.s2).toBeDefined()
      expect(guide.s3).toBeDefined()
      expect(guide.av).toBeDefined()
      expect(guide.theory.length).toBeGreaterThan(0)
      expect(guide.tip.length).toBeGreaterThan(0)
    })
  })

  it('every guide has at least one anchor note', () => {
    // s1 must always contain at least the root (0).
    // A scale with no anchor notes makes no musical sense.
    Object.entries(SOLO_GUIDES).forEach(([, guide]) => {
      expect(guide.s1.length).toBeGreaterThan(0)
      expect(guide.s1).toContain(0) // root is always an anchor
    })
  })

  it('all interval values in guides are within 0-11', () => {
    Object.entries(SOLO_GUIDES).forEach(([, guide]) => {
      const allIntervals = [
        ...guide.s1,
        ...guide.s2,
        ...guide.s3,
        ...guide.av,
      ]
      allIntervals.forEach(iv => {
        expect(iv).toBeGreaterThanOrEqual(0)
        expect(iv).toBeLessThanOrEqual(11)
      })
    })
  })

  it('no interval appears in more than one strength tier', () => {
    // An interval cannot be both an anchor AND an avoid note.
    // Overlap between tiers would be a data error.
    Object.entries(SOLO_GUIDES).forEach(([, guide]) => {
      const allTiers = [guide.s1, guide.s2, guide.s3, guide.av]
      const allIntervals = allTiers.flat()
      const uniqueIntervals = new Set(allIntervals)
      expect(allIntervals.length).toBe(uniqueIntervals.size)
    })
  })
})