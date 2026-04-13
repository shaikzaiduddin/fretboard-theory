// ChordGrid shows the 7 diatonic chords for the current key.
// Clicking a chord card jumps to that chord's triad on the fretboard.
//
// This is only shown when category is 'scales' or 'modes' —
// it's hidden when already in triads/seventh view since
// that would be redundant.

import { motion, AnimatePresence } from 'framer-motion'
import { useTheoryStore } from '../stores/useTheoryStore'
import { NOTES } from '../data/theory'
import { MAJOR_SCALE_INTERVALS, DIATONIC_QUALITIES } from '../data/scales'

const TYPE_LABELS = {
  maj: 'Major',
  min: 'Minor',
  dom: 'Major',
  dim: 'Dim',
} as const

const containerVariants = {
  hidden:  {},
  visible: {
    transition: { staggerChildren: 0.05, delayChildren: 0.05 },
  },
  exit: {
    transition: { staggerChildren: 0.03, staggerDirection: -1 },
  },
}

const cardVariants = {
  hidden:  { opacity: 0, y: 12, scale: 0.92 },
  visible: { opacity: 1, y: 0,  scale: 1 },
  exit:    { opacity: 0, y: -8, scale: 0.95 },
}

export function ChordGrid() {
  const root          = useTheoryStore(s => s.root)
  const category      = useTheoryStore(s => s.category)
  const setRoot       = useTheoryStore(s => s.setRoot)
  const setCategory   = useTheoryStore(s => s.setCategory)
  const setPatternIdx = useTheoryStore(s => s.setPatternIdx)

  if (category !== 'scales' && category !== 'modes') return null

  function handleChordClick(degreeIdx: number) {
    const quality   = DIATONIC_QUALITIES[degreeIdx]
    const chordRoot = (root + MAJOR_SCALE_INTERVALS[degreeIdx]) % 12
    const triadIdx  = quality.type === 'dim' ? 2
                    : quality.type === 'min' ? 1
                    : 0
    setRoot(chordRoot)
    setCategory('triads')
    setPatternIdx(triadIdx)
  }

  return (
    <div className="bg-stone-900 border border-stone-700 rounded-xl p-4">
      <span className="block font-mono text-[10px] tracking-widest uppercase text-stone-400 mb-3">
        Diatonic Chords — Key of {NOTES[root]}
      </span>

      {/* AnimatePresence + key triggers exit/enter when root changes.
          The key includes root so React treats each key change as
          a completely new grid, triggering the animation cycle. */}
      <AnimatePresence mode="wait">
        <motion.div
          key={root}
          className="flex gap-2 flex-wrap"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {DIATONIC_QUALITIES.map((q, i) => {
            const chordRoot = NOTES[(root + MAJOR_SCALE_INTERVALS[i]) % 12]

            return (
              <motion.button
                key={q.degree}
                variants={cardVariants}
                transition={{ duration: 0.18, ease: 'easeOut' }}
                whileHover={{ y: -2, transition: { duration: 0.12 } }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleChordClick(i)}
                className="bg-stone-800 border border-stone-700 rounded-lg px-3 py-2 min-w-16 text-center hover:border-stone-500 hover:bg-stone-700 transition-colors duration-150 group"
              >
                <div className="font-serif text-base text-amber-300 group-hover:text-amber-200 transition-colors">
                  {chordRoot}
                </div>
                <div className="font-mono text-xs text-stone-500 mt-0.5">
                  {TYPE_LABELS[q.type]}
                </div>
                <div className="font-mono text-xs text-amber-700 mt-0.5">
                  {q.degree}
                </div>
              </motion.button>
            )
          })}
        </motion.div>
      </AnimatePresence>

    </div>
  )
}