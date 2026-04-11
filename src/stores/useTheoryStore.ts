import { create } from 'zustand'
import type {
  Category,
  LabelMode,
  StringCount,
} from '../types'
import { TUNING_PRESETS, DEFAULT_TUNING_LABEL, DEFAULT_STRING_COUNT } from '../data/tunings'
import { PATTERNS_BY_CATEGORY } from '../data/scales'

// ─── STATE SHAPE ─────────────────────────────────────────────────────────────
// This interface defines exactly what lives in the theory store.
// Every property has a type. Every action has a signature.
//
// Why separate state from actions in the interface?
// Convention and readability. When you read this interface,
// you immediately see "these are the data fields" and
// "these are the things you can do". It reads like a contract.

interface TheoryState {

  // ── Data ──────────────────────────────────────────────────────────────────
  root:        number       // 0-11, index into NOTES array
  category:    Category     // which tab is active in the sidebar
  patternIdx:  number       // which pattern is selected within the category
  labelMode:   LabelMode    // what text shows inside fretboard dots
  stringCount: StringCount  // 6, 7, or 8
  tuning:      number[]     // current open string pitches as semitone indices
  tuningLabel: string       // name of the active preset e.g. "Standard"
  triadMode:   'single' | 'diatonic'  // single triad or key triads view
  stringSet:   string       // which string subset to highlight e.g. "0-2"

  // ── Actions ───────────────────────────────────────────────────────────────
  // Actions are functions that update state.
  // Named with "set" prefix by convention — makes it obvious
  // at the call site that you're changing something:
  //   useTheoryStore(s => s.setRoot(5))  ← clearly an action
  //   useTheoryStore(s => s.root)        ← clearly reading data

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
  applyPreset:    (label: string, count: StringCount) => void

  // ── Derived helpers ───────────────────────────────────────────────────────
  // These aren't actions — they compute values from current state.
  // Kept in the store so any component can call them without
  // reimplementing the same logic.
  getCurrentPattern: () => typeof PATTERNS_BY_CATEGORY[Category][number]
}

// ─── STORE ───────────────────────────────────────────────────────────────────
// create() from Zustand takes a function that receives `set` and returns
// your state object. `set` is how you update state — you pass it either
// a partial state object or a function that receives current state
// and returns a partial update.
//
// Why not useState? Because useState is local to one component.
// When the user changes the root key in the Sidebar, the Fretboard
// needs to know about it too. Zustand's store is global —
// any component anywhere in the tree can subscribe to it.
// When state changes, only the components that subscribed to that
// specific piece of state re-render. Efficient and simple.

const defaultPreset = TUNING_PRESETS.find(p => p.label === DEFAULT_TUNING_LABEL)!
const defaultTuning = defaultPreset.tunings[DEFAULT_STRING_COUNT]

export const useTheoryStore = create<TheoryState>((set, get) => ({

  // ── Initial state ─────────────────────────────────────────────────────────
  // The app opens showing C Major on a standard 6-string.
  // These defaults should feel immediately useful to a beginner.
  root:        0,
  category:    'scales',
  patternIdx:  0,
  labelMode:   'note',
  stringCount: DEFAULT_STRING_COUNT,
  tuning:      defaultTuning,
  tuningLabel: DEFAULT_TUNING_LABEL,
  triadMode:   'single',
  stringSet:   'all',

  // ── Actions ───────────────────────────────────────────────────────────────

  setRoot: (root) => set({ root }),

  setCategory: (category) => set({
    category,
    patternIdx: 0,
    // Reset triad mode when leaving triads category
    triadMode: category === 'triads' ? get().triadMode : 'single',
  }),

  setPatternIdx: (patternIdx) => set({ patternIdx }),

  setLabelMode: (labelMode) => set({ labelMode }),

  setStringCount: (stringCount) => {
    // When string count changes, load the correct tuning for that
    // count from the currently active preset.
    // This is why we store tuningLabel — so we know which preset
    // to pull the new tuning from.
    const preset = TUNING_PRESETS.find(p => p.label === get().tuningLabel)
    const tuning = preset
      ? preset.tunings[stringCount]
      : defaultPreset.tunings[stringCount]
    set({ stringCount, tuning })
  },

  setTuning: (tuning) => set({ tuning }),

  setTuningLabel: (tuningLabel) => set({ tuningLabel }),

  // Update a single string's tuning without changing the others.
  // This is what the per-string dropdown calls when the user
  // changes one string manually.
  setStringByIdx: (stringIdx, semitone) => {
    const tuning = [...get().tuning]
    tuning[stringIdx] = semitone
    set({ tuning })
  },

  setTriadMode: (triadMode) => set({
    triadMode,
    // Reset string set when switching modes
    stringSet: 'all',
  }),

  setStringSet: (stringSet) => set({ stringSet }),

  // Apply a full tuning preset — updates both the label and
  // the actual tuning array for the current string count.
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
    // Guard against out of bounds — return first pattern as fallback
    return patterns[patternIdx] ?? patterns[0]
  },

}))