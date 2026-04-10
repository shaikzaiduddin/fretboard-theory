import { describe, it, expect } from 'vitest'
import {
  TUNING_PRESETS,
  TUNING_LABELS,
  DEFAULT_TUNING_LABEL,
  DEFAULT_STRING_COUNT,
} from '../data/tunings'

describe('TUNING_PRESETS', () => {
  it('every preset has tunings for 6, 7, and 8 strings', () => {
    TUNING_PRESETS.forEach(preset => {
      expect(preset.tunings[6]).toBeDefined()
      expect(preset.tunings[7]).toBeDefined()
      expect(preset.tunings[8]).toBeDefined()
    })
  })

  it('tuning arrays have correct length for each string count', () => {
    TUNING_PRESETS.forEach(preset => {
      expect(preset.tunings[6].length).toBe(6)
      expect(preset.tunings[7].length).toBe(7)
      expect(preset.tunings[8].length).toBe(8)
    })
  })

  it('all semitone values are within 0-11', () => {
    TUNING_PRESETS.forEach(preset => {
      [6, 7, 8].forEach(count => {
        preset.tunings[count as 6 | 7 | 8].forEach(semitone => {
          expect(semitone).toBeGreaterThanOrEqual(0)
          expect(semitone).toBeLessThanOrEqual(11)
        })
      })
    })
  })

  it('standard 6-string is E A D G B e', () => {
    // E=4, A=9, D=2, G=7, B=11, e=4
    const standard = TUNING_PRESETS.find(p => p.label === 'Standard')
    expect(standard?.tunings[6]).toEqual([4, 9, 2, 7, 11, 4])
  })

  it('drop D lowers the lowest string by 2 semitones vs standard', () => {
    const standard = TUNING_PRESETS.find(p => p.label === 'Standard')
    const dropD    = TUNING_PRESETS.find(p => p.label === 'Drop D')
    // Standard lowest = E(4), Drop D lowest = D(2), difference = 2
    const diff = standard!.tunings[6][0] - dropD!.tunings[6][0]
    expect(diff).toBe(2)
  })
})

describe('TUNING_LABELS', () => {
  it('label arrays match string count lengths', () => {
    Object.entries(TUNING_LABELS).forEach(([, counts]) => {
      expect(counts[6].length).toBe(6)
      expect(counts[7].length).toBe(7)
      expect(counts[8].length).toBe(8)
    })
  })
})

describe('defaults', () => {
  it('default tuning label exists in presets', () => {
    const found = TUNING_PRESETS.find(p => p.label === DEFAULT_TUNING_LABEL)
    expect(found).toBeDefined()
  })

  it('default string count is a valid option', () => {
    expect([6, 7, 8]).toContain(DEFAULT_STRING_COUNT)
  })
})