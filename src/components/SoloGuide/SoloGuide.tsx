import { motion, AnimatePresence } from 'framer-motion'
import { useTheoryStore } from '../../stores/useTheoryStore'
import { useUIStore }     from '../../stores/useUIStore'
import { SOLO_GUIDES }    from '../../data/soloGuides'
import { NOTES }          from '../../data/theory'
import { StrengthMap }    from './StrengthMap'
import { getVariantColor } from '../../lib/colors'

const TIERS = [
  { key: 's1' as const, stars: '★★★', label: 'Anchor'  },
  { key: 's2' as const, stars: '★★',  label: 'Colour'  },
  { key: 's3' as const, stars: '★',   label: 'Passing' },
  { key: 'av' as const, stars: '△',   label: 'Avoid'   },
]

const TIER_VARIANT = {
  s1: 'anchor',
  s2: 'colour',
  s3: 'passing',
  av: 'avoid',
} as const

function NotePill({
  noteName,
  degree,
  variant,
}: {
  noteName: string
  degree:   string
  variant:  'anchor' | 'colour' | 'passing' | 'avoid'
}) {
  const color = getVariantColor(variant)
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md
                 text-xs font-mono font-medium transition-transform hover:scale-105"
      style={{
        backgroundColor: `${color}18`,
        color,
        border: `1px solid ${color}35`,
      }}
    >
      {noteName}
      <span className="opacity-60 text-[10px]">({degree})</span>
    </span>
  )
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

  function tierIntervals(intervals: number[]) {
    return intervals.filter(iv => scaleSet.has(iv))
  }

  return (
    <div
      className="rounded-xl overflow-hidden border"
      style={{
        backgroundColor: 'var(--card)',
        borderColor:     'var(--border-default)',
      }}
    >
      {/* Header */}
      <button
        onClick={toggleSg}
        className="w-full flex items-center gap-3 px-5 py-3.5 border-b transition-colors"
        style={{ borderColor: 'var(--border)' }}
      >
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center border shrink-0"
          style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border-default)' }}
        >
          <span style={{ fontSize: 14 }}>🎸</span>
        </div>

        <span
          className="text-[15px] font-medium flex-1 text-left"
          style={{ color: 'var(--text-primary)' }}
        >
          Solo Guide — {NOTES[root]} {pattern.name}
        </span>

        <span
          className="text-xs hidden sm:block"
          style={{ color: 'var(--text-muted)' }}
        >
          Target notes &amp; theory
        </span>

        <motion.span
          animate={{ rotate: sgOpen ? 180 : 0 }}
          transition={{ duration: 0.2, ease: 'easeInOut' }}
          className="text-xs ml-1"
          style={{ color: 'var(--text-muted)' }}
        >
          ▼
        </motion.span>
      </button>

      {/* Body */}
      <AnimatePresence initial={false}>
        {sgOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            style={{ overflow: 'hidden' }}
          >
            {/* 2-column grid: left 1/3, right 2/3 */}
            <div
              className="p-5 grid gap-8 border-t"
              style={{
                gridTemplateColumns: '1fr 2fr',
                borderColor: 'var(--border)',
              }}
            >
              {/* LEFT COLUMN */}
              <div className="flex flex-col gap-6">

                {/* Landing notes */}
                <div className="flex flex-col gap-3">
                  <span
                    className="font-mono text-[10px] tracking-[0.18em] uppercase"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    Landing Notes
                  </span>

                  {TIERS.map(({ key, stars, label }) => {
                    const notes = tierIntervals(guide[key])
                    if (notes.length === 0) return null
                    const variant = TIER_VARIANT[key]
                    const color   = getVariantColor(variant)
                    return (
                      <div key={key} className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5 w-28 shrink-0">
                          <span className="text-xs opacity-60" style={{ color }}>
                            {stars}
                          </span>
                          <span className="text-sm font-medium" style={{ color }}>
                            {label}
                          </span>
                        </div>
                        <div className="flex gap-1.5 flex-wrap">
                          {notes.map(iv => {
                            const noteName = NOTES[((root + iv) % 12 + 12) % 12]
                            const degree   = pattern.degrees[pattern.intervals.indexOf(iv)]
                            return (
                              <NotePill
                                key={iv}
                                noteName={noteName}
                                degree={degree ?? ''}
                                variant={variant}
                              />
                            )
                          })}
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Strength map */}
                <div className="flex flex-col gap-2">
                  <span
                    className="font-mono text-[10px] tracking-[0.18em] uppercase"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    Note Strength Map
                  </span>
                  <StrengthMap pattern={pattern} guide={guide} root={root} />
                </div>

              </div>

              {/* RIGHT COLUMN */}
              <div className="flex flex-col gap-5">

                <div className="flex flex-col gap-2">
                  <span
                    className="font-mono text-[10px] tracking-[0.18em] uppercase"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    Theory
                  </span>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: 'var(--text-secondary)' }}
                    dangerouslySetInnerHTML={{ __html: guide.theory }}
                  />
                </div>

                {guide.tip && (
                  <div
                    className="pl-4 py-3 pr-4 rounded-r-lg"
                    style={{
                      borderLeft:      '3px solid var(--primary)',
                      backgroundColor: 'rgba(201,168,76,0.06)',
                    }}
                  >
                    <span
                      className="font-mono text-[9px] uppercase tracking-[0.18em] block mb-1.5"
                      style={{ color: 'var(--primary)' }}
                    >
                      Pro Move
                    </span>
                    <p
                      className="text-sm leading-relaxed"
                      style={{ color: 'var(--text-secondary)' }}
                      dangerouslySetInnerHTML={{ __html: guide.tip }}
                    />
                  </div>
                )}

              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}