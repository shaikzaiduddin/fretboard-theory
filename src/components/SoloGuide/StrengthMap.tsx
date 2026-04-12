// StrengthMap renders a bar chart showing how strong each
// scale degree is as a landing note for improvisation.
//
// Strength levels:
//   5 bars = anchor (s1)   — always safe to land
//   4 bars = colour (s2)   — adds character
//   3 bars = passing (s3)  — use in motion
//   2 bars = neutral       — no specific guidance
//   1 bar  = avoid (av)    — clashes with chord

import { NOTES } from '../../data/theory'
import type { SoloGuide } from '../../types'
import type { ScalePattern } from '../../types'

interface StrengthMapProps {
  pattern: ScalePattern
  guide:   SoloGuide
  root:    number
}

function getStrength(interval: number, guide: SoloGuide): number {
  if (guide.s1.includes(interval)) return 5
  if (guide.s2.includes(interval)) return 4
  if (guide.s3.includes(interval)) return 3
  if (guide.av.includes(interval)) return 1
  return 2
}

function getBarColor(interval: number, guide: SoloGuide): string {
  if (guide.s1.includes(interval)) return '#c9a84c'  // gold   — anchor
  if (guide.s2.includes(interval)) return '#7dc87a'  // green  — colour
  if (guide.av.includes(interval)) return '#cc7a7a'  // red    — avoid
  return '#5a9ecc'                                    // blue   — neutral/passing
}

export function StrengthMap({ pattern, guide, root }: StrengthMapProps) {
  return (
    <div>
      <span className="block font-mono text-xs tracking-widest uppercase text-stone-500 mb-3">
        Note Strength Map
      </span>
      <div className="flex gap-2 flex-wrap items-end">
        {pattern.intervals.map((interval, idx) => {
          const strength  = getStrength(interval, guide)
          const barColor  = getBarColor(interval, guide)
          const noteName  = NOTES[((root + interval) % 12 + 12) % 12]
          const degree    = pattern.degrees[idx]

          return (
            <div key={idx} className="flex flex-col items-center gap-1">

              {/* Bars — rendered top to bottom, filled from bottom */}
              <div className="flex flex-col gap-0.5 justify-end" style={{ height: 30 }}>
                {Array.from({ length: 5 }, (_, b) => (
                  <div
                    key={b}
                    className="w-6 rounded-sm"
                    style={{
                      height: 4,
                      // Fill bars from bottom: bar index 4 = bottom
                      // A strength of 3 fills bars 4, 3, 2 (bottom 3)
                      background: (4 - b) < strength ? barColor : '#2e2a20',
                    }}
                  />
                ))}
              </div>

              {/* Note name */}
              <span className="font-mono text-xs text-stone-300">
                {noteName}
              </span>

              {/* Degree */}
              <span
                className="font-mono text-[9px]"
                style={{ color: barColor }}
              >
                {degree}
              </span>

            </div>
          )
        })}
      </div>
    </div>
  )
}