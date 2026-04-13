// SoloGuide is a collapsible panel showing improvisation guidance.
//
// Animation approach: AnimatePresence + motion.div for the body.
// Why? The panel body mounts/unmounts when toggled. CSS transitions
// can't animate elements being removed from the DOM — AnimatePresence
// holds the element in the DOM long enough for the exit animation
// to complete before React unmounts it.
//
// height: 0 → 'auto' is the classic "accordion" animation.
// Framer Motion handles this natively — CSS cannot because 'auto'
// is not a numeric value CSS can interpolate between.

import { motion, AnimatePresence } from 'framer-motion'
import { useTheoryStore } from '../../stores/useTheoryStore'
import { useUIStore }     from '../../stores/useUIStore'
import { SOLO_GUIDES }    from '../../data/soloGuides'
import { NOTES }          from '../../data/theory'
import { StrengthMap }    from './StrengthMap'

const TIER_STYLES = {
  s1: 'bg-amber-500 border-amber-500 text-stone-900 font-medium',
  s2: 'bg-emerald-900 border-emerald-600 text-emerald-300',
  s3: 'bg-blue-900 border-blue-700 text-blue-300',
  av: 'bg-red-900 border-red-700 text-red-300',
}

const TIER_LABELS = {
  s1: '★★★ Anchor',
  s2: '★★ Colour',
  s3: '★ Passing',
  av: '⚠ Avoid',
}

export function SoloGuide() {
  const category = useTheoryStore(s => s.category)
  const root     = useTheoryStore(s => s.root)
  const pattern  = useTheoryStore(s => s.getCurrentPattern())
  const sgOpen   = useUIStore(s => s.soloGuideOpen)
  const toggleSg = useUIStore(s => s.toggleSoloGuide)

  if (category !== 'scales' && category !== 'modes') return null

  const guideName = pattern.name.replace(/ \(Mode [IVX]+\)/, '').trim()
  const guide     = SOLO_GUIDES[guideName] ?? SOLO_GUIDES[pattern.name]

  if (!guide) return null

  const scaleSet = new Set(pattern.intervals)

  function tierNotes(intervals: number[]) {
    return intervals.filter(iv => scaleSet.has(iv))
  }

  function notePill(interval: number, tierKey: keyof typeof TIER_STYLES) {
    const noteName = NOTES[((root + interval) % 12 + 12) % 12]
    const degree   = pattern.degrees[pattern.intervals.indexOf(interval)]
    return (
      <span
        key={interval}
        className={`font-mono text-xs px-2.5 py-0.5 rounded-full border ${TIER_STYLES[tierKey]}`}
      >
        {noteName} {degree ? `(${degree})` : ''}
      </span>
    )
  }

  return (
    <div className="bg-stone-900 border border-stone-700 rounded-xl overflow-hidden">

      {/* Header — always visible */}
      <button
        onClick={toggleSg}
        className="w-full flex items-center gap-3 px-4 py-3 border-b border-stone-800 hover:bg-stone-800 transition-colors"
      >
        <span className="text-sm font-medium text-stone-200 flex-1 text-left">
          🎸 Solo Guide — {NOTES[root]} {pattern.name}
        </span>
        <span className="text-stone-500 text-xs font-mono">
          Target notes &amp; theory
        </span>

        {/* Chevron rotates when open — communicates state visually */}
        <motion.span
          animate={{ rotate: sgOpen ? 180 : 0 }}
          transition={{ duration: 0.2, ease: 'easeInOut' }}
          className="text-stone-500 text-xs"
        >
          ▼
        </motion.span>
      </button>

      {/* Body — animates open and closed */}
      <AnimatePresence initial={false}>
        {sgOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            style={{ overflow: 'hidden' }}
          >
            <div className="p-4 flex flex-col gap-5">

              {/* Landing notes by tier */}
              <div className="flex flex-col gap-2">
                <span className="font-mono text-xs tracking-widest uppercase text-amber-600">
                  Landing Notes — Strongest First
                </span>
                {(
                  [
                    ['s1', guide.s1],
                    ['s2', guide.s2],
                    ['s3', guide.s3],
                    ['av', guide.av],
                  ] as const
                ).map(([tierKey, intervals]) => {
                  const notes = tierNotes(intervals)
                  if (notes.length === 0) return null
                  return (
                    <div key={tierKey} className="flex items-start gap-3">
                      <span className="font-mono text-xs text-stone-500 min-w-24 pt-0.5">
                        {TIER_LABELS[tierKey]}
                      </span>
                      <div className="flex gap-1.5 flex-wrap">
                        {notes.map(iv => notePill(iv, tierKey))}
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Strength bar chart */}
              <StrengthMap pattern={pattern} guide={guide} root={root} />

              {/* Theory explanation */}
              <div className="flex flex-col gap-2">
                <span className="font-mono text-xs tracking-widest uppercase text-amber-600">
                  Theory
                </span>
                <p
                  className="text-sm text-stone-400 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: guide.theory }}
                />
              </div>

              {/* Pro tip */}
              {guide.tip && (
                <div className="border-l-2 border-amber-600 pl-3 bg-stone-800 rounded-r-lg py-2 pr-3">
                  <p
                    className="text-sm text-stone-400 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: guide.tip }}
                  />
                </div>
              )}

            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  )
}