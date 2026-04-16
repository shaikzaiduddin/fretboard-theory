import { useMemo } from 'react'
import { ROLE_COLORS, NOTES } from '../../data/theory'
import { FRET_DOTS } from '../../hooks/useFretboard'
import type { IntervalMapValue, FretboardRenderData } from '../../hooks/useFretboard'

const FB_LEFT   = 46
const FB_TOP    = 14
const FB_WIDTH  = 800
const FB_HEIGHT = 100

function getFretWidth(numFrets: number): number {
  return (FB_WIDTH - FB_LEFT) / numFrets
}

function getStringGap(stringCount: number): number {
  return stringCount > 1 ? FB_HEIGHT / (stringCount - 1) : FB_HEIGHT
}

function getStringY(stringIdx: number, stringCount: number): number {
  return stringCount === 1
    ? FB_TOP + FB_HEIGHT / 2
    : FB_TOP + stringIdx * getStringGap(stringCount)
}

export interface StringRenderData {
  idx:       number
  y:         number
  thickness: number
  dimmed:    boolean
  label:     string
  openDot:   DotRenderData | null
  dots:      DotRenderData[]
}

export interface DotRenderData {
  x:           number
  y:           number
  color:       string
  isRoot:      boolean
  isChordRoot: boolean
  label:       string
}

export interface FretboardDrawData {
  viewBox:    string
  strings:    StringRenderData[]
  fretLines:  { x: number; isNut: boolean }[]
  fretLabels: { x: number; label: string }[]
  inlayDots:  { x: number; y: number; double: boolean }[]
  boardRect:  { x: number; y: number; width: number; height: number }
  nutRect:    { x: number; y: number; width: number; height: number }
  labelX:     number
}

export function useFretboardDraw(
  renderData: FretboardRenderData,
  labelMode:  'note' | 'interval' | 'none',
  root:       number,
): FretboardDrawData {
  const { noteSet, intervalMap, dimmedStrings, stringCount, tuning, numFrets } = renderData

  return useMemo(() => {
    const fretW       = getFretWidth(numFrets)
    const totalHeight = FB_TOP + FB_HEIGHT + 26
    const boardWidth  = FB_WIDTH - FB_LEFT
    const labelX      = FB_LEFT - 10
    const openDotX    = FB_LEFT - 26

    const fretLines = Array.from({ length: numFrets + 1 }, (_, f) => ({
      x:     FB_LEFT + f * fretW,
      isNut: f === 0,
    }))

    const fretLabels = Array.from({ length: numFrets }, (_, f) => ({
      x:     FB_LEFT + (f + 0.5) * fretW,
      label: String(f + 1),
    }))

    const inlayDots = FRET_DOTS
      .filter(f => f <= numFrets)
      .map(f => ({
        x:      FB_LEFT + (f - 0.5) * fretW,
        y:      FB_TOP + FB_HEIGHT / 2,
        double: f === 12 || f === 24,
      }))

    const strings: StringRenderData[] = Array.from(
      { length: stringCount },
      (_, s) => {
        const y            = getStringY(s, stringCount)
        const dimmed       = dimmedStrings.has(s)
        const thickness    = 0.5 + (stringCount - 1 - s) * (1.4 / Math.max(stringCount - 1, 1))
        const openSemitone = ((tuning[s] % 12) + 12) % 12
        const label        = NOTES[openSemitone]

        let openDot: DotRenderData | null = null
        if (!dimmed && noteSet.has(openSemitone)) {
          openDot = buildDot(openDotX, y, intervalMap[openSemitone], labelMode, root)
        }

        const dots: DotRenderData[] = []
        if (!dimmed) {
          for (let f = 1; f <= numFrets; f++) {
            const noteSemitone = ((tuning[s] + f) % 12 + 12) % 12
            if (noteSet.has(noteSemitone)) {
              dots.push(buildDot(
                FB_LEFT + (f - 0.5) * fretW, y,
                intervalMap[noteSemitone],
                labelMode, root
              ))
            }
          }
        }

        return { idx: s, y, thickness, dimmed, label, openDot, dots }
      }
    )

    return {
      viewBox:   `0 0 ${FB_WIDTH + 20} ${totalHeight}`,
      strings,
      fretLines,
      fretLabels,
      inlayDots,
      boardRect: { x: FB_LEFT, y: FB_TOP, width: boardWidth, height: FB_HEIGHT },
      nutRect:   { x: FB_LEFT, y: FB_TOP - 3, width: 7, height: FB_HEIGHT + 6 },
      labelX,
    }
  }, [noteSet, intervalMap, dimmedStrings, stringCount, tuning, labelMode, root, numFrets])
}

function buildDot(
  x:         number,
  y:         number,
  info:      IntervalMapValue | undefined,
  labelMode: 'note' | 'interval' | 'none',
  root:      number,
): DotRenderData {
  const interval    = info?.interval ?? 0
  const color       = info?.colorOverride ?? ROLE_COLORS[interval] ?? '#5a9ecc'
  const isRoot      = interval === 0
  const isChordRoot = info?.isChordRoot ?? false

  let label = ''
  if (labelMode === 'note') {
    label = NOTES[((root + interval) % 12 + 12) % 12]
  } else if (labelMode === 'interval') {
    label = info?.degree ?? ''
  }

  return { x, y, color, isRoot, isChordRoot, label }
}