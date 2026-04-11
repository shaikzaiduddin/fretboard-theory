import { describe, it, expect, beforeEach } from 'vitest'
import { useTheoryStore } from '../stores/useTheoryStore'

// ─── RESET BETWEEN TESTS ─────────────────────────────────────────────────────
// This is critical for store tests.
// Zustand stores are singletons — the same store instance is shared
// across all tests in a file. If test A changes root to 5,
// test B starts with root = 5 unless you reset between tests.
// beforeEach runs before every single it() block.
// We reset by calling setState directly with initial values.

beforeEach(() => {
  useTheoryStore.setState({
    root:        0,
    category:    'scales',
    patternIdx:  0,
    labelMode:   'note',
    stringCount: 6,
    tuning:      [4, 9, 2, 7, 11, 4],
    tuningLabel: 'Standard',
    triadMode:   'single',
    stringSet:   'all',
  })
})

describe('initial state', () => {
  it('starts with C as root', () => {
    expect(useTheoryStore.getState().root).toBe(0)
  })

  it('starts on scales category', () => {
    expect(useTheoryStore.getState().category).toBe('scales')
  })

  it('starts with standard 6-string tuning', () => {
    expect(useTheoryStore.getState().tuning).toEqual([4, 9, 2, 7, 11, 4])
    expect(useTheoryStore.getState().stringCount).toBe(6)
  })
})

describe('setRoot', () => {
  it('updates the root note', () => {
    useTheoryStore.getState().setRoot(9) // A
    expect(useTheoryStore.getState().root).toBe(9)
  })

  it('accepts all valid root values 0-11', () => {
    for (let i = 0; i <= 11; i++) {
      useTheoryStore.getState().setRoot(i)
      expect(useTheoryStore.getState().root).toBe(i)
    }
  })
})

describe('setCategory', () => {
  it('updates the category', () => {
    useTheoryStore.getState().setCategory('modes')
    expect(useTheoryStore.getState().category).toBe('modes')
  })

  it('resets patternIdx to 0 when category changes', () => {
    // Set a non-zero pattern index first
    useTheoryStore.getState().setPatternIdx(3)
    expect(useTheoryStore.getState().patternIdx).toBe(3)

    // Changing category should reset it
    useTheoryStore.getState().setCategory('triads')
    expect(useTheoryStore.getState().patternIdx).toBe(0)
  })
})

describe('setStringCount', () => {
  it('updates string count', () => {
    useTheoryStore.getState().setStringCount(7)
    expect(useTheoryStore.getState().stringCount).toBe(7)
  })

  it('loads correct tuning length for new string count', () => {
    useTheoryStore.getState().setStringCount(7)
    expect(useTheoryStore.getState().tuning.length).toBe(7)

    useTheoryStore.getState().setStringCount(8)
    expect(useTheoryStore.getState().tuning.length).toBe(8)
  })

  it('tuning length always matches string count', () => {
    // This is the key invariant — these two must always be in sync
    const counts: Array<6 | 7 | 8> = [6, 7, 8]
    counts.forEach(count => {
      useTheoryStore.getState().setStringCount(count)
      const state = useTheoryStore.getState()
      expect(state.tuning.length).toBe(state.stringCount)
    })
  })
})

describe('setStringByIdx', () => {
  it('updates a single string without affecting others', () => {
    const before = [...useTheoryStore.getState().tuning]

    // Change string index 0 (lowest string) to D (semitone 2)
    useTheoryStore.getState().setStringByIdx(0, 2)
    const after = useTheoryStore.getState().tuning

    expect(after[0]).toBe(2)           // changed
    expect(after[1]).toBe(before[1])   // unchanged
    expect(after[5]).toBe(before[5])   // unchanged
  })
})

describe('applyPreset', () => {
  it('changes tuning when preset is applied', () => {
    useTheoryStore.getState().applyPreset('Drop D', 6)
    const tuning = useTheoryStore.getState().tuning
    // Drop D lowest string = D = semitone 2
    expect(tuning[0]).toBe(2)
    expect(useTheoryStore.getState().tuningLabel).toBe('Drop D')
  })

  it('does nothing if preset label does not exist', () => {
    const before = useTheoryStore.getState().tuning
    useTheoryStore.getState().applyPreset('NonExistentPreset', 6)
    expect(useTheoryStore.getState().tuning).toEqual(before)
  })
})

describe('getCurrentPattern', () => {
  it('returns the first scale pattern by default', () => {
    const pattern = useTheoryStore.getState().getCurrentPattern()
    expect(pattern.name).toBe('Major')
  })

  it('returns correct pattern after index change', () => {
    useTheoryStore.getState().setPatternIdx(1)
    const pattern = useTheoryStore.getState().getCurrentPattern()
    expect(pattern.name).toBe('Natural Minor')
  })

  it('returns correct pattern for modes category', () => {
  useTheoryStore.getState().setCategory('modes')
  useTheoryStore.getState().setPatternIdx(1)
  const pattern = useTheoryStore.getState().getCurrentPattern()
  expect(pattern.name).toBe('Dorian (Mode II)')
})
})