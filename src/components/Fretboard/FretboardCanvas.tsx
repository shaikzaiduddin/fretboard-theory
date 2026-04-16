import { useTheoryStore }   from '../../stores/useTheoryStore'
import { useFretboard }     from '../../hooks/useFretboard'
import { useFretboardDraw } from './useFretboardDraw'
import { DOT_RADIUS }       from '../../hooks/useFretboard'
import { motion, AnimatePresence } from 'framer-motion'

export function FretboardCanvas() {
  const labelMode  = useTheoryStore(s => s.labelMode)
  const root       = useTheoryStore(s => s.root)
  const renderData = useFretboard()
  const draw       = useFretboardDraw(renderData, labelMode, root)

  return (
    <div
      className="w-full overflow-hidden"
      style={{ maxHeight: 300, backgroundColor: '#1c1508' }}
    >
      <svg
        viewBox={draw.viewBox}
        width="100%"
        style={{ display: 'block' }}
        aria-label="Guitar fretboard"
        role="img"
      >
        <rect
          x={draw.boardRect.x} y={draw.boardRect.y}
          width={draw.boardRect.width} height={draw.boardRect.height}
          rx={4} fill="#1c1508" stroke="#3a2e18" strokeWidth={1.5}
        />

        {Array.from({ length: 6 }, (_, i) => (
          <line
            key={i}
            x1={draw.boardRect.x}
            y1={draw.boardRect.y + (i + 1) * (draw.boardRect.height / 7)}
            x2={draw.boardRect.x + draw.boardRect.width}
            y2={draw.boardRect.y + (i + 1) * (draw.boardRect.height / 7)}
            stroke="#221a08" strokeWidth={0.5} opacity={0.4}
          />
        ))}

        <rect
          x={draw.nutRect.x} y={draw.nutRect.y}
          width={draw.nutRect.width} height={draw.nutRect.height}
          fill="#e8d8b0" rx={2}
        />

        {draw.inlayDots.map((dot, i) =>
          dot.double ? (
            <g key={i}>
              <circle cx={dot.x} cy={dot.y - 20} r={3} fill="#2e2510" opacity={0.7} />
              <circle cx={dot.x} cy={dot.y + 20} r={3} fill="#2e2510" opacity={0.7} />
            </g>
          ) : (
            <circle key={i} cx={dot.x} cy={dot.y} r={3} fill="#2e2510" opacity={0.7} />
          )
        )}

        {draw.fretLines.map((fret, i) => (
          <line
            key={i}
            x1={fret.x} y1={draw.boardRect.y}
            x2={fret.x} y2={draw.boardRect.y + draw.boardRect.height}
            stroke={fret.isNut ? '#c8b878' : '#5a4e38'}
            strokeWidth={fret.isNut ? 3 : 0.8}
          />
        ))}

        {draw.fretLabels.map((lbl, i) => (
          <text
            key={i}
            x={lbl.x}
            y={draw.boardRect.y + draw.boardRect.height + 14}
            textAnchor="middle" fill="#4a4030"
            fontSize={7} fontFamily="DM Mono, monospace"
          >
            {lbl.label}
          </text>
        ))}

        {draw.strings.map(str => (
          <g key={str.idx}>
            <line
              x1={draw.boardRect.x} y1={str.y}
              x2={draw.boardRect.x + draw.boardRect.width} y2={str.y}
              stroke="#c8b878" strokeWidth={str.thickness}
              opacity={str.dimmed ? 0.1 : 0.55}
            />
            <text
              x={draw.labelX} y={str.y + 3}
              textAnchor="middle"
              fill={str.dimmed ? '#2a2820' : '#6a5c40'}
              fontSize={8} fontFamily="DM Mono, monospace"
            >
              {str.label}
            </text>

            <AnimatePresence mode="wait">
              {str.openDot && (
                <Dot key={`open-${str.idx}`} dot={str.openDot} delay={str.idx * 0.02} />
              )}
            </AnimatePresence>

            <AnimatePresence mode="wait">
              {str.dots.map((dot, i) => (
                <Dot
                  key={`${str.idx}-${i}-${dot.x}`}
                  dot={dot}
                  delay={i * 0.015 + str.idx * 0.02}
                />
              ))}
            </AnimatePresence>
          </g>
        ))}
      </svg>
    </div>
  )
}

interface DotProps {
  dot:   { x: number; y: number; color: string; isRoot: boolean; isChordRoot: boolean; label: string }
  delay: number
}

function Dot({ dot, delay }: DotProps) {
  const DR = DOT_RADIUS

  return (
    <motion.g
      initial={{ opacity: 0, scale: 0.4 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.3 }}
      transition={{ duration: 0.2, delay, ease: 'easeOut' }}
      style={{ transformOrigin: `${dot.x}px ${dot.y}px` }}
    >
      {/* Key tonic: large double glow ring */}
      {dot.isRoot && (
        <>
          <circle cx={dot.x} cy={dot.y} r={DR + 3} fill="none"
            stroke={dot.color} strokeWidth={1} opacity={0.2} />
          <circle cx={dot.x} cy={dot.y} r={DR + 1.5} fill="none"
            stroke={dot.color} strokeWidth={1.5} opacity={0.5} />
        </>
      )}

      {/* Diatonic chord root (non-tonic): single glow ring.
          In diatonic mode, all 7 notes are chord roots, so all get
          a glow. This makes the color-coding immediately readable. */}
      {!dot.isRoot && dot.isChordRoot && (
        <circle cx={dot.x} cy={dot.y} r={DR + 1.5} fill="none"
          stroke={dot.color} strokeWidth={1} opacity={0.4} />
      )}

      <circle
        cx={dot.x} cy={dot.y} r={DR}
        fill={dot.color}
        opacity={dot.isRoot ? 1 : dot.isChordRoot ? 0.92 : 0.82}
      />

      <circle
        cx={dot.x - DR * 0.2} cy={dot.y - DR * 0.2}
        r={DR * 0.35} fill="white" opacity={0.15}
      />

      {dot.label && (
        <text
          x={dot.x} y={dot.y + 3}
          textAnchor="middle"
          fill={dot.isRoot ? '#1a1410' : '#0f0e0c'}
          fontSize={dot.label.length > 2 ? 6 : 8}
          fontWeight={500}
          fontFamily="DM Mono, monospace"
        >
          {dot.label}
        </text>
      )}
    </motion.g>
  )
}