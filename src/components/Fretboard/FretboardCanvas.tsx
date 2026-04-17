import { useTheoryStore }   from '../../stores/useTheoryStore'
import { useUIStore }       from '../../stores/useUIStore'
import { useFretboard }     from '../../hooks/useFretboard'
import { useFretboardDraw } from './useFretboardDraw'
import { DOT_RADIUS }       from '../../hooks/useFretboard'
import { motion, AnimatePresence } from 'framer-motion'

export function FretboardCanvas() {
  const labelMode  = useTheoryStore(s => s.labelMode)
  const root       = useTheoryStore(s => s.root)
  const flipped    = useUIStore(s => s.fretboardFlipped)
  const toggleFlip = useUIStore(s => s.toggleFretboardFlip)

  const renderData = useFretboard()
  const draw       = useFretboardDraw(renderData, labelMode, root, flipped)

  return (
    // Wrapper holds the control strip AND the fretboard stacked vertically.
    // The strip is a thin horizontal bar above the fretboard that hosts
    // the flip toggle (and can host more controls later if needed).
    <div className="w-full">

      {/* Control strip — sits above the fretboard, right-aligned.
          Low height (28px) so it doesn't steal visual space from the fretboard. */}
      <div
        className="w-full flex items-center justify-end px-3 border-b"
        style={{
          height:          28,
          backgroundColor: '#0c0b0a',
          borderColor:     'var(--border)',
        }}
      >
        <button
          onClick={toggleFlip}
          title={
            flipped
              ? 'Currently playing view (low E on top). Click for standard view.'
              : 'Currently standard view (high E on top). Click for playing view.'
          }
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-md
                     text-[10px] font-mono uppercase tracking-wider
                     transition-all duration-150 hover:scale-105"
          style={{
            backgroundColor: 'rgba(26, 24, 20, 0.9)',
            border:          '1px solid rgba(255, 255, 255, 0.1)',
            color:           '#a09078',
          }}
        >
          <span style={{ fontSize: 11, lineHeight: 1 }}>
            {flipped ? '↓ low E' : '↑ high E'}
          </span>
        </button>
      </div>

      {/* Fretboard itself — unchanged from before, just no longer needs
          position: relative since the toggle is no longer overlaid on it. */}
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
      {dot.isRoot && (
        <>
          <circle cx={dot.x} cy={dot.y} r={DR + 3} fill="none"
            stroke={dot.color} strokeWidth={1} opacity={0.2} />
          <circle cx={dot.x} cy={dot.y} r={DR + 1.5} fill="none"
            stroke={dot.color} strokeWidth={1.5} opacity={0.5} />
        </>
      )}

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