// PatternList renders the scrollable list of scale/mode/chord patterns
// in the sidebar. It also renders the category tabs above the list.
//
// Notice it handles the "── Modes ──" divider logic here,
// not in the data layer. Divider rendering is a UI concern,
// not a data concern. Data should never know how it's displayed.

import { useTheoryStore } from '../../stores/useTheoryStore'
import { PATTERNS_BY_CATEGORY } from '../../data/scales'
import type { Category } from '../../types'

const CATEGORY_LABELS: Record<Category, string> = {
  scales:  'Scales',
  triads:  'Triads',
  seventh: '7ths',
  modes:   'Modes',
}

const PATTERN_SECTION_LABELS: Record<Category, string> = {
  scales:  'Scale Patterns',
  triads:  'Triads',
  seventh: '7th Chords',
  modes:   'Modes',
}

export function PatternList() {
  const category   = useTheoryStore(s => s.category)
  const patternIdx = useTheoryStore(s => s.patternIdx)
  const setCategory   = useTheoryStore(s => s.setCategory)
  const setPatternIdx = useTheoryStore(s => s.setPatternIdx)

  const patterns = PATTERNS_BY_CATEGORY[category]
  const categories = Object.keys(CATEGORY_LABELS) as Category[]

  return (
    <div className="flex flex-col gap-3">

      {/* Category tabs */}
      <div>
        <span className="block font-mono text-xs tracking-widest uppercase text-stone-500 mb-2">
          Category
        </span>
        <div className="flex gap-1 bg-stone-900 rounded-lg p-1 border border-stone-800">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`
                flex-1 py-1.5 text-xs rounded-md transition-all duration-100
                ${cat === category
                  ? 'bg-stone-700 text-stone-100 border border-stone-600'
                  : 'text-stone-500 hover:text-stone-300'
                }
              `}
            >
              {CATEGORY_LABELS[cat]}
            </button>
          ))}
        </div>
      </div>

      {/* Pattern list */}
      <div>
        <span className="block font-mono text-xs tracking-widest uppercase text-stone-500 mb-2">
          {PATTERN_SECTION_LABELS[category]}
        </span>
        <div className="flex flex-col gap-1 max-h-52 overflow-y-auto pr-1">
          {patterns.map((pattern, i) => {
            // Insert a divider before the first mode entry in the scales list
            const showDivider =
              category === 'scales' &&
              pattern.mode === true &&
              !patterns[i - 1]?.mode

            return (
              <div key={pattern.name}>
                {showDivider && (
                  <div className="font-mono text-xs text-stone-600 py-1.5 px-2 tracking-widest">
                    ── Modes ──
                  </div>
                )}
                <button
                  onClick={() => setPatternIdx(i)}
                  className={`
                    w-full text-left px-3 py-2 rounded-md text-sm
                    flex justify-between items-center gap-2
                    transition-all duration-100
                    ${i === patternIdx
                      ? 'bg-stone-700 border border-amber-600 text-stone-100'
                      : 'bg-stone-800 border border-stone-700 text-stone-400 hover:border-stone-500 hover:text-stone-200'
                    }
                  `}
                >
                  <span>{pattern.name}</span>
                  <span className={`font-mono text-xs whitespace-nowrap ${i === patternIdx ? 'text-amber-500' : 'text-stone-600'}`}>
                    {pattern.steps}
                  </span>
                </button>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}