// InfoBar shows two things:
//   1. The current selection name e.g. "A Dorian"
//   2. A pill for each note in the scale, colour-coded by interval role
//
// It reads entirely from the store — no props needed.
// When root or pattern changes anywhere in the app,
// this component automatically updates.

import type { CSSProperties } from 'react'
import { useTheoryStore } from '../stores/useTheoryStore'
import { NOTES, ROLE_COLORS } from '../data/theory'

// Interval → pill colour class mapping
// We use inline styles for the dot colour since it comes
// from ROLE_COLORS data, not a fixed Tailwind class
function getPillStyle(interval: number): CSSProperties {
  const color = ROLE_COLORS[interval] ?? '#5a9ecc'
  return {
    backgroundColor: color + '22', // 22 = ~13% opacity in hex
    borderColor: color,
    color: color,
  }
}

export function InfoBar() {
  const root    = useTheoryStore(s => s.root)
  const pattern = useTheoryStore(s => s.getCurrentPattern())

  const rootName   = NOTES[root]
  const scaleName  = `${rootName} ${pattern.name}`

  return (
    <div className="flex items-center gap-3 flex-wrap">

      {/* Scale name */}
      <h2 className="font-serif text-xl text-amber-300 shrink-0">
        {scaleName}
      </h2>

      {/* Note pills */}
      <div className="flex gap-1.5 flex-wrap">
        {pattern.intervals.map((interval, idx) => {
          const noteName = NOTES[((root + interval) % 12 + 12) % 12]
          const degree   = pattern.degrees[idx]

          return (
            <div
              key={idx}
              style={getPillStyle(interval)}
              className="flex flex-col items-center px-2.5 py-0.5 rounded-full border font-mono text-xs leading-tight"
            >
              <span className="font-medium">{noteName}</span>
              <span className="text-[9px] opacity-70">{degree}</span>
            </div>
          )
        })}
      </div>

    </div>
  )
}