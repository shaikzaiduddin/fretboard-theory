import { motion, AnimatePresence } from 'framer-motion'
import { useTheoryStore }          from '../stores/useTheoryStore'
import { NOTES }                   from '../data/theory'
import { getIntervalColor }        from '../lib/colors'
import { DIATONIC_QUALITIES, MAJOR_SCALE_INTERVALS } from '../data/scales'

const CHORD_QUALITY_COLORS: Record<string, string> = {
  maj: '#e8b931',
  min: '#4ade80',
  dim: '#f87171',
  aug: '#a78bfa',
}

const containerVariants = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.04 } },
  exit:    { transition: { staggerChildren: 0.03, staggerDirection: -1 } },
}

const itemVariants = {
  hidden:  { opacity: 0, scale: 0.7, y: -4 },
  visible: { opacity: 1, scale: 1,   y:  0 },
  exit:    { opacity: 0, y: -8, scale: 0.95 },
}

export function InfoBar() {
  const root      = useTheoryStore(s => s.root)
  const pattern   = useTheoryStore(s => s.getCurrentPattern())
  const category  = useTheoryStore(s => s.category)
  const triadMode = useTheoryStore(s => s.triadMode)

  const rootName = NOTES[root]

  // Diatonic mode: replace scale info with chord legend.
  // Shows all 7 diatonic chords coloured by quality so the
  // player can immediately match fretboard dot colours to chord names.
  if (category === 'triads' && triadMode === 'diatonic') {
    return (
      <div
        className="w-full bg-[#0c0b0a] border-b flex items-center px-6 gap-4"
        style={{ borderColor: 'var(--border)', height: 44 }}
      >
        <h2 className="font-serif text-lg text-[#f5f1e8] tracking-tight font-medium shrink-0">
          Key of {rootName}
        </h2>

        <div className="flex items-center gap-1.5">
          {DIATONIC_QUALITIES.map((q, i) => {
            const chordRootIdx  = (root + MAJOR_SCALE_INTERVALS[i]) % 12
            const chordRootName = NOTES[chordRootIdx]
            const color         = CHORD_QUALITY_COLORS[q.type] ?? '#9ca3af'
            const qualityLabel  = q.type === 'maj' ? 'maj'
                                : q.type === 'min' ? 'min'
                                : q.type === 'dim' ? 'dim'
                                : q.type

            return (
              <div
                key={i}
                className="flex flex-col items-center px-2 py-0.5 rounded
                           cursor-default transition-transform hover:scale-105"
                style={{
                  backgroundColor: `${color}12`,
                  border:          `1px solid ${color}35`,
                }}
              >
                <div className="flex items-center gap-1">
                  <span
                    className="font-mono text-[11px] font-bold"
                    style={{ color }}
                  >
                    {chordRootName}
                  </span>
                  <span
                    className="font-mono text-[9px] opacity-55"
                    style={{ color }}
                  >
                    {q.degree}
                  </span>
                </div>
                <span
                  className="font-mono opacity-40 leading-none"
                  style={{ fontSize: 8, color }}
                >
                  {qualityLabel}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  // Normal mode: scale name + coloured note pills
  return (
    <div
      className="w-full bg-[#0c0b0a] border-b flex items-center px-6 gap-5"
      style={{ borderColor: 'var(--border)', height: 44 }}
    >
      <h2 className="font-serif text-xl text-[#f5f1e8] tracking-tight font-medium shrink-0">
        {rootName} {pattern.name}
      </h2>

      <AnimatePresence mode="wait">
        <motion.div
          key={`${root}-${pattern.name}`}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="flex items-center gap-1 flex-wrap"
        >
          {pattern.intervals.map((interval, i) => {
            const noteName = NOTES[((root + interval) % 12 + 12) % 12]
            const degree   = pattern.degrees[i]
            const color    = getIntervalColor(degree)

            return (
              <motion.div
                key={`${interval}-${i}`}
                variants={itemVariants}
                className="flex items-center gap-1 px-2 py-1 rounded
                           cursor-default hover:scale-105 transition-transform"
                style={{
                  backgroundColor: `${color}12`,
                  border:          `1px solid ${color}25`,
                }}
              >
                <span
                  className="font-mono text-xs font-bold tracking-tight"
                  style={{ color }}
                >
                  {noteName}
                </span>
                <span
                  className="font-mono text-[9px] font-medium opacity-60"
                  style={{ color }}
                >
                  {degree}
                </span>
              </motion.div>
            )
          })}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}