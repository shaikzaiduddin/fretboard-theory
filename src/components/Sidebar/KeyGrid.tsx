// KeyGrid renders 12 root note buttons.
//
// Animation: whileTap + whileHover on each button.
// Why spring physics here? Spring transitions feel physical —
// they slightly overshoot and bounce back, like pressing a
// real physical button. Duration-based easing feels mechanical
// by comparison. stiffness controls snappiness, damping controls
// how quickly the bounce settles.
//
// This is a subtle but important UX detail — interactions that
// feel physical are more satisfying to use repeatedly.

import { motion } from 'framer-motion'
import { useTheoryStore } from '../../stores/useTheoryStore'
import { NOTES } from '../../data/theory'

export function KeyGrid() {
  const root    = useTheoryStore(s => s.root)
  const setRoot = useTheoryStore(s => s.setRoot)

  return (
    <div>
      <span className="block font-mono text-[10px] tracking-widest uppercase text-stone-400 mb-2">
        Root Key
      </span>
      <div className="grid grid-cols-6 gap-1">
        {NOTES.map((note, i) => (
          <motion.button
            key={note}
            onClick={() => setRoot(i)}
            whileTap={{ scale: 0.88 }}
            whileHover={{ scale: 1.08 }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            className={`
              rounded px-1 py-1.5 font-mono text-xs
              ${i === root
                ? 'bg-amber-500 text-stone-900 font-medium'
                : 'bg-stone-800 text-stone-400 border border-stone-700 hover:border-stone-500 hover:text-stone-200'
              }
            `}
          >
            {note}
          </motion.button>
        ))}
      </div>
    </div>
  )
}