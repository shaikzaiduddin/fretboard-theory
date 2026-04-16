import { NOTES } from '../../data/theory'
import type { SoloGuide, ScalePattern } from '../../types'

interface StrengthMapProps {
  pattern: ScalePattern
  guide:   SoloGuide
  root:    number
}

function getStrengthPercent(interval: number, guide: SoloGuide): number {
  if (guide.s1.includes(interval)) return 100
  if (guide.s2.includes(interval)) return 75
  if (guide.s3.includes(interval)) return 50
  if (guide.av.includes(interval)) return 15
  return 35
}

function getBarColor(interval: number, guide: SoloGuide): string {
  if (guide.s1.includes(interval)) return '#e8b931'
  if (guide.s2.includes(interval)) return '#4ade80'
  if (guide.s3.includes(interval)) return '#64b5f6'
  if (guide.av.includes(interval)) return '#f87171'
  return '#5a7a8a'
}

export function StrengthMap({ pattern, guide, root }: StrengthMapProps) {
  return (
    <div className="flex items-end gap-2" style={{ height: 80 }}>
      {pattern.intervals.map((interval, idx) => {
        const percent  = getStrengthPercent(interval, guide)
        const color    = getBarColor(interval, guide)
        const noteName = NOTES[((root + interval) % 12 + 12) % 12]
        const degree   = pattern.degrees[idx]
        return (
          <div
            key={idx}
            className="flex flex-col items-center gap-1 flex-1"
            style={{ minWidth: 0 }}
          >
            <div
              className="w-full flex items-end"
              style={{
                height:          56,
                backgroundColor: '#12100e',
                border:          '1px solid rgba(255,255,255,0.05)',
                borderBottom:    'none',
                borderRadius:    '2px 2px 0 0',
              }}
            >
              <div
                className="w-full transition-all duration-500"
                style={{
                  height:       `${percent}%`,
                  background:   `linear-gradient(180deg, ${color} 0%, ${color}80 100%)`,
                  boxShadow:    `0 0 8px ${color}30`,
                  borderRadius: '2px 2px 0 0',
                }}
              />
            </div>
            <span
              className="font-mono font-bold"
              style={{ fontSize: 10, color }}
            >
              {noteName}
            </span>
            <span
              className="font-mono"
              style={{ fontSize: 9, color: 'var(--text-muted)' }}
            >
              {degree}
            </span>
          </div>
        )
      })}
    </div>
  )
}