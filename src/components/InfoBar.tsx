import type { CSSProperties } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheoryStore } from '../stores/useTheoryStore'
import { NOTES, ROLE_COLORS } from '../data/theory'

function getPillStyle(interval: number): CSSProperties {
  const color = ROLE_COLORS[interval] ?? '#5a9ecc'
  return {
    backgroundColor: color + '22',
    borderColor: color,
    color: color,
  }
}

export function InfoBar() {
  const root    = useTheoryStore(s => s.root)
  const pattern = useTheoryStore(s => s.getCurrentPattern())

  const rootName  = NOTES[root]
  const scaleName = `${rootName} ${pattern.name}`

  // This key changes whenever root or pattern changes.
  // React uses it to know "this is a new set of pills, animate the old ones out."
  const pillsKey = `${root}-${pattern.name}`

  return (
    <div className="flex items-center gap-3 flex-wrap min-h-10">

      {/* Scale name — animates when it changes */}
      <AnimatePresence mode="wait">
        <motion.h2
          key={scaleName}
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 6 }}
          transition={{ duration: 0.18, ease: 'easeOut' }}
          className="font-serif text-lg text-amber-300 shrink-0"
        >
          {scaleName}
        </motion.h2>
      </AnimatePresence>

      {/* Note pills — staggered enter/exit */}
      <AnimatePresence mode="wait">
        <motion.div
          key={pillsKey}
          className="flex gap-1.5 flex-wrap"
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={{
            // Container variants propagate to children automatically.
            // When the container enters "visible", each child staggers in.
            // This is called "orchestration" — the parent controls
            // the timing of its children's animations.
            hidden:  {},
            visible: { transition: { staggerChildren: 0.04 } },
          }}
        >
          {pattern.intervals.map((interval, idx) => {
            const noteName = NOTES[((root + interval) % 12 + 12) % 12]
            const degree   = pattern.degrees[idx]

            return (
              <motion.div
                key={idx}
                variants={{
                  hidden:  { opacity: 0, scale: 0.7, y: -4 },
                  visible: { opacity: 1, scale: 1,   y:  0 },
                }}
                transition={{ duration: 0.16, ease: 'easeOut' }}
                style={getPillStyle(interval)}
                className="flex flex-col items-center px-2 py-0.5 rounded-full border font-mono leading-tight"
              >
                <span className="text-xs font-medium">{noteName}</span>
                <span className="text-[8px] opacity-70">{degree}</span>
              </motion.div>
            )
          })}
        </motion.div>
      </AnimatePresence>

    </div>
  )
}