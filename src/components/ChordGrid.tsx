// ChordGrid shows the 7 diatonic chords for the current key.
// Clicking a chord card jumps to that chord's triad on the fretboard.
//
// This is only shown when category is 'scales' or 'modes' —
// it's hidden when already in triads/seventh view since
// that would be redundant.

import { useTheoryStore } from '../stores/useTheoryStore'
import { NOTES } from '../data/theory'
import { MAJOR_SCALE_INTERVALS, DIATONIC_QUALITIES } from '../data/scales'

const TYPE_LABELS = {
  maj: 'Major',
  min: 'Minor',
  dom: 'Major',
  dim: 'Dim',
} as const

export function ChordGrid() {
  const root        = useTheoryStore(s => s.root)
  const category    = useTheoryStore(s => s.category)
  const setRoot     = useTheoryStore(s => s.setRoot)
  const setCategory = useTheoryStore(s => s.setCategory)
  const setPatternIdx = useTheoryStore(s => s.setPatternIdx)

  // Only show for scales and modes
  if (category !== 'scales' && category !== 'modes') return null

  function handleChordClick(degreeIdx: number) {
    const quality    = DIATONIC_QUALITIES[degreeIdx]
    const chordRoot  = (root + MAJOR_SCALE_INTERVALS[degreeIdx]) % 12

    // Map chord type to triad pattern index
    const triadIdx = quality.type === 'dim' ? 2
                   : quality.type === 'min' ? 1
                   : 0

    setRoot(chordRoot)
    setCategory('triads')
    setPatternIdx(triadIdx)
  }

  return (
    <div className="bg-stone-900 border border-stone-700 rounded-xl p-4">
      <span className="block font-mono text-xs tracking-widest uppercase text-stone-500 mb-3">
        Diatonic Chords — Key of {NOTES[root]}
      </span>

      <div className="flex gap-2 flex-wrap">
        {DIATONIC_QUALITIES.map((q, i) => {
          const chordRoot = NOTES[(root + MAJOR_SCALE_INTERVALS[i]) % 12]

          return (
            <button
              key={q.degree}
              onClick={() => handleChordClick(i)}
              className="bg-stone-800 border border-stone-700 rounded-lg px-3 py-2 min-w-16 text-center hover:border-stone-500 hover:bg-stone-700 transition-all duration-150 group"
            >
              <div className="font-serif text-base text-amber-300 group-hover:text-amber-200">
                {chordRoot}
              </div>
              <div className="font-mono text-xs text-stone-500 mt-0.5">
                {TYPE_LABELS[q.type]}
              </div>
              <div className="font-mono text-xs text-amber-700 mt-0.5">
                {q.degree}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}