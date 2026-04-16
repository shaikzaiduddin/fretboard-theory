// ChordGrid shows the 7 diatonic chords for the current key.
//
// Colour logic: chord root name is coloured by quality.
// Gold = major, Green = minor, Red = diminished, Purple = augmented.
// This mirrors the interval colour system — learners build the association
// between colour and musical function across the whole app.
import { motion, AnimatePresence } from 'framer-motion'
import { useTheoryStore } from '../stores/useTheoryStore'
import { NOTES }          from '../data/theory'
import {
  DIATONIC_QUALITIES,
  MAJOR_SCALE_INTERVALS,
} from '../data/scales'

// Chord quality → display colour mapping
// Kept local to this component since nothing else needs it
const CHORD_COLORS: Record<string, string> = {
  maj: '#e8b931',  // gold   — major chords
  min: '#4ade80',  // green  — minor chords
  dim: '#f87171',  // red    — diminished chords
  aug: '#a78bfa',  // purple — augmented chords
}

const containerVariants = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.05 } },
  exit:    { transition: { staggerChildren: 0.03, staggerDirection: -1 } },
}

const cardVariants = {
  hidden:  { opacity: 0, y: 8, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1 },
  exit:    { opacity: 0, y: -4, scale: 0.97 },
}

export function ChordGrid() {
  const root     = useTheoryStore(s => s.root)
  const category = useTheoryStore(s => s.category)

  if (category !== 'scales' && category !== 'modes') return null

  return (
    <div className="w-full px-4 py-3 bg-[#0a0908] border-t">
      <div className="flex items-center gap-5">

        {/* Label */}
        <span className="font-mono text-[9px] uppercase tracking-[0.15em]
                         text-[#5a4a38] whitespace-nowrap">
          Diatonic Chords
        </span>

        {/* Cards */}
        <AnimatePresence mode="wait">
          <motion.div
            key={root}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="flex items-center gap-2.5"
          >
            {DIATONIC_QUALITIES.map((quality, i) => {
              // Calculate the root note of each diatonic chord
              const chordRootIdx  = (root + MAJOR_SCALE_INTERVALS[i]) % 12
              const chordRootName = NOTES[chordRootIdx]
              const chordColor    = CHORD_COLORS[quality.type] ?? '#9ca3af'

              return (
                <motion.div
                  key={i}
                  variants={cardVariants}
                  whileHover={{ y: -2, transition: { duration: 0.15 } }}
                  className="relative flex flex-col items-center py-2.5 px-4
                             rounded-lg min-w-[72px] cursor-default
                             bg-gradient-to-b from-[#161412] to-[#121010]
                             border border-[rgba(255,255,255,0.07)]
                             hover:from-[#1c1816] hover:to-[#161412]
                             hover:border-[rgba(255,255,255,0.14)]
                             hover:shadow-[0_6px_16px_rgba(0,0,0,0.35)]
                             transition-all duration-150"
                >
                  {/* Chord root name — coloured by quality */}
                  <span
                    className="font-serif text-base font-medium"
                    style={{ color: chordColor }}
                  >
                    {chordRootName}
                  </span>

                  {/* Chord type label */}
                  <span className="text-[10px] text-[#6a5a48] mt-0.5">
                    {quality.type === 'maj' ? 'major'
                      : quality.type === 'min' ? 'minor'
                      : quality.type === 'dim' ? 'dim'
                      : quality.type}
                  </span>

                  {/* Roman numeral — monospace, subtle */}
                  <span
                    className="font-mono text-[10px] opacity-50 mt-1"
                    style={{ color: chordColor }}
                  >
                    {quality.degree}
                  </span>
                </motion.div>
              )
            })}
          </motion.div>
        </AnimatePresence>

      </div>
    </div>
  )
}