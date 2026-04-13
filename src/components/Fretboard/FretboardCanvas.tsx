import { useTheoryStore }   from '../../stores/useTheoryStore'
import { useFretboard }     from '../../hooks/useFretboard'
import { useFretboardDraw } from './useFretboardDraw'
import { DOT_RADIUS, MIN_FRETS, MAX_FRETS } from '../../hooks/useFretboard'
import { motion, AnimatePresence } from 'framer-motion'

export function FretboardCanvas() {
  const labelMode   = useTheoryStore(s => s.labelMode)
  const root        = useTheoryStore(s => s.root)
  const numFrets    = useTheoryStore(s => s.numFrets)
  const setNumFrets = useTheoryStore(s => s.setNumFrets)

  const renderData = useFretboard()
  const draw       = useFretboardDraw(renderData, labelMode, root)

  return (
    <div className="flex flex-col gap-3">

      {/* Fret count slider */}
      <div className="flex items-center gap-3">
        <span className="font-mono text-[10px] uppercase tracking-widest text-stone-400 shrink-0">
          Frets
        </span>
        <input
          type="range"
          min={MIN_FRETS}
          max={MAX_FRETS}
          step={1}
          value={numFrets}
          onChange={e => setNumFrets(parseInt(e.target.value))}
          className="flex-1 accent-amber-500 cursor-pointer"
        />
        <span className="font-mono text-xs text-amber-500 min-w-6 text-right">
          {numFrets}
        </span>
      </div>

      {/* Fretboard SVG */}
      <div className="bg-stone-900 border border-stone-700 rounded-xl p-4 overflow-x-auto">
        <div style={{ minWidth: 680 }}>
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
              fill="#1c1508"
              stroke="#3a2e18"
              strokeWidth={1.5}
            />

            {/* Wood grain lines */}
            {Array.from({ length: 6 }, (_, i) => (
              <line
                key={i}
                x1={draw.boardRect.x}
                y1={draw.boardRect.y + (i + 1) * (draw.boardRect.height / 7)}
                x2={draw.boardRect.x + draw.boardRect.width}
                y2={draw.boardRect.y + (i + 1) * (draw.boardRect.height / 7)}
                stroke="#221a08"
                strokeWidth={0.5}
                opacity={0.4}
              />
            ))}

            {/* Nut */}
            <rect
              x={draw.nutRect.x}
              y={draw.nutRect.y}
              width={draw.nutRect.width}
              height={draw.nutRect.height}
              fill="#e8d8b0"
              rx={2}
            />

            {/* Inlay dots */}
            {draw.inlayDots.map((dot, i) =>
              dot.double ? (
                <g key={i}>
                  <circle cx={dot.x} cy={dot.y - 26} r={3.5} fill="#2e2510" opacity={0.7} />
                  <circle cx={dot.x} cy={dot.y + 26} r={3.5} fill="#2e2510" opacity={0.7} />
                </g>
              ) : (
                <circle key={i} cx={dot.x} cy={dot.y} r={3.5} fill="#2e2510" opacity={0.7} />
              )
            )}

            {/* Fret lines */}
            {draw.fretLines.map((fret, i) => (
              <line
                key={i}
                x1={fret.x} y1={draw.boardRect.y}
                x2={fret.x} y2={draw.boardRect.y + draw.boardRect.height}
                stroke={fret.isNut ? '#c8b878' : '#5a4e38'}
                strokeWidth={fret.isNut ? 3 : 0.8}
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
                fontSize={8}
                fontFamily="DM Mono, monospace"
              >
                {lbl.label}
              </text>
            ))}

            {/* Strings + labels + dots */}
            {draw.strings.map(str => (
              <g key={str.idx}>

                {/* String line */}
                <line
                  x1={draw.boardRect.x}
                  y1={str.y}
                  x2={draw.boardRect.x + draw.boardRect.width}
                  y2={str.y}
                  stroke="#c8b878"
                  strokeWidth={str.thickness}
                  opacity={str.dimmed ? 0.1 : 0.55}
                />

                {/* String name label */}
                <text
                  x={draw.labelX}
                  y={str.y + 4}
                  textAnchor="middle"
                  fill={str.dimmed ? '#2a2820' : '#6a5c40'}
                  fontSize={9}
                  fontFamily="DM Mono, monospace"
                >
                  {str.label}
                </text>

                {/* Open string dot */}
                <AnimatePresence mode="wait">
                  {str.openDot && (
                    <Dot
                      key={`open-${str.idx}`}
                      dot={str.openDot}
                      delay={str.idx * 0.02}
                    />
                  )}
                </AnimatePresence>

                {/* Fretted dots */}
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

    </div>
  )
}

// ─── DOT ─────────────────────────────────────────────────────────────────────
// Each dot animates independently.
// initial: starts invisible and slightly small
// animate: fades in and scales to full size
// exit:    fades out quickly when scale changes
// delay:   staggers the animation so dots appear left-to-right
//
// Why use motion.circle for SVG?
// Framer Motion supports SVG elements natively — motion.circle,
// motion.rect, motion.path etc. They accept the same animate/initial/exit
// props as HTML motion elements.

interface DotProps {
  dot:   { x: number; y: number; color: string; isRoot: boolean; label: string }
  delay: number
}

function Dot({ dot, delay }: DotProps) {
  const DR = DOT_RADIUS

  return (
    <motion.g
      initial={{ opacity: 0, scale: 0.4 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.3 }}
      transition={{
        duration: 0.2,
        delay,
        ease: 'easeOut',
      }}
      style={{ transformOrigin: `${dot.x}px ${dot.y}px` }}
    >
      {/* Root note glow rings */}
      {dot.isRoot && (
        <>
          <circle
            cx={dot.x} cy={dot.y}
            r={DR + 4}
            fill="none"
            stroke={dot.color}
            strokeWidth={1}
            opacity={0.2}
          />
          <circle
            cx={dot.x} cy={dot.y}
            r={DR + 2}
            fill="none"
            stroke={dot.color}
            strokeWidth={1.5}
            opacity={0.5}
          />
        </>
      )}

      {/* Main dot */}
      <circle
        cx={dot.x} cy={dot.y}
        r={DR}
        fill={dot.color}
        opacity={dot.isRoot ? 1 : 0.82}
      />

      {/* Inner highlight */}
      <circle
        cx={dot.x - DR * 0.2}
        cy={dot.y - DR * 0.2}
        r={DR * 0.35}
        fill="white"
        opacity={0.12}
      />

      {/* Label */}
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
    </motion.g>
  )
}