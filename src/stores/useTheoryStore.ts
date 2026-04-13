import { create } from 'zustand'
import type {
  Category,
  LabelMode,
  StringCount,
} from '../types'
import { TUNING_PRESETS, DEFAULT_TUNING_LABEL, DEFAULT_STRING_COUNT } from '../data/tunings'
import { PATTERNS_BY_CATEGORY } from '../data/scales'

// ─── STATE SHAPE ─────────────────────────────────────────────────────────────
interface TheoryState {

  // ── Data ──────────────────────────────────────────────────────────────────
  root:        number
  category:    Category
  patternIdx:  number
  labelMode:   LabelMode
  stringCount: StringCount
  tuning:      number[]
  tuningLabel: string
  triadMode:   'single' | 'diatonic'
  stringSet:   string
  numFrets:    number   // how many frets to display — default 12, max 24

  // ── Actions ───────────────────────────────────────────────────────────────
  setRoot:        (root: number) => void
  setCategory:    (category: Category) => void
  setPatternIdx:  (idx: number) => void
  setLabelMode:   (mode: LabelMode) => void
  setStringCount: (count: StringCount) => void
  setTuning:      (tuning: number[]) => void
  setTuningLabel: (label: string) => void
  setStringByIdx: (stringIdx: number, semitone: number) => void
  setTriadMode:   (mode: 'single' | 'diatonic') => void
  setStringSet:   (set: string) => void
  setNumFrets:    (n: number) => void
  applyPreset:    (label: string, count: StringCount) => void

  // ── Derived helpers ───────────────────────────────────────────────────────
  getCurrentPattern: () => typeof PATTERNS_BY_CATEGORY[Category][number]
}

// ─── STORE ───────────────────────────────────────────────────────────────────
const defaultPreset = TUNING_PRESETS.find(p => p.label === DEFAULT_TUNING_LABEL)!
const defaultTuning = defaultPreset.tunings[DEFAULT_STRING_COUNT]

export const useTheoryStore = create<TheoryState>((set, get) => ({

  // ── Initial state ─────────────────────────────────────────────────────────
  root:        0,
  category:    'scales',
  patternIdx:  0,
  labelMode:   'note',
  stringCount: DEFAULT_STRING_COUNT,
  tuning:      defaultTuning,
  tuningLabel: DEFAULT_TUNING_LABEL,
  triadMode:   'single',
  stringSet:   'all',
  numFrets:    12,

  // ── Actions ───────────────────────────────────────────────────────────────
  setRoot: (root) => set({ root }),

  setCategory: (category) => set({
    category,
    patternIdx: 0,
    triadMode: category === 'triads' ? get().triadMode : 'single',
  }),

  setPatternIdx: (patternIdx) => set({ patternIdx }),

  setLabelMode: (labelMode) => set({ labelMode }),

  setStringCount: (stringCount) => {
    const preset = TUNING_PRESETS.find(p => p.label === get().tuningLabel)
    const tuning = preset
      ? preset.tunings[stringCount]
      : defaultPreset.tunings[stringCount]
    set({ stringCount, tuning })
  },

  setTuning: (tuning) => set({ tuning }),

  setTuningLabel: (tuningLabel) => set({ tuningLabel }),

  setStringByIdx: (stringIdx, semitone) => {
    const tuning = [...get().tuning]
    tuning[stringIdx] = semitone
    set({ tuning })
  },

  setTriadMode: (triadMode) => set({
    triadMode,
    stringSet: 'all',
  }),

  setStringSet: (stringSet) => set({ stringSet }),

  setNumFrets: (numFrets) => set({ numFrets }),

  applyPreset: (label, count) => {
    const preset = TUNING_PRESETS.find(p => p.label === label)
    if (!preset) return
    set({
      tuningLabel: label,
      tuning: preset.tunings[count],
    })
  },

  // ── Derived helpers ───────────────────────────────────────────────────────
  getCurrentPattern: () => {
    const { category, patternIdx } = get()
    const patterns = PATTERNS_BY_CATEGORY[category]
    return patterns[patternIdx] ?? patterns[0]
  },

}))