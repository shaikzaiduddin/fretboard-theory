import { motion } from 'framer-motion'
import { useTheoryStore } from '../../stores/useTheoryStore'
import { NOTES } from '../../data/theory'

export function KeyRow() {
  const root    = useTheoryStore(s => s.root)
  const setRoot = useTheoryStore(s => s.setRoot)

  return (
    <div className="w-full bg-[#0c0b0a] border-b flex items-center px-4 gap-1.5 h-[60px] shrink-0">
      {NOTES.map((note, idx) => {
        const isActive = idx === root
        const isSharp  = note.includes('#')

        return (
          <motion.button
            key={note}
            onClick={() => setRoot(idx)}
            whileTap={{ scale: 0.93 }}
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            className={[
              'flex-1 h-11 font-mono text-sm font-bold rounded-md',
              'border-2 focus:outline-none transition-colors duration-150',
              isActive
                ? 'bg-gradient-to-b from-[#f0c840] to-[#d4a420] text-[#0f0e0c] border-[#f0c840] shadow-[0_0_20px_rgba(232,185,49,0.4),inset_0_1px_0_rgba(255,255,255,0.3)]'
                : isSharp
                  ? 'bg-[#18161a] text-[#b0a090] border-[rgba(255,255,255,0.08)] hover:bg-[#201e24] hover:text-[#f0ece4] hover:border-[rgba(255,255,255,0.18)]'
                  : 'bg-[#1a1816] text-[#c0b0a0] border-[rgba(255,255,255,0.08)] hover:bg-[#242018] hover:text-[#f0ece4] hover:border-[rgba(255,255,255,0.18)]',
            ].join(' ')}
          >
            {note}
          </motion.button>
        )
      })}
    </div>
  )
}