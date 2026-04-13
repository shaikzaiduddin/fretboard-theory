// PatternList renders the category tabs and scrollable pattern list.
//
// Animation: layoutId on the active tab indicator.
// Why layoutId? This is one of Framer Motion's most powerful features.
// When an element with a layoutId unmounts and another element with the
// SAME layoutId mounts elsewhere, Framer Motion animates between their
// positions automatically. The indicator appears to SLIDE across the
// tab bar because Framer Motion is tracking one element moving,
// not two elements swapping. You get a polished interaction from
// a single prop.
//
// This pattern is used in Apple's iOS tab bars, Vercel's dashboard,
// and most modern design systems. It's called a "magic motion" or
// "shared layout animation."

import { motion } from 'framer-motion'
import { useTheoryStore } from '../../stores/useTheoryStore'
import { PATTERNS_BY_CATEGORY } from '../../data/scales'
import type { Category } from '../../types'

const CATEGORY_LABELS: Record<Category, string> = {
  scales:  'Scales',
  triads:  'Triads',
  seventh: '7ths',
  modes:   'Modes',
}

const SECTION_LABELS: Record<Category, string> = {
  scales:  'Scale Patterns',
  triads:  'Triads',
  seventh: '7th Chords',
  modes:   'Modes',
}

export function PatternList() {
  const category      = useTheoryStore(s => s.category)
  const patternIdx    = useTheoryStore(s => s.patternIdx)
  const setCategory   = useTheoryStore(s => s.setCategory)
  const setPatternIdx = useTheoryStore(s => s.setPatternIdx)

  const patterns   = PATTERNS_BY_CATEGORY[category]
  const categories = Object.keys(CATEGORY_LABELS) as Category[]

  return (
    <div className="flex flex-col gap-3">

      {/* Category tabs */}
      <div>
        <span className="block font-mono text-[10px] tracking-widest uppercase text-stone-400 mb-2">
          Category
        </span>

        {/* The relative + overflow-hidden here is important —
            the sliding indicator is absolutely positioned inside
            this container and must not overflow it */}
        <div className="flex gap-1 bg-stone-900 rounded-lg p-1 border border-stone-800 relative">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className="flex-1 py-1.5 text-xs rounded-md relative z-10 transition-colors duration-100"
              style={{
                color: cat === category ? '#f1f5f9' : '#6b7280',
              }}
            >
              {/* Sliding background indicator.
                  Only renders for the active tab.
                  layoutId ties all instances together —
                  when active tab changes, this element
                  appears to slide to the new position. */}
              {cat === category && (
                <motion.div
                  layoutId="categoryIndicator"
                  className="absolute inset-0 bg-stone-700 rounded-md border border-stone-600"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
              <span className="relative z-10">
                {CATEGORY_LABELS[cat]}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Pattern list */}
      <div>
        <span className="block font-mono text-[10px] tracking-widest uppercase text-stone-400 mb-2">
          {SECTION_LABELS[category]}
        </span>

        <div className="flex flex-col gap-1 max-h-52 overflow-y-auto pr-1">
          {patterns.map((pattern, i) => {
            const showDivider =
              category === 'scales' &&
              pattern.mode === true &&
              !patterns[i - 1]?.mode

            return (
              <div key={pattern.name}>

                {/* Mode section divider */}
                {showDivider && (
                  <div className="font-mono text-[10px] text-stone-600 py-1.5 px-2 tracking-widest">
                    ── Modes ──
                  </div>
                )}

                {/* Pattern button — motion for press feedback */}
                <motion.button
                  onClick={() => setPatternIdx(i)}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                  className={`
                    w-full text-left px-3 py-2 rounded-md text-sm
                    flex justify-between items-center gap-2
                    transition-colors duration-100
                    ${i === patternIdx
                      ? 'bg-stone-700 border border-amber-600 text-stone-100'
                      : 'bg-stone-800 border border-stone-700 text-stone-400 hover:border-stone-500 hover:text-stone-200'
                    }
                  `}
                >
                  <span>{pattern.name}</span>
                  <span className={`
                    font-mono text-xs whitespace-nowrap
                    ${i === patternIdx ? 'text-amber-500' : 'text-stone-600'}
                  `}>
                    {pattern.steps}
                  </span>
                </motion.button>

              </div>
            )
          })}
        </div>
      </div>

    </div>
  )
}