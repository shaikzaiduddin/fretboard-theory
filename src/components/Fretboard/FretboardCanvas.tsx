// FretboardCanvas renders the guitar fretboard as SVG.
//
// Why SVG and not HTML divs?
// SVG is designed for this — precise coordinate-based drawing,
// scalable at any resolution, accessible via ARIA attributes.
// HTML divs with absolute positioning would be fragile and imprecise.
//
// Why not Canvas (HTML5)?
// Canvas is faster for thousands of elements and animations.
// We'll migrate to PixiJS (WebGL) in Phase 2 for animation support.
// SVG is the right starting point — readable, debuggable, correct.
//
// The component itself has almost no logic — all the maths
// lives in useFretboardDraw. This component just maps
// data arrays to SVG elements. That's its only job.

import { useTheoryStore }    from '../../stores/useTheoryStore'
import { useFretboard }      from '../../hooks/useFretboard'
import { useFretboardDraw }  from './useFretboardDraw'
import { NOTES }             from '../../data/theory'
import { DOT_RADIUS as DR }  from '../../hooks/useFretboard'

export function FretboardCanvas() {
  const labelMode = useTheoryStore(s => s.labelMode)
  const root      = useTheoryStore(s => s.root)

  // Get computed note positions from the data hook
  const renderData = useFretboard()

  // Get computed SVG drawing data from the draw hook
  const draw = useFretboardDraw(renderData, labelMode, NOTES, root)

  return (
    <div className="bg-stone-900 border border-stone-700 rounded-xl p-4 overflow-x-auto">
      <div style={{ minWidth: 700 }}>
        <svg
          viewBox={draw.viewBox}
          width="100%"
          style={{ display: 'block' }}
          aria-label="Guitar fretboard"
          role="img"
        >
          {/* Fretboard body */}
          <rect
            x={draw.boardRect.x}
            y={draw.boardRect.y}
            width={draw.boardRect.width}
            height={draw.boardRect.height}
            rx={4}
            fill="#1e1710"
            stroke="#3a2e18"
            strokeWidth={1.5}
          />

          {/* Nut */}
          <rect
            x={draw.nutRect.x}
            y={draw.nutRect.y}
            width={draw.nutRect.width}
            height={draw.nutRect.height}
            fill="#d4c4a0"
            rx={2}
          />

          {/* Inlay dots */}
          {draw.inlayDots.map((dot, i) => (
            dot.double ? (
              <g key={i}>
                <circle cx={dot.x} cy={dot.y - 28} r={4} fill="#3a3020" opacity={0.8} />
                <circle cx={dot.x} cy={dot.y + 28} r={4} fill="#3a3020" opacity={0.8} />
              </g>
            ) : (
              <circle key={i} cx={dot.x} cy={dot.y} r={4} fill="#3a3020" opacity={0.8} />
            )
          ))}

          {/* Fret lines */}
          {draw.fretLines.map((fret, i) => (
            <line
              key={i}
              x1={fret.x} y1={draw.boardRect.y}
              x2={fret.x} y2={draw.boardRect.y + draw.boardRect.height}
              stroke={fret.isNut ? '#b8a870' : '#4a3e28'}
              strokeWidth={fret.isNut ? 2 : 1}
            />
          ))}

          {/* Fret number labels */}
          {draw.fretLabels.map((lbl, i) => (
            <text
              key={i}
              x={lbl.x}
              y={draw.boardRect.y + draw.boardRect.height + 16}
              textAnchor="middle"
              fill="#4a4030"
              fontSize={8.5}
              fontFamily="DM Mono, monospace"
            >
              {lbl.label}
            </text>
          ))}

          {/* Strings + dots */}
          {draw.strings.map(str => (
            <g key={str.idx}>
              {/* String line */}
              <line
                x1={draw.boardRect.x}
                y1={str.y}
                x2={draw.boardRect.x + draw.boardRect.width}
                y2={str.y}
                stroke="#b8a87a"
                strokeWidth={str.thickness}
                opacity={str.dimmed ? 0.14 : 0.62}
              />

              {/* String name label */}
              <text
                x={draw.boardRect.x - 10}
                y={str.y + 4}
                textAnchor="middle"
                fill={str.dimmed ? '#2a2820' : '#504838'}
                fontSize={8.5}
                fontFamily="DM Mono, monospace"
              >
                {str.label}
              </text>

              {/* Open string dot */}
              {str.openDot && <Dot dot={str.openDot} />}

              {/* Fretted dots */}
              {str.dots.map((dot, i) => (
                <Dot key={i} dot={dot} />
              ))}
            </g>
          ))}
        </svg>
      </div>
    </div>
  )
}

// ─── DOT SUB-COMPONENT ────────────────────────────────────────────────────────
// Extracted as a named function to keep the main JSX readable.
// This renders one note dot — circle, optional root ring, optional label.

interface DotProps {
  dot: { x: number; y: number; color: string; isRoot: boolean; label: string }
}

function Dot({ dot }: DotProps) {
  return (
    <g>
      {/* Root note gets an outer ring */}
      {dot.isRoot && (
        <circle
          cx={dot.x} cy={dot.y}
          r={DR + 3}
          fill="none"
          stroke={dot.color}
          strokeWidth={1.5}
          opacity={0.45}
        />
      )}

      {/* Main dot */}
      <circle
        cx={dot.x} cy={dot.y}
        r={DR}
        fill={dot.color}
        opacity={dot.isRoot ? 1 : 0.88}
      />

      {/* Label text */}
      {dot.label && (
        <text
          x={dot.x}
          y={dot.y + 3.5}
          textAnchor="middle"
          fill={dot.isRoot ? '#1a1410' : '#0f0e0c'}
          fontSize={dot.label.length > 2 ? 7 : 9}
          fontWeight={500}
          fontFamily="DM Mono, monospace"
        >
          {dot.label}
        </text>
      )}
    </g>
  )
}